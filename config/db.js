var mongoose = require('mongoose');
var d1 = new Date();
mongoose.connect('mongodb://localhost/Trading',function(err, db){
  if(err)
    console.log(err)
  else{
    var d2 = new Date();
    console.log("time taken to connect to db is " + (d2-d1))
  }
});

exports.portFolio = mongoose.model('portFolio' , {
      "pName" : String,
      "capital" : Number,
      "date" : Date
  },"portFolio")
exports.Company = mongoose.model('Company' , {
      "cName" : String,
      "createDate" : Date
  },"Company")
/*exports.CompanyList = mongoose.model('CompanyList' , { 
    'SYMBOL': String,
    'SERIES': String,
    'OPEN': Number,
    'HIGH': Number,
    'LOW': Number,
    'CLOSE': Number,
    'LAST': Number,
    'PREVCLOSE': Number,
    'TOTTRDQTY': Number,
    'TOTTRDVAL': Number,
    'TIMESTAMP': String,
    'TOTALTRADES': Number,
    'ISIN': String,
    'lastUpdate': Date 
  } ,"CompanyList")*/
exports.CompanyList = mongoose.model('CompanyList' , {
      "cList" : Array,
      "createDate" : Date
  },"CompanyList")
exports.ReportType = mongoose.model('ReportType' , {
      "rTName" : String,
      "createDate" : Date
  },"ReportType")
exports.Report = mongoose.model('Report' , {
      "pName" : String,
      "cName" : String,
      "quantity" : Number,
      "price" : Number,
      "total" : Number,
      "releaseMark" : Number,
      "createDate" : Date,
      "lastUpdate" : Date
  },"Report")
exports.RHistory = mongoose.model('RHistory' , {
      "pName" : String,
      "cName" : String,
      "quantity" : Number,
      "price" : Number,
      "buyOrSale" : String,
      "createDate" : Date
  },"RHistory")

exports.portFolioBuyInfo = mongoose.model('portFolioBuyInfo' , {
      "pName" : String,
      "buyValue" : Number,
      "date" : Date
  },"portFolioBuyInfo")
exports.portFolioDividend = mongoose.model('portFolioDividend' , {
      "pName" : String,
      "value" : Number,
      "description" : String,
      "date" : Date
  },"portFolioDividend")
exports.portFolioCashInFlow = mongoose.model('portFolioCashInFlow' , {
      "pName" : String,
      "value" : Number,
      "description" : String,
      "date" : Date
  },"portFolioCashInFlow")
exports.portFolioCashOutFlow = mongoose.model('portFolioCashOutFlow' , {
      "pName" : String,
      "value" : Number,
      "description" : String,
      "date" : Date
  },"portFolioCashOutFlow")
exports.portFolioBalances = mongoose.model('portFolioBalances' , {
      "pName" : String,
      "openBal" : Number,
      "closeBal" : Number,
      "date" : Date
  },"portFolioBalances")
