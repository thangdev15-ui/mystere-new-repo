import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import { richTextToPlainText } from './RichText';

function NavDropdown({ section, mobile = false, onNavigate }: { section: "who" | "what"; mobile?: boolean; onNavigate: () => void }) {
  const { lang } = useStore();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const en = lang === 'en';
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const id = `${section}-submenu-${mobile ? 'mobile' : 'desktop'}`;
  const title = section === 'who' ? (en ? 'Who we are' : 'Về chúng tôi') : (en ? 'What we do' : 'Chúng tôi làm gì');
  const target = section === 'who' ? '/#who-we-are' : '/#what-we-do';
  const close = () => { setOpen(false); onNavigate(); };
  return <div className={`who-dropdown ${mobile ? 'is-mobile' : ''} ${open ? 'is-open' : ''}`}
    onMouseEnter={() => { if (!mobile) setOpen(true); }}
    onMouseLeave={() => { if (!mobile) setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); toggle.current?.focus(); } }}>
    <div className="who-trigger">
      <Link to={target} onClick={close}>{title}</Link>
      <button ref={toggle} type="button" aria-label={`${title} ${en ? 'submenu' : '— menu con'}`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m2 4 4 4 4-4"/></svg></button>
    </div>
    <ul id={id} className="who-submenu" hidden={!open}>
      {section === 'who' ? <>
        <li><Link to="/about-mystere#our-mission" onClick={close}>{en ? 'Our mission' : 'Sứ mệnh'}</Link></li>
        <li><Link to="/about-mystere#where-it-began" onClick={close}>{en ? 'Where it began' : 'Khởi nguồn'}</Link></li>
        <li><Link to="/craft" onClick={close}>{en ? 'Our Product' : 'Sản phẩm'}</Link></li>
      </> : <>
        <li><Link to="/#projects" onClick={close}>{en ? 'Our Collaboration' : 'Dự án của chúng tôi'}</Link></li>
        <li><Link to="/#communities" onClick={close}>{en ? 'Communities we work with' : 'Cộng đồng chúng tôi đồng hành'}</Link></li>
        <li><Link to="/#our-event" onClick={close}>{en ? 'Our Event' : 'Sự kiện của chúng tôi'}</Link></li>
      </>}
    </ul>
  </div>;
}

function LanguagePicker({ lang, setLang }: { lang: 'en' | 'vi'; setLang: (lang: 'en' | 'vi') => void }) {
  const [open, setOpen] = useState(false);
  return <div className={`language-picker ${open ? 'is-open' : ''}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
    <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>{lang === 'en' ? 'English' : 'Tiếng Việt'} <span aria-hidden="true">⌄</span></button>
    <div className="language-menu" role="listbox" hidden={!open}>{(['en', 'vi'] as const).map(value => <button type="button" role="option" aria-selected={lang === value} key={value} onClick={() => { setLang(value); setOpen(false); }}>{value === 'en' ? 'English' : 'Tiếng Việt'}</button>)}</div>
  </div>;
}

export default function Layout() {
  const { content, lang, setLang, t } = useStore();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const en = lang === 'en';
  const nav = [{to:'/#who-we-are', label:en ? 'Who we are' : 'Về chúng tôi'}, {to:'/#what-we-do',label:en ? 'What we do' : 'Chúng tôi làm gì'}];
  const entries = [
    {to:'/#who-we-are', title:nav[0].label, text:t(content.home.intro.body)},
    {to:'/about-mystere#where-it-began',title:t(content.home.artisan.title),text:t(content.home.artisan.body)},
    ...content.communities.filter(c => c.published).map(c => ({to:`/projects#${c.slug}`, title:c.name, text:`${t(c.title)} ${richTextToPlainText(t(c.story))}`})),
    {to:'/#the-thread',title:t(content.home.thread.title),text:t(content.home.thread.body)},
  ];
  const results = query.trim() ? entries.filter(x => `${x.title} ${x.text}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) : [];
  useEffect(() => {
    setMenu(false); setSearch(false);
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        // HashRouter renders links such as /#/#dao-tien; normalize both that
        // form and a plain #dao-tien anchor before looking up the section.
        const rawHash = decodeURIComponent(location.hash.slice(1));
        const targetId = rawHash.replace(/^\/#/, '').replace(/^#/, '');
        document.getElementById(targetId)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
      }
      else window.scrollTo(0,0);
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.key]);
  useEffect(() => { if (search) searchInput.current?.focus(); }, [search]);
  useEffect(() => { const escape = (event: KeyboardEvent) => {if(event.key === 'Escape') {setSearch(false);setMenu(false);searchButton.current?.focus();}};window.addEventListener('keydown',escape);return () => window.removeEventListener('keydown',escape); }, []);
  return <><a className="skip-link" href="#main-content">{en ? 'Skip to content' : 'Đi đến nội dung'}</a><header className="site-header"><div className="header-inner"><Link to="/" className="brand" aria-label="Mystère Shop — Home"><img src={content.contact.logo} alt=""/><span>Mystère<small>HUYỀN BÍ</small></span></Link><nav className="desktop-nav" aria-label={en ? 'Main navigation' : 'Điều hướng chính'}><NavDropdown section="who" onNavigate={() => setSearch(false)} /><NavDropdown section="what" onNavigate={() => setSearch(false)} /></nav><div className="header-tools"><LanguagePicker lang={lang} setLang={setLang}/><button ref={searchButton} className="search-button" aria-label={en ? 'Search' : 'Tìm kiếm'} aria-expanded={search} aria-controls="site-search" onClick={() => {setSearch(!search);setMenu(false);}}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>{en ? 'Search' : 'Tìm kiếm'}</span></button><button className="mobile-menu" aria-expanded={menu} aria-controls="mobile-nav" onClick={() => {setMenu(!menu);setSearch(false);}}>{menu ? (en ? 'Close' : 'Đóng') : 'Menu'} <span aria-hidden="true">{menu ? '×' : '☰'}</span></button></div></div>
    {menu && <nav id="mobile-nav" className="mobile-nav" aria-label={en ? 'Mobile navigation' : 'Điều hướng di động'}><NavDropdown section="who" mobile onNavigate={() => setMenu(false)} /><NavDropdown section="what" mobile onNavigate={() => setMenu(false)} /></nav>}
    {search && <div id="site-search" className="search-panel"><div className="content-width"><label htmlFor="search-query">{en ? 'Search our stories' : 'Tìm kiếm câu chuyện'}</label><input ref={searchInput} id="search-query" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={en ? 'Try Red Dao, batik or our shop…' : 'Tìm Dao Đỏ, sáp ong hoặc cửa hàng…'}/><div aria-live="polite">{query.trim() && <p>{results.length ? `${results.length} ${en ? 'results' : 'kết quả'}` : (en ? 'No stories found. Try another word.' : 'Chưa tìm thấy. Hãy thử từ khóa khác.')}</p>}</div><ul>{results.map(r => <li key={r.to}><Link to={r.to}>{r.title}<span>→</span></Link></li>)}</ul></div></div>}
    </header><main id="main-content" tabIndex={-1}><Outlet/></main><footer id="contact" className="site-footer">
      <div className="footer-main"><div className="content-width footer-grid">
        <div className="footer-intro"><Link to="/" className="footer-brand" aria-label="Mystère Shop — Home"><img src={content.contact.logo} alt="Mystère Shop" /></Link><p>{en ? 'Vietnamese craft. Human connections.' : 'Nghề thủ công Việt. Kết nối con người.'}</p></div>
        <div><h2>{en ? 'Visit us' : 'Ghé thăm'}</h2><address>{content.contact.addressLines.map(l => <span key={l}>{l}<br/></span>)}</address><p>{t(content.contact.hours)}</p><a href={content.contact.mapsUrl} target="_blank" rel="noreferrer">{en ? 'Get directions' : 'Chỉ đường'} ↗</a></div>
        <div><h2>{en ? 'Explore' : 'Khám phá'}</h2>{nav.map(n => <Link key={n.to} to={n.to}>{n.label}</Link>)}</div>
        <div><h2>{en ? 'Contact us' : 'Liên hệ'}</h2><a href={`tel:${content.contact.phone.replace(/[^+\d]/g,'')}`}>{content.contact.phone}</a><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a></div>
      </div></div>
      <div className="footer-legal"><div className="content-width">
        <div className="legal-card"><p className="legal-kicker">{en ? 'Website owned and operated by' : 'Website thuộc quyền sở hữu và vận hành bởi'}</p><h2>HUYEN BI SHOP</h2><div className="legal-details"><p>{en ? 'Business registration number' : 'Mã số đăng ký hộ kinh doanh'}: <strong>41A8015729</strong><br/>{en ? 'First registered on 13 March 2001 · Updated on 29 September 2023' : 'Đăng ký lần đầu ngày 13/03/2001 · Thay đổi lần 2 ngày 29/09/2023'}</p><p>141 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam<br/>{content.contact.phone} · {content.contact.email}</p></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Mystère Shop — Huyền Bí. {en ? 'All rights reserved.' : 'Bảo lưu mọi quyền.'}</span><Link to="/#contact" className="footer-contact">{en ? 'Contact' : 'Liên hệ'}</Link></div>
      </div></div>
    </footer></>;
}
