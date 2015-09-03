var reportModule = require('../model/report').reportModule;
var reportSocketCalls = require('./reportSocketCalls').reportSocketCalls;
var userModule = require('../model/user').userModule;
var userSocketCalls = require('./userSocketCalls').userSocketCalls;
module.exports = function(io,db,app){
	//io.set('log level', 1); 
	io.sockets.on("connection",function(socket){
		new userSocketCalls(db,socket);
		var user = new userModule(db);
		var report = new reportModule(db);
		new reportSocketCalls(report,db,socket);
		socket.on("getPortfolio",function(data){
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
