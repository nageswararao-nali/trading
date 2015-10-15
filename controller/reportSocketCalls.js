
function reportSocketCalls(report,db,socket){
	socket.on('buySharesFromOrg',function(data){
		console.log('in buySharesFromOrg socket call' + JSON.stringify(data))
		report.buySharesFromOrg(data,function(result){
			socket.emit('buySharesFromOrg',result);
		})
	})
	socket.on('sellSharesFromOrg',function(data){
		console.log('in sellSharesFromOrg socket call')
		report.sellSharesFromOrg(data,function(result){
			socket.emit('sellSharesFromOrg',result);
		})
	})
	socket.on('getReports',function(data){
		var segment = data.segment;
		report.getReports(data,function(result){
			var response = {segment:segment,result:result}
			socket.emit('getReports',response);
		})
	})
	socket.on('getCmp',function(data){
		report.getCmp({cName:data.company},function(result){
			socket.emit('getCmp',result);
		})
	})
	socket.on('getCompanyList',function(data){
		report.getCompanyList(data,function(result){
			socket.emit('getCompanyList',result);
		})
	})
	socket.on('getPortfolios',function(data){
		report.getPortfolios(data,function(result){
			socket.emit('getPortfolios',result);
		})
	})
	socket.on('getPL',function(data){
		report.getPL(data,function(result){
			socket.emit('getPL',result);
		})
	})
	socket.on("addExtraCash",function(data){
		report.addExtraCash(data,function(err,addExtraCashData){
			if(!err)
				socket.emit("addExtraCash",addExtraCashData)
			else
				console.log("error in saving extra cash details")
		})
	})
}
module.exports.reportSocketCalls = reportSocketCalls;