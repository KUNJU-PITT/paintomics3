Ext.define("Ext.data.JsonPStore",{extend:"Ext.data.Store",alias:"store.jsonp",requires:["Ext.data.proxy.JsonP","Ext.data.reader.Json"],constructor:function(config){config=Ext.apply({proxy:{type:"jsonp",reader:"json"}},config);this.callParent([config])}});