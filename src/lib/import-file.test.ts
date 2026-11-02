import { describe, expect, it } from "vitest";
import {
  isAllowedImportName,
  markdownOrTextToHtml,
} from "./import-file";

describe("isAllowedImportName", () => {
  it("accepts txt and markdown extensions", () => {
    expect(isAllowedImportName("notes.txt")).toBe(true);
    expect(isAllowedImportName("spec.MD")).toBe(true);
    expect(isAllowedImportName("readme.markdown")).toBe(true);
  });

  it("rejects unsupported types", () => {
    expect(isAllowedImportName("deck.pdf")).toBe(false);
    expect(isAllowedImportName("brief.docx")).toBe(false);
  });
});

describe("markdownOrTextToHtml", () => {
  it("converts plain text paragraphs", () => {
    const html = markdownOrTextToHtml("Hello\n\nWorld", "note.txt");
    expect(html).toContain("<p>Hello</p>");
    expect(html).toContain("<p>World</p>");
  });

  it("preserves markdown structure used in imports", () => {
    const md = `# Title

Intro paragraph.

## Details

- first
- second

1. alpha
2. beta

**bold** and *italic*
`;
    const html = markdownOrTextToHtml(md, "kickoff.md");
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<h2>Details</h2>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>first</li>");
    expect(html).toContain("<ol>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
  });

  it("escapes raw HTML in imported files", () => {
    const html = markdownOrTextToHtml("<script>alert(1)</script>", "x.txt");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
