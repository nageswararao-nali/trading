var mongoose = require('mongoose');
var d1 = new Date();
//mongoose.connect('mongodb://localhost/ServerModules',function(err, db){
mongoose.connect('mongodb://192.168.0.148:27017/Trading',function(err, db){
//mongoose.connect('mongodb://54.254.193.61:27017/ServerModules',function(err, db){
// mongoose.connect('mongodb://192.168.0.148:27017/ServerModules',function(err, db){

  if(err)
    console.log(err)
  else{
    var d2 = new Date();
    console.log("time taken to connect to db is " + (d2-d1))
  }
});

exports.leaderBoard = mongoose.model('leaderBoard' , {
      "appName" : String,
      "leaderBoardName" : String
  },"leaderBoard")

exports.AppsList = mongoose.model('AppsList' , {
      "appName" : String
  },"AppsList")

exports.AppSettings = mongoose.model('AppSettings',{
	"appName" : String,
	"settings" : Object,
	"lastUpdate" : Date
},'AppSettings')
exports.generalSettings = mongoose.model('generalSettings',{
	"appName" : String,
	"userId"  : String,
	"settings" : Object,
	"lastUpdate" : Date
},'generalSettings')
exports.UserData = mongoose.model('UserData',{
  "appName" : String,
  "email" : String,
  "fbid" : String,
  "name" :  String,
  "pic" : String,
  "country" : String,
  "city" :  String,
  "deviceToken" : String,
  "mobileId" : String,
  "mobileModel" : String,
  "gender" :  String,
  "os" :  String,
  "settings" :  Object,
  "powers" : Array,
  "friendsList" : Array,
  "invitedMails" : Array,
  "status" : String,
  "appInstalledDate" : Date,
  "lastLogin" : Date
},'UserData');
exports.UserPowers = mongoose.model('UserPowers',{
   "appName" : String,
   "powers" : Array
},'UserPowers')
exports.UserLogs = mongoose.model('UserLogs',{
  "appName" : String,
  "userId" :  String,
  "name" : String,
  "logs" : Array // {loginTime:"",logoutTime:""}
},'UserLogs');
exports.AppChallenges = mongoose.model('AppChallenges',{
  "appName" : String,
  "challengeType" : String,
  "target" :  String,
  "bonusType" :  String,
  "bonus" : String,
  "lastUpdate" : Date,
  "createDate" : Date 
},'AppChallenges');

exports.UserChats = mongoose.model('UserChats',{
  "appName" : String,
  "chatId" : String,
  "userId" : String,
  "groupName" : String,
  "timeStamp" : Date,
  "message" : String,
  "chatType" : String,
  "likesCount" : Number,
  "unLikesCount" : Number,
  "spoiler" : Boolean,
  "toUserId" : String

},'UserChats');

exports.BlockedUsers = mongoose.model('BlockedUsers',{
  'appName' : String,
  'blockedBy' : String,
  'blockedList' : Array,
  'groupName' : String,
  'chatType' : String
},'BlockedUsers')


exports.P12FileList = mongoose.model('P12FileList',{
  "appName":String,
  "p12FileName":String
},'P12FileList');

exports.SetActiveP12File = mongoose.model('SetActiveP12File' , {
      "appName" : String,
      "modeName" : String,
      "fileName" : String
  },"SetActiveP12File")

exports.SetDevelopmentOrProductionMode = mongoose.model('SetDevelopmentOrProductionMode' , {
      "appName" : String,
      "activeModeName" : String
  },"SetDevelopmentOrProductionMode")

exports.SetPushNotificationSettings = mongoose.model('SetPushNotificationSettings' , {
      "appName" : String,
      "settingsJson" : Object
  },"SetPushNotificationSettings")

exports.setInactiveTime = mongoose.model('setInactiveTime' , {
      "appName" : String,
      "time" : Number
  },"setInactiveTime")

exports.PushMessages = mongoose.model('PushMessages' , {
      "appName" : String,
      "osType" : String,
      "message" : String,
      "timeStamp" : Date
  },"PushMessages")

exports.OnlineUsers = mongoose.model('OnlineUsers',{
  "appName" : String,
  "usersCount" : Number,
  "createDate" : Date
},'OnlineUsers')
exports.UsersTimeSpent = mongoose.model('UsersTimeSpent',{
  "appName" : String,
  "timeSpent" : Number,
  "createDate" : Date
},'UsersTimeSpent')

exports.BonusTypes = mongoose.model('BonusTypes' , {
      "appName" : String,
      "bonusType" : String
  },"BonusTypes")

exports.BonusInfo = mongoose.model('BonusInfo' , {
      "appName" : String,
      "bonusType" : String,
      "bonusPowerName" : String,
      "bonusValue" : String
  },"BonusInfo")

exports.PurchaseInfo = mongoose.model('PurchaseInfo' , {
      "appName" : String,
      "itemName" : String,
      "availability" : String,
      "price" : Array,
      "ncount" : Number,
      "saleFrom" : Date,
      "saleTill" : Date,
      "discountFrom" : Date,
      "discountTill" : Date,
      "level" : String,
      "description" : String,
      "graphics" : Object
},"PurchaseInfo")

exports.LinksData = mongoose.model('LinksData',{
  'appName':String,
  'category':String,
  'links' : Array
},'LinksData')

exports.UserLinksData = mongoose.model('UserLinksData',{
  'email':String,
  'category':String,
  'links' : Array
},'UserLinksData')

exports.SessionPowerInfo = mongoose.model('SessionPowerInfo',{
  "appName" : String,
  "userId" : String,
  "name": String,
  "level":Number,
  "powerName": String, 
  "givenPowerValue": Number,
  "earnedPowerValue": Number,
  "createDate" : Date
},'SessionPowerInfo')

exports.UserPowerStatus = mongoose.model('UserPowerStatus',{
  "appName" : String,
  "userId" : String,
  "name": String,
  "powerName": String, 
  "PowerValue": Number,
  "level" : Number,
  "selectedOption": String,
  "createDate" : Date
},'UserPowerStatus')

exports.UserPurchaseInfo = mongoose.model('UserPurchaseInfo',{
  "appName" : String,
  "userId" : String,
  "name": String,
  "priceTypeName": String, 
  "itemCount": Number,
  "itemName": String,
  "priceTypeValue":Number,
  "createDate" : Date
},'UserPurchaseInfo')

exports.LevelCheckPoints = mongoose.model('LevelCheckPoints',{
  "appName" : String,
  "level": Number,
  "checkPointCount":Number,
  "createDate" : Date
},'LevelCheckPoints')

exports.CheckPointPowers = mongoose.model('CheckPointPowers',{
  "appName" : String,
  "level": Number,
  "checkPoint":Number,
  "powerName" : String,
  "powerValue" : Number,
  "createDate" : Date
},'CheckPointPowers')

