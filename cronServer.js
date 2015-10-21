var request = require('request');
var fs = require('fs');
var unzip = require('unzip');
var cheerio = require('cheerio');
var parse = require('csv-parse');
var async = require('async');
var db = require("./config/db")

/*var date = new Date();
var ydate = new Date();
ydate.setDate(ydate.getDate() - 1);
var day = ydate.getDate();
var month = date.getMonth();
var year = date.getFullYear();
var monthNames = [ "Jan", "Feb", "Mar", "Aprl", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
month = monthNames[month];
month = month.toUpperCase();
if (day.toString().length == 1) {
    day = "0" + day;
}
console.log(day + " -- " + month + " -- " + year)
var dZipFileName = "cm"+day+month+year+"bhav.csv.zip";
var dZipFilePath = "http://www.nseindia.com/content/historical/EQUITIES/"+year+"/"+month+"/"+dZipFileName;
var dPath = "assets/files/"+dZipFileName;
var headers= { 
           	"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11",
           	"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8",
           }
request.get({uri:dZipFilePath,headers:headers}).pipe(fs.createWriteStream(dPath))
setInterval(function(){
	fs.createReadStream(dPath).pipe(unzip.Extract({ path: 'assets/ofiles/' }));
},10000)*/
var futuresReports;
var headers= { 
           	"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11",
           	"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8",
           }

function getUrl(urlCallback){
	var url = "http://www.nseindia.com/products/dynaContent/equities/equities/htms/CM_homepage.htm";
	request.get({uri:url,headers:headers},function(error,response,content){
		if(!error && response.statusCode == 200){
			// console.log(content)
			$ = cheerio.load(content);
			var i=1;
			function findLoop(i){
				var fileUrl = "http://www.nseindia.com/"+$(".report").eq(1).find("ul").eq(i).find("li a").attr("href");
				var fileName = fileUrl.split("/").pop();
				var fileNameExt = fileName.split(".")[1];
				if(fileNameExt === "csv"){
					console.log(i)
					console.log($(".report").eq(1).find("ul").eq(i).find("li a").attr("href"))
					urlCallback(fileUrl)
				}else{
					i++;
					findLoop(i);
				}
			}findLoop(i)
		}else{
			console.log("error in request")
			console.log(response)
		}
	})
}
function getFutureCMP(dZipFileName,callback){
	console.log("************************************")
	var monthNames = { "JAN":"01", "FEB":"02", "MAR":"03", "APRL":"04", "MAY":"05", "JUN":"06", "JUL":"07", "AUG":"08", "SEP":"09", "OCT":"10", "NOV":"11", "DEC":"12" };
	var day = dZipFileName.substr(0,4).substr(2,2);
	var month = dZipFileName.substring(4,dZipFileName.indexOf(dZipFileName.substr(-16)));
	var year = dZipFileName.substr(-16).substr(0,4);
	month = monthNames[month]
	var fdate = day+"-"+month+"-"+year;
	console.log(fdate);
	console.log("************************************")
	var futureUrl = "http://www.nseindia.com/ArchieveSearch?h_filetype=fosett&date="+fdate+"&section=FO";
	//var url = "http://www.nseindia.com/products/dynaContent/equities/equities/htms/CM_homepage.htm";
	request.get({uri:futureUrl,headers:headers},function(error,response,content){
		if(!error && response.statusCode == 200){
			// console.log(content)
			$ = cheerio.load(content);
			console.log("future url issssssssssssssss")
			console.log($("a").attr("href"))
			var fileUrl = "http://www.nseindia.com/"+$("a").attr("href");
			var dZipFileName = fileUrl.split("/").pop();
			var dPath = "assets/dailyfutures/"+dZipFileName;
			request.get({uri:fileUrl,headers:headers}).pipe(fs.createWriteStream(dPath))
			setTimeout(function(){
				parseFutureCsvFile('assets/dailyfutures/'+dZipFileName,function(data){
					callback(data)
				})
				// test1('assets/dailyfutures/'+dZipFileName)
			},10000)
			/*var fileName = fileUrl.split("/").pop();
			var fileNameExt = fileName.split(".")[1];
			if(fileNameExt === "csv"){
				console.log("in first")
				urlCallback(fileUrl)
			}else{
				console.log("in second")
				var fileUrl = "http://www.nseindia.com/"+$(".report").eq(1).find("ul").eq(3).find("li a").attr("href");
				urlCallback(fileUrl)
			}*/
		}else{
			console.log("error in request")
			// console.log(response)
			callback([])
		}
	})
}
function parseFutureCsvFile(inputFile,callback){
	// var inputFile='assets/ofiles/cm03SEP2015bhav.csv';
	// var inputFile=csvFilePath;

	var companies = [];
	var header = [];
	var reportData = [];
	var parser = parse({delimiter: ','}, function (err, data) {
		// console.log(err)
		// console.log(data)
	  async.eachSeries(data, function (line, callback) {
	  	console.log("lineeeeeeeeeeeee")
	  	console.log(line)
		var dataObj = {};
	    if(header.length === 0){
	    	header = line;
	    	//console.log(header)
	    	async.eachSeries(header, function (field, headerCallback) {
	    		if(field !== "")
	    			dataObj[field] = "";
	    		headerCallback()
	    	},function(){
	    		callback();
	    	})
	    }else if(line[3] === ""){

	    	callback()
	    }else{
	        header = data[0];
	        //console.log(header)
	        async.eachSeries(header, function (field, headerCallback) {
	            if(field !== "")
	                dataObj[field] = "";
	            headerCallback()
	        },function(){
	            var i=0,isCom=0;
	           
	            // if(isCom){
                async.eachSeries(line, function (fieldValue, headerValCallback) {
                    if(fieldValue !== ""){
                        dataObj[header[i]] = fieldValue;
                    }
                    i++;
                    headerValCallback()
                },function(){
                	// dataObj.lastUpdate = new Date();
                    reportData.push(dataObj)
                    callback();
                })
	            
	        })
	    	
	    }
	  },function(){
		console.log(reportData)
		callback(reportData)
	  })
	})
	// console.log(inputFile)
	fs.createReadStream(inputFile).pipe(parser);
}

function getCMP(callback){
	getUrl(function(dZipFilePath){
		var dZipFileName = dZipFilePath.split("/").pop();
		var dPath = "assets/files/"+dZipFileName;
		getFutureCMP(dZipFileName,function(futuresData){
			console.log("got futures next to get cmp")
			var futuresData = futuresData;
			request.get({uri:dZipFilePath,headers:headers}).pipe(fs.createWriteStream(dPath))
			setTimeout(function(){
				fs.createReadStream(dPath).pipe(unzip.Extract({ path: 'assets/ofiles/' }));
				setTimeout(function(){
					parseCsvFile('assets/ofiles/'+dZipFileName,futuresData);
					// callback function to run closing balance caliculations
					// setTimeout(function(){
					// 	callback()
					// },20000)
				},2000)
			},5000)
		});
		
	})
}
function parseCsvFile(csvFilePath,futuresData){
	// var inputFile='assets/ofiles/cm03SEP2015bhav.csv';
	var futuresData = futuresData;
	var filepath = csvFilePath.split(".");
	filepath.pop();
	var inputFile=filepath.join(".");
	var companies = [];
	var header = [];
	var reportData = [];
	/*db.Company.find({},{_id:0,cName:1},function(err,cNames){
	    if(!err && cNames.length){
	        for(var i=0;i<cNames.length;i++){
	            companies.push(cNames[i].cName);
	        }
	        console.log(companies)
	        fs.createReadStream(inputFile).pipe(parser);
	    }
	})*/
	// fs.createReadStream(inputFile).pipe(parser);
	var parser = parse({delimiter: ','}, function (err, data) {
	  async.eachSeries(data, function (line, callback) {
	    // console.log(line);
	    // console.log("********************8888");
		var dataObj = {};
	    if(header.length === 0){
	    	header = line;
	    	//console.log(header)
	    	async.eachSeries(header, function (field, headerCallback) {
	    		if(field !== "")
	    			dataObj[field] = "";
	    		headerCallback()
	    	},function(){
	    		callback();
	    	})
	    }else{
	        header = data[0];
	        //console.log(header)
	        async.eachSeries(header, function (field, headerCallback) {
	            if(field !== "")
	                dataObj[field] = "";
	            headerCallback()
	        },function(){
	            var i=0,isCom=0;
	            /*if(isCom ==0){
	                if(companies.indexOf(line[0]) > -1)
	                    isCom = 1;
	            }*/
	            // if(isCom){
                async.eachSeries(line, function (fieldValue, headerValCallback) {
                    if(fieldValue !== ""){
                        dataObj[header[i]] = fieldValue;
                    }
                    i++;
                    headerValCallback()
                },function(){
                	// dataObj.lastUpdate = new Date();
                    reportData.push(dataObj)
                    callback();
                })
	            /*}else{
	                callback()
	            }*/
	        })
	    	
	    }
	  },function(){
	    // console.log(reportData)
	  	// console.log("parse completed")
	  	/*async.eachSeries(reportData, function (fieldValue, headerValCallback) {
	        db.CompanyList.update({SYMBOL:fieldValue.SYMBOL},{$set:fieldValue},{upsert:true},function(err,upd){
	        	headerValCallback()
	        })
	    },function(){
	        console.log("cmp updated successfully")
	    })*/
//var yesterday = new Date(new Date() - 24*60*60*1000)
		var cListData = {};
		cListData.cList = reportData;
		cListData.fList = futuresData;
		cListData.createDate = new Date();
		var cListDataQuery = new db.CompanyList(cListData) 
		cListDataQuery.save(function(err,list){
			if(!err && list){
				console.log("cmp updated successfully")	
			}
		})
	  })
	})
	fs.createReadStream(inputFile).pipe(parser);
}

function getCurrentCash(pName,callback){
	db.portFolio.find({pName : pName },function(err,amountInfo){
		if(!err && amountInfo){
			callback(amountInfo[0].capital)
		}
	})
}

function getSharesValue(pName,date,callback){
	var query = {"pName" : pName}
	var dateString = date.toJSON().slice(0, 10)
	var status = {}
	var alltotal = 0
	db.Report.find(query).exec(function(err,reports){
		if(!err && reports.length){
			var j=0;var reportsCon =[];
			var n = reports.length;
			function rLoop(j){
				var report = reports[j];
				console.log('cName '+report.cName)
				db.CompanyList.findOne({'$where': 'this.createDate.toJSON().slice(0, 10) == "'+dateString+'"',"cList.SYMBOL":report.cName},function(err,companyDetails){
					//console.log('companyDetails '+companyDetails.length)
					if(!err && companyDetails){
						var rp = {};
						// rp.cName = report.cName;
						// rp.pName = report.pName;
						// rp.quantity = report.quantity;
						// rp.price = report.price;
						// rp.total = report.total;
						// rp.rMark = report.releaseMark;
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
						console.log('cmp '+cmp+' cName '+report.cName+' and quantity '+report.quantity)


						// rp.cmp = cmp;
						// console.log(cmp + " --- " + report.quantity + " --- " + report.total)
						// rp.pl = (cmp * report.quantity) - report.total;
						var total = parseFloat(Math.round(report.quantity * cmp * 100) / 100).toFixed(2);
						console.log('total '+total)
						alltotal += parseFloat(total);
						console.log('alltotal '+alltotal)
						
						
						j++;
						if(j>=n){
							status.msg = "success"
							status.alltotal = alltotal
							callback(status)
						}else{
							rLoop(j)
						}
					}else{
						j++;
						if(j>=n){
							status.msg = "inconvenient data in CompanyList"
							status.alltotal = alltotal
							callback(status)
						}else{
							rLoop(j)
						}
					}
				})
			}rLoop(j)
		}else{
			console.log("no reports found")
			status.msg = "no records found"
			callback(status)
		}
	})
}

function updateToBalances(pName,date,closingBalance,callback){
	//var cDate = new Date()
	var dateString = date.toJSON().slice(0, 10)

	db.portFolioBalances.find({pName : pName,'$where': 'this.date.toJSON().slice(0, 10) == "'+dateString+'"' },function(err,result){
		if(!err && result.length>0){
			db.portFolioBalances.update({_id:result[0]._id},{closeBal : closingBalance },function(err,updated){
				if(!err && updated){
					//console.log('updated success')
					callback()
				}
			})
		}else{
			db.portFolioBalances.find({pName : pName}).sort({date:-1}).limit(1).exec(function(err,docs){
				if(!err && docs.length>0){
					console.log('closeBal '+docs[0].closeBal)
					new db.portFolioBalances({pName : pName , openBal : docs[0].closeBal, closeBal : docs[0].closeBal, date: date}).save(function(err,inserted){
						if(!err && inserted){
							db.portFolioBalances.update({_id:inserted._id},{closeBal : closingBalance },function(err,updated){
								if(!err && updated){
									//console.log('updated success')
									callback()
								}
							})
						}
					})						
				}else{
					db.portFolio.find({pName : pName },function(err,amountInfo){
						if(!err && amountInfo){
							new db.portFolioBalances({pName : pName , openBal : amountInfo[0].capital, closeBal : amountInfo[0].capital, date: date}).save(function(err,inserted){
								if(!err && inserted){
									db.portFolioBalances.update({_id:inserted._id},{closeBal : closingBalance },function(err,updated){
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

function updateClosingBalance(pName,date,maincallback){
	//process : every day evening execute this function
	// closingBalance = cash + (shares of all companies in portfolio * cmp of that day)
	var cash,sharesValue;
	async.parallel([
		function(callback1){
			getCurrentCash(pName,function(result){
				cash = result
				callback1()
			})
	    },function(callback1){
	    	getSharesValue(pName,date,function(status){
	    		console.log('sharesValue at function async '+status.alltotal)
	    		sharesValue = status.alltotal
	    		msg = status.msg
	    		callback1()
	    	})
		}],
		function(err,result){
			console.log('cash '+cash+' and sharesValue '+sharesValue)
			var closingBalance = parseFloat(cash) + parseFloat(sharesValue);
			var dateString = date.toJSON().slice(0,10);
			
			updateToBalances(pName,date,closingBalance,function(result){
				maincallback(closingBalance,msg)
			})

		}
	)
}

var yesterday = new Date(new Date() - 24*60*60*1000*11)
console.log('yesterday '+yesterday)

// updateClosingBalance("Nicobar Capital",new Date(),function(closingBalance,msg){
// 	console.log('status of updateClosingBalance is '+closingBalance+' message '+msg)
// })
/*runScript();
setInterval(function(){
 runScript()
  
},5 * 60 * 1000);*/
function runScript(){
	console.log(new Date().getHours() + " ======= " + new Date().getMinutes() )
	// if(new Date().getHours() == 18 && new Date().getMinutes() <= 5){
		getCMP(function(){
			db.portFolio.find({},{pName:1,_id:0},function(err,portfolios){
				if(!err && portfolios.length){
					for(var i=0;i<portfolios.length;i++){
					    updateClosingBalance(portfolios[i].pName,new Date(),function(closingBalance,msg){
							console.log('status of updateClosingBalance is '+closingBalance+' message '+msg)
							completePendingTransactions()
						})

					}
				}
			})
		})
	// }
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


function completePendingTransactions(callback){
	//check for present month future sell/buy trasaction with quantity > 0
	//if current date is higher than or equal to expiry date complete the trasaction for every company
	//if buy records present sell them or if sell records present buy them
	var monthNames = ["JAN", "FEB", "MAR", "APRL", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

	var cdate = new Date()
	var cmonth = monthNames[cdate.getMonth()]
	var cday = cdate.getDate()
	console.log('current month '+cmonth+' current date '+cdate.getDate())
	var cnames = [];
	var dateString = cdate.toJSON().slice(0, 10)


	db.Report.find({segment:"Futures",fMonth : cmonth,quantity : {$gt : 0}},function(err,result){
		if(!err && result){
			//console.log('result '+result)
			for(var i = 0 ; i<result.length ; i++){
				cnames.push(result[i].cName)
				console.log('result '+result[i].cName)		
				var cquery = {'$where': 'this.createDate.toJSON().slice(0, 10) == "'+dateString+'"',"fList.UNDERLYING":result[i].cName}
				db.CompanyList.find(cquery,function(err,companyDetails){
					if(!err && companyDetails){
						//console.log('companyDetails '+companyDetails)
						for(var i = 0 ; i<companyDetails[0].fList.length ; i++){
							var exp = "EXPIRY DATE"
							var da = companyDetails[0].fList[i][exp].split('-')								
							if(da[1] === cmonth && da[0] <= cday){
								console.log('contract months  '+da[1])
								if(companyDetails[0].fList[i].UNDERLYING === report.cName){
									var s = "MTM SETTLEMENT PRICE"
									if(companyDetails[0].fList[i][s] !== undefined)
										cmp = companyDetails[0].fList[i][s];
									else
										cmp = 0;	
								}
								var amount = parseFloat(Math.round(result[i].quantity * cmp * 100) / 100).toFixed(2);
								if(result[i].type === "buy"){
									addChangesToCash(result[0].pName,amount,"add",function(err,updated){
										db.Report.update({_id:result[0]._id},{$set : {quantity : 0 , price : 0 , total : 0, type : "sell"}},function(err,reportUpdated){
											callback()
										})
									})
								}else{
									addChangesToCash(result[0].pName,amount,"subtract",function(err,updated){
										db.Report.update({_id:result[0]._id},{$set : {quantity : 0 , price : 0 , total : 0, type : "buy"}},function(err,reportUpdated){
											callback()
										})
									})
								}
								//add final cash to portfolios
								//update report to close transactions
							}
							//console.log('companyDetails '+companyDetails.cList[i].SYMBOL)
						}					
					}
				})		
			}
		}
	})
}
readMFunds()
function readMFunds(){
	var date = new Date();
	var fileUrl = "http://portal.amfiindia.com/spages/NAV0.txt";
	var dPath = "assets/mutualfunds/mutualfunds_"+date.getDate()+"_"+date.getMonth()+".txt";
	request.get({uri:fileUrl}).pipe(fs.createWriteStream(dPath))
	setTimeout(function(){
		parseTxtFile(dPath,function(finalObj){
			// console.log(finalObj)
		})
	},2000)
	
}
function parseTxtFile(dPath,callback){
	var lineArray = fs.readFileSync(dPath).toString().split("\n");
	for(i in lineArray) {
	    //console.log("Line is --------------> " + array[i]);
	}
	var i=0,n=lineArray.length;
	var finalObj = {},s=0,count=0,key,keyValArray=[];
	var valueData = [
			"SID",
			"ISIN Div Payout/ ISIN Growth",
			"ISIN Div Reinvestment",
			"Scheme NAV Name",
			"Net Asset Value",
			"Repurchase Price",
			"Sale Price",
			"Date"
		]
	function lineLoop(i){
		if(lineArray[i].trim() == ""){
			if(s == 0){
				key = keyValArray[0];
				s=1;
			}else{
				console.log(key)
				console.log("*****************************************************")
				console.log(keyValArray)
				finalObj[key] = keyValArray;
				s=0;
			}
			keyValArray = [];
			i++;
			if(i >= n){
				callback(finalObj)
			}else{
				setTimeout(function(){
					lineLoop(i)
				},0)
			}
		}else{
			if(s == 1){
				var lineData = lineArray[i].split(";");
				var lineDataValues = {};
				for(var j=0;j<lineData.length;j++){
					lineDataValues[valueData[j]] = lineData[j];
				}
				keyValArray.push(lineDataValues)
				i++;
				if(i >= n){
					callback(finalObj)
				}else{
					setTimeout(function(){
						lineLoop(i)
					},0)
				}
			}else{
				keyValArray.push(lineArray[i])
				i++;
				if(i >= n){
					callback(finalObj)
				}else{
					setTimeout(function(){
						lineLoop(i)
					},0)
				}
			}
		}
		
	}lineLoop(i)

}