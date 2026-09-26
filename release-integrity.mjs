import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const positionalRoot = process.argv.slice(2).find((arg) => !arg.startsWith('--')) || '.';
const ROOT = path.resolve(positionalRoot);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.cache', '.gradle']);
const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.html', '.css', '.md', '.json', '.yaml', '.yml', '.txt', '.java', '.kt', '.kts', '.gradle', '.properties', '.xml']);
const TEXT_FILENAMES = new Set(['_headers', 'gradlew']);

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.gitignore') continue;
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name));
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    const ext = path.extname(entry.name).toLowerCase();
    if (TEXT_EXTENSIONS.has(ext) || TEXT_FILENAMES.has(entry.name)) files.push(fullPath);
  }
};
walk(ROOT);
files.sort();

const letterOrMark = /[\p{Letter}\p{Mark}]/u;
const explicitForeignScript = /[\u0370-\u03FF\u0400-\u052F\u0590-\u05FF\u0600-\u06FF\u0900-\u097F\u1100-\u11FF\u1200-\u137F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]/u;
const allowedProjectScript = /^[\p{Script=Latin}\p{Script=Thai}\p{Script=Inherited}]$/u;
const unexpectedScript = (content) => {
  for (const char of content) {
    if (!letterOrMark.test(char)) continue;
    if (!allowedProjectScript.test(char)) return true;
  }
  return false;
};
const invisibleControl = /[\u0000\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/u;
const secretValue = /(?:sk-[A-Za-z0-9_-]{16,}|AIza[0-9A-Za-z_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|-----BEGIN (?:RSA|EC|OPENSSH|PRIVATE) KEY-----)/u;
const injectionMarker = /ignore\s+(?:all|any|the)\s+(?:previous|prior|above)\s+instructions?|system\s+message|developer\s+message|jailbreak|prompt\s+injection|do\s+not\s+follow/iu;
const activeAssignment = /(?:API_KEY|TOKEN|PASSWORD|SECRET|PRIVATE_KEY)\s*[:=]\s*['"][^'"\n]{8,}['"]/iu;
const unsafeDomSink = /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\s*\(|new\s+Function\s*\()/u;
const forbiddenNetwork = /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/u;
const unsafeAndroidBridge = /addJavascriptInterface|setAllowUniversalAccessFromFileURLs\s*\(\s*true\s*\)|setAllowFileAccessFromFileURLs\s*\(\s*true\s*\)|MIXED_CONTENT_ALWAYS_ALLOW|Intent\.ACTION_VIEW|startActivity\s*\(/u;

const findings = [];
for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/');
  const content = fs.readFileSync(file, 'utf8');
  if (explicitForeignScript.test(content) || unexpectedScript(content)) findings.push(`${rel}:unexpected-script`);
  if (invisibleControl.test(content)) findings.push(`${rel}:invisible-control`);
  if (secretValue.test(content)) findings.push(`${rel}:secret-value`);
  if (rel.startsWith('web/public/')) {
    if (injectionMarker.test(content)) findings.push(`${rel}:injection-marker`);
    if (activeAssignment.test(content)) findings.push(`${rel}:active-secret-assignment`);
    if (unsafeDomSink.test(content)) findings.push(`${rel}:unsafe-dom-sink`);
    if (forbiddenNetwork.test(content)) findings.push(`${rel}:forbidden-network`);
  }
  if (rel.startsWith('android/app/src/main/') && unsafeAndroidBridge.test(content)) findings.push(`${rel}:unsafe-android-launch-or-bridge`);
}

const requiredFiles = [
  'web/public/index.html',
  'web/public/styles.css',
  'web/public/app.js',
  'web/public/_headers',
  'android/app/src/main/java/com/subertube/app/MainActivity.java',
  'android/app/src/main/AndroidManifest.xml',
  'scripts/security-preflight.mjs',
  'tests/foreign-content-hard-gate.test.mjs',
  'README.md'
];
for (const rel of requiredFiles) if (!fs.existsSync(path.join(ROOT, rel))) findings.push(`${rel}:missing-required-file`);

const allRelative = files.map((f) => path.relative(ROOT, f).replaceAll(path.sep, '/'));
if (fs.existsSync(path.join(ROOT, '.git'))) findings.push('.git:forbidden-artifact');
const artifactFiles = allRelative.filter((rel) => /(^|\/)[^/]+\.(?:apk|aab)$/i.test(rel) || /(^|\/)FINAL-RELEASE\.zip$/i.test(rel));
artifactFiles.forEach((rel) => findings.push(`${rel}:forbidden-release-artifact-inside-source`));

if (findings.length) {
  findings.forEach((item) => console.error(item));
  process.exit(1);
}

const manifest = [];
for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/');
  if (rel === 'RELEASE-SHA256SUMS.txt') continue;
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  manifest.push(`${hash}  ${rel}`);
}

if (process.argv.includes('--write-manifest')) {
  const out = path.join(ROOT, 'RELEASE-SHA256SUMS.txt');
  fs.writeFileSync(out, `${manifest.join('\n')}\n`);
  console.log(`release-integrity.mjs: PASS (${manifest.length} text files) + manifest written`);
} else {
  console.log(`release-integrity.mjs: PASS (${manifest.length} text files checked)`);
}

if (process.argv.includes('--verify-manifest')) {
  const manifestPath = path.join(ROOT, 'RELEASE-SHA256SUMS.txt');
  if (!fs.existsSync(manifestPath)) {
    console.error('RELEASE-SHA256SUMS.txt: missing');
    process.exit(1);
  }
  const expected = new Map();
  for (const line of fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = /^(\w{64})  (.+)$/.exec(line);
    if (!match) {
      console.error(`Invalid manifest line: ${line}`);
      process.exit(1);
    }
    expected.set(match[2], match[1]);
  }
  for (const [rel, hash] of expected) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) {
      console.error(`Missing manifest file: ${rel}`);
      process.exit(1);
    }
    const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    if (actual !== hash) {
      console.error(`Hash mismatch: ${rel}`);
      process.exit(1);
    }
  }
  console.log(`release-integrity.mjs: manifest verification PASS (${expected.size} files)`);
}
console.log('unexpected foreign-script findings: 0');
console.log('invisible/bidi/control findings: 0');
console.log('secret-value findings: 0');
console.log('unsafe/forbidden runtime findings: 0');
console.log('unsafe Android bridge/external-launch patterns: 0');
console.log('forbidden release artifacts: 0');
