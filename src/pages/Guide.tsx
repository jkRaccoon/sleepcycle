import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sleep Cycles: 90-Minute REM Method',
  inLanguage: 'en',
  author: { '@type': 'Organization', name: 'sleepcycle.bal.pe.kr' },
  publisher: { '@type': 'Organization', name: 'sleepcycle.bal.pe.kr' },
  mainEntityOfPage: 'https://sleepcycle.bal.pe.kr/guide',
};

export default function Guide() {
  return (
    <>
      <SEO
        title="Sleep Cycle Guide — 90-Minute Rule & Sleep Hygiene"
        description="Understand 90-minute sleep cycles (light → deep → REM), why waking between cycles matters, and evidence-backed sleep hygiene tips."
        path="/guide"
        jsonLd={jsonLd}
      />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Sleep Cycle Guide</h1>
      <p className="mt-2 text-sm text-slate-600">Science behind the 90-minute rule and practical tips.</p>

      <article className="prose prose-slate mt-8 max-w-none text-[15px]">
        <h2>1. Stages of a sleep cycle</h2>
        <ol>
          <li><strong>N1 (light)</strong>: ~5 min. Drifting off.</li>
          <li><strong>N2</strong>: ~25 min. Body temperature drops.</li>
          <li><strong>N3 (deep)</strong>: ~40 min. Physical restoration, growth hormone release.</li>
          <li><strong>REM</strong>: ~20 min. Dreaming, memory consolidation.</li>
        </ol>
        <p>Total: ~90 minutes per cycle. As the night progresses, deep sleep shortens and REM lengthens.</p>

        <h2>2. Why waking between cycles matters</h2>
        <p>Waking during N3 (deep sleep) causes strong sleep inertia — 30+ minutes of grogginess. Waking at the end of REM (between cycles) feels refreshing.</p>

        <h2>3. Fall-asleep buffer</h2>
        <p>Average adults take 10–20 minutes to fall asleep. This tool uses <strong>14 minutes</strong> as a middle ground.</p>

        <h2>4. How many cycles do adults need?</h2>
        <ul>
          <li><strong>5 cycles (7.5h)</strong>: ideal for most adults.</li>
          <li><strong>6 cycles (9h)</strong>: teens, athletes, recovery periods.</li>
          <li><strong>4 cycles (6h)</strong>: bare minimum; long-term 6h leads to debt.</li>
          <li><strong>3 cycles (4.5h)</strong>: short-term only (travel, deadlines).</li>
        </ul>

        <h2>5. Sleep hygiene tips</h2>
        <ul>
          <li>Keep a consistent schedule (±30 min) including weekends.</li>
          <li>No screens 30 min before bed — blue light suppresses melatonin.</li>
          <li>Bedroom temperature 16–19°C (60–67°F).</li>
          <li>Caffeine cutoff: 2 PM for most adults.</li>
          <li>Alcohol reduces REM even if you "feel asleep".</li>
          <li>10-minute morning sunlight anchors circadian rhythm.</li>
        </ul>

        <h2>6. When to see a doctor</h2>
        <ul>
          <li>Chronic insomnia (&gt; 3 months).</li>
          <li>Loud snoring + daytime fatigue → possible sleep apnea.</li>
          <li>Restless legs, sleep paralysis, frequent night waking.</li>
        </ul>

        <h2>7. References</h2>
        <ul>
          <li>National Sleep Foundation — Sleep Stages.</li>
          <li>AASM — Clinical Guidelines on Adult Sleep Duration.</li>
        </ul>
      </article>

      <p className="mt-8 text-sm text-slate-500">
        <Link to="/" className="underline">Back to calculator</Link>.
      </p>
    </>
  );
}
