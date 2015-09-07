var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var inputFile='assets/ofiles/cm03SEP2015bhav.csv';

var parser = parse({delimiter: ','}, function (err, data) {
	var dataObj = {};
  async.eachSeries(data, function (line, callback) {
    // console.log(line);
    // console.log("********************8888");
    if(header.length === 0){
    	header = line;
    	console.log(header)
    	async.eachSeries(header, function (field, headerCallback) {
    		if(field !== "")
    			dataObj[field] = "";
    		headerCallback()
    	},function(){
    		callback();
    	})
    }else{
    	var i=0;
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
    }
  },function(){
  	console.log(reportData)
  })
	// console.log(data)
})
var header = [];
var reportData = [];
fs.createReadStream(inputFile).pipe(parser);