import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { track } from '../lib/track';
import {
  caffeineCutoff,
  FALL_ASLEEP_DEFAULT,
  fmtTime,
  fmtTime24,
  parseTime,
  sleepToWake,
  wakeToBed,
  type TimeOption,
} from '../lib/sleep';

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to calculate the best bedtime using sleep cycles',
  description:
    'Use 90-minute REM sleep cycles and a 14-minute fall-asleep buffer to find the optimal bedtime or wake-up time.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose a mode',
      text: 'Select "Sleep Now", "Wake At…", or "Go to Bed At…" depending on what you know.',
    },
    {
      '@type': 'HowToStep',
      name: 'Enter your target time',
      text: 'Type the time you need to wake up, or the time you plan to go to bed.',
    },
    {
      '@type': 'HowToStep',
      name: 'Review the options',
      text: 'The calculator shows 3–6 sleep cycles (4.5h–9h). Pick the option with the highest quality score.',
    },
    {
      '@type': 'HowToStep',
      name: 'Set your alarm',
      text: 'Tap the copy button to copy the time, then set your alarm accordingly.',
    },
  ],
  tool: [{ '@type': 'HowToTool', name: 'Sleep Cycle Calculator' }],
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sleep Cycle Calculator',
  url: 'https://sleepcycle.bal.pe.kr/',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'All',
  inLanguage: ['ko', 'en'],
  description:
    'Calculate the best bedtime or wake time using 90-minute REM sleep cycles with a customisable fall-asleep buffer.',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
};

const combinedJsonLd = [howToJsonLd, webAppJsonLd];

type Mode = 'sleep-now' | 'wake-at' | 'bed-at';

const SCORE_COLOR: Record<number, string> = {
  100: 'text-indigo-700',
  95: 'text-emerald-600',
  70: 'text-amber-600',
  45: 'text-red-500',
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 95
              ? 'bg-indigo-500'
              : score >= 70
                ? 'bg-emerald-500'
                : score >= 50
                  ? 'bg-amber-400'
                  : 'bg-red-400'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-[11px] font-bold tabular-nums ${SCORE_COLOR[score] ?? 'text-slate-600'}`}>
        {score}
      </span>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      className="ml-2 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold transition hover:bg-slate-100 active:scale-95"
    >
      {copied ? (
        <span className="text-emerald-600">Copied!</span>
      ) : (
        <span className="text-slate-500">Copy</span>
      )}
    </button>
  );
}

export default function Home() {
  useTranslation(); // keep i18n context active for SEO component
  const location = useLocation();
  const navigate = useNavigate();

  // Restore state from URL params
  const searchParams = new URLSearchParams(location.search);
  const initMode = (searchParams.get('mode') as Mode) ?? 'sleep-now';
  const initTime = searchParams.get('time') ?? '07:00';
  const initFall = Number(searchParams.get('fall') ?? FALL_ASLEEP_DEFAULT);

  const [mode, setMode] = useState<Mode>(initMode);
  const [customTime, setCustomTime] = useState<string>(initTime);
  const [fallAsleepMin, setFallAsleepMin] = useState<number>(
    Number.isFinite(initFall) && initFall >= 5 && initFall <= 30 ? initFall : FALL_ASLEEP_DEFAULT,
  );
  const [shareMsg, setShareMsg] = useState('');
  const shareMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep URL in sync so it's shareable
  useEffect(() => {
    const p = new URLSearchParams();
    if (mode !== 'sleep-now') p.set('mode', mode);
    if (mode !== 'sleep-now') p.set('time', customTime);
    if (fallAsleepMin !== FALL_ASLEEP_DEFAULT) p.set('fall', String(fallAsleepMin));
    const qs = p.toString();
    const newSearch = qs ? `?${qs}` : '';
    if (location.search !== newSearch) {
      navigate({ search: newSearch }, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, customTime, fallAsleepMin]);

  const options = useMemo<TimeOption[]>(() => {
    if (mode === 'sleep-now') {
      return sleepToWake(new Date(), fallAsleepMin);
    }
    const t = parseTime(customTime);
    if (!t) return [];
    return mode === 'wake-at' ? wakeToBed(t, fallAsleepMin) : sleepToWake(t, fallAsleepMin);
  }, [mode, customTime, fallAsleepMin]);

  // Caffeine cutoff — only meaningful when we know bedtime
  const caffeineTime = useMemo<Date | null>(() => {
    if (mode === 'wake-at') {
      // best option bedtime (5 cycles)
      const best = options.find((o) => o.cycles === 5);
      if (best) return caffeineCutoff(best.time);
    }
    if (mode === 'bed-at') {
      const t = parseTime(customTime);
      if (t) return caffeineCutoff(t);
    }
    if (mode === 'sleep-now') {
      return caffeineCutoff(new Date());
    }
    return null;
  }, [mode, customTime, options]);

  useMemo(() => track('sleep_calc', { mode }), [mode]);

  const isKo = !location.pathname.startsWith('/en');

  const modeLabels: Record<Mode, string> = {
    'sleep-now': isKo ? '지금 바로 잔다면' : 'Sleep Now',
    'wake-at': isKo ? '기상 시간 기준' : 'Wake At…',
    'bed-at': isKo ? '취침 시간 기준' : 'Go to Bed At…',
  };

  const headline =
    mode === 'sleep-now'
      ? isKo
        ? '지금 자면 최적 기상 시간:'
        : 'If you sleep now, wake up at:'
      : mode === 'wake-at'
        ? isKo
          ? `${customTime} 기상 기준, 취침 시간:`
          : `To wake at ${customTime}, go to bed at:`
        : isKo
          ? `${customTime} 취침 기준, 기상 시간:`
          : `If you go to bed at ${customTime}, wake up at:`;

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      void navigator.share({ title: document.title, url });
    } else {
      void navigator.clipboard.writeText(url).then(() => {
        setShareMsg(isKo ? 'URL 복사됨!' : 'URL copied!');
        if (shareMsgTimerRef.current) clearTimeout(shareMsgTimerRef.current);
        shareMsgTimerRef.current = setTimeout(() => setShareMsg(''), 2000);
      });
    }
    track('share_url', { mode });
  }, [isKo, mode]);

  return (
    <>
      <SEO
        titleKey="meta.home.title"
        descriptionKey="meta.home.description"
        path="/"
        jsonLd={combinedJsonLd}
      />

      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {isKo ? '수면주기 역산 계산기' : 'Sleep Cycle Calculator'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isKo
            ? '주기 중간이 아닌 주기 끝에 일어나세요.'
            : 'Wake up between cycles, not in the middle of one.'}{' '}
          <span className="font-medium text-indigo-700">
            90 {isKo ? '분 사이클 + 잠드는 시간 버퍼' : 'min cycle + fall-asleep buffer'}.
          </span>
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['sleep-now', 'wake-at', 'bed-at'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMode(v)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
              mode === v
                ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {modeLabels[v]}
          </button>
        ))}
      </div>

      {/* Time input */}
      {mode !== 'sleep-now' && (
        <label className="mb-4 block">
          <span className="text-sm font-medium text-slate-800">
            {isKo ? '목표 시간' : 'Target time'}
          </span>
          <input
            type="time"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="mt-1 block rounded-md border border-slate-300 bg-white px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none"
          />
        </label>
      )}

      {/* Fall-asleep slider */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-800">
            {isKo ? '잠드는 데 걸리는 시간' : 'Fall-asleep time'}
          </label>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-bold text-indigo-700">
            {fallAsleepMin}{isKo ? '분' : ' min'}
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={fallAsleepMin}
          onChange={(e) => setFallAsleepMin(Number(e.target.value))}
          className="mt-2 w-full accent-indigo-600"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400">
          <span>5{isKo ? '분' : 'min'}</span>
          <span className="text-slate-500">
            {isKo
              ? '평균 14분 · 불면증은 늘려서 조절'
              : 'avg 14 min · raise if slow sleeper'}
          </span>
          <span>30{isKo ? '분' : 'min'}</span>
        </div>
      </div>

      {/* Results */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{headline}</p>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {shareMsg || (isKo ? '공유' : 'Share')}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {options.map((o) => (
            <article
              key={o.cycles}
              className={`rounded-xl border-2 p-4 ${
                o.quality === 'best'
                  ? 'border-indigo-400 bg-indigo-50'
                  : o.quality === 'good'
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-amber-300 bg-amber-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-black text-slate-900">{fmtTime(o.time)}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{fmtTime24(o.time)} (24h)</p>
                </div>
                <CopyButton text={fmtTime24(o.time)} label={fmtTime(o.time)} />
              </div>
              <p className="mt-2 text-sm text-slate-700">
                <strong>{o.cycles} {isKo ? '사이클' : 'cycles'}</strong> · {o.totalHours}h
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                {o.quality === 'best'
                  ? isKo ? '✨ 성인 최적' : '✨ Ideal for adults'
                  : o.quality === 'good'
                    ? isKo ? '✅ 충분' : '✅ Sufficient'
                    : isKo ? '⚠️ 짧음 — 낮잠용' : '⚠️ Short — naps only'}
              </p>
              <ScoreBar score={o.score} />
            </article>
          ))}
        </div>
      </section>

      {/* Caffeine cutoff */}
      {caffeineTime && (
        <section className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <span className="text-xl">☕</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {isKo ? '카페인 컷오프 시간' : 'Caffeine cut-off time'}
            </p>
            <p className="text-2xl font-black text-amber-900">{fmtTime(caffeineTime)}</p>
            <p className="mt-0.5 text-xs text-amber-700">
              {isKo
                ? `이 시간 이후 커피·차·에너지음료를 피하세요 (반감기 5h × 4 = 20h 제거)`
                : 'Avoid coffee, tea, energy drinks after this time (5h half-life × 4 = 20h clearance)'}
            </p>
          </div>
        </section>
      )}

      {/* Nap recommendations */}
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">
          {isKo ? '낮잠 추천' : 'Nap Recommendations'}
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-lg font-black text-sky-700">20 {isKo ? '분' : 'min'}</p>
            <p className="text-xs font-semibold text-sky-800">{isKo ? '파워낮잠' : 'Power nap'}</p>
            <p className="mt-1 text-[11px] text-sky-700">
              {isKo
                ? 'N1·N2 얕은 수면만 → 깊은 잠 없이 개운하게 기상'
                : 'N1+N2 light sleep only → wake up refreshed, no inertia'}
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
            <p className="text-lg font-black text-violet-700">90 {isKo ? '분' : 'min'}</p>
            <p className="text-xs font-semibold text-violet-800">{isKo ? '풀 사이클 낮잠' : 'Full cycle nap'}</p>
            <p className="mt-1 text-[11px] text-violet-700">
              {isKo
                ? '1회 전체 주기 완결 → 기억 통합·창의력 향상'
                : '1 complete cycle → memory consolidation, creativity boost'}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {isKo
            ? '30–60분 낮잠은 피하세요 — 깊은 잠에 들어가지만 주기를 완결 못 해 기상 후 더 피로할 수 있습니다.'
            : 'Avoid 30–60 min naps — you enter deep sleep but wake before cycle completion, causing grogginess.'}
        </p>
      </section>

      {/* Why 90 min */}
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          {isKo ? '왜 90분인가요?' : 'Why 90 minutes?'}
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          {isKo
            ? '뇌는 얕은 잠 → 깊은 잠 → REM을 약 90분 주기로 반복합니다. 주기 사이에 일어나면 개운하지만, 주기 중간(특히 깊은 잠)에 깨면 수면관성(grogginess)이 심합니다.'
            : 'Your brain cycles through light sleep, deep sleep, and REM in ~90-min intervals. Waking between cycles feels natural; waking mid-cycle causes grogginess.'}
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          <li>• <strong>5 {isKo ? '사이클 (7.5h)' : 'cycles (7.5h)'}</strong> — {isKo ? '성인 권장.' : 'recommended for adults.'}</li>
          <li>• <strong>6 {isKo ? '사이클 (9h)' : 'cycles (9h)'}</strong> — {isKo ? '수면 부채 회복용.' : 'ideal for recovering from sleep debt.'}</li>
          <li>• <strong>4 {isKo ? '사이클 (6h)' : 'cycles (6h)'}</strong> — {isKo ? '인지 기능 최소 기준.' : 'minimum for cognitive function.'}</li>
          <li>• <strong>3 {isKo ? '사이클 (4.5h)' : 'cycles (4.5h)'}</strong> — {isKo ? '파워수면; 가급적 피하세요.' : 'power sleep; avoid if possible.'}</li>
        </ul>
      </section>

      <section className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>
          {isKo ? '더 자세한 내용:' : 'Read the'}{' '}
          <Link to={location.pathname.startsWith('/en') ? '/en/guide' : '/guide'} className="underline">
            {isKo ? '가이드' : 'Guide'}
          </Link>{', '}
          <Link to={location.pathname.startsWith('/en') ? '/en/faq' : '/faq'} className="underline">FAQ</Link>.
        </p>
      </section>
    </>
  );
}
