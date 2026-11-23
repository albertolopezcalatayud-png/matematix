import { useT } from '@/i18n';
import { ISLANDS, STATIONS } from '@/data/stations';

/** All 30 stations grouped by island. */
export function StationSelect({ value, onChange, label, testId }: { value: string; onChange: (id: string) => void; label: string; testId?: string }) {
  const { t, m } = useT();
  return (
    <label className="block"><span className="text-sm">{label}</span>
      <select className="mt-1 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 min-h-12" value={value} onChange={(e) => onChange(e.target.value)} data-testid={testId}>
        {ISLANDS.map((i) => (
          <optgroup key={i.id} label={`${i.emoji} ${t(i.title)}`}>
            {STATIONS.filter((s) => s.island === i.id).map((s) => <option key={s.id} value={s.id}>{s.id} · {m(s.title)}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
