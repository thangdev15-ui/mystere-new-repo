import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store/store';
import Img, { HeroImage } from '../components/Img';
import { useSectionScroll } from '../hooks/useSectionScroll';
import type { Community } from '../lib/types';
import RichText from '../components/RichText';

const projectEditorialImage = (community: Community) => {
  if (community.id === 'c1') return '/images/live-project-retouched.webp';
  if (community.id === 'c2') return '/images/craftbelt-project-retouched.webp';
  return community.image;
};

function ProjectDocumentLink({ community, className = "" }: { community: Community; className?: string }) {
  const { t, lang } = useStore();
  if (!community.documentUrl) return null;
  const label = t(community.documentLabel) || (lang === "en" ? "Read the DECEN presentation" : "Xem tài liệu DECEN");
  return <a className={`project-document-link ${className}`} href={community.documentUrl} target="_blank" rel="noreferrer">{label} <span aria-hidden="true">↗</span><small>PDF</small></a>;
}

function Project({ community: c }: { community: Community }) {
  const { t, lang } = useStore();
  const fallbackImages: Record<string, string> = { 'red-dao':'/images/red-dao.png', 'dao-tien':'/images/project-dao-tien.jpg', nung:'/images/project-nung.jpg', hmong:'/images/project-hmong.jpg', 'black-lo-lo':'/images/project-lo-lo.jpg' };
  const image = projectEditorialImage(c) || fallbackImages[c.slug];
  return <article className="project-row" id={c.slug} data-scroll-part>
    {image ? <Img src={image} alt={c.name} ratio="aspect-[3/2]" className="project-photo" /> : <div className="project-photo photo-pending"><span>{t(c.region)}</span><small>{lang === 'en' ? 'Field photograph forthcoming' : 'Ảnh thực địa sẽ được bổ sung'}</small></div>}
    <div className="project-copy"><p className="kicker">{t(c.region)}</p><h3>{c.name}</h3><p>{t(c.line)}</p>
      <div className="project-actions"><Link className="project-more" to={`/projects#${c.slug}`}>{lang === 'en' ? 'More about' : 'Xem thêm'} <span aria-hidden="true">↗</span></Link><ProjectDocumentLink community={c} /></div>
    </div>
  </article>;
}

function Events() {
  const { content, t, lang } = useStore();
  const en = lang === 'en';
  return <section id="our-event" data-scroll-part className="events-section" aria-labelledby="events-heading">
    <div className="projects-heading events-intro"><h2 id="events-heading">{en ? 'Events' : 'Sự kiện'}</h2><span>{en ? 'Past events' : 'Sự kiện đã diễn ra'}</span></div>
    <div className="event-grid">{content.events.filter(event => event.published).sort((a,b) => a.dateStart.localeCompare(b.dateStart)).map(event => <article className="event-card event-strip" key={event.id}>
      <figure><Img src={event.image} alt={t(event.title)} ratio="aspect-[4/5]" /></figure>
      <div className="event-card-copy"><div className="event-summary"><p className="kicker">{en ? 'Event' : 'Sự kiện'}</p><h4>{t(event.title)}</h4></div><div className="event-timing"><time dateTime={event.dateStart}>{t(event.dateLabel)}</time><p className="event-schedule">{t(event.schedule)}</p></div><address><strong>{event.venue}</strong><span>{t(event.address)}</span></address></div>
    </article>)}</div>
  </section>;
}

export function CommunityPage() {
  const { slug } = useParams();
  const { content, t, lang } = useStore();
  const community = content.communities.find(item => item.slug === slug) || content.communities[0];
  const fallback: Record<string, string> = { 'red-dao':'/images/red-dao.png', 'dao-tien':'/images/project-dao-tien.jpg', nung:'/images/project-nung.jpg', hmong:'/images/project-hmong.jpg', 'black-lo-lo':'/images/project-lo-lo.jpg' };
  const image = community.image || fallback[community.slug];
  const en = lang === 'en';
  return <article className="community-page">
    <header className="community-hero content-width"><div><p className="kicker">{t(community.region)}</p><p className="community-index">{en ? 'Our project' : 'Dự án cộng đồng'}</p><h1>{community.name}</h1><p className="community-strapline">{t(community.title)}</p></div><figure><Img src={image} alt={community.name} ratio="aspect-[4/3]" priority /></figure></header>
    <div className="community-body content-width"><div className="community-story"><p className="kicker">{en ? 'The story' : 'Câu chuyện'}</p><h2>{t(community.title)}</h2><RichText className="community-prose" html={t(community.story)} /></div><aside className="community-aside"><div><p className="kicker">{en ? 'The craft' : 'Nghề thủ công'}</p><p>{t(community.craft)}</p></div><div className="community-reference-actions"><ProjectDocumentLink community={community} /><Link to="/#contact" className="contact-project-link">{en ? 'Contact us for more information' : 'Liên hệ để biết thêm thông tin'} <span aria-hidden="true">→</span></Link></div></aside>{!!community.gallery?.filter(Boolean).length && <div className="community-gallery">{community.gallery.filter(Boolean).map((src,index) => <Img key={`${src}-${index}`} src={src} alt={`${community.name} ${index + 2}`} ratio="aspect-[4/3]" />)}</div>}<Link to="/#what-we-do" className="back-link">← {en ? 'Back to What we do' : 'Quay lại Chúng tôi làm gì'}</Link></div>
  </article>;
}

export function AllProjectsPage() {
  const { content, t, lang } = useStore();
  const en = lang === 'en';
  const h = content.home;
  const communities = content.communities.filter(item => item.published);
  const fallback: Record<string, string> = { 'red-dao':'/images/red-dao.png', 'dao-tien':'/images/project-dao-tien.jpg', nung:'/images/project-nung.jpg', hmong:'/images/project-hmong.jpg', 'black-lo-lo':'/images/project-lo-lo.jpg' };
  return <article className="projects-page">
    <header className="projects-page-hero content-width">
      <p className="section-label">{en ? 'Our projects' : 'Dự án cộng đồng'}</p>
      <h1>{t(h.projectsIntro.title)}</h1><p>{t(h.projectsIntro.body)}</p>
    </header>
    <div className="projects-page-list content-width">
      {communities.map(community => {
        const image = projectEditorialImage(community) || fallback[community.slug];
        return <section key={community.id} id={community.slug} data-scroll-part className={`project-detail-section project-${community.id}`}>
          <div className="project-detail-media">
            <Img src={image} alt={community.name} ratio="aspect-[4/3]" priority={community.slug === 'red-dao'} />
          </div>
          <div className="project-detail-copy"><p className="kicker">{t(community.region)}</p><h2>{community.name}</h2></div>
          {community.id === 'c1' && <p className="project-partnership-note">{en ? 'Mystère Shop accompanies the LIVE programme, supporting its work with ethnic minority artisan communities in Cao Bằng.' : 'Mystère Shop đồng hành cùng chương trình LIVE, hỗ trợ các hoạt động cùng cộng đồng nghệ nhân dân tộc thiểu số tại Cao Bằng.'}</p>}
          <div className="project-detail-prose"><p className="kicker">{en ? 'Project story' : 'Câu chuyện dự án'}</p><RichText html={t(community.story)} /></div>
          <aside className="project-detail-aside"><div><p className="kicker">{en ? 'The craft' : 'Nghề thủ công'}</p><p>{t(community.craft)}</p></div><div className="community-reference-actions"><ProjectDocumentLink community={community} /><Link to="/#contact" className="contact-project-link">{en ? 'Contact us for more information' : 'Liên hệ để biết thêm thông tin'} <span aria-hidden="true">→</span></Link></div></aside>
          {!!community.gallery?.filter(Boolean).length && <div className="project-detail-gallery">{community.gallery.filter(Boolean).map((src,index) => <Img key={`${src}-${index}`} src={src} alt={`${community.name} ${index + 2}`} ratio="aspect-[4/3]" />)}</div>}
          {community.id === 'c1' && <div className="project-support-gallery"><Img src="/images/live-water-collection.webp" alt={en ? 'Community members collecting water in Cao Bằng' : 'Người dân lấy nước tại Cao Bằng'} ratio="aspect-[16/10]"/><Img src="/images/live-child-water.webp" alt={en ? 'A child carrying water in Cao Bằng' : 'Một em nhỏ gùi nước tại Cao Bằng'} ratio="aspect-[16/10]"/></div>}
          {community.id === 'c2' && <div className="project-support-gallery project-house-gallery"><Img src="/images/craft-belt-house-retouched.png" alt={en ? 'Craft Belt House in Cao Bằng' : 'Ngôi nhà Craft Belt tại Cao Bằng'} ratio="aspect-[3/2]"/></div>}
        </section>;
      })}
    </div>
    <div className="projects-page-back content-width"><Link to="/#what-we-do" className="back-link">← {en ? 'Back to What we do' : 'Quay lại Chúng tôi làm gì'}</Link></div>
  </article>;
}

export function AboutMysterePage() {
  const { content, t, lang } = useStore();
  const h = content.home;
  const mission = h.mission ?? h.intro;
  const en = lang === 'en';
  return <article className="about-mystere-page">
    <section id="our-mission" data-scroll-part className="about-detail-section content-width">
      <div>
        <p className="kicker">{en ? 'Our mission' : 'Sứ mệnh của chúng tôi'}</p>
        <h2>{t(mission.title)}</h2>
        <div className="red-rule" />
        <p>{t(mission.body)}</p>
      </div>
      <figure className="mission-image">
        <Img src="/images/our-mission-retouched.webp" alt={en ? 'Ethnic minority artisans standing at the Mystère Shop' : 'Các nghệ nhân dân tộc tại Shop Huyền Bí'} ratio="aspect-[4/5]" priority/>
        <figcaption><span>141 Đồng Khởi, Saigon</span><span>{en ? 'Since 2001' : 'Từ năm 2001'}</span></figcaption>
      </figure>
    </section>
    <section id="where-it-began" data-scroll-part className="about-detail-section about-detail-section-alt content-width">
      <figure>
        <Img src="/images/PreservingHeritage.png" alt={t(h.artisan.title)} ratio="aspect-[3/4]" />
      </figure>
      <div>
        <p className="kicker">{en ? 'Where it began' : 'Khởi nguồn'}</p>
        <h2>{t(h.artisan.title)}</h2>
        <p>{t(h.artisan.body)}</p>
        <Link to="/#who-we-are" className="project-more">← {en ? 'Back to Who we are' : 'Quay lại Về chúng tôi'}</Link>
      </div>
    </section>
  </article>;
}

export default function Home() {
  const { content, t, lang } = useStore();
  const pageRef = useRef<HTMLDivElement>(null);
  useSectionScroll(pageRef);
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = root.querySelectorAll<HTMLElement>(
      '.banner-content > *, .section-top, .mission-grid > *, .origin-grid > *, .projects-heading > *, .project-row > *, .newsletter-band > *, .thread-grid > *, .events-intro > *, .event-card > *',
    );
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('has-appeared');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
    const revealAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      elements.forEach(element => element.classList.add('has-appeared'));
    };
    elements.forEach(element => {
      element.classList.add('appear-on-scroll');
      observer.observe(element);
    });
    revealAll();
    preference.addEventListener('change', revealAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', revealAll);
      elements.forEach(element => element.classList.remove('appear-on-scroll', 'has-appeared'));
    };
  }, [content.communities]);
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty('--reading-progress', String(range > 0 ? window.scrollY / range : 0));
      root.style.setProperty('--banner-shift', preference.matches ? '0px' : `${Math.min(window.scrollY * 0.16, 150)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
    };
  }, []);
  const h = content.home;
  const communityCards = content.communityCards ?? content.communities;
  const en = lang === 'en';
  const approvedProjectsIntro = en
    ? 'Mystère Shop has traded the finest handmade jewellery and craft of Vietnam’s hill-tribe artisans since 2001. The relationship behind every piece runs deeper than a transaction. It began with a chance meeting, grew through fifteen years of trust, and continues today across five communities in Cao Bằng, Hà Giang and Sa Pa.'
    : 'Từ năm 2001, Mystère Shop đã giới thiệu những sản phẩm trang sức và thủ công tinh xảo nhất của các nghệ nhân vùng cao Việt Nam. Mối quan hệ phía sau mỗi sản phẩm sâu sắc hơn một giao dịch. Mối duyên ấy bắt đầu từ một cuộc gặp tình cờ, lớn lên qua mười lăm năm tin cậy và tiếp tục đến hôm nay cùng năm cộng đồng tại Cao Bằng, Hà Giang và Sa Pa.';
  const projectsIntroBody = h.projectsIntro.body.en.startsWith('Mystère Shop has been trading the finest handmade') ? approvedProjectsIntro : t(h.projectsIntro.body);
  return <div className="new-home" ref={pageRef}>
    <div className="reading-progress" aria-hidden="true" />
    <section data-scroll-part className="home-banner" aria-label={en ? 'Welcome to Mystère Shop' : 'Chào mừng đến Mystère Shop'}>
      <div className="banner-image"><HeroImage src={h.heroImage} priority /></div>
      <div className="banner-shade" />
      <div className="content-width banner-content">
        <h1>{en ? 'Mystère Shop' : 'Shop Huyền Bí'}</h1>
        <div className="banner-meta"><p className="banner-eyebrow">{en ? 'The Vietnamese Refinement' : 'Tinh hoa Việt Nam'}</p><p className="banner-location">{en ? 'Huyền Bí — Saigon' : 'Mystère Shop — Sài Gòn'}</p><p className="banner-years">{en ? '25 YEARS — EST. 2001' : '25 NĂM — THÀNH LẬP 2001'}</p></div>
        <div className="banner-bottom">
          <Link to="/about-mystere" className="banner-cta">{t(h.heroCta)} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
    <section id="who-we-are" data-scroll-part className="who-section" aria-labelledby="who-heading">
      <div className="section-top content-width"><h2 id="who-heading" className="who-heading">{en ? 'WHO WE ARE' : 'VỀ CHÚNG TÔI'}</h2><span>{en ? 'Art and Craft' : 'Nghệ thuật và thủ công'}</span></div>
      <div id="our-mission" className="mission-grid content-width"><div className="mission-copy"><p className="kicker">{en ? 'Our story' : 'Câu chuyện của chúng tôi'}</p><h3>{t(h.intro.title)}</h3><div className="red-rule"/>{t(h.intro.body).split('\n\n').map((paragraph,index) => <p key={index}>{paragraph}</p>)}<div className="mission-actions"><Link to="/about-mystere" className="project-more">{en ? 'About Mystère' : 'Về Huyền Bí'} <span aria-hidden="true">→</span></Link><Link to="/craft" className="project-more">{en ? 'Our Product' : 'Sản phẩm'} <span aria-hidden="true">→</span></Link></div></div><figure className="mission-image"><Img src="/images/our-story-retouched.webp" alt={en ? 'Ethnic minority artisans standing at the Mystère Shop in District 1, Ho Chi Minh City' : 'Các nghệ nhân dân tộc tại Shop Huyền Bí, Quận 1, Thành phố Hồ Chí Minh'} ratio="aspect-[4/5]" priority/><figcaption><span>{en ? 'Ethnic minority artisans standing at the Mystère Shop in District 1, Ho Chi Minh City.' : 'Các nghệ nhân dân tộc tại Shop Huyền Bí, Quận 1, Thành phố Hồ Chí Minh.'}</span><span>{en ? 'Since 2001' : 'Từ năm 2001'}</span></figcaption></figure></div>
    </section>
    <section id="what-we-do" data-scroll-part className="what-section"><div className="content-width"><div className="section-top"><p className="section-label">{en ? 'What we do' : 'Chúng tôi làm gì'}</p><span>{en ? 'Projects · Communities · Events' : 'Dự án · Cộng đồng · Sự kiện'}</span></div><div className="projects-intro"><h2>{t(h.projectsIntro.title)}</h2><p>{projectsIntroBody}</p></div><div id="projects" className="projects-heading"><h2>{en ? 'Collaboration' : 'Hợp tác'}</h2></div><div className="project-list">{content.communities.filter(c => c.published).map(c => <Project key={c.id} community={c}/>)}</div><div id="communities" className="projects-heading community-work-heading"><h2>{en ? 'Communities we work with' : 'Cộng đồng chúng tôi đồng hành'}</h2><span>{en ? 'Five communities, living crafts' : 'Năm cộng đồng, những nghề sống động'}</span></div><div className="community-work-grid">{communityCards.filter(c => c.published).map(c => <article key={c.id}><figure><Img src={c.image} alt={c.name} ratio="aspect-[3/4]" /></figure><div><h3>{lang === 'en' ? ({'Dao Tiền':'Money Dao','Nùng':'Nung',"H'Mông":"H'Mong",'Black Lô Lô':'Black Lolo'} as Record<string,string>)[c.name] || c.name : c.name}</h3><p>{t(c.craft)}</p></div></article>)}</div><Events /></div>
    </section>
      <section className="thread-section" id="the-thread" data-scroll-part><div className="content-width thread-grid"><div><p className="kicker">{en ? 'Visit us' : 'Ghé thăm chúng tôi'}</p><h2>{en ? 'Every piece carries a story' : 'Mỗi món đồ đều mang theo một câu chuyện'}</h2><p>{en ? "We don't just support these communities — we carry their work forward. Every piece you take home from Mystère Shop was made by the same hands, in the same villages, you've just read about. Choosing it is a small, direct way of keeping a craft — and the livelihood behind it — alive.\n\nCome visit us at 141 Đồng Khởi to see it, and hear it, in person." : 'Chúng tôi không chỉ đồng hành cùng các cộng đồng — chúng tôi tiếp nối công việc của họ. Mỗi món đồ bạn mang về từ Mystère Shop được làm bởi chính những đôi tay ở những bản làng bạn vừa đọc. Lựa chọn ấy góp phần giữ nghề thủ công và sinh kế phía sau nghề được tiếp nối.\n\nHãy ghé 141 Đồng Khởi để cảm nhận câu chuyện bằng mắt và lắng nghe trực tiếp.'}</p><Link to="/#contact" className="white-link">{en ? 'Visit us' : 'Ghé thăm cửa hàng'} <span aria-hidden="true">→</span></Link></div><figure><Img src={h.thread.image} alt={en ? 'Craft and everyday objects inside Mystère Shop' : 'Những món đồ thủ công trong cửa hàng Mystère'} ratio="aspect-[4/3]"/></figure></div>
    </section>
  </div>;
}
