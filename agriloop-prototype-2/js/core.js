/* =============================================================================
   AgriLoop Prototype 2 — core
   Domain model, simulated server, state machine, invariants, persistence.
   Pure browser JS (classic script). Everything lives under window.AL.
   ========================================================================== */
window.AL = window.AL || {};

(function (AL) {
  'use strict';

  var TZ = 'Asia/Colombo';
  var KEY = 'agriloop_proto_v2';
  var SCHEMA = 2;
  var START = '2026-10-28T16:00:00+05:30'; // demo "now"
  var HOLD_MIN = 30;                        // retail / bulk hold length
  var EPS = 1e-9;

  /* ------------------------------------------------------------------ utils */

  function round(n, dp) {
    var f = Math.pow(10, dp == null ? 3 : dp);
    return Math.round((n + Number.EPSILON) * f) / f;
  }
  function sum(list, fn) {
    return (list || []).reduce(function (s, x) { return s + (fn ? fn(x) : x); }, 0);
  }
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function clone(o) {
    if (typeof structuredClone === 'function') return structuredClone(o);
    return JSON.parse(JSON.stringify(o));
  }
  function money(n) {
    var v = Math.round(Number(n) || 0);
    return 'LKR ' + v.toLocaleString('en-US');
  }
  function qty(n, unit) {
    var v = round(Number(n) || 0, 2);
    var label = unit === 'kg' ? 'kg'
      : (v === 1 ? unit : ({ box: 'boxes', tray: 'trays' }[unit] || unit + 's'));
    return v.toLocaleString('en-US') + ' ' + label;
  }
  function pct(n) { return Math.round((Number(n) || 0) * 1000) / 10 + '%'; }

  var fmtClock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ, hour12: false });
  var fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ });
  var fmtFull = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ, hour12: false });

  function t(iso) { return new Date(iso).getTime(); }
  function fmtTime(iso) { return iso ? fmtClock.format(new Date(iso)) : '—'; }
  function fmtDayTime(iso) { return iso ? fmtDay.format(new Date(iso)) + ', ' + fmtClock.format(new Date(iso)) : '—'; }
  function fmtFullTime(iso) { return iso ? fmtFull.format(new Date(iso)) : '—'; }
  function rel(iso, nowIso) {
    var diff = Math.round((t(iso) - t(nowIso)) / 60000);
    if (!isFinite(diff)) return '';
    if (diff === 0) return 'now';
    if (Math.abs(diff) < 60) return diff > 0 ? 'in ' + diff + ' min' : Math.abs(diff) + ' min ago';
    var h = Math.floor(Math.abs(diff) / 60), m = Math.abs(diff) % 60;
    return (diff > 0 ? 'in ' : '') + h + 'h' + (m ? ' ' + m + 'm' : '') + (diff > 0 ? '' : ' ago');
  }

  AL.util = {
    round: round, sum: sum, clamp: clamp, esc: esc, clone: clone,
    money: money, qty: qty, pct: pct, rel: rel,
    fmtTime: fmtTime, fmtDayTime: fmtDayTime, fmtFullTime: fmtFullTime,
    t: t, START: START
  };

  /* ------------------------------------------------------------------- seed */

  function seedState() {
    var now = t(START);
    /* Wall-clock times are authored in Sri Lanka time (+05:30, no DST), so they
       must not depend on the machine's own timezone. */
    var at = function (h, m, dayOffset) {
      var shifted = new Date(now + 330 * 60000);
      var y = shifted.getUTCFullYear(), mo = shifted.getUTCMonth(), d = shifted.getUTCDate() + (dayOffset || 0);
      return new Date(Date.UTC(y, mo, d, h, m, 0, 0) - 330 * 60000).toISOString();
    };
    var ago = function (min) { return new Date(now - min * 60000).toISOString(); };

    var state = {
      schema: SCHEMA,
      clock: START,
      online: true,
      seq: { listing: 20, res: 1100, br: 1100, tx: 1100, inc: 1100, aud: 1 },
      prefs: { tourDone: false },
      tour: { active: false, step: 0 },
      actorId: 'u-buyer',
      ui: { filters: { stream: 'all', mode: 'all', q: '', area: 'all' }, lab: {} },

      orgs: [
        { id: 'v1', name: 'Sunrise Bakery', type: 'merchant', stream: 'retail', area: 'Dehiwala', approved: true, contact: 'Galle Road, Dehiwala' },
        { id: 'v2', name: 'Green Leaf Stall', type: 'merchant', stream: 'wholesale', area: 'Peliyagoda', approved: true, contact: 'Peliyagoda Manning Market, stall 42' },
        { id: 'v3', name: 'Campus Cafeteria', type: 'merchant', stream: 'retail', area: 'Colombo 7', approved: true, contact: 'KDU campus, Colombo 7' },
        { id: 'v4', name: 'Nadee Foods', type: 'merchant', stream: 'retail', area: 'Ratmalana', approved: false, contact: 'Ratmalana (application pending)' },
        { id: 'v5', name: 'Lanka Fresh Produce', type: 'merchant', stream: 'wholesale', area: 'Peliyagoda', approved: true, contact: 'Peliyagoda Manning Market, stall 118' },
        { id: 'r1', name: 'Sneha Community Kitchen', type: 'recipient', area: 'Wellawatte', approved: true, contact: 'Wellawatte' },
        { id: 'r2', name: 'Walawwatta Welfare Home', type: 'recipient', area: 'Colombo 6', approved: true, contact: 'Colombo 6' },
        { id: 'r3', name: 'KDU Student Canteen', type: 'recipient', area: 'Ratmalana', approved: true, contact: 'KDU canteen' },
        { id: 'p1', name: 'Personal account', type: 'consumer', area: 'Dehiwala', approved: true, contact: '' },
        { id: 'ops', name: 'AgriLoop operations', type: 'platform', area: 'Colombo', approved: true, contact: '' }
      ],

      users: [
        { id: 'u-buyer', name: 'Nimali Perera', role: 'buyer', orgId: 'p1' },
        { id: 'u-recipient', name: 'Ruwan Silva', role: 'recipient', orgId: 'r1' },
        { id: 'u-recipient2', name: 'Fathima Nazeer', role: 'recipient', orgId: 'r2' },
        { id: 'u-vendor1', name: 'Ayesha Fernando', role: 'merchantAdmin', orgId: 'v1' },
        { id: 'u-vendor2', name: 'Kumara Bandara', role: 'merchantAdmin', orgId: 'v2' },
        { id: 'u-vendor3', name: 'Dilani Jayasuriya', role: 'merchantAdmin', orgId: 'v3' },
        { id: 'u-ops', name: 'Ops desk', role: 'ops', orgId: 'ops' }
      ],

      policies: {
        donationAccess: 'organisations',      // proposed policy; open decision
        feeRatePct: 0,                        // no fee selected; 5% is illustration only
        allocationRule: 'first-eligible',     // when demand exceeds donation supply
        completionWindowGraceMin: 30
      },

      categories: [
        {
          id: 'cat-bakery', name: 'Bakery — same day', version: 'v2.1',
          rule: 'Baked today, kept sealed at room temperature, no cream fillings.',
          required: [
            { key: 'preparedAt', label: 'When was it baked?', kind: 'time' },
            { key: 'storage', label: 'Storage conditions', kind: 'text', example: 'Room temperature, sealed crate' },
            { key: 'allergens', label: 'Allergens', kind: 'text', example: 'Wheat, milk, egg' }
          ]
        },
        {
          id: 'cat-prepared', name: 'Prepared food — same day', version: 'v2.1',
          rule: 'Hot food held above 63 °C or chilled below 5 °C; recorded at handover.',
          required: [
            { key: 'preparedAt', label: 'When was it cooked?', kind: 'time' },
            { key: 'storage', label: 'Holding conditions', kind: 'text', example: 'Hot cabinet, above 63 °C' },
            { key: 'allergens', label: 'Allergens', kind: 'text', example: 'Mustard, gluten' },
            { key: 'temperature', label: 'Temperature at listing', kind: 'text', example: '65 °C' }
          ]
        },
        {
          id: 'cat-produce', name: 'Fresh produce — bulk', version: 'v1.8',
          rule: 'Firm, sound produce with cosmetic variation only. No mould, no soft rot.',
          required: [
            { key: 'storage', label: 'Storage since arrival', kind: 'text', example: 'Shaded stall, ambient' },
            { key: 'condition', label: 'Condition note', kind: 'text', example: 'Grade-B shape, firm' }
          ]
        },
        {
          id: 'cat-packaged', name: 'Packaged groceries', version: 'v1.4',
          rule: 'Sealed retail packaging, date mark visible, no damaged seals.',
          required: [
            { key: 'bestBefore', label: 'Best-before date', kind: 'text', example: '04 Nov 2026' },
            { key: 'storage', label: 'Storage conditions', kind: 'text', example: 'Ambient, dry' }
          ]
        }
      ],

      lots: [
        { id: 'LOT-2410-01', orgId: 'v2', commodity: 'Carrots (Grade-B)', declaredKg: 80, measuredKg: 78.4, basis: 'Stall scale, 28 Oct 05:40' },
        { id: 'LOT-2410-02', orgId: 'v2', commodity: 'Mixed leafy greens', declaredKg: 40, measuredKg: 39.1, basis: 'Stall scale, 28 Oct 05:50' },
        { id: 'LOT-2410-03', orgId: 'v5', commodity: 'Pumpkin', declaredKg: 120, measuredKg: 118.2, basis: 'Stall scale, 28 Oct 06:10' }
      ],

      listings: [
        {
          id: 'L1', orgId: 'v1', stream: 'retail', mode: 'sale', categoryId: 'cat-bakery',
          title: 'Evening pastry box', desc: '4–6 mixed pastries baked this morning. Best eaten today.',
          unit: 'box', totalQty: 6, priceLkr: 250, minQty: 1,
          pickupFrom: at(15, 30), pickupTo: at(19, 30), cutoff: at(19, 45),
          policyVersion: 'cat-bakery@v2.1', state: 'active', version: 1, createdAt: ago(95),
          extra: { preparedAt: '07:00', storage: 'Room temperature, sealed crate', allergens: 'Wheat, milk, egg' }
        },
        {
          id: 'L2', orgId: 'v1', stream: 'retail', mode: 'donation', categoryId: 'cat-bakery',
          title: 'Bread ends bag', desc: 'Clean bread ends and crusts. Suitable for toast, crumbs or soup kitchens.',
          unit: 'bag', totalQty: 8, priceLkr: 0, minQty: 1,
          pickupFrom: at(15, 30), pickupTo: at(19, 0), cutoff: at(19, 15),
          policyVersion: 'cat-bakery@v2.1', state: 'active', version: 1, createdAt: ago(90),
          extra: { preparedAt: '07:00', storage: 'Room temperature, paper bags', allergens: 'Wheat' }
        },
        {
          id: 'L3', orgId: 'v2', stream: 'wholesale', mode: 'sale', categoryId: 'cat-produce',
          title: 'Grade-B carrots — 80 kg lot', desc: 'Cosmetic grade variation only: bent and split roots. Firm, suitable for cooking.',
          unit: 'kg', totalQty: 80, priceLkr: 90, minQty: 10, lotId: 'LOT-2410-01',
          pickupFrom: at(16, 30), pickupTo: at(19, 0), cutoff: at(20, 0),
          policyVersion: 'cat-produce@v1.8', state: 'active', version: 1, createdAt: ago(80),
          extra: { storage: 'Shaded stall, ambient', condition: 'Firm; cosmetic variation' }
        },
        {
          id: 'L4', orgId: 'v2', stream: 'wholesale', mode: 'donation', categoryId: 'cat-produce',
          title: 'Leafy greens — donation lot', desc: 'Mixed greens from this morning, needs use within hours. Organisation collection.',
          unit: 'kg', totalQty: 40, priceLkr: 0, minQty: 5, lotId: 'LOT-2410-02',
          pickupFrom: at(15, 0), pickupTo: at(18, 30), cutoff: at(19, 0),
          policyVersion: 'cat-produce@v1.8', state: 'active', version: 1, createdAt: ago(85),
          extra: { storage: 'Shaded stall, ambient', condition: 'Slight wilting, sound' }
        },
        {
          id: 'L5', orgId: 'v3', stream: 'retail', mode: 'sale', categoryId: 'cat-prepared',
          title: 'Rice & curry lunch packs', desc: 'Remaining lunch packs from today. Reheat before eating.',
          unit: 'pack', totalQty: 12, priceLkr: 180, minQty: 1,
          pickupFrom: at(14, 0), pickupTo: at(17, 30), cutoff: at(17, 45),
          policyVersion: 'cat-prepared@v2.1', state: 'active', version: 1, createdAt: ago(140),
          extra: { preparedAt: '11:00', storage: 'Chilled cabinet, below 5 °C', allergens: 'Mustard', temperature: '4 °C' }
        },
        {
          id: 'L6', orgId: 'v3', stream: 'retail', mode: 'donation', categoryId: 'cat-prepared',
          title: 'Assorted sandwich packs', desc: 'Chilled sandwiches from the lunch service, sealed.',
          unit: 'pack', totalQty: 5, priceLkr: 0, minQty: 1,
          pickupFrom: at(15, 0), pickupTo: at(18, 0), cutoff: at(18, 15),
          policyVersion: 'cat-prepared@v2.1', state: 'active', version: 1, createdAt: ago(70),
          extra: { preparedAt: '10:30', storage: 'Chilled cabinet, below 5 °C', allergens: 'Gluten, egg', temperature: '4 °C' }
        },
        {
          id: 'L7', orgId: 'v4', stream: 'retail', mode: 'sale', categoryId: 'cat-bakery',
          title: 'Milk shortbread trays', desc: 'Day-end shortbread trays. Draft — the bakery has not been approved yet.',
          unit: 'tray', totalQty: 4, priceLkr: 320, minQty: 1,
          pickupFrom: at(17, 0), pickupTo: at(20, 0), cutoff: at(20, 15),
          policyVersion: 'cat-bakery@v2.1', state: 'draft', version: 1, createdAt: ago(40),
          extra: { preparedAt: '09:00', storage: '', allergens: '' }
        },
        {
          id: 'L8', orgId: 'v5', stream: 'wholesale', mode: 'sale', categoryId: 'cat-produce',
          title: 'Pumpkin — 120 kg lot', desc: 'Sound pumpkin, mixed sizes. Sold by weight; bring crates.',
          unit: 'kg', totalQty: 120, priceLkr: 70, minQty: 20, lotId: 'LOT-2410-03',
          pickupFrom: at(16, 0), pickupTo: at(20, 0), cutoff: at(20, 30),
          policyVersion: 'cat-produce@v1.8', state: 'active', version: 1, createdAt: ago(60),
          extra: { storage: 'Shaded stall, ambient', condition: 'Sound, mixed sizes' }
        },
        /* yesterday's closed listings keep the dashboard honest without changing today's stock */
        { id: 'H1', orgId: 'v1', stream: 'retail', mode: 'sale', categoryId: 'cat-bakery', title: 'Yesterday · pastry boxes', desc: 'Closed listing.', unit: 'box', totalQty: 6, priceLkr: 250, minQty: 1, pickupFrom: at(15, 30, -1), pickupTo: at(19, 30, -1), cutoff: at(19, 45, -1), policyVersion: 'cat-bakery@v2.1', state: 'closed', version: 1, createdAt: ago(1500), extra: { preparedAt: '07:00', storage: 'Room temperature', allergens: 'Wheat, milk' } },
        { id: 'H2', orgId: 'v2', stream: 'wholesale', mode: 'donation', categoryId: 'cat-produce', title: 'Yesterday · leafy greens', desc: 'Closed listing.', unit: 'kg', totalQty: 40, priceLkr: 0, minQty: 5, lotId: 'LOT-2410-02', pickupFrom: at(15, 0, -1), pickupTo: at(18, 30, -1), cutoff: at(19, 0, -1), policyVersion: 'cat-produce@v1.8', state: 'closed', version: 1, createdAt: ago(1510), extra: { storage: 'Shaded', condition: 'Slight wilting' } },
        { id: 'H3', orgId: 'v3', stream: 'retail', mode: 'donation', categoryId: 'cat-prepared', title: 'Yesterday · sandwich packs', desc: 'Closed listing.', unit: 'pack', totalQty: 12, priceLkr: 0, minQty: 1, pickupFrom: at(15, 0, -1), pickupTo: at(18, 0, -1), cutoff: at(18, 15, -1), policyVersion: 'cat-prepared@v2.1', state: 'closed', version: 1, createdAt: ago(1520), extra: { preparedAt: '10:30', storage: 'Chilled', allergens: 'Gluten, egg', temperature: '4 °C' } }
      ],

      reservations: [
        {
          id: 'R-1001', listingId: 'L4', listingVersion: 1,
          qty: 8, unit: 'kg', mode: 'donation', priceLkr: 0, feeLkr: 0,
          buyerUserId: 'u-recipient', buyerOrgId: 'r1',
          ref: 'AL-7K2Q', token: 'tok-7k2q', state: 'reserved',
          createdAt: ago(35), expiresAt: new Date(now + 45 * 60000).toISOString(),
          snapshot: { priceLkr: 0, qty: 8, unit: 'kg', policyVersion: 'cat-produce@v1.8', pickupFrom: at(15, 0), pickupTo: at(18, 30), cutoff: at(19, 0) },
          needsAck: false
        },
        {
          id: 'R-1002', listingId: 'L1', listingVersion: 1,
          qty: 2, unit: 'box', mode: 'sale', priceLkr: 500, feeLkr: 0,
          buyerUserId: 'u-buyer', buyerOrgId: 'p1',
          ref: 'AL-3M9D', token: 'tok-3m9d', state: 'reserved',
          createdAt: ago(20), expiresAt: new Date(now + 55 * 60000).toISOString(),
          snapshot: { priceLkr: 250, qty: 2, unit: 'box', policyVersion: 'cat-bakery@v2.1', pickupFrom: at(15, 30), pickupTo: at(19, 30), cutoff: at(19, 45) },
          needsAck: false
        }
      ],

      bulkRequests: [
        { id: 'BR-1001', listingId: 'L3', qty: 20, unit: 'kg', orgId: 'r1', userId: 'u-recipient', state: 'requested', createdAt: ago(25), decidedAt: null, reason: '' },
        { id: 'BR-1002', listingId: 'L8', qty: 30, unit: 'kg', orgId: 'r2', userId: 'u-recipient2', state: 'requested', createdAt: ago(12), decidedAt: null, reason: '' }
      ],

      transfers: [
        { id: 'T-1001', reservationId: 'R-0901', listingId: 'H1', lotId: null, actualQty: 3, unit: 'box', rejectedQty: 0, reason: '', mode: 'sale', stream: 'retail', saleValueLkr: 750, feeLkr: 0, at: at(18, 40, -1), confirmedBy: 'u-vendor1', idempotencyKey: 'demo-h1' },
        { id: 'T-1002', reservationId: 'R-0902', listingId: 'H2', lotId: 'LOT-2410-02', actualQty: 12, unit: 'kg', rejectedQty: 0, reason: '', mode: 'donation', stream: 'wholesale', saleValueLkr: 0, feeLkr: 0, at: at(17, 10, -1), confirmedBy: 'u-vendor2', idempotencyKey: 'demo-h2' },
        { id: 'T-1003', reservationId: 'R-0903', listingId: 'H3', lotId: null, actualQty: 6, unit: 'pack', rejectedQty: 2, reason: 'Packaging damaged in the chiller', mode: 'donation', stream: 'retail', saleValueLkr: 0, feeLkr: 0, at: at(17, 45, -1), confirmedBy: 'u-vendor3', idempotencyKey: 'demo-h3' }
      ],

      incidents: [
        { id: 'INC-1001', listingId: 'L4', lotId: 'LOT-2410-02', category: 'temperature', severity: 'low', note: 'Stall fridge log missing for 20 minutes; greens were in the shaded stall.', state: 'resolved', at: ago(300), resolvedAt: ago(240), by: 'u-ops' }
      ],

      audit: [
        { id: 'A-1', at: ago(95), actorId: 'u-vendor1', action: 'listing.published', resource: 'L1', note: '6 pastry boxes' },
        { id: 'A-2', at: ago(35), actorId: 'u-recipient', action: 'reservation.created', resource: 'R-1001', note: '8 kg donation hold' },
        { id: 'A-3', at: ago(25), actorId: 'u-recipient', action: 'bulk.requested', resource: 'BR-1001', note: '20 kg carrots' }
      ]
    };
    return state;
  }

  /* ------------------------------------------------------------------ store */

  var state = null;
  var listeners = [];
  var memoryOnly = false;

  function save() {
    if (memoryOnly) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { memoryOnly = true; }
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.schema === SCHEMA && Array.isArray(parsed.listings)) {
          state = parsed;
          return;
        }
      }
    } catch (e) { /* corrupt or blocked: fall through to a fresh seed */ }
    state = seedState();
    save();
  }
  function get() { return state; }
  function subscribe(fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }
  var muted = 0;
  function emit() {
    if (muted) return;
    listeners.forEach(function (f) { try { f(state); } catch (e) { console.error(e); } });
  }
  function commit() { save(); emit(); }

  /* Used by the scenario lab: run against a scratch state without repainting
     the app on every simulated click. */
  function mute(fn) {
    muted++;
    try { return fn(); } finally { muted--; }
  }
  function hydrate(obj) {
    state = clone(obj);
    save();
    emit();
    return state;
  }

  function deny(code, message, detail) {
    var e = new Error(message);
    e.code = code;
    e.detail = detail || null;
    return e;
  }

  function now() { return t(state.clock); }
  function nowIso() { return state.clock; }

  function log(actorId, action, resource, note) {
    state.audit.unshift({
      id: 'A-' + (++state.seq.aud),
      at: nowIso(),
      actorId: actorId || 'system',
      action: action,
      resource: resource || '',
      note: note || ''
    });
    if (state.audit.length > 300) state.audit.length = 300;
  }

  /* --------------------------------------------------------------- queries */

  function org(id) { return state.orgs.filter(function (o) { return o.id === id; })[0] || null; }
  function user(id) { return state.users.filter(function (u) { return u.id === id; })[0] || null; }
  function actor() { return user(state.actorId) || state.users[0]; }
  function listing(id) { return state.listings.filter(function (l) { return l.id === id; })[0] || null; }
  function reservation(id) { return state.reservations.filter(function (r) { return r.id === id; })[0] || null; }
  function category(id) { return state.categories.filter(function (c) { return c.id === id; })[0] || null; }
  function lot(id) { return state.lots.filter(function (l) { return l.id === id; })[0] || null; }

  function openReservations(listingId) {
    return state.reservations.filter(function (r) {
      return r.state === 'reserved' && (!listingId || r.listingId === listingId);
    });
  }
  function transfersFor(listingId) {
    return state.transfers.filter(function (tr) { return tr.listingId === listingId; });
  }
  function available(listingId) {
    var L = listing(listingId);
    if (!L) return 0;
    var held = sum(openReservations(listingId), function (r) { return r.qty; });
    var done = sum(transfersFor(listingId), function (tr) { return tr.actualQty; });
    return Math.max(0, round(L.totalQty - held - done, 3));
  }
  function openQty(listingId) { return round(sum(openReservations(listingId), function (r) { return r.qty; }), 3); }
  function collectedQty(listingId) { return round(sum(transfersFor(listingId), function (tr) { return tr.actualQty; }), 3); }

  function isMerchant(u, orgId) {
    return !!u && u.role === 'merchantAdmin' && u.orgId === orgId;
  }
  function isOps(u) { return !!u && u.role === 'ops'; }
  function isBuyerSide(u) { return !!u && (u.role === 'buyer' || u.role === 'recipient'); }

  function listingIsBuyable(L) {
    return L.state === 'active' && now() < t(L.cutoff);
  }
  function pickupOpen(L) {
    var grace = state.policies.completionWindowGraceMin * 60000;
    return now() >= t(L.pickupFrom) - grace && now() <= t(L.pickupTo);
  }

  AL.q = {
    org: org, user: user, actor: actor, listing: listing, reservation: reservation,
    category: category, lot: lot, available: available, openQty: openQty,
    collectedQty: collectedQty, openReservations: openReservations,
    transfersFor: transfersFor, isMerchant: isMerchant, isOps: isOps,
    isBuyerSide: isBuyerSide, listingIsBuyable: listingIsBuyable, pickupOpen: pickupOpen,
    now: now, nowIso: nowIso
  };

  /* --------------------------------------------------------------- mutate */

  function reservationFor(listingId, u) {
    return state.reservations.filter(function (r) {
      return r.state === 'reserved' && r.listingId === listingId && r.buyerUserId === u.id;
    })[0] || null;
  }

  function validateDraft(d) {
    var errs = [];
    if (!d.title || d.title.trim().length < 3) errs.push({ field: 'title', msg: 'Give the offer a short title (3+ characters).' });
    if (!d.categoryId) errs.push({ field: 'categoryId', msg: 'Choose a food category.' });
    if (!(Number(d.totalQty) > 0)) errs.push({ field: 'totalQty', msg: 'Quantity must be greater than zero.' });
    if (d.mode === 'sale' && !(Number(d.priceLkr) > 0)) errs.push({ field: 'priceLkr', msg: 'A sale needs a price above zero.' });
    if (d.mode === 'donation' && Number(d.priceLkr) !== 0) errs.push({ field: 'priceLkr', msg: 'Donations must be priced at zero.' });
    if (!d.pickupFrom || !d.pickupTo) errs.push({ field: 'pickup', msg: 'Set the collection window.' });
    else if (t(d.pickupTo) <= t(d.pickupFrom)) errs.push({ field: 'pickup', msg: 'Collection must end after it starts.' });
    if (!d.cutoff) errs.push({ field: 'cutoff', msg: 'Set the food-eligibility cutoff.' });
    else if (d.pickupTo && t(d.cutoff) < t(d.pickupTo)) errs.push({ field: 'cutoff', msg: 'The cutoff cannot be earlier than the collection window ends.' });

    var cat = category(d.categoryId);
    if (cat) {
      cat.required.forEach(function (f) {
        var v = (d.extra || {})[f.key];
        if (v == null || String(v).trim() === '') {
          errs.push({ field: 'extra.' + f.key, msg: cat.name + ' requires: ' + f.label });
        }
      });
    }
    if (d.stream === 'wholesale' && !(Number(d.minQty) > 0)) errs.push({ field: 'minQty', msg: 'Wholesale lots need a minimum order.' });
    return errs;
  }

  function publishListing(draft) {
    var u = actor();
    if (!(isMerchant(u, draft.orgId) || isOps(u))) throw deny('FORBIDDEN', 'Only an approved vendor for this organisation can publish.');
    var o = org(draft.orgId);
    if (!o || !o.approved) throw deny('NOT_APPROVED', 'This vendor is not approved yet.');
    var errs = validateDraft(draft);
    if (errs.length) throw deny('INVALID', errs[0].msg, errs);

    var L = {
      id: 'L' + (++state.seq.listing),
      orgId: draft.orgId, stream: draft.stream, mode: draft.mode, categoryId: draft.categoryId,
      title: draft.title.trim(), desc: (draft.desc || '').trim(),
      unit: draft.unit, totalQty: Number(draft.totalQty), priceLkr: draft.mode === 'donation' ? 0 : Number(draft.priceLkr),
      minQty: draft.stream === 'wholesale' ? Number(draft.minQty || 1) : 1,
      lotId: draft.lotId || null,
      pickupFrom: draft.pickupFrom, pickupTo: draft.pickupTo, cutoff: draft.cutoff,
      policyVersion: draft.categoryId + '@' + (category(draft.categoryId) || {}).version,
      state: 'active', version: 1, createdAt: nowIso(),
      extra: draft.extra || {}
    };
    state.listings.push(L);
    log(u.id, 'listing.published', L.id, L.title + ' · ' + qty(L.totalQty, L.unit));
    commit();
    return L;
  }

  function reserve(listingId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var L = listing(listingId);
    if (!L) throw deny('NOT_FOUND', 'That offer no longer exists.');
    if (!state.online) throw deny('OFFLINE', 'Reservations need a connection. Browsing works offline; the hold must be confirmed by the server.');
    if (L.state !== 'active') throw deny('NOT_ACTIVE', 'This offer is not open.');
    if (now() >= t(L.cutoff)) throw deny('CLOSED', 'The food-eligibility cutoff has passed.');
    if (now() < t(L.pickupFrom) - 3600000) throw deny('TOO_EARLY', 'This offer opens later today.');

    if (L.mode === 'donation' && state.policies.donationAccess === 'organisations' && u.role !== 'recipient') {
      throw deny('POLICY_DONATION', 'Free donations are currently limited to approved organisations. Individual access is an open decision.');
    }

    var q = Number(opts.qty == null ? (L.unit === 'kg' ? L.minQty : 1) : opts.qty);
    if (!isFinite(q) || q <= 0) throw deny('INVALID', 'Choose a quantity above zero.');
    if (L.unit !== 'kg' && Math.round(q) !== q) throw deny('INVALID', 'Whole units only for this offer.');
    if (L.stream === 'wholesale' && q < L.minQty) throw deny('MIN_QTY', 'Minimum request is ' + qty(L.minQty, L.unit) + '.');
    var avail = available(listingId);
    if (q > avail) throw deny('NO_STOCK', 'Only ' + qty(avail, L.unit) + ' left. Someone else may have just taken it.');

    var existing = reservationFor(listingId, u);
    if (existing) throw deny('ALREADY_HELD', 'You already hold a pickup for this offer (' + existing.ref + ').');

    var expires = Math.min(now() + HOLD_MIN * 60000, t(L.cutoff));
    var R = {
      id: 'R-' + (++state.seq.res),
      listingId: L.id, listingVersion: L.version,
      qty: q, unit: L.unit, mode: L.mode,
      priceLkr: L.mode === 'donation' ? 0 : round(L.priceLkr * q, 2),
      feeLkr: 0,
      buyerUserId: u.id, buyerOrgId: u.orgId,
      ref: 'AL-' + code4(), token: 'tok-' + code4().toLowerCase(),
      state: 'reserved', createdAt: nowIso(), expiresAt: new Date(expires).toISOString(),
      snapshot: {
        priceLkr: L.priceLkr, qty: q, unit: L.unit, policyVersion: L.policyVersion,
        pickupFrom: L.pickupFrom, pickupTo: L.pickupTo, cutoff: L.cutoff
      },
      needsAck: false
    };
    state.reservations.unshift(R);
    log(u.id, 'reservation.created', R.id, qty(q, L.unit) + ' · ' + L.title);
    commit();
    return R;
  }

  function requestBulk(listingId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var L = listing(listingId);
    if (!L) throw deny('NOT_FOUND', 'That lot no longer exists.');
    if (!state.online) throw deny('OFFLINE', 'Requests need a connection.');
    if (L.stream !== 'wholesale') throw deny('INVALID', 'Bulk requests are for wholesale lots.');
    if (!listingIsBuyable(L)) throw deny('CLOSED', 'This lot is closed or past its cutoff.');
    if (L.mode === 'donation' && state.policies.donationAccess === 'organisations' && u.role !== 'recipient') {
      throw deny('POLICY_DONATION', 'Free donations are currently limited to approved organisations. Individual access is an open decision.');
    }
    var q = Number(opts.qty);
    if (!isFinite(q) || q <= 0) throw deny('INVALID', 'Enter a quantity above zero.');
    if (q < L.minQty) throw deny('MIN_QTY', 'Minimum request is ' + qty(L.minQty, L.unit) + '.');
    if (q > available(listingId)) throw deny('NO_STOCK', 'Only ' + qty(available(listingId), L.unit) + ' left.');

    var dup = state.bulkRequests.filter(function (b) {
      return b.listingId === L.id && b.orgId === u.orgId && b.state === 'requested';
    })[0];
    if (dup) throw deny('DUPLICATE', 'You already have a pending request for this lot (' + dup.id + ').');

    var BR = {
      id: 'BR-' + (++state.seq.br), listingId: L.id, qty: q, unit: L.unit,
      orgId: u.orgId, userId: u.id, state: 'requested',
      createdAt: nowIso(), decidedAt: null, reason: ''
    };
    state.bulkRequests.unshift(BR);
    log(u.id, 'bulk.requested', BR.id, qty(q, L.unit) + ' · ' + L.title);
    commit();
    return BR;
  }

  function decideBulk(brId, accept, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var BR = state.bulkRequests.filter(function (b) { return b.id === brId; })[0];
    if (!BR) throw deny('NOT_FOUND', 'Request not found.');
    if (BR.state !== 'requested') throw deny('ALREADY_DECIDED', 'This request was already ' + BR.state + '.');
    var L = listing(BR.listingId);
    if (!isMerchant(u, L.orgId) && !isOps(u)) throw deny('FORBIDDEN', 'Only the supplier can decide this request.');
    if (now() >= t(L.cutoff)) throw deny('CLOSED', 'The lot is past its cutoff.');
    if (L.mode === 'donation' && state.policies.donationAccess === 'organisations') {
      var requester = BR.userId ? user(BR.userId) : null;
      if (!requester || requester.role !== 'recipient') {
        throw deny('POLICY_DONATION', 'This request does not come from an approved recipient organisation.');
      }
    }

    if (!accept) {
      BR.state = 'declined';
      BR.decidedAt = nowIso();
      BR.reason = opts.reason || 'Not accepted by the supplier';
      log(u.id, 'bulk.declined', BR.id, BR.reason);
      commit();
      return BR;
    }

    var avail = available(L.id);
    if (BR.qty > avail) {
      BR.state = 'declined';
      BR.decidedAt = nowIso();
      BR.reason = 'Insufficient remaining stock at acceptance (' + qty(avail, L.unit) + ' left)';
      log(u.id, 'bulk.declined', BR.id, BR.reason);
      commit();
      throw deny('NO_STOCK', 'Not enough stock left. The request was declined and the recipient is notified.');
    }

    var expires = Math.min(now() + 120 * 60000, t(L.cutoff));
    var R = {
      id: 'R-' + (++state.seq.res), listingId: L.id, listingVersion: L.version,
      qty: BR.qty, unit: L.unit, mode: L.mode,
      priceLkr: L.mode === 'donation' ? 0 : round(L.priceLkr * BR.qty, 2),
      feeLkr: 0, buyerUserId: BR.userId, buyerOrgId: BR.orgId,
      ref: 'AL-' + code4(), token: 'tok-' + code4().toLowerCase(),
      state: 'reserved', createdAt: nowIso(), expiresAt: new Date(expires).toISOString(),
      bulkRequestId: BR.id,
      snapshot: {
        priceLkr: L.priceLkr, qty: BR.qty, unit: L.unit, policyVersion: L.policyVersion,
        pickupFrom: L.pickupFrom, pickupTo: L.pickupTo, cutoff: L.cutoff
      },
      needsAck: false
    };
    BR.state = 'accepted';
    BR.decidedAt = nowIso();
    state.reservations.unshift(R);
    log(u.id, 'bulk.accepted', BR.id, qty(BR.qty, L.unit) + ' reserved as ' + R.id);
    commit();
    return R;
  }

  function cancelReservation(resId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var R = reservation(resId);
    if (!R) throw deny('NOT_FOUND', 'Reservation not found.');
    if (R.state !== 'reserved') throw deny('NOT_OPEN', 'This pickup is already ' + R.state + '.');
    var mine = R.buyerUserId === u.id || R.buyerOrgId === u.orgId;
    if (!mine && !isOps(u)) throw deny('FORBIDDEN', 'You can only cancel your own pickup.');
    R.state = 'cancelled';
    R.closedAt = nowIso();
    R.reason = opts.reason || 'Cancelled by the buyer';
    log(u.id, 'reservation.cancelled', R.id, R.reason);
    commit();
    return R;
  }

  function confirmHandover(resId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var R = reservation(resId);
    if (!R) throw deny('NOT_FOUND', 'Pickup not found.');

    if (opts.idempotencyKey) {
      var dup = state.transfers.filter(function (tr) { return tr.idempotencyKey === opts.idempotencyKey; })[0];
      if (dup) return { transfer: dup, idempotent: true };
    }
    if (!state.online) throw deny('OFFLINE', 'A handover needs a server check. Without a connection the pass cannot be redeemed.');
    if (R.state === 'collected' || R.state === 'partially-collected') throw deny('ALREADY_COMPLETED', 'This pickup was already recorded at ' + fmtTime(R.closedAt || R.createdAt) + '.');
    if (R.state !== 'reserved') throw deny('NOT_OPEN', 'This pickup is ' + R.state + ' and cannot be completed.');
    if (R.needsAck) throw deny('TERMS_CHANGED', 'The supplier changed the terms. The collector must accept the new terms first.');

    var L = listing(R.listingId);
    if (!isMerchant(u, L.orgId) && !isOps(u)) throw deny('FORBIDDEN', 'Only the supplier records the handover.');
    if (L.state === 'suspended') throw deny('LOT_HELD', 'This lot is held for an incident review. Handover is blocked.');
    if (!pickupOpen(L)) {
      if (now() < t(L.pickupFrom)) throw deny('WINDOW_NOT_OPEN', 'Collection opens at ' + fmtTime(L.pickupFrom) + '.');
      throw deny('WINDOW_CLOSED', 'The collection window ended at ' + fmtTime(L.pickupTo) + '.');
    }

    var actual = opts.actualQty == null ? R.qty : Number(opts.actualQty);
    if (!isFinite(actual) || actual < 0) throw deny('INVALID', 'Enter the accepted quantity.');
    if (L.unit !== 'kg' && Math.round(actual) !== actual) throw deny('INVALID', 'Whole units only.');
    if (actual > R.qty + EPS) throw deny('OVER_QTY', 'You cannot accept more than the ' + qty(R.qty, R.unit) + ' held.');
    if (actual < R.qty - EPS && !opts.reason) throw deny('REASON_REQUIRED', 'Record why ' + qty(R.qty - actual, R.unit) + ' was not accepted.');

    var value = R.mode === 'donation' ? 0 : round(R.snapshot.priceLkr * actual, 2);
    var fee = R.mode === 'donation' ? 0 : round(value * (state.policies.feeRatePct / 100), 2);
    var T = {
      id: 'T-' + (++state.seq.tx),
      reservationId: R.id, listingId: L.id, lotId: L.lotId || null,
      actualQty: round(actual, 3), unit: R.unit,
      rejectedQty: round(R.qty - actual, 3),
      reason: opts.reason || '',
      mode: R.mode, stream: L.stream,
      saleValueLkr: value, feeLkr: fee,
      at: nowIso(), confirmedBy: u.id,
      idempotencyKey: opts.idempotencyKey || ('auto-' + R.id)
    };
    state.transfers.unshift(T);
    R.state = actual < R.qty - EPS ? 'partially-collected' : 'collected';
    R.closedAt = nowIso();
    R.actualQty = T.actualQty;
    log(u.id, 'handover.confirmed', R.id, qty(actual, R.unit) + (T.rejectedQty > 0 ? ' (rejected ' + qty(T.rejectedQty, R.unit) + ')' : ''));
    commit();
    return { transfer: T, idempotent: false };
  }

  function rejectAtHandover(resId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var R = reservation(resId);
    if (!R) throw deny('NOT_FOUND', 'Pickup not found.');
    if (R.state !== 'reserved') throw deny('NOT_OPEN', 'This pickup is ' + R.state + '.');
    var mine = R.buyerUserId === u.id || R.buyerOrgId === u.orgId;
    if (!mine && !isOps(u)) throw deny('FORBIDDEN', 'Only the collector can reject an offer.');
    R.state = 'rejected';
    R.closedAt = nowIso();
    R.reason = opts.reason || 'Did not match the description';
    log(u.id, 'handover.rejected', R.id, R.reason);
    commit();
    return R;
  }

  function withdrawListing(listingId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var L = listing(listingId);
    if (!L) throw deny('NOT_FOUND', 'Offer not found.');
    if (!isMerchant(u, L.orgId) && !isOps(u)) throw deny('FORBIDDEN', 'Only the vendor or operations can withdraw this offer.');
    if (L.state === 'withdrawn') throw deny('ALREADY', 'This offer is already withdrawn.');
    L.state = 'withdrawn';
    L.withdrawnReason = opts.reason || 'Withdrawn by vendor';
    L.withdrawnAt = nowIso();
    var cancelled = 0;
    openReservations(L.id).forEach(function (R) {
      R.state = 'vendor-cancelled';
      R.closedAt = nowIso();
      R.reason = L.withdrawnReason;
      cancelled++;
    });
    log(u.id, 'listing.withdrawn', L.id, L.withdrawnReason + (cancelled ? ' · ' + cancelled + ' pickup(s) cancelled' : ''));
    commit();
    return { listing: L, cancelled: cancelled };
  }

  function suspendListing(listingId, reason, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var L = listing(listingId);
    if (!L) throw deny('NOT_FOUND', 'Offer not found.');
    if (!isOps(u) && !isMerchant(u, L.orgId)) throw deny('FORBIDDEN', 'Only operations can hold a listing for review.');
    L.state = 'suspended';
    L.suspendedReason = reason || 'Held for review';
    L.suspendedAt = nowIso();
    log(u.id, 'listing.suspended', L.id, L.suspendedReason);
    commit();
    return L;
  }

  function changePrice(listingId, newPrice, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var L = listing(listingId);
    if (!L) throw deny('NOT_FOUND', 'Offer not found.');
    if (!isMerchant(u, L.orgId) && !isOps(u)) throw deny('FORBIDDEN', 'Only the vendor can change the price.');
    if (L.mode === 'donation') throw deny('INVALID', 'Donations have no price to change.');
    L.priceLkr = Number(newPrice);
    L.version++;
    var open = openReservations(L.id);
    open.forEach(function (R) { R.needsAck = true; R.pendingPriceLkr = Number(newPrice); });
    log(u.id, 'listing.price_changed', L.id, money(newPrice) + (open.length ? ' · ' + open.length + ' pickup(s) need re-agreement' : ''));
    commit();
    return { listing: L, affected: open.length };
  }

  function acknowledgeChange(resId, opts) {
    var u = opts && opts.actorId ? user(opts.actorId) : actor();
    var R = reservation(resId);
    if (!R) throw deny('NOT_FOUND', 'Pickup not found.');
    if (!R.needsAck) return R;
    R.snapshot.priceLkr = R.pendingPriceLkr;
    R.priceLkr = round(R.pendingPriceLkr * R.qty, 2);
    R.needsAck = false;
    delete R.pendingPriceLkr;
    log(u.id, 'reservation.terms_accepted', R.id, money(R.priceLkr));
    commit();
    return R;
  }

  function reportIncident(opts) {
    var u = opts.actorId ? user(opts.actorId) : actor();
    var L = listing(opts.listingId);
    if (!L) throw deny('NOT_FOUND', 'Offer not found.');
    var I = {
      id: 'INC-' + (++state.seq.inc),
      listingId: L.id, lotId: L.lotId || null,
      category: opts.category || 'other', severity: opts.severity || 'medium',
      note: opts.note || '',
      state: 'open', at: nowIso(), resolvedAt: null, by: u.id
    };
    state.incidents.unshift(I);
    L.state = 'suspended';
    L.suspendedReason = 'Incident ' + I.id + ': ' + I.category;
    L.suspendedAt = nowIso();
    log(u.id, 'incident.opened', I.id, L.title + ' · ' + I.category);
    commit();
    return I;
  }

  function resolveIncident(id) {
    var u = actor();
    var I = state.incidents.filter(function (x) { return x.id === id; })[0];
    if (!I) throw deny('NOT_FOUND', 'Incident not found.');
    if (!isOps(u) && !isMerchant(u, (listing(I.listingId) || {}).orgId)) {
      throw deny('FORBIDDEN', 'Only operations or the listing vendor can close an incident.');
    }
    if (I.state === 'resolved') throw deny('ALREADY', 'This incident is already resolved.');
    I.state = 'resolved';
    I.resolvedAt = nowIso();
    log(u.id, 'incident.resolved', I.id, 'Review completed');
    commit();
    return I;
  }

  function reinstateListing(listingId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var L = listing(listingId);
    if (!L) throw deny('NOT_FOUND', 'Offer not found.');
    if (!isOps(u)) throw deny('FORBIDDEN', 'Only operations can put a held listing back on the market.');
    if (L.state !== 'suspended') throw deny('INVALID', 'Only a listing on hold can be reinstated.');
    if (now() >= t(L.cutoff)) throw deny('CLOSED', 'The food-eligibility cutoff has passed. Publish a fresh listing instead.');
    L.state = 'active';
    L.reinstatedAt = nowIso();
    delete L.suspendedReason;
    log(u.id, 'listing.reinstated', L.id, 'Incident review closed');
    commit();
    return L;
  }

  function approveOrg(orgId, opts) {
    opts = opts || {};
    var u = opts.actorId ? user(opts.actorId) : actor();
    var o = org(orgId);
    if (!o) throw deny('NOT_FOUND', 'Organisation not found.');
    if (!isOps(u)) throw deny('FORBIDDEN', 'Only operations can approve a vendor.');
    if (o.approved) throw deny('ALREADY', o.name + ' is already approved.');
    o.approved = true;
    o.approvedAt = nowIso();
    log(u.id, 'org.approved', o.id, o.name);
    commit();
    return o;
  }

  function tick() {
    var changes = [];
    var N = now();

    state.reservations.forEach(function (R) {
      if (R.state !== 'reserved') return;
      var L = listing(R.listingId);
      if (!L) return;
      if (N > t(R.snapshot.cutoff)) {
        R.state = 'expired'; R.closedAt = nowIso(); R.reason = 'Food-eligibility cutoff passed';
        changes.push(R.id + ' expired (cutoff)');
      } else if (N > t(R.snapshot.pickupTo)) {
        R.state = 'no-show'; R.closedAt = nowIso(); R.reason = 'Collection window closed without handover';
        changes.push(R.id + ' marked no-show');
      } else if (N > t(R.expiresAt)) {
        R.state = 'expired'; R.closedAt = nowIso(); R.reason = 'Hold expired after ' + HOLD_MIN + ' minutes';
        changes.push(R.id + ' expired (hold)');
      }
    });

    state.listings.forEach(function (L) {
      if (L.state === 'active' && N > t(L.cutoff)) {
        L.state = 'closed';
        changes.push(L.id + ' closed');
      }
    });

    state.bulkRequests.forEach(function (B) {
      if (B.state !== 'requested') return;
      var L = listing(B.listingId);
      if (L && N > t(L.cutoff)) {
        B.state = 'expired'; B.decidedAt = nowIso(); B.reason = 'Lot cutoff passed before a decision';
        changes.push(B.id + ' expired');
      }
    });

    if (changes.length) {
      log('system', 'tick', '', changes.join('; '));
      commit();
    }
    return changes;
  }

  function advance(minutes) {
    state.clock = new Date(now() + minutes * 60000).toISOString();
    log('system', 'clock.advanced', '', '+' + minutes + ' min → ' + fmtFullTime(state.clock));
    var changes = tick();
    save(); emit();
    return changes;
  }

  function setOnline(v) {
    state.online = !!v;
    log('system', v ? 'connection.restored' : 'connection.lost', '', '');
    save(); emit();
  }

  function setActor(id) {
    if (!user(id)) return;
    state.actorId = id;
    save(); emit();
  }

  /* -------------------------------------------------------------- metrics */

  function metrics() {
    var N = now();
    var tx = state.transfers;
    var retailUnits = sum(tx.filter(function (x) { return x.unit !== 'kg'; }), function (x) { return x.actualQty; });
    var wholesaleKg = sum(tx.filter(function (x) { return x.unit === 'kg'; }), function (x) { return x.actualQty; });
    var saleValue = sum(tx, function (x) { return x.saleValueLkr; });
    var fee = sum(tx, function (x) { return x.feeLkr; });
    var donationKg = sum(tx.filter(function (x) { return x.mode === 'donation' && x.unit === 'kg'; }), function (x) { return x.actualQty; });
    var donationUnits = sum(tx.filter(function (x) { return x.mode === 'donation' && x.unit !== 'kg'; }), function (x) { return x.actualQty; });
    var byMode = {
      sale: tx.filter(function (x) { return x.mode === 'sale'; }),
      donation: tx.filter(function (x) { return x.mode === 'donation'; })
    };
    var byStream = {
      retail: tx.filter(function (x) { return x.stream === 'retail'; }),
      wholesale: tx.filter(function (x) { return x.stream === 'wholesale'; })
    };

    var due = state.reservations.filter(function (R) { return t(R.snapshot.pickupTo) <= N; });
    var completedDue = due.filter(function (R) { return R.state === 'collected' || R.state === 'partially-collected'; });
    var rate = due.length ? completedDue.length / due.length : null;

    var outcomes = {};
    state.reservations.forEach(function (R) {
      var key = R.state === 'partially-collected' ? 'collected' : R.state;
      outcomes[key] = (outcomes[key] || 0) + 1;
    });

    return {
      transfers: tx.length,
      retailUnits: retailUnits,
      wholesaleKg: wholesaleKg,
      donationKg: donationKg,
      donationUnits: donationUnits,
      saleValue: saleValue,
      fee: fee,
      byMode: byMode,
      byStream: byStream,
      due: due.length,
      completedDue: completedDue.length,
      collectionRate: rate,
      outcomes: outcomes,
      openExceptions:
        state.reservations.filter(function (R) { return R.state === 'no-show' || R.state === 'expired'; }).length +
        state.incidents.filter(function (i) { return i.state === 'open'; }).length +
        state.listings.filter(function (l) { return l.state === 'suspended'; }).length +
        state.bulkRequests.filter(function (b) { return b.state === 'requested'; }).length,
      pendingRequests: state.bulkRequests.filter(function (b) { return b.state === 'requested'; }).length,
      openIncidents: state.incidents.filter(function (i) { return i.state === 'open'; }).length,
      suspended: state.listings.filter(function (l) { return l.state === 'suspended'; }).length,
      activeListings: state.listings.filter(function (l) { return l.state === 'active'; }).length
    };
  }

  function daySeries() {
    var map = {};
    state.transfers.forEach(function (tr) {
      var day = fmtDay.format(new Date(tr.at));
      map[day] = map[day] || { kg: 0, units: 0, label: day };
      if (tr.unit === 'kg') map[day].kg += tr.actualQty;
      else map[day].units += tr.actualQty;
    });
    return Object.keys(map).slice(-6).map(function (k) { return map[k]; });
  }

  /* ----------------------------------------------------------- invariants */

  function invariants() {
    var out = [];
    state.listings.forEach(function (L) {
      var a = available(L.id);
      var held = openQty(L.id);
      var done = collectedQty(L.id);
      out.push({
        ok: a >= -EPS,
        label: L.id + ' stock never goes negative',
        detail: 'available ' + a + ' · held ' + held + ' · collected ' + done + ' · total ' + L.totalQty
      });
      out.push({
        ok: held + done <= L.totalQty + EPS,
        label: L.id + ' held + collected ≤ total',
        detail: held + ' + ' + done + ' ≤ ' + L.totalQty
      });
    });

    var seen = {};
    var dup = false;
    state.transfers.forEach(function (tr) {
      if (seen[tr.reservationId]) dup = true;
      seen[tr.reservationId] = true;
    });
    out.push({ ok: !dup, label: 'One handover per pickup', detail: dup ? 'duplicate found' : 'no duplicate reservation ids' });

    var badDonation = state.transfers.filter(function (tr) { return tr.mode === 'donation' && (tr.feeLkr !== 0 || tr.saleValueLkr !== 0); });
    out.push({ ok: badDonation.length === 0, label: 'Donations carry zero price and zero fee', detail: badDonation.length ? badDonation.length + ' bad records' : 'all donation records are zero' });

    var collectedWithoutTransfer = state.reservations.filter(function (R) {
      return (R.state === 'collected' || R.state === 'partially-collected') &&
        !state.transfers.some(function (tr) { return tr.reservationId === R.id; });
    });
    out.push({ ok: collectedWithoutTransfer.length === 0, label: 'Collected pickups always have a handover record', detail: collectedWithoutTransfer.length + ' missing' });

    var withdrawnHeld = state.listings.filter(function (L) {
      return (L.state === 'withdrawn' || L.state === 'closed') && openReservations(L.id).length > 0;
    });
    out.push({ ok: withdrawnHeld.length === 0, label: 'Closed listings hold no open pickups', detail: withdrawnHeld.length + ' listing(s) still holding' });

    return out;
  }

  /* ------------------------------------------------------------ utilities */

  function code4() {
    var alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    var s = '';
    for (var i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
    return s;
  }

  function invites() {
    var m = metrics();
    return { hasOpen: openReservations().length, pending: m.pendingRequests };
  }

  function exportRows() {
    var rows = [['type', 'id', 'time', 'stream', 'mode', 'unit', 'qty', 'value_lkr', 'fee_lkr', 'state_or_reason']];
    state.transfers.forEach(function (tr) {
      rows.push(['transfer', tr.id, tr.at, tr.stream, tr.mode, tr.unit, tr.actualQty, tr.saleValueLkr, tr.feeLkr, tr.reason || 'completed']);
    });
    state.reservations.forEach(function (R) {
      rows.push(['reservation', R.id, R.createdAt, '', R.mode, R.unit, R.qty, R.priceLkr, R.feeLkr, R.state + (R.reason ? ' · ' + R.reason : '')]);
    });
    return rows;
  }

  function reset() {
    state = seedState();
    save(); emit();
    return state;
  }

  function seedRichDemo() {
    var made = 0;
    var u1 = user('u-vendor1'), u2 = user('u-vendor2');
    try {
      // Retail sale on L1 (buyer), immediate handover during window.
      var R1 = reserve('L1', { qty: 1, actorId: 'u-buyer' });
      confirmHandover(R1.id, { actualQty: 1, actorId: 'u-vendor1', idempotencyKey: 'rich-' + R1.id });
      made++;
    } catch (e) { /* already held or window closed */ }
    try {
      var R2 = reserve('L5', { qty: 2, actorId: 'u-buyer' });
      confirmHandover(R2.id, { actualQty: 2, actorId: 'u-vendor3', idempotencyKey: 'rich-' + R2.id });
      made++;
    } catch (e) {}
    try {
      var R3 = reserve('L6', { qty: 3, actorId: 'u-recipient' });
      confirmHandover(R3.id, { actualQty: 2, reason: 'One pack damaged in transit', actorId: 'u-vendor3', idempotencyKey: 'rich-' + R3.id });
      made++;
    } catch (e) {}
    try {
      var R4 = decideBulk('BR-1001', true, { actorId: 'u-vendor2' });
      confirmHandover(R4.id, { actualQty: 18, reason: '2 kg trimmed during grading', actorId: 'u-vendor2', idempotencyKey: 'rich-' + R4.id });
      made++;
    } catch (e) {}
    log('system', 'demo.seeded', '', made + ' completed transfer(s) added');
    commit();
    return made;
  }

  AL.store = {
    KEY: KEY, SCHEMA: SCHEMA,
    init: load, get: get, subscribe: subscribe, emit: emit, reset: reset,
    save: save, mute: mute, hydrate: hydrate,
    deny: deny, log: log,
    metrics: metrics, invariants: invariants, daySeries: daySeries,
    exportRows: exportRows
  };

  AL.actions = {
    reserve: reserve, requestBulk: requestBulk, decideBulk: decideBulk,
    cancelReservation: cancelReservation, confirmHandover: confirmHandover,
    rejectAtHandover: rejectAtHandover, withdrawListing: withdrawListing,
    suspendListing: suspendListing, changePrice: changePrice,
    acknowledgeChange: acknowledgeChange, publishListing: publishListing,
    validateDraft: validateDraft, reportIncident: reportIncident,
    resolveIncident: resolveIncident, reinstateListing: reinstateListing,
    approveOrg: approveOrg, tick: tick, advance: advance,
    setOnline: setOnline, setActor: setActor, seedRichDemo: seedRichDemo
  };

  AL.seed = seedState;
})(window.AL);
