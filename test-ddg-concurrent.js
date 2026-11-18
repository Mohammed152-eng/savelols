import https from 'https';

async function searchTopic(topic) {
  const query = `site:cdn.savemyexams.com AQA GCSE ${topic.replace(/[^a-zA-Z0-9 ]/g, '')} revision notes filetype:pdf`;
  const postData = new URLSearchParams({ q: query, kl: '' }).toString();

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

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ topic, html: data });
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  const res = await searchTopic('Cell Structure & Size of Specimens');
  console.log(res.html.substring(0, 500));
}

run();
