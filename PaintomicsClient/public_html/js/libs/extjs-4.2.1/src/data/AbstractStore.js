Ext.define("Ext.data.AbstractStore",{requires:["Ext.util.MixedCollection","Ext.data.proxy.Proxy","Ext.data.Operation","Ext.util.Filter"],mixins:{observable:"Ext.util.Observable",sortable:"Ext.util.Sortable"},statics:{create:function(store){if(!store.isStore){if(!store.type){store.type="store"}store=Ext.createByAlias("store."+store.type,store)}return store}},onClassExtended:function(cls,data,hooks){var model=data.model,onBeforeClassCreated;if(typeof model=="string"){onBeforeClassCreated=hooks.onBeforeCreated;hooks.onBeforeCreated=function(){var me=this,args=arguments;Ext.require(model,function(){onBeforeClassCreated.apply(me,args)})}}},remoteSort:false,remoteFilter:false,autoLoad:undefined,autoSync:false,batchUpdateMode:"operation",filterOnLoad:true,sortOnLoad:true,implicitModel:false,defaultProxyType:"memory",isDestroyed:false,isStore:true,sortRoot:"data",constructor:function(config){var me=this,filters;Ext.apply(me,config);me.removed=[];me.mixins.observable.constructor.apply(me,arguments);var configModel=me.model;me.model=Ext.ModelManager.getModel(me.model);Ext.applyIf(me,{modelDefaults:null});if(!me.model&&me.fields){me.model=Ext.define("Ext.data.Store.ImplicitModel-"+(me.storeId||Ext.id()),{extend:"Ext.data.Model",fields:me.fields,proxy:me.proxy||me.defaultProxyType});delete me.fields;me.implicitModel=true}if(!me.model&&me.useModelWarning!==false){var logMsg=[Ext.getClassName(me)||"Store"," created with no model."];if(typeof configModel==="string"){logMsg.push(" The name '",configModel,"'"," does not correspond to a valid model.")}Ext.log.warn(logMsg.join(""))}me.setProxy(me.proxy||me.model.getProxy());if(!me.disableMetaChangeEvent){me.proxy.on("metachange",me.onMetaChange,me)}if(me.id&&!me.storeId){me.storeId=me.id;delete me.id}if(me.storeId){Ext.data.StoreManager.register(me)}me.mixins.sortable.initSortable.call(me);filters=me.decodeFilters(me.filters);me.filters=new Ext.util.MixedCollection;me.filters.addAll(filters)},setProxy:function(proxy){var me=this;if(proxy instanceof Ext.data.proxy.Proxy){proxy.setModel(me.model)}else{if(Ext.isString(proxy)){proxy={type:proxy}}Ext.applyIf(proxy,{model:me.model});proxy=Ext.createByAlias("proxy."+proxy.type,proxy)}me.proxy=proxy;return me.proxy},getProxy:function(){return this.proxy},onMetaChange:function(proxy,meta){this.fireEvent("metachange",this,meta)},create:function(data,options){var me=this,instance=Ext.ModelManager.create(Ext.applyIf(data,me.modelDefaults),me.model.modelName),operation;options=options||{};Ext.applyIf(options,{action:"create",records:[instance]});operation=new Ext.data.Operation(options);me.proxy.create(operation,me.onProxyWrite,me);return instance},read:function(){return this.load.apply(this,arguments)},update:function(options){var me=this,operation;options=options||{};Ext.applyIf(options,{action:"update",records:me.getUpdatedRecords()});operation=new Ext.data.Operation(options);return me.proxy.update(operation,me.onProxyWrite,me)},onProxyWrite:function(operation){var me=this,success=operation.wasSuccessful(),records=operation.getRecords();switch(operation.action){case"create":me.onCreateRecords(records,operation,success);break;case"update":me.onUpdateRecords(records,operation,success);break;case"destroy":me.onDestroyRecords(records,operation,success);break}if(success){me.fireEvent("write",me,operation);me.fireEvent("datachanged",me);me.fireEvent("refresh",me)}Ext.callback(operation.callback,operation.scope||me,[records,operation,success])},onCreateRecords:Ext.emptyFn,onUpdateRecords:Ext.emptyFn,onDestroyRecords:function(records,operation,success){if(success){this.removed=[]}},destroy:function(options){var me=this,operation;options=options||{};Ext.applyIf(options,{action:"destroy",records:me.getRemovedRecords()});operation=new Ext.data.Operation(options);return me.proxy.destroy(operation,me.onProxyWrite,me)},onBatchOperationComplete:function(batch,operation){return this.onProxyWrite(operation)},onBatchComplete:function(batch,operation){var me=this,operations=batch.operations,length=operations.length,i;me.suspendEvents();for(i=0;i<length;i++){me.onProxyWrite(operations[i])}me.resumeEvents();me.fireEvent("datachanged",me);me.fireEvent("refresh",me)},onBatchException:function(batch,operation){},filterNew:function(item){return item.phantom===true&&item.isValid()},getNewRecords:function(){return[]},getUpdatedRecords:function(){return[]},getModifiedRecords:function(){return[].concat(this.getNewRecords(),this.getUpdatedRecords())},filterUpdated:function(item){return item.dirty===true&&item.phantom!==true&&item.isValid()},getRemovedRecords:function(){return this.removed},filter:function(filters,value){},decodeFilters:function(filters){if(!Ext.isArray(filters)){if(filters===undefined){filters=[]}else{filters=[filters]}}var length=filters.length,Filter=Ext.util.Filter,config,i;for(i=0;i<length;i++){config=filters[i];if(!(config instanceof Filter)){Ext.apply(config,{root:"data"});if(config.fn){config.filterFn=config.fn}if(typeof config=="function"){config={filterFn:config}}filters[i]=new Filter(config)}}return filters},clearFilter:function(supressEvent){},isFiltered:function(){},filterBy:function(fn,scope){},sync:function(options){var me=this,operations={},toCreate=me.getNewRecords(),toUpdate=me.getUpdatedRecords(),toDestroy=me.getRemovedRecords(),needsSync=false;if(toCreate.length>0){operations.create=toCreate;needsSync=true}if(toUpdate.length>0){operations.update=toUpdate;needsSync=true}if(toDestroy.length>0){operations.destroy=toDestroy;needsSync=true}if(needsSync&&me.fireEvent("beforesync",operations)!==false){options=options||{};me.proxy.batch(Ext.apply(options,{operations:operations,listeners:me.getBatchListeners()}))}return me},getBatchListeners:function(){var me=this,listeners={scope:me,exception:me.onBatchException};if(me.batchUpdateMode=="operation"){listeners.operationcomplete=me.onBatchOperationComplete}else{listeners.complete=me.onBatchComplete}return listeners},save:function(){return this.sync.apply(this,arguments)},load:function(options){var me=this,operation;options=Ext.apply({action:"read",filters:me.filters.items,sorters:me.getSorters()},options);me.lastOptions=options;operation=new Ext.data.Operation(options);if(me.fireEvent("beforeload",me,operation)!==false){me.loading=true;me.proxy.read(operation,me.onProxyLoad,me)}return me},reload:function(options){return this.load(Ext.apply(this.lastOptions,options))},afterEdit:function(record,modifiedFieldNames){var me=this,i,shouldSync;if(me.autoSync&&!me.autoSyncSuspended){for(i=modifiedFieldNames.length;i--;){if(record.fields.get(modifiedFieldNames[i]).persist){shouldSync=true;break}}if(shouldSync){me.sync()}}me.onUpdate(record,Ext.data.Model.EDIT,modifiedFieldNames);me.fireEvent("update",me,record,Ext.data.Model.EDIT,modifiedFieldNames)},afterReject:function(record){this.onUpdate(record,Ext.data.Model.REJECT,null);this.fireEvent("update",this,record,Ext.data.Model.REJECT,null)},afterCommit:function(record,modifiedFieldNames){if(!modifiedFieldNames){modifiedFieldNames=null}this.onUpdate(record,Ext.data.Model.COMMIT,modifiedFieldNames);this.fireEvent("update",this,record,Ext.data.Model.COMMIT,modifiedFieldNames)},onUpdate:Ext.emptyFn,onIdChanged:function(model,oldId,newId,oldInternalId){this.fireEvent("idchanged",this,model,oldId,newId,oldInternalId)},destroyStore:function(){var implicitModelName,me=this;if(!me.isDestroyed){me.clearListeners();if(me.storeId){Ext.data.StoreManager.unregister(me)}me.clearData();me.data=me.tree=me.sorters=me.filters=me.groupers=null;if(me.reader){me.reader.destroyReader()}me.proxy=me.reader=me.writer=null;me.isDestroyed=true;if(me.implicitModel){implicitModelName=Ext.getClassName(me.model);Ext.undefine(implicitModelName);Ext.ModelManager.unregisterType(implicitModelName)}else{me.model=null}}},getState:function(){var me=this,hasState,result,hasGroupers=!!me.groupers,groupers=[],sorters=[],filters=[];if(hasGroupers){me.groupers.each(function(g){groupers[groupers.length]=g.serialize();hasState=true})}if(me.sorters){me.sorters.each(function(s){if(hasGroupers&&!me.groupers.contains(s)){sorters[sorters.length]=s.serialize();hasState=true}})}if(me.filters&&me.statefulFilters){me.filters.each(function(f){filters[filters.length]=f.serialize();hasState=true})}if(hasState){result={};if(groupers.length){result.groupers=groupers}if(sorters.length){result.sorters=sorters}if(filters.length){result.filters=filters}return result}},applyState:function(state){var me=this,hasSorters=!!me.sorters,hasGroupers=!!me.groupers,hasFilters=!!me.filters,locallySorted;if(hasGroupers&&state.groupers){me.groupers.clear();me.groupers.addAll(me.decodeGroupers(state.groupers))}if(hasSorters&&state.sorters){me.sorters.clear();me.sorters.addAll(me.decodeSorters(state.sorters))}if(hasFilters&&state.filters){me.filters.clear();me.filters.addAll(me.decodeFilters(state.filters))}if(hasSorters&&hasGroupers){me.sorters.insert(0,me.groupers.getRange())}if(me.autoLoad&&(me.remoteSort||me.remoteGroup||me.remoteFilter)){if(me.autoLoad===true){me.reload()}else{me.reload(me.autoLoad)}}if(hasFilters&&me.filters.length&&!me.remoteFilter){me.filter();locallySorted=me.sortOnFilter}if(hasSorters&&me.sorters.length&&!me.remoteSort&&!locallySorted){me.sort()}},doSort:function(sorterFn){var me=this;if(me.remoteSort){me.load()}else{me.data.sortBy(sorterFn);me.fireEvent("datachanged",me);me.fireEvent("refresh",me)}me.fireEvent("sort",me,me.sorters.getRange())},clearData:Ext.emptyFn,getCount:Ext.emptyFn,getById:Ext.emptyFn,removeAll:Ext.emptyFn,isLoading:function(){return!!this.loading},suspendAutoSync:function(){this.autoSyncSuspended=true},resumeAutoSync:function(){this.autoSyncSuspended=false}});