export const CYCLE_MINUTES = 90;
export const FALL_ASLEEP_MIN = 14;

export interface TimeOption {
  cycles: number;
  time: Date;
  totalHours: number;
  quality: 'best' | 'good' | 'short';
}

function addMin(d: Date, min: number): Date {
  const n = new Date(d);
  n.setMinutes(n.getMinutes() + min);
  return n;
}

export function sleepToWake(bedtime: Date): TimeOption[] {
  const asleep = addMin(bedtime, FALL_ASLEEP_MIN);
  const options: TimeOption[] = [];
  for (let c = 3; c <= 6; c++) {
    const wake = addMin(asleep, c * CYCLE_MINUTES);
    options.push({
      cycles: c,
      time: wake,
      totalHours: Math.round(((c * CYCLE_MINUTES) / 60) * 10) / 10,
      quality: c >= 5 ? 'best' : c >= 4 ? 'good' : 'short',
    });
  }
  return options;
}

export function wakeToBed(wake: Date): TimeOption[] {
  const options: TimeOption[] = [];
  for (let c = 3; c <= 6; c++) {
    const asleep = addMin(wake, -c * CYCLE_MINUTES);
    const bedtime = addMin(asleep, -FALL_ASLEEP_MIN);
    options.push({
      cycles: c,
      time: bedtime,
      totalHours: Math.round(((c * CYCLE_MINUTES) / 60) * 10) / 10,
      quality: c >= 5 ? 'best' : c >= 4 ? 'good' : 'short',
    });
  }
  return options.reverse();
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
