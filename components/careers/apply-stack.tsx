"use client";

import StackLoop, { type StackSheet } from "@/components/motion/stack-loop";
import { APPLY_STEPS } from "@/lib/careers";

/*
 * The four How to Apply steps as stack sheets, each with a drawing of the
 * step, laid on the sheet in plane units (a 168 x 168 square, origin at the
 * far corner), as in components/motion/portfolio-sheets.tsx.
 */

const stroke = (colour: string) => ({ fill: "none", stroke: colour, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

/** Find a role: a list of openings under a lens, one of them marked. */
function FindRole(colour: string) {
  return (
    <g>
      {[34, 66, 98].map((y) => (
        <rect key={y} x={28} y={y} width={72} height={20} rx={3} {...stroke(colour)} />
      ))}
      <circle cx={40} cy={76} r={5} fill={colour} />
      <circle cx={116} cy={104} r={18} {...stroke(colour)} />
      <line x1={129} y1={117} x2={142} y2={130} {...stroke(colour)} />
    </g>
  );
}

/** Send your resume: a page with its lines, going out. */
function SendResume(colour: string) {
  return (
    <g>
      <path d="M 34 36 H 82 L 98 52 V 132 H 34 Z" {...stroke(colour)} />
      <path d="M 82 36 V 52 H 98" {...stroke(colour)} />
      <circle cx={52} cy={62} r={7} fill={colour} />
      {[84, 96, 108, 120].map((y) => (
        <line key={y} x1={46} y1={y} x2={86} y2={y} {...stroke(colour)} />
      ))}
      <line x1={108} y1={84} x2={140} y2={84} {...stroke(colour)} />
      <path d="M 128 72 L 140 84 L 128 96" {...stroke(colour)} />
    </g>
  );
}

/** Meet the team: three people across a table. */
function MeetTeam(colour: string) {
  return (
    <g>
      {[46, 84, 122].map((x, index) => (
        <g key={x}>
          <circle cx={x} cy={60} r={11} fill={index === 1 ? colour : "none"} stroke={colour} strokeWidth={2} />
          <path d={`M ${x - 17} 98 A 17 17 0 0 1 ${x + 17} 98`} {...stroke(colour)} />
        </g>
      ))}
      <line x1={24} y1={112} x2={144} y2={112} {...stroke(colour)} />
    </g>
  );
}

/** Hear back: a reply, ticked. */
function HearBack(colour: string) {
  return (
    <g>
      <path d="M 32 44 H 136 V 110 H 76 L 56 128 V 110 H 32 Z" {...stroke(colour)} />
      <path d="M 64 78 L 78 92 L 106 62" fill="none" stroke={colour} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

const APPLY_SHEETS: readonly StackSheet[] = [FindRole, SendResume, MeetTeam, HearBack].map((glyph, index) => ({
  text: APPLY_STEPS[index].name,
  glyph,
}));

/** The How to Apply stack, cycling through the four steps. A client component so the drawings stay functions. */
export default function ApplyStack() {
  return <StackLoop sheets={APPLY_SHEETS} label="The four steps to apply" />;
}
