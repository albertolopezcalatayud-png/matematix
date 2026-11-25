import { CATALOG } from '../../src/course/catalog';
const mods = import.meta.glob('../../src/course/content/*.ts', { eager: true }) as Record<string, { default: Record<string, unknown> }>;
const have = new Set<string>(); for (const m of Object.values(mods)) Object.keys(m.default).forEach((k) => have.add(k));
let total = 0; const missing: string[] = [];
for (const c of CATALOG) for (const s of c.subjects) for (const b of s.blocks) for (const l of b.lessons) { total++; if (!have.has(l.id)) missing.push(l.id); }
console.log('lessons', total, 'with content', total - missing.length, 'missing', missing.length, missing.slice(0, 20).join(' '));
