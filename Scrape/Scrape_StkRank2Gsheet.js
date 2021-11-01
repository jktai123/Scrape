// ----->  Fail   Blocked 
const puppeteer = require('puppeteer');
const SaveGsheet = require("./SaveGoogleSheet");
const { SaveGoogleSheet} = SaveGsheet;

const doc_Id='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'; //

// const Type=['top-gainer','turnover','mom-revenue-growth','yoy-revenue-growth']
// const Type=['qoq-eps-growth']
// 爬所有圖片網址
const Type=[{Name:'0成交金額',href:'https://goodinfo.tw/StockInfo/StockList.asp?RPT_TIME=&MARKET_CAT=%E7%86%B1%E9%96%80%E6%8E%92%E8%A1%8C&INDUSTRY_CAT=%E6%88%90%E4%BA%A4%E9%87%91%E9%A1%8D+%28%E9%AB%98%E2%86%92%E4%BD%8E%29%40%40%E6%88%90%E4%BA%A4%E9%87%91%E9%A1%8D%40%40%E7%94%B1%E9%AB%98%E2%86%92%E4%BD%8E'},
{Name:'1成交價',href:'https://goodinfo.tw/StockInfo/StockList.asp?RPT_TIME=&MARKET_CAT=%E7%86%B1%E9%96%80%E6%8E%92%E8%A1%8C&INDUSTRY_CAT=%E6%88%90%E4%BA%A4%E5%83%B9+%28%E9%AB%98%E2%86%92%E4%BD%8E%29%40%40%E6%88%90%E4%BA%A4%E5%83%B9%40%40%E7%94%B1%E9%AB%98%E2%86%92%E4%BD%8E'},
{Name:'2年度ROE',href:'https://goodinfo.tw/StockInfo/StockList.asp?SHEET=%E5%B9%B4%E7%8D%B2%E5%88%A9%E8%83%BD%E5%8A%9B&MARKET_CAT=%E7%86%B1%E9%96%80%E6%8E%92%E8%A1%8C&INDUSTRY_CAT=%E5%B9%B4%E5%BA%A6ROE%E6%9C%80%E9%AB%98'},
{Name:'3法人買最多',
 href:'https://goodinfo.tw/StockInfo/StockList.asp?MARKET_CAT=%E7%86%B1%E9%96%80%E6%8E%92%E8%A1%8C&INDUSTRY_CAT=%E4%B8%89%E5%A4%A7%E6%B3%95%E4%BA%BA%E7%B4%AF%E8%A8%88%E8%B2%B7%E8%B6%85%E5%BC%B5%E6%95%B8+%E2%80%93+%E7%95%B6%E6%97%A5%40%40%E4%B8%89%E5%A4%A7%E6%B3%95%E4%BA%BA%E7%B4%AF%E8%A8%88%E8%B2%B7%E8%B6%85%40%40%E4%B8%89%E5%A4%A7%E6%B3%95%E4%BA%BA%E8%B2%B7%E8%B6%85%E5%BC%B5%E6%95%B8+%E2%80%93+%E7%95%B6%E6%97%A5' },

 {Name:'6股利排行',href:'https://goodinfo.tw/StockInfo/StockList.asp?SHEET=%E8%82%A1%E5%88%A9%E6%94%BF%E7%AD%96&MARKET_CAT=%E7%86%B1%E9%96%80%E6%8E%92%E8%A1%8C&INDUSTRY_CAT=%E5%90%88%E8%A8%88%E8%82%A1%E5%88%A9+%28%E6%9C%80%E6%96%B0%E5%B9%B4%E5%BA%A6%29%40%40%E5%90%88%E8%A8%88%E8%82%A1%E5%88%A9%40%40%E6%9C%80%E6%96%B0%E5%B9%B4%E5%BA%A6'

 }
]

const Scrape_Rank =(async (Ntype) => {    
    const url=Ntype.href;
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=400,1400']//, '--disable-notifications', '--no-sandbox']
    })
    
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(50000); // 50 sec

   console.log(`Scrape --- Rank Type ${Ntype.Name}`)
    try{
    await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
    await page.waitForSelector('table.r10_0_0_10.b1.p4_1>tbody>tr');
    await page.waitForTimeout(10000);
    // await page.evaluate(() => document.alert = window.alert = alert = () => {})
    const data = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('table.r10_0_0_10.b1.p4_1>tbody>tr'));
        const result = [];
        
        images.forEach(async (img,index) => {
            if(index>0 && index<30){
                if(Number(img.querySelectorAll('td')[0].textContent)>0){
                    result.push({
                        code:img.querySelectorAll('td')[1].textContent,
                        Name:img.querySelectorAll('td')[2].textContent,
                    })
                }
            }
            
        })
        return result;
        })
       
        // data=[...data,...data1];
   
       
  console.log(`共蒐集到${data.length}則連結`);
  if(data.length>0){
    // save_jsoncsv('stock',`${f_lead}`,data);
    SaveGoogleSheet(doc_Id,Ntype.Name,data);
    }
 }  catch{
    console.log(`Fail ---> ${code.Name}`)
    }
    await page.close();
    await browser.close(); 
    
    }) 

const delay = ms => new Promise(res => setTimeout(res, ms));


console.log('done')

const UpdateRank = async () => {
    // await delay(2000);
    // console.log("Waited 2s");
    for(let code of Type){
        await Scrape_Rank(code);
        // await delay(10000);

        // console.log(`Waited 10s  ${code}`);
    }
    // await delay(3000);
    // console.log("Waited 3s");
}
UpdateRank();
  
// Scrape_Rank(Type[6]);

// Scrape_ETF('00632R');
// Scrape_ETF('00663L');