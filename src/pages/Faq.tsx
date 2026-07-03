import SEO from '../components/SEO';
import { AuthorByline, Faq as SeoFaq, type FaqItem } from '../components/seo-kit';

const faqItems: FaqItem[] = [
  {
    question: 'Is the 90-minute cycle really universal?',
    answer:
      'Studies show cycles vary from 70 to 120 minutes individually. 90 is the population average. Your own cycle may be shorter or longer — experiment by setting alarms ±15 minutes for a few weeks and observe which wake time feels best. Smart-watch trackers can approximate your personal cycle length within a few months of data.',
  },
  {
    question: 'Why does the fall-asleep buffer matter so much?',
    answer:
      'If you set an alarm 7.5 hours from lights-out but fall asleep 20 minutes later, you are actually waking at 7 hours 10 minutes — likely mid-cycle. The 14-minute buffer this tool uses approximates average healthy sleep onset, but if you typically take longer to fall asleep, manually pad the bedtime by your personal latency.',
  },
  {
    question: 'Can I shortcut sleep with timed naps?',
    answer:
      'Power naps work best at 20 minutes (light sleep only, low inertia) or 90 minutes (full cycle, refreshing). Avoid 30–60 minute naps because you enter deep sleep but wake before cycle completion — that is the classic groggy nap. Set a hard alarm and use one or the other.',
  },
  {
    question: 'How does this compare with REM-tracking phone apps?',
    answer:
      'Phone-based trackers use accelerometers and microphones to detect movement patterns. They are approximate but can improve waking quality. This calculator is complementary: set the target wake time based on cycles, then let the app fine-tune within a 30-minute smart-alarm window for the best of both methods.',
  },
  {
    question: 'Do children and teens need different cycles?',
    answer:
      'Cycle length is similar (~90 minutes), but total sleep need is higher: teens 8–10 hours (5–6 cycles), school-age children 9–12 hours (6–8 cycles), preschoolers up to 13 hours including naps. Our calculator shows up to 6 cycles; teens should aim for the upper end and parents should resist late bedtimes.',
  },
  {
    question: 'Does caffeine shift my cycle structure?',
    answer:
      'No, caffeine does not shift the 90-minute architecture, but it delays sleep onset (more buffer time needed) and reduces deep sleep percentage even if you fall asleep normally. Half-life is 5–6 hours, so a 4 PM espresso still has roughly 50% bioavailability at 10 PM. Aim for an 8-hour cutoff.',
  },
  {
    question: 'Alcohol makes me sleepy — isn\'t that fine for sleep?',
    answer:
      'Alcohol induces faster onset but cuts REM by 20–25% and causes mid-cycle waking 2–3 hours later as it metabolizes. Total sleep quality decreases even if subjective tiredness is reduced. Two drinks is the rough threshold for measurable REM suppression in most healthy adults.',
  },
  {
    question: 'How do I recover from accumulated sleep debt?',
    answer:
      'Add one full cycle (90 minutes) earlier for 2–3 weeks instead of trying to sleep in on weekends. Going to bed 1.5 hours earlier each night is easier to sustain than weekend catch-up, which shifts your circadian rhythm and creates social jet lag. Consistency beats binge recovery for cognitive metrics.',
  },
  {
    question: 'How long does jet lag disrupt cycles?',
    answer:
      'Expect roughly one day of disruption per time zone crossed. Anchor meal times and morning sunlight to the new schedule from day one to speed adaptation. Low-dose melatonin (0.3–0.5 mg, not the 5 mg over-the-counter dose) 30 minutes before the local bedtime can shave 1–2 days off the recovery for eastbound travel.',
  },
  {
    question: 'Is this tool medical advice?',
    answer:
      'No. It is educational and entertainment-focused. If you have chronic insomnia, apnea symptoms (loud snoring, daytime fatigue, witnessed pauses in breathing), narcolepsy signs, or other clinical sleep disorders, consult a qualified sleep physician or your primary care provider for evaluation.',
  },
];

export default function Faq() {
  return (
    <article className="prose prose-slate max-w-none">
      <SEO
        titleKey="meta.faq.title"
        descriptionKey="meta.faq.description"
        path="/faq"
      />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Sleep Cycle FAQ</h1>
      <p className="mt-2 text-sm text-slate-600">Ten common questions about sleep cycles, fall-asleep buffers, and recovery.</p>

      <div className="not-prose">
        <AuthorByline
          authorName="Operator (Jikwang Kim)"
          reviewerName="Cross-checked against AASM and National Sleep Foundation"
          lastUpdated="2026-05-16"
          datePublished="2026-04-19"
          organizationName="bal.pe.kr micro-SaaS"
          organizationUrl="https://bal.pe.kr/about"
          mainEntityType="Article"
          language="en"
        />
      </div>

      <div className="not-prose">
        <SeoFaq items={faqItems} heading="Frequently Asked Questions (10)" defaultOpenFirst language="en" />
      </div>
    </article>
  );
}
