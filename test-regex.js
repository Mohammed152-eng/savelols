import fs from 'fs';
const html = fs.readFileSync('corsproxy-out.html', 'utf8');
const regex = /\/\/duckduckgo\.com\/l\/\?uddg=([^&]+)/g;
let match;
const urls = [];
while ((match = regex.exec(html)) !== null) {
  urls.push(decodeURIComponent(match[1]));
}
console.log([...new Set(urls)]);
