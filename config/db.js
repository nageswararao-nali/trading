var mongoose = require('mongoose');
var d1 = new Date();
mongoose.connect('mongodb://localhost/Trading',function(err, db){
// mongoose.connect('mongodb://192.168.0.139:27017/Trading',function(err, db){
//mongoose.connect('mongodb://54.254.193.61:27017/ServerModules',function(err, db){
// mongoose.connect('mongodb://192.168.0.148:27017/ServerModules',function(err, db){

  if(err)
    console.log(err)
  else{
    var d2 = new Date();
    console.log("time taken to connect to db is " + (d2-d1))
  }
});

exports.Portfolio = mongoose.model('Portfolio' , {
      "pName" : String,
      "createDate" : Date
  },"Portfolio")
exports.Company = mongoose.model('Company' , {
      "cName" : String,
      "createDate" : Date
  },"Company")
exports.ReportType = mongoose.model('ReportType' , {
      "rTName" : String,
      "createDate" : Date
  },"ReportType")
exports.Report = mongoose.model('Report' , {
      "pDetails" : Object,
      "cDetails" : Object,
      "quantity" : Number,
      "price" : Number,
      "total" : Number,
      "createDate" : Date,
      "lastUpdate" : Date
  },"Report")
exports.RHistory = mongoose.model('RHistory' , {
      "pDetails" : Object,
      "cDetails" : Object,
      "quantity" : Number,
      "price" : Number,
      "buyOrSale" : String,
      "createDate" : Date
  },"RHistory")


