const http = require('http');

const req = http.request('http://localhost:3000/api/analyze-resume', { method: 'POST' }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log("STATUS:", res.statusCode);
    console.log("BODY_START-----");
    console.log(body.substring(0, 1500));
    console.log("BODY_END-------");
  });
});
req.on('error', console.error);
req.end();
