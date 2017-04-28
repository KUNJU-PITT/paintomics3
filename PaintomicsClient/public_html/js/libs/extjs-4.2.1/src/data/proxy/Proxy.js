Ext.define("Ext.data.proxy.Proxy",{alias:"proxy.proxy",alternateClassName:["Ext.data.DataProxy","Ext.data.Proxy"],requires:["Ext.data.reader.Json","Ext.data.writer.Json"],uses:["Ext.data.Batch","Ext.data.Operation","Ext.data.Model"],mixins:{observable:"Ext.util.Observable"},batchOrder:"create,update,destroy",batchActions:true,defaultReaderType:"json",defaultWriterType:"json",isProxy:true,isSynchronous:false,constructor:function(config){var me=this;config=config||{};me.proxyConfig=config;me.mixins.observable.constructor.call(me,config);if(me.model!==undefined&&!(me.model instanceof Ext.data.Model)){me.setModel(me.model)}else{if(me.reader){me.setReader(me.reader)}if(me.writer){me.setWriter(me.writer)}}},setModel:function(model,setOnStore){var me=this;me.model=Ext.ModelManager.getModel(model);me.setReader(this.reader);me.setWriter(this.writer);if(setOnStore&&me.store){me.store.setModel(me.model)}},getModel:function(){return this.model},setReader:function(reader){var me=this,needsCopy=true,current=me.reader;if(reader===undefined||typeof reader=="string"){reader={type:reader};needsCopy=false}if(reader.isReader){reader.setModel(me.model)}else{if(needsCopy){reader=Ext.apply({},reader)}Ext.applyIf(reader,{proxy:me,model:me.model,type:me.defaultReaderType});reader=Ext.createByAlias("reader."+reader.type,reader)}if(reader!==current&&reader.onMetaChange){reader.onMetaChange=Ext.Function.createSequence(reader.onMetaChange,this.onMetaChange,this)}me.reader=reader;return me.reader},getReader:function(){return this.reader},onMetaChange:function(meta){this.fireEvent("metachange",this,meta)},setWriter:function(writer){var me=this,needsCopy=true;if(writer===undefined||typeof writer=="string"){writer={type:writer};needsCopy=false}if(!writer.isWriter){if(needsCopy){writer=Ext.apply({},writer)}Ext.applyIf(writer,{model:me.model,type:me.defaultWriterType});writer=Ext.createByAlias("writer."+writer.type,writer)}me.writer=writer;return me.writer},getWriter:function(){return this.writer},create:Ext.emptyFn,read:Ext.emptyFn,update:Ext.emptyFn,destroy:Ext.emptyFn,batch:function(options,listeners){var me=this,useBatch=me.batchActions,batch,records,actions,aLen,action,a,r,rLen,record;if(options.operations===undefined){options={operations:options,listeners:listeners}}if(options.batch){if(Ext.isDefined(options.batch.runOperation)){batch=Ext.applyIf(options.batch,{proxy:me,listeners:{}})}}else{options.batch={proxy:me,listeners:options.listeners||{}}}if(!batch){batch=new Ext.data.Batch(options.batch)}batch.on("complete",Ext.bind(me.onBatchComplete,me,[options],0));actions=me.batchOrder.split(",");aLen=actions.length;for(a=0;a<aLen;a++){action=actions[a];records=options.operations[action];if(records){if(useBatch){batch.add(new Ext.data.Operation({action:action,records:records}))}else{rLen=records.length;for(r=0;r<rLen;r++){record=records[r];batch.add(new Ext.data.Operation({action:action,records:[record]}))}}}}batch.start();return batch},onBatchComplete:function(batchOptions,batch){var scope=batchOptions.scope||this;if(batch.hasException){if(Ext.isFunction(batchOptions.failure)){Ext.callback(batchOptions.failure,scope,[batch,batchOptions])}}else if(Ext.isFunction(batchOptions.success)){Ext.callback(batchOptions.success,scope,[batch,batchOptions])}if(Ext.isFunction(batchOptions.callback)){Ext.callback(batchOptions.callback,scope,[batch,batchOptions])}},clone:function(){return new this.self(this.proxyConfig)}});