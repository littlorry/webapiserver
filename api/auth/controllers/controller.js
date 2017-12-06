'use strict';
var service = require('../services/service');

module.exports = {
    join:{
        'name':'signup',
        'description': '111',
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
                var sessionID = service.login("xxx@abc.com", "123456");
                this.body = {code:0, data:this.text, message:'JOIN', trigger:''};
            }
        ]
    }
}


