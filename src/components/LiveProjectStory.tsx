import { Fragment } from 'react';
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
  // Partition the original blocks in their original order. Never excerpt,
  // synthesize headings, or repeat text: every CMS block is rendered once.
  const section = nodes.slice(start, end);
  const production = section.findIndex(node => /^(Production|Sản xuất)[.\s:]/i.test(text(node)));
  const market = section.findIndex(node => /^(Market linking|Liên kết thị trường)[.\s:]/i.test(text(node)));
  const closing = more - start;
  if (production < 1 || market <= production || closing <= market) {
    return <RichText html={html} className={className} />;
  }
  const boundaries = [0, production, market, closing, section.length];
  const images = [2, 3, 4, 1];
  const rows = images.map((image, index) => ({
    image,
    copy: section.slice(boundaries[index], boundaries[index + 1]).map(cleanCopy).join(''),
  }));
  return <div className={`live-project-story ${className}`}>
    <RichText html={nodes.slice(0, start).map(node => node.outerHTML).join('')} />
    <section className="live-market-section">
      <div className="live-market-rows">{rows.map((row, index) => <Fragment key={row.image}>
        {index === 3 && <img className="live-project-wide-image" src="/images/moinhat/projectlive.webp" alt={en ? "LIVE Project" : "Dự án LIVE"} loading="lazy" />}
        <section className={`live-market-row${index % 2 ? " live-market-row-reverse" : ""}`}>
        <img src={`/images/moinhat/anhtrongproject${row.image}.jpg`} alt={en ? 'LIVE project artisans and handicrafts' : 'Nghệ nhân và sản phẩm thủ công của dự án LIVE'} loading="lazy" />
        <div className="live-market-copy"><RichText html={row.copy} /></div>
      </section></Fragment>)}</div>
    </section>
    <RichText html={nodes.slice(end).map(node => node.outerHTML).join('')} />
  </div>;
}
