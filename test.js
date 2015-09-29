var db = require("./config/db");
var date = new Date();
// console.log(new Date("09-14-2015"))

function getFromDate(fromDate){
	var today = fromDate;
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    today = mm+'/'+dd+'/'+yyyy;
    return new Date(today); 
}
var nDate = getFromDate(date);
console.log(nDate)
db.portFolioBalances.find({date:{$gte:nDate}},function(err,rows){
	if(!err && rows){
		console.log(rows)
	}else{
		console.log(err)
		console.log(rows)
	}
})