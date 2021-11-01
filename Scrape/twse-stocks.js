
const fetch = require("node-fetch");
const baseUrl = 'http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=';
// https://zys-notes.blogspot.com/2020/01/api.html
//module.exports.
const getTwStock =(async (stock) => {

	
	let query =  'tse_' + stock + '.tw|' + 'otc_' + stock + '.tw';
	return new Promise(resolve=>{
		fetch(baseUrl + query)
        .then(res=>res.json())
        .then(json=>resolve(json.msgArray[0]))
		// return resolve(result);
        })
        .catch(err=>resolve(err))
	})

const getTwStocks =(async (stocks) => {
	let query = ''
	//改為一次抓兩種，必經如果錯誤並不會回傳資訊
	stocks.forEach(stock => query = query + 'tse_' + stock + '.tw|' + 'otc_' + stock + '.tw|');
	query = query.substring(0, query.lastIndexOf('|'));
	query = query + '&json=1&delay=0&_=' + Date.now();;
	// console.log(baseUrl + query);
	
	// let query =  'tse_' + stock + '.tw|' + 'otc_' + stock + '.tw';
	return new Promise(resolve=>{
		fetch(baseUrl + query)
        .then(res=>res.json())
        .then(json=>resolve(json.msgArray))
		// return resolve(result);
        })
        .catch(err=>resolve(err))
	})

module.exports={getTwStock,getTwStocks};