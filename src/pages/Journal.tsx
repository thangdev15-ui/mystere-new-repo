import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { formatDate, ui } from "../lib/ui";
import {
  ArrowLink,
  Eyebrow,
  Newsletter,
  Prose,
  Reveal,
  VisitCta,
} from "../components/common";
import Img, { HeroImage } from "../components/Img";

export function JournalIndex() {
  const { content, t, lang } = useStore();
  const articles = content.articles.filter((a) => a.published);

  return (
    <>
      <header className="border-b border-sand/70 pt-32 md:pt-40">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-14 md:px-12 md:pb-20">
          <Reveal>
            <Eyebrow>Mystère — Huyền Bí</Eyebrow>
            <h1 className="mt-6 font-serif text-[3rem] leading-none text-charcoal md:text-[5.5rem]">
              {t(content.journal.title)}
            </h1>
            <p className="mt-8 max-w-2xl font-serif text-[22px] leading-[1.6] text-cocoa md:text-[26px]">
              {t(content.journal.lead)}
            </p>
          </Reveal>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-12 md:py-24">
        <ul className="space-y-20">
          {articles.map((a, i) => (
            <Reveal as="li" key={a.id} delay={(i % 2) * 80}>
              <Link to={`/journal/${a.slug}`} className="group grid gap-8 md:grid-cols-12 md:gap-14">
                <div className="overflow-hidden md:col-span-7">
                  <Img src={a.cover} ratio="aspect-[16/10]" className="img-zoom" />
                </div>
                <div className="md:col-span-5 md:pt-4">
                  {a.date && (
                    <p className="text-[11px] uppercase tracking-[0.26em] text-clay">
                      {formatDate(a.date, lang)}
                    </p>
                  )}
                  <h2 className="mt-4 font-serif text-[32px] leading-[1.1] text-charcoal group-hover:text-rust md:text-[42px]">
                    {t(a.title)}
                  </h2>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-cocoa/80">
                    {t(a.excerpt)}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-charcoal">
                    <span className="border-b border-current pb-1">{t(ui.readMore)}</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <Newsletter />
      <VisitCta />
    </>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const { content, t, lang } = useStore();
  const a = content.articles.find((x) => x.slug === slug);

  if (!a || !a.published) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-48 text-center md:px-12">
        <p className="font-serif text-4xl">Article not found</p>
        <ArrowLink to="/journal" className="mt-8">
          {t(ui.allArticles)}
        </ArrowLink>
      </div>
    );
  }

  const others = content.articles.filter((x) => x.id !== a.id && x.published).slice(0, 2);

  return (
    <>
      <div className="relative h-[58vh] min-h-[380px] w-full overflow-hidden bg-cocoa md:h-[70vh]">
        <HeroImage src={a.cover} priority />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-12 md:pb-16">
          {a.date && <Eyebrow className="text-ivory/70">{formatDate(a.date, lang)}</Eyebrow>}
          <h1 className="mt-5 max-w-4xl font-serif text-[2.4rem] leading-[1.05] text-ivory md:text-[4.2rem]">
            {t(a.title)}
          </h1>
        </div>
      </div>

      <article className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-clay">
              {t(content.journal.title)}
            </p>
            {a.date && <p className="mt-3 text-[13px] text-cocoa/70">{formatDate(a.date, lang)}</p>}
          </Reveal>
          <Reveal delay={80} className="md:col-span-8">
            <p className="font-serif text-[24px] leading-[1.55] text-cocoa md:text-[28px]">
              {t(a.excerpt)}
            </p>
            <div className="mt-10">
              <Prose text={t(a.body)} className="[&>p]:text-[18px]" />
            </div>
          </Reveal>
        </div>

        {a.gallery.length > 0 && (
          <div className="mt-20 grid gap-6 sm:grid-cols-3">
            {a.gallery.map((g, i) => (
              <Reveal as="figure" key={i} delay={i * 80} className="group overflow-hidden">
                <Img src={g} ratio="aspect-[3/4]" className="img-zoom" />
              </Reveal>
            ))}
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-24 border-t border-sand pt-12">
            <Eyebrow className="mb-8">{t(ui.allArticles)}</Eyebrow>
            <ul className="grid gap-10 md:grid-cols-2">
              {others.map((o) => (
                <li key={o.id}>
                  <Link to={`/journal/${o.slug}`} className="group flex gap-6">
                    <div className="w-32 shrink-0 overflow-hidden">
                      <Img src={o.cover} ratio="aspect-square" className="img-zoom" />
                    </div>
                    <div>
                      {o.date && (
                        <p className="text-[11px] uppercase tracking-[0.22em] text-clay">
                          {formatDate(o.date, lang)}
                        </p>
                      )}
                      <h3 className="mt-2 font-serif text-[24px] leading-tight text-charcoal group-hover:text-rust">
                        {t(o.title)}
                      </h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <VisitCta />
    </>
  );
}
