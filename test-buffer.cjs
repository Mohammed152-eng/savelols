const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBuffer() {
  const res = await fetch('https://cdn.savemyexams.com/pdfs/mock-exam-paper-DMdpjtg9DHyHcncz.pdf');
  const buffer = await res.buffer();
  
  try {
    const data = await pdfExtract.extractBuffer(buffer, {});
    console.log(data.pages[0].content.map(c => c.str).join(' ').substring(0, 200));
  } catch (e) {
    console.error(e);
  }
}

testBuffer();
