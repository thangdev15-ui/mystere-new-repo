export type Lang = "en" | "vi";

export type L = { en: string; vi: string };

export interface Community {
  id: string;
  slug: string;
  name: string;
  region: L;
  /** Layer-2 heading, e.g. "The friendship that started it all" */
  title: L;
  /** One-line summary used on cards, e.g. "a partnership that began with one woman..." */
  line: L;
  /** Full layer-2 story */
  story: L;
  craft: L;
  image: string;
  gallery?: string[];
  /** Optional supporting PDF or external reference shown with a collaboration. */
  documentUrl?: string;
  documentLabel?: L;
  published: boolean;
}

export interface Category {
  /** Finished page artwork. Vietnamese falls back to the supplied English page. */
  pageImage?: L;
  id: string;
  slug: string;
  name: L;
  short: L;
  description: L;
  image: string;
  /** Optional image-only strip displayed beneath the collection introduction. */
  gallery?: string[];
  published: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: L;
  description: L;
  /** Full editorial story, stored as rich HTML. */
  story?: L;
  community: string;
  materials: L;
  image: string;
  /** Supporting photographs displayed beneath the product story. */
  gallery?: string[];
  published: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: L;
  /** ISO date. Leave empty when the client has not confirmed a date — no date is shown. */
  date: string;
  excerpt: L;
  body: L;
  cover: string;
  gallery: string[];
  published: boolean;
}

/** Supporting NGO / project partners (DECEN, the LIVE Project, HELVETAS) */
export interface Partner {
  id: string;
  name: string;
  role: L;
  body: L;
  image: string;
  url: string;
  published: boolean;
}

export interface Block {
  title: L;
  body: L;
  image: string;
}

export interface ShopEvent {
  image: string;
  url: string;
  id: string;
  title: L;
  dateLabel: L;
  dateStart: string;
  schedule: L;
  venue: string;
  address: L;
  published: boolean;
}

export interface SiteContent {
  events: ShopEvent[];
  home: {
    heroImage: string;
    heroEyebrow: L;
    heroCta: L;
    intro: Block;
    /** Independent content for the Our Mission block on the About Mystère page. */
    mission?: Block;
    anniversary: Block;
    artisan: Block & { quote: L; quoteAuthor: L };
    projectsIntro: { title: L; body: L };
    projectsLead?: Block;
    thread: Block;
    craftIntro: { title: L; body: L };
    journalIntro: { title: L; body: L };
    visit: Block;
  };
  about: {
    heroImage: string;
    title: L;
    lead: L;
    blocks: Block[];
    numbers: { value: string; label: L }[];
  };
  story: {
    heroImage: string;
    title: L;
    lead: L;
    body: L;
    quote: L;
    quoteAuthor: L;
    communitiesTitle: L;
    communitiesLead: L;
    partnersTitle: L;
    partnersLead: L;
    partnersNote: L;
  };
  craft: {
    sheetVersion?: number;
    heroImage: string;
    title: L;
    lead: L;
    note: L;
  };
  journal: {
    title: L;
    lead: L;
  };
  newsletter: {
    title: L;
    body: L;
    button: L;
    success: L;
  };
  contact: {
    /** Wordmark image. Empty = typographic logo is used. */
    logo: string;
    image: string;
    displayName: L;
    addressLines: string[];
    phone: string;
    zalo: string;
    hours: L;
    mapsUrl: string;
    instagram: string;
    facebook: string;
    email: string;
    note: L;
  };
  communities: Community[];
  /** Independent cards shown in "Communities we work with". */
  communityCards?: Community[];
  categories: Category[];
  products: Product[];
  articles: Article[];
  partners: Partner[];
}
