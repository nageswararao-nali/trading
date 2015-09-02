var userModule = require('../model/user').userModule;
function userSocketCalls(db,socket){
	var user = new userModule(db,socket);
	var disconnectuserId, appName ;
	socket.on("loginWithMail",function(inputUserData){
		//userId = inputUserData.userId;
		
		appName = inputUserData.appName;
		//console.log(inputUserData);
		user.loginWithMail(inputUserData,function(userData){
			disconnectuserId = userData
			socket.emit("loginWithMail",{userId : userData})
		});
	})
	socket.on("sendState",function(inputUserData){
		console.log("=================================")
		console.log("send status")
		console.log(inputUserData)
		console.log("=================================")
		user.sendStatus(inputUserData,function(userData){
			socket.emit("sendState",{userId : userData})
		});
	})
	    // db.UserData.find({appName:"wicketdon"},function(err,data){
	    // 	for(var i = 0 ; i<data.length ; i++){
	    // 		console.log('emails '+data[i].email)
	    // 	}
     //    	//console.log('count '+data)
     //    })
	socket.on("getLevelCheckPointData",function(inputData){
        user.getLevelCheckPointData(inputData,function(doc){
        	socket.emit("getLevelCheckPointData",doc)
        })
    })
	socket.on("getAppLevelData",function(inputData){
        user.getAppLevelData(inputData,function(doc){
        	socket.emit("getAppLevelData",doc)
        })
    })
	socket.on("updateTotalPowerStrength",function(inputData){
        user.updateTotalPowerStrength(inputData,function(doc){
        	socket.emit("updateTotalPowerStrength",doc)
        })
    })
	socket.on("getTotalPowerStrength",function(inputData){
        user.getTotalPowerStrength(inputData,function(doc){
        	socket.emit("getTotalPowerStrength",doc)
        })
    })
	socket.on("setTotalPowerStrength",function(inputData){
        user.setTotalPowerStrength(inputData,function(doc){
        	socket.emit("setTotalPowerStrength",doc)
        })
    })
	 socket.on("setLevelCheckPoints",function(inputData){
        user.setLevelCheckPoints(inputData,function(doc){
        	socket.emit("setLevelCheckPoints",doc)
        })
    })
    socket.on("getUsersCount",function(inputData){
        db.UserData.count({appName:inputData.appName},function(err,data){
        	socket.emit("getUsersCount",data)
        	console.log('count '+data)
        })
    })

    socket.on("getUsersList",function(inputData){
    	db.UserData.find({appName:inputData.appName},function(err,userData){
    		console.log('userData '+userData)
	    	for(var i = 0 ; i<userData.length ; i++){
	    		console.log('emails '+userData[i].email)
	    	}
    		socket.emit('getUsersList',userData)
    	})
    })

   	socket.on("InviteFriends",function(selectData){
		console.log("in InviteFriends")
		user.InviteFriends(selectData,function(userInfo){
			console.log('return from InviteFriends')
			// socket.emit("getUserInfo",userInfo)
			socket.emit("InviteFriends",userInfo)
		})
	})

	socket.on("addCommonPower",function(selectData){
		console.log("in addCommonPowers")
		user.addCommonPower(selectData,function(userInfo){
			console.log('return from addCommonPower')
			// socket.emit("getUserInfo",userInfo)
			socket.emit("addCommonPower",userInfo)
		})
	})
	socket.on("updateCommonPower",function(selectData){
		console.log("in updateCommonPower")
		user.updateCommonPower(selectData,function(Info){
			console.log('return from updateCommonPower')
			// socket.emit("getUserInfo",userInfo)
			socket.emit("updateCommonPower",Info)
		})
	})
	socket.on("getPowerNames",function(selectData){
		console.log("in getPowerNames"+selectData)
		user.getPowerNames(selectData,function(powerInfo){
			console.log('return from getPowerNames')
			// socket.emit("getUserInfo",userInfo)
			socket.emit("getPowerNames",powerInfo)
		})
	})

	socket.on('addPowerToUser',function(powerData){
		console.log('addPowerToUser socket called')
		var selectData = {}
		selectData.appName = powerData.appName;
		selectData._id = powerData.userId;
		var updateData = {}
		updateData.powers = powerData.powers;
		user.addPowerToUser(selectData,updateData,function(info){
			console.log('addPowerToUser return '+info)
			socket.emit('addPowerToUser',info)
		})
	})

	socket.on('updatePowersToUser',function(powerData){
		console.log('updatePowersToUser socket called')
		user.updatePowersToUser(powerData,function(info){
			console.log('updatePowersToUser return '+info)
			socket.emit('updatePowersToUser',info)
		})
	})

	socket.on('deletePowersToUser',function(powerData){
		console.log('deletePowersToUser socket called')
		user.deletePowersToUser(powerData,function(info){
			console.log('deletePowersToUser return '+info)
			socket.emit('deletePowersToUser',info)
		})
	})

	socket.on("getAllPowers",function(selectData){
		console.log("in getAllPowers"+selectData)
		user.getAllPowers(selectData,function(powerInfo){
			console.log('return from getAllPowers')
			// socket.emit("getUserInfo",userInfo)
			socket.emit("getAllPowers",powerInfo)
		})
	})
	socket.on("getPowerValue",function(selectData){
		console.log("in getUserInfo")
		user.getPowerValue(selectData,function(userInfo){
			 socket.emit("getPowerValue",userInfo)
		})
	})
	socket.on("getUserSettings",function(selectData){
		console.log("in getUserSettings")
		user.getUserSettings(selectData,function(userInfo){
			// socket.emit("getUserInfo",userInfo)
		})
	})
	socket.on("updateUserData",function(selectData){
		console.log("in updateUserData")
		user.updateUserData(selectData,function(userInfo){
			// socket.emit("getUserInfo",userInfo)
		})
	})
	socket.on('addBonusType',function(selectData){
		console.log('addBonusType '+selectData.appName+' bonusType '+selectData.bonusType)
		user.addBonusType(selectData.appName,selectData.bonusType,function(success){
			socket.emit('addBonusType',success)
		})
	})

	socket.on('getBonusTypes',function(selectData){
		console.log('getBonusTypes '+selectData.appName)
		user.getBonusTypes(selectData.appName,function(success){
			socket.emit('getBonusTypes',success)
		})
	})

	socket.on('setBonusInfo',function(selectData){
		console.log('setBonusInfo '+selectData.appName)
		user.setBonusInfo(selectData,function(success){
			socket.emit('setBonusInfo',success)
		})
	})

	socket.on("logout",function(selectData){
		console.log("in logout")
		user.logout(selectData,function(userInfo){
			// socket.emit("getUserInfo",userInfo)
		})
	})

	socket.on('disconnect',function(){
		console.log('disconnect socket called userId '+disconnectuserId+' and appName '+appName)
		var data = {
			userId : disconnectuserId,
			appName : appName
		}
		user.logout(data,function(userInfo){
			// socket.emit("getUserInfo",userInfo)
		})
	})
}
module.exports.userSocketCalls = userSocketCalls;