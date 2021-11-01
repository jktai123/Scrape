const puppeteer = require('puppeteer');
//引入cheerio
const cheerio = require('cheerio');


(async () => {
  // Delay function
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  const Result_chrchall = '#ctl00_ContentPlaceHolder1_plSearchResult';
  async function Getchurchinfo(city){
        const church_info='#ctl00_ContentPlaceHolder1_gvSearch';
        console.log(city);
        let tmp=[];
        let end = true
        const fpage = await page.evaluate(() => document.querySelector('*').innerText);
        const found = fpage.match('無教會資料','/g') ;
        if(found){
            end=false;
        }
        while(end){
            await page.waitForSelector(Result_chrchall);

            // page.waitFor(5000);

            await wait(1000);
            // console.log('Wait 1sec');
            // await page.evaluate(() => alert('This message is inside an alert box'));
            // const element =await page.$$(".dot_gray");
        // 获取每个
            let body = await page.content()
            let $ = await cheerio.load(body)

            const items = await Array.from($('#ctl00_ContentPlaceHolder1_gvSearch .dot_gray'))
            const itemList = items.map(v=>{
                // 获取每个商品的名称、品牌、价格
                const title = $(v).find('a').text().trim();
                const href = 'http://www.pct.org.tw/'+$(v).find('a').attr('href');
                const type = $($(v).find('td')[1]).text().trim();
                // const created = $($(v).find('td')[1]).text().trim();
                const Address = $($(v).find('td')[2]).text().trim();
                // const detail= get_detail(href);
                // console.log(`Data ---- ${detail.title}   and ${title}`)

                return {
                title,
                Address,
                type,
                // created,
                href,city
                };
            });

            tmp = [...tmp, ...itemList];
            console.log(`tmp.length---->${tmp.length}`);
            
            
        try{
            
            await page.click('input[alt="下一頁"]');
            }
        catch(err){
            console.log('Error--:'+err);
            end=false;
            }
        }
        return tmp;
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
  page.setDefaultNavigationTimeout(50000); // 50 sec
  const url='http://www.pct.org.tw/look4church.aspx' ;
  //https://www.google.com.tw'  //'https://example.com'
  // await page.setViewport({
  //     width:1280,
  //     height:800
  // })
  let data = []
  const duplicate_city=[]
//   ['宜蘭市','桃園縣','苗栗市','彰化市','南投市','屏東市','台東市','花蓮市']
  const chrchall = 'select#ctl00_ContentPlaceHolder1_ddlAddress';
  await page.goto(url); // 進入指定頁面
  await page.waitForSelector(chrchall);

//   await page.click(chrch100);
  const selectOptions = await page.$$eval('#ctl00_ContentPlaceHolder1_ddlAddress > option', options => { return options.map(option => option.value) })
 console.log(selectOptions)

  const Btn_chrchall = '#ctl00_ContentPlaceHolder1_btnSearch';
  
  for (let i=1; i<selectOptions.length; i++) {
      if( ! duplicate_city.includes(selectOptions[i]) ){
        await page.select(chrchall, selectOptions[i]);
        //   await page.select(chrchall, "台北市");

        await page.click(Btn_chrchall);
        await page.waitForSelector(Result_chrchall);
        const Result = await Getchurchinfo(selectOptions[i]);
        data = [...data, ...Result];
        console.log(`data.length---->${data.length}`);
        if(i==selectOptions.length-1){break;}
        await page.goto(url); // 進入指定頁面
        await page.waitForSelector(chrchall)
        //   wait(5000);
        console.log(`selectOptions[i]--- ${selectOptions[i]}`)  ;
      }
}
  

 
  
  console.log(`共蒐集到${data.length}間教會機構信息`);
    const fs = require('fs');
    const directory = './church'
    if(!fs.existsSync(directory)){
  fs.mkdirSync(directory)
}
     writerStream = fs.createWriteStream(directory+"/churchAll.json");
    writerStream.write(JSON.stringify(data, undefined, 2), 'UTF8');
    writerStream.end();
    // const content = JSON.stringify((data, undefined, 2)); //轉換成json格式
    // // const content = data; //轉換成json格式
    // fs.writeFile(directory+"/churchAll.json", data, 'utf8', function (err) {
    //     if (err) {
    //         return console.log(err);
    //     }
        
    //     console.log("The json file was saved!");
    // });
    const { Parser } = require('json2csv');
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    

    fs.writeFile(directory+'/churchAll.csv', csv, function(err) {
        if (err) {
            return console.log(err);
        }
        
        console.log("The csv file was saved!");
 
    });
    await browser.close(); // 關閉瀏覽器
})();