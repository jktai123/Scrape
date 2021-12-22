// ----->  Fail   Blocked 
const puppeteer = require('puppeteer');
const SaveGsheet = require("./SaveGoogleSheet");
const { ReadGoogleSheet, SaveGoogleSheet } = SaveGsheet;
//const { SaveGoogleSheet,ReadGoogleSheet} = SaveGsheet;

const doc_Id='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'; //jktai123/投資/Check_碼
//https://docs.google.com/spreadsheets/d/1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk/edit?usp=sharing  jktai123/投資/ScrapStock_link
const Type_doc_Id='1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk'
// https://docs.google.com/spreadsheets/d/1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk/edit?usp=sharing

//Input ---->   https://bit.ly/32o4MkM active   ScrapStock_link 
//Output ---->  https://bit.ly/3phuDUo 		 Check_碼



const Scrape_Rank =(async (Ntype) => {    
    const url=Ntype.href;
    const browser = await puppeteer.launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        // slowMo: 100,
        args: ['--window-size=400,1400', '--disable-notifications', '--no-sandbox']
    })
    
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(50000); // 50 sec

   console.log(`Scrape --- Rank Type ${Ntype.Name}`)
    try{
    await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }) // your url here
    await page.waitForSelector('table.r10_0_0_10.b1.p4_1>tbody>tr');
    await page.waitForTimeout(1000);
    // await page.evaluate(() => document.alert = window.alert = alert = () => {})
	
    const data = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('table.r10_0_0_10.b1.p4_1>tbody>tr'));
	   //  const images = Array.from(document.querySelectorAll('table#tblStockList'));
        const result = [];
        
        images.forEach(async (img,index) => {
			imglen=img.querySelectorAll('td').length;
			
            if(index>0 && index<30 && imglen>0){
				if(imglen==3 ){
					if(Number(img.querySelectorAll('td')[0].textContent)>0){
						result.push({
							code:"'"+img.querySelectorAll('td')[1].textContent,
							Name:img.querySelectorAll('td')[2].textContent,
						})
					}
				}
				else if(imglen==2){
					if(Number(img.querySelectorAll('td')[0].textContent)>0){
						result.push({
							code:"'"+img.querySelectorAll('td')[0].textContent,
							Name:img.querySelectorAll('td')[1].textContent,
						})
					}	
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
	console.log(`Source --- https://goodinfo.tw/tw/StockList.asp?MARKET_CAT=熱門排行
	Input ---->   https://bit.ly/32o4MkM active	ScrapStock_link 
	Output ---->  https://bit.ly/3phuDUo 		Check_碼`);
	const Type=await ReadGoogleSheet(Type_doc_Id,'Active');
	console.log(Type.length);
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
