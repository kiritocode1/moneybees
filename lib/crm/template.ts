/** Fills {{name}}-style merge fields. An unknown field is left visible so a sender spots it before sending. */
export function fillTemplate(text: string, values: Readonly<Record<string, string | undefined>>) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => values[key] ?? match);
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The same, for a template's HTML: values are escaped, so a name can never inject markup into the email. */
export function fillTemplateHtml(html: string, values: Readonly<Record<string, string | undefined>>) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => (values[key] === undefined ? match : escapeHtml(values[key])));
}
