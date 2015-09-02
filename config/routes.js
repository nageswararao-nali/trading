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
	app.get('/dashboard',function(req,res){
		if(req.session.isUserLoggedIn){
      		res.render("dashboard.html");
		}else{
      		res.render("adminLogin.html");
		}
	});
	socketHandler(io,db,app);

}