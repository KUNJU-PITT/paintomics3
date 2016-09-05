Ext.define("Ext.ux.grid.menu.RangeMenu",{extend:"Ext.menu.Menu",fieldCls:"Ext.form.field.Number",itemIconCls:{gt:"ux-rangemenu-gt",lt:"ux-rangemenu-lt",eq:"ux-rangemenu-eq"},fieldLabels:{gt:"Greater Than",lt:"Less Than",eq:"Equal To"},menuItemCfgs:{emptyText:"Enter Number...",selectOnFocus:false,width:155},menuItems:["lt","gt","-","eq"],plain:true,constructor:function(config){var me=this,fields,fieldCfg,i,len,item,cfg,Cls;me.callParent(arguments);fields=me.fields=me.fields||{};fieldCfg=me.fieldCfg=me.fieldCfg||{};me.addEvents("update");me.updateTask=Ext.create("Ext.util.DelayedTask",me.fireUpdate,me);for(i=0,len=me.menuItems.length;i<len;i++){item=me.menuItems[i];if(item!=="-"){cfg={itemId:"range-"+item,enableKeyEvents:true,hideEmptyLabel:false,labelCls:"ux-rangemenu-icon "+me.itemIconCls[item],labelSeparator:"",labelWidth:29,listeners:{scope:me,change:me.onInputChange,keyup:me.onInputKeyUp,el:{click:this.stopFn}},activate:Ext.emptyFn,deactivate:Ext.emptyFn};Ext.apply(cfg,Ext.applyIf(fields[item]||{},fieldCfg[item]),me.menuItemCfgs);Cls=cfg.fieldCls||me.fieldCls;item=fields[item]=Ext.create(Cls,cfg)}me.add(item)}},stopFn:function(e){e.stopPropagation()},fireUpdate:function(){this.fireEvent("update",this)},getValue:function(){var result={},fields=this.fields,key,field;for(key in fields){if(fields.hasOwnProperty(key)){field=fields[key];if(field.isValid()&&field.getValue()!==null){result[key]=field.getValue()}}}return result},setValue:function(data){var me=this,fields=me.fields,key,field;for(key in fields){if(fields.hasOwnProperty(key)){field=fields[key];field.suspendEvents();field.setValue(key in data?data[key]:"");field.resumeEvents()}}me.fireEvent("update",me)},onInputKeyUp:function(field,e){if(e.getKey()===e.RETURN&&field.isValid()){e.stopEvent();this.hide()}},onInputChange:function(field){var me=this,fields=me.fields,eq=fields.eq,gt=fields.gt,lt=fields.lt;if(field==eq){if(gt){gt.setValue(null)}if(lt){lt.setValue(null)}}else{eq.setValue(null)}this.updateTask.delay(this.updateBuffer)}});