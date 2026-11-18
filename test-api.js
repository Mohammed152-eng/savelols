fetch("http://localhost:3000/api/search?q=cdn.savemyexams.com+%5BAQA+GCSE+%28Separate%29+Cell+Biology%5D+filetype%3Apdf")
  .then(res => res.json())
  .then(data => console.log(data));
