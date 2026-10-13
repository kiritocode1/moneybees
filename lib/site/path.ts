/** A path on this site, never another host: "/" when `value` is anything else. */
export const sitePath = (value: string | null) => (value?.startsWith("/") && !value.startsWith("//") ? value : "/");
