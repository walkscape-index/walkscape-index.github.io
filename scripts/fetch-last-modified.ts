import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ToolsConfig } from "../src/types/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsPath = path.join(__dirname, "../src/data/tools.json");
const outputPath = path.join(__dirname, "../src/data/last_modified.json");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

async function main() {
  console.log(
    "🔄 Starting Google Docs/Sheets Last Modified synchronization...",
  );

  if (!fs.existsSync(toolsPath)) {
    console.error(`❌ tools.json not found at ${toolsPath}`);
    process.exit(1);
  }

  const rawTools = fs.readFileSync(toolsPath, "utf-8");
  let config: ToolsConfig;
  try {
    config = JSON.parse(rawTools);
  } catch (err: any) {
    console.error(`❌ Failed to parse tools.json: ${err.message}`);
    process.exit(1);
  }

  // 1. Gather all Google Docs/Sheets URLs
  const googleDocsRegex =
    /docs\.google\.com\/(?:spreadsheets|document)\/d\/([a-zA-Z0-9-_]+)/;
  const urls: string[] = [];

  config.tools.forEach((cat) => {
    cat.content.forEach((tool) => {
      if (tool.url && googleDocsRegex.test(tool.url)) {
        urls.push(tool.url);
      }
      if (tool.links) {
        tool.links.forEach((link) => {
          if (link.url && googleDocsRegex.test(link.url)) {
            urls.push(link.url);
          }
        });
      }
    });
  });

  const uniqueUrls = Array.from(new Set(urls));
  console.log(
    `📋 Found ${uniqueUrls.length} unique Google Docs/Sheets URLs to check.`,
  );

  // 2. Gracefully handle missing API key
  if (!GOOGLE_API_KEY) {
    console.warn(
      "⚠️ GOOGLE_API_KEY environment variable is not set. Skipping API requests.",
    );

    // Write placeholder metadata if last_modified.json does not exist
    if (!fs.existsSync(outputPath)) {
      const defaultJSON = {
        _metadata: {
          lastAttempt: new Date().toISOString(),
          lastSuccessfulUpdate: new Date().toISOString(),
        },
        data: {},
      };
      fs.writeFileSync(outputPath, JSON.stringify(defaultJSON, null, 2));
      console.log(`✅ Created default placeholder last_modified.json`);
    }
    process.exit(0);
  }

  // 3. Load existing last_modified.json to compare and merge
  let lastModifiedMap: any = { _metadata: {}, data: {} };
  if (fs.existsSync(outputPath)) {
    try {
      lastModifiedMap = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    } catch (err) {
      console.warn(
        "⚠️ Failed to parse existing last_modified.json, overwriting:",
        err,
      );
    }
  }

  const existingData = lastModifiedMap.data || {};
  const results: Record<string, string> = {};

  // 4. Query Drive API in throttled batches of 10
  const batchSize = 10;
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    console.log(
      `📦 Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} files)...`,
    );

    await Promise.all(
      batch.map(async (url) => {
        const match = url.match(googleDocsRegex);
        if (!match) return;
        const fileId = match[1];
        try {
          const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?fields=modifiedTime&key=${GOOGLE_API_KEY}`,
            {
              headers: {
                Referer: "https://walkscape-index.github.io/",
              },
            },
          );
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const resBody = (await response.json()) as { modifiedTime?: string };
          if (resBody.modifiedTime) {
            results[url] = resBody.modifiedTime;
            console.log(`  ✅ Fetched: ${url} -> ${resBody.modifiedTime}`);
          } else {
            console.warn(`  ⚠️ No modifiedTime found for ${url}`);
          }
        } catch (err: any) {
          console.error(`  ❌ Error fetching ${url}: ${err.message}`);
        }
      }),
    );

    if (i + batchSize < uniqueUrls.length) {
      console.log(
        "⏱️ Throttling: Waiting 1 second before processing next batch...",
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // 5. Merge and determine if dates changed
  const mergedData = { ...existingData, ...results };
  let hasChanges = false;

  Object.keys(mergedData).forEach((key) => {
    if (mergedData[key] !== existingData[key]) {
      hasChanges = true;
    }
  });

  const nowStr = new Date().toISOString();
  const newMetadata = {
    lastAttempt: nowStr,
    lastSuccessfulUpdate: hasChanges
      ? nowStr
      : lastModifiedMap._metadata?.lastSuccessfulUpdate || nowStr,
  };

  // Sort keys for a clean git diff
  const sortedData: Record<string, string> = {};
  Object.keys(mergedData)
    .sort()
    .forEach((key) => {
      sortedData[key] = mergedData[key];
    });

  const outputJSON = {
    _metadata: newMetadata,
    data: sortedData,
  };

  try {
    fs.writeFileSync(outputPath, JSON.stringify(outputJSON, null, 2));
    console.log("🎉 Successfully updated last_modified.json");
    if (hasChanges) {
      console.log(
        `📝 Detected updates to last modified dates since last sync.`,
      );
    } else {
      console.log(`ℹ️ No changes detected in file modification dates.`);
    }
  } catch (err: any) {
    console.error(`❌ Failed to write last_modified.json: ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Critical error during synchronization:", err);
  process.exit(1);
});
