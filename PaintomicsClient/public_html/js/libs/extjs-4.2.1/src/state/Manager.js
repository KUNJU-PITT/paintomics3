Ext.define("Ext.state.Manager",{singleton:true,requires:["Ext.state.Provider"],constructor:function(){this.provider=new Ext.state.Provider},setProvider:function(stateProvider){this.provider=stateProvider},get:function(key,defaultValue){return this.provider.get(key,defaultValue)},set:function(key,value){this.provider.set(key,value)},clear:function(key){this.provider.clear(key)},getProvider:function(){return this.provider}});