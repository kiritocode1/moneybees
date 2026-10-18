# Connecting what is built but not connected

**Problem.** Seven parts of the admin are built halfway or feed nothing: Entities, tasks, the deals board, fact sheet sectors, client statements, distributor logins and the careers apply flow. Four AI switches are also waiting for the features behind them.

**Done already (2026-10-14, not committed):**
- the 18 preview pages and 87 files nothing imported are deleted;
- Metrics is hidden.

The site and admin were checked page by page afterwards.

**Result.** Each remaining part is connected, built later for a stated reason, or removed. In order:

## 1. Connect now (small, no new design language)

| Part | Today | Fix |
|---|---|---|
| **Entities** (family, HUF, company, trust) | Can only be added inside a person's form; nothing reads them | When an AIF enquiry says Investor type HUF, Family office or Company or trust, the desk creates or links the entity. The enquiry, the person and the deal show it. A deal's investor can be the entity. |
| **Tasks** | Today reads tasks, nothing creates them, no screen to add one | **Add a task** on an enquiry and on a person: what, due date, who. Today lists yours by due date; **Done** ticks it off. A **Tasks** link in Desk lists everyone's. |
| **Deals** | A plain list | A board: one column per stage (Enquiry to Invested, and Lost). Drag a card to move it; each card shows how long it has sat there and its amount. Lost asks for the reason. |

Each gets a preview before I build it, as usual.

## 2. Needs a design first

| Part | Today | Fix |
|---|---|---|
| **Top sectors** | Saved on every PMS fact sheet, shown nowhere | A sector chart on /pms, from the latest approved sheet, in the language of the returns chart you liked. It sits beside Portfolio rules, whose 30% sector cap it can mark. Preview first. |

## 3. Waits, for a reason

| Part | Why it waits | What I would do |
|---|---|---|
| **Client statements** | They are real client data. SEBI's CSCRF keeps that in India, so it waits for the Mumbai setup, as decided on 2026-10-08. | Build the upload (filenames starting with the client code go to that investor automatically) and the portal list with private downloads. Use it only once the data lives in India. |
| **Distributor logins** | Nothing says what a distributor should see. | Needs your answer: their clients and those clients' holdings, their commission statements, marketing material, or a mix. Until then the card stays as an email request. |
| **Careers apply** | The planned flow (real steps, resume read into the form) needs AI credits for the resume reading. | Build the steps and the applicant list in /admin now. Turn on resume reading when the gateway has credits. |

## 4. The four AI features (switches kept, as you asked)

The switches and the compliance threshold stay (I put them back). Each gets the feature it names. All four run through the AI Gateway, so they work once it has credits, and each stays off until switched on.

| Switch | What it will do | Where |
|---|---|---|
| **Reply drafts** (Opus) | **Draft a reply** on an enquiry: a first draft from the enquiry, the playbook and the person's history, for staff to edit and send. Also a short brief on a person before a call. | Enquiry and person screens |
| **Compliance gate** (Jev) | Reads every outgoing email before it sends. One that promises returns, skips a disclaimer or sends AIF material to someone who is not an AIF investor is held, with the reason, until compliance clears it. The threshold in Enquiry settings decides how sure it must be. | Every send, and later broadcasts |
| **Resume reading** (Haiku) | Reads an uploaded resume into the apply form's fields, so the applicant only checks them. | Careers apply flow |
| **Applicant screen** (Jev) | Checks each applicant against the opening's must-haves and scores the fit, for HR to sort by. | Openings › applicants |

The order: reply drafts and the compliance gate with the enquiry work in section 1; resume reading and applicant screening with careers.

## 5. What I need from you

1. **Distributor logins:** what should a distributor see once signed in?
2. **AI Gateway credits:** the one blocker for triage, the business drawings and all four features above.
3. **Order:** I would go Entities, Tasks, Deals board, then sectors, then careers. Say if careers should jump the queue; it was top priority before the site work.
