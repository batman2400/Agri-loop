/**
 * AgriLoop UI Prototype — idea stage, synthetic data only.
 * No backend. Demonstrates retail/wholesale × sale/donation,
 * listing, reservation, bulk request/accept, handover, cancellation.
 */

const SEED = {
  vendors: [
    { id: 'v1', name: 'Sunrise Bakery', area: 'Dehiwala', type: 'retail', approved: true },
    { id: 'v2', name: 'Green Leaf Stall', area: 'Peliyagoda', type: 'wholesale', approved: true },
    { id: 'v3', name: 'Campus Cafeteria', area: 'Colombo 7', type: 'retail', approved: true }
  ],
  listings: [
    {
      id: 'L1', vendorId: 'v1', stream: 'retail', mode: 'sale',
      title: 'Evening pastry box', description: 'Mixed pastries from today (4–6 items). Best same evening.',
      unit: 'bundle', totalQty: 6, availableQty: 4, priceLkr: 250,
      pickupWindow: 'Today 18:00–19:30', location: 'Sunrise Bakery, Galle Rd, Dehiwala',
      eligibilityCutoff: 'Today 19:30', category: 'Bakery – same day', state: 'active'
    },
    {
      id: 'L2', vendorId: 'v1', stream: 'retail', mode: 'donation',
      title: 'Bread ends (donation)', description: 'Good quality bread ends, suitable for toast or soup kitchens.',
      unit: 'bag', totalQty: 8, availableQty: 5, priceLkr: 0,
      pickupWindow: 'Today 17:30–19:00', location: 'Sunrise Bakery, Galle Rd, Dehiwala',
      eligibilityCutoff: 'Today 19:00', category: 'Bakery – same day', state: 'active'
    },
    {
      id: 'L3', vendorId: 'v2', stream: 'wholesale', mode: 'sale',
      title: 'Grade-B carrots (lot)', description: 'Cosmetic grade variation, firm, suitable for cooking. Estimated weight.',
      unit: 'kg', totalQty: 80, availableQty: 80, priceLkr: 90, minLotKg: 10,
      pickupWindow: 'Tomorrow 07:00–10:00', location: 'Green Leaf Stall, Peliyagoda Market',
      eligibilityCutoff: 'Tomorrow 12:00', category: 'Fresh produce – bulk', state: 'active', lotId: 'LOT-2410-01'
    },
    {
      id: 'L4', vendorId: 'v2', stream: 'wholesale', mode: 'donation',
      title: 'Surplus leafy greens (donation)', description: 'Mixed greens, needs quick use. Organisation collection in this demo.',
      unit: 'kg', totalQty: 40, availableQty: 40, priceLkr: 0, minLotKg: 5,
      pickupWindow: 'Today 16:00–18:00', location: 'Green Leaf Stall, Peliyagoda Market',
      eligibilityCutoff: 'Today 18:30', category: 'Fresh produce – bulk', state: 'active', lotId: 'LOT-2410-02'
    },
    {
      id: 'L5', vendorId: 'v3', stream: 'retail', mode: 'sale',
      title: 'Rice & curry lunch packs', description: 'Remaining lunch packs. Heat if preferred.',
      unit: 'pack', totalQty: 12, availableQty: 7, priceLkr: 180,
      pickupWindow: 'Today 14:00–15:30', location: 'Campus Cafeteria, Colombo 7',
      eligibilityCutoff: 'Today 15:30', category: 'Prepared food – same day', state: 'active'
    }
  ],
  reservations: [],
  bulkRequests: [],
  transfers: []
};

let state = {
  role: 'buyer',
  currentVendorId: 'v1',
  view: 'discover',
  filterStream: 'all',
  filterMode: 'all',
  selectedListingId: null,
  toastTimer: null
};

function loadState() {
  try {
    const saved = localStorage.getItem('agriloop_proto_v1');
    if (saved) {
      const p = JSON.parse(saved);
      SEED.listings = p.listings || SEED.listings;
      SEED.reservations = p.reservations || [];
      SEED.bulkRequests = p.bulkRequests || [];
      SEED.transfers = p.transfers || [];
    }
  } catch (_) {}
}
function persist() {
  localStorage.setItem('agriloop_proto_v1', JSON.stringify({
    listings: SEED.listings,
    reservations: SEED.reservations,
    bulkRequests: SEED.bulkRequests,
    transfers: SEED.transfers
  }));
}
loadState();

function $(id) { return document.getElementById(id); }
function vendorById(id) { return SEED.vendors.find(v => v.id === id); }
function listingById(id) { return SEED.listings.find(l => l.id === id); }
function toast(msg, ms) {
  ms = ms || 2800;
  const el = $('toast');
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(function () { el.style.opacity = '0'; }, ms);
}
function money(lkr) {
  if (lkr === 0) return 'Free (donation)';
  return 'LKR ' + Number(lkr).toLocaleString();
}
function badge(stream, mode) {
  var s = stream === 'retail' ? 'badge-retail' : 'badge-wholesale';
  var m = mode === 'sale' ? 'badge-sale' : 'badge-donation';
  return '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded ' + s + '">' + stream + '</span> ' +
         '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded ' + m + '">' + mode + '</span>';
}
function uid(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function reserveRetail(listingId, qty) {
  qty = qty || 1;
  var L = listingById(listingId);
  if (!L || L.state !== 'active' || L.stream !== 'retail') return toast('Listing unavailable');
  if (L.availableQty < qty) return toast('Not enough stock');
  L.availableQty -= qty;
  var res = {
    id: uid('R'), listingId: listingId, stream: 'retail', mode: L.mode,
    qty: qty, unit: L.unit, priceLkr: L.priceLkr * qty, status: 'reserved',
    createdAt: new Date().toISOString(),
    pickupRef: 'PK-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
    buyerLabel: 'You (demo buyer)'
  };
  SEED.reservations.unshift(res);
  persist();
  toast(L.mode === 'donation' ? 'Donation reserved. Collect with reference.' : 'Reserved. Pay at collection (demo).');
  state.view = 'reservations';
  render();
}

function requestBulk(listingId, qtyKg) {
  var L = listingById(listingId);
  if (!L || L.state !== 'active' || L.stream !== 'wholesale') return toast('Listing unavailable');
  if (qtyKg > L.availableQty) return toast('Requested more than available');
  if (L.minLotKg && qtyKg < L.minLotKg) return toast('Minimum ' + L.minLotKg + ' ' + L.unit);
  var req = {
    id: uid('BR'), listingId: listingId, requestedQty: qtyKg, unit: L.unit,
    status: 'requested', mode: L.mode, createdAt: new Date().toISOString(),
    requesterLabel: 'Demo kitchen / org'
  };
  SEED.bulkRequests.unshift(req);
  persist();
  toast('Request sent. Vendor must accept before stock is reserved.');
  state.view = 'reservations';
  render();
}

function acceptBulk(reqId) {
  var req = SEED.bulkRequests.find(function (r) { return r.id === reqId; });
  if (!req || req.status !== 'requested') return;
  var L = listingById(req.listingId);
  if (!L || L.availableQty < req.requestedQty) {
    req.status = 'declined';
    persist();
    toast('Declined — insufficient remaining stock');
    render();
    return;
  }
  L.availableQty -= req.requestedQty;
  req.status = 'accepted';
  var res = {
    id: uid('R'), listingId: req.listingId, bulkRequestId: req.id,
    stream: 'wholesale', mode: L.mode, qty: req.requestedQty, unit: L.unit,
    priceLkr: L.priceLkr * req.requestedQty, status: 'reserved',
    createdAt: new Date().toISOString(),
    pickupRef: 'PK-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
    buyerLabel: req.requesterLabel
  };
  SEED.reservations.unshift(res);
  persist();
  toast('Accepted. Stock reserved for recipient.');
  render();
}

function declineBulk(reqId) {
  var req = SEED.bulkRequests.find(function (r) { return r.id === reqId; });
  if (!req || req.status !== 'requested') return;
  req.status = 'declined';
  persist();
  toast('Request declined');
  render();
}

function completeHandover(resId, actualQty) {
  var res = SEED.reservations.find(function (r) { return r.id === resId; });
  if (!res || res.status !== 'reserved') return toast('Not an active reservation');
  var L = listingById(res.listingId);
  var accepted = actualQty != null ? Number(actualQty) : res.qty;
  if (isNaN(accepted) || accepted < 0) accepted = res.qty;
  if (accepted > res.qty) accepted = res.qty;
  if (accepted < res.qty && L && L.state === 'active') {
    L.availableQty += (res.qty - accepted);
  }
  res.status = 'collected';
  res.actualQty = accepted;
  res.completedAt = new Date().toISOString();
  SEED.transfers.unshift({
    id: uid('T'), reservationId: res.id, listingId: res.listingId,
    actualQty: accepted, unit: res.unit, mode: res.mode,
    priceLkr: res.mode === 'donation' ? 0 : (L ? L.priceLkr * accepted : res.priceLkr),
    stream: res.stream
  });
  persist();
  toast(accepted < res.qty ? 'Partial handover: ' + accepted + ' ' + res.unit : 'Handover confirmed.');
  render();
}

function cancelReservation(resId) {
  var res = SEED.reservations.find(function (r) { return r.id === resId; });
  if (!res || res.status !== 'reserved') return;
  var L = listingById(res.listingId);
  if (L && L.state === 'active') L.availableQty += res.qty;
  res.status = 'cancelled';
  persist();
  toast('Reservation cancelled. Stock released (if still eligible).');
  render();
}

function withdrawListing(listingId) {
  var L = listingById(listingId);
  if (!L) return;
  L.state = 'withdrawn';
  SEED.reservations.filter(function (r) {
    return r.listingId === listingId && r.status === 'reserved';
  }).forEach(function (r) { r.status = 'vendor-cancelled'; });
  persist();
  toast('Listing withdrawn. Open reservations cancelled.');
  render();
}

function renderDiscover() {
  var list = SEED.listings.filter(function (l) { return l.state === 'active'; });
  if (state.filterStream !== 'all') list = list.filter(function (l) { return l.stream === state.filterStream; });
  if (state.filterMode !== 'all') list = list.filter(function (l) { return l.mode === state.filterMode; });

  var cards = list.map(function (L) {
    var v = vendorById(L.vendorId);
    var priceLabel = L.mode === 'donation'
      ? '<span class="text-pink-700 font-semibold">Free donation</span>'
      : '<span class="text-brand-700 font-semibold">' + money(L.priceLkr) + (L.stream === 'wholesale' ? ' / kg' : '') + '</span>';
    return '<article class="bg-white border border-gray-200 rounded-xl p-3 card-shadow">' +
      '<div class="flex items-start justify-between gap-2 mb-1">' +
        '<h3 class="font-semibold text-sm leading-snug">' + L.title + '</h3>' +
        '<div class="flex gap-1 shrink-0">' + badge(L.stream, L.mode) + '</div>' +
      '</div>' +
      '<p class="text-xs text-gray-600 mb-2">' + L.description + '</p>' +
      '<div class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500 mb-2">' +
        '<span>' + (v ? v.name : 'Vendor') + ' · ' + L.location.split(',')[0] + '</span>' +
        '<span>' + L.availableQty + ' ' + L.unit + ' left</span>' +
        '<span>' + L.pickupWindow + '</span>' +
      '</div>' +
      '<div class="flex items-center justify-between">' + priceLabel +
        '<button data-action="open-listing" data-id="' + L.id + '" class="text-xs font-medium bg-brand-600 text-white px-3 py-1.5 rounded-lg">View & ' +
        (L.stream === 'wholesale' ? 'request' : 'reserve') + '</button>' +
      '</div></article>';
  }).join('') || '<p class="text-sm text-gray-500 text-center py-8">No active offers match filters.</p>';

  return '<div class="p-4 space-y-3">' +
    '<div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[11px] text-amber-900">' +
      '<strong>Prototype notice:</strong> Synthetic data only. No real food, payments, or partners. ' +
      'Confirmed: both streams · sale + donation · recipient collection · free donation channel.' +
    '</div>' +
    '<div class="flex gap-2 flex-wrap">' +
      '<select id="fStream" class="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white">' +
        '<option value="all"' + (state.filterStream==='all'?' selected':'') + '>All streams</option>' +
        '<option value="retail"' + (state.filterStream==='retail'?' selected':'') + '>Retail</option>' +
        '<option value="wholesale"' + (state.filterStream==='wholesale'?' selected':'') + '>Wholesale</option>' +
      '</select>' +
      '<select id="fMode" class="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white">' +
        '<option value="all"' + (state.filterMode==='all'?' selected':'') + '>Sale + donation</option>' +
        '<option value="sale"' + (state.filterMode==='sale'?' selected':'') + '>Sale only</option>' +
        '<option value="donation"' + (state.filterMode==='donation'?' selected':'') + '>Donation only</option>' +
      '</select>' +
    '</div>' +
    '<div class="space-y-3">' + cards + '</div></div>';
}

function renderListingDetail(id) {
  var L = listingById(id);
  if (!L) return '<p class="p-4 text-sm">Listing not found</p>';
  var v = vendorById(L.vendorId);
  var isWholesale = L.stream === 'wholesale';
  var isDonation = L.mode === 'donation';

  var actionBlock;
  if (isWholesale) {
    actionBlock =
      '<div class="space-y-2">' +
        '<label class="text-xs font-medium text-gray-700">Request quantity (' + L.unit + ')' +
          (L.minLotKg ? ' · min ' + L.minLotKg : '') + '</label>' +
        '<input id="bulkQty" type="number" min="' + (L.minLotKg || 1) + '" max="' + L.availableQty +
          '" value="' + Math.min(L.minLotKg || 10, L.availableQty) +
          '" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />' +
        '<p class="text-[11px] text-gray-500">Vendor acceptance required. Stock reserved only after acceptance. You arrange transport.</p>' +
        '<button data-action="request-bulk" data-id="' + L.id +
          '" class="w-full bg-brand-600 text-white font-medium py-2.5 rounded-xl text-sm">Send bulk request</button>' +
      '</div>';
  } else {
    actionBlock =
      '<button data-action="reserve-retail" data-id="' + L.id +
        '" class="w-full bg-brand-600 text-white font-medium py-2.5 rounded-xl text-sm"' +
        (L.availableQty < 1 ? ' disabled' : '') + '>Reserve 1 ' + L.unit +
        (isDonation ? ' (donation)' : '') + '</button>';
  }

  return '<div class="p-4 space-y-4">' +
    '<button data-action="back-discover" class="text-xs text-brand-700 font-medium">← Back to list</button>' +
    '<div><div class="flex gap-1 mb-2">' + badge(L.stream, L.mode) + '</div>' +
      '<h2 class="text-lg font-semibold">' + L.title + '</h2>' +
      '<p class="text-sm text-gray-600 mt-1">' + L.description + '</p></div>' +
    '<dl class="grid grid-cols-2 gap-2 text-xs">' +
      '<div class="bg-gray-50 rounded-lg p-2"><dt class="text-gray-500">Vendor</dt><dd class="font-medium">' + (v ? v.name : '—') + '</dd></div>' +
      '<div class="bg-gray-50 rounded-lg p-2"><dt class="text-gray-500">Available</dt><dd class="font-medium">' + L.availableQty + ' ' + L.unit + '</dd></div>' +
      '<div class="bg-gray-50 rounded-lg p-2"><dt class="text-gray-500">Pickup window</dt><dd class="font-medium">' + L.pickupWindow + '</dd></div>' +
      '<div class="bg-gray-50 rounded-lg p-2"><dt class="text-gray-500">Eligibility cutoff</dt><dd class="font-medium">' + L.eligibilityCutoff + '</dd></div>' +
      '<div class="bg-gray-50 rounded-lg p-2 col-span-2"><dt class="text-gray-500">Location</dt><dd class="font-medium">' + L.location + '</dd></div>' +
      '<div class="bg-gray-50 rounded-lg p-2 col-span-2"><dt class="text-gray-500">Category</dt><dd class="font-medium">' + L.category + '</dd></div>' +
    '</dl>' +
    '<div class="border border-gray-200 rounded-xl p-3">' +
      '<p class="text-sm font-medium mb-1">Price</p>' +
      '<p class="text-xl font-semibold ' + (isDonation ? 'text-pink-700' : 'text-brand-700') + '">' +
        (isDonation ? 'Free donation' : money(L.priceLkr) + (isWholesale ? ' / kg' : '')) + '</p>' +
      '<p class="text-[11px] text-gray-500 mt-1">' +
        (isDonation
          ? 'Zero food price and zero platform fee (working interpretation). You arrange collection.'
          : 'Cash on collection is a proposed pilot option (not selected by owner). Platform records confirmation only.') +
      '</p></div>' +
    actionBlock +
    '<p class="text-[10px] text-gray-400 leading-relaxed">Reservation does not extend the food-eligibility cutoff. This prototype uses localStorage only.</p>' +
  '</div>';
}

function renderReservations() {
  var open = SEED.reservations.filter(function (r) { return r.status === 'reserved'; });
  var past = SEED.reservations.filter(function (r) { return r.status !== 'reserved'; });
  var pendingReqs = SEED.bulkRequests.filter(function (r) { return r.status === 'requested'; });

  function resCard(r) {
    var L = listingById(r.listingId);
    var actions = '';
    if (r.status === 'reserved') {
      actions = '<div class="flex gap-2 mt-2">' +
        '<button data-action="complete-handover" data-id="' + r.id +
          '" class="flex-1 text-xs bg-brand-600 text-white py-1.5 rounded-lg">Confirm handover</button>' +
        (r.stream === 'wholesale'
          ? '<button data-action="partial-handover" data-id="' + r.id +
            '" class="text-xs border border-gray-300 px-2 py-1.5 rounded-lg">Partial qty</button>'
          : '') +
        '<button data-action="cancel-res" data-id="' + r.id +
          '" class="text-xs border border-gray-300 px-2 py-1.5 rounded-lg text-gray-600">Cancel</button></div>';
    }
    return '<article class="border border-gray-200 rounded-xl p-3 bg-white">' +
      '<div class="flex justify-between items-start gap-2 mb-1">' +
        '<h3 class="text-sm font-semibold">' + (L ? L.title : 'Listing') + '</h3>' + badge(r.stream, r.mode) +
      '</div>' +
      '<p class="text-xs text-gray-600">Ref: <span class="font-mono font-medium">' + r.pickupRef + '</span> · ' +
        r.qty + ' ' + r.unit + (r.actualQty != null ? ' → accepted ' + r.actualQty : '') + '</p>' +
      '<p class="text-xs text-gray-500 mt-0.5">Status: <strong>' + r.status + '</strong>' +
        (r.mode === 'sale' ? ' · ' + money(r.priceLkr) : ' · Free') + '</p>' + actions + '</article>';
  }

  return '<div class="p-4 space-y-4"><h2 class="font-semibold text-base">My activity</h2>' +
    (pendingReqs.length ? '<div><h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pending bulk requests</h3>' +
      '<div class="space-y-2">' + pendingReqs.map(function (req) {
        var L = listingById(req.listingId);
        return '<div class="border border-amber-200 bg-amber-50 rounded-lg p-2 text-xs">' +
          (L ? L.title : '') + ' · requested ' + req.requestedQty + ' ' + req.unit + ' · <strong>' + req.status + '</strong></div>';
      }).join('') + '</div></div>' : '') +
    '<div><h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Active reservations</h3>' +
      '<div class="space-y-2">' + (open.length ? open.map(resCard).join('') : '<p class="text-sm text-gray-500">None</p>') + '</div></div>' +
    '<div><h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Past</h3>' +
      '<div class="space-y-2">' + (past.length ? past.slice(0, 8).map(resCard).join('') : '<p class="text-sm text-gray-500">None yet</p>') +
    '</div></div></div>';
}

function renderVendor() {
  var myListings = SEED.listings.filter(function (l) { return l.vendorId === state.currentVendorId; });
  var myReqs = SEED.bulkRequests.filter(function (r) {
    var L = listingById(r.listingId);
    return L && L.vendorId === state.currentVendorId && r.status === 'requested';
  });
  var myOpenRes = SEED.reservations.filter(function (r) {
    var L = listingById(r.listingId);
    return L && L.vendorId === state.currentVendorId && r.status === 'reserved';
  });

  return '<div class="p-4 space-y-4">' +
    '<div class="flex items-center justify-between">' +
      '<h2 class="font-semibold text-base">Vendor workspace</h2>' +
      '<select id="vendorSelect" class="text-xs border rounded-lg px-2 py-1">' +
        SEED.vendors.map(function (v) {
          return '<option value="' + v.id + '"' + (v.id === state.currentVendorId ? ' selected' : '') + '>' + v.name + '</option>';
        }).join('') +
      '</select></div>' +
    '<p class="text-[11px] text-gray-500">Demo only — switch vendor above. Real onboarding would require approval.</p>' +
    (myReqs.length ? '<section><h3 class="text-xs font-semibold text-amber-800 uppercase mb-2">Bulk requests to accept/decline</h3>' +
      '<div class="space-y-2">' + myReqs.map(function (req) {
        var L = listingById(req.listingId);
        return '<div class="border border-amber-300 bg-amber-50 rounded-xl p-3">' +
          '<p class="text-sm font-medium">' + (L ? L.title : '') + '</p>' +
          '<p class="text-xs text-gray-600">Requested ' + req.requestedQty + ' ' + req.unit + ' · ' + req.requesterLabel + '</p>' +
          '<div class="flex gap-2 mt-2">' +
            '<button data-action="accept-bulk" data-id="' + req.id +
              '" class="flex-1 text-xs bg-brand-600 text-white py-1.5 rounded-lg">Accept & reserve</button>' +
            '<button data-action="decline-bulk" data-id="' + req.id +
              '" class="text-xs border border-gray-300 px-3 py-1.5 rounded-lg">Decline</button></div></div>';
      }).join('') + '</div></section>' : '') +
    '<section><h3 class="text-xs font-semibold text-gray-500 uppercase mb-2">Your listings</h3>' +
      '<div class="space-y-2">' + (myListings.map(function (L) {
        return '<div class="border border-gray-200 rounded-xl p-3">' +
          '<div class="flex justify-between items-start"><div>' +
            '<p class="text-sm font-medium">' + L.title + '</p>' +
            '<p class="text-[11px] text-gray-500">' + L.availableQty + '/' + L.totalQty + ' ' + L.unit + ' · ' + L.state + '</p>' +
          '</div>' + badge(L.stream, L.mode) + '</div>' +
          (L.state === 'active'
            ? '<button data-action="withdraw" data-id="' + L.id +
              '" class="mt-2 text-xs text-red-600 border border-red-200 px-2 py-1 rounded-lg">Withdraw listing</button>'
            : '') + '</div>';
      }).join('') || '<p class="text-sm text-gray-500">No listings</p>') + '</div></section>' +
    '<section><h3 class="text-xs font-semibold text-gray-500 uppercase mb-2">Open pickups</h3>' +
      '<div class="space-y-2">' + (myOpenRes.length ? myOpenRes.map(function (r) {
        var L = listingById(r.listingId);
        return '<div class="border border-gray-200 rounded-xl p-3 text-sm">' +
          '<p class="font-medium">' + (L ? L.title : '') + '</p>' +
          '<p class="text-xs text-gray-600">Ref ' + r.pickupRef + ' · ' + r.qty + ' ' + r.unit + ' · ' + r.buyerLabel + '</p>' +
          '<button data-action="complete-handover" data-id="' + r.id +
            '" class="mt-2 w-full text-xs bg-brand-600 text-white py-1.5 rounded-lg">Confirm handover</button></div>';
      }).join('') : '<p class="text-sm text-gray-500">None waiting</p>') + '</div></section>' +
    '<div class="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 leading-relaxed">' +
      '<strong>Prototype limits:</strong> No real stock concurrency, no QR camera, no notifications. ' +
      'Atomic reservation and single-use redemption would be server-side in a real build.</div></div>';
}

function renderAdmin() {
  var active = SEED.listings.filter(function (l) { return l.state === 'active'; }).length;
  var reserved = SEED.reservations.filter(function (r) { return r.status === 'reserved'; }).length;
  var completed = SEED.transfers.length;
  var donatedQty = SEED.transfers.filter(function (t) { return t.mode === 'donation'; })
    .reduce(function (s, t) { return s + (t.actualQty || 0); }, 0);
  var soldValue = SEED.transfers.filter(function (t) { return t.mode === 'sale'; })
    .reduce(function (s, t) { return s + (t.priceLkr || 0); }, 0);

  return '<div class="p-4 space-y-4">' +
    '<h2 class="font-semibold text-base">Admin overview (demo)</h2>' +
    '<div class="grid grid-cols-2 gap-2">' +
      '<div class="bg-brand-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-brand-800">' + active +
        '</p><p class="text-[11px] text-brand-700">Active listings</p></div>' +
      '<div class="bg-blue-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-blue-800">' + reserved +
        '</p><p class="text-[11px] text-blue-700">Open reservations</p></div>' +
      '<div class="bg-green-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-green-800">' + completed +
        '</p><p class="text-[11px] text-green-700">Completed transfers</p></div>' +
      '<div class="bg-pink-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-pink-800">' + donatedQty +
        '</p><p class="text-[11px] text-pink-700">Donation qty (mixed units)</p></div>' +
    '</div>' +
    '<p class="text-xs text-gray-500">Sale transfer value (demo): ' + money(soldValue) + '. Donation platform fee remains zero.</p>' +
    '<section><h3 class="text-xs font-semibold text-gray-500 uppercase mb-2">Recent transfers</h3>' +
      '<div class="space-y-1 text-xs">' +
        (SEED.transfers.slice(0, 10).map(function (t) {
          var L = listingById(t.listingId);
          return '<div class="flex justify-between border-b border-gray-100 py-1.5">' +
            '<span>' + (L ? L.title : t.listingId) + ' · ' + t.actualQty + ' ' + t.unit + '</span>' +
            '<span class="' + (t.mode === 'donation' ? 'text-pink-600' : 'text-brand-700') + '">' + t.mode + '</span></div>';
        }).join('') || '<p class="text-gray-500">None yet — complete a handover to see data</p>') +
      '</div></section>' +
    '<section class="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 space-y-1">' +
      '<p><strong>Confirmed decisions reflected:</strong></p>' +
      '<ul class="list-disc pl-4 space-y-0.5">' +
        '<li>Idea stage — UI prototype with synthetic data</li>' +
        '<li>Both retail and wholesale in scope</li>' +
        '<li>Sale and free donation modes</li>' +
        '<li>Recipient / buyer collection (no delivery fleet)</li>' +
        '<li>Business with free donation channel (zero platform fee on donations)</li>' +
      '</ul>' +
      '<p class="pt-1">Open decisions: payment method, commission rate, sites, individual vs org donation access, stack.</p>' +
    '</section>' +
    '<button id="resetDemo" class="w-full text-xs border border-gray-300 py-2 rounded-lg text-gray-600">Reset demo data</button></div>';
}

function render() {
  var main = $('main');
  $('roleLabel').textContent = state.role.charAt(0).toUpperCase() + state.role.slice(1);

  document.querySelectorAll('.nav-btn').forEach(function (btn) {
    var v = btn.dataset.view;
    if (v === state.view || (state.view === 'listing' && v === 'discover')) {
      btn.classList.add('text-brand-600', 'font-medium');
      btn.classList.remove('text-gray-500');
    } else {
      btn.classList.remove('text-brand-600', 'font-medium');
      btn.classList.add('text-gray-500');
    }
  });

  if (state.view === 'discover') main.innerHTML = renderDiscover();
  else if (state.view === 'listing') main.innerHTML = renderListingDetail(state.selectedListingId);
  else if (state.view === 'reservations') main.innerHTML = renderReservations();
  else if (state.view === 'vendor') main.innerHTML = renderVendor();
  else if (state.view === 'admin') main.innerHTML = renderAdmin();
  else main.innerHTML = renderDiscover();

  bindEvents();
}

function bindEvents() {
  var fs = $('fStream');
  if (fs) fs.onchange = function () { state.filterStream = fs.value; render(); };
  var fm = $('fMode');
  if (fm) fm.onchange = function () { state.filterMode = fm.value; render(); };
  var vs = $('vendorSelect');
  if (vs) vs.onchange = function () { state.currentVendorId = vs.value; render(); };
  var reset = $('resetDemo');
  if (reset) reset.onclick = function () {
    localStorage.removeItem('agriloop_proto_v1');
    location.reload();
  };

  document.querySelectorAll('[data-action]').forEach(function (el) {
    el.onclick = function () {
      var action = el.dataset.action;
      var id = el.dataset.id;
      if (action === 'open-listing') {
        state.selectedListingId = id;
        state.view = 'listing';
        render();
      } else if (action === 'back-discover') {
        state.view = 'discover';
        render();
      } else if (action === 'reserve-retail') {
        reserveRetail(id, 1);
      } else if (action === 'request-bulk') {
        var input = $('bulkQty');
        var qty = input ? Number(input.value) : 10;
        requestBulk(id, qty);
      } else if (action === 'accept-bulk') {
        acceptBulk(id);
      } else if (action === 'decline-bulk') {
        declineBulk(id);
      } else if (action === 'complete-handover') {
        completeHandover(id);
      } else if (action === 'partial-handover') {
        var actual = prompt('Actual accepted quantity (number):');
        if (actual != null) completeHandover(id, actual);
      } else if (action === 'cancel-res') {
        cancelReservation(id);
      } else if (action === 'withdraw') {
        if (confirm('Withdraw this listing and cancel open reservations?')) withdrawListing(id);
      }
    };
  });
}

document.querySelectorAll('.nav-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    state.view = btn.dataset.view;
    render();
  });
});
$('roleBtn').addEventListener('click', function () {
  var roles = ['buyer', 'vendor', 'admin'];
  var i = roles.indexOf(state.role);
  state.role = roles[(i + 1) % roles.length];
  if (state.role === 'vendor') state.view = 'vendor';
  else if (state.role === 'admin') state.view = 'admin';
  else state.view = 'discover';
  render();
});

render();
