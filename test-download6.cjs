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
  await downloadAndCheck('https://cdn.savemyexams.com/uploads/2020/05/CIE-IGCSE-Chemistry-5-RN.pdf', 'pdf14.pdf');
}

run();
