import fs from 'node:fs';
import path from 'node:path';

const targetFile = process.argv[2];
if (!targetFile) {
  console.error('Usage: node scripts/preflight-content.mjs <markdown-file>');
  process.exit(1);
}

const fullPath = path.isAbsolute(targetFile) ? targetFile : path.join(process.cwd(), targetFile);
if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`);
  process.exit(1);
}

const content = fs.readFileSync(fullPath, 'utf8');
const missing = [...content.matchAll(/\[MISSING_LINK:\s*([^\]]+)\]/g)].map((m) => m[1].trim());
const amazonLinks = [...content.matchAll(/https?:\/\/(?:amzn\.to|www\.amazon\.com|amazon\.com)[^\s)"']+/g)].map((m) => m[0]);
const missingTag = amazonLinks.filter((url) => !/[?&]tag=epickor2026-20\b/.test(url));

console.log(`Preflight file: ${targetFile}`);
console.log(`Amazon links found: ${amazonLinks.length}`);

if (missingTag.length > 0) {
  console.log('\n[FAIL] Links missing required store tag:');
  missingTag.forEach((link) => console.log(`- ${link}`));
}

if (missing.length > 0) {
  console.log('\n[MISSING_LINK REPORT]');
  missing.forEach((item) => console.log(`- [MISSING_LINK: ${item}]`));
}

if (missingTag.length === 0 && missing.length === 0) {
  console.log('\n[PASS] No missing links and all Amazon URLs include tag=epickor2026-20');
  process.exit(0);
}

process.exit(2);
