const fs = require('fs');
let c = fs.readFileSync('src/app/ikigai/page.tsx', 'utf8');
c = c.replace(/â ¤ï¸  Passion Zone/g, "❤️ Passion Zone");
c = c.replace(/bg-emerald-500 text-white font-black uppercase/g, "bg-[#FACC15] text-black font-black uppercase");
fs.writeFileSync('src/app/ikigai/page.tsx', c, 'utf8');
