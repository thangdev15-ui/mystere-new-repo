import type { SiteContent } from "../lib/types";

/* ------------------------------------------------------------------ *
 * REAL CLIENT ASSETS — Google Drive (Mystère Shop folder)
 * https://drive.google.com/drive/folders/1GZPZx5HQ4rUdcUzPOgLh8tsR9889WREP
 *
 * Files are served directly from the client's Drive through the public
 * thumbnail endpoint so they stay in sync with the source folder.
 * Every asset below is a real file supplied by Mystère Shop.
 * ------------------------------------------------------------------ */
/**
 * Public CDN URL for a file in the client's shared Drive folder.
 * Files stay in the client's folder, so any update there is reflected on the site.
 * `w` requests the render width — Google serves an appropriately sized copy.
 */
const drive = (id: string, w = 1400) =>
  `https://lh3.googleusercontent.com/d/${id}=s${w}`;

/** 1. Kỷ niệm 25 năm — 25th anniversary */
const IMG_25 = drive("1YRSTf3nEwuE28zNL93hwN6khgl5zSEJt");
/** 2. Về chúng tôi — About us */
const IMG_ABOUT = drive("1WTrl0Uh0fHLZDlnP2dvLh4qD5_JiDnn7");
/** 3. HỘI CHỢ THỦ CÔNG TRUYỀN THỐNG — Traditional Handicraft Fair */
const IMG_FAIR = drive("1GlqZrAdk2xpP5iDqkFKv-CcN0nYmGgKx");
/** 4. Về DECEN */
const IMG_DECEN = drive("1dpPDR8wnTM6h_KbJK2Hv_7yY1C2n_iPi");
/** 5. VỀ DỰ ÁN LIVE */
const IMG_LIVE_VN = drive("13No_X2LHEupPLpaYBZd3Zz4Smklu5RzA");
/** 6. GIA ĐÌNH NGƯỜI DAO ĐỎ — The Red Dao family */
const IMG_REDDAO_FAMILY_VN = drive("1Nk-1AOnhOMu5sc-u0BTzQoyYw_ITK0lN");
/** 7. Ý nghĩa màu sắc — The meaning of colour */
const IMG_COLOUR = drive("1U8D_rqOdgcHa8P3k4csXewiFZJy4bX4j");
/** HAPPY AN (3) */
const IMG_HAPPY_AN = drive("1xnKHLZ9pyPImdf9rIVryBfIE_trP1FUo");
/** LIVE PROJECT */
const IMG_LIVE_PROJECT = drive("1lpKcgZzxlsBJhMA2Hazgb85QkxiQdhGb");
/** Red Dao's family */
const IMG_REDDAO_FAMILY = drive("1g8jxhr1NKHeiMFGRS3YCvOXjXRTjfBSW");

/** Placeholder used only where the client has not yet supplied a photograph. */
const PLACEHOLDER = "";

export const defaultContent: SiteContent = {
  events: [
    {
      id: "cao-bang-day-2012",
      image: "/images/event-2012.jpg",
      url: "",
      title: { en: "Cao Bang Day Traditional Handicraft Bazaar", vi: "Hội chợ Thổ cẩm Truyền thống, Văn hóa và Du lịch Cao Bằng" },
      dateLabel: { en: "11 November 2012", vi: "11 tháng 11, 2012" },
      dateStart: "2012-11-11",
      schedule: { en: "9:30–16:00", vi: "9:30–16:00" },
      venue: "Renaissance Riverside Hotel Saigon",
      address: { en: "8–15 Tôn Đức Thắng, District 1, Ho Chi Minh City", vi: "8–15 Tôn Đức Thắng, Quận 1, TP.HCM" },
      published: true,
    },
    {
      id: "handicraft-bazaar-2014",
      image: "/images/event-2014.jpg",
      url: "",
      title: { en: "Traditional Handicraft Bazaar", vi: "Hội chợ Thủ công Truyền thống" },
      dateLabel: { en: "8–9 November 2014", vi: "8–9 tháng 11, 2014" },
      dateStart: "2014-11-08",
      schedule: { en: "Night Bazaar · 8 November, 17:00–21:00\nDay Bazaar · 9 November, 9:00–16:00", vi: "Hội chợ đêm · 8/11, 17:00–21:00\nHội chợ ban ngày · 9/11, 9:00–16:00" },
      venue: "Renaissance Riverside Hotel Saigon",
      address: { en: "8–15 Tôn Đức Thắng, Bến Nghé, District 1, Ho Chi Minh City", vi: "8–15 Tôn Đức Thắng, Bến Nghé, Quận 1, TP.HCM" },
      published: true,
    },
    {
      id: "handicraft-bazaar-2013",
      image: "/images/event-2013.jpg",
      url: "",
      title: { en: "Traditional Handicraft Bazaar · The Second Event", vi: "Ngày hội Thổ cẩm Cao Bằng lần thứ 2" },
      dateLabel: { en: "10 November 2013", vi: "10 tháng 11, 2013" },
      dateStart: "2013-11-10",
      schedule: { en: "9:30–16:00", vi: "9:30–16:00" },
      venue: "Renaissance Riverside Hotel Saigon",
      address: { en: "8–15 Tôn Đức Thắng, Ho Chi Minh City", vi: "8–15 Tôn Đức Thắng, TP.HCM" },
      published: true,
    },
  ],
  home: {
    heroImage: "/images/Banner.png",
    heroEyebrow: { en: "25 Years — Est. 2001", vi: "25 Năm — Thành lập 2001" },
    heroCta: { en: "Discover Our Story", vi: "Khám phá câu chuyện" },
    intro: {
      title: {
        en: "The Vietnamese Refinement, rooted in people and place",
        vi: "Tinh hoa Việt Nam, bắt nguồn từ con người và vùng đất",
      },
      body: {
        en: "Mystère Shop “The Vietnamese Refinement” at 141 Dong Khoi Street, District 1 in Ho Chi Minh City is an excellent location for buying finest handicraft made by the ethnic minorities of Vietnam. You will enjoy your shopping in a friendly and unique atmosphere.\n\nWe trade finest tribal art hand made from ethnic families of Red Dao, Money Dao, Nung, H’Mong and Black Lolo from the mountainous regions Cao Bang, Ha Giang and Sapa of northern Vietnam.",
        vi: "Shop Huyền Bí — “Tinh hoa Việt Nam” — tại 141 Đồng Khởi, Quận 1, Thành phố Hồ Chí Minh là nơi bạn có thể tìm thấy những sản phẩm thủ công tinh túy của các dân tộc thiểu số Việt Nam trong một không gian thân thiện và độc đáo.\n\nChúng tôi giới thiệu nghệ thuật và nghề thủ công do các gia đình Dao Đỏ, Dao Tiền, Nùng, H’Mông và Lô Lô Đen ở Cao Bằng, Hà Giang và Sa Pa làm nên.",
      },
      image: "/images/nguoidantoc.png",
    },
    anniversary: {
      title: { en: "25 years in Saigon", vi: "25 năm ở Sài Gòn" },
      body: {
        en: "Mystère Shop opened at 141 Dong Khoi Street in 2001. In 2026 the shop turns twenty-five — a quarter of a century of visits north, of work ordered, collected and carried back, of relationships that outlasted their first projects.\n\nNothing here was planned as a campaign. One conversation at the Vietnam Museum of Ethnology turned into fifteen years with one family, and that became the way the shop works.",
        vi: "Mystère Shop mở cửa tại 141 Đồng Khởi vào năm 2001. Năm 2026, cửa hiệu tròn hai mươi lăm tuổi — một phần tư thế kỷ của những chuyến đi lên miền núi, của những đơn hàng được đặt, nhận và mang về, của những mối quan hệ bền hơn cả dự án ban đầu.\n\nKhông có gì ở đây được lên kế hoạch như một chiến dịch. Một cuộc trò chuyện tại Bảo tàng Dân tộc học Việt Nam đã trở thành mười lăm năm với một gia đình, và đó trở thành cách cửa hiệu này làm việc.",
      },
      image: IMG_25,
    },
    artisan: {
      title: {
        en: "A friendship that became a journey",
        vi: "Một tình bạn trở thành hành trình",
      },
      body: {
        en: "It started at a small fair for ethnic minority artisans, at the Vietnam Museum of Ethnology in Hanoi - a chance meeting with Ms. Lý May Pét. What began as a conversation grew, over fifteen years, into something closer to family. That single encounter opened the door to a community, and to a journey that has now lasted 25 years.",
        vi: "Tất cả bắt đầu tại một hội chợ nhỏ dành cho nghệ nhân dân tộc thiểu số, ở Bảo tàng Dân tộc học Việt Nam, Hà Nội — một cuộc gặp gỡ tình cờ với bà Lý May Pét. Điều bắt đầu từ một cuộc trò chuyện đã lớn lên, qua mười lăm năm, thành điều gì đó gần như ruột thịt. Cuộc gặp gỡ ấy mở ra cánh cửa đến một cộng đồng, và đến một hành trình đã kéo dài 25 năm.",
      },
      quote: {
        en: "There is more to this story — the kind best told over a cup of tea, at the shop.",
        vi: "Câu chuyện này còn dài lắm — kiểu câu chuyện nên được kể bên một chén trà, tại cửa hiệu.",
      },
      quoteAuthor: {
        en: "Mystère Shop — 141 Dong Khoi Street",
        vi: "Mystère Shop — 141 Đồng Khởi",
      },
      image: "/images/21126/21126.jpg",
    },
    projectsIntro: {
      title: {
        en: "More than a shop — a 25-year partnership",
        vi: "Hơn cả một cửa hàng — hành trình đồng hành 25 năm",
      },
      body: {
        en: "Mystère Shop has traded the finest handmade jewellery and craft of Vietnam’s hill-tribe artisans since 2001. The relationship behind every piece runs deeper than a transaction. It began with a chance meeting, grew through fifteen years of trust, and continues today across five communities in Cao Bằng, Hà Giang and Sa Pa.",
        vi: "Từ năm 2001, Mystère Shop đã giới thiệu những sản phẩm trang sức và thủ công tinh xảo nhất của các nghệ nhân vùng cao Việt Nam. Mối quan hệ phía sau mỗi sản phẩm sâu sắc hơn một giao dịch. Mối duyên ấy bắt đầu từ một cuộc gặp tình cờ, lớn lên qua mười lăm năm tin cậy và tiếp tục đến hôm nay cùng năm cộng đồng tại Cao Bằng, Hà Giang và Sa Pa.",
      },
    },
    thread: {
      title: { en: "Every piece carries a story", vi: "Mỗi món đồ đều mang một câu chuyện" },
      body: {
        en: "We don't just support these communities — we carry their work forward. Every piece you take home from Mystère Shop was made by the same hands, in the same villages, you've just read about. Choosing it is a small, direct way of keeping a craft — and the livelihood behind it — alive.\n\nCome visit us at 141 Đồng Khởi, Sài Gòn.",
        vi: "Chúng tôi không chỉ đồng hành cùng các cộng đồng — chúng tôi tiếp nối công việc của họ. Mỗi món đồ bạn mang về từ Mystère Shop được làm bởi chính những đôi tay ở những bản làng bạn vừa đọc. Lựa chọn ấy góp phần giữ nghề thủ công và sinh kế phía sau nghề được tiếp nối.\n\nHãy ghé 141 Đồng Khởi, Sài Gòn.",
      },
      image: IMG_HAPPY_AN,
    },
    craftIntro: {
      title: { en: "Craft & Products", vi: "Nghề & Sản phẩm" },
      body: {
        en: "Silver jewellery and handcrafted fashion accessories, made by hand in the highlands of the north.",
        vi: "Trang sức bạc và phụ kiện thời trang thủ công, được làm bằng tay ở vùng cao phía Bắc.",
      },
    },
    journalIntro: {
      title: { en: "From the Journal", vi: "Từ Nhật ký" },
      body: {
        en: "Notes from the road, from the fairs and from the shop.",
        vi: "Những ghi chép từ chuyến đi, từ các hội chợ và từ cửa hiệu.",
      },
    },
    visit: {
      title: { en: "Visit the Shop", vi: "Ghé thăm cửa hiệu" },
      body: {
        en: "The best way to understand this work is to hold it. Come and see us in the centre of Saigon — we will happily tell you who made what, and where it came from.",
        vi: "Cách tốt nhất để hiểu những sản phẩm này là cầm chúng trên tay. Hãy ghé thăm chúng tôi ở trung tâm Sài Gòn — chúng tôi sẽ kể bạn nghe ai đã làm ra chúng và chúng đến từ đâu.",
      },
      image: IMG_25,
    },
  },

  about: {
    heroImage: IMG_ABOUT,
    title: { en: "Mystère Shop: Unique Art, Craft & Cultural Heritage", vi: "Shop Huyền Bí: Nghệ thuật, nghề thủ công và di sản văn hóa độc đáo" },
    lead: {
      en: "Mystère Shop — “The Vietnamese Refinement” — at 141 Dong Khoi Street, Sai Gon Ward, Ho Chi Minh City, is a Vietnamese family-owned business established in 2001. We trade in finest tribal art and craft, hand made by the ethnic families of the Red Dao, Dao Tiền, Nùng, H'Mông and Black Lô Lô, in the mountainous northern provinces of Cao Bằng, Hà Giang and Sa Pa.",
      vi: "Mystère Shop — “The Vietnamese Refinement” — tại 141 Đồng Khởi, phường Sài Gòn, Thành phố Hồ Chí Minh, là một doanh nghiệp gia đình Việt Nam được thành lập năm 2001. Chúng tôi kinh doanh những sản phẩm mỹ nghệ tinh xảo nhất, được làm thủ công bởi các gia đình người Dao Đỏ, Dao Tiền, Nùng, H'Mông và Lô Lô Đen, tại các tỉnh miền núi phía Bắc: Cao Bằng, Hà Giang và Sa Pa.",
    },
    blocks: [
      {
        title: { en: "Saigon, 2001", vi: "Sài Gòn, 2001" },
        body: {
          en: "The shop opened at 141 Dong Khoi Street in the centre of Saigon — Sai Gon Ward, formerly District 1 — and it has been there ever since. It is an excellent location for buying finest handicraft, made by the ethnic minorities of Vietnam, in a friendly and unique atmosphere.",
          vi: "Cửa hiệu mở cửa tại 141 Đồng Khởi, ngay trung tâm Sài Gòn — phường Sài Gòn, trước đây là Quận 1 — và vẫn ở đó từ ấy đến nay. Đây là địa chỉ tuyệt vời để tìm mua những sản phẩm thủ công tinh xảo nhất do các dân tộc thiểu số Việt Nam làm ra, trong một không gian thân thiện và độc đáo.",
        },
        image: IMG_25,
      },
      {
        title: {
          en: "Vietnamese craftsmanship",
          vi: "Nghề thủ công Việt Nam",
        },
        body: {
          en: "Silver jewellery and handcrafted fashion accessories, made by hand in the highlands of Cao Bằng, Hà Giang and Sa Pa. The Red Dao work in embroidery and silver. The Dao Tiền draw beeswax on cotton before dyeing. The Nùng dye with plants and roots gathered from the hills. The H'Mông grow, spin, weave and embroider hemp. The Black Lô Lô keep a geometric patchwork that fewer hands still know.",
          vi: "Trang sức bạc và phụ kiện thời trang thủ công, được làm bằng tay ở vùng cao Cao Bằng, Hà Giang và Sa Pa. Người Dao Đỏ làm nghề thêu và bạc. Người Dao Tiền vẽ sáp ong lên vải bông trước khi nhuộm. Người Nùng nhuộm bằng cây cỏ và rễ hái trên đồi. Người H'Mông trồng, xe sợi, dệt và thêu lanh. Người Lô Lô Đen gìn giữ lối ghép vải hình học mà ngày càng ít người còn biết làm.",
        },
        image: IMG_REDDAO_FAMILY_VN,
      },
      {
        title: { en: "Quality and uniqueness", vi: "Chất lượng và sự độc bản" },
        body: {
          en: "A refined, one-of-a-kind shopping experience, with quality and uniqueness at the core. We buy in small quantities and often in single pieces; what cannot be made again is not repeated.",
          vi: "Một trải nghiệm mua sắm tinh tế và độc bản, lấy chất lượng và sự khác biệt làm cốt lõi. Chúng tôi nhập hàng với số lượng nhỏ, thường là từng món độc bản; điều gì không thể làm lại thì sẽ không bị lặp lại.",
        },
        image: IMG_HAPPY_AN,
      },
      {
        title: {
          en: "Partners beyond the shop",
          vi: "Những người đồng hành ngoài cửa hiệu",
        },
        body: {
          en: "Mystère partners with local and international NGOs to support ethnic minority communities — among them DECEN in Cao Bằng, and the LIVE Project in Vietnam. It is one of the reasons this is more than a shop. The shop, however, remains the main thread.",
          vi: "Mystère hợp tác với các tổ chức phi chính phủ trong và ngoài nước để hỗ trợ cộng đồng dân tộc thiểu số — trong đó có DECEN tại Cao Bằng và Dự án LIVE tại Việt Nam. Đó là một trong những lý do nơi đây không chỉ là một cửa hiệu. Dẫu vậy, cửa hiệu vẫn là sợi chỉ chính.",
        },
        image: IMG_DECEN,
      },
    ],
    numbers: [
      { value: "2001", label: { en: "Founded in Saigon", vi: "Thành lập tại Sài Gòn" } },
      { value: "25", label: { en: "Years — 2026 anniversary", vi: "Năm — kỷ niệm 2026" } },
      { value: "5", label: { en: "Artisan communities", vi: "Cộng đồng nghệ nhân" } },
      { value: "15+", label: { en: "Years with Ms. Lý May Pét", vi: "Năm cùng bà Lý May Pét" } },
    ],
  },

  story: {
    heroImage: IMG_REDDAO_FAMILY_VN,
    title: { en: "A friendship that became a journey", vi: "Một tình bạn trở thành hành trình" },
    lead: {
      en: "It started at a small fair for ethnic minority artisans, at the Vietnam Museum of Ethnology in Hanoi - a chance meeting with Ms. Lý May Pét. What began as a conversation grew, over fifteen years, into something closer to family. That single encounter opened the door to a community, and to a journey that has now lasted 25 years.",
      vi: "Tất cả bắt đầu tại một hội chợ nhỏ dành cho nghệ nhân dân tộc thiểu số, ở Bảo tàng Dân tộc học Việt Nam, Hà Nội — một cuộc gặp gỡ tình cờ với bà Lý May Pét. Điều bắt đầu từ một cuộc trò chuyện đã lớn lên, qua mười lăm năm, thành điều gì đó gần như ruột thịt. Cuộc gặp gỡ ấy mở ra cánh cửa đến một cộng đồng, và đến một hành trình đã kéo dài 25 năm.",
    },
    body: {
      en: "We went for the silver. We stayed for the conversation.\n\nMs. Lý May Pét had travelled a long way to be at that fair. She unfolded what she had brought, and explained it piece by piece. What she described was not a product range — it was a way of dressing, of marking a life, of recording where a family comes from.\n\nFifteen years of visits followed. Orders became journeys; journeys became friendships. Through that one household we were introduced to others, and eventually to other communities.\n\nWe still work the same way: we go north, we sit down, we look at what has been made since the last time, and we talk about what could be made next. There is more to this story — the kind best told over a cup of tea, at the shop.",
      vi: "Chúng tôi đến vì những món bạc. Chúng tôi ở lại vì cuộc trò chuyện.\n\nBà Lý May Pét đã đi một quãng đường rất xa để có mặt tại hội chợ ấy. Bà mở ra những gì mình mang theo, và giải thích từng món một. Điều bà kể không phải là một danh mục sản phẩm — đó là một cách ăn mặc, một cách đánh dấu một đời người, một cách ghi lại gia đình mình đến từ đâu.\n\nRồi mười lăm năm những chuyến thăm. Đơn hàng trở thành hành trình; hành trình trở thành tình bạn. Qua một gia đình ấy, chúng tôi được giới thiệu tới những gia đình khác, rồi tới những cộng đồng khác.\n\nChúng tôi vẫn làm việc như vậy: đi lên phía Bắc, ngồi xuống, xem những gì đã được làm từ lần trước, và bàn về những gì có thể làm tiếp. Câu chuyện này còn dài lắm — kiểu câu chuyện nên được kể bên một chén trà, tại cửa hiệu.",
    },
    quote: {
      en: "There is more to this story — the kind best told over a cup of tea, at the shop.",
      vi: "Câu chuyện này còn dài lắm — kiểu câu chuyện nên được kể bên một chén trà, tại cửa hiệu.",
    },
    quoteAuthor: {
      en: "Mystère Shop — 141 Dong Khoi Street",
      vi: "Mystère Shop — 141 Đồng Khởi",
    },
    communitiesTitle: {
      en: "Standing beside the artisans, project by project",
      vi: "Sát cánh cùng nghệ nhân, qua từng dự án",
    },
    communitiesLead: {
      en: "Five communities in Cao Bằng, Hà Giang and Sa Pa. Each one a different hand.",
      vi: "Năm cộng đồng ở Cao Bằng, Hà Giang và Sa Pa. Mỗi nơi một đôi tay.",
    },
    partnersTitle: { en: "Partners & projects", vi: "Đối tác & dự án" },
    partnersLead: {
      en: "The shop is the main thread. These organisations deepen the story behind what you find on Dong Khoi Street.",
      vi: "Cửa hiệu là sợi chỉ chính. Những tổ chức này làm sâu sắc thêm câu chuyện đằng sau những gì bạn thấy trên đường Đồng Khởi.",
    },
    partnersNote: {
      en: "Mystère partners with local and international NGOs to support ethnic minority communities.",
      vi: "Mystère hợp tác với các tổ chức phi chính phủ trong và ngoài nước để hỗ trợ cộng đồng dân tộc thiểu số.",
    },
  },

  craft: {
    heroImage: IMG_REDDAO_FAMILY,
    title: { en: "Craft & Products", vi: "Nghề & Sản phẩm" },
    lead: {
      en: "Silver jewellery and handcrafted fashion accessories, hand made by the Red Dao, Dao Tiền, Nùng, H'Mông and Black Lô Lô communities of Cao Bằng, Hà Giang and Sa Pa.",
      vi: "Trang sức bạc và phụ kiện thời trang thủ công, được làm bằng tay bởi các cộng đồng Dao Đỏ, Dao Tiền, Nùng, H'Mông và Lô Lô Đen ở Cao Bằng, Hà Giang và Sa Pa.",
    },
    note: {
      en: "Not sold online. Everything here can be seen, held and explained in person at 141 Dong Khoi Street.",
      vi: "Không bán trực tuyến. Tất cả đều có thể được xem, cầm nắm và giải thích trực tiếp tại 141 Đồng Khởi.",
    },
  },

  journal: {
    title: { en: "Journal", vi: "Nhật ký" },
    lead: {
      en: "Stories, notes and observations from twenty-five years between Saigon and the northern highlands.",
      vi: "Những câu chuyện, ghi chép và quan sát từ hai mươi lăm năm giữa Sài Gòn và vùng cao phía Bắc.",
    },
  },

  newsletter: {
    title: { en: "More stories are coming", vi: "Sẽ còn nhiều câu chuyện nữa" },
    body: {
      en: "Leave your email, and we'll let you know when a new project or story is ready to share.",
      vi: "Hãy để lại email, chúng tôi sẽ báo bạn khi có dự án hoặc câu chuyện mới để chia sẻ.",
    },
    button: { en: "Keep me posted", vi: "Báo tin cho tôi" },
    success: {
      en: "Thank you — we will be in touch when the next story is ready.",
      vi: "Cảm ơn bạn — chúng tôi sẽ liên hệ khi câu chuyện tiếp theo sẵn sàng.",
    },
  },

  contact: {
    // Approved raster logo supplied by the client. The accompanying wordmark stays
    // in the header so the brand remains horizontal at every screen size.
    logo: "/images/21126/newlestlogo.jpg",
    tagline: { en: "The Vietnamese Refinement", vi: "Tinh hoa Việt Nam" },
    image: "/images/shop.jpg",
    displayName: { en: "Mystere Sai Gon", vi: "Mystere Sai Gon" },
    addressLines: ["141 Dong Khoi Street", "Sai Gon Ward", "Ho Chi Minh City"],
    phone: "028 3823 9615",
    zalo: "077 5616268",
    hours: { en: "9:00 AM – 8:00 PM", vi: "9:00 – 20:00" },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=141+Dong+Khoi+Street+Ho+Chi+Minh+City",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    email: "mystereshop@gmail.com",
    note: {
      en: "Instagram and Facebook profiles, and the shop photograph, are still to be supplied by Mystère — they can be updated in the Admin dashboard.",
      vi: "Trang Instagram và Facebook, cùng ảnh chụp cửa hiệu, sẽ do Mystère cung cấp — có thể cập nhật trong trang Quản trị.",
    },
  },

  communities: [
    {
      id: "c1",
      slug: "red-dao",
      name: "Red Dao",
      region: { en: "Cao Bằng · Hà Giang · Sa Pa", vi: "Cao Bằng · Hà Giang · Sa Pa" },
      title: {
        en: "The friendship that started it all",
        vi: "Tình bạn khởi đầu tất cả",
      },
      line: {
        en: "A partnership that began with one woman, and grew into a movement.",
        vi: "Một sự hợp tác bắt đầu từ một người phụ nữ, và lớn lên thành một phong trào.",
      },
      story: {
        en: "It began at a small fair for ethnic minority artisans in Hanoi, meeting Ms. Lý May Pét. What followed was fifteen years of visits, conversations, and trust — long enough to become family. The Red Dao are known for their embroidery and silver jewellery, each piece carrying meaning in its colour and pattern. Red for protection. Blue for the sky above the village. There is more to this story — the kind best told over a cup of tea, at the shop.",
        vi: "Tất cả bắt đầu tại một hội chợ nhỏ dành cho nghệ nhân dân tộc thiểu số ở Hà Nội, khi chúng tôi gặp bà Lý May Pét. Tiếp đó là mười lăm năm những chuyến thăm, những cuộc trò chuyện và niềm tin — đủ lâu để trở thành ruột thịt. Người Dao Đỏ nổi tiếng với nghề thêu và trang sức bạc, mỗi món đồ đều mang ý nghĩa trong màu sắc và hoa văn. Đỏ là sự che chở. Xanh là bầu trời trên bản làng. Câu chuyện này còn dài lắm — kiểu câu chuyện nên được kể bên một chén trà, tại cửa hiệu.",
      },
      craft: {
        en: "Embroidery and silver jewellery.",
        vi: "Nghề thêu và trang sức bạc.",
      },
      image: "/images/Red dao.jpg",
      documentUrl: "/Decen/DECEN%20PRESENTATION%202014%2010.5.2014-1.pdf",
      documentLabel: { en: "Discover more about DECEN", vi: "Tìm hiểu thêm về DECEN" },
      published: true,
    },
    {
      id: "c2",
      slug: "dao-tien",
      name: "Dao Tiền",
      region: { en: "Cao Bằng", vi: "Cao Bằng" },
      title: { en: "The wax that holds a pattern", vi: "Sáp ong giữ lấy hoa văn" },
      line: {
        en: "Preserving the ancient art of beeswax batik, one piece at a time.",
        vi: "Gìn giữ nghệ thuật vẽ sáp ong cổ xưa, qua từng tấm vải.",
      },
      story: {
        en: "Long before printing, the Dao Tiền had beeswax and cotton. Their batik technique — drawing wax patterns by hand before dyeing — takes patience most of us have forgotten how to have. Each length of cloth takes days, sometimes weeks. We've watched it made. It's one of the quieter kinds of magic.",
        vi: "Từ rất lâu trước khi có in ấn, người Dao Tiền đã có sáp ong và vải bông. Kỹ thuật vẽ sáp — vẽ hoa văn bằng tay trước khi nhuộm — đòi hỏi sự kiên nhẫn mà phần lớn chúng ta đã quên mất. Mỗi tấm vải mất nhiều ngày, đôi khi nhiều tuần. Chúng tôi đã được xem người ta làm. Đó là một trong những phép màu trầm lặng hơn.",
      },
      craft: {
        en: "Beeswax batik on cotton: wax drawn by hand, then dyed.",
        vi: "Vẽ sáp ong trên vải bông: vẽ sáp bằng tay, rồi nhuộm.",
      },
      image: "/images/Money Dao.jpg",
      documentUrl: "/Decen/DECEN%20PRESENTATION%202014%2010.5.2014-1.pdf",
      documentLabel: { en: "Discover more about DECEN", vi: "Tìm hiểu thêm về DECEN" },
      published: true,
    },
    {
      id: "c3",
      slug: "nung",
      name: "Nùng",
      region: { en: "Cao Bằng", vi: "Cao Bằng" },
      title: { en: "Colour from the earth", vi: "Màu từ đất" },
      line: {
        en: "Natural dyes, quiet patience, generations of knowledge.",
        vi: "Thuốc nhuộm tự nhiên, sự kiên nhẫn lặng lẽ, tri thức của nhiều thế hệ.",
      },
      story: {
        en: "The Nùng dye their fabric using plants and roots gathered from the hills around them — no chemicals, no shortcuts. It's a skill passed from mother to daughter, learned by watching more than by being taught. What comes out the other end is never quite the same twice — and that's exactly the point.",
        vi: "Người Nùng nhuộm vải bằng cây cỏ và rễ hái trên những đồi quanh bản — không hóa chất, không đường tắt. Đó là kỹ năng truyền từ mẹ sang con gái, học bằng cách nhìn nhiều hơn là được dạy. Kết quả thu được không bao giờ lặp lại y hệt — và đó chính là điều cốt yếu.",
      },
      craft: {
        en: "Natural dyes, embroidery and sewing.",
        vi: "Nhuộm tự nhiên, thêu và may.",
      },
      image: "/images/Nùng.jpg",
      published: true,
    },
    {
      id: "c4",
      slug: "hmong",
      name: "H'Mông",
      region: { en: "Hà Giang · Sa Pa", vi: "Hà Giang · Sa Pa" },
      title: { en: "Threads that remember", vi: "Những sợi chỉ biết nhớ" },
      line: {
        en: "Hemp, thread, and stories woven into every fabric.",
        vi: "Cây lanh, sợi chỉ, và những câu chuyện được dệt vào từng tấm vải.",
      },
      story: {
        en: "Hemp, grown and spun by hand, becomes fabric strong enough to last generations. The H'Mông weave and embroider it with patterns that carry meaning — a language without words, stitched instead of spoken. We're still learning to read it.",
        vi: "Cây lanh, được trồng và xe sợi bằng tay, trở thành thứ vải bền đến mức dùng được qua nhiều thế hệ. Người H'Mông dệt và thêu lên đó những hoa văn mang ý nghĩa — một thứ ngôn ngữ không lời, được khâu lại thay vì nói ra. Chúng tôi vẫn đang học cách đọc nó.",
      },
      craft: { en: "Beeswax batik on cotton.", vi: "Vẽ sáp ong trên vải cotton." },
      image: "/images/H'Mong.jpg",
      published: true,
    },
    {
      id: "c5",
      slug: "black-lo-lo",
      name: "Black Lô Lô",
      region: { en: "Cao Bằng", vi: "Cao Bằng" },
      title: { en: "Patchwork against the odds", vi: "Ghép vải giữa muôn vàn khó khăn" },
      line: {
        en: "Patchwork traditions kept alive against the odds.",
        vi: "Nghề ghép vải được gìn giữ giữa muôn vàn khó khăn.",
      },
      story: {
        en: "Fewer hands still know this craft. The Black Lô Lô's patchwork embroidery — small, geometric, deliberate — is one of the rarer traditions we work with, and one we're quietly trying to help survive.",
        vi: "Ngày càng ít đôi bàn tay còn biết nghề này. Kỹ thuật ghép vải của người Lô Lô Đen — nhỏ, hình học, chắc chắn — là một trong những truyền thống hiếm hơn mà chúng tôi làm việc cùng, và là điều chúng tôi lặng lẽ cố gắng giúp tồn tại.",
      },
      craft: { en: "Patchwork embroidery.", vi: "Thêu ghép vải." },
      image: "/images/Lolo.jpg",
      published: true,
    },
  ],

  categories: [
    {
      id: "cat1",
      slug: "silver-jewellery",
      name: { en: "Silver Jewellery", vi: "Trang sức bạc" },
      short: { en: "Forged and engraved by hand", vi: "Rèn và chạm khắc bằng tay" },
      description: {
        en: "Silver jewellery, made and worn by the communities we work with — the craft alongside embroidery for which the Red Dao are known.",
        vi: "Trang sức bạc, được làm và đeo bởi các cộng đồng chúng tôi cộng tác — nghề song hành cùng thêu tay đã làm nên tên tuổi của người Dao Đỏ.",
      },
      image: IMG_REDDAO_FAMILY,
      published: true,
    },
    {
      id: "cat2",
      slug: "embroidered-accessories",
      name: { en: "Embroidered Accessories", vi: "Phụ kiện thêu tay" },
      short: { en: "Meaning in colour and pattern", vi: "Ý nghĩa trong màu sắc và hoa văn" },
      description: {
        en: "Hand embroidery and sewn accessories. Each piece carries meaning in its colour and pattern — and identifies the community, sometimes the family, that made it.",
        vi: "Đồ thêu tay và phụ kiện may. Mỗi món đều mang ý nghĩa trong màu sắc và hoa văn — và cho biết cộng đồng, đôi khi là gia đình, đã làm ra nó.",
      },
      image: IMG_COLOUR,
      published: true,
    },
    {
      id: "cat3",
      slug: "woven-textiles",
      name: { en: "Woven Textiles", vi: "Vải dệt" },
      short: { en: "Hemp, cotton, beeswax, indigo", vi: "Lanh, bông, sáp ong, chàm" },
      description: {
        en: "Hemp grown and spun by hand, cotton drawn with beeswax before dyeing, cloth coloured with plants and roots gathered from the hills.",
        vi: "Lanh được trồng và xe sợi bằng tay, vải bông được vẽ sáp ong trước khi nhuộm, vải được nhuộm màu từ cây cỏ và rễ hái trên đồi.",
      },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "cat4",
      slug: "home-decor-curios",
      name: { en: "Home Décor & Curios", vi: "Đồ trang trí & Vật phẩm" },
      short: { en: "Objects gathered on the road", vi: "Những vật phẩm nhặt được dọc đường" },
      description: {
        en: "Household objects and curios gathered on buying trips to Cao Bằng, Hà Giang and Sa Pa. The selection changes with what we find.",
        vi: "Những vật dụng gia đình và vật phẩm được sưu tầm trong các chuyến đi mua hàng ở Cao Bằng, Hà Giang và Sa Pa. Lựa chọn thay đổi theo những gì chúng tôi tìm được.",
      },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "cat5",
      slug: "traditional-dress",
      name: { en: "Traditional Dress", vi: "Trang phục truyền thống" },
      short: { en: "Cloth, colour and identity", vi: "Vải vóc, màu sắc và bản sắc" },
      description: { en: "Traditional garments made and worn by the communities we work with.", vi: "Trang phục truyền thống do các cộng đồng chúng tôi đồng hành làm và sử dụng." },
      image: IMG_REDDAO_FAMILY,
      published: true,
    },
  ],

  products: [
    {
      id: "p1",
      categoryId: "cat1",
      name: { en: "Red Dao Silver", vi: "Bạc Dao Đỏ" },
      description: {
        en: "Silver jewellery, made and worn by the Red Dao — the craft alongside embroidery for which the community is known.",
        vi: "Trang sức bạc, được làm và đeo bởi người Dao Đỏ — nghề song hành cùng thêu tay đã làm nên tên tuổi của cộng đồng này.",
      },
      community: "Red Dao",
      materials: { en: "Silver", vi: "Bạc" },
      image: IMG_REDDAO_FAMILY,
      published: true,
    },
    {
      id: "p2",
      categoryId: "cat1",
      name: { en: "H'Mông Silver", vi: "Bạc H'Mông" },
      description: {
        en: "Silverwork worn with hemp and indigo dress.",
        vi: "Đồ bạc được đeo cùng trang phục lanh và vải chàm.",
      },
      community: "H'Mông",
      materials: { en: "Silver", vi: "Bạc" },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "p3",
      categoryId: "cat2",
      name: { en: "Red Dao Embroidery", vi: "Thêu Dao Đỏ" },
      description: {
        en: "Hand embroidery, each piece carrying meaning in its colour and pattern. Red for protection. Blue for the sky above the village.",
        vi: "Thêu tay, mỗi món đều mang ý nghĩa trong màu sắc và hoa văn. Đỏ là sự che chở. Xanh là bầu trời trên bản làng.",
      },
      community: "Red Dao",
      materials: { en: "Cotton, thread", vi: "Bông, chỉ" },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "p4",
      categoryId: "cat2",
      name: { en: "Black Lô Lô Patchwork", vi: "Ghép vải Lô Lô Đen" },
      description: {
        en: "Small, geometric, deliberate patchwork embroidery — one of the rarer traditions we work with, and one we're quietly trying to help survive.",
        vi: "Thêu ghép vải nhỏ, hình học, chắc chắn — một trong những truyền thống hiếm hơn mà chúng tôi làm việc cùng, và là điều chúng tôi lặng lẽ cố gắng giúp tồn tại.",
      },
      community: "Black Lô Lô",
      materials: { en: "Cotton, thread", vi: "Bông, chỉ" },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "p5",
      categoryId: "cat2",
      name: { en: "Nùng Embroidery", vi: "Thêu Nùng" },
      description: {
        en: "Embroidery and sewing worked on cloth dyed with plants and roots gathered from the hills.",
        vi: "Thêu và may trên nền vải được nhuộm bằng cây cỏ và rễ hái trên đồi.",
      },
      community: "Nùng",
      materials: { en: "Cotton, natural dyes, thread", vi: "Bông, thuốc nhuộm tự nhiên, chỉ" },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "p6",
      categoryId: "cat3",
      name: { en: "Dao Tiền Beeswax Batik", vi: "Vẽ sáp ong Dao Tiền" },
      description: {
        en: "Wax patterns drawn by hand on cotton before dyeing. Each length of cloth takes days, sometimes weeks.",
        vi: "Hoa văn sáp được vẽ bằng tay trên vải bông trước khi nhuộm. Mỗi tấm vải mất nhiều ngày, đôi khi nhiều tuần.",
      },
      community: "Dao Tiền",
      materials: { en: "Cotton, beeswax, indigo", vi: "Bông, sáp ong, chàm" },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "p7",
      categoryId: "cat3",
      name: { en: "H'Mông Hemp Cloth", vi: "Vải lanh H'Mông" },
      description: {
        en: "Hemp, grown and spun by hand, becomes fabric strong enough to last generations — woven and embroidered with patterns that carry meaning.",
        vi: "Cây lanh, được trồng và xe sợi bằng tay, trở thành thứ vải bền đủ dùng qua nhiều thế hệ — được dệt và thêu những hoa văn mang ý nghĩa.",
      },
      community: "H'Mông",
      materials: { en: "Hemp", vi: "Lanh" },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "p8",
      categoryId: "cat3",
      name: { en: "Nùng Naturally Dyed Cloth", vi: "Vải nhuộm tự nhiên của người Nùng" },
      description: {
        en: "Fabric dyed with plants and roots gathered from the hills around them — no chemicals, no shortcuts. Never quite the same twice.",
        vi: "Vải được nhuộm bằng cây cỏ và rễ hái trên những đồi quanh bản — không hóa chất, không đường tắt. Không bao giờ lặp lại y hệt.",
      },
      community: "Nùng",
      materials: { en: "Cotton, plant and root dyes", vi: "Bông, thuốc nhuộm từ cây và rễ" },
      image: PLACEHOLDER,
      published: true,
    },
    {
      id: "p9",
      categoryId: "cat4",
      name: { en: "Objects for the House", vi: "Vật dụng trong nhà" },
      description: {
        en: "Household objects and curios gathered on buying trips to Cao Bằng, Hà Giang and Sa Pa. The selection changes with what we find.",
        vi: "Những vật dụng gia đình và vật phẩm được sưu tầm trong các chuyến đi mua hàng ở Cao Bằng, Hà Giang và Sa Pa. Lựa chọn thay đổi theo những gì chúng tôi tìm được.",
      },
      community: "Cao Bằng · Hà Giang · Sa Pa",
      materials: { en: "Varies", vi: "Nhiều loại" },
      image: PLACEHOLDER,
      published: true,
    },
  ],

  articles: [
    {
      id: "a1",
      slug: "the-meaning-of-colour-in-red-dao-dress",
      title: {
        en: "The Meaning of Colour in Red Dao Dress",
        vi: "Ý nghĩa màu sắc trong trang phục người Dao Đỏ",
      },
      // No publication date supplied by the client — none is displayed.
      date: "",
      excerpt: {
        en: "Why red, why blue — a first note on reading colour in Red Dao dress.",
        vi: "Vì sao là đỏ, vì sao là xanh — ghi chú đầu tiên về cách đọc màu sắc trong trang phục người Dao Đỏ.",
      },
      body: {
        en: "Red Dao dress carries meaning in its colour and in its pattern.\n\nRed for protection. Blue for the sky above the village.\n\nThe full account of the five colours is being prepared for the Journal. The short version is the one we tell in the shop, over a cup of tea — 141 Dong Khoi Street, 9:00 AM to 8:00 PM.",
        vi: "Trang phục của người Dao Đỏ mang ý nghĩa trong màu sắc và trong hoa văn.\n\nĐỏ là sự che chở. Xanh là bầu trời trên bản làng.\n\nBài viết đầy đủ về năm màu sắc đang được chuẩn bị cho Nhật ký. Bản ngắn gọn là bản chúng tôi kể tại cửa hiệu, bên một chén trà — 141 Đồng Khởi, từ 9:00 đến 20:00.",
      },
      cover: IMG_COLOUR,
      gallery: [IMG_REDDAO_FAMILY, IMG_REDDAO_FAMILY_VN],
      published: true,
    },
    {
      id: "a2",
      slug: "traditional-handicraft-fair",
      title: { en: "Traditional Handicraft Fair", vi: "Hội chợ thủ công truyền thống" },
      date: "",
      excerpt: {
        en: "Where this kind of work meets the people who will carry it forward — and where our own story began.",
        vi: "Nơi công việc này gặp những người sẽ mang nó đi tiếp — và nơi câu chuyện của chúng tôi bắt đầu.",
      },
      body: {
        en: "Fairs are where this kind of work meets the people who will carry it forward. They are also where our own story began: a small fair for ethnic minority artisans at the Vietnam Museum of Ethnology in Hanoi, and a chance meeting with Ms. Lý May Pét that has now lasted fifteen years.\n\nIn Cao Bằng, producer groups supported by the LIVE Project are helped to take part in trade fairs, bazaars and conferences, and to develop their designs according to market demand — while staying with handmade and natural products, and with the indigenous knowledge of each group.\n\nPhotographs from the fair will be added here as they come in.",
        vi: "Hội chợ là nơi công việc này gặp những người sẽ mang nó đi tiếp. Đó cũng là nơi câu chuyện của chúng tôi bắt đầu: một hội chợ nhỏ dành cho nghệ nhân dân tộc thiểu số tại Bảo tàng Dân tộc học Việt Nam ở Hà Nội, và một cuộc gặp gỡ tình cờ với bà Lý May Pét, nay đã kéo dài mười lăm năm.\n\nTại Cao Bằng, các nhóm sản xuất được Dự án LIVE hỗ trợ tham gia hội chợ thương mại, bazaar và hội nghị, đồng thời phát triển mẫu mã theo nhu cầu thị trường — trong khi vẫn giữ sản phẩm làm thủ công và tự nhiên, cùng tri thức bản địa của từng nhóm.\n\nẢnh chụp tại hội chợ sẽ được bổ sung tại đây khi có.",
      },
      cover: IMG_FAIR,
      gallery: [IMG_HAPPY_AN, IMG_ABOUT],
      published: true,
    },
  ],

  partners: [
    {
      id: "n1",
      name: "DECEN",
      role: {
        en: "Cao Bằng Community Development Center",
        vi: "Trung tâm Phát triển Cộng đồng Cao Bằng",
      },
      body: {
        en: "DECEN — the Cao Bằng Community Development Center — was the first local NGO in Cao Bằng. It works with ethnic minority communities on handicraft producer groups, on community-based tourism, and on access to information in local languages.",
        vi: "DECEN — Trung tâm Phát triển Cộng đồng Cao Bằng — là tổ chức phi chính phủ địa phương đầu tiên tại Cao Bằng. Tổ chức này làm việc với các cộng đồng dân tộc thiểu số về các nhóm sản xuất thủ công, du lịch dựa vào cộng đồng, và khả năng tiếp cận thông tin bằng ngôn ngữ địa phương.",
      },
      image: IMG_DECEN,
      url: "",
      published: true,
    },
    {
      id: "n2",
      name: "The LIVE Project",
      role: { en: "HELVETAS Vietnam project", vi: "Dự án của HELVETAS Việt Nam" },
      body: {
        en: "The LIVE Project — Improving the livelihood and strengthening the civil society of ethnic minorities — promotes ethnic handicrafts from Cao Bằng and strengthens the capacities of the Cao Bằng Development Centre. It provides training and coaching to increase product quality and quantity, supports producer groups, builds market linkages for handmade and natural products, and helps groups take part in trade fairs, bazaars and conferences.",
        vi: "Dự án LIVE — Cải thiện sinh kế và củng cố xã hội dân sự của người dân tộc thiểu số — thúc đẩy thủ công mỹ nghệ dân tộc từ Cao Bằng và nâng cao năng lực của Trung tâm Phát triển Cộng đồng Cao Bằng. Dự án đào tạo và hướng dẫn để nâng chất lượng và số lượng sản phẩm, hỗ trợ các nhóm sản xuất, xây dựng liên kết thị trường cho sản phẩm thủ công và tự nhiên, đồng thời giúp các nhóm tham gia hội chợ thương mại, bazaar và hội nghị.",
      },
      image: IMG_LIVE_VN,
      url: "https://www.helvetas.org/",
      published: true,
    },
    {
      id: "n3",
      name: "HELVETAS",
      role: { en: "International partner", vi: "Đối tác quốc tế" },
      body: {
        en: "HELVETAS is a Swiss development organisation working in Cao Bằng and Hà Giang — on community-based tourism, ethnic handicrafts, and the rights of ethnic minority communities. It is the international partner behind the LIVE Project.",
        vi: "HELVETAS là một tổ chức phát triển của Thụy Sĩ hoạt động tại Cao Bằng và Hà Giang — về du lịch dựa vào cộng đồng, thủ công mỹ nghệ dân tộc và quyền của cộng đồng dân tộc thiểu số. Đây là đối tác quốc tế đứng sau Dự án LIVE.",
      },
      image: IMG_LIVE_PROJECT,
      url: "https://www.helvetas.org/",
      published: true,
    },
  ],
};

// NEW content structure. Original fields remain available for archived admin content.
defaultContent.home.intro.image = "/images/mystere-shop.png";
defaultContent.home.artisan.image = "/images/khoinguon.jpg";
defaultContent.home.thread.image = "/images/mystere-shop.png";
defaultContent.contact.logo = "/images/mystere-logo.jpg";
defaultContent.communities[0].image = "/images/red-dao.png";
defaultContent.communities[1].image = "/images/project-dao-tien.jpg";
defaultContent.communities[2].image = "/images/project-nung.jpg";
defaultContent.communities[3].image = "/images/project-hmong.jpg";
defaultContent.communities[4].image = "/images/project-lo-lo.jpg";
// Supporting project photographs are editable from the community gallery in CMS.
defaultContent.communities[0].gallery = ["/images/live-water-collection.webp", "/images/live-child-water.webp"];
defaultContent.communities[1].gallery = [
  "/images/craft-belt-house-retouched.png",
  "/images/moinhat/Five%20Women%20in%20Traditional%20Indigo%20Attire.png",
  "/images/moinhat/Rural%20Timber%20House%20Community%20Gathering.png",
];
defaultContent.home.intro.body = {
  en: "Mystère Shop believes the artisans of Cao Bằng, Hà Giang and Sa Pa deserve more than admiration for their craft — they deserve a future shaped by it.\n\nWe work alongside Red Dao, Dao Tiền, Nùng, H'Mông and Black Lô Lô communities to keep weaving, embroidery and silverwork alive. Through our shop, their work reaches new homes, carrying the knowledge and stories of the people who made it.",
  vi: "Mystère Shop tin rằng nghệ nhân ở Cao Bằng, Hà Giang và Sa Pa xứng đáng có nhiều hơn sự ngưỡng mộ dành cho tay nghề — họ cần một tương lai được vun đắp từ chính nghề ấy.\n\nChúng tôi đồng hành cùng các cộng đồng Dao Đỏ, Dao Tiền, Nùng, H'Mông và Lô Lô Đen để gìn giữ nghề dệt, thêu và chế tác bạc. Qua cửa hàng, những sản phẩm ấy đến với các mái nhà mới, mang theo tri thức và câu chuyện của người làm ra chúng."
};
defaultContent.home.mission = structuredClone(defaultContent.home.intro);
defaultContent.home.artisan.body = {
  en: "A chance meeting with Ms. Lý May Pét at a small artisan fair at the Vietnam Museum of Ethnology in Hanoi marked the beginning. Over fifteen years of visits and conversations, that friendship grew into a bond as close as family. It opened the door to a wider community — part of the journey Mystère Shop has continued for 25 years.",
  vi: "Một cuộc gặp tình cờ với bà Lý May Pét tại hội chợ thủ công nhỏ ở Bảo tàng Dân tộc học Việt Nam, Hà Nội, đã mở đầu câu chuyện. Qua mười lăm năm thăm hỏi và trò chuyện, tình bạn ấy trở nên gắn bó như gia đình, mở ra sự kết nối với cả một cộng đồng — một phần trong hành trình 25 năm của Mystère Shop."
};
defaultContent.home.projectsIntro.body = {
  en: "Mystère Shop has been trading the finest handmade jewellery and craft of Vietnam's hill-tribe artisans since 2001. But the relationship behind every piece goes back further, and runs deeper, than any transaction.\n\nIt started at a small fair for ethnic minority artisans at the Vietnam Museum of Ethnology in Hanoi — a chance meeting with Ms. Lý May Pét. What began as a conversation grew, over fifteen years, into something closer to family.\n\nIn 2012, we took that relationship a step further. We became a sponsor of the LIVE Project — a livelihood-improvement programme for Cao Bằng's ethnic minority communities — and helped organise the first Bazaar Saigon, bringing five families out of the mountains and into the city for the first time in their lives. What we raised that day became a Craft Belt House: a shared workspace where a community could weave, train, and gather together, instead of working alone, house by house. Since then, it's become something we return to, year after year.\n\nToday, we work alongside the Red Dao, Dao Tiền, Nùng, H'Mông and Black Lô Lô communities across Cao Bằng, Hà Giang and Sa Pa. Below is a closer look at each one — the people, the craft, and what our partnership has built together.",
  vi: "Từ năm 2001, Mystère Shop giới thiệu những món trang sức và sản phẩm thủ công tinh túy của nghệ nhân vùng cao Việt Nam. Nhưng mối quan hệ phía sau mỗi món đồ bắt đầu từ trước đó và sâu sắc hơn một giao dịch.\n\nMọi chuyện bắt đầu tại một hội chợ nhỏ ở Bảo tàng Dân tộc học Việt Nam, Hà Nội — cuộc gặp tình cờ với bà Lý May Pét. Một cuộc trò chuyện đã lớn lên qua mười lăm năm, trở thành tình thân.\n\nNăm 2012, chúng tôi đồng hành cùng Dự án LIVE và tổ chức Bazaar Saigon đầu tiên, đưa năm gia đình từ miền núi xuống thành phố. Khoản quyên góp hôm ấy trở thành một Nhà Craft Belt — nơi cộng đồng có thể dệt, học nghề và gặp gỡ cùng nhau.\n\nNgày nay, chúng tôi làm việc cùng các cộng đồng Dao Đỏ, Dao Tiền, Nùng, H'Mông và Lô Lô Đen tại Cao Bằng, Hà Giang và Sa Pa."
};
defaultContent.newsletter.title = { en: "Bazaar No. 4 is already on our minds", vi: "Bazaar số 4 đã ở trong suy nghĩ của chúng tôi" };
defaultContent.newsletter.body = { en: "Leave your email, and you'll be the first to know when we announce the next one.", vi: "Để lại email, bạn sẽ là người đầu tiên biết khi chúng tôi công bố sự kiện tiếp theo." };
const projectStories: Record<string, { en: string; vi: string }> = {
  "red-dao": { en: "It began at a small fair for ethnic minority artisans in Hanoi — the Vietnam Museum of Ethnology — where we met Ms. Lý May Pét. What followed was fifteen years of visits, conversations, and trust, long enough to become family.\n\nThe Red Dao are known for their embroidery and silver jewellery, and every pattern they stitch carries meaning. Their use of colour follows the five elements: white for metal, blue-green for wood, black for water, yellow for earth, and red for fire — a belief tied to the community's own origin story, where colour is not decoration but a symbol of strength, luck and beauty. Some researchers trace this five-colour system to Confucian influence on Dao spiritual belief; whatever its roots, red — for protection — and blue-green — for the sky above the village — are the colours you'll see most.\n\nThere is more to this story — the kind best told over a cup of tea, at the shop.", vi: "Mọi chuyện bắt đầu tại một hội chợ nhỏ dành cho nghệ nhân dân tộc thiểu số ở Hà Nội — Bảo tàng Dân tộc học Việt Nam — nơi chúng tôi gặp bà Lý May Pét. Mười lăm năm thăm hỏi, trò chuyện và tin cậy đã đưa mối quan hệ ấy trở nên thân thiết như gia đình.\n\nNgười Dao Đỏ nổi tiếng với nghề thêu và trang sức bạc; mỗi hoa văn đều mang ý nghĩa. Năm màu sắc gắn với ngũ hành: trắng là kim, xanh là mộc, đen là thủy, vàng là thổ và đỏ là hỏa — biểu tượng của sức mạnh, may mắn và vẻ đẹp.\n\nCâu chuyện này còn nhiều điều để kể — thích hợp nhất là bên một chén trà tại cửa hàng." },
  "dao-tien": { en: "Long before printing, the Dao Tiền had beeswax and cotton. Their batik technique — drawing wax patterns by hand before dyeing — takes patience most of us have forgotten how to have. Each length of cloth takes days, sometimes weeks.\n\nWe've watched it made in Hòa Thuận commune, Cao Bằng, where a women's handicraft group came together to keep the craft alive — trained not only in weaving and beeswax batik, but in the practical things a group needs to last: book-keeping, bank transactions, and running a small business together. In 2012, this was the first community to receive a Craft Belt House, built from the proceeds of our first bazaar in Saigon.\n\nIt's one of the quieter kinds of magic.", vi: "Từ rất lâu trước khi có kỹ thuật in, người Dao Tiền đã sử dụng sáp ong và vải bông. Kỹ thuật batik — vẽ hoa văn bằng sáp trước khi nhuộm — đòi hỏi sự kiên nhẫn. Mỗi tấm vải mất nhiều ngày, đôi khi nhiều tuần.\n\nTại xã Hòa Thuận, Cao Bằng, nhóm phụ nữ đã cùng nhau gìn giữ nghề, học dệt, vẽ sáp ong và những kỹ năng để một nhóm có thể bền vững: ghi sổ, giao dịch ngân hàng và cùng vận hành một cơ sở nhỏ. Năm 2012, đây là cộng đồng đầu tiên nhận được Nhà Craft Belt từ khoản thu của hội chợ đầu tiên tại Sài Gòn.\n\nĐó là một trong những phép màu lặng lẽ." },
  nung: { en: "The Nùng dye their fabric using plants and roots gathered from the hills of Phúc Sen commune — no chemicals, no shortcuts. It's a skill passed from mother to daughter, learned by watching more than by being taught. Alongside natural dyeing, the group also carries fine embroidery and sewing — three crafts, one community, one thread running through all of it.\n\nWhat comes out the other end is never quite the same twice — and that's exactly the point.", vi: "Người Nùng nhuộm vải bằng cây cỏ và rễ cây thu hái trên những ngọn đồi ở xã Phúc Sen — không hóa chất, không đường tắt. Kỹ năng ấy truyền từ mẹ sang con gái, học qua quan sát nhiều hơn lời giảng. Bên cạnh nhuộm tự nhiên, cộng đồng còn gìn giữ nghề thêu và may — ba nghề, một cộng đồng, cùng chung một sợi chỉ.\n\nKhông có hai lần nhuộm nào hoàn toàn giống nhau — và đó chính là điều đặc biệt." },
  hmong: { en: "Hemp, grown and spun by hand in Phan Thanh commune, becomes fabric strong enough to last generations. The H'Mông weave and embroider it with patterns that carry meaning — a language without words, stitched instead of spoken.\n\nIt was a group of H'Mông families who first left Cao Bằng for Saigon, taking part in our first handicraft bazaar in 2012. The following year, a Craft Belt House in Na Kiêng village gave the Flower H'Mông group a place to train, work, and keep their children close. By 2014, a second house followed in Na Dương village for the White H'Mông.\n\nWe're still learning to read it.", vi: "Cây lanh được trồng và xe sợi bằng tay ở xã Phan Thanh, trở thành tấm vải bền qua nhiều thế hệ. Người H'Mông dệt và thêu những hoa văn mang ý nghĩa — một ngôn ngữ không lời, được kể bằng đường kim.\n\nNhững gia đình H'Mông đầu tiên rời Cao Bằng đến Sài Gòn tham dự hội chợ thủ công năm 2012. Năm sau, Nhà Craft Belt ở làng Na Kiêng tạo không gian để nhóm H'Mông Hoa học nghề và làm việc; đến năm 2014, một nhà thứ hai được xây ở Na Dương cho người H'Mông Trắng.\n\nChúng tôi vẫn đang học cách đọc ngôn ngữ ấy." },
  "black-lo-lo": { en: "Fewer hands still know this craft. In Kim Cúc commune, the Black Lô Lô's patchwork embroidery — small, geometric, deliberate, pieced together rather than simply stitched on top of cloth — is one of the rarer traditions we work with, and one we're quietly trying to help survive.\n\nWe've shared a stage with them more than once, at bazaars in the middle of Saigon, wearing the same patterns their grandmothers wore in the mountains.", vi: "Ngày càng ít người còn biết nghề này. Ở xã Kim Cúc, kỹ thuật thêu ghép vải của người Lô Lô Đen — những mảnh nhỏ, hình học, được ghép cẩn thận thay vì chỉ thêu trên mặt vải — là một truyền thống hiếm mà chúng tôi lặng lẽ góp sức gìn giữ.\n\nChúng tôi đã nhiều lần đồng hành cùng họ tại các hội chợ giữa Sài Gòn, nơi họ mặc những hoa văn mà bà và mẹ từng mặc trên núi." }
};
for (const community of defaultContent.communities) if (projectStories[community.slug]) community.story = projectStories[community.slug];
