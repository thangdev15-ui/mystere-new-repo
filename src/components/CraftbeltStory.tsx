import RichText, { sanitizeRichHtml } from './RichText';

const isHouse = (src: string) => /craft-belt-house-retouched|Rural(?:%20| )Timber/i.test(src);
const isWomen = (src: string) => /Five(?:%20| )Women/i.test(src);

export function craftbeltImages(gallery: string[] = []) {
  const images = gallery.filter(Boolean);
  const house = images.find(src => /Rural(?:%20| )Timber/i.test(src)) || images.find(isHouse);
  const women = images.find(isWomen);
  const inline = house && women ? [house, women] : images.slice(0, 2);
  const remaining = images.filter(src => !inline.includes(src) && !(house && women && isHouse(src)));
  return { inline, remaining };
}

export default function CraftbeltStory({ html, images, className = '' }: { html: string; images: string[]; className?: string }) {
  const doc = new DOMParser().parseFromString(sanitizeRichHtml(html), 'text/html');
  // Move only these gallery photographs; preserve every text node and its markup.
  doc.body.querySelectorAll('img').forEach(image => {
    const src = image.getAttribute('src') || '';
    if (images.includes(src) || (images.some(isHouse) && isHouse(src))) image.remove();
  });
  const nodes = Array.from(doc.body.childNodes);
  const serialize = (group: Node[]) => {
    const container = doc.createElement('div');
    group.forEach(node => container.appendChild(node.cloneNode(true)));
    return container.innerHTML;
  };
  if (!images.length) return <RichText html={html} className={className} />;
  const total = nodes.reduce((sum, node) => sum + (node.textContent?.length || 0), 0);
  let split = nodes.length;
  let length = 0;
  let best = Infinity;
  for (let i = 1; i < nodes.length; i++) {
    length += nodes[i - 1].textContent?.length || 0;
    // Keep headings with their following paragraphs, and never split a paragraph.
    if (nodes[i - 1] instanceof Element && /^H[23]$/.test((nodes[i - 1] as Element).tagName)) continue;
    const distance = Math.abs(total / 2 - length);
    if (distance < best) { best = distance; split = i; }
  }
  const groups = images.length === 1 ? [nodes] : [nodes.slice(0, split), nodes.slice(split)];
  return <div className={`craftbelt-story ${className}`}>
    {groups.map((group, index) => <section className="craftbelt-story-row" key={index}>
      <img src={images[index]} alt="CraftBelt Houses" loading="lazy" />
      <RichText html={serialize(group)} />
    </section>)}
  </div>;
}
