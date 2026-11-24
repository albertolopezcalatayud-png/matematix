import type { Visual } from '@/engine/types';
type T = (k: string, v?: Record<string, string | number>) => string;
export function describe(t: T, v: Visual): string {
  if (v.type === 'line') return t(v.point != null ? 'd_line_point' : 'd_line', { a: v.min, b: v.max });
  if (v.type === 'dots') return t('d_dots', { g: v.groups.join(', ') });
  if (v.type === 'frame') return t('d_frame', { n: v.filled });
  if (v.type === 'bars') return t('d_bars', { r: v.rows.length });
  if (v.type === 'ladder') return t('d_ladder', { a: v.units[v.from], b: v.units[v.to] });
  if (v.type === 'chart') return t(v.kind === 'bar' ? 'd_chart_bar' : 'd_chart_line', { n: v.x.length });
  if (v.type === 'table') return t('d_table', { r: v.rows.length, c: v.head.length });
  if (v.type === 'balance') return t('d_balance', { a: v.left, b: v.right });
  return t('d_tens', { t: v.tens, o: v.ones });
}
