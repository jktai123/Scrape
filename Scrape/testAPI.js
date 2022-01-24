const axios = require('axios');

const ReadGSht = require("./SaveGSht");
const { a22,ReadGoogleSheet}=ReadGSht;
const RSheet2Json_APIV2='https://script.google.com/macros/s/AKfycbz64VaqfqXVBwcFfDgDfehn947foLoeEOD6WXsvu3BNcXK6ZgTxjQAbzsIqSWmptLAo/exec'
const Type_doc_Id='https://docs.google.com/spreadsheets/d/1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo/edit#gid=859376116'
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
	const  html=`${RSheet2Json_APIV2}?sheetUrl=${Type_doc_Id}&sheetTag=ETF`
	/*
	axios.get(html)
			.then(res) => {
			  //if (err) { return console.log("ERROR--->"+err); }
			  console.log(res.data);
			  const headers = res.data[0];
			  const rows = res.data.slice(1);
			  
			  const result=convertToObjects(headers, rows)
			  console.log(`-----${sname} --Read Done`);
			  console.log (result);
			  
			  return result;
				}
			.catch(err)=>{
				console.log('Error--->'+err);
				return "";
			}
		
axios.all([
  axios.get(html),	
  //axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-03'),
  axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-02')
]).then(axios.spread((res, response2) => {
	console.log(html+' axios---->');
  //console.log(res);
  
			  
 // console.log(response2.data.url);
})).catch(error => {
  console.log(error);
});
*/
const superagent = require('superagent');
/*
superagent.get('https://api.nasa.gov/planetary/apod')
.query({ api_key: 'DEMO_KEY', date: '2017-08-02' })
.end((err, res) => {
  if (err) { return console.log(err); }
  console.log(res.body.url);
  console.log(res.body.explanation);
});
*/
//const RSheet2Json_APIV2='https://script.google.com/macros/s/AKfycbz64VaqfqXVBwcFfDgDfehn947foLoeEOD6WXsvu3BNcXK6ZgTxjQAbzsIqSWmptLAo/exec'
const fmain='https://docs.google.com/spreadsheets/d/1SoMEYJbCHBd3FDl8gjaiQMZ1WBCkDTazGHALGnKgMpk/edit#gid=2114459986';
const fetf='https://docs.google.com/spreadsheets/d/1jx9hL4CZuyET00_6LYbcz4d23WLv7iMsLbcPR3xqGbo/edit#gid=859376116'

  var a = {
		sheetUrl:fmain,
		sheetTag: 'ETF' //'Main' //'Test'
		};

const RETF = async () => {
	let ab= await a22();
	console.log ('a22-------'+ab);
	console.log(`Type.length-----`);
	let Type=await ReadGoogleSheet(Type_doc_Id,'ETF');
	await console.log(Type);
    // await delay(2000);
    // console.log("Waited 2s");
    //for(let item of Type){
	//	console.log(item.code, item.公司);
	//	if(item.code === undefined ) {break;}
          
    }

RETF();



superagent.get(RSheet2Json_APIV2)
.query({
		sheetUrl:fetf,
		sheetTag: 'ETF' //'Scrape' //'台美股' //'Main' //'Test'
		})
.end((err, res) => {
  if (err) { return console.log("ERROR--->"+err); }
  const headers = res.body[0];
  const rows = res.body.slice(1);
			  
			  const result=convertToObjects(headers, rows)
			 // console.log(`-----${sname} --Read Done`);
			  console.log (result);
  for(let item of result){
		console.log(item.code, item.公司);
		
    }
  //console.log(res.body.explanation);
});
