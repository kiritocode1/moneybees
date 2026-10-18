/**
 * Hairline — the public wrapper around an engine. An engine draws into an svg
 * it is handed and writes its caption to a read-out; this file makes both,
 * dresses the host element, and gives back the two calls a consumer needs.
 *
 * It only ever removes what it added: the svg, the live region, and the
 * attributes the host did not already have.
 */
/** What every figure takes. */
type HairlineOptions = {
    /** How strongly the figure answers the pointer, from 0 (subtle) to 1 (strong). Default 0.5. */
    intensity?: number;
    /** `"auto"` follows the page: an ancestor with class `dark` or `data-theme="dark"`, then the page's `color-scheme`. Default `"auto"`. */
    theme?: "auto" | "light" | "dark";
    /** The accessible name. Each figure has a default description in English. */
    label?: string;
    /** The figure's caption, each time it changes. Called once at mount with the rest caption. */
    onRead?: (text: string) => void;
};
type Figure = {
    /** Changes options on the running figure. A key set to `undefined` goes back to its default; a key left out stays as it was. */
    update(options: HairlineOptions): void;
    /** Stops the figure and removes what it added to the element. Safe to call twice. */
    destroy(): void;
};

/** A tray of eight cards. The card under the pointer stands up; the arrow keys walk the cards. `intensity` spreads the ripple further from the pulled card. */
declare function riffle(el: HTMLElement, options?: HairlineOptions): Figure;
/** Eighty-one pillars on a plinth that rise around the pointer. `intensity` widens the area that rises. */
declare function terrain(el: HTMLElement, options?: HairlineOptions): Figure;
/** An app window in four layers. Moving across opens the gap; moving down picks a layer. `intensity` opens the layers further. */
declare function exploded(el: HTMLElement, options?: HairlineOptions): Figure;
/** A seven by seven dot matrix that plays a loop, and fades like phosphor where the pointer paints it. `intensity` makes the trail linger longer. */
declare function phosphor(el: HTMLElement, options?: HairlineOptions): Figure;
/** Crates riding a belt through a gate. Hovering slows the clock without stopping it. `intensity` slows it more. */
declare function slow(el: HTMLElement, options?: HairlineOptions): Figure;
/** Blocks on a turntable. A flick across it spins it; it settles on the nearest quarter turn. `intensity` makes the spin coast longer. */
declare function turntable(el: HTMLElement, options?: HairlineOptions): Figure;
/** A sixty-key board. The key under the pointer sinks, and its neighbours follow it down, less the further away. `intensity` widens how far the press reaches. */
declare function keyboard(el: HTMLElement, options?: HairlineOptions): Figure;
/** Four floors beside an open shaft. The pointer's height picks a floor, and the car travels there through the ones between. `intensity` makes the car travel faster. */
declare function elevator(el: HTMLElement, options?: HairlineOptions): Figure;
/** A phone in layers: glass, board, battery, shell. Moving across opens the gap; moving down picks a layer. `intensity` opens the layers further. */
declare function phone(el: HTMLElement, options?: HairlineOptions): Figure;
/** A thin laptop: the pointer's height sets how far the lid stands open, and the lid follows it on a spring. `intensity` lets the lid open wider. */
declare function laptop(el: HTMLElement, options?: HairlineOptions): Figure;
/** A terminal window: the pointer's height scrolls back through its history, and the line under it lifts off the screen. `intensity` spreads the lift over more lines. */
declare function terminal(el: HTMLElement, options?: HairlineOptions): Figure;
/** A rack of twelve blades: the pointer's height pulls the nearest ones out on their rails, the farther the less. `intensity` pulls out more blades. */
declare function cabinet(el: HTMLElement, options?: HairlineOptions): Figure;
/** A commit graph on a board: the commit under the pointer rises, and its history rises after it, the farther back the less. `intensity` raises more of the history. */
declare function branches(el: HTMLElement, options?: HairlineOptions): Figure;
/** A vault door: circling the pointer turns its dial, which coasts and catches every ten; on forty its three bolts draw back. `intensity` lets the dial coast longer. */
declare function vault(el: HTMLElement, options?: HairlineOptions): Figure;
/** A bank of twelve lockers, one ajar at rest: the locker under the pointer opens, and the one open before it swings shut. `intensity` opens the door wider. */
declare function lockers(el: HTMLElement, options?: HairlineOptions): Figure;
/** A padlock: as the pointer nears, the shackle springs up out of the body and swings open about its long leg. `intensity` swings the shackle further. */
declare function padlock(el: HTMLElement, options?: HairlineOptions): Figure;
/** A patch panel of twenty-four ports: the cable under the pointer lifts, and its neighbours lean away, less the further away. `intensity` spreads the lean over more ports. */
declare function patch(el: HTMLElement, options?: HairlineOptions): Figure;
/** A parabolic dish on a two-axis gimbal: the pointer aims it, and it follows on a spring. `intensity` swings the dish further. */
declare function dish(el: HTMLElement, options?: HairlineOptions): Figure;
/** A wifi router whose antennas lean toward the pointer, the nearest the most and the others less the further away. `intensity` spreads the lean over more antennas. */
declare function router(el: HTMLElement, options?: HairlineOptions): Figure;

export { type Figure, type HairlineOptions, branches, cabinet, dish, elevator, exploded, keyboard, laptop, lockers, padlock, patch, phone, phosphor, riffle, router, slow, terminal, terrain, turntable, vault };
