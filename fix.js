const fs = require('fs');
let content = fs.readFileSync('src/app/ikigai/page.tsx', 'utf8');
content = content.replace(/â ¤ï¸/g, "❤️").replace(/âœ“/g, "✓").replace(/âœ¨/g, "✨").replace(/â†’/g, "→").replace(/â”€/g, "—");
content = content.replace(/ðŸŒ /g, "🌍").replace(/ðŸ’°/g, "💰").replace(/ðŸ’ª/g, "💪").replace(/ðŸŽ¯/g, "🎯");
fs.writeFileSync('src/app/ikigai/page.tsx', content, 'utf8');

let resume = fs.readFileSync('src/app/resume-builder/page.tsx', 'utf8');
resume = resume.replace(/â€“/g, "–");
fs.writeFileSync('src/app/resume-builder/page.tsx', resume, 'utf8');
