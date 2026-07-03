/**
 * <Faq />
 *
 * SEO/AEO/GEO/AIO 전략 v2 (2026 Q2~Q3) — FAQPage JSON-LD 자동 생성 +
 * details/summary 시맨틱 마크업으로 렌더링하는 공통 컴포넌트.
 *
 * - 답변 단어 수 40~75 권장 (gent dev warning)
 * - 시드 답변과 사이트별 본문 jaccard ≥ 0.7 일 때 차별화 부족 경고
 *   ([[feedback_seo_strategy_v2]] FAQPage 시드 + 60% customization 규칙)
 *
 * @example
 * <Faq
 *   items={[
 *     { question: "...", answer: "...", seedAnswer: "원본 시드" },
 *     ...
 *   ]}
 * />
 */
import { useEffect } from 'react';
import { resolveLang, type Lang } from './utils/lang';
import { jaccard, wordCount, devWarn } from './utils/jaccard';

export interface FaqItem {
  question: string;
  /** 40~75 단어 권장. */
  answer: string;
  /**
   * 선택. 사이트별 customization 정도를 jaccard 로 검증할 때 사용 (시드
   * 와 비교). jaccard >= 0.7 이면 dev 경고. 배포에서는 영향 없음.
   */
  seedAnswer?: string;
}

export interface FaqProps {
  items: FaqItem[];
  /** 기본 'auto' — 사이트 i18n 자동 감지. */
  language?: Lang;
  /** 섹션 제목. 기본은 언어별 기본 문구. */
  heading?: string;
  /** 추가 className. */
  className?: string;
  /**
   * jaccard 임계치. 기본 0.7. 시드 vs 답변 유사도가 이 값 이상이면 dev
   * 콘솔 경고.
   */
  jaccardThreshold?: number;
  /**
   * true 면 시각적 렌더링 생략, JSON-LD 만 inject. (이미 페이지에 FAQ
   * UI 가 별도로 렌더링된 경우.)
   */
  jsonLdOnly?: boolean;
  /**
   * details/summary 의 첫 번째 항목을 펼친 상태로 시작할지 여부.
   */
  defaultOpenFirst?: boolean;
}

const DICT = {
  ko: {
    heading: '자주 묻는 질문',
  },
  en: {
    heading: 'Frequently asked questions',
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

/**
 * 외부에서 사이트별 커스터마이즈 검증용으로 호출할 수 있도록 export.
 * 빌드 스크립트에서 import 해 검증할 수 있다.
 */
export function validateFaqItems(
  items: FaqItem[],
  options: { jaccardThreshold?: number; lang?: Lang } = {},
): { ok: boolean; warnings: string[] } {
  const threshold = options.jaccardThreshold ?? 0.7;
  const warnings: string[] = [];
  items.forEach((item, i) => {
    const wc = wordCount(item.answer);
    if (wc < 40) {
      warnings.push(
        `[Faq] item #${i + 1} answer is too short (${wc} words; min 40).`,
      );
    } else if (wc > 75) {
      warnings.push(
        `[Faq] item #${i + 1} answer is too long (${wc} words; max 75).`,
      );
    }
    if (item.seedAnswer) {
      const sim = jaccard(item.seedAnswer, item.answer);
      if (sim >= threshold) {
        warnings.push(
          `[Faq] item #${i + 1} customization insufficient: jaccard=${sim.toFixed(2)} >= ${threshold}. Rewrite the answer with site-specific data, examples, and phrasing.`,
        );
      }
    }
  });
  return { ok: warnings.length === 0, warnings };
}

export default function Faq({
  items,
  language,
  heading,
  className = '',
  jaccardThreshold = 0.7,
  jsonLdOnly = false,
  defaultOpenFirst = false,
}: FaqProps) {
  const lang = resolveLang(language);
  const t = DICT[lang];
  const sectionHeading = heading ?? t.heading;

  useEffect(() => {
    if (!items || items.length === 0) return;

    // dev mode 검증
    const { warnings } = validateFaqItems(items, {
      jaccardThreshold,
      lang,
    });
    warnings.forEach((w) => devWarn(w));

    // FAQPage JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    setJsonLd('jsonld-faqpage', jsonLd);

    return () => {
      if (typeof document !== 'undefined') {
        document.head
          .querySelectorAll(`script[${OWNED_ATTR}="jsonld-faqpage"]`)
          .forEach((el) => el.remove());
      }
    };
  }, [items, jaccardThreshold, lang]);

  if (jsonLdOnly || !items || items.length === 0) return null;

  return (
    <section
      className={['my-8', className].filter(Boolean).join(' ')}
      aria-labelledby="seo-faq-heading"
      data-seo-component="faq"
    >
      <h2
        id="seo-faq-heading"
        className="text-xl font-semibold text-slate-900 dark:text-slate-100"
      >
        {sectionHeading}
      </h2>

      <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {items.map((item, i) => (
          <details
            key={`${item.question}-${i}`}
            className="group p-4 open:bg-slate-50 dark:open:bg-slate-900/40"
            open={defaultOpenFirst && i === 0}
          >
            <summary className="cursor-pointer list-none text-base font-medium text-slate-900 dark:text-slate-100 group-open:mb-2 flex items-start justify-between gap-3">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="mt-1 inline-block text-slate-500 transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
