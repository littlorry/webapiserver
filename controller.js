'use strict';

var express = require('express');
var co = require('co');

var log = require('./log');

module.exports = {
    Load: function(name, path){
        var config =  require(path);

        name = config.name || name;

        var mod = {
            "name": name, 
            "description": config.description,
            "version": config.version,
            "router": express.Router(),
            "controller": config
            };
        
        var controller = new Controller(mod);

        var controllers = config.controllers || [];
        for(var i=0; i<controllers.length; i++) {
            var ctr = controllers[i] || {};
            for(var key in ctr){
                var action = {'name': key, 'method': 'get', 'actions':[]};
                if(typeof(ctr[key]) == "function"){
                    action.actions.push(ctr[key]);
                }
                else if(typeof(ctr[key]) == "object"){

                    action.name = ctr[key].name || action.name;
                    action.method = ctr[key].method || action.method;
                    action.actions = ctr[key].actions || action.actions;
                }
                else{
                    continue;
                }

                controller.registAction(action);
            } 
            
        }

        return mod;
    }
};

function Controller(mod)
{
    var router = mod.router;

    //支持AOP[插件before, after]
    this.registAction = function(action){
        var name = action.name;
        var method = action.method;
        var actions = action.actions;
        if(actions.length == 0){
            console.log('\t',name, method, "无任何处理,注册失败");
            return;
        }

        if(method == "get"){
            router.get("/" + name, (req, res)=>{CallAction(action, req, res);});
        }
        else if(method == "post"){
            router.post("/" + name, (req, res)=>{CallAction(action, req, res);});
        }
        else{
            console.log('\t',name, method, "无效的方法，注册失败");
            return;
        }

        console.log('\t',name, method, "注册成功");
    }

    function CallAction(action, req, res){
        //这里使用CO来控制同步操作
        co(function *(){
            var name = action.name;
            var method = action.method;
            var actions = action.actions;

            log.request.info(mod.name + "." + name + " [" + method + "]");

            var events = mod.controller.events || {};

            var context = {'controller':mod.controller, 'req':req, 'res': res, 'body':{}};

            action.context = context;
            var retStatus = 0;

            //before
            var event = events.onBeforeAction || null;

            if(typeof(event) == "function"){
                retStatus = yield event.apply(context) || 0;
            }
            
            //call
            if(retStatus>=0){
                for(var i=0; i<actions.length; i++){
                    retStatus = yield actions[i].apply(context) || 0;
                    if(retStatus<0) break;
                }
            }

            //after
            event = events.onAfterAction || null;
            if(typeof(event) == "function"){
                yield event.apply(context);
            }

            console.log("request is ending.")
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