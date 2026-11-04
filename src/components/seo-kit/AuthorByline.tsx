/**
 * <AuthorByline />
 *
 * SEO/AEO/GEO/AIO 전략 v2 (2026 Q2~Q3) "YMYL 5종 세트" 중 저자·감수자·
 * 업데이트일·Organization 링크를 한 줄로 표시하는 공통 컴포넌트.
 *
 * 한 줄 표시 + JSON-LD `author` / `dateModified` 자동 inject (script 태그
 * 를 직접 document.head 에 붙임 — SEO.tsx 와 동일한 OWNED_ATTR 패턴).
 *
 * @example
 * <AuthorByline
 *   authorName="김지광 (운영자)"
 *   reviewerName="공개 법령·국세청 안내 기반 검토"
 *   lastUpdated="2026-05-16"
 *   organizationName="bal.pe.kr 마이크로 SaaS"
 *   organizationUrl="/about"
 * />
 */
import { useEffect } from 'react';
import { resolveLang, type Lang } from './utils/lang';

export interface AuthorBylineProps {
  /** 작성자 표시 이름. 예: "김지광 (운영자)" 또는 비식별 가능한 표시. */
  authorName: string;
  /** YMYL 카테고리에서 감수자 표시 (선택). */
  reviewerName?: string;
  /** ISO 날짜 ("YYYY-MM-DD"). dateModified 로 JSON-LD 에 들어간다. */
  lastUpdated: string;
  /** 게시 일자 (선택). datePublished 로 JSON-LD 에 들어간다. */
  datePublished?: string;
  /** Organization schema 의 `name`. */
  organizationName: string;
  /** Organization schema 의 `url` 또는 사이트 내부 경로. 절대/상대 모두 허용. */
  organizationUrl?: string;
  /** 언어 강제 지정. 기본은 사이트 i18n 자동 감지. */
  language?: Lang;
  /**
   * JSON-LD 의 mainEntity `@type` (기본 Article). 도구 페이지처럼
   * WebApplication 이 더 적절한 경우 'WebApplication' 등 지정.
   */
  mainEntityType?: 'Article' | 'WebApplication' | 'WebPage' | 'TechArticle';
  /** 추가 className. */
  className?: string;
  /**
   * true 면 시각적 표시는 생략하고 JSON-LD 만 inject (이미 페이지 어딘가에
   * 저자 정보를 별도 UI 로 렌더링한 경우).
   */
  jsonLdOnly?: boolean;
}

const DICT = {
  ko: {
    authorPrefix: '작성',
    reviewerPrefix: '검토 근거',
    updatedPrefix: '마지막 업데이트',
    by: '·',
  },
  en: {
    authorPrefix: 'Author',
    reviewerPrefix: 'Review basis',
    updatedPrefix: 'Last updated',
    by: '·',
  },
} as const;

const OWNED_ATTR = 'data-seo-managed';

function setJsonLd(selector: string, payload: object) {
  if (typeof document === 'undefined') return;
  document.head
    .querySelectorAll(`script[${OWNED_ATTR}="${selector}"]`)
    .forEach((el) => el.remove());
  const el = document.createElement('script');
  el.setAttribute(OWNED_ATTR, selector);
  el.setAttribute('type', 'application/ld+json');
  el.textContent = JSON.stringify(payload);
  document.head.appendChild(el);
}

function absoluteUrl(maybePath?: string): string | undefined {
  if (!maybePath) return undefined;
  if (maybePath.startsWith('http://') || maybePath.startsWith('https://')) {
    return maybePath;
  }
  if (typeof window === 'undefined') return maybePath;
  const origin = window.location.origin;
  return maybePath.startsWith('/')
    ? `${origin}${maybePath}`
    : `${origin}/${maybePath}`;
}

function formatDate(iso: string, lang: Lang): string {
  if (!iso) return '';
  // YYYY-MM-DD 가 아닌 ISO datetime 도 그대로 받아 Intl 로 포맷
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return iso;
  }
}

export default function AuthorByline({
  authorName,
  reviewerName,
  lastUpdated,
  datePublished,
  organizationName,
  organizationUrl,
  language,
  mainEntityType = 'Article',
  className = '',
  jsonLdOnly = false,
}: AuthorBylineProps) {
  const lang = resolveLang(language);
  const t = DICT[lang];

  useEffect(() => {
    const orgUrl = absoluteUrl(organizationUrl);
    const pageUrl =
      typeof window !== 'undefined' ? window.location.href : undefined;

    const author = { '@type': 'Person', name: authorName };
    // reviewerName 은 검토 근거(공개 자료 등)를 적는 문구라 실제 사람이 아니다 — reviewedBy(Person)로 내보내지 않는다
    const publisher = {
      '@type': 'Organization',
      name: organizationName,
      ...(orgUrl ? { url: orgUrl } : {}),
    };

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': mainEntityType,
      author,
      ...(datePublished ? { datePublished } : {}),
      dateModified: lastUpdated,
      publisher,
      ...(pageUrl
        ? { mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl } }
        : {}),
    };

    setJsonLd('jsonld-authorbyline', jsonLd);

    return () => {
      if (typeof document !== 'undefined') {
        document.head
          .querySelectorAll(`script[${OWNED_ATTR}="jsonld-authorbyline"]`)
          .forEach((el) => el.remove());
      }
    };
  }, [
    authorName,
    reviewerName,
    lastUpdated,
    datePublished,
    organizationName,
    organizationUrl,
    mainEntityType,
  ]);

  if (jsonLdOnly) return null;

  const updated = formatDate(lastUpdated, lang);

  return (
    <div
      className={[
        'text-sm text-slate-600 dark:text-slate-400',
        'flex flex-wrap items-center gap-x-2 gap-y-1',
        'py-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-seo-component="author-byline"
    >
      <span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {t.authorPrefix}
        </span>{' '}
        {authorName}
      </span>
      {reviewerName && (
        <>
          <span aria-hidden="true">{t.by}</span>
          <span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {t.reviewerPrefix}
            </span>{' '}
            {reviewerName}
          </span>
        </>
      )}
      <span aria-hidden="true">{t.by}</span>
      <span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {t.updatedPrefix}
        </span>{' '}
        <time dateTime={lastUpdated}>{updated}</time>
      </span>
      <span aria-hidden="true">{t.by}</span>
      {organizationUrl ? (
        <a
          href={organizationUrl}
          className="underline decoration-dotted underline-offset-2 hover:text-slate-900 dark:hover:text-slate-100"
        >
          {organizationName}
        </a>
      ) : (
        <span>{organizationName}</span>
      )}
    </div>
  );
}
