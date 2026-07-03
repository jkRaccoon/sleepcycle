/**
 * 컴포넌트 내부에서 ko/en 분기를 위한 미니 i18n 헬퍼.
 *
 * 외부 react-i18next namespace 의존을 피하기 위해 각 컴포넌트는 자체
 * 번역 dictionary 를 갖고, 이 헬퍼로 분기한다. 사이트별 i18n 설정이
 * 다양해도(bal-hub 의 'translation' vs 다른 사이트의 별 namespace)
 * 동일하게 동작.
 *
 * 우선순위:
 *   1. props.language ('ko' | 'en')          ← 명시 prop
 *   2. react-i18next i18n.language            ← 이미 init 된 경우만
 *   3. document.documentElement.lang          ← html lang
 *   4. 'ko'                                   ← 기본
 */

export type Lang = 'ko' | 'en';

export function resolveLang(prop?: Lang): Lang {
  if (prop === 'ko' || prop === 'en') return prop;

  // react-i18next 가 초기화되어 있다면 그것을 우선
  try {
    // dynamic import 시도 없이, 전역에 i18next 가 있을 때만 활용
    const i18n = (
      globalThis as unknown as { i18next?: { language?: string } }
    ).i18next;
    if (i18n?.language) {
      return i18n.language.startsWith('en') ? 'en' : 'ko';
    }
  } catch {
    // ignore
  }

  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang?.toLowerCase() ?? '';
    if (htmlLang.startsWith('en')) return 'en';
    if (htmlLang.startsWith('ko')) return 'ko';
  }

  return 'ko';
}

export function pick<T>(lang: Lang, dict: Record<Lang, T>): T {
  return dict[lang];
}
