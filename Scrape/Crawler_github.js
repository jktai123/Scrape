const puppeteer = require('puppeteer')
// const crawler =
var request = require('request')
const fs = require('fs')
const keyword = 'karaoke';
const Maxpage=8;
; (async () => {
    
 try {
  
  const browser = await puppeteer.launch({
    executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
   headless: false,
   args: ['--window-size=240,400', '--disable-notifications', '--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36');
  await page.setViewport({
   width: 1080,
   height: 1080,
  });
  
  await page.goto(`https://github.com/search?q=${keyword}`, {
   waitUntil: 'networkidle0',
  });
  let result = [];
  let pageNum = 1;
  while (pageNum <= Maxpage) {
   const r = await page.evaluate(() => {
    const tags = document.querySelectorAll('.repo-list-item');
    const result = [];
    tags.forEach((t) => {
        let lang='';
        let star='';
        let desc='';
        try{
            lang=t.querySelector('span[itemprop="programmingLanguage"]').textContent.trim();
        }catch{

        }
        try{
            star= t.querySelector('a.Link--muted').textContent.trim();
        }catch{

        }
        try{
            desc=t.querySelector('p.mb-1').innerText.trim();
        }catch{

        }
     result.push({
      name: t.querySelector('a').innerText.trim(),
      description:desc,
      href: t.querySelector('a').href,
      star: star,
      lang: lang
     })
    });
    return result;
   });
//    console.log(r);
   result = result.concat(r);
   let t=await page.$('.next_page');
   if(t===null){
    break;
   }else{
   await page.waitForSelector('.next_page');
   await page.click('.next_page');
   pageNum++;

   await page.waitForResponse((response) => {
    return response.url().startsWith(`https://github.com/search/count?p=${pageNum}`) && response.status() === 200;
   });
    }
   await page.waitForTimeout(2000);//page.waitFor(2000);
  }
  const f_lead=keyword;
  console.log(result.length);
  console.log(result[0]);
   const fs = require('fs');
    const directory = __dirname + '/github';
    if(!fs.existsSync(directory)){
  fs.mkdirSync(directory)
}

    writerStream = fs.createWriteStream( `${directory}/${f_lead}.json`);
    writerStream.write(JSON.stringify(result, undefined, 2), 'UTF8');
    writerStream.end();

    const { Parser } = require('json2csv');
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(result);
    

    fs.writeFile(`${directory}/${f_lead}.csv`, csv, function(err) {
        if (err) {
            return console.log(err);
        }
        
        console.log(` ${f_lead}.csv file was saved!`);
 
    });
 await browser.close(); 
 } catch (e) {
  console.error(e);
 }

})()