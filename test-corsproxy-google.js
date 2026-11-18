import fs from 'fs';

async function test() {
  const targetUrl = 'https://www.google.com/search?q=site:cdn.savemyexams.com+AQA+GCSE+Cell+Structure+revision+notes+filetype:pdf';
  const url = 'https://corsproxy.io/?' + encodeURIComponent(targetUrl);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    const html = await response.text();
    fs.writeFileSync('corsproxy-google-out.html', html);
    console.log('Written to corsproxy-google-out.html');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
