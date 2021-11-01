const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs')
const chineseConv = require('chinese-conv');
// import { launch } from 'puppeteer';
// import request, { head } from 'request';
// import { createWriteStream } from 'fs';
const url='https://www.youtube.com/channel/UCSzmll-qQzuyzikFCwGwFSg/videos';//https://www.youtube.com/user/TheXmelro89/videos';

const maxcnt = 1000;
// 下載圖片
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri)
            .pipe(fs.createWriteStream(__dirname + `/download/${filename}`))
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
        
   args: ['--window-size=240,400', '--disable-notifications', '--no-sandbox']
    })
    // https://ck101.com/thread-5346388-1-1.html?utm_source=dable
    // https://ck101.com/thread-5144405-1-1.html
    const page = await browser.newPage()
    await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
 );
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    }) // your url here

    // Get the height of the rendered page
    const bodyHandle = await page.$('body')
    const { height } = await bodyHandle.boundingBox()
    await bodyHandle.dispose()

    // Scroll one viewport at a time, pausing to let content load
    // const viewportHeight = page.viewport().height
    // let viewportIncr = 0
    // while (viewportIncr + viewportHeight < height) {
    //     await page.evaluate(_viewportHeight => {
    //         window.scrollBy(0, _viewportHeight)
    //     }, viewportHeight)
    //     await wait(2000)
    //     viewportIncr = viewportIncr + viewportHeight
    // }
    //
    let lastHeight = await page.evaluate('document.querySelector("#content").scrollHeight');
    
    let lcnt=0;
    while (lcnt<maxcnt) {
        await page.evaluate('window.scrollTo(0, document.querySelector("#content").scrollHeight)');
        await page.waitForTimeout(2000); // sleep a bit
        // await page.keyboard.down('Control');
        // await page.keyboard.press('ArrowDown');
        // await page.keyboard.up('Shift');
        // await page.mouse.wheel({ deltaY: 9500 });
        //  await page.waitForTimeout(2000); // sleep a bit
        let newHeight = await page.evaluate('document.querySelector("#content").scrollHeight');
        let newcnt = await page.evaluate('document.querySelectorAll("#video-title").length');
        if ((newHeight === lastHeight)|newcnt>=maxcnt) {
            break;
        }
        lastHeight = newHeight;
        lcnt+=1;
    }
    // Scroll back to top
    await page.evaluate(_ => {
        window.scrollTo(0, 0)
    })

    // Some extra delay to let images load
    await page.waitForTimeout(1000);
    
    const f_lead=await  chineseConv.tify(await page.$eval('yt-formatted-string#text.style-scope.ytd-channel-name',(el)=>el.textContent.trim()));
    
    
    let data = await page.evaluate(() => {
            
        
        // const images = Array.from(document.querySelectorAll('#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer'))
        // return images.map(img => ({Title:img.title,URL:img.href}))
        // const images = Array.from(document.querySelectorAll('ytd-video-renderer'));
        const images = Array.from(document.querySelectorAll('ytd-grid-video-renderer'));
        // const images = Array.from(document.querySelectorAll('ytd-playlist-video-renderer'));
        
        return images.map(img => ({
            Title:img.querySelector('#video-title').title,
            URL:img.querySelector('#video-title').href,
            Author:img.querySelector('div#text-container.style-scope.ytd-channel-name').innerText.trim()}))
        
        
        // .filter(img => img.includes('https:'))
    })
  console.log(`共蒐集到${data.length}則連結`);
    const fs = require('fs');
    const directory = __dirname + '/yt';
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