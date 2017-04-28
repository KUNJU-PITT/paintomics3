Ext.define("Ext.view.DragZone",{extend:"Ext.dd.DragZone",containerScroll:false,constructor:function(config){var me=this,view,ownerCt,el;Ext.apply(me,config);if(!me.ddGroup){me.ddGroup="view-dd-zone-"+me.view.id}view=me.view;ownerCt=view.ownerCt;if(ownerCt){el=ownerCt.getTargetEl().dom}else{el=view.el.dom.parentNode}me.callParent([el]);me.ddel=Ext.get(document.createElement("div"));me.ddel.addCls(Ext.baseCSSPrefix+"grid-dd-wrap")},init:function(id,sGroup,config){this.initTarget(id,sGroup,config);this.view.mon(this.view,{itemmousedown:this.onItemMouseDown,scope:this})},onValidDrop:function(target,e,id){this.callParent();target.el.focus()},onItemMouseDown:function(view,record,item,index,e){if(!this.isPreventDrag(e,record,item,index)){if(view.focusRow){view.focusRow(record)}this.handleMouseDown(e)}},isPreventDrag:function(e){return false},getDragData:function(e){var view=this.view,item=e.getTarget(view.getItemSelector());if(item){return{copy:view.copy||view.allowCopy&&e.ctrlKey,event:new Ext.EventObjectImpl(e),view:view,ddel:this.ddel,item:item,records:view.getSelectionModel().getSelection(),fromPosition:Ext.fly(item).getXY()}}},onInitDrag:function(x,y){var me=this,data=me.dragData,view=data.view,selectionModel=view.getSelectionModel(),record=view.getRecord(data.item);if(!selectionModel.isSelected(record)){selectionModel.select(record,true)}data.records=selectionModel.getSelection();me.ddel.update(me.getDragText());me.proxy.update(me.ddel.dom);me.onStartDrag(x,y);return true},getDragText:function(){var count=this.dragData.records.length;return Ext.String.format(this.dragText,count,count==1?"":"s")},getRepairXY:function(e,data){return data?data.fromPosition:false}});