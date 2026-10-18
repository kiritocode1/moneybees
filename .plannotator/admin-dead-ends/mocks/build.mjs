// Writes the admin dead-ends mocks as static HTML in the admin's own tokens
// (read from the running enquiry and inbox screens on 16 Oct 2026):
// page #141414, panels lab(7.8) ≈ #171717, 10% white borders, Inter 13/20,
// Fluid buttons 29.25px (compact 22.75px), radius 6.5px.
// Run: node .plannotator/admin-dead-ends/mocks/build.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const ICON = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  mailOpen: '<path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  done: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  clip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  note: '<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/>',
  stage: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  board: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/>',
  list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  docs: '<path d="M2 6a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
};
const icon = (name, size = 14, extra = "") => `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${ICON[name]}</svg>`;

const CSS = `
:root{--bg:#141414;--card:#171717;--line:rgba(255,255,255,.1);--row:rgba(66,66,66,.4);--fg:#fafafa;--muted:#a1a1a1;--chip:#262626;--sec:rgba(255,255,255,.25);--red:#f46a6a;--redbg:#2c1313;--amber:#f0c060;--amberbg:#2b2312;--green:#7fd3a6;--greenbg:#14301f;--blue:#7aa7ff}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg)}
body{font:13px/20px Inter,"Inter Fallback",-apple-system,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.sys{font-family:-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
.page{padding:0 60px 60px;max-width:1440px}
.top{height:56px;display:flex;align-items:center;gap:10px;color:var(--muted);font-size:13px;padding-left:0}
.i{display:inline-block;vertical-align:-2px;flex:none}
a{color:inherit}
.back{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:12px;text-decoration:none;margin-top:8px}
h1{font:600 28px/34px -apple-system,system-ui,sans-serif;letter-spacing:-.28px;margin:12px 0 0}
.sub{color:var(--muted);margin-top:4px}
.cap{font-size:12px;line-height:16px;color:var(--muted)}
.muted{color:var(--muted)}
.fg{color:var(--fg)}
.red{color:var(--red)}.amber{color:var(--amber)}.green{color:var(--green)}
.num{font-variant-numeric:tabular-nums}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:32px;align-items:start;margin-top:32px}
.stack{display:grid;gap:40px;min-width:0}
.aside{display:grid;gap:16px}
.sec-h{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:12px}
.sec-h h2{font:600 16px/22px -apple-system,system-ui,sans-serif;margin:0}
.panel{background:var(--card);border:1px solid var(--line);border-radius:9.75px;padding:13px}
.panel>.pt{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.panel>.pt h2,.pt-h{font:500 12px/16px -apple-system,system-ui,sans-serif;color:var(--muted);margin:0}
.card{background:var(--card);border:1px solid var(--line);border-radius:9.75px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:29.25px;padding:0 13px;border-radius:6.5px;border:0;font:13px/20px Inter,-apple-system,sans-serif;color:var(--fg);background:var(--sec);white-space:nowrap}
.btn.pri{background:#fafafa;color:#080808}
.btn.ghost{background:transparent;color:var(--muted)}
.btn.sm{height:22.75px;padding:0 9.75px;font-size:12px;line-height:18px}
.btn.icon{width:29.25px;padding:0}
.btn.sm.icon{width:22.75px}
.in{display:flex;align-items:center;gap:8px;height:29.25px;border:1px solid var(--line);border-radius:6.5px;padding:1px 9.75px;color:var(--fg);background:transparent;min-width:0}
.in.sm{height:22.75px;font-size:12px;padding:0 8px}
.in .ph{color:var(--muted)}
.in .chev{margin-left:auto;color:var(--muted)}
.ta{border:1px solid var(--line);border-radius:6.5px;padding:6.5px 9.75px;min-height:64px;white-space:pre-wrap}
label.l,.l{display:block;font-size:12px;line-height:16px;color:var(--muted);margin:0 0 6px}
.seg{display:flex;gap:4px}
.seg span{height:22.75px;padding:0 8.125px;border-radius:4.875px;font-size:12px;line-height:22.75px;color:var(--muted)}
.seg span.on{background:var(--chip);color:var(--fg)}
.tabs{display:flex;gap:2px}
.tabs span{height:29.25px;line-height:29.25px;padding:0 9.75px;border-radius:6.5px;color:var(--muted)}
.tabs span.on{background:var(--chip);color:var(--fg)}
.badge{display:inline-flex;align-items:center;gap:5px;height:19.5px;padding:0 8.125px;border-radius:6.5px;font-size:12px;line-height:16px;background:var(--chip);color:var(--fg);white-space:nowrap}
.badge.c{height:17px;padding:0 6px;font-size:11px}
.badge.red{background:var(--redbg);color:#ffb3b3}.badge.amber{background:var(--amberbg);color:#f3d28c}.badge.green{background:var(--greenbg);color:var(--green)}
.badge.dot{background:transparent;border:1px solid var(--line)}
.badge .d{width:6px;height:6px;border-radius:3px;background:var(--red)}
.intro{display:flex;align-items:center;gap:10px;background:#1e1e1e;border-radius:9.75px;padding:10px 13px;max-width:900px;margin-top:14px}
.intro .how{margin-left:auto;display:inline-flex;align-items:center;gap:5px;font-size:12px;background:#3a3a3a;border-radius:6.5px;padding:2px 8px}
.chip{display:inline-flex;align-items:center;gap:8px;height:29.25px;padding:0 6px 0 9px;border:1px solid var(--line);border-radius:6.5px;background:#1b1b1b;max-width:100%}
.chip .n{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chip .s{color:var(--muted);font-size:12px}
.chip .x{color:var(--muted);display:inline-flex}
.tag{display:inline-flex;align-items:center;gap:5px;height:19.5px;padding:0 7px;border-radius:5px;background:#202020;color:var(--muted);font-size:12px;white-space:nowrap}
.tl{list-style:none;margin:0;padding:0}
.tl li{position:relative;display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;padding-bottom:20px}
.tl li:not(:last-child)::before{content:"";position:absolute;top:28px;bottom:0;left:13.5px;width:1px;background:var(--line)}
.tl .ic{width:28px;height:28px;border-radius:14px;border:1px solid var(--line);background:var(--card);display:flex;align-items:center;justify-content:center;color:var(--muted)}
.tl .t{padding-top:4px;min-width:0}
.tl .t .h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px}
.tl .t p{margin:4px 0 0;color:var(--muted)}
dl.kv{display:grid;grid-template-columns:110px minmax(0,1fr);gap:6px 8px;margin:0}
dl.kv dt{color:var(--muted)}dl.kv dd{margin:0}
.box{width:16px;height:16px;border-radius:8px;border:1.5px solid #5a5a5a;flex:none;display:inline-flex;align-items:center;justify-content:center}
.box.on{background:var(--green);border-color:var(--green);color:#0b1a12}
.sq{width:15px;height:15px;border-radius:4px;border:1.5px solid #5a5a5a;flex:none;display:inline-flex;align-items:center;justify-content:center}
.sq.on{background:#fafafa;border-color:#fafafa;color:#111}
.trow{display:grid;grid-template-columns:16px minmax(0,1fr) auto;gap:10px;align-items:start;padding:8px 0;border-top:1px solid var(--line)}
.trow:first-child{border-top:0;padding-top:0}
.pop{position:absolute;background:#1c1c1c;border:1px solid rgba(255,255,255,.14);border-radius:9.75px;box-shadow:0 18px 48px rgba(0,0,0,.55);padding:6px}
.pop .grp{font-size:12px;line-height:16px;color:var(--muted);padding:8px 8px 4px}
.pop .it{display:grid;grid-template-columns:16px 18px minmax(0,1fr) auto;align-items:center;gap:8px;padding:6px 8px;border-radius:6.5px}
.pop .it.hl{background:#2a2a2a}
.pop .it.off{opacity:.45}
.pop .opt{display:flex;justify-content:space-between;gap:16px;padding:6px 8px;border-radius:6.5px}
.pop .opt.hl{background:#2a2a2a}
table{width:100%;border-collapse:collapse}
th{font-weight:500;text-align:left;padding:6.5px 9.75px;color:var(--fg)}
td{padding:6.5px 9.75px;color:var(--muted);border-top:1px solid var(--row);vertical-align:middle}
tr.sel td{background:#1f1f1f}
.thumb{width:30px;height:38px;border-radius:4px;background:#f3f1ec;display:inline-flex;flex-direction:column;gap:3px;padding:6px 5px;vertical-align:middle}
.thumb i{display:block;height:2px;background:#c9c6bf;border-radius:1px}
.thumb.img{background:linear-gradient(135deg,#6b6052,#2f3a44);padding:0}
.av{width:22px;height:22px;border-radius:11px;background:#2f2f2f;color:#d9d9d9;font-size:10px;line-height:22px;text-align:center;flex:none}
.col{background:#171717;border:1px solid var(--line);border-radius:9.75px;padding:8px;display:grid;gap:8px;align-content:start;min-height:560px}
.col .ch{display:flex;justify-content:space-between;align-items:baseline;padding:2px 4px 6px}
.dcard{background:#1f1f1f;border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:10px;display:grid;gap:6px}
.dcard .r{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.toast{position:fixed;left:60px;bottom:24px;background:#262626;border:1px solid var(--line);border-radius:9.75px;padding:9px 12px;display:flex;gap:14px;align-items:center;box-shadow:0 12px 32px rgba(0,0,0,.5)}
.kbd{font-size:11px;color:var(--muted);border:1px solid var(--line);border-radius:4px;padding:0 4px;line-height:16px}
`;

const page = (title, body, { width = 1440 } = {}) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CSS}body{width:${width}px}</style></head><body>${body}</body></html>`;

const top = (crumb) => `<div class="top"><span style="width:26px;height:26px;border:1px solid var(--line);border-radius:6px;display:inline-flex;align-items:center;justify-content:center">${icon("list", 14)}</span><span style="width:22px;height:22px;border-radius:11px;background:#fafafa;display:inline-block;margin-left:6px"></span>${crumb ? `<span>/</span><span class="fg">${crumb}</span>` : ""}</div>`;
const select = (value, { sm = false, width, ph = false } = {}) => `<span class="in${sm ? " sm" : ""}" style="${width ? `width:${width}px` : ""}"><span class="${ph ? "ph" : ""}" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${value}</span><span class="chev">${icon("chevron", 13)}</span></span>`;
const fileChip = (name, size, { lock = false } = {}) => `<span class="chip">${icon(lock ? "lock" : "file", 14, 'style="color:var(--muted)"')}<span class="n">${name}</span><span class="s num">${size}</span><span class="x">${icon("x", 13)}</span></span>`;

// ---------------------------------------------------------------- composer
const composer = ({ tab, body, footer }) => `
<div class="card" style="padding:13px">
  <div class="seg" role="radiogroup">${["Email", "Call", "Meeting", "Note", "Task"].map((label) => `<span class="${label === tab ? "on" : ""}">${label}</span>`).join("")}</div>
  <div style="margin-top:12px;display:grid;gap:12px">${body}</div>
  <div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:12px">${footer}</div>
</div>`;

const emailBody = `
  <div style="display:grid;grid-template-columns:280px minmax(0,1fr);gap:12px">
    <div><span class="l">Letter</span>${select("PMS introduction")}</div>
    <div><span class="l">Subject</span><span class="in">Moneybee Portfolio Management Service, your enquiry ENQ-00001</span></div>
  </div>
  <div><span class="l">Message</span><div class="ta" style="min-height:104px">Thank you for writing to us about Moneybee's Portfolio Management Service. You told us you are looking to move part of your family's equity allocation into a PMS, and asked for a call this week.

I have attached our latest fact sheet and the Disclosure Document. I will call you tomorrow to find a time with our fund manager.</div></div>
  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
    ${fileChip("Moneybee PMS fact sheet, September 2026", "1.2 MB")}
    ${fileChip("Disclosure Document", "2.4 MB")}
    <span class="btn ghost sm" id="attach">${icon("clip", 13)} Attach</span>
  </div>`;
const emailFooter = `<span></span><span style="display:flex;gap:8px"><span class="btn">Preview</span><span class="btn pri">Send to Rohan Mehta</span></span>`;

// ---------------------------------------------------------------- person
const timelineItem = (ic, head, body = "", extra = "") => `<li><span class="ic">${icon(ic, 13)}</span><div class="t"><div class="h">${head}</div>${body ? `<p>${body}</p>` : ""}${extra}</div></li>`;

const person = page(
  "Person",
  `<div class="page">${top("")}
  <a class="back" href="#">${icon("back", 14)} People</a>
  <header style="margin-top:16px">
    <div style="display:flex;gap:8px"><span class="badge">Prospect</span></div>
    <h1>Rohan Mehta</h1>
    <p class="sub num" style="margin:4px 0 0">rohan.mehta@example.com · +91 98200 11111 · Mumbai · first wrote 13 Oct</p>
  </header>
  <div class="grid">
    <div class="stack">
      <section>
        ${composer({ tab: "Email", body: emailBody, footer: emailFooter })}
      </section>
      <section>
        <div class="sec-h"><h2>Timeline</h2><div class="seg"><span class="on">All</span><span>Emails</span><span>Calls and meetings</span><span>Notes</span><span>Tasks</span></div></div>
        <ol class="tl">
          ${timelineItem("mail", `<span>PMS introduction, sent by Vikram Iyer</span><span class="badge c green">Opened</span><span class="cap num">1h ago</span>`, "", `<div style="display:flex;gap:6px;margin-top:6px"><span class="tag">${icon("file", 12)} Fact sheet, September 2026</span><span class="tag">${icon("file", 12)} Disclosure Document</span></div>`)}
          ${timelineItem("phone", `<span>Call, spoke, logged by Vikram Iyer</span><span class="cap num">2h ago</span>`, "Wants the stocks held in the family's own demat account. Will meet the fund manager on Tuesday.")}
          ${timelineItem("done", `<span>Done: Call within the reply time</span><span class="cap num">2h ago</span>`, "From the Large PMS investor playbook.")}
          ${timelineItem("stage", `<span>Deal moved to Meeting</span><span class="cap num">2h ago</span>`)}
          ${timelineItem("mail", `<span>Acknowledgement sent</span><span class="badge c">Delivered</span><span class="cap num">3d ago</span>`)}
          ${timelineItem("file", `<span>Sent the PMS form from /contact</span><span class="cap num">3d ago</span>`, "We are a family looking to move part of our equity allocation into a PMS. Could someone call me this week?")}
        </ol>
      </section>
    </div>
    <aside class="aside">
      <section class="panel"><div class="pt"><h2>Tasks</h2><span class="btn ghost sm">Add a task</span></div>
        <div class="trow"><span class="box"></span><span><span class="fg">Confirm Tuesday's meeting</span><span class="cap" style="display:block">${icon("phone", 11)} Call · tomorrow, 10:00</span></span><span class="av">VI</span></div>
        <div class="trow"><span class="box"></span><span><span class="fg">Send the PMS account opening checklist</span><span class="cap" style="display:block">${icon("mail", 11)} Email · Tue 21 Oct</span></span><span class="av">VI</span></div>
      </section>
      <section class="panel"><div class="pt"><h2>Enquiries</h2></div>
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><span><span class="fg">PMS, above Rs. 5 crore</span><span class="cap num" style="display:block">ENQ-00001 · replied 13 Oct</span></span><span class="badge c">Waiting on them</span></div>
      </section>
      <section class="panel"><div class="pt"><h2>Deal</h2></div>
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="fg">Moneybee PMS</span><span class="fg num">Rs. 5 crore</span></div>
        <div style="margin-top:10px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center">${select("Meeting", { sm: true })}<span class="cap num">2 days</span></div>
      </section>
      <section class="panel"><div class="pt"><h2>Account</h2><span class="btn ghost sm">Edit</span></div>
        <dl class="kv">
          <dt>Portal</dt><dd>No account yet<span style="display:block;margin-top:6px"><span class="btn sm">Invite to the portal</span></span></dd>
          <dt>Invests as</dt><dd>Mehta Family HUF</dd>
          <dt>Mailings</dt><dd>Monthly update, Insights</dd>
          <dt>Owner</dt><dd>Vikram Iyer</dd>
          <dt>Came from</dt><dd>Website, /contact</dd>
        </dl>
      </section>
    </aside>
  </div></div>`,
);

// ---------------------------------------------------------------- call tab, with the due menu open
const callBody = `
  <div><span class="l">How did it go</span><div class="seg"><span class="on">Spoke</span><span>No answer</span><span>Left a message</span><span>Wrong number</span></div></div>
  <div><span class="l">What was said</span><div class="ta">Wants the stocks held in the family's own demat account. Will meet the fund manager on Tuesday at 11:00, at the office.</div></div>
  <div style="border-top:1px solid var(--line);padding-top:12px;display:grid;grid-template-columns:auto 120px minmax(0,1fr) 190px 150px;gap:8px;align-items:center;position:relative">
    <span style="display:flex;gap:8px;align-items:center"><span class="sq on">${icon("check", 11)}</span><span>Then</span></span>
    ${select(`${icon("phone", 12)} Call`, { sm: false })}
    <span class="in">Confirm Tuesday's meeting</span>
    <span id="due">${select("Tomorrow, 10:00")}</span>
    ${select("Vikram Iyer")}
  </div>`;
const call = page(
  "Log a call",
  `<div style="padding:32px;width:980px;position:relative">
  ${composer({ tab: "Call", body: callBody, footer: `<span></span><span class="btn">Add to timeline</span>` })}
  <div class="pop" style="left:${32 + 13 + 16 + 74 + 128 + 8 + 330}px;top:300px;width:250px">
    <div class="opt"><span>Later today</span><span class="muted num">17:00</span></div>
    <div class="opt hl"><span>${icon("check", 12)} Tomorrow</span><span class="muted num">Fri, 10:00</span></div>
    <div class="opt"><span>Monday</span><span class="muted num">20 Oct, 10:00</span></div>
    <div class="opt"><span>In a week</span><span class="muted num">Thu 23 Oct, 10:00</span></div>
    <div class="opt" style="border-top:1px solid var(--line);margin-top:4px;border-radius:0"><span>Pick a date and time</span><span class="muted">${icon("calendar", 13)}</span></div>
  </div></div>`,
  { width: 1044 },
);

// ---------------------------------------------------------------- attach popover + upload step
const attachItem = (on, ic, name, meta, { hl = false, off = false, lock = false } = {}) =>
  `<div class="it${hl ? " hl" : ""}${off ? " off" : ""}"><span class="sq${on ? " on" : ""}">${on ? icon("check", 11) : ""}</span>${icon(lock ? "lock" : ic, 15, 'style="color:var(--muted)"')}<span style="min-width:0"><span class="fg" style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</span><span class="cap num">${meta}</span></span><span></span></div>`;
const attach = page(
  "Attach a file",
  `<div style="padding:32px;width:1060px;position:relative;height:640px">
  <div class="card" style="padding:13px;width:760px">
    <div class="l">Message</div><div class="ta" style="min-height:56px">I have attached our latest fact sheet and the Disclosure Document.</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px">
      ${fileChip("Moneybee PMS fact sheet, September 2026", "1.2 MB")}
      ${fileChip("Disclosure Document", "2.4 MB")}
      <span class="btn sm" style="background:#2a2a2a">${icon("clip", 13)} Attach</span>
    </div>
  </div>
  <div class="pop" style="left:${32 + 13 + 590}px;top:178px;width:380px">
    <div style="padding:4px 4px 6px"><span class="in" style="border-color:rgba(255,255,255,.25)">${icon("search", 13, 'style="color:var(--muted)"')}<span class="ph">Search files</span></span></div>
    <div class="grp">Suggested for a PMS introduction</div>
    ${attachItem(true, "file", "Moneybee PMS fact sheet, September 2026", "Approved by compliance 3 Oct · 1.2 MB")}
    ${attachItem(true, "file", "Disclosure Document", "On the Investor Centre · 2.4 MB")}
    ${attachItem(false, "file", "Investor Charter", "On the Investor Centre · 0.3 MB", { hl: true })}
    ${attachItem(false, "file", "PMS fee illustration", "Private · 0.2 MB", { lock: true })}
    ${attachItem(false, "file", "Moneybee PMS fact sheet, October 2026", "Waiting for compliance", { off: true })}
    <div class="grp">You sent recently</div>
    ${attachItem(false, "file", "PMS account opening checklist", "Sent to Kavita Shah, 14 Oct · 0.5 MB")}
    <div style="border-top:1px solid var(--line);margin-top:6px;padding:8px 8px 4px;display:flex;justify-content:space-between;align-items:center"><span class="fg">${icon("upload", 13)} Upload a file</span><span class="muted">All files</span></div>
  </div>
  <div class="pop" style="left:32px;top:270px;width:340px;padding:13px">
    <div style="display:flex;gap:10px;align-items:center">${icon("file", 18, 'style="color:var(--muted)"')}<span><span class="fg">Fees annexure.pdf</span><span class="cap" style="display:block">PDF · 0.4 MB · uploaded</span></span></div>
    <div class="l" style="margin-top:14px">Who can see it</div>
    <div style="display:grid;gap:8px">
      <span style="display:flex;gap:8px;align-items:center"><span class="box" style="border-color:#fafafa"><span style="width:8px;height:8px;border-radius:4px;background:#fafafa"></span></span>Only the people we send it to</span>
      <span style="display:flex;gap:8px;align-items:center" class="muted"><span class="box"></span>Anyone, it can go on the website</span>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px"><span class="btn pri sm">Attach</span><span class="btn ghost sm">Cancel</span></div>
  </div>
  </div>`,
  { width: 1100 },
);

// ---------------------------------------------------------------- files library
const fileRow = (sel, thumb, name, kind, used, sent, when, { lock = false, unused = false } = {}) => `<tr class="${sel ? "sel" : ""}">
  <td style="width:44px">${thumb === "img" ? '<span class="thumb img"></span>' : '<span class="thumb"><i style="width:70%;background:#9a9488"></i><i></i><i></i><i style="width:60%"></i><i></i></span>'}</td>
  <td><span class="fg">${name}</span>${lock ? ` <span class="muted">${icon("lock", 12)}</span>` : ""}</td>
  <td class="num">${kind}</td>
  <td>${unused ? '<span class="amber">Not used</span>' : used}</td>
  <td class="num">${sent}</td>
  <td class="num">${when}</td></tr>`;
const files = page(
  "Files",
  `<div class="page">${top("Files")}
  <header style="margin-top:8px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
    <div><h1 style="margin-top:0">Files</h1><p class="sub" style="margin:4px 0 0">34 files. 6 are not used anywhere.</p>
      <div class="intro">${icon("image", 14, 'style="color:var(--muted)"')}<span>Every PDF and picture Moneybee keeps: the site's documents and portraits, fact sheets, and files sent by email.</span><span class="how">${icon("book", 12)} How to use this</span></div></div>
    <div style="display:flex;gap:12px;align-items:center"><div class="tabs"><span class="on">All 34</span><span>PDFs 21</span><span>Pictures 13</span><span>Private 4</span><span>Not used 6</span></div><span class="btn pri">${icon("upload", 13)} Upload</span></div>
  </header>
  <div style="display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:24px;margin-top:24px;align-items:start">
    <div>
      <span class="in" style="max-width:360px;margin-bottom:12px">${icon("search", 13, 'style="color:var(--muted)"')}<span class="ph">Search files</span></span>
      <table><thead><tr><th></th><th>Name</th><th>Kind</th><th>Used in</th><th>Sent</th><th>Updated</th></tr></thead><tbody>
      ${fileRow(true, "pdf", "Disclosure Document", "PDF · 2.4 MB", "Investor Centre", "14 times", "2 Oct")}
      ${fileRow(false, "pdf", "Moneybee PMS fact sheet, September 2026", "PDF · 1.2 MB", "Fact sheets", "9 times", "3 Oct")}
      ${fileRow(false, "pdf", "Investor Charter", "PDF · 0.3 MB", "Investor Centre", "3 times", "2 Oct")}
      ${fileRow(false, "pdf", "Flyingbee PPM, Series 1", "PDF · 6.8 MB", "Flyingbee subscription letter", "twice", "28 Sep", { lock: true })}
      ${fileRow(false, "pdf", "PMS fee illustration", "PDF · 0.2 MB", "PMS introduction letter", "4 times", "1 Oct", { lock: true })}
      ${fileRow(false, "img", "Vikram Iyer, portrait", "JPG · 0.6 MB", "Team", "", "14 Oct")}
      ${fileRow(false, "img", "Mumbai office", "JPG · 1.8 MB", "Home page", "", "30 Sep")}
      ${fileRow(false, "pdf", "Fees annexure (draft)", "PDF · 0.4 MB", "", "", "15 Oct", { unused: true, lock: true })}
      </tbody></table>
    </div>
    <aside class="panel" style="padding:16px">
      <div style="background:#0f0f0f;border-radius:6.5px;height:210px;display:flex;align-items:center;justify-content:center">
        <div style="width:150px;height:190px;background:#f3f1ec;border-radius:3px;padding:16px 14px;display:grid;gap:7px;align-content:start;color:#2b2b2b;font:600 9px/12px -apple-system,sans-serif">DISCLOSURE DOCUMENT<i style="height:3px;background:#c9c6bf;border-radius:2px"></i><i style="height:3px;background:#c9c6bf;border-radius:2px;width:80%"></i><i style="height:3px;background:#c9c6bf;border-radius:2px"></i><i style="height:3px;background:#c9c6bf;border-radius:2px;width:60%"></i><i style="height:3px;background:#c9c6bf;border-radius:2px"></i><i style="height:3px;background:#c9c6bf;border-radius:2px;width:75%"></i></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-top:14px">
        <div><div class="fg" style="font-size:15px;line-height:22px;font-weight:600">Disclosure Document</div><div class="cap num">PDF · 2.4 MB · 18 pages · uploaded by Compliance, 2 Oct</div></div>
        <span class="btn ghost sm icon">${icon("more", 14)}</span>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px"><span class="btn pri sm">${icon("mail", 12)} Send to someone</span><span class="btn sm">Replace</span></div>
      <dl class="kv" style="margin-top:16px"><dt>Who can see it</dt><dd>Anyone, it is on the website</dd></dl>
      <div class="pt-h" style="margin-top:18px;margin-bottom:8px">Used in</div>
      <div style="display:grid;gap:6px">
        <span>${icon("docs", 13, 'style="color:var(--muted)"')} Investor Centre, the Disclosure Document card</span>
        <span>${icon("mail", 13, 'style="color:var(--muted)"')} Goes with the PMS introduction letter</span>
      </div>
      <div class="pt-h" style="margin-top:18px;margin-bottom:8px;display:flex;justify-content:space-between"><span>Sent with</span><span>14</span></div>
      <div style="display:grid;gap:0">
        ${[["Rohan Mehta", "PMS introduction", "Today", "Opened"], ["Kavita Shah", "PMS account opening", "14 Oct", "Delivered"], ["Arjun Desai", "A letter", "10 Oct", "Opened"]].map(([who, what, when, status]) => `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:6px 0;border-top:1px solid var(--line)"><span><span class="fg">${who}</span><span class="cap" style="display:block">${what} · ${when}</span></span><span class="badge c ${status === "Opened" ? "green" : ""}">${status}</span></div>`).join("")}
        <span class="cap" style="padding-top:6px">11 more</span>
      </div>
    </aside>
  </div></div>`,
);

// ---------------------------------------------------------------- tasks
const taskRow = ({ ic, title, chips = [], due, dueTone = "", action = "", done = false, source = "" }) => `
  <div style="display:grid;grid-template-columns:18px 18px minmax(0,1fr) auto 128px;gap:10px;align-items:center;padding:9px 8px;border-top:1px solid var(--row)">
    <span class="box${done ? " on" : ""}">${done ? icon("check", 10) : ""}</span>
    <span class="muted">${icon(ic, 14)}</span>
    <span style="min-width:0;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center"><span class="${done ? "muted" : "fg"}" style="${done ? "text-decoration:line-through" : ""}">${title}</span>${chips.map((chip) => `<span class="tag">${chip}</span>`).join("")}${source ? `<span class="cap">${source}</span>` : ""}</span>
    <span>${action}</span>
    <span class="num ${dueTone}" style="font-size:12px;text-align:right">${due}</span>
  </div>`;
const group = (title, count, tone, rows) => `<section style="margin-top:22px"><div style="display:flex;gap:8px;align-items:baseline;padding:0 8px 6px"><span class="sys" style="font-weight:600;font-size:14px">${title}</span><span class="num ${tone}">${count}</span></div>${rows}</section>`;
const tasks = page(
  "Tasks",
  `<div class="page" style="padding-bottom:110px">${top("Tasks")}
  <header style="margin-top:8px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
    <div><h1 style="margin-top:0">Tasks</h1><p class="sub" style="margin:4px 0 0">3 overdue. 5 due today.</p>
      <div class="intro">${icon("done", 14, 'style="color:var(--muted)"')}<span>Calls, documents and meetings each of us owes someone, and when they are due.</span><span class="how">${icon("book", 12)} How to use this</span></div></div>
    <div class="tabs"><span class="on">Mine 11</span><span>Team 26</span><span>Asked of others 4</span><span>Done</span></div>
  </header>
  <div class="card" style="margin-top:24px;padding:8px;display:grid;grid-template-columns:minmax(0,1fr) 170px 170px 150px auto;gap:8px;align-items:center">
    <span class="in" style="border:0"><span class="fg">Send Kavita Shah the fee illustration</span></span>
    ${select(`${icon("users", 12)} Kavita Shah`)}
    ${select("Tomorrow, 10:00")}
    ${select("Me")}
    <span class="btn">Add</span>
  </div>
  ${group("Overdue", 3, "red", [
    taskRow({ ic: "phone", title: "Call Neeta Kulkarni about the withdrawal", chips: ["Neeta Kulkarni", "ENQ-00002"], due: "Overdue 2h", dueTone: "red", action: `<span class="btn sm">${icon("phone", 12)} +91 98670 22222</span>`, source: "Investor withdrawal playbook" }),
    taskRow({ ic: "mail", title: "Send the PMS account opening checklist", chips: ["Kavita Shah", "PMS, Rs. 1.5 cr"], due: "Overdue 1 day", dueTone: "red", action: `<span class="btn sm">${icon("mail", 12)} Write</span>` }),
    taskRow({ ic: "check", title: "Check Sanjay Gupta's KYC with operations", chips: ["Sanjay Gupta", "PMS, Rs. 1 cr"], due: "Overdue 1 day", dueTone: "red" }),
  ].join(""))}
  ${group("Today", 5, "muted", [
    taskRow({ ic: "phone", title: "Confirm Tuesday's meeting", chips: ["Rohan Mehta"], due: "10:00", done: true }),
    `<div style="display:grid;grid-template-columns:46px minmax(0,1fr) auto auto 128px;gap:8px;align-items:center;padding:0 8px 10px">
      <span></span><span class="in"><span class="fg">Confirmed for Tue 21 Oct, 11:00, at the office</span></span><span class="btn sm">Save to timeline</span><span class="btn ghost sm">Then add a task</span><span></span></div>`,
    taskRow({ ic: "users", title: "Meeting with the fund manager", chips: ["Arjun Desai", "Flyingbee, Rs. 2 cr"], due: "15:00" }),
    taskRow({ ic: "mail", title: "Reply with the fact sheet and the Rs. 50 lakh minimum", chips: ["Sameer Joshi", "ENQ-00005"], due: "17:00", action: `<span class="btn sm">${icon("mail", 12)} Write</span>`, source: "PMS enquiry playbook" }),
    taskRow({ ic: "phone", title: "Call back, no answer this morning", chips: ["Meera Iyer"], due: "17:30", action: `<span class="btn sm">${icon("phone", 12)} +91 99300 33333</span>` }),
  ].join(""))}
  ${group("Tomorrow", 2, "muted", [
    taskRow({ ic: "mail", title: "Send the Flyingbee subscription checklist", chips: ["Arjun Desai", "Flyingbee, Rs. 2 cr"], due: "Fri, 10:00" }),
    taskRow({ ic: "check", title: "Chase the signed agreement", chips: ["Ananya Bose", "PMS, Rs. 3 cr"], due: "Fri, 12:00" }),
  ].join(""))}
  ${group("This week", 1, "muted", taskRow({ ic: "users", title: "Meeting at the office", chips: ["Rohan Mehta", "PMS, Rs. 5 cr"], due: "Tue 21 Oct, 11:00" }))}
  <div class="toast"><span>Done: Confirm Tuesday's meeting</span><span class="btn ghost sm" style="color:var(--fg)">Undo</span></div>
  </div>`,
);

// ---------------------------------------------------------------- playbook panel on an enquiry
const step = (on, text, meta) => `<div style="display:grid;grid-template-columns:18px minmax(0,1fr);gap:8px;padding:5px 0"><span class="box${on ? " on" : ""}" style="margin-top:2px">${on ? icon("check", 10) : ""}</span><span><span class="${on ? "muted" : "fg"}">${text}</span>${meta ? `<span class="cap num" style="display:block">${meta}</span>` : ""}</span></div>`;
const playbook = page(
  "Playbook on an enquiry",
  `<div style="padding:32px;display:flex;gap:24px;align-items:flex-start">
  <section class="panel" style="width:320px"><div class="pt"><h2>Reply by</h2></div>
    <p class="red num" style="font:600 16px/22px -apple-system,sans-serif;margin:0">13 Oct, 8:16 pm<span class="cap" style="display:block;font-weight:400">Replied 13 Oct, 4:52 pm</span></p>
    <div style="margin-top:16px;border-top:1px solid var(--line);padding-top:12px">
      <p class="fg" style="margin:0;font-weight:500">Large PMS investor</p>
      <p class="cap" style="margin:2px 0 8px">Best taken by Sales</p>
      ${step(true, "Call within the reply time; email only if they don't pick up.", "Done by Vikram Iyer, 13 Oct 4:50 pm")}
      ${step(false, "Offer a meeting with the fund manager.", "Vikram Iyer · due 14 Oct")}
      ${step(true, "Open a deal once a meeting is set.", "Ticked when the deal opened, 16 Oct")}
    </div>
  </section>
  <section class="panel" style="width:320px"><div class="pt"><h2>Reply by</h2></div>
    <p class="fg num" style="font:600 16px/22px -apple-system,sans-serif;margin:0">17 Oct, 11:20 am<span class="cap" style="display:block;font-weight:400">in 21h</span></p>
    <div style="margin-top:16px;border-top:1px solid var(--line);padding-top:12px">
      <p class="fg" style="margin:0;font-weight:500">AIF enquiry</p>
      <p class="cap" style="margin:2px 0 8px">Best taken by Sales</p>
      ${step(false, "Confirm the Rs. 1 crore minimum before sending any material.", "Taken by nobody yet")}
      <div class="pt-h" style="margin:12px 0 4px">Keep in mind</div>
      <p style="margin:0">Send no AIF returns until compliance has cleared them for this person.</p>
    </div>
  </section></div>`,
  { width: 740 },
);

// ---------------------------------------------------------------- deals board
const dealCard = ({ name, entity = "", amount, next, tone = "", days, daysTone = "", owner = "VI", ic = "clock" }) => `
  <div class="dcard">
    <div class="r"><span class="fg" style="font-weight:500">${name}</span><span class="fg num">${amount}</span></div>
    ${entity ? `<span class="cap" style="margin-top:-4px">${entity}</span>` : ""}
    <span class="${tone || "muted"}" style="font-size:12px;line-height:16px">${tone === "amber" ? icon("alert", 11) : icon(ic, 11)} ${next}</span>
    <div class="r" style="align-items:center"><span class="cap num ${daysTone}">${days}</span><span class="av">${owner}</span></div>
  </div>`;
const column = (title, count, total, cards, extra = "") => `<div class="col"><div class="ch"><span><span class="fg" style="font-weight:500">${title}</span> <span class="muted num">${count}</span></span><span class="cap num">${total}</span></div>${cards.join("")}${extra}</div>`;
const board = `
  <div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr)) 64px;gap:10px;margin-top:24px">
    ${column("Enquiry", 2, "Rs. 3 cr", [dealCard({ name: "Arjun Rao", amount: "Rs. 1 cr", next: "No next step", tone: "amber", days: "1 day" }), dealCard({ name: "Meera Iyer", amount: "Rs. 2 cr", next: "Call back, today 17:30", ic: "phone", days: "today", owner: "AS" })])}
    ${column("Contacted", 2, "Rs. 3.5 cr", [dealCard({ name: "Kavita Shah", amount: "Rs. 1.5 cr", next: "Overdue: send the checklist", tone: "red", ic: "mail", days: "4 days" }), dealCard({ name: "Vikram Desai", entity: "Desai Family Trust", amount: "Rs. 2 cr", next: "Call, Mon 10:00", ic: "phone", days: "2 days", owner: "AS" })])}
    ${column("Meeting", 2, "Rs. 7 cr", [dealCard({ name: "Rohan Mehta", entity: "Mehta Family HUF", amount: "Rs. 5 cr", next: "Meeting, Tue 21 Oct 11:00", ic: "users", days: "2 days" }), dealCard({ name: "Nikhil Joshi", amount: "Rs. 2 cr", next: "No next step", tone: "amber", days: "16 days here", daysTone: "amber", owner: "AS" })])}
    ${column("Documents sent", 1, "Rs. 3 cr", [dealCard({ name: "Ananya Bose", amount: "Rs. 3 cr", next: "Chase the signed agreement, Fri", ic: "check", days: "3 days" })])}
    ${column("Onboarding", 1, "Rs. 1 cr", [dealCard({ name: "Sanjay Gupta", amount: "Rs. 1 cr", next: "Overdue: check KYC with operations", tone: "red", ic: "check", days: "6 days" })])}
    ${column("Invested", 2, "Rs. 4 cr", [dealCard({ name: "Rakesh Jain", amount: "Rs. 2.5 cr", next: "Invested 9 Oct", ic: "done", days: "this quarter", owner: "AS" }), dealCard({ name: "Farah Khan", amount: "Rs. 1.5 cr", next: "Invested 2 Oct", ic: "done", days: "this quarter" })])}
    <div class="col" style="min-height:560px;padding:8px 4px;justify-items:center"><span class="muted" style="writing-mode:vertical-rl;transform:rotate(180deg);padding-top:6px">Lost <span class="num">3</span></span></div>
  </div>`;
const dealsHeader = `
  <header style="margin-top:8px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
    <div><h1 style="margin-top:0">Deals</h1><p class="sub num" style="margin:4px 0 0">Rs. 17.5 crore in 8 open PMS deals. 2 have no next step.</p>
      <div class="intro">${icon("board", 14, 'style="color:var(--muted)"')}<span>Each prospective investment, from first contact to money in, and the stage it has reached.</span><span class="how">${icon("book", 12)} How to use this</span></div></div>
    <div style="display:flex;gap:12px;align-items:center"><div class="tabs"><span class="on">PMS 8</span><span>Flyingbee AIF 3</span></div><div class="tabs"><span class="on">${icon("board", 13)}</span><span>${icon("list", 13)}</span></div>${select("Everyone", { width: 130 })}</div>
  </header>`;
const deals = page("Deals", `<div class="page">${top("Deals")}${dealsHeader}${board}</div>`);

const dealMove = page(
  "Moving a deal to Invested",
  `<div class="page" style="position:relative">${top("Deals")}${dealsHeader}${board}
  <div style="position:absolute;inset:0;background:rgba(0,0,0,.55)"></div>
  <div class="pop" style="left:50%;top:230px;transform:translateX(-50%);width:440px;padding:20px">
    <div class="sys" style="font-weight:600;font-size:16px;line-height:22px">Sanjay Gupta to Invested</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
      <div><span class="l">Amount invested (Rs. crore)</span><span class="in num">1.00</span></div>
      <div><span class="l">Invested on</span>${select("16 Oct 2026")}</div>
    </div>
    <div style="display:grid;gap:10px;margin-top:16px">
      <span style="display:flex;gap:8px;align-items:center"><span class="sq on">${icon("check", 11)}</span>Invite Sanjay Gupta to the client portal</span>
      <span style="display:flex;gap:8px;align-items:center"><span class="sq on">${icon("check", 11)}</span>Then write the Welcome letter</span>
    </div>
    <div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end"><span class="btn ghost">Cancel</span><span class="btn pri">Move to Invested</span></div>
  </div></div>`,
);

const out = { "person.html": person, "call.html": call, "attach.html": attach, "files.html": files, "tasks.html": tasks, "playbook.html": playbook, "deals.html": deals, "deal-move.html": dealMove };
for (const [name, html] of Object.entries(out)) writeFileSync(join(here, name), html);
console.log(Object.keys(out).join(" "));
