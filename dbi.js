var db = require("./config/db");
var pData = {
	rTName : "Commodities",
	createDate : new Date()
}
var abc = new db.ReportType(pData);
abc.save(function(err,pd){
	console.log(err + " ------- " + pd)
})