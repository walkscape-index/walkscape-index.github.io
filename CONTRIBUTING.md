# Contributing to Walkscape Index

Thank you for your interest in contributing to the Walkscape Index! This repository is a community-driven directory of tools, calculators, wikis, and databases for Walkscape.

To maintain the quality of the index, we enforce strict formatting, type checking, and automated build checks. Please read the guidelines below to get started.

---

## Quick Start Guide

This project is built using [Astro](https://astro.build/). We use **pnpm** (v9+) as the package manager and **Bun** to run background TypeScript data scripts.

### 1. Prerequisites

Make sure you have both [Node.js (v22+)](https://nodejs.org/), [pnpm](https://pnpm.io/), and [Bun](https://bun.sh/) installed:

- **pnpm**: `npm install -g pnpm`
- **Bun**:
  - macOS/Linux: `curl -fsSL https://bun.sh/install | bash`
  - Windows: `powershell -c "irm bun.sh/install.ps1 | iex"`

### 2. Local Setup

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/walkscape-index/walkscape-index.git
cd walkscape-index

# Install dependencies using pnpm
pnpm install
```

### 3. Development Commands

Run these commands during local development:

```bash
# Start the local development server (runs data-prep scripts with Bun first)
pnpm run dev

# Format code and JSON files using Prettier
pnpm exec prettier --write .

# Run TypeScript & Astro diagnostics
pnpm run astro check

# Build the static site locally
pnpm run build

# Run unit tests using Vitest
pnpm run test:run
```

---

## How to Add a Tool or Database

All listings in the directory are stored in a structured JSON file at `src/data/tools.json`.

To add a new tool or resource:

1. Open [src/data/tools.json](file:///c:/Users/Ankit/Documents/Development/walkscape-index/src/data/tools.json).
2. Locate the appropriate category array (e.g., `"Tools"`, `"Databases & Wikis"`, or `"Spreadsheets"`).
3. Append a new object inside the `"content"` array of that category using this schema:

```json
{
  "title": "My Awesome Walkscape Tool",
  "body": "A brief, clear description of what the tool does and how it helps players.",
  "tags": ["Calculator", "Cooking"],
  "url": "https://example.com/my-tool",
  "date-added": "2026-05-22",
  "slug": "my-awesome-walkscape-tool",
  "author": "YourGitHubUsername",
  "github_url": "https://github.com/username/my-tool",
  "open_source": true,
  "links": [
    {
      "title": "Discord Support",
      "url": "https://discord.gg/yourserver",
      "icon": "discord"
    }
  ]
}
```

### Schema Requirements:

- `title`: The display name of the tool.
- `body`: A short 1-2 sentence description.
- `tags`: Array of relevant categories/skills (e.g., `Calculator`, `Wiki`, `Database`, `Map`, `Cooking`, `Woodcutting`).
- `url`: The main website link.
- `date-added`: Current date in `YYYY-MM-DD` format.
- `slug`: A unique, URL-friendly kebab-case version of the title.
- `author` (Optional): Your name or GitHub username.
- `github_url` (Optional): Link to the open source repository.
- `open_source` (Optional): Set to `true` if the project is open source.
- `links` (Optional): Sub-links like Discord, Reddit, or Twitter with icons (`discord`, `reddit`, `twitter`, `youtube`, `web`).

---

## Formatting & Code Quality

Our CI pipeline checks all pull requests:

1. **Formatting**: Run `pnpm exec prettier --write .` before committing.
2. **Type Safety**: Run `pnpm run astro check` to verify there are no TypeScript or frontmatter errors.
3. **Build Stability**: Run `pnpm run build` to make sure the site compiles successfully.
4. **Testing**: Run `pnpm run test:run` to ensure all existing logic passes.

Please make sure all these checks pass before opening a Pull Request!
