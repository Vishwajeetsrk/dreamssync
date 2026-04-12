const fs = require('fs');
let content = fs.readFileSync('src/app/ikigai/page.tsx', 'utf8');

// Fix emojis and broken chars
content = content.replace(/â ¤ï¸/g, "❤️");
content = content.replace(/ðŸŒ /g, "🌍");
content = content.replace(/ðŸ’°/g, "💰");
content = content.replace(/ðŸ’ª/g, "💪");
content = content.replace(/ðŸŽ¯/g, "🎯");
content = content.replace(/Ã—/g, "×");
content = content.replace(/â€”/g, "—");
content = content.replace(/âœ“/g, "✓");
content = content.replace(/âœ¨/g, "✨");
content = content.replace(/â†’/g, "→");

// Fix Add button color (from bg-black to bg-[#FACC15] and text-black)
content = content.replace(
    'className="px-8 py-4 bg-black text-white font-black uppercase hover:bg-primary transition-colors border-4 border-black neo-box"',
    'className="px-8 py-4 bg-[#FACC15] text-black font-black uppercase hover:bg-black hover:text-white transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"'
);

fs.writeFileSync('src/app/ikigai/page.tsx', content, 'utf8');
