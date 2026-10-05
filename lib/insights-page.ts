/**
 * Copy for /insights, the nav item the Content & Visual Plan lists without a
 * page section. The client has not supplied any letters, notes or
 * factsheets yet, so every card is LOREM: placeholder until they do. Each
 * card's `art` picks one of study 04's drawings (components/drawing/line-art.tsx).
 */

import type { LineArt } from "@/components/drawing/line-art";

const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export type InsightNote = { id: string; kind: string; title: string; text: string; date: string; art: LineArt };

/** PLACEHOLDER notes, six so the grid fills two rows of three. */
export const NOTES: readonly InsightNote[] = (
  [
    ["cylinder", "Lorem ipsum", "Lorem ipsum dolor sit amet"],
    ["fan", "Dolor sit", "Consectetur adipiscing elit sed do"],
    ["distribute", "Amet consectetur", "Eiusmod tempor incididunt ut labore"],
    ["rules", "Lorem ipsum", "Ut enim ad minim veniam quis nostrud"],
    ["burst", "Dolor sit", "Duis aute irure dolor in reprehenderit"],
    ["gather", "Amet consectetur", "Excepteur sint occaecat cupidatat"],
  ] as const
).map(([art, kind, title], index) => ({ id: `note-${index + 1}`, kind, title, text: LOREM_SHORT, date: "Lorem 2026", art }));

export const INSIGHTS_LOREM = { short: LOREM_SHORT } as const;
