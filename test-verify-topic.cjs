const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifyPdfContent(url, contentType, topic) {
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
    
    const normalizedTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedPdfText = firstPageText.replace(/[^a-z0-9]/g, '');
    const hasTopic = normalizedPdfText.includes(normalizedTopic);
    
    if (!hasTopic) {
      console.log(`  Topic '${topic}' not found in PDF`);
      return false;
    }

    if (contentType === 'Multiple Choice Questions') {
      return firstPageText.includes("multiple choice questions") && !firstPageText.includes("mark scheme");
    } else if (contentType === 'Theory Questions') {
      return firstPageText.includes("theory questions") && !firstPageText.includes("mark scheme");
    } else if (contentType === 'Alternative to Practical Questions') {
      return firstPageText.includes("alternative to practical questions") && !firstPageText.includes("mark scheme");
    } else if (contentType === 'Mark Schemes') {
      return firstPageText.includes("mark scheme") || firstPageText.includes("answers");
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
  const url1 = 'https://cdn.savemyexams.com/pdfs/4-1-electrolysis-z9Wy9DSpcGMxfjX3.pdf';
  console.log(`Testing ${url1}`);
  console.log(`  Is Theory for Electrolysis? ${await verifyPdfContent(url1, 'Theory Questions', 'Electrolysis')}`);
  console.log(`  Is Theory for Atomic Structure? ${await verifyPdfContent(url1, 'Theory Questions', 'Atomic Structure')}`);
  
  const url2 = 'https://cdn.savemyexams.com/pdfs/diffusion-osmosis-and-active-transport-assessments-and-answers-dSs623q9JRG9WdYY-1759244455931.pdf';
  console.log(`Testing ${url2}`);
  console.log(`  Is MS for Diffusion? ${await verifyPdfContent(url2, 'Mark Schemes', 'Diffusion, Osmosis & Active Transport')}`);
}

run();
