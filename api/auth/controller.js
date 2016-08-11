'use strict';
var service = require('./service');

module.exports = {
    join:{
        'name':'signup',
        'description': '',
        'version': '',
        'method': 'get',
        'actions':[
            function *(){
                var userID = service.join("", "");
                this.body = {code:0, data:{userid: userID}, message:'JOIN', trigger:''};
            }
        ]
    },

    login:{
        'name':'signin',
        'description': '',
        'version': '',
        'method': 'get',
        'actions':[
            function *(){
                var sessionID = service.login("jiaojf@abc.com", "123456");
                this.body = {code:0, data:this.text, message:'JOIN', trigger:''};
            }
        ]
    },

    demo:{}
}


