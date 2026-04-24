import SEO from '../components/SEO';

const QAS = [
  { q: 'Is 90 minutes really universal?', a: 'Studies show cycles vary from 70 to 120 minutes individually. 90 is the population average. Your own cycle may be shorter or longer — experiment by setting alarms ±15 minutes and observe which feels best.' },
  { q: 'Does the "fall-asleep buffer" matter?', a: 'Yes. If you set an alarm 7.5h from lights-out but fall asleep 20 minutes later, you are waking at 7h 10min, likely mid-cycle. The 14-minute buffer approximates average sleep onset.' },
  { q: 'Can I shortcut by napping with cycles?', a: 'Power naps work best at 20 minutes (light sleep only) or 90 minutes (full cycle). Avoid 30–60 minute naps — you enter deep sleep but wake before cycle completion.' },
  { q: 'What about REM-focused alarms (e.g. Sleep Cycle app)?', a: 'Phone-based trackers use accelerometers/mics to detect movement patterns. They are approximate but can improve waking quality. This calculator is complementary: set the target time based on cycles, then let the app fine-tune within a 30-min window.' },
  { q: 'Do children and teens need different cycles?', a: 'Cycle length is similar, but total sleep need is higher: teens 8–10h (5–6 cycles), children 9–12h (6–8 cycles). Our calculator shows up to 6 cycles; teens should aim for the upper end.' },
  { q: 'Does caffeine shift my cycle?', a: 'No, but it delays sleep onset (more buffer time) and reduces deep sleep percentage. Stop caffeine 8 hours before bed.' },
  { q: 'Alcohol makes me sleepy — is that OK?', a: 'Alcohol induces faster onset but cuts REM and causes mid-cycle waking 2–3 hours later. Total sleep quality decreases even if subjective tiredness is reduced.' },
  { q: 'How do I fix sleep debt?', a: 'Add 1 cycle (90 min) earlier for 2–3 weeks. Going to bed 1.5h earlier is easier to sustain than sleeping in on weekends, which shifts your rhythm.' },
  { q: 'Does jet lag disrupt cycles?', a: 'Yes. Expect 1 day per time zone to re-sync. Anchor meal times and morning sunlight on the new schedule to speed adaptation.' },
  { q: 'Is this tool medical advice?', a: 'No. It is informational. If you have chronic insomnia, apnea symptoms, or other sleep disorders, consult a healthcare provider.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: QAS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function Faq() {
  return (
    <>
      <SEO
        titleKey="meta.faq.title"
        descriptionKey="meta.faq.description"
        path="/faq"
        jsonLd={jsonLd}
      />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">FAQ</h1>
      <p className="mt-2 text-sm text-slate-600">10 common questions about sleep cycles.</p>

      <dl className="mt-8 space-y-6">
        {QAS.map(({ q, a }, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <dt className="text-sm font-semibold text-slate-900">Q{i + 1}. {q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-700">{a}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
