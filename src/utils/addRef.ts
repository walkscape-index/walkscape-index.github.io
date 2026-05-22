const REF_VALUE = "walkscape-index.github.io";

export function addRef(url: string | undefined | null): string {
  if (!url) return url ?? "";
  try {
    const u = new URL(url);
    if (!u.protocol.startsWith("http")) return url;
    if (!u.searchParams.has("ref")) {
      u.searchParams.set("ref", REF_VALUE);
    }
    return u.toString();
  } catch {
    return url;
  }
}
