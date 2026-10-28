/* =============================================================================
   AgriLoop Prototype 2 — Learn & glossary, Scenario lab
   ========================================================================== */
window.AL = window.AL || {};

(function (AL) {
  'use strict';

  var u = AL.util;
  function S() { return AL.store.get(); }
  function esc(v) { return u.esc(v); }
  var v = AL.v;

  /* ------------------------------------------------------------------- lab */

  function lab() {
    var s = S();
    var results = (s.ui.lab && s.ui.lab.results) || {};
    var defs = AL.scenarios.list;
    var done = defs.filter(function (d) { return results[d.id]; });
    var passed = done.filter(function (d) { return results[d.id].pass; });
    var failed = done.length - passed.length;
    var allPass = done.length === defs.length && failed === 0;

    var summary = '<div class="grid cols-4" style="margin:18px 0 16px">' +
      v.stat('Scenarios', String(defs.length), '', 'Executable acceptance checks') +
      v.stat('Run', done.length + ' / ' + defs.length, '', done.length ? 'Last run ' + esc(u.fmtTime(s.ui.lab.lastRun)) : 'Nothing run yet') +
      v.stat('Passing', String(passed.length), '', failed ? failed + ' failing' : 'No failures') +
      v.stat('Mode', 'Scratch', '', 'Your demo data is restored') +
      '</div>';

    var toolbar = '<div class="row" style="margin-bottom:6px">' +
      '<button class="btn btn-primary" type="button" data-act="run-lab">' + AL.ui.icon('play') + ' Run all 18</button>' +
      (done.length ? '<button class="btn btn-ghost" type="button" data-act="clear-lab">Clear results</button>' : '') +
      '<span class="chip chip--plain" data-tone="' + (done.length === 0 ? 'neutral' : allPass ? 'ok' : 'danger') + '">' +
      (done.length === 0 ? 'Not run yet' : allPass ? 'All checks pass' : failed + ' failing') + '</span>' +
      '</div>';

    var rows = defs.map(function (d) {
      var r = results[d.id];
      var result = '';
      if (r) {
        result = '<div class="result" data-ok="' + r.pass + '">' +
          '<div class="row row--between"><strong>' + (r.pass ? 'Pass' : 'Fail') + '</strong>' +
          '<span class="tiny">' + r.checks.length + ' checks · ' + esc(u.fmtTime(r.at)) + '</span></div>' +
          '<ol style="margin:8px 0 0;padding-left:18px;color:var(--muted)">' +
          r.steps.map(function (step) { return '<li>' + esc(step) + '</li>'; }).join('') + '</ol>' +
          '<ul>' + r.checks.map(function (chk) {
            return '<li>' + (chk.ok ? '✓' : '✕') + ' <strong>' + esc(chk.label) + '</strong>' +
              (chk.detail ? ' <code>' + esc(chk.detail) + '</code>' : '') + '</li>';
          }).join('') + '</ul></div>';
      }
      return '<article class="scenario">' +
        '<div class="scenario__id">' + d.id + '</div>' +
        '<div><p class="scenario__name">' + esc(d.name) + '</p>' +
        '<p class="scenario__why">' + esc(d.why) + '</p></div>' +
        '<div class="row" style="gap:6px">' +
        (r ? AL.ui.chip(r.pass ? 'Pass' : 'Fail', r.pass ? 'ok' : 'danger', true) : AL.ui.chip('Not run', 'neutral', true)) +
        '<button class="btn btn-sm" type="button" data-act="run-lab-one" data-id="' + d.id + '">Run</button></div>' +
        (result ? '<div class="scenario__result">' + result + '</div>' : '') +
        '</article>';
    }).join('');

    return v.head({
      eyebrow: 'Scenario lab · executable checks',
      title: '18 ways this demo could lie — and the checks that stop it',
      lede: 'Each scenario drives the real domain model, not a mock. It runs on a fresh seed, asserts outcomes, then puts your demo data back exactly as it was.',
      actions: '<button class="btn btn-primary" type="button" data-act="run-lab">' + AL.ui.icon('play') + ' Run all 18</button>'
    }) +
      v.notice('info', 'Safe to run.',
        'Your reservations, clock and exports are snapshotted before a run and restored after it. The checks execute in a muted store, so the page does not flicker through every simulated click.') +
      v.notice('neutral', 'What this proves.',
        'Stock arithmetic, permissions, expiry, duplicate scans, offline refusal, price re-agreement, incident holds and unit separation behave as described. ' +
        'It does <strong>not</strong> prove food safety, legal compliance, demand, or that a real payment provider would behave this way — none of those are in this prototype.', 'shield') +
      '<div data-tour="lab">' + summary + toolbar + '<section class="card" style="margin-top:12px">' + rows + '</section></div>';
  }

  /* ----------------------------------------------------------------- learn */

  var GLOSSARY = [
    ['Surplus', 'Safe food a business cannot sell before it stops being suitable. It is not waste yet.', 'The whole product exists to move this food before the cutoff.'],
    ['Stream', 'Retail (boxes, bags, packs) or wholesale (bulk, by weight).', 'The two streams have different units and different minimum orders.'],
    ['Mode', 'Sale (a price) or donation (free).', 'Every offer is exactly one of the four stream × mode combinations.'],
    ['Listing / offer', 'One batch of surplus with a quantity, window, cutoff and food-safety details.', 'This is what appears on Discover.'],
    ['Lot', 'A traced intake of produce, with declared and measured weight.', 'Wholesale offers point back to a lot so a weight dispute is answerable.'],
    ['Hold / reservation', 'A 30-minute claim on stock. Stock is deducted immediately.', 'Two people cannot hold the same unit. Expiry returns it to the pool.'],
    ['Pass / reference', 'The collector’s proof, shown as a reference plus a decorative code.', 'A pass is not a payment and cannot be redeemed offline.'],
    ['Handover', 'The moment the supplier records what was actually accepted.', 'Only a handover creates a transfer, sale value or rescued weight.'],
    ['Partial handover', 'The collector takes less than was held, with a reason.', 'Rejected food stays with the supplier and is not counted as rescued.'],
    ['Eligibility cutoff', 'The time after which the food may no longer be promised.', 'It is earlier than the collection window closes, so nobody is promised unsafe food.'],
    ['Collection window', 'The period in which the collector may pick up.', 'Self-collection only: there is no delivery in this model.'],
    ['Expiry / no-show', 'A hold that ran out, or a window that closed without collection.', 'The stock returns automatically; the outcome stays in history.'],
    ['Recipient organisation', 'An approved community kitchen, welfare home or canteen.', 'Under the proposed policy, only recipients may reserve donations.'],
    ['Vendor / merchant', 'The business listing surplus.', 'Must be approved before publishing; can only act on its own offers.'],
    ['Operations (ops)', 'The platform team role.', 'Approves vendors, resolves incidents and can reinstate held listings.'],
    ['Platform fee', 'What AgriLoop would charge on a completed transfer.', 'Zero in this prototype, and zero on donations by decision.'],
    ['Idempotency', 'Doing the same operation twice has the same effect as doing it once.', 'A double scan returns the first transfer instead of creating a second.'],
    ['Unit separation', 'Kilograms and portions are never added together.', 'The earlier prototype summed them into one “rescued” number; this one refuses to.'],
    ['Invariant', 'A rule that must always hold, checked against live data.', 'For example: stock never negative, one handover per pickup.'],
    ['Audit trail', 'An append-only list of who did what, when.', 'Withdrawals, refusals and demo actions all leave a trace.'],
    ['Proposed vs confirmed', 'A decision the team has settled versus one still open.', 'The UI labels open decisions instead of pretending they are settled.'],
    ['Scenario lab', 'The 18 executable checks above.', 'It is the difference between “the demo looked fine” and “the rules hold”.']
  ];

  var DECISIONS = [
    ['Idea stage, simulated product', 'Confirmed', 'No payments, deliveries or real partners. Every screen says so.'],
    ['Retail and wholesale streams', 'Confirmed', 'Both streams, with kg kept separate from portions.'],
    ['Sale and free donation', 'Confirmed', 'Mode on every offer; donations forced to zero price.'],
    ['Self-collection only', 'Confirmed', 'Pickup window and address; no delivery fields anywhere.'],
    ['Business with a free donation channel', 'Confirmed', 'Donations are a first-class flow, not a leftover listing type.'],
    ['Zero fee on donations', 'Confirmed', 'Donation transfers record feeLkr = 0 and value 0.'],
    ['Zero platform fee on sales', 'Working assumption — confirm', 'Implemented as 0%. The 5% illustration is not built in.'],
    ['Donations limited to approved organisations', 'Proposed — open', 'Enforced in the model, and labelled as policy wherever it appears.'],
    ['First-eligible donation allocation', 'Proposed — open', 'No priority queue: the remainder goes to whoever can take it now.'],
    ['Vendor approval by operations', 'Prototype convention', 'Unapproved vendors can draft but cannot publish.'],
    ['30-minute hold, 30-minute window grace', 'Prototype convention', 'Set in <span class="code">js/core.js</span>; easy to change.'],
    ['Daily cutoff before window close', 'Prototype convention', 'Prevents promising food that is no longer eligible.']
  ];

  function learn() {
    var s = S();
    var catRows = s.categories.map(function (c) {
      return '<tr><td><strong>' + esc(c.name) + '</strong><div class="tiny mono">' + esc(c.version) + '</div></td>' +
        '<td>' + esc(c.rule) + '</td>' +
        '<td>' + c.required.map(function (f) { return esc(f.label); }).join('<br>') + '</td></tr>';
    }).join('');

    var glossary = '<div class="grid cols-2">' + GLOSSARY.map(function (g) {
      return '<div class="card card--pad-sm"><p style="font-weight:650;font-size:13.5px">' + g[0] + '</p>' +
        '<p class="tiny" style="margin:2px 0 6px">' + g[1] + '</p>' +
        '<p class="tiny" style="color:var(--muted-2)"><strong>Why it matters:</strong> ' + g[2] + '</p></div>';
    }).join('') + '</div>';

    var decisions = '<div class="table--scroll"><table class="table">' +
      '<thead><tr><th>Decision</th><th>Status</th><th>How this prototype reflects it</th></tr></thead><tbody>' +
      DECISIONS.map(function (d) {
        var tone = /Confirmed/.test(d[1]) ? 'ok' : /open|confirm/i.test(d[1]) ? 'warn' : 'neutral';
        return '<tr><td>' + d[0] + '</td><td>' + AL.ui.chip(d[1], tone, true) + '</td><td class="tiny">' + d[2] + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="footnote" style="margin-top:8px">Only the decisions the prototype actually implements are listed. Open decisions stay visibly open; they are not presented as settled.</p>';

    var roles = '<div class="table--scroll"><table class="table">' +
      '<thead><tr><th>Role</th><th>Reserve sale</th><th>Reserve donation</th><th>Publish</th><th>Record handover</th><th>Approve / hold</th></tr></thead><tbody>' +
      [
        ['Individual buyer', 'Yes', 'No (proposed policy)', 'No', 'No', 'No'],
        ['Recipient organisation', 'Yes', 'Yes', 'No', 'No', 'No'],
        ['Vendor admin (own org)', 'No', 'No', 'Yes, if approved', 'Own offers only', 'Report incident'],
        ['Operations', 'No', 'No', 'Yes, on behalf', 'Any offer', 'Approve, hold, reinstate']
      ].map(function (r) {
        return '<tr><td><strong>' + r[0] + '</strong></td>' + r.slice(1).map(function (x) {
          var tone = /^Yes/.test(x) ? 'ok' : x === 'No' ? 'neutral' : 'warn';
          return '<td>' + AL.ui.chip(x, tone, true) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="footnote" style="margin-top:8px">The UI hides actions a role cannot use, and the model throws <span class="code">FORBIDDEN</span> even if the call is forced. Scenario S13 demonstrates it.</p>';

    var compare = '<div class="table--scroll"><table class="table">' +
      '<thead><tr><th>Aspect</th><th>Prototype 1 (<span class="code">agriloop-ui/</span>)</th><th>Prototype 2 (this app)</th></tr></thead><tbody>' +
      [
        ['Dependencies', 'Tailwind from a CDN; fails offline', 'None — local CSS and JS, works from the file system'],
        ['Layout', 'Mobile-only column (max-w-md)', 'Desktop sidebar and mobile tab bar; print styles'],
        ['Screens', '4', '8, including a glossary, scenario lab and ops ledger'],
        ['Stock', 'Stored availableQty, can drift', 'Derived from total − holds − collected'],
        ['Expiry', 'None', '30-minute holds, no-shows, automatic release'],
        ['Duplicate scans', 'None', 'Idempotency key per handover'],
        ['Offline', 'Not modelled', 'Reservation and handover refused, with the reason'],
        ['Permissions', 'Switch roles, no enforcement', 'Enforced in the model; cross-org calls refused'],
        ['Metrics', 'Mixed kg with portions', 'Separate ledgers; holds never counted as rescued'],
        ['Food safety', 'Free-text only', 'Category rule + required fields + cutoff'],
        ['Traceability', 'None', 'Lots with declared vs measured weight'],
        ['Incidents', 'None', 'Report holds listing; ops resolves and reinstates'],
        ['Audit', 'None', 'Every action logged, including demo actions'],
        ['Export', 'None', 'JSON and CSV, generated locally'],
        ['Newcomer help', 'Short README', 'Guided tour, glossary, plain-language notices'],
        ['Verification', 'Manual', '18 executable scenario checks'],
        ['Accessibility', 'Zoom locked, colour-only badges', 'No zoom lock, focus-visible, 40px targets, text labels']
      ].map(function (r) {
        return '<tr><td><strong>' + r[0] + '</strong></td><td class="tiny">' + r[1] + '</td><td class="tiny">' + r[2] + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    var script = '<ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.7">' +
      '<li>Open <strong>Start here</strong> and pick a role. Every role is a different view of the same data.</li>' +
      '<li>Use <strong>Discover</strong> to reserve a pastry box (sale) and bread ends (donation, as a recipient).</li>' +
      '<li>Open <strong>My pickups</strong>. Show the pass. The code block is decorative; the reference is the identifier.</li>' +
      '<li>Switch to <strong>Sunrise Bakery</strong> in the top bar, open <strong>Workspace</strong>, and record a partial handover with a reason.</li>' +
      '<li>Open <strong>Ops dashboard</strong>. Point out that weight and portions are separate, and that holds are not revenue.</li>' +
      '<li>In <strong>Demo tools</strong>, advance 75 minutes. The unused hold expires and the stock returns.</li>' +
      '<li>Turn the connection off and try to redeem a pass. It is refused, with the reason.</li>' +
      '<li>Finish on the <strong>Scenario lab</strong>. Run all 18. Seconds of checks beat ten minutes of claims.</li>' +
      '</ol>';

    return v.head({
      eyebrow: 'Learn · plain language',
      title: 'What every word in this app means',
      lede: 'Written for someone seeing AgriLoop for the first time. No prior knowledge of food rescue, marketplaces or software is assumed.',
      actions: '<button class="btn btn-primary" type="button" data-act="start-tour">' + AL.ui.icon('play') + ' Take the guided tour</button>' +
        '<a class="btn" href="#/lab" data-nav="#/lab">Scenario lab</a>'
    }) +
      v.card('The one-paragraph version',
        'If you read nothing else, read this.',
        '<p style="font-size:14px;line-height:1.65">A bakery, stall or canteen has safe food it cannot sell today. It lists the food with a collection window, a cutoff and the safety details. ' +
        'A buyer pays a discounted price, or an approved recipient organisation takes it free. They collect in person and show a pass. ' +
        'The supplier records what was actually accepted. That single record updates stock, the rescued totals and the audit trail. ' +
        'Holds expire, duplicate scans do nothing, and nothing can be redeemed offline. This prototype simulates all of it with synthetic data.</p>') +
      '<div class="section-head"><h2 class="section">Words used in this app</h2><p class="section-sub">Tap-free definitions, in the order you will meet them.</p></div>' +
      glossary +
      '<div class="section-head"><h2 class="section">Decisions this prototype implements</h2>' +
      '<p class="section-sub">Confirmed, proposed and prototype-only decisions are labelled differently.</p></div>' +
      '<section class="card">' + decisions + '</section>' +
      '<div class="section-head"><h2 class="section">Who can do what</h2><p class="section-sub">Roles are switchable for the demo; permissions are not.</p></div>' +
      '<section class="card">' + roles + '</section>' +
      '<div class="section-head"><h2 class="section">Food safety rules by category</h2><p class="section-sub">From the seeded policy set. A listing cannot publish without the required fields.</p></div>' +
      '<section class="card"><div class="table--scroll"><table class="table">' +
      '<thead><tr><th>Category</th><th>Rule</th><th>Required at listing</th></tr></thead><tbody>' + catRows + '</tbody></table></div></section>' +
      '<div class="section-head"><h2 class="section">Prototype 1 → Prototype 2</h2><p class="section-sub">What actually changed, in plain terms.</p></div>' +
      '<section class="card">' + compare + '</section>' +
      '<div class="split" style="margin-top:22px"><div class="stack">' +
      v.card('A five-minute demo script', 'For the pitch rehearsal', script) +
      '</div><div class="stack">' +
      v.card('What this is not', 'Explicit non-claims',
        '<ul style="margin:0;padding-left:18px;font-size:12.5px;line-height:1.7;color:var(--ink-2)">' +
        '<li>Not a live service. No backend, API or database.</li>' +
        '<li>No authentication. The actor picker is a demo control.</li>' +
        '<li>No payments, refunds or fee collection.</li>' +
        '<li>No delivery or logistics.</li>' +
        '<li>No real QR scanning — the code block is decorative.</li>' +
        '<li>No claim of food-safety certification or legal compliance.</li>' +
        '<li>No real vendors, recipients or partners.</li>' +
        '<li>Data lives in this browser’s localStorage only.</li>' +
        '</ul>') +
      v.notice('warn', 'One open question is visible on purpose.',
        'Whether individuals may reserve free donations is a proposed decision, not a settled one. The demo enforces “organisations only” and says so wherever it blocks someone.', 'shield') +
      '</div></div>';
  }

  AL.views.lab = lab;
  AL.views.learn = learn;
})(window.AL);
