'use strict';

var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();

var global = require('./config');
var loader = require('./loader');

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

var routers = [];
//根据约定自动加载全部的API接口
var list = fs.readdirSync('./api');
for(var i=0; i<list.length; i++)
{
  //文件夹名称（默认的模块名称）
  var name=list[i];

  var indexJS = './' + path.join('api',name,'index.js');

  if(!fs.existsSync(indexJS)) continue;

  //定义一个模块，并初始化一个新的路由
  var mod = loader.Load(express.Router(), name, indexJS);

  //附加该模块
  app.use('/' + (mod.name || name), mod.router);

  console.log('[/' + (mod.name || name) + ']', '模块加载成功=>(', mod.version || '1.0.0', ')', mod.description ||'');
  
  //记录
  routers.push({'name':(mod.name || name),'router':mod.router});
}

//系统情况输出
app.use('/info', function(req, res){
  var rets = [];
  for(var i=0; i<routers.length; i++){

    var name=routers[i].name;
    var info = routers[i].router.info;
  
    var lst = [];
    for(var j=0; j<info.actions.length; j++){
      var action = info.actions[j];
      lst.push({"name":action.name, "description":action.description, "method":action.method});
    }

    rets.push({
      "module": name,
      "description": info.module.description,
      "actions": lst
    });
  }
  res.send(rets);
});

//启动服务器
var server = app.listen(global.port,  ()=>{
  var host = server.address().address;
  var port = server.address().port;

  console.log(global.description, '服务启动完成，正在监听端口:', port);
});

