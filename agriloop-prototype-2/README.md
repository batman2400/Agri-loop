# AgriLoop — Prototype 2

An interactive, self-contained dashboard for every AgriLoop scenario in the
project documentation: retail and wholesale, sale and free donation,
self-collection, supplier handover, expiries, permissions, incidents and the
operations ledger.

**Idea stage. No backend. Synthetic data only. Not a live service.**

Everything runs locally from `index.html`. There are no CDNs, web fonts,
tracking pixels or network requests of any kind — the app works offline and can
be opened straight from the file system.

---

## Run it

Open `index.html` in a current Chrome, Edge, Firefox or Safari.

Or serve the folder (recommended if your browser restricts `file://`):

```bash
cd agriloop-prototype-2
python -m http.server 8080
# then open http://localhost:8080
```

State persists in `localStorage` under `agriloop_proto_v2`. **Demo tools → Reset**
restores the first-run seed.

### Verified without a browser

```bash
node tools/check.js
```

Runs the same 18 scenarios the in-app lab runs and exits non-zero on failure.
It needs Node 18+ (for `structuredClone` and `Intl`), no packages.

---

## A five-minute path through the app

1. **Start here** — read the one-screen explainer and switch roles. Every role
   is a different view of the same data; permissions are enforced, not hidden.
2. **Discover** — filter retail/wholesale and sale/donation. Open the pastry box
   and reserve 2. The stock drops immediately.
3. **My pickups** — the pass, its reference and expiry. The code block is
   decorative; the reference is the identifier.
4. **Demo tools → Seed rich demo data** then **advance 75 minutes**. The unused
   hold expires and the stock returns to the pool.
5. **Switch to Sunrise Bakery → Workspace** — publish surplus, accept a bulk
   request, record a partial handover with a reason, change a price (open holds
   must re-agree), report an incident.
6. **Ops dashboard** — kilograms and portions are separate ledgers. Open holds
   are not revenue. Every invariant is listed, passing or failing.
7. **Turn the connection off** and try to redeem a pass. It is refused, with the
   reason. Turn it back on and retry.
8. **Scenario lab** — run all 18. Each one drives the real model on a scratch
   copy and restores your demo data afterwards.

A guided tour is available from the sidebar (8 steps, switches roles for you).

---

## The 18 scenarios

| # | Scenario | What it proves |
|---|---|---|
| S01 | Retail sale, full handover | Hold deducts stock; value and fee recorded once |
| S02 | Retail donation, zero fee | No price, no fee, donation ledger separate |
| S03 | Wholesale partial handover (27/30 kg) | Value from accepted weight; rejected stock stays |
| S04 | Donation split across two collections | Repeated collection stays consistent |
| S05 | Race for the last bags | No oversell when two collectors compete |
| S06 | Duplicate scan of the same pass | Idempotency: one handover, even on a retry |
| S07 | Hold expires after 30 minutes | Release without intervention; listing stays open |
| S08 | Collector cancels a hold | Immediate release; reason in audit trail |
| S09 | Vendor withdraws an offer | Open pickups cancelled; no new holds |
| S10 | Collector rejects at the counter | No sale; stock returns; reason kept |
| S11 | No-show at end of window | Outcome recorded; stock released; listing closes at cutoff |
| S12 | Donation policy gate + vendor approval | Proposed policy enforced in the model, not just the UI |
| S13 | Cross-organisation actions refused | `FORBIDDEN` even if the call is forced |
| S14 | Price change needs re-agreement | Handover blocked until the collector accepts |
| S15 | Offline redemption refused | A pass that cannot be checked is not honoured |
| S16 | Donation allocation beyond supply | First-eligible remainder, no queue-jumping |
| S17 | Incident holds a listing | Handover blocked; only ops reinstates |
| S18 | Metrics never double-count or mix units | kg ≠ portions; holds ≠ revenue |

Each row in the lab shows the steps, every assertion, the expected value and the
actual value.

---

## What the prototype enforces

- **Stock is derived** — `available = total − open holds − collected`. It is
  never stored, so it cannot drift or go negative.
- **Holds expire** after 30 minutes or at the food cutoff, whichever is sooner.
- **One handover per pass**, enforced with an idempotency key; a duplicate scan
  returns the original transfer.
- **Part-handovers** require a reason and price the accepted quantity only.
- **Offline** blocks reservation and handover. Browsing and reading passes still
  work; the app explains the refusal instead of pretending.
- **Permissions** are checked in the model: cross-organisation handovers,
  withdrawals and cancellations throw `FORBIDDEN`.
- **Price changes** freeze open holds until the collector re-agrees.
- **Incidents** hold the listing immediately. Resolving the incident does not
  silently reopen it; operations must reinstate it.
- **Donations** are zero-priced and zero-fee by rule; the organisation-only
  access rule is enforced but clearly labelled as a *proposed* decision.
- **Units are never mixed.** Kilograms and portions are separate ledgers, and
  only completed handovers count as rescued.

### Deliberately not built

No authentication, payments, delivery, scanner, notifications, backend or
database. The code block on a pass is decorative. No food-safety certification
or legal compliance is claimed. These are stated inside the app as well.

---

## Files

```
index.html            shell, top bar, sidebar/tab bar, dialog and tour containers
css/app.css           design system, responsive breakpoints, print styles
js/core.js            seed, state, actions, invariants, metrics, persistence
js/ui.js              icons, chips, pass code, dialogs, toasts
js/views.js           home, discover, listing detail, pickups, dialogs
js/workspace.js       supplier workspace, composer, operations dashboard
js/scenarios.js       18 executable checks + scratch-state runner
js/learn.js           glossary, decision register, scenario lab screen
js/app.js             hash router, shell chrome, delegated events, tour
tools/check.js        CLI runner for the same 18 checks
```

Classic scripts under `window.AL` (no ES modules, no build step), so `file://`
works. Load order is declared at the bottom of `index.html`.

## Demo data

The clock is pinned to **28 Oct 2026, 16:00 Asia/Colombo**. Ten organisations,
seven users, four food categories, three bulk lots and eleven listings (including
yesterday's closed records, so the dashboard has history without changing today's
stock). All times are authored in Sri Lanka time and do not depend on the
machine's timezone.

## Relationship to Prototype 1

`../agriloop-ui/` is unchanged. Prototype 2 replaces its CDN dependency,
mobile-only layout, stored stock, mixed-unit metrics and untested flows. The
in-app **Learn → Prototype 1 → Prototype 2** table lists the differences
side by side.
