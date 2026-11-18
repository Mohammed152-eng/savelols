import fetch from 'node-fetch';

async function testApi(contentType) {
  const url = `http://localhost:3000/api/search?board=CIE&level=IGCSE&topic=Formulae%20%26%20Relative%20Masses&contentType=${encodeURIComponent(contentType)}`;
  console.log(`Testing API for: ${contentType}`);
  const start = Date.now();
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(`Result:`, data);
    console.log(`Time: ${Date.now() - start}ms`);
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await testApi('Revision Notes');
  await testApi('Multiple Choice Questions');
  await testApi('Theory Questions');
  await testApi('Alternative to Practical Questions');
  await testApi('Mark Schemes');
}

run();
