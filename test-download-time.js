import fetch from 'node-fetch';

async function testDownloadTime(url) {
  const start = Date.now();
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    console.log(`Downloaded ${buffer.byteLength} bytes in ${Date.now() - start}ms`);
  } catch (e) {
    console.error(`Failed in ${Date.now() - start}ms:`, e.message);
  }
}

async function run() {
  await testDownloadTime('https://cdn.savemyexams.com/pdfs/diffusion-osmosis-and-active-transport-assessments-and-answers-dSs623q9JRG9WdYY-1759244455931.pdf');
  await testDownloadTime('https://cdn.savemyexams.com/pdfs/asmnt_yBKGsrFhyjbTCpB3-mark-scheme-preview-1772004197871.pdf');
}

run();
