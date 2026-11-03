import { useEffect, useRef } from 'react';
import widget from '../data/coupang-widget.json';
import { useTranslation } from 'react-i18next';

// 쿠팡 파트너스 캐러셀 배너 (위젯 id 는 허브별, trackingCode AF7990222)
// React SPA 에서 g.js 가 document.currentScript 부모에 위젯을 삽입하므로,
// 스크립트를 컨테이너 div 안에 직접 주입해 위치를 보장한다.
// prerender(puppeteer)는 ads-partners.coupang.com 요청을 차단하므로 dist HTML 에 굳지 않는다.

// 허브별 카테고리 베스트 배너. 맞는 카테고리가 없는 허브는 기본 위젯(993604).
const WIDGET_ID = (widget as { id: number }).id;

const DISCLOSURE_KO =
  '이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';
const DISCLOSURE_EN =
  'As a Coupang Partners affiliate, this site earns a commission from qualifying purchases.';

interface Props {
  className?: string;
  position?: 'top' | 'bottom';
}

export default function CoupangBanner({ className = '', position = 'bottom' }: Props) {
  const { i18n, t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || typeof window === 'undefined') return;

    let lastWidth = 0;

    // 쿠팡 위젯은 생성 시점의 width 로 고정되므로 컨테이너 실측 폭을 넘긴다.
    // 680 고정이면 모바일(<=430px)에서 가로 스크롤이 생겨 레이아웃이 깨진다.
    const measure = () => {
      const available =
        container.clientWidth ||
        container.parentElement?.clientWidth ||
        window.innerWidth - 32;
      return Math.max(240, Math.min(Math.floor(available), 680));
    };

    const appendInit = () => {
      lastWidth = measure();
      const init = document.createElement('script');
      init.text =
        'new PartnersCoupang.G({"id":' + WIDGET_ID + ',"trackingCode":"AF7990222","subId":"sleepcycle","template":"carousel","width":"' +
        lastWidth +
        '","height":"140"});';
      container.appendChild(init);
    };

    const render = () => {
      container.innerHTML = '';
      if ((window as unknown as { PartnersCoupang?: unknown }).PartnersCoupang) {
        appendInit();
      } else {
        const g = document.createElement('script');
        g.src = 'https://ads-partners.coupang.com/g.js';
        g.async = true;
        g.onload = appendInit;
        container.appendChild(g);
      }
    };

    render();

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (measure() !== lastWidth) render();
      }, 300);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      container.innerHTML = '';
    };
  }, []);

  const disclosure = t('ad.coupangDisclosure', {
    defaultValue: i18n.language?.startsWith('en') ? DISCLOSURE_EN : DISCLOSURE_KO,
  });

  const spacing =
    position === 'top'
      ? 'mb-8 border-b border-slate-200 pb-6'
      : 'mt-8 border-t border-slate-200 pt-6';

  return (
    <aside
      className={`${spacing} ${className}`}
      aria-label="advertisement"
    >
      {/* 대가성 고지는 배너 앞에, 본문과 구별되게 — 공정위 추천·보증 심사지침 2024-12-01 개정 */}
      <p className="mb-2 text-center text-xs font-medium leading-snug text-amber-700">{disclosure}</p>
      <div
        ref={ref}
        className="mx-auto flex w-full max-w-full justify-center overflow-hidden"
        style={{ maxWidth: '100%' }}
      />
    </aside>
  );
}
