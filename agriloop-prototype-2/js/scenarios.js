/* =============================================================================
   AgriLoop Prototype 2 — scenario lab
   18 executable checks against the real domain model. Each scenario runs on a
   fresh seed inside a muted store, then the user's demo state is restored.
   ========================================================================== */
window.AL = window.AL || {};

(function (AL) {
  'use strict';

  var A = null, q = null, store = null;

  function fmt(v) {
    if (typeof v === 'number') return String(Math.round(v * 1000) / 1000);
    return String(v);
  }

  function makeCtx(out) {
    return {
      step: function (text) { out.steps.push(text); },
      check: function (label, ok, detail) {
        out.checks.push({ label: label, ok: !!ok, detail: detail == null ? '' : String(detail) });
      },
      eq: function (label, actual, expected, extra) {
        var ok = (typeof expected === 'number' && typeof actual === 'number')
          ? Math.abs(actual - expected) < 1e-6
          : actual === expected;
        out.checks.push({
          label: label,
          ok: ok,
          detail: 'expected ' + fmt(expected) + ', got ' + fmt(actual) + (extra ? ' · ' + extra : '')
        });
      },
      throws: function (label, code, fn) {
        try {
          fn();
          out.checks.push({ label: label, ok: false, detail: 'expected ' + code + ' but the action succeeded' });
        } catch (e) {
          out.checks.push({
            label: label,
            ok: e && e.code === code,
            detail: (e && e.code ? e.code : 'no code') + ' — ' + (e && e.message ? e.message : String(e))
          });
        }
      }
    };
  }

  function draftFor(orgId) {
    var now = q.now();
    var iso = function (min) { return new Date(now + min * 60000).toISOString(); };
    return {
      orgId: orgId, stream: 'retail', mode: 'sale', categoryId: 'cat-bakery',
      title: 'Test shortbread tray', desc: 'Created by the scenario lab', unit: 'tray',
      totalQty: 2, priceLkr: 150, minQty: 1,
      pickupFrom: iso(60), pickupTo: iso(180), cutoff: iso(200), lotId: null,
      extra: { preparedAt: '09:00', storage: 'Room temperature, sealed', allergens: 'Wheat, milk' }
    };
  }

  function transfersFor(resId) {
    return store.get().transfers.filter(function (t) { return t.reservationId === resId; });
  }

  function met() { return store.metrics(); }

  /* --------------------------------------------------------------- scenarios */

  var list = [
    {
      id: 'S01',
      name: 'Retail sale, full handover',
      why: 'The basic paid loop: hold, collect, record. Stock leaves once and only once.',
      run: function (c) {
        var before = q.available('L5');
        c.step('Nimali reserves 2 rice & curry packs at LKR 180 each.');
        var R = A.reserve('L5', { qty: 2, actorId: 'u-buyer' });
        c.eq('A hold deducts stock immediately', q.available('L5'), before - 2);
        c.eq('Hold total uses the unit price', R.priceLkr, 360);
        c.step('The canteen records a full handover.');
        var out = A.confirmHandover(R.id, { actualQty: 2, actorId: 'u-vendor3' });
        c.eq('Pickup becomes collected', q.reservation(R.id).state, 'collected');
        c.eq('Sale value is recorded once', out.transfer.saleValueLkr, 360);
        c.eq('No platform fee is invented', out.transfer.feeLkr, 0);
        c.eq('Exactly one transfer exists for the pass', transfersFor(R.id).length, 1);
        c.eq('Collected stock does not return to available', q.available('L5'), before - 2);
      }
    },
    {
      id: 'S02',
      name: 'Retail donation, zero fee',
      why: 'The free channel must stay free: no price, no fee, no sale value.',
      run: function (c) {
        var before = met().donationUnits;
        c.step('A recipient organisation reserves 3 bags of bread ends.');
        var R = A.reserve('L2', { qty: 3, actorId: 'u-recipient' });
        c.eq('Donation hold has no price', R.priceLkr, 0);
        var out = A.confirmHandover(R.id, { actualQty: 3, actorId: 'u-vendor1' });
        c.eq('Transfer value is zero', out.transfer.saleValueLkr, 0);
        c.eq('Transfer fee is zero', out.transfer.feeLkr, 0);
        c.eq('Mode is recorded as donation', out.transfer.mode, 'donation');
        c.eq('Donation portions ledger increases by 3', met().donationUnits - before, 3);
        c.check('No donation transfer carries a fee',
          store.get().transfers.filter(function (t) { return t.mode === 'donation'; })
            .every(function (t) { return t.feeLkr === 0 && t.saleValueLkr === 0; }));
      }
    },
    {
      id: 'S03',
      name: 'Wholesale partial handover (27 of 30 kg)',
      why: 'Produce is sold by accepted weight. The 3 kg not taken must stay visible.',
      run: function (c) {
        var before = q.available('L8');
        c.step('Operations accepts the waiting 30 kg pumpkin request on behalf of the stall.');
        var R = A.decideBulk('BR-1002', true, { actorId: 'u-ops' });
        c.eq('Acceptance creates a 30 kg hold', q.available('L8'), before - 30);
        c.step('At the stall, 27 kg is accepted and 3 kg is rejected with a reason.');
        var out = A.confirmHandover(R.id, { actualQty: 27, reason: '3 kg damaged in handling', actorId: 'u-ops' });
        c.eq('Only accepted weight is recorded', out.transfer.actualQty, 27);
        c.eq('Rejected weight is explicit', out.transfer.rejectedQty, 3);
        c.eq('Value uses 27 kg, not the 30 kg requested', out.transfer.saleValueLkr, 27 * 70);
        c.eq('Pickup is marked partly collected', q.reservation(R.id).state, 'partially-collected');
        c.eq('Rejected food is not deducted from stock', q.available('L8'), 120 - 27);
        c.check('Rejected weight carries the reason', out.transfer.reason.indexOf('damaged') > -1, out.transfer.reason);
      }
    },
    {
      id: 'S04',
      name: 'A donation split across two collections',
      why: 'Organisations often collect in more than one trip; stock must stay correct.',
      run: function (c) {
        c.step('Recipient collects 3 bags of bread ends.');
        var R1 = A.reserve('L2', { qty: 3, actorId: 'u-recipient' });
        A.confirmHandover(R1.id, { actualQty: 3, actorId: 'u-vendor1' });
        c.step('The same organisation returns for 4 more bags.');
        var R2 = A.reserve('L2', { qty: 4, actorId: 'u-recipient' });
        A.confirmHandover(R2.id, { actualQty: 4, actorId: 'u-vendor1' });
        c.eq('Two independent handovers are stored', transfersFor(R1.id).length + transfersFor(R2.id).length, 2);
        c.eq('7 of 8 bags have left the shelf', 8 - q.available('L2'), 7);
        c.eq('One bag is still available', q.available('L2'), 1);
        c.check('Both donations are zero-rated',
          transfersFor(R1.id).concat(transfersFor(R2.id)).every(function (t) { return t.saleValueLkr === 0 && t.feeLkr === 0; }));
      }
    },
    {
      id: 'S05',
      name: 'Race for the last bags',
      why: 'Two collectors want more than remains. The second must be refused, never oversold.',
      run: function (c) {
        c.step('Ruwan holds 6 of the 8 bread-end bags.');
        A.reserve('L2', { qty: 6, actorId: 'u-recipient' });
        c.throws('A larger competing request is refused', 'NO_STOCK', function () {
          A.reserve('L2', { qty: 3, actorId: 'u-recipient2' });
        });
        c.step('A second recipient takes the remaining 2 bags.');
        var R2 = A.reserve('L2', { qty: 2, actorId: 'u-recipient2' });
        c.eq('Remainder goes to the second collector', R2.qty, 2);
        c.eq('Every bag is held exactly once', q.openQty('L2'), 8);
        c.eq('Nothing is left', q.available('L2'), 0);
        c.throws('No further hold can be created', 'NO_STOCK', function () {
          A.reserve('L2', { qty: 1, actorId: 'u-recipient2' });
        });
        c.check('Stock invariant still holds', store.invariants().every(function (x) { return x.ok; }));
      }
    },
    {
      id: 'S06',
      name: 'Duplicate scan of the same pass',
      why: 'A double tap at the counter must not record two handovers or two sales.',
      run: function (c) {
        var R = A.reserve('L5', { qty: 1, actorId: 'u-buyer' });
        c.step('The canteen scans the pass and records a 1-pack handover.');
        var first = A.confirmHandover(R.id, { actualQty: 1, actorId: 'u-vendor3', idempotencyKey: 'scan-once' });
        c.step('The same pass is scanned again (same idempotency key).');
        var second = A.confirmHandover(R.id, { actualQty: 1, actorId: 'u-vendor3', idempotencyKey: 'scan-once' });
        c.check('Second scan is reported as a retry', second.idempotent === true, 'idempotent=' + second.idempotent);
        c.eq('It returns the original transfer', second.transfer.id, first.transfer.id);
        c.eq('Only one transfer is stored', transfersFor(R.id).length, 1);
        c.eq('Collected quantity is counted once', q.collectedQty('L5'), 1);
      }
    },
    {
      id: 'S07',
      name: 'A hold expires after 30 minutes',
      why: 'Uncollected holds must return to the pool without anyone intervening.',
      run: function (c) {
        c.eq('Nimali starts holding 2 pastry boxes', q.reservation('R-1002').state, 'reserved');
        c.step('Advance the simulated clock by 75 minutes.');
        A.advance(75);
        var R = q.reservation('R-1002');
        c.eq('The hold is expired', R.state, 'expired');
        c.check('Reason names the hold window', /30 minutes/.test(R.reason || ''), R.reason);
        c.eq('All 6 boxes are available again', q.available('L1'), 6);
        c.eq('The listing itself stays open until its cutoff', q.listing('L1').state, 'active');
      }
    },
    {
      id: 'S08',
      name: 'Collector cancels a hold',
      why: 'Cancelling must release stock immediately and leave a reason in the audit trail.',
      run: function (c) {
        c.step('The recipient cancels an 8 kg greens hold.');
        A.cancelReservation('R-1001', { actorId: 'u-recipient', reason: 'Cannot reach the stall today' });
        c.eq('Pickup is cancelled', q.reservation('R-1001').state, 'cancelled');
        c.eq('All 40 kg return to available', q.available('L4'), 40);
        c.eq('No handover record was created', transfersFor('R-1001').length, 0);
        c.check('Audit trail records the cancellation',
          store.get().audit.some(function (a) { return a.action === 'reservation.cancelled' && a.resource === 'R-1001'; }));
        c.check('Reason is kept', /stall/.test(q.reservation('R-1001').reason || ''), q.reservation('R-1001').reason);
      }
    },
    {
      id: 'S09',
      name: 'Vendor withdraws an offer',
      why: 'A vendor may pull food, but open collectors must be cancelled and told why.',
      run: function (c) {
        c.step('Sunrise Bakery withdraws the pastry listing while one pickup is open.');
        var out = A.withdrawListing('L1', { actorId: 'u-vendor1', reason: 'Kitchen closed early' });
        c.eq('Listing is withdrawn', q.listing('L1').state, 'withdrawn');
        c.eq('Open pickup is cancelled by the vendor', q.reservation('R-1002').state, 'vendor-cancelled');
        c.eq('One pickup was cancelled', out.cancelled, 1);
        c.eq('Stock is released', q.available('L1'), 6);
        c.throws('No new hold on a withdrawn offer', 'NOT_ACTIVE', function () {
          A.reserve('L1', { qty: 1, actorId: 'u-buyer' });
        });
      }
    },
    {
      id: 'S10',
      name: 'Collector rejects at the counter',
      why: 'If the food does not match the listing, the collector can refuse and stock returns.',
      run: function (c) {
        c.step('Nimali rejects the pastry boxes at collection: stale.');
        A.rejectAtHandover('R-1002', { actorId: 'u-buyer', reason: 'Pastries were stale' });
        c.eq('Pickup is marked rejected', q.reservation('R-1002').state, 'rejected');
        c.eq('No sale is recorded', transfersFor('R-1002').length, 0);
        c.eq('Stock is back to 6 boxes', q.available('L1'), 6);
        c.check('Reason is attached', /stale/.test(q.reservation('R-1002').reason || ''), q.reservation('R-1002').reason);
      }
    },
    {
      id: 'S11',
      name: 'No-show at the end of the window',
      why: 'An uncollected pass must not sit in the system as if the food was taken.',
      run: function (c) {
        c.step('Advance the clock past the pastry collection window (19:30) but before its cutoff (19:45).');
        A.advance(220);
        var R = q.reservation('R-1002');
        c.eq('Pickup is marked no-show', R.state, 'no-show');
        c.check('Reason names the window', /Collection window/.test(R.reason || ''), R.reason);
        c.eq('Stock returns to the shelf', q.available('L1'), 6);
        c.eq('Listing is still open at 19:40', q.listing('L1').state, 'active');
        c.step('Advance another 10 minutes.');
        A.advance(10);
        c.eq('At the cutoff the listing closes', q.listing('L1').state, 'closed');
      }
    },
    {
      id: 'S12',
      name: 'Donation policy gate and vendor approval',
      why: 'Proposed rules must be enforced in the model, not just hidden in the UI.',
      run: function (c) {
        c.step('An individual buyer tries to reserve a free donation.');
        c.throws('Individuals are refused under the proposed policy', 'POLICY_DONATION', function () {
          A.reserve('L2', { qty: 1, actorId: 'u-buyer' });
        });
        c.step('A recipient organisation tries the same thing.');
        var R = A.reserve('L2', { qty: 1, actorId: 'u-recipient' });
        c.eq('Recipient reservation succeeds', R.mode, 'donation');
        c.step('Operations tries to publish for an unapproved vendor.');
        A.setActor('u-ops');
        c.throws('Unapproved vendor cannot publish', 'NOT_APPROVED', function () {
          A.publishListing(draftFor('v4'));
        });
        var errs = A.validateDraft({
          orgId: 'v4', stream: 'retail', mode: 'sale', categoryId: 'cat-bakery',
          title: 'Test', unit: 'tray', totalQty: 2, priceLkr: 100,
          pickupFrom: new Date(q.now() + 3600000).toISOString(),
          pickupTo: new Date(q.now() + 7200000).toISOString(),
          cutoff: new Date(q.now() + 9000000).toISOString(),
          extra: {}
        });
        c.check('Draft validation names the missing safety fields',
          errs.length >= 3 && errs.some(function (e) { return /requires/.test(e.msg); }),
          errs.map(function (e) { return e.msg; }).join(' | '));
        c.step('Operations approves the bakery, then publishes.');
        A.approveOrg('v4', { actorId: 'u-ops' });
        var L = A.publishListing(draftFor('v4'));
        c.eq('Published offer goes live', L.state, 'active');
        c.eq('It is visible to the model', q.listing(L.id).title, 'Test shortbread tray');
      }
    },
    {
      id: 'S13',
      name: 'Cross-organisation actions are refused',
      why: 'Hiding a button is not security. The model must refuse the call itself.',
      run: function (c) {
        c.throws('Another vendor cannot record this handover', 'FORBIDDEN', function () {
          A.confirmHandover('R-1001', { actualQty: 8, actorId: 'u-vendor1' });
        });
        c.throws('Another vendor cannot withdraw this lot', 'FORBIDDEN', function () {
          A.withdrawListing('L3', { actorId: 'u-vendor1' });
        });
        c.throws('A buyer cannot publish', 'FORBIDDEN', function () {
          A.publishListing(draftFor('v1'));
        });
        c.throws('A stranger cannot cancel someone else’s hold', 'FORBIDDEN', function () {
          A.cancelReservation('R-1001', { actorId: 'u-buyer' });
        });
        c.check('Nothing changed after the refused calls',
          q.reservation('R-1001').state === 'reserved' && q.listing('L3').state === 'active');
      }
    },
    {
      id: 'S14',
      name: 'Price change needs re-agreement',
      why: 'A supplier cannot silently raise the price on a hold that already exists.',
      run: function (c) {
        c.step('Sunrise Bakery raises the pastry price from LKR 250 to 300.');
        var out = A.changePrice('L1', 300, { actorId: 'u-vendor1' });
        c.eq('The open hold is flagged', out.affected, 1);
        c.eq('Collector must accept new terms', q.reservation('R-1002').needsAck, true);
        c.throws('Handover is blocked until then', 'TERMS_CHANGED', function () {
          A.confirmHandover('R-1002', { actualQty: 2, actorId: 'u-vendor1' });
        });
        c.step('Nimali accepts the new price.');
        A.acknowledgeChange('R-1002', { actorId: 'u-buyer' });
        c.eq('New total is applied to the hold', q.reservation('R-1002').priceLkr, 600);
        var done = A.confirmHandover('R-1002', { actualQty: 2, actorId: 'u-vendor1' });
        c.eq('Handover uses the agreed price', done.transfer.saleValueLkr, 600);
        c.eq('Re-agreement clears the flag', q.reservation('R-1002').needsAck, false);
      }
    },
    {
      id: 'S15',
      name: 'Offline redemption is refused',
      why: 'A pass that cannot be checked must not be honoured, or stock and money drift.',
      run: function (c) {
        var transfersBefore = store.get().transfers.length;
        A.setOnline(false);
        c.step('With the simulated connection off, a buyer tries to reserve.');
        c.throws('Reservation needs a connection', 'OFFLINE', function () {
          A.reserve('L5', { qty: 1, actorId: 'u-buyer' });
        });
        c.step('The bakery tries to redeem an existing pass.');
        c.throws('Handover needs a connection', 'OFFLINE', function () {
          A.confirmHandover('R-1002', { actualQty: 2, actorId: 'u-vendor1' });
        });
        c.eq('Nothing was written while offline', store.get().transfers.length, transfersBefore);
        c.step('Connection is restored and the same handover is retried.');
        A.setOnline(true);
        var out = A.confirmHandover('R-1002', { actualQty: 2, actorId: 'u-vendor1' });
        c.check('It succeeds online', out.transfer.actualQty === 2);
      }
    },
    {
      id: 'S16',
      name: 'Donation allocation when demand exceeds supply',
      why: 'With a first-eligible rule, the remainder is offered to the next organisation, with no queue-jumping.',
      run: function (c) {
        c.step('Sneha Kitchen holds 6 of 8 bread-end bags.');
        A.reserve('L2', { qty: 6, actorId: 'u-recipient' });
        c.throws('The welfare home cannot take 4', 'NO_STOCK', function () {
          A.reserve('L2', { qty: 4, actorId: 'u-recipient2' });
        });
        c.step('The welfare home takes the remaining 2 bags.');
        var R2 = A.reserve('L2', { qty: 2, actorId: 'u-recipient2' });
        c.eq('Remainder is allocated, not queued', R2.qty, 2);
        c.eq('Total held equals total listed', q.openQty('L2'), 8);
        c.throws('A third request is refused', 'NO_STOCK', function () {
          A.reserve('L2', { qty: 1, actorId: 'u-recipient2' });
        });
        c.step('Advance past the 30-minute hold window.');
        A.advance(60);
        c.eq('Expired holds release supply', q.available('L2'), 8);
        c.eq('Rule is documented in the model', store.get().policies.allocationRule, 'first-eligible');
      }
    },
    {
      id: 'S17',
      name: 'Incident holds a listing until reinstated',
      why: 'Safety reports must stop handovers immediately, and only ops can reopen.',
      run: function (c) {
        c.step('The stall reports a temperature incident on the greens lot.');
        var I = A.reportIncident({
          listingId: 'L4', category: 'temperature', severity: 'high',
          note: 'Fridge log missing for 20 minutes', actorId: 'u-vendor2'
        });
        c.eq('Listing is held immediately', q.listing('L4').state, 'suspended');
        c.eq('Incident is open', I.state, 'open');
        c.throws('Handover is blocked while held', 'LOT_HELD', function () {
          A.confirmHandover('R-1001', { actualQty: 8, actorId: 'u-vendor2' });
        });
        c.step('Operations resolves the incident.');
        A.setActor('u-ops');
        A.resolveIncident(I.id);
        c.eq('Incident is resolved', store.get().incidents.filter(function (x) { return x.id === I.id; })[0].state, 'resolved');
        c.throws('Resolving alone does not reopen the listing', 'LOT_HELD', function () {
          A.confirmHandover('R-1001', { actualQty: 8, actorId: 'u-vendor2' });
        });
        c.step('Operations reinstates the listing.');
        A.reinstateListing('L4', { actorId: 'u-ops' });
        var out = A.confirmHandover('R-1001', { actualQty: 8, actorId: 'u-vendor2' });
        c.eq('Handover now succeeds', q.reservation('R-1001').state, 'collected');
        c.eq('Donation stays zero-rated after the incident', out.transfer.feeLkr, 0);
      }
    },
    {
      id: 'S18',
      name: 'Metrics never double-count or mix units',
      why: 'A dashboard is only useful if holds, scans and kilograms land in the right ledger.',
      run: function (c) {
        var m0 = met();
        c.step('One paid retail trade and one donation trade are completed.');
        var R1 = A.reserve('L5', { qty: 2, actorId: 'u-buyer' });
        var mh = met();
        c.eq('An open hold is not revenue', mh.saleValue - m0.saleValue, 0);
        A.confirmHandover(R1.id, { actualQty: 2, actorId: 'u-vendor3' });
        var R2 = A.reserve('L2', { qty: 3, actorId: 'u-recipient' });
        A.confirmHandover(R2.id, { actualQty: 3, actorId: 'u-vendor1' });
        var m1 = met();
        c.eq('Sale value rises by the handover only', m1.saleValue - m0.saleValue, 360);
        c.eq('Portions count sale and donation units', m1.retailUnits - m0.retailUnits, 5);
        c.eq('Donation portions are tracked separately', m1.donationUnits - m0.donationUnits, 3);
        c.eq('Weight is untouched by portion trades', m1.wholesaleKg - m0.wholesaleKg, 0);
        c.eq('Fees stay at zero', m1.fee - m0.fee, 0);
        c.step('A 27 kg wholesale handover is added.');
        var RB = A.decideBulk('BR-1002', true, { actorId: 'u-ops' });
        A.confirmHandover(RB.id, { actualQty: 27, reason: '3 kg damaged', actorId: 'u-ops' });
        var m2 = met();
        c.eq('Weight rises by the accepted 27 kg', m2.wholesaleKg - m1.wholesaleKg, 27);
        c.eq('Weight is not added to portions', m2.retailUnits - m1.retailUnits, 0);
        c.eq('Three transfers were added, not four', m2.transfers - m0.transfers, 3);
        c.check('Every invariant still passes',
          store.invariants().every(function (x) { return x.ok; }),
          store.invariants().filter(function (x) { return !x.ok; }).map(function (x) { return x.label; }).join('; '));
      }
    }
  ];

  /* ----------------------------------------------------------------- runner */

  function byId(id) {
    return list.filter(function (x) { return x.id === id; })[0] || null;
  }

  function execute(def, out) {
    try {
      def.run(makeCtx(out));
    } catch (e) {
      out.checks.push({
        label: 'Scenario ran to completion',
        ok: false,
        detail: (e && e.message ? e.message : String(e)) + (e && e.code ? ' (' + e.code + ')' : '')
      });
    }
    out.pass = out.checks.length > 0 && out.checks.every(function (x) { return x.ok; });
  }

  function emptyResult(def) {
    return { id: def.id, name: def.name, pass: false, steps: [], checks: [], at: new Date().toISOString() };
  }

  function restore(snapshotJson, results) {
    var restored = JSON.parse(snapshotJson);
    restored.ui = restored.ui || {};
    restored.ui.lab = restored.ui.lab || {};
    restored.ui.lab.results = Object.assign(restored.ui.lab.results || {}, results);
    restored.ui.lab.lastRun = new Date().toISOString();
    store.hydrate(restored);
  }

  function runOne(id) {
    A = AL.actions; q = AL.q; store = AL.store;
    var def = byId(id);
    if (!def) return null;
    var snapshot = JSON.stringify(store.get());
    var out = emptyResult(def);
    store.mute(function () {
      store.hydrate(AL.seed());
      execute(def, out);
    });
    var results = {};
    results[def.id] = out;
    restore(snapshot, results);
    return out;
  }

  function runAll() {
    A = AL.actions; q = AL.q; store = AL.store;
    var snapshot = JSON.stringify(store.get());
    var results = {};
    store.mute(function () {
      list.forEach(function (def) {
        store.hydrate(AL.seed());
        var out = emptyResult(def);
        execute(def, out);
        results[def.id] = out;
      });
    });
    restore(snapshot, results);
    return results;
  }

  AL.scenarios = {
    list: list,
    byId: byId,
    runOne: runOne,
    runAll: runAll
  };
})(window.AL);
