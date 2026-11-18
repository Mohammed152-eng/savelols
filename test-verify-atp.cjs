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
    
    if (contentType === 'Alternative to Practical Questions') {
      return firstPageText.includes("alternative to practical questions");
    }
  } catch (e) {
    console.error("Error verifying PDF:", e);
    return false;
  }
}

async function run() {
  const urls = [
    'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-assessments-and-answers-xcKtFqStHBBhz8GH-1759255954508.pdf',
    'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-assessments-and-answers-Y5kD2xpSSWZWhRSn-1769131039459.pdf',
    'https://cdn.savemyexams.com/pdfs/3-1-formulae-and-relative-masses-STF6Gfhg75nQX3pJ.pdf',
    'https://cdn.savemyexams.com/pdfs/cie-igcse-chem---toq---3-1-formulae-and-relative-masses-assessments-and-answers-ytfBTHGccky9Cytc-1767506510569.pdf',
    'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-dK6diFR0RysbK2L6.pdf',
    'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-assessments-xcKtFqStHBBhz8GH-1759255954508.pdf',
    'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-assessments-and-answers-kFtWnggWMnsRJ8Cs-1763446273679.pdf',
    'https://cdn.savemyexams.com/pdfs/formulae-and-relative-masses-9Q75Uhu.pdf',
    'https://cdn.savemyexams.com/pdfs/3-1-formulae-and-relative-masses-bV3O28aT3CaUD9ct.pdf',
    'https://cdn.savemyexams.com/uploads/2020/05/CIE-IGCSE-Chemistry-4-RN.pdf'
  ];
  
  for (const url of urls) {
    console.log(`Testing ${url}`);
    console.log(`  Is ATP? ${await verifyPdfContent(url, 'Alternative to Practical Questions')}`);
  }
}

run();
