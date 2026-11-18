import https from 'https';
import fs from 'fs';

const query = 'cdn.savemyexams.com AQA GCSE Cell Biology revision notes filetype:pdf';
const braveUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;

https.get(braveUrl, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5"
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('brave-out.html', data);
    console.log("Written to brave-out.html");
  });
});
