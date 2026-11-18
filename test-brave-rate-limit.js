import https from 'https';

const query = 'cdn.savemyexams.com AQA GCSE Cell Biology revision notes filetype:pdf';

async function fetchBrave() {
  for (let i = 0; i < 5; i++) {
    const braveUrl = `https://search.brave.com/search?q=${encodeURIComponent(query + ' ' + i)}`;
    await new Promise(resolve => {
      https.get(braveUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        }
      }, (res) => {
        console.log(`Request ${i}: ${res.statusCode}`);
        res.resume();
        resolve();
      });
    });
  }
}

fetchBrave();
