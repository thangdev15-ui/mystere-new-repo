import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { ui, formatDate } from "../lib/ui";
import {
  ArrowLink,
  Eyebrow,
  Newsletter,
  Prose,
  Reveal,
  SectionHeading,
  VisitCta,
} from "../components/common";
import Img, { HeroImage } from "../components/Img";

export default function Home() {
  const { content, t, lang } = useStore();
  const h = content.home;
  const communities = content.communities.filter((c) => c.published);
  const categories = content.categories.filter((c) => c.published);
  const articles = content.articles.filter((a) => a.published);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-charcoal">
        <HeroImage src={h.heroImage} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/25 to-charcoal/75" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-12 md:pb-24">
            <Reveal>
              <Eyebrow className="text-ivory/75">{t(h.heroEyebrow)}</Eyebrow>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 font-serif text-[3.4rem] leading-[0.95] text-ivory md:text-[7rem] lg:text-[8.5rem]">
                Mystère Shop
              </h1>
            </Reveal>
            <Reveal
              delay={240}
              className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <p className="font-serif text-2xl italic text-ivory/90 md:text-[2rem]">
                  {t(ui.tagline)}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.34em] text-ivory/60">
                  Huyền Bí — Saigon
                </p>
              </div>
              <Link
                to="/our-story"
                className="group inline-flex w-fit items-center gap-4 border border-ivory/50 px-9 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:bg-ivory hover:text-charcoal"
              >
                {t(h.heroCta)}
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 1 · MISSION */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12 md:py-36">
        <div className="grid gap-14 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-7">
            <SectionHeading eyebrow={t(ui.tagline)} title={t(h.intro.title)} />
            <Reveal delay={100} className="mt-10 max-w-xl">
              <Prose text={t(h.intro.body)} />
              <ArrowLink to="/about" className="mt-10">
                {t(ui.nav.about)}
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={150} className="md:col-span-5">
            <div className="group overflow-hidden">
              <Img src={h.intro.image} ratio="aspect-[4/5]" className="img-zoom" priority />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 · 25 YEARS */}
      <section className="bg-cream">
        <div className="mx-auto grid w-full max-w-[1400px] gap-14 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
          <Reveal className="md:col-span-6">
            <div className="group overflow-hidden">
              <Img src={h.anniversary.image} ratio="aspect-[4/5]" className="img-zoom" />
            </div>
          </Reveal>
          <div className="md:col-span-6 md:pl-10">
            <Reveal>
              <span className="font-serif text-[7rem] leading-none text-clay/40 md:text-[10rem]">
                25
              </span>
              <h2 className="-mt-4 font-serif text-4xl leading-[1.1] text-charcoal md:text-5xl">
                {t(h.anniversary.title)}
              </h2>
            </Reveal>
            <Reveal delay={100} className="mt-8 max-w-xl">
              <Prose text={t(h.anniversary.body)} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 · ARTISAN STORY */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12 md:py-36">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:pt-10">
            <Reveal>
              <Eyebrow>Red Dao — Ms. Lý May Pét</Eyebrow>
              <h2 className="mt-6 font-serif text-4xl leading-[1.08] text-charcoal md:text-[3.4rem]">
                {t(h.artisan.title)}
              </h2>
            </Reveal>
            <Reveal delay={100} className="mt-8">
              <Prose text={t(h.artisan.body)} />
              <blockquote className="mt-10 border-l border-clay pl-6">
                <p className="font-serif text-2xl italic leading-snug text-cocoa md:text-[1.7rem]">
                  “{t(h.artisan.quote)}”
                </p>
                <footer className="mt-4 text-[11px] uppercase tracking-[0.26em] text-clay">
                  {t(h.artisan.quoteAuthor)}
                </footer>
              </blockquote>
              <ArrowLink to="/our-story" className="mt-10">
                {t(ui.readMore)}
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={150} className="md:col-span-7">
            <div className="group overflow-hidden">
              <Img
                src={h.artisan.image}
                ratio="aspect-[4/5] md:aspect-[4/4.4]"
                className="img-zoom"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 · OUR PROJECTS / COMMUNITIES */}
      <section className="border-t border-sand/70 bg-ivory">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
          <SectionHeading
            eyebrow="Cao Bằng · Hà Giang · Sa Pa"
            title={t(h.projectsIntro.title)}
            lead={t(h.projectsIntro.body)}
          />
          <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c, i) => (
              <Reveal as="li" key={c.id} delay={(i % 3) * 90}>
                <Link to={`/our-story#${c.slug}`} className="group block">
                  <div className="overflow-hidden">
                    <Img src={c.image} alt={c.name} ratio="aspect-[3/4]" className="img-zoom" />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-[26px] text-charcoal">{c.name}</h3>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-clay">
                      {t(c.region)}
                    </span>
                  </div>
                  <p className="mt-2 font-serif text-[19px] italic text-cocoa/80">{t(c.title)}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-cocoa/70">{t(c.line)}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 5 · THE THREAD THAT CONNECTS */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-14 px-6 py-24 md:grid-cols-12 md:gap-16 md:px-12 md:py-32">
          <div className="md:col-span-6">
            <Reveal>
              <Eyebrow className="text-cream/60">{t(ui.ourProjects)}</Eyebrow>
              <h2 className="mt-6 font-serif text-4xl leading-[1.1] md:text-[3.4rem]">
                {t(h.thread.title)}
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.85] text-ivory/75">
                {t(h.thread.body)}
              </p>
              <ArrowLink to="/craft" className="mt-10" light>
                {t(ui.nav.craft)}
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={120} className="md:col-span-6">
            <div className="group overflow-hidden">
              <Img src={h.thread.image} ratio="aspect-[4/3]" className="img-zoom" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 · CRAFT & PRODUCTS */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
        <SectionHeading title={t(h.craftIntro.title)} lead={t(h.craftIntro.body)} />
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 2) * 100}>
              <Link to={`/craft/${cat.slug}`} className="group block">
                <div className="overflow-hidden">
                  <Img src={cat.image} alt={t(cat.name)} ratio="aspect-[16/11]" className="img-zoom" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-sand pt-4">
                  <h3 className="font-serif text-[28px] text-charcoal group-hover:text-rust md:text-[32px]">
                    {t(cat.name)}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-clay">
                    {t(cat.short)}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14">
          <ArrowLink to="/craft">{t(ui.allCategories)}</ArrowLink>
        </Reveal>
      </section>

      {/* 7 · JOURNAL */}
      <section className="border-t border-sand/70 bg-cream/60">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
          <SectionHeading title={t(h.journalIntro.title)} lead={t(h.journalIntro.body)} />
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            {articles.slice(0, 2).map((a, i) => (
              <Reveal key={a.id} delay={i * 100}>
                <Link to={`/journal/${a.slug}`} className="group block">
                  <div className="overflow-hidden">
                    <Img src={a.cover} ratio="aspect-[3/2]" className="img-zoom" />
                  </div>
                  {a.date && (
                    <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-clay">
                      {formatDate(a.date, lang)}
                    </p>
                  )}
                  <h3 className="mt-3 font-serif text-[30px] leading-tight text-charcoal group-hover:text-rust">
                    {t(a.title)}
                  </h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-cocoa/80">
                    {t(a.excerpt)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14">
            <ArrowLink to="/journal">{t(ui.allArticles)}</ArrowLink>
          </Reveal>
        </div>
      </section>

      <Newsletter />
      <VisitCta />
    </>
  );
}
