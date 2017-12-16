'use strict';
var request = require('request');
var Promise = require("bluebird");
module.exports = {
    info:{
        'actions':[
            function *(){
                console.log("done")
                this.body = {
                    name: 'xxxx',
                    dob: '1967-12-30',
                    sex: 'F'
                };
            }
        ]
    },

    test:{
        'actions':[
            function *(){
                var  options = {
                    　　　　　　　method: 'get',
                                url: 'http://localhost:9002/eureka/apps/step4',
                                headers: {
                                  'Accept': 'application/json'
                                }
                              };
                //异步方法都需要进行Promise处理，才能保证co的正常调用              
                var ret = yield Promise.promisify(request)(options);

                var config = JSON.parse(ret.body)
                //console.log(config.application.instance[0].homePageUrl)

                this.body = {
                    code:1,
                    data:config.application.instance[0].homePageUrl
                };

                return 1;
            }
        ]
    }
}