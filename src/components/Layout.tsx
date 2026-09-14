import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store/store";
import { ui } from "../lib/ui";

const NAV = [
  { to: "/about", key: "about" as const },
  { to: "/our-story", key: "story" as const },
  { to: "/craft", key: "craft" as const },
  { to: "/journal", key: "journal" as const },
  { to: "/visit", key: "visit" as const },
];

function LangSwitch({ light }: { light: boolean }) {
  const { lang, setLang } = useStore();
  const base = "px-1 text-[11px] uppercase tracking-[0.2em] transition-opacity";
  return (
    <div className={`flex items-center gap-1 ${light ? "text-ivory" : "text-charcoal"}`}>
      <button
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? "opacity-100 underline underline-offset-4" : "opacity-50 hover:opacity-90"}`}
        aria-label="English"
      >
        EN
      </button>
      <span className="opacity-40">|</span>
      <button
        onClick={() => setLang("vi")}
        className={`${base} ${lang === "vi" ? "opacity-100 underline underline-offset-4" : "opacity-50 hover:opacity-90"}`}
        aria-label="Tiếng Việt"
      >
        VN
      </button>
    </div>
  );
}

function Wordmark({ light }: { light: boolean }) {
  const { content } = useStore();
  const logo = content.contact.logo;
  if (logo) {
    return <img src={logo} alt="Mystère Shop" className="h-8 w-auto md:h-9" />;
  }
  return (
    <>
      <span
        className={`font-serif text-[26px] leading-none tracking-tight transition-colors ${
          light ? "text-ivory" : "text-charcoal"
        }`}
      >
        Mystère
      </span>
      <span
        className={`hidden text-[10px] uppercase tracking-[0.32em] transition-colors sm:block ${
          light ? "text-ivory/70" : "text-clay"
        }`}
      >
        Huyền Bí
      </span>
    </>
  );
}

function Header() {
  const { t } = useStore();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const hasHero =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/our-story" ||
    pathname === "/visit" ||
    pathname.startsWith("/craft") ||
    pathname.startsWith("/journal/") ||
    pathname.startsWith("/communities/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const light = hasHero && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        light ? "bg-transparent" : "border-b border-sand/60 bg-ivory/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="group flex items-baseline gap-3">
          <Wordmark light={light} />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  light
                    ? "text-ivory/85 hover:text-ivory"
                    : isActive
                      ? "text-rust"
                      : "text-charcoal/80 hover:text-charcoal"
                } ${isActive && light ? "underline underline-offset-8" : ""}`
              }
            >
              {t(ui.nav[n.key])}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <LangSwitch light={light} />
          <button
            className={`lg:hidden text-[11px] uppercase tracking-[0.2em] ${
              light ? "text-ivory" : "text-charcoal"
            }`}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sand/60 bg-ivory lg:hidden">
          <nav className="mx-auto flex w-full max-w-[1400px] flex-col px-6 py-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="border-b border-sand/50 py-4 font-serif text-2xl text-charcoal last:border-0"
              >
                {t(ui.nav[n.key])}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { content, t } = useStore();
  const c = content.contact;
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-12 md:px-12">
        <div className="md:col-span-5">
          {content.contact.logo ? (
            <img
              src={content.contact.logo}
              alt="Mystère Shop"
              className="h-12 w-auto brightness-0 invert"
            />
          ) : (
            <p className="font-serif text-4xl leading-none">Mystère Shop</p>
          )}
          <p className="mt-3 text-[12px] uppercase tracking-[0.3em] text-cream/60">Huyền Bí</p>
          <p className="mt-8 max-w-sm font-serif text-2xl leading-snug text-ivory/85">
            {t(ui.tagline)}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-cream/50">
            {t(ui.estd)}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cream/50">{t(ui.address)}</p>
          <address className="mt-5 space-y-1 text-[15px] not-italic leading-relaxed text-ivory/80">
            {c.addressLines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </address>
          <div className="mt-6 space-y-1 text-[15px] text-ivory/80">
            <div>{c.phone}</div>
            <div>Zalo / WhatsApp {c.zalo}</div>
            <div>{t(c.hours)}</div>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cream/50">Menu</p>
          <nav className="mt-5 flex flex-col gap-2 text-[15px] text-ivory/80">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="hover:text-ivory">
                {t(ui.nav[n.key])}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cream/50">{t(ui.follow)}</p>
          <div className="mt-5 flex flex-col gap-2 text-[15px] text-ivory/80">
            <a href={c.instagram} target="_blank" rel="noreferrer" className="hover:text-ivory">
              Instagram
            </a>
            <a href={c.facebook} target="_blank" rel="noreferrer" className="hover:text-ivory">
              Facebook
            </a>
            <a href={c.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-ivory">
              Google Maps
            </a>
            <a href={`mailto:${c.email}`} className="hover:text-ivory">
              {c.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-6 py-6 text-[11px] uppercase tracking-[0.2em] text-cream/40 md:flex-row md:items-center md:justify-between md:px-12">
          <span>© {new Date().getFullYear()} Mystère Shop — Huyền Bí. {t(ui.rights)}</span>
          <Link to="/admin" className="hover:text-cream/80">
            {t(ui.admin)}
          </Link>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
