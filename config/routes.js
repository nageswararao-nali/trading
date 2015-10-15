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
			res.redirect("/buy")
		}
		else
			res.render("adminLogin.html",{"status":"Invalid username/passowrd"})
	});
	/*app.post('/savereportDetails',function(req,res){
		var portfolio = req.body.portfolio;
		var reportType = req.body.reportType;
		var reportDetails = {
			portfolio : portfolio,
			reportType : reportType
		};
		req.session.reportDetails = reportDetails;
		res.redirect("/buy")
	});*/
	app.get('/buy',function(req,res){
		if(req.session.isUserLoggedIn){
			res.render("buy.html",{activeMenu:"buy",activeTab:""});
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/sale',function(req,res){
		if(req.session.isUserLoggedIn){
  			res.render("sale.html",{activeMenu:"sale",activeTab:""});
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/addNewPortfolio',function(req,res){
		if(req.session.isUserLoggedIn){
  			res.render("addNewPortfolio.html",{activeMenu:"addNewPortfolio",activeTab:""});
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/updatePortfolio',function(req,res){
		if(req.session.isUserLoggedIn){
  			res.render("updatePortfolio.html",{activeMenu:"updatePortfolio",activeTab:""});
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/reports/:reportType',function(req,res){
		if(req.session.isUserLoggedIn){
      		var reportPage = req.param("reportType");
  			res.render(reportPage+".html",{activeMenu:"report",activeTab:reportPage});
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/dashboard',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("buy.html",{activeMenu:"home",activeTab:""});
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('/admin/:adminAction',function(req,res){
		if(req.session.isUserLoggedIn){
			var adminAction = req.param("adminAction");
      		res.render(adminAction+".html",{activeMenu:"home",activeTab:adminAction});
		}else{
      		res.render("adminLogin.html");
		}
	});
	/*app.get('/admin/addNewPortfolio',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("addNewPortfolio.html",{activeMenu:"home",activeTab:""});
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
      		res.render("addNewReportType.html",{activeMenu:"home",activeTab:""});
		}else{
      		res.render("adminLogin.html");
		}
	});
	app.get('admin/updatePortfolio',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("updatePortfolio.html",{activeMenu:"home",activeTab:""});
		}else{
      		res.render("adminLogin.html");
		}
	});*/
	app.get('/logout',function(req,res){
		req.session.destroy(function(err) {
		  // cannot access session here
		})
  		res.render("adminLogin.html");
	});
	socketHandler(io,db,app);

}