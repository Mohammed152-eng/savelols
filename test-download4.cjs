const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();

async function downloadAndCheck(url, filename) {
  try {
    const res = await fetch(url);
    const buffer = await res.buffer();
    fs.writeFileSync(filename, buffer);
    console.log(`Downloaded ${filename} (${buffer.length} bytes)`);
    
    const data = await pdfExtract.extract(filename, {});
    console.log(`--- ${filename} ---`);
    console.log(data.pages[0].content.map(c => c.str).join(' ').substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/4-1-electrolysis-jPNhWWR57Rt8wHXR.pdf', 'pdf8.pdf');
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/4-1-electrolysis-z9Wy9DSpcGMxfjX3.pdf', 'pdf9.pdf');
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/2XNg-QSVSj0XGL3m.pdf', 'pdf10.pdf');
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/DkMJ8cgBoUGwca7-.pdf', 'pdf11.pdf');
}

run();
