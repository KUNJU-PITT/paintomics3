Ext.define("Ext.grid.column.Action",{extend:"Ext.grid.column.Column",alias:["widget.actioncolumn"],alternateClassName:"Ext.grid.ActionColumn",actionIdRe:new RegExp(Ext.baseCSSPrefix+"action-col-(\\d+)"),altText:"",menuText:"<i>Actions</i>",sortable:false,innerCls:Ext.baseCSSPrefix+"grid-cell-inner-action-col",constructor:function(config){var me=this,cfg=Ext.apply({},config),items=cfg.items||me.items||[me],hasGetClass,i,len;me.origRenderer=cfg.renderer||me.renderer;me.origScope=cfg.scope||me.scope;me.renderer=me.scope=cfg.renderer=cfg.scope=null;cfg.items=null;me.callParent([cfg]);me.items=items;for(i=0,len=items.length;i<len;++i){if(items[i].getClass){hasGetClass=true;break}}if(me.origRenderer||hasGetClass){me.hasCustomRenderer=true}},defaultRenderer:function(v,meta,record,rowIdx,colIdx,store,view){var me=this,prefix=Ext.baseCSSPrefix,scope=me.origScope||me,items=me.items,len=items.length,i=0,item,ret,disabled,tooltip;ret=Ext.isFunction(me.origRenderer)?me.origRenderer.apply(scope,arguments)||"":"";meta.tdCls+=" "+Ext.baseCSSPrefix+"action-col-cell";for(;i<len;i++){item=items[i];disabled=item.disabled||(item.isDisabled?item.isDisabled.call(item.scope||scope,view,rowIdx,colIdx,item,record):false);tooltip=disabled?null:item.tooltip||(item.getTip?item.getTip.apply(item.scope||scope,arguments):null);if(!item.hasActionConfiguration){item.stopSelection=me.stopSelection;item.disable=Ext.Function.bind(me.disableAction,me,[i],0);item.enable=Ext.Function.bind(me.enableAction,me,[i],0);item.hasActionConfiguration=true}ret+='<img role="button" alt="'+(item.altText||me.altText)+'" src="'+(item.icon||Ext.BLANK_IMAGE_URL)+'" class="'+prefix+"action-col-icon "+prefix+"action-col-"+String(i)+" "+(disabled?prefix+"item-disabled":" ")+" "+(Ext.isFunction(item.getClass)?item.getClass.apply(item.scope||scope,arguments):item.iconCls||me.iconCls||"")+'"'+(tooltip?' data-qtip="'+tooltip+'"':"")+" />"}return ret},enableAction:function(index,silent){var me=this;if(!index){index=0}else if(!Ext.isNumber(index)){index=Ext.Array.indexOf(me.items,index)}me.items[index].disabled=false;me.up("tablepanel").el.select("."+Ext.baseCSSPrefix+"action-col-"+index).removeCls(me.disabledCls);if(!silent){me.fireEvent("enable",me)}},disableAction:function(index,silent){var me=this;if(!index){index=0}else if(!Ext.isNumber(index)){index=Ext.Array.indexOf(me.items,index)}me.items[index].disabled=true;me.up("tablepanel").el.select("."+Ext.baseCSSPrefix+"action-col-"+index).addCls(me.disabledCls);if(!silent){me.fireEvent("disable",me)}},destroy:function(){delete this.items;delete this.renderer;return this.callParent(arguments)},processEvent:function(type,view,cell,recordIndex,cellIndex,e,record,row){var me=this,target=e.getTarget(),match,item,fn,key=type=="keydown"&&e.getKey(),disabled;if(key&&!Ext.fly(target).findParent(view.getCellSelector())){target=Ext.fly(cell).down("."+Ext.baseCSSPrefix+"action-col-icon",true)}if(target&&(match=target.className.match(me.actionIdRe))){item=me.items[parseInt(match[1],10)];disabled=item.disabled||(item.isDisabled?item.isDisabled.call(item.scope||me.origScope||me,view,recordIndex,cellIndex,item,record):false);if(item&&!disabled){if(type=="click"||(key==e.ENTER||key==e.SPACE)){fn=item.handler||me.handler;if(fn){fn.call(item.scope||me.origScope||me,view,recordIndex,cellIndex,item,e,record,row)}}else if(type=="mousedown"&&item.stopSelection!==false){return false}}}return me.callParent(arguments)},cascade:function(fn,scope){fn.call(scope||this,this)},getRefItems:function(){return[]}});