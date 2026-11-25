// Numeric problem generators for Physics and Chemistry (ESO).
import { int, N, pick, q, round, T, X } from './lib';
import type { Gen } from './gens';
import type { T3 } from './types';

/** A physics problem: question text (3 languages), exact answer, plausible wrong answers, formula hint. */
const P = (qq: T3, a: number, wrong: number[], hint: T3, d = 2) => q(qq, round(a, d), wrong.map((w) => round(w, d)).filter((w) => w > 0 || a <= 0), hint);

export const siUnits = (): Gen => (r) => {
  const k = int(r, 0, 4);
  if (k === 0) { const v = int(r, 2, 90) * 10; return P(X((l) => [`¿Cuántos segundos son ${v} minutos?`, `Quants segons són ${v} minuts?`, `How many seconds are ${v} minutes?`][l]), v * 60, [v * 100, v / 60, v * 6], T('1 min = 60 s.', '1 min = 60 s.', '1 min = 60 s.')); }
  if (k === 1) { const v = pick(r, [18, 36, 54, 72, 90, 108, 120]); return P(X((l) => [`Expresa ${v} km/h en m/s.`, `Expressa ${v} km/h en m/s.`, `Express ${v} km/h in m/s.`][l]), v / 3.6, [v * 3.6, v / 60, v / 10], T('Divide entre 3,6.', 'Dividix entre 3,6.', 'Divide by 3.6.')); }
  if (k === 2) { const v = int(r, 2, 900); return P(X((l) => [`¿Cuántos kilogramos son ${N(l, v)} g?`, `Quants quilograms són ${N(l, v)} g?`, `How many kilograms are ${N(l, v)} g?`][l]), v / 1000, [v / 100, v * 1000, v / 10], T('1 kg = 1 000 g: divide entre 1 000.', '1 kg = 1 000 g: dividix entre 1 000.', '1 kg = 1,000 g: divide by 1,000.'), 3); }
  if (k === 3) { const v = int(r, 1, 50) * 10; return P(X((l) => [`¿Cuántos m³ son ${N(l, v)} L?`, `Quants m³ són ${N(l, v)} L?`, `How many m³ are ${N(l, v)} L?`][l]), v / 1000, [v / 100, v * 1000, v / 10], T('1 m³ = 1 000 L.', '1 m³ = 1 000 L.', '1 m³ = 1,000 L.'), 3); }
  const c = int(r, -20, 100); return P(X((l) => [`¿Cuántos kelvin son ${c} °C?`, `Quants kelvin són ${c} °C?`, `How many kelvin is ${c} °C?`][l]), c + 273, [c - 273, c + 100, 273 - c], T('K = °C + 273.', 'K = °C + 273.', 'K = °C + 273.'), 0);
};
export const density = (): Gen => (r) => {
  const mats: [T3, number][] = [[T('agua', 'aigua', 'water'), 1], [T('aceite', 'oli', 'oil'), 0.92], [T('aluminio', 'alumini', 'aluminium'), 2.7], [T('hierro', 'ferro', 'iron'), 7.9], [T('corcho', 'suro', 'cork'), 0.25], [T('plomo', 'plom', 'lead'), 11.3]];
  const [name, d] = pick(r, mats); const V = int(r, 2, 40) * 5; const m = round(d * V, 2); const k = int(r, 0, 2);
  if (k === 0) return P(X((l) => [`Un objeto tiene una masa de ${N(l, m)} g y un volumen de ${V} cm³. ¿Cuál es su densidad (g/cm³)?`, `Un objecte té una massa de ${N(l, m)} g i un volum de ${V} cm³. Quina és la seua densitat (g/cm³)?`, `An object has a mass of ${N(l, m)} g and a volume of ${V} cm³. What is its density (g/cm³)?`][l]), d, [V / m, m * V / 100, d * 10], T('d = m / V.', 'd = m / V.', 'Density = mass ÷ volume.'));
  if (k === 1) return P(X((l) => [`¿Qué masa (g) tienen ${V} cm³ de ${name[0]} (d = ${N(l, d)} g/cm³)?`, `Quina massa (g) tenen ${V} cm³ de ${name[1]} (d = ${N(l, d)} g/cm³)?`, `What is the mass (g) of ${V} cm³ of ${name[2]} (density ${N(l, d)} g/cm³)?`][l]), m, [V / d, V + d, m * 10], T('m = d · V.', 'm = d · V.', 'Mass = density × volume.'));
  const solids: [T3, number][] = [[T('aluminio', 'alumini', 'aluminium'), 2.7], [T('hierro', 'ferro', 'iron'), 7.9], [T('corcho', 'suro', 'cork'), 0.25], [T('plomo', 'plom', 'lead'), 11.3], [T('madera de pino', 'fusta de pi', 'pine wood'), 0.5], [T('hielo', 'gel', 'ice'), 0.92]];
  const [sn, sd] = pick(r, solids);
  return q(X((l) => [`Un bloque de ${sn[0]} (d = ${N(l, sd)} g/cm³), ¿flota en agua?`, `Un bloc de ${sn[1]} (d = ${N(l, sd)} g/cm³), sura en aigua?`, `A block of ${sn[2]} (density ${N(l, sd)} g/cm³): does it float in water?`][l]), sd < 1 ? T('Sí', 'Sí', 'Yes') : T('No', 'No', 'No'), [sd < 1 ? T('No', 'No', 'No') : T('Sí', 'Sí', 'Yes')], T('Flota lo que tiene menos densidad que el agua (1 g/cm³).', 'Sura el que té menys densitat que l’aigua (1 g/cm³).', 'Anything less dense than water (1 g/cm³) floats.'), { mc: true });
};
export const concentration = (): Gen => (r) => {
  const k = int(r, 0, 2); const s = int(r, 2, 30) * 5, V = pick(r, [0.25, 0.5, 1, 2]);
  if (k === 0) return P(X((l) => [`Disuelvo ${s} g de sal en agua hasta ${N(l, V)} L de disolución. ¿Concentración en g/L?`, `Dissolc ${s} g de sal en aigua fins a ${N(l, V)} L de dissolució. Concentració en g/L?`, `I dissolve ${s} g of salt in water to make ${N(l, V)} L of solution. Concentration in g/L?`][l]), s / V, [s * V, V / s, s + V], T('c = masa de soluto (g) / volumen de disolución (L).', 'c = massa de solut (g) / volum de dissolució (L).', 'c = mass of solute (g) ÷ volume of solution (L).'));
  if (k === 1) { const ms = int(r, 1, 9) * 5, mw = int(r, 4, 19) * 10; const pct = (ms / (ms + mw)) * 100; return P(X((l) => [`Mezclo ${ms} g de azúcar con ${mw} g de agua. ¿Porcentaje en masa de azúcar?`, `Mescle ${ms} g de sucre amb ${mw} g d’aigua. Percentatge en massa de sucre?`, `I mix ${ms} g of sugar with ${mw} g of water. Percentage of sugar by mass?`][l]), pct, [(ms / mw) * 100, ms, pct * 2], T('% = masa de soluto / masa de disolución (soluto + disolvente) · 100.', '% = massa de solut / massa de dissolució (solut + dissolvent) · 100.', '% = mass of solute ÷ mass of solution (solute + solvent) × 100.')); }
  const c = int(r, 2, 20) * 5, V2 = pick(r, [0.2, 0.5, 2, 3]); return P(X((l) => [`¿Cuántos gramos de soluto hay en ${N(l, V2)} L de una disolución de ${c} g/L?`, `Quants grams de solut hi ha en ${N(l, V2)} L d’una dissolució de ${c} g/L?`, `How many grams of solute are in ${N(l, V2)} L of a ${c} g/L solution?`][l]), c * V2, [c / V2, c + V2, c * V2 * 10], T('masa = c · V.', 'massa = c · V.', 'mass = concentration × volume.'));
};
export const speed = (): Gen => (r) => {
  const k = int(r, 0, 2); const v = int(r, 2, 30), t = int(r, 2, 20) * 5; const d = v * t;
  if (k === 0) return P(X((l) => [`Un ciclista recorre ${N(l, d)} m en ${t} s. ¿Rapidez media (m/s)?`, `Un ciclista recorre ${N(l, d)} m en ${t} s. Rapidesa mitjana (m/s)?`, `A cyclist covers ${N(l, d)} m in ${t} s. Average speed (m/s)?`][l]), v, [d * t, t / d, v * 2], T('v = distancia / tiempo.', 'v = distància / temps.', 'speed = distance ÷ time.'));
  if (k === 1) return P(X((l) => [`Un tren va a ${v} m/s durante ${t} s. ¿Qué distancia recorre (m)?`, `Un tren va a ${v} m/s durant ${t} s. Quina distància recorre (m)?`, `A train travels at ${v} m/s for ${t} s. How far does it go (m)?`][l]), d, [v + t, t / v, d / 10], T('d = v · t.', 'd = v · t.', 'distance = speed × time.'));
  const D = int(r, 2, 30) * 10, V = pick(r, [40, 60, 80, 100, 120]); return P(X((l) => [`Un coche va a ${V} km/h. ¿Cuántas horas tarda en recorrer ${D} km?`, `Un cotxe va a ${V} km/h. Quantes hores tarda a recórrer ${D} km?`, `A car travels at ${V} km/h. How many hours to cover ${D} km?`][l]), D / V, [D * V, V / D, D / V + 1], T('t = d / v.', 't = d / v.', 'time = distance ÷ speed.'));
};
export const acceleration = (): Gen => (r) => {
  const k = int(r, 0, 2); const a = int(r, 1, 6), t = int(r, 2, 10), v0 = int(r, 0, 10) * 2;
  if (k === 0) { const v = v0 + a * t; return P(X((l) => [`Un coche pasa de ${v0} m/s a ${v} m/s en ${t} s. ¿Aceleración (m/s²)?`, `Un cotxe passa de ${v0} m/s a ${v} m/s en ${t} s. Acceleració (m/s²)?`, `A car goes from ${v0} m/s to ${v} m/s in ${t} s. Acceleration (m/s²)?`][l]), a, [v / t, (v - v0) * t, a + 1], T('a = (v − v₀) / t.', 'a = (v − v₀) / t.', 'a = (v − u) ÷ t.')); }
  if (k === 1) return P(X((l) => [`Una moto parte del reposo con a = ${a} m/s². ¿Qué velocidad lleva a los ${t} s (m/s)?`, `Una moto partix del repòs amb a = ${a} m/s². Quina velocitat porta als ${t} s (m/s)?`, `A motorbike starts from rest with a = ${a} m/s². What is its speed after ${t} s (m/s)?`][l]), a * t, [a + t, (a * t * t) / 2, a * t * 2], T('v = v₀ + a · t, con v₀ = 0.', 'v = v₀ + a · t, amb v₀ = 0.', 'v = u + a × t, with u = 0.'));
  return P(X((l) => [`Parte del reposo con a = ${a} m/s². ¿Qué distancia recorre en ${t} s (m)?`, `Partix del repòs amb a = ${a} m/s². Quina distància recorre en ${t} s (m)?`, `Starting from rest with a = ${a} m/s², how far does it travel in ${t} s (m)?`][l]), (a * t * t) / 2, [a * t, a * t * t, (a * t) / 2], T('x = ½ · a · t².', 'x = ½ · a · t².', 's = ½ × a × t².'));
};
export const freeFall = (): Gen => (r) => {
  const t = int(r, 1, 5); const k = int(r, 0, 1);
  if (k === 0) return P(X((l) => [`Dejo caer una piedra. ¿Qué velocidad lleva a los ${t} s? (g = 10 m/s², en m/s)`, `Deixe caure una pedra. Quina velocitat porta als ${t} s? (g = 10 m/s², en m/s)`, `I drop a stone. How fast is it going after ${t} s? (g = 10 m/s², in m/s)`][l]), 10 * t, [5 * t * t, 10 * t * t, 10 + t], T('v = g · t.', 'v = g · t.', 'v = g × t.'));
  return P(X((l) => [`Dejo caer una piedra. ¿Cuántos metros cae en ${t} s? (g = 10 m/s²)`, `Deixe caure una pedra. Quants metres cau en ${t} s? (g = 10 m/s²)`, `I drop a stone. How many metres does it fall in ${t} s? (g = 10 m/s²)`][l]), 5 * t * t, [10 * t, 10 * t * t, 5 * t], T('h = ½ · g · t² = 5 · t².', 'h = ½ · g · t² = 5 · t².', 'h = ½ × g × t² = 5 × t².'));
};
export const newton = (): Gen => (r) => {
  const k = int(r, 0, 2); const m = int(r, 2, 80), a = int(r, 1, 6);
  if (k === 0) return P(X((l) => [`¿Qué fuerza (N) hay que aplicar a una masa de ${m} kg para que acelere ${a} m/s²?`, `Quina força (N) cal aplicar a una massa de ${m} kg perquè accelere ${a} m/s²?`, `What force (N) is needed to give a ${m} kg mass an acceleration of ${a} m/s²?`][l]), m * a, [m + a, m / a, m * a * 10], T('F = m · a.', 'F = m · a.', 'F = m × a.'));
  if (k === 1) return P(X((l) => [`¿Cuánto pesa (N) una persona de ${m} kg? (g = 9,8 m/s²)`, `Quant pesa (N) una persona de ${m} kg? (g = 9,8 m/s²)`, `What is the weight (N) of a ${m} kg person? (g = 9.8 m/s²)`][l]), m * 9.8, [m, m / 9.8, m * 98], T('P = m · g.', 'P = m · g.', 'W = m × g.'));
  const F = m * a; return P(X((l) => [`Una fuerza de ${F} N actúa sobre ${m} kg. ¿Aceleración (m/s²)?`, `Una força de ${F} N actua sobre ${m} kg. Acceleració (m/s²)?`, `A ${F} N force acts on ${m} kg. Acceleration (m/s²)?`][l]), a, [F * m, m / F, a + 2], T('a = F / m.', 'a = F / m.', 'a = F ÷ m.'));
};
export const hooke = (): Gen => (r) => {
  const kk = int(r, 2, 20) * 10, x = int(r, 1, 10); const k = int(r, 0, 1);
  if (k === 0) return P(X((l) => [`Un muelle de constante ${kk} N/m se estira ${x} cm. ¿Qué fuerza (N) se aplica?`, `Un moll de constant ${kk} N/m s’estira ${x} cm. Quina força (N) s’aplica?`, `A spring with constant ${kk} N/m stretches ${x} cm. What force (N) is applied?`][l]), (kk * x) / 100, [kk * x, kk / x, (kk * x) / 10], T('F = k · x, con x en metros.', 'F = k · x, amb x en metres.', 'F = k × x, with x in metres.'));
  const F = (kk * x) / 100; return P(X((l) => [`Un muelle de k = ${kk} N/m soporta ${N(l, F)} N. ¿Cuánto se estira (cm)?`, `Un moll de k = ${kk} N/m suporta ${N(l, F)} N. Quant s’estira (cm)?`, `A spring with k = ${kk} N/m holds ${N(l, F)} N. How far does it stretch (cm)?`][l]), x, [x * 10, F * kk, x + 5], T('x = F / k (en m); pásalo a cm.', 'x = F / k (en m); passa-ho a cm.', 'x = F ÷ k (in m); convert to cm.'));
};
export const pressure = (): Gen => (r) => {
  const k = int(r, 0, 1);
  if (k === 0) { const F = int(r, 1, 20) * 100, A = pick(r, [0.5, 1, 2, 4, 0.25]); return P(X((l) => [`Una fuerza de ${N(l, F)} N actúa sobre ${N(l, A)} m². ¿Presión (Pa)?`, `Una força de ${N(l, F)} N actua sobre ${N(l, A)} m². Pressió (Pa)?`, `A ${N(l, F)} N force acts on ${N(l, A)} m². Pressure (Pa)?`][l]), F / A, [F * A, A / F, F + A], T('p = F / S.', 'p = F / S.', 'p = F ÷ A.')); }
  const h = int(r, 1, 20); return P(X((l) => [`¿Qué presión hidrostática (Pa) hay a ${h} m de profundidad en agua? (d = 1 000 kg/m³, g = 10 m/s²)`, `Quina pressió hidrostàtica (Pa) hi ha a ${h} m de profunditat en aigua? (d = 1 000 kg/m³, g = 10 m/s²)`, `What is the water pressure (Pa) at a depth of ${h} m? (density 1,000 kg/m³, g = 10 m/s²)`][l]), 10000 * h, [1000 * h, 100000 * h, 10 * h], T('p = d · g · h.', 'p = d · g · h.', 'p = ρ × g × h.'));
};
export const gravitation = (): Gen => (r) => {
  const m = int(r, 20, 90); const pl: [T3, number][] = [[T('la Luna', 'la Lluna', 'the Moon'), 1.6], [T('Marte', 'Mart', 'Mars'), 3.7], [T('Júpiter', 'Júpiter', 'Jupiter'), 24.8]]; const [n, g] = pick(r, pl);
  return P(X((l) => [`Una persona de ${m} kg, ¿cuánto pesa (N) en ${n[0]} (g = ${N(l, g)} m/s²)?`, `Una persona de ${m} kg, quant pesa (N) en ${n[1]} (g = ${N(l, g)} m/s²)?`, `How much does a ${m} kg person weigh (N) on ${n[2]} (g = ${N(l, g)} m/s²)?`][l]), m * g, [m, m * 9.8, m / g], T('La masa no cambia; el peso es m · g del lugar.', 'La massa no canvia; el pes és m · g del lloc.', 'Mass stays the same; weight is m × the local g.'));
};
export const workPower = (): Gen => (r) => {
  const k = int(r, 0, 2); const F = int(r, 2, 50) * 10, d = int(r, 2, 20), t = int(r, 2, 10);
  if (k === 0) return P(X((l) => [`Empujo con ${F} N una caja ${d} m en la dirección del movimiento. ¿Trabajo (J)?`, `Empente amb ${F} N una caixa ${d} m en la direcció del moviment. Treball (J)?`, `I push a box with ${F} N for ${d} m in the direction of motion. Work done (J)?`][l]), F * d, [F + d, F / d, F * d * 10], T('W = F · d.', 'W = F · d.', 'W = F × d.'));
  if (k === 1) return P(X((l) => [`Un motor hace ${N(l, F * d)} J de trabajo en ${t} s. ¿Potencia (W)?`, `Un motor fa ${N(l, F * d)} J de treball en ${t} s. Potència (W)?`, `A motor does ${N(l, F * d)} J of work in ${t} s. Power (W)?`][l]), (F * d) / t, [F * d * t, t / (F * d), F * d], T('P = W / t.', 'P = W / t.', 'P = W ÷ t.'));
  const m = int(r, 2, 20), v = int(r, 2, 10), h = int(r, 2, 20); const kk = int(r, 0, 1);
  if (kk === 0) return P(X((l) => [`¿Energía cinética (J) de ${m} kg a ${v} m/s?`, `Energia cinètica (J) de ${m} kg a ${v} m/s?`, `Kinetic energy (J) of ${m} kg moving at ${v} m/s?`][l]), 0.5 * m * v * v, [m * v, m * v * v, 0.5 * m * v], T('Ec = ½ · m · v².', 'Ec = ½ · m · v².', 'KE = ½ × m × v².'));
  return P(X((l) => [`¿Energía potencial (J) de ${m} kg a ${h} m de altura? (g = 10 m/s²)`, `Energia potencial (J) de ${m} kg a ${h} m d’altura? (g = 10 m/s²)`, `Potential energy (J) of ${m} kg at a height of ${h} m? (g = 10 m/s²)`][l]), m * 10 * h, [m * h, 0.5 * m * h * 10, m * 10 + h], T('Ep = m · g · h.', 'Ep = m · g · h.', 'GPE = m × g × h.'));
};
export const mechEnergy = (): Gen => (r) => {
  const h = pick(r, [5, 20, 45, 80]); const v = Math.sqrt(20 * h);
  return P(X((l) => [`Un objeto cae desde ${h} m sin rozamiento. ¿Con qué velocidad llega al suelo (m/s)? (g = 10 m/s²)`, `Un objecte cau des de ${h} m sense fregament. Amb quina velocitat arriba a terra (m/s)? (g = 10 m/s²)`, `An object falls from ${h} m with no friction. How fast does it hit the ground (m/s)? (g = 10 m/s²)`][l]), v, [20 * h, 10 * h, v * 2], T('Se conserva la energía mecánica: m·g·h = ½·m·v² → v = √(2gh).', 'Es conserva l’energia mecànica: m·g·h = ½·m·v² → v = √(2gh).', 'Mechanical energy is conserved: m·g·h = ½·m·v² → v = √(2gh).'));
};
export const ohm = (): Gen => (r) => {
  const k = int(r, 0, 2); const R = pick(r, [2, 4, 5, 10, 20, 50, 100]), I = pick(r, [0.1, 0.2, 0.5, 1, 2, 3]); const V = round(R * I, 2);
  if (k === 0) return P(X((l) => [`Una resistencia de ${R} Ω recibe ${N(l, V)} V. ¿Intensidad (A)?`, `Una resistència de ${R} Ω rep ${N(l, V)} V. Intensitat (A)?`, `A ${R} Ω resistor has ${N(l, V)} V across it. Current (A)?`][l]), I, [V * R, R / V, I * 10], T('I = V / R.', 'I = V / R.', 'I = V ÷ R.'));
  if (k === 1) return P(X((l) => [`Por una resistencia de ${R} Ω pasan ${N(l, I)} A. ¿Voltaje (V)?`, `Per una resistència de ${R} Ω passen ${N(l, I)} A. Voltatge (V)?`, `${N(l, I)} A flows through a ${R} Ω resistor. Voltage (V)?`][l]), V, [R / I, R + I, V * 10], T('V = I · R.', 'V = I · R.', 'V = I × R.'));
  return P(X((l) => [`Con ${N(l, V)} V pasan ${N(l, I)} A. ¿Resistencia (Ω)?`, `Amb ${N(l, V)} V passen ${N(l, I)} A. Resistència (Ω)?`, `With ${N(l, V)} V, ${N(l, I)} A flows. Resistance (Ω)?`][l]), R, [V * I, I / V, R * 2], T('R = V / I.', 'R = V / I.', 'R = V ÷ I.'));
};
export const seriesParallel = (): Gen => (r) => {
  const a = pick(r, [2, 3, 4, 6, 10, 12]), b = pick(r, [2, 3, 4, 6, 10, 12]); const ser = r() < 0.5;
  return ser ? P(X((l) => [`Dos resistencias de ${a} Ω y ${b} Ω en serie. ¿Resistencia total (Ω)?`, `Dues resistències de ${a} Ω i ${b} Ω en sèrie. Resistència total (Ω)?`, `Two resistors of ${a} Ω and ${b} Ω in series. Total resistance (Ω)?`][l]), a + b, [(a * b) / (a + b), a * b, Math.abs(a - b) || 1], T('En serie se suman.', 'En sèrie se sumen.', 'In series they add up.'))
    : P(X((l) => [`Dos resistencias de ${a} Ω y ${b} Ω en paralelo. ¿Resistencia total (Ω)?`, `Dues resistències de ${a} Ω i ${b} Ω en paral·lel. Resistència total (Ω)?`, `Two resistors of ${a} Ω and ${b} Ω in parallel. Total resistance (Ω)?`][l]), (a * b) / (a + b), [a + b, a * b, (a + b) / 2], T('En paralelo: R = (R₁ · R₂) / (R₁ + R₂). Siempre es menor que la más pequeña.', 'En paral·lel: R = (R₁ · R₂) / (R₁ + R₂). Sempre és menor que la més xicoteta.', 'In parallel: R = (R₁ × R₂) ÷ (R₁ + R₂). It is always less than the smallest.'));
};
export const electricPower = (): Gen => (r) => {
  const k = int(r, 0, 2); const Pw = pick(r, [60, 100, 500, 1000, 1500, 2000]), h = int(r, 1, 10);
  if (k === 0) { const V = 230, I = round(Pw / V, 2); return P(X((l) => [`Un aparato de ${N(l, Pw)} W se conecta a 230 V. ¿Intensidad (A, 2 decimales)?`, `Un aparell de ${N(l, Pw)} W es connecta a 230 V. Intensitat (A, 2 decimals)?`, `A ${N(l, Pw)} W appliance runs on 230 V. Current (A, 2 d.p.)?`][l]), I, [Pw * V, V / Pw, I * 10], T('P = V · I → I = P / V.', 'P = V · I → I = P / V.', 'P = V × I → I = P ÷ V.')); }
  if (k === 1) return P(X((l) => [`Un aparato de ${N(l, Pw)} W funciona ${h} h. ¿Energía consumida (kWh)?`, `Un aparell de ${N(l, Pw)} W funciona ${h} h. Energia consumida (kWh)?`, `A ${N(l, Pw)} W appliance runs for ${h} h. Energy used (kWh)?`][l]), (Pw / 1000) * h, [Pw * h, Pw / h, (Pw / 100) * h], T('E = P (kW) · t (h).', 'E = P (kW) · t (h).', 'E = P (kW) × t (h).'));
  const pr = pick(r, [0.1, 0.15, 0.2]); const E = (Pw / 1000) * h; return P(X((l) => [`Un aparato de ${N(l, Pw)} W funciona ${h} h. Si el kWh cuesta ${N(l, pr)} €, ¿cuánto cuesta (€)?`, `Un aparell de ${N(l, Pw)} W funciona ${h} h. Si el kWh costa ${N(l, pr)} €, quant costa (€)?`, `A ${N(l, Pw)} W appliance runs for ${h} h. If a kWh costs €${N(l, pr)}, how much does it cost (€)?`][l]), E * pr, [Pw * h * pr, E, E * pr * 10], T('Calcula los kWh y multiplica por el precio.', 'Calcula els kWh i multiplica pel preu.', 'Work out the kWh and multiply by the price.'));
};
export const heat = (): Gen => (r) => {
  const k = int(r, 0, 1); const m = pick(r, [0.5, 1, 2, 3]), dT = int(r, 2, 8) * 10; const c = 4180;
  if (k === 0) return P(X((l) => [`¿Qué calor (J) hace falta para calentar ${N(l, m)} kg de agua ${dT} °C? (c = 4 180 J/kg·°C)`, `Quina calor (J) cal per a escalfar ${N(l, m)} kg d’aigua ${dT} °C? (c = 4 180 J/kg·°C)`, `How much heat (J) is needed to warm ${N(l, m)} kg of water by ${dT} °C? (c = 4,180 J/kg·°C)`][l]), m * c * dT, [m * dT, c * dT, m * c], T('Q = m · c · ΔT.', 'Q = m · c · ΔT.', 'Q = m × c × ΔT.'), 0);
  const T1 = int(r, 10, 30), T2 = int(r, 50, 90); return P(X((l) => [`Mezclo la misma cantidad de agua a ${T1} °C y a ${T2} °C. ¿Temperatura de equilibrio (°C)?`, `Mescle la mateixa quantitat d’aigua a ${T1} °C i a ${T2} °C. Temperatura d’equilibri (°C)?`, `I mix equal amounts of water at ${T1} °C and ${T2} °C. Final temperature (°C)?`][l]), (T1 + T2) / 2, [T1 + T2, T2 - T1, T2], T('Con masas iguales de la misma sustancia, es la media.', 'Amb masses iguals de la mateixa substància, és la mitjana.', 'With equal masses of the same substance, it is the average.'));
};
export const efficiency = (): Gen => (r) => {
  const Ein = pick(r, [200, 500, 1000, 2000]), pct = pick(r, [20, 25, 30, 40, 60, 80, 90]); const Eout = (Ein * pct) / 100;
  return P(X((l) => [`Una máquina recibe ${N(l, Ein)} J y da ${N(l, Eout)} J útiles. ¿Rendimiento (%)?`, `Una màquina rep ${N(l, Ein)} J i dona ${N(l, Eout)} J útils. Rendiment (%)?`, `A machine takes in ${N(l, Ein)} J and gives ${N(l, Eout)} J of useful energy. Efficiency (%)?`][l]), pct, [100 - pct, (Ein / Eout) * 100, pct / 10], T('η = energía útil / energía consumida · 100.', 'η = energia útil / energia consumida · 100.', 'Efficiency = useful energy ÷ energy in × 100.'));
};
export const gasLaws = (): Gen => (r) => {
  const k = int(r, 0, 1);
  if (k === 0) { const p1 = pick(r, [1, 2, 3, 4]), V1 = pick(r, [2, 4, 6, 8, 12]), p2 = pick(r, [1, 2, 3, 4, 6].filter((x) => x !== p1 && (p1 * V1) % x === 0)) ?? 2; const V2 = (p1 * V1) / p2;
    return P(X((l) => [`Un gas ocupa ${V1} L a ${p1} atm. Si la presión pasa a ${p2} atm (misma temperatura), ¿qué volumen ocupa (L)?`, `Un gas ocupa ${V1} L a ${p1} atm. Si la pressió passa a ${p2} atm (mateixa temperatura), quin volum ocupa (L)?`, `A gas fills ${V1} L at ${p1} atm. If the pressure becomes ${p2} atm (same temperature), what volume does it fill (L)?`][l]), V2, [(V1 * p2) / p1, V1 + p2 - p1, p1 * V1 * p2], T('Ley de Boyle: p₁ · V₁ = p₂ · V₂.', 'Llei de Boyle: p₁ · V₁ = p₂ · V₂.', 'Boyle’s law: p₁ × V₁ = p₂ × V₂.')); }
  const T1 = pick(r, [200, 250, 300, 400]), V1 = pick(r, [2, 3, 4, 6]), f = pick(r, [1.5, 2]); const T2 = T1 * f;
  return P(X((l) => [`Un gas ocupa ${V1} L a ${T1} K. Si la temperatura sube a ${T2} K (misma presión), ¿volumen (L)?`, `Un gas ocupa ${V1} L a ${T1} K. Si la temperatura puja a ${T2} K (mateixa pressió), volum (L)?`, `A gas fills ${V1} L at ${T1} K. If the temperature rises to ${T2} K (same pressure), volume (L)?`][l]), V1 * f, [V1 / f, V1 + f, V1 * T2], T('Ley de Charles: V₁ / T₁ = V₂ / T₂ (temperatura en kelvin).', 'Llei de Charles: V₁ / T₁ = V₂ / T₂ (temperatura en kelvin).', 'Charles’s law: V₁ ÷ T₁ = V₂ ÷ T₂ (temperature in kelvin).'));
};
export const massConservation = (): Gen => (r) => {
  const a = int(r, 2, 30), b = int(r, 2, 30); const k = int(r, 0, 1);
  if (k === 0) return P(X((l) => [`Reaccionan ${a} g de una sustancia con ${b} g de otra y solo se forma un producto. ¿Masa del producto (g)?`, `Reaccionen ${a} g d’una substància amb ${b} g d’una altra i només es forma un producte. Massa del producte (g)?`, `${a} g of one substance react with ${b} g of another, forming a single product. Mass of the product (g)?`][l]), a + b, [Math.abs(a - b) || 1, a * b, (a + b) / 2], T('Ley de Lavoisier: la masa total se conserva.', 'Llei de Lavoisier: la massa total es conserva.', 'Lavoisier’s law: total mass is conserved.'));
  return P(X((l) => [`Al quemar madera en un recipiente cerrado, la masa inicial es ${a + b} g. Se forman ${a} g de cenizas y gases. Falta medir el agua formada. ¿Cuántos gramos de agua (g)?`, `En cremar fusta en un recipient tancat, la massa inicial és ${a + b} g. Es formen ${a} g de cendres i gasos. Falta mesurar l’aigua formada. Quants grams d’aigua (g)?`, `Wood burns in a sealed container. Initial mass ${a + b} g. ${a} g of ash and gases form. The water formed has not been measured. How many grams of water (g)?`][l]), b, [a, a + b, a - b > 0 ? a - b : a + 1], T('Masa de reactivos = masa de productos.', 'Massa de reactius = massa de productes.', 'Mass of reactants = mass of products.'));
};
export const moles = (): Gen => (r) => {
  const S: [string, number][] = [['H₂O', 18], ['CO₂', 44], ['NaCl', 58.5], ['O₂', 32], ['CH₄', 16], ['NH₃', 17]]; const [f, M] = pick(r, S); const n = pick(r, [0.5, 1, 2, 3, 4]); const k = int(r, 0, 1);
  if (k === 0) return P(X((l) => [`¿Cuántos moles hay en ${N(l, n * M)} g de ${f}? (M = ${N(l, M)} g/mol)`, `Quants mols hi ha en ${N(l, n * M)} g de ${f}? (M = ${N(l, M)} g/mol)`, `How many moles are in ${N(l, n * M)} g of ${f}? (M = ${N(l, M)} g/mol)`][l]), n, [n * M * M, M / (n * M), n + 1], T('n = masa / masa molar.', 'n = massa / massa molar.', 'moles = mass ÷ molar mass.'));
  return P(X((l) => [`¿Qué masa (g) tienen ${N(l, n)} mol de ${f}? (M = ${N(l, M)} g/mol)`, `Quina massa (g) tenen ${N(l, n)} mol de ${f}? (M = ${N(l, M)} g/mol)`, `What is the mass (g) of ${N(l, n)} mol of ${f}? (M = ${N(l, M)} g/mol)`][l]), n * M, [M / n, n + M, n * M * 2], T('m = n · M.', 'm = n · M.', 'mass = moles × molar mass.'));
};
export const molarMass = (): Gen => (r) => {
  const S: [string, number, string][] = [['H₂O', 18, 'H = 1, O = 16'], ['CO₂', 44, 'C = 12, O = 16'], ['CH₄', 16, 'C = 12, H = 1'], ['NH₃', 17, 'N = 14, H = 1'], ['O₂', 32, 'O = 16'], ['H₂SO₄', 98, 'H = 1, S = 32, O = 16'], ['CaCO₃', 100, 'Ca = 40, C = 12, O = 16']];
  const [f, M, data] = pick(r, S);
  return P(X((l) => [`¿Cuál es la masa molecular de ${f} (u)? Datos: ${data}.`, `Quina és la massa molecular de ${f} (u)? Dades: ${data}.`, `What is the molecular mass of ${f} (u)? Data: ${data}.`][l]), M, [M + 2, M - 2, M * 2], T('Suma las masas de todos los átomos, multiplicando por los subíndices.', 'Suma les masses de tots els àtoms, multiplicant pels subíndexs.', 'Add the masses of all the atoms, multiplying by the subscripts.'), 1);
};
export const atomParts = (): Gen => (r) => {
  const E: [string, number, number][] = [['C', 6, 12], ['O', 8, 16], ['Na', 11, 23], ['Cl', 17, 35], ['Fe', 26, 56], ['Ca', 20, 40], ['N', 7, 14], ['Mg', 12, 24], ['Al', 13, 27], ['K', 19, 39]];
  const [s, Z, A] = pick(r, E); const k = int(r, 0, 2);
  if (k === 0) return P(X((l) => [`El ${s} tiene Z = ${Z} y A = ${A}. ¿Cuántos neutrones tiene?`, `El ${s} té Z = ${Z} i A = ${A}. Quants neutrons té?`, `${s} has Z = ${Z} and A = ${A}. How many neutrons does it have?`][l]), A - Z, [A + Z, Z, A], T('Neutrones = A − Z.', 'Neutrons = A − Z.', 'Neutrons = A − Z.'), 0);
  if (k === 1) return P(X((l) => [`Un átomo neutro de ${s} tiene Z = ${Z}. ¿Cuántos electrones tiene?`, `Un àtom neutre de ${s} té Z = ${Z}. Quants electrons té?`, `A neutral ${s} atom has Z = ${Z}. How many electrons does it have?`][l]), Z, [A - Z, A, Z + 1], T('En un átomo neutro, electrones = protones = Z.', 'En un àtom neutre, electrons = protons = Z.', 'In a neutral atom, electrons = protons = Z.'), 0);
  const ch = pick(r, [1, 2, -1, -2]); return P(X((l) => [`El ion ${s}${ch > 0 ? (ch === 1 ? '⁺' : '²⁺') : ch === -1 ? '⁻' : '²⁻'} (Z = ${Z}), ¿cuántos electrones tiene?`, `L’ió ${s}${ch > 0 ? (ch === 1 ? '⁺' : '²⁺') : ch === -1 ? '⁻' : '²⁻'} (Z = ${Z}), quants electrons té?`, `How many electrons does the ion ${s}${ch > 0 ? (ch === 1 ? '⁺' : '²⁺') : ch === -1 ? '⁻' : '²⁻'} (Z = ${Z}) have?`][l]), Z - ch, [Z + ch, Z, A - Z], T('Carga positiva: ha perdido electrones. Negativa: los ha ganado.', 'Càrrega positiva: ha perdut electrons. Negativa: els ha guanyat.', 'A positive charge means electrons were lost; negative means gained.'), 0);
};
export const waves = (): Gen => (r) => {
  const k = int(r, 0, 1);
  if (k === 0) { const f = pick(r, [170, 340, 680, 1700]); return P(X((l) => [`Un sonido de ${N(l, f)} Hz viaja a 340 m/s en el aire. ¿Longitud de onda (m)?`, `Un so de ${N(l, f)} Hz viatja a 340 m/s en l’aire. Longitud d’ona (m)?`, `A ${N(l, f)} Hz sound travels at 340 m/s in air. Wavelength (m)?`][l]), 340 / f, [f / 340, 340 * f, f], T('λ = v / f.', 'λ = v / f.', 'λ = v ÷ f.'), 3); }
  const t = int(r, 1, 6); return P(X((l) => [`Veo un rayo y oigo el trueno ${t} s después. ¿A qué distancia cayó (m)? (sonido: 340 m/s)`, `Veig un llamp i sent el tro ${t} s després. A quina distància va caure (m)? (so: 340 m/s)`, `I see lightning and hear the thunder ${t} s later. How far away was it (m)? (sound: 340 m/s)`][l]), 340 * t, [340 / t, 300000 * t, 34 * t], T('La luz llega casi al instante: d = v_sonido · t.', 'La llum arriba quasi a l’instant: d = v_so · t.', 'Light arrives almost instantly: d = speed of sound × t.'), 0);
};
export const coulomb = (): Gen => (r) => {
  const f = pick(r, [2, 3, 4]); const k = int(r, 0, 1);
  return k === 0 ? q(X((l) => [`Si la distancia entre dos cargas se multiplica por ${f}, la fuerza se divide entre…`, `Si la distància entre dues càrregues es multiplica per ${f}, la força es dividix entre…`, `If the distance between two charges is multiplied by ${f}, the force is divided by…`][l]), f * f, [f, f * 2, f * f * f].filter((x) => x !== f * f), T('F depende de 1/d²: el factor se eleva al cuadrado.', 'F depén d’1/d²: el factor s’eleva al quadrat.', 'F depends on 1/d²: the factor is squared.'))
    : q(X((l) => [`Si una de las dos cargas se multiplica por ${f}, la fuerza se multiplica por…`, `Si una de les dues càrregues es multiplica per ${f}, la força es multiplica per…`, `If one of the two charges is multiplied by ${f}, the force is multiplied by…`][l]), f, [f * f, 1 / f, f + 1].map((x) => round(x, 2)).filter((x) => x !== f), T('F es proporcional al producto de las cargas.', 'F és proporcional al producte de les càrregues.', 'F is proportional to the product of the charges.'));
};
export const motionGraph = (): Gen => (r) => {
  const v = pick(r, [1, 2, 3, 4, 5]), x0 = pick(r, [0, 5, 10]); const xs = ['0', '1', '2', '3', '4', '5']; const ys = xs.map((t) => x0 + v * Number(t));
  const vis = { type: 'chart' as const, kind: 'line' as const, x: xs, y: ys, yMax: Math.ceil(Math.max(...ys) / 5) * 5, yStep: 5, xTitle: { key: 'tt_seconds' }, yTitle: { key: 'tt_metres' } };
  return { ...P(X((l) => [`La gráfica posición-tiempo es una recta. ¿Cuál es la velocidad (m/s)?`, `La gràfica posició-temps és una recta. Quina és la velocitat (m/s)?`, `The position–time graph is a straight line. What is the velocity (m/s)?`][l]), v, [ys[5], v * 5, v + 1], T('Pendiente = Δx / Δt: cuántos metros avanza cada segundo.', 'Pendent = Δx / Δt: quants metres avança cada segon.', 'Gradient = Δx ÷ Δt: metres travelled each second.'), 0), visual: vis };
};
