const { chromium } = require("/tmp/craftbelt-check/node_modules/playwright");

const base = "https://www.mystereshop.com";
const routes = [
  "#/", "#/about-mystere", "#/projects",
  "#/project/live-cai-thien-sinh-ke-cho-cac-cong-dong-dan-toc-thieu-so-tai-cao-bang",
  "#/project/ha-cong-dong-craftbelt-sang-kien-gay-quy-tu-thien", "#/craft",
];
const widths = [320, 390, 430, 768, 1440];

(async () => {
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const results = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(`${base}/${route}`, { waitUntil: "networkidle", timeout: 45000 });
      const overflow = await page.evaluate(() => [...document.querySelectorAll("main h1, main h2, main h3, main p, main img, .brand, .header-tools, .footer-grid")]
        .filter(element => { const box = element.getBoundingClientRect(); return box.width > 0 && (box.right > innerWidth + 1 || box.left < -1); })
        .map(element => element.className || element.tagName));
      results.push({ width, route, overflow });
    }
  }
  console.log(JSON.stringify({ checked: results.length, failures: results.filter(result => result.overflow.length), results }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
