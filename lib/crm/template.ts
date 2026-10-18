/** Fills {{name}}-style merge fields. An unknown field is left visible so a sender spots it before sending. */
export function fillTemplate(text: string, values: Readonly<Record<string, string | undefined>>) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => values[key] ?? match);
}

/**
 * A template line shown with some tags filled from fields on the form, and
 * an edit to it turned back into the template, so a tag keeps following its
 * field: the meeting time in a Meeting confirmation's subject shows as it is
 * typed in When, and still changes if When changes after the subject was
 * edited. Empty fields leave their tag as it is; the server fills it on send.
 */
export function liveTags(template: string, values: Readonly<Record<string, string | undefined>>) {
  const filled = Object.entries(values).filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()));
  return {
    shown: fillTemplate(template, Object.fromEntries(filled)),
    back: (edited: string) => filled.reduce((text, [key, value]) => (text.includes(value) ? text.replace(value, `{{${key}}}`) : text), edited),
  };
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The same, for a template's HTML: values are escaped, so a name can never inject markup into the email. */
export function fillTemplateHtml(html: string, values: Readonly<Record<string, string | undefined>>) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => (values[key] === undefined ? match : escapeHtml(values[key])));
}
