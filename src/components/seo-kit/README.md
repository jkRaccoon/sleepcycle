# SEO/AEO/GEO/AIO 공통 컴포넌트 v1

> 2026 Q2~Q3 SEO 전략 v2 (`[[feedback_seo_strategy_v2]]`) 의 "YMYL 5종 세트"
> + FAQPage 시드 + 60% customization 규칙을 124 사이트에 일관 적용하기
> 위한 React 공통 컴포넌트.
>
> 마스터 위치: `bal-hub/src/components/seo-kit/`
> 산출일: 2026-05-16

---

## 1. 무엇을 제공하나

| 컴포넌트         | 역할                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `<AuthorByline>` | 작성자·감수자·마지막 업데이트·Organization 한 줄 표시 + Article/WebApplication JSON-LD inject |
| `<YmylBox>`      | 7개 YMYL 카테고리별 면책 + 출처 + 마지막 검증일 + 카테고리별 공식 링크 자동 표시            |
| `<Faq>`          | details/summary 렌더링 + FAQPage JSON-LD 자동 생성 + 40~75 단어 / jaccard 검증              |

부속 헬퍼:

- `validateFaqItems(items)` — 빌드 스크립트에서 사이트별 FAQ 자체 검증
- `jaccard(a, b)` / `wordCount(text)` — 시드 차별화·답변 길이 검증 유틸
- `resolveLang(prop?)` — react-i18next / `<html lang>` / 명시 prop 순으로 ko/en 결정

---

## 2. 124 사이트가 사용하는 방법

### 2.1 import 패턴 결정 — 복붙(copy-sync)

세 가지 가능한 방법을 검토했고 **(C) 복붙(copy-sync)** 을 채택했습니다.

| 방법                 | 장점                                  | 단점                                                                                                  | 채택? |
| -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----- |
| (A) npm 패키지       | 버전 관리 깔끔                        | publish workflow 필요 + 124개 사이트가 매번 `npm i` 후 lockfile 재커밋, GHA 빌링도 살아 있어야 함     | ✗     |
| (B) git submodule    | 단일 마스터 소스                      | submodule 업데이트 빠뜨리기 쉬움, CI에서 `--recurse-submodules` 강제, 신규 사이트 추가 비용           | ✗     |
| **(C) 복붙(copy-sync)** | 가장 단순. 사이트별 빌드 영향 0. 마스터에서 일괄 sync 스크립트 1회. | 마스터 변경 시 동기화 수동 (자동화 스크립트로 보완) | ✓     |

→ 운영자가 124개 사이트를 모두 통제하므로 sync 스크립트로 충분. 마스터를
`bal-hub/src/components/seo-kit/` 에 두고, 각 사이트는 동일 경로
`<site>/src/components/seo-kit/` 에 동기화한 사본을 갖는다.

### 2.2 동기화 스크립트

`microsaas-infra/scripts/sync-seo-components.sh` 에 추가되었습니다 (이 PR
산출물). 사용법:

```bash
# 단일 사이트
./scripts/sync-seo-components.sh yebang

# 전체 사이트 (124개)
./scripts/sync-seo-components.sh --all

# Dry-run (변경 미적용, diff 만)
./scripts/sync-seo-components.sh --all --dry-run
```

내부 동작: `rsync -av --delete bal-hub/src/components/seo-kit/
<site>/src/components/seo-kit/` (헤더 주석 `// AUTO-SYNCED — do not edit` 도
자동 삽입).

### 2.3 사이트별 import

```tsx
// 1) 별칭 사용 시 (vite.config 에 @ alias 설정 시)
import { AuthorByline, YmylBox, Faq } from '@/components/seo-kit';

// 2) 별칭 미설정 시
import { AuthorByline, YmylBox, Faq } from '../components/seo-kit';
```

---

## 3. 컴포넌트별 사용 가이드

### 3.1 `<AuthorByline>` — 모든 페이지의 기본 신뢰 신호

```tsx
import { AuthorByline } from '@/components/seo-kit';

<AuthorByline
  authorName="김지광 (운영자)"
  reviewerName="외부 세무사 검수"           // YMYL 페이지에서 권장
  lastUpdated="2026-05-16"                  // 페이지 콘텐츠 변경 시 갱신
  datePublished="2026-04-12"                // 선택
  organizationName="bal.pe.kr 마이크로 SaaS"
  organizationUrl="https://bal.pe.kr/about"
  mainEntityType="Article"                  // 도구 페이지면 "WebApplication"
/>
```

**필수 입력 정책:**

- `authorName` 은 비식별 가능한 표시여도 무방 ("운영자 김지광" 정도).
- `reviewerName` 은 YMYL 5종(finance·legal·medical·tax·real-estate·
  retirement·parenting) 카테고리 페이지에서는 **반드시** 입력.
- `lastUpdated` 는 ISO 날짜 (YYYY-MM-DD). 페이지 콘텐츠 의미 있는 변경
  시 갱신.

**JSON-LD inject:**

`document.head` 에 `application/ld+json` 한 블록 추가. SEO.tsx 의 기존
JSON-LD 블록을 덮어쓰지 않도록 `data-seo-managed="jsonld-authorbyline"`
selector 로 격리.

**시각적 표시 끄기 (`jsonLdOnly`):**

이미 페이지에 별도의 저자 UI 가 있는 경우:

```tsx
<AuthorByline ... jsonLdOnly />
```

### 3.2 `<YmylBox>` — YMYL 카테고리 페이지 필수

지원 카테고리: `finance` · `legal` · `medical` · `tax` · `real-estate` ·
`retirement` · `parenting`.

```tsx
import { YmylBox } from '@/components/seo-kit';

<YmylBox
  category="tax"
  dataSource={[
    {
      title: '국세청 종합소득세율 (2026)',
      url: 'https://hometax.go.kr/...',
      verifiedDate: '2026-05-01',
    },
    {
      title: '지방세법 제103조',
      url: 'https://law.go.kr/...',
      verifiedDate: '2026-05-01',
    },
  ]}
/>
```

카테고리별로:

- 면책 문구 자동 생성 (변호사 자문 아님 등)
- 공식 링크 자동 표시 (법무부 표준양식, 홈택스, 국민연금 등)
- 한국어/영어 분기

**사이트별 추가 면책:**

```tsx
<YmylBox
  category="legal"
  dataSource={[...]}
  disclaimerAppend={
    <span>본 사이트는 부동산 임대차 계약서 양식만 제공하며 ...</span>
  }
/>
```

`disclaimerOverride` 는 기본 면책을 완전히 대체할 때 사용 (권장하지
않음 — 기본 면책이 법적으로 안전한 표현이라 append 가 더 안전).

### 3.3 `<Faq>` — 40~75 단어 답변 + FAQPage 스키마

```tsx
import { Faq } from '@/components/seo-kit';

const faqItems = [
  {
    question: '예방접종 알림은 언제 보내나요?',
    answer:
      '본 도구는 서버 알림을 사용하지 않습니다. 접종 예정일을 입력하면 ICS 캘린더 파일을 생성하여 사용자가 직접 Google Calendar / Apple Calendar 에 등록할 수 있게 도와줍니다. 알림은 캘린더 앱이 보내며, 본 사이트는 어떤 개인정보도 저장하지 않습니다.',
    seedAnswer:
      '본 사이트는 캘린더에 일정을 등록할 수 있게 도와주는 도구입니다.',
  },
  // ... 5~7 개 권장
];

<Faq items={faqItems} />
```

**검증 규칙 (dev mode 콘솔 경고):**

- 답변 단어 수가 40 미만 → 경고
- 답변 단어 수가 75 초과 → 경고
- `seedAnswer` 와 `answer` 의 jaccard ≥ 0.7 → 차별화 부족 경고

**빌드 단계 강제 검증:**

prerender 또는 별도 스크립트에서:

```ts
import { validateFaqItems } from '@/components/seo-kit';

const { ok, warnings } = validateFaqItems(faqItems);
if (!ok) {
  warnings.forEach((w) => console.error(w));
  process.exit(1);  // CI 에서 차단하고 싶다면
}
```

**jaccard 검증 헬퍼 사용 예시 (개발자가 사이트별 customization 확인):**

```ts
import { jaccard } from '@/components/seo-kit';

const seed = '본 사이트는 캘린더에 일정을 등록할 수 있게 도와주는 도구입니다.';
const myAnswer = '...';  // 작성한 답변
console.log('similarity:', jaccard(seed, myAnswer));
// 0.7 이상이면 더 사이트 고유 데이터로 다시 작성
```

---

## 4. 빌드 / 프리렌더 호환성

- 모든 컴포넌트는 **client-only** (useEffect 안에서만 document 조작).
- prerender 단계 (`scripts/prerender.mjs`) 에서 puppeteer 로 페이지를
  로드하면 useEffect 가 실행되어 JSON-LD 가 `dist/.../index.html` 의
  `<head>` 에 굳어 들어간다. (`SEO.tsx` 와 동일 동작.)
- prerender 시 AdSense / analytics 차단 규칙은 변동 없음
  (`[[feedback_prerender_adsense_block]]`).

---

## 5. i18n

각 컴포넌트는 외부 react-i18next namespace 에 **의존하지 않습니다**.

언어 결정 우선순위:

1. props.language ('ko' | 'en')
2. globalThis.i18next.language (이미 init 된 경우)
3. document.documentElement.lang
4. 'ko' (기본)

사이트가 외부 번역 키로 컴포넌트 내부 문구까지 바꾸고 싶다면, 컴포넌트
복사본의 `DICT` / `COPY` 객체를 수정하는 방식을 권장 (모든 사이트가 동일
한 표현을 유지하는 게 일관된 신뢰 신호이므로 가급적 그대로 사용).

---

## 6. 사이트별 적용 체크리스트

신규 사이트 빌드 시 ([[feedback_new_site_standard_stack]] 보강) — YMYL
카테고리 페이지에서:

1. [ ] `<AuthorByline>` 페이지 최상단(헤더 아래) 배치
2. [ ] YMYL 카테고리 (7종 중 하나)면 `<YmylBox>` 도구 결과 바로 위에 배치
3. [ ] 페이지 본문 끝에 `<Faq>` 배치 (5~7 개 항목, 40~75 단어 답변)
4. [ ] FAQ 답변 시드 사용 시 jaccard < 0.7 확인 (dev 콘솔 경고 없음)
5. [ ] SEO.tsx 의 jsonLd prop 과 충돌하지 않는지 점검 (selector 격리됨)
6. [ ] 빌드 → prerender → dist HTML 에 `application/ld+json` 블록이 들어
   갔는지 grep 으로 확인

---

## 7. 변경 이력

- 2026-05-16 v1 — AuthorByline / YmylBox / Faq 3종 초기 빌드, yebang 시범
  적용 (Task #11)

---

## 8. 메모리 반영 권고

다음 메모리 항목 업데이트 권고 (운영자가 수동 반영):

- `[[feedback_seo_strategy_v2]]` — "JSON-LD 5종" 항목에 본 컴포넌트
  배럴 경로 추가 (`bal-hub/src/components/seo-kit/`)
- `[[feedback_new_site_standard_stack]]` — 신규 사이트 표준 10 단계의
  "JSON-LD 4종" 단계를 본 컴포넌트 import 로 대체
- `[[project_site_improvement_2026q2]]` — Phase 2 액션 2 완료 표시

---

## 9. 트러블슈팅

**Q. JSON-LD 가 dist HTML 에 안 보임.**
A. prerender 가 useEffect 실행 후 충분히 대기하는지 확인. puppeteer 의
`networkidle0` 또는 명시적 wait 필요. SEO.tsx 와 동일 메커니즘이므로
SEO.tsx 가 동작하면 본 컴포넌트도 동작해야 정상.

**Q. dev 콘솔에 경고가 안 뜸.**
A. `process.env.NODE_ENV === 'development'` 일 때만 자동 경고. 강제로
보려면 `window.__SEO_COMPONENTS_DEBUG__ = true` 후 새로고침.

**Q. 카테고리에 없는 YMYL 영역.**
A. 현재 7종 (finance/legal/medical/tax/real-estate/retirement/parenting).
신규 카테고리는 `YmylBox.tsx` 의 `COPY` 에 추가 후 124 사이트 일괄 sync.

**Q. 사이트가 FAQ 항목을 동적으로 (사용자 입력 기반) 생성하는 경우.**
A. JSON-LD inject 가 매 렌더링 시 재생성되므로 OK. 단 FAQPage 스키마는
"안정적이고 콘텐츠 페이지에 명시된" Q&A 만 인덱싱 대상으로 인정되므로
사용자 입력 기반 동적 FAQ 는 `jsonLdOnly={false}` 만 권장 ( JSON-LD 는
실제 페이지 내용이 안정적일 때만 의미가 있음).
