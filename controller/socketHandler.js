var userModule = require('../model/user').userModule;
var userSocketCalls = require('./userSocketCalls').userSocketCalls;
module.exports = function(io,db,app){
	//io.set('log level', 1); 
	io.sockets.on("connection",function(socket){
		new userSocketCalls(db,socket);
		socket.on("getUserInfo",function(data){
			console.log("in getUserInfo")
			var userId = data.userId;
			user.getUserInfo(userId,function(userInfo){
				socket.emit("getUserInfo",userInfo)
			})
		})
	})
}
