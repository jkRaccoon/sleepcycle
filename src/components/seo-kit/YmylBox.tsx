/**
 * <YmylBox />
 *
 * YMYL (Your Money or Your Life) 카테고리에서 Google E-E-A-T 평가
 * 가이드라인을 충족하기 위한 면책·출처 박스 공통 컴포넌트.
 *
 * 카테고리별 면책 문구를 자동 생성하고, 출처 목록과 마지막 검증일을
 * 함께 표시한다. 법률 카테고리는 법무부 표준양식 링크를 자동 포함.
 *
 * @example
 * <YmylBox
 *   category="tax"
 *   dataSource={[
 *     { title: "국세청 종합소득세율 (2026)", url: "https://hometax.go.kr/...", verifiedDate: "2026-05-01" },
 *     { title: "지방세법 제103조", url: "https://law.go.kr/...", verifiedDate: "2026-05-01" }
 *   ]}
 * />
 */
import { resolveLang, type Lang } from './utils/lang';
import type { ReactNode } from 'react';

export type YmylCategory =
  | 'finance'
  | 'legal'
  | 'medical'
  | 'tax'
  | 'real-estate'
  | 'retirement'
  | 'parenting';

export interface YmylDataSource {
  title: string;
  url: string;
  /** ISO 날짜 ("YYYY-MM-DD"). */
  verifiedDate: string;
}

export interface YmylBoxProps {
  category: YmylCategory;
  dataSource: YmylDataSource[];
  /** 사이트별 추가/대체 면책 문구. */
  disclaimerOverride?: ReactNode;
  /** 카테고리별 기본 면책에 추가로 덧붙일 문구 (덮지 않고 append). */
  disclaimerAppend?: ReactNode;
  /** 언어 강제 지정. */
  language?: Lang;
  /** 추가 className. */
  className?: string;
}

interface CategoryCopy {
  label: string;
  disclaimer: string;
  /** 법률은 법무부 표준양식 등 카테고리별 공식 링크. */
  officialLinks?: { title: string; url: string }[];
}

const COPY: Record<Lang, Record<YmylCategory, CategoryCopy>> = {
  ko: {
    finance: {
      label: '금융 정보',
      disclaimer:
        '본 도구는 일반 정보 제공 목적이며, 개별 투자 자문이 아닙니다. 투자 결정 전 자격을 갖춘 금융 자문가와 상담하세요. 손실은 사용자 책임입니다.',
    },
    legal: {
      label: '법률 정보',
      disclaimer:
        '본 도구는 일반 법률 정보 제공 목적이며, 변호사 자문이 아닙니다. 개별 사안은 변호사 또는 법률구조공단(국번없이 132)에 상담하세요.',
      officialLinks: [
        {
          title: '법무부 표준양식',
          url: 'https://www.moj.go.kr/moj/256/subview.do',
        },
        {
          title: '국가법령정보센터',
          url: 'https://www.law.go.kr',
        },
      ],
    },
    medical: {
      label: '의료/건강 정보',
      disclaimer:
        '본 도구는 일반 건강 정보 제공 목적이며, 의학적 진단·치료를 대체하지 않습니다. 증상이 있는 경우 의사 또는 의료기관(보건복지콜센터 129)에 상담하세요.',
    },
    tax: {
      label: '세무 정보',
      disclaimer:
        '본 도구는 일반 세무 정보 제공 목적이며, 세무사 자문이 아닙니다. 신고/납부 전 국세상담센터(국번없이 126) 또는 세무사에 확인하세요. 계산 결과는 참고용입니다.',
      officialLinks: [
        { title: '국세청 홈택스', url: 'https://www.hometax.go.kr' },
        { title: '위택스 (지방세)', url: 'https://www.wetax.go.kr' },
      ],
    },
    'real-estate': {
      label: '부동산 정보',
      disclaimer:
        '본 도구는 일반 부동산 정보 제공 목적이며, 공인중개사 자문이 아닙니다. 계약·등기 전 공인중개사 또는 한국부동산원에 확인하세요.',
      officialLinks: [
        {
          title: '한국부동산원 시세',
          url: 'https://www.reb.or.kr',
        },
        {
          title: '국토교통부 실거래가 공개',
          url: 'https://rt.molit.go.kr',
        },
      ],
    },
    retirement: {
      label: '은퇴/연금 정보',
      disclaimer:
        '본 도구는 일반 은퇴 설계 정보 제공 목적이며, 개별 자문이 아닙니다. 국민연금 예상액은 국민연금공단(국번없이 1355)에서 정확한 수치를 확인하세요.',
      officialLinks: [
        {
          title: '국민연금공단',
          url: 'https://www.nps.or.kr',
        },
      ],
    },
    parenting: {
      label: '육아 정보',
      disclaimer:
        '본 도구는 일반 육아 정보 제공 목적이며, 소아과 의사 진료를 대체하지 않습니다. 발달·건강 우려가 있을 경우 소아과 또는 보건소(국번없이 129)에 상담하세요.',
    },
  },
  en: {
    finance: {
      label: 'Financial information',
      disclaimer:
        'This tool provides general information only and is not personal investment advice. Consult a qualified financial advisor before making any investment decision. Losses are the user’s responsibility.',
    },
    legal: {
      label: 'Legal information',
      disclaimer:
        'This tool provides general legal information only and is not legal advice. For your specific situation, consult a licensed attorney.',
      officialLinks: [
        {
          title: 'Korea Ministry of Justice — Standard Forms',
          url: 'https://www.moj.go.kr/moj/256/subview.do',
        },
        {
          title: 'Korean Law Information Center',
          url: 'https://www.law.go.kr/eng',
        },
      ],
    },
    medical: {
      label: 'Medical / health information',
      disclaimer:
        'This tool provides general health information only and does not replace medical diagnosis or treatment. If you have symptoms, consult a physician or medical institution.',
    },
    tax: {
      label: 'Tax information',
      disclaimer:
        'This tool provides general tax information only and is not professional tax advice. Confirm with the National Tax Service or a certified tax accountant before filing.',
      officialLinks: [
        { title: 'National Tax Service Hometax', url: 'https://www.hometax.go.kr' },
        { title: 'Local Tax (Wetax)', url: 'https://www.wetax.go.kr' },
      ],
    },
    'real-estate': {
      label: 'Real-estate information',
      disclaimer:
        'This tool provides general real-estate information only and is not professional advice. Verify with a licensed real-estate agent or the Korea Real Estate Board before any contract.',
      officialLinks: [
        { title: 'Korea Real Estate Board', url: 'https://www.reb.or.kr' },
      ],
    },
    retirement: {
      label: 'Retirement / pension information',
      disclaimer:
        'This tool provides general retirement-planning information only and is not personal advice. Confirm exact amounts with the National Pension Service.',
      officialLinks: [
        { title: 'National Pension Service', url: 'https://www.nps.or.kr/jsppage/english/main.jsp' },
      ],
    },
    parenting: {
      label: 'Parenting information',
      disclaimer:
        'This tool provides general parenting information only and does not replace pediatric care. Consult a pediatrician for any developmental or health concern.',
    },
  },
};

const UI = {
  ko: {
    sourceLabel: '출처',
    verifiedAt: '마지막 검증',
    officialResources: '공식 참고 자료',
    noteHeading: '안내',
  },
  en: {
    sourceLabel: 'Source',
    verifiedAt: 'Last verified',
    officialResources: 'Official resources',
    noteHeading: 'Notice',
  },
} as const;

function formatDate(iso: string, lang: Lang): string {
  if (!iso) return '';
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

export default function YmylBox({
  category,
  dataSource,
  disclaimerOverride,
  disclaimerAppend,
  language,
  className = '',
}: YmylBoxProps) {
  const lang = resolveLang(language);
  const copy = COPY[lang][category];
  const ui = UI[lang];

  return (
    <aside
      className={[
        'rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40',
        'p-4 text-sm leading-relaxed',
        'my-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="note"
      aria-label={`${ui.noteHeading} — ${copy.label}`}
      data-seo-component="ymyl-box"
      data-ymyl-category={category}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-800 dark:text-amber-100">
          {copy.label}
        </span>
      </div>

      <div className="text-slate-700 dark:text-slate-200">
        {disclaimerOverride ?? copy.disclaimer}
        {disclaimerAppend && <span className="ml-1">{disclaimerAppend}</span>}
      </div>

      {dataSource.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {ui.sourceLabel}
          </div>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {dataSource.map((src, i) => (
              <li key={`${src.url}-${i}`}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  {src.title}
                </a>
                <span className="ml-2 text-slate-500">
                  ({ui.verifiedAt}:{' '}
                  <time dateTime={src.verifiedDate}>
                    {formatDate(src.verifiedDate, lang)}
                  </time>
                  )
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {copy.officialLinks && copy.officialLinks.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {ui.officialResources}
          </div>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {copy.officialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
