var commonActions = require("./commonActions").commonActions;
function userModule(db){
	var common = new commonActions(db);
	this.getUserInfo = function(selectQuery,callback){
		
		common.getUserData(selectQuery,function(data){
			if(data){
				console.log("data found ===> ")
				//console.log(data)
				callback(data)
			}
		})
	}
	this.getPortfolio = function(selectQuery,callback){
		db.Portfolio.find(selectQuery).sort({'createDate':1}).exec(function(err,docs){
		 	if(err)
		 		console.log('error'+err)
		 	else{
		 		callback(docs)
		 	}
		 })
	}
	this.getReportType = function(selectQuery,callback){
		db.ReportType.find(selectQuery).sort({'createDate':1}).exec(function(err,docs){
		 	if(err)
		 		console.log('error'+err)
		 	else{
		 		callback(docs)
		 	}
		 })
	}
	this.getCompanies = function(callback){
		db.Company.find().exec(function(err,list){
			if(!err && list.length > 0)
				callback(list);
			else
				callback([]);
		})
	}
	
}
module.exports.userModule = userModule;
