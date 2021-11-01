const puppeteer = require( "puppeteer");
const webscraping = async pageURL => {
const browser = await puppeteer. launch({
        executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
args: ['--window-size=240,800','--no-sandbox', '--disable-setuid-sandbox'],
headless: false,
// args: []//,"--no-sandbox" ]
});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(120000); // 50 sec
let dataobj = {};

 try {
 await  page.goto( pageURL);
 await  page.waitForSelector('span.caller-subtitle');
 const hospital = await page.evaluate(() => {
    const doctor = document.querySelector('span.caller-subtitle').innerText;
    const count = document.querySelector('span#caller_548-0').innerText;
 
    return {doctor,count}
 });
//  console.log(`Doctor: ${hospital.doctor}  count:${hospital.count}`);
   if(hospital.count=='---' || hospital.count=='0'){
      dataobj={};
   }else{
      dataobj = hospital;
   }
 } catch (e) {
   console.log(e);
   dataobj ={};
 }
 	let pages = await browser.pages();
	await Promise.all(pages.map(page =>page.close()));
	//await browser.close();
    //await page.close();
    await browser.close();
    return dataobj;
 };
 module.exports = webscraping;