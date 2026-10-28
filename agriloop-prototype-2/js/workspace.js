/* =============================================================================
   AgriLoop Prototype 2 — supplier workspace + operations dashboard
   ========================================================================== */
window.AL = window.AL || {};

(function (AL) {
  'use strict';

  var u = AL.util;
  function S() { return AL.store.get(); }
  function Q() { return AL.q; }
  function esc(v) { return u.esc(v); }
  var v = AL.v;

  /* ------------------------------------------------------------ draft form */

  function toLocalInput(iso) {
    var d = new Date(u.t(iso) + 330 * 60000);
    return d.toISOString().slice(0, 16);
  }
  function fromLocalInput(str) {
    return str ? new Date(str + ':00.000+05:30').toISOString() : null;
  }

  function defaultDraft(a) {
    var now = Q().now();
    return {
      actorId: a.id,
      orgId: a.role === 'merchantAdmin' ? a.orgId : 'v1',
      stream: 'retail',
      mode: 'sale',
      categoryId: 'cat-bakery',
      title: '',
      desc: '',
      unit: 'box',
      totalQty: 6,
      priceLkr: 250,
      minQty: 10,
      pickupFrom: toLocalInput(new Date(now + 90 * 60000).toISOString()),
      pickupTo: toLocalInput(new Date(now + 240 * 60000).toISOString()),
      cutoff: toLocalInput(new Date(now + 255 * 60000).toISOString()),
      extra: {}
    };
  }

  function draft() {
    var s = S(), a = Q().actor();
    if (!s.ui.draft || s.ui.draft.actorId !== a.id) s.ui.draft = defaultDraft(a);
    return s.ui.draft;
  }

  function draftPayload(d) {
    return {
      orgId: d.orgId,
      stream: d.stream,
      mode: d.mode,
      categoryId: d.categoryId,
      title: d.title,
      desc: d.desc,
      unit: d.unit,
      totalQty: Number(d.totalQty),
      priceLkr: d.mode === 'donation' ? 0 : Number(d.priceLkr),
      minQty: Number(d.minQty || 1),
      pickupFrom: fromLocalInput(d.pickupFrom),
      pickupTo: fromLocalInput(d.pickupTo),
      cutoff: fromLocalInput(d.cutoff),
      lotId: d.lotId || null,
      extra: d.extra || {}
    };
  }

  function composer(a, org) {
    var s = S(), d = draft();
    var cat = Q().category(d.categoryId) || s.categories[0];
    var errs = s.ui.draftErrors || [];
    var lots = s.lots.filter(function (l) { return l.orgId === d.orgId; });

    if (a.role === 'ops') {
      var approved = s.orgs.filter(function (o) { return o.type === 'merchant' && o.approved; });
      var orgField = '<div class="field"><label for="dOrg">Publishing as</label>' +
        '<select class="select" id="dOrg" data-draft="orgId">' + approved.map(function (o) {
          return '<option value="' + o.id + '"' + (d.orgId === o.id ? ' selected' : '') + '>' + esc(o.name) + '</option>';
        }).join('') + '</select></div>';
    } else {
      var orgField = '<input type="hidden" data-draft="orgId" value="' + esc(d.orgId) + '">';
    }

    var extraFields = cat.required.map(function (f) {
      var val = (d.extra || {})[f.key] || '';
      return '<div class="field"><label for="dx-' + f.key + '">' + esc(f.label) + '</label>' +
        '<input class="input" id="dx-' + f.key + '" data-draft="extra.' + f.key + '" value="' + esc(val) + '"' +
        ' placeholder="' + esc(f.example || '') + '"></div>';
    }).join('');

    return '<section class="card" data-tour="composer">' +
      '<div class="card__head"><div><h2 class="card__title">Publish surplus</h2>' +
      '<p class="card__sub">A new offer appears on Discover immediately.</p></div>' +
      AL.ui.chip(cat.name + ' ' + cat.version, 'neutral', true) + '</div>' +
      (errs.length ? '<div class="notice" data-tone="danger" style="margin-bottom:12px">' + AL.ui.icon('alert') +
        '<div><strong>Not published yet.</strong><ul style="margin:6px 0 0;padding-left:18px">' +
        errs.map(function (e) { return '<li>' + esc(e.msg) + '</li>'; }).join('') + '</ul></div></div>' : '') +
      '<div class="stack-sm">' + orgField +
      '<div class="field"><label for="dTitle">Title</label>' +
      '<input class="input" id="dTitle" data-draft="title" value="' + esc(d.title) + '" placeholder="e.g. Evening pastry box" maxlength="80"></div>' +
      '<div class="field"><label for="dDesc">Description</label>' +
      '<textarea class="textarea" id="dDesc" data-draft="desc" placeholder="What is it, and what should the collector know?">' + esc(d.desc) + '</textarea></div>' +
      '<div class="row" style="gap:10px;align-items:flex-start">' +
      '<div class="field" style="flex:1"><label for="dStream">Stream</label>' +
      '<select class="select" id="dStream" data-draft="stream">' +
      '<option value="retail"' + (d.stream === 'retail' ? ' selected' : '') + '>Retail</option>' +
      '<option value="wholesale"' + (d.stream === 'wholesale' ? ' selected' : '') + '>Wholesale</option></select></div>' +
      '<div class="field" style="flex:1"><label for="dMode">Mode</label>' +
      '<select class="select" id="dMode" data-draft="mode">' +
      '<option value="sale"' + (d.mode === 'sale' ? ' selected' : '') + '>Sale</option>' +
      '<option value="donation"' + (d.mode === 'donation' ? ' selected' : '') + '>Free donation</option></select></div>' +
      '</div>' +
      '<div class="field"><label for="dCat">Food category</label>' +
      '<select class="select" id="dCat" data-draft="categoryId">' + s.categories.map(function (c) {
        return '<option value="' + c.id + '"' + (d.categoryId === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>';
      }).join('') + '</select><p class="hint">' + esc(cat.rule) + '</p></div>' +
      '<div class="row" style="gap:10px;align-items:flex-start">' +
      '<div class="field" style="flex:1"><label for="dQty">Quantity</label>' +
      '<input class="input" id="dQty" data-draft="totalQty" type="number" min="1" step="1" value="' + d.totalQty + '"></div>' +
      '<div class="field" style="flex:1"><label for="dUnit">Unit</label>' +
      '<select class="select" id="dUnit" data-draft="unit">' + ['box', 'bag', 'pack', 'tray', 'kg'].map(function (x) {
        return '<option value="' + x + '"' + (d.unit === x ? ' selected' : '') + '>' + x + '</option>';
      }).join('') + '</select></div>' +
      (d.mode === 'sale'
        ? '<div class="field" style="flex:1"><label for="dPrice">Price / unit (LKR)</label>' +
          '<input class="input" id="dPrice" data-draft="priceLkr" type="number" min="1" step="10" value="' + d.priceLkr + '"></div>'
        : '') +
      '</div>' +
      (d.stream === 'wholesale'
        ? '<div class="field"><label for="dMin">Minimum order</label>' +
          '<input class="input" id="dMin" data-draft="minQty" type="number" min="1" step="1" value="' + d.minQty + '"></div>'
        : '') +
      (d.mode === 'donation'
        ? '<div class="notice" data-tone="info">' + AL.ui.icon('heart') +
          '<div>Donations are free by rule: price is forced to zero and the platform fee is zero.</div></div>'
        : '') +
      (lots.length ? '<div class="field"><label for="dLot">Traceable lot (optional)</label>' +
        '<select class="select" id="dLot" data-draft="lotId"><option value="">No lot</option>' + lots.map(function (l) {
          return '<option value="' + l.id + '"' + (d.lotId === l.id ? ' selected' : '') + '>' +
            esc(l.id + ' · ' + l.commodity + ' · ' + u.qty(l.measuredKg, 'kg')) + '</option>';
        }).join('') + '</select></div>' : '') +
      '<div class="row" style="gap:10px;align-items:flex-start">' +
      '<div class="field" style="flex:1"><label for="dFrom">Collection from</label>' +
      '<input class="input" id="dFrom" data-draft="pickupFrom" type="datetime-local" value="' + d.pickupFrom + '"></div>' +
      '<div class="field" style="flex:1"><label for="dTo">Collection to</label>' +
      '<input class="input" id="dTo" data-draft="pickupTo" type="datetime-local" value="' + d.pickupTo + '"></div>' +
      '</div>' +
      '<div class="field"><label for="dCut">Food-eligibility cutoff</label>' +
      '<input class="input" id="dCut" data-draft="cutoff" type="datetime-local" value="' + d.cutoff + '">' +
      '<p class="hint">Must not be earlier than the collection window ends. Sri Lanka time.</p></div>' +
      '<div class="hr"></div>' +
      '<p class="tag-label">Food safety fields for this category</p>' + extraFields +
      '<div class="hr"></div>' +
      '<button class="btn btn-primary btn-block" type="button" data-act="publish">' + AL.ui.icon('plus') + ' Publish offer</button>' +
      '<p class="hint">Runs the same validation as the server model: required fields, positive quantity, free donations at zero, and a cutoff after collection.</p>' +
      '</div></section>';
  }

  /* ------------------------------------------------------------- workspace */

  function workspace() {
    var s = S(), a = Q().actor(), org = Q().org(a.orgId);
    var supplierSide = a.role === 'merchantAdmin' || a.role === 'ops';

    if (!supplierSide) {
      return v.head({
        eyebrow: 'Workspace · ' + esc(a.name),
        title: 'The supplier side',
        lede: 'You are acting as a collector, so this screen is a read-only preview. Switch to a vendor or the operations desk to publish, decide requests and record handovers.',
        actions: '<button class="btn btn-primary" type="button" data-act="switch-actor" data-user="u-vendor1">Act as Sunrise Bakery</button>' +
          '<button class="btn" type="button" data-act="switch-actor" data-user="u-ops">Act as operations</button>'
      }) +
        '<div class="split"><div class="stack">' +
        v.card('What a vendor sees', 'Same data, different permissions',
          '<div class="list">' + s.listings.filter(function (l) { return l.state !== 'draft'; }).slice(0, 6).map(function (L) {
            return v.listingRow(L);
          }).join('') + '</div>') +
        v.notice('neutral', 'Why permissions matter.',
          'A vendor can only publish for their own approved organisation, and can only record handovers on their own offers. The UI hides the buttons, and the model refuses the action even if the button is forced.') +
        '</div><div class="stack">' + v.roleCard() + '</div></div>';
    }

    var listings = s.listings.filter(function (L) {
      return Q().isOps(a) || L.orgId === a.orgId;
    });
    var mineIds = {};
    listings.forEach(function (L) { mineIds[L.id] = true; });
    var openIncoming = s.reservations.filter(function (R) {
      return R.state === 'reserved' && mineIds[R.listingId];
    }).sort(function (x, y) { return u.t(x.expiresAt) - u.t(y.expiresAt); });
    var requests = s.bulkRequests.filter(function (B) {
      var L = Q().listing(B.listingId);
      return L && (Q().isOps(a) || L.orgId === a.orgId);
    });
    var pendingReqs = requests.filter(function (B) { return B.state === 'requested'; });
    var incidents = s.incidents.filter(function (I) {
      var L = Q().listing(I.listingId);
      return Q().isOps(a) || (L && L.orgId === a.orgId);
    });
    var openIncidents = incidents.filter(function (I) { return I.state === 'open'; });
    var suspended = listings.filter(function (L) { return L.state === 'suspended'; });

    var stats = '<div class="grid cols-4" style="margin:18px 0 8px">' +
      v.stat('Live offers', String(listings.filter(function (L) { return L.state === 'active'; }).length), '', listings.length + ' total, including history') +
      v.stat('Open pickups', String(openIncoming.length), '', 'Waiting for a handover') +
      v.stat('Requests waiting', String(pendingReqs.length), '', pendingReqs.length ? 'Need a decision' : 'Nothing waiting') +
      v.stat('Open incidents', String(openIncidents.length), '', suspended.length ? suspended.length + ' listing(s) on hold' : 'No listings on hold') +
      '</div>';

    var approval = '';
    if (a.role === 'merchantAdmin' && !org.approved) {
      approval = v.notice('warn', 'Your organisation is not approved.',
        'You can prepare a draft, but publishing is blocked until operations approves ' + esc(org.name) + '.');
    }

    var pendingOrgs = s.orgs.filter(function (o) { return o.type === 'merchant' && !o.approved; });
    var approvalsCard = (Q().isOps(a) && pendingOrgs.length)
      ? v.card('Vendor approvals', 'Operations only',
        '<div class="list">' + pendingOrgs.map(function (o) {
          return '<div class="list__row"><div class="list__main"><p class="list__title">' + esc(o.name) + '</p>' +
            '<p class="list__sub">' + esc(o.stream) + ' · ' + esc(o.area) + ' · ' + esc(o.contact) + '</p></div>' +
            '<div class="list__end"><button class="btn btn-sm btn-primary" type="button" data-act="approve-org" data-id="' + o.id + '">Approve</button></div></div>';
        }).join('') + '</div>')
      : '';

    var reqCard = v.card('Bulk requests',
      Q().isOps(a) ? 'Every stall, newest first' : 'Requests for your lots',
      requests.length
        ? '<div class="list">' + requests.slice(0, 8).map(function (B) {
          var L = Q().listing(B.listingId), buyer = Q().org(B.orgId);
          return '<div class="list__row"><div class="list__main">' +
            '<p class="list__title">' + esc(B.id) + ' · ' + esc(u.qty(B.qty, B.unit)) + ' · ' + esc(L.title) + '</p>' +
            '<p class="list__sub">' + esc(buyer.name) + ' · ' + esc(u.rel(B.createdAt, s.clock)) +
            (B.reason ? ' · ' + esc(B.reason) : '') + '</p></div>' +
            '<div class="list__end">' + AL.ui.stateChip(B.state) +
            (B.state === 'requested'
              ? '<button class="btn btn-sm btn-primary" type="button" data-act="accept-bulk" data-id="' + B.id + '">Accept</button>' +
                '<button class="btn btn-sm" type="button" data-act="decline-open" data-id="' + B.id + '">Decline</button>'
              : '') +
            '</div></div>';
        }).join('') + '</div>'
        : '<p class="tiny">No bulk requests yet. They arrive from wholesale lots on Discover.</p>');

    var incomingCard = v.card('Incoming pickups', 'Record what was actually accepted',
      openIncoming.length
        ? '<div class="list">' + openIncoming.map(function (R) {
          var L = Q().listing(R.listingId), buyer = Q().user(R.buyerUserId);
          return '<div class="list__row"><div class="list__main">' +
            '<p class="list__title">' + esc(R.ref) + ' · ' + esc(u.qty(R.qty, R.unit)) + ' · ' + esc(L.title) + '</p>' +
            '<p class="list__sub">' + esc(buyer ? buyer.name : 'Collector') + ' · window ' + esc(u.fmtTime(L.pickupFrom)) + '–' + esc(u.fmtTime(L.pickupTo)) +
            ' · ' + esc(u.rel(R.expiresAt, s.clock)) + '</p></div>' +
            '<div class="list__end">' + AL.ui.stateChip(R.state) +
            '<button class="btn btn-sm btn-primary" type="button" data-act="handover-open" data-id="' + R.id + '">Handover</button></div></div>';
        }).join('') + '</div>'
        : '<p class="tiny">No open pickups. Reserve something from Discover to see one arrive.</p>');

    var listCard = v.card('Listings', listings.length + ' records, including closed and draft',
      '<div class="table--scroll"><table class="table">' +
      '<thead><tr><th>Offer</th><th>Stream / mode</th><th>Avail.</th><th>Held</th><th>Collected</th><th>State</th><th></th></tr></thead><tbody>' +
      listings.slice().sort(function (x, y) { return u.t(y.createdAt) - u.t(x.createdAt); }).map(function (L) {
        return '<tr><td><a href="#/listing/' + L.id + '" data-nav="#/listing/' + L.id + '">' + esc(L.title) + '</a>' +
          '<div class="tiny">' + esc(L.id) + ' · ' + esc(u.qty(L.totalQty, L.unit)) + ' listed</div></td>' +
          '<td>' + AL.ui.modeBadge(L.mode) + ' ' + AL.ui.streamBadge(L.stream) + '</td>' +
          '<td class="num">' + esc(u.qty(Q().available(L.id), L.unit)) + '</td>' +
          '<td class="num">' + esc(u.qty(Q().openQty(L.id), L.unit)) + '</td>' +
          '<td class="num">' + esc(u.qty(Q().collectedQty(L.id), L.unit)) + '</td>' +
          '<td>' + AL.ui.stateChip(L.state) + '</td>' +
          '<td class="nowrap">' +
          (L.mode === 'sale' ? '<button class="btn btn-sm btn-ghost" type="button" data-act="price-open" data-id="' + L.id + '" title="Change price">Price</button>' : '') +
          (L.state === 'active' ? '<button class="btn btn-sm btn-ghost" type="button" data-act="withdraw-open" data-id="' + L.id + '" title="Withdraw">Withdraw</button>' : '') +
          (L.state === 'suspended' ? '<button class="btn btn-sm btn-ghost" type="button" data-act="incident-open" data-id="' + L.id + '">Incident</button>' : '') +
          '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="tiny" style="margin-top:10px">Available is derived from total, open holds and collected records — never typed in, so it cannot drift.</p>');

    var incidentCard = v.card('Incidents', 'A report holds the listing immediately',
      incidents.length
        ? '<div class="list">' + incidents.slice(0, 6).map(function (I) {
          var L = Q().listing(I.listingId);
          return '<div class="list__row"><div class="list__main">' +
            '<p class="list__title">' + esc(I.id) + ' · ' + esc(L ? L.title : I.listingId) + '</p>' +
            '<p class="list__sub">' + esc(I.category) + ' · ' + esc(I.severity) + ' · ' + esc(u.fmtTime(I.at)) +
            (I.note ? ' · ' + esc(I.note) : '') + '</p></div>' +
            '<div class="list__end">' + AL.ui.stateChip(I.state) +
            (I.state === 'open' && Q().isOps(a)
              ? '<button class="btn btn-sm" type="button" data-act="resolve-incident" data-id="' + I.id + '">Resolve</button>' +
                '<button class="btn btn-sm" type="button" data-act="reinstate" data-id="' + I.listingId + '">Reinstate</button>'
              : '') +
            '</div></div>';
        }).join('') + '</div>'
        : '<p class="tiny">No incidents reported.</p>');

    var right = '';
    if (a.role === 'merchantAdmin') {
      right += org.approved
        ? composer(a, org)
        : v.card('Publishing is blocked', 'Approval pending',
          '<p class="tiny">Operations has not approved ' + esc(org.name) + ' yet. The form is disabled on purpose — the model refuses publication too, so bypassing the UI would not help.</p>' +
          '<div class="row" style="margin-top:10px"><button class="btn btn-sm" type="button" data-act="switch-actor" data-user="u-ops">Switch to operations</button></div>');
    } else {
      right += v.card('Operations tools', 'Only the ops role sees these',
        '<div class="stack-sm">' +
        '<button class="btn btn-block" type="button" data-act="seed-rich">Seed completed demo transfers</button>' +
        '<button class="btn btn-block" type="button" data-act="export-json">Export all records (JSON)</button>' +
        '<button class="btn btn-block" type="button" data-act="export-csv">Export transfers (CSV)</button>' +
        '<button class="btn btn-block" type="button" data-act="reset-open">Reset the demo</button>' +
        '</div>' +
        '<p class="hint" style="margin-top:10px">Time machine, connectivity and actor switching are in the top bar.</p>') +
        composer(a, org);
    }

    right += v.card('How this side works', '',
      '<ul style="margin:0;padding-left:18px;font-size:12.5px;color:var(--ink-2)">' +
      '<li style="margin:4px 0">A bulk accept creates a hold only if stock is still there.</li>' +
      '<li style="margin:4px 0">A price change freezes open holds until the collector re-agrees.</li>' +
      '<li style="margin:4px 0">Withdrawing cancels open pickups and keeps the audit record.</li>' +
      '<li style="margin:4px 0">An incident holds the listing and blocks handover.</li>' +
      '</ul>');

    return v.head({
      eyebrow: 'Workspace · ' + (Q().isOps(a) ? 'operations' : esc(org.name)),
      title: Q().isOps(a) ? 'Every listing on the platform' : esc(org.name),
      lede: Q().isOps(a)
        ? 'Operations sees all vendors, approvals, incidents and pending requests. The same guards apply to ops as to a vendor.'
        : 'Publish surplus, decide wholesale requests and record handovers. Stock is derived, so the numbers here are the same ones collectors see.',
      actions: AL.ui.chip(org.approved ? 'Approved vendor' : 'Approval pending', org.approved ? 'ok' : 'warn') +
        AL.ui.chip(openIncoming.length + ' pickup(s) waiting', 'neutral', true) +
        '<button class="btn btn-ghost" type="button" data-act="start-tour">Guided tour</button>'
    }) + approval + stats +
      '<div class="split split--wide"><div class="stack">' +
      approvalsCard + reqCard + incomingCard + listCard + incidentCard +
      '</div><div class="stack">' + right + '</div></div>';
  }

  /* ---------------------------------------------------------------- admin */

  function donut(parts) {
    var total = parts.reduce(function (n, p) { return n + p.value; }, 0);
    var r = 54, c = 2 * Math.PI * r, off = 0;
    var segs = parts.map(function (p) {
      var len = total ? (p.value / total) * c : 0;
      var s = '<circle cx="64" cy="64" r="54" fill="none" stroke="' + p.color + '" stroke-width="18" ' +
        'stroke-dasharray="' + len.toFixed(2) + ' ' + (c - len).toFixed(2) + '" ' +
        'stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 64 64)"></circle>';
      off += len;
      return s;
    }).join('');
    return '<div class="donut"><svg viewBox="0 0 128 128" role="img" aria-label="Sales versus donations">' +
      '<circle cx="64" cy="64" r="54" fill="none" stroke="var(--surface-3)" stroke-width="18"></circle>' + segs +
      (total === 0 ? '<text x="64" y="68" text-anchor="middle" font-size="12" fill="#5e6f66">No data</text>' : '') +
      '</svg><div class="donut__legend">' + parts.map(function (p) {
        return '<span><i style="background:' + p.color + '"></i>' + p.label + '<b>' + p.value + '</b></span>';
      }).join('') + '</div></div>';
  }

  function barChart(rows) {
    var max = Math.max.apply(null, [1].concat(rows.map(function (r) { return r[1]; })));
    return '<div class="chartbars">' + rows.map(function (r) {
      var h = Math.round((r[1] / max) * 72) + 4;
      return '<div class="chartbars__col"><span class="chartbars__val">' + r[1] + '</span>' +
        '<div class="chartbars__bar" data-tone="' + (r[2] || '') + '" style="height:' + h + '%"></div>' +
        '<span class="chartbars__lab">' + r[0] + '</span></div>';
    }).join('') + '</div>';
  }

  function admin() {
    var s = S(), M = AL.store.metrics(), inv = AL.store.invariants();
    var fails = inv.filter(function (x) { return !x.ok; });
    var oc = M.outcomes || {};
    var missed = (oc['no-show'] || 0) + (oc.expired || 0);
    var cancelled = (oc.cancelled || 0) + (oc['vendor-cancelled'] || 0) + (oc.rejected || 0);
    var openIncidents = s.incidents.filter(function (i) { return i.state === 'open'; });
    var suspended = s.listings.filter(function (l) { return l.state === 'suspended'; });
    var noShows = s.reservations.filter(function (R) { return R.state === 'no-show' || R.state === 'expired'; });
    var pending = s.bulkRequests.filter(function (b) { return b.state === 'requested'; });
    var pendingOrgs = s.orgs.filter(function (o) { return o.type === 'merchant' && !o.approved; });

    var stats = '<div class="grid cols-4" style="margin:18px 0 8px" data-tour="metrics">' +
      v.stat('Rescued weight', String(u.round(M.wholesaleKg, 1)), 'kg', 'Wholesale and produce') +
      v.stat('Rescued portions', String(u.round(M.retailUnits, 0)), '', 'Boxes, bags, packs') +
      v.stat('Sale value', String(Math.round(M.saleValue)), 'LKR', 'Simulated, paid on collection') +
      v.stat('Platform fees', String(Math.round(M.fee)), 'LKR', 'Zero by decision — not “free for now”') +
      '</div>' +
      v.notice('info', 'Units are never mixed.',
        'Weight is reported in kilograms and retail food in portions. This dashboard refuses to add 12 kg to 9 boxes and call it “21 rescued”. The earlier prototype did that; this one keeps the two ledgers apart.', 'scale');

    var listingTable = '<div class="table--scroll"><table class="table">' +
      '<thead><tr><th>Offer</th><th>Total</th><th>Held</th><th>Collected</th><th>Available</th><th>State</th></tr></thead><tbody>' +
      s.listings.map(function (L) {
        return '<tr><td><a href="#/listing/' + L.id + '" data-nav="#/listing/' + L.id + '">' + esc(L.title) + '</a>' +
          '<div class="tiny">' + esc(L.id) + ' · ' + esc(Q().org(L.orgId).name) + '</div></td>' +
          '<td class="num">' + esc(u.qty(L.totalQty, L.unit)) + '</td>' +
          '<td class="num">' + esc(u.qty(Q().openQty(L.id), L.unit)) + '</td>' +
          '<td class="num">' + esc(u.qty(Q().collectedQty(L.id), L.unit)) + '</td>' +
          '<td class="num"' + (Q().available(L.id) < 0 ? ' style="color:var(--danger)"' : '') + '>' +
          esc(u.qty(Q().available(L.id), L.unit)) + '</td>' +
          '<td>' + AL.ui.stateChip(L.state) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    var exceptions = [];
    openIncidents.forEach(function (I) {
      var L = Q().listing(I.listingId);
      exceptions.push({
        title: I.id + ' · ' + I.category + ' incident',
        sub: (L ? L.title : I.listingId) + ' · ' + I.severity + ' · ' + u.rel(I.at, s.clock),
        actions: '<button class="btn btn-sm" type="button" data-act="resolve-incident" data-id="' + I.id + '">Resolve</button>' +
          (L && L.state === 'suspended' ? '<button class="btn btn-sm" type="button" data-act="reinstate" data-id="' + L.id + '">Reinstate</button>' : ''),
        tone: 'danger'
      });
    });
    suspended.filter(function (L) { return !openIncidents.some(function (I) { return I.listingId === L.id; }); }).forEach(function (L) {
      exceptions.push({
        title: L.title, sub: 'Listing on hold · ' + (L.suspendedReason || ''), tone: 'warn',
        actions: '<button class="btn btn-sm" type="button" data-act="reinstate" data-id="' + L.id + '">Reinstate</button>'
      });
    });
    if (noShows.length) {
      exceptions.push({
        title: noShows.length + ' expired or missed pickup(s)',
        sub: 'Stock was returned to the pool automatically',
        tone: 'warn',
        actions: '<a class="btn btn-sm" href="#/pickups" data-nav="#/pickups">Open pickups</a>'
      });
    }
    if (pending.length) {
      exceptions.push({
        title: pending.length + ' bulk request(s) awaiting a supplier',
        sub: 'Accepted requests hold stock; declined ones release it',
        tone: 'neutral',
        actions: '<a class="btn btn-sm" href="#/workspace" data-nav="#/workspace">Open workspace</a>'
      });
    }
    if (pendingOrgs.length) {
      exceptions.push({
        title: pendingOrgs.length + ' vendor application(s) pending',
        sub: pendingOrgs.map(function (o) { return o.name; }).join(', '),
        tone: 'neutral',
        actions: '<a class="btn btn-sm" href="#/workspace" data-nav="#/workspace">Review</a>'
      });
    }

    var exceptionCard = v.card('Exceptions', exceptions.length ? exceptions.length + ' open item(s)' : 'Nothing needs attention',
      exceptions.length
        ? '<div class="list">' + exceptions.map(function (x) {
          return '<div class="list__row"><div class="list__main"><p class="list__title">' +
            AL.ui.chip(x.tone === 'danger' ? 'Open' : x.tone === 'warn' ? 'Watch' : 'Info', x.tone === 'neutral' ? 'neutral' : x.tone, true) +
            ' ' + esc(x.title) + '</p><p class="list__sub">' + esc(x.sub) + '</p></div>' +
            '<div class="list__end">' + x.actions + '</div></div>';
        }).join('') + '</div>'
        : '<p class="tiny">No open incidents, held listings or missed pickups. Advance the clock to test expiry.</p>');

    var invariantCard = v.card('Invariants', fails.length ? fails.length + ' failing' : 'All ' + inv.length + ' passing',
      '<div class="stack-sm">' + inv.slice(0, 6).map(function (x) {
        return '<div class="row row--between"><span class="tiny" style="color:var(--ink-2)">' +
          (x.ok ? AL.ui.icon('checkCircle', 14) : AL.ui.icon('xCircle', 14)) + ' ' + esc(x.label) + '</span>' +
          AL.ui.chip(x.ok ? 'pass' : 'fail', x.ok ? 'ok' : 'danger', true) + '</div>';
      }).join('') + '</div>' +
      '<details style="margin-top:10px"><summary class="tiny" style="cursor:pointer">Show all ' + inv.length + ' checks</summary>' +
      '<div class="stack-sm" style="margin-top:8px">' + inv.map(function (x) {
        return '<div class="tiny"><strong>' + (x.ok ? '✓' : '✕') + '</strong> ' + esc(x.label) + ' <span style="color:var(--muted-2)">— ' + esc(x.detail) + '</span></div>';
      }).join('') + '</div></details>');

    var auditCard = v.card('Audit trail', 'Newest first · ' + s.audit.length + ' entries',
      '<div class="list">' + s.audit.slice(0, 10).map(function (A) {
        var who = Q().user(A.actorId);
        return '<div class="list__row"><div class="list__main">' +
          '<p class="list__title mono" style="font-size:12px">' + esc(A.action) + '</p>' +
          '<p class="list__sub">' + esc(who ? who.name : A.actorId) + ' · ' + esc(A.resource) +
          (A.note ? ' · ' + esc(A.note) : '') + '</p></div>' +
          '<div class="list__end"><span class="tiny num">' + esc(u.fmtTime(A.at)) + '</span></div></div>';
      }).join('') + '</div>' +
      '<p class="tiny" style="margin-top:8px">Demo actions write here too, so a rehearsal leaves a trace.</p>');

    var exportCard = v.card('Demo controls', 'Nothing leaves this computer',
      '<div class="grid cols-2">' +
      '<button class="btn" type="button" data-act="export-json">' + AL.ui.icon('download') + ' Export JSON</button>' +
      '<button class="btn" type="button" data-act="export-csv">' + AL.ui.icon('download') + ' Export CSV</button>' +
      '<button class="btn" type="button" data-act="seed-rich">Seed demo transfers</button>' +
      '<button class="btn btn-danger" type="button" data-act="reset-open">Reset demo</button>' +
      '</div>' +
      '<p class="hint" style="margin-top:10px">State persists in <span class="code">localStorage</span> under <span class="code">agriloop_proto_v2</span>. Reset restores the first-run seed.</p>');

    return v.head({
      eyebrow: 'Operations · simulated ledger',
      title: 'Does the loop actually work?',
      lede: 'Every number below is derived from recorded handovers, not from listings or intentions. Holds, misses and incidents are visible on purpose.',
      actions: AL.ui.chip(M.activeListings + ' live offers', 'brand', true) +
        AL.ui.chip(M.openExceptions + ' open exception(s)', M.openExceptions ? 'warn' : 'ok', true) +
        '<button class="btn btn-ghost" type="button" data-act="export-json">' + AL.ui.icon('download') + ' Export</button>'
    }) + stats +
      '<div class="split"><div class="stack">' +
      v.card('Pickup outcomes', 'Counted per reservation, never per scan',
        barChart([
          ['Collected', (oc.collected || 0), 'sale'],
          ['Partly', (oc['partially-collected'] || 0), 'sale'],
          ['Missed', missed, 'donation'],
          ['Cancelled', cancelled, '']
        ]) +
        '<p class="tiny">Collection rate among pickups whose window has closed: <strong>' +
        (M.collectionRate == null ? 'not yet measurable' : u.pct(M.collectionRate)) + '</strong> (' +
        M.completedDue + ' of ' + M.due + ').</p>') +
      v.card('Sales and donations', 'Shared of completed handovers',
        donut([
          { label: 'Sale', value: M.byMode.sale.length, color: '#1a5578' },
          { label: 'Donation', value: M.byMode.donation.length, color: '#84405f' }
        ]) +
        '<div class="hr"></div>' +
        '<div class="kv"><dt>Donated weight</dt><dd>' + esc(u.qty(M.donationKg, 'kg')) + '</dd>' +
        '<dt>Donated portions</dt><dd>' + esc(u.qty(M.donationUnits, 'unit')) + '</dd>' +
        '<dt>Donation fees</dt><dd>' + u.money(M.byMode.donation.reduce(function (n, x) { return n + x.feeLkr; }, 0)) + '</dd></div>') +
      v.card('Stock ledger', 'All listings, including yesterday and drafts', listingTable) +
      '</div><div class="stack">' +
      exceptionCard + invariantCard + auditCard + exportCard +
      '</div></div>';
  }

  AL.v.draft = draft;
  AL.v.draftPayload = draftPayload;
  AL.v.defaultDraft = defaultDraft;
  AL.v.composer = composer;
  AL.v.donut = donut;
  AL.views.workspace = workspace;
  AL.views.admin = admin;
})(window.AL);
