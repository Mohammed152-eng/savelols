import googleIt from 'google-it';

async function test() {
  try {
    const results = await googleIt({ query: 'site:cdn.savemyexams.com AQA GCSE Cell Structure revision notes filetype:pdf' });
    console.log(results);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
