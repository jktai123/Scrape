const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs')
// import { launch } from 'puppeteer';
// import request, { head } from 'request';
// import { createWriteStream } from 'fs';
// const url='https://www.youtube.com/user/TheXmelro89/videos';
// const url='https://www.youtube.com/playlist?list=PLsHdB4Zk-aF1yKNc1D4usjTWBOCmlhGZF'

const keyword = '聖經創世紀';
const f_lead=keyword ;//'生活百科11';
const url=`https://www.youtube.com/results?search_query=${keyword}`;
const maxcnt = 356;
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
    //     executablePath:
    // 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
        slowMo: 100,
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

    let lastHeight = await page.evaluate('document.querySelector("#content").scrollHeight');
    

    while (true) {
        await page.evaluate('window.scrollTo(0, document.querySelector("#content").scrollHeight)');
        await page.waitForTimeout(2000); // sleep a bit
        
        let newHeight = await page.evaluate('document.querySelector("#content").scrollHeight');
        let newcnt = await page.evaluate('document.querySelectorAll("#video-title").length');
        if ((newHeight === lastHeight)|newcnt>=maxcnt) {
            break;
        }
        lastHeight = newHeight;
        
    }
    // Scroll back to top
    await page.evaluate(_ => {
        window.scrollTo(0, 0)
    })

    // Some extra delay to let images load
    await page.waitForTimeout(1000);
    

    let data = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('ytd-video-renderer'));
        const result = [];
        images.forEach((img) => {
            let times='';
            try{
                times=img.querySelector('span.style-scope.ytd-video-meta-block').innerText.slice(5,30);
            }catch{

            }
            result.push({
            Title:img.querySelector('#video-title').title,
            URL:img.querySelector('#video-title').href,
            Time:times,
            Author:img.querySelector('div#text-container.style-scope.ytd-channel-name').innerText.trim(),
            Type: 'item'
            }
            
            )
        })
        return result;
    })
        let datalst = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('ytd-playlist-renderer'));
        
        const result = [];
        images.forEach((img) => {
            let times='';
            try{
                times=img.querySelector('span.style-scope.ytd-video-meta-block').innerText.slice(5,30);
            }catch{

            }
            result.push({
            Title:img.querySelector('#video-title').title,
            URL:img.querySelector('a.yt-simple-endpoint.style-scope.ytd-playlist-renderer').href,
            Time:times,
            Author:img.querySelector('div#text-container.style-scope.ytd-channel-name').innerText.trim(),
            Type: 'plist'
            }
            
            )
        })
        return result;
        
        // .filter(img => img.includes('https:'))
    })
    data=data.concat(datalst);
    // ytd-playlist-renderer
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