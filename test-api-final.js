async function test() {
  const res = await fetch('http://localhost:3000/api/search?board=AQA&level=GCSE&topic=Cell%20Structure');
  const data = await res.json();
  console.log(data);
}
test();
