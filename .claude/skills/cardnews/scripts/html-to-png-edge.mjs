#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const args = process.argv.slice(2);
const slugIndex = args.indexOf('--slug');
const slug = slugIndex >= 0 ? args[slugIndex + 1] : '';
const cardIndex = args.indexOf('--card');
const onlyCard = cardIndex >= 0 ? Number(args[cardIndex + 1]) : null;

if (!slug) {
  console.error('Usage: node .claude/skills/cardnews/scripts/html-to-png-edge.mjs --slug 124 [--card 01]');
  process.exit(2);
}

function findOutputDir(targetSlug) {
  const base = path.join(root, 'output', 'cardnews');
  const exact = path.join(base, targetSlug);
  if (fs.existsSync(exact)) return exact;
  const prefixed = fs.readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.endsWith(`_${targetSlug}`))
    .map((entry) => path.join(base, entry.name))
    .sort();
  return prefixed.at(-1) || exact;
}

function parseScript(scriptPath) {
  const content = fs.readFileSync(scriptPath, 'utf8');
  const header = content.split(/^## Card\s+\d+/m)[0] || '';
  const topic = (header.match(/^topic:\s*(.+)$/m) || [null, 'Korean Culture'])[1].trim();
  const visualStyle = (header.match(/^style:\s*(.+)$/m) || [null, ''])[1].trim();
  const blocks = content.split(/\n(?=## Card\s+\d+)/g).filter((block) => /^## Card\s+\d+/m.test(block));

  return blocks.map((block, index) => {
    const card = {
      number: index + 1,
      role: (block.match(/^## Card\s+\d+\s*-\s*(.+)$/m) || [null, `Card ${index + 1}`])[1],
      layout: 'B',
      pointColor: 'Gold',
      theme: 'bright',
      kicker: '',
      image: '',
      imageOpacity: '0.8',
      imageZoom: '1.1',
      imagePosition: 'center center',
      imageLabel: '',
      coverStyle: '',
      visualStyle,
      main: '',
      sub: '',
      topic,
    };

    for (const rawLine of block.split('\n')) {
      const line = rawLine.trim();
      if (line.startsWith('layout:')) card.layout = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('point_color:')) card.pointColor = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('theme:')) card.theme = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('kicker:')) card.kicker = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('image:')) card.image = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('image_opacity:')) card.imageOpacity = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('image_zoom:')) card.imageZoom = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('image_position:')) card.imagePosition = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('image_label:')) card.imageLabel = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('cover_style:')) card.coverStyle = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('visual_style:')) card.visualStyle = line.split(':').slice(1).join(':').trim();
      if (line.startsWith('**Main:**')) card.main = line.replace('**Main:**', '').trim();
      if (line.startsWith('**Sub:**')) card.sub = line.replace('**Sub:**', '').trim();
    }
    return card;
  });
}

function htmlText(text) {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function imageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  const fullPath = imagePath.startsWith('/')
    ? path.join(root, 'public', imagePath.slice(1))
    : path.join(root, imagePath);
  if (!fs.existsSync(fullPath)) return '';
  return pathToFileURL(fullPath).href;
}

function renderSeoulAfterDarkHtml(card) {
  const img = imageUrl(card.image);
  const number = String(card.number).padStart(2, '0');
  const layout = card.layout.toUpperCase().trim();
  const mainLength = (card.main || '').replace(/\\n/g, '').length;
  const mainSize = mainLength > 34 ? 68 : mainLength > 27 ? 74 : 82;
  const position = card.imagePosition || 'center center';
  const zoom = card.imageZoom || '1';
  const contentClass = layout === 'E' ? 'right' : layout === 'C' ? 'center-mid' : layout === 'D' ? 'center-cta' : 'left';

  if (layout === 'F') {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1080px;overflow:hidden;font-family:Segoe UI,Arial,Noto Sans KR,Malgun Gothic,sans-serif;background:#06111d;color:#fff}.card{position:relative;width:1080px;height:1080px;overflow:hidden;background:#06111d}.bg{position:absolute;inset:0;background-image:url("${img}");background-size:cover;background-position:${position};transform:scale(${zoom});opacity:.96;filter:saturate(1.08) contrast(1.08) brightness(.66)}.shade{position:absolute;inset:0;background:radial-gradient(circle at 50% 48%,rgba(8,24,41,.08) 0%,rgba(4,15,28,.22) 52%,rgba(2,9,18,.58) 100%),linear-gradient(180deg,rgba(2,11,21,.22) 0%,rgba(2,12,24,.06) 34%,rgba(2,13,27,.58) 70%,rgba(2,10,20,.38) 100%)}.axis-v{position:absolute;top:0;bottom:0;left:50%;width:2px;transform:translateX(-1px);background:linear-gradient(180deg,rgba(231,174,47,.04),rgba(255,193,58,.78) 26%,rgba(255,193,58,.22) 72%,rgba(231,174,47,.08));box-shadow:0 0 13px rgba(255,183,42,.34)}.axis-h{position:absolute;left:0;right:0;top:53%;height:2px;background:linear-gradient(90deg,rgba(231,174,47,.06),rgba(255,193,58,.78) 18%,rgba(255,193,58,.26) 50%,rgba(255,193,58,.78) 82%,rgba(231,174,47,.06));box-shadow:0 0 12px rgba(255,183,42,.28)}.wm{position:absolute;top:32px;left:40px;z-index:20;display:flex;align-items:center;gap:12px;color:#e7b84f;font-size:12px;font-weight:850;letter-spacing:.18em}.ek{width:34px;height:34px;border:1px solid rgba(231,184,79,.82);display:grid;place-items:center;letter-spacing:0}.page{position:absolute;top:34px;right:42px;z-index:20;color:#e7b84f;font-weight:900;font-size:20px}.content{position:absolute;left:46px;right:46px;top:322px;z-index:8;text-align:center;display:flex;flex-direction:column;align-items:center}.kicker{display:inline-flex;align-items:center;width:max-content;max-width:820px;padding:12px 20px;border:2px solid #d89a24;background:rgba(6,14,24,.84);color:#fff4d5;font-size:18px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;box-shadow:0 0 16px rgba(255,178,38,.42),inset 0 0 14px rgba(255,181,41,.08)}.spark{position:relative;width:94px;height:3px;margin:30px auto 34px;background:#f1b530;box-shadow:0 0 13px rgba(255,184,42,.75)}.spark:after{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;transform:translate(-50%,-50%) rotate(45deg);background:#fff3c7;box-shadow:0 0 16px 5px rgba(255,182,39,.78)}.main{font-size:${mainLength > 30 ? 94 : 108}px;font-weight:950;color:#ffc94f;line-height:.91;margin-bottom:26px;letter-spacing:-.025em;text-shadow:0 0 2px #fff1b0,0 0 9px rgba(255,192,52,.78),0 5px 28px rgba(0,0,0,.74)}.sub{max-width:840px;font-size:32px;font-weight:780;color:#ffe3a4;line-height:1.25;word-break:keep-all;text-shadow:0 3px 16px rgba(0,0,0,.88)}.mark{position:absolute;right:36px;bottom:28px;z-index:20;padding:10px 15px;border:1px solid rgba(231,184,79,.72);background:rgba(5,14,24,.76);font-size:11px;font-weight:900;letter-spacing:.16em;color:#e7b84f}</style>
</head>
<body>
<section class="card">
  ${img ? `<div class="bg"></div>` : ''}<div class="shade"></div><div class="axis-v"></div><div class="axis-h"></div>
  <div class="wm"><div class="ek">EK</div><div>EPICKOR.COM</div></div><div class="page">${number}</div>
  <div class="content"><div class="kicker">${htmlText(card.kicker || card.topic)}</div><div class="spark"></div><div class="main">${htmlText(card.main)}</div><div class="sub">${htmlText(card.sub)}</div></div>
  <div class="mark">EPICKOR.COM</div>
</section>
</body>
</html>`;
  }

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1080px;overflow:hidden;font-family:Segoe UI,Arial,Noto Sans KR,Malgun Gothic,sans-serif;background:#06111d;color:#fff}.card{position:relative;width:1080px;height:1080px;overflow:hidden;background:#06111d}.bg{position:absolute;inset:0;background-image:url("${img}");background-size:cover;background-position:${position};transform:scale(${zoom});opacity:.97;filter:saturate(1.08) contrast(1.08) brightness(.62)}.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,11,22,.16) 0%,rgba(3,14,27,.12) 28%,rgba(3,14,29,.55) 60%,rgba(2,9,19,.94) 100%),radial-gradient(circle at 70% 26%,rgba(14,52,79,.04),rgba(2,9,18,.48) 78%)}.top-rule{position:absolute;top:96px;left:40px;right:40px;height:1px;background:linear-gradient(90deg,rgba(230,181,73,.82),rgba(230,181,73,.12) 76%,rgba(230,181,73,.54))}.side-rule{position:absolute;top:126px;bottom:72px;width:2px;background:linear-gradient(180deg,rgba(255,196,61,.76),rgba(255,196,61,.05));box-shadow:0 0 10px rgba(255,184,40,.28)}.side-rule.left{left:58px}.side-rule.right{right:58px}.wm{position:absolute;top:32px;left:40px;z-index:20;display:flex;align-items:center;gap:12px;color:#e7b84f;font-size:12px;font-weight:850;letter-spacing:.18em}.ek{width:34px;height:34px;border:1px solid rgba(231,184,79,.82);display:grid;place-items:center;letter-spacing:0}.page{position:absolute;top:34px;right:42px;z-index:20;color:#e7b84f;font-weight:900;font-size:20px}.content{position:absolute;z-index:8;display:flex;flex-direction:column}.content.left{left:82px;right:122px;bottom:92px;align-items:flex-start;text-align:left}.content.right{left:150px;right:82px;bottom:92px;align-items:flex-end;text-align:right}.content.center-mid{left:86px;right:86px;top:396px;align-items:center;text-align:center}.content.center-cta{left:82px;right:82px;top:350px;align-items:center;text-align:center}.kicker{display:inline-flex;align-items:center;width:max-content;max-width:820px;padding:10px 16px;border:1.5px solid #d89a24;background:rgba(5,14,24,.78);color:#fff1cf;font-size:16px;font-weight:900;letter-spacing:.15em;text-transform:uppercase;box-shadow:0 0 12px rgba(255,178,38,.28)}.accent{width:74px;height:4px;margin:22px 0 28px;background:#f1b530;box-shadow:0 0 10px rgba(255,184,42,.62)}.center-mid .accent,.center-cta .accent{margin-left:auto;margin-right:auto}.right .accent{margin-left:auto}.main{max-width:900px;font-size:${mainSize}px;font-weight:950;color:#ffc94f;line-height:.96;letter-spacing:-.02em;text-shadow:0 0 2px #fff0ad,0 0 8px rgba(255,190,47,.66),0 7px 26px rgba(0,0,0,.78)}.sub{max-width:840px;margin-top:24px;font-size:29px;font-weight:760;color:#ffe5ab;line-height:1.3;word-break:keep-all;text-shadow:0 4px 18px rgba(0,0,0,.88)}.image-label{position:absolute;left:72px;bottom:34px;z-index:14;color:rgba(255,227,164,.64);font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.mark{position:absolute;right:36px;bottom:28px;z-index:20;padding:10px 15px;border:1px solid rgba(231,184,79,.72);background:rgba(5,14,24,.76);font-size:11px;font-weight:900;letter-spacing:.16em;color:#e7b84f}</style>
</head>
<body>
<section class="card">
  ${img ? `<div class="bg"></div>` : ''}<div class="shade"></div><div class="top-rule"></div><div class="side-rule ${contentClass === 'right' ? 'right' : 'left'}"></div>
  <div class="wm"><div class="ek">EK</div><div>EPICKOR.COM</div></div><div class="page">${number}</div>
  <div class="content ${contentClass}"><div class="kicker">${htmlText(card.kicker || card.topic)}</div><div class="accent"></div><div class="main">${htmlText(card.main)}</div><div class="sub">${htmlText(card.sub)}</div></div>
  <div class="image-label">${htmlText(card.imageLabel)}</div><div class="mark">EPICKOR.COM</div>
</section>
</body>
</html>`;
}

function renderCoverHtml(card) {
  const img = imageUrl(card.image);
  const point = card.pointColor.toLowerCase() === 'red' ? '#C94C3F' : '#C9A84C';
  const isBright = card.theme.toLowerCase() === 'bright' || card.theme.toLowerCase() === 'light';

  if (card.coverStyle.toLowerCase() === 'seoul-after-dark') {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1080px;overflow:hidden;font-family:Segoe UI,Arial,Noto Sans KR,Malgun Gothic,sans-serif;background:#06111d;color:#fff}.card{position:relative;width:1080px;height:1080px;overflow:hidden;background:#06111d}.bg{position:absolute;inset:0;background-image:url("${img}");background-size:cover;background-position:${card.imagePosition};opacity:${card.imageOpacity || '.96'};filter:saturate(1.08) contrast(1.08) brightness(.66)}.shade{position:absolute;inset:0;background:radial-gradient(circle at 50% 48%,rgba(8,24,41,.08) 0%,rgba(4,15,28,.22) 52%,rgba(2,9,18,.58) 100%),linear-gradient(180deg,rgba(2,11,21,.22) 0%,rgba(2,12,24,.06) 34%,rgba(2,13,27,.58) 70%,rgba(2,10,20,.38) 100%)}.axis-v{position:absolute;top:0;bottom:0;left:50%;width:2px;transform:translateX(-1px);background:linear-gradient(180deg,rgba(231,174,47,.04),rgba(255,193,58,.78) 26%,rgba(255,193,58,.22) 72%,rgba(231,174,47,.08));box-shadow:0 0 13px rgba(255,183,42,.34)}.axis-h{position:absolute;left:0;right:0;top:53%;height:2px;background:linear-gradient(90deg,rgba(231,174,47,.06),rgba(255,193,58,.78) 18%,rgba(255,193,58,.26) 50%,rgba(255,193,58,.78) 82%,rgba(231,174,47,.06));box-shadow:0 0 12px rgba(255,183,42,.28)}.wm{position:absolute;top:32px;left:40px;z-index:20;display:flex;align-items:center;gap:12px;color:#e7b84f;font-size:12px;font-weight:850;letter-spacing:.18em;text-shadow:0 0 10px rgba(255,184,45,.2)}.ek{width:34px;height:34px;border:1px solid rgba(231,184,79,.82);display:grid;place-items:center;letter-spacing:0}.page{position:absolute;top:34px;right:42px;z-index:20;color:#e7b84f;font-weight:900;font-size:20px}.content{position:absolute;left:46px;right:46px;top:322px;z-index:8;text-align:center;display:flex;flex-direction:column;align-items:center}.kicker{display:inline-flex;align-items:center;width:max-content;max-width:820px;padding:12px 20px;border:2px solid #d89a24;background:rgba(6,14,24,.84);color:#fff4d5;font-size:18px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;box-shadow:0 0 16px rgba(255,178,38,.42),inset 0 0 14px rgba(255,181,41,.08)}.spark{position:relative;width:94px;height:3px;margin:30px auto 34px;background:#f1b530;box-shadow:0 0 13px rgba(255,184,42,.75)}.spark:after{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;transform:translate(-50%,-50%) rotate(45deg);background:#fff3c7;box-shadow:0 0 16px 5px rgba(255,182,39,.78)}.main{font-size:108px;font-weight:950;color:#ffc94f;line-height:.91;margin-bottom:26px;letter-spacing:-.025em;text-shadow:0 0 2px #fff1b0,0 0 9px rgba(255,192,52,.78),0 5px 28px rgba(0,0,0,.74)}.sub{max-width:840px;font-size:32px;font-weight:780;color:#ffe3a4;line-height:1.25;word-break:keep-all;text-shadow:0 3px 16px rgba(0,0,0,.88)}.mark{position:absolute;right:36px;bottom:28px;z-index:20;padding:10px 15px;border:1px solid rgba(231,184,79,.72);background:rgba(5,14,24,.76);font-size:11px;font-weight:900;letter-spacing:.16em;color:#e7b84f}</style>
</head>
<body>
<section class="card">
  ${img ? `<div class="bg"></div>` : ''}
  <div class="shade"></div>
  <div class="axis-v"></div><div class="axis-h"></div>
  <div class="wm"><div class="ek">EK</div><div>EPICKOR.COM</div></div>
  <div class="page">${String(card.number).padStart(2, '0')}</div>
  <div class="content">
    <div class="kicker">${htmlText(card.kicker || card.topic)}</div>
    <div class="spark"></div>
    <div class="main">${htmlText(card.main)}</div>
    <div class="sub">${htmlText(card.sub)}</div>
  </div>
  <div class="mark">EPICKOR.COM</div>
</section>
</body>
</html>`;
  }

  if (isBright) {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1080px;overflow:hidden;font-family:Segoe UI,Arial,Noto Sans KR,Malgun Gothic,sans-serif;background:#f7f6ef;color:#171a18}.card{position:relative;width:1080px;height:1080px;overflow:hidden;background:#f7f6ef}.bg{position:absolute;inset:0;background-image:url("${img}");background-size:cover;background-position:${card.imagePosition};transform:scale(${card.imageZoom});opacity:${card.imageOpacity || '.78'};filter:saturate(1.04) contrast(1.02)}.shade{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(250,248,239,.82) 0%,rgba(250,248,239,.68) 40%,rgba(250,248,239,.38) 72%,rgba(250,248,239,.16) 100%),linear-gradient(180deg,rgba(250,248,239,.08) 0%,rgba(250,248,239,.44) 58%,rgba(250,248,239,.78) 100%)}.wm{position:absolute;top:34px;left:42px;z-index:20;display:flex;align-items:center;gap:12px;color:rgba(22,26,24,.74);font-size:12px;font-weight:800;letter-spacing:.18em}.ek{width:30px;height:30px;border:1.5px solid rgba(22,26,24,.42);display:grid;place-items:center;letter-spacing:0}.page{position:absolute;top:34px;right:42px;z-index:20;color:rgba(22,26,24,.48);font-weight:900;font-size:20px}.content{position:absolute;left:54px;right:54px;top:50%;transform:translateY(-48%);z-index:8;text-align:center;display:flex;flex-direction:column;align-items:center}.kicker{display:inline-flex;align-items:center;width:max-content;max-width:820px;padding:10px 14px;margin-bottom:24px;background:${point};color:#fff;font-size:18px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.line{width:86px;height:6px;background:${point};margin:8px auto 34px}.main{font-size:114px;font-weight:950;color:#171a18;line-height:.93;margin-bottom:30px;text-shadow:0 12px 32px rgba(255,255,255,.72);letter-spacing:0}.sub{max-width:820px;font-size:34px;font-weight:750;color:#39433e;line-height:1.26;word-break:keep-all;text-shadow:0 8px 24px rgba(255,255,255,.72)}.mark{position:absolute;right:36px;bottom:30px;z-index:20;padding:9px 14px;background:rgba(255,255,255,.74);border:1px solid rgba(22,26,24,.16);font-size:11px;font-weight:900;letter-spacing:.16em;color:rgba(22,26,24,.58)}strong{color:${point}}</style>
</head>
<body>
<section class="card">
  ${img ? `<div class="bg"></div>` : ''}
  <div class="shade"></div>
  <div class="wm"><div class="ek">EK</div><div>EPICKOR.COM</div></div>
  <div class="page">${String(card.number).padStart(2, '0')}</div>
  <div class="content">
    <div class="kicker">${htmlText(card.kicker || card.topic)}</div>
    <div class="line"></div>
    <div class="main">${htmlText(card.main)}</div>
    <div class="sub">${htmlText(card.sub)}</div>
  </div>
  <div class="mark">EPICKOR.COM</div>
</section>
</body>
</html>`;
  }

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1080px;overflow:hidden;font-family:Segoe UI,Arial,Noto Sans KR,Malgun Gothic,sans-serif;background:#111;color:#fff}.card{position:relative;width:1080px;height:1080px;overflow:hidden;background:#111}.bg{position:absolute;inset:0;background-image:url("${img}");background-size:cover;background-position:${card.imagePosition};transform:scale(${card.imageZoom});opacity:${card.imageOpacity || '.78'};filter:saturate(1.12) contrast(1.04)}.shade{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(17,17,17,.78) 0%,rgba(17,17,17,.62) 42%,rgba(17,17,17,.36) 100%),linear-gradient(180deg,rgba(17,17,17,.18) 0%,rgba(17,17,17,.46) 54%,rgba(17,17,17,.72) 100%)}.wm{position:absolute;top:34px;left:42px;z-index:20;display:flex;align-items:center;gap:12px;color:rgba(255,255,255,.74);font-size:12px;font-weight:800;letter-spacing:.18em}.ek{width:30px;height:30px;border:1.5px solid rgba(255,255,255,.55);display:grid;place-items:center;letter-spacing:0}.page{position:absolute;top:34px;right:42px;z-index:20;color:rgba(255,255,255,.52);font-weight:900;font-size:20px}.content{position:absolute;left:128px;right:128px;top:50%;transform:translateY(-47%);z-index:8;text-align:center;display:flex;flex-direction:column;align-items:center}.kicker{display:inline-flex;align-items:center;width:max-content;max-width:760px;padding:9px 13px;margin-bottom:22px;border:1px solid ${point};background:rgba(17,17,17,.34);color:${point};font-size:16px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.line{width:76px;height:5px;background:${point};margin:6px auto 30px}.main{font-size:76px;font-weight:950;color:#fff;line-height:1.02;margin-bottom:28px;text-shadow:0 12px 42px rgba(0,0,0,.58);letter-spacing:0}.sub{max-width:760px;font-size:31px;font-weight:650;color:rgba(255,255,255,.86);line-height:1.32;word-break:keep-all;text-shadow:0 8px 26px rgba(0,0,0,.5)}.mark{position:absolute;right:36px;bottom:30px;z-index:20;padding:9px 14px;border:1px solid rgba(255,255,255,.18);background:rgba(17,17,17,.34);font-size:11px;font-weight:800;letter-spacing:.16em;color:rgba(255,255,255,.58)}strong{color:${point}}</style>
</head>
<body>
<section class="card">
  ${img ? `<div class="bg"></div>` : ''}
  <div class="shade"></div>
  <div class="wm"><div class="ek">EK</div><div>EPICKOR.COM</div></div>
  <div class="page">${String(card.number).padStart(2, '0')}</div>
  <div class="content">
    <div class="kicker">${htmlText(card.kicker || card.topic)}</div>
    <div class="line"></div>
    <div class="main">${htmlText(card.main)}</div>
    <div class="sub">${htmlText(card.sub)}</div>
  </div>
  <div class="mark">EPICKOR.COM</div>
</section>
</body>
</html>`;
}

function renderHtml(card) {
  if (card.visualStyle.toLowerCase() === 'seoul-after-dark') {
    return renderSeoulAfterDarkHtml(card);
  }
  if (card.layout.toUpperCase().trim() === 'F') {
    return renderCoverHtml(card);
  }

  const img = imageUrl(card.image);
  const mainSize = card.main.length > 56 ? 58 : 66;
  const subSize = card.sub.length > 120 ? 29 : 33;
  const point = card.pointColor.toLowerCase() === 'red' ? '#C94C3F' : '#C9A84C';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1080px;overflow:hidden;font-family:Segoe UI,Arial,Noto Sans KR,Malgun Gothic,sans-serif;background:#f7f6ef;color:#171a18}.card{position:relative;width:1080px;height:1080px;overflow:hidden;background:#f7f6ef}.bg{position:absolute;inset:0;background-image:url("${img}");background-size:cover;background-position:${card.imagePosition};transform:scale(${card.imageZoom});opacity:${card.imageOpacity};filter:saturate(1.02) contrast(1.02)}.wash{position:absolute;inset:0;background:linear-gradient(180deg,rgba(250,248,239,.18),rgba(250,248,239,.72) 58%,rgba(250,248,239,.96))}.wm{position:absolute;top:34px;left:42px;z-index:5;display:flex;align-items:center;gap:12px;color:rgba(22,26,24,.74);font-size:12px;font-weight:800;letter-spacing:.18em}.ek{width:30px;height:30px;border:1.5px solid rgba(22,26,24,.42);display:grid;place-items:center;letter-spacing:0}.page{position:absolute;top:34px;right:42px;z-index:5;color:rgba(22,26,24,.48);font-weight:900;font-size:20px}.content{position:absolute;left:64px;right:64px;bottom:82px;z-index:4}.kicker{display:inline-block;padding:10px 14px;margin-bottom:22px;background:${point};color:#fff;font-size:18px;font-weight:900;letter-spacing:.14em}.main{font-size:${mainSize}px;line-height:1.02;font-weight:950;letter-spacing:0;max-width:880px;text-wrap:balance}.sub{margin-top:24px;max-width:800px;font-size:${subSize}px;line-height:1.24;font-weight:650;color:#39433e}.label{position:absolute;left:64px;bottom:34px;z-index:4;font-size:12px;font-weight:900;letter-spacing:.14em;color:rgba(22,26,24,.58);text-transform:uppercase}.mark{position:absolute;right:36px;bottom:30px;z-index:5;padding:9px 14px;background:rgba(255,255,255,.74);border:1px solid rgba(22,26,24,.16);font-size:11px;font-weight:900;letter-spacing:.16em;color:rgba(22,26,24,.58)}strong{color:${point}}</style>
</head>
<body>
<section class="card">
  ${img ? `<div class="bg"></div>` : ''}
  <div class="wash"></div>
  <div class="wm"><div class="ek">EK</div><div>EPICKOR.COM</div></div>
  <div class="page">${String(card.number).padStart(2, '0')}</div>
  <div class="content">
    <div class="kicker">${htmlText(card.kicker || card.topic)}</div>
    <div class="main">${htmlText(card.main)}</div>
    <div class="sub">${htmlText(card.sub)}</div>
  </div>
  <div class="label">${htmlText(card.imageLabel)}</div>
  <div class="mark">EPICKOR.COM</div>
</section>
</body>
</html>`;
}

function edgePath() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('Microsoft Edge executable not found.');
  return found;
}

const outputDir = findOutputDir(slug);
const scriptPath = path.join(outputDir, 'script.md');
if (!fs.existsSync(scriptPath)) {
  console.error(`Missing script.md: ${scriptPath}`);
  process.exit(1);
}

const cards = parseScript(scriptPath).filter((card) => !onlyCard || card.number === onlyCard);
if (onlyCard && cards.length === 0) {
  console.error(`Missing Card ${String(onlyCard).padStart(2, '0')}`);
  process.exit(1);
}
const edge = edgePath();
for (const card of cards) {
  const htmlPath = path.join(outputDir, `card_${String(card.number).padStart(2, '0')}.html`);
  const pngPath = path.join(outputDir, `card_${String(card.number).padStart(2, '0')}.png`);
  const userDataDir = path.join(
    outputDir,
    `.edge-profile-${process.pid}-${Date.now()}-${String(card.number).padStart(2, '0')}`,
  );
  fs.writeFileSync(htmlPath, renderHtml(card), 'utf8');
  try {
    execFileSync(edge, [
      '--headless=new',
      '--disable-gpu',
      '--disable-gpu-compositing',
      '--disable-gpu-sandbox',
      '--disable-features=VizDisplayCompositor',
      '--use-gl=swiftshader',
      '--disable-extensions',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--no-proxy-server',
      `--user-data-dir=${userDataDir}`,
      '--window-size=1080,1080',
      `--screenshot=${pngPath}`,
      pathToFileURL(htmlPath).href,
    ], { stdio: 'pipe', timeout: 120000 });
  } finally {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
  console.log(`Rendered ${path.relative(root, pngPath)}`);
}
