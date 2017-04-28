Ext.define("Ext.chart.LegendItem",{extend:"Ext.draw.CompositeSprite",requires:["Ext.chart.Shape"],hiddenSeries:false,label:undefined,x:0,y:0,zIndex:500,boldRe:/bold\s\d{1,}.*/i,constructor:function(config){this.callParent(arguments);this.createLegend(config)},createLegend:function(config){var me=this,series=me.series,index=config.yFieldIndex;me.label=me.createLabel(config);me.createSeriesMarkers(config);me.setAttributes({hidden:false},true);me.yFieldIndex=index;me.on("mouseover",me.onMouseOver,me);me.on("mouseout",me.onMouseOut,me);me.on("mousedown",me.onMouseDown,me);if(!series.visibleInLegend(index)){me.hiddenSeries=true;me.label.setAttributes({opacity:.5},true)}me.updatePosition({x:0,y:0})},getLabelText:function(){var me=this,series=me.series,idx=me.yFieldIndex;function getSeriesProp(name){var val=series[name];return Ext.isArray(val)?val[idx]:val}return getSeriesProp("title")||getSeriesProp("yField")},createLabel:function(config){var me=this,legend=me.legend;return me.add("label",me.surface.add({type:"text",x:20,y:0,zIndex:(me.zIndex||0)+2,fill:legend.labelColor,font:legend.labelFont,text:me.getLabelText(),style:{cursor:"pointer"}}))},createSeriesMarkers:function(config){var me=this,index=config.yFieldIndex,series=me.series,seriesType=series.type,surface=me.surface,z=me.zIndex;if(seriesType==="line"||seriesType==="scatter"){if(seriesType==="line"){var seriesStyle=Ext.apply(series.seriesStyle,series.style);me.drawLine(.5,.5,16.5,.5,z,seriesStyle,index)}if(series.showMarkers||seriesType==="scatter"){var markerConfig=Ext.apply(series.markerStyle,series.markerConfig||{},{fill:series.getLegendColor(index)});me.drawMarker(8.5,.5,z,markerConfig)}}else{me.drawFilledBox(12,12,z,index)}},drawLine:function(fromX,fromY,toX,toY,z,seriesStyle,index){var me=this,surface=me.surface,series=me.series;return me.add("line",surface.add({type:"path",path:"M"+fromX+","+fromY+"L"+toX+","+toY,zIndex:(z||0)+2,"stroke-width":series.lineWidth,"stroke-linejoin":"round","stroke-dasharray":series.dash,stroke:seriesStyle.stroke||series.getLegendColor(index)||"#000",style:{cursor:"pointer"}}))},drawMarker:function(x,y,z,markerConfig){var me=this,surface=me.surface,series=me.series;return me.add("marker",Ext.chart.Shape[markerConfig.type](surface,{fill:markerConfig.fill,x:x,y:y,zIndex:(z||0)+2,radius:markerConfig.radius||markerConfig.size,style:{cursor:"pointer"}}))},drawFilledBox:function(width,height,z,index){var me=this,surface=me.surface,series=me.series;return me.add("box",surface.add({type:"rect",zIndex:(z||0)+2,x:0,y:0,width:width,height:height,fill:series.getLegendColor(index),style:{cursor:"pointer"}}))},onMouseOver:function(){var me=this;me.label.setStyle({"font-weight":"bold"});me.series._index=me.yFieldIndex;me.series.highlightItem()},onMouseOut:function(){var me=this,legend=me.legend,boldRe=me.boldRe;me.label.setStyle({"font-weight":legend.labelFont&&boldRe.test(legend.labelFont)?"bold":"normal"});me.series._index=me.yFieldIndex;me.series.unHighlightItem()},onMouseDown:function(){var me=this,index=me.yFieldIndex;if(!me.hiddenSeries){me.series.hideAll(index);me.label.setAttributes({opacity:.5},true)}else{me.series.showAll(index);me.label.setAttributes({opacity:1},true)}me.hiddenSeries=!me.hiddenSeries;me.legend.chart.redraw()},updatePosition:function(relativeTo){var me=this,items=me.items,ln=items.length,i=0,item;if(!relativeTo){relativeTo=me.legend}for(;i<ln;i++){item=items[i];switch(item.type){case"text":item.setAttributes({x:20+relativeTo.x+me.x,y:relativeTo.y+me.y},true);break;case"rect":item.setAttributes({translate:{x:relativeTo.x+me.x,y:relativeTo.y+me.y-6}},true);break;default:item.setAttributes({translate:{x:relativeTo.x+me.x,y:relativeTo.y+me.y}},true)}}}});