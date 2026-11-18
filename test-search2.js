import fs from 'fs';
const query = "cdn.savemyexams.com [AQA GCSE (Separate) Cell Biology] filetype:pdf";
const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
fetch(searchUrl, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  }
}).then(res => res.text()).then(html => {
  fs.writeFileSync('google-html.txt', html);
  console.log("Saved to google-html.txt");
});
