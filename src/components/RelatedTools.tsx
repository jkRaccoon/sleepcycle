import { useLocation } from 'react-router-dom';
import related from '../data/related.json';

/**
 * 같은 허브의 관련 도구와 허브·전체 목록으로 나가는 내부 링크.
 * 도구 페이지에서 나가는 링크가 루트 하나뿐이라 크롤러가 다른 도구로
 * 이동할 경로가 없던 문제를 메운다. 링크는 절대 URL 로 둔다.
 */
export default function RelatedTools() {
  const location = useLocation();
  // basename(/tools/<slug>)은 router가 이미 제거하므로 '/en' 접두만 보면 된다.
  // detectLangFromPath 는 도구마다 위치가 달라(i18n / lib/i18n) 의존하지 않는다.
  const path = location.pathname;
  const ko = !(path === '/en' || path.startsWith('/en/'));

  const hub = related.hub;
  const tools = related.tools ?? [];
  if (tools.length === 0) return null;

  const suffix = ko ? '' : '/en';

  return (
    <aside className="mt-10 border-t border-slate-200 pt-8" aria-label={ko ? '관련 도구' : 'Related tools'}>
      <h2 className="text-base font-semibold text-slate-900">
        {hub.emoji} {ko ? `${hub.ko} 관련 도구` : `More in ${hub.en}`}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {ko
          ? '같은 주제의 다른 계산기입니다. 전부 무료이고 로그인이 필요 없습니다.'
          : 'Other calculators on the same topic. All free, no sign-up.'}
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {tools.map((t) => (
          <li key={t.slug}>
            <a
              href={`${t.url}${suffix}`}
              className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <span aria-hidden className="mt-0.5 shrink-0">{t.emoji}</span>
              <span className="leading-snug">{ko ? t.ko : t.en}</span>
            </a>
          </li>
        ))}
      </ul>

      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        <a
          href={`https://bal.pe.kr${ko ? '' : '/en'}/hub/${hub.id}`}
          className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
        >
          {ko ? `${hub.ko} 전체 보기` : `All ${hub.en} tools`} →
        </a>
        <a
          href="https://bal.pe.kr/tools"
          className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
        >
          {ko ? '전체 도구 목록' : 'All tools'} →
        </a>
      </nav>
    </aside>
  );
}
