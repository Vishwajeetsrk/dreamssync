const fs = require('fs');

const BRAND = '<span className="text-[#2563EB]">Dream</span><span className="text-black">Sync</span>';

// Fix ats-check jargon
let ats = fs.readFileSync('src/app/ats-check/page.tsx', 'utf8');
ats = ats.replace('Analyzing existing nodes for FAANG compatibility...', 'Analyzing resume for modern recruitment compatibility...');
fs.writeFileSync('src/app/ats-check/page.tsx', ats, 'utf8');

// Final Branding Sweep on all main pages
const files = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/donate/page.tsx',
  'src/app/team/page.tsx',
  'src/app/profile/page.tsx'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        // Replace "DreamSync" text but avoid spanning twice or within URLs
        // (This regex is a bit simplistic but works for most cases here)
        content = content.replace(/(?<![#/\w\d])DreamSync(?![#\w\d]|<\/span>)/g, BRAND);
        fs.writeFileSync(f, content, 'utf8');
    }
});

console.log("Updated");
