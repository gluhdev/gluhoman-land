/**
 * Brand-term overrides applied before/after DeepL translation.
 * - `pre`: replace UA term with a placeholder before sending to DeepL.
 * - `post`: replace placeholder with the desired EN form in DeepL output.
 *
 * This protects brand names, sauna program names, and place names
 * from being machine-translated as common nouns.
 */

export interface GlossaryEntry {
  uk: string;
  en: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  { uk: 'Глухомань', en: 'Glukhoman' },
  { uk: "Здоров'я", en: 'Zdorovya' },
  { uk: 'Класична', en: 'Klasychna' },
  { uk: 'Нижні Млини', en: 'Nyzhni Mlyny' },
  { uk: 'Полтавська область', en: 'Poltava region' },
  { uk: 'грн/год', en: 'UAH/hour' },
  { uk: 'грн', en: 'UAH' },
];

const PLACEHOLDER = (i: number) => `__GLOSSARY_${i}__`;

export function applyPreGlossary(input: string): {
  output: string;
  used: number[];
} {
  let output = input;
  const used: number[] = [];
  GLOSSARY.forEach((entry, i) => {
    if (output.includes(entry.uk)) {
      output = output.split(entry.uk).join(PLACEHOLDER(i));
      used.push(i);
    }
  });
  return { output, used };
}

export function applyPostGlossary(input: string, used: number[]): string {
  let output = input;
  used.forEach((i) => {
    output = output.split(PLACEHOLDER(i)).join(GLOSSARY[i].en);
  });
  return output;
}
