"use client";

import { CircleAlert, CircleCheck, Columns3, List, Mail, Phone, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { type DragEvent, type KeyboardEvent, type MouseEvent, useEffect, useRef, useState, useTransition } from "react";
import { ScreenIntro } from "@/components/admin/screen-intro";
import { Button } from "@/components/fluid/button";
import { DropdownContent, DropdownMenu, DropdownTrigger } from "@/components/fluid/dropdown";
import { MenuItem } from "@/components/fluid/menu-item";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/fluid/table";
import { TabsSubtle, TabsSubtleItem } from "@/components/fluid/tabs-subtle";
import { moveDealTo } from "@/lib/crm/deal-actions";
import { type DealBoard, type DealCard, type DealKind, OPEN_STAGES } from "@/lib/crm/deal-board";
import { dueLabel } from "@/lib/crm/due";
import { DEAL_STAGES, type DealStage, labelOf } from "@/lib/crm/vocabulary";
import { MoveDialog, needsAsking } from "./move-dialog";

/*
 * Desk › Deals, laid out like Enquiries: a count line, tabs (PMS and
 * Flyingbee AIF on equal footing), then the deals on a board by stage or as
 * a list. A card shows who, how much, the next task (red when overdue, "No
 * next step" in amber), and how long it has sat at its stage. Drag a card to
 * move it, or focus it and press M; Meeting, Documents sent, Invested and
 * Lost ask one thing first (move-dialog.tsx). A card opens the person.
 */

/** Reloads the board this often, so tasks done elsewhere and the overdue lines stay current. */
const REFRESH_MS = 60_000;

const COLUMNS = [...OPEN_STAGES, "invested"] as const satisfies readonly DealStage[];
const KINDS: { key: DealKind; label: string }[] = [
  { key: "pms", label: "PMS" },
  { key: "aif", label: "Flyingbee AIF" },
];
const VIEWS = [
  { key: "board", label: "Board", icon: Columns3 },
  { key: "list", label: "List", icon: List },
] as const;

const AMBER = "text-[#f0c060]";
const isOpen = (stage: DealStage) => (OPEN_STAGES as readonly DealStage[]).includes(stage);
const crore = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const total = (cards: DealCard[]) => Number(cards.reduce((sum, card) => sum + (card.amount ?? 0), 0).toFixed(2));
const daysText = (days: number) => (days === 0 ? "today" : `${days} ${days === 1 ? "day" : "days"}`);
/** A click that began inside this element's own DOM; the Move menu is portalled, and React still passes its clicks up to the card. */
const own = (event: MouseEvent<HTMLElement>) => event.currentTarget.contains(event.target as Node);
const dayMonth = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

export function DealsScreen({ board, view }: { board: DealBoard; view: "board" | "list" }) {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => (setNow(new Date()), router.refresh()), REFRESH_MS);
    return () => clearInterval(timer);
  }, [router]);

  // Moves show at once; the next refresh brings the server's copy, which agrees, and the moves made on the old copy are dropped.
  const [moves, setMoves] = useState<{ on: DealCard[]; stages: Record<number, DealStage> }>({ on: board.cards, stages: {} });
  const moved = moves.on === board.cards ? moves.stages : {};
  const setMoved = (id: number, stage: DealStage) => setMoves((now) => ({ on: board.cards, stages: { ...(now.on === board.cards ? now.stages : {}), [id]: stage } }));
  const cards = board.cards.map((card) => (moved[card.id] && moved[card.id] !== card.stage ? { ...card, stage: moved[card.id], stageLabel: labelOf(DEAL_STAGES, moved[card.id]), days: 0 } : card));

  const [moving, setMoving] = useState<{ card: DealCard; to: DealStage } | null>(null);
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startMoving] = useTransition();

  const go = (next: { kind?: DealKind; view?: "board" | "list"; owner?: number | null }) => {
    const query = new URLSearchParams();
    const kind = next.kind ?? board.kind;
    const shown = next.view ?? view;
    const owner = next.owner === undefined ? board.owner : next.owner;
    if (kind !== "pms") query.set("kind", kind);
    if (shown !== "board") query.set("view", shown);
    if (owner) query.set("owner", String(owner));
    router.push(`/admin/deals${query.size ? `?${query}` : ""}`);
  };
  const openPerson = (card: DealCard) => card.person && router.push(`/admin/people/${card.person.id}`);

  const move = (card: DealCard, to: DealStage) => {
    if (to === card.stage) return;
    setNotice(null);
    setError(null);
    if (needsAsking(to)) return setMoving({ card, to });
    setMoved(card.id, to);
    startMoving(async () => {
      const result = await moveDealTo(card.id, { stage: to });
      if (!result.ok) {
        setMoved(card.id, card.stage);
        return setError(result.error);
      }
      router.refresh();
    });
  };

  const open = cards.filter((card) => isOpen(card.stage));
  const loose = open.filter((card) => !card.next).length;
  const kindLabel = KINDS.find(({ key }) => key === board.kind)?.label ?? "";
  const ownerName = board.owner ? board.staff.find((member) => member.id === board.owner)?.name : null;
  const line = open.length
    ? `Rs. ${crore(total(open))} crore in ${open.length} open ${kindLabel} ${open.length === 1 ? "deal" : "deals"}${ownerName ? ` of ${ownerName}` : ""}.${loose ? ` ${loose} ${loose === 1 ? "has" : "have"} no next step.` : ""}`
    : `No open ${kindLabel} deals${ownerName ? ` of ${ownerName}` : ""}.`;

  const shared = { now, menuFor, setMenuFor, move, openPerson };

  return (
    <>
      <header className="mt-8 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Deals</h1>
          <p className="mt-1 text-body text-muted-foreground">{line}</p>
          <ScreenIntro screen="deals" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TabsSubtle selectedIndex={KINDS.findIndex(({ key }) => key === board.kind)} onSelect={(index) => go({ kind: KINDS[index].key })} idPrefix="deals-kind">
            {KINDS.map(({ key, label }, index) => (
              <TabsSubtleItem key={key} index={index} label={board.counts[key] ? `${label} ${board.counts[key]}` : label} />
            ))}
          </TabsSubtle>
          <TabsSubtle selectedIndex={VIEWS.findIndex(({ key }) => key === view)} onSelect={(index) => go({ view: VIEWS[index].key })} idPrefix="deals-view">
            {VIEWS.map(({ key, label, icon }, index) => (
              <TabsSubtleItem key={key} index={index} icon={icon} label={label} />
            ))}
          </TabsSubtle>
          <div className="w-[180px]">
            <Select value={String(board.owner ?? 0)} onValueChange={(id) => go({ owner: Number(id) || null })}>
              <SelectTrigger aria-label="Whose deals" />
              <SelectContent>
                <SelectItem index={0} value="0">
                  Everyone
                </SelectItem>
                {board.staff.map((member, index) => (
                  <SelectItem key={member.id} index={index + 1} value={String(member.id)}>
                    {member.id === board.me ? `${member.name} (you)` : member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div aria-live="polite">
        {notice ? <p className="mb-4 text-body text-foreground">{notice}</p> : null}
        {error ? <p className="mb-4 text-body text-destructive">{error}</p> : null}
      </div>

      {view === "board" ? <Board cards={cards} {...shared} /> : <DealList cards={cards} {...shared} />}

      {board.cards.length === 0 ? (
        <p className="mt-4 text-body text-muted-foreground">A deal starts from an enquiry with Turn into a deal, or from the Deal panel on a person.</p>
      ) : null}

      {moving && moving.card.person ? (
        <MoveDialog
          deal={{ id: moving.card.id, kind: board.kind, personId: moving.card.person.id, personName: moving.card.person.name, hasEmail: Boolean(moving.card.person.email), hasEnquiry: moving.card.hasEnquiry, amount: moving.card.amount, hasPortal: moving.card.person.hasPortal }}
          to={moving.to}
          canInvite={board.canInvite}
          onClose={() => setMoving(null)}
          onDone={({ notice: said, open: letter }) => {
            setMoved(moving.card.id, moving.to);
            setMoving(null);
            setNotice(said ?? null);
            if (letter) router.push(letter);
            else router.refresh();
          }}
        />
      ) : null}
    </>
  );
}

type Shared = {
  now: Date;
  menuFor: number | null;
  setMenuFor: (id: number | null) => void;
  move: (card: DealCard, to: DealStage) => void;
  openPerson: (card: DealCard) => void;
};

// ---------------------------------------------------------------- board

/**
 * One column per stage up to Invested (this quarter), with its count and
 * total; Lost (the last 90 days) is folded at the end and opens on click.
 * Arrow keys or h/j/k/l move between cards, Enter opens one, M moves it.
 */
function Board({ cards, ...shared }: { cards: DealCard[] } & Shared) {
  const [lostOpen, setLostOpen] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<DealStage | null>(null);
  const area = useRef<HTMLDivElement>(null);
  // Opened, Lost sits past the right edge on most screens; bring it into view.
  useEffect(() => {
    if (lostOpen) area.current?.querySelector("[aria-label='Lost']")?.scrollIntoView({ behavior: "smooth", inline: "end", block: "nearest" });
  }, [lostOpen]);
  const stages: DealStage[] = [...COLUMNS, ...(lostOpen ? (["lost"] as const) : [])];
  const byStage = (stage: DealStage) => cards.filter((card) => card.stage === stage).sort((a, b) => (b.days ?? 0) - (a.days ?? 0));

  const drop = {
    over: (stage: DealStage) => (event: DragEvent) => {
      if (dragging === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setOver(stage);
    },
    leave: (event: DragEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(null);
    },
    on: (stage: DealStage) => (event: DragEvent) => {
      event.preventDefault();
      const card = cards.find((each) => each.id === Number(event.dataTransfer.getData("text/plain")));
      setOver(null);
      setDragging(null);
      if (card) shared.move(card, stage);
    },
  };

  // The card at (column, row), or the nearest row in a column that has cards, stepping past empty ones.
  const focusAt = (column: number, row: number, step: number) => {
    for (let at = column; at >= 0 && at < stages.length; at += step || 1) {
      const found = area.current?.querySelectorAll<HTMLElement>(`[data-column="${at}"]`);
      if (found?.length) return found[Math.min(Math.max(row, 0), found.length - 1)]?.focus();
      if (!step) return;
    }
  };
  const onCardKey = (event: KeyboardEvent<HTMLElement>, card: DealCard, column: number, row: number) => {
    if (event.target !== event.currentTarget) return;
    const arrow = { ArrowDown: [0, 1], j: [0, 1], ArrowUp: [0, -1], k: [0, -1], ArrowRight: [1, 0], l: [1, 0], ArrowLeft: [-1, 0], h: [-1, 0] }[event.key];
    if (arrow) {
      event.preventDefault();
      return focusAt(column + arrow[0], row + arrow[1], arrow[0]);
    }
    if (event.key === "Enter") shared.openPerson(card);
    if (event.key === "m" || event.key === "M") {
      event.preventDefault();
      shared.setMenuFor(card.id);
    }
  };

  return (
    <div ref={area} className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-4">
      {stages.map((stage, column) => {
        const here = byStage(stage);
        return (
          <section
            key={stage}
            aria-label={labelOf(DEAL_STAGES, stage)}
            onDragOver={drop.over(stage)}
            onDragLeave={drop.leave}
            onDrop={drop.on(stage)}
            className={`flex min-h-[460px] min-w-[200px] flex-1 flex-col rounded-xl border p-2 transition-colors ${over === stage ? "border-foreground/40 bg-accent/60" : "bg-card/40"}`}
          >
            <h2 className="mb-2 flex items-baseline justify-between gap-2 px-1.5 pt-1 text-body font-semibold text-foreground">
              <span>
                {stage === "invested" ? "Invested" : labelOf(DEAL_STAGES, stage)} <span className="font-normal text-muted-foreground tabular-nums">{here.length}</span>
              </span>
              <span className="text-caption font-normal text-muted-foreground tabular-nums">{here.length ? `Rs. ${crore(total(here))} cr` : null}</span>
            </h2>
            {stage === "invested" ? <p className="-mt-1.5 mb-2 px-1.5 text-caption text-muted-foreground">This quarter</p> : null}
            {stage === "lost" ? (
              <button type="button" onClick={() => setLostOpen(false)} className="-mt-1.5 mb-2 cursor-pointer self-start border-0 bg-transparent px-1.5 text-caption text-muted-foreground hover:text-foreground">
                Last 90 days. Fold away
              </button>
            ) : null}
            <ul className="m-0 grid list-none gap-2 p-0">
              {here.map((card, row) => (
                <li key={card.id}>
                  <Card
                    card={card}
                    column={column}
                    dragging={dragging === card.id}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", String(card.id));
                      event.dataTransfer.effectAllowed = "move";
                      setDragging(card.id);
                    }}
                    onDragEnd={() => (setDragging(null), setOver(null))}
                    onKeyDown={(event) => onCardKey(event, card, column, row)}
                    {...shared}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {lostOpen ? null : (
        // A div, not a <button>: Chrome does not hand a dragged card to a button, and this is where cards are dropped to lose them.
        <div
          role="button"
          tabIndex={0}
          onClick={() => setLostOpen(true)}
          onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && (event.preventDefault(), setLostOpen(true))}
          onDragOver={drop.over("lost")}
          onDragLeave={drop.leave}
          onDrop={drop.on("lost")}
          aria-label={`Lost, ${byStage("lost").length} in the last 90 days. Open`}
          className={`flex min-h-[460px] w-11 shrink-0 cursor-pointer items-start justify-center rounded-xl border pt-3 text-body text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:border-foreground/50 ${over === "lost" ? "border-foreground/40 bg-accent/60 text-foreground" : "border-border bg-card/40"}`}
        >
          <span className="[writing-mode:vertical-rl] rotate-180">
            Lost <span className="tabular-nums">{byStage("lost").length}</span>
          </span>
        </div>
      )}
    </div>
  );
}

function NextStep({ card, now, inline = false }: { card: DealCard; now: Date; inline?: boolean }) {
  const line = `${inline ? "" : "mt-1 "}flex items-start gap-1.5 text-caption`;
  const icon = { size: 13, "aria-hidden": true, className: "mt-[2px] shrink-0" } as const;
  if (card.stage === "invested") {
    return (
      <p className={`${line} text-muted-foreground`}>
        <CircleCheck {...icon} />
        {card.investedOn ? `Invested ${dayMonth(card.investedOn)}` : "Invested"}
      </p>
    );
  }
  if (card.stage === "lost") return <p className={`${line} text-muted-foreground`}>{card.lost ?? "Lost"}</p>;
  if (!card.next) {
    return (
      <p className={`${line} ${AMBER}`}>
        <CircleAlert {...icon} />
        No next step
      </p>
    );
  }
  const Icon = { call: Phone, email: Mail, meeting: Users, todo: CircleCheck }[card.next.kind ?? "todo"] ?? CircleCheck;
  return (
    <p className={`${line} ${card.next.overdue ? "text-destructive" : "text-muted-foreground"}`}>
      <Icon {...icon} />
      <span>{card.next.overdue ? `Overdue: ${card.next.title}` : `${card.next.title} · ${dueLabel(new Date(card.next.dueAt), now)}`}</span>
    </p>
  );
}

function Initials({ owner }: { owner: DealCard["owner"] }) {
  if (!owner) return <span className="text-caption text-muted-foreground">Nobody</span>;
  return (
    <span title={owner.name} className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
      {owner.initials}
    </span>
  );
}

/** The Move to menu: on the card or row, from its Move button or the M key. */
function MoveMenu({ card, menuFor, setMenuFor, move }: { card: DealCard } & Pick<Shared, "menuFor" | "setMenuFor" | "move">) {
  const current = DEAL_STAGES.findIndex(({ value }) => value === card.stage);
  return (
    <DropdownMenu open={menuFor === card.id} onOpenChange={(open) => setMenuFor(open ? card.id : null)} size="compact">
      <DropdownTrigger
        render={
          <Button size="compact" variant="ghost" aria-label={`Move ${card.person?.name ?? "this deal"}`} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 data-[state=open]:opacity-100">
            Move
          </Button>
        }
      />
      <DropdownContent checkedIndex={current} align="end">
        {DEAL_STAGES.map((stage, index) => (
          <MenuItem key={stage.value} index={index} label={stage.label} checked={stage.value === card.stage} onSelect={() => move(card, stage.value)} />
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
}

function Card({
  card,
  column,
  dragging,
  now,
  menuFor,
  setMenuFor,
  move,
  openPerson,
  onDragStart,
  onDragEnd,
  onKeyDown,
}: { card: DealCard; column: number; dragging: boolean; onDragStart: (event: DragEvent) => void; onDragEnd: () => void; onKeyDown: (event: KeyboardEvent<HTMLElement>) => void } & Shared) {
  const stale = isOpen(card.stage) && card.days !== null && card.days >= 14;
  return (
    <article
      tabIndex={0}
      draggable
      data-column={column}
      aria-label={`${card.person?.name ?? "Deal"}, ${card.stageLabel}${card.amount ? `, Rs. ${crore(card.amount)} crore` : ""}`}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onKeyDown={onKeyDown}
      onClick={(event) => own(event) && openPerson(card)}
      className={`group cursor-pointer rounded-lg border bg-card p-2.5 outline-none transition-opacity hover:border-foreground/25 focus-visible:border-foreground/50 ${dragging ? "opacity-40" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate text-body font-medium text-foreground">{card.person?.name ?? "No person"}</span>
        {card.amount ? <span className="shrink-0 text-body text-foreground tabular-nums">Rs. {crore(card.amount)} cr</span> : null}
      </div>
      {card.entity ? <p className="truncate text-caption text-muted-foreground">{card.entity}</p> : null}
      <NextStep card={card} now={now} />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`text-caption tabular-nums ${stale ? AMBER : "text-muted-foreground"}`}>{!isOpen(card.stage) || card.days === null ? null : stale ? `${card.days} days here` : daysText(card.days)}</span>
        <span className="flex items-center gap-1">
          <MoveMenu card={card} menuFor={menuFor} setMenuFor={setMenuFor} move={move} />
          <Initials owner={card.owner} />
        </span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------- list

const STAGE_ORDER = DEAL_STAGES.map(({ value }) => value) as DealStage[];

/** The Enquiries table for deals: arrow keys or j/k move, Enter opens the person, M moves the deal. */
function DealList({ cards, now, menuFor, setMenuFor, move, openPerson }: { cards: DealCard[] } & Shared) {
  const rows = [...cards].sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage) || (b.days ?? 0) - (a.days ?? 0));
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const onRowKey = (event: KeyboardEvent<HTMLTableRowElement>, index: number) => {
    if (event.target !== event.currentTarget) return;
    const step = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }[event.key];
    if (step) {
      event.preventDefault();
      rowRefs.current[Math.min(Math.max(index + step, 0), rows.length - 1)]?.focus();
    } else if (event.key === "Enter") openPerson(rows[index]);
    else if (event.key === "m" || event.key === "M") {
      event.preventDefault();
      setMenuFor(rows[index].id);
    }
  };

  if (!rows.length) return <p className="rounded-xl border border-dashed px-6 py-10 text-center text-body text-muted-foreground">No deals here.</p>;
  return (
    <Table aria-label="Deals">
      <TableHeader>
        <TableRow>
          <TableHead>Person</TableHead>
          <TableHead className="w-[170px]">Product</TableHead>
          <TableHead className="w-[140px]">Stage</TableHead>
          <TableHead className="w-[110px] text-right">Amount</TableHead>
          <TableHead className="w-[110px]">At stage</TableHead>
          <TableHead>Next step</TableHead>
          <TableHead className="w-[150px]">Owner</TableHead>
          <TableHead className="w-[72px]">
            <span className="sr-only">Move</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((card, index) => {
          const stale = isOpen(card.stage) && card.days !== null && card.days >= 14;
          return (
            <TableRow
              key={card.id}
              index={index}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              tabIndex={0}
              onClick={(event) => own(event) && openPerson(card)}
              onKeyDown={(event) => onRowKey(event, index)}
              className="group cursor-pointer outline-none focus-visible:[&>td]:text-foreground"
            >
              <TableCell>
                <span className="text-foreground">{card.person?.name ?? "No person"}</span>
                {card.entity ? <span className="ml-2 text-caption text-muted-foreground">{card.entity}</span> : null}
              </TableCell>
              <TableCell>{card.product}</TableCell>
              <TableCell>{card.stageLabel}</TableCell>
              <TableCell className="text-right tabular-nums">{card.amount ? `Rs. ${crore(card.amount)} cr` : <span className="text-muted-foreground">Not set</span>}</TableCell>
              <TableCell className={`tabular-nums ${stale ? AMBER : ""}`}>{card.days === null || !isOpen(card.stage) ? "" : daysText(card.days)}</TableCell>
              <TableCell>
                <NextStep card={card} now={now} inline />
              </TableCell>
              <TableCell>{card.owner?.name ?? <span className="text-muted-foreground">Nobody</span>}</TableCell>
              <TableCell>
                <MoveMenu card={card} menuFor={menuFor} setMenuFor={setMenuFor} move={move} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
