(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  76183,
  (e) => {
    "use strict";
    let t = Object.freeze({
        trigger: "inview",
        start: null,
        end: null,
        once: !0,
        smooth: 0.3,
        delay: 0,
        reverseSpeed: 1.6,
        split: "words",
        sweep: "each",
        from: "start",
        stagger: 0.06,
        duration: 1.5,
        ease: "power1.inOut",
        revealDelay: 0.05,
        rise: 0.45,
        riseDuration: 1.1,
        riseEase: "expo.out",
        direction: "up",
        pattern: "clusters",
        noise: 0.5,
        scatter: 0.08,
        spread: 0.8,
        pixel: 24,
        levels: 3,
        solid: 0.9,
        accent: "#1700c7",
        accent2: null,
        accentMix: 0.35,
        accentStrength: 1,
        accentWidth: 0.45,
        colorNoise: 0.03,
        sparkle: 0.03,
        flicker: 0.08,
        glitch: 0,
        hover: "none",
        lensRadius: 110,
        seed: 0,
      }),
      i = Object.freeze({
        materialize: {},
        signal: {
          rise: 0,
          stagger: 0.07,
          duration: 1.25,
          ease: "power2.out",
          direction: "right",
          pattern: "scanlines",
          noise: 0.6,
          scatter: 0.04,
          spread: 0.5,
          pixel: 16,
          levels: 3,
          solid: 0.9,
          accent: "#aeff00",
          accentWidth: 0.6,
          colorNoise: 0.04,
          sparkle: 0.18,
          flicker: 0.3,
          glitch: 0.35,
        },
        typewriter: {
          split: "chars",
          stagger: 0.024,
          duration: 0.45,
          ease: "power1.out",
          revealDelay: 0,
          rise: 0,
          direction: "right",
          pattern: "none",
          spread: 0.35,
          pixel: 12,
          levels: 2,
          solid: 1,
          accentWidth: 0.7,
          sparkle: 0,
          flicker: 0.2,
        },
        dissolve: {
          split: "lines",
          sweep: "whole",
          duration: 1.8,
          ease: "sine.inOut",
          rise: 0,
          direction: "none",
          pattern: "random",
          spread: 0.6,
          pixel: 12,
          levels: 2,
          solid: 0,
          accent: null,
          colorNoise: 0,
          sparkle: 0,
          flicker: 0,
        },
        rain: {
          split: "chars",
          from: "random",
          stagger: 0.018,
          duration: 0.95,
          rise: -0.6,
          riseDuration: 1.1,
          direction: "down",
          pattern: "rain",
          noise: 0.55,
          spread: 0.5,
          pixel: 16,
          levels: 3,
          sparkle: 0.2,
        },
        radiate: {
          split: "lines",
          sweep: "whole",
          duration: 2.2,
          ease: "sine.inOut",
          rise: 0,
          direction: "center",
          pattern: "bayer",
          noise: 0.35,
          spread: 0.4,
          pixel: 32,
          levels: 4,
          solid: 0.85,
          accentWidth: 0.5,
        },
        bitmap: {
          split: "lines",
          sweep: "whole",
          stagger: 0.1,
          duration: 1.6,
          ease: "power1.out",
          rise: 0.35,
          riseDuration: 1.4,
          direction: "up",
          pattern: "bayer",
          noise: 0.5,
          spread: 0.35,
          pixel: 8,
          levels: 2,
          solid: 1,
          accent: null,
          colorNoise: 0,
          sparkle: 0,
          flicker: 0,
        },
        glitch: {
          rise: 0,
          stagger: 0.04,
          duration: 1,
          ease: "power2.out",
          direction: "none",
          pattern: "scanlines",
          noise: 1,
          pixel: 24,
          levels: 3,
          solid: 0.9,
          accent: "#ff3d00",
          accent2: "#00d1ff",
          accentMix: 0.5,
          accentWidth: 0.7,
          colorNoise: 0.2,
          sparkle: 0.25,
          flicker: 0.45,
          glitch: 0.85,
        },
        flow: {
          sweep: "whole",
          duration: 2.4,
          ease: "none",
          rise: 0.6,
          direction: "diagonal",
          pattern: "flow",
          noise: 0.55,
          spread: 0.5,
          pixel: 24,
          levels: 4,
        },
      }),
      l = {
        load: { start: null, end: null },
        inview: { start: "top 88%", end: null },
        scrub: { start: "top 92%", end: "bottom 55%" },
        pin: { start: 0, end: 0.85 },
        manual: { start: null, end: null },
      },
      n = ["split", "pixel"],
      s = [
        "sweep",
        "from",
        "stagger",
        "duration",
        "ease",
        "revealDelay",
        "rise",
        "riseDuration",
        "riseEase",
        "seed",
      ],
      r = ["trigger", "start", "end", "once", "delay"],
      a = Object.keys(t),
      o = Object.fromEntries(
        Object.entries({
          trigger: {
            load: ["load", "mount", "auto", "immediate"],
            inview: ["inview", "enter", "view", "scroll", "onenter"],
            scrub: ["scrub", "scrollscrub"],
            pin: ["pin", "pinned", "sticky"],
            manual: ["manual", "controlled", "ref"],
          },
          split: {
            words: ["words", "word", "perword"],
            chars: ["chars", "char", "characters", "letters"],
            lines: ["lines", "line"],
            none: ["none", "block", "overall", "whole", "false"],
          },
          sweep: {
            each: ["each", "unit", "units", "perword"],
            whole: ["whole", "all", "overall", "flow", "block"],
          },
          from: {
            start: ["start", "first"],
            end: ["end", "last"],
            center: ["center", "centre", "middle"],
            edges: ["edges", "outside"],
            random: ["random", "shuffle"],
          },
          direction: {
            up: ["up", "bottomtop", "bottomtotop", "frombottom"],
            down: ["down", "topbottom", "toptobottom", "fromtop"],
            left: ["left", "rightleft", "righttoleft"],
            right: ["right", "leftright", "lefttoright"],
            center: ["center", "centre", "out", "radial", "wavecenter"],
            edges: ["edges", "in", "inward"],
            diagonal: ["diagonal", "diag", "wavediagonal"],
            none: ["none", "pixelonly", "off"],
          },
          pattern: {
            random: ["random", "noise", "wave"],
            clusters: ["clusters", "clustered", "cluster", "blobs"],
            scanlines: ["scanlines", "scanline", "scan"],
            rain: ["rain", "columnrain", "columns"],
            typewriter: ["typewriter", "reading"],
            zigzag: ["zigzag", "boustrophedon"],
            cascade: ["cascade", "stairs", "stripes"],
            bayer: ["bayer", "dither", "ordered"],
            flow: ["flow", "liquid", "organic"],
            none: ["none", "clean", "off"],
          },
          hover: {
            none: ["none", "off", "false", "null"],
            lens: ["lens", "true", "pixel"],
          },
        }).map(([e, t]) => {
          let i = new Map();
          for (let [e, l] of Object.entries(t)) for (let t of l) i.set(t, e);
          return [e, i];
        }),
      );
    function d(e, t, i) {
      let l = o[e].get(
        String(t)
          .toLowerCase()
          .replace(/[^a-z]/g, ""),
      );
      return l || (u(`${e}="${t}" is not recognised, using "${i}"`), i);
    }
    let h = {
      smooth: [0, 5],
      delay: [0, 60],
      reverseSpeed: [0.05, 20],
      stagger: [0, 5],
      duration: [0.01, 60],
      revealDelay: [-5, 5],
      rise: [-4, 4],
      riseDuration: [0.01, 60],
      noise: [0, 1],
      scatter: [0, 1],
      spread: [0.05, 1],
      pixel: [1, 256],
      levels: [0, 6],
      solid: [0, 1],
      accentMix: [0, 1],
      accentStrength: [0, 1],
      accentWidth: [0.01, 0.9],
      colorNoise: [0, 1],
      sparkle: [0, 1],
      flicker: [0, 1],
      glitch: [0, 1],
      lensRadius: [4, 2e3],
      seed: [-1e6, 1e6],
    };
    function c(e) {
      if (null === e || !1 === e || void 0 === e) return null;
      let t = String(e).trim();
      return t && "none" !== t && "transparent" !== t ? t : null;
    }
    function u(e) {}
    function p(e = {}) {
      let n = e.preset ?? "materialize";
      i[n] ||
        (u(
          `preset="${n}" does not exist (${Object.keys(i).join(", ")}), using "materialize"`,
        ),
        (n = "materialize"));
      let s = { ...t, ...i[n] };
      for (let t of a) void 0 !== e[t] && (s[t] = e[t]);
      let r = { preset: n };
      ((r.trigger = d("trigger", s.trigger, t.trigger)),
        (r.split = !1 === s.split ? "none" : d("split", s.split, t.split)),
        (r.sweep = d("sweep", s.sweep, t.sweep)),
        (r.from = d("from", s.from, t.from)),
        (r.direction = d("direction", s.direction, t.direction)),
        (r.pattern = d("pattern", s.pattern, t.pattern)),
        (r.hover = d("hover", s.hover, "none")));
      let o = l[r.trigger];
      for (let e of ((r.start = s.start ?? o.start),
      (r.end = s.end ?? o.end),
      (r.once = !1 !== s.once),
      (r.ease = "string" == typeof s.ease ? s.ease : t.ease),
      (r.riseEase = "string" == typeof s.riseEase ? s.riseEase : t.riseEase),
      (r.accent = c(s.accent)),
      (r.accent2 = c(s.accent2)),
      Object.keys(h)))
        r[e] = (function (e, t, i) {
          let l = "number" == typeof t ? t : parseFloat(t);
          if (!Number.isFinite(l))
            return (
              u(`${e}=${JSON.stringify(t)} is not a number, using ${i}`),
              i
            );
          let [n, s] = h[e];
          return Math.min(s, Math.max(n, l));
        })(e, s[e], t[e]);
      return ((r.levels = Math.round(r.levels)), Object.freeze(r));
    }
    e.s([
      "DEFAULTS",
      0,
      t,
      "DIRECTIONS",
      0,
      ["up", "down", "left", "right", "center", "edges", "diagonal", "none"],
      "FROMS",
      0,
      ["start", "end", "center", "edges", "random"],
      "PATTERNS",
      0,
      [
        "random",
        "clusters",
        "scanlines",
        "rain",
        "typewriter",
        "zigzag",
        "cascade",
        "bayer",
        "flow",
        "none",
      ],
      "PRESETS",
      0,
      i,
      "SPLITS",
      0,
      ["words", "chars", "lines", "none"],
      "SWEEPS",
      0,
      ["each", "whole"],
      "TRIGGERS",
      0,
      ["load", "inview", "scrub", "pin", "manual"],
      "diffOptions",
      0,
      function (e, t) {
        let i = (i) => i.some((i) => e[i] !== t[i]);
        return {
          layout: i(n),
          timeline: i(s),
          trigger: i(r),
          any: a.some((i) => e[i] !== t[i]) || e.preset !== t.preset,
        };
      },
      "propsDiff",
      0,
      function (e) {
        let i = p({ preset: e.preset, trigger: e.trigger }),
          l = {};
        for (let n of ("materialize" !== e.preset && (l.preset = e.preset), a))
          ("trigger" === n ? e.trigger !== t.trigger : e[n] !== i[n]) &&
            (l[n] = e[n]);
        return l;
      },
      "resolveOptions",
      0,
      p,
    ]);
  },
  59235,
  (e) => {
    "use strict";
    class t {
      constructor(e, i, l, n, s = "div") {
        ((this.parent = e),
          (this.object = i),
          (this.property = l),
          (this._disabled = !1),
          (this._hidden = !1),
          (this.initialValue = this.getValue()),
          (this.domElement = document.createElement(s)),
          this.domElement.classList.add("lil-controller"),
          this.domElement.classList.add(n),
          (this.$name = document.createElement("div")),
          this.$name.classList.add("lil-name"),
          (t.nextNameID = t.nextNameID || 0),
          (this.$name.id = `lil-gui-name-${++t.nextNameID}`),
          (this.$widget = document.createElement("div")),
          this.$widget.classList.add("lil-widget"),
          (this.$disable = this.$widget),
          this.domElement.appendChild(this.$name),
          this.domElement.appendChild(this.$widget),
          this.domElement.addEventListener("keydown", (e) =>
            e.stopPropagation(),
          ),
          this.domElement.addEventListener("keyup", (e) => e.stopPropagation()),
          this.parent.children.push(this),
          this.parent.controllers.push(this),
          this.parent.$children.appendChild(this.domElement),
          (this._listenCallback = this._listenCallback.bind(this)),
          this.name(l));
      }
      name(e) {
        return ((this._name = e), (this.$name.textContent = e), this);
      }
      onChange(e) {
        return ((this._onChange = e), this);
      }
      _callOnChange() {
        (this.parent._callOnChange(this),
          void 0 !== this._onChange &&
            this._onChange.call(this, this.getValue()),
          (this._changed = !0));
      }
      onFinishChange(e) {
        return ((this._onFinishChange = e), this);
      }
      _callOnFinishChange() {
        (this._changed &&
          (this.parent._callOnFinishChange(this),
          void 0 !== this._onFinishChange &&
            this._onFinishChange.call(this, this.getValue())),
          (this._changed = !1));
      }
      reset() {
        return (
          this.setValue(this.initialValue),
          this._callOnFinishChange(),
          this
        );
      }
      enable(e = !0) {
        return this.disable(!e);
      }
      disable(e = !0) {
        return (
          e === this._disabled ||
            ((this._disabled = e),
            this.domElement.classList.toggle("lil-disabled", e),
            this.$disable.toggleAttribute("disabled", e)),
          this
        );
      }
      show(e = !0) {
        return (
          (this._hidden = !e),
          (this.domElement.style.display = this._hidden ? "none" : ""),
          this
        );
      }
      hide() {
        return this.show(!1);
      }
      options(e) {
        let t = this.parent.add(this.object, this.property, e);
        return (t.name(this._name), this.destroy(), t);
      }
      min(e) {
        return this;
      }
      max(e) {
        return this;
      }
      step(e) {
        return this;
      }
      decimals(e) {
        return this;
      }
      listen(e = !0) {
        return (
          (this._listening = e),
          void 0 !== this._listenCallbackID &&
            (cancelAnimationFrame(this._listenCallbackID),
            (this._listenCallbackID = void 0)),
          this._listening && this._listenCallback(),
          this
        );
      }
      _listenCallback() {
        this._listenCallbackID = requestAnimationFrame(this._listenCallback);
        let e = this.save();
        (e !== this._listenPrevValue && this.updateDisplay(),
          (this._listenPrevValue = e));
      }
      getValue() {
        return this.object[this.property];
      }
      setValue(e) {
        return (
          this.getValue() !== e &&
            ((this.object[this.property] = e),
            this._callOnChange(),
            this.updateDisplay()),
          this
        );
      }
      updateDisplay() {
        return this;
      }
      load(e) {
        return (this.setValue(e), this._callOnFinishChange(), this);
      }
      save() {
        return this.getValue();
      }
      destroy() {
        (this.listen(!1),
          this.parent.children.splice(this.parent.children.indexOf(this), 1),
          this.parent.controllers.splice(
            this.parent.controllers.indexOf(this),
            1,
          ),
          this.parent.$children.removeChild(this.domElement));
      }
    }
    class i extends t {
      constructor(e, t, i) {
        (super(e, t, i, "lil-boolean", "label"),
          (this.$input = document.createElement("input")),
          this.$input.setAttribute("type", "checkbox"),
          this.$input.setAttribute("aria-labelledby", this.$name.id),
          this.$widget.appendChild(this.$input),
          this.$input.addEventListener("change", () => {
            (this.setValue(this.$input.checked), this._callOnFinishChange());
          }),
          (this.$disable = this.$input),
          this.updateDisplay());
      }
      updateDisplay() {
        return ((this.$input.checked = this.getValue()), this);
      }
    }
    function l(e) {
      let t, i;
      return (
        (t = e.match(/(#|0x)?([a-f0-9]{6})/i))
          ? (i = t[2])
          : (t = e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))
            ? (i =
                parseInt(t[1]).toString(16).padStart(2, 0) +
                parseInt(t[2]).toString(16).padStart(2, 0) +
                parseInt(t[3]).toString(16).padStart(2, 0))
            : (t = e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) &&
              (i = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]),
        !!i && "#" + i
      );
    }
    let n = {
        isPrimitive: !0,
        match: (e) => "number" == typeof e,
        fromHexString: (e) => parseInt(e.substring(1), 16),
        toHexString: (e) => "#" + e.toString(16).padStart(6, 0),
      },
      s = [
        {
          isPrimitive: !0,
          match: (e) => "string" == typeof e,
          fromHexString: l,
          toHexString: l,
        },
        n,
        {
          isPrimitive: !1,
          match: (e) => Array.isArray(e) || ArrayBuffer.isView(e),
          fromHexString(e, t, i = 1) {
            let l = n.fromHexString(e);
            ((t[0] = (((l >> 16) & 255) / 255) * i),
              (t[1] = (((l >> 8) & 255) / 255) * i),
              (t[2] = ((255 & l) / 255) * i));
          },
          toHexString([e, t, i], l = 1) {
            let s = ((e * (l = 255 / l)) << 16) ^ ((t * l) << 8) ^ (i * l);
            return n.toHexString(s);
          },
        },
        {
          isPrimitive: !1,
          match: (e) => Object(e) === e,
          fromHexString(e, t, i = 1) {
            let l = n.fromHexString(e);
            ((t.r = (((l >> 16) & 255) / 255) * i),
              (t.g = (((l >> 8) & 255) / 255) * i),
              (t.b = ((255 & l) / 255) * i));
          },
          toHexString({ r: e, g: t, b: i }, l = 1) {
            let s = ((e * (l = 255 / l)) << 16) ^ ((t * l) << 8) ^ (i * l);
            return n.toHexString(s);
          },
        },
      ];
    class r extends t {
      constructor(e, t, i, n) {
        (super(e, t, i, "lil-color"),
          (this.$input = document.createElement("input")),
          this.$input.setAttribute("type", "color"),
          this.$input.setAttribute("tabindex", -1),
          this.$input.setAttribute("aria-labelledby", this.$name.id),
          (this.$text = document.createElement("input")),
          this.$text.setAttribute("type", "text"),
          this.$text.setAttribute("spellcheck", "false"),
          this.$text.setAttribute("aria-labelledby", this.$name.id),
          (this.$display = document.createElement("div")),
          this.$display.classList.add("lil-display"),
          this.$display.appendChild(this.$input),
          this.$widget.appendChild(this.$display),
          this.$widget.appendChild(this.$text),
          (this._format = (function (e) {
            return s.find((t) => t.match(e));
          })(this.initialValue)),
          (this._rgbScale = n),
          (this._initialValueHexString = this.save()),
          (this._textFocused = !1),
          this.$input.addEventListener("input", () => {
            this._setValueFromHexString(this.$input.value);
          }),
          this.$input.addEventListener("blur", () => {
            this._callOnFinishChange();
          }),
          this.$text.addEventListener("input", () => {
            let e = l(this.$text.value);
            e && this._setValueFromHexString(e);
          }),
          this.$text.addEventListener("focus", () => {
            ((this._textFocused = !0), this.$text.select());
          }),
          this.$text.addEventListener("blur", () => {
            ((this._textFocused = !1),
              this.updateDisplay(),
              this._callOnFinishChange());
          }),
          (this.$disable = this.$text),
          this.updateDisplay());
      }
      reset() {
        return (this._setValueFromHexString(this._initialValueHexString), this);
      }
      _setValueFromHexString(e) {
        if (this._format.isPrimitive) {
          let t = this._format.fromHexString(e);
          this.setValue(t);
        } else
          (this._format.fromHexString(e, this.getValue(), this._rgbScale),
            this._callOnChange(),
            this.updateDisplay());
      }
      save() {
        return this._format.toHexString(this.getValue(), this._rgbScale);
      }
      load(e) {
        return (
          this._setValueFromHexString(e),
          this._callOnFinishChange(),
          this
        );
      }
      updateDisplay() {
        return (
          (this.$input.value = this._format.toHexString(
            this.getValue(),
            this._rgbScale,
          )),
          this._textFocused ||
            (this.$text.value = this.$input.value.substring(1)),
          (this.$display.style.backgroundColor = this.$input.value),
          this
        );
      }
    }
    class a extends t {
      constructor(e, t, i) {
        (super(e, t, i, "lil-function"),
          (this.$button = document.createElement("button")),
          this.$button.appendChild(this.$name),
          this.$widget.appendChild(this.$button),
          this.$button.addEventListener("click", (e) => {
            (e.preventDefault(),
              this.getValue().call(this.object),
              this._callOnChange());
          }),
          this.$button.addEventListener("touchstart", () => {}, {
            passive: !0,
          }),
          (this.$disable = this.$button));
      }
    }
    class o extends t {
      constructor(e, t, i, l, n, s) {
        (super(e, t, i, "lil-number"),
          this._initInput(),
          this.min(l),
          this.max(n));
        const r = void 0 !== s;
        (this.step(r ? s : this._getImplicitStep(), r), this.updateDisplay());
      }
      decimals(e) {
        return ((this._decimals = e), this.updateDisplay(), this);
      }
      min(e) {
        return ((this._min = e), this._onUpdateMinMax(), this);
      }
      max(e) {
        return ((this._max = e), this._onUpdateMinMax(), this);
      }
      step(e, t = !0) {
        return ((this._step = e), (this._stepExplicit = t), this);
      }
      updateDisplay() {
        let e = this.getValue();
        if (this._hasSlider) {
          let t = (e - this._min) / (this._max - this._min);
          ((t = Math.max(0, Math.min(t, 1))),
            (this.$fill.style.width = 100 * t + "%"));
        }
        return (
          this._inputFocused ||
            (this.$input.value =
              void 0 === this._decimals ? e : e.toFixed(this._decimals)),
          this
        );
      }
      _initInput() {
        ((this.$input = document.createElement("input")),
          this.$input.setAttribute("type", "text"),
          this.$input.setAttribute("aria-labelledby", this.$name.id),
          window.matchMedia("(pointer: coarse)").matches &&
            (this.$input.setAttribute("type", "number"),
            this.$input.setAttribute("step", "any")),
          this.$widget.appendChild(this.$input),
          (this.$disable = this.$input));
        let e = () => {
            let e = parseFloat(this.$input.value);
            isNaN(e) ||
              (this._stepExplicit && (e = this._snap(e)),
              this.setValue(this._clamp(e)));
          },
          t = (e) => {
            let t = parseFloat(this.$input.value);
            isNaN(t) ||
              (this._snapClampSetValue(t + e),
              (this.$input.value = this.getValue()));
          },
          i = (e) => {
            ("Enter" === e.key && this.$input.blur(),
              "ArrowUp" === e.code &&
                (e.preventDefault(),
                t(this._step * this._arrowKeyMultiplier(e))),
              "ArrowDown" === e.code &&
                (e.preventDefault(),
                t(-(this._step * this._arrowKeyMultiplier(e) * 1))));
          },
          l = (e) => {
            this._inputFocused &&
              (e.preventDefault(),
              t(this._step * this._normalizeMouseWheel(e)));
          },
          n = !1,
          s,
          r,
          a,
          o,
          d,
          h = (e) => {
            ((s = e.clientX),
              (r = a = e.clientY),
              (n = !0),
              (o = this.getValue()),
              (d = 0),
              window.addEventListener("mousemove", c),
              window.addEventListener("mouseup", u));
          },
          c = (e) => {
            if (n) {
              let t = e.clientX - s;
              Math.abs(e.clientY - r) > 5
                ? (e.preventDefault(),
                  this.$input.blur(),
                  (n = !1),
                  this._setDraggingStyle(!0, "vertical"))
                : Math.abs(t) > 5 && u();
            }
            if (!n) {
              let t = e.clientY - a;
              ((d -= t * this._step * this._arrowKeyMultiplier(e)),
                o + d > this._max
                  ? (d = this._max - o)
                  : o + d < this._min && (d = this._min - o),
                this._snapClampSetValue(o + d));
            }
            a = e.clientY;
          },
          u = () => {
            (this._setDraggingStyle(!1, "vertical"),
              this._callOnFinishChange(),
              window.removeEventListener("mousemove", c),
              window.removeEventListener("mouseup", u));
          },
          p = () => {
            this._inputFocused = !0;
          },
          g = () => {
            ((this._inputFocused = !1),
              this.updateDisplay(),
              this._callOnFinishChange());
          };
        (this.$input.addEventListener("input", e),
          this.$input.addEventListener("keydown", i),
          this.$input.addEventListener("wheel", l, { passive: !1 }),
          this.$input.addEventListener("mousedown", h),
          this.$input.addEventListener("focus", p),
          this.$input.addEventListener("blur", g));
      }
      _initSlider() {
        let e;
        ((this._hasSlider = !0),
          (this.$slider = document.createElement("div")),
          this.$slider.classList.add("lil-slider"),
          (this.$fill = document.createElement("div")),
          this.$fill.classList.add("lil-fill"),
          this.$slider.appendChild(this.$fill),
          this.$widget.insertBefore(this.$slider, this.$input),
          this.domElement.classList.add("lil-has-slider"));
        let t = (e) => {
            let t,
              i,
              l,
              n = this.$slider.getBoundingClientRect(),
              s =
                ((t = n.left),
                (i = n.right),
                (l = this._min),
                ((e - t) / (i - t)) * (this._max - l) + l);
            this._snapClampSetValue(s);
          },
          i = (e) => {
            (this._setDraggingStyle(!0),
              t(e.clientX),
              window.addEventListener("mousemove", l),
              window.addEventListener("mouseup", n));
          },
          l = (e) => {
            t(e.clientX);
          },
          n = () => {
            (this._callOnFinishChange(),
              this._setDraggingStyle(!1),
              window.removeEventListener("mousemove", l),
              window.removeEventListener("mouseup", n));
          },
          s = !1,
          r,
          a,
          o = (e) => {
            (e.preventDefault(),
              this._setDraggingStyle(!0),
              t(e.touches[0].clientX),
              (s = !1));
          },
          d = (e) => {
            e.touches.length > 1 ||
              (this._hasScrollBar
                ? ((r = e.touches[0].clientX),
                  (a = e.touches[0].clientY),
                  (s = !0))
                : o(e),
              window.addEventListener("touchmove", h, { passive: !1 }),
              window.addEventListener("touchend", c));
          },
          h = (e) => {
            s
              ? Math.abs(e.touches[0].clientX - r) >
                Math.abs(e.touches[0].clientY - a)
                ? o(e)
                : (window.removeEventListener("touchmove", h),
                  window.removeEventListener("touchend", c))
              : (e.preventDefault(), t(e.touches[0].clientX));
          },
          c = () => {
            (this._callOnFinishChange(),
              this._setDraggingStyle(!1),
              window.removeEventListener("touchmove", h),
              window.removeEventListener("touchend", c));
          },
          u = this._callOnFinishChange.bind(this),
          p = (t) => {
            if (Math.abs(t.deltaX) < Math.abs(t.deltaY) && this._hasScrollBar)
              return;
            t.preventDefault();
            let i = this._normalizeMouseWheel(t) * this._step;
            (this._snapClampSetValue(this.getValue() + i),
              (this.$input.value = this.getValue()),
              clearTimeout(e),
              (e = setTimeout(u, 400)));
          };
        (this.$slider.addEventListener("mousedown", i),
          this.$slider.addEventListener("touchstart", d, { passive: !1 }),
          this.$slider.addEventListener("wheel", p, { passive: !1 }));
      }
      _setDraggingStyle(e, t = "horizontal") {
        (this.$slider && this.$slider.classList.toggle("lil-active", e),
          document.body.classList.toggle("lil-dragging", e),
          document.body.classList.toggle(`lil-${t}`, e));
      }
      _getImplicitStep() {
        return this._hasMin && this._hasMax
          ? (this._max - this._min) / 1e3
          : 0.1;
      }
      _onUpdateMinMax() {
        !this._hasSlider &&
          this._hasMin &&
          this._hasMax &&
          (this._stepExplicit || this.step(this._getImplicitStep(), !1),
          this._initSlider(),
          this.updateDisplay());
      }
      _normalizeMouseWheel(e) {
        let { deltaX: t, deltaY: i } = e;
        return (
          Math.floor(e.deltaY) !== e.deltaY &&
            e.wheelDelta &&
            ((t = 0),
            (i = (-e.wheelDelta / 120) * (this._stepExplicit ? 1 : 10))),
          t + -i
        );
      }
      _arrowKeyMultiplier(e) {
        let t = this._stepExplicit ? 1 : 10;
        return (e.shiftKey ? (t *= 10) : e.altKey && (t /= 10), t);
      }
      _snap(e) {
        let t = 0;
        return (
          this._hasMin ? (t = this._min) : this._hasMax && (t = this._max),
          (e -= t),
          (e = parseFloat(
            (e = Math.round(e / this._step) * this._step + t).toPrecision(15),
          ))
        );
      }
      _clamp(e) {
        return (
          e < this._min && (e = this._min),
          e > this._max && (e = this._max),
          e
        );
      }
      _snapClampSetValue(e) {
        this.setValue(this._clamp(this._snap(e)));
      }
      get _hasScrollBar() {
        let e = this.parent.root.$children;
        return e.scrollHeight > e.clientHeight;
      }
      get _hasMin() {
        return void 0 !== this._min;
      }
      get _hasMax() {
        return void 0 !== this._max;
      }
    }
    class d extends t {
      constructor(e, t, i, l) {
        (super(e, t, i, "lil-option"),
          (this.$select = document.createElement("select")),
          this.$select.setAttribute("aria-labelledby", this.$name.id),
          (this.$display = document.createElement("div")),
          this.$display.classList.add("lil-display"),
          this.$select.addEventListener("change", () => {
            (this.setValue(this._values[this.$select.selectedIndex]),
              this._callOnFinishChange());
          }),
          this.$select.addEventListener("focus", () => {
            this.$display.classList.add("lil-focus");
          }),
          this.$select.addEventListener("blur", () => {
            this.$display.classList.remove("lil-focus");
          }),
          this.$widget.appendChild(this.$select),
          this.$widget.appendChild(this.$display),
          (this.$disable = this.$select),
          this.options(l));
      }
      options(e) {
        return (
          (this._values = Array.isArray(e) ? e : Object.values(e)),
          (this._names = Array.isArray(e) ? e : Object.keys(e)),
          this.$select.replaceChildren(),
          this._names.forEach((e) => {
            let t = document.createElement("option");
            ((t.textContent = e), this.$select.appendChild(t));
          }),
          this.updateDisplay(),
          this
        );
      }
      updateDisplay() {
        let e = this.getValue(),
          t = this._values.indexOf(e);
        return (
          (this.$select.selectedIndex = t),
          (this.$display.textContent = -1 === t ? e : this._names[t]),
          this
        );
      }
    }
    class h extends t {
      constructor(e, t, i) {
        (super(e, t, i, "lil-string"),
          (this.$input = document.createElement("input")),
          this.$input.setAttribute("type", "text"),
          this.$input.setAttribute("spellcheck", "false"),
          this.$input.setAttribute("aria-labelledby", this.$name.id),
          this.$input.addEventListener("input", () => {
            this.setValue(this.$input.value);
          }),
          this.$input.addEventListener("keydown", (e) => {
            "Enter" === e.code && this.$input.blur();
          }),
          this.$input.addEventListener("blur", () => {
            this._callOnFinishChange();
          }),
          this.$widget.appendChild(this.$input),
          (this.$disable = this.$input),
          this.updateDisplay());
      }
      updateDisplay() {
        return ((this.$input.value = this.getValue()), this);
      }
    }
    var c = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;
    let u = !1;
    class p {
      constructor({
        parent: e,
        autoPlace: t = void 0 === e,
        container: i,
        width: l,
        title: n = "Controls",
        closeFolders: s = !1,
        injectStyles: r = !0,
        touchStyles: a = !0,
      } = {}) {
        if (
          ((this.parent = e),
          (this.root = e ? e.root : this),
          (this.children = []),
          (this.controllers = []),
          (this.folders = []),
          (this._closed = !1),
          (this._hidden = !1),
          (this.domElement = document.createElement("div")),
          this.domElement.classList.add("lil-gui"),
          (this.$title = document.createElement("button")),
          this.$title.classList.add("lil-title"),
          this.$title.setAttribute("aria-expanded", !0),
          this.$title.addEventListener("click", () =>
            this.openAnimated(this._closed),
          ),
          this.$title.addEventListener("touchstart", () => {}, { passive: !0 }),
          (this.$children = document.createElement("div")),
          this.$children.classList.add("lil-children"),
          this.domElement.appendChild(this.$title),
          this.domElement.appendChild(this.$children),
          this.title(n),
          this.parent)
        ) {
          (this.parent.children.push(this),
            this.parent.folders.push(this),
            this.parent.$children.appendChild(this.domElement));
          return;
        }
        (this.domElement.classList.add("lil-root"),
          a && this.domElement.classList.add("lil-allow-touch-styles"),
          !u &&
            r &&
            (!(function (e) {
              let t = document.createElement("style");
              t.innerHTML = e;
              let i = document.querySelector(
                "head link[rel=stylesheet], head style",
              );
              i
                ? document.head.insertBefore(t, i)
                : document.head.appendChild(t);
            })(c),
            (u = !0)),
          i
            ? i.appendChild(this.domElement)
            : t &&
              (this.domElement.classList.add("lil-auto-place", "autoPlace"),
              document.body.appendChild(this.domElement)),
          l && this.domElement.style.setProperty("--width", l + "px"),
          (this._closeFolders = s));
      }
      add(e, t, l, n, s) {
        if (Object(l) === l) return new d(this, e, t, l);
        let r = e[t];
        switch (typeof r) {
          case "number":
            return new o(this, e, t, l, n, s);
          case "boolean":
            return new i(this, e, t);
          case "string":
            return new h(this, e, t);
          case "function":
            return new a(this, e, t);
        }
        console.error(
          `gui.add failed
	property:`,
          t,
          `
	object:`,
          e,
          `
	value:`,
          r,
        );
      }
      addColor(e, t, i = 1) {
        return new r(this, e, t, i);
      }
      addFolder(e) {
        let t = new p({ parent: this, title: e });
        return (this.root._closeFolders && t.close(), t);
      }
      load(e, t = !0) {
        return (
          e.controllers &&
            this.controllers.forEach((t) => {
              !(t instanceof a) &&
                t._name in e.controllers &&
                t.load(e.controllers[t._name]);
            }),
          t &&
            e.folders &&
            this.folders.forEach((t) => {
              t._title in e.folders && t.load(e.folders[t._title]);
            }),
          this
        );
      }
      save(e = !0) {
        let t = { controllers: {}, folders: {} };
        return (
          this.controllers.forEach((e) => {
            if (!(e instanceof a)) {
              if (e._name in t.controllers)
                throw Error(
                  `Cannot save GUI with duplicate property "${e._name}"`,
                );
              t.controllers[e._name] = e.save();
            }
          }),
          e &&
            this.folders.forEach((e) => {
              if (e._title in t.folders)
                throw Error(
                  `Cannot save GUI with duplicate folder "${e._title}"`,
                );
              t.folders[e._title] = e.save();
            }),
          t
        );
      }
      open(e = !0) {
        return (
          this._setClosed(!e),
          this.$title.setAttribute("aria-expanded", !this._closed),
          this.domElement.classList.toggle("lil-closed", this._closed),
          this
        );
      }
      close() {
        return this.open(!1);
      }
      _setClosed(e) {
        this._closed !== e && ((this._closed = e), this._callOnOpenClose(this));
      }
      show(e = !0) {
        return (
          (this._hidden = !e),
          (this.domElement.style.display = this._hidden ? "none" : ""),
          this
        );
      }
      hide() {
        return this.show(!1);
      }
      openAnimated(e = !0) {
        return (
          this._setClosed(!e),
          this.$title.setAttribute("aria-expanded", !this._closed),
          requestAnimationFrame(() => {
            let t = this.$children.clientHeight;
            ((this.$children.style.height = t + "px"),
              this.domElement.classList.add("lil-transition"));
            let i = (e) => {
              e.target === this.$children &&
                ((this.$children.style.height = ""),
                this.domElement.classList.remove("lil-transition"),
                this.$children.removeEventListener("transitionend", i));
            };
            this.$children.addEventListener("transitionend", i);
            let l = e ? this.$children.scrollHeight : 0;
            (this.domElement.classList.toggle("lil-closed", !e),
              requestAnimationFrame(() => {
                this.$children.style.height = l + "px";
              }));
          }),
          this
        );
      }
      title(e) {
        return ((this._title = e), (this.$title.textContent = e), this);
      }
      reset(e = !0) {
        return (
          (e ? this.controllersRecursive() : this.controllers).forEach((e) =>
            e.reset(),
          ),
          this
        );
      }
      onChange(e) {
        return ((this._onChange = e), this);
      }
      _callOnChange(e) {
        (this.parent && this.parent._callOnChange(e),
          void 0 !== this._onChange &&
            this._onChange.call(this, {
              object: e.object,
              property: e.property,
              value: e.getValue(),
              controller: e,
            }));
      }
      onFinishChange(e) {
        return ((this._onFinishChange = e), this);
      }
      _callOnFinishChange(e) {
        (this.parent && this.parent._callOnFinishChange(e),
          void 0 !== this._onFinishChange &&
            this._onFinishChange.call(this, {
              object: e.object,
              property: e.property,
              value: e.getValue(),
              controller: e,
            }));
      }
      onOpenClose(e) {
        return ((this._onOpenClose = e), this);
      }
      _callOnOpenClose(e) {
        (this.parent && this.parent._callOnOpenClose(e),
          void 0 !== this._onOpenClose && this._onOpenClose.call(this, e));
      }
      destroy() {
        (this.parent &&
          (this.parent.children.splice(this.parent.children.indexOf(this), 1),
          this.parent.folders.splice(this.parent.folders.indexOf(this), 1)),
          this.domElement.parentElement &&
            this.domElement.parentElement.removeChild(this.domElement),
          Array.from(this.children).forEach((e) => e.destroy()));
      }
      controllersRecursive() {
        let e = Array.from(this.controllers);
        return (
          this.folders.forEach((t) => {
            e = e.concat(t.controllersRecursive());
          }),
          e
        );
      }
      foldersRecursive() {
        let e = Array.from(this.folders);
        return (
          this.folders.forEach((t) => {
            e = e.concat(t.foldersRecursive());
          }),
          e
        );
      }
    }
    var g = e.i(76183);
    let m = [
      "none",
      "power1.in",
      "power1.out",
      "power1.inOut",
      "power2.in",
      "power2.out",
      "power2.inOut",
      "power3.in",
      "power3.out",
      "power3.inOut",
      "power4.in",
      "power4.out",
      "power4.inOut",
      "expo.in",
      "expo.out",
      "expo.inOut",
      "circ.in",
      "circ.out",
      "circ.inOut",
      "sine.in",
      "sine.out",
      "sine.inOut",
      "back.out(1.4)",
      "back.inOut(1.2)",
      "elastic.out(1, 0.5)",
      "steps(4)",
      "steps(8)",
      "steps(16)",
    ];
    function v(e) {
      return {
        ...e,
        start: null === e.start ? "" : String(e.start),
        end: null === e.end ? "" : String(e.end),
        accentOn: null !== e.accent,
        accent: e.accent ?? "#1700c7",
        accent2On: null !== e.accent2,
        accent2: e.accent2 ?? "#ff3d00",
      };
    }
    function f(e) {
      let t = (e) =>
          "" === e ? void 0 : Number.isFinite(Number(e)) ? Number(e) : e,
        { accentOn: i, accent2On: l, ...n } = e;
      return {
        ...n,
        start: t(e.start),
        end: t(e.end),
        accent: i ? e.accent : null,
        accent2: l ? e.accent2 : null,
      };
    }
    function b(e, t, i, l) {
      let n = v((0, g.resolveOptions)(l));
      e.add(n, "preset", Object.keys(g.PRESETS))
        .name("Preset")
        .onChange((t) => {
          let i = {
            trigger: n.trigger,
            start: n.start || void 0,
            end: n.end || void 0,
          };
          (Object.assign(n, v((0, g.resolveOptions)({ preset: t, ...i }))),
            e.controllersRecursive().forEach((e) => e.updateDisplay()));
        });
      let s = e.addFolder("Trigger");
      (s.add(n, "trigger", g.TRIGGERS).name("Type"),
        s.add(n, "start").name("Start"),
        s.add(n, "end").name("End"),
        s.add(n, "once").name("Once"),
        s.add(n, "smooth", 0, 2, 0.01).name("Scrub smooth"),
        s.add(n, "delay", 0, 3, 0.05).name("Delay"),
        s.add(n, "reverseSpeed", 0.25, 5, 0.05).name("Reverse speed"));
      let r = e.addFolder("Motion");
      (r.add(n, "split", g.SPLITS).name("Split"),
        r.add(n, "sweep", g.SWEEPS).name("Sweep"),
        r.add(n, "from", g.FROMS).name("Stagger from"),
        r.add(n, "stagger", 0, 0.3, 0.001).name("Stagger"),
        r.add(n, "duration", 0.1, 5, 0.05).name("Duration"),
        r.add(n, "ease", m).name("Ease"),
        r.add(n, "revealDelay", -1, 2, 0.01).name("Pixel delay"),
        r.add(n, "rise", -2, 2, 0.05).name("Rise"),
        r.add(n, "riseDuration", 0.1, 5, 0.05).name("Rise duration"),
        r.add(n, "riseEase", m).name("Rise ease"));
      let a = e.addFolder("Pixels");
      (a.add(n, "direction", g.DIRECTIONS).name("Direction"),
        a.add(n, "pattern", g.PATTERNS).name("Pattern"),
        a.add(n, "noise", 0, 1, 0.01).name("Pattern amount"),
        a.add(n, "scatter", 0, 1, 0.01).name("Scatter"),
        a.add(n, "spread", 0.05, 1, 0.01).name("Front width"),
        a.add(n, "pixel", 2, 96, 1).name("Pixel size"),
        a.add(n, "levels", 0, 6, 1).name("Levels"),
        a.add(n, "solid", 0, 1, 0.01).name("Solid"));
      let o = e.addFolder("Colour");
      (o.add(n, "accentOn").name("Accent"),
        o.addColor(n, "accent").name("Accent colour"),
        o.add(n, "accent2On").name("Second accent"),
        o.addColor(n, "accent2").name("Second colour"),
        o.add(n, "accentMix", 0, 1, 0.01).name("Second share"),
        o.add(n, "accentStrength", 0, 1, 0.01).name("Strength"),
        o.add(n, "accentWidth", 0.02, 0.9, 0.01).name("Heat length"),
        o.add(n, "colorNoise", 0, 1, 0.01).name("Colour noise"),
        o.add(n, "sparkle", 0, 1, 0.01).name("Sparkle"),
        o.add(n, "flicker", 0, 1, 0.01).name("Flicker"),
        o.add(n, "glitch", 0, 1, 0.01).name("Glitch"));
      let d = e.addFolder("Interaction");
      for (let e of (d.add(n, "hover", ["none", "lens"]).name("Hover"),
      d.add(n, "lensRadius", 20, 400, 1).name("Lens radius"),
      d.add(n, "seed", 0, 100, 1).name("Seed"),
      [s, r, o, d]))
        e.close();
      (e
        .add({ replay: () => t.control(i, "restart") }, "replay")
        .name("↻ Replay"),
        e
          .add(
            {
              copy: () => {
                let e = Object.entries(
                  (0, g.propsDiff)((0, g.resolveOptions)(f(n))),
                )
                  .map(([e, t]) =>
                    "string" == typeof t
                      ? `${e}="${t}"`
                      : !0 === t
                        ? e
                        : `${e}={${JSON.stringify(t)}}`,
                  )
                  .join("\n");
                (console.log(`[pixel-reveal] props:
${e}`),
                  navigator.clipboard?.writeText(e).catch(() => {}));
              },
            },
            "copy",
          )
          .name("⧉ Copy props"),
        e.onChange(() => t.update(i, f(n))));
    }
    e.s(
      [
        "createGui",
        0,
        function ({ stage: e, el: t, options: i, title: l = "Pixel Reveal" }) {
          let n = new p({ title: l });
          return (b(n, e, t, i), n);
        },
        "createPicker",
        0,
        function ({ stage: e }) {
          let t = new p({ title: "Pixel Reveal" }),
            i = null,
            l = [],
            n = { element: "" },
            s = (n) => {
              let s = l.find((e) => e.name === n);
              if (!s) return;
              (i?.destroy(),
                b(
                  (i = t.addFolder("Options")),
                  e,
                  s.el,
                  e.elements().find((e) => e.el === s.el)?.options ?? {},
                ));
              let r =
                s.el.getBoundingClientRect().top +
                window.scrollY -
                0.3 * window.innerHeight;
              e.lenis
                ? e.lenis.scrollTo(Math.max(0, r), { duration: 1.2 })
                : window.scrollTo({ top: Math.max(0, r), behavior: "smooth" });
            },
            r = t.add(n, "element", []).name("Element"),
            a = () => {
              ((l = e
                .elements()
                .map(({ el: e }, t) => ({
                  el: e,
                  name: `${String(t + 1).padStart(2, "0")} \xb7 ${e.textContent.trim().slice(0, 32)}`,
                }))),
                (r = r
                  .options(l.map((e) => e.name))
                  .name("Element")
                  .onChange(s)),
                !n.element &&
                  l.length &&
                  ((n.element = l[0].name), r.updateDisplay(), s(n.element)));
            };
          return (t.add({ list: a }, "list").name("↻ Refresh list"), a(), t);
        },
      ],
      59235,
    );
  },
]);
