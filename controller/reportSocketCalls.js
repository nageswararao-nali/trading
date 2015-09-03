
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


	
}
module.exports.reportSocketCalls = reportSocketCalls;