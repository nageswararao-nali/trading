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
			console.log("in socket handlerssssssssss")
			user.getPortfolio({},function(portfolioInfo){
				socket.emit("getPortfolio",portfolioInfo)
			})
		})
		socket.on("getCompanies",function(data){
			console.log("in socket getCompanies")
			user.getCompanies(function(list){
				socket.emit("getCompanies",list)
			})
		})
		
		socket.on("ReportType",function(data){
			user.getReportType({},function(reportTypeInfo){
				socket.emit("ReportType",reportTypeInfo)
			})
		})
		
		socket.on("addPortfolio",function(data){
			user.addPortfolio(data,function(addPortfolioInfo){
				socket.emit("addPortfolio",addPortfolioInfo)
			})
		})

		socket.on("addCompany",function(data){
			user.addCompany(data,function(addCompanyInfo){
				socket.emit("addCompany",addCompanyInfo)
			})
		})

		socket.on("addReportType",function(data){
			user.addReportType(data,function(addCompanyInfo){
				socket.emit("addReportType",addCompanyInfo)
			})
		})
		socket.on("addExtraCash",function(data){
			user.addExtraCash(data,function(err,addExtraCashData){
				if(!err)
					socket.emit("addExtraCash",addExtraCashData)
				else
					console.log("error in saving extra cash details")
			})
		})
		

		
	})
}
