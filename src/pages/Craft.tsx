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

function CollectionIntro({ category, en, t, heading = "h2" }: { category: Category; en: boolean; t: (value: L | undefined) => string; heading?: "h1" | "h2" }) {
  const Heading = heading;
  const description = t(category.description) || t(category.short);
  return <>
    <div className="product-detail-media"><Img src={category.image} alt={t(category.name)} ratio="aspect-[3/4]" /></div>
    <div className="product-detail-copy">
      <p className="kicker">{en ? "Craft collection" : "Bộ sưu tập thủ công"}</p>
      <Heading>{t(category.name)}</Heading>
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
          <CollectionIntro category={category} en={en} t={t} />
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

  const products = content.products.filter((product) => product.categoryId === category.id && product.published);
  const gallery = category.gallery?.filter(Boolean) ?? [];
  return <article className="products-page">
    <section className="product-detail-section content-width product-detail-hero category-intro-section">
      <CollectionIntro category={category} en={en} t={t} heading="h1" />
      <CollectionImageStrip images={gallery} name={t(category.name)} />
    </section>
    <section className="product-collection content-width">
      <div className="projects-heading"><h2>{en ? "Selected pieces" : "Sản phẩm chọn lọc"}</h2><span>{en ? "Made by hand" : "Làm bằng tay"}</span></div>
      {products.length ? <div className="product-collaboration-list">{products.map((product) => <article key={product.id} className="product-collaboration-row"><Img src={product.image} alt={t(product.name)} ratio="aspect-[3/2]" className="product-collaboration-image" /><div><p className="kicker">{product.community}</p><h2>{t(product.name)}</h2><p>{t(product.description)}</p><Link className="project-more" to={`/craft/${category.slug}/${product.id}`}>{en ? "More about" : "Xem thêm"} <span aria-hidden="true">↗</span></Link></div></article>)}</div> : <p className="product-empty-note">{en ? "Pieces will be added to this collection soon." : "Sản phẩm sẽ sớm được bổ sung vào bộ sưu tập này."}</p>}
    </section>
    <div className="products-page-back content-width"><Link to="/craft" className="back-link">← {en ? "Back to Craft & Products" : "Quay lại Sản phẩm thủ công"}</Link></div>
  </article>;
}

export function ProductPage() {
  const { slug, productId } = useParams();
  const { content, t, lang } = useStore();
  const en = lang === "en";
  const category = content.categories.find((item) => item.slug === slug);
  const product = content.products.find((item) => item.id === productId && item.published);
  if (!category || !product) return <article className="products-page"><div className="products-empty content-width"><h1>{en ? "Product not found" : "Không tìm thấy sản phẩm"}</h1><Link to="/craft" className="project-more">← {en ? "Back to Craft & Products" : "Quay lại Sản phẩm thủ công"}</Link></div></article>;
  const gallery = product.gallery?.filter(Boolean) ?? [];
  return <article className="projects-page product-page">
    <section className="project-detail-section content-width">
      <div className="project-detail-media"><Img src={product.image} alt={t(product.name)} ratio="aspect-[4/3]" priority /></div>
      <div className="project-detail-copy"><p className="kicker">{t(category.name)}</p><h1>{t(product.name)}</h1><p>{t(product.description)}</p></div>
      <div className="project-detail-prose"><p className="kicker">{en ? "Product story" : "Câu chuyện sản phẩm"}</p><RichText html={t(product.story ?? product.description)} /></div>
      <aside className="project-detail-aside"><div><p className="kicker">{en ? "Materials" : "Chất liệu"}</p><p>{t(product.materials)}</p></div><Link to="/#contact" className="contact-project-link">{en ? "Contact us for more information" : "Liên hệ để biết thêm thông tin"} <span aria-hidden="true">→</span></Link></aside>
      {!!gallery.length && <div className="project-detail-gallery">{gallery.map((image, index) => <Img key={`${image}-${index}`} src={image} alt={`${t(product.name)} ${index + 2}`} ratio="aspect-[4/3]" />)}</div>}
    </section>
    <div className="projects-page-back content-width"><Link to={`/craft/${category.slug}`} className="back-link">← {en ? "Back to collection" : "Quay lại bộ sưu tập"}</Link></div>
  </article>;
}
