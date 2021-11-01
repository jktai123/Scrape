const puppeteer = require('puppeteer');
// //引入cheerio
// const cheerio = require('cheerio');

(async () => {
  // Delay function
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  
  // 
  const get_detail = async (href) =>{
    console.log(`Detail Loop  --- ${href}`);
    page.goto(href);
    const church = '#chinfo';
    
    await page.waitForSelector(church);
    data=[];
    let elementsHandles = await page.evaluate(
        () => document.getElementById('chinfo').getElementsByTagName('tr'));
    let elements = await elementsHandles.getProperties();
    let elements_arr = Array.from(elements.values());
    elements_arr.forEach(async element => {
        let txt=await (await element.getProperty("innerText")).jsonValue();
        console.log(txt)
        data.push(txt);
    });
    await page.goBack();
    console.log(data);
    return data
  }
// 使用自訂的 Chrome
   const browser = await puppeteer.launch(
      {
    executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    //   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false // 無外殼的 Chrome，有更佳的效能
  });
  const page = await browser.newPage(); // 開啟新分頁
  const url='http://www.pct.org.tw/look4church.aspx' ;//https://www.google.com.tw'  //'https://example.com'
  // await page.setViewport({
  //     width:1280,
  //     height:800
  // })
  await page.goto(url); // 進入指定頁面
//   await page.waitForSelector('section')
  let data = []
  const chrch100 = '#ctl00_ContentPlaceHolder1_LinkButton1';
  const chrch100x = '#ctl00_ContentPlaceHolder1_pl100';
  await page.waitForSelector(chrch100);
  await page.click(chrch100);
  

  let end = true
  
  while(end){
    await page.waitForSelector(chrch100x);
    // page.waitFor(5000);

    await wait(1000);
    console.log('Wait 1sec');
    // await page.evaluate(() => alert('This message is inside an alert box'));
    // const element =await page.$$(".dot_gray");
// 获取每个
    const SHOP_LIST_SELECTOR = '#ctl00_ContentPlaceHolder1_gv100';
    const shopList = await page.evaluate((sel) => {
      const shopBoxs = Array.from($(sel).find('.dot_gray'));
      const item = shopBoxs.map(v => {
        // 获取每个商品的名称、品牌、价格
        
        const title = $(v).find('a').text().trim();
        const href = 'http://www.pct.org.tw/'+$(v).find('a').attr('href');
        const type = $($(v).find('td')[2]).text().trim();
        const created = $($(v).find('td')[1]).text().trim();
        const Address = $($(v).find('td')[3]).text().trim();
        // let detail= get_detail(href);
        // // console.log(`Data ---- ${detail}`)
        return {
          title,
          Address,
          type,
          created,
          href
        };
      });
      return item;
    }, SHOP_LIST_SELECTOR);
    console.log(data.length+'   '+shopList.length);
    data = [...data, ...shopList];
    
   try{
    
    await page.click('input[alt="下一頁"]');
      }
   catch(err){
      console.log('Error--:'+err);
      end=false
    }
  }
  // await page.waitFor(4000);
 
  await page.screenshot({
       path: 'scrapchurch.png' ,
       fullPage:true
    }); // 截圖，並且存在...
  // await page.pdf({
  //   path: 'hn.pdf',
  //   format: 'letter',
  // });
  console.log(data);
  // console.log(data.length);
  console.log(`共蒐集到${data.length}間教會機構信息`);
    const fs = require('fs');
    const content = JSON.stringify(data); //轉換成json格式
    // const content = data; //轉換成json格式
    fs.writeFile("church100.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        
        console.log("The file was saved!");
    });
  await browser.close(); // 關閉瀏覽器
})();