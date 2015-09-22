var express = require('express')
  , app = express() 
  , bodyParser = require('body-parser')
  , cons = require('consolidate') 
  , expressSession = require('express-session')
  , routes = require('./config/routes'); 
require('./config');
var db = require("./config/db");
var async = require("async")
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.use(expressSession({
  secret: 'server module',
  resave: false,
  saveUninitialized: true
}))
app.use("views", express.static(__dirname + '/views'));
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/videos", express.static(__dirname + '/videos'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

routes(app, db);

var b = "10"
var c = 20
var a = 30
var d = a + c + b;
console.log('question is '+d)

