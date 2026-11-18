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
  const urls = [
    'https://cdn.savemyexams.com/pdfs/mock-exam-paper-DMdpjtg9DHyHcncz.pdf',
    'https://cdn.savemyexams.com/pdfs/4-1-electrolysis-jPNhWWR57Rt8wHXR.pdf',
    'https://cdn.savemyexams.com/pdfs/4-1-electrolysis-z9Wy9DSpcGMxfjX3.pdf',
    'https://cdn.savemyexams.com/uploads/2020/05/CIE-IGCSE-Chemistry-5-RN.pdf'
  ];
  
  for (const url of urls) {
    console.log(`Testing ${url}`);
    const isATP = await verifyPdfContent(url, 'Alternative to Practical Questions');
    console.log(`Is ATP? ${isATP}`);
    const isTheory = await verifyPdfContent(url, 'Theory Questions');
    console.log(`Is Theory? ${isTheory}`);
    const isRN = await verifyPdfContent(url, 'Revision Notes');
    console.log(`Is RN? ${isRN}`);
  }
}

run();
