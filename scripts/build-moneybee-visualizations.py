"""Build the offline review page from the committed slide factsheets."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
source = json.loads((ROOT / 'docs/moneybee-slide-factsheets.json').read_text())
group, aif = [deck['slides'] for deck in source['decks']]
for slide, values in [(group[18], ['26.54', '5.78']), (aif[11], ['28.85', '5.97'])]:
    assert all(value in ' '.join(slide['facts']) for value in values)
data = dict(snapshots=[dict(slide=group[18], pms=26.54, benchmark=5.78, date='30 April 2026', anchor='group-profile-apr2026-p19'), dict(slide=aif[11], pms=28.85, benchmark=5.97, date='31 July 2026', anchor='flyingbee-aug2026-p12')], research=group[12], pyramid=group[19], companies=group[20:23], risks=[group[15],aif[6]], process=[group[16],aif[4]], allocation=aif[8])
assert len(data['research']['tables'][0]['rows']) == 5
assert all(len(s['tables'][0]['rows']) == 5 for s in data['companies'])
page = r'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Moneybee · Numbers & strategy</title><style>
:root{--paper:#faf9f5;--ink:#242421;--muted:#686860;--orange:#ed672c;--line:#d8d7cf;--ease-out:cubic-bezier(0.23,1,0.32,1)}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 'Helvetica Neue',Arial,sans-serif}button,select{font:inherit;color:inherit}button{cursor:pointer}a{color:inherit;text-underline-offset:4px}header{max-width:1200px;margin:auto;padding:25px 36px;display:flex;justify-content:space-between;font-size:13px}header a{text-decoration:none}.brand{font-size:22px;font-weight:700;letter-spacing:-1px}.brand span{color:var(--orange)}main{max-width:1200px;margin:auto;padding:0 36px}section{padding:70px 0 50px;border-bottom:1px solid var(--line);scroll-margin-top:20px}section:first-child{padding-top:15px}h1,h2,h3,p{margin:0}h2{font-size:clamp(28px,4vw,46px);font-weight:500;letter-spacing:-1.5px;margin-bottom:32px}h3{font-size:26px;font-weight:500}.eyebrow{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:12px}.controls{display:flex;flex-wrap:wrap;gap:6px;margin:24px 0}button,select{min-height:44px;border:1px solid var(--line);background:transparent;padding:9px 16px;border-radius:3px}button[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}button:hover{border-color:var(--ink)}:focus-visible{outline:3px solid var(--orange);outline-offset:4px}.note,.source{font-size:13px;color:var(--muted);max-width:850px;margin-top:18px}.source{margin-top:12px}details{margin-top:22px;font-size:14px}summary{cursor:pointer;min-height:44px;padding:10px 0}details p{margin:12px 0}table{border-collapse:collapse;width:100%;margin:18px 0;font-variant-numeric:tabular-nums}th,td{text-align:left;border-bottom:1px solid var(--line);padding:10px 8px}th{font-weight:500}.table-wrap{overflow:auto}svg{display:block;width:100%;height:auto}.wealth{height:auto;max-height:610px}.split{display:grid;grid-template-columns:1.1fr 1fr;gap:65px;align-items:center}.readout{min-height:200px}.big{font-size:clamp(38px,6vw,72px);letter-spacing:-2px;font-weight:500;line-height:1.1}.readout p{margin-top:18px;max-width:460px}.steps{display:grid;gap:9px}.step{text-align:left;display:flex;justify-content:space-between;align-items:center;border:0;border-bottom:1px solid var(--line);border-radius:0;padding:18px 12px}.step span:last-child{font-size:25px}.pyramid{display:flex;flex-direction:column;align-items:center;gap:5px;padding:12px 0}.tier{height:70px;border:0;border-radius:0;background:#e7e5dc;clip-path:polygon(34px 0,calc(100% - 34px) 0,100% 100%,0 100%);font-size:22px}.tier:first-child{clip-path:polygon(50% 0,100% 100%,0 100%);height:92px;padding:58px 0 0;font-size:16px}.tier[aria-pressed=true]{background:var(--orange);color:var(--ink)}.tier:focus-visible{filter:drop-shadow(0 0 3px black);outline:none}.company-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.chart{height:330px;display:flex;align-items:stretch;gap:24px;border-bottom:1px solid var(--ink);margin:35px 0 10px;padding:0 20px}.bar-button{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:0;border:0;position:relative;border-radius:0;background:transparent!important;color:var(--ink)!important}.bar-button .bar{width:100%;max-width:135px;background:#ddd9cc;transition:none}.bar-button[aria-pressed=true] .bar{background:var(--orange)}.bar-value{padding-bottom:10px;font-size:20px}.years{display:flex;gap:24px;padding:0 20px}.years span{flex:1;text-align:center;font-size:13px}.growth-top{display:flex;align-items:center;justify-content:space-between;gap:20px}.growth-top .big{font-size:48px}.zero{font-size:12px;color:var(--muted)}.allocation{display:flex;margin:50px 0 25px;gap:4px;min-height:175px}.allocation button{border:0;text-align:left;padding:22px;background:#e7e5dc;border-radius:0}.allocation button:first-child{width:51%}.allocation button:last-child{width:49%}.allocation button[aria-pressed=true]{background:var(--orange);color:var(--ink)}.allocation strong{display:block;font-size:clamp(40px,7vw,86px);font-weight:500;line-height:1.1}.risk-detail{border-left:3px solid var(--orange);padding-left:30px;min-height:180px;max-width:800px}.risk-detail p{font-size:22px}.footer{padding:35px 0 60px;font-size:13px;color:var(--muted)}@media(max-width:650px){header{padding:20px}.brand{font-size:20px}main{padding:0 20px}section{padding-top:45px}.split{grid-template-columns:1fr;gap:25px}.readout{min-height:150px}.wealth{width:calc(100% + 24px);margin-left:-12px}.chart{gap:12px;padding:0 4px;height:270px}.years{gap:12px;padding:0 4px}.bar-value{font-size:16px}.growth-top{align-items:flex-start;flex-direction:column}.growth-top .big{font-size:40px}.tier{height:58px}.allocation{min-height:135px}.allocation button{padding:12px}.risk-detail p{font-size:19px}h2{letter-spacing:-.8px}td,th{padding:8px 5px}header>span{font-size:11px}}@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}@media print{section{break-inside:avoid}details{display:block}.controls{display:none}}

/* The funnel is a process diagram; numerical labels carry the approximate counts. */
.research-layout{display:grid;grid-template-columns:1.45fr 1fr;gap:45px;align-items:start}
.funnel-stages{display:grid;grid-template-rows:repeat(5,minmax(0,88fr)) minmax(0,95fr) minmax(0,135fr);height:100%;padding:0}.funnel-stages button:last-child{grid-row:7}
.funnel-aside{height:100%;min-height:0}.funnel-stages button{min-height:0;border:0;border-bottom:1px solid var(--line);border-radius:0;text-align:left;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;gap:15px;background:transparent;color:var(--ink)}
.funnel-stages button strong{font-size:32px;font-weight:500;letter-spacing:-1px;font-variant-numeric:tabular-nums}.funnel-stages button small{display:block;color:var(--muted);font-size:12px}
.funnel-stages button[aria-pressed=true]{color:var(--orange);background:#f0ede3;border-left:3px solid var(--orange)}
.research-bottom{display:grid;grid-template-columns:1fr 1.25fr;gap:35px;align-items:start;margin-top:26px}.research-bottom .controls{margin:0}.research-bottom p{font-size:15px}.research-bottom strong{display:block;font-size:18px;margin-bottom:6px}
#pause-research:disabled{opacity:.4;cursor:default}
.picks-layout{display:grid;grid-template-columns:.9fr 1.2fr;gap:40px;align-items:stretch}#tier-rows{display:grid;grid-template-rows:repeat(5,1fr);padding:0}
#tier-rows button{border:0;border-bottom:1px solid var(--line);border-radius:0;display:grid;grid-template-columns:115px 1fr;gap:15px;text-align:left;align-items:center;padding:10px 15px;background:transparent;color:var(--ink)}
#tier-rows button strong{font-size:35px;font-weight:500;letter-spacing:-1px}#tier-rows button span{font-size:17px;line-height:1.4}#tier-rows button[aria-pressed=true]{background:#f0ede3;color:var(--ink)}#tier-rows button[aria-pressed=true] strong{color:var(--orange)}
.picks-bottom{min-height:65px;display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:22px}.picks-bottom .company-links{margin:0}.picks-bottom p{font-size:14px;color:var(--muted)}
.company-business{max-width:760px;margin-top:-15px;color:var(--muted);font-size:17px}.growth-summary{display:grid;grid-template-columns:1fr 1fr 1fr;gap:25px;margin:42px 0 20px}.growth-summary strong{display:block;font-size:clamp(32px,4.5vw,58px);font-weight:500;letter-spacing:-1.8px;line-height:1.3;font-variant-numeric:tabular-nums}.data-label{display:block;font-size:13px;color:var(--muted)}.growth-multiple{border-left:1px solid var(--line);padding-left:35px}.growth-multiple strong{color:var(--orange)}
.growth-chart{position:relative}.growth-chart .chart{height:320px;padding:0 35px;gap:45px;margin-top:35px;border-bottom:1px solid var(--ink);position:relative}.chart-grid{position:absolute;inset:0;pointer-events:none;display:flex;flex-direction:column;justify-content:space-between}.chart-grid div{border-top:1px solid #e7e5dc;color:var(--muted);font-size:11px;height:0;position:relative}.chart-grid span{position:absolute;top:-20px;right:0;background:var(--paper)}.bar-button .bar{max-width:135px;height:100%;width:100%;background:repeating-linear-gradient(to top,#aaa79b 0 2px,transparent 2px 7px);transform-origin:bottom;transition:none}.bar-button[aria-pressed=true] .bar{background:repeating-linear-gradient(to top,var(--orange) 0 2px,transparent 2px 7px)}.bar-button .bar-value{position:absolute;left:50%;transform:translateX(-50%);font-size:20px;bottom:0;font-variant-numeric:tabular-nums;background:var(--paper);padding:0 4px 8px;z-index:1}.bar-button:focus-visible{outline-offset:8px}.growth-reading{display:flex;justify-content:space-between;gap:20px;margin:24px 0}.growth-reading p{font-weight:500}.growth-reading span{font-size:13px;color:var(--muted)}.years{padding:0 35px;gap:45px}
@media(max-width:650px){.research-layout{grid-template-columns:1.1fr 1fr;gap:8px;height:558px}.funnel-stages button small{display:none}.funnel-diagram svg{height:558px;object-fit:fill}.funnel-stages button{padding:7px 5px;display:block}.funnel-stages button strong{display:block;font-size:27px;letter-spacing:-.6px}.funnel-stages button span{font-size:12px}.funnel-stages button small{font-size:10px}.research-bottom{grid-template-columns:1fr;gap:22px}.picks-layout{grid-template-columns:105px 1fr;gap:10px}#pyramid{height:480px;object-fit:fill}#tier-rows button{grid-template-columns:1fr;gap:0;padding:7px 8px}#tier-rows button strong{font-size:27px}#tier-rows button span{font-size:13px}.picks-bottom{display:block}.picks-bottom .company-links{margin-top:14px}.company-business{margin-top:0;font-size:15px}.growth-summary{gap:14px;margin-top:32px}.growth-summary strong{font-size:30px;letter-spacing:-1px}.growth-multiple{padding-left:12px}.data-label{font-size:11px}.growth-chart .chart{height:270px;padding:0 14px;gap:20px}.years{padding:0 14px;gap:20px}.bar-button .bar-value{font-size:15px}.growth-reading{display:block}.growth-reading span{display:block;margin-top:4px}}

/* Hover changes emphasis, never the height that encodes the financial value. */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.funnel-stages button:last-child{transition:background-color 180ms var(--ease-out),color 180ms var(--ease-out)}.funnel-stages button.is-complete{background:#f9e8d7;color:#b74815;border-left:3px solid var(--orange)}.funnel-stages button.is-complete strong{font-weight:600}.funnel-diagram{position:relative}
#pyramid{overflow:visible}.pyramid-tier{transform-box:fill-box;transform-origin:center;transition:none}.pyramid-face{fill:#e8e4d8;stroke:#c5c0b3;stroke-width:.8;transition:fill .25s,stroke .25s}.pyramid-tier.is-active .pyramid-face{fill:#f7d9bb;stroke:#ed672c}.pyramid-stripes{opacity:.7;transition:opacity .25s}.pyramid-tier.is-active .pyramid-stripes{opacity:1}.pyramid-guide{stroke:#cbc6b8;stroke-width:1;stroke-dasharray:2 5;transition:stroke .25s}.pyramid-tier.is-active .pyramid-guide{stroke:#ed672c;stroke-dasharray:none}
#tier-rows button{transition:background-color 180ms var(--ease-out),transform 180ms var(--ease-out)}#tier-rows button[data-active=true]{background:#f2e8da;transform:translateX(5px)}#tier-rows button[data-active=true] strong{color:#bd4b17}
.bar-button{isolation:isolate}.bar-button::before{content:'';position:absolute;inset:0 -12px;background:#f1ecdf;opacity:0;transition:opacity 160ms var(--ease-out);border-radius:3px;z-index:-1}.bar-button[data-active=true]::before{opacity:.65}.bar-button .bar,.bar-button[aria-pressed=true] .bar{position:relative;background:repeating-linear-gradient(to top,#aaa79b 0 2px,transparent 2px 7px)}.bar-button .bar::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(to top,var(--orange) 0 2px,transparent 2px 7px);opacity:0;transition:opacity 160ms var(--ease-out)}.bar-button[data-active=true] .bar::after{opacity:1}.bar-button .bar-value{transition:color 160ms var(--ease-out),background-color 160ms var(--ease-out)}.bar-button[data-active=true] .bar-value{color:#b74815;background:#f9f0e4}.years span{transition:color 160ms var(--ease-out)}.years span[data-active=true]{color:#b74815;font-weight:600}
#growth-guide{position:absolute;inset:0;border-bottom:1px dashed #da9369;pointer-events:none;opacity:0;transition:transform 180ms var(--ease-out),opacity 120ms var(--ease-out);z-index:2}#growth-guide.is-visible{opacity:.65}#growth-change{font-variant-numeric:tabular-nums;color:#b74815}.growth-reading{min-height:27px}
@media(max-width:650px){.picks-layout{grid-template-columns:125px 1fr}#tier-rows button[data-active=true]{transform:translateX(2px)}.bar-button::before{inset:0 -5px}}

/* Separate frustums use the same isometric projection at every tier. */
.picks-layout{grid-template-columns:1.25fr 1fr;gap:24px}.pyramid-tier{transition:none}.iso-top{fill:#f1e8d7;stroke:#ded0b7;stroke-width:1}.iso-left{fill:#ded1b9;stroke:#ccbaa0;stroke-width:1}.iso-right{fill:#bca88d;stroke:#b19b7e;stroke-width:1}.iso-edge{stroke:#fff8eb;stroke-width:1.2}.iso-top,.iso-left,.iso-right{transition:fill 180ms var(--ease-out),stroke 180ms var(--ease-out)}.pyramid-tier.is-active .iso-top{fill:#ffbd75;stroke:#efa152}.pyramid-tier.is-active .iso-left{fill:#ef8a43;stroke:#dc7132}.pyramid-tier.is-active .iso-right{fill:#cb591f;stroke:#c5541e}.pyramid-hit{cursor:pointer}.pyramid-guide{opacity:.6}
@media(max-width:650px){.picks-layout{grid-template-columns:1fr;gap:5px}#pyramid{height:auto;aspect-ratio:720/650;max-height:370px}#tier-rows button{grid-template-columns:90px 1fr;min-height:72px}.picks-bottom{display:flex;flex-wrap:wrap}.funnel-diagram svg{overflow:visible}}
#funnel{overflow:visible}#portfolio-finish{transform-origin:310px 474px;transform:scale(1.25)}@media(max-width:650px){#portfolio-finish{transform:scale(3,1)}}

.tier-engraving{stroke:#fff7e7;stroke-width:.65;opacity:.3;pointer-events:none}.iso-top{fill:url(#tier-metal)}.iso-edge{stroke-width:1.6}.tier-shadow{transition:opacity 180ms var(--ease-out)}.pyramid-tier.is-active .iso-left{fill:#f09750}.pyramid-tier.is-active .iso-right{fill:#c5632d}
.bar-button .bar{transition:none}.bar-button .bar-value{transition:color 160ms var(--ease-out),background-color 160ms var(--ease-out)}.bar-label-position{position:absolute;inset:0;pointer-events:none;z-index:1}.replay-growth{margin-top:5px}
.risk-layout{display:grid;grid-template-columns:1.2fr 1fr;gap:50px;align-items:center;margin:35px 0}.risk-explanation h3{font-size:30px;line-height:1.2;margin-bottom:18px;letter-spacing:-.6px}.risk-explanation>p:last-child{font-size:17px;line-height:1.65}.process-panel{border-top:1px solid var(--line);padding-top:30px;margin-top:38px}.process-panel h3{font-size:22px;margin-bottom:20px}#process-controls{display:flex;flex-wrap:wrap;gap:8px}#process-controls button{font-size:14px}#process-result{margin-top:18px;max-width:900px;min-height:52px;font-size:15px}.ordered-process button{border-bottom-width:3px}
.allocation-intro{font-size:20px;color:var(--muted);margin-top:-18px}.allocation-layout{display:grid;grid-template-columns:1.5fr 1fr;gap:60px;align-items:center;margin-top:35px}.unit-top{fill:#777569;stroke:#faf6ec;stroke-width:1;transition:fill 160ms var(--ease-out)}.unit-side{fill:#56574e;transition:fill 160ms var(--ease-out)}.allocation-unit.is-listed .unit-top{fill:#ef9555}.allocation-unit.is-listed .unit-side{fill:#c76a30}.unit-key{font-size:12px;color:var(--muted);text-align:center}.allocation-amounts{display:grid;gap:26px}.allocation-amounts>div{border-bottom:1px solid var(--line);padding-bottom:24px}.asset-label{display:block;font-size:15px}.asset-label i{display:inline-block;width:10px;height:10px;margin-right:8px}.listed-key{background:#ed7835}.unlisted-key{background:#777569}.allocation-amounts strong{display:block;font-size:clamp(32px,4vw,50px);font-weight:500;letter-spacing:-1.5px;line-height:1.3}.allocation-amounts>div>span:nth-of-type(2){font-size:13px;color:var(--muted)}.allocation-amounts p{font-size:14px;color:var(--muted);margin-top:10px;max-width:300px}.allocation-slider{max-width:800px;margin-top:40px}.allocation-slider label{display:flex;justify-content:space-between;font-size:17px}.allocation-slider output{font-size:23px;font-variant-numeric:tabular-nums}.allocation-slider input{display:block;width:100%;accent-color:#c5682e;margin:12px 0;min-height:35px;cursor:ew-resize}.range-ends{display:flex;justify-content:space-between;font-size:12px;color:var(--muted)}.allocation-context{min-height:48px;font-size:17px;max-width:780px}
@media(max-width:650px){.risk-layout{grid-template-columns:1fr;gap:25px}.risk-explanation h3{font-size:26px}.risk-explanation>p:last-child{font-size:15px}.allocation-layout{grid-template-columns:1fr;gap:25px}.allocation-amounts{grid-template-columns:1fr 1fr;gap:18px}.allocation-amounts strong{font-size:32px}.allocation-amounts p{font-size:13px}.allocation-intro{font-size:17px}.allocation-context{font-size:15px}.process-panel{margin-top:25px}}

#process-controls.ordered-process{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.ordered-process button{position:relative;display:flex;align-items:center;flex-direction:column;gap:10px;border:0!important;background:transparent!important;color:var(--ink)!important;padding:6px 4px;min-height:92px}.ordered-process button::after{content:'';position:absolute;top:25px;left:calc(50% + 24px);width:calc(100% - 38px);border-top:1px solid var(--line)}.ordered-process button:last-child::after{display:none}.process-number{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--line);border-radius:50%;background:var(--paper)}.ordered-process button[aria-pressed=true] .process-number{color:var(--paper);background:#c36731;border-color:#c36731}.ordered-process button[aria-pressed=true]>span:last-child{font-weight:600}
@media(prefers-reduced-motion:no-preference){.growth-chart:not(.is-revealed) .bar{clip-path:inset(100% 0 0)!important}.growth-chart:not(.is-revealed) .bar-value{opacity:0}}
@media(max-width:650px){#process-controls.ordered-process{grid-template-columns:repeat(3,1fr)}.ordered-process button:nth-child(3)::after{display:none}}
html[data-input="keyboard"] *,html[data-input="keyboard"] *::before,html[data-input="keyboard"] *::after{transition:none!important}
</style></head><body><header><a class="brand" href="#wealth">moneybee<span>.</span></a><span>Presentation study · Review copy</span></header><main>
<section id="wealth" aria-label="Historical PMS wealth comparison"><div id="wealth-graphic"></div><div id="snapshots" class="controls" aria-label="Performance snapshot"></div><p id="wealth-date" class="source"></p><p class="note">Historical PMS illustration. Past performance does not indicate future returns. Both ending amounts use the same scale, starting from zero. Lines are a visual texture.</p><div id="wealth-source"></div></section>
<section id="research"><p class="eyebrow">01 · Research</p><h2>From ~6,000 companies to ~20 stocks.</h2><div class="research-layout"><div class="funnel-diagram"><svg id="funnel" viewBox="0 0 620 670" preserveAspectRatio="none" role="img" aria-label="Research funnel from approximately 6000 companies to approximately 20 portfolio stocks"></svg></div><div class="funnel-aside"><div id="research-steps" class="funnel-stages" aria-label="Research stages"></div></div></div><div class="research-bottom"><div class="controls"><button id="play-research">Replay selection</button><button id="pause-research">Pause</button></div><div id="research-result" aria-live="polite"></div></div><p class="note">Approximate counts from Group Profile, page 13. Funnel widths and marks illustrate the stages, not a measured conversion rate or individual company paths.</p><div id="research-source"></div></section>
<section id="picks"><p class="eyebrow">02 · Historical PMS picks</p><h2>The companies behind the multiples.</h2><div class="picks-layout"><svg id="pyramid" viewBox="0 0 720 650" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Five tiers of historical PMS stock multiple claims"></svg><div id="tier-rows" aria-label="Historical stock multiples"></div></div><div class="picks-bottom"><button id="replay-pyramid">Replay pyramid</button><p id="tier-result" class="sr-only" aria-live="polite"></p><div id="company-links" class="company-links"></div></div><p class="note">Historical PMS claims from the deck. Holding dates and the return calculation basis are not supplied. The pyramid shows a hierarchy, not portfolio weights.</p><div id="picks-source"></div></section>
<section id="growth"><p class="eyebrow">03 · Business growth</p><div class="growth-top"><h2 id="company-title">KPI Green Energy</h2><select id="company" aria-label="Company"><option>KPI Green Energy</option><option>Uni Abex Alloy</option><option>Pitti Engineering</option></select></div><p id="company-business" class="company-business"></p><div id="metrics" class="controls" aria-label="Financial metric"></div><div class="growth-summary"><div><span class="data-label" id="growth-start-label">FY20</span><strong id="growth-start"></strong></div><div><span class="data-label" id="growth-end-label">FY24</span><strong id="growth-end"></strong></div><div class="growth-multiple"><strong id="growth-multiple"></strong><span class="data-label" id="growth-multiple-label"></span></div></div><div class="growth-chart"><div class="chart-grid" aria-hidden="true" id="chart-grid"></div><div id="growth-guide" aria-hidden="true"></div><div id="bars" class="chart" aria-label="Annual financial values"></div></div><div class="years"><span>FY20</span><span>FY21</span><span>FY22</span><span>FY23</span><span>FY24</span></div><div class="growth-reading"><p id="growth-value" aria-live="polite"></p><span id="growth-change"></span></div><button id="replay-growth" class="replay-growth">Replay growth</button><p class="note">₹ crore · zero baseline. Company financial growth, not stock returns or investment recommendations. EBIDTA follows the spelling in the source.</p><div id="company-source"></div></section>
<section id="risk"><p class="eyebrow">04 · Risk & process</p><h2>How investment risks are addressed.</h2><div id="risk-modes" class="controls" aria-label="Investment product"></div><div id="risk-categories" class="controls" aria-label="Risk category"></div><div class="risk-layout"><svg id="risk-diagram" viewBox="0 0 620 360" role="img"></svg><div id="risk-result" class="risk-explanation" aria-live="polite"></div></div><div class="process-panel"><h3 id="process-title"></h3><div id="process-controls" aria-label="Investment process"></div><p id="process-result" aria-live="polite"></p></div><p class="note">Schematic controls, not a model of investment outcomes. Securities investments remain subject to market risk. No numerical single-stock cap is supplied.</p><div id="risk-source"></div></section>
<section id="allocation"><p class="eyebrow">05 · Flyingbee Investment Fund</p><h2>How Flyingbee can allocate ₹1 crore.</h2><p class="allocation-intro">At least 51% listed. Up to 49% unlisted.</p><div class="allocation-layout"><div><svg id="allocation-field" viewBox="0 0 650 400" role="img" aria-label="Illustrative allocation of one crore rupees"></svg><p class="unit-key">100 tiles · Each tile represents ₹1 lakh in this illustration</p></div><div class="allocation-amounts" aria-live="polite"><div><span class="asset-label"><i class="listed-key"></i> Listed</span><strong id="listed-amount"></strong><span id="listed-percent"></span><p>Exchange trading. Sufficient trading volumes matter for entry and exit.</p></div><div><span class="asset-label"><i class="unlisted-key"></i> Unlisted</span><strong id="unlisted-amount"></strong><span id="unlisted-percent"></span><p>Exits through an IPO, buyback or strategic sale. No active trading market.</p></div></div></div><div class="allocation-slider"><label for="listed-share">Illustrative listed share <output id="listed-output" for="listed-share">51%</output></label><input type="range" id="listed-share" min="51" max="100" value="51" step="1"><div class="range-ends"><span>51% minimum</span><span>100% listed</span></div></div><div id="allocation-presets" class="controls" aria-label="Allocation examples"></div><p id="allocation-result" class="allocation-context" aria-live="polite"></p><p class="note">Illustration assumes the full ₹1 crore is split between listed and unlisted investments. It is not the current portfolio. Minimum investment ₹1 crore; suitable time frame 3–5 years. No exit load does not mean immediate liquidity.</p><div id="allocation-source"></div></section>
<footer class="footer">Moneybee presentation reference · <a href="Moneybee-presentation-factsheets.html">All 49 slide factsheets</a></footer></main><script>
const D=__DATA__;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function table(t){return `<div class="table-wrap"><table><caption>${esc(t.title)}</caption><thead><tr>${t.headers.map(v=>`<th scope="col">${esc(v)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function source(id,slide,anchor,extra=''){ $(id).innerHTML=`<details><summary>Source & details</summary><a href="Moneybee-presentation-factsheets.html#${anchor}">${esc(slide.title)} · page ${slide.page}</a>${slide.facts.map(v=>`<p>${esc(v)}</p>`).join('')}${slide.tables.map(table).join('')}${extra}</details>` }
function buttons(id,labels,selected,fn){$(id).replaceChildren(...labels.map((label,i)=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed',String(i===selected));b.onclick=()=>{fn(i);$(id).children[i]?.focus({preventScroll:true})};return b}))}
let snapshot=1,stage=0,tier=0,company=0,metric=1,year=4,mode=0,risk=0,allocation=0;
function wealth(i){snapshot=i;const s=D.snapshots[i],height=v=>v/28.85*370,p=height(s.pms),b=height(s.benchmark);$('wealth-graphic').innerHTML=`<svg class="wealth" viewBox="0 0 1000 650" role="img" aria-labelledby="wealth-title wealth-desc"><title id="wealth-title">₹10 lakh invested in Moneybee PMS and S&amp;P BSE 500 TRI</title><desc id="wealth-desc">At ${s.date}, PMS ₹${(s.pms/10).toFixed(3)} crore, benchmark ₹${(s.benchmark*10).toFixed(1)} lakh. Ending value ratio ${(s.pms/s.benchmark).toFixed(2)} times.</desc><defs><pattern id="orange-lines" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="2" fill="#ed672c"/></pattern><pattern id="black-lines" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="2" fill="#242421"/></pattern></defs><text x="90" y="45" font-size="17" fill="#686860">₹10 lakh invested · 1 August 2007</text><text x="260" y="${540-p-25}" font-size="48" letter-spacing="-2">₹${(s.pms/10).toFixed(3)} cr</text><rect x="260" y="${540-p}" width="240" height="${p}" fill="url(#orange-lines)"/><text x="675" y="${540-b-25}" font-size="43" letter-spacing="-2">₹${(s.benchmark*10).toFixed(1)} L</text><rect x="675" y="${540-b}" width="210" height="${b}" fill="url(#black-lines)"/><path d="M535 ${540-p}h20V${540-b}h-20" stroke="#a09e93" fill="none"/><text x="580" y="${540-(p+b)/2}" font-size="38">${(s.pms/s.benchmark).toFixed(2)}×</text><text x="580" y="${570-(p+b)/2}" font-size="15" fill="#686860">vs benchmark</text><rect x="115" y="${540-height(1)}" width="60" height="${height(1)}" fill="url(#orange-lines)"/><rect x="575" y="${540-height(1)}" width="60" height="${height(1)}" fill="url(#black-lines)"/><path d="M90 541H910" stroke="#aaa89e"/><text x="115" y="572" font-size="15">Start ₹10 L</text><text x="260" y="580" font-size="22">Moneybee PMS</text><text x="575" y="572" font-size="15">Start ₹10 L</text><text x="675" y="580" font-size="20">S&amp;P BSE 500 TRI</text></svg>`;buttons('snapshots',['30 Apr 2026','31 Jul 2026'],i,wealth);$('wealth-date').textContent=`As at ${s.date} · APMI, as cited in the presentation · Ending-value ratio calculated from the stated amounts.`;source('wealth-source',s.slide,s.anchor)}

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const stages=[
  {count:'~6,000',name:'Research universe',detail:'Companies in the initial universe',row:0},
  {count:'~1,200',name:'Screening',detail:'Investable companies',row:0},
  {count:'~350',name:'Short list',detail:'Companies shortlisted',row:1},
  {count:'>100',name:'Analyse',detail:'Companies analysed',row:2},
  {count:'~75',name:'Construct',detail:'Stock ideas',row:3},
  {count:'~20',name:'Monitor',detail:'Portfolio stocks',row:4}
];
const widths=[550,365,240,164,118,80],gridColumns=[42,28,18,11,7,5],markCounts=gridColumns.map(columns=>columns*4);
const portfolioDrop=120;
let researchPlaying=false,researchStarted=false,researchRun=0;
const svgNS='http://www.w3.org/2000/svg';
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const narrowScreen=matchMedia('(max-width:650px)');
const motionAllowed=()=>!reduceMotion.matches&&document.documentElement.dataset.input!=='keyboard';
document.addEventListener('keydown',()=>document.documentElement.dataset.input='keyboard',true);
document.addEventListener('pointerdown',()=>document.documentElement.dataset.input='pointer',true);
document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')document.documentElement.dataset.input='pointer'},true);
const easeOut='cubic-bezier(0.23,1,0.32,1)';
// Analytic critical damping keeps position and velocity when a target changes.
function springStep(value,velocity,target,dt,response){const offset=value-target,c=velocity+response*offset,decay=Math.exp(-response*dt);return{value:target+(offset+c*dt)*decay,velocity:(velocity-response*c*dt)*decay}}
let funnelFrame=0,funnelTransition=null,funnelStates=[],funnelNodes=[],funnelPlate=0,funnelPosition=0,funnelVelocity=0,funnelPath=[],funnelTangents=[];
const particleKeys=['x','y','w','h','depth','shape','opacity'];
function svgNode(tag,attrs){const el=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);return el}
function dotPositions(index){
  const n=markCounts[index],w=widths[index]-20,cols=gridColumns[index],rows=4;
  return Array.from({length:n},(_,j)=>{const slot=j*73%n;return{x:310-w/2+(slot%cols+.5)*w/cols,y:18+index*88+Math.floor(slot/cols)*46/rows}});
}
function finalTile(j){const xScale=narrowScreen.matches?3:1.25,yScale=narrowScreen.matches?1:1.25;return{x:310+((j%5)-Math.floor(j/5)-.5)*13*xScale,y:474+portfolioDrop+((j%5)+Math.floor(j/5)-3.5)*6.5*yScale,w:10*xScale,h:5*yScale,depth:4*yScale}}
function funnelTargets(index,previous=[]){const positions=dotPositions(index);return Array.from({length:markCounts[0]},(_,j)=>{
  if(j>=markCounts[index])return{...previous[j],opacity:0};
  return index===5?{...finalTile(j),shape:1,opacity:1}:{...positions[j],w:2.1,h:2.1,depth:0,shape:0,opacity:1};
})}
function buildFunnelPath(){
  funnelPath=[];for(let i=0;i<6;i++)funnelPath.push(funnelTargets(i,funnelPath[i-1]));
  // Monotone Hermite tangents join checkpoints without overshoot or internal stops.
  funnelTangents=funnelPath.map((frame,i)=>frame.map((v,j)=>Object.fromEntries(particleKeys.map(k=>{
    if(i===0||i===5)return[k,0];const before=v[k]-funnelPath[i-1][j][k],after=funnelPath[i+1][j][k]-v[k];
    return[k,before*after>0?2*before*after/(before+after):0];
  }))));
}
function sampleFunnel(position){
  const index=Math.min(4,Math.floor(position)),p=position-index,p2=p*p,p3=p2*p;
  const h=[2*p3-3*p2+1,p3-2*p2+p,-2*p3+3*p2,p3-p2];
  return funnelPath[index].map((from,j)=>Object.fromEntries(particleKeys.map(k=>[k,h[0]*from[k]+h[1]*funnelTangents[index][j][k]+h[2]*funnelPath[index+1][j][k]+h[3]*funnelTangents[index+1][j][k]])));
}
function drawParticle(node,state){
  node.setAttribute('transform',`translate(${state.x} ${state.y})`);node.setAttribute('opacity',state.opacity);
  const geometry=[state.w,state.h,state.depth,state.shape].join(',');if(node.dataset.geometry===geometry)return;node.dataset.geometry=geometry;
  const points=Array.from({length:8},(_,k)=>{const angle=-Math.PI/2+k*Math.PI/4;const circle=[Math.cos(angle),Math.sin(angle)],diamond=[[0,-1],[.5,-.5],[1,0],[.5,.5],[0,1],[-.5,.5],[-1,0],[-.5,-.5]][k];return[(circle[0]*(1-state.shape)+diamond[0]*state.shape)*state.w,(circle[1]*(1-state.shape)+diamond[1]*state.shape)*state.h].join(',')}).join(' ');
  node.children[0].setAttribute('d',`M${-state.w} 0L0 ${state.h}L${state.w} 0V${state.depth}L0 ${state.h+state.depth}L${-state.w} ${state.depth}Z`);
  node.children[0].setAttribute('opacity',state.shape);node.children[1].setAttribute('points',points);
}
function renderFunnel(){funnelStates=sampleFunnel(funnelPosition);funnelPlate=1;funnelStates.forEach((v,j)=>drawParticle(funnelNodes[j],v));$('portfolio-finish').setAttribute('opacity',funnelPlate)}
function initFunnel(){
  const svg=$('funnel');svg.innerHTML='<title>Research selection stages</title>';
  widths.slice(0,5).forEach((w,i)=>{const y=8+i*88;if(i<4){const next=widths[i+1];svg.append(svgNode('path',{d:`M${310-w/2} ${y+56}C${310-w/2} ${y+75} ${310-next/2} ${y+68} ${310-next/2} ${y+85}M${310+w/2} ${y+56}C${310+w/2} ${y+75} ${310+next/2} ${y+68} ${310+next/2} ${y+85}`,fill:'none',stroke:'#cecbc0','stroke-width':1}))}
    svg.append(svgNode('path',{d:`M${310-w/2} ${y-4}v59h${w}v-59`,fill:'none',stroke:'#aaa79c','stroke-width':1,'data-funnel-layer':i}));
    const layer=svgNode('g',{'data-stage':i,fill:'#c6c2b6'});dotPositions(i).forEach(pos=>layer.append(svgNode('circle',{cx:pos.x,cy:pos.y,r:2.1})));svg.append(layer);
  });
  const plate=svgNode('g',{id:'portfolio-finish',opacity:0});plate.innerHTML='<path d="M242 474L310 438L378 474L310 510Z" fill="#f8e6cf"/><path d="M242 474L310 510L378 474V480L310 516L242 480Z" fill="#e4b886"/><path d="M242 474L310 438L378 474L310 510Z" fill="none" stroke="#d99251" stroke-width="1"/>';svg.append(plate);
  funnelNodes=Array.from({length:markCounts[0]},(_,j)=>{const g=svgNode('g',{class:'research-particle','data-particle':j});g.append(svgNode('path',{fill:'#b95823'}),svgNode('polygon',{fill:'#ed7835'}));svg.append(g);return g});
  plate.style.translate=`0 ${portfolioDrop}px`;buildFunnelPath();renderFunnel();
  buttons('research-steps',stages.map(v=>v.name),0,i=>{stopResearch();research(i)});[...$('research-steps').children].forEach((b,i)=>b.innerHTML=`<span>${stages[i].name}<small>${stages[i].detail}</small></span><strong>${stages[i].count}</strong>`);
}
function cancelFunnelTransition(){cancelAnimationFrame(funnelFrame);if(funnelTransition){const resolve=funnelTransition.resolve;funnelTransition=null;resolve(false)}}
function tickFunnel(now){
  const t=funnelTransition;if(!t)return;t.elapsed=now-t.start;let complete=false;
  if(t.kind==='play'){
    funnelPosition=Math.min(5,t.elapsed/t.duration*5);funnelVelocity=5/t.duration*1000;complete=funnelPosition===5;
    const next=Math.min(5,Math.floor(funnelPosition+.5));if(next!==stage)selectResearchStage(next);
  }else{
    const next=springStep(funnelPosition,funnelVelocity,t.target,Math.min((now-t.last)/1000,.04),22);funnelPosition=Math.max(0,Math.min(5,next.value));funnelVelocity=next.velocity;
    complete=Math.abs(funnelPosition-t.target)<.0005&&Math.abs(funnelVelocity)<.005;
    if(complete)funnelPosition=t.target;
  }
  t.last=now;renderFunnel();
  if(!complete)funnelFrame=requestAnimationFrame(tickFunnel);else{funnelVelocity=0;funnelTransition=null;$('research-steps').lastElementChild.classList.toggle('is-complete',stage===5);t.resolve(true)}
}
function selectResearchStage(i){
  stage=i;
  $('funnel').querySelectorAll('[data-stage]').forEach((g,j)=>g.setAttribute('opacity',j<i?'.7':j===i?'0':'.25'));
  [...$('research-steps').children].forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));$('research-steps').lastElementChild.classList.remove('is-complete');
  const item=stages[i],r=D.research.tables[0].rows[item.row];$('research-result').innerHTML=`<strong>${item.count} · ${item.name}</strong><p>${esc(i===0?'The research universe before the investable-company screen.':i===1?r[1]+'. '+r[2]:r[2])}</p>`;
}
function research(i,animate=true){
  cancelFunnelTransition();selectResearchStage(i);
  if(!animate||!motionAllowed()){funnelPosition=i;funnelVelocity=0;renderFunnel();$('research-steps').lastElementChild.classList.toggle('is-complete',i===5);return Promise.resolve(true)}
  return new Promise(resolve=>{const now=performance.now();funnelTransition={kind:'seek',target:i,elapsed:0,start:now,last:now,resolve};funnelFrame=requestAnimationFrame(tickFunnel)});
}
function stopResearch(){researchRun++;researchPlaying=false;cancelFunnelTransition();$('pause-research').textContent='Pause';$('pause-research').disabled=true}
async function playResearch(){
  stopResearch();researchStarted=true;const run=researchRun;if(!motionAllowed()){research(5,false);return}
  researchPlaying=true;$('pause-research').disabled=false;
  if(!await research(0)||run!==researchRun)return;
  await new Promise(resolve=>{const now=performance.now();funnelTransition={kind:'play',duration:5200,elapsed:0,start:now,last:now,resolve};funnelFrame=requestAnimationFrame(tickFunnel)});
  if(run===researchRun){researchPlaying=false;$('pause-research').disabled=true}
}
$('play-research').onclick=playResearch;
$('pause-research').onclick=()=>{if(!funnelTransition)return;if(researchPlaying){cancelAnimationFrame(funnelFrame);researchPlaying=false;$('pause-research').textContent='Continue'}else{researchPlaying=true;const now=performance.now();funnelTransition.start=now-funnelTransition.elapsed;funnelTransition.last=now;funnelFrame=requestAnimationFrame(tickFunnel);$('pause-research').textContent='Pause'}};
$('research-steps').onkeydown=e=>{if(['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();stopResearch();const n=[...$('research-steps').children].indexOf(e.target.closest('button'));research(Math.max(0,Math.min(5,n+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1))));$('research-steps').children[stage].focus()}};
narrowScreen.addEventListener('change',()=>{stopResearch();buildFunnelPath();research(stage,false)});
let pyramidAnimations=[],pyramidStarted=false,pyramidVisible=false,pyramidFrame=0,pyramidLast=0;
const pyramidMotion=Array.from({length:5},()=>({value:0,velocity:0,target:0}));
/* Isometric solid shared with the insight cards. The plan is rotated before it
   is squashed, so circles stay axis-aligned and a square footprint reads as a
   rhombus. SQUASH is the minor/major ratio measured off the reference capture:
   a dial 232px across and 83px tall. */
const PY_SQUASH=.35,PY_PLAN=Math.PI/4,PY_SPIN_RATE=.34;
function pyProject(x,y,z,phi){const c=Math.cos(phi),s=Math.sin(phi);return[320+x*c-y*s,440+(x*s+y*c)*PY_SQUASH-z]}
function pyCorners(r){return[[r,r],[-r,r],[-r,-r],[r,-r]]}
/* Outward plan normals of the four side faces, in corner order. */
const PY_NORMALS=[Math.PI/2,Math.PI,-Math.PI/2,0];
function pyHull(points){
  const p=points.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const half=list=>{const out=[];for(const q of list){while(out.length>1&&cross(out[out.length-2],out[out.length-1],q)<=0)out.pop();out.push(q)}return out};
  const lower=half(p),upper=half(p.slice().reverse());
  return lower.slice(0,-1).concat(upper.slice(0,-1));
}
const PY_TIERS=[0,1,2,3,4].map(i=>{const separation=(4-i)*16;return{i,topR:i*33,baseR:(i+1)*33,topZ:(5-i)*60+separation,baseZ:(4-i)*60+separation}});
let pyramidNodes=[],pyramidSpin=0,pyramidEnergy=0,pyramidHover=false;

function initPyramid(){
  const svg=$('pyramid');
  svg.innerHTML='<defs><linearGradient id="tier-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff8eb"/><stop offset="1" stop-color="#ded0b7"/></linearGradient></defs><title>Isometric pyramid of historical PMS stock multiples</title>';
  pyramidNodes=[];
  /* Bottom tier first so the smaller tiers above paint over it. Within a tier
     the side faces are re-sorted every frame, because which of them is in front
     changes as the solid turns. */
  for(let i=4;i>=0;i--){
    const shadow=svgNode('polygon',{points:'',fill:'#594530',opacity:'.08',class:'tier-shadow','data-shadow':i});svg.append(shadow);
    const g=svgNode('g',{'data-tier':i,class:'pyramid-tier'});
    const sides=[0,1,2,3].map(()=>svgNode('polygon',{points:'',class:'iso-left'}));
    const top=svgNode('polygon',{points:'',class:'iso-top'});
    const edge=svgNode('polyline',{points:'',class:'iso-edge',fill:'none'});
    g.append(...sides,top,edge);
    const guide=svgNode('path',{d:'',class:'pyramid-guide',fill:'none'});g.append(guide);
    svg.append(g);
    const hit=svgNode('polygon',{points:'',fill:'transparent',class:'pyramid-hit','data-hit':i});
    hit.onpointerenter=()=>{if(finePointer.matches)emphasizeTier(i)};
    hit.onclick=()=>picks(i);
    pyramidNodes[i]={g,sides,top,edge,guide,shadow,hit};
  }
  for(let i=4;i>=0;i--)svg.append(pyramidNodes[i].hit);
  svg.onpointerenter=()=>{pyramidHover=true;startPyramid()};
  svg.onpointerleave=()=>{pyramidHover=false;emphasizeTier(tier)};
  buttons('tier-rows',D.pyramid.tables[0].rows.map(r=>r[0]),0,picks);
  [...$('tier-rows').children].forEach((b,i)=>{
    const r=D.pyramid.tables[0].rows[i];b.innerHTML=`<strong>${esc(r[0].replace('X','×').replace(' or more',''))}</strong><span>${esc(r[1]).replace(', ','<br>')}</span>`;
    b.onpointerenter=()=>{if(finePointer.matches){emphasizeTier(i);pyramidHover=true;startPyramid()}};
    b.onfocus=()=>emphasizeTier(i);
  });
  $('tier-rows').onpointerleave=()=>{pyramidHover=false;emphasizeTier(tier)};
  $('tier-rows').onfocusout=e=>{if(!$('tier-rows').contains(e.relatedTarget))emphasizeTier(tier)};
  $('replay-pyramid').onclick=playPyramid;
  drawPyramid();
}

function drawPyramid(){
  const phi=PY_PLAN+pyramidSpin;
  PY_TIERS.forEach(t=>{
    const node=pyramidNodes[t.i];if(!node)return;
    const lift=pyramidMotion[t.i].value;
    const top=pyCorners(t.topR).map(([x,y])=>pyProject(x,y,t.topZ-lift,phi));
    const base=pyCorners(t.baseR).map(([x,y])=>pyProject(x,y,t.baseZ-lift,phi));
    /* Back-face culling: a side shows only while its outward normal turns
       toward the viewer, which in this projection is sin(normal + phi) > 0. */
    const faces=[0,1,2,3].map(k=>{
      const n=PY_NORMALS[k],pts=[top[k],top[(k+1)%4],base[(k+1)%4],base[k]];
      return{pts,visible:Math.sin(n+phi)>0,lit:Math.cos(n+phi)<0,depth:(pts[2][1]+pts[3][1])/2};
    }).filter(f=>f.visible).sort((a,b)=>a.depth-b.depth);
    node.sides.forEach((el,k)=>{
      const f=faces[k];
      if(!f){el.setAttribute('points','');return}
      el.setAttribute('points',f.pts.map(p=>p.join(',')).join(' '));
      el.setAttribute('class',f.lit?'iso-left':'iso-right');
    });
    node.top.setAttribute('points',top.map(p=>p.join(',')).join(' '));
    node.edge.setAttribute('points',top.map(p=>p.join(',')).join(' '));
    const outline=pyHull(top.concat(base));
    node.hit.setAttribute('points',outline.map(p=>p.join(',')).join(' '));
    node.shadow.setAttribute('points',pyHull(base).map(([x,y])=>`${x},${y+13}`).join(' '));
    /* The connector leaves from whichever point of the tier currently sits
       furthest right, so it keeps meeting the table as the solid turns. */
    const anchor=outline.reduce((a,b)=>b[0]>a[0]?b:a);
    node.guide.setAttribute('d',`M${anchor[0]+8} ${anchor[1]}C${anchor[0]+65} ${anchor[1]} 640 ${(t.i+.5)*130} 705 ${(t.i+.5)*130}`);
  });
}

function tickPyramid(now){
  const dt=Math.min((now-pyramidLast)/1000,.04);pyramidLast=now;
  /* Spin runs while the pointer is on the solid and winds down after, the same
     energy ramp the insight cards use, so it freezes where it stopped rather
     than snapping back. */
  const target=pyramidHover?1:0,tau=pyramidHover?.12:.42;
  pyramidEnergy+=(target-pyramidEnergy)*(1-Math.exp(-dt/tau));
  pyramidSpin+=dt*pyramidEnergy*PY_SPIN_RATE;
  let moving=pyramidEnergy>.002;
  pyramidMotion.forEach((state,i)=>{
    Object.assign(state,springStep(state.value,state.velocity,state.target,dt,36));
    if(Math.abs(state.value-state.target)<.03&&Math.abs(state.velocity)<.5){state.value=state.target;state.velocity=0}else moving=true;
  });
  drawPyramid();
  pyramidFrame=moving?requestAnimationFrame(tickPyramid):0;
}

function startPyramid(){if(!motionAllowed()){drawPyramid();return}if(!pyramidFrame){pyramidLast=performance.now();pyramidFrame=requestAnimationFrame(tickPyramid)}}

function emphasizeTier(i){
  $('pyramid').querySelectorAll('[data-shadow]').forEach(el=>el.setAttribute('opacity',Number(el.dataset.shadow)===i?'.17':'.06'));
  [...$('tier-rows').children].forEach((b,j)=>b.dataset.active=String(j===i));
  $('pyramid').querySelectorAll('[data-tier]').forEach(g=>g.classList.toggle('is-active',Number(g.dataset.tier)===i));
  pyramidMotion.forEach((state,j)=>state.target=j===i?12:0);
  if(!motionAllowed()){
    cancelAnimationFrame(pyramidFrame);pyramidFrame=0;cancelPyramidBuild();
    pyramidMotion.forEach(state=>{state.value=state.target;state.velocity=0});
    drawPyramid();
  }else startPyramid();
}
function cancelPyramidBuild(){pyramidAnimations.forEach(a=>a.cancel());pyramidAnimations=[]}
function playPyramid(){
  pyramidStarted=true;if(!motionAllowed()){cancelPyramidBuild();emphasizeTier(tier);return}
  if(pyramidAnimations.some(a=>a.playState==='running'))return;
  cancelPyramidBuild();
  /* The replay button still does the staged build; it now also spins the solid
     through most of a turn so the entrance and the idle motion read as one. */
  pyramidSpin=0;pyramidEnergy=0;pyramidHover=true;startPyramid();
  setTimeout(()=>{if(!finePointer.matches||!$('pyramid').matches(':hover'))pyramidHover=false},2600);
  [4,3,2,1,0].forEach(i=>{
    const g=pyramidNodes[i]?.g;if(!g)return;
    pyramidAnimations.push(g.animate([{transform:'translateY(22px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:650,delay:(4-i)*60,easing:easeOut,fill:'backwards'}));
  });
}
function picks(i){
  tier=i;[...$('tier-rows').children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));emphasizeTier(i);
  $('tier-result').textContent=`${D.pyramid.tables[0].rows[i][0]} · ${D.pyramid.tables[0].rows[i][1]}`;
  $('company-links').replaceChildren();(i===1?[0,2]:i===2?[1]:[]).forEach(n=>{const a=document.createElement('a');a.href='#growth';a.textContent=['KPI Green financials','Uni Abex financials','Pitti financials'][n];a.onclick=()=>{company=n;$('company').selectedIndex=n;growth()};$('company-links').append(a)});
}
let lastGrowthKey='',growthPreview=null,growthCeiling=1,growthStarted=false,growthAnimations=[];
function initGrowth(){
  buttons('metrics',['Revenue','EBIDTA','PAT'],0,i=>{metric=i+1;growth()});
  buttons('bars',['FY20','FY21','FY22','FY23','FY24'],4,i=>{year=i;growthPreview=null;growth()});
  [...$('bars').children].forEach((b,i)=>{b.className='bar-button';b.innerHTML='<span class="bar-label-position"><span class="bar-value"></span></span><span class="bar"></span>';b.onpointerenter=()=>{if(finePointer.matches)previewGrowth(i)};b.onfocus=()=>previewGrowth(i)});
  $('bars').onpointerleave=()=>previewGrowth(null);
  $('bars').onfocusout=e=>{if(!$('bars').contains(e.relatedTarget))previewGrowth(null)};
}
function previewGrowth(index){
  growthPreview=index;const active=index??year,t=D.companies[company].tables[0],values=t.rows.map(r=>r[metric]);
  [...$('bars').children].forEach((b,j)=>b.dataset.active=String(j===active));
  document.querySelectorAll('#growth .years span').forEach((el,j)=>el.dataset.active=String(j===active));
  $('growth-value').textContent=`${t.rows[active][0]} ${t.headers[metric]} · ₹${values[active].toLocaleString('en-IN')} crore`;
  const change=active>0?(values[active]/values[active-1]-1)*100:null;
  $('growth-change').textContent=change===null?'First year in the series':`${change>=0?'+':''}${change.toFixed(1)}% vs ${t.rows[active-1][0]}`;
  $('growth-guide').classList.toggle('is-visible',index!==null);$('growth-guide').style.transform=`translateY(${-values[active]/growthCeiling*100}%)`;
}
function cancelGrowthEntrance(){growthAnimations.forEach(a=>a.cancel());growthAnimations=[]}
function animateGrowthBars(fromBaseline=false){
  const starts=[...$('bars').children].map(b=>({clip:fromBaseline?'inset(100% 0 0)':getComputedStyle(b.querySelector('.bar')).clipPath,transform:fromBaseline?'translateY(0%)':getComputedStyle(b.querySelector('.bar-label-position')).transform}));
  cancelGrowthEntrance();
  return ()=>{if(!motionAllowed())return;[...$('bars').children].forEach((b,i)=>{const bar=b.querySelector('.bar'),label=b.querySelector('.bar-label-position'),timing={duration:fromBaseline?720:240,delay:fromBaseline?i*55:0,easing:easeOut,fill:'backwards'};growthAnimations.push(bar.animate([{clipPath:starts[i].clip},{clipPath:bar.style.clipPath}],timing),label.animate([{transform:starts[i].transform},{transform:label.style.transform}],timing))})};
}
function revealGrowth(){if(!motionAllowed())cancelGrowthEntrance();else if(growthAnimations.some(a=>a.playState==='running'))return;growthStarted=true;const animate=animateGrowthBars(true);document.querySelector('.growth-chart').classList.add('is-revealed');animate()}
function growth(){
  if(!motionAllowed())cancelGrowthEntrance();
  const s=D.companies[company],t=s.tables[0],values=t.rows.map(r=>r[metric]);
  // Round the axis upward so every company keeps a readable, visible zero baseline.
  const max=Math.max(...values),step=10**Math.floor(Math.log10(max))/5,ceiling=(Math.floor(max/step)+1)*step;
  const key=`${company}-${metric}`,changed=key!==lastGrowthKey;const animate=changed&&lastGrowthKey&&growthStarted?animateGrowthBars():null;lastGrowthKey=key;growthCeiling=ceiling;if(changed)growthPreview=null;
  $('company-title').textContent=$('company').options[company].text;
  $('company-business').textContent=s.facts.find(f=>f.startsWith('Business model:')).replace('Business model: ','');
  [...$('metrics').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===metric-1)));
  $('growth-start').textContent=`₹${values[0].toLocaleString('en-IN')}`;$('growth-end').textContent=`₹${values[4].toLocaleString('en-IN')}`;
  $('growth-start-label').textContent='FY20 · ₹ crore';$('growth-end-label').textContent='FY24 · ₹ crore';
  $('growth-multiple').textContent=`${(values[4]/values[0]).toFixed(1)}×`;$('growth-multiple-label').textContent=`FY24 / FY20 ${t.headers[metric]}`;
  $('growth-value').textContent=`${t.rows[year][0]} ${t.headers[metric]} · ₹${values[year].toLocaleString('en-IN')} crore`;
  [...$('bars').children].forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===year));b.setAttribute('aria-label',`${t.rows[j][0]} ${t.headers[metric]} ${values[j]} crore`);b.querySelector('.bar').style.clipPath=`inset(${(1-values[j]/ceiling)*100}% 0 0)`;b.querySelector('.bar-label-position').style.transform=`translateY(${-values[j]/ceiling*100}%)`;b.querySelector('.bar-value').textContent=values[j].toLocaleString('en-IN')});
  if(changed){$('chart-grid').innerHTML=[ceiling,ceiling/2,0].map(n=>`<div><span>${n.toLocaleString('en-IN')}</span></div>`).join('');source('company-source',s,`group-profile-apr2026-p${21+company}`)}
  previewGrowth(growthPreview);if(animate)animate();
}
$('replay-growth').onclick=revealGrowth;
$('company').onchange=e=>{company=e.target.selectedIndex;growth()};
let riskAnimations=[],processStage=0,listedShare=51;
function diagramText(x,y,text,size=18,anchor='start'){return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="currentColor">${esc(text)}</text>`}
function diagramBox(x,y,w,label){return `<g class="risk-mark"><rect x="${x}" y="${y}" width="${w}" height="54" rx="3" fill="#f0e9dc" stroke="#cfc4b2"/>${diagramText(x+w/2,y+33,label,16,'middle')}</g>`}
function riskGraphic(category,m){
  const path=d=>`<path class="risk-route" d="${d}" fill="none" stroke="#c26a35" stroke-width="2"/>`;
  if(category==='Liquidity')return m?`${diagramBox(22,137,140,'Unlisted shares')}${path('M162 164H217V63H288M217 164H288M217 164V265H288')}${diagramBox(288,36,235,'IPO')}${diagramBox(288,137,235,'Buyback')}${diagramBox(288,238,235,'Strategic sale')}${diagramText(24,333,'Plan the exit before investing.',18)}`:`${diagramBox(40,45,175,'Listed shares')}${path('M215 72H355')}${diagramBox(355,45,220,'Entry / exit')}${diagramText(295,132,'Sufficient trading volume',18,'middle')}<g class="risk-mark"><path d="M202 195L300 150L398 195L300 240Z" fill="#f5c994"/><path d="M202 195V234L300 279L398 234V195L300 240Z" fill="#d3b18a"/>${diagramText(300,315,'Reasonable cash allocation',18,'middle')}</g>`;
  if(category==='Valuation')return `<path d="M65 270H550" stroke="#c4beae"/><g class="risk-mark"><rect x="105" y="185" width="125" height="85" fill="#ed7835"/><rect x="382" y="78" width="125" height="192" fill="#ded2bd"/></g>${diagramText(167,304,'Purchase price',16,'middle')}${diagramText(444,304,'Estimated value',16,'middle')}${path('M245 185H305V78H367')}${diagramText(290,52,'Margin of safety',22,'middle')}${diagramText(310,347,'Concept only. No valuation figures supplied.',14,'middle')}`;
  if(category==='Concentration'){
    if(m){let groups='';for(let j=0;j<4;j++){const x=50+(j%2)*290,y=45+Math.floor(j/2)*120;groups+=`<g class="risk-mark"><rect x="${x}" y="${y}" width="220" height="85" rx="3" fill="none" stroke="#c7beae"/><rect x="${x+20}" y="${y+23}" width="45" height="36" fill="#ed7835"/><rect x="${x+84}" y="${y+23}" width="45" height="36" fill="#ded2bd"/><rect x="${x+148}" y="${y+23}" width="45" height="36" fill="#ded2bd"/></g>`}return `${groups}${diagramText(310,302,'Diversify across sectors and stocks',22,'middle')}${diagramText(310,336,'Single-stock limit stated; percentage not supplied.',14,'middle')}`}
    return `${diagramText(53,75,'Maximum for one sector',20)}<g class="risk-mark"><rect x="55" y="136" width="510" height="76" fill="#e9e4d9"/><rect x="55" y="136" width="153" height="76" fill="#ed7835"/></g>${path('M208 112V240')}${diagramText(55,270,'0%',16)}${diagramText(208,105,'30%',32,'middle')}${diagramText(565,270,'100%',16,'end')}${diagramText(310,325,'Sector limit, not a current holding.',16,'middle')}`;
  }
  return `${diagramBox(28,65,185,'Economic event')}${diagramBox(375,65,210,'Industry event')}${path('M120 119V177H478V119M300 177V222')}${diagramBox(182,222,236,'Patience')}${diagramText(310,323,m?'Monitor developments and review the thesis.':'3+ years, while the investment thesis holds.',18,'middle')}`;
}
function processSelect(i){
  processStage=i;const p=D.process[mode],names=mode?p.tables[0].rows.map(r=>r[0]):['Allocation','Horizon','Diversification','Risk mitigation','Rebalancing'];buttons('process-controls',names,i,processSelect);
  if(mode)[...$('process-controls').children].forEach((b,j)=>b.innerHTML=`<span class="process-number">${j+1}</span><span>${esc(names[j].replace(/^\d+ /,''))}</span>`);
  $('process-result').textContent=mode?p.tables[0].rows[i][1]:p.facts[i];$('process-title').textContent=mode?'Screen to exit':'Portfolio construction';$('process-controls').classList.toggle('ordered-process',Boolean(mode));
}
function risks(m,r=0){
  riskAnimations.forEach(a=>a.cancel());riskAnimations=[];mode=m;risk=r;const labels=m?['Valuation','Market','Liquidity','Concentration']:['Liquidity','Valuation','Market','Concentration'];buttons('risk-modes',['PMS','AIF'],m,i=>risks(i));buttons('risk-categories',labels,r,i=>risks(mode,i));
  const f=D.risks[m].facts,category=labels[r],text=m?(r===2?f[2]+' '+f[3]:f[r===3?4:r]):f[r];
  $('risk-diagram').innerHTML=`<title>${esc(category)} control</title>${riskGraphic(category,m)}`;
  $('risk-result').innerHTML=`<p class="eyebrow">${category}</p><h3>${{Liquidity:'Plan for entry and exit.',Valuation:'Leave room for error.',Market:'Allow the thesis time.',Concentration:'Limit dependence on one holding.'}[category]}</h3><p>${esc(text.replace(/^\d+\. /,''))}</p>`;
  if(motionAllowed())riskAnimations.push($('risk-diagram').animate([{opacity:.65,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:easeOut}));
  processSelect(0);const p=D.process[m];source('risk-source',D.risks[m],m?'flyingbee-aug2026-p7':'group-profile-apr2026-p16',`<h3>${esc(p.title)}</h3>${p.facts.map(f=>`<p>${esc(f)}</p>`).join('')}${p.tables.map(table).join('')}<a href="Moneybee-presentation-factsheets.html#${m?'flyingbee-aug2026-p5':'group-profile-apr2026-p17'}">Process source · page ${p.page}</a>`);
}
function initAllocation(){
  const svg=$('allocation-field');svg.innerHTML='<title>Illustrative split of ₹1 crore</title>';
  for(let j=0;j<100;j++){const row=Math.floor(j/10),col=j%10,x=325+(col-row)*29,y=42+(col+row)*15;const g=svgNode('g',{'data-unit':j,class:'allocation-unit'});g.append(svgNode('path',{d:`M${x-25} ${y}L${x} ${y+13}L${x+25} ${y}V${y+10}L${x} ${y+23}L${x-25} ${y+10}Z`,class:'unit-side'}),svgNode('path',{d:`M${x} ${y-13}L${x+25} ${y}L${x} ${y+13}L${x-25} ${y}Z`,class:'unit-top'}));svg.append(g)}
  $('listed-share').oninput=e=>allocate(Number(e.target.value));
  buttons('allocation-presets',['51% listed','75% listed','100% listed'],0,i=>allocate([51,75,100][i]));allocate(51);
}
function allocate(value){
  value=Math.max(51,Math.min(100,Math.round(value)));listedShare=value;const unlisted=100-value;$('listed-share').value=value;$('listed-output').textContent=value+'%';$('listed-amount').textContent=value===100?'₹1 crore':`₹${value} lakh`;$('unlisted-amount').textContent=`₹${unlisted} lakh`;$('listed-percent').textContent=value+'% listed';$('unlisted-percent').textContent=unlisted+'% unlisted';
  $('allocation-field').querySelectorAll('[data-unit]').forEach((el,j)=>el.classList.toggle('is-listed',j<value));
  [...$('allocation-presets').children].forEach((b,i)=>b.setAttribute('aria-pressed',String([51,75,100][i]===value)));
  $('allocation-result').textContent=value===51?'This example uses the full 49% unlisted allowance.':value===100?'The rule allows a fully listed portfolio. Unlisted investment is optional.':`This example leaves ${49-unlisted} percentage points of unused unlisted capacity.`;
}
wealth(1);initFunnel();research(0,false);initPyramid();picks(0);initGrowth();growth();risks(0);initAllocation();source('research-source',D.research,'group-profile-apr2026-p13');source('picks-source',D.pyramid,'group-profile-apr2026-p20');source('allocation-source',D.allocation,'flyingbee-aug2026-p9',`<p>Liquidity context: <a href="Moneybee-presentation-factsheets.html#flyingbee-aug2026-p7">Flyingbee page 7</a>.</p>`);

const researchObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&!researchStarted){researchStarted=true;playResearch()}else if(!entry.isIntersecting&&researchPlaying){stopResearch()}}},{threshold:.35});
researchObserver.observe($('research'));
const chartObserver=new IntersectionObserver(entries=>{for(const entry of entries){
  if(entry.target.id==='picks'){pyramidVisible=entry.isIntersecting;if(entry.isIntersecting&&!pyramidStarted)playPyramid();else if(!entry.isIntersecting)cancelPyramidBuild()}
  if(entry.target.classList.contains('growth-chart')&&entry.isIntersecting&&!growthStarted)revealGrowth();
}},{threshold:.35});
chartObserver.observe($('picks'));chartObserver.observe(document.querySelector('.growth-chart'));
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){stopResearch();research(stage,false);emphasizeTier(tier);cancelGrowthEntrance();riskAnimations.forEach(a=>a.cancel())}});
</script></body></html>'''
page = page.replace('__DATA__', json.dumps(data, ensure_ascii=False).replace('</', '<\\/'))
(ROOT / 'Moneybee-interactive-visualizations.html').write_text(page)
print('Built Moneybee-interactive-visualizations.html')
