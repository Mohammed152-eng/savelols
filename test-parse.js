import fs from 'fs';
import pdfParse from 'pdf-parse';

async function parsePdf(filename) {
  const dataBuffer = fs.readFileSync(filename);
  try {
    const data = await pdfParse(dataBuffer);
    console.log(`--- ${filename} ---`);
    console.log(data.text.substring(0, 500));
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
