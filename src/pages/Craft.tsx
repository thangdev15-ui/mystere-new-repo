import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import Img from "../components/Img";

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
      {categories.map((category) => <section key={category.id} className="product-detail-section">
        <div className="product-detail-media"><Img src={category.image} alt={t(category.name)} ratio="aspect-[3/4]" /></div>
        <div className="product-detail-copy"><p className="kicker">{en ? "Craft collection" : "Bộ sưu tập thủ công"}</p><h2>{t(category.name)}</h2><p>{t(category.short)}</p></div>
        <div className="product-detail-prose"><p>{t(category.description)}</p></div>
        <Link className="project-more product-detail-link" to={`/craft/${category.slug}`}>{en ? "Explore the collection" : "Khám phá bộ sưu tập"} <span aria-hidden="true">→</span></Link>
      </section>)}
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
  return <article className="products-page">
    <section className="product-detail-section content-width product-detail-hero">
      <div className="product-detail-media"><Img src={category.image} alt={t(category.name)} ratio="aspect-[3/4]" priority /></div>
      <div className="product-detail-copy"><p className="kicker">{en ? "Craft collection" : "Bộ sưu tập thủ công"}</p><h1>{t(category.name)}</h1><p>{t(category.short)}</p></div>
      <div className="product-detail-prose"><p>{t(category.description)}</p></div>
    </section>
    <section className="product-collection content-width">
      <div className="projects-heading"><h2>{en ? "Selected pieces" : "Sản phẩm chọn lọc"}</h2><span>{en ? "Made by hand" : "Làm bằng tay"}</span></div>
      {products.length ? <div className="product-collection-grid">{products.map((product) => <article key={product.id}><Img src={product.image} alt={t(product.name)} ratio="aspect-[4/5]" /><div><p className="kicker">{product.community}</p><h2>{t(product.name)}</h2><p>{t(product.description)}</p><dl><div><dt>{en ? "Materials" : "Chất liệu"}</dt><dd>{t(product.materials)}</dd></div></dl></div></article>)}</div> : <p className="product-empty-note">{en ? "Pieces will be added to this collection soon." : "Sản phẩm sẽ sớm được bổ sung vào bộ sưu tập này."}</p>}
    </section>
    <div className="products-page-back content-width"><Link to="/craft" className="back-link">← {en ? "Back to Craft & Products" : "Quay lại Sản phẩm thủ công"}</Link></div>
  </article>;
}
