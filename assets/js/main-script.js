$(document).ready(function(){
	var socket = io.connect();
	var userData = {
	  "appName" : "RunDonRun",
	  "email" : "naga@gmail.com",
	  "fbid" : "4998968889dfd",
	  "name" :  "nageswar",
	  "pic" : "not available",
	  "country" : "india",
	  "city" :  "hyd",
	  "deviceToken" : "uiyij1",
	  "gender" :  "male",
	  "os" :  "ANDROID"
	};
	//socket.emit("loginWithMail",userData)
	//socket.emit("updateUserNameInUserLogs",{appName : "RunDonRun"})
	// socket.emit("test",{userId:"12345"})
	/*socket.on("getUserInfo",function(userInfo){
		$("#container").html(userInfo)
	})*/
	// socket.emit("getUserInfo",{_id:"5583cf6ab1d26f731bb60174",appName:"abc"})
	// socket.emit("getUserInfoP",{_id:"5583cf6ab1d26f731bb60174",appName:"abc",powerKey:"coins"})
	//socket.emit("logout",{userId:"5583cf6ab1d26f731bb60174",appName:"abc"})
	  //socket.emit("addPowerToUser",{userId:"55bf23207a8208d727841d41",appName:"RunDonRun",powers:{keys : "10"}})
	// socket.emit("challenge",{userId:"5583cf6ab1d26f731bb60174",appName:"abc",challengeType:"coin collection",challengeTo:"",target:""})
// socket.emit("updatePowersToUser",{userId:"55bf23207a8208d727841d41",appName:"RunDonRun",powerName:"keys",powerValue:100})
})