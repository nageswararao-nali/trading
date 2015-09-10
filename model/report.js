
function reportModule(db){
	// var common = new commonActions(db);
	this.buySharesFromOrg = function(data,callback){
		// console.log(JSON.stringify(data))
		// {"pId":"","rTId":"55e7d548bf3390c511fbeaf8","cId":"55e810a7c49b68c812b7f780","quantity":"100","price":"15"}
				storeInRHistory(data,'buy');
				db.Report.findOne({ 'pName': data.pName, 'cName': data.cName },function(err,doc){
					if(!err && doc){
						var quantity = parseInt(doc.quantity) + parseInt(data.quantity);
						var price = ((parseInt(doc.price) + parseInt(data.price))/2);
						price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
						var total = parseFloat(Math.round(quantity * price * 100) / 100).toFixed(2);
						var lastUpdate = new Date();
						db.Report.update({ 'pName': data.pName, 'cName': data.cName },{$set:{quantity:quantity,price:price,total:total,lastUpdate:lastUpdate}},function(err,docResult){
							if(!err && docResult)
								callback({'status':'update success'});
							else{
								console.log('error:'+err);
								callback({'status':'update fail'})
							}
						})
					}else{
						data.createDate = new Date();
						data.releaseMark = 0;
						var price = data.price;
						data.total = parseFloat(Math.round(data.quantity * price * 100) / 100).toFixed(2);
						console.log(data)
						new db.Report(data).save(function(err,doc){
							if(!err && doc)
								callback({'status':'success'});
							else{
								console.log('error in save:'+err);
								callback({'status':'fail'});
							}
						})
					}
				})
		
	}
	this.sellSharesFromOrg = function(data,callback){

				storeInRHistory(data,'sell');
				db.Report.findOne({ 'pName': data.pName, 'cName': data.cName},function(err,doc){
					if(!err && doc){
					 	var quantity = parseInt(doc.quantity) - parseInt(data.quantity);
						if(quantity >= 0){
							/*var price = parseInt(doc.price)+parseInt(data.price);
							console.log('price -- 1:'+price);
							price =parseFloat(price / 2) ;
							console.log('price -- 2:'+price);
							price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
							console.log('price -- 3:'+price)*/
							var total = parseFloat(Math.round(quantity * doc.price * 100) / 100).toFixed(2);
							// doc.lastUpdate = new Date();
							console.log('quantity:'+quantity+'\ntotal:'+total)
							console.log('------------------\n'+JSON.stringify(doc))
							var releaseMark = doc.releaseMark + ((data.quantity * data.price) - (data.quantity * doc.price))
							db.Report.update({ '_id':doc._id },{$set:{ 'quantity':quantity ,'total':total ,releaseMark:releaseMark ,'lastUpdate':new Date()}},function(err,docResult){
								if(!err && docResult){
									callback({'status':'update success'});
								}
								else{
									console.log('error >>> :'+err);
									callback({'status':'update fail'})
								}
							})
						}else{
							console.log('error'+err)
							callback({'status':'dont have enough share to sell'});
						}
						
					}else{
						console.log('something here >>>>'+err);
						callback({'status':'dont have enough shares to sell'});
					}
				})
	
	}
	function getPortfolioById(pId,callback){
		db.Portfolio.findOne({ '_id' : pId },{'__v':0,'createDate':0}).exec(function(err,pData){
			if(!err && pData){
				console.log('>> Portfolio data >>'+pData);
				var pDataNew = {};
				pDataNew.pId = pId;
				pDataNew.pName = pData.pName;
				callback(pDataNew);
			}
			else{
				console.log('error while getting companyData:'+err);
				callback({});
			}
		})
	}
	function getCompanyById(cName,callback){
		db.CompanyList.findOne({ 'SYMBOL' : cName }).exec(function(err,companyData){
			if(!err && companyData){
				var cDataNew = {};
				cDataNew.cId = companyData._id;
				cDataNew.cName = companyData.cName;
				console.log('>> company data >>'+cDataNew);
				callback(cDataNew);
			}
			else{
				console.log('error while getting companyData:'+err);
				callback({});
			}
		})
	}
	function storeInRHistory(data,buyOrSale){
		new db.RHistory({
		      "pName" : data.pName,
		      "cName" : data.cName,
		      "quantity" : data.quantity,
		      "price" : data.price,
		      "buyOrSale" : buyOrSale,
		      "createDate" : new Date()
		  }).save(function(err,doc){
		  	if(!err && doc)
		  		console.log('stored in RHistory');
		  	else
		  		console.log('unable to store data');
		  })
	}
	this.getReports = function(data,callback){
			var query = {"pName" : data.pName}
			db.Report.find(query).sort({lastUpdate:-1}).exec(function(err,reports){
				if(!err && reports.length){
					var j=0;var reportsCon =[];
					var n = reports.length;
					function rLoop(j){
						var report = reports[j];
						db.CompanyList.findOne({SYMBOL:report.cName},function(err,companyDetails){
							if(!err && companyDetails){
								var rp = {};
								rp.cName = report.cName;
								rp.pName = report.pName;
								rp.quantity = report.quantity;
								rp.price = report.price;
								rp.total = report.total;
								rp.rMark = report.releaseMark;
								if(companyDetails.CLOSE !== undefined)
									cmp = companyDetails.CLOSE;
								else
									cmp = 0;
								rp.cmp = cmp;
								console.log(cmp + " --- " + report.quantity + " --- " + report.total)
								rp.pl = (cmp * report.quantity) - report.total;
								reportsCon.push(rp);
								j++;
								if(j>=n){
									callback(reportsCon)
								}else{
									rLoop(j)
								}
							}else{
								j++;
								if(j>=n){
									callback(reportsCon)
								}else{
									rLoop(j)
								}
							}
						})
					}rLoop(j)
				}else{
					console.log("no reports found")
					callback({})
				}
			})
	}
	this.getCmp = function(query,callback){
		db.Company.findOne(query,{_id:0,CMP:1},function(err,companyDetails){
			if(!err && companyDetails){
				callback(companyDetails)
			}else{
				callback({})
			}
		})
	}
	this.getCompanyList = function(data,callback){
		var companies = [];
		if(data.type == "all"){
			db.CompanyList.find({},{_id:0,SYMBOL:1},function(err,companiesList){
				if(!err && companiesList){
					var i=0,n=companiesList.length;
					function cLoop(i){
						companies.push(companiesList[i].SYMBOL);
						i++;
						if(i>=n)
							callback(companies)
						else
							cLoop(i);
							
					}cLoop(i)
				}else{
					callback([])
				}
			})
		}else{
			db.Report.find({"pDetails.pId":data.pId},{_id:0,"cDetails.cName":1},function(err,companiesList){
				if(!err && companiesList){
					console.log(companiesList)
					var i=0,n=companiesList.length;
					function cLoop(i){
						companies.push(companiesList[i].cDetails.cName);
						i++;
						if(i>=n)
							callback(companies)
						else
							cLoop(i);
							
					}cLoop(i)
				}else{
					callback([])
				}
			})
		}
	}
}
module.exports.reportModule = reportModule;