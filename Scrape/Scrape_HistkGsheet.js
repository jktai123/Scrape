// ----->  Fail   Blocked 
const puppeteer = require('puppeteer');
const SaveGsheet = require("./SaveGoogleSheet");
const { ReadGoogleSheet, SaveGoogleSheet } = SaveGsheet;
//const { SaveGoogleSheet,ReadGoogleSheet} = SaveGsheet;

const doc_Id='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'; //jktai123/投資/Check_碼
//https://docs.google.com/spreadsheets/d/1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk/edit?usp=sharing  jktai123/投資/ScrapStock_link
const Type_doc_Id='1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk'




const delay = ms => new Promise(res => setTimeout(res, ms));




const GetHistk = async () => {
	//console.log(Cat);
	const url='https://histock.tw/%E5%8F%B0%E8%82%A1%E5%A4%A7%E7%9B%A4';
	
	
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
		await page.waitForSelector('table.tb-stock.tbApp');
		await page.waitForTimeout(10000);
	const final=	await page.evaluate(() => {
			const images = Array.from(document.querySelector('table.tb-stock.tbApp').querySelectorAll('tr'));
			
			const data=[];
			images.forEach(async (img) => {
				const result = [];
				sname=img.querySelector('th').innerText;
				links=img.querySelectorAll('a')
				links.forEach(async (link) => {
					result.push({
					code:`'${link.title.match(/\(([^)]+)\)/)[1]}`,
					href:link.href
					})
				
				})
				data.push({
					sname:sname,
					hrefs:result
				})
			})
		return data;
		})	
	//console.log(final[0].sname);
	//console.log(final[0].hrefs);
	for (let item of final){
		console.log(item.sname);
		console.log(item.hrefs);
		if(item.hrefs.length>0){
		await SaveGoogleSheet(doc_Id,item.sname,item.hrefs);}
		}
	}
	catch(err){
    console.log(`Fail ---> ${err}`)
    }
    await page.close();
    await browser.close(); 
}


GetHistk();
  
// Scrape_Rank(Type[6]);

// Scrape_ETF('00632R');
// Scrape_ETF('00663L');
