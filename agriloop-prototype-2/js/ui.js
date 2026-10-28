/* =============================================================================
   AgriLoop Prototype 2 — shared UI pieces
   Inline SVG only (no icon fonts, no external requests). All strings that can
   contain user or seed text are escaped by the caller before reaching here.
   ========================================================================== */
window.AL = window.AL || {};

(function (AL) {
  'use strict';

  var u = AL.util;

  /* ------------------------------------------------------------------ icons */

  var ICONS = {
    home: '<path d="M4 10.5 12 4l8 6.5"/><path d="M6 9.8V20h12V9.8"/><path d="M10 20v-6h4v6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    ticket: '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"/><path d="M12 7v2M12 11v2M12 15v2"/>',
    store: '<path d="M4 9h16l-1-4H5L4 9Z"/><path d="M5 9v11h14V9"/><path d="M9.5 20v-6h5v6"/>',
    book: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    xCircle: '<circle cx="12" cy="12" r="8"/><path d="m9 9 6 6M15 9l-6 6"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12.5 16V7M17 16v-6"/>',
    play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>',
    pin: '<path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"/><circle cx="12" cy="11" r="2.2"/>',
    info: '<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8.2v.2"/>',
    alert: '<path d="M12 4 3.5 19h17L12 4Z"/><path d="M12 10v4M12 16.6v.2"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h13"/><path d="m13 6 6 6-6 6"/>',
    back: '<path d="M19 12H6"/><path d="m11 6-6 6 6 6"/>',
    download: '<path d="M12 4v10"/><path d="m8 11 4 4 4-4"/><path d="M5 19h14"/>',
    refresh: '<path d="M4 12a8 8 0 0 1 13.6-5.6L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-13.6 5.6L4 15"/><path d="M4 20v-5h5"/>',
    leaf: '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M9 15c2-3 4-5 7-6"/>',
    shield: '<path d="M12 3.5 19 6v6c0 4-3 7-7 8.5C8 19 5 16 5 12V6l7-2.5Z"/><path d="m9 12 2 2 4-4"/>',
    users: '<circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M17.5 14.2A5.5 5.5 0 0 1 21 19"/>',
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2v2h-2zM18 14h2M14 18v2M18 18h2v2"/>',
    edit: '<path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m14 6 4 4"/>',
    scale: '<path d="M12 4v16"/><path d="M5 8h14"/><path d="m5 8-2 5a3 3 0 0 0 4 0L5 8Z"/><path d="m19 8-2 5a3 3 0 0 0 4 0l-2-5Z"/>',
    heart: '<path d="M12 20s-7-4.4-7-9a3.6 3.6 0 0 1 7-1.4A3.6 3.6 0 0 1 19 11c0 4.6-7 9-7 9Z"/>',
    offline: '<path d="M3 3l18 18"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 13a10 10 0 0 1 3-2"/><path d="M16 11a10 10 0 0 1 3 2"/><path d="M12 20h.01"/>',
    spark: '<path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5"/>',
    dot: '<circle cx="12" cy="12" r="3"/>'
  };

  function icon(name, size) {
    var body = ICONS[name] || ICONS.dot;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' +
      (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : '') + '>' + body + '</svg>';
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.firstChild) return;
      el.innerHTML = icon(el.getAttribute('data-icon'));
    });
  }

  /* ------------------------------------------------------------------ chips */

  function chip(text, tone, plain) {
    return '<span class="chip' + (plain ? ' chip--plain' : '') + '" data-tone="' + (tone || 'neutral') + '">' +
      u.esc(text) + '</span>';
  }

  function modeBadge(mode) {
    return mode === 'donation' ? chip('Free donation', 'donation') : chip('Sale', 'sale');
  }

  function streamBadge(stream) {
    return chip(stream === 'wholesale' ? 'Wholesale' : 'Retail', 'neutral', true);
  }

  var STATE_LABELS = {
    reserved: ['Reserved', 'brand'],
    collected: ['Collected', 'ok'],
    'partially-collected': ['Partly collected', 'ok'],
    expired: ['Expired', 'neutral'],
    'no-show': ['No-show', 'danger'],
    cancelled: ['Cancelled', 'neutral'],
    rejected: ['Rejected at pickup', 'danger'],
    'vendor-cancelled': ['Cancelled by vendor', 'danger'],
    active: ['Active', 'brand'],
    draft: ['Draft', 'warn'],
    withdrawn: ['Withdrawn', 'neutral'],
    suspended: ['On hold', 'danger'],
    closed: ['Closed', 'neutral'],
    requested: ['Awaiting decision', 'warn'],
    accepted: ['Accepted', 'ok'],
    declined: ['Declined', 'neutral'],
    open: ['Open', 'danger'],
    resolved: ['Resolved', 'ok']
  };

  function stateChip(state) {
    var m = STATE_LABELS[state] || [String(state).replace(/-/g, ' '), 'neutral'];
    return chip(m[0], m[1]);
  }

  /* ------------------------------------------------------------------ toast */

  var toastTimer = null;
  function toast(msg, tone) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.setAttribute('data-tone', tone || 'info');
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, tone === 'error' ? 5200 : 3200);
  }

  /* ----------------------------------------------------------------- dialog */

  function dialogOpen(o) {
    var dlg = document.getElementById('dialog');
    var body = document.getElementById('dialogBody');
    if (!dlg || !body) return;
    body.innerHTML =
      '<button class="dialog__close" type="button" data-act="dialog-close" aria-label="Close dialog">' + icon('x') + '</button>' +
      '<h2 id="dialogTitle">' + o.title + '</h2>' +
      (o.sub ? '<p class="dlg-sub">' + o.sub + '</p>' : '') +
      o.body +
      (o.foot ? '<div class="dialog__foot">' + o.foot + '</div>' : '');
    if (!dlg.open) dlg.showModal();
    var first = body.querySelector('input:not([type=hidden]), select, textarea, button');
    if (first) first.focus();
  }

  function dialogClose() {
    var dlg = document.getElementById('dialog');
    if (dlg && dlg.open) dlg.close();
  }

  /* --------------------------------------------------------------- pass code */

  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /* A decorative, deterministic "QR-like" block. It is NOT a scannable QR code
     and the app says so wherever it is shown. */
  function passGrid(token) {
    var x = hashSeed(String(token || 'AL'));
    function rnd() {
      x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
      return x / 4294967296;
    }
    var cells = '';
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        var on;
        var corner = (r < 2 && c < 2) || (r < 2 && c > 6) || (r > 6 && c < 2);
        if (corner) on = (r + c) % 2 === 0;
        else on = rnd() > 0.52;
        cells += '<i class="' + (on ? 'on' : '') + '"></i>';
      }
    }
    return '<div class="pass__code" aria-hidden="true">' + cells + '</div>';
  }

  /* ------------------------------------------------------------------ meter */

  function meter(value, total) {
    var pct = total > 0 ? Math.max(0, Math.min(100, (value / total) * 100)) : 0;
    return '<div class="meter" role="img" aria-label="' + Math.round(pct) + '% still available">' +
      '<span style="width:' + pct.toFixed(1) + '%"></span></div>';
  }

  AL.ui = {
    icon: icon,
    icons: ICONS,
    hydrateIcons: hydrateIcons,
    chip: chip,
    modeBadge: modeBadge,
    streamBadge: streamBadge,
    stateChip: stateChip,
    toast: toast,
    dialogOpen: dialogOpen,
    dialogClose: dialogClose,
    passGrid: passGrid,
    meter: meter
  };
})(window.AL);
