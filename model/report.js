function reportModule(db){
	// var common = new commonActions(db);
	this.buySharesFromOrg = function(data,callback){
		storeInRHistory(data,'buy');
		db.Report.findOne({ pDetails: data.pDetails, cDetails: data.cDetails },function(err,doc){
			if(!err && doc){
				doc.quantity = doc.quantity + data.quantity;
				var price = ((doc.price + data.price)/2);
				doc.price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
				doc.total = quantity*price;
				doc.lastUpdate = new Date();
				db.Report.update({ '_id':doc._id },doc,function(err,docResult){
					if(!err && docResult)
						callback({'status':'update success'});
					else
						callback({'status':'update fail'})
				})
			}else{
				console.log('something here');
				data.createDate = new Date();
				new db.Report(data).save(function(err,doc){
					if(!err && doc)
						callback({'status':'success'});
					else{
						console.log('error in save:'+err);
						callback({'status':'fail'});
					}
				})
			}
		})
		
	}
	this.sellSharesFromOrg = function(data,callback){
		
		db.Report.findOne({ pDetails: data.pDetails, cDetails: data.cDetails },function(err,doc){
			if(!err && doc){
				doc.quantity = doc.quantity - data.quantity;
				if ( doc.quantity <= -1 ){
					callback({'status':'not enough quantity to sell'})
				}else{
					storeInRHistory(data,'sell');
					var price = ((doc.price + data.price)/2);
					doc.price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
					doc.total = quantity*price;
					doc.lastUpdate = new Date();
					db.Report.update({ '_id':doc._id },doc,function(err,docResult){
						if(!err && docResult)
							callback({'status':'update success'});
						else
							callback({'status':'update fail'})
					})
				}
			}else{
				console.log('something here');
				data.createDate = new Date();
				new db.Report(data).save(function(err,doc){
					if(!err && doc)
						callback({'status':'success'});
					else{
						console.log('error in save:'+err);
						callback({'status':'fail'});
					}
				})
			}
		})
		
	}
	function storeInRHistory(data,buyOrSale){
		new db.RHistory({
		      "pDetails" : data.pDetails,
		      "cDetails" : data.cDetails,
		      "quantity" : data.quantity,
		      "price" : data.price,
		      "buyOrSale" : buyOrSale,
		      "createDate" : new Date()
		  }).save(function(err,doc){
		  	if(!err && doc)
		  		console.log('stored in RHistory');
		  	else
		  		console.log('unable to store data');
		  })
	}
	
}
module.exports.reportModule = reportModule;