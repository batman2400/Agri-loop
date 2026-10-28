# AgriLoop UI Prototype (idea stage)

Self-contained mobile-friendly web UI demonstrating the confirmed AgriLoop concept.

**No backend. Synthetic data only. Not a live service.**

## Confirmed model reflected

- Idea stage (this is a UI prototype)
- Both retail and wholesale streams
- Discounted sales **and** free donations
- Buyer / recipient self-collection (no delivery fleet)
- Business with a free donation channel (zero platform fee on donations in the working interpretation)

## How to run

Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge).

Or from this folder:

```bash
npx serve .
# or: python3 -m http.server 8080
```

Then visit the printed local URL. State persists in `localStorage` under key `agriloop_proto_v1`.

## What you can try

1. **Discover** — filter by stream (retail / wholesale) and mode (sale / donation).
2. **Retail sale** — open a pastry or lunch listing → Reserve → confirm handover or cancel.
3. **Retail donation** — reserve bread ends (free).
4. **Wholesale sale** — request kg of carrots → switch to **Vendor** role → accept request → confirm handover (or partial qty).
5. **Wholesale donation** — same flow for leafy greens.
6. **Vendor** — withdraw a listing (cancels open reservations).
7. **Admin** — see aggregate counts and recent transfers (demo metrics only).
8. **Reset demo data** — Admin view bottom button.

## Explicit non-claims

- No real food, vendors, payments, or partners.
- No atomic server-side stock control, QR camera, notifications, or auth.
- No selected commission rate, payment provider, or hosting.
- Numbers and names are invented for the walkthrough.

Built for Team Fade / AgriLoop project context (24 Oct 2026 decisions).
