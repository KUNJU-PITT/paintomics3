Ext.define("Ext.util.Memento",function(){function captureOne(src,target,prop,prefix){src[prefix?prefix+prop:prop]=target[prop]}function removeOne(src,target,prop){delete src[prop]}function restoreOne(src,target,prop,prefix){var name=prefix?prefix+prop:prop,value=src[name];if(value||src.hasOwnProperty(name)){restoreValue(target,prop,value)}}function restoreValue(target,prop,value){if(Ext.isDefined(value)){target[prop]=value}else{delete target[prop]}}function doMany(doOne,src,target,props,prefix){if(src){if(Ext.isArray(props)){var p,pLen=props.length;for(p=0;p<pLen;p++){doOne(src,target,props[p],prefix)}}else{doOne(src,target,props,prefix)}}}return{data:null,target:null,constructor:function(target,props){if(target){this.target=target;if(props){this.capture(props)}}},capture:function(props,target,prefix){var me=this;doMany(captureOne,me.data||(me.data={}),target||me.target,props,prefix)},remove:function(props){doMany(removeOne,this.data,null,props)},restore:function(props,clear,target,prefix){doMany(restoreOne,this.data,target||this.target,props,prefix);if(clear!==false){this.remove(props)}},restoreAll:function(clear,target){var me=this,t=target||this.target,data=me.data,prop;for(prop in data){if(data.hasOwnProperty(prop)){restoreValue(t,prop,data[prop])}}if(clear!==false){delete me.data}}}}());