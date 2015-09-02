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
	this.updateTotalPowerStrength = function(data,callback){
		data.createDate = new Date();
		db.CheckPointPowers.update({'appName':data.appName,'level':data.level,'checkPoint':data.checkPoint,'powerName':data.powerName},data).exec(function(err,doc){
			if(!err && doc)
				callback({'status':'success'})
			else{
				console.log('error :'+err)
				callback({'status':'fail'})
			}
		})
	}
	this.getLevelCheckPointData = function(data,callback){
		db.LevelCheckPoints.find(data).sort({'level':1}).exec(function(err,docs){
			 	if(err)
			 		console.log('error'+err)
			 	else{
			 		console.log('>>>>>>>>>'+JSON.stringify(docs))
			 		callback(docs)
			 		
			 	}
			 })
	}
	this.getAppLevelData = function(data,callback){
		db.CheckPointPowers.find(data).sort({'level':1,'checkPoint':1}).exec(function(err,docs){
			 	if(err)
			 		console.log('error'+err)
			 	else{
			 		console.log('>>>>>>>>>'+JSON.stringify(docs))
			 		callback(docs)
			 		
			 	}
			 })
	}
	this.setLevelCheckPoints = function(data,callback){
		data.createDate = new Date();
		db.LevelCheckPoints.update({'appName':data.appName,'level':data.level},data,{upsert:true}).exec(function(err,doc){
			if(!err && doc)
				callback({'status':'success'})
			else{
				console.log('error :'+err)
				callback({'status':'fail'})
			}
		})
	}
	this.getTotalPowerStrength = function(data,callback){
		db.CheckPointPowers.findOne(data).exec(function(err,doc){
			if(!err && doc){
				callback(doc)
			}else{
				console.log('error:'+err)
				callback({'status':'fail'})
			}
		})
	}
	this.setTotalPowerStrength = function(data,callback){
		data.createDate = new Date();
		new db.CheckPointPowers(data).save(function(err,doc){
			if(!err && doc)
				callback({'status':'success'})
			else{
				console.log('error :'+err)
				callback({'status':'fail'})
			}
		})
	}
	function bonusCredit(appName,userId,bonusType,callback){
        db.BonusInfo.find({appName:appName,bonusType : bonusType},function(err,bonusInfo){
        	if(!err && bonusInfo.length>0){
        		console.log('bonusInfo '+bonusInfo[0].bonusPowerName)
		        common.getUserData({_id:userId},function(userInfo){
					if(userInfo){
						console.log("data found ===> ")
					   	var cDate=common.getDateTime();
					   	console.log('userData name '+userInfo.name)
					   	//userInfo.lastLogin=new Date(userInfo.lastLogin);
					   	//console.log(cDate)
					  	if(userInfo.lastLogin){
					    	var lastLoginDate=userInfo.lastLogin;
					      	console.log('lastLogin '+lastLoginDate)
					     	start = Math.floor( cDate.getTime() / (3600*24*1000)); //days as integer from..
					     	end   = Math.floor( lastLoginDate.getTime() / (3600*24*1000)); //days as integer from..
					     	daysDiff = start - end; // exact dates
					     	userInfo.lastLogin=cDate;
					     	//console.log('am in 111')
					      	if(daysDiff > 0){
						     	for(var i = 0 ; i<userInfo.powers.length ; i++){
						     		if(userInfo.powers[i][bonusInfo[0].bonusPowerName]){
						     			var oldPowerValue = userInfo.powers[i][bonusInfo[0].bonusPowerName]
						     			console.log('power value '+userInfo.powers[i][bonusInfo[0].bonusPowerName])
						     		}
						     	}
						     	var newPowerValue = parseInt(oldPowerValue) + parseInt(bonusInfo[0].bonusValue);
						     	console.log('new power value '+newPowerValue)
						     	var finalData = {
						     		appName : appName,
						     		userId : userId,
						     		powerName : bonusInfo[0].bonusPowerName,
						     		powerValue : newPowerValue
						     	}
						     	updatePowersToUserFun(finalData,function(result){
									callback(result)
								})
						        userInfo.lastLogin=cDate;
					      	}else{
					      		//userInfo.coins = 20
					           	callback(0)
					      	}
					  	}else{
					     	console.log('am in 222')
					     	for(var i = 0 ; i<userInfo.powers.length ; i++){
					     		if(userInfo.powers[i][bonusInfo[0].bonusPowerName]){
					     			var oldPowerValue = userInfo.powers[i][bonusInfo[0].bonusPowerName]
					     			console.log('power value '+userInfo.powers[i][bonusInfo[0].bonusPowerName])
					     		}
					     	}
					     	var newPowerValue = parseInt(oldPowerValue) + parseInt(bonusInfo[0].bonusValue);
					     	console.log('new power value '+newPowerValue)
					     	var finalData = {
					     		appName : appName,
					     		userId : userId,
					     		powerName : bonusInfo[0].bonusPowerName,
					     		powerValue : newPowerValue
					     	}
					     	updatePowersToUserFun(finalData,function(result){
								callback(result)
							})
					        userInfo.lastLogin=cDate;
					        //callback(userInfo,false)
					  	}
						//console.log(data)
					//	callback(userData)
					}
				})
        		//callback(bonusInfo)
        	}else{
        		callback(false)
        	}
        })
	}

	// bonusCredit("wicketdon","559a03ad15c12a1a1ce37b45","daily",function(data){
	// 	console.log('bonusCredited successfully '+data)
	// })

    function friendAcceptCredit(appName,fbid,callback){
	    db.UserData.aggregate([{$unwind : "$invitedMails"},{$match : {"invitedMails" : fbid}},{$project : {userId : "$_id"}}]).exec(function (err,friendslist){
	    if(err) console.log(err)
	      else
	      {
	        if(friendslist)
	        {
	          for(var k=0;k<friendslist.length;k++)
	          {
	          	console.log('friendslist userids '+friendslist[k].userId)
	          	var fuserId = friendslist[k].userId
		        db.BonusInfo.find({appName:appName,bonusType : "friendAccept"},function(err,bonusInfo){
		        	if(!err && bonusInfo.length>0){
		        		console.log('bonusInfo '+bonusInfo[0].bonusPowerName)
	        			common.getUserData({_id:fuserId},function(userInfo){
							if(userInfo){
								for(var i = 0 ; i<userInfo.powers.length ; i++){
						     		if(userInfo.powers[i][bonusInfo[0].bonusPowerName]){
						     			var oldPowerValue = userInfo.powers[i][bonusInfo[0].bonusPowerName]
						     			console.log('power value '+userInfo.powers[i][bonusInfo[0].bonusPowerName])
						     		}
						     	}
						     	var newPowerValue = parseInt(oldPowerValue) + parseInt(bonusInfo[0].bonusValue);
						     	console.log('new power value '+newPowerValue)
						     	var finalData = {
						     		appName : appName,
						     		userId : fuserId,
						     		powerName : bonusInfo[0].bonusPowerName,
						     		powerValue : newPowerValue
						     	}
						     	updatePowersToUserFun(finalData,function(result){
									callback(result)
								})
							}
						})
		        	}
		        })
	          
	          }
	          
	        }
	      }
	    })
    }

 	this.sendStatus = function(inputUserData,callback){
 		console.log("in send status")
 		var userId = inputUserData.userId;
		var loginTimeQuery = {userId:userId,appName:inputUserData.appName};
		if(inputUserData.appState === "start"){
			console.log("in start status")
			common.saveLoginTime(loginTimeQuery,function(){
				console.log("logintime saved in sendStatus ............")
				callback(userId)
			})
		}else{
			console.log("in pause status")
			common.saveLogOutTime(loginTimeQuery,function(){
				console.log("logouttime saved in sendStatus...........")
				callback(userId)
			})
		}
 	}

	this.loginWithMail = function(inputUserData,callback){
		/*console.log("===================================")
		console.log(inputUserData)
		console.log("===================================")*/
		if(inputUserData.email === "User"){
			if(inputUserData.mobileId){
				console.log('in mobileId')
			 	var userSelectData = {appName : inputUserData.appName,deviceToken : inputUserData.deviceToken,mobileId : inputUserData.mobileId};
			}else{
				console.log('in mobileId else ')
				var userSelectData = {appName : inputUserData.appName,deviceToken : inputUserData.deviceToken};
			}
		}
		else
			var userSelectData = {email : inputUserData.email,appName : inputUserData.appName};

		console.log('userSelectData '+JSON.stringify(userSelectData))
		common.isUserExists(userSelectData,function(exists){
			if(exists){
				// update user info
				var selectData = {email:inputUserData.email,appName:inputUserData.appName}
				common.updateUserInfo(selectData,inputUserData,function(updated){
					if(updated){
						console.log("updated")
						common.getUserId(selectData,function(userId){
							//callback({message:"success",userId:userId});
							var loginTimeQuery = {userId:userId,appName:inputUserData.appName};
							common.saveLoginTime(loginTimeQuery,function(){
								console.log("logintime saved")
								callback(userId)
							})
							bonusCredit(inputUserData.appName,userId,"daily",function(data){
								console.log('bonusCredited successfully '+data)
							})
						})
					}
					else
						console.log("problem in updating")
				})
			}else{
				//code for register as new user
				common.saveNewUser(inputUserData,function(userId){
					//callback({message:"success",userId:userId});

					var loginTimeQuery = {userId:userId,appName:inputUserData.appName,name:inputUserData.name};
					common.saveLoginTime(loginTimeQuery,function(){
						console.log("login time saved")
						if(inputUserData.fbid){
						   friendAcceptCredit(inputUserData.appName,inputUserData.fbid,function(){

    						})
						}
						callback(userId)
					})
				})
			}
		})
	}

	this.addPowerToUser = function(selectData,updateData,callback){
		common.addPowerToUser(selectData,updateData,function(userData){
			if(userData){
				console.log(userData)
				callback(userData)
			}
		})
	}


	this.deletePowersToUser = function(data,callback){
	   	var obj = {}
	   		obj[data.powerName] = data.oldPowerValue
	   		var deleteobject = {
	   			powers : obj
	   		}
	   		db.UserPowers.update({appName:data.appName,userId:data.userId},{$pull :{powers:data.powerName}},function(err,updated){
   	   		if(!err && updated){
   	   			console.log('data updated '+JSON.stringify(updated))
   	   			callback({status:"power information deleted successfully"})
   	   		}
   	   	})
	}

	function updatePowersToUserFun(data,fcallback){
		var p1 = "powers.$."+data.powerName+"";
   		var jsonobject = {};
   		jsonobject[p1] = ""+data.powerValue;
   		jsonobject.lastLogin = common.getDateTime();
   		common.getUserData({_id:data.userId},function(userInfo){
			if(userInfo){
				for(var i = 0 ; i<userInfo.powers.length ; i++){
		     		if(userInfo.powers[i][data.powerName]){
		     			var oldPowerValue = userInfo.powers[i][data.powerName]
		     			//console.log('power value '+userInfo.powers[i][bonusInfo[0].bonusPowerName])
		     		}
		     	}
		     	var setpower = "powers."+data.powerName+""
		   		var setquery = {
		   			appName : data.appName,
		   			_id : data.userId
		   		}
		   		setquery[setpower] = oldPowerValue

		   		console.log('jsonobject '+jsonobject+' stringify '+JSON.stringify(jsonobject)+' p1 '+p1+' powerValue '+data.powerValue)
				//var selectData = '{appName:'+data.appName+',userId : '+data.userId+',"powers.'+data.powerName+'" : '+data.oldPowerValue+'}';
				common.updatePowersToUser(setquery,jsonobject,function(userData){
					if(userData){
						console.log(userData)
						fcallback(userData)
					}
				})
		    }
		})


	}

	this.updatePowersToUser = function(data,callback){
		updatePowersToUserFun(data,function(result){
			callback(result)
		})
	}

	this.addCommonPower = function(data,callback){
		console.log('addCommonPower data '+data.appName)
			var obj = {}
   	   		obj[data.powerName] = data.powerValue
   	   		var jsonobject = {
   	   			appName : data.appName,
   	   			powers : [obj]
   	   		}
		db.UserPowers.find({appName:data.appName},function(err,powerInfo){
			if(err){console.log('error in addCommonPower '+err);callback()}
			   else{
			   	    console.log('powerInfo '+powerInfo)
			   	   if(powerInfo.length>0){
			   	   		console.log('powerInfo data' +powerInfo)
			   	   		db.UserPowers.update({appName : data.appName},{$addToSet : {powers : obj}},{upsert:true},function(err,updated){
			   	   			if(!err && updated){
			   	   				common.addPowerToAllUser({appName:data.appName},{powers : obj},function(userData){
			   	   					callback({status:"power information added successfully"})
			   	   					console.log('data inserted successfully')
			   	   				})	
			   	   			}
			   	   		})			   	   		
			   	   }else{
			   	   		console.log('no power information')			   	   	
			   	   		console.log('data '+JSON.stringify(jsonobject))
			   	   		new db.UserPowers(jsonobject).save(function(err,inserted){
			   	   			if(!err && inserted){
			   	   				common.addPowerToAllUser({appName:data.appName},{powers : obj},function(userData){
			   	   					callback({status:"power information added successfully"})
			   	   					console.log('data inserted successfully')
			   	   				})			   	   				
			   	   			}
			   	   		})
			   	   }
			   }
		})
	}
	this.updateCommonPower = function(data,callback){
		console.log('updateCommonPower data '+data.appName)
	
   	   		var p1 = "powers.$."+data.powerName+""
   	   		var jsonobject = {}
   	   		jsonobject[p1] = data.powerValue;

   	   		var setpower = "powers."+data.powerName+""
   	   		var setquery = {
   	   			appName : data.appName
   	   		}
   	   		setquery[setpower] = data.oldPowerValue
   	   		var obj = {}
   	   		obj[data.powerName] = data.oldPowerValue
   	   		var deleteobject = {
   	   			powers : obj
   	   		}

   	   		// console.log('p2 '+setpower)
   	   		// console.log('setquery '+setquery)
   	   		// console.log('setquery parse '+JSON.stringify(setquery))
   	   		// console.log('power objects '+JSON.stringify(setquery)+' and '+JSON.stringify(jsonobject))
   	   	if(data.type === "update"){	
	   	   	db.UserPowers.update(setquery,{"$set" : jsonobject},function(err,updated){
	   	   		if(!err && updated){
	   	   			console.log('data updated '+JSON.stringify(updated))
	   	   			callback({status:"power information updated successfully"})
	   	   		}
	   	   	})
	   	}else{
	   		console.log('deleteobject '+JSON.stringify(deleteobject))
	   	    db.UserPowers.update({appName:data.appName},{"$pull" : deleteobject},function(err,updated){
	   	   		if(!err && updated){
	   	   			console.log('data updated '+JSON.stringify(updated))
	   	   			callback({status:"power information deleted successfully"})
	   	   		}
	   	   	})
	   	}
	}
	this.getPowerNames = function(data,callback){
		db.UserPowers.find({appName:data.appName},function(err,powerInfo){
			if(!err && powerInfo.length>0){
				callback(powerInfo[0].powers)
			}else{
				callback(0)
			}
		})
	}
	this.getPowerValue = function(data,callback){
		var selectQuery = {_id:data.userId,appName: data.appName};
		common.getUserData(selectQuery,function(userData){
			if(userData){
				for(var i = 0 ; i<userData.powers.length ; i++){
		     		if(userData.powers[i][data.powerKey]){
		     			var oldPowerValue = userData.powers[i][data.powerKey]
		     			callback(oldPowerValue)
		     			//console.log('power value '+userInfo.powers[i][bonusInfo[0].bonusPowerName])
		     		}
		     	}
				// console.log('powerkey '+data.powerKey)
				//console.log('userData '+userData+' stringify '+JSON.stringify(userData))
				// console.log('powervalue ' +userData.powers[data.powerKey])
				
			}
		})
	}
	this.getAllPowers = function(data,callback){
		db.UserPowers.find({},function(err,allData){
			if(!err && allData.length>0){
				callback(allData)
			}
		})
	}
	this.getUserSettings = function(data,callback){
		var selectQuery = {_id:data._id,appName: data.appName};
		common.getUserData(selectQuery,function(userData){
			if(userData){
				console.log(userData.powers[data.powerKey])
				callback(userData.settings)
			}
		})
	}

	function getarrayfbid(FBID,callback){
	 var FBIDs = [];
	//  console.log('invite friends list '+FBID);
		  for(var i =0 ;i < FBID.length ; i++){
		    FBIDs.push(FBID[i]);

		    if(i == FBID.length-1){
		      callback(FBIDs);
		    }
		  }
	} 

	this.InviteFriends = function(data,callback){
	    getarrayfbid(data.friendsIds,function(FBIDs){
            for(var i = 0 ;i<FBIDs.length ; i++)
            {
                db.UserData.update({appName: data.appName, _id : data.userId},{ $addToSet : {invitedMails : FBIDs[i] } }).exec(function (err, docs){
                if(err)console.log(err);
                    else{
                        if(docs){
                         	callback({status:"Friends Invitation added successfully in friends list FBID"})                                                         
                        }
                        else{
                        	callback({status:"Friends Invitation added fail in friends list"})
                        
                        }
                     }
                });
            }
        })
	}
	this.updateUserData = function(data,callback){
		var selectQuery = {_id:data._id,appName: data.appName};
		var updateValue = data.updateValue;
		common.updateUserInfo(selectQuery,updateValue,function(userData){
			if(userData){
				callback(true)
			}else{
				callback(false)
			}
		})
	}
	this.addBonusType = function(appName,bonusType,callback){
		db.BonusTypes.find({appName:appName,bonusType:bonusType},function(err,info){
			if(!err && info.length>0){
				callback({status: "bonusType added successfully"})
			}else{
				new db.BonusTypes({appName : appName,bonusType:bonusType}).save(function(err,added){
					callback({status: "bonusType added successfully"})
				})
			}
		})		
	}
	this.getBonusTypes = function(appName,callback){
		db.BonusTypes.find({appName:appName},function(err,bonuses){
			callback(bonuses)
		})
	}
	this.setBonusInfo = function(info,callback){
		db.BonusInfo.find({appName:info.appName,bonusType:info.bonusType},function(err,binfo){
			if(!err && binfo.length>0){
				db.BonusInfo.update({appName:info.appName,bonusType:info.bonusType},{$set:{bonusValue : info.bonusValue}},function(err,updated){
					callback({status: "BonusInfo successfully updated"})
				})				
			}else{
				new db.BonusInfo(info).save(function(err,added){
					callback({status: "BonusInfo added successfully"})
				})
			}
		})	
	}

	this.logout = function(data,callback){
		var loginTimeQuery = {userId:data.userId,appName:data.appName};
		common.saveLogOutTime(loginTimeQuery,function(){
			console.log("logouttime saved")
		})
	}
	this.inActiveUsers = function(data,callback){
		var selectQuery = {appName : data.appName};
		console.log(selectQuery.appName + " ----->")
		common.inActiveUsers(selectQuery,function(iAUsers){
			callback(iAUsers)
		})
	}


	
}
module.exports.userModule = userModule;
