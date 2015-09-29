var redis = require('redis');
var redisIp = '127.0.0.1';
//var redisIp = 'cricredis.qnsdtp.0001.apse1.cache.amazonaws.com';
var redisClient = redis.createClient(6379,redisIp)
global.config = {
	redisClient : redisClient,
	errorHandler : function(options){
		var handler = options.handler ? options.handler : "";
		var errorMessage = options.errorMessage ? options.errorMessage : "";
		var returnWithError = options.returnWithError ? options.returnWithError : false;
		return function(error,result){
			if(!error){
				if(handler == "redisHandler"){
					if(result != null)
						return options.callback(result)		
				}else if(handler == "arrayHandler"){
					if(result.length)
						return options.callback(result)
				}else{
					if(result)
						return options.callback(result)
				}
				console.log("no-data found in DB ==> " + errorMessage)
				if(returnWithError)
					return options.callback(false)
			}else{
				if(error){
					console.log("error while getting data from DB ==> " + error)
					if(returnWithError)
						return options.callback("return with error ==>" + error)
				}
			}
		}
	}
}
 
