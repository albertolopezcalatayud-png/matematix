/** A text written as "a|b|c" shown as a list. */
export function Bullets({ text }: { text: string }) {
  return <ul className="space-y-1.5 text-base list-none">{text.split('|').map((x, i) => <li key={i} className="flex gap-2"><span aria-hidden className="text-[var(--color-accent)]">•</span><span>{x}</span></li>)}</ul>;
}
