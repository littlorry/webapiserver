'use strict';

var co = require('co');
var log = require('./log');

module.exports = {
    Load: function(router, name, path){
        var config =  require(path);

        name = config.name || name;

        var mod = {
            "name": name, 
            "description": config.description,
            "version": config.version,
            "router": router,
            "config": config
            };

        //记录使用   
        var info= {"module":mod, "actions":[]};

        var api = new API(mod);

        var controllers = config.controllers || [];
        for(var i=0; i<controllers.length; i++) {
            var ctr = controllers[i] || {};
            for(var key in ctr){

                var action = {};
                
                //如果为一个函数就直接绑定
                if(typeof(ctr[key]) == "function"){
                    action.name = key;
                    action.method = 'get';
                    action.description = '无描述';
                    action.actions.push(ctr[key]);
                }
                //如果为一个对象就解析出内容
                else if(typeof(ctr[key]) == "object"){
                    action.name = ctr[key].name || key;
                    action.method = ctr[key].method || 'get';
                    action.description = ctr[key].description || '无描述';
                    action.actions = ctr[key].actions || [];
                }
                else{
                    continue;
                }
                
                api.registAction(action);

                //记录使用
                info.actions.push(action);
            } 
            
        }

        //记录使用
        router["info"] = info;


        return mod;
    }
};

function API(mod)
{
    //支持AOP[插件before, after]
    this.registAction = function(action){
        var name = action.name;
        var method = action.method || "get";
        var actions = action.actions;
        if(name.length == 0) return;
        if(actions.length == 0) return;

        var url = "/" + name;
        var proc = (req, res)=>{ProcessRequest(action, req, res);}

        switch(method){
            case "get":
                mod.router.get(url, proc);
                break;
            case "post":
                mod.router.post(url, proc);
                break;
        }
    }

    //处理模块的请求
    function ProcessRequest(action, req, res){
        console.log("当前正在访问:模块/接口=>" + mod.name + "/" + action.name);
        
        //这里使用CO来控制同步操作
        co(function *(){
            var name = action.name;
            var method = action.method;
            var actions = action.actions;

            var events = mod.config.events || {};

            var context = {'config':mod.config, 'req':req, 'res': res, 'body':{}};

            action.context = context;
            var retStatus = 0;

            //fire before events
            var event = events.onBeforeAction || null;

            if(typeof(event) == "function") retStatus = yield event.apply(context) || 0;
            
            //call main processing
            if(retStatus>=0){
                for(var i=0; i<actions.length; i++){
                    retStatus = yield actions[i].apply(context) || 0;
                    if(retStatus<0) break;
                }
            }

            //fire after events
            event = events.onAfterAction || null;
            if(typeof(event) == "function") yield event.apply(context);
        }).then(()=>{
            var _this = arguments[0];

            res.status(200).json({
                "code": _this.context.body.code || 0, 
                "data": _this.context.body.data || {}
            });

        }).catch((err)=>{
            log.exp.info(err);
            
            var _this = arguments[0];
            res.status(500).json({
                "code":(_this.context.body.code || -1), 
                "data":{}, 
                "message":err, 
                "trigger":''
            });
        });
    }
}