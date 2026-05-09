import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

const ALLOWED_TAGS = new Set(["strong", "em", "br", "a"]);
const STRIP_CONTENT_TAGS = new Set(["script", "style", "iframe", "object", "embed"]);

function sanitizeHref(value: string): string | null {
  const href = value.trim();

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  return null;
}

function sanitizeNodes(nodes: any[]): any[] {
  const sanitized: any[] = [];

  for (const node of nodes) {
    if (node.type === "text") {
      sanitized.push(node);
      continue;
    }

    if (node.type !== "element") {
      continue;
    }

    const tagName = String(node.tagName || "").toLowerCase();

    if (STRIP_CONTENT_TAGS.has(tagName)) {
      continue;
    }

    const children = sanitizeNodes(node.children || []);

    if (!ALLOWED_TAGS.has(tagName)) {
      sanitized.push(...children);
      continue;
    }

    const properties: Record<string, string> = {};

    if (tagName === "a") {
      const href = typeof node.properties?.href === "string" ? sanitizeHref(node.properties.href) : null;

      if (!href) {
        sanitized.push(...children);
        continue;
      }

      properties.href = href;

      if (href.startsWith("http://") || href.startsWith("https://")) {
        properties.rel = "noopener noreferrer";
        properties.target = "_blank";
      }
    }

    sanitized.push({
      type: "element",
      tagName,
      properties,
      children,
    });
  }

  return sanitized;
}

export function sanitizeRichText(input: string): string {
  const tree: any = unified().use(rehypeParse, { fragment: true }).parse(input);
  tree.children = sanitizeNodes(tree.children || []);

  return unified().use(rehypeStringify).stringify(tree);
}
