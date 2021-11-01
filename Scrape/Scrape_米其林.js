const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs')
// import { launch } from 'puppeteer';
// import request, { head } from 'request';
// import { createWriteStream } from 'fs';
// const url='https://www.youtube.com/user/TheXmelro89/videos';
// const url='https://www.youtube.com/playlist?list=PLsHdB4Zk-aF1yKNc1D4usjTWBOCmlhGZF'

// const keyword = '聖經創世紀';
const store_dir='/米其林'
const f_lead='北中米其林餐廳D2' //keyword ;//'生活百科11';
const urls=['https://guide.michelin.com/tw/zh_TW/selection/taipei-taichung/restaurants']
// const urls=['https://guide.michelin.com/tw/zh_TW/taichung-region/restaurants/take-away'];
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
   const WaitCookie='body > main > div.section-cookies.js-cookie__popup > div > div > div > a'
   for(url of urls){
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
        //  const context = browser.defaultBrowserContext()
        // await context.overridePermissions(url[0], ['geolocation'])
        // await page.setGeolocation({latitude: 25.03, longitude: 121.5})
        if(url===urls[0]){
        try{
            await page.waitForTimeout(1000)    ;
            await page.waitForSelector(WaitCookie);
            await page.click(WaitCookie);
        }catch(err){
            console.log(`Err---> ${err}`);
        }
        }
    const nextPage='i.icon.fal.fa-angle-right'
    let check=true;
    const listSel='div.card__menu.js-restaurant__list_item.js-map';
    while (check){

    await page.waitForSelector('div.card__menu');
    await page.waitForTimeout(2000);
    
    const datalst = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('div.card__menu.js-restaurant__list_item.js-map'));
        const result = [];
        console.log(`Image Length ${images.length}`)
        images.forEach(async (img) => {
            console.log(`Title ${img.querySelector('h3').innerText}`);
            let type='';
            try{
                let Type=img.querySelector('div.color-primary.card__menu-content--reservations.last.pl-text').innerText;
            }catch{

            }
            result.push({
            Title:img.querySelector('h3').innerText,
            // Tags:img.querySelector('ul.item-tags').textContent.trim().replace(/\n/gm,"_").replace(/\s/g,''),
            Type:type,
            
            Area:img.querySelector('div.card__menu-footer--location.flex-fill.pl-text').innerText.trim(),
            Series:img.querySelector('div.card__menu-content--rating.d-flex.pl-text > span').innerText,
            Rank:img.querySelector('i.fa-michelin').innerText,
            href:img.querySelector('div.card__menu-image>a').href,
            lat:img.dataset['lat'],
            lng:img.dataset['lng']
            
            })

            
        })
        return result;
        })
        
        data=data.concat(datalst);

        console.log(`datalst--->${datalst.length} data--->${data.length}`);
        // let href=await page.$eval(nextPage,(elm)=>elm.href);
        // if(href==='') 
        // {
        //     check=false;
        // }else
        try{
            
            let npage=await page.evaluate(()=>document.querySelector('i.icon.fal.fa-angle-right').parentElement.href);

            // await page.click(nextPage.parentElement);
            console.log(`npage -->${npage}`);
            
            await page.goto(npage, {
            waitUntil: 'domcontentloaded',
        }) 
            await page.waitForTimeout(2000);
        }catch(err){
            console.log(`Error ===> ${err}`);
            // console.log(await page.evaluate(()=>document.querySelector(nextPage).parentElement.href));
            check=false;
            break;
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
      console.log(`${item}/${data.length}==> ${link.Title} --${link.href}`);
      await page.goto(link.href);
      await page.waitForSelector('.restaurant-details');
      
      dataR.push(
          {
              Title:link.Title,
              Addr: await page.$eval(('ul.restaurant-details__heading--list>li'),(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              Price: await page.$eval(('li.restaurant-details__heading-price'),(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              Description: await page.$eval(('div.js-show-description-text'),(el)=>el.innerText),
              services: await page.$eval('ul.row.restaurant-details__services--list.js-show-more',(el)=>"'"+el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              Rank: await page.$eval('ul.restaurant-details__classification--list',(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              
              href:link.href,
              pos:[link.lat,link.lng]

          })
          
        // await page.goBack();
        }catch(err){
            console.log(`Error ===> ${err}`);
            dataR.push(
          {
              Title:link.Title,
              Addr: '',
              Price: '',
              Description: '',
              services: '',  
              Rank:link.Rank,       
              href:link.href,
              pos:[link.lat,link.lng]

          })
        }
      item+=1;
  }
    data=dataR;
}
    const fs = require('fs');
    const directory = __dirname + store_dir;
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