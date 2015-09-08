
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
		report.getReports({pId:data.portfolio},function(result){
			socket.emit('getReports',result);
		})
	})
	socket.on('getCmp',function(data){
		report.getCmp({cName:data.company},function(result){
			socket.emit('getCmp',result);
		})
	})
	socket.on('getCompanyList',function(data){
		report.getCompanyList({},function(result){
			socket.emit('getCompanyList',result);
		})
	})
	
	


	
}
module.exports.reportSocketCalls = reportSocketCalls;