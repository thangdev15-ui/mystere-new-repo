import { useEffect, type RefObject } from 'react';

/** One wheel/touch gesture advances one part; tall parts get readable intermediate stops. */
export function useSectionScroll(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let busy = false;
    let used = false;
    let lastInput = 0;
    let total = 0;
    let touchX = 0;
    let touchY = 0;
    let touchAllowed = false;
    let touchConsumed = false;
    const ignored = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('header, input, textarea, select, button, a, [contenteditable="true"], [role="dialog"]'));
    const stops = () => {
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 100;
      const max = document.documentElement.scrollHeight - innerHeight;
      const tops = [0, ...Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-part]')).map(el => Math.max(0, Math.min(max, el.getBoundingClientRect().top + scrollY - header - 16))), max];
      return [...new Set(tops)].sort((a,b) => a-b);
    };
    const advance = (direction: number) => {
      const positions = stops();
      const next = direction > 0 ? positions.find(y => y > scrollY + 8) : positions.slice().reverse().find(y => y < scrollY - 8);
      if (next === undefined) return;
      cancelAnimationFrame(frame);
      if (reduced.matches) { window.scrollTo({top:next, behavior:'instant'}); return; }
      const from = scrollY;
      const start = performance.now();
      busy = true;
      const animate = (now: number) => {
        const progress = Math.min(1, (now - start) / 720);
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        window.scrollTo({top:from + (next - from) * eased, behavior:'instant'});
        if (progress < 1) frame = requestAnimationFrame(animate);
        else { busy = false; frame = 0; }
      };
      frame = requestAnimationFrame(animate);
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || ignored(event.target) || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastInput > 180 && !busy) { used = false; total = 0; }
      lastInput = now;
      if (used || busy) return;
      total += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(total) >= 12) { used = true; advance(Math.sign(total)); }
    };
    const touchStart = (event: TouchEvent) => {
      touchConsumed = false;
      touchAllowed = event.touches.length === 1 && !ignored(event.target);
      if (touchAllowed) { touchX = event.touches[0].clientX; touchY = event.touches[0].clientY; }
    };
    const touchMove = (event: TouchEvent) => {
      if (touchConsumed && event.touches.length === 1) { event.preventDefault(); return; }
      if (!touchAllowed || event.touches.length !== 1) return;
      const dy = touchY - event.touches[0].clientY;
      if (Math.abs(dy) <= Math.abs(touchX - event.touches[0].clientX)) return;
      event.preventDefault();
      if (Math.abs(dy) > 45 && !busy) { advance(Math.sign(dy)); touchAllowed = false; touchConsumed = true; }
    };
    const cancel = () => { cancelAnimationFrame(frame); busy = false; };
    // A menu link or keyboard command takes priority over a running wheel transition.
    window.addEventListener('pointerdown', cancel);
    window.addEventListener('keydown', cancel);
    window.addEventListener('wheel', wheel, {passive:false});
    window.addEventListener('touchstart', touchStart, {passive:true});
    window.addEventListener('touchmove', touchMove, {passive:false});
    return () => {
      cancel();
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
    };
  }, [rootRef]);
}
