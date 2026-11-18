import https from 'https';

const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://html.duckduckgo.com/html/?q=site:cdn.savemyexams.com+AQA+GCSE+Cell+Structure+revision+notes+filetype:pdf');

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 500));
    const matches = data.match(/https:\/\/cdn\.savemyexams\.com\/pdfs\/[^"]+\.pdf/g);
    console.log(matches);
  });
});
