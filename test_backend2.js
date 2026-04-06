const http = require('http');

const req = http.request('http://localhost:3000/api/analyze-resume', { method: 'POST' }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    // Basic regex to extract error text from Next.js error overlay html
    const match = body.match(/<title>(.*?)<\/title>/);
    console.log("TITLE:", match ? match[1] : "No Title");
    
    // Look for standard Next.js error text
    const errorMatch = body.match(/data-nextjs-dialog-header="[^"]*">([^<]+)<\/h1>/);
    const descMatch = body.match(/data-nextjs-dialog-body="[^"]*">.*?>(.*?)<\/div>/s);
    if (errorMatch) {
       console.log("ERROR:", errorMatch[1]);
    }
    
    // Just dump the first 10k chars into a file so I can view it properly
    const fs = require('fs');
    fs.writeFileSync('error_dump.html', body);
    console.log("Wrote HTML to error_dump.html");
  });
});
req.on('error', console.error);
req.end();
