fetch("http://localhost:3000/api/search?board=AQA&level=GCSE&topic=Cell+Biology")
  .then(res => res.json())
  .then(data => console.log(data));
