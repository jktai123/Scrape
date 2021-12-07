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
const Scrape_Cat =(async () => { 
	//console.log(f_lead);
    const url='https://www.wantgoo.com/stock/ranking/top-gainer';
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=400,1400', '--disable-notifications', '--no-sandbox']
    })
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(50000); // 50 sec
    await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
 );
   
   await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
   await page.waitForSelector('div.col-12');
   await page.waitForTimeout(2000);
    
   const data = await page.evaluate(() => {
        const images = Array.from(document.querySelector('div.col-12').querySelectorAll('a.nav-link'));
        const result = [];
        
        images.forEach(async (img) => {
           result.push({
                Name:img.innerText,
                href:img.href
                });
           })
        return result;
        })
	
    await page.close();
    await browser.close(); 
	console.log(`共蒐集到${data.length}則連結`);
	return data;
})
const Scrape_Cat_detail1 =(async (item) => { 
	console.log(item);
    const url=item.href;
	const sname=item.Name;
	console.log(url,sname);
})
const Scrape_Cat_detail =(async (item) => { 
	console.log(item);
    const url=item.href;
	const sname=item.Name;
	console.log(url,sname);
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=400,1400', '--disable-notifications', '--no-sandbox']
    })
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(50000); // 50 sec
    await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
 );
   
    console.log(`Scrape ---  ${sname}`)
   
    await page.goto(url, {
			waitUntil: 'domcontentloaded',
		}) // your url here
	try{
		await page.waitForSelector('tbody.rt');
		await page.waitForTimeout(2000);
		
		const data = await page.evaluate(() => {
			const images = Array.from(document.querySelectorAll('tbody.rt>tr'));
			const result = [];
			for (let i = 0; i < 32; i++)
			 {
			   
			//    img.querySelectorAll('td')[0].innerText;
			   result.push({
					code:images[i].querySelectorAll('td')[1].innerText,
					Name:images[i].querySelectorAll('td')[2].innerText,
					Rank:images[i].querySelectorAll('td')[0].innerText});
				 }
			return result;
		})
	
		console.log(`共蒐集到${data.length}則連結`);
		if(data.length>0){
		// save_jsoncsv('stock',`${f_lead}`,data);
			SaveGoogleSheet(doc_Id,sname,data);
		}
	}catch(err){console.log(err);}
    await page.close();
    await browser.close(); 
})
const UpdateWantgoo = async () => {
	const Type=await Scrape_Cat();
	console.log(Type.length);
	//console.log(Type);
    // await delay(2000);
    // console.log("Waited 2s");
	//const a=[{href:"https://www.wantgoo.com/stock/ranking/pbr",Name:'股淨比'}]
	   //await Scrape_Cat_detail(a);
	let cnt=0;
    for(let item of Type){
		//console.log(item.ETFcode, typeof item.ETFcode);
		console.log(item.Name,item.href);
		cnt++;
		await Scrape_Cat_detail(item);
		if(cnt>=11) {break;}
    }
}
UpdateWantgoo();

//ETF.forEach(code=>{
    
//    Scrape_ETF(code);
//})

// Scrape_ETF('00632R');
// Scrape_ETF('00663L');