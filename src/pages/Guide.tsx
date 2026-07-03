import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { AuthorByline } from '../components/seo-kit';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sleep Cycles: 90-Minute REM Method — A Complete Guide',
  inLanguage: 'en',
  author: { '@type': 'Organization', name: 'sleepcycle.bal.pe.kr' },
  publisher: { '@type': 'Organization', name: 'sleepcycle.bal.pe.kr' },
  datePublished: '2026-04-19',
  dateModified: '2026-05-16',
  mainEntityOfPage: 'https://sleepcycle.bal.pe.kr/guide',
};

export default function Guide() {
  return (
    <>
      <SEO
        titleKey="meta.guide.title"
        descriptionKey="meta.guide.description"
        path="/guide"
        jsonLd={jsonLd}
      />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Sleep Cycle Guide — Master the 90-Minute REM Method
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        The science behind the 90-minute rule and practical tips to wake up
        between cycles instead of in the middle of deep sleep.
      </p>

      <div className="not-prose mt-6">
        <AuthorByline
          authorName="Operator (Jikwang Kim)"
          reviewerName="Cross-checked against AASM and National Sleep Foundation"
          lastUpdated="2026-05-16"
          datePublished="2026-04-19"
          organizationName="bal.pe.kr micro-SaaS"
          organizationUrl="https://bal.pe.kr/about"
          mainEntityType="Article"
        />
      </div>

      <article className="prose prose-slate mt-8 max-w-none text-[15px]">
        <h2>1. The four stages of a sleep cycle</h2>
        <p>
          A complete sleep cycle moves through four distinct stages, each with
          its own neural signature, hormonal profile, and restorative purpose.
          Understanding the architecture is the first step to using this
          calculator effectively.
        </p>
        <ol>
          <li>
            <strong>N1 (light, ~5 min)</strong>: Drifting off. Heart rate
            slows, eyes roll, muscles begin to relax. Easily disrupted.
          </li>
          <li>
            <strong>N2 (~25 min)</strong>: Body temperature drops, sleep
            spindles appear on EEG. This stage gates memory consolidation and
            occupies the largest share of total sleep over a night.
          </li>
          <li>
            <strong>N3 (deep, ~40 min)</strong>: Slow-wave sleep. Physical
            restoration, growth hormone release, immune memory formation. Waking
            here causes severe sleep inertia.
          </li>
          <li>
            <strong>REM (~20 min)</strong>: Rapid eye movement. Vivid dreaming,
            emotional regulation, procedural memory consolidation. Brain
            activity nearly matches waking levels while skeletal muscles are
            paralyzed (atonia).
          </li>
        </ol>
        <p>
          Total: <strong>~90 minutes per cycle</strong>. As the night
          progresses, the ratio shifts — early cycles are deep-sleep heavy,
          while later cycles are REM heavy. That is why the last hour or two of
          sleep feels dream-rich and waking up at the end of the night feels
          softer.
        </p>

        <h2>2. Why waking between cycles matters</h2>
        <p>
          Waking during N3 (deep sleep) causes strong sleep inertia — 30+
          minutes of grogginess, slowed reaction time, and bad mood. Waking at
          the end of REM (between cycles) feels refreshing because the brain
          has already begun its arousal preparation. Research from Dijk &amp;
          Lockley (2002) and subsequent chronobiology work shows that
          inertia-driven cognitive impairment can be larger than the impairment
          from a 0.08% blood alcohol level for the first 30 minutes after a
          deep-stage wake. The 90-minute rule used by this calculator is a
          practical approximation that helps you target the gap between cycles.
        </p>

        <h2>3. The fall-asleep buffer — why 14 minutes</h2>
        <p>
          Average adults take 10–20 minutes to fall asleep (sleep onset
          latency). This tool uses <strong>14 minutes</strong> as a middle
          ground based on published norms for healthy sleepers. If you know your
          personal latency (insomnia sufferers often take 30–60 minutes; very
          tired people may fall asleep in under 5), adjust the bedtime suggestion
          accordingly. Caffeine, screen exposure, and pre-bed stress can all
          extend the buffer.
        </p>

        <h2>4. How many cycles do adults actually need?</h2>
        <ul>
          <li>
            <strong>5 cycles (7.5 h)</strong>: Ideal for most healthy adults.
            Matches the National Sleep Foundation recommendation of 7–9 hours
            for ages 18–64.
          </li>
          <li>
            <strong>6 cycles (9 h)</strong>: Teens, athletes, illness recovery,
            high-mental-load periods.
          </li>
          <li>
            <strong>4 cycles (6 h)</strong>: Bare functional minimum.
            Long-term sleep at this level builds measurable cognitive debt and
            increases cardiovascular risk.
          </li>
          <li>
            <strong>3 cycles (4.5 h)</strong>: Short-term emergencies only —
            international travel, deadline crunches, parenting newborns.
            Never sustainable.
          </li>
        </ul>

        <h2>5. Sleep hygiene — the eight habits that move the needle</h2>
        <ul>
          <li>
            Keep a <strong>consistent schedule</strong> (±30 minutes) including
            weekends. Circadian regularity beats total duration for most
            outcomes.
          </li>
          <li>
            <strong>No screens 30 minutes before bed</strong>. Blue-light
            suppression of melatonin is the most replicated finding in
            chronobiology.
          </li>
          <li>
            <strong>Bedroom temperature 16–19°C (60–67°F)</strong>. Core
            temperature must drop for sleep onset.
          </li>
          <li>
            <strong>Caffeine cutoff at 2 PM</strong> for most adults. Half-life
            is 5–6 hours; a 4 PM espresso still has 50% bioavailability at 10
            PM.
          </li>
          <li>
            <strong>Alcohol reduces REM</strong> even when it feels sedating.
            Two drinks can cut REM by 25%.
          </li>
          <li>
            <strong>10 minutes of morning sunlight</strong> within an hour of
            waking anchors the circadian rhythm and brings melatonin onset
            earlier in the evening.
          </li>
          <li>
            <strong>Eat dinner 3 hours before bed</strong>. Late heavy meals
            spike core temperature and disrupt N3.
          </li>
          <li>
            <strong>Use the bed for sleep and sex only</strong>. Conditioning
            matters: if you scroll or watch shows in bed, your brain learns to
            stay alert there.
          </li>
        </ul>

        <h2>6. Shift workers, jet lag, and edge cases</h2>
        <p>
          Shift workers and frequent travelers can still use the 90-minute
          method but must accept that circadian misalignment will compound the
          inertia. Practical tips: blackout curtains during day-shift sleep,
          melatonin (0.3–0.5 mg, not 5 mg) 30 minutes before the new bedtime
          for jet lag, and short power naps (20 or 90 minutes — never 45) to
          bridge gaps.
        </p>

        <h2>7. When to see a doctor</h2>
        <ul>
          <li>Chronic insomnia (greater than 3 months) or sleep onset above 60 minutes.</li>
          <li>
            Loud snoring + daytime fatigue → possible obstructive sleep apnea.
            A home sleep study is the standard screening test.
          </li>
          <li>
            Restless legs, sleep paralysis, hypnagogic hallucinations, frequent
            night waking, or sleep-related movement disorders.
          </li>
          <li>
            Significant mood changes (depression, anxiety) coinciding with
            sleep disruption — these often co-occur and need integrated care.
          </li>
        </ul>

        <h2>8. References &amp; further reading</h2>
        <ul>
          <li>National Sleep Foundation — Sleep Stages and Cycles.</li>
          <li>
            American Academy of Sleep Medicine (AASM) — Clinical Practice
            Guidelines on Adult Sleep Duration.
          </li>
          <li>
            Walker, M. (2017). <em>Why We Sleep</em>. Scribner — accessible
            review of the science (cite with caution; some claims are
            contested but the core mechanisms are well-supported).
          </li>
          <li>
            Dijk, D-J. &amp; Lockley, S.W. (2002). Functional Genomics of
            Sleep and Circadian Rhythm. J Appl Physiol.
          </li>
        </ul>

        <p className="text-sm text-slate-500">
          This guide is for educational and entertainment purposes only and is
          not a substitute for medical evaluation. If sleep problems
          significantly impact your daily life, consult a qualified sleep
          physician.
        </p>
      </article>

      <p className="mt-8 text-sm text-slate-500">
        <Link to="/" className="underline">Back to calculator</Link>.
      </p>
    </>
  );
}
