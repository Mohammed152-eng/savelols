import fs from 'fs';

async function test() {
  const targetUrl = 'https://html.duckduckgo.com/html/?q=site:cdn.savemyexams.com+AQA+GCSE+Cell+Structure+revision+notes+filetype:pdf';
  const url = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(targetUrl);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
      }
    });
    const html = await response.text();
    fs.writeFileSync('codetabs-out.html', html);
    console.log('Written to codetabs-out.html');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
