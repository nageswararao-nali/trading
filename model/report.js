function reportModule(db){
	// var common = new commonActions(db);
	this.buySharesFromOrg = function(data,callback){
		// console.log(JSON.stringify(data))
		// {"pId":"","rTId":"55e7d548bf3390c511fbeaf8","cId":"55e810a7c49b68c812b7f780","quantity":"100","price":"15"}
		getPortfolioById(data.pId,function(pData){
			getCompanyById(data.cId,function(cData){
				data.pDetails = pData;
				data.cDetails = cData;
				delete data.pId;
				delete data.cId;
				delete data.rTId;
				storeInRHistory(data,'buy');
				db.Report.findOne({ 'pDetails._id': data.pDetails._id, 'cDetails._id': data.cDetails._id },function(err,doc){
					if(!err && doc){
						doc.quantity = doc.quantity + data.quantity;
						var price = ((doc.price + data.price)/2);
						doc.price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
						doc.total = parseFloat(Math.round(doc.quantity * price * 100) / 100).toFixed(2);
						doc.lastUpdate = new Date();
						delete doc._id;
						db.Report.update({ '_id':doc._id },function(err,docResult){
							if(!err && docResult)
								callback({'status':'update success'});
							else{
								console.log('error:'+err);
								callback({'status':'update fail'})
							}
						})
					}else{
						console.log('something here'+err);
						data.createDate = new Date();
						var price = data.price;
						data.total = parseFloat(Math.round(data.quantity * price * 100) / 100).toFixed(2);
						console.log("savingggggggggggggggggggggg")
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
			})
		})
		
		
	}
	this.sellSharesFromOrg = function(data,callback){
		getPortfolioById(data.pId,function(pData){
			getCompanyById(data.cId,function(cData){
				data.pDetails = pData;
				data.cDetails = cData;
				delete data.pId;
				delete data.cId;
				delete data.rTId;
				storeInRHistory(data,'sell');
				db.Report.findOne({ 'pDetails._id': data.pDetails._id, 'cDetails._id': data.cDetails._id },function(err,doc){
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
							db.Report.update({ '_id':doc._id },{$set:{ 'quantity':quantity ,'total':total ,'lastUpdate':new Date()}},function(err,docResult){
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
			})
		})
		
	}
	function getPortfolioById(pId,callback){
		db.Portfolio.findOne({ '_id' : pId },{'__v':0,'createDate':0}).exec(function(err,pData){
			if(!err && pData){
				console.log('>> Portfolio data >>'+pData);
				callback(pData);
			}
			else{
				console.log('error while getting companyData:'+err);
				callback({});
			}
		})
	}
	function getCompanyById(cId,callback){
		db.Company.findOne({ '_id' : cId },{'__v':0,CMP:0,'createDate':0}).exec(function(err,companyData){
			if(!err && companyData){
				console.log('>> company data >>'+companyData);
				callback(companyData);
			}
			else{
				console.log('error while getting companyData:'+err);
				callback({});
			}
		})
	}
	function storeInRHistory(data,buyOrSale){
		new db.RHistory({
		      "pDetails" : data.pDetails,
		      "cDetails" : data.cDetails,
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
		getPortfolioById(data.pId,function(pData){
			var query = {"pDetails._id" : pData._id}
			db.Report.find(query).sort({lastUpdate:-1}).exec(function(err,reports){
				if(!err && reports.length){
					var j=0;var reportsCon =[];
					var n = reports.length;
					function rLoop(j){
						var report = reports[j];
						db.Company.findOne({cName:report.cDetails.cName},function(err,companyDetails){
							if(!err && companyDetails){
								var rp = {};
								rp.cDetails = report.cDetails;
								rp.pDetails = report.pDetails;
								rp.quantity = report.quantity;
								rp.price = report.price;
								rp.total = report.total;
								rp.total = report.total;
								rp.cmp = companyDetails.CMP;
								rp.pl = (companyDetails.CMP * report.quantity) - report.total;
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
		})
	}
}
module.exports.reportModule = reportModule;