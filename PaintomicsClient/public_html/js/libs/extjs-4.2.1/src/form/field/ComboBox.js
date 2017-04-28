Ext.define("Ext.form.field.ComboBox",{extend:"Ext.form.field.Picker",requires:["Ext.util.DelayedTask","Ext.EventObject","Ext.view.BoundList","Ext.view.BoundListKeyNav","Ext.data.StoreManager","Ext.layout.component.field.ComboBox"],alternateClassName:"Ext.form.ComboBox",alias:["widget.combobox","widget.combo"],mixins:{bindable:"Ext.util.Bindable"},componentLayout:"combobox",triggerCls:Ext.baseCSSPrefix+"form-arrow-trigger",hiddenName:"",hiddenDataCls:Ext.baseCSSPrefix+"hide-display "+Ext.baseCSSPrefix+"form-data-hidden",fieldSubTpl:['<div class="{hiddenDataCls}" role="presentation"></div>','<input id="{id}" type="{type}" {inputAttrTpl} class="{fieldCls} {typeCls} {editableCls}" autocomplete="off"','<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>','<tpl if="name"> name="{name}"</tpl>','<tpl if="placeholder"> placeholder="{placeholder}"</tpl>','<tpl if="size"> size="{size}"</tpl>','<tpl if="maxLength !== undefined"> maxlength="{maxLength}"</tpl>','<tpl if="readOnly"> readonly="readonly"</tpl>','<tpl if="disabled"> disabled="disabled"</tpl>','<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>','<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',"/>",{compiled:true,disableFormats:true}],getSubTplData:function(){var me=this;Ext.applyIf(me.subTplData,{hiddenDataCls:me.hiddenDataCls});return me.callParent(arguments)},afterRender:function(){var me=this;me.callParent(arguments);me.setHiddenValue(me.value)},multiSelect:false,delimiter:", ",displayField:"text",triggerAction:"all",allQuery:"",queryParam:"query",queryMode:"remote",queryCaching:true,pageSize:0,anyMatch:false,caseSensitive:false,autoSelect:true,typeAhead:false,typeAheadDelay:250,selectOnTab:true,forceSelection:false,growToLongestValue:true,defaultListConfig:{loadingHeight:70,minWidth:70,maxHeight:300,shadow:"sides"},ignoreSelection:0,removingRecords:null,resizeComboToGrow:function(){var me=this;return me.grow&&me.growToLongestValue},initComponent:function(){var me=this,isDefined=Ext.isDefined,store=me.store,transform=me.transform,transformSelect,isLocalMode;Ext.applyIf(me.renderSelectors,{hiddenDataEl:"."+me.hiddenDataCls.split(" ").join(".")});if(me.typeAhead&&me.multiSelect){Ext.Error.raise("typeAhead and multiSelect are mutually exclusive options -- please remove one of them.")}if(me.typeAhead&&!me.editable){Ext.Error.raise("If typeAhead is enabled the combo must be editable: true -- please change one of those settings.")}if(me.selectOnFocus&&!me.editable){Ext.Error.raise("If selectOnFocus is enabled the combo must be editable: true -- please change one of those settings.")}this.addEvents("beforequery","select","beforeselect","beforedeselect");if(transform){transformSelect=Ext.getDom(transform);if(transformSelect){if(!me.store){store=Ext.Array.map(Ext.Array.from(transformSelect.options),function(option){return[option.value,option.text]})}if(!me.name){me.name=transformSelect.name}if(!("value"in me)){me.value=transformSelect.value}}}me.bindStore(store||"ext-empty-store",true);store=me.store;if(store.autoCreated){me.queryMode="local";me.valueField=me.displayField="field1";if(!store.expanded){me.displayField="field2"}}if(!isDefined(me.valueField)){me.valueField=me.displayField}isLocalMode=me.queryMode==="local";if(!isDefined(me.queryDelay)){me.queryDelay=isLocalMode?10:500}if(!isDefined(me.minChars)){me.minChars=isLocalMode?0:4}if(!me.displayTpl){me.displayTpl=new Ext.XTemplate('<tpl for=".">'+'{[typeof values === "string" ? values : values["'+me.displayField+'"]]}'+'<tpl if="xindex < xcount">'+me.delimiter+"</tpl>"+"</tpl>")}else if(Ext.isString(me.displayTpl)){me.displayTpl=new Ext.XTemplate(me.displayTpl)}me.callParent();me.doQueryTask=new Ext.util.DelayedTask(me.doRawQuery,me);if(me.store.getCount()>0){me.setValue(me.value)}if(transformSelect){me.render(transformSelect.parentNode,transformSelect);Ext.removeNode(transformSelect);delete me.renderTo}},getStore:function(){return this.store},beforeBlur:function(){this.doQueryTask.cancel();this.assertValue()},assertValue:function(){var me=this,value=me.getRawValue(),rec,currentValue;if(me.forceSelection){if(me.multiSelect){if(value!==me.getDisplayValue()){me.setValue(me.lastSelection)}}else{rec=me.findRecordByDisplay(value);if(rec){currentValue=me.value;if(!me.findRecordByValue(currentValue)){me.select(rec,true)}}else{me.setValue(me.lastSelection)}}}me.collapse()},onTypeAhead:function(){var me=this,displayField=me.displayField,record=me.store.findRecord(displayField,me.getRawValue()),boundList=me.getPicker(),newValue,len,selStart;if(record){newValue=record.get(displayField);len=newValue.length;selStart=me.getRawValue().length;boundList.highlightItem(boundList.getNode(record));if(selStart!==0&&selStart!==len){me.setRawValue(newValue);me.selectText(selStart,newValue.length)}}},resetToDefault:Ext.emptyFn,beforeReset:function(){this.callParent();if(this.queryFilter&&!this.queryFilter.disabled){this.queryFilter.disabled=true;this.store.filter()}},onUnbindStore:function(store){var me=this,picker=me.picker;if(me.queryFilter){me.store.removeFilter(me.queryFilter)}if(!store&&picker){picker.bindStore(null)}},onBindStore:function(store,initial){var picker=this.picker;if(!initial){this.resetToDefault()}if(picker){picker.bindStore(store)}},getStoreListeners:function(){var me=this;return{beforeload:me.onBeforeLoad,clear:me.onClear,datachanged:me.onDataChanged,load:me.onLoad,exception:me.onException,remove:me.onRemove}},onBeforeLoad:function(){++this.ignoreSelection},onDataChanged:function(){var me=this;if(me.resizeComboToGrow()){me.updateLayout()}},onClear:function(){var me=this;if(me.resizeComboToGrow()){me.removingRecords=true;me.onDataChanged()}},onRemove:function(){var me=this;if(me.resizeComboToGrow()){me.removingRecords=true}},onException:function(){if(this.ignoreSelection>0){--this.ignoreSelection}this.collapse()},onLoad:function(store,records,success){var me=this;if(me.ignoreSelection>0){--me.ignoreSelection}if(success&&!store.lastOptions.rawQuery){if(me.value==null){if(me.store.getCount()){me.doAutoSelect()}else{me.setValue(me.value)}}else{me.setValue(me.value)}}},doRawQuery:function(){this.doQuery(this.getRawValue(),false,true)},doQuery:function(queryString,forceAll,rawQuery){var me=this,queryPlan=me.beforeQuery({query:queryString||"",rawQuery:rawQuery,forceAll:forceAll,combo:me,cancel:false});if(queryPlan===false||queryPlan.cancel){return false}if(me.queryCaching&&queryPlan.query===me.lastQuery){me.expand()}else{me.lastQuery=queryPlan.query;if(me.queryMode==="local"){me.doLocalQuery(queryPlan)}else{me.doRemoteQuery(queryPlan)}}return true},beforeQuery:function(queryPlan){var me=this;if(me.fireEvent("beforequery",queryPlan)===false){queryPlan.cancel=true}else if(!queryPlan.cancel){if(queryPlan.query.length<me.minChars&&!queryPlan.forceAll){queryPlan.cancel=true}}return queryPlan},doLocalQuery:function(queryPlan){var me=this,queryString=queryPlan.query;if(!me.queryFilter){me.queryFilter=new Ext.util.Filter({id:me.id+"-query-filter",anyMatch:me.anyMatch,caseSensitive:me.caseSensitive,root:"data",property:me.displayField});me.store.addFilter(me.queryFilter,false)}if(queryString||!queryPlan.forceAll){me.queryFilter.disabled=false;me.queryFilter.setValue(me.enableRegEx?new RegExp(queryString):queryString)}else{me.queryFilter.disabled=true}me.store.filter();if(me.store.getCount()){me.expand()}else{me.collapse()}me.afterQuery(queryPlan)},doRemoteQuery:function(queryPlan){var me=this,loadCallback=function(){me.afterQuery(queryPlan)};me.expand();if(me.pageSize){me.loadPage(1,{rawQuery:queryPlan.rawQuery,callback:loadCallback})}else{me.store.load({params:me.getParams(queryPlan.query),rawQuery:queryPlan.rawQuery,callback:loadCallback})}},afterQuery:function(queryPlan){var me=this;if(me.store.getCount()){if(me.typeAhead){me.doTypeAhead()}if(me.getRawValue()!==me.getDisplayValue()){me.ignoreSelection++;me.picker.getSelectionModel().deselectAll();me.ignoreSelection--}if(queryPlan.rawQuery){me.syncSelection();if(me.picker&&!me.picker.getSelectionModel().hasSelection()){me.doAutoSelect()}}else{me.doAutoSelect()}}},loadPage:function(pageNum,options){this.store.loadPage(pageNum,Ext.apply({params:this.getParams(this.lastQuery)},options))},onPageChange:function(toolbar,newPage){this.loadPage(newPage);return false},getParams:function(queryString){var params={},param=this.queryParam;if(param){params[param]=queryString}return params},doAutoSelect:function(){var me=this,picker=me.picker,lastSelected,itemNode;if(picker&&me.autoSelect&&me.store.getCount()>0){lastSelected=picker.getSelectionModel().lastSelected;itemNode=picker.getNode(lastSelected||0);if(itemNode){picker.highlightItem(itemNode);picker.listEl.scrollChildIntoView(itemNode,false)}}},doTypeAhead:function(){if(!this.typeAheadTask){this.typeAheadTask=new Ext.util.DelayedTask(this.onTypeAhead,this)}if(this.lastKey!=Ext.EventObject.BACKSPACE&&this.lastKey!=Ext.EventObject.DELETE){this.typeAheadTask.delay(this.typeAheadDelay)}},onTriggerClick:function(){var me=this;if(!me.readOnly&&!me.disabled){if(me.isExpanded){me.collapse()}else{me.onFocus({});if(me.triggerAction==="all"){me.doQuery(me.allQuery,true)}else if(me.triggerAction==="last"){me.doQuery(me.lastQuery,true)}else{me.doQuery(me.getRawValue(),false,true)}}me.inputEl.focus()}},onPaste:function(){var me=this;if(!me.readOnly&&!me.disabled&&me.editable){me.doQueryTask.delay(me.queryDelay)}},onKeyUp:function(e,t){var me=this,key=e.getKey();if(!me.readOnly&&!me.disabled&&me.editable){me.lastKey=key;if(!e.isSpecialKey()||key==e.BACKSPACE||key==e.DELETE){me.doQueryTask.delay(me.queryDelay)}}if(me.enableKeyEvents){me.callParent(arguments)}},initEvents:function(){var me=this;me.callParent();if(!me.enableKeyEvents){me.mon(me.inputEl,"keyup",me.onKeyUp,me)}me.mon(me.inputEl,"paste",me.onPaste,me)},onDestroy:function(){Ext.destroy(this.listKeyNav);this.bindStore(null);this.callParent()},onAdded:function(){var me=this;me.callParent(arguments);if(me.picker){me.picker.ownerCt=me.up("[floating]");me.picker.registerWithOwnerCt()}},createPicker:function(){var me=this,picker,pickerCfg=Ext.apply({xtype:"boundlist",pickerField:me,selModel:{mode:me.multiSelect?"SIMPLE":"SINGLE"},floating:true,hidden:true,store:me.store,displayField:me.displayField,focusOnToFront:false,pageSize:me.pageSize,tpl:me.tpl},me.listConfig,me.defaultListConfig);picker=me.picker=Ext.widget(pickerCfg);if(me.pageSize){picker.pagingToolbar.on("beforechange",me.onPageChange,me)}me.mon(picker,{itemclick:me.onItemClick,refresh:me.onListRefresh,scope:me});me.mon(picker.getSelectionModel(),{beforeselect:me.onBeforeSelect,beforedeselect:me.onBeforeDeselect,selectionchange:me.onListSelectionChange,scope:me});return picker},alignPicker:function(){var me=this,picker=me.getPicker(),heightAbove=me.getPosition()[1]-Ext.getBody().getScroll().top,heightBelow=Ext.Element.getViewHeight()-heightAbove-me.getHeight(),space=Math.max(heightAbove,heightBelow);if(picker.height){delete picker.height;picker.updateLayout()}if(picker.getHeight()>space-5){picker.setHeight(space-5)}me.callParent()},onListRefresh:function(){if(!this.expanding){this.alignPicker()}this.syncSelection()},onItemClick:function(picker,record){var me=this,selection=me.picker.getSelectionModel().getSelection(),valueField=me.valueField;if(!me.multiSelect&&selection.length){if(record.get(valueField)===selection[0].get(valueField)){me.displayTplData=[record.data];me.setRawValue(me.getDisplayValue());me.collapse()}}},onBeforeSelect:function(list,record){return this.fireEvent("beforeselect",this,record,record.index)},onBeforeDeselect:function(list,record){return this.fireEvent("beforedeselect",this,record,record.index)},onListSelectionChange:function(list,selectedRecords){var me=this,isMulti=me.multiSelect,hasRecords=selectedRecords.length>0;if(!me.ignoreSelection&&me.isExpanded){if(!isMulti){Ext.defer(me.collapse,1,me)}if(isMulti||hasRecords){me.setValue(selectedRecords,false)}if(hasRecords){me.fireEvent("select",me,selectedRecords)}me.inputEl.focus()}},onExpand:function(){var me=this,keyNav=me.listKeyNav,selectOnTab=me.selectOnTab,picker=me.getPicker();if(keyNav){keyNav.enable()}else{keyNav=me.listKeyNav=new Ext.view.BoundListKeyNav(this.inputEl,{boundList:picker,forceKeyDown:true,tab:function(e){if(selectOnTab){this.selectHighlighted(e);me.triggerBlur()}return true},enter:function(e){var selModel=picker.getSelectionModel(),count=selModel.getCount();this.selectHighlighted(e);if(!me.multiSelect&&count===selModel.getCount()){me.collapse()}}})}if(selectOnTab){me.ignoreMonitorTab=true}Ext.defer(keyNav.enable,1,keyNav);me.inputEl.focus()},onCollapse:function(){var me=this,keyNav=me.listKeyNav;if(keyNav){keyNav.disable();me.ignoreMonitorTab=false}},select:function(r,assert){var me=this,picker=me.picker,doSelect=true,fireSelect;if(r&&r.isModel&&assert===true&&picker){fireSelect=!picker.getSelectionModel().isSelected(r)}me.setValue(r,true);if(fireSelect){me.fireEvent("select",me,r)}},findRecord:function(field,value){var ds=this.store,idx=ds.findExact(field,value);return idx!==-1?ds.getAt(idx):false},findRecordByValue:function(value){return this.findRecord(this.valueField,value)},findRecordByDisplay:function(value){return this.findRecord(this.displayField,value)},setValue:function(value,doSelect){var me=this,valueNotFoundText=me.valueNotFoundText,inputEl=me.inputEl,i,len,record,dataObj,matchedRecords=[],displayTplData=[],processedValue=[];if(me.store.loading){me.value=value;me.setHiddenValue(me.value);return me}value=Ext.Array.from(value);for(i=0,len=value.length;i<len;i++){record=value[i];if(!record||!record.isModel){record=me.findRecordByValue(record)}if(record){matchedRecords.push(record);displayTplData.push(record.data);processedValue.push(record.get(me.valueField))}else{if(!me.forceSelection){processedValue.push(value[i]);dataObj={};dataObj[me.displayField]=value[i];displayTplData.push(dataObj)}else if(Ext.isDefined(valueNotFoundText)){displayTplData.push(valueNotFoundText)}}}me.setHiddenValue(processedValue);me.value=me.multiSelect?processedValue:processedValue[0];if(!Ext.isDefined(me.value)){me.value=null}me.displayTplData=displayTplData;me.lastSelection=me.valueModels=matchedRecords;if(inputEl&&me.emptyText&&!Ext.isEmpty(value)){inputEl.removeCls(me.emptyCls)}me.setRawValue(me.getDisplayValue());me.checkChange();if(doSelect!==false){me.syncSelection()}me.applyEmptyText();return me},setHiddenValue:function(values){var me=this,name=me.hiddenName,i,dom,childNodes,input,valueCount,childrenCount;if(!me.hiddenDataEl||!name){return}values=Ext.Array.from(values);dom=me.hiddenDataEl.dom;childNodes=dom.childNodes;input=childNodes[0];valueCount=values.length;childrenCount=childNodes.length;if(!input&&valueCount>0){me.hiddenDataEl.update(Ext.DomHelper.markup({tag:"input",type:"hidden",name:name}));childrenCount=1;input=dom.firstChild}while(childrenCount>valueCount){dom.removeChild(childNodes[0]);--childrenCount}while(childrenCount<valueCount){dom.appendChild(input.cloneNode(true));++childrenCount}for(i=0;i<valueCount;i++){childNodes[i].value=values[i]}},getDisplayValue:function(){return this.displayTpl.apply(this.displayTplData)},getValue:function(){var me=this,picker=me.picker,rawValue=me.getRawValue(),value=me.value;if(me.getDisplayValue()!==rawValue){value=rawValue;me.value=me.displayTplData=me.valueModels=null;if(picker){me.ignoreSelection++;picker.getSelectionModel().deselectAll();me.ignoreSelection--}}return value},getSubmitValue:function(){var value=this.getValue();if(Ext.isEmpty(value)){value=""}return value},isEqual:function(v1,v2){var fromArray=Ext.Array.from,i,len;v1=fromArray(v1);v2=fromArray(v2);len=v1.length;if(len!==v2.length){return false}for(i=0;i<len;i++){if(v2[i]!==v1[i]){return false}}return true},clearValue:function(){this.setValue([])},syncSelection:function(){var me=this,picker=me.picker,selection,selModel,values=me.valueModels||[],vLen=values.length,v,value;if(picker){selection=[];for(v=0;v<vLen;v++){value=values[v];if(value&&value.isModel&&me.store.indexOf(value)>=0){selection.push(value)}}me.ignoreSelection++;selModel=picker.getSelectionModel();selModel.deselectAll();if(selection.length){selModel.select(selection,undefined,true)}me.ignoreSelection--}},onEditorTab:function(e){var keyNav=this.listKeyNav;if(this.selectOnTab&&keyNav){keyNav.selectHighlighted(e)}}});