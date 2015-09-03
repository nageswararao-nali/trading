var userModule = require('../model/user').userModule;
function userSocketCalls(db,socket){
	var user = new userModule(db,socket);
	var disconnectuserId, appName ;
}
module.exports.userSocketCalls = userSocketCalls;