"use client";

/*
 * React bindings for the Pixel Reveal port (see engine.ts for provenance).
 * `<PixelRevealRoot>` owns one lazily loaded engine for the page;
 * `<PixelReveal>` registers an element with it. Same props as the original
 * package, so it can replace this port without touching call sites.
 */
import {
  createContext,
  type ElementType,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Command, Engine, Handlers } from "./engine";
import { OPTION_KEYS, type PixelRevealOptions } from "./options";

type Entry = { options: PixelRevealOptions; handlers: Handlers; queue: [Command, number | undefined][] };

/**
 * Keeps registrations until the engine chunk has loaded, then hands them over.
 * Without WebGL 2, or under reduced motion, every element falls back to its
 * plain DOM text by being marked static.
 */
function createStage() {
  const entries = new Map<HTMLElement, Entry>();
  let engine: Engine | null = null;
  let started = false;
  let fallback = false;
  let generation = 0;
  const showPlain = () => {
    fallback = true;
    for (const el of entries.keys()) el.setAttribute("data-pr-state", "static");
  };
  return {
    start(options: { maxDpr: number }) {
      if (started) return;
      started = true;
      const run = ++generation;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return showPlain();
      import("./engine").then(
        ({ Engine }) => {
          if (run !== generation) return;
          try {
            engine = new Engine(options);
          } catch {
            return showPlain();
          }
          for (const [el, entry] of entries) {
            engine.add(el, entry.options, entry.handlers);
            for (const [command, value] of entry.queue) engine.control(el, command, value);
            entry.queue.length = 0;
          }
        },
        () => showPlain(),
      );
    },
    stop() {
      started = false;
      fallback = false;
      generation += 1;
      engine?.destroy();
      engine = null;
    },
    add(el: HTMLElement, options: PixelRevealOptions, handlers: Handlers) {
      entries.set(el, { options, handlers, queue: [] });
      if (fallback) el.setAttribute("data-pr-state", "static");
      else engine?.add(el, options, handlers);
    },
    update(el: HTMLElement, options: PixelRevealOptions) {
      const entry = entries.get(el);
      if (!entry) return;
      entry.options = options;
      engine?.update(el, options);
    },
    remove(el: HTMLElement) {
      entries.delete(el);
      engine?.remove(el);
    },
    control(el: HTMLElement, command: Command, value?: number) {
      if (engine) return engine.control(el, command, value);
      if (command !== "progress") entries.get(el)?.queue.push([command, value]);
      return undefined;
    },
  };
}

type Stage = ReturnType<typeof createStage>;
const StageContext = createContext<Stage | null>(null);

/** Mount once near the root. Everything inside can use `<PixelReveal>`. */
export function PixelRevealRoot({ children, maxDpr = 3 }: { children: ReactNode; maxDpr?: number }) {
  const [stage] = useState(createStage);
  useEffect(() => {
    stage.start({ maxDpr });
    return () => stage.stop();
  }, [stage, maxDpr]);
  return <StageContext.Provider value={stage}>{children}</StageContext.Provider>;
}

export type PixelRevealHandle = {
  element: HTMLElement | null;
  play: () => void;
  reverse: () => void;
  restart: () => void;
  replay: () => void;
  pause: () => void;
  seek: (progress: number) => void;
  readonly progress: number;
};

type Props = PixelRevealOptions & {
  as?: ElementType;
  children: ReactNode;
  /** Drives the reveal directly, 0 to 1. */
  progress?: number;
  onStart?: () => void;
  onComplete?: () => void;
  ref?: Ref<PixelRevealHandle>;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

export function PixelReveal({ as = "div", children, progress, onStart, onComplete, ref, ...rest }: Props) {
  const stage = useContext(StageContext);
  const elRef = useRef<HTMLElement>(null);
  const handlers = useRef<Handlers["current"]>({});
  const options: Record<string, unknown> = {};
  const dom: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) (OPTION_KEYS.has(key) ? options : dom)[key] = value;
  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    handlers.current = { onStart, onComplete };
  });
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (!stage) {
      el.setAttribute("data-pr-state", "static");
      return;
    }
    stage.add(el, JSON.parse(optionsKey), handlers);
    return () => stage.remove(el);
    // Registration happens once per element; option changes go through `update` below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);
  useEffect(() => {
    if (stage && elRef.current) stage.update(elRef.current, JSON.parse(optionsKey));
  }, [stage, optionsKey]);
  useEffect(() => {
    if (stage && elRef.current && typeof progress === "number") stage.control(elRef.current, "seek", progress);
  }, [stage, progress]);
  useImperativeHandle(ref, () => {
    const send = (command: Command, value?: number) => (stage && elRef.current ? stage.control(elRef.current, command, value) : undefined);
    return {
      get element() {
        return elRef.current;
      },
      play: () => void send("play"),
      reverse: () => void send("reverse"),
      restart: () => void send("restart"),
      replay: () => void send("restart"),
      pause: () => void send("pause"),
      seek: (p: number) => void send("seek", p),
      get progress() {
        return (send("progress") as number | undefined) ?? 0;
      },
    };
  }, [stage]);

  const Tag = as;
  return (
    <Tag {...dom} ref={elRef} data-pixel-reveal="">
      {children}
    </Tag>
  );
}
