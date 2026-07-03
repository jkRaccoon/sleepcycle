/**
 * 토큰 단위 Jaccard 유사도 계산 헬퍼.
 *
 * SEO/AEO 전략 v2 (2026 Q2~Q3) — FAQ 답변 시드를 사이트별로 60% 이상
 * 커스터마이즈 하기 위해 사용. 두 텍스트의 형태소(공백 단위 토큰) 집합
 * 교집합/합집합으로 0~1 유사도를 반환한다.
 *
 * - 1.0  완전 동일
 * - 0.0  공통 토큰 없음
 *
 * 가이드라인: 시드 vs 커스터마이즈 본문이 jaccard >= 0.7 이면
 * "차별화 부족"으로 간주하여 dev 콘솔 경고를 띄운다. (Faq.tsx)
 */

const WORD_RE = /[A-Za-z0-9가-힣]+/g;

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .match(WORD_RE)
      ?.filter((t) => t.length > 1) ?? [],
  );
}

export function jaccard(a: string, b: string): number {
  const A = tokenize(a);
  const B = tokenize(b);
  if (A.size === 0 && B.size === 0) return 1;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * 단어 수 (영문은 공백, 한글은 글자 단위로 근사 — Korean writing tradition
 * 에서 "단어"는 어절(공백 단위)에 해당). FAQ 답변 40~75단어 가이드라인
 * 검증에 사용.
 */
export function wordCount(text: string): number {
  if (!text) return 0;
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * dev mode 에서만 console.warn 을 호출한다. (배포에서는 무음.)
 * Vite 의 `import.meta.env.DEV` 또는 사이트별 토글로 게이팅.
 */
export function devWarn(...args: unknown[]): void {
  let isDev = false;
  try {
    // Vite 환경에서만 정의됨. 그 외에서는 catch 로 떨어져 isDev=false 유지.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: any = (import.meta as unknown as { env?: { DEV?: boolean } });
    isDev = !!meta?.env?.DEV;
  } catch {
    isDev = false;
  }

  if (isDev) {
    // eslint-disable-next-line no-console
    console.warn('[seo-kit]', ...args);
    return;
  }

  if (
    typeof window !== 'undefined' &&
    (window as unknown as { __SEO_KIT_DEBUG__?: boolean }).__SEO_KIT_DEBUG__
  ) {
    // 사이트별 강제 디버그 토글: window.__SEO_KIT_DEBUG__ = true
    // eslint-disable-next-line no-console
    console.warn('[seo-kit]', ...args);
  }
}
