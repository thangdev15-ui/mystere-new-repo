import { useState } from "react";
import { useStore } from "../store/store";
import { ui } from "../lib/ui";

export const placeholderLabel = {
  en: "Photograph to be added",
  vi: "Hình ảnh sẽ được bổ sung",
} as const;

interface ImgProps {
  src: string;
  alt?: string;
  /** Tailwind aspect class, e.g. "aspect-[4/5]" */
  ratio?: string;
  className?: string;
  /** Label shown inside the placeholder */
  label?: string;
  priority?: boolean;
}

/**
 * Full-bleed hero image. Fills its (relatively positioned) parent and falls back
 * to a plain charcoal field if the remote image cannot be loaded.
 */
export function HeroImage({
  src,
  mobileSrc,
  alt = "",
  priority = false,
  label,
}: {
  src: string;
  /** Portrait composition supplied specifically for narrow screens. */
  mobileSrc?: string;
  alt?: string;
  priority?: boolean;
  label?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-cocoa">
        {label && <span className="font-serif text-[15px] text-ivory/60">{label}</span>}
      </div>
    );
  }
  const image = (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className="h-full w-full object-cover"
    />
  );
  return mobileSrc ? <picture className="block h-full w-full"><source media="(max-width: 680px)" srcSet={mobileSrc} />{image}</picture> : image;
}

/**
 * Renders a real photograph, or — when the client has not supplied one — a
 * quiet, clearly-marked placeholder tile. Never stretches or distorts.
 */
export default function Img({
  src,
  alt = "",
  ratio = "aspect-[4/5]",
  className = "",
  label,
  priority = false,
}: ImgProps) {
  const { t, lang } = useStore();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        className={`flex ${ratio} w-full flex-col items-center justify-center gap-2 border border-sand bg-cream/70 ${className}`}
      >
        <span className="font-serif text-[15px] text-cocoa/45">{label || ""}</span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-clay/60">
          {lang === "vi" ? placeholderLabel.vi : placeholderLabel.en}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || t(ui.imageAlt)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`${ratio} w-full object-cover ${className}`}
    />
  );
}
