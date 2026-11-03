#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const DIST = 'dist';
// 병렬 빌드 포트 충돌 회피. pid 로 고른 포트가 이미 쓰이면(예: macOS AirPlay 5000) vite 가 다른 포트로 피하는데
// puppeteer 는 원래 포트를 긁어 남의 응답이 dist 에 굳는다(2026-11-03 tdee) — strictPort 로 실패시킨다.
const PORT = Number(process.env.PRERENDER_PORT) || 4173 + Math.floor((process.pid % 1000));
const SUBDIR = process.env.BUILD_TARGET === 'subdir';
const BASE = SUBDIR ? '/tools/sleepcycle/' : '/';
const BASE_ROUTES = ['/', '/guide', '/faq'];
const LANGS = ['ko', 'en'];

function langRoute(lang, base) {
  if (lang === 'ko') return base;
  return base === '/' ? '/en' : `/en${base}`;
}

const ROUTES = LANGS.flatMap((lang) => BASE_ROUTES.map((r) => langRoute(lang, r)));

async function startServer() {
  return preview({ preview: { port: PORT, strictPort: true }, base: BASE });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);
  // AdSense/광고·analytics 요청 차단 — prerender 시 동적 주입을 dist HTML에 굳히지 않음
  // show_ads_impl.js?bust=... 등 stale URL 404 + 페이지 로딩 지연 방지
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('googlesyndication.com') || u.includes('googleads.g.doubleclick.net') || u.includes('google-analytics.com') || u.includes('googletagmanager.com') || u.includes('doubleclick.net') || u.includes('ads-partners.coupang.com') || u.includes('coupang.com/g.js')) {
      req.abort();
    } else {
      req.continue();
    }
  });
  const routePath = route === '/' ? BASE : `${BASE}${route.slice(1)}`;
  await page.goto(`http://localhost:${PORT}${routePath}`, { waitUntil: 'networkidle0' });
  try { await page.waitForSelector('h1', { timeout: 5000 }); } catch { console.warn(`! ${route}: h1 not found`); }
    await page.evaluate(() => {
    const keepLast = (sel) => {
      const n = document.querySelectorAll(sel);
      for (let i = 0; i < n.length - 1; i++) n[i].remove();
    };
    const keepFirst = (sel) => {
      const n = document.querySelectorAll(sel);
      for (let i = 1; i < n.length; i++) n[i].remove();
    };
    keepFirst('title');
    keepLast('meta[name="description"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('link[rel="canonical"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[property="og:url"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[property="og:title"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[property="og:description"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[property="og:image"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[property="og:locale"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[property="og:site_name"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[name="twitter:title"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[name="twitter:description"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
    keepLast('meta[name="twitter:image"]');
  keepLast('meta[name="robots"]');
  keepLast('meta[property="og:image:alt"]');
  keepLast('meta[name="twitter:image:alt"]');
      // AdSense prerender 잔재 정리 — 차단 누락 시에도 안전
    document.querySelectorAll('script[src*="show_ads_impl"], script[src*="googlesyndication.com/pagead/managed"]').forEach((n) => n.remove());
    document.querySelectorAll('ins.adsbygoogle[data-adsbygoogle-status]').forEach((n) => {
      n.removeAttribute('data-adsbygoogle-status');
      n.removeAttribute('data-ad-status');
      n.removeAttribute('data-ad-hi');
      n.removeAttribute('style');
      n.innerHTML = '';
    });
    document.querySelectorAll('iframe[id^="aswift_"], iframe#google_esf, iframe[src*="recaptcha/api2/aframe"]').forEach((n) => n.remove());
    document.querySelectorAll('script[src*="ads-partners.coupang.com"], script[src*="coupang.com/g.js"]').forEach((n) => n.remove());
    document.querySelectorAll('aside[aria-label="advertisement"] iframe, iframe[src*="coupang.com"]').forEach((n) => n.remove());
  });
  const html = await page.content();
  await page.close();
  return html;
}

async function main() {
  const server = await startServer();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    for (const route of ROUTES) {
      process.stdout.write(`  prerendering ${route} ... `);
      const html = await prerenderRoute(browser, route);
      const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html);
      console.log('✓');
    }
  } finally {
    await browser.close();
    server.httpServer.close();
  }
  console.log('✓ prerender done');
}

main().catch((e) => { console.error(e); process.exit(1); });
