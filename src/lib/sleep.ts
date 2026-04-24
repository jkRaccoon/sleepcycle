export const CYCLE_MINUTES = 90;
export const FALL_ASLEEP_DEFAULT = 14;
export const CAFFEINE_HALF_LIFE_H = 5; // hours

export interface TimeOption {
  cycles: number;
  time: Date;
  totalHours: number;
  quality: 'best' | 'good' | 'short';
  score: number; // 0-100
}

function addMin(d: Date, min: number): Date {
  const n = new Date(d);
  n.setMinutes(n.getMinutes() + min);
  return n;
}

export function sleepToWake(bedtime: Date, fallAsleepMin = FALL_ASLEEP_DEFAULT): TimeOption[] {
  const asleep = addMin(bedtime, fallAsleepMin);
  const options: TimeOption[] = [];
  for (let c = 3; c <= 6; c++) {
    const wake = addMin(asleep, c * CYCLE_MINUTES);
    const totalHours = Math.round(((c * CYCLE_MINUTES) / 60) * 10) / 10;
    options.push({
      cycles: c,
      time: wake,
      totalHours,
      quality: c >= 5 ? 'best' : c >= 4 ? 'good' : 'short',
      score: calcScore(c, totalHours),
    });
  }
  return options;
}

export function wakeToBed(wake: Date, fallAsleepMin = FALL_ASLEEP_DEFAULT): TimeOption[] {
  const options: TimeOption[] = [];
  for (let c = 3; c <= 6; c++) {
    const asleep = addMin(wake, -c * CYCLE_MINUTES);
    const bedtime = addMin(asleep, -fallAsleepMin);
    const totalHours = Math.round(((c * CYCLE_MINUTES) / 60) * 10) / 10;
    options.push({
      cycles: c,
      time: bedtime,
      totalHours,
      quality: c >= 5 ? 'best' : c >= 4 ? 'good' : 'short',
      score: calcScore(c, totalHours),
    });
  }
  return options.reverse();
}

/** 0-100 sleep quality score based on cycles & alignment */
function calcScore(cycles: number, _totalHours: number): number {
  // 5 cycles = 100, 6 = 95, 4 = 70, 3 = 45
  const map: Record<number, number> = { 3: 45, 4: 70, 5: 100, 6: 95 };
  return map[cycles] ?? 70;
}

export function fmtTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function fmtTime24(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function parseTime(s: string): Date | null {
  if (!s) return null;
  const [hh, mm] = s.split(':').map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
}

/** Returns the latest safe caffeine intake time given a bedtime */
export function caffeineCutoff(bedtime: Date, safeHalfLives = 4): Date {
  // After N half-lives, only (1/2)^N caffeine remains ≈ negligible at 4 half-lives
  const cutoffMin = safeHalfLives * CAFFEINE_HALF_LIFE_H * 60;
  return addMin(bedtime, -cutoffMin);
}

/** Nap recommendations */
export interface NapOption {
  durationMin: number;
  label: string;
  descKey: string;
}

export const NAP_OPTIONS: NapOption[] = [
  { durationMin: 20, label: '20 min', descKey: 'nap.power' },
  { durationMin: 90, label: '90 min', descKey: 'nap.full' },
];
