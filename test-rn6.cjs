const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run() {
  const urls = [
    'https://cdn.savemyexams.com/pdfs/3-1-formulae-and-relative-masses-STF6Gfhg75nQX3pJ.pdf',
    'https://cdn.savemyexams.com/pdfs/3-1-formulae-and-relative-masses-bV3O28aT3CaUD9ct.pdf',
    'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-dK6diFR0RysbK2L6.pdf'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const data = await pdfExtract.extractBuffer(buffer, { firstPage: 1, lastPage: 1 });
      const firstPageText = data.pages[0].content.map(c => c.str).join(' ');
      console.log(`--- ${url} ---`);
      console.log(firstPageText.substring(0, 200));
    } catch (e) {
      console.error(e);
    }
  }
}

run();
