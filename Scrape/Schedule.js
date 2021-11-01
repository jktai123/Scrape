const SaveGsheet = require("./SaveGoogleSheet");
const { ReadGoogleSheet, SaveGoogleSheet,PushGoogleSheet } = SaveGsheet;
const doc_Id='18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I';
const sname='軒琪' ;
const schedule = require('node-schedule');
//const shutdown = require('electron-shutdown-command');

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
(async function(){

//let hists= JSON.parse(fs.readFileSync('C:/Users/TAI/Documents/node_study/puppeteer-main/Scrape/軒琪/看診紀錄.json',{encoding:'UTF-8'}));
const hists=await ReadGoogleSheet(doc_Id,sname);
console.log(hists.length);
// const startTime = new Date(Date.now() + 1000);
const startTime1 = new Date((new Date).setHours(8, 00, 0));
const endTime1 = new Date((new Date).setHours(12, 00, 0));
const startTime2 = new Date((new Date).setHours(15, 30, 0));
const endTime2 = new Date((new Date).setHours(22, 00, 0));
const job_rule= '*/5 * * * *';
const cDate=(new Date).toLocaleDateString();

let itm=hists.length-1;
// const startTime = new Date((new Date).setHours(8, 30, 0));
// const endTime = new Date((new Date).setHours(10, 45, 0));
// hists.forEach((el,i) => {
  
//   console.log(`${i+1}  ${el.doctor}  ${el.Time.split(' ')[0]} ${el.period} ${el.count}  ${el.Time.split(' ')[1]}  `);
  
// });
let last=hists[hists.length-1];
const job1 = schedule.scheduleJob({ start: startTime1, end: endTime1, rule:job_rule }, function(){
  // console.log(`Time:${new Date()}`);
  webscraping(pageURL)
  .then(dataObj => {
     const {count,doctor}=dataObj;
     if (Object.keys(dataObj).length > 0){
      // let check = hists.find((item)=> item.count===count
      //   && item.period==='1' && item.Time.split(' ')[0]===cDate && parseInt(count)>0 )
      let check = last.count===count && last.period==='1' 
            && last.Time.split(' ')[0]===cDate && parseInt(count)>0 ;
      if(!check){
        // hists.push({doctor,count,Time:(new Date()).toLocaleString(), period:'1'} );
        last={doctor,count,Time:(new Date()).toLocaleString(), period:'1'};
        PushGoogleSheet(doc_Id,sname,[last]);
        //save_jsoncsv('軒琪','看診紀錄',hists);
        itm=itm+1;//hists.length-1;
        // console.log(`${itm+1}  ${doctor}  ${hists[itm].Time.split(' ')[0]} ${hists[itm].period} ${count}  ${hists[itm].Time.split(' ')[1]}  `);
        console.log(`${itm+1}  ${doctor}  ${last.Time.split(' ')[0]} ${last.period} ${count}  ${last.Time.split(' ')[1]}  `);
        // save_jsoncsv('軒琪','看診紀錄',hists);
      }
    }
      
      if(!job1.nextInvocation()){
		
 
        // job.cancel();
        //save_jsoncsv('軒琪','看診紀錄',hists);
      }
  })
  .catch(console.error);
});

const job = schedule.scheduleJob({ start: startTime2, end: endTime2, rule: job_rule }, function(){
  // console.log(`Time:${new Date()}`);
  webscraping(pageURL)
  .then(dataObj => {
    if (Object.keys(dataObj).length > 0){
     const {count,doctor}=dataObj;
    //  let check = hists.find((item)=> item.count===count
    //   && item.period==='2' && item.Time.split(' ')[0]===cDate && parseInt(count)>0)
    let check = last.count===count && last.period==='2' 
            && last.Time.split(' ')[0]===cDate && parseInt(count)>0 ;
     if(!check){
      last={doctor,count,Time:(new Date()).toLocaleString(), period:'2'}
      // hists.push({doctor,count,Time:(new Date()).toLocaleString(), period:'2'});
      PushGoogleSheet(doc_Id,sname,[last]);
      //save_jsoncsv('軒琪','看診紀錄',hists);
      itm=itm+1;
      // console.log(`${itm+1}  ${doctor}  ${hists[itm].Time.split(' ')[0]} ${hists[itm].period} ${count}  ${hists[itm].Time.split(' ')[1]}  `);
       console.log(`${itm+1}  ${doctor}  ${last.Time.split(' ')[0]} ${last.period} ${count}  ${last.Time.split(' ')[1]}  `);
      // save_jsoncsv('軒琪','看診紀錄',hists);
     }
    }
      
      if(!job.nextInvocation()){
		   // https://github.com/samuelcarreira/electron-shutdown-command#readme
		
		//shutdown.shutdown(); // simple system shutdown with default options
        // job.cancel();
        //save_jsoncsv('軒琪','看診紀錄',hists);
      }
  })
  .catch(console.error);
});
})()

