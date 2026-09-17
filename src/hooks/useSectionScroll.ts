import { useEffect, type RefObject } from 'react';

/** Desktop wheel navigation; touch retains native scrolling so tall content stays readable. */
export function useSectionScroll(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let target: number | null = null;
    let lastTime = 0;
    let lastDirection = 0;
    let consumed = false;
    const cancel = () => { cancelAnimationFrame(frame); frame = 0; target = null; consumed = false; };
    const positions = () => {
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 100;
      const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      const nodes = [...root.querySelectorAll<HTMLElement>('[data-scroll-part]')];
      const footer = document.getElementById('contact');
      if (footer) nodes.push(footer);
      return [...new Set([0, ...nodes.map(el => Math.round(Math.max(0, Math.min(max, el.getBoundingClientRect().top + scrollY - header - 12)))), max])].sort((a,b) => a-b);
    };
    const animate = (to: number) => {
      cancelAnimationFrame(frame);
      const from = scrollY;
      const start = performance.now();
      target = to;
      const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 620;
      const tick = (now: number) => {
        const p = duration ? Math.min(1, (now-start)/duration) : 1;
        const ease = 1 - Math.pow(1-p, 4);
        window.scrollTo({ top: from+(to-from)*ease, behavior:'instant' });
        if (p < 1) frame = requestAnimationFrame(tick);
        else { frame = 0; target = null; }
      };
      frame = requestAnimationFrame(tick);
    };
    const wheel = (event: WheelEvent) => {
      if (innerWidth < 761 || event.ctrlKey || event.metaKey || !event.deltaY || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
      if (event.target instanceof Element && event.target.closest('.site-header, input, textarea, select, [role="dialog"], [contenteditable="true"]')) return;
      const direction = Math.sign(event.deltaY);
      const now = performance.now();
      const reversed = direction !== lastDirection;
      const fresh = now-lastTime>160 || reversed;
      lastTime = now; lastDirection = direction;
      if (fresh) consumed = false;
      // Swallow momentum from the same gesture while animating, but allow immediate reversal.
      if ((target !== null || consumed) && !reversed) { event.preventDefault(); return; }
      const stops = positions();
      const next = direction>0 ? stops.find(y=>y>scrollY+4) : [...stops].reverse().find(y=>y<scrollY-4);
      if (next === undefined) { cancel(); return; }
      event.preventDefault();
      consumed = true;
      // Long sections must remain readable before moving to the following title.
      const page = innerHeight-(document.querySelector('.site-header')?.getBoundingClientRect().height ?? 100)-32;
      const destination = direction>0 && next-scrollY>page+80 ? Math.min(next,scrollY+page) : direction<0 && scrollY-next>page+80 ? Math.max(next,scrollY-page) : next;
      animate(destination);
    };
    window.addEventListener('wheel', wheel, { passive:false });
    window.addEventListener('pointerdown', cancel);
    window.addEventListener('keydown', cancel);
    window.addEventListener('hashchange', cancel);
    window.addEventListener('resize', cancel);
    return () => {
      cancel();
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
      window.removeEventListener('hashchange', cancel);
      window.removeEventListener('resize', cancel);
    };
  }, [rootRef]);
}
