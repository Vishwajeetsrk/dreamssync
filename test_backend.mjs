import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function test() {
  const res = await fetch('http://localhost:3000/api/analyze-resume', {
    method: 'POST',
    // No body needed to just hit the endpoint and see the error
  });
  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("BODY_START-----");
  console.log(text.substring(0, 1500));
  console.log("BODY_END-------");
}
test();
