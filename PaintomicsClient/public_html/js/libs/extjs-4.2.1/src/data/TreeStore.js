Ext.define("Ext.data.TreeStore",{extend:"Ext.data.AbstractStore",alias:"store.tree",requires:["Ext.util.Sorter","Ext.data.Tree","Ext.data.NodeInterface"],clearOnLoad:true,clearRemovedOnLoad:true,nodeParam:"node",defaultRootId:"root",defaultRootText:"Root",defaultRootProperty:"children",rootProperty:"children",fillCount:0,folderSort:false,constructor:function(config){var me=this,root,fields,defaultRoot;config=Ext.apply({},config);fields=config.fields||me.fields;if(!fields){config.fields=[{name:"text",type:"string"}];defaultRoot=config.defaultRootProperty||me.defaultRootProperty;if(defaultRoot!==me.defaultRootProperty){config.fields.push({name:defaultRoot,type:"auto",defaultValue:null,persist:false})}}me.callParent([config]);me.tree=new Ext.data.Tree;me.tree.treeStore=me;me.tree.on({scope:me,remove:me.onNodeRemove,beforeexpand:me.onBeforeNodeExpand,append:me.onNodeAdded,insert:me.onNodeAdded,sort:me.onNodeSort});me.onBeforeSort();root=me.root;if(root){delete me.root;me.setRootNode(root)}if(Ext.isDefined(me.nodeParameter)){if(Ext.isDefined(Ext.global.console)){Ext.global.console.warn("Ext.data.TreeStore: nodeParameter has been deprecated. Please use nodeParam instead.")}me.nodeParam=me.nodeParameter;delete me.nodeParameter}},setProxy:function(proxy){var reader,needsRoot;if(proxy instanceof Ext.data.proxy.Proxy){needsRoot=Ext.isEmpty(proxy.getReader().root)}else if(Ext.isString(proxy)){needsRoot=true}else{reader=proxy.reader;needsRoot=!(reader&&!Ext.isEmpty(reader.root))}proxy=this.callParent(arguments);proxy.idParam=this.nodeParam;if(needsRoot){reader=proxy.getReader();reader.root=this.defaultRootProperty;reader.buildExtractors(true)}return proxy},onBeforeSort:function(){if(this.folderSort){this.sort({property:"leaf",direction:"ASC"},"prepend",false)}},onBeforeNodeExpand:function(node,callback,scope,args){var me=this,reader,dataRoot,data,callbackArgs;if(node.isLoaded()){callbackArgs=[node.childNodes];if(args){callbackArgs.push.apply(callbackArgs,args)}Ext.callback(callback,scope||node,callbackArgs)}else if(dataRoot=data=(node.raw||node[node.persistenceProperty])[(reader=me.getProxy().getReader()).root]){me.fillNode(node,reader.extractData(dataRoot));delete data[reader.root];callbackArgs=[node.childNodes];if(args){callbackArgs.push.apply(callbackArgs,args)}Ext.callback(callback,scope||node,callbackArgs)}else if(node.isLoading()){me.on("load",function(){callbackArgs=[node.childNodes];if(args){callbackArgs.push.apply(callbackArgs,args)}Ext.callback(callback,scope||node,callbackArgs)},me,{single:true})}else{me.read({node:node,callback:function(){delete me.lastOptions.callback;callbackArgs=[node.childNodes];if(args){callbackArgs.push.apply(callbackArgs,args)}Ext.callback(callback,scope||node,callbackArgs)}})}},getNewRecords:function(){return Ext.Array.filter(this.tree.flatten(),this.filterNew)},getUpdatedRecords:function(){return Ext.Array.filter(this.tree.flatten(),this.filterUpdated)},onNodeRemove:function(parent,node,isMove){var me=this;node.unjoin(me);if(!node.phantom&&!isMove){Ext.Array.include(me.removed,node)}if(me.autoSync&&!me.autoSyncSuspended&&!isMove){me.sync()}},onNodeAdded:function(parent,node){var me=this,proxy=me.getProxy(),reader=proxy.getReader(),data=node.raw||node[node.persistenceProperty],dataRoot;Ext.Array.remove(me.removed,node);node.join(me);if(!node.isLeaf()&&!me.lazyFill){dataRoot=reader.getRoot(data);if(dataRoot){me.fillNode(node,reader.extractData(dataRoot));delete data[reader.root]}}if(me.autoSync&&!me.autoSyncSuspended&&(node.phantom||node.dirty)){me.sync()}},onNodeSort:function(){if(this.autoSync&&!this.autoSyncSuspended){this.sync()}},setRootNode:function(root,preventLoad){var me=this,model=me.model,idProperty=model.prototype.idProperty;root=root||{};if(!root.isModel){root=Ext.apply({},root);Ext.applyIf(root,{id:me.defaultRootId,text:me.defaultRootText,allowDrag:false});if(root[idProperty]===undefined){root[idProperty]=me.defaultRootId}Ext.data.NodeInterface.decorate(model);root=Ext.ModelManager.create(root,model)}else if(root.isModel&&!root.isNode){Ext.data.NodeInterface.decorate(model)}me.getProxy().getReader().buildExtractors(true);me.tree.setRootNode(root);if(preventLoad!==true&&!root.isLoaded()&&(me.autoLoad===true||root.isExpanded())){root.data.expanded=false;root.expand()}return root},getRootNode:function(){return this.tree.getRootNode()},getNodeById:function(id){return this.tree.getNodeById(id)},getById:function(id){return this.getNodeById(id)},load:function(options){options=options||{};options.params=options.params||{};var me=this,node=options.node||me.tree.getRootNode();if(!node){node=me.setRootNode({expanded:true},true)}options.id=node.getId();if(me.clearOnLoad){if(me.clearRemovedOnLoad){me.clearRemoved(node)}me.tree.un("remove",me.onNodeRemove,me);node.removeAll(false);me.tree.on("remove",me.onNodeRemove,me)}Ext.applyIf(options,{node:node});me.callParent([options]);if(me.loading&&node){node.set("loading",true)}return me},clearRemoved:function(node){var me=this,removed=me.removed,id=node.getId(),removedLength=removed.length,i=removedLength,recordsToClear={},newRemoved=[],removedHash={},removedNode,targetNode,targetId;if(node===me.getRootNode()){me.removed=[];return}for(;i--;){removedNode=removed[i];removedHash[removedNode.getId()]=removedNode}for(i=removedLength;i--;){removedNode=removed[i];targetNode=removedNode;while(targetNode&&targetNode.getId()!==id){targetId=targetNode.get("parentId");targetNode=targetNode.parentNode||me.getNodeById(targetId)||removedHash[targetId]}if(targetNode){recordsToClear[removedNode.getId()]=removedNode}}for(i=0;i<removedLength;i++){removedNode=removed[i];if(!recordsToClear[removedNode.getId()]){newRemoved.push(removedNode)}}me.removed=newRemoved},fillNode:function(node,newNodes){var me=this,ln=newNodes?newNodes.length:0,sorters=me.sorters,i,sortCollection,needsIndexSort=false,performLocalSort=ln&&me.sortOnLoad&&!me.remoteSort&&sorters&&sorters.items&&sorters.items.length,node1,node2,rootFill;for(i=1;i<ln;i++){node1=newNodes[i];node2=newNodes[i-1];needsIndexSort=node1[node1.persistenceProperty].index!=node2[node2.persistenceProperty].index;if(needsIndexSort){break}}if(performLocalSort){if(needsIndexSort){me.sorters.insert(0,me.indexSorter)}sortCollection=new Ext.util.MixedCollection;sortCollection.addAll(newNodes);sortCollection.sort(me.sorters.items);newNodes=sortCollection.items;me.sorters.remove(me.indexSorter)}else if(needsIndexSort){Ext.Array.sort(newNodes,me.sortByIndex)}node.set("loaded",true);rootFill=me.fillCount===0;if(rootFill){me.fireEvent("beforefill",me,node,newNodes)}++me.fillCount;if(newNodes.length){node.appendChild(newNodes,undefined,true)}if(rootFill){me.fireEvent("fillcomplete",me,node,newNodes)}--me.fillCount;return newNodes},sortByIndex:function(node1,node2){return node1[node1.persistenceProperty].index-node2[node2.persistenceProperty].index},onIdChanged:function(model,oldId,newId,oldInternalId){this.tree.onNodeIdChanged(model,oldId,newId,oldInternalId);this.callParent(arguments)},onProxyLoad:function(operation){var me=this,successful=operation.wasSuccessful(),records=operation.getRecords(),node=operation.node;me.loading=false;node.set("loading",false);if(successful){if(!me.clearOnLoad){records=me.cleanRecords(node,records)}records=me.fillNode(node,records)}me.fireEvent("read",me,operation.node,records,successful);me.fireEvent("load",me,operation.node,records,successful);Ext.callback(operation.callback,operation.scope||me,[records,operation,successful])},cleanRecords:function(node,records){var nodeHash={},childNodes=node.childNodes,i=0,len=childNodes.length,out=[],rec;for(;i<len;++i){nodeHash[childNodes[i].getId()]=true}for(i=0,len=records.length;i<len;++i){rec=records[i];if(!nodeHash[rec.getId()]){out.push(rec)}}return out},removeAll:function(){var root=this.getRootNode();if(root){root.destroy(true)}this.fireEvent("clear",this)},doSort:function(sorterFn){var me=this;if(me.remoteSort){me.load()}else{me.tree.sort(sorterFn,true);me.fireEvent("datachanged",me);me.fireEvent("refresh",me)}me.fireEvent("sort",me,me.sorters.getRange())}},function(){var proto=this.prototype;proto.indexSorter=new Ext.util.Sorter({sorterFn:proto.sortByIndex})});