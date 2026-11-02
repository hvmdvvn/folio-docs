/**
 * Convert uploaded .txt / .md into TipTap-friendly HTML.
 * Deliberately small: no .docx parsing in this timebox.
 */

export function markdownOrTextToHtml(raw: string, filename: string): string {
  const trimmed = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  if (!trimmed) {
    return "<p></p>";
  }

  const isMarkdown = /\.(md|markdown)$/i.test(filename) || looksLikeMarkdown(trimmed);
  if (!isMarkdown) {
    return plainTextToHtml(trimmed);
  }

  return markdownToHtml(trimmed);
}

function looksLikeMarkdown(text: string) {
  return /^(#{1,3}\s|[-*]\s|\d+\.\s|\*\*|__)/m.test(text);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function plainTextToHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function markdownToHtml(md: string) {
  const lines = md.split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraph: string[] = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|[-*]\s|\d+\.\s)/.test(lines[i])) {
      paragraph.push(lines[i]);
      i += 1;
    }
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return html.join("") || "<p></p>";
}

function inline(text: string) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__(.+?)__/g, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  out = out.replace(/_(.+?)_/g, "<em>$1</em>");
  return out;
}

export const ALLOWED_IMPORT_EXTENSIONS = [".txt", ".md", ".markdown"] as const;

export function isAllowedImportName(filename: string) {
  const lower = filename.toLowerCase();
  return ALLOWED_IMPORT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
