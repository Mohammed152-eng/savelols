import fs from 'fs';

async function test() {
  const topics = [
    'Cell Structure',
    'Cell Division',
    'Organisation',
    'Infection and Response',
    'Bioenergetics'
  ];
  const promises = topics.map(async (topic) => {
    const res = await fetch(`http://localhost:3000/api/download?board=AQA&level=GCSE&topic=${encodeURIComponent(topic)}`);
    return res.ok;
  });
  const results = await Promise.all(promises);
  console.log(results);
}
test();
