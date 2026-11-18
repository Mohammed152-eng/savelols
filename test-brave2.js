const query = "cdn.savemyexams.com [AQA GCSE (Separate) Cell Biology] filetype:pdf";
const searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
fetch(searchUrl, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  }
}).then(res => res.text()).then(html => {
  const regex = /https(?:%3A%2F%2F|:\/\/)cdn\.savemyexams\.com[a-zA-Z0-9_/%.-]+\.pdf/i;
  const match = html.match(regex);
  if (match) {
    let finalUrl = match[0];
    if (finalUrl.includes('%')) {
      finalUrl = decodeURIComponent(finalUrl);
    }
    console.log("Match:", finalUrl);
  } else {
    console.log("None");
  }
});
