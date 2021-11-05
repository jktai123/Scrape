// ----->  Fail   Blocked 
const puppeteer = require('puppeteer');
const SaveGsheet = require("./SaveGoogleSheet");
const { ReadGoogleSheet, SaveGoogleSheet } = SaveGsheet;
//const { SaveGoogleSheet,ReadGoogleSheet} = SaveGsheet;

const doc_Id='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'; //jktai123/投資/Check_碼
//https://docs.google.com/spreadsheets/d/1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk/edit?usp=sharing  jktai123/投資/ScrapStock_link
const Type_doc_Id='1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk'
// const Type=['top-gainer','turnover','mom-revenue-growth','yoy-revenue-growth']
// const Type=['qoq-eps-growth']
// 爬所有圖片網址


//let hists= JSON.parse(fs.readFileSync('C:/Users/TAI/Documents/node_study/puppeteer-main/Scrape/軒琪/看診紀錄.json',{encoding:'UTF-8'}));
const CatType=[{Cat:'熱門排行',Table:'MENU8'}
	,{Cat:'智慧選股',Table:'MENU9'}]





const delay = ms => new Promise(res => setTimeout(res, ms));




const GetCat = async (Cat) => {
	//console.log(Cat);
	const url='https://goodinfo.tw/StockInfo/StockList.asp?MARKET_CAT=%E7%86%B1%E9%96%80%E6%8E%92%E8%A1%8C&INDUSTRY_CAT=%E6%88%90%E4%BA%A4%E5%83%B9+%28%E9%AB%98%E2%86%92%E4%BD%8E%29%40%40%E6%88%90%E4%BA%A4%E5%83%B9%40%40%E7%94%B1%E9%AB%98%E2%86%92%E4%BD%8E';
	const url_h='https://goodinfo.tw/StockInfo/StockList.asp?MARKET_CAT=';
	const tbl_h='table.b1.p4_2.r10#'
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=400,1400','--disable-notifications', '--no-sandbox']
    })
    
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(50000); // 50 sec
	
	try{
		await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
		await page.waitForSelector('table.b1.p4_2.r10#MENU8');
		await page.waitForTimeout(10000);
		let final=[];
		for ( i=1 ; i <= 7 ; i++ ){
			const table_id=`table.b1.p4_2.r10#MENU${i}`;
			console.log(i,table_id);
    
			const data = await page.evaluate((table_id) => {
				
				//const images = Array.from(document.querySelector(`table.b1.p4_2.r10#${cat.Table}`).querySelectorAll('td[Style^="/*S"]'));
				//const images = Array.from(document.querySelector(`table.b1.p4_2.r10#MENU8`).querySelectorAll('td[Style^="/*S"]'));
				const images = Array.from(document.querySelector(table_id).querySelectorAll('tr[height="25px"]'));
				const result = [];
				images.forEach(async (img) => {
					links=img.querySelectorAll('a')
					links.forEach(async (link) => {
					
						result.push({
						name:`${decodeURI(link.href).match('(?<==).*?(?=&)')[0]}_${link.text}`,
						href:decodeURI(`${link.href}`)
					})
					console.log(link.text);
					
				})
				})
			
			return result;
			},table_id)
			console.log(`Data Len ---> ${data.length} `);
			
			console.log(data[0]);
			//console.log(decodeURI(data[0].Cat));
			//console.log(decodeURI(data[0].href));
			
			final = [...final, ...data] //arr3 ==> [1,2,3,4,5,6]
			
		}
		for (let cat of Cat){
			console.log(cat);
    // await page.evaluate(() => document.alert = window.alert = alert = () => {})
			const table_id=`table.b1.p4_2.r10#${cat.Table}`;
			const link_h=`${url_h}${cat.Cat}&INDUSTRY_CAT=`;
			console.log(table_id,link_h);
			const data = await page.evaluate((table_id,link_h) => {
				//const images = Array.from(document.querySelector(`table.b1.p4_2.r10#${cat.Table}`).querySelectorAll('td[Style^="/*S"]'));
				//const images = Array.from(document.querySelector(`table.b1.p4_2.r10#MENU8`).querySelectorAll('td[Style^="/*S"]'));
				const images = Array.from(document.querySelector(table_id).querySelectorAll('td[Style^="/*S"]'));
				const result = [];
				images.forEach(async (img,index) => {
					options=img.querySelectorAll('select>option[value]')
					options.forEach(async (opt) => {
					if(opt.value!=''){
						result.push({
						name:decodeURI(opt.value).replace(/%40%40/g,"_"),
						href:decodeURI(`${link_h}${opt.value}`)
					})
					console.log(opt.value);
					}
				})
				})
			
			return result;
			},table_id,link_h)
			console.log(`Data Len ---> ${data.length} `);
			
			console.log(data[0]);
			//console.log(decodeURI(data[0].Cat));
			//console.log(decodeURI(data[0].href));
			
			final = [...final, ...data] //arr3 ==> [1,2,3,4,5,6]
			
		}
		
		console.log(`Final Len ---> ${final.length}`);
		
		SaveGoogleSheet(Type_doc_Id,'Scrape',final);
	}
	catch(err){
    console.log(`Fail ---> ${err}`)
    }
    await page.close();
    await browser.close(); 
}


GetCat(CatType);
  
// Scrape_Rank(Type[6]);

// Scrape_ETF('00632R');
// Scrape_ETF('00663L');
