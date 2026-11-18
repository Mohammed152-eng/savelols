import fs from 'fs';

async function fetchTopic(topic) {
  const targetUrl = `https://html.duckduckgo.com/html/?q=site:cdn.savemyexams.com+${encodeURIComponent(topic)}+revision+notes+filetype:pdf`;
  const url = 'https://corsproxy.io/?' + encodeURIComponent(targetUrl);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
      }
    });
    const html = await response.text();
    const regex = /\/\/duckduckgo\.com\/l\/\?uddg=([^&]+)/g;
    let match;
    const urls = [];
    while ((match = regex.exec(html)) !== null) {
      const decoded = decodeURIComponent(match[1]);
      if (decoded.includes('cdn.savemyexams.com/pdfs/') && decoded.endsWith('.pdf')) {
        urls.push(decoded);
      }
    }
    console.log(`Topic: ${topic} -> Found ${urls.length} PDFs`);
    return [...new Set(urls)];
  } catch (error) {
    console.error(`Error for ${topic}:`, error);
    return [];
  }
}

async function test() {
  const topics = [
    'AQA GCSE Cell Structure',
    'AQA GCSE Cell Transport',
    'AQA GCSE Cell Division',
    'AQA GCSE Organisation',
    'AQA GCSE Infection and Response'
  ];
  const promises = topics.map(fetchTopic);
  const results = await Promise.all(promises);
  console.log(results);
}

test();
