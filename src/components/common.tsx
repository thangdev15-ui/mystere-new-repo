import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { ui } from "../lib/ui";
import { HeroImage } from "./Img";

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "figure";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as any;
  return (
    <Comp
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Comp>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`block text-[11px] uppercase tracking-[0.3em] text-clay ${className}`}
    >
      {children}
    </span>
  );
}

export function Prose({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`space-y-5 ${className}`}>
      {text
        .split("\n\n")
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="text-[17px] leading-[1.85] text-cocoa/90">
            {p}
          </p>
        ))}
    </div>
  );
}

export function ArrowLink({
  to,
  href,
  children,
  className = "",
  light = false,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  const cls = `group inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.24em] ${
    light ? "text-ivory/90 hover:text-ivory" : "text-charcoal hover:text-rust"
  } transition-colors ${className}`;
  const inner = (
    <>
      <span className="border-b border-current pb-1">{children}</span>
      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
    </>
  );
  if (href)
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  return (
    <Link className={cls} to={to || "/"}>
      {inner}
    </Link>
  );
}

export function VisitButton({ light = false }: { light?: boolean }) {
  const { t } = useStore();
  return (
    <Link
      to="/visit"
      className={`inline-flex items-center gap-4 px-9 py-4 text-[11px] uppercase tracking-[0.28em] transition-all duration-500 ${
        light
          ? "bg-ivory text-charcoal hover:bg-cream"
          : "bg-charcoal text-ivory hover:bg-cocoa"
      }`}
    >
      {t(ui.visitShop)}
      <span aria-hidden>→</span>
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
      <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-charcoal md:text-5xl lg:text-[3.4rem]">
        {title}
      </h2>
      {lead && <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-cocoa/80">{lead}</p>}
    </Reveal>
  );
}

export function PageHero({
  image,
  eyebrow,
  title,
  lead,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="relative">
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden bg-cocoa md:h-[64vh]">
        <HeroImage src={image} priority />
        <div className="absolute inset-0 bg-charcoal/35" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-12 md:pb-16">
          {eyebrow && <Eyebrow className="mb-5 text-ivory/70">{eyebrow}</Eyebrow>}
          <h1 className="max-w-4xl font-serif text-[2.6rem] leading-[1.05] text-ivory md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </div>
      </div>
      {lead && (
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
          <Reveal className="max-w-3xl border-b border-sand/70 py-10 md:py-14">
            <p className="font-serif text-[22px] leading-[1.6] text-cocoa md:text-[26px]">{lead}</p>
          </Reveal>
        </div>
      )}
    </header>
  );
}

export function Newsletter({ tone = "cream" }: { tone?: "cream" | "dark" }) {
  const { content, t, addSubscriber } = useStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const dark = tone === "dark";

  return (
    <section className={dark ? "bg-charcoal text-ivory" : "bg-cream text-charcoal"}>
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-2 md:px-12 md:py-28">
        <Reveal>
          <Eyebrow className={dark ? "text-cream/60" : ""}>Newsletter</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl leading-[1.1] md:text-5xl">
            {t(content.newsletter.title)}
          </h2>
        </Reveal>
        <Reveal delay={120} className="flex flex-col justify-end">
          <p className={`max-w-md text-[16px] leading-relaxed ${dark ? "text-ivory/70" : "text-cocoa/80"}`}>
            {t(content.newsletter.body)}
          </p>
          {done ? (
            <p className="mt-8 font-serif text-2xl">{t(content.newsletter.success)}</p>
          ) : (
            <form
              className="mt-8 max-w-md space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                addSubscriber({ email, name, date: new Date().toISOString() });
                setDone(true);
              }}
            >
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.24em] opacity-60">
                  {t(ui.email)} *
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-2 w-full border-b bg-transparent pb-2 text-[16px] outline-none transition-colors ${
                    dark
                      ? "border-ivory/30 focus:border-ivory"
                      : "border-charcoal/25 focus:border-charcoal"
                  }`}
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.24em] opacity-60">
                  {t(ui.name)}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-2 w-full border-b bg-transparent pb-2 text-[16px] outline-none transition-colors ${
                    dark
                      ? "border-ivory/30 focus:border-ivory"
                      : "border-charcoal/25 focus:border-charcoal"
                  }`}
                />
              </label>
              <button
                type="submit"
                className={`mt-2 inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.28em] transition-colors ${
                  dark ? "bg-ivory text-charcoal hover:bg-cream" : "bg-charcoal text-ivory hover:bg-cocoa"
                }`}
              >
                {t(content.newsletter.button)}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function VisitCta() {
  const { content, t } = useStore();
  const v = content.home.visit;
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[70vh] min-h-[460px] w-full bg-cocoa">
        <HeroImage src={v.image} />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
            <Reveal className="max-w-xl">
              <Eyebrow className="text-ivory/70">141 Dong Khoi Street — Saigon</Eyebrow>
              <h2 className="mt-6 font-serif text-4xl leading-[1.08] text-ivory md:text-6xl">
                {t(v.title)}
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed text-ivory/80">{t(v.body)}</p>
              <div className="mt-10">
                <VisitButton light />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
