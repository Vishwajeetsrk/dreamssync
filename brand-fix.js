const fs = require('fs');

const BRAND = '<span className="text-[#2563EB]">Dream</span><span className="text-black">Sync</span>';

// 1. page.tsx
let home = fs.readFileSync('src/app/page.tsx', 'utf8');
home = home.replace('Enjoying DreamSync?', `Enjoying ${BRAND}?`);
home = home.replace('DreamSync is 100% free for students', `${BRAND} is 100% free for students`);
fs.writeFileSync('src/app/page.tsx', home, 'utf8');

// 2. donate/page.tsx
let donate = fs.readFileSync('src/app/donate/page.tsx', 'utf8');
donate = donate.replace('>DreamSync</span>', `>${BRAND}</span>`);
donate = donate.replace('DreamSync is 100% free', `${BRAND} is 100% free`);
donate = donate.replace('DreamSync runs on', `${BRAND} runs on`);
donate = donate.replace('using DreamSync and', `using ${BRAND} and`);
fs.writeFileSync('src/app/donate/page.tsx', donate, 'utf8');

// 3. signup/page.tsx
let signup = fs.readFileSync('src/app/signup/page.tsx', 'utf8');
signup = signup.replace('Join DreamSync and', `Join ${BRAND} and`);
fs.writeFileSync('src/app/signup/page.tsx', signup, 'utf8');

// 4. login/page.tsx
let login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
login = login.replace('your DreamSync account', `your ${BRAND} account`);
fs.writeFileSync('src/app/login/page.tsx', login, 'utf8');

// 5. team/page.tsx
let team = fs.readFileSync('src/app/team/page.tsx', 'utf8');
team = team.replace('DreamSync Team', `${BRAND} Team`);
fs.writeFileSync('src/app/team/page.tsx', team, 'utf8');

// 6. layout.tsx -> just change title? No, title cannot contain JSX. Skip layout.tsx

console.log("Done");
