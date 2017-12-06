'use strict';

var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();

var global = require('./config');
var controller = require('./loader');

app.use(express.static('public'));
//var bodyParser = require('body-parser');
//app.use(bodyParser);

///加载全局的插件
//错误处理
app.use( (err, req, res, next) =>{
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
});

//根据约定自动加载全部的API接口
var list = fs.readdirSync('./api');
for(var i=0; i<list.length; i++)
{
  var name=list[i];

  var entryPath = './' + path.join('api',name,'index.js');

  if(!fs.existsSync(entryPath)) continue;

  var router = express.Router();
  var mod = controller.Load(router, name, entryPath);

  app.use('/' + (mod.name || name), router);

  console.log('[/' + (mod.name || name) + ']', '模块加载成功=>(', mod.version || '1.0.0', ')', mod.description ||'');
}


//启动服务器
var server = app.listen(global.port,  ()=>{
  var host = server.address().address;
  var port = server.address().port;

  console.log(global.description, '服务启动完成，正在监听端口:', port);
});

