function Kh() {
    let t = document.querySelectorAll("[data-loader]"),
        e = document.querySelector("[data-load-video] video");
    if (!t.length) return;
    e.pause();
    let r = "true" === sessionStorage.getItem("tge.quickpreload");
    t.forEach(t => {
        let e = t.querySelectorAll("[data-loader-item]"),
            n = t.querySelectorAll("[data-loader-logo] path"),
            i = t.querySelectorAll("[data-loader-svg]"),
            o = ai.timeline({
                defaults: {
                    ease: "none"
                }
            });
        ai.set(e, {
            opacity: 1
        }), r ? (o.set(i, {
            opacity: 0
        }), o.set(e, {
            opacity: 0
        }), o.to(n, {
            delay: .2,
            opacity: 0,
            duration: .1,
            stagger: {
                each: .05,
                from: "random"
            },
            onStart: () => t.classList.add("is-finished")
        }, 0)) : (o.to(i, {
            opacity: 1,
            duration: .15
        }, .55), e.forEach((t, e) => {
            let r = t.innerText;
            t.innerText = "", o.to(t, {
                duration: .64,
                scrambleText: {
                    text: r,
                    chars: "QWERTZUIOPASDFGHJKLYXCVBNM",
                    speed: .8
                }
            }, 1 === e ? 0 : .108 * (e + 1))
        }), o.to({}, {
            duration: 1.25
        }), o.to(e, {
            duration: .56,
            scrambleText: {
                text: " ",
                chars: "QWERTZUIOPASDFGHJKLYXCVBNM",
                speed: .8
            }
        }).to(i, {
            opacity: 0,
            duration: .1,
            onStart: () => t.classList.add("is-finished")
        }, "<").to(n, {
            opacity: 0,
            duration: .1,
            stagger: {
                each: .05,
                from: "random"
            }
        }, "<+=0.4")), o.add(() => {
            requestAnimationFrame(() => {
                qh.start(), document.documentElement.classList.add("is-ready"),
                    function() {
                        let t = document.querySelectorAll("[data-load]");
                        t.length && t.forEach(t => {
                            let e = t.querySelector("[data-load-subline]"),
                                r = t.querySelectorAll("[data-load-nav-link]"),
                                n = t.querySelector("[data-load-video] video"),
                                i = ai.matchMedia(),
                                o = ai.timeline(),
                                s = ai.timeline();
                            i.add("(prefers-reduced-motion: reduce)", () => {
                                n.play()
                            }), r.forEach((t, e) => {
                                i.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
                                    let r = t.innerText;
                                    return t.innerText = "", o.to(t, {
                                        ease: "none",
                                        duration: 1,
                                        delay: .65,
                                        scrambleText: {
                                            text: r,
                                            chars: r,
                                            speed: 1
                                        }
                                    }, .08 * e), () => {
                                        t.innerText = r
                                    }
                                })
                            }), i.add("(prefers-reduced-motion: no-preference)", () => {
                                let t = e.innerText;
                                return e.innerText = "", s.to(e, {
                                    ease: "none",
                                    duration: 1,
                                    delay: .35,
                                    scrambleText: {
                                        text: t,
                                        chars: t,
                                        speed: .9
                                    },
                                    onStart: () => {
                                        ai.delayedCall(.025, () => n.play())
                                    }
                                }, "<"), () => {
                                    e.innerText = t
                                }
                            })
                        })
                    }()
            })
        })
    }), r || sessionStorage.setItem("tge.quickpreload", "true")
}
ai.registerPlugin(bc, qu);
var Zh, Qh = new Set;
window.addEventListener("resize", () => {
    clearTimeout(Zh), Zh = setTimeout(() => {
        Qh.forEach(t => t())
    }, 60)
});
var Jh = t => (Qh.add(t), () => Qh.delete(t)),
    td = () => {
        let t = document.documentElement.style,
            e = .01 * document.body.clientWidth;
        t.setProperty("--vw", `${e}px`)
    };

function ed() {
    let t = document.querySelectorAll("[data-button]");
    t.length && t.forEach(t => {
        let e = t.querySelector("[data-button-text]") || t;
        if (!e) return;
        let r = Number(t.dataset.speed) || 46,
            n = e.textContent,
            i = null,
            o = !1;

        function s(t) {
            return !t || t.length < 2 ? t : t.slice(-1) + t.slice(0, -1)
        }
        t.addEventListener("mouseenter", function() {
            if (o) return;
            o = !0;
            let t = function(t) {
                    return (t.match(/\S+|\s+/g) || []).map(t => {
                        if (/^\s+$/.test(t)) return {
                            type: "ws",
                            raw: t
                        };
                        let e = t.match(/^([\p{L}'’]+)(.*)$/u);
                        if (!e) return {
                            type: "other",
                            raw: t
                        };
                        let r = e[1];
                        return {
                            type: "word",
                            letters: r,
                            trailing: e[2] || "",
                            len: r.length,
                            stepsDone: 0
                        }
                    })
                }(n),
                a = Math.max(0, ...t.filter(t => "word" === t.type).map(t => t.len)),
                l = 0;
            i = setInterval(() => {
                let r = function(t) {
                    let e = !0;
                    for (let r of t) "word" === r.type && (r.stepsDone < r.len && (r.letters = s(r.letters), r.stepsDone++), r.stepsDone < r.len && (e = !1));
                    return e
                }(t);
                e.textContent = function(t) {
                    return t.map(t => "word" === t.type ? t.letters + t.trailing : t.raw).join("")
                }(t), l++, (r || l >= a) && (clearInterval(i), i = null, o = !1, e.textContent = n)
            }, r)
        })
    })
}

function rd() {
    ai.utils.toArray(document.querySelectorAll('[data-centered-slider="wrapper"]')).forEach(t => {
        let e, r, n, i = ai.utils.toArray(t.querySelectorAll('[data-centered-slider="slide"]')),
            o = ai.utils.toArray(t.querySelectorAll('[data-centered-slider="bullet"]')),
            s = t.querySelector('[data-centered-slider="prev-button"]'),
            a = t.querySelector('[data-centered-slider="next-button"]'),
            l = 0,
            u = "false" === t.getAttribute("data-slider-autoplay") && parseFloat(t.getAttribute("data-slider-autoplay-duration")) || 0;
        i.forEach((t, e) => {
            t.setAttribute("id", `slide-${e}`)
        }), o && o.length > 0 && o.forEach((t, e) => {
            t.setAttribute("aria-controls", `slide-${e}`), t.setAttribute("aria-selected", e === l ? "true" : "false")
        });
        let c = function(t, e) {
            let r;
            return t = ai.utils.toArray(t), e = e || {}, ai.context(() => {
                let n, i, o, s = e.onChange,
                    a = 0,
                    l = ai.timeline({
                        repeat: e.repeat,
                        onUpdate: s && function() {
                            let e = l.closestIndex();
                            a !== e && (a = e, s(t[e], e))
                        },
                        paused: e.paused,
                        defaults: {
                            ease: "none"
                        },
                        onReverseComplete: () => l.totalTime(l.rawTime() + 100 * l.duration())
                    }),
                    u = t.length,
                    c = t[0].offsetLeft,
                    h = [],
                    d = [],
                    p = [],
                    f = [],
                    g = 0,
                    m = !1,
                    D = e.center,
                    v = 100 * (e.speed || 1),
                    y = !1 === e.snap ? t => t : ai.utils.snap(e.snap || 1),
                    _ = 0,
                    x = !0 === D ? t[0].parentNode : ai.utils.toArray(D)[0] || t[0].parentNode,
                    w = () => t[u - 1].offsetLeft + f[u - 1] / 100 * d[u - 1] - c + p[0] + t[u - 1].offsetWidth * ai.getProperty(t[u - 1], "scaleX") + (parseFloat(e.paddingRight) || 0),
                    b = () => {
                        let e, r = x.getBoundingClientRect();
                        t.forEach((t, n) => {
                            d[n] = parseFloat(ai.getProperty(t, "width", "px")), f[n] = y(parseFloat(ai.getProperty(t, "x", "px")) / d[n] * 100 + ai.getProperty(t, "xPercent")), e = t.getBoundingClientRect(), p[n] = e.left - (n ? r.right : r.left), r = e
                        }), ai.set(t, {
                            xPercent: t => f[t]
                        }), n = w()
                    },
                    E = () => {
                        _ = D ? l.duration() * (x.offsetWidth / 2) / n : 0, D && h.forEach((t, e) => {
                            h[e] = i(l.labels["label" + e] + l.duration() * d[e] / 2 / n - _)
                        })
                    },
                    C = (t, e, r) => {
                        let n, i = t.length,
                            o = 1e10,
                            s = 0;
                        for (; i--;) n = Math.abs(t[i] - e), n > r / 2 && (n = r - n), n < o && (o = n, s = i);
                        return s
                    },
                    T = () => {
                        let e, r, o, s, a;
                        for (l.clear(), e = 0; e < u; e++) r = t[e], o = f[e] / 100 * d[e], s = r.offsetLeft + o - c + p[0], a = s + d[e] * ai.getProperty(r, "scaleX"), l.to(r, {
                            xPercent: y((o - a) / d[e] * 100),
                            duration: a / v
                        }, 0).fromTo(r, {
                            xPercent: y((o - a + n) / d[e] * 100)
                        }, {
                            xPercent: f[e],
                            duration: (o - a + n - o) / v,
                            immediateRender: !1
                        }, a / v).add("label" + e, s / v), h[e] = s / v;
                        i = ai.utils.wrap(0, l.duration())
                    },
                    F = t => {
                        let e = l.progress();
                        l.progress(0, !0), b(), t && T(), E(), t && l.draggable ? l.time(h[g], !0) : l.progress(e, !0)
                    },
                    S = () => F(!0);

                function A(t, e) {
                    e = e || {}, Math.abs(t - g) > u / 2 && (t += t > g ? -u : u);
                    let r = ai.utils.wrap(0, u, t),
                        n = h[r];
                    return n > l.time() != t > g && t !== g && (n += l.duration() * (t > g ? 1 : -1)), (n < 0 || n > l.duration()) && (e.modifiers = {
                        time: i
                    }), g = r, e.overwrite = !0, ai.killTweensOf(o), 0 === e.duration ? l.time(i(n)) : l.tweenTo(n, e)
                }
                if (ai.set(t, {
                        x: 0
                    }), b(), T(), E(), window.addEventListener("resize", S), l.toIndex = (t, e) => A(t, e), l.closestIndex = t => {
                        let e = C(h, l.time(), l.duration());
                        return t && (g = e, m = !1), e
                    }, l.current = () => m ? l.closestIndex(!0) : g, l.next = t => A(l.current() + 1, t), l.previous = t => A(l.current() - 1, t), l.times = h, l.progress(1, !0).progress(0, !0), e.reversed && (l.vars.onReverseComplete(), l.reverse()), e.draggable && "function" == typeof ys) {
                    o = document.createElement("div");
                    let e, r, s, a, u, c, d = ai.utils.wrap(0, 1),
                        p = () => l.progress(d(r + (s.startX - s.x) * e)),
                        f = () => l.closestIndex(!0);
                    void 0 === xh && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club"), s = ys.create(o, {
                        trigger: t[0].parentNode,
                        type: "x",
                        onPressInit() {
                            let t = this.x;
                            ai.killTweensOf(l), c = !l.paused(), l.pause(), r = l.progress(), F(), e = 1 / n, u = r / -e - t, ai.set(o, {
                                x: r / -e
                            })
                        },
                        onDrag: p,
                        onThrowUpdate: p,
                        overshootTolerance: 0,
                        inertia: !0,
                        snap(t) {
                            if (Math.abs(r / -e - this.x) < 10) return a + u;
                            let n = -t * e * l.duration(),
                                o = i(n),
                                s = h[C(h, o, l.duration())] - o;
                            return Math.abs(s) > l.duration() / 2 && (s += s < 0 ? l.duration() : -l.duration()), a = (n + s) / l.duration() / -e, a
                        },
                        onRelease() {
                            f(), s.isThrowing && (m = !0)
                        },
                        onThrowComplete: () => {
                            f(), c && l.play()
                        }
                    })[0], l.draggable = s
                }
                return l.closestIndex(!0), a = g, s && s(t[g], g), r = l, () => window.removeEventListener("resize", S)
            }), r
        }(i, {
            paused: !0,
            draggable: !1,
            center: !0,
            onChange: (t, n) => {
                l = n, e && e.classList.remove("active"), t.classList.add("active"), e = t, o && o.length > 0 && (r && r.classList.remove("active"), o[n] && (o[n].classList.add("active"), r = o[n]), o.forEach((t, e) => {
                    t.setAttribute("aria-selected", e === n ? "true" : "false")
                }))
            }
        });

        function h() {
            if (u > 0 && !n) {
                let t = () => {
                    c.next({
                        ease: "osmo-ease",
                        duration: .725
                    }), n = ai.delayedCall(u, t)
                };
                n = ai.delayedCall(u, t)
            }
        }

        function d() {
            n && (n.kill(), n = null)
        }
        c.toIndex(2, {
            duration: .01
        }), Cu.create({
            trigger: t,
            start: "top bottom",
            end: "bottom top",
            onEnter: h,
            onLeave: d,
            onEnterBack: h,
            onLeaveBack: d
        }), t.addEventListener("mouseenter", d), t.addEventListener("mouseleave", () => {
            Cu.isInViewport(t) && h()
        }), i.forEach((t, e) => {
            t.addEventListener("click", () => {
                c.toIndex(e, {
                    ease: "osmo-ease",
                    duration: .725
                })
            })
        }), o && o.length > 0 && o.forEach((t, e) => {
            t.addEventListener("click", () => {
                c.toIndex(e, {
                    ease: "osmo-ease",
                    duration: .725
                }), r && r.classList.remove("active"), t.classList.add("active"), r = t, o.forEach((t, r) => {
                    t.setAttribute("aria-selected", r === e ? "true" : "false")
                })
            })
        }), s && s.addEventListener("click", () => {
            let t = l - 1;
            t < 0 && (t = i.length - 1), c.toIndex(t, {
                ease: "osmo-ease",
                duration: .725
            })
        }), a && a.addEventListener("click", () => {
            let t = l + 1;
            t >= i.length && (t = 0), c.toIndex(t, {
                ease: "osmo-ease",
                duration: .725
            })
        })
    })
}

function nd() {
    let t = document.querySelectorAll("[data-swap]");
    t.length && t.forEach(t => {
        let e = t.querySelectorAll("[data-swap-item]"),
            r = Array.from(e, t => t.getBoundingClientRect().width),
            n = 0,
            i = e => {
                n = e, t.style.setProperty("--width", r[e] + "px")
            };
        ai.set(e, {
            yPercent: t => t ? 100 : 0,
            opacity: t => t ? 0 : 1
        }), i(0);
        let o = ai.timeline({
            defaults: {
                ease: "power2.inOut",
                duration: .35
            },
            repeat: -1,
            scrollTrigger: {
                trigger: t,
                start: "top bottom",
                end: "bottom top",
                toggleActions: "play pause resume pause"
            }
        });
        e.forEach((t, r) => {
            let n = e[r + 1];
            n ? o.to(t, {
                yPercent: -100,
                opacity: 0,
                onComplete: () => ai.set(t, {
                    yPercent: 100,
                    opacity: 0
                })
            }, "+=1.35").to(n, {
                yPercent: 0,
                opacity: 1,
                onStart: () => i(r + 1)
            }, "<") : o.to(t, {
                yPercent: -100,
                opacity: 0
            }, r ? "+=1.35" : 0).to(e[0], {
                yPercent: 0,
                opacity: 1,
                onStart: () => i(0)
            }, "<")
        });
        Jh(() => {
            e.forEach((t, e) => {
                r[e] = t.getBoundingClientRect().width
            }), i(n)
        })
    })
}
ai.registerPlugin(Cu, Yh), ai.registerPlugin(Yh), ai.registerPlugin(Yh), ai.registerPlugin(Cu), ai.registerPlugin(Cu, Yh, dc, bc), ai.registerPlugin(Cu, Yh, bc), ai.registerPlugin(Cu), ai.registerPlugin(Cu), ai.registerPlugin(Cu), ai.registerPlugin(Cu), ai.registerPlugin(Ti, Cu, ys, xh), Ti.create("osmo-ease", "0.625, 0.05, 0, 1"), ai.registerPlugin(bc), ai.registerPlugin(bc), ai.registerPlugin(bc, Yh), ai.registerPlugin(Cu), ai.registerPlugin(Cu);

function id() {
    (qh = new $h({
        lerp: .18,
        autoRaf: !0,
        anchors: {
            offset: 100
        }
    })).scrollTo(0, {
            immediate: !0,
            force: !0
        }), [...document.querySelectorAll("a[href]")].filter(t => t.href.includes("/#")).forEach(t => {
            t.addEventListener("click", e => {
                var r;
                e.preventDefault();
                let n = "#" + (null == (r = t.href) ? void 0 : r.split("/#").at(-1));
                qh.scrollTo(n)
            })
        }), document.querySelectorAll("[data-marquee-scroll-direction-target]").forEach(t => {
            let e = t.querySelector("[data-marquee-collection-target]"),
                r = t.querySelector("[data-marquee-scroll-target]");
            if (!e || !r) return;
            let {
                marqueeSpeed: n,
                marqueeDirection: i,
                marqueeDuplicate: o,
                marqueeScrollSpeed: s
            } = t.dataset, a = parseFloat(n), l = "right" === i ? 1 : -1, u = parseInt(o || 0), c = parseFloat(s), h = window.innerWidth < 479 ? .25 : window.innerWidth < 991 ? .5 : 1, d = a * (e.offsetWidth / window.innerWidth) * h;
            if (r.style.marginLeft = -1 * c + "%", r.style.width = 2 * c + 100 + "%", u > 0) {
                let t = document.createDocumentFragment();
                for (let r = 0; r < u; r++) t.appendChild(e.cloneNode(!0));
                r.appendChild(t)
            }
            let p = t.querySelectorAll("[data-marquee-collection-target]"),
                f = ai.to(p, {
                    xPercent: -100,
                    repeat: -1,
                    duration: d,
                    ease: "linear"
                }).totalProgress(.5);
            ai.set(p, {
                xPercent: 1 === l ? 100 : -100
            }), f.timeScale(l), f.play(), t.setAttribute("data-marquee-status", "normal"), Cu.create({
                trigger: t,
                start: "top bottom",
                end: "bottom top",
                onUpdate: e => {
                    let r = 1 === e.direction,
                        n = r ? -l : l;
                    f.timeScale(n), t.setAttribute("data-marquee-status", r ? "normal" : "inverted")
                }
            });
            let g = ai.timeline({
                    scrollTrigger: {
                        trigger: t,
                        start: "0% 100%",
                        end: "100% 0%",
                        scrub: 0
                    }
                }),
                m = -1 === l ? c : -c,
                D = -m;
            g.fromTo(r, {
                x: `${m}vw`
            }, {
                x: `${D}vw`,
                ease: "none"
            })
        }),
        function() {
            let t = document.querySelectorAll("[data-video] video");
            t.length && t.forEach(t => {
                Cu.create({
                    trigger: t,
                    start: "top bottom",
                    end: "bottom top",
                    onEnter: () => t.play(),
                    onEnterBack: () => t.play(),
                    onLeave: () => t.pause(),
                    onLeaveBack: () => t.pause()
                })
            })
        }(),
        function() {
            let t = document.querySelectorAll("[data-inview]"),
                e = "is-inview";
            t.length && t.forEach(t => {
                Cu.create({
                    trigger: t,
                    start: "top bottom",
                    end: "bottom top",
                    onEnter: () => t.classList.add(e),
                    onEnterBack: () => t.classList.add(e),
                    onLeave: () => t.classList.remove(e),
                    onLeaveBack: () => t.classList.remove(e)
                })
            })
        }(),
        function() {
            let t = document.querySelectorAll("[data-svg-lines]"),
                e = "is-inview";
            t.length && t.forEach(t => {
                let r = t.querySelectorAll("path");
                ai.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
                    ai.to(r, {
                        keyframes: {
                            "0%": {
                                color: "#fff",
                                opacity: .25
                            },
                            "30%": {
                                color: "#8898e7"
                            },
                            "45%": {
                                color: "#fff",
                                opacity: .25
                            },
                            "100%": {
                                color: "#202020",
                                opacity: 1
                            }
                        },
                        duration: 1.2,
                        ease: "none",
                        repeatRefresh: !0,
                        repeat: -1,
                        stagger: {
                            each: .05,
                            from: "random"
                        },
                        scrollTrigger: {
                            trigger: t,
                            start: "top bottom",
                            end: "bottom top",
                            toggleActions: "play pause resume pause",
                            onEnter: () => t.classList.add(e),
                            onEnterBack: () => t.classList.add(e),
                            onLeave: () => t.classList.remove(e),
                            onLeaveBack: () => t.classList.remove(e)
                        }
                    })
                })
            })
        }(),
        function() {
            let t = document.querySelectorAll("[data-svg-plus]"),
                e = "is-inview";
            t.length && t.forEach(t => {
                let r = t.querySelectorAll("path");
                ai.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
                    ai.set(r, {
                        opacity: 0
                    }), ai.to(r, {
                        keyframes: {
                            "0%": {
                                color: "#fff",
                                opacity: .55
                            },
                            "30%": {
                                color: "#8898e7"
                            },
                            "45%": {
                                color: "#fff",
                                opacity: .55
                            },
                            "100%": {
                                color: "#202020",
                                opacity: 0
                            }
                        },
                        duration: 1.2,
                        ease: "none",
                        repeatRefresh: !0,
                        repeat: -1,
                        stagger: {
                            each: .05,
                            from: "top right"
                        },
                        scrollTrigger: {
                            trigger: t,
                            start: "top bottom",
                            end: "bottom top",
                            toggleActions: "play pause resume pause",
                            onEnter: () => t.classList.add(e),
                            onEnterBack: () => t.classList.add(e),
                            onLeave: () => t.classList.remove(e),
                            onLeaveBack: () => t.classList.remove(e)
                        }
                    })
                })
            })
        }(), rd()
}

function od() {
    (function() {
        let t = document.querySelectorAll("[data-hero]");
        t.length && t.forEach(t => {
            let e = t.querySelector("[data-hero-title]");
            new Yh(e, {
                type: "words",
                tag: "span",
                wordsClass: "split-word",
                propIndex: !0
            })
        })
    })(),
    function() {
        let t = document.querySelectorAll("[data-benefits]");
        t.length && t.forEach(t => {
            let e = [...t.querySelectorAll("[data-benefits-title]")],
                r = t.querySelector("[data-benefits-number]"),
                n = [...t.querySelectorAll("[data-benefits-text-top]")],
                i = [...t.querySelectorAll("[data-benefits-text-bottom]")],
                o = n.map(t => new Yh(t, {
                    type: "words",
                    tag: "span",
                    wordsClass: "split-word",
                    propIndex: !0
                })),
                s = i.map(t => new Yh(t, {
                    type: "words",
                    tag: "span",
                    wordsClass: "split-word",
                    propIndex: !0
                }));
            Cu.create({
                trigger: t,
                start: "top bottom",
                end: "bottom 80%",
                onEnter: () => t.classList.add("is-inview"),
                onLeave: () => t.classList.remove("is-inview"),
                onEnterBack: () => t.classList.add("is-inview"),
                onLeaveBack: () => t.classList.remove("is-inview")
            }), n.forEach((t, e) => {
                var r, n;
                t.classList.remove("is-active", "is-exit");
                let i = (null == (n = null == (r = o[e]) ? void 0 : r.words) ? void 0 : n.length) || 0;
                t.style.setProperty("--words", i)
            }), n[0] && n[0].classList.add("is-active"), i.forEach((t, e) => {
                var r, n;
                t.classList.remove("is-active", "is-exit");
                let i = (null == (n = null == (r = s[e]) ? void 0 : r.words) ? void 0 : n.length) || 0;
                t.style.setProperty("--words", i)
            }), i[0] && i[0].classList.add("is-active");
            let a = 0,
                l = t => {
                    t !== a && (n[a] && (n[a].classList.remove("is-active"), n[a].classList.add("is-exit")), n[t] && (n[t].classList.remove("is-exit"), n[t].classList.add("is-active")), a = t)
                },
                u = 0,
                c = t => {
                    t !== u && (i[u] && (i[u].classList.remove("is-active"), i[u].classList.add("is-exit")), i[t] && (i[t].classList.remove("is-exit"), i[t].classList.add("is-active")), u = t)
                };
            e.forEach((t, e) => {
                ai.timeline({
                    scrollTrigger: {
                        trigger: t,
                        start: "top bottom",
                        end: "center 50%",
                        scrub: !0
                    }
                }).to(r, {
                    y: `-${e}em`,
                    ease: "none"
                })
            }), e.forEach((t, e) => {
                Cu.create({
                    trigger: t,
                    start: "center center",
                    onEnter: () => {
                        l(e), c(e)
                    },
                    onEnterBack: () => {
                        l(e), c(e)
                    }
                })
            }), requestAnimationFrame(() => Cu.refresh())
        })
    }(),
    function() {
        let t = document.querySelectorAll("[data-text-fade-in]");
        t.length && t.forEach(t => {
            let e = t.hasAttribute("data-text-move-left"),
                r = t.hasAttribute("data-text-move-right"),
                n = new Yh(t, {
                    type: "words, chars",
                    tag: "span",
                    charsClass: "split-char",
                    wordsClass: "split-word",
                    propIndex: !0
                }),
                i = ai.timeline({
                    scrollTrigger: {
                        trigger: t,
                        start: "top 92.5%",
                        toggleActions: "play none play reverse",
                        onEnter: () => t.classList.add("is-inview"),
                        onLeave: () => {},
                        onEnterBack: () => t.classList.add("is-inview"),
                        onLeaveBack: () => t.classList.remove("is-inview")
                    }
                });
            n.chars.forEach((t, e) => {
                i.to(t, {
                    onStart: () => t.classList.add("is-shown"),
                    onReverseComplete: () => t.classList.remove("is-shown")
                }, .05 * e)
            }), (e || r) && ai.fromTo(t, {
                x: e ? "7.5rem" : r ? "-7.5rem" : 0
            }, {
                x: 0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: t,
                    start: "top bottom",
                    end: "top 40%",
                    scrub: .2
                }
            })
        })
    }(),
    function() {
        let t = document.querySelectorAll("[data-stats]");
        t.length && t.forEach(t => {
            let e = t.querySelector("[data-stats-left"),
                r = e.querySelector("[data-stats-left-number"),
                n = e.querySelector("[data-stats-left-number-percentage"),
                i = e.querySelector("[data-stats-progress-circle] .mask"),
                o = t.querySelector("[data-stats-right"),
                s = o.querySelector("[data-stats-right-number"),
                a = o.querySelector("[data-stats-right-number-percentage"),
                l = o.querySelector("[data-stats-right-circle-left]"),
                u = o.querySelector("[data-stats-right-circle-right]"),
                c = o.querySelector("[data-stats-right-circle-center]"),
                h = ai.matchMedia();
            h.add("(prefers-reduced-motion: reduce)", () => {
                let t = ai.timeline({
                        scrollTrigger: {
                            trigger: e,
                            start: "top 75%",
                            onEnter: () => e.classList.add("is-inview"),
                            onLeave: () => {},
                            onEnterBack: () => e.classList.add("is-inview"),
                            onLeaveBack: () => e.classList.remove("is-inview")
                        }
                    }),
                    i = ai.timeline({
                        scrollTrigger: {
                            trigger: o,
                            start: "top 75%",
                            onEnter: () => o.classList.add("is-inview"),
                            onLeave: () => {},
                            onEnterBack: () => o.classList.add("is-inview"),
                            onLeaveBack: () => o.classList.remove("is-inview")
                        }
                    });
                i.to(a, {
                    duration: .75,
                    scrambleText: {
                        text: "%",
                        chars: "&=$?",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "right"), i.to(s, {
                    duration: .75,
                    scrambleText: {
                        text: "250",
                        chars: "0123456789",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "right"), t.to(n, {
                    duration: .75,
                    scrambleText: {
                        text: "%",
                        chars: "&=$?",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "left"), t.to(r, {
                    duration: .75,
                    scrambleText: {
                        text: "100",
                        chars: "0123456789",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "left")
            }), h.add("(prefers-reduced-motion: no-preference) and (min-width: 480px)", () => {
                let t = ai.timeline({
                        scrollTrigger: {
                            trigger: e,
                            start: "top 75%",
                            onEnter: () => e.classList.add("is-inview"),
                            onLeave: () => {},
                            onEnterBack: () => e.classList.add("is-inview"),
                            onLeaveBack: () => e.classList.remove("is-inview")
                        }
                    }),
                    h = ai.timeline({
                        scrollTrigger: {
                            trigger: o,
                            start: "top 75%",
                            onEnter: () => o.classList.add("is-inview"),
                            onLeave: () => {},
                            onEnterBack: () => o.classList.add("is-inview"),
                            onLeaveBack: () => o.classList.remove("is-inview")
                        }
                    });
                h.from(l, {
                    duration: .8,
                    xPercent: 35,
                    opacity: 0,
                    ease: "expoScale(10,2.5,power2.out)",
                    delay: .15
                }, "step"), h.from(u, {
                    duration: .8,
                    xPercent: -35,
                    opacity: 0,
                    ease: "expoScale(10,2.5,power2.out)"
                }, "step+=0.3"), h.from(c, {
                    duration: .8,
                    scale: .75,
                    opacity: 0,
                    ease: "expoScale(10,2.5,power2.out)"
                }, "step+=0.4"), h.to(a, {
                    duration: .75,
                    scrambleText: {
                        text: "%",
                        chars: "&=$?",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "step"), h.to(s, {
                    duration: .75,
                    scrambleText: {
                        text: "250",
                        chars: "0123456789",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "step"), t.from(i, {
                    duration: 1.65,
                    drawSVG: 0,
                    ease: "expoScale(10,2.5,power1.inOut)",
                    delay: .1
                }), t.to(n, {
                    duration: .75,
                    scrambleText: {
                        text: "%",
                        chars: "&=$?",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "<"), t.to(r, {
                    duration: .75,
                    scrambleText: {
                        text: "100",
                        chars: "0123456789",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "<")
            }), h.add("(prefers-reduced-motion: no-preference) and (max-width: 479px)", () => {
                let t = ai.timeline({
                        scrollTrigger: {
                            trigger: e,
                            start: "top 75%",
                            onEnter: () => e.classList.add("is-inview"),
                            onLeave: () => {},
                            onEnterBack: () => e.classList.add("is-inview"),
                            onLeaveBack: () => e.classList.remove("is-inview")
                        }
                    }),
                    h = ai.timeline({
                        scrollTrigger: {
                            trigger: o,
                            start: "top 75%",
                            onEnter: () => o.classList.add("is-inview"),
                            onLeave: () => {},
                            onEnterBack: () => o.classList.add("is-inview"),
                            onLeaveBack: () => o.classList.remove("is-inview")
                        }
                    });
                h.from(l, {
                    duration: .8,
                    yPercent: -35,
                    opacity: 0,
                    ease: "expoScale(10,2.5,power2.out)",
                    delay: .15
                }, "step"), h.from(u, {
                    duration: .8,
                    yPercent: 35,
                    opacity: 0,
                    ease: "expoScale(10,2.5,power2.out)"
                }, "step+=0.3"), h.from(c, {
                    duration: .8,
                    scale: .75,
                    opacity: 0,
                    ease: "expoScale(10,2.5,power2.out)"
                }, "step+=0.4"), h.to(a, {
                    duration: .75,
                    scrambleText: {
                        text: "%",
                        chars: "&=$?",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "step"), h.to(s, {
                    duration: .75,
                    scrambleText: {
                        text: "250",
                        chars: "0123456789",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "step"), t.from(i, {
                    duration: 1.65,
                    drawSVG: 0,
                    ease: "expoScale(10,2.5,power1.inOut)",
                    delay: .1
                }), t.to(n, {
                    duration: .75,
                    scrambleText: {
                        text: "%",
                        chars: "&=$?",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "<"), t.to(r, {
                    duration: .75,
                    scrambleText: {
                        text: "100",
                        chars: "0123456789",
                        revealDelay: .25,
                        speed: .8
                    }
                }, "<")
            })
        })
    }(),
    function() {
        let t = document.querySelectorAll("[data-micro-text]");
        t.length && t.forEach(t => {
            let e = t.hasAttribute("data-micro-text-chars");
            ai.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
                let r = new Yh(t, {
                        type: e ? "chars" : "words",
                        tag: "span",
                        charsClass: "split-char",
                        wordsClass: "split-word"
                    }),
                    n = e ? r.chars : r.words;
                ai.to(n, {
                    keyframes: {
                        "0%": {
                            color: "#fff",
                            opacity: .35
                        },
                        "30%": {
                            color: "#8898e7"
                        },
                        "45%": {
                            color: "#fff",
                            opacity: .35
                        },
                        "100%": {
                            color: "#202020",
                            opacity: 1
                        }
                    },
                    duration: 1.2,
                    ease: "none",
                    repeatRefresh: !0,
                    repeat: -1,
                    stagger: {
                        each: .05,
                        from: "random"
                    },
                    scrollTrigger: {
                        trigger: t,
                        start: "top bottom",
                        end: "bottom top",
                        toggleActions: "play pause resume pause"
                    }
                })
            })
        })
    }(), ed(),
        function() {
            let t = document.querySelectorAll("[data-number]");
            t.length && t.forEach(t => {
                t.querySelectorAll("[data-number-item]").forEach((e, r) => {
                    ai.matchMedia().add("(prefers-reduced-motion: no-preference) and (min-width: 992px)", () => {
                        let n = e.innerText;
                        return e.innerText = "", ai.set(e, {
                            yPercent: 35
                        }), ai.timeline({
                            scrollTrigger: {
                                trigger: t,
                                start: "top 90%",
                                onEnter: () => t.classList.add("is-inview")
                            }
                        }).to(e, {
                            yPercent: 0,
                            ease: "none",
                            duration: .65,
                            scrambleText: {
                                text: n,
                                chars: "0123456789",
                                revealDelay: .25,
                                speed: .8
                            }
                        }, .075 * r), () => {
                            e.innerText = n
                        }
                    })
                })
            })
        }(),
        function() {
            let t = document.querySelectorAll("[data-scramble-inview]");
            t.length && t.forEach(t => {
                ai.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
                    ai.timeline({
                        scrollTrigger: {
                            trigger: t,
                            start: "top bottom"
                        }
                    }).to(t, {
                        ease: "none",
                        duration: .9,
                        scrambleText: {
                            text: "{original}",
                            chars: "0123456789QWERTZUIOPASDFGHJKLYXCVBNM",
                            speed: .8
                        }
                    })
                })
            })
        }(),
        function() {
            let t = document.querySelectorAll("[data-typing]");
            t.length && t.forEach(t => {
                let e = t.querySelector("[data-typing-arrow]"),
                    r = t.querySelector("[data-typing-text-blink]"),
                    n = t.querySelector("[data-typing-shuffle]"),
                    i = t.querySelector("[data-typing-shuffle-symbols]"),
                    o = ai.matchMedia();
                new Yh(e, {
                    type: "chars",
                    tag: "span",
                    charsClass: "split-char",
                    propIndex: !0
                });
                let s = new Yh(r, {
                    type: "chars",
                    tag: "span",
                    charsClass: "split-char"
                });
                o.add("(prefers-reduced-motion: no-preference)", () => {
                    let e = ai.timeline({
                        scrollTrigger: {
                            trigger: t,
                            start: "top bottom",
                            end: "bottom top",
                            onEnter: () => t.classList.add("is-inview"),
                            onLeave: () => t.classList.remove("is-inview"),
                            onEnterBack: () => t.classList.add("is-inview"),
                            onLeaveBack: () => t.classList.remove("is-inview")
                        }
                    });
                    e.to(s.chars, {
                        keyframes: {
                            "0%": {
                                color: "#fff",
                                opacity: .35
                            },
                            "30%": {
                                color: "#8898e7"
                            },
                            "45%": {
                                color: "#fff",
                                opacity: .35
                            },
                            "50%": {
                                color: "#fff",
                                opacity: 1
                            },
                            "100%": {
                                color: "#fff",
                                opacity: 1
                            }
                        },
                        duration: 1.2,
                        ease: "none",
                        repeatRefresh: !0,
                        repeat: -1,
                        stagger: {
                            each: .15,
                            from: "left"
                        }
                    }, "step"), e.to(n, {
                        duration: 1.6,
                        repeat: -1,
                        ease: "none",
                        scrambleText: {
                            text: "{original}",
                            chars: "0123456789",
                            speed: .5,
                            delimiter: " "
                        }
                    }, "step"), e.to(i, {
                        duration: 1.6,
                        repeat: -1,
                        ease: "none",
                        scrambleText: {
                            text: "{original}",
                            chars: "*+-#)(%$&/_!?",
                            speed: .5
                        }
                    }, "step")
                })
            })
        }(), nd()
}
window.addEventListener("load", () => {
Cu.clearScrollMemory("manual"), history.scrollRestoration && (history.scrollRestoration = "manual"), id(), qh.stop(), td(), Jh(() => {
    td()
}), document.fonts.ready.then(function() {
    document.documentElement.classList.add("fonts-loaded"), Kh(), od()
})
})
})();
/*! Bundled license information:

gsap/gsap-core.js:
  (*!
   * GSAP 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.13.0
   * https://gsap.com
   *
   * Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/utils/paths.js:
  (*!
   * paths 3.13.0
   * https://gsap.com
   *
   * Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CustomEase.js:
  (*!
   * CustomEase 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/utils/matrix.js:
  (*!
   * matrix 3.13.0
   * https://gsap.com
   *
   * Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/Draggable.js:
  (*!
   * Draggable 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
   *)

gsap/Observer.js:
  (*!
   * Observer 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/ScrollTrigger.js:
  (*!
   * ScrollTrigger 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/utils/strings.js:
  (*!
   * strings: 3.13.0
   * https://gsap.com
   *
   * Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/TextPlugin.js:
  (*!
   * TextPlugin 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/DrawSVGPlugin.js:
  (*!
   * DrawSVGPlugin 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/ScrambleTextPlugin.js:
  (*!
   * ScrambleTextPlugin 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/utils/VelocityTracker.js:
  (*!
   * VelocityTracker: 3.13.0
   * https://gsap.com
   *
   * Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/InertiaPlugin.js:
  (*!
   * InertiaPlugin 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/SplitText.js:
  (*!
   * SplitText 3.13.0
   * https://gsap.com
   *
   * @license Copyright 2025, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license.
   * @author: Jack Doyle
   *)
*/