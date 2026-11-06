/* Read-only production audit. Usage: CMS_EMAIL=... CMS_PASSWORD=... node scripts/production_audit.cjs */
const { chromium, devices } = require("/tmp/craftbelt-check/node_modules/playwright");
const fs = require("node:fs");

const base = "https://www.mystereshop.com";
const routes = [
  "#/", "#/about-mystere", "#/projects", "#/craft",
  "#/project/live-cai-thien-sinh-ke-cho-cac-cong-dong-dan-toc-thieu-so-tai-cao-bang",
  "#/project/ha-cong-dong-craftbelt-sang-kien-gay-quy-tu-thien",
  "#/craft/25th-anniversary", "#/craft/about-mystere-shop", "#/craft/traditional-handicraft-bazaar",
  "#/craft/decen", "#/craft/live-project", "#/craft/red-dao-family",
  "#/craft/red-dao-traditional-attire-the-meaning-behind-the-colors",
];

async function load(page, route) {
  await page.goto(`${base}/${route}`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(350);
}

async function imageAudit(page) {
  const images = page.locator("img");
  const count = await images.count();
  for (let index = 0; index < count; index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded().catch(() => {});
  }
  await page.waitForTimeout(450);
  return images.evaluateAll(items => items
    .filter(image => !image.complete || image.naturalWidth === 0)
    .map(image => (image.getAttribute("src") || "").slice(0, 160)));
}

(async () => {
  const report = { auditedAt: new Date().toISOString(), public: {}, mobile: {}, cms: {}, issues: [] };
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const desktopPage = await desktop.newPage();
  const desktopErrors = [];
  desktopPage.on("pageerror", error => desktopErrors.push(error.message));
  desktopPage.on("console", message => { if (message.type() === "error") desktopErrors.push(`console: ${message.text()}`); });
  const pageResults = [];
  for (const route of routes) {
    await load(desktopPage, route);
    const mainText = await desktopPage.locator("main").innerText();
    const overflow = await desktopPage.evaluate(() => [...document.querySelectorAll("main h1, main h2, main h3, main p, main img, .brand, .header-tools, .footer-grid")]
      .filter(element => { const box = element.getBoundingClientRect(); return box.width > 0 && (box.right > window.innerWidth + 1 || box.left < -1); })
      .map(element => element.className || element.tagName));
    const brokenImages = await imageAudit(desktopPage);
    pageResults.push({ route, hasContent: mainText.trim().length > 80, overflow, brokenImages });
  }
  report.public = { routes: pageResults, runtimeErrors: desktopErrors };

  const mobile = await browser.newContext({ ...devices["iPhone 13"] });
  const mobilePage = await mobile.newPage();
  const mobileErrors = [];
  mobilePage.on("pageerror", error => mobileErrors.push(error.message));
  await load(mobilePage, "#/");
  const menuButton = mobilePage.locator(".mobile-menu");
  await menuButton.click();
  const navVisible = await mobilePage.locator("#mobile-nav").isVisible();
  await mobilePage.locator("#mobile-nav .who-trigger button").first().click();
  const submenuVisible = await mobilePage.locator("#mobile-nav a[href='#/about-mystere#our-mission']").isVisible();
  await mobilePage.locator(".search-button").click();
  const searchVisible = await mobilePage.locator("#site-search").isVisible();
  await mobilePage.locator("#search-query").fill("LIVE");
  const searchText = await mobilePage.locator("#site-search").innerText();
  const mobileRouteChecks = [];
  for (const route of routes) {
    await load(mobilePage, route);
    const overflow = await mobilePage.evaluate(() => [...document.querySelectorAll("main h1, main h2, main h3, main p, main img, .brand, .header-tools, .footer-grid")]
      .filter(element => { const box = element.getBoundingClientRect(); return box.width > 0 && (box.right > window.innerWidth + 1 || box.left < -1); })
      .map(element => element.className || element.tagName));
    const blank = (await mobilePage.locator("main").innerText()).trim().length < 80;
    mobileRouteChecks.push({ route, blank, overflow });
  }
  report.mobile = { menuVisible: navVisible, submenuVisible, searchVisible, searchFindsLive: /result|kết quả/i.test(searchText), routes: mobileRouteChecks, runtimeErrors: mobileErrors };

  const cms = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const cmsPage = await cms.newPage();
  const cmsErrors = [];
  cmsPage.on("pageerror", error => cmsErrors.push(error.message));
  await load(cmsPage, "#/admin");
  report.cms.loginFormVisible = await cmsPage.locator(".login-form").isVisible();
  if (process.env.CMS_EMAIL && process.env.CMS_PASSWORD) {
    await cmsPage.locator("input[type='email']").fill(process.env.CMS_EMAIL);
    await cmsPage.locator("input[type='password']").fill(process.env.CMS_PASSWORD);
    await cmsPage.locator(".login-submit").click();
    await cmsPage.waitForTimeout(1000);
    report.cms.authenticated = await cmsPage.locator(".admin-shell").isVisible().catch(() => false);
    report.cms.loginError = await cmsPage.locator(".login-error").textContent().catch(() => null);
    if (report.cms.authenticated) {
      const sectionResults = [];
      for (const label of [
        "Dashboard", "NEW · Page content", "What we do · Project", "What we do · Communities",
        "What we do · Events", "Craft & Products · Topics", "Newsletter", "Logo & Contact", "Settings",
      ]) {
        const button = cmsPage.getByRole("button", { name: label, exact: true });
        await button.click();
        await cmsPage.waitForTimeout(160);
        sectionResults.push({ label, visible: await button.isVisible(), contentLength: (await cmsPage.locator(".admin-content").innerText()).trim().length });
      }
      await cmsPage.getByRole("button", { name: "Settings", exact: true }).click();
      const connectionButton = cmsPage.getByRole("button", { name: "Check connection" });
      if (await connectionButton.isVisible()) await connectionButton.click();
      await cmsPage.waitForTimeout(700);
      report.cms.sections = sectionResults;
      report.cms.connectionText = (await cmsPage.locator(".admin-content").innerText()).match(/Supabase (?:connected|connection failed|is not configured)/i)?.[0] || null;
      const openEditor = cmsPage.getByRole("button", { name: "Open editor" }).first();
      if (await openEditor.isVisible()) {
        await openEditor.click();
        report.cms.editorDialogWorks = await cmsPage.getByRole("dialog").isVisible();
        await cmsPage.getByRole("button", { name: "Done" }).click();
      }
    }
  }
  report.cms.runtimeErrors = cmsErrors;
  await cmsPage.screenshot({ path: "/tmp/mystere-cms-audit.png", fullPage: true });
  await desktop.close(); await mobile.close(); await cms.close(); await browser.close();
  fs.writeFileSync("/tmp/mystere-production-audit.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
