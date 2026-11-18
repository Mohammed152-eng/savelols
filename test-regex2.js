const regex = /https(?:%3A%2F%2F|:\/\/)cdn\.savemyexams\.(?:com|co\.uk)[a-zA-Z0-9_/%.\-~]+\.pdf/gi;
const str = '//duckduckgo.com/l/?uddg=https%3A%2F%2Fcdn.savemyexams.com%2Fpdfs%2FZ3HhC97nvykKnHzF.pdf';
console.log(str.match(regex));
