var commonActions = require("./commonActions").commonActions;
function userModule(db){
	var common = new commonActions(db);


	this.addPortfolio = function(selectQuery,callback){
		db.Portfolio.find({pName:selectQuery.pName},function(err,info){
			if(!err && info.length>0){
				callback({status:"this Portfolio name already exists"})
			}else{
				new db.Portfolio({pName:selectQuery.pName,createDate:new Date()}).save(function(err,saved){
					if(!err && saved){
						callback({status:"new Portfolio added successfully"})
					}else{
						callback({status:"new Portfolio added successfully"})
					}
				})
			}
		})

	}

	this.addCompany = function(selectQuery,callback){
		db.Company.find({cName:selectQuery.cName},function(err,info){
			if(!err && info.length>0){
				callback({status:"this Company name already exists"})
			}else{
				new db.Company({cName:selectQuery.cName,createDate:new Date()}).save(function(err,saved){
					if(!err && saved){
						callback({status:"new Company added successfully"})
					}else{
						callback({status:"new Company added successfully"})
					}
				})
			}
		})

	}

	this.addReportType = function(selectQuery,callback){
		db.ReportType.find({rTName:selectQuery.rTName},function(err,info){
			if(!err && info.length>0){
				callback({status:"this ReportType name already exists"})
			}else{
				new db.ReportType({rTName:selectQuery.rTName,createDate:new Date()}).save(function(err,saved){
					if(!err && saved){
						callback({status:"new ReportType added successfully"})
					}else{
						callback({status:"new ReportType added successfully"})
					}
				})
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
