const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifyPdfContent(url, contentType) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) return false;
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const data = await pdfExtract.extractBuffer(buffer, { firstPage: 1, lastPage: 1 });
    const firstPageText = data.pages[0].content.map(c => c.str).join(' ');
    
    let requiredString = "";
    if (contentType === 'Multiple Choice Questions') requiredString = "Multiple Choice Questions";
    else if (contentType === 'Theory Questions') requiredString = "Theory Questions";
    else if (contentType === 'Alternative to Practical Questions') requiredString = "Alternative to Practical Questions";
    else if (contentType === 'Mark Schemes') requiredString = "Mark scheme";
    else requiredString = "Revision Notes";

    return firstPageText.toLowerCase().includes(requiredString.toLowerCase());
  } catch (e) {
    console.error("Error verifying PDF:", e);
    return false;
  }
}

async function run() {
  const url = 'https://cdn.savemyexams.com/pdfs/DkMJ8cgBoUGwca7-.pdf'; // pdf11.pdf
  const isRN = await verifyPdfContent(url, 'Revision Notes');
  console.log(`Is RN? ${isRN}`);
}

run();
