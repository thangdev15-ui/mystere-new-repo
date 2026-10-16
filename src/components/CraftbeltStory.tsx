import RichText, { sanitizeRichHtml } from './RichText';

/** Layout only: copy complete CMS blocks, including their lists and formatting. */
export function layoutCraftbeltStory(html: string) {
  const doc = new DOMParser().parseFromString(sanitizeRichHtml(html), 'text/html');
  const sections: { title: string; html: string }[] = [];
  let container = doc.createElement('div');
  let title = '';
  const flush = () => {
    if (container.hasChildNodes()) sections.push({ title, html: container.innerHTML });
    container = doc.createElement('div');
  };
  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType === 1 && /^H[23]$/.test((node as Element).tagName) && node.textContent?.trim()) {
      flush();
      title = node.textContent.trim();
    }
    container.appendChild(node.cloneNode(true));
  }
  flush();
  const identify = (value: string) => {
    if (/^When everyone|^Khi mỗi người/i.test(value)) return 'when';
    if (/^One house|^Một ngôi nhà, nhiều/i.test(value)) return 'uses';
    if (/^Built from|^Được xây từ/i.test(value)) return 'built';
    return 'other';
  };
  // Preserve CMS order exactly; only the two named sections receive an image.
  return sections.map(section => ({ ...section, kind: identify(section.title) }));
}

export default function CraftbeltStory({ html, images }: { html: string; images: string[] }) {
  const blocks = layoutCraftbeltStory(html);
  return <div className="craftbelt-layout">
    {blocks.map((block, index) => {
      const image = block.kind === 'when' ? images[0] : block.kind === 'built' ? images[1] : undefined;
      return <div className={image ? `craftbelt-layout-row craftbelt-layout-${block.kind}` : 'craftbelt-layout-full'} key={index}>
        {image && <img className="craftbelt-layout-image" src={image} alt="CraftBelt Houses" loading="lazy" />}
        <RichText html={block.html} />
      </div>;
    })}
  </div>;
}
