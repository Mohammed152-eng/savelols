import fetch from 'node-fetch';
import fs from 'fs';

async function downloadAndCheck(url, filename) {
  try {
    const res = await fetch(url);
    const buffer = await res.buffer();
    fs.writeFileSync(filename, buffer);
    console.log(`Downloaded ${filename} (${buffer.length} bytes)`);
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/puk06oUbP5Sr~hMZ.pdf', 'pdf1.pdf');
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/vh89MnqQwXc7KKXN.pdf', 'pdf2.pdf');
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/toi~oquVja7sdRyp.pdf', 'pdf3.pdf');
}

run();
