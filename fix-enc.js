const fs = require('fs');

function fix(filepath) {
    let buf = fs.readFileSync(filepath);
    let s = buf.toString('utf8');

    // These are common broken patterns I see in the logs
    s = s.split('â ¤ï¸').join('❤️');
    s = s.split('Ã—').join('×');
    s = s.split('ðŸŒ').join('🌍');
    s = s.split('ðŸ’ª').join('💪');
    s = s.split('ðŸ’°').join('💰');
    s = s.split('ðŸŽ¯').join('🎯');
    
    // Also fix the button color if it hasn't been fixed yet
    const oldBtn = 'className="px-8 py-4 bg-black text-white font-black uppercase hover:bg-primary transition-colors border-4 border-black neo-box"';
    if (s.includes(oldBtn)) {
        const newBtn = 'className="px-8 py-4 bg-[#FACC15] text-black font-black uppercase hover:bg-black hover:text-white transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"';
        s = s.replace(oldBtn, newBtn);
    }

    fs.writeFileSync(filepath, s, 'utf8');
}

fix('src/app/ikigai/page.tsx');
