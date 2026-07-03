/**
 * SEO/AEO/GEO/AIO 전략 v2 (2026 Q2~Q3) 공통 컴포넌트 배럴.
 *
 * 124 사이트가 동일한 import 패턴으로 사용:
 *   import { AuthorByline, YmylBox, Faq } from '@/components/seo';
 *
 * 또는 (별칭 미설정 시):
 *   import AuthorByline from './components/seo/AuthorByline';
 *
 * 사이트별 적용 가이드: ./README.md
 */
export { default as AuthorByline } from './AuthorByline';
export type { AuthorBylineProps } from './AuthorByline';

export { default as YmylBox } from './YmylBox';
export type { YmylBoxProps, YmylCategory, YmylDataSource } from './YmylBox';

export { default as Faq, validateFaqItems } from './Faq';
export type { FaqProps, FaqItem } from './Faq';

export { jaccard, wordCount } from './utils/jaccard';
export { resolveLang } from './utils/lang';
export type { Lang } from './utils/lang';
