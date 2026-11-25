import { describe, expect, it } from 'vitest';
import { speakable } from '@/i18n';

// What the voice says must sound like a person: «un metro», never «uno metro»; units as words, never spelt out.
describe('speakable', () => {
  const cases: [Parameters<typeof speakable>[0], string, string][] = [
    ['es', '1 metro (m) = 1 000 milímetros (mm).', 'un metro es igual a 1000 milímetros.'],
    ['es', '3 m = ? cm', '3 metros es igual a cuántos centímetros'],
    ['es', '1 h y 21 minutos', 'una hora y veintiún minutos'],
    ['es', '31 cajas', 'treinta y una cajas'],
    ['es', 'El número 21 es impar.', 'El número 21 es impar.'],
    ['ca', '1 metre (m) = 1 000 mil·límetres', 'un metre és igual a 1000 mil·límetres'],
    ['ca', '21 hores', 'vint-i-una hores'],
    ['en', '1 m = ? cm', '1 metre equals how many centimetres'],
  ];
  for (const [l, text, said] of cases) it(`${l}: ${text}`, () => expect(speakable(l, text)).toBe(said));
});
