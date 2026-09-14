import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "../store/store";
import { ui } from "../lib/ui";
import {
  Eyebrow,
  Newsletter,
  PageHero,
  Prose,
  Reveal,
  SectionHeading,
  VisitCta,
} from "../components/common";
import Img from "../components/Img";

export default function Story() {
  const { content, t } = useStore();
  const s = content.story;
  const { hash } = useLocation();
  const communities = content.communities.filter((c) => c.published);
  const partners = content.partners.filter((p) => p.published);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }, [hash]);

  return (
    <>
      <PageHero image={s.heroImage} eyebrow="Our Story — Câu chuyện" title={t(s.title)} lead={t(s.lead)} />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-7 md:col-start-2">
            <Prose text={t(s.body)} className="[&>p]:text-[18px]" />
          </Reveal>
          <Reveal delay={120} className="md:col-span-3">
            <blockquote className="border-t border-clay pt-6">
              <p className="font-serif text-[24px] italic leading-snug text-cocoa">
                “{t(s.quote)}”
              </p>
              <footer className="mt-5 text-[11px] uppercase tracking-[0.24em] text-clay">
                {t(s.quoteAuthor)}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* COMMUNITIES */}
      <section className="border-t border-sand/70">
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-20 md:px-12 md:pt-28">
          <SectionHeading
            eyebrow={t(ui.ourProjects)}
            title={t(s.communitiesTitle)}
            lead={t(s.communitiesLead)}
          />
        </div>

        {communities.map((c, i) => {
          const flip = i % 2 === 1;
          return (
            <article
              id={c.slug}
              key={c.id}
              className={`scroll-mt-24 ${flip ? "bg-cream" : "bg-ivory"}`}
            >
              <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 py-20 md:grid-cols-12 md:gap-16 md:px-12 md:py-28">
                <Reveal className={`md:col-span-6 ${flip ? "md:order-2" : ""}`}>
                  <div className="group overflow-hidden">
                    <Img
                      src={c.image}
                      alt={c.name}
                      label={c.name}
                      ratio="aspect-[4/5]"
                      className="img-zoom"
                    />
                  </div>
                </Reveal>
                <div className={`md:col-span-6 ${flip ? "md:order-1" : ""}`}>
                  <Reveal delay={80}>
                    <Eyebrow>
                      {t(ui.region)} — {t(c.region)}
                    </Eyebrow>
                    <h3 className="mt-5 font-serif text-[2.6rem] leading-none text-charcoal md:text-[3.2rem]">
                      {c.name}
                    </h3>
                    <p className="mt-4 font-serif text-[24px] italic text-cocoa/85">{t(c.title)}</p>
                    <div className="mt-7 max-w-lg">
                      <Prose text={t(c.story)} />
                    </div>
                    <div className="mt-8 max-w-lg border-t border-sand pt-5">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-clay">
                        {t(ui.craftLabel)}
                      </span>
                      <p className="mt-3 text-[16px] leading-relaxed text-cocoa/85">{t(c.craft)}</p>
                    </div>
                  </Reveal>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* PARTNERS & PROJECTS — supporting, not equal weight */}
      {partners.length > 0 && (
        <section className="bg-charcoal text-ivory">
          <div className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
            <Reveal className="max-w-3xl">
              <Eyebrow className="text-cream/60">{t(ui.partners)}</Eyebrow>
              <h2 className="mt-6 font-serif text-[2.2rem] leading-[1.1] md:text-[3rem]">
                {t(s.partnersTitle)}
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ivory/70">
                {t(s.partnersLead)}
              </p>
            </Reveal>

            <ul className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-3">
              {partners.map((p, i) => {
                const inner = (
                  <>
                    <div className="overflow-hidden">
                      <Img src={p.image} alt={p.name} ratio="aspect-[4/3]" className="img-zoom" />
                    </div>
                    <h3 className="mt-5 font-serif text-[26px] text-ivory">{p.name}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-cream/50">
                      {t(p.role)}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-ivory/70">{t(p.body)}</p>
                  </>
                );
                return (
                  <Reveal as="li" key={p.id} delay={i * 90}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer" className="group block">
                        {inner}
                      </a>
                    ) : (
                      <div>{inner}</div>
                    )}
                  </Reveal>
                );
              })}
            </ul>

            <Reveal className="mt-14 border-t border-ivory/15 pt-8">
              <p className="max-w-2xl text-[14px] leading-relaxed text-ivory/55">
                {t(s.partnersNote)}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      <Newsletter tone="dark" />
      <VisitCta />
    </>
  );
}
