const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run() {
  const url = 'https://cdn.savemyexams.com/uploads/2020/05/CIE-IGCSE-Chemistry-4-RN.pdf';
  try {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const data = await pdfExtract.extractBuffer(buffer, { firstPage: 1, lastPage: 1 });
    const firstPageText = data.pages[0].content.map(c => c.str).join(' ');
    console.log("--- First Page Text ---");
    console.log(firstPageText.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}

run();
