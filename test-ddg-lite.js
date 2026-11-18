import https from 'https';
import fs from 'fs';

const query = 'site:cdn.savemyexams.com AQA GCSE Cell Structure Size Specimens revision notes filetype:pdf';
const url = `https://lite.duckduckgo.com/lite/`;

const postData = new URLSearchParams({
  q: query,
  kl: '',
}).toString();

const options = {
  hostname: 'lite.duckduckgo.com',
  path: '/lite/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Origin': 'https://lite.duckduckgo.com',
    'Referer': 'https://lite.duckduckgo.com/'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('ddg-lite-out.html', data);
    console.log("Written to ddg-lite-out.html");
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();
