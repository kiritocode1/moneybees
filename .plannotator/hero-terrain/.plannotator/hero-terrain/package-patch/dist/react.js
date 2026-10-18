"use client";

// src/react.tsx
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef
} from "react";
import { branches, cabinet, dish, elevator, exploded, keyboard, laptop, lockers, padlock, patch, phone, phosphor, riffle, router, slow, terminal, terrain, turntable, vault } from "@lucasmarkes/hairline";
import { jsx } from "react/jsx-runtime";
var useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
function make(name, mount) {
  const Component = forwardRef(function Hairline(props, ref) {
    const { intensity, theme, label, onRead, style, ...attrs } = props;
    const named = label ?? props["aria-label"];
    const el = useRef(null);
    const figure = useRef(null);
    const read = useRef(onRead);
    const set = useCallback((node) => {
      el.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }, [ref]);
    useIsoLayoutEffect(() => {
      read.current = onRead;
    });
    useIsoLayoutEffect(() => {
      const f = mount(el.current, { intensity, theme, label: named, onRead: (text) => read.current?.(text) });
      figure.current = f;
      return () => {
        f.destroy();
        figure.current = null;
      };
    }, []);
    useIsoLayoutEffect(() => {
      figure.current?.update({ intensity, theme, label: named });
    }, [intensity, theme, named]);
    return /* @__PURE__ */ jsx("div", { ...attrs, ref: set, style: { aspectRatio: "5 / 4", ...style } });
  });
  Component.displayName = name;
  return Component;
}
var Riffle = make("Riffle", riffle);
var Terrain = make("Terrain", terrain);
var Exploded = make("Exploded", exploded);
var Phosphor = make("Phosphor", phosphor);
var Slow = make("Slow", slow);
var Turntable = make("Turntable", turntable);
var Keyboard = make("Keyboard", keyboard);
var Elevator = make("Elevator", elevator);
var Phone = make("Phone", phone);
var Laptop = make("Laptop", laptop);
var Terminal = make("Terminal", terminal);
var Cabinet = make("Cabinet", cabinet);
var Branches = make("Branches", branches);
var Vault = make("Vault", vault);
var Lockers = make("Lockers", lockers);
var Padlock = make("Padlock", padlock);
var Patch = make("Patch", patch);
var Dish = make("Dish", dish);
var Router = make("Router", router);
export {
  Branches,
  Cabinet,
  Dish,
  Elevator,
  Exploded,
  Keyboard,
  Laptop,
  Lockers,
  Padlock,
  Patch,
  Phone,
  Phosphor,
  Riffle,
  Router,
  Slow,
  Terminal,
  Terrain,
  Turntable,
  Vault
};
//# sourceMappingURL=react.js.map