var db = require("./config/db");
var pData = {
	cName : "hinduja power",
	createDate : new Date()
}
var abc = new db.Company(pData);
abc.save(function(err,pd){
	console.log(err + " ------- " + pd)
})