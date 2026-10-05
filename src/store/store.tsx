import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { migrateCraftSheets } from "../data/craftSheets";
import { defaultContent } from "../data/defaultContent";
import type { L, Lang, SiteContent } from "../lib/types";
import { supabase } from "../lib/supabase";

const CONTENT_KEY = "mystere.content.v2";
const LANG_KEY = "mystere.lang.v1";
const AUTH_KEY = "mystere.auth.v1";
const SUBS_KEY = "mystere.subscribers.v1";
const SITE_CONTENT_ROW = "__site_content__";

/**
 * NOTE ON DATA LAYER
 * ------------------
 * The target production stack is Supabase (Postgres + Auth + Storage).
 * This build runs as a static React app, so the same shape of data is kept in a
 * single `SiteContent` document persisted to localStorage, behind one small API
 * (`useStore`). Swapping to Supabase means replacing the three functions below
 * (load / save / signIn) with Supabase client calls — no component changes.
 */

export interface Subscriber {
  email: string;
  name?: string;
  date: string;
}

interface StoreValue {
  content: SiteContent;
  setContent: (updater: (draft: SiteContent) => SiteContent) => void;
  saveContent: () => Promise<{ ok: boolean; error?: string }>;
  resetContent: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (v: L | undefined) => string;
  user: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  subscribers: Subscriber[];
  addSubscriber: (s: Subscriber) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Update only untouched v2 defaults; preserve all existing customer edits.
function loadCurrentContent(): SiteContent {
  let saved = load<SiteContent>(CONTENT_KEY, defaultContent);
  if (saved === defaultContent) saved = structuredClone(defaultContent);
  // Remove the temporary record created during initial CMS testing.
  saved.communities = (saved.communities ?? []).filter(item => item.id !== "new-community" && item.slug !== "new-community");
  for (const community of saved.communities) {
    const defaults = defaultContent.communities.find(item => item.id === community.id);
    community.documentUrl ??= defaults?.documentUrl ?? "";
    if (!community.documentLabel || community.documentLabel.en === "Read the DECEN presentation") {
      community.documentLabel = structuredClone(defaults?.documentLabel ?? { en: "", vi: "" });
    }
  }
  saved.communityCards ??= structuredClone(saved.communities);
  saved.home.mission ??= structuredClone(saved.home.intro);
  saved.events ??= structuredClone(defaultContent.events);
  saved.categories ??= structuredClone(defaultContent.categories);
  for (const category of saved.categories) {
    const description = {
      en: category.description?.en || category.short?.en || "",
      vi: category.description?.vi || category.short?.vi || "",
    };
    category.description = description;
    category.short = { ...description };
    category.gallery ??= [];
  }
  saved.products ??= structuredClone(defaultContent.products);
  for (const product of saved.products) {
    product.story ??= structuredClone(product.description);
    product.gallery ??= [];
  }
  for (const category of defaultContent.categories) {
    if (!saved.craft.sheetVersion && !saved.categories.some(item => item.id === category.id)) saved.categories.push(structuredClone(category));
  }
  for (const event of defaultContent.events) {
    const existing = saved.events.find(item => item.id === event.id);
    if (existing) { existing.image ??= event.image; existing.url ??= ""; }
  }
  for (const community of defaultContent.communities) {
    const existing = saved.communities.find(item => item.id === community.id);
    if (existing && (existing.story.en.length < 500 ||
      (community.slug === "red-dao" && !existing.story.en.includes("five elements")) ||
      (community.slug === "dao-tien" && !existing.story.en.includes("Hòa Thuận")) ||
      (community.slug === "nung" && !existing.story.en.includes("Phúc Sen")) ||
      (community.slug === "hmong" && !existing.story.en.includes("Na Kiêng")) ||
      (community.slug === "black-lo-lo" && !existing.story.en.includes("Kim Cúc")))) existing.story = community.story;
  }
  for (const community of defaultContent.communities) {
    const existing = saved.communities.find(item => item.id === community.id);
    if (existing && (!existing.image || existing.image.startsWith("https://lh3.googleusercontent.com") || existing.image.startsWith("/images/project-"))) existing.image = community.image;
  }
  // Migrate the previous bundled JPG without overwriting custom image URLs.
  for (const block of [saved.home.intro, saved.home.thread]) {
    if (block.image === "/images/mystere-shop.jpg") block.image = "/images/mystere-shop.png";
  }
  if (["/images/mystere-shop.png", "/images/shop.jpg"].includes(saved.home.intro.image)) {
    saved.home.intro.image = defaultContent.home.intro.image;
  }
  if (saved.home.heroImage.startsWith("https://lh3.googleusercontent.com")) saved.home.heroImage = defaultContent.home.heroImage;
  const legacy = (value: string, id: string) => value?.startsWith(`https://lh3.googleusercontent.com/d/${id}=`);
  if (legacy(saved.home.intro.image, "1WTrl0Uh0fHLZDlnP2dvLh4qD5_JiDnn7")) saved.home.intro.image = defaultContent.home.intro.image;
  if (saved.home.artisan.image === "/images/red-dao.jpg" || legacy(saved.home.artisan.image, "1Nk-1AOnhOMu5sc-u0BTzQoyYw_ITK0lN")) saved.home.artisan.image = defaultContent.home.artisan.image;
  if (legacy(saved.home.thread.image, "1xnKHLZ9pyPImdf9rIVryBfIE_trP1FUo")) saved.home.thread.image = defaultContent.home.thread.image;
  if (!saved.contact.logo || saved.contact.logo === "/images/mystere-logo.png") saved.contact.logo = defaultContent.contact.logo;
  const redDao = saved.communities.find(c => c.slug === "red-dao");
  if (redDao && (redDao.image === "/images/red-dao.jpg" || legacy(redDao.image, "1g8jxhr1NKHeiMFGRS3YCvOXjXRTjfBSW"))) redDao.image = defaultContent.communities[0].image;
  if (saved.home.intro.body.en.startsWith("Mystère Shop was born from a simple belief:") || saved.home.intro.body.en.startsWith("Founded in Saigon in 2001, Mystère Shop is a family business connecting")) saved.home.intro.body = defaultContent.home.intro.body;
  if (saved.home.intro.title.en.startsWith("We help hill-tribe artisans")) saved.home.intro.title = defaultContent.home.intro.title;
  if (saved.about.title.en === "About Mystère") saved.about.title = defaultContent.about.title;
  if (saved.home.artisan.body.en.startsWith("It started at a small fair for ethnic minority artisans,")) saved.home.artisan.body = defaultContent.home.artisan.body;
  if (saved.home.projectsIntro.body.en.startsWith("Red Dao, Dao Tiền, Nùng")) saved.home.projectsIntro.body = defaultContent.home.projectsIntro.body;
  if (saved.home.projectsIntro.title.en.startsWith("Standing beside the artisans")) saved.home.projectsIntro.title = defaultContent.home.projectsIntro.title;
  if (saved.home.projectsIntro.body.en.startsWith("Mystère Shop has been trading the finest handmade")) saved.home.projectsIntro.body = defaultContent.home.projectsIntro.body;
  if (saved.newsletter.title.en === "More stories are coming") {
    saved.newsletter.title = defaultContent.newsletter.title;
    saved.newsletter.body = defaultContent.newsletter.body;
  }
  migrateCraftSheets(saved);
  return saved;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() =>
    loadCurrentContent(),
  );
  const [lang, setLangState] = useState<Lang>(() => load<Lang>(LANG_KEY, "en"));
  const [user, setUser] = useState<string | null>(() => load<string | null>(AUTH_KEY, null));
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() =>
    load<Subscriber[]>(SUBS_KEY, []),
  );
  const remoteReady = useState({ current: false })[0];

  useEffect(() => {
    const client = supabase;
    if (!client) { remoteReady.current = true; return; }
    let active = true;
    const hydrate = async () => {
      const [communities, events] = await Promise.all([
        client.from('communities').select('*').order('sort_order'),
        client.from('events').select('*').order('sort_order'),
      ]);
      if (!active) return;
      setContentState(prev => {
        const next = structuredClone(prev);
        if (!communities.error && communities.data) {
          const sitePayload = communities.data.find(row => row.id === SITE_CONTENT_ROW)?.story?.payload;
          if (sitePayload && typeof sitePayload === 'object') Object.assign(next, sitePayload);
          next.categories ??= structuredClone(defaultContent.categories);
          next.categories.forEach(category => {
            const description = { en: category.description?.en || category.short?.en || "", vi: category.description?.vi || category.short?.vi || "" };
            category.description = description;
            category.short = { ...description };
            category.gallery ??= [];
          });
          next.products ??= structuredClone(defaultContent.products);
          next.products.forEach(product => { product.story ??= structuredClone(product.description); product.gallery ??= []; });
          next.home.mission ??= structuredClone(next.home.intro);
          next.communities = communities.data.filter(row => row.id !== SITE_CONTENT_ROW && row.id !== "new-community" && row.slug !== "new-community").map(row => {
            const defaults = defaultContent.communities.find(item => item.id === row.id);
            const savedReference = next.communities.find(item => item.id === row.id);
            const documentLabel = savedReference?.documentLabel?.en === "Read the DECEN presentation" ? defaults?.documentLabel : savedReference?.documentLabel;
            const savedGallery = Array.isArray(row.story?.gallery) ? row.story.gallery.filter(Boolean) : [];
            return { ...row, region: row.region, title: row.title, line: row.line, story: { en: row.story?.en ?? '', vi: row.story?.vi ?? '' }, gallery: savedGallery.length ? savedGallery : (savedReference?.gallery ?? defaults?.gallery ?? []), craft: row.craft, documentUrl: savedReference?.documentUrl ?? defaults?.documentUrl ?? "", documentLabel: documentLabel ?? defaults?.documentLabel ?? { en: "", vi: "" } };
          });
        }
        if (!events.error && events.data?.length) next.events = events.data.map(row => ({ id: row.id, image: row.image, url: row.url ?? '', title: row.title, dateLabel: row.date_label, dateStart: row.date_start ?? '', schedule: row.schedule, venue: row.venue, address: row.address, published: row.published }));
        migrateCraftSheets(next);
        return next;
      });
      remoteReady.current = true;
    };
    hydrate();
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user.email ?? null));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [remoteReady]);

  useEffect(() => {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  }, [content]);
  useEffect(() => {
    localStorage.setItem(LANG_KEY, JSON.stringify(lang));
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem(SUBS_KEY, JSON.stringify(subscribers));
  }, [subscribers]);

  const setContent = useCallback((updater: (draft: SiteContent) => SiteContent) => {
    setContentState((prev) => updater(structuredClone(prev)));
  }, []);

  const resetContent = useCallback(() => setContentState(() => {
    const next = structuredClone(defaultContent);
    next.communityCards = structuredClone(next.communities);
    return next;
  }), []);

  const t = useCallback((v: L | undefined) => (v ? v[lang] || v.en : ""), [lang]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.user) return false;
      setUser(data.user.email ?? email.trim().toLowerCase());
      return true;
    }
    if (email.trim().toLowerCase() === "admin@mystere.vn" && password === "mystere2001") { setUser(email.trim().toLowerCase()); return true; }
    return false;
  }, []);
  const saveContent = useCallback(async () => {
    if (!supabase || !user) { localStorage.setItem(CONTENT_KEY, JSON.stringify(content)); return { ok: true }; }
    const communityIds = [...content.communities.map(row => row.id), SITE_CONTENT_ROW];
    const eventIds = content.events.map(row => row.id);
    const updated_at = new Date().toISOString();
    const communityRows = content.communities.map((row, sort_order) => ({
      id:row.id, slug:row.slug, name:row.name, region:row.region, title:row.title,
      line:row.line, story:{ ...row.story, gallery:row.gallery ?? [] }, craft:row.craft,
      image:row.image, published:row.published, sort_order, updated_at,
    }));
    const sitePayload = { home:content.home, about:content.about, story:content.story, craft:content.craft, journal:content.journal, newsletter:content.newsletter, contact:content.contact, categories:content.categories, products:content.products, articles:content.articles, partners:content.partners, communityCards:content.communityCards };
    const [communities, events] = await Promise.all([
      supabase.from('communities').upsert([
        ...communityRows,
        { id:SITE_CONTENT_ROW, slug:SITE_CONTENT_ROW, name:'Site content', region:{en:'',vi:''}, title:{en:'',vi:''}, line:{en:'',vi:''}, story:{payload:sitePayload}, craft:{en:'',vi:''}, image:'', published:true, sort_order:-1, updated_at },
      ]),
      supabase.from('events').upsert(content.events.map((row, sort_order) => ({ id: row.id, image: row.image, url: row.url, title: row.title, date_label: row.dateLabel, date_start: row.dateStart || null, schedule: row.schedule, venue: row.venue, address: row.address, published: row.published, sort_order }))),
    ]);
    if (communities.error || events.error) return { ok:false, error:communities.error?.message || events.error?.message || 'Unable to save content.' };
    const quoteIds = (ids: string[]) => `(${ids.map(id => `"${id.replace(/"/g,'\\"')}"`).join(',')})`;
    const [communityDelete, eventDelete] = await Promise.all([
      supabase.from('communities').delete().not('id', 'in', quoteIds(communityIds)),
      eventIds.length ? supabase.from('events').delete().not('id', 'in', quoteIds(eventIds)) : supabase.from('events').delete().neq('id', ''),
    ]);
    if (communityDelete.error || eventDelete.error) return { ok:false, error:communityDelete.error?.message || eventDelete.error?.message || 'Saved changes, but could not remove deleted records.' };
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    return { ok:true };
  }, [content, user]);

  const value = useMemo<StoreValue>(
    () => ({
      content,
      setContent,
      saveContent,
      resetContent,
      lang,
      setLang: setLangState,
      t,
      user,
      signIn,
      signOut: () => { setUser(null); void supabase?.auth.signOut(); },
      subscribers,
      addSubscriber: (s) => setSubscribers((prev) => [s, ...prev.filter(item => item.email.toLowerCase() !== s.email.toLowerCase())]),
    }),
    [content, setContent, saveContent, resetContent, lang, t, user, signIn, subscribers],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useT() {
  return useStore().t;
}
