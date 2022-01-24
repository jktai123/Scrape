const superagent = require('superagent');
const axios = require('axios');
const RSheet2Json_APIV2='https://script.google.com/macros/s/AKfycbz64VaqfqXVBwcFfDgDfehn947foLoeEOD6WXsvu3BNcXK6ZgTxjQAbzsIqSWmptLAo/exec'


function convertToObjects(headers, rows)
{
  console.log(headers);
  console.log(rows[0]);
  return rows.reduce((ctx, row) => {
	
    ctx.objects.push(ctx.headers.reduce((item, header, index) => {
	//  console.log(`item--- ${item} ,header---${header} index--${index}`);
      item[header] = row[index];
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
const a22=( async ()=>{
	return "AAA";
})
const ReadGoogleSheet =(async (doc_Id,sname) => {
	    
		superagent.get(RSheet2Json_APIV2)
			.query({
					sheetUrl:doc_Id,
					sheetTag: sname
					})
					
			.end((err, res) => {
			  if (err) { return console.log("ERROR--->"+err); }
			 // console.log(res.body);
			  const headers = res.body[0];
			  const rows = res.body.slice(1);
			  console.log("header ----"+headers.length);
			  const result=convertToObjects(headers, rows)
			  console.log(`-----${sname} --Read Done`);
			 console.log (result.length,rows.length,headers.lenth );
			  console.log("result ----");
			  console.log(result);
			  return result;
			});
        
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


})
// SaveGoogleSheet(doc_Id,sname,ObjArray);
//PushGoogleSheet(doc_Id,sname,ObjArray);

		

// })()
module.exports = {
ReadGoogleSheet,a22
};