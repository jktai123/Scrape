const SaveGsheet = require("./SaveGoogleSheet");
const { ReadGoogleSheet, SaveGoogleSheet,PushGoogleSheet } = SaveGsheet;
const doc_Id='18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I';
const sname='軒琪' ;
//Test https://docs.google.com/spreadsheets/d/18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I/edit#gid=1230294072

const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
const fs = require('fs')
const data = require("./data1");
const { DanyURL:pageURL } = data;
const webscraping = require("./webscraping1");
const save_jsoncsv = require("./save_jsoncsv");
// const compareAndSaveResults = require("./resultAnalysis1");
//https://github.com/node-schedule/node-schedule
//rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
// rule.minute = 0;
let hists= JSON.parse(fs.readFileSync('C:/Users/TAI/Documents/node_study/puppeteer-main/Scrape/軒琪/看診紀錄.json',{encoding:'UTF-8'}));
console.log(hists.length);
// const startTime = new Date(Date.now() + 1000);
const Time0 = new Date(Date.now() + 1000);
const Time1 = new Date((new Date).setHours(11, 55, 0));
const Time2 = new Date((new Date).setHours(12, 00, 0));
const Time3 = new Date((new Date).setHours(18, 20, 0));
const Time4 = new Date((new Date).setHours(18, 30, 0));
const Time5 = new Date((new Date).setHours(21, 55, 0));
const Time6 = new Date((new Date).setHours(22, 00, 0));
const planSchedule=[Time0,Time1,Time2,Time3,Time4,Time5,Time6];

const cDate=(new Date).toLocaleDateString();

let itm=hists.length-1;
// const startTime = new Date((new Date).setHours(8, 30, 0));
// const endTime = new Date((new Date).setHours(10, 45, 0));
hists.forEach((el,i) => {
  
  console.log(`${i+1}  ${el.doctor}  ${el.Time.split(' ')[0]} ${el.period} ${el.count}  ${el.Time.split(' ')[1]}  `);
  
});
planSchedule.forEach(elem=>{
    console.log(elem.toLocaleTimeString());
    const job1 = schedule.scheduleJob(elem, function(){
    // let Perc=1;
    // if(Time0<Date()){        PerC=2;}
    // console.log(`Time:${Date()} `);
    webscraping(pageURL)
    .then(dataObj => {
        let PerC='1';
        if(Time0<new Date()){ 
             PerC='2';
        }
        console.log(`Time:${Date()} ${PerC}`);
        const {count,doctor}=dataObj;
        if (Object.keys(dataObj).length > 0){
        const check = hists.find((item)=> item.count===count
            && item.period===PerC && item.Time.split(' ')[0]===cDate  && parseInt(count)>0)
        if(!check){
            hists.push({doctor,count,Time:(new Date()).toLocaleString(), period:PerC} );
            PushGoogleSheet(doc_Id,sname,[{doctor,count,Time:(new Date()).toLocaleString(), period:PerC}]);
            itm=hists.length-1;
            console.log(`${itm+1}  ${doctor}  ${hists[itm].Time.split(' ')[0]} ${hists[itm].period} ${count}  ${hists[itm].Time.split(' ')[1]}  `);
            // save_jsoncsv('軒琪','看診紀錄',hists);
        }
        }
        
        if(!job1.nextInvocation()){
            // job.cancel();
            save_jsoncsv('軒琪','看診紀錄',hists);
        }
    })
    .catch(console.error);
    });
})


