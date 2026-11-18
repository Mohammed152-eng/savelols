import fetch from 'node-fetch';

async function testSearch(query) {
  const ddgTargetUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const ddgUrl = 'https://corsproxy.io/?' + encodeURIComponent(ddgTargetUrl);
  console.log("Searching:", query);
  try {
    const res = await fetch(ddgUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      }
    });
    const html = await res.text();
    const regex = /https(?:%3A%2F%2F|:\/\/)cdn\.savemyexams\.(?:com|co\.uk)[a-zA-Z0-9_/%.\-~]+\.pdf/gi;
    const matches = html.match(regex);
    if (matches) {
      const urls = [...new Set(matches.map(m => decodeURIComponent(m)))];
      console.log("Found:", urls);
    } else {
      console.log("No matches found.");
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await testSearch('site:cdn.savemyexams.com CIE IGCSE Diffusion  Osmosis   Active Transport mark scheme filetype:pdf');
}

run();
