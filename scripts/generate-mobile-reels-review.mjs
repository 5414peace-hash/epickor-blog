import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const outDir = join(process.cwd(), 'public', 'reels-review-mobile');

const img = (id, src, fit, source = 'Local/Pexels candidate') => ({ id, src, fit, source });

const pexels = {
  passport1: 'https://images.pexels.com/photos/32081457/pexels-photo-32081457.jpeg?auto=compress&cs=tinysrgb&w=1200',
  passport2: 'https://images.pexels.com/photos/7009611/pexels-photo-7009611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  passport3: 'https://images.pexels.com/photos/29402986/pexels-photo-29402986.jpeg?auto=compress&cs=tinysrgb&w=1200',
  observe1: 'https://images.pexels.com/photos/31872727/pexels-photo-31872727.jpeg?auto=compress&cs=tinysrgb&w=1200',
  observe2: 'https://images.pexels.com/photos/37578245/pexels-photo-37578245.jpeg?auto=compress&cs=tinysrgb&w=1200',
  fence: 'https://images.pexels.com/photos/35382732/pexels-photo-35382732.jpeg?auto=compress&cs=tinysrgb&w=1200',
  shoes1: 'https://images.pexels.com/photos/28900610/pexels-photo-28900610.jpeg?auto=compress&cs=tinysrgb&w=1200',
  shoes2: 'https://images.pexels.com/photos/19115108/pexels-photo-19115108.jpeg?auto=compress&cs=tinysrgb&w=1200',
  walk1: 'https://images.pexels.com/photos/31720188/pexels-photo-31720188.jpeg?auto=compress&cs=tinysrgb&w=1200',
  street: 'https://images.pexels.com/photos/32014957/pexels-photo-32014957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  redCross: 'https://images.pexels.com/photos/5018000/pexels-photo-5018000.jpeg?auto=compress&cs=tinysrgb&w=1200',
  pills1: 'https://images.pexels.com/photos/4021800/pexels-photo-4021800.jpeg?auto=compress&cs=tinysrgb&w=1200',
  pills2: 'https://images.pexels.com/photos/4021811/pexels-photo-4021811.jpeg?auto=compress&cs=tinysrgb&w=1200',
  pharmacy: 'https://images.pexels.com/photos/8657297/pexels-photo-8657297.jpeg?auto=compress&cs=tinysrgb&w=1200',
  insurance1: 'https://images.pexels.com/photos/7163940/pexels-photo-7163940.jpeg?auto=compress&cs=tinysrgb&w=1200',
  insurance2: 'https://images.pexels.com/photos/8383889/pexels-photo-8383889.jpeg?auto=compress&cs=tinysrgb&w=1200',
  insurance3: 'https://images.pexels.com/photos/8830697/pexels-photo-8830697.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ambulance1: 'https://images.pexels.com/photos/6519850/pexels-photo-6519850.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ambulance2: 'https://images.pexels.com/photos/35831377/pexels-photo-35831377.jpeg?auto=compress&cs=tinysrgb&w=1200',
  campus1: 'https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&w=1200',
  campus2: 'https://images.pexels.com/photos/7972544/pexels-photo-7972544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  campus3: 'https://images.pexels.com/photos/7972647/pexels-photo-7972647.jpeg?auto=compress&cs=tinysrgb&w=1200',
  study1: 'https://images.pexels.com/photos/8199558/pexels-photo-8199558.jpeg?auto=compress&cs=tinysrgb&w=1200',
  study2: 'https://images.pexels.com/photos/8199759/pexels-photo-8199759.jpeg?auto=compress&cs=tinysrgb&w=1200',
  study3: 'https://images.pexels.com/photos/7777713/pexels-photo-7777713.jpeg?auto=compress&cs=tinysrgb&w=1200',
  festival1: 'https://images.pexels.com/photos/31098645/pexels-photo-31098645.jpeg?auto=compress&cs=tinysrgb&w=1200',
  festival2: 'https://images.pexels.com/photos/7972710/pexels-photo-7972710.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const data = [
  {
    slug: '189',
    title: 'DMZ Tour from Seoul',
    post: 'https://www.epickor.com/blog/189',
    scenes: [
      {
        n: 1,
        narration: 'Most tourists think the DMZ is one place. It is not.',
        intent: 'Strong DMZ opener and thumbnail candidate.',
        candidates: [
          img('189-s1-imjingak', '/assets/images/posts/189/dmz-imjingak-locomotive.jpg', 'Best Korea-specific opener; real DMZ route signal.', 'Wikimedia / local'),
          img('189-s1-dora', '/assets/images/posts/189/dora-observatory.jpg', 'Observation context, useful if the opener should feel controlled.', 'Wikimedia / local'),
          img('189-s1-tunnel', '/assets/images/posts/189/third-tunnel-area.jpg', 'Physical DMZ stop, less emotional but very concrete.', 'Wikimedia / local'),
          img('189-s1-observe', pexels.observe1, 'Observation-deck mood; support only, not a real DMZ image.', 'Pexels'),
          img('189-s1-fence', pexels.fence, 'Fence symbol for border tension; generic support candidate.', 'Pexels'),
        ],
      },
      {
        n: 2,
        motion: {
          id: '189-card-access',
          type: 'zone',
          kicker: 'DMZ TOUR',
          headline: 'Not one open place',
          subhead: 'Tour route, access, rules',
          bullets: ['Imjingak', 'Dora', 'Tunnel', 'JSA separate'],
          footer: 'Read the exact route',
          color: '#2563eb',
        },
        narration: 'Imjingak, Dora Observatory, the Third Tunnel, and the JSA are different levels of access.',
        intent: 'Motion card explains different access levels.',
        candidates: [
          img('189-s2-imjingak', '/assets/images/posts/189/dmz-imjingak-locomotive.jpg', 'Route start visual for access-level explanation.', 'Wikimedia / local'),
          img('189-s2-dora', '/assets/images/posts/189/dora-observatory.jpg', 'Controlled viewpoint visual.', 'Wikimedia / local'),
          img('189-s2-tunnel', '/assets/images/posts/189/third-tunnel-area.jpg', 'Physical tour stop visual.', 'Wikimedia / local'),
        ],
      },
      {
        n: 3,
        narration: 'And a normal DMZ tour does not automatically include the JSA.',
        intent: 'Warning beat: not every DMZ booking includes every site.',
        candidates: [
          img('189-s3-dora', '/assets/images/posts/189/dora-observatory.jpg', 'Best match for controlled access and not-JSA framing.', 'Wikimedia / local'),
          img('189-s3-fence', pexels.fence, 'Generic border restriction symbol; useful as a warning visual.', 'Pexels'),
          img('189-s3-observe', pexels.observe2, 'Binocular/lookout mood for restricted viewing.', 'Pexels'),
          img('189-s3-passport', pexels.passport1, 'Travel-control cue if the scene needs documents over scenery.', 'Pexels'),
        ],
      },
      {
        n: 4,
        narration: 'You are not wandering around a border like a museum.',
        intent: 'Managed-route feeling, not open wandering.',
        candidates: [
          img('189-s4-observe', pexels.observe2, 'Lookout/controlled viewing metaphor, different from local scene 3 candidate.', 'Pexels'),
          img('189-s4-dora', '/assets/images/posts/189/dora-observatory.jpg', 'Most direct controlled-viewpoint option.', 'Wikimedia / local'),
          img('189-s4-fence', pexels.fence, 'Restricted-area symbol.', 'Pexels'),
          img('189-s4-street', pexels.street, 'Tour-day movement support; weaker but distinct.', 'Pexels'),
        ],
      },
      {
        n: 5,
        narration: 'You are following a tour route, with passport checks, military rules, and access that can change.',
        intent: 'Passport, checkpoint, and changing-access warning.',
        candidates: [
          img('189-s5-passport-map', pexels.passport3, 'Strong travel-document cue for passport checks.', 'Pexels'),
          img('189-s5-passport-hand', pexels.passport2, 'Document-control visual; generic but clear.', 'Pexels'),
          img('189-s5-tunnel', '/assets/images/posts/189/third-tunnel-area.jpg', 'Real DMZ controlled-site fallback.', 'Wikimedia / local'),
          img('189-s5-fence', pexels.fence, 'Restriction/access-change visual.', 'Pexels'),
        ],
      },
      {
        n: 6,
        motion: {
          id: '189-card-pack',
          type: 'check',
          kicker: 'BEFORE YOU GO',
          headline: 'Bring these',
          subhead: 'DMZ day basics',
          bullets: ['Passport', 'Walking shoes', 'Schedule buffer'],
          footer: 'Access can change',
          color: '#16a34a',
        },
        narration: 'Bring your passport. Wear real walking shoes, because the Third Tunnel is more physical than it looks.',
        intent: 'Saveable checklist motion card.',
        candidates: [
          img('189-s6-shoes-seoul', pexels.shoes1, 'Walking-shoes cue in Seoul context.', 'Pexels'),
          img('189-s6-shoes-grass', pexels.shoes2, 'Clear shoe close-up for physical-walk beat.', 'Pexels'),
          img('189-s6-passport', pexels.passport1, 'Passport requirement cue.', 'Pexels'),
          img('189-s6-walk', pexels.walk1, 'Walking route support visual.', 'Pexels'),
        ],
      },
      {
        n: 7,
        narration: 'Do not book something tight right after, because the schedule can shift.',
        intent: 'Clean closing visual with practical warning.',
        candidates: [
          img('189-s7-third-tunnel', '/assets/images/posts/189/third-tunnel-area.jpg', 'Direct DMZ tour-stop closer.', 'Wikimedia / local'),
          img('189-s7-imjingak', '/assets/images/posts/189/dmz-imjingak-locomotive.jpg', 'More emotional DMZ outro.', 'Wikimedia / local'),
          img('189-s7-dora', '/assets/images/posts/189/dora-observatory.jpg', 'Controlled-viewpoint outro.', 'Wikimedia / local'),
          img('189-s7-street', pexels.street, 'Schedule-buffer/travel-day support.', 'Pexels'),
        ],
      },
    ],
  },
  {
    slug: '190',
    title: 'Korean Healthcare for Tourists',
    post: 'https://www.epickor.com/blog/190',
    scenes: [
      {
        n: 1,
        narration: 'Save these three numbers before you get sick in Korea.',
        intent: 'Immediate saveable healthcare hook.',
        candidates: [
          img('190-s1-nmc', '/assets/images/posts/190/national-medical-center-seoul.jpg', 'Best Korea-specific healthcare opener.', 'Wikimedia / local'),
          img('190-s1-emergency', '/assets/images/posts/190/emergency-medical-center-seoul.jpg', 'Emergency entrance context.', 'Wikimedia / local'),
          img('190-s1-ambulance-local', '/assets/images/posts/190/ambulance-daehakro-seoul.jpg', 'Korea ambulance and 119 cue.', 'Wikimedia / local'),
          img('190-s1-red-cross', pexels.redCross, 'Universal medical-sign cue.', 'Pexels'),
          img('190-s1-insurance', pexels.insurance1, 'Travel-health prep angle.', 'Pexels'),
        ],
      },
      {
        n: 2,
        motion: {
          id: '190-card-numbers',
          type: 'menu',
          kicker: 'KOREA HEALTH',
          headline: 'Save these numbers',
          subhead: 'Before you need them',
          bullets: ['119 emergency', '1330 travel help', '1339 health guidance'],
          footer: 'Screenshot this',
          color: '#dc2626',
        },
        narration: '119 is for ambulance, fire, and real emergencies. 1330 is the Korea travel hotline. 1339 is for public-health guidance.',
        intent: 'Number-board motion card.',
        candidates: [
          img('190-s2-ambulance-local', '/assets/images/posts/190/ambulance-daehakro-seoul.jpg', '119 emergency cue.', 'Wikimedia / local'),
          img('190-s2-emergency', '/assets/images/posts/190/emergency-medical-center-seoul.jpg', 'Emergency healthcare cue.', 'Wikimedia / local'),
          img('190-s2-red-cross', pexels.redCross, 'Readable medical-symbol support.', 'Pexels'),
        ],
      },
      {
        n: 3,
        narration: 'Korean healthcare is strong, but you still need to choose the right door.',
        intent: 'Hospital/clinic system context.',
        candidates: [
          img('190-s3-nmc', '/assets/images/posts/190/national-medical-center-seoul.jpg', 'Direct Seoul healthcare institution.', 'Wikimedia / local'),
          img('190-s3-emergency', '/assets/images/posts/190/emergency-medical-center-seoul.jpg', 'Hospital entry context.', 'Wikimedia / local'),
          img('190-s3-red-cross', pexels.redCross, 'Healthcare sign support.', 'Pexels'),
          img('190-s3-pharmacy', pexels.pharmacy, 'Health-service counter support.', 'Pexels'),
          img('190-s3-pills', pexels.pills1, 'Doctor/medicine context, less Korea-specific.', 'Pexels'),
        ],
      },
      {
        n: 4,
        narration: 'Mild cold, stomach issue, or motion sickness? Try a pharmacy first.',
        intent: 'Pharmacy-first decision beat.',
        candidates: [
          img('190-s4-pharmacy', pexels.pharmacy, 'Best pharmacy counter candidate.', 'Pexels'),
          img('190-s4-pills', pexels.pills2, 'Medication close-up for mild symptom beat.', 'Pexels'),
          img('190-s4-red-cross', pexels.redCross, 'Medical sign cue.', 'Pexels'),
          img('190-s4-insurance', pexels.insurance1, 'Travel-health planning support.', 'Pexels'),
          img('190-s4-nmc', '/assets/images/posts/190/national-medical-center-seoul.jpg', 'Korea-specific but less pharmacy-specific.', 'Wikimedia / local'),
        ],
      },
      {
        n: 5,
        motion: {
          id: '190-card-triage',
          type: 'check',
          kicker: 'WHERE TO GO',
          headline: 'Pick the right door',
          subhead: 'Keep it simple',
          bullets: ['Mild: pharmacy', 'Doctor: clinic', 'Urgent: 119'],
          footer: 'Travel prep only',
          color: '#0891b2',
        },
        narration: 'Need a doctor but it is not an emergency? Look for a clinic.',
        intent: 'Decision checklist motion card.',
        candidates: [
          img('190-s5-pharmacy', pexels.pharmacy, 'Pharmacy/clinic service context.', 'Pexels'),
          img('190-s5-nmc', '/assets/images/posts/190/national-medical-center-seoul.jpg', 'Korea healthcare fallback.', 'Wikimedia / local'),
          img('190-s5-emergency', '/assets/images/posts/190/emergency-medical-center-seoul.jpg', 'Hospital-door option.', 'Wikimedia / local'),
        ],
      },
      {
        n: 6,
        narration: 'If it is serious, do not overthink it. Use a hospital or call 119.',
        intent: 'Urgent/emergency action cue.',
        candidates: [
          img('190-s6-ambulance-local', '/assets/images/posts/190/ambulance-daehakro-seoul.jpg', 'Best Korea-specific 119 visual.', 'Wikimedia / local'),
          img('190-s6-emergency-local', '/assets/images/posts/190/emergency-medical-center-seoul.jpg', 'Emergency medical center.', 'Wikimedia / local'),
          img('190-s6-ambulance-symbol', pexels.ambulance1, 'Clear ambulance symbol.', 'Pexels'),
          img('190-s6-emt', pexels.ambulance2, 'Urgent-response action cue.', 'Pexels'),
          img('190-s6-red-cross', pexels.redCross, 'Medical emergency sign.', 'Pexels'),
        ],
      },
      {
        n: 7,
        narration: 'Bring travel insurance, passport, medication names, and allergy information.',
        intent: 'Travel prep, not medical advice.',
        candidates: [
          img('190-s7-insurance-passport', pexels.insurance2, 'Travel documents plus health prep.', 'Pexels'),
          img('190-s7-passport-mask', pexels.insurance3, 'Travel essentials and health documentation.', 'Pexels'),
          img('190-s7-insurance-planner', pexels.insurance1, 'Insurance and pills planning cue.', 'Pexels'),
          img('190-s7-emergency-local', '/assets/images/posts/190/emergency-medical-center-seoul.jpg', 'Korea healthcare outro.', 'Wikimedia / local'),
          img('190-s7-pills', pexels.pills2, 'Medication-name cue.', 'Pexels'),
        ],
      },
    ],
  },
  {
    slug: '191',
    title: 'Korean University Life',
    post: 'https://www.epickor.com/blog/191',
    scenes: [
      {
        n: 1,
        narration: 'Korean college is not just study hard.',
        intent: 'Campus prestige opener.',
        candidates: [
          img('191-s1-korea-university', '/assets/images/posts/191/korea-university-main-hall.jpg', 'Best Korea-specific campus hero.', 'Wikimedia / local'),
          img('191-s1-yonsei', '/assets/images/posts/191/yonsei-main-building.jpg', 'Real Seoul campus identity.', 'Wikimedia / local'),
          img('191-s1-campus-walk', pexels.campus1, 'Student-life opener; generic but human.', 'Pexels'),
          img('191-s1-campus-social', pexels.campus2, 'Campus social energy.', 'Pexels'),
          img('191-s1-campus-notes', pexels.campus3, 'Study/social mix.', 'Pexels'),
        ],
      },
      {
        n: 2,
        motion: {
          id: '191-card-pressure',
          type: 'zone',
          kicker: 'KOREAN CAMPUS',
          headline: 'Freedom plus pressure',
          subhead: 'Both are true',
          bullets: ['After exams', 'Future starts'],
          footer: 'It changes shape',
          color: '#7c3aed',
        },
        narration: 'It is study hard, socialize hard, and start planning your future early.',
        intent: 'Split-board motion card: fun and pressure together.',
        candidates: [
          img('191-s2-study', pexels.study1, 'Study pressure cue.', 'Pexels'),
          img('191-s2-campus-social', pexels.campus2, 'Social freedom cue.', 'Pexels'),
          img('191-s2-korea-university', '/assets/images/posts/191/korea-university-main-hall.jpg', 'Korea-specific campus anchor.', 'Wikimedia / local'),
        ],
      },
      {
        n: 3,
        narration: 'After years of entrance-exam pressure, university can feel like freedom.',
        intent: 'Freedom after exams, still on campus.',
        candidates: [
          img('191-s3-campus-walk', pexels.campus1, 'Students walking freely on campus.', 'Pexels'),
          img('191-s3-yonsei', '/assets/images/posts/191/yonsei-main-building.jpg', 'Real Seoul campus visual.', 'Wikimedia / local'),
          img('191-s3-campus-social', pexels.campus2, 'Social campus energy.', 'Pexels'),
          img('191-s3-campus-notes', pexels.campus3, 'Casual study/social balance.', 'Pexels'),
          img('191-s3-korea-university', '/assets/images/posts/191/korea-university-main-hall.jpg', 'Prestige-campus fallback.', 'Wikimedia / local'),
        ],
      },
      {
        n: 4,
        motion: {
          id: '191-card-campus-life',
          type: 'grid',
          kicker: 'CAMPUS MIX',
          headline: 'More than classes',
          subhead: 'Weekly rhythm',
          bullets: ['Clubs', 'MT trips', 'Festivals', 'Internships'],
          footer: 'Fun and pressure',
          color: '#ea580c',
        },
        narration: 'Students join clubs, go to festivals, take MT trips, build friend groups.',
        intent: 'Campus-life grid motion card.',
        candidates: [
          img('191-s4-campus-social', pexels.campus2, 'Friend group and social energy.', 'Pexels'),
          img('191-s4-festival', pexels.festival1, 'Celebration / group event cue.', 'Pexels'),
          img('191-s4-graduates', pexels.festival2, 'Student milestone / campus event support.', 'Pexels'),
        ],
      },
      {
        n: 5,
        narration: 'But at the same time, they are thinking about grades, internships, language scores, certificates, and jobs.',
        intent: 'Study and career-prep pressure.',
        candidates: [
          img('191-s5-study-group', pexels.study1, 'Best study/career pressure candidate.', 'Pexels'),
          img('191-s5-library-laptop', pexels.study2, 'Library/laptop focus.', 'Pexels'),
          img('191-s5-laptop-focus', pexels.study3, 'Quiet laptop-study cue.', 'Pexels'),
          img('191-s5-korea-university', '/assets/images/posts/191/korea-university-main-hall.jpg', 'Korea-specific campus fallback.', 'Wikimedia / local'),
          img('191-s5-yonsei', '/assets/images/posts/191/yonsei-main-building.jpg', 'Real Seoul campus fallback.', 'Wikimedia / local'),
        ],
      },
      {
        n: 6,
        narration: 'It can look like a party from the outside, but underneath it there is hierarchy and career anxiety.',
        intent: 'Fun on top, pressure underneath.',
        candidates: [
          img('191-s6-festival', pexels.festival1, 'Celebration surface layer.', 'Pexels'),
          img('191-s6-study', pexels.study2, 'Pressure underneath: study/career prep.', 'Pexels'),
          img('191-s6-campus-social', pexels.campus2, 'Campus social effort.', 'Pexels'),
          img('191-s6-yonsei', '/assets/images/posts/191/yonsei-main-building.jpg', 'Prestige/hierarchy context.', 'Wikimedia / local'),
          img('191-s6-korea-university', '/assets/images/posts/191/korea-university-main-hall.jpg', 'Korea campus prestige context.', 'Wikimedia / local'),
        ],
      },
      {
        n: 7,
        narration: 'Korean university life is a mirror of modern Korea.',
        intent: 'Clean campus outro.',
        candidates: [
          img('191-s7-yonsei', '/assets/images/posts/191/yonsei-main-building.jpg', 'Clean Seoul campus outro.', 'Wikimedia / local'),
          img('191-s7-korea-university', '/assets/images/posts/191/korea-university-main-hall.jpg', 'Strong Korea-specific closing image.', 'Wikimedia / local'),
          img('191-s7-campus-walk', pexels.campus1, 'Human campus ending.', 'Pexels'),
          img('191-s7-campus-notes', pexels.campus3, 'Young Korea / study-life closing cue.', 'Pexels'),
          img('191-s7-study', pexels.study1, 'Modern pressure outro option.', 'Pexels'),
        ],
      },
    ],
  },
];

function css() {
  return `<style>
:root{color-scheme:light;background:#f4f5f7;color:#111827;font-family:Inter,Arial,sans-serif}body{margin:0}.top{position:sticky;top:0;z-index:20;background:rgba(244,245,247,.96);backdrop-filter:blur(12px);border-bottom:1px solid #d9dde5;padding:10px 14px}.nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.nav a,.ghost{border:0;border-radius:8px;background:#111827;color:#fff;text-decoration:none;padding:9px 11px;font-weight:800;font-size:13px}.wrap{max-width:960px;margin:0 auto;padding:14px}.card,.scene{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin:12px 0;box-shadow:0 1px 2px rgba(15,23,42,.05)}h1{font-size:24px;line-height:1.15;margin:4px 0}h2{font-size:20px;margin:0 0 8px}.meta,.small{font-size:13px;color:#4b5563;line-height:1.45}.sceneHead{display:flex;justify-content:space-between;gap:10px;align-items:start}.pill{display:inline-block;border-radius:999px;padding:4px 8px;background:#e0f2fe;color:#075985;font-size:12px;font-weight:800}.warn{background:#fff7ed;color:#9a3412}.ok{background:#dcfce7;color:#166534}.grid{display:grid;grid-template-columns:1fr;gap:12px}.candidate{border:2px solid #e5e7eb;border-radius:10px;padding:10px;background:#fff}.candidate.selected{border-color:#2563eb;background:#eff6ff}.candidate img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;background:#e5e7eb;display:block}.candidate h3{font-size:14px;margin:8px 0 6px}.rankBtns{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:8px 0}.rankBtns button,.choiceBtns button{min-height:34px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;font-weight:900}.rankBtns button.active{background:#2563eb;color:#fff;border-color:#2563eb}.choiceBtns{display:grid;grid-template-columns:1fr 1fr;gap:6px}.choiceBtns button.activeReject{background:#ffe4e6;border-color:#e11d48;color:#9f1239}.choiceBtns button.activeReplace{background:#ffedd5;border-color:#f97316;color:#9a3412}.summary{white-space:pre-wrap;background:#0f172a;color:#e5e7eb;border-radius:10px;padding:12px;font:12px/1.5 ui-monospace,Consolas,monospace}.motionWrap{display:grid;grid-template-columns:1fr;gap:12px}.motionCard{border:2px solid #ddd6fe;border-radius:12px;padding:10px;background:#fbfaff}.motionCard.selected{border-color:#16a34a;background:#f0fdf4}.phone{position:relative;width:min(100%,260px);aspect-ratio:9/16;margin:auto;border-radius:18px;overflow:hidden;background:#111827;color:#fff;box-shadow:0 18px 42px rgba(15,23,42,.24)}.phoneInner{position:absolute;inset:7%;border:1px solid rgba(255,255,255,.22);border-radius:16px;background:linear-gradient(180deg,rgba(15,23,42,.94),rgba(15,23,42,.7));padding:14px;display:grid;align-content:space-between}.kicker{color:var(--accent);font-size:10px;font-weight:950;text-transform:uppercase}.headline{font-size:28px;line-height:.94;font-weight:950;text-transform:uppercase}.sub{font-size:12px;color:rgba(255,255,255,.82);font-weight:800}.footer{font-size:10px;color:rgba(255,255,255,.72);font-weight:850;text-transform:uppercase;text-align:center}.zones,.tiles,.rows,.checks{display:grid;gap:8px}.zones{grid-template-columns:1fr 1fr}.zone,.tile,.row,.check{border-radius:12px;padding:10px;font-weight:950;text-transform:uppercase;animation:pop 2.8s infinite both}.zone:nth-child(1),.tile:nth-child(1){background:#fff;color:#111827}.zone:nth-child(2),.tile:nth-child(2),.tile:nth-child(3){background:rgba(255,255,255,.14);color:#fff}.tile:nth-child(4){background:var(--accent);color:#111827}.row,.check{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);animation-name:slide}.row:nth-child(2),.check:nth-child(2),.tile:nth-child(2),.zone:nth-child(2){animation-delay:.18s}.row:nth-child(3),.check:nth-child(3),.tile:nth-child(3){animation-delay:.36s}.tile:nth-child(4){animation-delay:.54s}@keyframes pop{0%,100%{transform:translateY(0) scale(1);opacity:.9}35%{transform:translateY(-5px) scale(1.02);opacity:1}}@keyframes slide{0%,100%{transform:translateX(0);opacity:.88}35%{transform:translateX(8px);opacity:1}}@media(min-width:760px){.grid{grid-template-columns:repeat(2,1fr)}.motionWrap{grid-template-columns:300px 1fr}.candidate img{aspect-ratio:16/10}}</style>`;
}

function renderMotion(card) {
  const items = card.bullets.map((b) => `<div class="${card.type === 'menu' ? 'row' : card.type === 'check' ? 'check' : card.type === 'grid' ? 'tile' : 'zone'}">${b}</div>`).join('');
  const cls = card.type === 'menu' ? 'rows' : card.type === 'check' ? 'checks' : card.type === 'grid' ? 'tiles' : 'zones';
  return `<div class="motionCard" data-motion-id="${card.id}" style="--accent:${card.color}"><div class="phone"><div class="phoneInner"><div><div class="kicker">${card.kicker}</div><div class="headline">${card.headline}</div><div class="sub">${card.subhead}</div></div><div class="${cls}">${items}</div><div class="footer">${card.footer}</div></div></div><div class="choiceBtns" style="margin-top:10px"><button data-motion-select="${card.id}">Select Motion Card</button><button data-motion-revise="${card.id}">Revise</button></div><p class="small"><strong>${card.id}</strong> / ${card.type} / animated CSS preview for approval before final Remotion render.</p></div>`;
}

function renderPage(reel) {
  const sceneHtml = reel.scenes.map((scene) => {
    const candidates = scene.candidates.map((c) => `<article class="candidate" data-scene="${scene.n}" data-id="${c.id}" data-src="${c.src}"><img src="${c.src}" alt="${c.id}" loading="lazy"><h3>${c.id}</h3><p class="small">${c.fit}</p><p class="small">${c.source}</p><div class="rankBtns">${[1, 2, 3, 4, 5].map((rank) => `<button data-rank="${rank}">${rank}</button>`).join('')}</div><div class="choiceBtns"><button data-status="reject">Reject</button><button data-status="replace">Replace</button></div></article>`).join('');
    return `<section class="scene"><div class="sceneHead"><div><h2>Scene ${scene.n}${scene.motion ? ' - Motion Card' : ''}</h2><p class="small"><strong>Narration:</strong> ${scene.narration}</p><p class="small"><strong>Intent:</strong> ${scene.intent}</p></div><span class="pill">${scene.candidates.length} unique refs</span></div>${scene.motion ? `<div class="motionWrap">${renderMotion(scene.motion)}<div>` : ''}<div class="grid">${candidates}</div>${scene.motion ? '</div>' : ''}</section>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Reel ${reel.slug} Review</title>${css()}</head><body><div class="top"><strong>Reel ${reel.slug}</strong><div class="nav"><a href="index.html">Index</a><a href="189.html">189</a><a href="190.html">190</a><a href="191.html">191</a><button class="ghost" id="copySummary">Copy choices</button><button class="ghost" id="clearChoices">Clear</button></div></div><main class="wrap"><div class="card"><h1>${reel.title}</h1><p class="meta">Post: <a href="${reel.post}">${reel.post}</a></p><p class="small">Mobile review v3: each scene has distinct reference candidates where possible. Tap 1-5 to rank photos; choices are saved in this browser. Motion-card scenes show animated card previews plus reference-photo ranking.</p><div id="status" class="pill warn">No choices yet</div></div>${sceneHtml}<div class="card"><h2>Saved Choices</h2><pre id="summary" class="summary"></pre></div></main><script>
const slug='${reel.slug}';const key='epickor-reels-review-v3-'+slug;let state=JSON.parse(localStorage.getItem(key)||'{"ranks":{},"status":{},"motion":{}}');
function save(){localStorage.setItem(key,JSON.stringify(state));render();}
function render(){document.querySelectorAll('.candidate').forEach(card=>{const id=card.dataset.id;const scene=card.dataset.scene;const rank=state.ranks[scene]?.[id];card.classList.toggle('selected',!!rank);card.querySelectorAll('[data-rank]').forEach(b=>b.classList.toggle('active',String(rank)===b.dataset.rank));card.querySelector('[data-status="reject"]').classList.toggle('activeReject',state.status[id]==='reject');card.querySelector('[data-status="replace"]').classList.toggle('activeReplace',state.status[id]==='replace');});document.querySelectorAll('[data-motion-id]').forEach(card=>{const id=card.dataset.motionId;card.classList.toggle('selected',state.motion[id]==='selected');card.querySelector('[data-motion-select]').classList.toggle('activeReject',false);});const lines=[];Object.keys(state.ranks).sort((a,b)=>a-b).forEach(scene=>{const chosen=Object.entries(state.ranks[scene]).sort((a,b)=>a[1]-b[1]).map(([id,rank])=>rank+'. '+id);if(chosen.length)lines.push('Scene '+scene+' refs:\\n  '+chosen.join('\\n  '));});Object.entries(state.motion).forEach(([id,val])=>lines.push('Motion '+id+': '+val));Object.entries(state.status).forEach(([id,val])=>lines.push(id+': '+val));document.getElementById('summary').textContent=lines.join('\\n\\n')||'No choices yet';document.getElementById('status').textContent=lines.length?lines.length+' saved items':'No choices yet';}
document.querySelectorAll('[data-rank]').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.candidate');const scene=card.dataset.scene;const id=card.dataset.id;state.ranks[scene]=state.ranks[scene]||{};for(const [other,r] of Object.entries(state.ranks[scene])){if(String(r)===btn.dataset.rank)delete state.ranks[scene][other];}state.ranks[scene][id]=Number(btn.dataset.rank);save();}));
document.querySelectorAll('[data-status]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.closest('.candidate').dataset.id;state.status[id]=state.status[id]===btn.dataset.status?'':btn.dataset.status;save();}));
document.querySelectorAll('[data-motion-select]').forEach(btn=>btn.addEventListener('click',()=>{state.motion[btn.dataset.motionSelect]='selected';save();}));
document.querySelectorAll('[data-motion-revise]').forEach(btn=>btn.addEventListener('click',()=>{state.motion[btn.dataset.motionRevise]='revise';save();}));
document.getElementById('clearChoices').addEventListener('click',()=>{state={ranks:{},status:{},motion:{}};save();});
document.getElementById('copySummary').addEventListener('click',async()=>{await navigator.clipboard.writeText(document.getElementById('summary').textContent);document.getElementById('copySummary').textContent='Copied';setTimeout(()=>document.getElementById('copySummary').textContent='Copy choices',1200);});
render();
</script></body></html>`;
}

function renderIndex() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Reels Review Mobile</title>${css()}</head><body><main class="wrap"><div class="card"><h1>Reels Review Mobile v3</h1><p class="small">Mobile review pages with reduced duplicate candidates, rank buttons, motion-card selection, and browser-saved choices.</p><div class="nav">${data.map((r) => `<a href="${r.slug}.html">Review ${r.slug}</a>`).join('')}</div></div></main></body></html>`;
}

mkdirSync(outDir, { recursive: true });
for (const reel of data) writeFileSync(join(outDir, `${reel.slug}.html`), renderPage(reel));
writeFileSync(join(outDir, 'index.html'), renderIndex());
