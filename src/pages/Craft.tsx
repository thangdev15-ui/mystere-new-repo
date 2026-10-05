import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import Img from "../components/Img";
import RichText from "../components/RichText";
import { craftSheets } from "../data/craftSheets";
import type { Category, L } from "../lib/types";

function CollectionImageStrip({ images, name }: { images: string[]; name: string }) {
  if (!images.length) return null;
  return <div className="category-image-strip" aria-label={`${name} gallery`}>
    {images.map((image, index) => <Img key={`${image}-${index}`} src={image} alt={`${name} ${index + 1}`} ratio="aspect-[4/3]" />)}
  </div>;
}

function CollectionIntro({ category, t, heading = "h2" }: { category: Category; t: (value: L | undefined) => string; heading?: "h1" | "h2" }) {
  const Heading = heading;
  const sheet = t(category.pageImage) || category.pageImage?.en;
  if (sheet) {
    const dimensions = craftSheets.find(item => item.src === sheet);
    return <section className="craft-approved-sheet" aria-label={t(category.name)}>
      <Heading className="sr-only">{t(category.name)}</Heading>
      <a href={sheet} target="_blank" rel="noopener noreferrer" aria-label={`${t(category.name)} — full-size image`}>
        <img src={sheet} alt={t(category.name)} width={dimensions?.width} height={dimensions?.height} loading="lazy" decoding="async" />
      </a>
    </section>;
  }
  const description = t(category.description) || t(category.short);
  const hasInlineImage = /<img[\s>]/i.test(description);
  return <section className="category-paper">
    <header className="category-topic-heading"><Heading>{t(category.name)}</Heading></header>
    <div className="category-paper-content">
      {!hasInlineImage && category.image && <Img src={category.image} alt={t(category.name)} ratio="" className="category-paper-fallback-image" />}
      {description && <RichText className="category-description" html={description} />}
    </div>
    <CollectionImageStrip images={category.gallery?.filter(Boolean) ?? []} name={t(category.name)} />
  </section>;
}

export function CraftIndex() {
  const { content, t, lang } = useStore();
  const en = lang === "en";
  const categories = content.categories.filter((category) => category.published);

  return <article className="products-page">
    <header className="projects-page-hero content-width">
      <p className="section-label">{en ? "Craft & Products" : "Sản phẩm thủ công"}</p>
      <h1>{t(content.craft.title)}</h1>
      <p>{t(content.craft.lead)}</p>
    </header>
    <div className="products-page-list content-width">
      {categories.map(category => <CollectionIntro key={category.id} category={category} t={t} />)}
    </div>
  </article>;
}

export function CategoryPage() {
  const { slug } = useParams();
  const { content, t, lang } = useStore();
  const en = lang === "en";
  const category = content.categories.find((item) => item.slug === slug && item.published);

  if (!category) return <article className="products-page"><div className="products-empty content-width"><h1>{en ? "Collection not found" : "Không tìm thấy bộ sưu tập"}</h1><Link to="/craft" className="project-more">← {en ? "Back to Craft & Products" : "Quay lại Sản phẩm thủ công"}</Link></div></article>;

  return <article className="products-page">
    <div className="products-page-list content-width">
      <CollectionIntro category={category} t={t} heading="h1" />
    </div>
    <div className="products-page-back content-width"><Link to="/craft" className="back-link">← {en ? "Back to Craft & Products" : "Quay lại Sản phẩm thủ công"}</Link></div>
  </article>;
}
