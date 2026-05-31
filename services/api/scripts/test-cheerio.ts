import * as cheerio from 'cheerio';

async function test() {
  const res = await fetch('https://www.tvtruyen.co.uk/ta-danh-cap-dong-thoi-gian/chuong-1-giac-mo-ky-la');
  const html = await res.text();
  const $ = cheerio.load(html);

  const mainDivs = $('div').filter((i, el) => $(el).find('p').length > 5).get();
  console.log('Divs with many paragraphs:', mainDivs.map(el => $(el).attr('class') || $(el).attr('id')));
}
test();
