Ext.define("Ext.layout.component.field.HtmlEditor",{extend:"Ext.layout.component.field.FieldContainer",alias:["layout.htmleditor"],type:"htmleditor",naturalHeight:150,naturalWidth:300,beginLayout:function(ownerContext){var owner=this.owner,dom;if(Ext.isGecko){dom=owner.textareaEl.dom;this.lastValue=dom.value;dom.value=""}this.callParent(arguments);ownerContext.toolbarContext=ownerContext.context.getCmp(owner.toolbar);ownerContext.inputCmpContext=ownerContext.context.getCmp(owner.inputCmp);ownerContext.textAreaContext=ownerContext.getEl("textareaEl");ownerContext.iframeContext=ownerContext.getEl("iframeEl")},beginLayoutCycle:function(ownerContext){var me=this,widthModel=ownerContext.widthModel,heightModel=ownerContext.heightModel,owner=me.owner,iframeEl=owner.iframeEl,textareaEl=owner.textareaEl;me.callParent(arguments);if(widthModel.shrinkWrap){iframeEl.setStyle("width","");textareaEl.setStyle("width","")}else if(widthModel.natural){ownerContext.bodyCellContext.setWidth(me.naturalWidth)}if(heightModel.natural||heightModel.shrinkWrap){iframeEl.setHeight(me.naturalHeight);textareaEl.setHeight(me.naturalHeight)}},finishedLayout:function(){var owner=this.owner;this.callParent(arguments);if(Ext.isIE9m&&Ext.isIEQuirks){owner.el.repaint()}if(Ext.isGecko){owner.textareaEl.dom.value=this.lastValue}},publishOwnerWidth:function(ownerContext,width){this.callParent(arguments);width-=ownerContext.inputCmpContext.getBorderInfo().width;ownerContext.textAreaContext.setWidth(width);ownerContext.iframeContext.setWidth(width)},publishInnerWidth:function(ownerContext,width){var border=ownerContext.inputCmpContext.getBorderInfo().width,ieBug=Ext.isStrict&&Ext.isIE8m,natural=ownerContext.widthModel.natural;this.callParent(arguments);width=ownerContext.bodyCellContext.props.width-border;if(natural){if(ieBug){width-=2}ownerContext.textAreaContext.setWidth(width);ownerContext.iframeContext.setWidth(width)}else if(ieBug){ownerContext.textAreaContext.setWidth(width)}},publishInnerHeight:function(ownerContext,height){var toolbarHeight=ownerContext.toolbarContext.getProp("height"),sourceEdit=this.owner.sourceEditMode;this.callParent(arguments);height=ownerContext.bodyCellContext.props.height;if(toolbarHeight!==undefined){height-=toolbarHeight+ownerContext.inputCmpContext.getFrameInfo().height;if(Ext.isIE8&&Ext.isStrict){height-=2}else if(Ext.isIEQuirks&&(Ext.isIE8||Ext.isIE9)){height-=4}ownerContext.iframeContext.setHeight(height);ownerContext.textAreaContext.setHeight(height)}else{this.done=false}}});