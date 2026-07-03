import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// 쿠팡 파트너스 캐러셀 배너 (id 993604 / AF7990222)
// React SPA 에서 g.js 가 document.currentScript 부모에 위젯을 삽입하므로,
// 스크립트를 컨테이너 div 안에 직접 주입해 위치를 보장한다.
// prerender(puppeteer)는 ads-partners.coupang.com 요청을 차단하므로 dist HTML 에 굳지 않는다.

const DISCLOSURE_KO =
  '이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';
const DISCLOSURE_EN =
  'As a Coupang Partners affiliate, this site earns a commission from qualifying purchases.';

interface Props {
  className?: string;
}

export default function CoupangBanner({ className = '' }: Props) {
  const { i18n, t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || typeof window === 'undefined') return;

    container.innerHTML = '';

    const appendInit = () => {
      const init = document.createElement('script');
      init.text =
        'new PartnersCoupang.G({"id":993604,"trackingCode":"AF7990222","subId":null,"template":"carousel","width":"680","height":"140"});';
      container.appendChild(init);
    };

    if ((window as unknown as { PartnersCoupang?: unknown }).PartnersCoupang) {
      appendInit();
    } else {
      const g = document.createElement('script');
      g.src = 'https://ads-partners.coupang.com/g.js';
      g.async = true;
      g.onload = appendInit;
      container.appendChild(g);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  const disclosure = t('ad.coupangDisclosure', {
    defaultValue: i18n.language?.startsWith('en') ? DISCLOSURE_EN : DISCLOSURE_KO,
  });

  return (
    <aside
      className={`mt-8 border-t border-slate-200 pt-6 ${className}`}
      aria-label="advertisement"
    >
      <div
        ref={ref}
        className="mx-auto flex w-full justify-center overflow-x-auto"
        style={{ maxWidth: '100%' }}
      />
      <p className="mt-2 text-center text-[11px] leading-tight text-slate-400">{disclosure}</p>
    </aside>
  );
}
