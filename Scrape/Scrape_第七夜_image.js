const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs')
const chineseConv = require('chinese-conv');
// let url='http://www.daiqiyang.com/gaoqing/20200501131124.html';
// let url='http://www.daiqiyang.com/chemo/20170412161448.html' //'http://www.daiqiyang.com/qingchun/20201116065335.html'
// let url='http://www.daiqiyang.com/gaoqing/20201116051354.html';
// let index=1;
// const cont_key='akabebe';   need to set line 64
// const f_lead='Sakimichan裸女圖';
// 下載圖片
const download = function(uri, filename, callback) {
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
   args: ['--window-size=240,400', '--disable-notifications', '--no-sandbox']
        // slowMo: 100,
    })
    // https://ck101.com/thread-5346388-1-1.html?utm_source=dable
    // https://ck101.com/thread-5144405-1-1.html
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(50000); // 50 sec
    const urla=['http://www.daiqiyang.com/chemo/20171115224432.html',
    'http://www.daiqiyang.com/gaoqing/20170215230228.html',
'http://www.daiqiyang.com/daxiong/246.html'];
    
    for(let url of urla){
 
    await page.goto(url) ;// your url here
    let end = true;
    let index=1;
    await page.waitForSelector('.showimg');
    let f_lead = await  chineseConv.tify(await page.$eval('meta[name="description"]', (el) => el.content));
    // f_lead=f_lead.replace(/\s|\，/g,'_');
    while(end){
        await page.waitForSelector('.showimg');
        // const show=await page.$x('//div/a/img');
        const uri = await page.$eval('.showimg>a>img', (element) => element.src);
        const nurl = await page.$eval('a[class="next"]', (el) => el.href);
        
        download(uri, `${f_lead}_${index}.jpg`, function() {
            console.log('done')
        })
        index=index+1;
        if(url.match(/\d{14}/)[0]!==nurl.match(/\d{14}/)[0]){
            // await page.click('a[class="next"]');
            end=false;

        }else{

            url=nurl;
            
            await page.goto(url) // your url here
        }

        

    }
    
    
}
    
    await browser.close()
})()