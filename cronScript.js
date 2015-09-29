var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var db = require("./config/db");
var inputFile='assets/ofiles/cm03SEP2015bhav.csv';
var companies = [];
db.Company.find({},{_id:0,cName:1},function(err,cNames){
    if(!err && cNames.length){
        for(var i=0;i<cNames.length;i++){
            companies.push(cNames[i].cName);
        }
        console.log(companies)
        fs.createReadStream(inputFile).pipe(parser);
    }
})
var parser = parse({delimiter: ','}, function (err, data) {
  async.eachSeries(data, function (line, callback) {
    // console.log(line);
    // console.log("********************8888");
	var dataObj = {};
    if(header.length === 0){
    	header = line;
    	//console.log(header)
    	async.eachSeries(header, function (field, headerCallback) {
    		if(field !== "")
    			dataObj[field] = "";
    		headerCallback()
    	},function(){
    		callback();
    	})
    }else{
        header = data[0];
        //console.log(header)
        async.eachSeries(header, function (field, headerCallback) {
            if(field !== "")
                dataObj[field] = "";
            headerCallback()
        },function(){
            var i=0,isCom=0;
            if(isCom ==0){
                if(companies.indexOf(line[0]) > -1)
                    isCom = 1;
            }
            if(isCom){
                async.eachSeries(line, function (fieldValue, headerValCallback) {
                    if(fieldValue !== ""){
                        dataObj[header[i]] = fieldValue;
                    }
                    i++;
                    headerValCallback()
                },function(){
                    reportData.push(dataObj)
                    callback();
                })
            }else{
                callback()
            }
        })
    	
    }
  },function(){
    console.log(reportData)
  	console.log("parse completed")
  })
	// console.log(data)
})
var header = [];
var reportData = [];
