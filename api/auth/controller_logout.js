'use strict';
var service = require('./service');

module.exports = {
    logout: function *()
    {
        var result = service.logout("XXFDDSS");
        
        this.body = {'code':0, data:{'result': this.text}, 'message':'LOGOUT', 'trigger':''};
        
        return 1;
    }
}

