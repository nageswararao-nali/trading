var moment = require('moment-timezone');
function commonActions(db){
	this.isUserExists = function(selectData,callback){
		db.UserData.findOne(selectData,config.errorHandler({callback:function(data){
			processData(data,callback,{})
		},returnWithError:true}))
	}
	this.addPowerToUser = function(selectData,updateData,callback){
		console.log('user selectData '+selectData+' stringify '+JSON.stringify(selectData))
		console.log('userid selectData '+selectData._id)
		console.log('addPowerToUser updateData '+updateData+' stringify '+JSON.stringify(updateData))
		console.log('keys '+JSON.stringify(updateData.powers))
		for(var key in updateData.powers){
			var powerName = key;
			//console.log('updatee kdy '+key)
		}
		var powerValue = updateData.powers[powerName]
		console.log('powerValue '+updateData.powers[powerName])		
		db.UserData.findOne(selectData,function(err,userInfo){
			if(!err && userInfo){
				console.log('userInfo '+userInfo.powers+' stringify '+JSON.stringify(userInfo.powers))
				for(var i = 0 ; i<userInfo.powers.length ; i++){
					if(userInfo.powers[i][powerName]){
		     			var oldPowerValue = userInfo.powers[i][powerName]
		     		}
				}
		     		if(oldPowerValue){
		     			var setpower = "powers."+powerName+""
				   		var setquery = {
				   			appName : selectData.appName,
				   			_id : selectData._id
				   		}
				   		setquery[setpower] = oldPowerValue
				   		var p1 = "powers.$."+powerName+"";
				   		var jsonobject = {};
				   		jsonobject[p1] = ""+powerValue;
				   		//jsonobject.lastLogin = common.getDateTime();
				   		console.log('setpower '+setpower+' stringify '+JSON.stringify(setpower))
						db.UserData.update(setquery,{$set : jsonobject},{multi:true},config.errorHandler({callback:function(data){
							processData(data,callback,{})
						}}))
		     			//console.log('power value '+userInfo.powers[i][bonusInfo[0].bonusPowerName])
		     		}else{
		     			console.log('else condition')
		     			db.UserData.update(selectData,{$addToSet : updateData},{multi:true},config.errorHandler({callback:function(data){
							processData(data,callback,{})
						}}))
		     		}
		     	

			}
		})

	}

	this.addPowerToAllUser = function(selectData,updateData,callback){
     	db.UserData.update(selectData,{$addToSet : updateData},{multi:true},config.errorHandler({callback:function(data){
			processData(data,callback,{})
		}}))
	}
	this.getUserId = function(selectData,callback){
		db.UserData.findOne(selectData,config.errorHandler({callback:function(data){
			processData(data,callback,{returnData:"_id"})
		},returnWithError:true}))
	}
	this.getUserData = function(selectData,callback){
		db.UserData.findOne(selectData,config.errorHandler({callback:function(data){
			getData(data,callback)
		},returnWithError:true}))
	}
	this.getPurchaseInfo = function(selectData,callback){
		db.PurchaseInfo.find(selectData,config.errorHandler({callback:function(data){
			getData(data,callback)
		},returnWithError:true}))
	}
	this.removePurchaseInfo = function(selectData,callback){
		db.PurchaseInfo.remove(selectData,config.errorHandler({callback:function(data){
			getData(data,callback)
		},returnWithError:true}))
	}
	this.updateUserInfo = function(selectData,inputUserData,callback){
		console.log(inputUserData)
		db.UserData.update(selectData,{$set:inputUserData},config.errorHandler({callback:function(data){
			processData(data,callback,{})
		}}))
	}
	this.updatePowersToUser = function(selectData,inputUserData,callback){
		console.log(inputUserData)
		console.log('inputUserData '+selectData+' stringify '+JSON.stringify(selectData))
		db.UserData.update(selectData,{"$set":inputUserData},config.errorHandler({callback:function(data){
			processData(data,callback,{})
		}}))
	}

	this.saveNewUser = function(inputUserData,callback){
		db.UserPowers.find({appName:inputUserData.appName},function(err,powerData){
			if(!err && powerData.length>0){
				inputUserData.powers = powerData[0].powers
				console.log('powerdata '+powerData[0].powers)
				inputUserData.appInstalledDate = getDate();
				new db.UserData(inputUserData).save(config.errorHandler({callback:function(data){
					processData(data,callback,{returnData:"_id"})
				}}))
			}else{
				inputUserData.appInstalledDate = getDate();
				new db.UserData(inputUserData).save(config.errorHandler({callback:function(data){
					processData(data,callback,{returnData:"_id"})
				}}))
			}
		})
	}
	
	this.saveLoginTime = function(inputUserData,callback){
	    //inputUserData["logs.logoutTime"] = "";
	    /*var updateData = {$push:{logs:{loginTime:getDate(),logoutTime:""}}}
	    db.UserLogs.update(inputUserData,updateData,{upsert:true},config.errorHandler({callback:function(data){
	      processData(data,callback,{returnData:"_id"})
	    }}))*/
	    console.log("in ")
	    db.UserLogs.findOne(inputUserData,{"logs":1},config.errorHandler({returnWithError:true,callback:function(data){
	      if(data){
	        getData(data,function(logData){
	          console.log(logData)
	          if(logData.logs.length){
	            var logTimes = logData.logs.pop();
	            console.log(logTimes);
	            if(logTimes.logoutTime !== "" || logTimes.logoutTime !== undefined){
	              var updateData = {$push:{logs:{loginTime:getDate(),logoutTime:""}}}
	              db.UserLogs.update(inputUserData,updateData,{upsert:true},config.errorHandler({callback:function(data){
	                processData(data,callback,{returnData:"_id"})
	              }}))  
	            }else{
	              callback(true)
	            }
	          }
	        })
	        
	      }else{
	        var updateData = {$push:{logs:{loginTime:getDate(),logoutTime:""}}}
	        db.UserLogs.update(inputUserData,updateData,{upsert:true},config.errorHandler({callback:function(data){
	          processData(data,callback,{returnData:"_id"})
	        }}))
	      }
	    }}))  

	  }

	this.saveLogOutTime = function(inputUserData,callback){
		/*var updateData = {$push:{logs:{loginTime:new Date()}}}
		db.UserLogs.update(inputUserData,updateData,{upsert:true},config.errorHandler({callback:function(data){
			processData(data,callback,{returnData:"_id"})
		}}))*/
		// var updateData = {$pop:{logs:1}}
		inputUserData["logs.logoutTime"] = "";
		db.UserLogs.findOne(inputUserData,{"logs":1},config.errorHandler({callback:function(data){
			getData(data,function(logData){
				console.log(logData)
				if(logData.logs.length){
					var logTimes = logData.logs.pop();
					console.log(logTimes);
					var updateQuery = {userId:inputUserData.userId,appName:inputUserData.appName,"logs.loginTime":logTimes.loginTime}
					db.UserLogs.update(updateQuery,{$set:{"logs.$.logoutTime":getDate()}},{upsert:true},config.errorHandler({callback:function(data){
						processData(data,callback,{})

					}}))
				}
			})
		}}))	
	}
	this.updateUserData = function(selectQuery,updateData,callback){
		db.UserData.update(selectQuery,{$set:updateData},config.errorHandler({callback:function(data){
			
		}}))
	}
	this.getChallenge = function(selectQuery,callback){
		db.AppChallenges.findOne(selectData,config.errorHandler({callback:function(data){
			getData(data,callback)
		},returnWithError:true}))
	}
	function getInActiveTime(appName,callback){
		db.setInactiveTime.find({appName : appName},function(err,info){
			if(!err && info.length>0){
				callback(info[0].time)
			}else{
				callback(1)
			}
		})
	}
	function getDate(){
		return new Date(moment().tz("Asia/Calcutta")._d);
	}
	this.getDateTime = function(){
		return new Date(moment().tz("Asia/Calcutta")._d);
	}
	this.inActiveUsers = function(selectQuery,callback){
		//var now = new Date();
		var now = getDate();
		var inActiveUsersList = [];
		//console.log('selectQuery '+JSON.stringify(selectQuery))
		db.UserLogs.find(selectQuery,{logs:1,userId:1},config.errorHandler({callback:function(data){
			getData(data,function(logData){
				console.log('logdata '+logData)
				var i=0;
				function logDataLoop(i){

					if(i < logData.length){
						console.log('userids '+logData[i].userId)
						var logDataCon = logData[i];
						if(logDataCon.logs.length){
							var logTimes = logDataCon.logs.pop();
							//console.log(logTimes);
							if(logTimes.logoutTime !== undefined || logTimes.logoutTime !== ""){
								// var d = new Date("2015-02-13T22:00:00.000Z");
								var timeDiff = Math.abs(now.getTime() - new Date(logTimes.logoutTime).getTime());
								var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

								getInActiveTime(selectQuery.appName,function(timeInfo){
									console.log('inactive time '+timeInfo)
									console.log('diffDays time '+diffDays)
									if(diffDays > timeInfo){
										var iAUser = {};
										iAUser.userId = logData[i].userId;
										db.UserData.findOne({_id:logData[i].userId},function(err,userData){
											iAUser.osType = userData.os;
											console.log('iAUser inside '+JSON.stringify(iAUser))
											inActiveUsersList.push(iAUser)
											i++;
											logDataLoop(i)
										})
									}else{
										i++;
										logDataLoop(i)
									}
								})

							}else{
								i++;
								logDataLoop(i)
							}
						}			
						
					}else{
						callback(inActiveUsersList)
					}
				}logDataLoop(i)
			})
			
		}}))
	}
	function processData(data,callback,options){
		if(data){
			options.returnData ? callback(data[options.returnData]) : callback(true)
		}else{
			callback(false)
		}
	}
	function getData(data,callback){
		if(data){
			callback(data)
		}else{
			callback(false)
		}
	}
}
module.exports.commonActions = commonActions;