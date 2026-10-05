import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import Img from "../components/Img";
import RichText from "../components/RichText";
import type { Category, L } from "../lib/types";

function CollectionImageStrip({ images, name }: { images: string[]; name: string }) {
  if (!images.length) return null;
  return <div className="category-image-strip" aria-label={`${name} gallery`}>
    {images.map((image, index) => <Img key={`${image}-${index}`} src={image} alt={`${name} ${index + 1}`} ratio="aspect-[4/3]" />)}
  </div>;
}

function CollectionIntro({ category, t, heading = "h2" }: { category: Category; t: (value: L | undefined) => string; heading?: "h1" | "h2" }) {
  const Heading = heading;
  const description = t(category.description) || t(category.short);
  return <>
    <header className="category-topic-heading">
      <Heading>{t(category.name)}</Heading>
    </header>
    <div className="product-detail-media"><Img src={category.image} alt={t(category.name)} ratio="aspect-[3/4]" /></div>
    <div className="product-detail-copy">
      {description && <RichText className="category-description" html={description} />}
    </div>
  </>;
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
      {categories.map((category) => {
        const gallery = category.gallery?.filter(Boolean) ?? [];
        return <section key={category.id} className="product-detail-section category-intro-section">
          <CollectionIntro category={category} t={t} />
          <CollectionImageStrip images={gallery} name={t(category.name)} />
        </section>;
      })}
    </div>
  </article>;
}

export function CategoryPage() {
  const { slug } = useParams();
  const { content, t, lang } = useStore();
  const en = lang === "en";
  const category = content.categories.find((item) => item.slug === slug && item.published);

  if (!category) return <article className="products-page"><div className="products-empty content-width"><h1>{en ? "Collection not found" : "Không tìm thấy bộ sưu tập"}</h1><Link to="/craft" className="project-more">← {en ? "Back to Craft & Products" : "Quay lại Sản phẩm thủ công"}</Link></div></article>;

  const description = t(category.description) || t(category.short);
  // Keep the configured main image on the sheet unless that exact image was
  // also inserted into the editorial content. Supporting images inserted in
  // the editor then flow around the text beside it.
  const hasInlineMainImage = Boolean(category.image && description.includes(category.image));
  return <article className="products-page">
    <section className="category-paper content-width">
      <header className="category-topic-heading"><h1>{t(category.name)}</h1></header>
      <div className="category-paper-content">
        {!hasInlineMainImage && category.image && <Img src={category.image} alt={t(category.name)} ratio="aspect-[3/4]" className="category-paper-fallback-image" />}
        {description && <RichText className="category-description" html={description} />}
      </div>
    </section>
    <div className="products-page-back content-width"><Link to="/craft" className="back-link">← {en ? "Back to Craft & Products" : "Quay lại Sản phẩm thủ công"}</Link></div>
  </article>;
}
