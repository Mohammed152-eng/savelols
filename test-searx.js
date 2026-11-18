import https from 'https';

const url = 'https://searx.be/search?q=' + encodeURIComponent('site:cdn.savemyexams.com AQA GCSE Cell Structure revision notes filetype:pdf') + '&format=json';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(json.results.map(r => r.url));
    } catch (e) {
      console.log(data.substring(0, 500));
    }
  });
});
