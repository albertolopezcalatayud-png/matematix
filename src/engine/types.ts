export type Lang = 'es' | 'ca' | 'en';

/** A piece of text to translate: a message key plus the values it needs. */
export interface Msg { key: string; vars?: Record<string, string | number> }

/** What is drawn next to an exercise. Always one model per concept (the number line is the backbone). */
export type Visual =
  | { type: 'dots'; groups: number[] } // groups of dots in tens frames, e.g. [7] or [6, 7]
  | { type: 'line'; min: number; max: number; marks: number[]; labels: number[]; point?: number; jumps?: [number, number][]; scale?: number; frac?: boolean }
  | { type: 'tens'; tens: number; ones: number } // tens rods and ones cubes
  | { type: 'frame'; filled: number } // a ten frame with some cells filled (friends of 10)
  /** The bar model of a word problem: rows of bars split in parts; a part or the total can be "?" */
  /** The unit staircase: each step down is ×10 (or ×1000 between kg and g); from → to highlighted */
  | { type: 'ladder'; units: string[]; from: number; to: number; factor?: number }
  /** A chart: bars (rain, a climograph) or a line (temperature, position–time); x labels can be messages */
  | { type: 'chart'; kind: 'bar' | 'line'; x: (string | Msg)[]; y: number[]; yMax: number; yStep: number; xTitle?: Msg; yTitle?: Msg; mark?: number; slope?: boolean }
  /** A balance: what is on each pan stays equal */
  | { type: 'balance'; left: string; right: string }
  /** A table of data (a timetable, a class's marks, a list in order). mark / mark2 = [row, column]; row -1 is the header row */
  | { type: 'table'; head: (string | Msg)[]; rows: (string | Msg)[][]; mark?: [number, number]; mark2?: [number, number] }
  | { type: 'bars'; rows: { parts: { v: number; label: string; shade?: boolean }[]; name?: Msg }[]; total?: string; diff?: string; groups?: boolean };

export type Item = {
  prompt: Msg;
  /** The strategy, said in words: shown in guided practice and after a mistake. */
  hint: Msg;
  /** Picture always shown with the exercise. */
  visual?: Visual;
  /** Picture of the strategy with these same numbers: shown in guided practice and after a mistake. */
  aid?: Visual;
} & (
  | { kind: 'place'; min: number; max: number; marks: number[]; labels: number[]; target: number; tol: number; aidMarks?: number[]; aidLabels?: number[]; scale?: number; frac?: boolean }
  | { kind: 'choice'; options: number[]; answer: number; optionLabels?: Msg[] }
  | { kind: 'number'; answer: number; thread?: Thread }
);

/** Answer by stretching a thread along the line: from `start`, in jumps of `step`, inside [min, max]. */
export interface Thread { min: number; max: number; start: number; step: number }

export type Phase = 'model' | 'guided' | 'independent';

export interface Station {
  id: string;
  island: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  title: Msg;
  /** A worked example: the steps the narrator explains, each with the same visual growing. */
  model: (rng: () => number) => { steps: { say: Msg; visual?: Visual }[] };
  make: (rng: () => number, guided: boolean) => Item;
}
