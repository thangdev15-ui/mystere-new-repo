import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { ui } from "../lib/ui";
import {
  ArrowLink,
  Eyebrow,
  Newsletter,
  PageHero,
  Prose,
  Reveal,
  VisitCta,
} from "../components/common";
import Img from "../components/Img";

export function CraftIndex() {
  const { content, t } = useStore();
  const c = content.craft;
  const categories = content.categories.filter((x) => x.published);

  return (
    <>
      <PageHero image={c.heroImage} eyebrow="Craft & Products" title={t(c.title)} lead={t(c.lead)} />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 2) * 90}>
              <Link to={`/craft/${cat.slug}`} className="group block">
                <div className="overflow-hidden">
                  <Img
                    src={cat.image}
                    alt={t(cat.name)}
                    label={t(cat.name)}
                    ratio={i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}
                    className="img-zoom"
                  />
                </div>
                <div className="mt-6 flex items-start justify-between gap-6 border-t border-sand pt-5">
                  <div>
                    <h2 className="font-serif text-[32px] leading-none text-charcoal group-hover:text-rust md:text-[40px]">
                      {t(cat.name)}
                    </h2>
                    <p className="mt-3 max-w-md text-[16px] leading-relaxed text-cocoa/80">
                      {t(cat.short)}
                    </p>
                  </div>
                  <span className="mt-2 text-[18px] text-clay transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 grid gap-10 border-t border-sand pt-12 md:grid-cols-2">
          <p className="max-w-xl font-serif text-[22px] leading-snug text-cocoa">{t(c.note)}</p>
          <div className="md:pl-10">
            <ArrowLink to="/visit">{t(ui.visitShop)}</ArrowLink>
          </div>
        </Reveal>
      </section>

      <Newsletter />
      <VisitCta />
    </>
  );
}

export function CategoryPage() {
  const { slug } = useParams();
  const { content, t } = useStore();
  const cat = content.categories.find((c) => c.slug === slug);

  if (!cat || !cat.published) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-48 text-center md:px-12">
        <p className="font-serif text-4xl">Category not found</p>
        <ArrowLink to="/craft" className="mt-8">
          {t(ui.allCategories)}
        </ArrowLink>
      </div>
    );
  }

  const products = content.products.filter((p) => p.categoryId === cat.id && p.published);
  const others = content.categories.filter((c) => c.id !== cat.id && c.published);

  return (
    <>
      <PageHero
        image={cat.image}
        eyebrow={t(ui.nav.craft)}
        title={t(cat.name)}
        lead={t(cat.description)}
      />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-14 md:px-12 md:py-20">
        <Reveal>
          <Eyebrow>{t(ui.selection)}</Eyebrow>
        </Reveal>
        <div className="mt-10 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal as="article" key={p.id} delay={(i % 3) * 80}>
              <div className="group overflow-hidden">
                <Img
                  src={p.image}
                  alt={t(p.name)}
                  label={p.community}
                  ratio="aspect-[4/5]"
                  className="img-zoom"
                />
              </div>
              <h3 className="mt-5 font-serif text-[26px] leading-tight text-charcoal">
                {t(p.name)}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-cocoa/80">{t(p.description)}</p>
              <dl className="mt-5 space-y-2 border-t border-sand pt-4 text-[13px]">
                <div className="flex gap-3">
                  <dt className="w-28 shrink-0 uppercase tracking-[0.18em] text-clay">
                    {t(ui.community)}
                  </dt>
                  <dd className="text-cocoa">{p.community}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-28 shrink-0 uppercase tracking-[0.18em] text-clay">
                    {t(ui.materials)}
                  </dt>
                  <dd className="text-cocoa">{t(p.materials)}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 grid gap-10 border-t border-sand pt-12 md:grid-cols-2">
          <div>
            <Prose text={t(cat.description)} />
          </div>
          <div className="md:pl-10">
            <p className="font-serif text-[24px] leading-snug text-cocoa">{t(content.craft.note)}</p>
            <ArrowLink to="/visit" className="mt-8">
              {t(ui.visitShop)}
            </ArrowLink>
          </div>
        </Reveal>

        {others.length > 0 && (
          <Reveal className="mt-20 border-t border-sand pt-10">
            <Eyebrow className="mb-6">{t(ui.allCategories)}</Eyebrow>
            <ul className="flex flex-wrap gap-x-10 gap-y-3">
              {others.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/craft/${c.slug}`}
                    className="font-serif text-[26px] text-charcoal hover:text-rust"
                  >
                    {t(c.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </section>

      <VisitCta />
    </>
  );
}
