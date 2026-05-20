import { describe, it, expect } from "vitest";
import { addRef } from "./addRef";

describe("addRef", () => {
    it("should return empty string for null, undefined or empty input", () => {
        expect(addRef(null)).toBe("");
        expect(addRef(undefined)).toBe("");
        expect(addRef("")).toBe("");
    });

    it("should append ?ref=walkscape-index.github.io to http/https URLs", () => {
        expect(addRef("https://walkscape.app")).toBe("https://walkscape.app/?ref=walkscape-index.github.io");
        expect(addRef("http://localhost:3000/test")).toBe("http://localhost:3000/test?ref=walkscape-index.github.io");
    });

    it("should append &ref=walkscape-index.github.io if other query params exist", () => {
        expect(addRef("https://example.com/foo?bar=baz")).toBe("https://example.com/foo?bar=baz&ref=walkscape-index.github.io");
    });

    it("should not overwrite existing ref parameter if present", () => {
        expect(addRef("https://example.com/?ref=custom-ref")).toBe("https://example.com/?ref=custom-ref");
        expect(addRef("https://example.com/?foo=bar&ref=other")).toBe("https://example.com/?foo=bar&ref=other");
    });

    it("should return original URL for non-http/https protocols", () => {
        expect(addRef("discord://invite/1234")).toBe("discord://invite/1234");
        expect(addRef("mailto:contact@example.com")).toBe("mailto:contact@example.com");
    });

    it("should return original string for malformed URLs", () => {
        expect(addRef("not-a-valid-url")).toBe("not-a-valid-url");
        expect(addRef("/relative/path")).toBe("/relative/path");
    });
});
