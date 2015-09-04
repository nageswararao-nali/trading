var socketIo = require('socket.io');
var fs = require('fs');
var http = require('http');
var socketHandler = require('../controller/socketHandler');
module.exports = function(app,db){
	"use strict";
	var server = http.createServer(app).listen(3002);
	//console.log('server '+server)
	//var server = app.listen(3004);
	var io = socketIo.listen(server);
	app.get('/',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("adminLogin.html");
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.post('/',function(req,res){
		var userName = req.body.userName;
		var password = req.body.password;
		if(userName == "admin" && password == "pass"){
			req.session.isUserLoggedIn = true;
			res.redirect("/dashboard")
		}
		else
			res.render("adminLogin.html",{"status":"Invalid username/passowrd"})
	});
	app.post('/savereportDetails',function(req,res){
		var portfolio = req.body.portfolio;
		var reportType = req.body.reportType;
		var reportDetails = {
			portfolio : portfolio,
			reportType : reportType
		};
		req.session.reportDetails = reportDetails;
		res.redirect("/buy")
	});
	app.get('/buy',function(req,res){
		if(req.session.isUserLoggedIn){
			var reportDetails = req.session.reportDetails;
			if(reportDetails === undefined){
				res.redirect("/dashboard")
			}else{
      			res.render("buy.html",{portfolio:reportDetails.portfolio,reportType:reportDetails.reportType});
			}
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/sale',function(req,res){
		if(req.session.isUserLoggedIn){
      		var reportDetails = req.session.reportDetails;
      		if(reportDetails === undefined){
				res.redirect("/dashboard")
			}else{
      			res.render("sale.html",{portfolio:reportDetails.portfolio,reportType:reportDetails.reportType});
			}
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/reports',function(req,res){
		if(req.session.isUserLoggedIn){
      		var reportDetails = req.session.reportDetails;
      		if(reportDetails === undefined){
				res.redirect("/dashboard")
			}else{
      			res.render("reports.html",{portfolio:reportDetails.portfolio,reportType:reportDetails.reportType});
			}
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/dashboard',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("dashboard.html");
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/admin/addNewPortfolio',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("addNewPortfolio.html");
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/admin/addNewCompany',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("addNewCompany.html");
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/admin/addNewReportType',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("addNewReportType.html");
		}else{
      		res.render("adminLogin.html");
		}
	});
	socketHandler(io,db,app);

}