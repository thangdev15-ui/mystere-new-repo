import { useStore } from "../store/store";
import { ui } from "../lib/ui";
import { Eyebrow, Reveal } from "../components/common";
import { HeroImage } from "../components/Img";

export default function Visit() {
  const { content, t } = useStore();
  const c = content.contact;

  return (
    <>
      <section className="relative h-[72vh] min-h-[440px] w-full overflow-hidden bg-charcoal">
        <HeroImage src={c.image} alt="Mystère Shop, 141 Dong Khoi Street" priority />
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-12 md:pb-16">
          <h1 className="font-serif text-[2.8rem] leading-none text-ivory md:text-[5rem]">
            Mystère Shop
          </h1>
          <p className="mt-4 font-serif text-[22px] italic text-ivory/85 md:text-[28px]">
            {t(ui.tagline)}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <Eyebrow>{t(ui.address)}</Eyebrow>
            <address className="mt-6 font-serif text-[28px] not-italic leading-[1.35] text-charcoal md:text-[34px]">
              {c.addressLines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </address>
            <a
              href={c.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-charcoal hover:text-rust"
            >
              <span className="border-b border-current pb-1">{t(ui.googleMaps)}</span>
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
          </Reveal>

          <Reveal delay={100} className="md:col-span-4">
            <Eyebrow>{t(ui.phone)}</Eyebrow>
            <p className="mt-5 font-serif text-[28px] text-charcoal">{c.phone}</p>

            <Eyebrow className="mt-10">{t(ui.zalo)}</Eyebrow>
            <p className="mt-5 font-serif text-[28px] text-charcoal">{c.zalo}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-clay">
              {c.displayName.en}
            </p>

            <Eyebrow className="mt-10">Email</Eyebrow>
            <a
              href={`mailto:${c.email}`}
              className="mt-5 block font-serif text-[24px] text-charcoal hover:text-rust"
            >
              {c.email}
            </a>
          </Reveal>

          <Reveal delay={180} className="md:col-span-3">
            <Eyebrow>{t(ui.openingHours)}</Eyebrow>
            <p className="mt-5 font-serif text-[28px] leading-tight text-charcoal">{t(c.hours)}</p>

            <Eyebrow className="mt-10">{t(ui.follow)}</Eyebrow>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={c.instagram}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-[24px] text-charcoal hover:text-rust"
              >
                Instagram
              </a>
              <a
                href={c.facebook}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-[24px] text-charcoal hover:text-rust"
              >
                Facebook
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20 border-t border-sand pt-6">
          <p className="text-[12px] text-cocoa/50">{t(c.note)}</p>
        </Reveal>
      </section>
    </>
  );
}
