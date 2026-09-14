import type { L } from "./types";

export const ui = {
  brand: "Mystère",
  brandFull: "Mystère Shop",
  brandVi: "Huyền Bí",
  tagline: { en: "The Vietnamese Refinement", vi: "Tinh hoa Việt Nam" } as L,
  nav: {
    home: { en: "Home", vi: "Trang chủ" } as L,
    about: { en: "About Us", vi: "Về chúng tôi" } as L,
    story: { en: "Our Story", vi: "Câu chuyện" } as L,
    craft: { en: "Craft & Products", vi: "Nghề & Sản phẩm" } as L,
    journal: { en: "Journal", vi: "Nhật ký" } as L,
    visit: { en: "Visit Us", vi: "Ghé thăm" } as L,
  },
  visitShop: { en: "Visit the Shop", vi: "Ghé thăm cửa hiệu" } as L,
  readMore: { en: "Read the story", vi: "Đọc câu chuyện" } as L,
  discover: { en: "Discover", vi: "Khám phá" } as L,
  allCommunities: { en: "All communities", vi: "Tất cả cộng đồng" } as L,
  allCategories: { en: "All categories", vi: "Tất cả danh mục" } as L,
  allArticles: { en: "All journal entries", vi: "Tất cả bài viết" } as L,
  community: { en: "Community", vi: "Cộng đồng" } as L,
  materials: { en: "Materials", vi: "Chất liệu" } as L,
  region: { en: "Region", vi: "Vùng" } as L,
  craftLabel: { en: "Craft", vi: "Nghề" } as L,
  selection: { en: "A selection from the shop", vi: "Một vài món trong cửa hiệu" } as L,
  notForSaleOnline: {
    en: "Not sold online — available to see in the shop on Dong Khoi Street.",
    vi: "Không bán trực tuyến — có thể xem trực tiếp tại cửa hiệu trên đường Đồng Khởi.",
  } as L,
  email: { en: "Email address", vi: "Địa chỉ email" } as L,
  name: { en: "Name (optional)", vi: "Tên (không bắt buộc)" } as L,
  required: { en: "required", vi: "bắt buộc" } as L,
  back: { en: "Back", vi: "Quay lại" } as L,
  openingHours: { en: "Opening hours", vi: "Giờ mở cửa" } as L,
  phone: { en: "Phone", vi: "Điện thoại" } as L,
  zalo: { en: "Zalo / WhatsApp", vi: "Zalo / WhatsApp" } as L,
  address: { en: "Address", vi: "Địa chỉ" } as L,
  googleMaps: { en: "Google Maps", vi: "Google Maps" } as L,
  follow: { en: "Follow", vi: "Theo dõi" } as L,
  admin: { en: "Admin", vi: "Quản trị" } as L,
  estd: { en: "Est. 2001 — Saigon", vi: "Thành lập 2001 — Sài Gòn" } as L,
  imageAlt: { en: "Mystère Shop", vi: "Mystère Shop" } as L,
  published: { en: "Published", vi: "Hiển thị" } as L,
  partners: { en: "Partners & projects", vi: "Đối tác & dự án" } as L,
  ourProjects: { en: "Our projects", vi: "Dự án của chúng tôi" } as L,
  learnMore: { en: "Learn more", vi: "Tìm hiểu thêm" } as L,
  rights: {
    en: "All rights reserved.",
    vi: "Bảo lưu mọi quyền.",
  } as L,
};

export function formatDate(iso: string, lang: "en" | "vi") {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
