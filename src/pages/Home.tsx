import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { track } from '../lib/track';
import { fmtTime, fmtTime24, parseTime, sleepToWake, wakeToBed, type TimeOption } from '../lib/sleep';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sleep Cycle Calculator',
  url: 'https://sleepcycle.bal.pe.kr/',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'All',
  inLanguage: 'en',
  description:
    'Calculate the best bedtime or wake time using 90-minute REM sleep cycles with 14 minutes of fall-asleep buffer.',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
};

type Mode = 'sleep-now' | 'wake-at' | 'bed-at';

export default function Home() {
  const [mode, setMode] = useState<Mode>('sleep-now');
  const [customTime, setCustomTime] = useState<string>('07:00');

  const options = useMemo<TimeOption[]>(() => {
    if (mode === 'sleep-now') {
      return sleepToWake(new Date());
    }
    const t = parseTime(customTime);
    if (!t) return [];
    return mode === 'wake-at' ? wakeToBed(t) : sleepToWake(t);
  }, [mode, customTime]);

  useMemo(() => track('sleep_calc', { mode }), [mode]);

  const headline =
    mode === 'sleep-now'
      ? 'If you go to sleep now, wake up at:'
      : mode === 'wake-at'
        ? `To wake at ${customTime}, go to bed at:`
        : `If you go to bed at ${customTime}, wake up at:`;

  return (
    <>
      <SEO
        title="Sleep Cycle Calculator — Best Bedtime & Wake-up Time"
        description="Use 90-minute REM cycles to find the perfect bedtime or wake-up time. Includes 14-minute fall-asleep buffer for realistic timing."
        path="/"
        jsonLd={jsonLd}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Sleep Cycle Calculator</h1>
        <p className="mt-2 text-sm text-slate-600">
          Wake up between cycles, not in the middle of one. <span className="font-medium text-indigo-700">90 minutes per cycle + 14-minute fall-asleep buffer</span>.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {([
          { v: 'sleep-now', label: 'Sleep Now' },
          { v: 'wake-at', label: 'Wake At...' },
          { v: 'bed-at', label: 'Go to Bed At...' },
        ] as const).map((opt) => (
          <button
            key={opt.v}
            onClick={() => setMode(opt.v)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
              mode === opt.v ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {mode !== 'sleep-now' && (
        <label className="mb-6 block">
          <span className="text-sm font-medium text-slate-800">Target time</span>
          <input
            type="time"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none"
          />
        </label>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{headline}</p>
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
              <p className="text-3xl font-black text-slate-900">{fmtTime(o.time)}</p>
              <p className="mt-1 text-xs text-slate-600">{fmtTime24(o.time)} (24h)</p>
              <p className="mt-2 text-sm text-slate-700">
                <strong>{o.cycles} cycles</strong> · {o.totalHours}h sleep
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                {o.quality === 'best' ? '✨ Ideal for adults' : o.quality === 'good' ? '✅ Sufficient' : '⚠️ Short, for naps only'}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Why 90 minutes?</h2>
        <p className="mt-2 text-sm text-slate-700">
          Your brain cycles through light sleep, deep sleep, and REM in approximately 90-minute intervals. Waking up between cycles feels natural, whereas waking mid-cycle causes grogginess (sleep inertia).
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          <li>• <strong>5 cycles (7.5h)</strong> — recommended for most adults.</li>
          <li>• <strong>6 cycles (9h)</strong> — ideal if recovering from sleep debt.</li>
          <li>• <strong>4 cycles (6h)</strong> — minimum for cognitive function.</li>
          <li>• <strong>3 cycles (4.5h)</strong> — power sleep; avoid if possible.</li>
        </ul>
      </section>

      <section className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>
          Read the <Link to="/guide" className="underline">Guide</Link> for optimal sleep tips, <Link to="/faq" className="underline">FAQ</Link>.
        </p>
      </section>
    </>
  );
}
