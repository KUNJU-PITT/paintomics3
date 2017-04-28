Ext.define("Ext.fx.Queue",{requires:["Ext.util.HashMap"],constructor:function(){this.targets=new Ext.util.HashMap;this.fxQueue={}},getFxDefaults:function(targetId){var target=this.targets.get(targetId);if(target){return target.fxDefaults}return{}},setFxDefaults:function(targetId,obj){var target=this.targets.get(targetId);if(target){target.fxDefaults=Ext.apply(target.fxDefaults||{},obj)}},stopAnimation:function(targetId){var me=this,queue=me.getFxQueue(targetId),ln=queue.length;while(ln){queue[ln-1].end();ln--}},getActiveAnimation:function(targetId){var queue=this.getFxQueue(targetId);return queue&&!!queue.length?queue[0]:false},hasFxBlock:function(targetId){var queue=this.getFxQueue(targetId);return queue&&queue[0]&&queue[0].block},getFxQueue:function(targetId){if(!targetId){return false}var me=this,queue=me.fxQueue[targetId],target=me.targets.get(targetId);if(!target){return false}if(!queue){me.fxQueue[targetId]=[];if(target.type!="element"){target.target.on("destroy",function(){me.fxQueue[targetId]=[]})}}return me.fxQueue[targetId]},queueFx:function(anim){var me=this,target=anim.target,queue,ln;if(!target){return}queue=me.getFxQueue(target.getId());ln=queue.length;if(ln){if(anim.concurrent){anim.paused=false}else{queue[ln-1].on("afteranimate",function(){anim.paused=false})}}else{anim.paused=false}anim.on("afteranimate",function(){Ext.Array.remove(queue,anim);if(queue.length===0){me.targets.remove(anim.target)}if(anim.remove){if(target.type=="element"){var el=Ext.get(target.id);if(el){el.remove()}}}},me,{single:true});queue.push(anim)}});