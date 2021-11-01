const fs = require('fs');
const puppeteer = require('puppeteer');
//引入cheerio
const cheerio = require('cheerio');

let fileName = "C:/Users/TAI/Documents/node_study/church/churchAll.json";

// try{
// let rawdata = fs.readFileSync(fileName);
// console.log(rawdata);
// let student = JSON.parse(rawdata);
// console.log(student);
// } catch (err) {
//     console.log(`Error reading file from disk: ${err}`);
// }
let jsonObj = JSON.parse(fs.readFileSync(fileName, "utf8"));


(async () => {
    // Delay function
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const url='http://www.pct.org.tw/look4church.aspx' ;
    const chrchall = 'select#ctl00_ContentPlaceHolder1_ddlAddress';
    async function GetchurchDetailInfo(elem){
        url2=elem.href;
        // await page.goto(url); // 進入指定頁面
        // await page.waitForSelector(chrchall)
        await page.goto(url2);
        try{
        await page.waitForSelector('#master');
        }catch(err){
            console.log(`Fail ${elem.title} url ${url2}`);
            return{} ;
        }
        
        
        // 获取每个
        // let body =  page.content();
        
        let body =  await page.content();
       
        // console.log(elem.title);
        let $ = await cheerio.load(body);

            const v =  $('#chinfo');
            const OrgName=$('#ctl00_ContentPlaceHolder1_lbOrgName').text();
            const BelName=$('#ctl00_ContentPlaceHolder1_lbBelName').text();
            const Scale=$('#ctl00_ContentPlaceHolder1_lbScale').text();
            const SetTime=$('#ctl00_ContentPlaceHolder1_lbSetTime').text();
            const UpdTime=$('#ctl00_ContentPlaceHolder1_lbUpgrade').text();
            const Address=$('#ctl00_ContentPlaceHolder1_lbAddress').text();
            const Tel=$('#ctl00_ContentPlaceHolder1_lbTel').text();
            const Fax=$('#ctl00_ContentPlaceHolder1_lbFax').text();
            const Email=$('#ctl00_ContentPlaceHolder1_lbEmail').text();
            const Hist_L='http://www.pct.org.tw/'+$('#ctl00_ContentPlaceHolder1_hlHistory').attr('href');
            const Service=$('#ctl00_ContentPlaceHolder1_lbService').text();
            const Web=$('#ctl00_ContentPlaceHolder1_lbLink').text();
            const PIC_Src=$('#ctl00_ContentPlaceHolder1_imgChurch').attr('src');
            const OrgNum=$('#ctl00_ContentPlaceHolder1_lbOrgNum').text();
            const Fellowship=$('#ctl00_ContentPlaceHolder1_lbFellowship').text();
            const 陪餐會員=$('#ctl00_ContentPlaceHolder1_lbMember1').text();
            const 未陪餐會員=$('#ctl00_ContentPlaceHolder1_lbMember2').text();
            const 不在會員=$('#ctl00_ContentPlaceHolder1_lbMember3').text();
            const 慕道友=$('#ctl00_ContentPlaceHolder1_lbMember4').text();
            const 牧者=$($($(v).find('tr')[6]).find('td')[1]).text().trim();

                return {
                OrgName,OrgNum,
                BelName,
                Scale,Address,
                Tel,Fax,Email,
                // created,
                SetTime,UpdTime,
                陪餐會員,未陪餐會員,不在會員,慕道友,牧者,
                Fellowship,Web,Hist_L,
                PIC_Src
                };
            }

   

    // const browser = await puppeteer.launch();    
    const browser = await (puppeteer.launch({ 
    
    executablePath:
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: false }));
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(50000); // 50 sec
    data=[];
    for (let i=0; i<jsonObj.length; i++) {
        console.log(`${i+1}/${jsonObj.length+1} ${jsonObj[i].title}`)
        const detail=  await GetchurchDetailInfo(jsonObj[i]);
        if(Object.keys(detail).length!==0){
        data.push(detail);
            }
        if (i==3000){
            break;
        }
    }

    console.log(`共蒐集到${data.length}間教會機構信息`);
    const fs = require('fs');
    const directory = './church'
    if(!fs.existsSync(directory)){
  fs.mkdirSync(directory)
}
     writerStream = fs.createWriteStream(directory+"/churchDetail.json");
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
    

    fs.writeFile(directory+'/churchDetail.csv', csv, function(err) {
        if (err) {
            return console.log(err);
        }
        
        console.log("The csv file was saved!");
 
    });
    await browser.close(); // 關閉瀏覽器
})()