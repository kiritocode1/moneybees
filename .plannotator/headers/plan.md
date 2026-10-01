# One header motif for every internal page

**Your note:** "make a header that makes sense, but same motif."
**What this does:** every internal page opens on the approved /pms and /aif header: a huge orange mark from the hexagon family, split on its centre line with the halves offset, a stepped title multiplied over it, one sentence and a strip of facts. Each page's mark is arranged to say what the page is about, and its strip holds real facts that no section on that page repeats.
**Proof:** the preview at `https://moneybees.localhost:1355/preview/headers` (all ten stacked; /pms and /aif are unchanged).

![all eight new headers](headers-sheet.png)

| Page | Mark (same cells, same split) | Why it makes sense | Facts in the strip |
| --- | --- | --- | --- |
| PMS vs AIF | The PMS cell and the AIF cluster, equal area, standing apart | A vs: two separate products, never merged | PMS since, Flyingbee first close, PMS horizon, AIF time frame, PMS portfolio, AIF minimum (three a side) |
| Our Approach | Three cells growing by a constant step | Undiscovered, then under-researched, then under-estimated | The three philosophy words, so no separate philosophy section is needed |
| Performance | Five cells climbing | Growth over time | As of, PMS since, both benchmarks, Flyingbee first close, the return method |
| Case Studies | Three touching cells bending into a path | The investment journey | The three companies with their businesses, and the FY20 to FY24 span |
| Team | Three touching cells | Three people | Group since 2004, the founder's 45+ years, PMS since 2007, the office |
| Careers | A ring of six cells around an empty one | A place for you | Office, group since, where to send resumes; with both plan CTAs |
| Contact | A large cell meeting a small one | A conversation | Phone, email and the three query addresses; the address is the sentence |
| Investor Centre | A column of three cells | Filed documents | Logins, onboarding and grievance addresses, SCORES, ODR |

Long titles now scale down so they never run off the edge ("Understanding the Difference" drops to 6.1vw). The approved PMS title moves from 8.75vw to 8.69vw, which isn't visible. On a phone it drops from 11.2vw to 10.2vw, which fixes a slight overflow it had there. At 390px there's no sideways scroll, and no title runs past the edge.

## Files

| File | Change |
| --- | --- |
| `components/pms-v3/marks.tsx` | Adds the eight page marks, built from cells and cut on the same line. PMS and AIF are untouched |
| `components/pms-v3/product-hero.tsx` | Takes one or two title lines, any buttons and three to six figures; sizes long titles to fit |
| `lib/pms-v3-hero.ts` | `MarkKind` and the generalized data type; PMS and AIF data unchanged apart from `actions` |
| `lib/page-heroes.ts` (new) | The eight pages' hero data, every fact read from `lib/*` |

After approval, each page opens with its hero. Where the hero now carries a fact, the duplicate section below goes: Our Approach drops its philosophy section, and Contact's first screen drops its address block. The page bodies are next, one page at a time, and I'll review every one myself before it reaches you.
