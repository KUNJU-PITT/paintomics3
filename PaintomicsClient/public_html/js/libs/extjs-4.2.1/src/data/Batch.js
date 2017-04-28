Ext.define("Ext.data.Batch",{mixins:{observable:"Ext.util.Observable"},autoStart:false,pauseOnException:false,current:-1,total:0,isRunning:false,isComplete:false,hasException:false,constructor:function(config){var me=this;me.mixins.observable.constructor.call(me,config);me.operations=[];me.exceptions=[]},add:function(operation){this.total++;operation.setBatch(this);this.operations.push(operation);return this},start:function(index){var me=this;if(me.isRunning){return me}me.exceptions.length=0;me.hasException=false;me.isRunning=true;return me.runOperation(Ext.isDefined(index)?index:me.current+1)},retry:function(){return this.start(this.current)},runNextOperation:function(){return this.runOperation(this.current+1)},pause:function(){this.isRunning=false;return this},runOperation:function(index){var me=this,operations=me.operations,operation=operations[index],onProxyReturn;if(operation===undefined){me.isRunning=false;me.isComplete=true;me.fireEvent("complete",me,operations[operations.length-1])}else{me.current=index;onProxyReturn=function(operation){var hasException=operation.hasException();if(hasException){me.hasException=true;me.exceptions.push(operation);me.fireEvent("exception",me,operation)}if(hasException&&me.pauseOnException){me.pause()}else{operation.setCompleted();me.fireEvent("operationcomplete",me,operation);me.runNextOperation()}};operation.setStarted();me.proxy[operation.action](operation,onProxyReturn,me)}return me}});