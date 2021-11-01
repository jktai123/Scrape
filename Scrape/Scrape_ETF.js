const puppeteer = require('puppeteer');
// var request = require('request');
// const fs = require('fs');
const save_jsoncsv = require("./save_jsoncsv");
// import { launch } from 'puppeteer';
// import request, { head } from 'request';
// import { createWriteStream } from 'fs';

// const keyword = '聖經創世紀';
// const f_lead='00881' 



// 爬所有圖片網址

const Scrape_ETF =(async (f_lead) => {    
    const urls=[`https://www.cmoney.tw/etf/e210.aspx?key=${f_lead}`];
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=400,1400', '--disable-notifications', '--no-sandbox']
    })
    // https://ck101.com/thread-5346388-1-1.html?utm_source=dable
    // https://ck101.com/thread-5144405-1-1.html
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(50000); // 50 sec
    await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
 );
   let data=[];
   for(url of urls){
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
    await page.waitForSelector('table.tb.tb1');
    await page.waitForTimeout(2000);
    
    const data1 = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('table.tb.tb1>tbody>tr'));
        const result = [];
        
        images.forEach(async (img) => {
            txt1=img.querySelector('td').innerText;
            if(txt1){
        //    img.querySelectorAll('td')[0].innerText;
           result.push({code:txt1,
                Name:img.querySelectorAll('td')[1].innerText,
                Weight:img.querySelectorAll('td')[3].innerText,
                Type:img.querySelectorAll('td')[2].innerText});
           }
        }
        )
        return result;
        })
       
        data=[...data,...data1];
    }
       
  console.log(`共蒐集到${data.length}則連結`);
  if(data.length>0){
    save_jsoncsv('stock',`${f_lead}`,data);
    }


    await page.close();
    await browser.close(); 
    
})

Scrape_ETF('00631L');
// Scrape_ETF('00632R');
// Scrape_ETF('00663L');