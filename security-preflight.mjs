import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.cache', '.gradle']);
const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.html', '.css', '.md', '.json', '.yaml', '.yml', '.txt', '.java', '.kt', '.kts', '.gradle', '.properties', '.xml']);
const TEXT_FILENAMES = new Set(['_headers', 'gradlew']);

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.gitignore' && entry.name !== '.github') continue;
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
const invisibleControl = /[\u0000\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/u;
const injectionMarker = /ignore\s+(?:all|any|the)\s+(?:previous|prior|above)\s+instructions?|system\s+message|developer\s+message|jailbreak|prompt\s+injection|do\s+not\s+follow/iu;
const secretValue = /(?:sk-[A-Za-z0-9_-]{16,}|AIza[0-9A-Za-z_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|-----BEGIN (?:RSA|EC|OPENSSH|PRIVATE) KEY-----)/u;
const activeAssignment = /(?:API_KEY|TOKEN|PASSWORD|SECRET|PRIVATE_KEY)\s*[:=]\s*['"][^'"\n]{8,}['"]/iu;
const unsafeDomSink = /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\s*\(|new\s+Function\s*\()/u;
const forbiddenNetwork = /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/u;
const unsafeAndroidBridge = /addJavascriptInterface|setAllowUniversalAccessFromFileURLs\s*\(\s*true\s*\)|setAllowFileAccessFromFileURLs\s*\(\s*true\s*\)|MIXED_CONTENT_ALWAYS_ALLOW|Intent\.ACTION_VIEW|startActivity\s*\(/u;

const findings = {
  suspiciousScripts: [],
  invisibleControls: [],
  injectionMarkers: [],
  secretValues: [],
  activeAssignments: [],
  unsafeDomSinks: [],
  forbiddenNetwork: [],
  unsafeAndroidBridge: []
};

const hasUnexpectedProjectScript = (content) => {
  for (const char of content) {
    if (!letterOrMark.test(char)) continue;
    if (!allowedProjectScript.test(char)) return true;
  }
  return false;
};

for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/');
  const content = fs.readFileSync(file, 'utf8');
  if (explicitForeignScript.test(content) || hasUnexpectedProjectScript(content)) findings.suspiciousScripts.push(rel);
  if (invisibleControl.test(content)) findings.invisibleControls.push(rel);
  if (secretValue.test(content)) findings.secretValues.push(rel);

  const runtime = rel.startsWith('web/public/') || rel.startsWith('android/app/src/main/');
  if (runtime) {
    if (injectionMarker.test(content)) findings.injectionMarkers.push(rel);
    if (activeAssignment.test(content)) findings.activeAssignments.push(rel);
    if (rel.startsWith('web/public/') && unsafeDomSink.test(content)) findings.unsafeDomSinks.push(rel);
    if (rel.startsWith('web/public/') && forbiddenNetwork.test(content)) findings.forbiddenNetwork.push(rel);
    if (rel.startsWith('android/app/src/main/') && unsafeAndroidBridge.test(content)) findings.unsafeAndroidBridge.push(rel);
  }
}

const headersPath = path.join(ROOT, 'web', 'public', '_headers');
const headers = fs.readFileSync(headersPath, 'utf8');
const requiredHeaderTokens = [
  "Content-Security-Policy:",
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "connect-src 'self'",
  "frame-src 'self' https://www.youtube.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'Referrer-Policy: strict-origin-when-cross-origin',
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Permissions-Policy: camera=(), microphone=(), geolocation=()'
];
const missingHeaders = requiredHeaderTokens.filter((token) => !headers.includes(token));

const runtimeJs = fs.readFileSync(path.join(ROOT, 'web', 'public', 'app.js'), 'utf8');
const iframeCount = (runtimeJs.match(/document\.createElement\('iframe'\)/g) || []).length;
const youtubeOrigins = (runtimeJs.match(/https:\/\/www\.youtube\.com/g) || []).length;
const hasOnlyExpectedIframeBoundary = iframeCount === 1 && youtubeOrigins >= 2;

const failures = Object.entries(findings).filter(([, list]) => list.length > 0);
if (missingHeaders.length || !hasOnlyExpectedIframeBoundary) {
  if (missingHeaders.length) console.error('Missing header controls:', missingHeaders);
  if (!hasOnlyExpectedIframeBoundary) console.error('Unexpected iframe boundary configuration');
  process.exitCode = 1;
}
if (failures.length) {
  for (const [kind, list] of failures) console.error(`${kind}:`, list);
  process.exitCode = 1;
}
if (process.exitCode) process.exit();

console.log(`security-preflight.mjs: PASS (${files.length} text files scanned)`);
console.log('secret values: 0');
console.log('active secret assignments: 0');
console.log('invisible/bidi/control findings: 0');
console.log('suspicious instruction/injection findings: 0');
console.log('unexpected foreign-script findings: 0');
console.log('unsafe DOM sinks: 0');
console.log('forbidden network APIs in runtime source: 0');
console.log('unsafe Android bridge/external-launch patterns: 0');
console.log('response-header policy: PASS');
console.log('YouTube iframe boundary: PASS');
