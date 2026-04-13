// Font pairings for the live FontSwitcher preview tool.
// Every font listed here has been verified to ship a Cyrillic subset on Google Fonts,
// so Ukrainian text will render correctly.

export interface FontPairing {
  id: string;
  label: string;
  heading: string; // Google Fonts family name (exact)
  body: string;    // Google Fonts family name (exact)
  mood: string;
  cyrillic: true;
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "aman",
    label: "Aman — Cormorant + Inter",
    heading: "Cormorant Garamond",
    body: "Inter",
    mood: "Quiet luxury, hushed serif elegance",
    cyrillic: true,
  },
  {
    id: "noma",
    label: "Noma — Playfair Display + Source Sans 3",
    heading: "Playfair Display",
    body: "Source Sans 3",
    mood: "High-contrast editorial, fine-dining poise",
    cyrillic: true,
  },
  {
    id: "soho",
    label: "Soho House — Fraunces + Manrope",
    heading: "Fraunces",
    body: "Manrope",
    mood: "Modern members-club warmth",
    cyrillic: true,
  },
  {
    id: "atlas",
    label: "Atlas — DM Serif Display + DM Sans",
    heading: "DM Serif Display",
    body: "DM Sans",
    mood: "Boutique-hotel boldness",
    cyrillic: true,
  },
  {
    id: "puglia",
    label: "Puglia Paradise — Marcellus + Jost",
    heading: "Marcellus",
    body: "Jost",
    mood: "Sun-bleached Mediterranean calm",
    cyrillic: true,
  },
  {
    id: "garden",
    label: "Garden — EB Garamond + Work Sans",
    heading: "EB Garamond",
    body: "Work Sans",
    mood: "Botanical, library-quiet",
    cyrillic: true,
  },
  {
    id: "lakeside",
    label: "Lakeside — Lora + Nunito Sans",
    heading: "Lora",
    body: "Nunito Sans",
    mood: "Soft, friendly retreat",
    cyrillic: true,
  },
  {
    id: "manor",
    label: "Manor — Cardo + IBM Plex Sans",
    heading: "Cardo",
    body: "IBM Plex Sans",
    mood: "Old-world manor with technical clarity",
    cyrillic: true,
  },
  {
    id: "italiana",
    label: "Riviera — Italiana + Public Sans",
    heading: "Italiana",
    body: "Public Sans",
    mood: "Couture thin serif, civic-clean body",
    cyrillic: true,
  },
  {
    id: "tenor",
    label: "Salon — Tenor Sans + Rubik",
    heading: "Tenor Sans",
    body: "Rubik",
    mood: "Refined gallery aesthetic",
    cyrillic: true,
  },
  {
    id: "modern-serif",
    label: "Modern Serif — Fraunces + Inter",
    heading: "Fraunces",
    body: "Inter",
    mood: "Contemporary editorial, very readable",
    cyrillic: true,
  },
  {
    id: "playfair-manrope",
    label: "Soirée — Playfair Display + Manrope",
    heading: "Playfair Display",
    body: "Manrope",
    mood: "Evening elegance, soft sans body",
    cyrillic: true,
  },
  {
    id: "cormorant-jost",
    label: "Provence — Cormorant Garamond + Jost",
    heading: "Cormorant Garamond",
    body: "Jost",
    mood: "Lavender-fields French country",
    cyrillic: true,
  },
  {
    id: "ebgaramond-inter",
    label: "Library — EB Garamond + Inter",
    heading: "EB Garamond",
    body: "Inter",
    mood: "Bookish and authoritative",
    cyrillic: true,
  },
  {
    id: "lora-ibm",
    label: "Atelier — Lora + IBM Plex Sans",
    heading: "Lora",
    body: "IBM Plex Sans",
    mood: "Crafted workshop aesthetic",
    cyrillic: true,
  },
  {
    id: "marcellus-rubik",
    label: "Veranda — Marcellus + Rubik",
    heading: "Marcellus",
    body: "Rubik",
    mood: "Warm classic with friendly body",
    cyrillic: true,
  },
  {
    id: "dmserif-publicsans",
    label: "Gazette — DM Serif Display + Public Sans",
    heading: "DM Serif Display",
    body: "Public Sans",
    mood: "Bold headline newspaper feel",
    cyrillic: true,
  },
  {
    id: "italiana-manrope",
    label: "Couture — Italiana + Manrope",
    heading: "Italiana",
    body: "Manrope",
    mood: "Tall thin glamour",
    cyrillic: true,
  },
  {
    id: "cardo-worksans",
    label: "Chapel — Cardo + Work Sans",
    heading: "Cardo",
    body: "Work Sans",
    mood: "Stone and timber serenity",
    cyrillic: true,
  },
  {
    id: "tenor-nunito",
    label: "Pavillon — Tenor Sans + Nunito Sans",
    heading: "Tenor Sans",
    body: "Nunito Sans",
    mood: "Soft modernist pavilion",
    cyrillic: true,
  },
];

export const DEFAULT_PAIRING_ID = "__default__";
