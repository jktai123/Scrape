const puppeteer = require('puppeteer');
// const save_jsoncsv = require("./save_jsoncsv");
const SaveGsheet = require("./SaveGoogleSheet");

const { ReadGoogleSheet, SaveGoogleSheet } = SaveGsheet;
//const { SaveGoogleSheet} = SaveGsheet;

// const doc_Id='18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I';
// const sname='0056'; //'軒琪';//'0050';
const doc_Id='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'; //
const ETF=['0050','0056','00881','00878']
// 爬所有圖片網址
const Type_doc_Id='1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk'
//https://docs.google.com/spreadsheets/d/1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk/edit?usp=sharing
const Scrape_ETF =(async (f_lead,sname) => { 
	//console.log(f_lead);
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
   console.log(`Scrape --- ${sname}`)
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
    // save_jsoncsv('stock',`${f_lead}`,data);
    //SaveGoogleSheet(doc_Id,f_lead,data);
	console.log('Saving --->'+sname);
	SaveGoogleSheet(doc_Id,sname,data);
    }
	

    await page.close();
    await browser.close(); 
    
})

const UpdateETF = async () => {
	const Type=await ReadGoogleSheet(Type_doc_Id,'ETF');
	console.log(Type.length);
    // await delay(2000);
    // console.log("Waited 2s");
    for(let item of Type){
		//console.log(item.ETFcode, typeof item.ETFcode);
		
		if(item.ETFcode === undefined ) {break;}
        await Scrape_ETF(item.ETFcode,item.ETFcode+'_'+item.Name);
    }
}
UpdateETF();

//ETF.forEach(code=>{
    
//    Scrape_ETF(code);
//})

// Scrape_ETF('00632R');
// Scrape_ETF('00663L');