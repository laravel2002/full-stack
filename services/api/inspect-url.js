const https = require('https');

https.get('https://www.tvtruyen.co.uk/ta-danh-cap-dong-thoi-gian.html', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // print out first 2000 chars and search for some keywords like title, chapter
    console.log(data.substring(0, 3000));
    console.log('\n--- MATCHES FOR TITLE ---');
    const titleMatches = data.match(/<title>(.*?)<\/title>/g);
    console.log(titleMatches);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
