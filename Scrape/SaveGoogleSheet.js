const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./JKGoogleSheet.json'); // the file saved above

// (async function(){
//Test https://docs.google.com/spreadsheets/d/18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I/edit#gid=1230294072
const doc_Id='18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I';
const sname='軒琪';//'0050';
const ObjArray=require('./軒琪/看診紀錄.json');

//Stock 
//https://docs.google.com/spreadsheets/d/1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo/edit#gid=1230294072
// const doc_Id='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'
// const ObjArray=require('./stock/0051.json');
// const sname='0051';
//----------------
function convertToObjects(headers, rows)
{
  return rows.reduce((ctx, row) => {
    ctx.objects.push(ctx.headers.reduce((item, header, index) => {
      item[header] = row[header];
      return item;
    }, {}));
    return ctx;
  }, { objects: [], headers}).objects;
}
//----------------
const SaveGoogleSheet =(async (doc_Id,sname,ObjArray) => {
const doc = new GoogleSpreadsheet(doc_Id);
await doc.useServiceAccountAuth(creds);
// const doc = new GoogleSpreadsheet('<YOUR-DOC-ID>');

await doc.loadInfo(); // loads document properties and worksheets
// console.log(`${doc.title}--- ${doc.sheetCount}`);
let find=false;
for (let i = 0; i < doc.sheetCount;i++){
    if(sname==doc.sheetsByIndex[i].title){
            find=true;
            break;
        }
        
}
if(!find){
  await doc.addSheet({ title:sname});
}
const sheet = doc.sheetsByTitle[sname];  
await sheet.clear();
await sheet.setHeaderRow(Object.keys(ObjArray[0]));
await sheet.addRows(ObjArray);
console.log('---Save Done');
})
//-----------------------------

const ReadGoogleSheet =(async (doc_Id,sname) => {
        const doc = new GoogleSpreadsheet(doc_Id);
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo(); 
        let find=false;
        for (let i = 0; i < doc.sheetCount;i++){
        if(sname==doc.sheetsByIndex[i].title){
                find=true;
                break;
                }}
        if(!find){
                // console.log(`Error ${doc.sheetsByIndex[0].title}`);
                sname = doc.sheetsByIndex[0].title;
                console.log(`Sname ---${sname}`);
                // return {};
        }
        const sheet = doc.sheetsByTitle[sname];  
        
        // read rows
        const rows = await sheet.getRows(); // can pass in { limit, offset }
        const headers=sheet.headerValues;
        console.log('--->'+rows.length);
        const result=convertToObjects(headers, rows)
        console.log(`---${doc.title}--${sname} --Read Done`);
        
        return result;

        
     })
//----------------------------------------2


const PushGoogleSheet =(async (doc_Id,sname,ObjArray) => {
const doc = new GoogleSpreadsheet(doc_Id);
await doc.useServiceAccountAuth(creds);
// const doc = new GoogleSpreadsheet('<YOUR-DOC-ID>');

await doc.loadInfo(); // loads document properties and worksheets
// console.log(`${doc.title}--- ${doc.sheetCount}`);
let find=false;
for (let i = 0; i < doc.sheetCount;i++){
    if(sname==doc.sheetsByIndex[i].title){
            find=true;
            break;
        }
        
}
if(!find){
  await doc.addSheet({ title:sname});
  const sheet = doc.sheetsByTitle[sname];  
  await sheet.setHeaderRow(Object.keys(ObjArray[0]));
}
const sheet = doc.sheetsByTitle[sname];  
// await sheet.clear();
// await sheet.setHeaderRow(Object.keys(ObjArray[0]));
await sheet.addRows(ObjArray);

//console.log('---Push Done');
// read rows
// const rows = await sheet.getRows(); // can pass in { limit, offset }
// console.log('--->'+rows.length);
// read/write row values
// for (let i = 0; i < rows.length;i++){
//         console.log(`${i+1}--${rows[i].name} -- ${rows[i].email}`);    
// }

// for (let i = 0; i < doc.sheetCount;i++){
//     let sht=doc.sheetsByIndex[i]
//     console.log(`${i+1} --- ${sht.title}- ${sht.rowCount}- ${sht.columnCount}`);    
// }

})
// SaveGoogleSheet(doc_Id,sname,ObjArray);
//PushGoogleSheet(doc_Id,sname,ObjArray);

        
        // const doc_Id='18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I';
        // const sname='軒琪';//'0050';
        // const Result=await ReadGoogleSheet(doc_Id,sname);
        // console.log(`Rdata---> ${Result.length} 
	// ${Result}`)
// })()
module.exports = {
ReadGoogleSheet,
SaveGoogleSheet,
PushGoogleSheet
};