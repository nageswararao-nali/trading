var request = require('request');
var fs = require('fs');
var unzip = require('unzip');
var cheerio = require('cheerio');

/*var date = new Date();
var ydate = new Date();
ydate.setDate(ydate.getDate() - 1);
var day = ydate.getDate();
var month = date.getMonth();
var year = date.getFullYear();
var monthNames = [ "Jan", "Feb", "Mar", "Aprl", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
month = monthNames[month];
month = month.toUpperCase();
if (day.toString().length == 1) {
    day = "0" + day;
}
console.log(day + " -- " + month + " -- " + year)
var dZipFileName = "cm"+day+month+year+"bhav.csv.zip";
var dZipFilePath = "http://www.nseindia.com/content/historical/EQUITIES/"+year+"/"+month+"/"+dZipFileName;
var dPath = "assets/files/"+dZipFileName;
var headers= { 
           	"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11",
           	"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8",
           }
request.get({uri:dZipFilePath,headers:headers}).pipe(fs.createWriteStream(dPath))
setInterval(function(){
	fs.createReadStream(dPath).pipe(unzip.Extract({ path: 'assets/ofiles/' }));
},10000)*/
var headers= { 
           	"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11",
           	"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8",
           }
/*var url = "http://www.nseindia.com/products/dynaContent/equities/equities/htms/CM_homepage.htm";
request.get({uri:url,headers:headers},function(error,response,content){
	if(!error && response.statusCode == 200){
		// console.log(content)
		$ = cheerio.load(content);
		console.log($(".report").eq(1).find("ul").eq(2).find("li a").attr("href"))
		var dZipFilePath = "http://www.nseindia.com/content/historical/EQUITIES/"+year+"/"+month+"/"+dZipFileName;
		
	}else{
		console.log("error in request")
		console.log(response)
	}
})*/
function getUrl(urlCallback){
	var url = "http://www.nseindia.com/products/dynaContent/equities/equities/htms/CM_homepage.htm";
	request.get({uri:url,headers:headers},function(error,response,content){
		if(!error && response.statusCode == 200){
			// console.log(content)
			$ = cheerio.load(content);
			console.log($(".report").eq(1).find("ul").eq(2).find("li a").attr("href"))
			var fileUrl = "http://www.nseindia.com/"+$(".report").eq(1).find("ul").eq(2).find("li a").attr("href");
			urlCallback(fileUrl)
		}else{
			console.log("error in request")
			console.log(response)
		}
	})
}
/*var headers= { 
   	"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11",
   	"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8",
   }*/
getUrl(function(dZipFilePath){
	var dZipFileName = dZipFilePath.split("/").pop();
	var dPath = "assets/files/"+dZipFileName;
	request.get({uri:dZipFilePath,headers:headers}).pipe(fs.createWriteStream(dPath))
	setInterval(function(){
		fs.createReadStream(dPath).pipe(unzip.Extract({ path: 'assets/ofiles/' }));
	},10000)
})