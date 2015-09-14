var commonActions = require("./commonActions").commonActions;
function userModule(db){
	var common = new commonActions(db);
	this.addPortfolio = function(selectQuery,callback){
		db.portFolio.find({pName:selectQuery.pName},function(err,info){
			if(!err && info.length>0){
				callback({status:"this Portfolio name already exists"})
			}else{
				console.log(selectQuery)
				var pDetails = {pName:selectQuery.pName, capital:selectQuery.capital, date : new Date()}
				new db.portFolio(pDetails).save(function(err,saved){
					if(!err && saved){
						var exp = 0;
						exp = exp + (parseInt(selectQuery.equity) || 0);
						var portBalData = {
							pName : selectQuery.pName,
							openBal : parseInt(selectQuery.equity) || 0,
							closeBal : parseInt(selectQuery.equity) || 0,
							type : "equity",
							date : new Date()
						}
						exp = exp + (parseInt(selectQuery.futures) || 0);
						new db.portFolioBalances(portBalData).save(function(err,balances){
							if(!err && balances){
								var portBalData = {
									pName : selectQuery.pName,
									openBal : parseInt(selectQuery.futures) || 0,
									closeBal : parseInt(selectQuery.futures) || 0,
									type : "futures",
									date : new Date()
								}
								exp = exp + (parseInt(selectQuery.futures) || 0)
								new db.portFolioBalances(portBalData).save(function(err,balances){
									if(!err && balances){
										// callback({status:"new Portfolio added successfully"})
										var portBalData = {
											pName : selectQuery.pName,
											openBal : parseInt(selectQuery.commodity) || 0,
											closeBal : parseInt(selectQuery.commodity) || 0,
											type : "commodity",
											date : new Date()
										}
										exp = exp + (parseInt(selectQuery.commodity) || 0)
										new db.portFolioBalances(portBalData).save(function(err,balances){
											if(!err && balances){
												// callback({status:"new Portfolio added successfully"})
												var portBalData = {
													pName : selectQuery.pName,
													openBal : parseInt(selectQuery.mutualfunds) || 0,
													closeBal : parseInt(selectQuery.mutualfunds) || 0,
													type : "mutualfunds",
													date : new Date()
												}
												exp = exp + (parseInt(selectQuery.mutualfunds) || 0)
												new db.portFolioBalances(portBalData).save(function(err,balances){
													if(!err && balances){
														// callback({status:"new Portfolio added successfully"})
														console.log(exp + " =================")
														var bal = parseInt(selectQuery.capital) - exp; 
														var portBalData = {
															pName : selectQuery.pName,
															openBal : bal,
															closeBal : bal,
															type : "cash",
															date : new Date()
														}
														new db.portFolioBalances(portBalData).save(function(err,balances){
															if(!err && balances){
																callback({status:"new Portfolio added successfully"})
															}else{
																callback({status:"problem in saving cash"})
															}
														})
													}else{
														callback({status:"problem in saving mutualfunds"})
													}
												})
											}else{
												callback({status:"problem in saving commodity"})
											}
										})
									}else{
										callback({status:"problem in saving futures"})
									}
								})
							}else{
								callback({status:"problem in saving equity"})
							}
						})
					}else{
						callback({status:"problem in saving in portfolio"})
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
		db.portFolio.find(selectQuery).sort({'createDate':1}).exec(function(err,docs){
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
