/* =============================================================================
   AgriLoop Prototype 2 — collector-facing views
   home · discover · listing detail · my pickups
   Every screen is a pure function of the store state.
   ========================================================================== */
window.AL = window.AL || {};

(function (AL) {
  'use strict';

  var u = AL.util;

  function S() { return AL.store.get(); }
  function Q() { return AL.q; }
  function esc(v) { return u.esc(v); }

  /* ------------------------------------------------------------------ atoms */

  function dayLabel(iso) { return u.fmtDayTime(iso).split(',')[0]; }

  function windowText(L) {
    var a = dayLabel(L.pickupFrom), b = dayLabel(L.pickupTo);
    return (a === b ? a : a + ' – ' + b) + ' · ' + u.fmtTime(L.pickupFrom) + '–' + u.fmtTime(L.pickupTo);
  }

  function plural(unit) {
    if (unit === 'kg') return 'kilograms';
    if (unit === 'box') return 'boxes';
    return unit + 's';
  }

  function head(o) {
    return '<header class="page"' + (o.tour ? ' data-tour="' + o.tour + '"' : '') + '>' +
      (o.eyebrow ? '<p class="eyebrow">' + o.eyebrow + '</p>' : '') +
      '<h1>' + o.title + '</h1>' +
      (o.lede ? '<p class="lede">' + o.lede + '</p>' : '') +
      (o.actions ? '<div class="page__actions">' + o.actions + '</div>' : '') +
      '</header>';
  }

  function notice(tone, title, body, iconName) {
    return '<div class="notice" data-tone="' + tone + '">' + AL.ui.icon(iconName || 'info') +
      '<div>' + (title ? '<strong>' + title + '</strong> ' : '') + body + '</div></div>';
  }

  function stat(label, value, unit, sub) {
    return '<div class="card card--pad-sm"><div class="stat">' +
      '<span class="stat__label">' + label + '</span>' +
      '<span class="stat__value">' + value + (unit ? ' <small>' + unit + '</small>' : '') + '</span>' +
      (sub ? '<span class="stat__sub">' + sub + '</span>' : '') +
      '</div></div>';
  }

  function card(title, sub, body, extra) {
    return '<section class="card"' + (extra || '') + '>' +
      (title ? '<div class="card__head"><div><h2 class="card__title">' + title + '</h2>' +
        (sub ? '<p class="card__sub">' + sub + '</p>' : '') + '</div></div>' : '') +
      body + '</section>';
  }

  function empty(title, body, action) {
    return '<div class="empty"><h2>' + title + '</h2><p>' + body + '</p>' +
      (action ? '<div class="row" style="justify-content:center;margin-top:12px">' + action + '</div>' : '') + '</div>';
  }

  function steps(items) {
    return '<div class="steps">' + items.map(function (it, i) {
      return '<div class="steps__item"><div class="steps__n">' + (i + 1) + '</div><div>' +
        '<p class="steps__t">' + it[0] + '</p><p class="steps__d">' + it[1] + '</p></div></div>';
    }).join('') + '</div>';
  }

  function offerCard(L) {
    var o = Q().org(L.orgId);
    var avail = Q().available(L.id);
    var buyable = Q().listingIsBuyable(L);
    var free = L.mode === 'donation';
    return '<a class="offer" href="#/listing/' + L.id + '" data-nav="#/listing/' + L.id + '">' +
      '<div class="offer__top"><div>' +
      '<p class="offer__title">' + esc(L.title) + '</p>' +
      '<p class="offer__vendor">' + esc(o.name) + ' · ' + esc(o.area) + '</p>' +
      '</div><div class="row" style="gap:4px;justify-content:flex-end">' +
      AL.ui.modeBadge(L.mode) + AL.ui.streamBadge(L.stream) + '</div></div>' +
      '<p class="offer__desc">' + esc(L.desc) + '</p>' +
      '<div class="offer__meta">' +
      '<span>' + AL.ui.icon('clock', 13) + ' ' + esc(windowText(L)) + '</span>' +
      '<span>' + AL.ui.icon('pin', 13) + ' ' + esc(o.area) + '</span>' +
      (L.stream === 'wholesale' ? '<span>' + AL.ui.icon('scale', 13) + ' Min ' + u.qty(L.minQty, L.unit) + '</span>' : '') +
      '</div>' +
      AL.ui.meter(avail, L.totalQty) +
      '<div class="offer__foot"><div>' +
      '<p class="price' + (free ? ' price--free' : '') + '">' + (free ? 'Free' : u.money(L.priceLkr)) +
      (free ? '' : '<small> / ' + esc(L.unit) + '</small>') + '</p>' +
      '<p class="tiny">' + esc(u.qty(avail, L.unit)) + ' available of ' + esc(u.qty(L.totalQty, L.unit)) + '</p>' +
      '</div>' +
      '<span class="chip chip--plain" data-tone="' + (buyable ? 'brand' : 'neutral') + '">' +
      (buyable ? 'View &amp; reserve' : 'Not open') + ' ' + (buyable ? AL.ui.icon('arrow', 13) : '') + '</span>' +
      '</div></a>';
  }

  function listingRow(L, opts) {
    opts = opts || {};
    var avail = Q().available(L.id);
    return '<div class="list__row">' +
      '<div class="list__main">' +
      '<a class="list__title" href="#/listing/' + L.id + '" data-nav="#/listing/' + L.id + '">' + esc(L.title) + '</a>' +
      '<p class="list__sub">' + esc(u.qty(avail, L.unit)) + ' free · ' + esc(u.qty(Q().openQty(L.id), L.unit)) + ' held · ' +
      esc(u.qty(Q().collectedQty(L.id), L.unit)) + ' collected</p>' +
      '</div>' +
      '<div class="list__end">' + AL.ui.modeBadge(L.mode) + AL.ui.stateChip(L.state) + (opts.end || '') + '</div>' +
      '</div>';
  }

  /* ------------------------------------------------------------- role bits */

  var ROLE_LABEL = {
    buyer: 'Individual buyer',
    recipient: 'Recipient organisation',
    merchantAdmin: 'Vendor admin',
    ops: 'Operations desk'
  };

  function openForActor(actorId) {
    return S().reservations.filter(function (R) {
      return R.state === 'reserved' && R.buyerUserId === actorId;
    });
  }

  function roleCard() {
    var a = Q().actor(), o = Q().org(a.orgId);
    var perms = [];
    if (a.role === 'buyer' || a.role === 'recipient') perms.push('Reserve discounted food and cancel your own holds');
    if (a.role === 'recipient') perms.push('Reserve free donations (organisation channel)');
    if (a.role === 'merchantAdmin') perms.push('Publish, reprice and withdraw your own offers');
    if (a.role === 'merchantAdmin') perms.push('Record handovers for your own offers');
    if (a.role === 'ops') perms.push('Approve vendors, hold listings and see every record');
    if (a.role === 'ops') perms.push('Record handovers anywhere, for demos and exceptions');

    return card('You are acting as', 'Roles are switchable in this simulation — permissions are not.',
      '<p style="font-size:16px;font-weight:650">' + esc(a.name) + '</p>' +
      '<p class="tiny" style="margin-bottom:10px">' + ROLE_LABEL[a.role] + ' · ' + esc(o.name) + '</p>' +
      '<ul style="margin:0;padding-left:18px;font-size:12.5px;color:var(--ink-2)">' +
      perms.map(function (p) { return '<li style="margin:3px 0">' + p + '</li>'; }).join('') +
      '</ul>' +
      '<div class="hr"></div>' +
      '<p class="tiny">This actor is not a real person and has no login. It exists so the same demo can show both sides of a trade.</p>');
  }

  function roleSwitchGrid() {
    var a = Q().actor();
    var roles = [
      ['u-buyer', 'Individual buyer', 'Pays a discounted price and collects in person.'],
      ['u-recipient', 'Recipient organisation', 'Collects free donations for a community kitchen.'],
      ['u-vendor1', 'Vendor — Sunrise Bakery', 'Publishes surplus and records handovers.'],
      ['u-ops', 'Operations desk', 'Approves vendors and handles exceptions.']
    ];
    return '<div class="grid cols-2">' + roles.map(function (r) {
      var active = a.id === r[0];
      return '<button class="matrix__cell" type="button" data-act="switch-actor" data-user="' + r[0] + '"' +
        (active ? ' style="border-color:var(--brand);background:var(--brand-soft)"' : '') + '>' +
        '<h3>' + r[1] + '</h3><p>' + r[2] + '</p>' +
        '<span class="matrix__count">' + (active ? 'Acting as this role' : 'Switch to this role') + '</span></button>';
    }).join('') + '</div>';
  }

  function matrix() {
    var list = S().listings;
    function n(stream, mode) {
      return list.filter(function (l) { return l.state === 'active' && l.stream === stream && l.mode === mode; }).length;
    }
    function cell(title, body, stream, mode) {
      return '<a class="matrix__cell" href="#/discover" data-act="preset" data-stream="' + stream + '" data-mode="' + mode + '">' +
        '<h3>' + title + '</h3><p>' + body + '</p>' +
        '<span class="matrix__count">' + n(stream, mode) + ' open · browse</span></a>';
    }
    return '<div class="matrix">' +
      cell('Retail · Sale', 'Discounted bakery, café and canteen surplus, by the box or pack.', 'retail', 'sale') +
      cell('Retail · Donation', 'Free same-day food for approved recipient organisations.', 'retail', 'donation') +
      cell('Wholesale · Sale', 'Grade-B produce and lots sold by weight, with a minimum order.', 'wholesale', 'sale') +
      cell('Wholesale · Donation', 'Bulk free produce when a stall cannot sell it in time.', 'wholesale', 'donation') +
      '</div>';
  }

  /* ------------------------------------------------------------------ home */

  function home() {
    var s = S(), a = Q().actor(), o = Q().org(a.orgId);
    var live = s.listings.filter(function (l) { return Q().listingIsBuyable(l); });
    var mine = openForActor(a.id);
    var M = AL.store.metrics();
    var inv = AL.store.invariants();
    var fails = inv.filter(function (x) { return !x.ok; }).length;
    var retailCount = live.filter(function (l) { return l.stream === 'retail'; }).length;

    var banners = '';
    if (!s.online) {
      banners += notice('warn', 'Simulated connection is off.',
        'Browsing still works. Reserving and recording a handover will be refused — that is the safety behaviour, not a bug.', 'offline');
    }
    if (a.orgId === 'v4' || (a.role === 'merchantAdmin' && !o.approved)) {
      banners += notice('warn', 'This vendor is not approved yet.', 'Drafts cannot be published until operations approves the organisation.');
    }

    var body = banners +
      '<div class="grid cols-4" style="margin:18px 0 8px">' +
      stat('Open offers', String(live.length), '', retailCount + ' retail · ' + (live.length - retailCount) + ' wholesale') +
      stat('My open pickups', String(mine.length), '', mine.length ? 'Held for ' + esc(a.name.split(' ')[0]) : 'Nothing held right now') +
      stat('Rescued weight', String(u.round(M.wholesaleKg, 1)), 'kg', 'Wholesale + produce, all time') +
      stat('Rescued portions', String(u.round(M.retailUnits, 0)), '', 'Boxes, bags and packs — never added to kg') +
      '</div>' +
      '<p class="footnote">Totals come from recorded handovers only. Reservations that are still open are <em>not</em> counted as rescued.</p>';

    var left =
      '<section class="card" data-tour="roles">' +
      '<div class="card__head"><div><h2 class="section">Who are you in this demo?</h2>' +
      '<p class="section-sub">Switch roles to see the same trade from the other side. Every permission is enforced, not just hidden.</p></div></div>' +
      roleSwitchGrid() + '</section>' +

      '<div class="section-head"><h2 class="section">Four kinds of offer</h2>' +
      '<p class="section-sub">Two streams × two modes. Tap one to filter Discover.</p></div>' +
      '<div data-tour="matrix">' + matrix() + '</div>' +

      '<div class="section-head"><h2 class="section">The loop, in five steps</h2>' +
      '<p class="section-sub">From “we have surplus” to “it was collected”.</p></div>' +
      '<section class="card">' +
      steps([
        ['Offer', 'A vendor lists surplus with a collection window, a food-safety cutoff and the required details.'],
        ['Hold', 'A buyer or recipient reserves. Stock is deducted atomically, so two people cannot hold the same unit.'],
        ['Pass', 'The collector gets a reference and a pass. A pass cannot be redeemed offline.'],
        ['Handover', 'The supplier records what was actually accepted. Part-handovers need a reason.'],
        ['Record', 'Stock, sale value, donation weight and exceptions reconcile. Duplicate scans change nothing.']
      ]) + '</section>' +

      '<div class="section-head"><h2 class="section">Open right now</h2>' +
      '<p class="section-sub">' + live.length + ' offers can still be collected today.</p></div>' +
      '<div class="grid cols-2" data-tour="offers">' + live.slice(0, 4).map(offerCard).join('') + '</div>' +
      '<div class="row" style="margin-top:12px"><a class="btn" href="#/discover" data-nav="#/discover">' +
      'See all offers ' + AL.ui.icon('arrow') + '</a>' +
      '<a class="btn btn-ghost" href="#/learn" data-nav="#/learn">What do these words mean?</a></div>';

    var right =
      roleCard() +
      card('Try a path in 30 seconds', 'Each button sets the actor and opens the right screen.',
        '<div class="stack-sm">' +
        pathBtn('retail', 'Reserve a discounted lunch pack', 'Retail sale · today') +
        pathBtn('donation', 'Collect free bread as a recipient', 'Donation channel · organisation only') +
        pathBtn('bulk', 'Request 30 kg of pumpkin', 'Wholesale · supplier approves') +
        pathBtn('handover', 'Record a handover as the bakery', 'Supplier side · partial or full') +
        pathBtn('offline', 'Try to redeem a pass offline', 'See the refusal and the reason') +
        '</div>') +
      card('System checks', 'Run continuously against the live demo state.',
        '<div class="row row--between"><p class="tiny">' + inv.length + ' invariants</p>' +
        '<span class="chip chip--plain" data-tone="' + (fails ? 'danger' : 'ok') + '">' +
        (fails ? fails + ' failing' : 'All passing') + '</span></div>' +
        '<div class="hr"></div>' +
        '<p class="tiny">Stock is derived as <span class="code">total − open holds − collected</span>, which is why it cannot go negative. See every check in the ops dashboard.</p>' +
        '<div class="row" style="margin-top:10px"><a class="btn btn-sm" href="#/admin" data-nav="#/admin">Open ops dashboard</a></div>') +
      notice('neutral', 'Idea stage.',
        'Every vendor, recipient, price and quantity on this screen is synthetic. There are no real payments, deliveries or partners.') +
      '<div class="card"><p class="tiny">Prototype 2 replaces the first prototype: desktop and mobile layouts, expiry, offline refusal, duplicate-scan protection, permissions, audit trail and 18 self-checking scenarios.</p></div>';

    return head({
      eyebrow: 'Start here · ' + u.fmtFullTime(s.clock) + ' (Asia/Colombo)',
      title: 'Surplus food, collected before it is wasted.',
      lede: 'AgriLoop connects food businesses that have safe surplus with people and organisations who can collect it today. This dashboard is a working simulation of the whole loop.',
      actions: '<a class="btn btn-primary btn-lg" href="#/discover" data-nav="#/discover">' + AL.ui.icon('search') +
        ' Browse food</a>' +
        '<button class="btn btn-lg" type="button" data-act="start-tour">' + AL.ui.icon('play') + ' Guided tour</button>' +
        '<a class="btn btn-ghost btn-lg" href="#/lab" data-nav="#/lab">Scenario lab · 18 checks</a>',
      tour: 'hero'
    }) + body + '<div class="split" style="margin-top:26px">' +
      '<div class="stack">' + left + '</div>' +
      '<div class="stack">' + right + '</div></div>';
  }

  function pathBtn(id, title, sub) {
    return '<button class="list__row" type="button" data-act="try-path" data-path="' + id + '" style="text-align:left;background:none;border:0;border-bottom:1px solid var(--line);cursor:pointer;padding:10px 0;width:100%">' +
      '<span class="list__main"><span class="list__title">' + title + '</span>' +
      '<span class="list__sub" style="display:block">' + sub + '</span></span>' +
      '<span class="list__end">' + AL.ui.icon('arrow', 15) + '</span></button>';
  }

  /* -------------------------------------------------------------- discover */

  function areaList() {
    var seen = {};
    return S().orgs.filter(function (o) { return o.type === 'merchant'; })
      .map(function (o) { return o.area; })
      .filter(function (a) { return seen[a] ? false : (seen[a] = true); })
      .sort();
  }

  function discover() {
    var s = S(), f = s.ui.filters, a = Q().actor();
    var all = s.listings.filter(function (l) { return l.state !== 'draft'; });

    function matches(L) {
      if (f.stream !== 'all' && L.stream !== f.stream) return false;
      if (f.mode !== 'all' && L.mode !== f.mode) return false;
      if (f.area !== 'all') {
        var o = Q().org(L.orgId);
        if (!o || o.area !== f.area) return false;
      }
      if (f.q) {
        var hay = (L.title + ' ' + L.desc + ' ' + Q().org(L.orgId).name).toLowerCase();
        if (hay.indexOf(f.q.toLowerCase()) === -1) return false;
      }
      return true;
    }

    var list = all.filter(matches).sort(function (x, y) {
      var bx = Q().listingIsBuyable(x) ? 0 : 1, by = Q().listingIsBuyable(y) ? 0 : 1;
      return bx - by || u.t(x.pickupTo) - u.t(y.pickupTo);
    });
    var live = list.filter(function (l) { return Q().listingIsBuyable(l); });
    var inactive = list.filter(function (l) { return !Q().listingIsBuyable(l); });

    var filters =
      '<form class="card card--pad-sm" data-form="search" role="search" data-tour="filters" style="margin-bottom:16px">' +
      '<div class="row" style="gap:10px">' +
      seg('stream', [['all', 'All streams'], ['retail', 'Retail'], ['wholesale', 'Wholesale']], f.stream) +
      seg('mode', [['all', 'Sale + donation'], ['sale', 'Sale'], ['donation', 'Free donation']], f.mode) +
      '<select class="select" data-act="filter-select" data-key="area" aria-label="Area" style="width:auto;min-width:150px">' +
      '<option value="all">All areas</option>' +
      areaList().map(function (ar) {
        return '<option value="' + esc(ar) + '"' + (f.area === ar ? ' selected' : '') + '>' + esc(ar) + '</option>';
      }).join('') + '</select>' +
      '<input class="input" type="search" name="q" value="' + esc(f.q) + '" placeholder="Search food, vendor or area"' +
      ' aria-label="Search offers" style="flex:1;min-width:170px">' +
      '<button class="btn" type="submit">' + AL.ui.icon('search') + ' Search</button>' +
      '<button class="btn btn-ghost" type="button" data-act="clear-filters">Clear</button>' +
      '</div></form>';

    var summary = '<div class="row row--between" style="margin-bottom:12px">' +
      '<p class="section-sub" style="margin:0"><strong>' + live.length + '</strong> collectable now, ' +
      inactive.length + ' closed or held back.</p>' +
      '<div class="row">' + AL.ui.chip(f.stream === 'all' ? 'All streams' : f.stream, 'neutral', true) +
      AL.ui.chip(f.mode === 'all' ? 'Sale + donation' : (f.mode === 'sale' ? 'Sale' : 'Donation'), 'neutral', true) +
      '</div></div>';

    var grid = live.length
      ? '<div class="grid cols-2">' + live.map(offerCard).join('') + '</div>'
      : empty('Nothing matches those filters',
        'Try a wider stream or mode, clear the area, or search for a vendor name.',
        '<button class="btn" type="button" data-act="clear-filters">Clear filters</button>');

    var older = inactive.length
      ? '<div class="section-head"><h2 class="section">Closed or held back</h2>' +
        '<p class="section-sub">Kept visible for accountability. They cannot be reserved.</p></div>' +
        '<div class="card"><div class="list">' + inactive.map(function (L) { return listingRow(L); }).join('') + '</div></div>'
      : '';

    var hint = notice('neutral', 'New here?',
      '<strong>Retail</strong> is by the box, bag or pack. <strong>Wholesale</strong> is by weight with a minimum order. ' +
      '<strong>Sale</strong> has a price; <strong>donation</strong> is free and, in the current proposal, limited to approved recipient organisations. ' +
      '<a href="#/learn" data-nav="#/learn">Open the glossary</a>.', 'book');

    var donationNotice = (f.mode === 'donation' && a.role !== 'recipient' && s.policies.donationAccess === 'organisations')
      ? notice('warn', 'You are not a recipient organisation.',
        'You can browse free donations, but reserving one is refused under the current proposed policy. Switch to “Recipient organisation” on the home screen to try it.', 'shield')
      : '';

    return head({
      eyebrow: 'Discover · ' + live.length + ' collectable',
      title: 'Food that needs a home today',
      lede: 'Filter by stream and mode. Every card shows what is left, when it can be collected, and whether it is free.',
      actions: '<button class="btn btn-ghost" type="button" data-act="start-tour">' + AL.ui.icon('play') + ' Guided tour</button>'
    }) + donationNotice + filters + summary + grid + older +
      '<div style="margin-top:22px">' + hint + '</div>';
  }

  function seg(key, options, current) {
    return '<div class="seg" role="group" aria-label="' + key + '">' + options.map(function (o) {
      return '<button type="button" data-act="filter" data-key="' + key + '" data-value="' + o[0] + '"' +
        ' aria-pressed="' + (current === o[0]) + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  }

  /* --------------------------------------------------------------- listing */

  function listing(route) {
    var L = Q().listing(route.param);
    if (!L) {
      return head({ eyebrow: 'Not found', title: 'That offer has gone', lede: 'It may have been removed, or the link is wrong.' }) +
        '<a class="btn" href="#/discover" data-nav="#/discover">Back to Discover</a>';
    }
    var s = S(), a = Q().actor();
    var o = Q().org(L.orgId), cat = Q().category(L.categoryId);
    var lot = L.lotId ? Q().lot(L.lotId) : null;
    var avail = Q().available(L.id), held = Q().openQty(L.id), done = Q().collectedQty(L.id);
    var mine = s.reservations.filter(function (R) {
      return R.state === 'reserved' && R.listingId === L.id && R.buyerUserId === a.id;
    })[0];
    var canManage = Q().isMerchant(a, L.orgId) || Q().isOps(a);
    var buyable = Q().listingIsBuyable(L);
    var free = L.mode === 'donation';
    var donationLocked = free && s.policies.donationAccess === 'organisations' && a.role !== 'recipient';
    var open = Q().pickupOpen(L);
    var wStart = u.t(L.pickupFrom), n = Q().now();
    var myReq = s.bulkRequests.filter(function (B) {
      return B.listingId === L.id && B.orgId === a.orgId && B.state === 'requested';
    })[0];

    var status = open
      ? notice('info', 'Collection window is open.', 'Closes ' + u.rel(L.pickupTo, s.clock) + ' — ' + u.fmtTime(L.pickupTo) + '.', 'clock')
      : (n < wStart
        ? notice('neutral', 'Collection has not opened yet.', 'Opens ' + u.rel(L.pickupFrom, s.clock) + ' — ' + u.fmtTime(L.pickupFrom) + '.', 'clock')
        : notice('warn', 'Collection window closed.', 'It ended ' + u.rel(L.pickupTo, s.clock) + '.', 'clock'));

    var actionBody;
    if (L.state === 'draft') {
      actionBody = notice('warn', 'Draft — not published.', 'Only the vendor can see this. Publish it from the workspace once the organisation is approved.', 'edit');
    } else if (L.state === 'suspended') {
      actionBody = notice('danger', 'On hold for an incident review.', 'Handovers are blocked until operations resolves the incident and reinstates the listing. Reason: ' + esc(L.suspendedReason || ''), 'shield');
    } else if (L.state === 'withdrawn' || L.state === 'closed') {
      actionBody = notice('neutral', 'This offer is ' + L.state + '.', 'No new holds can be created. ' + (L.withdrawnReason ? 'Reason: ' + esc(L.withdrawnReason) + '.' : ''), 'info');
    } else if (!buyable) {
      actionBody = notice('warn', 'The eligibility cutoff has passed.', 'Surplus food cannot be promised after ' + u.fmtTime(L.cutoff) + '. Ask the vendor when the next offer goes up.', 'clock');
    } else if (mine) {
      actionBody = '<div class="notice" data-tone="info">' + AL.ui.icon('ticket') + '<div><strong>You already hold this offer.</strong> ' +
        esc(mine.ref) + ' · ' + esc(u.qty(mine.qty, mine.unit)) + '. ' +
        '<a href="#/pickups" data-nav="#/pickups">Open your pass</a>.</div></div>';
    } else if (donationLocked) {
      actionBody = '<div class="notice" data-tone="warn">' + AL.ui.icon('shield') +
        '<div><strong>Free donations are limited to approved recipient organisations.</strong> That is a proposed policy, not a technical limit. ' +
        '<div class="row" style="margin-top:8px"><button class="btn btn-sm" type="button" data-act="switch-actor" data-user="u-recipient">Switch to a recipient and try</button></div></div></div>';
    } else if (!s.online) {
      actionBody = '<div class="notice" data-tone="warn">' + AL.ui.icon('offline') +
        '<div><strong>A hold needs the server.</strong> You are offline, so the app refuses rather than showing a hold that might not exist. ' +
        'Turn the connection back on in the top bar and reserve.</div></div>' +
        '<button class="btn btn-block" type="button" data-act="toggle-net">Turn connection on</button>';
    } else {
      var min = L.stream === 'wholesale' ? L.minQty : 1;
      var step = L.unit === 'kg' ? 0.5 : 1;
      actionBody =
        '<div class="field"><label for="resQty">How many ' + esc(plural(L.unit)) + '?</label>' +
        '<input class="input" id="resQty" type="number" inputmode="decimal" min="' + min + '" step="' + step + '" value="' + min + '"' +
        ' data-qty-for="' + L.id + '" data-free="' + (free ? '1' : '0') + '" data-price="' + L.priceLkr + '" data-unit="' + esc(L.unit) + '">' +
        '<p class="hint">' + (L.stream === 'wholesale'
          ? 'Minimum ' + esc(u.qty(L.minQty, L.unit)) + '. The supplier confirms bulk requests before a hold is created.'
          : 'One hold per person per offer. Holds last 30 minutes.') + '</p></div>' +
        '<div class="panel" style="margin:12px 0"><div class="kv">' +
        '<dt>Unit price</dt><dd>' + (free ? 'Free' : u.money(L.priceLkr)) + '</dd>' +
        '<dt>Estimated total</dt><dd id="quoteText">' + (free ? 'LKR 0' : u.money(L.priceLkr * min)) + '</dd>' +
        '<dt>Platform fee</dt><dd>' + (free ? 'LKR 0 — donations are fee-free' : 'LKR 0 (no fee selected)') + '</dd>' +
        '</div></div>' +
        (L.stream === 'wholesale'
          ? '<button class="btn btn-primary btn-block btn-lg" type="button" data-act="bulk-request" data-id="' + L.id + '">' +
            AL.ui.icon('users') + ' Request this quantity</button>' +
            '<button class="btn btn-block" type="button" data-act="reserve" data-id="' + L.id + '" style="margin-top:8px">' +
            'Hold immediately instead</button>' +
            '<p class="hint" style="margin-top:8px">Requesting lets the stall confirm before stock is held. Holding takes stock now, for 30 minutes.</p>'
          : '<button class="btn btn-primary btn-block btn-lg" type="button" data-act="reserve" data-id="' + L.id + '">' +
            AL.ui.icon('ticket') + (free ? ' Reserve this donation' : ' Reserve for pickup') + '</button>') +
        '<p class="hint" style="margin-top:8px">You collect in person. AgriLoop does not deliver and does not take payment in this prototype.</p>';
    }

    if (myReq) {
      actionBody += '<div style="margin-top:12px">' + notice('warn', 'Request ' + myReq.id + ' is waiting.',
        esc(u.qty(myReq.qty, myReq.unit)) + ' of this lot. No stock is held until the supplier accepts.') + '</div>';
    }

    var reserveCard = '<section class="card" data-tour="reserve">' +
      '<div class="card__head"><div><h2 class="card__title">' + (free ? 'Free' : u.money(L.priceLkr)) +
      (free ? '' : '<span class="tiny" style="font-weight:500"> / ' + esc(L.unit) + '</span>') + '</h2>' +
      '<p class="card__sub">' + esc(u.qty(avail, L.unit)) + ' left of ' + esc(u.qty(L.totalQty, L.unit)) + '</p></div>' +
      AL.ui.stateChip(L.state) + '</div>' +
      AL.ui.meter(avail, L.totalQty) +
      '<div class="row" style="gap:6px;margin:8px 0 14px">' + AL.ui.modeBadge(L.mode) + AL.ui.streamBadge(L.stream) +
      AL.ui.chip(esc(o.area), 'neutral', true) + '</div>' +
      actionBody + '</section>';

    var windowCard = card('Collection', windowText(L) + ' · ' + esc(o.name),
      status +
      '<dl class="kv" style="margin-top:12px">' +
      '<dt>Where</dt><dd>' + esc(o.contact || o.area) + '</dd>' +
      '<dt>Eligibility cutoff</dt><dd>' + u.fmtTime(L.cutoff) + '</dd>' +
      '<dt>Food rule</dt><dd>' + esc(cat ? cat.name + ' ' + cat.version : L.policyVersion) + '</dd>' +
      '</dl>');

    var safetyCard = cat ? card('Food safety details', 'Required by ' + esc(cat.name) + ' ' + esc(cat.version),
      '<p class="tiny" style="margin-bottom:10px">' + esc(cat.rule) + '</p>' +
      '<dl class="kv">' + cat.required.map(function (f) {
        return '<dt>' + esc(f.label) + '</dt><dd>' + esc((L.extra || {})[f.key] || '—') + '</dd>';
      }).join('') + '</dl>') : '';

    var lotCard = lot ? card('Traceability', 'The lot this offer came from',
      '<dl class="kv">' +
      '<dt>Lot</dt><dd class="mono">' + esc(lot.id) + '</dd>' +
      '<dt>Declared at intake</dt><dd>' + esc(u.qty(lot.declaredKg, 'kg')) + '</dd>' +
      '<dt>Measured</dt><dd>' + esc(u.qty(lot.measuredKg, 'kg')) + '</dd>' +
      '<dt>Difference</dt><dd>' + esc(u.qty(u.round(lot.declaredKg - lot.measuredKg, 2), 'kg')) + '</dd>' +
      '<dt>Basis</dt><dd>' + esc(lot.basis) + '</dd>' +
      '</dl><p class="tiny" style="margin-top:8px">Weight is measured at intake and again at handover. Price is always calculated from the accepted quantity, never the requested one.</p>') : '';

    var stockCard = card('Stock accounting', 'Derived, not typed in',
      '<div class="stack-sm">' +
      stockRow('Total listed', L.totalQty, L.unit) +
      stockRow('Open holds', held, L.unit) +
      stockRow('Collected', done, L.unit) +
      stockRow('Available now', avail, L.unit, true) +
      '</div>' +
      '<p class="tiny" style="margin-top:10px"><span class="code">available = total − open holds − collected</span>. ' +
      'Expired holds return to the pool; collected stock never does.</p>');

    var supplierCard = canManage ? card('Supplier controls', 'Only your organisation, or operations, can see these actions.',
      '<div class="stack-sm">' +
      (Q().openReservations(L.id).length
        ? Q().openReservations(L.id).map(function (R) {
          return '<div class="list__row"><div class="list__main"><p class="list__title">' + esc(R.ref) + ' · ' + esc(u.qty(R.qty, R.unit)) + '</p>' +
            '<p class="list__sub">' + esc((Q().user(R.buyerUserId) || {}).name || 'Collector') + ' · expires ' + esc(u.fmtTime(R.expiresAt)) + '</p></div>' +
            '<div class="list__end"><button class="btn btn-sm btn-primary" type="button" data-act="handover-open" data-id="' + R.id + '">Record handover</button></div></div>';
        }).join('')
        : '<p class="tiny">No open pickups for this offer right now.</p>') +
      '</div>' +
      '<div class="row" style="margin-top:12px">' +
      (L.mode === 'sale' ? '<button class="btn btn-sm" type="button" data-act="price-open" data-id="' + L.id + '">Change price</button>' : '') +
      '<button class="btn btn-sm btn-danger" type="button" data-act="withdraw-open" data-id="' + L.id + '">Withdraw offer</button>' +
      '<button class="btn btn-sm btn-danger" type="button" data-act="incident-open" data-id="' + L.id + '">Report incident</button>' +
      '</div>') : '';

    return head({
      eyebrow: '<a href="#/discover" data-nav="#/discover">← Discover</a> · ' + esc(L.id),
      title: esc(L.title),
      lede: esc(L.desc),
      actions: AL.ui.modeBadge(L.mode) + AL.ui.streamBadge(L.stream) +
        AL.ui.chip(o.name + ' · ' + o.area, 'neutral', true),
      tour: 'detail'
    }) +
      '<div class="split split--wide">' +
      '<div class="stack">' + windowCard + safetyCard + lotCard + supplierCard +
      card('What happens next', 'The same five steps, for this offer', steps([
        ['Offer', 'Published ' + u.rel(L.createdAt, s.clock) + ' by ' + esc(o.name) + '.'],
        ['Hold', 'A 30-minute hold deducts stock immediately.'],
        ['Pass', 'The collector shows a reference at the counter.'],
        ['Handover', 'You record the accepted quantity; rejected food stays yours to re-list.'],
        ['Record', 'One transfer per pickup, even if the pass is scanned twice.']
      ])) + '</div>' +
      '<div class="stack">' + reserveCard + stockCard +
      notice('neutral', 'Why a cutoff?', 'Surplus food can be sold or donated only while it is still safe. The cutoff is earlier than the collection window closes, so no one is promised food that is no longer eligible.') +
      '</div></div>';
  }

  function stockRow(label, value, unit, strong) {
    return '<div class="row row--between"' + (strong ? ' style="font-weight:650"' : '') + '>' +
      '<span class="tiny" style="color:var(--ink-2)">' + label + '</span>' +
      '<span class="num" style="font-size:13px">' + esc(u.qty(value, unit)) + '</span></div>';
  }

  /* --------------------------------------------------------------- pickups */

  function pickups() {
    var s = S(), a = Q().actor();
    var tab = s.ui.pickupsTab || 'open';
    var mine = s.reservations.filter(function (R) {
      return R.buyerUserId === a.id || Q().isOps(a);
    }).sort(function (x, y) { return u.t(y.createdAt) - u.t(x.createdAt); });
    var open = mine.filter(function (R) { return R.state === 'reserved'; })
      .sort(function (x, y) { return u.t(x.expiresAt) - u.t(y.expiresAt); });
    var history = mine.filter(function (R) { return R.state !== 'reserved'; });

    var incoming = [];
    if (a.role === 'merchantAdmin' || a.role === 'ops') {
      incoming = s.reservations.filter(function (R) {
        if (R.state !== 'reserved') return false;
        var L = Q().listing(R.listingId);
        return L && (Q().isOps(a) || L.orgId === a.orgId);
      }).sort(function (x, y) { return u.t(x.expiresAt) - u.t(y.expiresAt); });
    }

    var tabs = '<div class="seg" role="group" aria-label="Pickup view">' +
      [['open', 'Open (' + open.length + ')'], ['history', 'History (' + history.length + ')'], ['all', 'Everything']].map(function (t) {
        return '<button type="button" data-act="tab" data-value="' + t[0] + '" aria-pressed="' + (tab === t[0]) + '">' + t[1] + '</button>';
      }).join('') + '</div>';

    var collectorBlock = '';
    if (tab !== 'history') {
      collectorBlock = open.length
        ? '<div class="grid cols-2">' + open.map(function (R, i) { return passCard(R, i === 0); }).join('') + '</div>'
        : empty('No open pickups for this actor',
          a.role === 'merchantAdmin'
            ? 'You are on the supplier side. Your incoming pickups are below — or switch to a buyer in the top bar to collect something.'
            : 'Find an offer, reserve it, and the pass will appear here.',
          '<a class="btn" href="#/discover" data-nav="#/discover">Browse offers</a>');
    }

    var incomingBlock = '';
    if (incoming.length && tab !== 'history') {
      incomingBlock = '<div class="section-head"><h2 class="section">Incoming pickups</h2>' +
        '<p class="section-sub">Supplier side — record what was actually accepted.</p></div>' +
        '<div class="card"><div class="list">' + incoming.map(function (R) {
          var L = Q().listing(R.listingId), buyer = Q().user(R.buyerUserId);
          return '<div class="list__row">' +
            '<div class="list__main"><p class="list__title">' + esc(R.ref) + ' · ' + esc(L.title) + '</p>' +
            '<p class="list__sub">' + esc(buyer ? buyer.name : 'Collector') + ' · ' + esc(u.qty(R.qty, R.unit)) +
            ' · window ' + esc(u.fmtTime(L.pickupFrom)) + '–' + esc(u.fmtTime(L.pickupTo)) + '</p></div>' +
            '<div class="list__end"><button class="btn btn-sm" type="button" data-act="show-pass" data-id="' + R.id + '">View pass</button>' +
            '<button class="btn btn-sm btn-primary" type="button" data-act="handover-open" data-id="' + R.id + '">Record handover</button></div></div>';
        }).join('') + '</div></div>';
    }

    var historyBlock = '';
    if (tab !== 'open' && history.length) {
      historyBlock = '<div class="section-head"><h2 class="section">History</h2>' +
        '<p class="section-sub">Every outcome is kept, including misses and refusals.</p></div>' +
        '<div class="card"><div class="list">' + history.map(function (R) {
          var L = Q().listing(R.listingId);
          return '<div class="list__row">' +
            '<div class="list__main"><p class="list__title">' + esc(R.ref) + ' · ' + esc(L ? L.title : R.listingId) + '</p>' +
            '<p class="list__sub">' + esc(u.qty(R.qty, R.unit)) + ' · ' + esc(u.fmtFullTime(R.closedAt || R.createdAt)) +
            (R.reason ? ' · ' + esc(R.reason) : '') + '</p></div>' +
            '<div class="list__end">' + AL.ui.stateChip(R.state) + '</div></div>';
        }).join('') + '</div></div>';
    } else if (tab !== 'open' && !history.length) {
      historyBlock = empty('No history yet', 'Completed, cancelled and expired pickups will be listed here.');
    }

    return head({
      eyebrow: 'My pickups · ' + (a.role === 'ops' ? 'all records (ops)' : esc(a.name)),
      title: tab === 'history' ? 'Pickup history' : 'Your collection passes',
      lede: 'A pass is a promise of stock, not a payment. Show the reference at the counter; the supplier records the handover.',
      actions: tabs
    }) +
      notice('neutral', 'How a pass works.',
        'It expires after 30 minutes or at the food cutoff, whichever is sooner. It cannot be redeemed offline, and scanning it twice records one handover.') +
      '<div style="margin-top:18px" class="stack">' + collectorBlock + incomingBlock + historyBlock + '</div>';
  }

  function passCard(R, first) {
    var L = Q().listing(R.listingId);
    if (!L) return '';
    var o = Q().org(L.orgId);
    var free = R.mode === 'donation';
    var mine = R.buyerUserId === Q().actor().id;
    return '<article class="pass"' + (first ? ' data-tour="pass"' : '') + '>' +
      '<div class="pass__head"><div>' +
      '<p class="tag-label">Collection pass</p>' +
      '<p class="pass__ref">' + esc(R.ref) + '</p>' +
      '<p class="tiny">' + esc(L.title) + ' · ' + esc(o.name) + '</p>' +
      '</div>' + AL.ui.stateChip(R.state) + '</div>' +
      AL.ui.passGrid(R.token) +
      '<dl class="pass__grid">' +
      '<div><dt>Quantity</dt><dd>' + esc(u.qty(R.qty, R.unit)) + '</dd></div>' +
      '<div><dt>Total</dt><dd>' + (free ? 'Free donation' : u.money(R.priceLkr)) + '</dd></div>' +
      '<div><dt>Collect</dt><dd>' + esc(u.fmtTime(L.pickupFrom)) + '–' + esc(u.fmtTime(L.pickupTo)) + '</dd></div>' +
      '<div><dt>Hold expires</dt><dd>' + esc(u.rel(R.expiresAt, S().clock)) + '</dd></div>' +
      '</dl>' +
      (R.needsAck ? '<div style="margin-top:12px">' + notice('warn', 'The supplier changed the price.',
        'New total: ' + u.money(R.pendingPriceLkr * R.qty) + '. The old price is shown on the pass until you accept. Handover is blocked in the meantime.', 'alert') + '</div>' : '') +
      '<div class="row" style="margin-top:14px">' +
      '<button class="btn btn-sm" type="button" data-act="show-pass" data-id="' + R.id + '">' + AL.ui.icon('qr') + ' Show pass</button>' +
      (R.needsAck ? '<button class="btn btn-sm btn-primary" type="button" data-act="ack" data-id="' + R.id + '">Accept new terms</button>' : '') +
      (mine ? '<button class="btn btn-sm btn-danger" type="button" data-act="reject-open" data-id="' + R.id + '">Reject at counter</button>' : '') +
      (mine ? '<button class="btn btn-sm btn-danger" type="button" data-act="cancel-open" data-id="' + R.id + '">Cancel</button>' : '') +
      '</div></article>';
  }

  /* --------------------------------------------------------------- dialogs */

  function dlgHandover(R) {
    var L = Q().listing(R.listingId);
    var q = R.qty, unit = R.unit;
    AL.ui.dialogOpen({
      title: 'Record handover',
      sub: esc(R.ref) + ' · ' + esc(L.title) + ' · held ' + esc(u.qty(q, unit)),
      body: '<form data-form="handover">' +
        '<input type="hidden" name="res" value="' + R.id + '">' +
        '<div class="notice" data-tone="neutral">' + AL.ui.icon('shield') +
        '<div>Only record what the collector actually accepts. Anything rejected stays with the supplier and can be re-listed. A reason is required for a partial handover.</div></div>' +
        '<div class="field" style="margin-top:12px"><label for="hvQty">Accepted quantity (max ' + esc(u.qty(q, unit)) + ')</label>' +
        '<input class="input" id="hvQty" name="actual" type="number" inputmode="decimal" min="0" max="' + q + '" step="' +
        (unit === 'kg' ? '0.1' : '1') + '" value="' + q + '"></div>' +
        '<div class="field" style="margin-top:10px"><label for="hvReason">Reason if less than held</label>' +
        '<textarea class="textarea" id="hvReason" name="reason" placeholder="e.g. 2 kg trimmed during grading"></textarea></div>' +
        '<label class="check" style="margin-top:10px"><input type="checkbox" name="retry" value="1">' +
        '<span>Simulate a second scan of the same pass (tests duplicate protection)</span></label>' +
        '<div class="dialog__foot">' +
        '<button class="btn" type="button" data-act="dialog-close">Cancel</button>' +
        '<button class="btn btn-primary" type="submit">Record handover</button>' +
        '</div></form>'
    });
  }

  function dlgCancel(R) {
    AL.ui.dialogOpen({
      title: 'Cancel this hold?',
      sub: esc(R.ref) + ' · ' + esc(u.qty(R.qty, R.unit)),
      body: '<form data-form="cancel"><input type="hidden" name="res" value="' + R.id + '">' +
        '<p class="tiny" style="margin-bottom:10px">The stock goes back to the pool immediately. This cannot be undone.</p>' +
        '<div class="field"><label for="cxReason">Reason (optional)</label>' +
        '<select class="select" id="cxReason" name="reason">' +
        '<option>Changed my mind</option><option>Cannot reach the pickup point</option>' +
        '<option>Found food elsewhere</option><option>Other</option></select></div>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Keep hold</button>' +
        '<button class="btn btn-danger" type="submit">Cancel hold</button></div></form>'
    });
  }

  function dlgReject(R) {
    AL.ui.dialogOpen({
      title: 'Reject at the counter',
      sub: esc(R.ref) + ' · ' + esc(u.qty(R.qty, R.unit)),
      body: '<form data-form="reject"><input type="hidden" name="res" value="' + R.id + '">' +
        '<p class="tiny" style="margin-bottom:10px">Use this when the food does not match the listing. The supplier keeps the stock and the reason is recorded.</p>' +
        '<div class="field"><label for="rjReason">What was wrong?</label>' +
        '<select class="select" id="rjReason" name="reason">' +
        '<option>Did not match the description</option><option>Packaging damaged</option>' +
        '<option>Temperature or storage concern</option><option>Past the stated time</option></select></div>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Back</button>' +
        '<button class="btn btn-danger" type="submit">Reject offer</button></div></form>'
    });
  }

  function dlgPass(R) {
    var L = Q().listing(R.listingId), o = Q().org(L.orgId);
    AL.ui.dialogOpen({
      title: 'Show this at the counter',
      sub: esc(o.name) + ' · ' + esc(o.contact || o.area),
      body: '<div class="pass" style="text-align:center">' +
        '<p class="tag-label">Reference</p>' +
        '<p class="pass__ref">' + esc(R.ref) + '</p>' +
        '<div style="display:flex;justify-content:center">' + AL.ui.passGrid(R.token) + '</div>' +
        '<p class="tiny" style="max-width:36ch;margin:0 auto">Decorative code only — this prototype has no scanner. The reference is the real identifier.</p>' +
        '<dl class="pass__grid" style="margin-top:16px">' +
        '<div><dt>Food</dt><dd>' + esc(L.title) + '</dd></div>' +
        '<div><dt>Quantity</dt><dd>' + esc(u.qty(R.qty, R.unit)) + '</dd></div>' +
        '<div><dt>Collect by</dt><dd>' + esc(u.fmtTime(L.pickupTo)) + '</dd></div>' +
        '<div><dt>Total</dt><dd>' + (R.mode === 'donation' ? 'Free' : u.money(R.priceLkr)) + '</dd></div>' +
        '</dl></div>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Close</button>' +
        '<button class="btn" type="button" data-act="print">Print / save PDF</button></div>'
    });
  }

  function dlgWithdraw(L) {
    AL.ui.dialogOpen({
      title: 'Withdraw this offer?',
      sub: esc(L.title),
      body: '<form data-form="withdraw"><input type="hidden" name="id" value="' + L.id + '">' +
        '<div class="notice" data-tone="warn">' + AL.ui.icon('alert') +
        '<div>' + Q().openReservations(L.id).length + ' open pickup(s) will be cancelled and the collectors notified. The record stays in the audit trail.</div></div>' +
        '<div class="field" style="margin-top:12px"><label for="wdReason">Reason</label>' +
        '<input class="input" id="wdReason" name="reason" value="Food no longer available" maxlength="120"></div>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Keep offer</button>' +
        '<button class="btn btn-danger" type="submit">Withdraw</button></div></form>'
    });
  }

  function dlgPrice(L) {
    AL.ui.dialogOpen({
      title: 'Change the price',
      sub: esc(L.title) + ' · currently ' + u.money(L.priceLkr) + ' per ' + esc(L.unit),
      body: '<form data-form="price"><input type="hidden" name="id" value="' + L.id + '">' +
        '<div class="field"><label for="npPrice">New price (LKR)</label>' +
        '<input class="input" id="npPrice" name="price" type="number" min="1" step="10" value="' + L.priceLkr + '"></div>' +
        '<p class="hint" style="margin-top:8px">Open holds are frozen: the collector must accept the new price before any handover. A re-agreement is recorded in the audit trail.</p>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Cancel</button>' +
        '<button class="btn btn-primary" type="submit">Update price</button></div></form>'
    });
  }

  function dlgIncident(L) {
    AL.ui.dialogOpen({
      title: 'Report an incident',
      sub: esc(L.title) + ' · this immediately holds the listing',
      body: '<form data-form="incident"><input type="hidden" name="id" value="' + L.id + '">' +
        '<div class="field"><label for="incCat">What happened?</label>' +
        '<select class="select" id="incCat" name="category">' +
        '<option value="temperature">Temperature or storage breach</option>' +
        '<option value="quality">Quality did not match the listing</option>' +
        '<option value="packaging">Packaging failure</option>' +
        '<option value="other">Other safety concern</option></select></div>' +
        '<div class="field" style="margin-top:10px"><label for="incSev">Severity</label>' +
        '<select class="select" id="incSev" name="severity"><option value="low">Low</option>' +
        '<option value="medium" selected>Medium</option><option value="high">High</option></select></div>' +
        '<div class="field" style="margin-top:10px"><label for="incNote">Note</label>' +
        '<textarea class="textarea" id="incNote" name="note" placeholder="What did you see, and when?"></textarea></div>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Cancel</button>' +
        '<button class="btn btn-danger" type="submit">Hold listing &amp; report</button></div></form>'
    });
  }

  function dlgDecline(BR) {
    AL.ui.dialogOpen({
      title: 'Decline this request?',
      sub: BR.id + ' · ' + esc(u.qty(BR.qty, BR.unit)),
      body: '<form data-form="decline"><input type="hidden" name="br" value="' + BR.id + '">' +
        '<div class="field"><label for="dcReason">Reason shared with the recipient</label>' +
        '<select class="select" id="dcReason" name="reason">' +
        '<option>Stock already committed</option><option>Collection window too tight</option>' +
        '<option>Minimum handling quantity not met</option><option>Other</option></select></div>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Back</button>' +
        '<button class="btn btn-danger" type="submit">Decline request</button></div></form>'
    });
  }

  AL.v = {
    esc: esc, S: S, Q: Q, head: head, notice: notice, stat: stat, card: card, empty: empty,
    steps: steps, offerCard: offerCard, listingRow: listingRow, roleCard: roleCard,
    roleSwitchGrid: roleSwitchGrid, matrix: matrix, seg: seg, windowText: windowText,
    dayLabel: dayLabel, passCard: passCard, openForActor: openForActor,
    dlgHandover: dlgHandover, dlgCancel: dlgCancel, dlgReject: dlgReject, dlgPass: dlgPass,
    dlgWithdraw: dlgWithdraw, dlgPrice: dlgPrice, dlgIncident: dlgIncident, dlgDecline: dlgDecline,
    ROLE_LABEL: ROLE_LABEL
  };

  AL.views = {
    home: home,
    discover: discover,
    listing: listing,
    pickups: pickups
  };
})(window.AL);
