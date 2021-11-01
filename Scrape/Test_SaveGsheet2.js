const SaveGsheet = require("./SaveGoogleSheet");
const { ReadGoogleSheet, SaveGoogleSheet,PushGoogleSheet } = SaveGsheet;
const doc_Id='18sT6CKuJzMPJnp4JDcOt3484rDVyj5YGh6IBLOB7S9I';
const sname='軒琪' ;//'老歌,民謠,民歌2';//;'0056'; //'軒琪';//'0050';
//const doc_Id='1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'; //'1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo';//'1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo'
//const ObjArray=require('./軒琪/看診紀錄.json');

	// SaveGoogleSheet(doc_Id,sname,ObjArray);
//PushGoogleSheet(doc_Id,sname,ObjArray);
const ObjArray=async function(){ return await ReadGoogleSheet(doc_Id,sname);}
const Result=ObjArray;
let text = "";
for (const x in Result[0]) {

     text +=x + ", ";
    }
    console.log(`${sname} --->
 ${text}`)
Result.forEach((elem,i)=>{
    let text = "";
    for (const x in elem) {
     text += elem[x] + ", ";
    }
    // console.log(`${i+1} ${elem.period} ${elem.count}  ${elem.Time} ${elem.doctor}  `)
    console.log(`${i+1} ${text}`)
})


