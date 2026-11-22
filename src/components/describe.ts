import type { Visual } from '@/engine/types';
type T = (k: string, v?: Record<string, string | number>) => string;
export function describe(t: T, v: Visual): string {
  if (v.type === 'line') return t(v.point != null ? 'd_line_point' : 'd_line', { a: v.min, b: v.max });
  if (v.type === 'dots') return t('d_dots', { g: v.groups.join(', ') });
  if (v.type === 'frame') return t('d_frame', { n: v.filled });
  return t('d_tens', { t: v.tens, o: v.ones });
}
