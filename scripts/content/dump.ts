// Prints a few exercises of a content pack in the three languages, to read them over: npx vite-node scripts/content/dump.ts 3P-M [n]
import { rng } from '../../src/engine/rng';
import { showAns } from '../../src/course';
const [file, n = '2'] = process.argv.slice(2);
const pack = (await import(`../../src/course/content/${file}.ts`)).default;
for (const [id, les] of Object.entries<any>(pack)) {
  console.log(`\n## ${id}`);
  for (let i = 0; i < Number(n); i++) {
    const q = les.make ? les.make(rng(i * 977 + 13)) : les.bank[i % les.bank.length];
    for (const [li, lang] of [[0, 'es'], [1, 'ca'], [2, 'en']] as const) console.log(`  ${lang}: ${q.q[li]}  → ${showAns(lang, q.a)}   ✗ ${q.wrong.map((w: any) => showAns(lang, w)).join(' | ')}   💡 ${q.hint[li]}`);
  }
}
