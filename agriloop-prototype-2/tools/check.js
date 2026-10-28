#!/usr/bin/env node
/* Run the 18 scenario checks without a browser.
   Usage: node tools/check.js
   Exits non-zero if any scenario fails. */

const path = require('path');

global.window = global;
const mem = Object.create(null);
global.localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; }
};

require(path.join(__dirname, '..', 'js', 'core.js'));
require(path.join(__dirname, '..', 'js', 'scenarios.js'));

AL.store.init();

let passed = 0;
const failures = [];

for (const def of AL.scenarios.list) {
  const result = AL.scenarios.runOne(def.id);
  const failed = result.checks.filter((c) => !c.ok);
  if (result.pass) {
    passed++;
    console.log(`PASS  ${def.id}  ${def.name}  (${result.checks.length} checks)`);
  } else {
    console.log(`FAIL  ${def.id}  ${def.name}`);
    for (const c of failed) console.log(`        x ${c.label} :: ${c.detail}`);
    failures.push(def.id);
  }
}

console.log(`\n${passed}/${AL.scenarios.list.length} scenarios pass`);
if (failures.length) {
  console.log(`Failing: ${failures.join(', ')}`);
  process.exitCode = 1;
}
