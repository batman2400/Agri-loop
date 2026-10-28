/* =============================================================================
   AgriLoop Prototype 2 — router, shell and event wiring
   Hash routes: #/home · #/discover · #/listing/:id · #/pickups
                #/workspace · #/admin · #/lab · #/learn
   ========================================================================== */
window.AL = window.AL || {};

(function (AL) {
  'use strict';

  var u = AL.util, ui = AL.ui, store = AL.store, A = AL.actions, q = AL.q;
  var lastRoute = '';

  /* --------------------------------------------------------------- routing */

  function parse() {
    var raw = (location.hash || '#/home').replace(/^#\/?/, '');
    var parts = raw.split('/').filter(Boolean);
    var view = parts[0] || 'home';
    if (!AL.views[view]) view = 'home';
    return { view: view, param: parts[1] || null };
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function render() {
    var s = store.get();
    if (!s) return;
    var route = parse();
    var main = document.getElementById('main');
    var html;
    try {
      html = (AL.views[route.view] || AL.views.home)(route);
    } catch (e) {
      console.error(e);
      html = '<div class="page"><h1>Something went wrong on this screen</h1>' +
        '<p class="lede">' + u.esc(e && e.message ? e.message : String(e)) + '</p>' +
        '<div class="page__actions"><button class="btn" type="button" data-act="reset-open">Reset the demo</button>' +
        '<a class="btn btn-ghost" href="#/home" data-nav="#/home">Back to start</a></div></div>';
    }
    main.innerHTML = html;
    ui.hydrateIcons(main);
    updateChrome(s, route);
    var key = route.view + '/' + (route.param || '');
    if (lastRoute !== key) {
      window.scrollTo(0, 0);
      lastRoute = key;
    }
    applyTour(s);
  }

  /* ---------------------------------------------------------------- chrome */

  function roleShort(role) {
    return { buyer: 'Buyer', recipient: 'Recipient', merchantAdmin: 'Vendor', ops: 'Ops' }[role] || role;
  }

  function updateChrome(s, route) {
    var clock = document.getElementById('clockText');
    if (clock) clock.textContent = u.fmtFullTime(s.clock);

    var net = document.getElementById('netBtn');
    if (net) {
      net.setAttribute('aria-pressed', String(!s.online));
      document.getElementById('netText').textContent = s.online ? 'Online' : 'Offline';
      net.title = s.online ? 'Simulated connection is on. Click to go offline.' : 'Simulated connection is off. Click to restore.';
    }

    var sel = document.getElementById('actorSelect');
    if (sel && sel.value !== s.actorId) sel.value = s.actorId;

    var actor = q.user(s.actorId);

    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var top = (a.getAttribute('data-nav') || '').replace(/^#\//, '').split('/')[0];
      var on = top === route.view || (route.view === 'listing' && top === 'discover') ||
        (route.view === 'home' && top === '');
      a.classList.toggle('is-active', on);
    });

    var live = s.listings.filter(function (l) { return q.listingIsBuyable(l); }).length;
    var countEl = document.getElementById('navCount');
    if (countEl) countEl.textContent = live ? String(live) : '';

    var openMine;
    if (q.isOps(actor)) {
      openMine = s.reservations.filter(function (R) { return R.state === 'reserved'; }).length;
    } else if (actor && actor.role === 'merchantAdmin') {
      openMine = s.reservations.filter(function (R) {
        var L = q.listing(R.listingId);
        return R.state === 'reserved' && L && L.orgId === actor.orgId;
      }).length;
    } else {
      openMine = s.reservations.filter(function (R) {
        return R.state === 'reserved' && R.buyerUserId === (actor && actor.id);
      }).length;
    }
    var pickEl = document.getElementById('navPickups');
    if (pickEl) pickEl.textContent = openMine ? String(openMine) : '';

    document.getElementById('app').setAttribute('data-online', String(s.online));
  }

  /* ------------------------------------------------------------------ tour */

  var TOUR = [
    {
      route: '#/home', sel: '[data-tour="hero"]', actor: 'u-buyer',
      text: '<strong>Welcome.</strong> AgriLoop is a marketplace for safe surplus food. This is a simulation — no real food, money or partners. The top bar controls the clock, the connection and the role you are playing.'
    },
    {
      route: '#/home', sel: '[data-tour="matrix"]',
      text: 'Every offer is one of four combinations: <strong>retail or wholesale</strong>, and <strong>sale or free donation</strong>. The counts are live. Clicking one filters Discover.'
    },
    {
      route: '#/discover', sel: '[data-tour="filters"]',
      text: 'This is the buyer’s view. Retail is by the box or pack; wholesale is by weight with a minimum order. A card always shows what is left, when to collect, and whether there is a cutoff.'
    },
    {
      route: '#/listing/L5', sel: '[data-tour="reserve"]',
      text: 'A listing carries its food-safety details, cutoff and collection window. Reserving takes stock <strong>immediately</strong> for 30 minutes. The estimate is based on the unit price.'
    },
    {
      route: '#/pickups', sel: '[data-tour="pass"]',
      text: 'This is the collector’s pass. The reference is the real identifier; the code block is decorative. The pass expires, cannot be used offline, and a double scan records one handover.'
    },
    {
      route: '#/workspace', sel: '[data-tour="composer"]', actor: 'u-vendor1',
      text: 'Flip to the supplier side. A vendor publishes only for an approved organisation, sets a cutoff, and fills the safety fields required by the food category.'
    },
    {
      route: '#/admin', sel: '[data-tour="metrics"]', actor: 'u-ops',
      text: 'Operations sees the honest ledger. Kilograms and portions are <strong>never added together</strong>. Only completed handovers count as rescued; open holds do not.'
    },
    {
      route: '#/lab', sel: '[data-tour="lab"]',
      text: 'Finally, the evidence. The scenario lab runs 18 acceptance checks against the real model, on a scratch copy, and restores your demo data afterwards. Finish here in a pitch.'
    }
  ];

  function tourGo(i) {
    var s = store.get();
    var step = TOUR[i];
    if (!step) return;
    s.tour = { active: true, step: i };
    store.save();
    if (step.actor && s.actorId !== step.actor) A.setActor(step.actor);
    go(step.route);
    store.emit();
  }

  function startTour() {
    var s = store.get();
    s.prefs.tourDone = false;
    tourGo(0);
  }

  function nextTour() {
    var s = store.get();
    var i = s.tour.active ? s.tour.step : 0;
    if (i >= TOUR.length - 1) endTour(true);
    else tourGo(i + 1);
  }

  function endTour(completed) {
    var s = store.get();
    s.tour = { active: false, step: 0 };
    if (completed) s.prefs.tourDone = true;
    store.save();
    store.emit();
    ui.toast(completed ? 'Tour finished. The Scenario lab is the next stop.' : 'Tour closed.');
  }

  function applyTour(s) {
    var bar = document.getElementById('tour');
    if (!bar) return;
    var active = !!(s.tour && s.tour.active);
    bar.hidden = !active;
    document.querySelectorAll('.tour-target').forEach(function (el) { el.classList.remove('tour-target'); });
    if (!active) return;
    var step = TOUR[s.tour.step] || TOUR[0];
    document.getElementById('tourStep').textContent = 'Step ' + (s.tour.step + 1) + ' of ' + TOUR.length;
    document.getElementById('tourText').innerHTML = step.text;
    document.getElementById('tourNext').textContent = s.tour.step === TOUR.length - 1 ? 'Finish' : 'Next';
    var target = document.querySelector(step.sel);
    if (target) {
      target.classList.add('tour-target');
      try { target.scrollIntoView({ block: 'center' }); } catch (e) { /* older browsers */ }
    }
  }

  /* --------------------------------------------------------------- helpers */

  function fail(e) {
    if (window.console) console.warn('[AgriLoop]', e);
    ui.toast(e && e.message ? e.message : 'That action could not be completed.', 'error');
  }

  function guard(fn) {
    try { return fn(); } catch (e) { fail(e); return null; }
  }

  function setFilter(key, value) {
    var s = store.get();
    s.ui.filters[key] = value;
    store.save();
    store.emit();
  }

  function commitUI(fn) {
    var s = store.get();
    fn(s);
    store.save();
    store.emit();
  }

  function readQty(id) {
    var el = document.getElementById('resQty');
    if (el && el.value !== '') return Number(el.value);
    var L = q.listing(id);
    return L ? (L.stream === 'wholesale' ? L.minQty : 1) : 1;
  }

  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  function stamp() {
    var s = store.get();
    return String(s.clock).slice(0, 10) + '-' + String(s.clock).slice(11, 16).replace(':', '');
  }

  function exportJson() {
    var s = store.get();
    var payload = {
      note: 'AgriLoop Prototype 2 — simulated demo data. No real people, payments or food.',
      exportedAt: new Date().toISOString(),
      demoClock: s.clock,
      schema: s.schema,
      state: s
    };
    download('agriloop-prototype2-' + stamp() + '.json', JSON.stringify(payload, null, 2), 'application/json');
    ui.toast('JSON exported to your downloads folder.');
  }

  function exportCsv() {
    var rows = store.exportRows();
    var csv = rows.map(function (row) {
      return row.map(function (cell) {
        return '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"';
      }).join(',');
    }).join('\r\n');
    download('agriloop-transfers-' + stamp() + '.csv', csv, 'text/csv');
    ui.toast('CSV exported (transfers and reservations, ' + (rows.length - 1) + ' rows).');
  }

  function publish() {
    var s = store.get();
    var d = AL.v.draft();
    var payload = AL.v.draftPayload(d);
    var errs = A.validateDraft(payload);
    if (errs.length) {
      s.ui.draftErrors = errs;
      store.save();
      store.emit();
      throw store.deny('INVALID', errs[0].msg, errs);
    }
    var L = A.publishListing(payload);
    s.ui.draft = null;
    s.ui.draftErrors = [];
    store.save();
    store.emit();
    ui.toast('Published “' + L.title + '” (' + L.id + ').');
  }

  /* --------------------------------------------------------------- actions */

  function runAction(act, el) {
    switch (act) {
      case 'switch-actor': {
        var user = q.user(el.getAttribute('data-user'));
        A.setActor(el.getAttribute('data-user'));
        ui.toast('Now acting as ' + (user ? user.name : 'another role') + ' (' + (user ? roleShort(user.role) : '') + ').');
        break;
      }
      case 'toggle-net': {
        var on = !store.get().online;
        A.setOnline(on);
        ui.toast(on ? 'Connection restored.' : 'Connection off (simulated). Holds and handovers will be refused.', on ? 'info' : 'error');
        break;
      }
      case 'filter':
        setFilter(el.getAttribute('data-key'), el.getAttribute('data-value'));
        break;
      case 'filter-select':
        setFilter(el.getAttribute('data-key'), el.value);
        break;
      case 'preset': {
        var s = store.get();
        s.ui.filters.stream = el.getAttribute('data-stream');
        s.ui.filters.mode = el.getAttribute('data-mode');
        store.save();
        go('#/discover');
        store.emit();
        break;
      }
      case 'clear-filters': {
        var s2 = store.get();
        s2.ui.filters = { stream: 'all', mode: 'all', q: '', area: 'all' };
        store.save();
        store.emit();
        break;
      }
      case 'tab':
        commitUI(function (s) { s.ui.pickupsTab = el.getAttribute('data-value'); });
        break;
      case 'try-path':
        tryPath(el.getAttribute('data-path'));
        break;
      case 'reserve': {
        var R = A.reserve(el.getAttribute('data-id'), { qty: readQty(el.getAttribute('data-id')) });
        ui.toast('Held ' + u.qty(R.qty, R.unit) + ' · pass ' + R.ref);
        go('#/pickups');
        break;
      }
      case 'bulk-request': {
        var BR = A.requestBulk(el.getAttribute('data-id'), { qty: readQty(el.getAttribute('data-id')) });
        ui.toast('Request ' + BR.id + ' sent. The supplier decides; no stock is held yet.');
        break;
      }
      case 'handover-open': {
        var res = q.reservation(el.getAttribute('data-id'));
        if (res) AL.v.dlgHandover(res);
        break;
      }
      case 'cancel-open': {
        var rc = q.reservation(el.getAttribute('data-id'));
        if (rc) AL.v.dlgCancel(rc);
        break;
      }
      case 'reject-open': {
        var rr = q.reservation(el.getAttribute('data-id'));
        if (rr) AL.v.dlgReject(rr);
        break;
      }
      case 'show-pass': {
        var rp = q.reservation(el.getAttribute('data-id'));
        if (rp) AL.v.dlgPass(rp);
        break;
      }
      case 'ack': {
        var ra = A.acknowledgeChange(el.getAttribute('data-id'));
        ui.toast('New terms accepted. Total now ' + u.money(ra.priceLkr) + '.');
        break;
      }
      case 'withdraw-open': {
        var wl = q.listing(el.getAttribute('data-id'));
        if (wl) AL.v.dlgWithdraw(wl);
        break;
      }
      case 'price-open': {
        var pl = q.listing(el.getAttribute('data-id'));
        if (pl) AL.v.dlgPrice(pl);
        break;
      }
      case 'incident-open': {
        var il = q.listing(el.getAttribute('data-id'));
        if (il) AL.v.dlgIncident(il);
        break;
      }
      case 'decline-open': {
        var br = store.get().bulkRequests.filter(function (b) { return b.id === el.getAttribute('data-id'); })[0];
        if (br) AL.v.dlgDecline(br);
        break;
      }
      case 'accept-bulk': {
        var out = A.decideBulk(el.getAttribute('data-id'), true);
        ui.toast('Accepted. Hold ' + out.ref + ' created for ' + u.qty(out.qty, out.unit) + '.');
        break;
      }
      case 'resolve-incident': {
        A.resolveIncident(el.getAttribute('data-id'));
        ui.toast('Incident resolved. Reinstate the listing when you are satisfied.');
        break;
      }
      case 'reinstate': {
        A.reinstateListing(el.getAttribute('data-id'));
        ui.toast('Listing is back on the market.');
        break;
      }
      case 'approve-org': {
        var org = A.approveOrg(el.getAttribute('data-id'));
        ui.toast(org.name + ' approved. They can publish now.');
        break;
      }
      case 'seed-rich': {
        var n = A.seedRichDemo();
        ui.toast(n + ' completed transfer(s) added to the demo.');
        break;
      }
      case 'export-json': exportJson(); break;
      case 'export-csv': exportCsv(); break;
      case 'print': window.print(); break;
      case 'dialog-close': ui.dialogClose(); break;
      case 'reset-open': openReset(); break;
      case 'publish': publish(); break;
      case 'start-tour': startTour(); break;
      case 'tour-next': nextTour(); break;
      case 'tour-exit': endTour(false); break;
      case 'run-lab': {
        var results = AL.scenarios.runAll();
        var ids = Object.keys(results);
        var pass = ids.filter(function (id) { return results[id].pass; }).length;
        ui.toast(pass + ' of ' + ids.length + ' scenarios pass' +
          (pass === ids.length ? ' — every check green.' : ' — open the red rows.'), pass === ids.length ? 'info' : 'error');
        break;
      }
      case 'run-lab-one': {
        var one = AL.scenarios.runOne(el.getAttribute('data-id'));
        if (one) ui.toast(one.id + ' ' + (one.pass ? 'passes all ' + one.checks.length + ' checks.' : 'has ' + one.checks.filter(function (c) { return !c.ok; }).length + ' failing check(s).'), one.pass ? 'info' : 'error');
        break;
      }
      case 'clear-lab':
        commitUI(function (s) { s.ui.lab = {}; });
        ui.toast('Lab results cleared.');
        break;
      default:
        console.warn('Unknown action', act);
    }
  }

  function tryPath(path) {
    switch (path) {
      case 'retail':
        A.setActor('u-buyer');
        go('#/listing/L5');
        ui.toast('Reserve a lunch pack — stock is held for 30 minutes.');
        break;
      case 'donation':
        A.setActor('u-recipient');
        go('#/listing/L2');
        ui.toast('You are a recipient organisation, so the donation gate is open.');
        break;
      case 'bulk':
        A.setActor('u-buyer');
        go('#/listing/L8');
        ui.toast('Wholesale: request 30 kg, then switch to ops to approve it.');
        break;
      case 'handover':
        A.setActor('u-vendor1');
        go('#/workspace');
        ui.toast('Supplier side. Use “Handover” on an incoming pickup.');
        break;
      case 'offline':
        if (store.get().online) A.setOnline(false);
        go('#/pickups');
        ui.toast('Connection is off. Try “Show pass”, or record a handover.', 'error');
        break;
    }
  }

  function openReset() {
    ui.dialogOpen({
      title: 'Reset the demo?',
      sub: 'Every simulated reservation, listing, incident and clock change is discarded.',
      body: '<form data-form="reset">' +
        '<div class="notice" data-tone="warn">' + ui.icon('alert') +
        '<div>The app returns to its first-run seed. Exports you have already downloaded are not affected.</div></div>' +
        '<div class="dialog__foot"><button class="btn" type="button" data-act="dialog-close">Keep my demo</button>' +
        '<button class="btn btn-danger" type="submit">Reset everything</button></div></form>'
    });
  }

  function doDemo(kind) {
    if (kind === '+15' || kind === '+60' || kind === '+1d') {
      var mins = kind === '+15' ? 15 : kind === '+60' ? 60 : 1440;
      var changes = A.advance(mins);
      ui.toast((mins === 1440 ? '1 day' : mins + ' minutes') + ' advanced' +
        (changes.length ? ' · ' + changes.length + ' state change(s): ' + changes[0] : ' · nothing expired'), changes.length ? 'info' : 'info');
      return;
    }
    if (kind === 'seed') {
      var n = A.seedRichDemo();
      ui.toast(n + ' completed transfer(s) added.');
      return;
    }
    if (kind === 'export') { exportJson(); return; }
    if (kind === 'reset') { openReset(); return; }
  }

  /* ----------------------------------------------------------------- wiring */

  function wire() {
    document.addEventListener('click', function (e) {
      var demo = e.target.closest('[data-demo]');
      if (demo) {
        e.preventDefault();
        setMenu(false);
        guard(function () { doDemo(demo.getAttribute('data-demo')); });
        return;
      }
      var actEl = e.target.closest('[data-act]');
      if (actEl && !actEl.matches('select, input, textarea')) {
        e.preventDefault();
        guard(function () { runAction(actEl.getAttribute('data-act'), actEl); });
        return;
      }
      var navEl = e.target.closest('[data-nav]');
      if (navEl) {
        setMenu(false);
        if (navEl.tagName !== 'A') {
          e.preventDefault();
          go(navEl.getAttribute('data-nav'));
          return;
        }
      }
      if (!e.target.closest('.menu')) setMenu(false);
    });

    document.addEventListener('submit', function (e) {
      var form = e.target.closest('form[data-form]');
      if (!form) return;
      e.preventDefault();
      var kind = form.getAttribute('data-form');
      var fd = new FormData(form);

      guard(function () {
        if (kind === 'search') {
          var s = store.get();
          s.ui.filters.q = String(fd.get('q') || '').trim();
          store.save();
          if (location.hash !== '#/discover') location.hash = '#/discover';
          store.emit();
          return;
        }
        if (kind === 'handover') {
          var raw = fd.get('actual');
          var resId = String(fd.get('res'));
          var key = 'ui-' + resId;
          var out = A.confirmHandover(resId, {
            actualQty: raw === '' ? undefined : Number(raw),
            reason: String(fd.get('reason') || '').trim(),
            idempotencyKey: key
          });
          var msg = 'Handover recorded: ' + u.qty(out.transfer.actualQty, out.transfer.unit) +
            (out.transfer.rejectedQty > 0 ? ' · rejected ' + u.qty(out.transfer.rejectedQty, out.transfer.unit) : '') +
            ' · ' + out.transfer.id;
          if (fd.get('retry')) {
            var again = A.confirmHandover(resId, {
              actualQty: raw === '' ? undefined : Number(raw),
              reason: String(fd.get('reason') || '').trim(),
              idempotencyKey: key
            });
            msg += again.idempotent
              ? ' · second scan returned the same record (nothing duplicated)'
              : ' · WARNING: second scan created a new record';
          }
          ui.dialogClose();
          ui.toast(msg);
          return;
        }
        if (kind === 'cancel') {
          A.cancelReservation(String(fd.get('res')), { reason: String(fd.get('reason') || '') });
          ui.dialogClose();
          ui.toast('Hold cancelled. The stock is available to someone else.');
          return;
        }
        if (kind === 'reject') {
          A.rejectAtHandover(String(fd.get('res')), { reason: String(fd.get('reason') || '') });
          ui.dialogClose();
          ui.toast('Offer rejected at the counter. The reason is recorded.');
          return;
        }
        if (kind === 'withdraw') {
          var w = A.withdrawListing(String(fd.get('id')), { reason: String(fd.get('reason') || '') });
          ui.dialogClose();
          ui.toast('Offer withdrawn' + (w.cancelled ? ' · ' + w.cancelled + ' pickup(s) cancelled.' : '.'));
          return;
        }
        if (kind === 'price') {
          var p = A.changePrice(String(fd.get('id')), Number(fd.get('price')));
          ui.dialogClose();
          ui.toast('Price updated.' + (p.affected ? ' ' + p.affected + ' open pickup(s) must re-agree.' : ''));
          return;
        }
        if (kind === 'incident') {
          var I = A.reportIncident({
            listingId: String(fd.get('id')),
            category: String(fd.get('category') || 'other'),
            severity: String(fd.get('severity') || 'medium'),
            note: String(fd.get('note') || '')
          });
          ui.dialogClose();
          ui.toast(I.id + ' opened. The listing is on hold until operations reinstates it.');
          return;
        }
        if (kind === 'decline') {
          A.decideBulk(String(fd.get('br')), false, { reason: String(fd.get('reason') || '') });
          ui.dialogClose();
          ui.toast('Request declined. The requester sees the reason.');
          return;
        }
        if (kind === 'reset') {
          store.reset();
          ui.dialogClose();
          go('#/home');
          ui.toast('Demo reset to the first-run seed.');
          return;
        }
      });
    });

    document.addEventListener('input', function (e) {
      var el = e.target;
      if (el.matches('[data-draft]')) setDraft(el);
      if (el.matches('[data-qty-for]')) updateQuote(el);
    });

    document.addEventListener('change', function (e) {
      var el = e.target;
      if (el.matches('[data-act="filter-select"]')) {
        setFilter(el.getAttribute('data-key'), el.value);
        return;
      }
      if (el.matches('[data-draft]')) {
        setDraft(el);
        if (el.tagName === 'SELECT') {
          commitUI(function (s) { s.ui.draftErrors = []; });
        }
      }
    });

    var actorSelect = document.getElementById('actorSelect');
    if (actorSelect) {
      actorSelect.addEventListener('change', function () {
        A.setActor(actorSelect.value);
        var user = q.user(actorSelect.value);
        ui.toast('Now acting as ' + (user ? user.name : 'another role') + '.');
      });
    }

    var netBtn = document.getElementById('netBtn');
    if (netBtn) netBtn.addEventListener('click', function () {
      guard(function () { runAction('toggle-net', netBtn); });
    });

    var demoBtn = document.getElementById('demoBtn');
    if (demoBtn) demoBtn.addEventListener('click', function () {
      setMenu(document.getElementById('demoMenu').hidden);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var s = store.get();
        if (s.tour && s.tour.active) {
          endTour(false);
          return;
        }
        setMenu(false);
      }
    });

    window.addEventListener('hashchange', render);

    var dlg = document.getElementById('dialog');
    if (dlg) {
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg) ui.dialogClose();
      });
    }
  }

  function setMenu(open) {
    var panel = document.getElementById('demoMenu');
    var btn = document.getElementById('demoBtn');
    if (!panel || !btn) return;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  }

  function setDraft(el) {
    var path = el.getAttribute('data-draft');
    if (!path) return;
    var d = AL.v.draft();
    var value = el.type === 'checkbox' ? el.checked : el.value;
    if (path.indexOf('extra.') === 0) {
      d.extra = d.extra || {};
      d.extra[path.slice(6)] = value;
    } else {
      d[path] = value;
    }
    var s = store.get();
    if (s.ui.draftErrors && s.ui.draftErrors.length) s.ui.draftErrors = [];
  }

  function updateQuote(el) {
    var out = document.getElementById('quoteText');
    if (!out) return;
    var qty = Number(el.value) || 0;
    var price = Number(el.getAttribute('data-price')) || 0;
    var free = el.getAttribute('data-free') === '1';
    out.textContent = free ? 'LKR 0' : u.money(price * qty);
  }

  function buildActors() {
    var s = store.get();
    var sel = document.getElementById('actorSelect');
    if (!sel) return;
    sel.innerHTML = s.users.map(function (user) {
      var org = q.org(user.orgId);
      var tail = user.role === 'merchantAdmin' && org ? ' · ' + org.name : '';
      return '<option value="' + user.id + '">' + u.esc(user.name) + ' · ' + roleShort(user.role) + tail + '</option>';
    }).join('');
    sel.value = s.actorId;
  }

  /* ------------------------------------------------------------------- init */

  function init() {
    store.init();
    buildActors();
    wire();
    store.subscribe(render);
    if (!location.hash) history.replaceState(null, '', '#/home');
    render();
    ui.hydrateIcons(document);
    console.info('%cAgriLoop Prototype 2 — simulated demo. No backend, no real food, no payments.',
      'color:#0f5a3c;font-weight:600');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.AL);
