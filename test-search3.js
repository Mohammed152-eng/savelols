import fs from 'fs';
const html = fs.readFileSync('google-html.txt', 'utf8');
const links = html.match(/href="[^"]+"/g);
if (links) {
  console.log(links.filter(l => !l.includes('gstatic') && !l.includes('google.com')).slice(0, 20).join('\n'));
} else {
  console.log("No links found");
}
