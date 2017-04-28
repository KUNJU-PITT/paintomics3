Ext.define("Ext.tab.Tab",{extend:"Ext.button.Button",alias:"widget.tab",requires:["Ext.util.KeyNav"],isTab:true,baseCls:Ext.baseCSSPrefix+"tab",closeElOverCls:Ext.baseCSSPrefix+"tab-close-btn-over",activeCls:"active",closableCls:"closable",closable:true,closeText:"Close Tab",active:false,childEls:["closeEl"],scale:false,position:"top",initComponent:function(){var me=this;me.addEvents("activate","deactivate","beforeclose","close");me.callParent(arguments);if(me.card){me.setCard(me.card)}me.overCls=["over",me.position+"-over"]},getTemplateArgs:function(){var me=this,result=me.callParent();result.closable=me.closable;result.closeText=me.closeText;return result},getFramingInfoCls:function(){return this.baseCls+"-"+this.ui+"-"+this.position},beforeRender:function(){var me=this,tabBar=me.up("tabbar"),tabPanel=me.up("tabpanel");me.callParent();me.addClsWithUI(me.position);if(me.active){me.addClsWithUI([me.activeCls,me.position+"-"+me.activeCls])}me.syncClosableUI();if(!me.minWidth){me.minWidth=tabBar?tabBar.minTabWidth:me.minWidth;if(!me.minWidth&&tabPanel){me.minWidth=tabPanel.minTabWidth}if(me.minWidth&&me.iconCls){me.minWidth+=25}}if(!me.maxWidth){me.maxWidth=tabBar?tabBar.maxTabWidth:me.maxWidth;if(!me.maxWidth&&tabPanel){me.maxWidth=tabPanel.maxTabWidth}}},onRender:function(){var me=this;me.setElOrientation();me.callParent(arguments);if(me.closable){me.closeEl.addClsOnOver(me.closeElOverCls)}me.keyNav=new Ext.util.KeyNav(me.el,{enter:me.onEnterKey,del:me.onDeleteKey,scope:me})},setElOrientation:function(){var position=this.position;if(position==="left"||position==="right"){this.el.setVertical(position==="right"?90:270)}},enable:function(silent){var me=this;me.callParent(arguments);me.removeClsWithUI(me.position+"-disabled");return me},disable:function(silent){var me=this;me.callParent(arguments);me.addClsWithUI(me.position+"-disabled");return me},onDestroy:function(){var me=this;Ext.destroy(me.keyNav);delete me.keyNav;me.callParent(arguments)},setClosable:function(closable){var me=this;closable=!arguments.length||!!closable;if(me.closable!=closable){me.closable=closable;if(me.card){me.card.closable=closable}me.syncClosableUI();if(me.rendered){me.syncClosableElements();me.updateLayout()}}},syncClosableElements:function(){var me=this,closeEl=me.closeEl;if(me.closable){if(!closeEl){closeEl=me.closeEl=me.btnWrap.insertSibling({tag:"a",cls:me.baseCls+"-close-btn",href:"#",title:me.closeText},"after")}closeEl.addClsOnOver(me.closeElOverCls)}else if(closeEl){closeEl.remove();delete me.closeEl}},syncClosableUI:function(){var me=this,classes=[me.closableCls,me.closableCls+"-"+me.position];if(me.closable){me.addClsWithUI(classes)}else{me.removeClsWithUI(classes)}},setCard:function(card){var me=this;me.card=card;me.setText(me.title||card.title);me.setIconCls(me.iconCls||card.iconCls);me.setIcon(me.icon||card.icon);me.setGlyph(me.glyph||card.glyph)},onCloseClick:function(){var me=this;if(me.fireEvent("beforeclose",me)!==false){if(me.tabBar){if(me.tabBar.closeTab(me)===false){return}}else{me.fireClose()}}},fireClose:function(){this.fireEvent("close",this)},onEnterKey:function(e){var me=this;if(me.tabBar){me.tabBar.onClick(e,me.el)}},onDeleteKey:function(e){if(this.closable){this.onCloseClick()}},activate:function(supressEvent){var me=this;me.active=true;me.addClsWithUI([me.activeCls,me.position+"-"+me.activeCls]);if(supressEvent!==true){me.fireEvent("activate",me)}},deactivate:function(supressEvent){var me=this;me.active=false;me.removeClsWithUI([me.activeCls,me.position+"-"+me.activeCls]);if(supressEvent!==true){me.fireEvent("deactivate",me)}}});