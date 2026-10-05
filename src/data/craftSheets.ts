import type { Category, SiteContent } from '../lib/types';

/** Client-supplied finished artwork, in the order of the numbered source files. */
export const craftSheets = [
  { slug: '25th-anniversary', title: '25th Anniversary', file: '1.2. 25 Ani.png', match: /25.*(anniversary|ani)|anniversary/i, width: 1414, height: 2000 },
  { slug: 'about-mystere-shop', title: 'About Mystère Shop', file: 'about-mystere-shop.png', match: /about.*myst|myst.*shop/i, width: 960, height: 1200 },
  { slug: 'traditional-handicraft-bazaar', title: 'Traditional Handicraft Bazaar', file: '3.2. Bazaar vs2.png', match: /bazaar/i, width: 960, height: 1200 },
  { slug: 'decen', title: 'DECEN', file: '4.2. DECEN vs2.png', match: /decen/i, width: 960, height: 1200 },
  { slug: 'live-project', title: 'LIVE Project', file: '5.2. Live project (1).png', match: /live.*project/i, width: 960, height: 1200 },
  { slug: 'red-dao-family', title: 'Red Dao Family', file: '6.2. Red Dao Fam.png', match: /red.*dao.*fam/i, width: 960, height: 1200 },
  { slug: 'the-meaning-behind-the-colors', title: 'RED DAO TRADITIONAL ATTIRE: The Meaning Behind the Colors', file: '7.2. The meaning behind the colors.png', match: /meaning.*colou?r|traditional.*attire/i, width: 960, height: 1200 },
].map(sheet => ({ ...sheet, src: `/images/updated/${encodeURIComponent(sheet.file)}` }));

/** Run once for local and remote payloads; subsequent CMS edits remain authoritative. */
export function migrateCraftSheets(content: SiteContent) {
  // Repair saved URLs too: macOS decomposes accents in filenames, while Linux
  // and object storage can treat the visually identical URLs as different files.
  for (const category of content.categories ?? []) {
    for (const language of ['en', 'vi'] as const) {
      const src = category.pageImage?.[language];
      if (!src) continue;
      try {
        if (decodeURIComponent(src).normalize('NFC') === '/images/updated/2.2. About mystère vs2 (2).png') {
          category.pageImage![language] = '/images/updated/about-mystere-shop.png';
        }
      } catch { /* Leave custom URLs untouched. */ }
    }
  }
  if (content.craft.sheetVersion === 1) return;
  const remaining = [...(content.categories ?? [])];
  const sheets: Category[] = craftSheets.map(sheet => {
    const index = remaining.findIndex(category => sheet.match.test(`${category.name.en} ${category.slug}`));
    const existing = index >= 0 ? remaining.splice(index, 1)[0] : undefined;
    return {
      ...(existing ?? {
        id: `sheet-${sheet.slug}`, slug: sheet.slug,
        name: { en: sheet.title, vi: sheet.title },
        short: { en: '', vi: '' }, description: { en: '', vi: '' }, image: '', gallery: [],
      }),
      pageImage: { en: sheet.src, vi: '' },
      published: true,
    };
  });
  // Keep the previous articles available in CMS without mixing them into the approved booklet.
  content.categories = [...sheets, ...remaining.map(category => ({ ...category, published: false }))];
  content.craft.sheetVersion = 1;
}
