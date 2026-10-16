import RichText, { sanitizeRichHtml } from './RichText';

/** Reflow only the LIVE market-access section; the CMS remains the text source. */
export default function LiveProjectStory({ html, en, className = '' }: { html: string; en: boolean; className?: string }) {
  const doc = new DOMParser().parseFromString(sanitizeRichHtml(html), 'text/html');
  const nodes = Array.from(doc.body.children);
  const text = (node: Element) => (node.textContent ?? '').trim();
  const start = nodes.findIndex(node => /^H[23]$/.test(node.tagName) && /From skilled hands|Từ đôi bàn tay|Từ bàn tay/i.test(text(node)));
  const more = nodes.findIndex((node, index) => index > start && /^H[23]$/.test(node.tagName) && /More than a project|Hơn cả một dự án/i.test(text(node)));
  if (start < 0 || more < 0) return <RichText html={html} className={className} />;
  let end = more + 1;
  while (end < nodes.length && !/^H[23]$/.test(nodes[end].tagName)) end++;
  const cleanCopy = (node: Element) => {
    const copy = node.cloneNode(true) as Element;
    copy.querySelectorAll('img').forEach(image => image.remove());
    return copy.tagName === 'IMG' ? '' : copy.outerHTML;
  };
  const intro = nodes.slice(start, more).map(cleanCopy).join('');
  const paragraphs = nodes.slice(start + 1, more).filter(node => node.tagName === 'P' && text(node));
  const production = paragraphs.find(node => /Production|Sản xuất/i.test(text(node)));
  const market = paragraphs.find(node => /Market linking|Liên kết thị trường/i.test(text(node)));
  const withoutLabel = (node?: Element) => {
    if (!node) return '';
    const copy = node.cloneNode(true) as Element;
    copy.querySelector('strong,b')?.remove();
    return copy.outerHTML;
  };
  const excerpt = (node: Element | undefined, marketCopy: boolean) => {
    if (!node) return '';
    const content = new DOMParser().parseFromString(withoutLabel(node), 'text/html').body.textContent ?? '';
    const cut = marketCopy
      ? content.search(/\s+In 2012 and 2013,|\s+Năm 2012 và 2013,/)
      : content.search(/The project also|Dự án cũng/);
    const result = cut < 0 ? content : marketCopy ? content.slice(0, cut) : content.slice(cut);
    return result.trim();
  };
  const moreCopy = nodes.slice(more + 1, end).map(cleanCopy).join('');
  const rows = [
    { image: 2, title: text(nodes[more]), copy: moreCopy },
    { image: 3, title: en ? 'Craft linking and market access' : 'Kết nối thủ công và tiếp cận thị trường', copy: excerpt(market, true) },
    { image: 4, title: en ? 'Market linking' : 'Liên kết thị trường', copy: excerpt(production, false) },
    { image: 1, title: en ? 'Production' : 'Sản xuất', copy: withoutLabel(production) },
  ];
  return <div className={`live-project-story ${className}`}>
    <RichText html={nodes.slice(0, start).map(node => node.outerHTML).join('')} />
    <section className="live-market-section">
      <RichText html={intro} />
      <div className="live-market-rows">{rows.map((row) => <section className="live-market-row" key={row.image}>
        <img src={`/images/moinhat/anhtrongproject${row.image}.jpg`} alt={row.title} loading="lazy" />
        <div className="live-market-copy"><h3>{row.title}</h3><RichText html={row.copy} /></div>
      </section>)}</div>
    </section>
    <RichText html={nodes.slice(end).map(node => node.outerHTML).join('')} />
  </div>;
}
