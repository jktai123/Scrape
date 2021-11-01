const puppeteer = require('puppeteer')
var request = require('request')
const fs = require('fs')
// import { launch } from 'puppeteer';
// import request, { head } from 'request';
// import { createWriteStream } from 'fs';
// const url='https://www.youtube.com/user/TheXmelro89/videos';
// const url='https://www.youtube.com/playlist?list=PLsHdB4Zk-aF1yKNc1D4usjTWBOCmlhGZF'

// const keyword = '聖經創世紀';
const store_dir='/教會'
const f_lead='台灣教會-D' //keyword ;//'生活百科11';
// const urls=['https://church.oursweb.net/slocation.php?w=1&c=TW&a=%E6%96%B0%E7%AB%B9%E7%B8%A3']
const urls=['https://church.oursweb.net/slocation.php?w=1&c=TW']
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
//    const WaitCookie='body > main > div.section-cookies.js-cookie__popup > div > div > div > a'
   for(url of urls){
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
       
    const nextPage='table[class="tb_pages"]'
    let check=true;
    const listSela='tr[class="tb_line_a"]';
    const listSelb='tr[class="tb_line_b"]';

    while (check){
        
    await page.waitForSelector('table[class="tb_pages"]');
    const pages=await page.evaluate(() => {
        return {
        cpage:document.querySelector('table[class="tb_pages"]').querySelector('tr>td').innerText.match(/\d+/gm)[1],
        tpage:document.querySelector('table[class="tb_pages"]').querySelector('tr>td').innerText.match(/\d+/gm)[2],
        href:document.querySelector('table[class="tb_pages"]').querySelectorAll('tr>td>a')[1].href
        };
    })
    await page.waitForTimeout(1000);
    
    const datalst = await page.evaluate(() => {
        const result = [];
        const imagesa = Array.from(document.querySelectorAll('tr[class="tb_line_a"]'));
        const imagesb = Array.from(document.querySelectorAll('tr[class="tb_line_b"]'));
        console.log(`Image Length ${imagesa.length}+${imagesb.length}`)
        imagesa.forEach(async (img) => {
            console.log(`Title ${img.querySelector('td>a').innerText}`);
            result.push({
            Title:img.querySelector('td>a').innerText,
            Type:img.querySelectorAll('td')[2].innerText.trim(),
            Area:img.querySelectorAll('td')[1].innerText.trim(),
            Tel:img.querySelectorAll('td')[3].innerText.trim(),
            PIC:img.querySelectorAll('td')[4].innerText.trim(),
            href:img.querySelector('td>a').href,
            })            
            });
        imagesb.forEach(async (img) => {
            console.log(`Title ${img.querySelector('td>a').innerText}`);
            result.push({
            Title:img.querySelector('td>a').innerText,
            Type:img.querySelectorAll('td')[2].innerText.trim(),
            Area:img.querySelectorAll('td')[1].innerText.trim(),
            Tel:img.querySelectorAll('td')[3].innerText.trim(),
            PIC:img.querySelectorAll('td')[4].innerText.trim(),
            href:img.querySelector('td>a').href,
            })            
            })
        return result;
        })
        
        data=data.concat(datalst);

        console.log(`Page ${pages.cpage}/${pages.tpage}  datalst--->${datalst.length} data--->${data.length}`);
        // let href=await page.$eval(nextPage,(elm)=>elm.href);
        // if(href==='') 
        // {
        //     check=false;
        // }else
        
            
            if(pages.cpage!==pages.tpage){
            try{
                await page.goto(pages.href, {
                waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(2000);
                }
            catch(err){
                    console.log(`Error ===> ${err}`);
                    // console.log(await page.evaluate(()=>document.querySelector(nextPage).parentElement.href));
                    try{
                    await page.goto(pages.href, {waitUntil: 'domcontentloaded' });
                    }
                    catch(err){
                        console.log(`Repeat Error ===> ${err}`);
                        break;
                    }
                    }
            }
            else {
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
      console.log(`${item}/${data.length}==> ${link.Title} `);
      await page.goto(link.href);
      await page.waitForSelector('td.church_detail');
      
      dataR.push(
          {
              Title:link.Title,
              Type:link.Type,
              Area:link.Area,
              Source: await page.$eval(('td.church_detail>a'),(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              PIC:link.PIC,
              Tel:link.Tel,
              href:link.href,
              Addr: await page.$eval(('td.church_detail>a.map_guide'),(el)=>el.innerText.trim().replace(/\n/gm,"_").replace(/\s/g,'')),
              Pos: {lat:await page.$eval(('td.church_detail>a.map_guide'),(el)=>el.dataset.lat),
                    lng: await page.$eval(('td.church_detail>a.map_guide'),(el)=>el.dataset.lng )}
          })
          
        // await page.goBack();
        }catch(err){
            console.log(`Error ===> ${err}`);
            dataR.push(
          {
              
              Title:link.Title,
              Type:link.Type,
              Area:link.Area,
              Source: '',
              PIC:link.PIC,
              Tel:link.Tel,
              href:link.href,
              Addr: '',
              Pos:{}
              
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