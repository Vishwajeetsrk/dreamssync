const fs = require('fs');

function applyFixes(path, replacements) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    replacements.forEach(([oldStr, newStr]) => {
        content = content.replace(new RegExp(oldStr, 'g'), newStr);
    });
    fs.writeFileSync(path, content, 'utf8');
}

// 1. Ikigai Page Fixes
applyFixes('src/app/ikigai/page.tsx', [
    ['â ¤ï¸  What You Love', '❤️ What You Love'],
    ['â ¤ï¸  Passion Zone', '❤️ Passion Zone'],
    ['Ã—', '×'],
    // Ensure Add button is Yellow
    ['bg-black text-white font-black uppercase hover:bg-primary', 'bg-[#FACC15] text-black font-black uppercase hover:bg-black hover:text-white'],
    // Responsive grids (already mostly there, but let's ensure)
    ['grid grid-cols-1 lg:grid-cols-2', 'grid grid-cols-1 lg:grid-cols-2'],
    ['grid grid-cols-1 md:grid-cols-2 gap-6', 'grid grid-cols-1 md:grid-cols-2 gap-6']
]);

// 2. Resume Builder Fixes
applyFixes('src/app/resume-builder/page.tsx', [
    // Fix IMPORT button color
    ['text-\\[\\#2563EB\\]">IMPORT SOURCE PDF', 'text-[#FACC15]">IMPORT SOURCE PDF'],
    ['<Upload className="w-5 h-5 text-\\[\\#2563EB\\]" />', '<Upload className="w-5 h-5 text-[#FACC15]" />']
]);

// 3. Forgot Password Branding
applyFixes('src/app/forgot-password/page.tsx', [
    ['bg-primary', 'bg-[#2563EB]'],
    ['text-primary', 'text-[#2563EB]']
]);

console.log("Master fixes applied");
