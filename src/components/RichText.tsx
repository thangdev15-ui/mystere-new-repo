const allowedTags = new Set([
  "P", "BR", "STRONG", "B", "EM", "I", "U", "H2", "H3", "UL", "OL", "LI",
  "BLOCKQUOTE", "A", "IMG",
]);

export function isHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function plainTextToHtml(value: string) {
  if (!value) return "";
  if (isHtml(value)) return value;
  const escape = (text: string) => text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return value.split(/\n\s*\n/).map(paragraph => `<p>${escape(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
}

export function sanitizeRichHtml(value: string) {
  const source = plainTextToHtml(value);
  if (typeof document === "undefined") return source;
  const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, "text/html");
  const root = parsed.body.firstElementChild;
  if (!root) return "";

  const clean = (node: Element) => {
    for (const child of Array.from(node.children)) {
      clean(child);
      if (!allowedTags.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        continue;
      }
      const tag = child.tagName;
      const href = child.getAttribute("href") ?? "";
      const src = child.getAttribute("src") ?? "";
      const alt = child.getAttribute("alt") ?? "";
      const width = child.getAttribute("data-width") ?? "100";
      const align = child.getAttribute("data-align") ?? "center";
      for (const attr of Array.from(child.attributes)) child.removeAttribute(attr.name);
      if (tag === "A") {
        if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) child.setAttribute("href", href);
        child.setAttribute("target", "_blank");
        child.setAttribute("rel", "noreferrer noopener");
      }
      if (tag === "IMG") {
        if (/^(https?:|data:image\/|\/)/i.test(src)) child.setAttribute("src", src);
        child.setAttribute("alt", alt);
        child.setAttribute("data-width", /^(25|50|75|100)$/.test(width) ? width : "100");
        child.setAttribute("data-align", /^(left|center|right)$/.test(align) ? align : "center");
        child.setAttribute("draggable", "true");
      }
      if (["P", "H2", "H3", "BLOCKQUOTE", "LI"].includes(tag) &&
          !(child.textContent ?? "").replace(/\u00a0/g, " ").trim() &&
          !child.querySelector("img")) child.remove();
    }
  };
  clean(root);
  return root.innerHTML;
}

export function richTextToPlainText(value: string) {
  if (!isHtml(value)) return value;
  if (typeof document === "undefined") return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const parsed = new DOMParser().parseFromString(sanitizeRichHtml(value), "text/html");
  return (parsed.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

export default function RichText({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(html) }} />;
}
