Ext.define("Ext.layout.container.Accordion",{extend:"Ext.layout.container.VBox",alias:["layout.accordion"],alternateClassName:"Ext.layout.AccordionLayout",targetCls:Ext.baseCSSPrefix+"accordion-layout-ct",itemCls:[Ext.baseCSSPrefix+"box-item",Ext.baseCSSPrefix+"accordion-item"],align:"stretch",fill:true,titleCollapse:true,hideCollapseTool:false,collapseFirst:undefined,animate:true,activeOnTop:false,multi:false,defaultAnimatePolicy:{y:true,height:true},constructor:function(){var me=this;me.callParent(arguments);if(!me.multi&&me.animate){me.animatePolicy=Ext.apply({},me.defaultAnimatePolicy)}else{me.animatePolicy=null}},beforeRenderItems:function(items){var me=this,ln=items.length,i=0,owner=me.owner,collapseFirst=me.collapseFirst,hasCollapseFirst=Ext.isDefined(collapseFirst),expandedItem=me.getExpanded(true)[0],multi=me.multi,comp;for(;i<ln;i++){comp=items[i];if(!comp.rendered){if(!multi||comp.collapsible!==false){comp.collapsible=true}if(comp.collapsible){if(hasCollapseFirst){comp.collapseFirst=collapseFirst}if(me.hideCollapseTool){comp.hideCollapseTool=me.hideCollapseTool;comp.titleCollapse=true}else if(me.titleCollapse&&comp.titleCollapse===undefined){comp.titleCollapse=me.titleCollapse}}delete comp.hideHeader;delete comp.width;comp.title=comp.title||"&#160;";comp.addBodyCls(Ext.baseCSSPrefix+"accordion-body");if(!multi){if(expandedItem){comp.collapsed=expandedItem!==comp}else if(comp.hasOwnProperty("collapsed")&&comp.collapsed===false){expandedItem=comp}else{comp.collapsed=true}owner.mon(comp,{show:me.onComponentShow,beforeexpand:me.onComponentExpand,beforecollapse:me.onComponentCollapse,scope:me})}owner.mon(comp,"beforecollapse",me.onComponentCollapse,me);comp.headerOverCls=Ext.baseCSSPrefix+"accordion-hd-over"}}if(!multi){if(!expandedItem){if(ln){items[0].collapsed=false}}else if(me.activeOnTop){expandedItem.collapsed=false;me.configureItem(expandedItem);if(owner.items.indexOf(expandedItem)>0){owner.insert(0,expandedItem)}}}},getItemsRenderTree:function(items){this.beforeRenderItems(items);return this.callParent(arguments)},renderItems:function(items,target){this.beforeRenderItems(items);this.callParent(arguments)},configureItem:function(item){this.callParent(arguments);item.animCollapse=item.border=false;if(this.fill){item.flex=1}},beginLayout:function(ownerContext){this.callParent(arguments);this.updatePanelClasses(ownerContext)},updatePanelClasses:function(ownerContext){var children=ownerContext.visibleItems,ln=children.length,siblingCollapsed=true,i,child,header;for(i=0;i<ln;i++){child=children[i];header=child.header;header.addCls(Ext.baseCSSPrefix+"accordion-hd");if(siblingCollapsed){header.removeCls(Ext.baseCSSPrefix+"accordion-hd-sibling-expanded")}else{header.addCls(Ext.baseCSSPrefix+"accordion-hd-sibling-expanded")}if(i+1==ln&&child.collapsed){header.addCls(Ext.baseCSSPrefix+"accordion-hd-last-collapsed")}else{header.removeCls(Ext.baseCSSPrefix+"accordion-hd-last-collapsed")}siblingCollapsed=child.collapsed}},onComponentExpand:function(toExpand){var me=this,owner=me.owner,multi=me.multi,animate=me.animate,moveToTop=!multi&&!me.animate&&me.activeOnTop,expanded,expandedCount,i,previousValue;if(!me.processing){me.processing=true;previousValue=owner.deferLayouts;owner.deferLayouts=true;expanded=multi?[]:me.getExpanded();expandedCount=expanded.length;for(i=0;i<expandedCount;i++){expanded[i].collapse()}if(moveToTop){Ext.suspendLayouts();owner.insert(0,toExpand);Ext.resumeLayouts()}owner.deferLayouts=previousValue;me.processing=false}},onComponentCollapse:function(comp){var me=this,owner=me.owner,toExpand,expanded,previousValue;if(me.owner.items.getCount()===1){return false}if(!me.processing){me.processing=true;previousValue=owner.deferLayouts;owner.deferLayouts=true;toExpand=comp.next()||comp.prev();if(me.multi){expanded=me.getExpanded();if(expanded.length===1){toExpand.expand()}}else if(toExpand){toExpand.expand()}owner.deferLayouts=previousValue;me.processing=false}},onComponentShow:function(comp){this.onComponentExpand(comp)},getExpanded:function(explicitCheck){var items=this.owner.items.items,len=items.length,i=0,out=[],add,item;for(;i<len;++i){item=items[i];if(explicitCheck){add=item.hasOwnProperty("collapsed")&&item.collapsed===false}else{add=!item.collapsed}if(add){out.push(item)}}return out}});