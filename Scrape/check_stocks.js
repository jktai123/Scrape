var GStocks = require('./twse-stocks');
const { getTwStocks,getTwStock} = GStocks;
const schedule = require('node-schedule');


(async function(){
	const rule = new schedule.RecurrenceRule();
	const job_rule= '*/5 * * * *';
	const startTime1 = new Date((new Date).setHours(9, 00, 0));
	const endTime1 = new Date((new Date).setHours(13, 35, 0));
	const Display=async (code,qty) =>{
		const price=await getTwStock(code);
		// console.log(price.t);
		const msg=`${price.t} ${price.c} ${price.n} ${qty} ${(qty*(parseFloat(price.b))).toFixed(2)} ${qty*(parseFloat(price.b)-parseFloat(price.y)).toFixed(2)} ${(parseFloat(price.b)-parseFloat(price.y)).toFixed(2)}
	OHLC:${parseFloat(price.o)},${parseFloat(price.h)},${parseFloat(price.l)},${parseFloat(price.z)} Y:${parseFloat(price.y)} Vol:${parseInt(price.v)}
	${price.a}
	${price.b}`;
//  console.log(price);
		return msg;
	}
	const Displays=async (codes,qtys) =>{
		const prices=await getTwStocks(codes);
		let msg='';
		let cprice=0;
		let tprice=0;
		let dprice=0;
		let tpriceA=0;
		let dpriceA=0;
		prices.forEach((price,i)=>{
			if(i==0){
				msg=`${price.t}`
			}
			if(parseFloat(price.z)>0){
				cprice=parseFloat(price.z)
			}else{
				cprice=parseFloat(price.b)
			}
			dprice=cprice-parseFloat(price.y)
			dpriceA=qtys[i]*dprice+dpriceA;
			tprice=qtys[i]*cprice;
			tpriceA=tprice+tpriceA;
			// msg=msg+`\t\n ${price.c}	${tprice.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')}	${(qtys[i]*(dprice)).toFixed(1)}	${qtys[i]} ${cprice.toFixed(2)}	${dprice.toFixed(2)}	 ${price.n}`;
	
		})
		msg=msg+` ${tpriceA.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ${dpriceA.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ${((dpriceA/(tpriceA-dpriceA))*100).toFixed(2)}%`
		// console.log(price.t);
		
//  console.log(price);
		return msg;
	}
	const job1 = schedule.scheduleJob({ start: startTime1, end: endTime1, rule:job_rule },async function(){
  // console.log(`Time:${new Date()}`);
		const codes=['0050','9917','2891','5434','0056','9925','4938','00881','8422','2458','3045','2356','2439','00878'];
		const qtys=[7000,9030,21000,3776,12000,10100,5000,20000,2000,1000,2000,6309,1000,3000];
		console.log(await Displays(codes,qtys));
      
      if(!job1.nextInvocation()){
        // job.cancel();
        //save_jsoncsv('軒琪','看診紀錄',hists);
      }
	  
  
});

	

})()
