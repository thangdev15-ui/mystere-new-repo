import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import type { Block, SiteContent } from "../lib/types";
import { ui } from "../lib/ui";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  AddButton,
  AdminCard,
  Field,
  ImageField,
  LangField,
  RichLangField,
  Note,
  TextArea,
  TextInput,
  Toggle,
  emptyL,
  slugify,
} from "../components/admin/fields";

type SectionKey =
  | "dashboard"
  | "events"
  | "home"
  | "about"
  | "story"
  | "projects"
  | "communities"
  | "categories"
  | "journal"
  | "partners"
  | "contact"
  | "newsletter"
  | "settings";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "home", label: "NEW · Page content" },
  { key: "projects", label: "What we do · Project" },
  { key: "communities", label: "What we do · Communities" },
  { key: "events", label: "What we do · Events" },
  { key: "categories", label: "Craft & Products · Topics" },
  { key: "newsletter", label: "Newsletter" },
  { key: "contact", label: "Logo & Contact" },
  { key: "settings", label: "Settings" },
];

function Login() {
  const { signIn, content } = useStore();
  const [email, setEmail] = useState("admin@mystere.vn");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="Shop Huyền Bí">
        <img className="login-brand-image" src="/images/Banner.png" alt="Nghệ nhân và cộng đồng vùng cao Việt Nam" />
        <div className="login-brand-overlay" />
        <div className="login-brand-content">
          <Link to="/" className="login-brand-mark">{content.contact.logo && <img src={content.contact.logo} alt="" />}<span>Shop Huyền Bí<small>Mystère Shop</small></span></Link>
          <div className="login-brand-story"><h1>Tinh hoa Việt Nam,<br/>bắt nguồn từ con người<br/>và vùng đất</h1><i/><p>Lan tỏa giá trị văn hóa, sản phẩm thủ công truyền thống Việt Nam đến gần hơn với bạn và thế giới.</p></div>
        </div>
      </section>
      <section className="login-form-panel">
        <div className="login-ornament" aria-hidden="true">✥</div>
        <div className="login-form-wrap">
          <p className="login-overline">Chào mừng bạn trở lại</p>
          <h2>Đăng nhập</h2>
          <p className="login-intro">Vui lòng đăng nhập để tiếp tục quản lý nội dung và khám phá những câu chuyện đặc sắc.</p>
        <form
          className="login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(false); setLoading(true);
            const ok = await signIn(email, password);
            setLoading(false); if (!ok) setError(true);
          }}
        >
          <label className="login-field"><span className="login-field-icon" aria-hidden="true">✉</span><input type="email" autoComplete="email" required placeholder="Email hoặc số điện thoại" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="login-field"><span className="login-field-icon" aria-hidden="true">⌑</span><input type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="login-reveal" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Ẩn' : 'Hiện'}</button>
          </label>
          <div className="login-options"><label><input type="checkbox" /> <span>Ghi nhớ đăng nhập</span></label><a href={`mailto:${content.contact.email}?subject=Quên mật khẩu`}>Quên mật khẩu?</a></div>
          {error && <p className="login-error" role="alert">Email hoặc mật khẩu không chính xác.</p>}
          <button className="login-submit" disabled={loading}>{loading ? 'ĐANG ĐĂNG NHẬP…' : 'ĐĂNG NHẬP  →'}</button>
          <div className="login-divider"><span>Hoặc</span></div>
          <button type="button" className="login-google" disabled title="Đăng nhập Google chưa được cấu hình"><b>G</b> Đăng nhập với Google</button>
        </form>
          <p className="login-register">Chưa có tài khoản? <a href={`mailto:${content.contact.email}?subject=Yêu cầu tài khoản quản trị`}>Đăng ký ngay →</a></p>
        </div>
      </section>
    </main>
  );
}

export default function Admin() {
  const { content, setContent, saveContent, resetContent, user, signOut, subscribers, t } = useStore();
  const [section, setSection] = useState<SectionKey>("home");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [connection, setConnection] = useState<'idle' | 'checking' | 'connected' | 'error'>(isSupabaseConfigured ? 'checking' : 'idle');
  const checkConnection = async () => {
    if (!supabase) { setConnection('idle'); return; }
    setConnection('checking');
    const { error } = await supabase.from('communities').select('id').limit(1);
    setConnection(error ? 'error' : 'connected');
  };
  useEffect(() => { if (isSupabaseConfigured) void checkConnection(); }, []);

  if (!user) return <Login />;

  const up = (fn: (d: SiteContent) => void) => {
    setContent((d) => {
      fn(d);
      return d;
    });
    setSaved(true);
    setDirty(true);
    window.clearTimeout((window as any).__mystereSaveTimer);
    (window as any).__mystereSaveTimer = window.setTimeout(() => setSaved(false), 1200);
  };
  const save = async () => { setSaving(true); setSaveError(""); const result = await saveContent(); setSaving(false); setDirty(!result.ok); setSaved(result.ok); if (!result.ok) setSaveError(result.error || "Save failed. Please try again."); window.setTimeout(() => setSaved(false), 1800); };

  const move = <T,>(arr: T[], i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  const BlockEditor = ({
    block,
    onChange,
    title,
  }: {
    block: Block;
    onChange: (fn: (b: Block) => void) => void;
    title: string;
  }) => (
    <AdminCard title={title}>
      <LangField label="Title" value={block.title} onChange={(v) => onChange((b) => (b.title = v))} />
      <LangField
        label="Body"
        multiline
        rows={6}
        value={block.body}
        onChange={(v) => onChange((b) => (b.body = v))}
      />
      <ImageField label="Image" value={block.image} onChange={(v) => onChange((b) => (b.image = v))} />
    </AdminCard>
  );

  return (
    <div className="admin-shell min-h-screen bg-cream/60">
      <header className="admin-topbar sticky top-0 z-30 border-b border-sand bg-ivory">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
          <div className="admin-topbar-brand">
            <Link to="/">{content.contact.logo && <img src={content.contact.logo} alt="" />}<span>Shop Huyền Bí<small>Mystère Content Studio</small></span></Link>
          </div>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
            <span className={`${dirty || saveError ? "text-rust" : "text-moss"}`} title={saveError}>
              {saving ? 'Saving…' : saveError ? 'Save failed' : dirty ? 'Unsaved changes' : saved ? 'Saved just now' : 'All changes saved'}
            </span>
            <button onClick={() => void save()} disabled={!dirty || saving} className="border border-charcoal px-3 py-2 text-[10px] uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40">Save changes</button>
            <Link to="/" className="text-cocoa/70 hover:text-charcoal">
              View site
            </Link>
            <button onClick={signOut} className="text-rust hover:underline">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="admin-workspace mx-auto flex max-w-[1500px] flex-col gap-10 px-6 py-10 lg:flex-row">
        <aside className="admin-sidebar lg:w-52 lg:shrink-0">
          <p className="admin-sidebar-kicker">Mystère CMS</p>
          <ul className="flex flex-wrap gap-2 lg:sticky lg:top-24 lg:flex-col">
            {SECTIONS.map((s) => (
              <li key={s.key}>
                <button
                  onClick={() => setSection(s.key)}
                    className={`admin-nav-item w-full px-3 py-2 text-left text-[12px] uppercase tracking-[0.16em] transition-colors ${
                    section === s.key
                      ? "bg-charcoal text-ivory"
                      : "text-cocoa/70 hover:bg-sand/40 hover:text-charcoal"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="admin-sidebar-note">Crafts.<br/>Communities.<br/>A better tomorrow.</p>
        </aside>

        <div className="admin-content min-w-0 flex-1 space-y-8">
          {saveError && <div className="admin-save-error" role="alert"><strong>Could not save changes.</strong><span>{saveError}</span></div>}
          {section === "dashboard" && <>
            <div className="admin-page-heading"><div><p className="admin-overline">Dashboard</p><h1>Welcome back, Admin</h1><p>Keep the stories, people and events of Mystère up to date.</p></div><Link className="admin-preview" to="/">View site ↗</Link></div>
            <div className="admin-stat-grid"><button onClick={() => setSection('home')}><strong>1</strong><span>Pages</span></button><button onClick={() => setSection('projects')}><strong>{content.communities.length}</strong><span>Projects</span></button><button onClick={() => setSection('communities')}><strong>{(content.communityCards ?? []).length}</strong><span>Communities</span></button><button onClick={() => setSection('events')}><strong>{content.events.length}</strong><span>Events</span></button></div>
            <AdminCard title="Quick actions"><div className="admin-quick-actions"><button onClick={() => setSection('home')}>Edit Who We Are <span>→</span></button><button onClick={() => setSection('projects')}>Manage projects <span>→</span></button><button onClick={() => setSection('communities')}>Manage communities <span>→</span></button><button onClick={() => setSection('events')}>Create an event <span>→</span></button></div></AdminCard>
          </>}
          {/* HOMEPAGE */}
          {section === "home" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">NEW · Page content</h1>
              <Note>The website has two main sections. Use photographs without embedded document text. Our Story and Our Mission are separate blocks. Saved content is shared through Supabase.</Note>
              <AdminCard title="Opening banner">
                <ImageField label="Banner image" maxFileSizeMb={5} value={content.home.heroImage} onChange={(v) => up((d) => (d.home.heroImage = v))} />
                <LangField label="Eyebrow" value={content.home.heroEyebrow} onChange={(v) => up((d) => (d.home.heroEyebrow = v))} />
                <LangField label="Button label" value={content.home.heroCta} onChange={(v) => up((d) => (d.home.heroCta = v))} />
              </AdminCard>
              <BlockEditor title="Home page · Our Story" block={content.home.intro} onChange={(fn) => up((d) => fn(d.home.intro))} />
              <BlockEditor title="About Mystère page · Our Mission" block={content.home.mission ?? content.home.intro} onChange={(fn) => up((d) => { d.home.mission ??= structuredClone(d.home.intro); fn(d.home.mission); })} />
              <BlockEditor title="1.2 · Who we are — Where it began" block={content.home.artisan} onChange={(fn) => up((d) => fn(d.home.artisan))} />
              <AdminCard title="2.1 · What we do — Our Collaboration">
                <LangField label="Title" value={content.home.projectsIntro.title} onChange={(v) => up((d) => (d.home.projectsIntro.title = v))} />
                <LangField label="Body" multiline value={content.home.projectsIntro.body} onChange={(v) => up((d) => (d.home.projectsIntro.body = v))} />
                <Note>Edit project summaries and detail pages under What we do · Project. Community cards and events have their own sections.</Note>
              </AdminCard>
              <BlockEditor title="2.2 · What we do — The thread that connects" block={content.home.thread} onChange={(fn) => up((d) => fn(d.home.thread))} />
            </>
          )}

          {/* STORY */}
          {section === "story" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">Our Story</h1>
              <AdminCard title="Main story">
                <ImageField
                  label="Hero image"
                  value={content.story.heroImage}
                  onChange={(v) => up((d) => (d.story.heroImage = v))}
                />
                <LangField
                  label="Title"
                  value={content.story.title}
                  onChange={(v) => up((d) => (d.story.title = v))}
                />
                <LangField
                  label="Lead"
                  multiline
                  rows={4}
                  value={content.story.lead}
                  onChange={(v) => up((d) => (d.story.lead = v))}
                />
                <LangField
                  label="Body"
                  multiline
                  rows={10}
                  value={content.story.body}
                  onChange={(v) => up((d) => (d.story.body = v))}
                />
                <LangField
                  label="Quote"
                  value={content.story.quote}
                  onChange={(v) => up((d) => (d.story.quote = v))}
                />
                <LangField
                  label="Quote author"
                  value={content.story.quoteAuthor}
                  onChange={(v) => up((d) => (d.story.quoteAuthor = v))}
                />
              </AdminCard>
              <AdminCard title="Communities section intro">
                <LangField
                  label="Title"
                  value={content.story.communitiesTitle}
                  onChange={(v) => up((d) => (d.story.communitiesTitle = v))}
                />
                <LangField
                  label="Lead"
                  value={content.story.communitiesLead}
                  onChange={(v) => up((d) => (d.story.communitiesLead = v))}
                />
              </AdminCard>
              <AdminCard title="Partners section intro">
                <LangField
                  label="Title"
                  value={content.story.partnersTitle}
                  onChange={(v) => up((d) => (d.story.partnersTitle = v))}
                />
                <LangField
                  label="Lead"
                  multiline
                  rows={3}
                  value={content.story.partnersLead}
                  onChange={(v) => up((d) => (d.story.partnersLead = v))}
                />
                <LangField
                  label="Footnote"
                  multiline
                  rows={2}
                  value={content.story.partnersNote}
                  onChange={(v) => up((d) => (d.story.partnersNote = v))}
                />
              </AdminCard>
            </>
          )}

          {/* COMMUNITIES */}
          {section === "projects" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">What we do · Project</h1>
              <Note>Manage the project summaries and their detail pages. Community cards are managed separately.</Note>
              {content.communities.map((c, i) => (
                <AdminCard
                  key={c.id}
                  collapsible
                  title={c.name || "Project"}
                  onDelete={() => up((d) => d.communities.splice(i, 1))}
                  onMoveUp={() => up((d) => move(d.communities, i, -1))}
                  onMoveDown={() => up((d) => move(d.communities, i, 1))}
                >
                  <Toggle
                    label={t(ui.published)}
                    value={c.published}
                    onChange={(v) => up((d) => (d.communities[i].published = v))}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name">
                      <TextInput
                        value={c.name}
                        onChange={(v) =>
                          up((d) => {
                            d.communities[i].name = v;
                            d.communities[i].slug = slugify(v);
                          })
                        }
                      />
                    </Field>
                    <Field label="Slug (URL anchor)">
                      <TextInput
                        value={c.slug}
                        onChange={(v) => up((d) => (d.communities[i].slug = slugify(v)))}
                      />
                    </Field>
                  </div>
                  <LangField
                    label="Region"
                    value={c.region}
                    onChange={(v) => up((d) => (d.communities[i].region = v))}
                  />
                  <LangField
                    label="Heading"
                    value={c.title}
                    onChange={(v) => up((d) => (d.communities[i].title = v))}
                  />
                  <LangField
                    label="One-line summary"
                    multiline
                    rows={2}
                    value={c.line}
                    onChange={(v) => up((d) => (d.communities[i].line = v))}
                  />
                  <RichLangField
                    label="Story"
                    value={c.story}
                    onChange={(v) => up((d) => (d.communities[i].story = v))}
                  />
                  <LangField
                    label="Craft"
                    multiline
                    rows={2}
                    value={c.craft}
                    onChange={(v) => up((d) => (d.communities[i].craft = v))}
                  />
                  <ImageField
                    label="Image"
                    value={c.image}
                    onChange={(v) => up((d) => (d.communities[i].image = v))}
                  />
                  <Field label="DECEN / reference PDF URL">
                    <TextInput value={c.documentUrl ?? ""} onChange={(v) => up((d) => (d.communities[i].documentUrl = v))} placeholder="/Decen/document.pdf" />
                  </Field>
                  <LangField label="PDF button label" value={c.documentLabel ?? { ...emptyL }} onChange={(v) => up((d) => (d.communities[i].documentLabel = v))} />
                  {(c.gallery ?? []).map((image, imageIndex) => <div key={imageIndex} className="admin-gallery-field"><ImageField label={`Gallery image ${imageIndex + 1}`} value={image} onChange={(v) => up((d) => (d.communities[i].gallery ??= [])[imageIndex] = v)} /><button type="button" className="admin-gallery-remove" onClick={() => up((d) => (d.communities[i].gallery ??= []).splice(imageIndex,1))}>Remove image</button></div>)}
                  <Note>Project gallery images appear together beneath the story. Add as many images as needed; they are shown in the same order here.</Note>
                  <AddButton label="Add gallery image" onClick={() => up((d) => (d.communities[i].gallery ??= []).push(""))} />
                </AdminCard>
              ))}
              <AddButton
                label="Add project"
                onClick={() =>
                  up((d) =>
                    d.communities.push({
                      id: `c${Date.now()}`,
                      slug: "new-project",
                      name: "New project",
                      region: { ...emptyL },
                      title: { ...emptyL },
                      line: { ...emptyL },
                      story: { ...emptyL },
                      craft: { ...emptyL },
                      image: "",
                      gallery: [],
                      documentUrl: "",
                      documentLabel: { ...emptyL },
                      published: true,
                    }),
                  )
                }
              />
            </>
          )}

          {section === "communities" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">What we do · Communities</h1>
              <Note>These five cards are independent from Projects. Changes here only affect the “Communities we work with” carousel.</Note>
              {(content.communityCards ?? []).map((c, i) => (
                <AdminCard key={c.id} collapsible title={c.name || "Community"}
                  onDelete={() => up((d) => (d.communityCards ??= []).splice(i, 1))}
                  onMoveUp={() => up((d) => move((d.communityCards ??= []), i, -1))}
                  onMoveDown={() => up((d) => move((d.communityCards ??= []), i, 1))}>
                  <Toggle label={t(ui.published)} value={c.published} onChange={(v) => up((d) => (d.communityCards ??= [])[i].published = v)} />
                  <Field label="Community name"><TextInput value={c.name} onChange={(v) => up((d) => (d.communityCards ??= [])[i].name = v)} /></Field>
                  <LangField label="Product / craft line" multiline rows={2} value={c.craft} onChange={(v) => up((d) => (d.communityCards ??= [])[i].craft = v)} />
                  <ImageField label="Image" value={c.image} onChange={(v) => up((d) => (d.communityCards ??= [])[i].image = v)} />
                </AdminCard>
              ))}
              <AddButton label="Add community" onClick={() => up((d) => (d.communityCards ??= []).push({
                id: `community-${Date.now()}`, slug: `community-${Date.now()}`, name: "New community",
                region: { ...emptyL }, title: { ...emptyL }, line: { ...emptyL }, story: { ...emptyL },
                craft: { ...emptyL }, image: "", published: true,
              }))} />
            </>
          )}

          {/* CATEGORIES */}
          {section === "categories" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">Craft & Products · Topics</h1>
              <Note>The approved pages use the original artwork to keep the exact layout. Replace the full page image below to update it. Text inside an image cannot be edited separately. Vietnamese uses the English artwork unless a Vietnamese page is uploaded.</Note>
              {content.categories.map((c, i) => (
                <AdminCard
                  key={c.id}
                  title={c.name.en || "Category"}
                  onDelete={() => up((d) => d.categories.splice(i, 1))}
                  onMoveUp={() => up((d) => move(d.categories, i, -1))}
                  onMoveDown={() => up((d) => move(d.categories, i, 1))}
                >
                  <Toggle
                    label={t(ui.published)}
                    value={c.published}
                    onChange={(v) => up((d) => (d.categories[i].published = v))}
                  />
                  <LangField
                    label="Name"
                    value={c.name}
                    onChange={(v) =>
                      up((d) => {
                        d.categories[i].name = v;
                        d.categories[i].slug = slugify(v.en);
                      })
                    }
                  />
                  <Field label="Slug (URL)">
                    <TextInput
                      value={c.slug}
                      onChange={(v) => up((d) => (d.categories[i].slug = slugify(v)))}
                    />
                  </Field>
                  <ImageField label="Full page artwork · EN" value={c.pageImage?.en ?? ""} onChange={v => up(d => { d.categories[i].pageImage = { en: v, vi: c.pageImage?.vi ?? "" }; })} />
                  <ImageField label="Full page artwork · VN (optional)" value={c.pageImage?.vi ?? ""} onChange={v => up(d => { d.categories[i].pageImage = { en: c.pageImage?.en ?? "", vi: v }; })} />
                  {!c.pageImage?.en && !c.pageImage?.vi && <>
                  <RichLangField
                    label="Editorial content"
                    value={{ en: c.description.en || c.short.en, vi: c.description.vi || c.short.vi }}
                    onChange={(v) => up((d) => {
                      d.categories[i].description = v;
                      d.categories[i].short = { ...v };
                    })}
                  />
                  <ImageField
                    label="Main image"
                    value={c.image}
                    onChange={(v) => up((d) => (d.categories[i].image = v))}
                  />
                  <div className="admin-image-strip-editor">
                    <span className="admin-image-strip-editor-label">Image strip</span>
                    <p>Optional horizontal images only. Add as many as needed; no text is shown with them.</p>
                    {(c.gallery ?? []).map((image, imageIndex) => <div key={imageIndex} className="admin-gallery-field"><ImageField label={`Strip image ${imageIndex + 1}`} value={image} onChange={(v) => up((d) => (d.categories[i].gallery ??= [])[imageIndex] = v)} /><button type="button" className="admin-gallery-remove" onClick={() => up((d) => (d.categories[i].gallery ??= []).splice(imageIndex, 1))}>Remove image</button></div>)}
                    <AddButton label="Add strip image" onClick={() => up((d) => (d.categories[i].gallery ??= []).push(""))} />
                  </div>
                  </>}
                </AdminCard>
              ))}
              <AddButton
                label="Add topic"
                onClick={() =>
                  up((d) =>
                    d.categories.push({
                      id: `cat${Date.now()}`,
                      slug: "new-category",
                      name: { en: "New category", vi: "Danh mục mới" },
                      short: { ...emptyL },
                      description: { ...emptyL },
                      image: "",
                      gallery: [],
                      published: true,
                    }),
                  )
                }
              />
            </>
          )}

          {/* JOURNAL */}
          {section === "journal" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">Journal</h1>
              <Note>
                Leave the date empty if the client has not confirmed a publication date — no date
                will be shown anywhere on the site. Do not guess a date.
              </Note>
              <AdminCard title="Page header">
                <LangField
                  label="Title"
                  value={content.journal.title}
                  onChange={(v) => up((d) => (d.journal.title = v))}
                />
                <LangField
                  label="Lead"
                  multiline
                  rows={3}
                  value={content.journal.lead}
                  onChange={(v) => up((d) => (d.journal.lead = v))}
                />
              </AdminCard>

              {content.articles.map((a, i) => (
                <AdminCard
                  key={a.id}
                  title={a.title.en || "Article"}
                  onDelete={() => up((d) => d.articles.splice(i, 1))}
                  onMoveUp={() => up((d) => move(d.articles, i, -1))}
                  onMoveDown={() => up((d) => move(d.articles, i, 1))}
                >
                  <Toggle
                    label={t(ui.published)}
                    value={a.published}
                    onChange={(v) => up((d) => (d.articles[i].published = v))}
                  />
                  <LangField
                    label="Title"
                    value={a.title}
                    onChange={(v) =>
                      up((d) => {
                        d.articles[i].title = v;
                        d.articles[i].slug = slugify(v.en);
                      })
                    }
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Date (leave blank if unknown)">
                      <input
                        type="date"
                        className="w-full border border-sand bg-white px-3 py-2 text-[14px] outline-none focus:border-clay"
                        value={a.date}
                        onChange={(e) => up((d) => (d.articles[i].date = e.target.value))}
                      />
                    </Field>
                    <Field label="Slug (URL)">
                      <TextInput
                        value={a.slug}
                        onChange={(v) => up((d) => (d.articles[i].slug = slugify(v)))}
                      />
                    </Field>
                  </div>
                  <LangField
                    label="Excerpt"
                    multiline
                    rows={3}
                    value={a.excerpt}
                    onChange={(v) => up((d) => (d.articles[i].excerpt = v))}
                  />
                  <LangField
                    label="Content"
                    multiline
                    rows={10}
                    value={a.body}
                    onChange={(v) => up((d) => (d.articles[i].body = v))}
                  />
                  <ImageField
                    label="Cover image"
                    value={a.cover}
                    onChange={(v) => up((d) => (d.articles[i].cover = v))}
                  />
                  <div className="space-y-4 border-t border-sand pt-4">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-cocoa/60">
                      Gallery
                    </span>
                    {a.gallery.map((g, gi) => (
                      <div key={gi} className="flex items-start gap-3">
                        <div className="flex-1">
                          <ImageField
                            label={`Image ${gi + 1}`}
                            value={g}
                            onChange={(v) => up((d) => (d.articles[i].gallery[gi] = v))}
                          />
                        </div>
                        <button
                          onClick={() => up((d) => d.articles[i].gallery.splice(gi, 1))}
                          className="mt-6 text-[10px] uppercase tracking-[0.18em] text-rust hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <AddButton
                      label="Add gallery image"
                      onClick={() => up((d) => d.articles[i].gallery.push(""))}
                    />
                  </div>
                </AdminCard>
              ))}
              <AddButton
                label="Add article"
                onClick={() =>
                  up((d) =>
                    d.articles.unshift({
                      id: `a${Date.now()}`,
                      slug: `new-article-${Date.now()}`,
                      title: { en: "New article", vi: "Bài viết mới" },
                      date: "",
                      excerpt: { ...emptyL },
                      body: { ...emptyL },
                      cover: "",
                      gallery: [],
                      published: true,
                    }),
                  )
                }
              />
            </>
          )}

          {/* PARTNERS */}
          {section === "partners" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">Partners & Projects</h1>
              <Note>
                Supporting content — DECEN, the LIVE Project and HELVETAS. It appears at the end of
                the Our Story page and should stay subordinate to the brand story.
              </Note>
              {content.partners.map((p, i) => (
                <AdminCard
                  key={p.id}
                  title={p.name || "Partner"}
                  onDelete={() => up((d) => d.partners.splice(i, 1))}
                  onMoveUp={() => up((d) => move(d.partners, i, -1))}
                  onMoveDown={() => up((d) => move(d.partners, i, 1))}
                >
                  <Toggle
                    label={t(ui.published)}
                    value={p.published}
                    onChange={(v) => up((d) => (d.partners[i].published = v))}
                  />
                  <Field label="Name">
                    <TextInput value={p.name} onChange={(v) => up((d) => (d.partners[i].name = v))} />
                  </Field>
                  <LangField
                    label="Role / subtitle"
                    value={p.role}
                    onChange={(v) => up((d) => (d.partners[i].role = v))}
                  />
                  <LangField
                    label="Description"
                    multiline
                    rows={5}
                    value={p.body}
                    onChange={(v) => up((d) => (d.partners[i].body = v))}
                  />
                  <Field label="Website URL (optional)">
                    <TextInput value={p.url} onChange={(v) => up((d) => (d.partners[i].url = v))} />
                  </Field>
                  <ImageField
                    label="Image"
                    value={p.image}
                    onChange={(v) => up((d) => (d.partners[i].image = v))}
                  />
                </AdminCard>
              ))}
              <AddButton
                label="Add partner"
                onClick={() =>
                  up((d) =>
                    d.partners.push({
                      id: `n${Date.now()}`,
                      name: "New partner",
                      role: { ...emptyL },
                      body: { ...emptyL },
                      image: "",
                      url: "",
                      published: true,
                    }),
                  )
                }
              />
            </>
          )}

          {/* CONTACT */}
          {section === "contact" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">Contact & Social</h1>
              <AdminCard title="Brand">
                <ImageField
                  label="Logo (SVG or PNG export — the .ai master cannot be displayed in browsers)"
                  value={content.contact.logo}
                  onChange={(v) => up((d) => (d.contact.logo = v))}
                />
                <Note>
                  Leave empty to keep the typographic wordmark in the header and footer.
                </Note>
              </AdminCard>
              <AdminCard title="Visit Us page">
                <ImageField
                  label="Shop image"
                  value={content.contact.image}
                  onChange={(v) => up((d) => (d.contact.image = v))}
                />
                <Field label="Address (one line per row)">
                  <TextArea
                    rows={3}
                    value={content.contact.addressLines.join("\n")}
                    onChange={(v) => up((d) => (d.contact.addressLines = v.split("\n")))}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Phone">
                    <TextInput
                      value={content.contact.phone}
                      onChange={(v) => up((d) => (d.contact.phone = v))}
                    />
                  </Field>
                  <Field label="Zalo / WhatsApp">
                    <TextInput
                      value={content.contact.zalo}
                      onChange={(v) => up((d) => (d.contact.zalo = v))}
                    />
                  </Field>
                </div>
                <Field label="Display name (Zalo / WhatsApp)">
                  <TextInput
                    value={content.contact.displayName.en}
                    onChange={(v) =>
                      up((d) => {
                        d.contact.displayName.en = v;
                        d.contact.displayName.vi = v;
                      })
                    }
                  />
                </Field>
                <LangField
                  label="Opening hours"
                  value={content.contact.hours}
                  onChange={(v) => up((d) => (d.contact.hours = v))}
                />
                <Field label="Email">
                  <TextInput
                    value={content.contact.email}
                    onChange={(v) => up((d) => (d.contact.email = v))}
                  />
                </Field>
                <Field label="Google Maps URL">
                  <TextInput
                    value={content.contact.mapsUrl}
                    onChange={(v) => up((d) => (d.contact.mapsUrl = v))}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Instagram URL">
                    <TextInput
                      value={content.contact.instagram}
                      onChange={(v) => up((d) => (d.contact.instagram = v))}
                    />
                  </Field>
                  <Field label="Facebook URL">
                    <TextInput
                      value={content.contact.facebook}
                      onChange={(v) => up((d) => (d.contact.facebook = v))}
                    />
                  </Field>
                </div>
                <LangField
                  label="Placeholder note (small print at the bottom of the Visit page — clear it once the links are final)"
                  multiline
                  rows={2}
                  value={content.contact.note}
                  onChange={(v) => up((d) => (d.contact.note = v))}
                />
              </AdminCard>
            </>
          )}

          {section === "events" && <>
            <h1 className="font-serif text-4xl text-charcoal">What we do · Events</h1>
            <Note>These are archived events. Dates and venue addresses retain the information supplied for each event.</Note>
            {content.events.map((event, index) => <AdminCard key={event.id} collapsible title={event.title.en || 'Untitled event'} onDelete={() => up(d => d.events.splice(index, 1))} onMoveUp={() => up(d => move(d.events, index, -1))} onMoveDown={() => up(d => move(d.events, index, 1))}>
              <Toggle label="Published" value={event.published} onChange={(v) => up(d => { d.events[index].published = v; })} />
              <ImageField label="Event photograph" value={event.image} onChange={v => up(d => { d.events[index].image = v; })} />
              <Field label="Event website URL (leave empty until available)"><TextInput value={event.url} onChange={v => up(d => { d.events[index].url = v; })} /></Field>
              <LangField label="Event title" value={event.title} onChange={v => up(d => { d.events[index].title = v; })} />
              <LangField label="Display date" value={event.dateLabel} onChange={v => up(d => { d.events[index].dateLabel = v; })} />
              <Field label="Start date (YYYY-MM-DD)"><TextInput value={event.dateStart} onChange={v => up(d => { d.events[index].dateStart = v; })} /></Field>
              <LangField label="Schedule" multiline value={event.schedule} onChange={v => up(d => { d.events[index].schedule = v; })} />
              <Field label="Venue"><TextInput value={event.venue} onChange={v => up(d => { d.events[index].venue = v; })} /></Field>
              <LangField label="Address" value={event.address} onChange={v => up(d => { d.events[index].address = v; })} />
            </AdminCard>)}
            <AddButton label="Add event" onClick={() => up(d => d.events.push({ id: `event-${Date.now()}`, image: '', url: '', title: { en: 'New event', vi: 'Sự kiện mới' }, dateLabel: { ...emptyL }, dateStart: '', schedule: { ...emptyL }, venue: '', address: { ...emptyL }, published: false }))} />
          </>}

          {/* NEWSLETTER */}
          {section === "newsletter" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">Newsletter</h1>
              <AdminCard title="Newsletter block">
                <LangField
                  label="Title"
                  value={content.newsletter.title}
                  onChange={(v) => up((d) => (d.newsletter.title = v))}
                />
                <LangField
                  label="Body"
                  multiline
                  rows={3}
                  value={content.newsletter.body}
                  onChange={(v) => up((d) => (d.newsletter.body = v))}
                />
                <LangField
                  label="Button label"
                  value={content.newsletter.button}
                  onChange={(v) => up((d) => (d.newsletter.button = v))}
                />
                <LangField
                  label="Success message"
                  value={content.newsletter.success}
                  onChange={(v) => up((d) => (d.newsletter.success = v))}
                />
              </AdminCard>

              <AdminCard title={`Subscribers (${subscribers.length})`}>
                {subscribers.length === 0 ? (
                  <p className="text-[14px] text-cocoa/60">No subscribers yet.</p>
                ) : (
                  <ul className="divide-y divide-sand text-[14px]">
                    {subscribers.map((s, i) => (
                      <li key={i} className="flex justify-between gap-4 py-2">
                        <span className="text-charcoal">{s.email}</span>
                        <span className="text-cocoa/60">{s.name || "—"}</span>
                        <span className="text-cocoa/40">{s.date.slice(0, 10)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </AdminCard>
            </>
          )}

          {/* SETTINGS */}
          {section === "settings" && (
            <>
              <h1 className="font-serif text-4xl text-charcoal">Settings</h1>
              <AdminCard title="Content data">
                <div className={`rounded border px-4 py-3 text-[13px] ${connection === 'connected' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : connection === 'error' ? 'border-red-300 bg-red-50 text-red-800' : 'border-sand bg-cream/40 text-cocoa/75'}`}>
                  <strong>{connection === 'connected' ? 'Supabase connected' : connection === 'error' ? 'Supabase connection failed' : isSupabaseConfigured ? 'Checking Supabase connection…' : 'Supabase is not configured'}</strong>
                  <p className="mt-1 text-[12px]">{isSupabaseConfigured ? 'Projects and events can be edited from the shared database.' : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable shared CMS data.'}</p>
                  {isSupabaseConfigured && <button onClick={checkConnection} className="mt-3 border border-current px-3 py-2 text-[10px] uppercase tracking-[0.16em]">Check connection</button>}
                </div>
                <p className="text-[14px] leading-relaxed text-cocoa/75">
                  All site content is stored as a single JSON document. In production this document
                  lives in Supabase (Postgres), images in Supabase Storage, and this dashboard is
                  protected by Supabase Auth. Here it is saved locally in the browser so the client
                  can try the full editing flow.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(content, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "mystere-content.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="border border-charcoal px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-charcoal hover:bg-charcoal hover:text-ivory"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Reset all content to the shipped version?")) {
                        resetContent();
                        setDirty(true);
                        setSaved(false);
                      }
                    }}
                    className="border border-rust px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-rust hover:bg-rust hover:text-ivory"
                  >
                    Reset content
                  </button>
                </div>
              </AdminCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
