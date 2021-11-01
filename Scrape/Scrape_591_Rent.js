const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs')
// import { launch } from 'puppeteer';
// import request, { head } from 'request';
// import { createWriteStream } from 'fs';
// const url='https://www.youtube.com/user/TheXmelro89/videos';
// const url='https://www.youtube.com/playlist?list=PLsHdB4Zk-aF1yKNc1D4usjTWBOCmlhGZF'

// const keyword = '聖經創世紀';
const f_lead='北市套房租屋萬五' //keyword ;//'生活百科11';
// const urls=['https://rent.591.com.tw/?kind=2&region=1&section=5&rentprice=8000,9000']
const urls=['https://rent.591.com.tw/?kind=2&region=1&section=5,4&rentprice=8000,15000','https://rent.591.com.tw/?kind=3&region=1&section=5,4&rentprice=8000,15000','https://rent.591.com.tw/?kind=4&region=1&section=5,4&rentprice=8000,15000'];
// `https://rent.591.com.tw/?kind=3&multiPrice=5000_10000&searchtype=1&region=1&section=7&rentprice=2`;
const maxcnt = 356;
const detail=true ;//false;
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

// // 等一下
// function wait(ms) {
//     return new Promise(resolve => setTimeout(() => resolve(), ms))
// }

// 爬所有圖片網址
;(async () => {
    
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=1140,1400', '--disable-notifications', '--no-sandbox']
    })
    // https://ck101.com/thread-5346388-1-1.html?utm_source=dable
    // https://ck101.com/thread-5144405-1-1.html
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(50000); // 50 sec
    await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
 );
     data=[];
   for(url of urls){
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
        if(url===urls[0]){
        try{
            await page.waitForTimeout(4000)    ;
            await page.waitForSelector('a#area-box-close');
            await page.click('a#area-box-close');
        }catch(err){
            console.log(`Err---> ${err}`);
        }
    }
    
    let check=true;
    while (check){
    await page.waitForSelector('a.pageNext');

    const datalst = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('ul.listInfo.clearfix.j-house'));
        const result = [];
        images.forEach(async (img) => {
            try{
            let enhance='Normal'    ;
            if(img.querySelector('span.labelThree')!=null){
                enhance=img.querySelector('span.labelThree').innerText;
            }else{
                if(img.querySelector('span.labelOne')!=null){
                    enhance=img.querySelector('span.labelOne').innerText;
                }
            }
            result.push({
            Title:img.querySelector('h3 a').innerText,
            // Tags:img.querySelector('ul.item-tags').textContent.trim().replace(/\n/gm,"_").replace(/\s/g,''),
            Type:img.querySelectorAll('li.pull-left.infoContent p')[0].innerText,
            Price:img.querySelector('div.price').innerText.trim(),
            // Size:img.querySelectorAll('ul.item-style>li')[1].textContent.trim(),
            // Floor:img.querySelectorAll('ul.item-style>li')[2].textContent.trim(),
            Area:img.querySelectorAll('li.pull-left.infoContent p')[1].innerText.trim(),
            Msg:img.querySelectorAll('li.pull-left.infoContent p')[2].innerText.trim().replace(/\n/gm,"_").replace(/\s/g,''),
            Review:img.querySelectorAll('li.pull-left.infoContent p')[2].innerText.match(/\d+人/gm)[0],
            href:img.querySelector('h3 a').href,
            // img:img.querySelector('li.pull-left.imageBox > img').src,
            Enhance:enhance
            })

            }catch{}
        })
        return result;
        })
        
        data=data.concat(datalst);

        console.log(`datalst--->${datalst.length} data--->${data.length}`);
        let href=await page.$eval('a.pageNext',(elm)=>elm.href);
        if(href==='') 
        {
            check=false;
        }else
        try{
            
            await page.click('a.pageNext');
            // await page.waitForSelector('a.pageNext');
            await page.waitForTimeout(2000);
        }catch{
            break;
            check=false;
        }
    }
    console.log(page.url());
    }
       
    // ytd-playlist-renderer
  console.log(`共蒐集到${data.length}則連結`);
  if(detail){
  let dataR=[];
  let item=1;
  for (var link of data){
      
      try{
      console.log(`${item}/${data.length}==> ${link.Title}`);
      await page.goto(link.href);
      await page.waitForSelector('#houseInfo');
      
      dataR.push(
          {
              Title:link.Title,
              Type: await page.$eval(('div.bread-crumb > ul > li:nth-child(4)'),(el)=>el.innerText),
              Area: await page.$eval(('div.bread-crumb > ul > li:nth-child(3)'),(el)=>el.innerText),
              Price: await page.$eval('span.price',(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              Addr: await page.$eval(('span.load-map'),(el)=>el.innerText),
              PC:await page.evaluate(element => {return element.textContent.replace(/\n/gm,"").replace(/\s/g,'');}, (await page.$x('//*[@id="app"]/div[1]/section/div[3]/text()[3]'))[0]),
              Mobile:await page.evaluate(element => {return element.textContent;}, (await page.$x('//*[@id="app"]/div[1]/section/div[3]/text()[2]'))[0]),
              Enhance:link.Enhance,
              Time: await page.$eval('div.release-time',(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'').match(/\d+月\d+日|\d+天/gm)[0]),
              Label: await page.$eval('div.house-label',(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              Pattern: await page.$eval('div.house-pattern',(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              info: await page.$eval('div.info',(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              Tel: await page.evaluate(()=>document.querySelectorAll('span.tel-txt')[2].innerText.trim()),
              href:link.href,
            //   img:link.img

          })
          
        // await page.goBack();
        }catch(err){
            console.log(`Error ===> ${err}`);
            dataR.push(
          {
              Title:link.Title,
              Type: link.type,
              Area: link.Area,
              Price: link.Price,
              Addr:link.Area,
              PC: link.Msg,
              Mobile: link.Msg,
              Enhance:link.Enhance,
              Time: link.Msg,
              Label: '',
              Pattern: link.Type,
              info: link.Msg,
              Tel: '',
              href:link.href,
            //   img:link.img

          })
        }
      item+=1;
  }
    data=dataR;
}
    const fs = require('fs');
    const directory = __dirname + '/591';
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
    
    await page.close();
    await browser.close(); 
    
})()