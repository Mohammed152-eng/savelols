import googleIt from 'google-it';
const query = "cdn.savemyexams.com [AQA GCSE (Separate) Cell Biology] filetype:pdf";
googleIt({ query }).then(results => {
  console.log("Results:", results);
}).catch(e => {
  console.error("Error:", e);
});
