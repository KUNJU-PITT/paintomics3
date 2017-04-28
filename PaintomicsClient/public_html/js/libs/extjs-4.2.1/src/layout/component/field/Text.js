Ext.define("Ext.layout.component.field.Text",{extend:"Ext.layout.component.field.Field",alias:"layout.textfield",requires:["Ext.util.TextMetrics"],type:"textfield",canGrowWidth:true,beginLayoutCycle:function(ownerContext){this.callParent(arguments);if(ownerContext.heightModel.shrinkWrap){ownerContext.inputContext.el.setStyle("height","")}},measureContentWidth:function(ownerContext){var me=this,owner=me.owner,width=me.callParent(arguments),inputContext=ownerContext.inputContext,inputEl,value,calcWidth,max,min;if(owner.grow&&me.canGrowWidth&&!ownerContext.state.growHandled){inputEl=owner.inputEl;value=Ext.util.Format.htmlEncode(inputEl.dom.value||(owner.hasFocus?"":owner.emptyText)||"");value+=owner.growAppend;calcWidth=inputEl.getTextWidth(value)+inputContext.getFrameInfo().width;max=owner.growMax;min=Math.min(max,width);max=Math.max(owner.growMin,max,min);calcWidth=Ext.Number.constrain(calcWidth,owner.growMin,max);inputContext.setWidth(calcWidth);ownerContext.state.growHandled=true;inputContext.domBlock(me,"width");width=NaN}return width},publishInnerHeight:function(ownerContext,height){ownerContext.inputContext.setHeight(height-this.measureLabelErrorHeight(ownerContext))},beginLayoutFixed:function(ownerContext,width,suffix){var me=this,ieInputWidthAdjustment=me.ieInputWidthAdjustment;if(ieInputWidthAdjustment){me.adjustIEInputPadding(ownerContext);if(suffix==="px"){width-=ieInputWidthAdjustment}}me.callParent(arguments)},adjustIEInputPadding:function(ownerContext){this.owner.bodyEl.setStyle("padding-right",this.ieInputWidthAdjustment+"px")}});