'use strict';
var fs = require('fs');
var Promise = require("bluebird");

module.exports = {
  "name": "passport",
  "description": "控制系统的安全访问",
  "version": "1.0.2",
  "controllers":[
    require('./controller'),
    require('./controller_logout')
  ],
  "events":{
    "onBeforeAction": function *(){
      this.text = yield obj().get();
      return 1;
    }
  }
};

var obj = (function(){
    var variable;
     
    return {
        get: function(){
            if(variable){
                return Promise.resolve(variable);
            }
            
            return Promise.promisify(fs.readFile)(__dirname + "/../../public/demo.txt", "utf8");
        },
        set: function(v){
            return Promise.resolve(variable = v);
        }
    }
});