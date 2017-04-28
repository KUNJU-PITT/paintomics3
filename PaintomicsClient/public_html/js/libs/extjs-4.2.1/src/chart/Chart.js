Ext.define("Ext.chart.Chart",{extend:"Ext.draw.Component",alias:"widget.chart",mixins:{themeManager:"Ext.chart.theme.Theme",mask:"Ext.chart.Mask",navigation:"Ext.chart.Navigation",bindable:"Ext.util.Bindable",observable:"Ext.util.Observable"},uses:["Ext.chart.series.Series"],requires:["Ext.util.MixedCollection","Ext.data.StoreManager","Ext.chart.Legend","Ext.chart.theme.Base","Ext.chart.theme.Theme","Ext.util.DelayedTask"],viewBox:false,animate:false,legend:false,insetPadding:10,background:false,constructor:function(config){var me=this,defaultAnim;config=Ext.apply({},config);me.initTheme(config.theme||me.theme);if(me.gradients){Ext.apply(config,{gradients:me.gradients})}if(me.background){Ext.apply(config,{background:me.background})}if(config.animate){defaultAnim={easing:"ease",duration:500};if(Ext.isObject(config.animate)){config.animate=Ext.applyIf(config.animate,defaultAnim)}else{config.animate=defaultAnim}}me.mixins.observable.constructor.call(me,config);if(config.enableMask){me.mixins.mask.constructor.call(me)}me.mixins.navigation.constructor.call(me);me.callParent([config])},getChartStore:function(){return this.substore||this.store},initComponent:function(){var me=this,axes,series;me.callParent();me.addEvents("itemmousedown","itemmouseup","itemmouseover","itemmouseout","itemclick","itemdblclick","itemdragstart","itemdrag","itemdragend","beforerefresh","refresh");Ext.applyIf(me,{zoom:{width:1,height:1,x:0,y:0}});me.maxGutters={left:0,right:0,bottom:0,top:0};me.store=Ext.data.StoreManager.lookup(me.store);axes=me.axes;me.axes=new Ext.util.MixedCollection(false,function(a){return a.position});if(axes){me.axes.addAll(axes)}series=me.series;me.series=new Ext.util.MixedCollection(false,function(a){return a.seriesId||(a.seriesId=Ext.id(null,"ext-chart-series-"))});if(series){me.series.addAll(series)}if(me.legend!==false){me.legend=new Ext.chart.Legend(Ext.applyIf({chart:me},me.legend))}me.on({mousemove:me.onMouseMove,mouseleave:me.onMouseLeave,mousedown:me.onMouseDown,mouseup:me.onMouseUp,click:me.onClick,dblclick:me.onDblClick,scope:me})},afterComponentLayout:function(width,height,oldWidth,oldHeight){var me=this;if(Ext.isNumber(width)&&Ext.isNumber(height)){if(width!==oldWidth||height!==oldHeight){me.curWidth=width;me.curHeight=height;me.redraw(true);me.needsRedraw=false}else if(me.needsRedraw){me.redraw();me.needsRedraw=false}}this.callParent(arguments)},redraw:function(resize){var me=this,seriesItems=me.series.items,seriesLen=seriesItems.length,axesItems=me.axes.items,axesLen=axesItems.length,themeIndex=0,i,item,chartBBox=me.chartBBox={x:0,y:0,height:me.curHeight,width:me.curWidth},legend=me.legend,series;me.surface.setSize(chartBBox.width,chartBBox.height);for(i=0;i<seriesLen;i++){item=seriesItems[i];if(!item.initialized){series=me.initializeSeries(item,i,themeIndex)}else{series=item}series.onRedraw();if(Ext.isArray(item.yField)){themeIndex+=item.yField.length}else{++themeIndex}}for(i=0;i<axesLen;i++){item=axesItems[i];if(!item.initialized){me.initializeAxis(item)}}for(i=0;i<axesLen;i++){axesItems[i].processView()}for(i=0;i<axesLen;i++){axesItems[i].drawAxis(true)}if(legend!==false&&legend.visible){if(legend.update||!legend.created){legend.create()}}me.alignAxes();if(legend!==false&&legend.visible){legend.updatePosition()}me.getMaxGutters();me.resizing=!!resize;for(i=0;i<axesLen;i++){axesItems[i].drawAxis()}for(i=0;i<seriesLen;i++){me.drawCharts(seriesItems[i])}me.resizing=false},afterRender:function(){var me=this;me.callParent(arguments);if(me.categoryNames){me.setCategoryNames(me.categoryNames)}me.bindStore(me.store,true);me.refresh();if(me.surface.engine==="Vml"){me.on("added",me.onAddedVml,me);me.mon(me.hierarchyEventSource,"added",me.onContainerAddedVml,me)}},onAddedVml:function(){this.needsRedraw=true},onContainerAddedVml:function(container){if(this.isDescendantOf(container)){this.needsRedraw=true}},getEventXY:function(e){var me=this,box=this.surface.getRegion(),pageXY=e.getXY(),x=pageXY[0]-box.left,y=pageXY[1]-box.top;return[x,y]},onClick:function(e){this.handleClick("itemclick",e)},onDblClick:function(e){this.handleClick("itemdblclick",e)},handleClick:function(name,e){var me=this,position=me.getEventXY(e),seriesItems=me.series.items,i,ln,series,item;for(i=0,ln=seriesItems.length;i<ln;i++){series=seriesItems[i];if(Ext.draw.Draw.withinBox(position[0],position[1],series.bbox)){if(series.getItemForPoint){item=series.getItemForPoint(position[0],position[1]);if(item){series.fireEvent(name,item)}}}}},onMouseDown:function(e){var me=this,position=me.getEventXY(e),seriesItems=me.series.items,i,ln,series,item;if(me.enableMask){me.mixins.mask.onMouseDown.call(me,e)}for(i=0,ln=seriesItems.length;i<ln;i++){series=seriesItems[i];if(Ext.draw.Draw.withinBox(position[0],position[1],series.bbox)){if(series.getItemForPoint){item=series.getItemForPoint(position[0],position[1]);if(item){series.fireEvent("itemmousedown",item)}}}}},onMouseUp:function(e){var me=this,position=me.getEventXY(e),seriesItems=me.series.items,i,ln,series,item;if(me.enableMask){me.mixins.mask.onMouseUp.call(me,e)}for(i=0,ln=seriesItems.length;i<ln;i++){series=seriesItems[i];if(Ext.draw.Draw.withinBox(position[0],position[1],series.bbox)){if(series.getItemForPoint){item=series.getItemForPoint(position[0],position[1]);if(item){series.fireEvent("itemmouseup",item)}}}}},onMouseMove:function(e){var me=this,position=me.getEventXY(e),seriesItems=me.series.items,i,ln,series,item,last,storeItem,storeField;if(me.enableMask){me.mixins.mask.onMouseMove.call(me,e)}for(i=0,ln=seriesItems.length;i<ln;i++){series=seriesItems[i];if(Ext.draw.Draw.withinBox(position[0],position[1],series.bbox)){if(series.getItemForPoint){item=series.getItemForPoint(position[0],position[1]);last=series._lastItemForPoint;storeItem=series._lastStoreItem;storeField=series._lastStoreField;if(item!==last||item&&(item.storeItem!=storeItem||item.storeField!=storeField)){if(last){series.fireEvent("itemmouseout",last);delete series._lastItemForPoint;delete series._lastStoreField;delete series._lastStoreItem}if(item){series.fireEvent("itemmouseover",item);series._lastItemForPoint=item;series._lastStoreItem=item.storeItem;series._lastStoreField=item.storeField}}}}else{last=series._lastItemForPoint;if(last){series.fireEvent("itemmouseout",last);delete series._lastItemForPoint;delete series._lastStoreField;delete series._lastStoreItem}}}},onMouseLeave:function(e){var me=this,seriesItems=me.series.items,i,ln,series;if(me.enableMask){me.mixins.mask.onMouseLeave.call(me,e)}for(i=0,ln=seriesItems.length;i<ln;i++){series=seriesItems[i];delete series._lastItemForPoint}},delayRefresh:function(){var me=this;if(!me.refreshTask){me.refreshTask=new Ext.util.DelayedTask(me.refresh,me)}me.refreshTask.delay(me.refreshBuffer)},refresh:function(){var me=this;if(me.rendered&&me.curWidth!==undefined&&me.curHeight!==undefined){if(!me.isVisible(true)){if(!me.refreshPending){me.setShowListeners("mon");me.refreshPending=true}return}if(me.fireEvent("beforerefresh",me)!==false){me.redraw();me.fireEvent("refresh",me)}}},onShow:function(){var me=this;me.callParent(arguments);if(me.refreshPending){me.delayRefresh();me.setShowListeners("mun")}delete me.refreshPending},setShowListeners:function(method){var me=this;me[method](me.hierarchyEventSource,{scope:me,single:true,show:me.forceRefresh,expand:me.forceRefresh})},doRefresh:function(){this.setSubStore(null);this.refresh()},forceRefresh:function(container){var me=this;if(me.isDescendantOf(container)&&me.refreshPending){me.setShowListeners("mun");me.delayRefresh()}delete me.refreshPending},bindStore:function(store,initial){var me=this;me.mixins.bindable.bindStore.apply(me,arguments);if(me.store&&!initial){me.refresh()}},getStoreListeners:function(){var refresh=this.doRefresh,delayRefresh=this.delayRefresh;return{refresh:refresh,add:delayRefresh,bulkremove:delayRefresh,update:delayRefresh,clear:refresh}},setSubStore:function(subStore){this.substore=subStore},initializeAxis:function(axis){var me=this,chartBBox=me.chartBBox,w=chartBBox.width,h=chartBBox.height,x=chartBBox.x,y=chartBBox.y,themeAttrs=me.themeAttrs,config={chart:me};if(themeAttrs){config.axisStyle=Ext.apply({},themeAttrs.axis);config.axisLabelLeftStyle=Ext.apply({},themeAttrs.axisLabelLeft);config.axisLabelRightStyle=Ext.apply({},themeAttrs.axisLabelRight);config.axisLabelTopStyle=Ext.apply({},themeAttrs.axisLabelTop);config.axisLabelBottomStyle=Ext.apply({},themeAttrs.axisLabelBottom);config.axisTitleLeftStyle=Ext.apply({},themeAttrs.axisTitleLeft);config.axisTitleRightStyle=Ext.apply({},themeAttrs.axisTitleRight);config.axisTitleTopStyle=Ext.apply({},themeAttrs.axisTitleTop);config.axisTitleBottomStyle=Ext.apply({},themeAttrs.axisTitleBottom)}switch(axis.position){case"top":Ext.apply(config,{length:w,width:h,x:x,y:y});break;case"bottom":Ext.apply(config,{length:w,width:h,x:x,y:h});break;case"left":Ext.apply(config,{length:h,width:w,x:x,y:h});break;case"right":Ext.apply(config,{length:h,width:w,x:w,y:h});break}if(!axis.chart){Ext.apply(config,axis);axis=me.axes.replace(Ext.createByAlias("axis."+axis.type.toLowerCase(),config))}else{Ext.apply(axis,config)}axis.initialized=true},getInsets:function(){var me=this,insetPadding=me.insetPadding;return{top:insetPadding,right:insetPadding,bottom:insetPadding,left:insetPadding}},calculateInsets:function(){var me=this,legend=me.legend,axes=me.axes,edges=["top","right","bottom","left"],insets,i,l,edge,isVertical,axis,bbox;function getAxis(edge){var i=axes.findIndex("position",edge);return i<0?null:axes.getAt(i)}insets=me.getInsets();for(i=0,l=edges.length;i<l;i++){edge=edges[i];isVertical=edge==="left"||edge==="right";axis=getAxis(edge);if(legend!==false){if(legend.position===edge){bbox=legend.getBBox();insets[edge]+=(isVertical?bbox.width:bbox.height)+me.insetPadding}}if(axis&&axis.bbox){bbox=axis.bbox;insets[edge]+=isVertical?bbox.width:bbox.height}}return insets},alignAxes:function(){var me=this,axesItems=me.axes.items,insets,chartBBox,i,l,axis,pos,isVertical;insets=me.calculateInsets();chartBBox={x:insets.left,y:insets.top,width:me.curWidth-insets.left-insets.right,height:me.curHeight-insets.top-insets.bottom};me.chartBBox=chartBBox;for(i=0,l=axesItems.length;i<l;i++){axis=axesItems[i];pos=axis.position;isVertical=pos==="left"||pos==="right";axis.x=pos==="right"?chartBBox.x+chartBBox.width:chartBBox.x;axis.y=pos==="top"?chartBBox.y:chartBBox.y+chartBBox.height;axis.width=isVertical?chartBBox.width:chartBBox.height;axis.length=isVertical?chartBBox.height:chartBBox.width}},initializeSeries:function(series,idx,themeIndex){var me=this,themeAttrs=me.themeAttrs,seriesObj,markerObj,seriesThemes,st,markerThemes,colorArrayStyle=[],isInstance=(series instanceof Ext.chart.series.Series).i=0,l,config;if(!series.initialized){config={chart:me,seriesId:series.seriesId};if(themeAttrs){seriesThemes=themeAttrs.seriesThemes;markerThemes=themeAttrs.markerThemes;seriesObj=Ext.apply({},themeAttrs.series);markerObj=Ext.apply({},themeAttrs.marker);config.seriesStyle=Ext.apply(seriesObj,seriesThemes[themeIndex%seriesThemes.length]);config.seriesLabelStyle=Ext.apply({},themeAttrs.seriesLabel);config.markerStyle=Ext.apply(markerObj,markerThemes[themeIndex%markerThemes.length]);if(themeAttrs.colors){config.colorArrayStyle=themeAttrs.colors}else{colorArrayStyle=[];for(l=seriesThemes.length;i<l;i++){st=seriesThemes[i];if(st.fill||st.stroke){colorArrayStyle.push(st.fill||st.stroke)}}if(colorArrayStyle.length){config.colorArrayStyle=colorArrayStyle}}config.seriesIdx=idx;config.themeIdx=themeIndex}if(isInstance){Ext.applyIf(series,config)}else{Ext.applyIf(config,series);series=me.series.replace(Ext.createByAlias("series."+series.type.toLowerCase(),config))}}if(series.initialize){series.initialize()}series.initialized=true;return series},getMaxGutters:function(){var me=this,seriesItems=me.series.items,i,ln,series,gutters,lowerH=0,upperH=0,lowerV=0,upperV=0;for(i=0,ln=seriesItems.length;i<ln;i++){gutters=seriesItems[i].getGutters();if(gutters){if(gutters.verticalAxis){lowerV=Math.max(lowerV,gutters.lower);upperV=Math.max(upperV,gutters.upper)}else{lowerH=Math.max(lowerH,gutters.lower);upperH=Math.max(upperH,gutters.upper)}}}me.maxGutters={left:lowerH,right:upperH,bottom:lowerV,top:upperV}},drawAxis:function(axis){axis.drawAxis()},drawCharts:function(series){series.triggerafterrender=false;series.drawSeries();if(!this.animate){series.fireEvent("afterrender")}},save:function(config){return Ext.draw.Surface.save(this.surface,config)},destroy:function(){Ext.destroy(this.surface);this.bindStore(null);this.callParent(arguments)}});