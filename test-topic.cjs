const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run() {
  const url = 'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-dK6diFR0RysbK2L6.pdf';
  try {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const data = await pdfExtract.extractBuffer(buffer, { firstPage: 1, lastPage: 1 });
    const firstPageText = data.pages[0].content.map(c => c.str).join(' ');
    console.log("--- First Page Text ---");
    console.log(firstPageText);
  } catch (e) {
    console.error(e);
  }
}

run();
