'use strict';

var uuid = require('uuid');

/**
 * 
 */
module.exports = {
  
  //注册新的用户
  join: function(account, password){
    return uuid.v1().replace(/-/g, '');
  },

  //登录系统,返回SESSION编号
  login: function(account, password){
    return uuid.v1().replace(/-/g, '');
  },

  //退出系统,返回状态
  logout: function(sessionID)
  {
    return 'OK1';
  }  
};