'use strict';

var log4js = require('log4js');

log4js.configure({
    appenders:[
        {type: 'console'},
        {type: 'file', filename: __dirname + "/logs/login.log", category: 'login'},
        {type: 'file', filename: __dirname + "/logs/join.log", category: 'join'},
        {type: 'file', filename: __dirname + "/logs/request.log", category: 'request'},
        {type: 'file', filename: __dirname + "/logs/exp.log", category: 'exp'}
    ]
});

module.exports = {
    login: log4js.getLogger('login'),
    join: log4js.getLogger('join'),
    request: log4js.getLogger('request'),
    exp: log4js.getLogger('exp')
};