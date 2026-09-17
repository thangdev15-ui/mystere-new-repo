import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store/store';
import Img, { HeroImage } from '../components/Img';
import { useSectionScroll } from '../hooks/useSectionScroll';
import type { Community } from '../lib/types';

function Project({ community: c }: { community: Community }) {
  const { t, lang } = useStore();
  const fallbackImages: Record<string, string> = { 'red-dao':'/images/red-dao.png', 'dao-tien':'/images/project-dao-tien.jpg', nung:'/images/project-nung.jpg', hmong:'/images/project-hmong.jpg', 'black-lo-lo':'/images/project-lo-lo.jpg' };
  const image = c.image || fallbackImages[c.slug];
  return <article className="project-row" id={c.slug} data-scroll-part>
    {image ? <Img src={image} alt={c.name} ratio="aspect-[3/2]" className="project-photo" /> : <div className="project-photo photo-pending"><span>{t(c.region)}</span><small>{lang === 'en' ? 'Field photograph forthcoming' : 'Ảnh thực địa sẽ được bổ sung'}</small></div>}
    <div className="project-copy"><p className="kicker">{t(c.region)}</p><h3>{c.name}</h3><p>{t(c.line)}</p>
      <Link className="project-more" to={`/project/${c.slug}`}>{lang === 'en' ? 'More about' : 'Xem thêm'} <span aria-hidden="true">↗</span></Link>

    </div>
  </article>;
}

function Newsletter() {
  const { content, t, lang, addSubscriber } = useStore();
  const [done, setDone] = useState(false);
  return <div className="newsletter-band" id="stay-connected"><div><p className="kicker">{lang === 'en' ? 'The next event' : 'Sự kiện tiếp theo'}</p><h3>{t(content.newsletter.title)}</h3><p>{t(content.newsletter.body)}</p></div>
    <form onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); addSubscriber({email: String(data.get('email')).trim().toLowerCase(), name: String(data.get('name')).trim(), date: new Date().toISOString()}); setDone(true); }}>
      {done ? <p role="status">{lang === 'en' ? 'Your interest has been saved on this device. Email notifications are not yet available.' : 'Thông tin đã được lưu trên thiết bị này. Chức năng gửi thông báo qua email chưa được kết nối.'}</p> : <><div className="form-fields"><label>Email <span>*</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>{lang === 'en' ? 'Name (optional)' : 'Tên (không bắt buộc)'}<input name="name" autoComplete="given-name" placeholder={lang === 'en' ? 'Your name' : 'Tên của bạn'} /></label></div><button className="red-button" type="submit">{t(content.newsletter.button)} <span aria-hidden="true">→</span></button><small className="form-note">{lang === 'en' ? 'Preview: registration is saved on this device only.' : 'Bản xem trước: đăng ký chỉ được lưu trên thiết bị này.'}</small></>}
    </form></div>;
}

function Events() {
  const { content, t, lang } = useStore();
  const en = lang === 'en';
  return <section id="our-event" data-scroll-part className="events-section" aria-labelledby="events-heading">
    <div className="events-intro"><div><p className="kicker">{en ? 'Our Event' : 'Sự kiện'}</p><h3 id="events-heading">{en ? 'Our events' : 'Sự kiện của chúng tôi'}</h3></div><span className="events-archive-label">{en ? 'Past events' : 'Sự kiện đã diễn ra'}</span></div>
    <div className="event-grid">{content.events.filter(event => event.published).map(event => <article className="event-card" key={event.id}>
      <figure><Img src={event.image} alt={t(event.title)} ratio="aspect-[4/5]" /></figure>
      <div className="event-card-copy"><h4>{t(event.title)}</h4><time dateTime={event.dateStart}>{t(event.dateLabel)}</time><p className="event-schedule">{t(event.schedule)}</p><address><strong>{event.venue}</strong><br/>{t(event.address)}</address>
      {/^https?:\/\//i.test(event.url) ? <a className="event-more" href={event.url} target="_blank" rel="noreferrer">{en ? 'More about' : 'Xem thêm'} <span aria-hidden="true">→</span></a> : <div className="event-link-pending"><button className="event-more" disabled>{en ? 'More about' : 'Xem thêm'} <span aria-hidden="true">→</span></button><small>{en ? 'Website coming soon' : 'Website sẽ được cập nhật'}</small></div>}
      </div>
    </article>)}<Newsletter /></div>
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
    <div className="community-body content-width"><div className="community-story"><p className="kicker">{en ? 'The story' : 'Câu chuyện'}</p><h2>{t(community.title)}</h2><div className="community-prose">{t(community.story).split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div><aside className="community-aside"><p className="kicker">{en ? 'The craft' : 'Nghề thủ công'}</p><p>{t(community.craft)}</p><a href="#contact" className="contact-project-link">{en ? 'Contact us for more information' : 'Liên hệ để biết thêm thông tin'} <span aria-hidden="true">→</span></a><Link to="/#what-we-do" className="back-link">← {en ? 'Back to What we do' : 'Quay lại Chúng tôi làm gì'}</Link></aside></div>
    <section className="community-closing"><div className="content-width"><p className="kicker">{en ? 'The work behind the work' : 'Công việc phía sau mỗi sản phẩm'}</p><h2>{en ? 'What “supporting a community” actually looks like' : 'Đồng hành cùng một cộng đồng thực sự là gì'}</h2><p>{en ? 'Behind every product on our shelves is a small group of women who learned to dye, weave, sew, keep books, and run a business together — often for the first time. We helped set up those groups, brought in training, connected them to markets in Hanoi and Saigon, and built the “Craft Belt” name so their work could travel further than the village.' : 'Phía sau mỗi sản phẩm là một nhóm phụ nữ đã học cách nhuộm, dệt, may, ghi sổ và cùng nhau vận hành công việc — nhiều khi là lần đầu tiên. Chúng tôi hỗ trợ thành lập nhóm, kết nối đào tạo với thị trường Hà Nội và Sài Gòn, đồng thời xây dựng tên gọi “Craft Belt” để nghề của họ đi xa hơn bản làng.'}</p></div></section>
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
  const en = lang === 'en';
  return <div className="new-home" ref={pageRef}>
    <div className="reading-progress" aria-hidden="true" />
    <section data-scroll-part className="home-banner" aria-label={en ? 'Welcome to Mystère Shop' : 'Chào mừng đến Mystère Shop'}>
      <div className="banner-image"><HeroImage src="/images/Banner.png" priority /></div>
      <div className="banner-shade" />
      <div className="content-width banner-content">
        <div className="banner-meta"><p className="banner-eyebrow">The Vietnamese Refinement</p><p className="banner-location">Huyền Bí — Saigon</p><p className="banner-years">25 YEARS — EST. 2001</p></div>
        <h1>Mystère Shop</h1>
        <div className="banner-bottom">
          <Link to="/#where-it-began" className="banner-cta">{t(h.heroCta)} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
    <section id="who-we-are" data-scroll-part className="who-section" aria-labelledby="who-heading">
      <div className="section-top content-width"><h2 id="who-heading" className="who-heading">{en ? 'WHO WE ARE' : 'VỀ CHÚNG TÔI'}</h2><span>{en ? 'Rooted in Vietnam. Connected by craft.' : 'Khởi nguồn Việt Nam. Gắn kết qua nghề thủ công.'}</span></div>
      <div id="our-mission" className="mission-grid content-width"><div className="mission-copy"><p className="kicker">{en ? 'Our mission' : 'Sứ mệnh'}</p><h3>{t(h.intro.title)}</h3><div className="red-rule"/><p>{t(h.intro.body)}</p></div><figure className="mission-image"><Img src={h.intro.image} alt={en ? 'Inside Mystère Shop on Dong Khoi Street, Saigon' : 'Không gian cửa hàng Mystère trên đường Đồng Khởi, Sài Gòn'} ratio="aspect-[4/5]" priority/><figcaption><span>141 Đồng Khởi, Saigon</span><span>{en ? 'Since 2001' : 'Từ năm 2001'}</span></figcaption></figure></div>
      <div className="origin-grid content-width" id="where-it-began" data-scroll-part><figure><Img src={h.artisan.image} alt={en ? 'A photograph of the Red Dao community from the shop’s archive' : 'Ảnh cộng đồng Dao Đỏ từ tư liệu cửa hàng'} ratio="aspect-[16/10]"/><figcaption>{en ? 'From our archive · The Red Dao community' : 'Từ tư liệu của chúng tôi · Cộng đồng Dao Đỏ'}</figcaption></figure><div><p className="kicker">{en ? 'Where it began' : 'Khởi nguồn'}</p><h3>{t(h.artisan.title)}</h3><p>{t(h.artisan.body)}</p><div className="origin-note"><strong>2001</strong><span>{en ? 'A small shop in Saigon.\nThe beginning of a shared journey.' : 'Một cửa hàng nhỏ ở Sài Gòn.\nKhởi đầu hành trình đồng hành.'}</span></div></div></div>
    </section>
    <section id="what-we-do" data-scroll-part className="what-section"><div className="content-width"><div className="section-top"><p className="section-label">{en ? 'What we do' : 'Chúng tôi làm gì'}</p><span>{en ? 'Our projects' : 'Các dự án cùng cộng đồng'}</span></div><div className="projects-intro"><h2>{en ? 'More than a shop — a twenty-five-year partnership' : 'Hơn cả một cửa hàng — hành trình đồng hành 25 năm'}</h2><p>{en ? 'Mystère Shop has traded the finest handmade jewellery and craft of Vietnam’s hill-tribe artisans since 2001. The relationship behind every piece runs deeper than a transaction. It began with a chance meeting, grew through fifteen years of trust, and continues today across five communities in Cao Bằng, Hà Giang and Sa Pa.' : 'Từ năm 2001, Mystère Shop giới thiệu những món trang sức và sản phẩm thủ công tinh túy của nghệ nhân vùng cao Việt Nam. Mối quan hệ phía sau mỗi món đồ sâu sắc hơn một giao dịch — bắt đầu từ một cuộc gặp tình cờ, lớn lên qua mười lăm năm tin cậy và tiếp tục cùng năm cộng đồng tại Cao Bằng, Hà Giang và Sa Pa.'}</p></div><div className="projects-heading"><h2>{t(h.projectsIntro.title)}</h2><span>{en ? "Different communities — same commitment" : "Những cộng đồng khác nhau — chung một cam kết"}</span></div><div className="project-list">{content.communities.filter(c => c.published).map(c => <Project key={c.id} community={c}/>)}</div><Events /></div>
    </section>
      <section className="thread-section" id="the-thread" data-scroll-part><div className="content-width thread-grid"><div><p className="kicker">{en ? 'Visit us' : 'Ghé thăm chúng tôi'}</p><h2>{en ? 'Every piece carries a story' : 'Mỗi món đồ đều mang theo một câu chuyện'}</h2><p>{en ? "We don't just support these communities — we carry their work forward. Every piece you take home from Mystère Shop was made by the same hands, in the same villages, you've just read about. Choosing it is a small, direct way of keeping a craft — and the livelihood behind it — alive.\n\nCome visit us at 141 Đồng Khởi to see it, and hear it, in person." : 'Chúng tôi không chỉ đồng hành cùng các cộng đồng — chúng tôi tiếp nối công việc của họ. Mỗi món đồ bạn mang về từ Mystère Shop được làm bởi chính những đôi tay ở những bản làng bạn vừa đọc. Lựa chọn ấy góp phần giữ nghề thủ công và sinh kế phía sau nghề được tiếp nối.\n\nHãy ghé 141 Đồng Khởi để cảm nhận câu chuyện bằng mắt và lắng nghe trực tiếp.'}</p><Link to="/#contact" className="white-link">{en ? 'Visit us' : 'Ghé thăm cửa hàng'} <span aria-hidden="true">→</span></Link></div><figure><Img src={h.thread.image} alt={en ? 'Craft and everyday objects inside Mystère Shop' : 'Những món đồ thủ công trong cửa hàng Mystère'} ratio="aspect-[4/3]"/></figure></div>
    </section>
  </div>;
}
