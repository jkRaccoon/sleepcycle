#!/usr/bin/env node
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

const ensureDir = (p) => mkdirSync(dirname(p), { recursive: true });

const OG_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e1b4b"/>
      <stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#c7d2fe"/>
      <stop offset="1" stop-color="#fde68a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="translate(80, 90)">
    <rect x="0" y="0" width="90" height="90" rx="18" fill="url(#accent)"/>
    <path d="M30 35 Q35 45 30 55 Q60 55 60 32 Q50 38 30 35 Z" fill="#1e1b4b"/>
  </g>
  <text x="80" y="270" font-family="Inter, -apple-system, sans-serif" font-size="80" font-weight="900" fill="#ffffff" letter-spacing="-2">Sleep Cycle</text>
  <text x="80" y="355" font-family="Inter, -apple-system, sans-serif" font-size="60" font-weight="900" fill="url(#accent)" letter-spacing="-2">Best Bedtime Calculator</text>
  <text x="80" y="435" font-family="Inter, -apple-system, sans-serif" font-size="26" font-weight="500" fill="#c7d2fe">90-min REM cycles · 14-min fall-asleep buffer</text>
  <text x="80" y="480" font-family="Inter, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#a5b4fc">Wake between cycles, never mid-cycle</text>
  <text x="1120" y="580" text-anchor="end" font-family="Inter, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#c7d2fe">sleepcycle.bal.pe.kr</text>
</svg>`;

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <path d="M20 24 Q26 32 20 40 Q42 40 42 22 Q34 28 20 24 Z" fill="white"/>
</svg>`;

ensureDir('public/og.png');
writeFileSync('public/favicon.svg', FAVICON_SVG);
console.log('✓ public/favicon.svg');
await sharp(Buffer.from(OG_SVG)).png().toFile('public/og.png');
console.log('✓ public/og.png');
await sharp(Buffer.from(FAVICON_SVG)).resize(512, 512).png().toFile('public/favicon.png');
console.log('✓ public/favicon.png');
