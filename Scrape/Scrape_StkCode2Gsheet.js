
const puppeteer = require('puppeteer');
const SaveGsheet = require("./SaveGoogleSheet");
const { ReadGoogleSheet, SaveGoogleSheet } = SaveGsheet;
//const { SaveGoogleSheet,ReadGoogleSheet} = SaveGsheet;

const doc_Id0='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'; //jktai123/投資/Check_碼
const doc_Id='1BV4jXdlMNWoGVkRZSkjhA2sF2MPlOUjNJg-EkdJGYSU'  ; //股名代號
//https://docs.google.com/spreadsheets/d/1BV4jXdlMNWoGVkRZSkjhA2sF2MPlOUjNJg-EkdJGYSU/edit?usp=sharing


const Type_doc_Id='1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk'

//https://docs.google.com/spreadsheets/d/1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk/edit?usp=sharing  jktai123/投資/ScrapStock_link

// const Type=['top-gainer','turnover','mom-revenue-growth','yoy-revenue-growth']
// const Type=['qoq-eps-growth']
// 爬所有圖片網址


//let hists= JSON.parse(fs.readFileSync('C:/Users/TAI/Documents/node_study/puppeteer-main/Scrape/軒琪/看診紀錄.json',{encoding:'UTF-8'}));


const Types=[
    {Name:'上市',href:'https://isin.twse.com.tw/isin/C_public.jsp?strMode=2'}
   ,{Name:'上櫃',href:'https://isin.twse.com.tw/isin/C_public.jsp?strMode=4'}
]

const Scrape_Code =(async (link) => { 
console.log(link);
   {
    const url=link.href;
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=400,1400', '--disable-notifications', '--no-sandbox']
    })
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(50000); // 50 sec

    console.log(`Scrape --- Code Type ${link.Name}`)
    try{
		await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
		await page.waitForSelector('table.h4>tbody>tr');
		await page.waitForTimeout(10000);
		// await page.evaluate(() => document.alert = window.alert = alert = () => {})
		const data = await page.evaluate(() => {
			const images = Array.from(document.querySelectorAll('table.h4>tbody>tr'));
			const result = [];
			
			images.forEach(async (img,i) => {
				const lists=img.querySelectorAll('td');
				if(lists.length==7){
					if(i!==0){
						result.push({
							code:lists[0].textContent.split("　")[0],
							名字:lists[0].textContent,
							上市日:lists[2].textContent,
							市場別:lists[3].textContent,
							產業別:lists[4].textContent,
							CFICode:lists[5].textContent,
							ISIN:lists[1].textContent,
							備註:lists[6].textContent
							
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
			SaveGoogleSheet(doc_Id,link.Name,data);
			}
	}catch{
    console.log(`Fail ---> ${code.Name}`)
    }
    await page.close();
    await browser.close(); 
    }
}) 

const delay = ms => new Promise(res => setTimeout(res, ms));




for (let link of Types){
	Scrape_Code(link);  
}
// Scrape_Rank(Type[6]);

// Scrape_ETF('00632R');
// Scrape_ETF('00663L');
