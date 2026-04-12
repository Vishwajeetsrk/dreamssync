const fs = require('fs');

const BRAND = '<span className="text-[#2563EB]">Dream</span><span className="text-black">Sync</span>';

function fixFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  replacements.forEach(([oldStr, newStr]) => {
    content = content.replace(new RegExp(oldStr, 'g'), newStr);
  });
  fs.writeFileSync(path, content, 'utf8');
}

// 1. Navbar.tsx
fixFile('src/components/Navbar.tsx', [
  ['SPONSOR NODES', 'SPONSOR US'],
  ['CAREER ROADMAP', 'CAREER ROADMAP'], 
  ['PORTFOLIO GEN', 'PORTFOLIO BUILDER'],
  ['Identity Protocol', 'About Us']
]);

// 2. Footer.tsx (if it exists)
if (fs.existsSync('src/components/Footer.tsx')) {
    fixFile('src/components/Footer.tsx', [
        ['DreamSync. All rights reserved', 'DreamSync. All rights reserved']
    ]);
}

// 3. Ensure Branding in footer/other pages
const files = [
    'src/app/page.tsx',
    'src/app/about/page.tsx', 
    'src/app/donate/page.tsx',
    'src/app/login/page.tsx',
    'src/app/signup/page.tsx',
    'src/app/team/page.tsx'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let c = fs.readFileSync(f, 'utf8');
        // Match DreamSync but not if it's already in the span or a URL
        // Simple replacement for text occurrences
        // c = c.replace(/DreamSync(?!<\/span>)/g, BRAND); // This might be dangerous if inside attributes
        // Better to be specific or use a safer regex
        // Let's just do a few safe ones
        c = c.replace(/>DreamSync</g, `>${BRAND}<`);
        c = c.replace(/Join DreamSync/g, `Join ${BRAND}`);
        c = c.replace(/About DreamSync/g, `About ${BRAND}`);
        c = c.replace(/Enjoying DreamSync/g, `Enjoying ${BRAND}`);
        fs.writeFileSync(f, c, 'utf8');
    }
});

console.log("Professionalized and Branded");
