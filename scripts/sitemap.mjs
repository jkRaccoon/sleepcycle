#!/usr/bin/env node
// scripts/sitemap.mjs — 통합 sitemap 생성기 (서브디렉토리 마이그레이션 표준본)
//
// dist/ 빌드 산출물을 재귀 스캔해 index.html 이 있는 디렉토리를 라우트로 자동 파악한다.
// 도구별 BASE_ROUTES 하드코딩(변형: SITE 리터럴 / HOST 리터럴 / HOST+SITE_HOST 환경변수 폴백 /
// 정적 public/sitemap.xml 등)에 의존하지 않으므로 라우트 구조가 달라도 그대로 동작한다.
//
// 주의: 이 스크립트는 build 체인에서 `vite build && <prerender>` 다음에 실행돼야 한다.
// dist/ 가 아직 prerender 결과로 채워지지 않았으면 즉시 에러로 종료한다.
//
// SLUG 는 subdir-migrate.sh(subdir-patch.mjs) 가 sleepcycle 를 도구 slug 로 치환해 기록한다.
import { writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const SLUG = 'sleepcycle';
const SITE = 'https://bal.pe.kr';
const BASE = `/tools/${SLUG}`;
const DIST = 'dist';

if (!existsSync(DIST)) {
  console.error(`✗ ${DIST}/ 없음 — sitemap.mjs 는 prerender 이후 build 단계에서 실행해야 합니다`);
  process.exit(1);
}

// dist/ 재귀 스캔 → index.html 이 있는 디렉토리 = 실제 배포되는 라우트
function findRoutes(dir, routePrefix = '') {
  const routes = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'assets') continue; // 해시된 JS/CSS 번들 디렉토리는 라우트가 아님
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...findRoutes(full, `${routePrefix}/${entry.name}`));
    } else if (entry.name === 'index.html') {
      routes.push(routePrefix === '' ? '/' : routePrefix);
    }
  }
  return routes;
}

const routes = findRoutes(DIST).sort();
if (routes.length === 0) {
  console.error(`✗ ${DIST}/ 에서 index.html 을 찾지 못함 — prerender 결과 확인 필요`);
  process.exit(1);
}

const isEnRoute = (r) => r === '/en' || r.startsWith('/en/');
const koRoutes = routes.filter((r) => !isEnRoute(r));
const enRouteSet = new Set(routes.filter(isEnRoute));

const today = new Date().toISOString().slice(0, 10);
const homeLoc = `${SITE}${BASE}/`;

function urlBlock(loc, koHref, enHref) {
  const lines = [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${loc === homeLoc ? '1.0' : '0.8'}</priority>`,
    `    <xhtml:link rel="alternate" hreflang="ko" href="${koHref}"/>`,
  ];
  if (enHref) lines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>`);
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${koHref}"/>`);
  lines.push('  </url>');
  return lines.join('\n');
}

const entries = [];
for (const koRoute of koRoutes) {
  const enRoute = koRoute === '/' ? '/en' : `/en${koRoute}`;
  const hasEn = enRouteSet.has(enRoute);
  const koHref = `${SITE}${BASE}${koRoute === '/' ? '/' : koRoute}`;
  const enHref = hasEn ? `${SITE}${BASE}${enRoute}` : null;

  entries.push(urlBlock(koHref, koHref, enHref));
  if (hasEn) entries.push(urlBlock(enHref, koHref, enHref));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`✓ sitemap.xml written (${entries.length} urls, ${koRoutes.length} ko routes scanned from dist/)`);
