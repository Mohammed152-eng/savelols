import fs from 'fs';
import https from 'https';

const url = 'https://corsproxy.io/?' + encodeURIComponent('https://html.duckduckgo.com/html/?q=site:cdn.savemyexams.com+AQA+GCSE+Cell+Structure+revision+notes+filetype:pdf');

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('corsproxy-out.html', data);
    console.log("Written to corsproxy-out.html");
  });
});
