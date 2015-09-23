
function reportModule(db){
	// var common = new commonActions(db);
var async = require('async')
	function addBasicBuyInfo(data,callback){
		storeInRHistory(data,'buy');
		db.Report.findOne({ 'pName': data.pName, 'cName': data.cName },function(err,doc){
			if(!err && doc){
				var quantity = parseInt(doc.quantity) + parseInt(data.quantity);
				var currentTotal = parseInt(data.quantity) * parseInt(data.price)
				currentTotal = parseFloat(Math.round(currentTotal * 100) / 100).toFixed(2);
				var total = parseFloat(doc.total) + parseFloat(currentTotal)
				//var price = total / quantity;

				var price = parseFloat(Math.round((total / quantity) * 100) /100).toFixed(2);
				//var total = parseFloat(Math.round(quantity * price * 100) / 100).toFixed(2);
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

	// addBuyToPortfolio("djf",function(){

	// })

	function addBuyToPortfolio(data,callback){

		var cDate = new Date()
		var dateString = cDate.toJSON().slice(0, 10)

		db.portFolioBuyInfo.find({pName : data.pName,segment:data.segment,'$where': 'this.date.toJSON().slice(0, 10) == "'+dateString+'"' },function(err,result){
			if(!err && result.length>0){
				console.log('result '+result[0]._id);
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				var finalTotal = parseFloat(total) + parseFloat(result[0].buyValue);
				console.log('finalTotal '+finalTotal)
				db.portFolioBuyInfo.update({_id:result[0]._id},{buyValue : finalTotal },function(err,updated){
					if(!err && updated){
						console.log('updated success')
						callback()
					}
				})
			}else{
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				//var finalTotal = total + buyData.buyValue;
				new db.portFolioBuyInfo({pName : data.pName,segment:data.segment,buyValue : total, date : new Date()}).save(function(err,saved){
					if(!err && saved){
						callback()
					}
				})
			}	
		})
	}

	function exFunction(callback){
		var d = new Date()
		var yesterday = new Date(new Date() - 24*60*60*1000)
		var nextday = new Date(yesterday - 24*60*60*1000)
		//var yesterday = d.setDate(d.getDate() - 1);;
		//console.log('yesterday date '+nextday+' today '+d)
		// new db.portFolioBalances({pName : "Nicobar Capital" , openBal : 20000, closeBal : 28000, date: nextday}).save(function(err,inserted){
		// 			if(!err && inserted){
		// 				callback()
		// 			}
		// }
		db.portFolioBalances.find({ "date": {'$gte': fromDate, '$lte' : toDate}},function(err,result){
			if(!err && result){
				console.log('result '+result+' JSON.stringify'+JSON.stringify(result))
			}
		})
	}

	// exFunction(function(){
	// 	console.log('exFunction completed')
	// })

	function addBuyToBalances(data,callback){
		var cDate = new Date()
		var dateString = cDate.toJSON().slice(0, 10)

		db.portFolioBalances.find({pName : data.pName,segment:data.segment,'$where': 'this.date.toJSON().slice(0, 10) == "'+dateString+'"' },function(err,result){
			if(!err && result.length>0){
				//console.log('result '+result[0]._id);
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				var totalOpenBal = (parseFloat(Math.round(result[0].closeBal)).toFixed(2) - total);
				db.portFolioBalances.update({_id:result[0]._id},{closeBal : totalOpenBal },function(err,updated){
					if(!err && updated){
						//console.log('updated success')
						callback()
					}
				})
			}else{
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				//var finalTotal = total + buyData.buyValue;
				db.portFolioBalances.find({pName : data.pName,segment:data.segment}).sort({date:-1}).limit(1).exec(function(err,docs){
					if(!err && docs.length>0){
						console.log('closeBal '+docs[0].closeBal)
						new db.portFolioBalances({pName : data.pName ,segment:data.segment, openBal : docs[0].closeBal, closeBal : docs[0].closeBal, date: new Date()}).save(function(err,inserted){
							if(!err && inserted){
								console.log('inserted '+inserted+' JSON '+JSON.stringify(inserted))
								var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
								var totalOpenBal = (parseFloat(Math.round(docs[0].closeBal)).toFixed(2) - total);
								db.portFolioBalances.update({_id:inserted._id},{closeBal : totalOpenBal },function(err,updated){
									if(!err && updated){
										//console.log('updated success')
										callback()
									}
								})
							}
						})						
					}else{
						db.portFolio.find({pName : data.pName },function(err,amountInfo){
							if(!err && amountInfo){
								new db.portFolioBalances({pName : data.pName ,segment:data.segment, openBal : amountInfo[0].capital, closeBal : amountInfo[0].capital, date: new Date()}).save(function(err,inserted){
									if(!err && inserted){
										var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
										var totalOpenBal = (parseFloat(Math.round(amountInfo[0].capital)).toFixed(2) - total);
										db.portFolioBalances.update({_id:inserted._id},{closeBal : totalOpenBal },function(err,updated){
											if(!err && updated){
												//console.log('updated success')
												callback()
											}
										})
										//callback()
									}
								})
							}
						})
					}
				})
			}	
		})
	}

	function updatePortfolioBalances(data,callback){
		var cDate = new Date()
		var dateString = cDate.toJSON().slice(0, 10)

		db.portFolioBalances.find({pName : data.pName,segment:data.segment,'$where': 'this.date.toJSON().slice(0, 10) == "'+dateString+'"' },function(err,result){
			if(!err && result.length>0){
				//console.log('result '+result[0]._id);
				//var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				if(data.cashType === "outflow"){
					var totalOpenBal = parseFloat(result[0].closeBal) - parseFloat(data.amount);
				}else{
					var totalOpenBal = parseFloat(result[0].closeBal) + parseFloat(data.amount);
				}
				db.portFolioBalances.update({_id:result[0]._id},{closeBal : totalOpenBal },function(err,updated){
					if(!err && updated){
						//console.log('updated success')
						callback()
					}
				})
			}else{
				//var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				//var finalTotal = total + buyData.buyValue;
				db.portFolioBalances.find({pName : data.pName,segment:data.segment}).sort({date:-1}).limit(1).exec(function(err,docs){
					if(!err && docs.length>0){
						console.log('closeBal '+docs[0].closeBal)
						new db.portFolioBalances({pName : data.pName ,segment:data.segment, openBal : docs[0].closeBal, closeBal : docs[0].closeBal, date: new Date()}).save(function(err,inserted){
							if(!err && inserted){
								console.log('inserted '+inserted+' JSON '+JSON.stringify(inserted))
								if(data.cashType === "outflow"){
									var totalOpenBal = parseFloat(docs[0].closeBal) - parseFloat(data.amount);
								}else{
									var totalOpenBal = parseFloat(docs[0].closeBal) + parseFloat(data.amount);
								}
								// var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
								// var totalOpenBal = (parseFloat(Math.round(docs[0].closeBal)).toFixed(2) - total);
								db.portFolioBalances.update({_id:inserted._id},{closeBal : totalOpenBal },function(err,updated){
									if(!err && updated){
										//console.log('updated success')
										callback()
									}
								})
							}
						})						
					}else{
						db.portFolio.find({pName : data.pName },function(err,amountInfo){
							if(!err && amountInfo){
								new db.portFolioBalances({pName : data.pName ,segment:data.segment, openBal : amountInfo[0].capital, closeBal : amountInfo[0].capital, date: new Date()}).save(function(err,inserted){
									if(!err && inserted){
										if(data.cashType === "outflow"){
											var totalOpenBal = parseFloat(amountInfo[0].capital) - parseFloat(data.amount);
										}else{
											var totalOpenBal = parseFloat(amountInfo[0].capital) + parseFloat(data.amount);
										}
								     	db.portFolioBalances.update({_id:inserted._id},{closeBal : totalOpenBal },function(err,updated){
											if(!err && updated){
												//console.log('updated success')
												callback()
											}
										})
										//callback()
									}
								})
							}
						})
					}
				})
			}	
		})
	}

	this.addExtraCash = function(data,callback){
		var colName = "";
		data.segment = "Cash"

  //   	updatePortfolioBalances(data,function(dividend){
		// 	console.log('dividend added to balances '+dividend)
		// })
		if(data.cashType === "dividend"){
			  addChangesToCash(data.pName,data.amount,"add",function(info){})
			colName = "portFolioDividend";
		}else if(data.cashType === "inflow"){
			addChangesToCash(data.pName,data.amount,"add",function(info){})
			colName = "portFolioCashInFlow";
		}else if(data.cashType === "outflow"){
    		addChangesToCash(data.pName,data.amount,"subtract",function(info){})
			colName = "portFolioCashOutFlow";
		}
		var cashTypeData = {
			"pName" : data.pName,
			"value" : data.amount,
			"date" : new Date()
		}
		new db[colName](cashTypeData).save(function(err,cashTypeDataR){
			if(!err && cashTypeDataR){
				callback(null,cashTypeDataR)
			}else{
				callback("error in saving",{})
			}
		})
	}

	function addChangesToCash(pName,amount,type,callback){
		var updateQuery = {}
		if(type == "subtract"){
			updateQuery.capital = -amount;
		}else{
			updateQuery.capital = amount
		}
		db.portFolio.update({pName : pName},{$inc : updateQuery},function(err,updated){
			if(!err && updated){
				callback()
			}
		})
		
		//console.log('data '+data+' stringify '+JSON.stringify(data))
	}

	this.buySharesFromOrg = function(data,maincallback){
		async.parallel([
			function(callback1){
				addBasicBuyInfo(data,function(result){
					status = result;
					callback1()
				})
		    },function(callback1){
		    	addBuyToPortfolio(data,function(info){
		    		callback1()
		    	})
			},function(callback1){
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);

		    	addChangesToCash(data.pName,total,"subtract",function(info){
		    		callback1()
		    	})
			}],
			function(err,result){
				maincallback(status)
				console.log('buy success '+status)
			}
		)
		// console.log(JSON.stringify(data))
		// {"pId":"","rTId":"55e7d548bf3390c511fbeaf8","cId":"55e810a7c49b68c812b7f780","quantity":"100","price":"15"}

	}

	function addBasicSellInfo(data,callback){
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

	function addSellToPortfolio(data,callback){
		var cDate = new Date()
		var dateString = cDate.toJSON().slice(0, 10)

		db.portFolioSaleInfo.find({pName : data.pName,segment:data.segment,'$where': 'this.date.toJSON().slice(0, 10) == "'+dateString+'"' },function(err,result){
			if(!err && result.length>0){
				console.log('result '+result[0]._id);
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				var finalTotal = parseFloat(total) + parseFloat(result[0].saleValue);
				console.log('finalTotal '+finalTotal)
				db.portFolioSaleInfo.update({_id:result[0]._id},{saleValue : finalTotal },function(err,updated){
					if(!err && updated){
						console.log('updated success')
						callback()
					}
				})
			}else{
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				//var finalTotal = total + buyData.saleValue;
				new db.portFolioSaleInfo({pName : data.pName,segment:data.segment,saleValue : total, date : new Date()}).save(function(err,saved){
					if(!err && saved){
						callback()
					}
				})
			}	
		})
	}

	function addSellToBalances(data,callback){
		var cDate = new Date()
		var dateString = cDate.toJSON().slice(0, 10)

		db.portFolioBalances.find({pName : data.pName,segment:data.segment,'$where': 'this.date.toJSON().slice(0, 10) == "'+dateString+'"' },function(err,result){
			if(!err && result.length>0){
				//console.log('result '+result[0]._id);
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				var totalOpenBal = parseFloat(result[0].closeBal) + parseFloat(total);
				db.portFolioBalances.update({_id:result[0]._id},{closeBal : totalOpenBal },function(err,updated){
					if(!err && updated){
						//console.log('updated success')
						callback()
					}
				})
			}else{
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
				//var finalTotal = total + buyData.buyValue;
				db.portFolioBalances.find({pName : data.pName,segment:data.segment}).sort({date:-1}).limit(1).exec(function(err,docs){
					if(!err && docs.length>0){
						console.log('closeBal '+docs[0].closeBal)
						new db.portFolioBalances({pName : data.pName ,segment:data.segment, openBal : docs[0].closeBal, closeBal : docs[0].closeBal, date: new Date()}).save(function(err,inserted){
							if(!err && inserted){
								console.log('inserted '+inserted+' JSON '+JSON.stringify(inserted))
								var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
								var totalOpenBal = parseFloat(docs[0].closeBal) + parseFloat(total);
								db.portFolioBalances.update({_id:inserted._id},{closeBal : totalOpenBal },function(err,updated){
									if(!err && updated){
										//console.log('updated success')
										callback()
									}
								})
							}
						})						
					}else{
						db.portFolio.find({pName : data.pName },function(err,amountInfo){
							if(!err && amountInfo){
								new db.portFolioBalances({pName : data.pName ,segment:data.segment, openBal : amountInfo[0].capital, closeBal : amountInfo[0].capital, date: new Date()}).save(function(err,inserted){
									if(!err && inserted){
										var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
										var totalOpenBal = parseFloat(amountInfo[0].capital) + parseFloat(total);
										db.portFolioBalances.update({_id:inserted._id},{closeBal : totalOpenBal },function(err,updated){
											if(!err && updated){
												//console.log('updated success')
												callback()
											}
										})
										//callback()
									}
								})
							}
						})
					}
				})
			}	
		})
	}

	this.sellSharesFromOrg = function(data,maincallback){
		async.parallel([
			function(callback1){
				addBasicSellInfo(data,function(result){
					status = result;
					callback1()
				})
		    },function(callback1){
		    	addSellToPortfolio(data,function(info){
		    		callback1()
		    	})
			},function(callback1){
				var total = parseFloat(Math.round(data.quantity * data.price * 100) / 100).toFixed(2);
		    	addChangesToCash(data.pName,total,"add",function(info){
		    		callback1()
		    	})
			}],
			function(err,result){
				maincallback(status)
				console.log('buy success '+status)
			}
		)	
	}

	function getPortfolioById(pId,callback){
		db.portFolio.findOne({ '_id' : pId },{'__v':0,'createDate':0}).exec(function(err,pData){
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
			var query = {"pName" : data.pName,segment:data.segment}
			db.Report.find(query).sort({lastUpdate:-1}).exec(function(err,reports){
				if(!err && reports.length){
					var j=0;var reportsCon =[];
					var n = reports.length;
					function rLoop(j){
						var report = reports[j];
						console.log('cName '+report.cName)
						db.CompanyList.findOne({"cList.SYMBOL":report.cName},function(err,companyDetails){
							//console.log('companyDetails '+companyDetails.length)
							if(!err && companyDetails){
								var rp = {};
								rp.cName = report.cName;
								rp.pName = report.pName;
								rp.quantity = report.quantity;
								rp.price = report.price;
								rp.total = report.total;
								rp.rMark = report.releaseMark;
								console.log('companyDetails length '+companyDetails.cList.length)
								for(var i = 0 ; i<companyDetails.cList.length ; i++){
									if(companyDetails.cList[i].SYMBOL === report.cName){
										if(companyDetails.cList[i].CLOSE !== undefined)
											cmp = companyDetails.cList[i].CLOSE;
										else
											cmp = 0;	
									}
									//console.log('companyDetails '+companyDetails.cList[i].SYMBOL)
								}

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
		console.log('getCompanyList socket called ')
		var companies = [];
		if(data.type == "all"){
			db.CompanyList.find({},function(err,companiesList){
				console.log('companiesList '+companiesList[0].cList.length)
				if(!err && companiesList.length>0){
					var i=0,n=companiesList[0].cList.length;
					console.log('companies list '+n)
					console.log('company name '+companiesList[0].cList[1].SYMBOL)
					function cLoop(i){
						companies.push(companiesList[0].cList[i].SYMBOL);
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
			console.log(data);
			console.log(" -------------------------------------- ")
			db.Report.find({"pName":data.pName},{_id:0,cName:1},function(err,companiesList){
				if(!err && companiesList.length>0){
					console.log(companiesList)
					var i=0,n=companiesList.length;
					function cLoop(i){
						console.log("*******************************")
						console.log(companiesList[i]);
						companies.push(companiesList[i].cName);
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
	this.getPortfolios = function(data,callback){
		db.portFolio.find({},function(err,PortfolioList){
			if(!err && PortfolioList.length){
				callback(PortfolioList)
			}else{
				callback([])
			}
		})
	}
	this.getPL = function(data,callback){
		var segment = data.segment;
		var pName = data.pName;
		var from = getFromDate(data.from),to = getToDate(data.to);
		db.portFolioBalances.find({date:{$gte:from,$lt:to},pName:pName})
		.sort({date:1})
		.exec(function(err,rows){
			var tot = 0;
			if(!err && rows.length){
				var openBal = rows[0].openBal;
				var closeBal = rows[rows.length - 1].closeBal;
				var pl = closeBal - openBal;
				callback({pl:pl})
			}else{
				console.log(" something happening " + err + " === " + rows)
				callback({pl:0})
			}
		})
	}
	this.getPLOld = function(data,callback){
		var closingValue,cash,purchases,sales,openingValue,dividend,inflow,outflow;
		var segment = data.segment;
		var pName = data.pName;
		var from = getFromDate(data.from),to = getToDate(data.to);
		function getPurchases(sCallback){
			console.log("in purchases ........................")
			if(segment === ""){
				getBuyDataByRT("Equity",function(rData){
					purchases = parseInt(rData);
					getBuyDataByRT("Futures",function(rData){
						purchases += parseInt(rData);
						getBuyDataByRT("Commodities",function(rData){
							purchases += parseInt(rData);
							getBuyDataByRT("Mutual Funds",function(rData){
								purchases += parseInt(rData);
								sCallback(getDivInOut)
							})
						})
					})
				})
			}else{
				getBuyDataByRT(segment,function(rData){
					purchases = parseInt(rData);
					sCallback(getDivInOut)
				})
			}
		}
		function getDivInOutVal(dbName,dioCallback){
			db[dbName].find({date:{$gte:from,$lt:to},pName:pName})
			.sort({date:1})
			.exec(function(err,rows){
				var tot = 0;
				if(!err && rows.length){
					for(var i=0;i<rows.length;i++){
						tot += parseInt(rows[i].value);
						console.log(i + " ==== " + rows.length)
						if(i >= rows.length - 1)
							dioCallback(tot)
					}
				}else{
					console.log(" something happening " + err + " === " + rows)
					dioCallback(tot)
				}
			})
		}
		function getDivInOut(){
			getDivInOutVal("portFolioDividend",function(rData){
				dividend = rData;
				getDivInOutVal("portFolioCashInFlow",function(rData){
					inflow = rData;
					getDivInOutVal("portFolioCashOutFlow",function(rData){
						outflow = rData;
						calcPL();
					})
				})
			})
		}
		function calcPL(){
			var PL = parseInt(closingValue) + parseInt(cash) + parseInt(purchases) - parseInt(sales) - parseInt(openingValue);// + parseInt(dividend) + parseInt(outflow) - parseInt(inflow);
			 console.log(parseInt(closingValue) + " == " + parseInt(cash) + " == " + parseInt(purchases) + " == " + parseInt(sales) + " == " + parseInt(openingValue) + " == " + parseInt(dividend) + " == " + parseInt(outflow) + " == " +parseInt(inflow));
			
			console.log(" Profit / Loss value is ----------");
			console.log(" ********************************************* ")
			console.log(PL)
			console.log(" ********************************************* ")
			callback({pl:PL})
		}
		function getSales(sCallback){
			console.log("in sales....................")
			if(segment === ""){
				getSaleDataByRT("Equity",function(rData){
					sales = parseInt(rData);
					getSaleDataByRT("Futures",function(rData){
						sales += parseInt(rData);
						getSaleDataByRT("Commodities",function(rData){
							sales += parseInt(rData);
							getSaleDataByRT("Mutual Funds",function(rData){
								sales += parseInt(rData);
								sCallback()
							})
						})
					})
				})
			}else{
				getSaleDataByRT(segment,function(rData){
					sales = parseInt(rData);
					sCallback()
				})
			}
		}
		function getBuyDataByRT(segmentVal,rTcallback){
			db.portFolioBuyInfo.find({date:{$gte:from,$lt:to},pName:pName,segment:segmentVal})
			.sort({date:1})
			.exec(function(err,rows){
				var tot = 0;
				if(!err && rows.length){
					for(var i=0;i<rows.length;i++){
						tot += parseInt(rows[i].buyValue);
						console.log(i + " ==== " + rows.length)
						if(i >= rows.length - 1)
							rTcallback(tot)
					}
				}else{
					console.log(" something happening " + err + " === " + rows)
					rTcallback(tot)
				}
			})
		}
		function getSaleDataByRT(segmentVal,rTcallback){
			db.portFolioSaleInfo.find({date:{$gte:from,$lt:to},pName:pName,segment:segmentVal})
			.sort({date:1})
			.exec(function(err,rows){
				var tot = 0;
				if(!err && rows.length){
					for(var i=0;i<rows.length;i++){
						tot += parseInt(rows[i].saleValue);
						if(i >= rows.length - 1)
							rTcallback(tot)
					}
				}else{
					console.log(" something happening " + err + " === " + rows)
					rTcallback(tot)
				}
			})
		}
		function getCash(){
			console.log("in get cash")
			getDataByRT("Cash",function(rData){
				/*closingValue += rData.closeBal;
				openingValue += rData.openBal;*/
				cash = parseInt(rData.closeBal) - parseInt(rData.openBal);
				getPurchases(getSales)
			})
		}
		function getClosingValue(callback){
			if(segment === ""){
				getDataByRT("Equity",function(rData){
					closingValue = parseInt(rData.closeBal);
					openingValue = parseInt(rData.openBal);
					getDataByRT("Futures",function(rData){
						closingValue += parseInt(rData.closeBal);
						openingValue += parseInt(rData.openBal);
						getDataByRT("Commodities",function(rData){
							closingValue += parseInt(rData.closeBal);
							openingValue += parseInt(rData.openBal);
							getDataByRT("Mutual Funds",function(rData){
								closingValue += parseInt(rData.closeBal);
								openingValue += parseInt(rData.openBal);
								callback()
							})
						})
					})
				})
			}else{
				getDataByRT(segment,function(rData){
					closingValue = parseInt(rData.closeBal);
					openingValue = parseInt(rData.openBal);
					callback()
				})
			}
			
		}
		function getDataByRT(segmentVal,rTcallback){
			console.log(segmentVal + " --------------------------> ")
			db.portFolioBalances.find({date:{$gte:from,$lt:to},pName:pName,segment:segmentVal})
			.sort({date:1})
			.exec(function(err,rows){
				if(!err && rows.length){
					console.log(rows)
					console.log(" ************************************* ")
					var rData = {};
					if(rows.length == 1){
						rData.openBal = rows[0].openBal;
						rData.closeBal = rows[0].closeBal;
					}else{
						rData.openBal = rows[0].openBal;
						rData.closeBal = rows[rows.length-1].closeBal;
					}
					rTcallback(rData)
				}else if(err){
					console.log("error in getting data " + err)
				}else{
					db.portFolioBalances.find({date:{$lte:from},pName:pName,segment:segment})
					.sort({date:-1})
					.limit(1)
					.exec(function(err,rows){
						if(!err && rows.length){
							var rData = {};
							rData.openBal = rows[0].closeBal;
							rData.closeBal = rows[0].closeBal;
							rTcallback(rData)
						}else if(err){
							console.log("error in getting data " + err)
						}else{
							console.log("no recs found ...")
						}
					})
				}
			})
		}
		getClosingValue(getCash);
	}

	function getFromDate(fromDate){
		var today = new Date(fromDate);
	    var dd = today.getDate();
	    var mm = today.getMonth()+1;
	    var yyyy = today.getFullYear();
	    today = mm+'/'+dd+'/'+yyyy;
	    return new Date(today); 
	}
	function getToDate(toDate){
		var today = new Date(toDate);
	    var dd = today.getDate()+1;
	    var mm = today.getMonth()+1;
	    var yyyy = today.getFullYear();
	    today = mm+'/'+dd+'/'+yyyy;
	    return new Date(today); 
	}
	function getPreviousDate(toDate,callback){
		var today = new Date(toDate);
	    var dd = today.getDate()-1;
	    var mm = today.getMonth()+1;
	    var yyyy = today.getFullYear();
	    today = mm+'/'+dd+'/'+yyyy;
	    callback(new Date(today)) ; 
	}
}
module.exports.reportModule = reportModule;