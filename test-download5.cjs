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
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/cie-igcse-chem---apq---4-1-electrolysis-assessments-and-answers-ytfBTHGccky9Cytc-1767549447128.pdf', 'pdf12.pdf');
  await downloadAndCheck('https://cdn.savemyexams.com/pdfs/asmnt_yBKGsrFhyjbTCpB3-mark-scheme-preview-1772004197871.pdf', 'pdf13.pdf');
}

run();
