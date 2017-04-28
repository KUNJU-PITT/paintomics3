Ext.define("Ext.form.Basic",{extend:"Ext.util.Observable",alternateClassName:"Ext.form.BasicForm",requires:["Ext.util.MixedCollection","Ext.form.action.Load","Ext.form.action.Submit","Ext.window.MessageBox","Ext.data.Errors","Ext.util.DelayedTask"],constructor:function(owner,config){var me=this,reader;me.owner=owner;me.checkValidityTask=new Ext.util.DelayedTask(me.checkValidity,me);me.checkDirtyTask=new Ext.util.DelayedTask(me.checkDirty,me);me.monitor=new Ext.container.Monitor({selector:"[isFormField]",scope:me,addHandler:me.onFieldAdd,removeHandler:me.onFieldRemove});me.monitor.bind(owner);Ext.apply(me,config);if(Ext.isString(me.paramOrder)){me.paramOrder=me.paramOrder.split(/[\s,|]/)}reader=me.reader;if(reader&&!reader.isReader){if(typeof reader==="string"){reader={type:reader}}me.reader=Ext.createByAlias("reader."+reader.type,reader)}reader=me.errorReader;if(reader&&!reader.isReader){if(typeof reader==="string"){reader={type:reader}}me.errorReader=Ext.createByAlias("reader."+reader.type,reader)}me.addEvents("beforeaction","actionfailed","actioncomplete","validitychange","dirtychange");me.callParent()},initialize:function(){this.initialized=true;this.onValidityChange(!this.hasInvalidField())},timeout:30,paramsAsHash:false,waitTitle:"Please Wait...",trackResetOnLoad:false,wasDirty:false,destroy:function(){var me=this,mon=me.monitor;if(mon){mon.unbind();me.monitor=null}me.clearListeners();me.checkValidityTask.cancel();me.checkDirtyTask.cancel()},onFieldAdd:function(field){var me=this;me.mon(field,"validitychange",me.checkValidityDelay,me);me.mon(field,"dirtychange",me.checkDirtyDelay,me);if(me.initialized){me.checkValidityDelay()}},onFieldRemove:function(field){var me=this;me.mun(field,"validitychange",me.checkValidityDelay,me);me.mun(field,"dirtychange",me.checkDirtyDelay,me);if(me.initialized){me.checkValidityDelay()}},getFields:function(){return this.monitor.getItems()},getBoundItems:function(){var boundItems=this._boundItems;if(!boundItems||boundItems.getCount()===0){boundItems=this._boundItems=new Ext.util.MixedCollection;boundItems.addAll(this.owner.query("[formBind]"))}return boundItems},hasInvalidField:function(){return!!this.getFields().findBy(function(field){var preventMark=field.preventMark,isValid;field.preventMark=true;isValid=field.isValid();field.preventMark=preventMark;return!isValid})},isValid:function(){var me=this,invalid;Ext.suspendLayouts();invalid=me.getFields().filterBy(function(field){return!field.validate()});Ext.resumeLayouts(true);return invalid.length<1},checkValidity:function(){var me=this,valid=!me.hasInvalidField();if(valid!==me.wasValid){me.onValidityChange(valid);me.fireEvent("validitychange",me,valid);me.wasValid=valid}},checkValidityDelay:function(){this.checkValidityTask.delay(10)},onValidityChange:function(valid){var boundItems=this.getBoundItems(),items,i,iLen,cmp;if(boundItems){items=boundItems.items;iLen=items.length;for(i=0;i<iLen;i++){cmp=items[i];if(cmp.disabled===valid){cmp.setDisabled(!valid)}}}},isDirty:function(){return!!this.getFields().findBy(function(f){return f.isDirty()})},checkDirtyDelay:function(){this.checkDirtyTask.delay(10)},checkDirty:function(){var dirty=this.isDirty();if(dirty!==this.wasDirty){this.fireEvent("dirtychange",this,dirty);this.wasDirty=dirty}},hasUpload:function(){return!!this.getFields().findBy(function(f){return f.isFileUpload()})},doAction:function(action,options){if(Ext.isString(action)){action=Ext.ClassManager.instantiateByAlias("formaction."+action,Ext.apply({},options,{form:this}))}if(this.fireEvent("beforeaction",this,action)!==false){this.beforeAction(action);Ext.defer(action.run,100,action)}return this},submit:function(options){options=options||{};var me=this,action;if(options.standardSubmit||me.standardSubmit){action="standardsubmit"}else{action=me.api?"directsubmit":"submit"}return me.doAction(action,options)},load:function(options){return this.doAction(this.api?"directload":"load",options)},updateRecord:function(record){record=record||this._record;if(!record){Ext.Error.raise("A record is required.");return this}var fields=record.fields.items,values=this.getFieldValues(),obj={},i=0,len=fields.length,name;for(;i<len;++i){name=fields[i].name;if(values.hasOwnProperty(name)){obj[name]=values[name]}}record.beginEdit();record.set(obj);record.endEdit();return this},loadRecord:function(record){this._record=record;return this.setValues(record.getData())},getRecord:function(){return this._record},beforeAction:function(action){var me=this,waitMsg=action.waitMsg,maskCls=Ext.baseCSSPrefix+"mask-loading",fields=me.getFields().items,f,fLen=fields.length,field,waitMsgTarget;for(f=0;f<fLen;f++){field=fields[f];if(field.isFormField&&field.syncValue){field.syncValue()}}if(waitMsg){waitMsgTarget=me.waitMsgTarget;if(waitMsgTarget===true){me.owner.el.mask(waitMsg,maskCls)}else if(waitMsgTarget){waitMsgTarget=me.waitMsgTarget=Ext.get(waitMsgTarget);waitMsgTarget.mask(waitMsg,maskCls)}else{me.floatingAncestor=me.owner.up("[floating]");if(me.floatingAncestor){me.savePreventFocusOnActivate=me.floatingAncestor.preventFocusOnActivate;me.floatingAncestor.preventFocusOnActivate=true}Ext.MessageBox.wait(waitMsg,action.waitTitle||me.waitTitle)}}},afterAction:function(action,success){var me=this;if(action.waitMsg){var messageBox=Ext.MessageBox,waitMsgTarget=me.waitMsgTarget;if(waitMsgTarget===true){me.owner.el.unmask()}else if(waitMsgTarget){waitMsgTarget.unmask()}else{messageBox.hide()}}if(me.floatingAncestor){me.floatingAncestor.preventFocusOnActivate=me.savePreventFocusOnActivate}if(success){if(action.reset){me.reset()}Ext.callback(action.success,action.scope||action,[me,action]);me.fireEvent("actioncomplete",me,action)}else{Ext.callback(action.failure,action.scope||action,[me,action]);me.fireEvent("actionfailed",me,action)}},findField:function(id){return this.getFields().findBy(function(f){return f.id===id||f.getName()===id})},markInvalid:function(errors){var me=this,e,eLen,error,value,key;function mark(fieldId,msg){var field=me.findField(fieldId);if(field){field.markInvalid(msg)}}if(Ext.isArray(errors)){eLen=errors.length;for(e=0;e<eLen;e++){error=errors[e];mark(error.id,error.msg)}}else if(errors instanceof Ext.data.Errors){eLen=errors.items.length;for(e=0;e<eLen;e++){error=errors.items[e];mark(error.field,error.message)}}else{for(key in errors){if(errors.hasOwnProperty(key)){value=errors[key];mark(key,value,errors)}}}return this},setValues:function(values){var me=this,v,vLen,val,field;function setVal(fieldId,val){var field=me.findField(fieldId);if(field){field.setValue(val);if(me.trackResetOnLoad){field.resetOriginalValue()}}}Ext.suspendLayouts();if(Ext.isArray(values)){vLen=values.length;for(v=0;v<vLen;v++){val=values[v];setVal(val.id,val.value)}}else{Ext.iterate(values,setVal)}Ext.resumeLayouts(true);return this},getValues:function(asString,dirtyOnly,includeEmptyText,useDataValues){var values={},fields=this.getFields().items,f,fLen=fields.length,isArray=Ext.isArray,field,data,val,bucket,name;for(f=0;f<fLen;f++){field=fields[f];if(!dirtyOnly||field.isDirty()){data=field[useDataValues?"getModelData":"getSubmitData"](includeEmptyText);if(Ext.isObject(data)){for(name in data){if(data.hasOwnProperty(name)){val=data[name];if(includeEmptyText&&val===""){val=field.emptyText||""}if(values.hasOwnProperty(name)){bucket=values[name];if(!isArray(bucket)){bucket=values[name]=[bucket]}if(isArray(val)){values[name]=bucket.concat(val)}else{bucket.push(val)}}else{values[name]=val}}}}}}if(asString){values=Ext.Object.toQueryString(values)}return values},getFieldValues:function(dirtyOnly){return this.getValues(false,dirtyOnly,false,true)},clearInvalid:function(){Ext.suspendLayouts();var me=this,fields=me.getFields().items,f,fLen=fields.length;for(f=0;f<fLen;f++){fields[f].clearInvalid()}Ext.resumeLayouts(true);return me},reset:function(resetRecord){Ext.suspendLayouts();var me=this,fields=me.getFields().items,f,fLen=fields.length;for(f=0;f<fLen;f++){fields[f].reset()}Ext.resumeLayouts(true);if(resetRecord===true){delete me._record}return me},applyToFields:function(obj){var fields=this.getFields().items,f,fLen=fields.length;for(f=0;f<fLen;f++){Ext.apply(fields[f],obj)}return this},applyIfToFields:function(obj){var fields=this.getFields().items,f,fLen=fields.length;for(f=0;f<fLen;f++){Ext.applyIf(fields[f],obj)}return this}});