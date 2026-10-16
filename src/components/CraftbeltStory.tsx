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
  const isHeading = (node: Node) => node instanceof Element && (
    /^H[23]$/.test(node.tagName) ||
    /^(When everyone works in a different place|Built from the bazaars|One house,? many uses|The next chapter)[.!:]?$/i.test((node.textContent ?? '').trim())
  );
  // Keep each heading and all following blocks together, without changing text.
  const groups: Node[][] = [];
  let current: Node[] = [];
  for (const node of nodes) {
    const heading = isHeading(node);
    if (heading && current.some(item => (item.textContent ?? '').trim())) {
      groups.push(current);
      current = [];
    }
    current.push(node);
  }
  if (current.length) groups.push(current);
  const firstImageIndex = groups.findIndex(group => group.some(node => isHeading(node) && /When everyone|Khi mọi người/i.test(node.textContent ?? '')));
  const usesIndex = groups.findIndex(group => group.some(node =>
    isHeading(node) &&
    /One house.*many uses|Một ngôi nhà.*nhiều|Một nhà.*nhiều/i.test(node.textContent ?? '')
  ));
  const secondImageIndex = usesIndex > 0 ? usesIndex : groups.length > 2 ? 2 : 1;
  return <div className={`craftbelt-story ${className}`}>
    {groups.map((group, index) => {
      const image = index === (firstImageIndex >= 0 ? firstImageIndex : 0) ? images[0] : index === secondImageIndex ? images[1] : undefined;
      return <section className={image
        ? 'craftbelt-story-row craftbelt-story-row-reverse'
        : 'craftbelt-story-full'} key={index}>
        <RichText html={serialize(group)} />
        {image && <img src={image} alt="CraftBelt Houses" loading="lazy" />}
      </section>;
    })}
  </div>;
}
