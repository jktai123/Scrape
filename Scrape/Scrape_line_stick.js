const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs');
const { data } = require('cheerio/lib/api/attributes');
// import { launch } from 'puppeteer';
// import request, { head } from 'request';
// import { createWriteStream } from 'fs';
// const url='https://www.youtube.com/user/TheXmelro89/videos';
// const url='https://www.youtube.com/playlist?list=PLsHdB4Zk-aF1yKNc1D4usjTWBOCmlhGZF'

const keyword = '快樂';
const f_lead=keyword ;//'生活百科11';
const url=`https://store.line.me/search/sticker/zh-Hant?q=${keyword}`;
const maxcnt = 356;
// 下載圖片
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri)
            .pipe(fs.createWriteStream(__dirname + `/line/${filename}`))
            .on('close', function() {
                console.log(`Finished Copy Images ${filename}`)
            })
    })
}

// 等一下
function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

// 爬所有圖片網址
;(async () => {
    
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        slowMo: 100,
    })
    const page = await browser.newPage()
    await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36' );
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    }) // your url here

    // Get the height of the rendered page
    const bodyHandle = await page.$('body')
    const { height } = await bodyHandle.boundingBox()
    await bodyHandle.dispose()

    let lastHeight = await page.evaluate('document.querySelector("body").scrollHeight');
    

    while (true) {
        await page.evaluate('window.scrollTo(0, document.querySelector("body").scrollHeight)');
        await page.waitForTimeout(2000); // sleep a bit
        
        let newHeight = await page.evaluate('document.querySelector("body").scrollHeight');
        // let newcnt = await page.evaluate('document.querySelectorAll("#video-title").length');
        if ((newHeight === lastHeight)) {
            break;
        }
        lastHeight = newHeight;
        
    }
    // Scroll back to top
    await page.evaluate(_ => {
        window.scrollTo(0, 0)
    })
    let data=[];
    // Some extra delay to let images load
    await page.waitForTimeout(1000);
    let cont=true;
    while(cont){
    let datalst = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('li[data-test="data-sticker-li"]'));
        const result = [];
        images.forEach((img) => {
            try{
                result.push({
                    href:img.querySelector('a').href,
                    title:img.querySelector('p.mdCMN05Ttl').innerText.trim(),
                    Price:img.querySelector('span.mdCMN05PriceTxt').innerText.trim()
            })
            }catch{

            }
            
        })
        return result;
    })
    data=data.concat(datalst);
    try {
        await page.click('.mdCMN14Next');
        await page.waitForTimeout(1000);
    }catch{
        cont=false;
    }

}

 for (let list of data) {
    await page.goto(list.href, {
        waitUntil: 'domcontentloaded',
    }) // your url here
    
    await page.waitForSelector('span.mdCMN09Image.FnPreview');
    let imageLink = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('span.mdCMN09Image.FnPreview'));
        return images.map(img => (img.style.cssText.match(/htt\S*png/gm)[0]))
        
        // .filter(img => img.includes('.jpg'))
    })

    imageLink.forEach((img, index) =>
            download(img, `${list.title}_${index}.png`, function() {
                console.log('done')
            })
       
    )
    await page.goBack();
        
}
    // ytd-playlist-renderer
  console.log(`共蒐集到${data.length}則連結`);
    const fs = require('fs');
    const directory = __dirname + '/line';
    if(!fs.existsSync(directory)){
  fs.mkdirSync(directory)
}

    writerStream = fs.createWriteStream( `${directory}/${f_lead}.json`);
    writerStream.write(JSON.stringify(data, undefined, 2), 'UTF8');
    writerStream.end();

    const { Parser } = require('json2csv');
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    

    fs.writeFile(`${directory}/${f_lead}.csv`, csv, function(err) {
        if (err) {
            return console.log(err);
        }
        
        console.log(` ${f_lead}.csv file was saved!`);
 
    });

    await browser.close()
})()