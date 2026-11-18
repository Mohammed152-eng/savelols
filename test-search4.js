const query = "cdn.savemyexams.com [AQA GCSE (Separate) Cell Biology] filetype:pdf";
const searchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.google.com/search?q=${encodeURIComponent(query)}`)}`;
fetch(searchUrl).then(res => res.text()).then(html => {
  console.log("Status:", html.includes("Our systems have detected unusual traffic") ? "BLOCKED" : "OK");
  const regex = /https(?:%3A%2F%2F|:\/\/)cdn\.savemyexams\.com[a-zA-Z0-9_/%.-]+\.pdf/i;
  const match = html.match(regex);
  console.log("Match:", match ? match[0] : "None");
});
