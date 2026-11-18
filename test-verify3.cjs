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
    const firstPageText = data.pages[0].content.map(c => c.str).join(' ').toLowerCase();
    
    if (contentType === 'Multiple Choice Questions') {
      return firstPageText.includes("multiple choice questions");
    } else if (contentType === 'Theory Questions') {
      return firstPageText.includes("theory questions");
    } else if (contentType === 'Alternative to Practical Questions') {
      return firstPageText.includes("alternative to practical questions");
    } else if (contentType === 'Mark Schemes') {
      return firstPageText.includes("mark scheme");
    } else {
      // Revision Notes
      return firstPageText.includes("revision notes") && 
             !firstPageText.includes("multiple choice questions") &&
             !firstPageText.includes("theory questions") &&
             !firstPageText.includes("alternative to practical questions") &&
             !firstPageText.includes("mark scheme");
    }
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
    'https://cdn.savemyexams.com/uploads/2020/05/CIE-IGCSE-Chemistry-5-RN.pdf',
    'https://cdn.savemyexams.com/pdfs/DkMJ8cgBoUGwca7-.pdf',
    'https://cdn.savemyexams.com/pdfs/cie-igcse-chem---apq---4-1-electrolysis-assessments-and-answers-ytfBTHGccky9Cytc-1767549447128.pdf'
  ];
  
  for (const url of urls) {
    console.log(`Testing ${url}`);
    console.log(`  Is ATP? ${await verifyPdfContent(url, 'Alternative to Practical Questions')}`);
    console.log(`  Is Theory? ${await verifyPdfContent(url, 'Theory Questions')}`);
    console.log(`  Is RN? ${await verifyPdfContent(url, 'Revision Notes')}`);
    console.log(`  Is MS? ${await verifyPdfContent(url, 'Mark Schemes')}`);
  }
}

run();
