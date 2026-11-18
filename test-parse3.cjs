const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();

async function parsePdf(filename) {
  try {
    const data = await pdfExtract.extract(filename, {});
    console.log(`--- ${filename} ---`);
    console.log(data.pages[0].content.map(c => c.str).join(' ').substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await parsePdf('pdf1.pdf');
  await parsePdf('pdf2.pdf');
  await parsePdf('pdf3.pdf');
}

run();
