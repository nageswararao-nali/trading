var userModule = require('../model/user').userModule;
var userSocketCalls = require('./userSocketCalls').userSocketCalls;
module.exports = function(io,db,app){
	//io.set('log level', 1); 
	io.sockets.on("connection",function(socket){
		new userSocketCalls(db,socket);
		var user = new userModule(db)
		socket.on("getPortfolio",function(data){
			console.log("in socket handlerssssssssss")
			user.getPortfolio({},function(portfolioInfo){
				socket.emit("getPortfolio",portfolioInfo)
			})
		})
		socket.on("ReportType",function(data){
			user.getReportType({},function(reportTypeInfo){
				socket.emit("ReportType",reportTypeInfo)
			})
		})
		
	})
}
