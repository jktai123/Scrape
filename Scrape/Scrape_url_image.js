const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs')

// const cont_key='akabebe';   need to set line 64
const Maxcnt=10;
const f_lead='nude';
const url=`https://www.pinterest.com/search/pins/?q=${f_lead}&rs=filter`;
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
    const viewportHeight = page.viewport().height
    let viewportIncr = 0
    while (viewportIncr + viewportHeight < height) {
        await page.evaluate(_viewportHeight => {
            window.scrollBy(0, _viewportHeight)
        }, viewportHeight)
        await wait(2000)
        viewportIncr = viewportIncr + viewportHeight
    }
    //
    let lastHeight = await page.evaluate('document.body.scrollHeight');
    let cnt=0;
    while (cnt<Maxcnt) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2500); // sleep a bit
        let newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === lastHeight) {
            break;
        }
        lastHeight = newHeight;
        cnt=cnt+1;
    }
    // Scroll back to top
    await page.evaluate(_ => {
        window.scrollTo(0, 0)
    })

    // Some extra delay to let images load
    await page.waitForTimeout(1000)
    
    let imageLink = await page.evaluate(() => {
        const cont_key='pinimg';    
        
        const images = Array.from(document.querySelectorAll('img'))
        return images.map(img => img.src).filter(img => img.includes(cont_key))
        // .filter(img => img.includes('.jpg'))
    })

    imageLink.forEach((img, index) =>
            download(img, `${f_lead}_${index}.jpg`, function() {
                console.log('done')
            })
       
    )

    await browser.close()
})()