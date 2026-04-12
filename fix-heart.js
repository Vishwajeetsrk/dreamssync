const fs = require('fs');
let buf = fs.readFileSync('src/app/ikigai/page.tsx');
let s = buf.toString('utf8');

// The sequence â ¤ï¸  often appears as C3 A2 C2 A4 C3 AF C2 B8 in some cases, or similar.
// But let's just do a string replace on what view_file showed.
// The most reliable way in Node is to use the string as it is read.
s = s.replace(/â ¤ï¸ /g, "❤️ ");
s = s.replace(/Â❤¤Ï¸/g, "❤️ "); // Match what was in the screenshot if it appeared as such
s = s.replace(/â ¤ï¸/g, "❤️");

fs.writeFileSync('src/app/ikigai/page.tsx', s, 'utf8');
