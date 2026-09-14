import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultContent } from "../data/defaultContent";
import type { L, Lang, SiteContent } from "../lib/types";

const CONTENT_KEY = "mystere.content.v2";
const LANG_KEY = "mystere.lang.v1";
const AUTH_KEY = "mystere.auth.v1";
const SUBS_KEY = "mystere.subscribers.v1";

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
  resetContent: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (v: L | undefined) => string;
  user: string | null;
  signIn: (email: string, password: string) => boolean;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() =>
    load<SiteContent>(CONTENT_KEY, defaultContent),
  );
  const [lang, setLangState] = useState<Lang>(() => load<Lang>(LANG_KEY, "en"));
  const [user, setUser] = useState<string | null>(() => load<string | null>(AUTH_KEY, null));
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() =>
    load<Subscriber[]>(SUBS_KEY, []),
  );

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

  const resetContent = useCallback(() => setContentState(structuredClone(defaultContent)), []);

  const t = useCallback((v: L | undefined) => (v ? v[lang] || v.en : ""), [lang]);

  const signIn = useCallback((email: string, password: string) => {
    // Demo credentials — replace with supabase.auth.signInWithPassword()
    if (email.trim().toLowerCase() === "admin@mystere.vn" && password === "mystere2001") {
      setUser(email.trim().toLowerCase());
      return true;
    }
    return false;
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      content,
      setContent,
      resetContent,
      lang,
      setLang: setLangState,
      t,
      user,
      signIn,
      signOut: () => setUser(null),
      subscribers,
      addSubscriber: (s) => setSubscribers((prev) => [s, ...prev]),
    }),
    [content, setContent, resetContent, lang, t, user, signIn, subscribers],
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
