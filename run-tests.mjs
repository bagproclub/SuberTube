import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const tests = fs.readdirSync('tests').filter((name) => name.endsWith('.test.mjs')).sort();
for (const test of tests) {
  execFileSync(process.execPath, [`tests/${test}`], { stdio: 'inherit' });
}
execFileSync(process.execPath, ['scripts/security-preflight.mjs'], { stdio: 'inherit' });
console.log(`run-tests.mjs: PASS (${tests.length} test files + security preflight)`);
