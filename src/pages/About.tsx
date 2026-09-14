import { useStore } from "../store/store";
import { ui } from "../lib/ui";
import { Newsletter, PageHero, Prose, Reveal, VisitCta } from "../components/common";
import Img from "../components/Img";

export default function About() {
  const { content, t } = useStore();
  const a = content.about;

  return (
    <>
      <PageHero image={a.heroImage} eyebrow={t(ui.estd)} title={t(a.title)} lead={t(a.lead)} />

      {/* numbers */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
        <ul className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {a.numbers.map((n, i) => (
            <Reveal as="li" key={n.value + i} delay={i * 80}>
              <p className="font-serif text-[3.5rem] leading-none text-charcoal md:text-[4.5rem]">
                {n.value}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-clay">{t(n.label)}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* editorial blocks, alternating */}
      {a.blocks.map((b, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={i}
            className={i % 2 === 1 ? "bg-cream" : "bg-ivory"}
          >
            <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 py-20 md:grid-cols-12 md:gap-16 md:px-12 md:py-28">
              <Reveal className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
                <div className="group overflow-hidden">
                  <Img src={b.image} ratio="aspect-[4/3]" className="img-zoom" />
                </div>
              </Reveal>
              <div className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
                <Reveal delay={80}>
                  <span className="font-serif text-[13px] tracking-[0.3em] text-clay">
                    0{i + 1}
                  </span>
                  <h2 className="mt-4 font-serif text-[2.2rem] leading-[1.1] text-charcoal md:text-[2.8rem]">
                    {t(b.title)}
                  </h2>
                  <div className="mt-6">
                    <Prose text={t(b.body)} />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <Newsletter />
      <VisitCta />
    </>
  );
}
