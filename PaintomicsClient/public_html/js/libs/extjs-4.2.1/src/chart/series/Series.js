Ext.define("Ext.chart.series.Series",{mixins:{observable:"Ext.util.Observable",labels:"Ext.chart.Label",highlights:"Ext.chart.Highlight",tips:"Ext.chart.Tip",callouts:"Ext.chart.Callout"},type:null,title:null,showInLegend:true,renderer:function(sprite,record,attributes,index,store){return attributes},shadowAttributes:null,animating:false,nullGutters:{lower:0,upper:0,verticalAxis:undefined},nullPadding:{left:0,right:0,width:0,bottom:0,top:0,height:0},constructor:function(config){var me=this;if(config){Ext.apply(me,config)}me.shadowGroups=[];me.mixins.labels.constructor.call(me,config);me.mixins.highlights.constructor.call(me,config);me.mixins.tips.constructor.call(me,config);me.mixins.callouts.constructor.call(me,config);me.addEvents({scope:me,itemclick:true,itemmouseover:true,itemmouseout:true,itemmousedown:true,itemmouseup:true,mouseleave:true,afterdraw:true,titlechange:true});me.mixins.observable.constructor.call(me,config);me.on({scope:me,itemmouseover:me.onItemMouseOver,itemmouseout:me.onItemMouseOut,mouseleave:me.onMouseLeave});if(me.style){Ext.apply(me.seriesStyle,me.style)}},onRedraw:Ext.emptyFn,eachRecord:function(fn,scope){var chart=this.chart;chart.getChartStore().each(fn,scope)},getRecordCount:function(){var chart=this.chart,store=chart.getChartStore();return store?store.getCount():0},isExcluded:function(index){var excludes=this.__excludes;return!!(excludes&&excludes[index])},setBBox:function(noGutter){var me=this,chart=me.chart,chartBBox=chart.chartBBox,maxGutters=noGutter?{left:0,right:0,bottom:0,top:0}:chart.maxGutters,clipBox,bbox;clipBox={x:chartBBox.x,y:chartBBox.y,width:chartBBox.width,height:chartBBox.height};me.clipBox=clipBox;bbox={x:clipBox.x+maxGutters.left-chart.zoom.x*chart.zoom.width,y:clipBox.y+maxGutters.bottom-chart.zoom.y*chart.zoom.height,width:(clipBox.width-(maxGutters.left+maxGutters.right))*chart.zoom.width,height:(clipBox.height-(maxGutters.bottom+maxGutters.top))*chart.zoom.height};me.bbox=bbox},onAnimate:function(sprite,attr){var me=this;sprite.stopAnimation();if(me.animating){return sprite.animate(Ext.applyIf(attr,me.chart.animate))}else{me.animating=true;return sprite.animate(Ext.apply(Ext.applyIf(attr,me.chart.animate),{callback:function(){me.animating=false;me.fireEvent("afterrender")}}))}},getGutters:function(){return this.nullGutters},getPadding:function(){return this.nullPadding},onItemMouseOver:function(item){var me=this;if(item.series===me){if(me.highlight){me.highlightItem(item)}if(me.tooltip){me.showTip(item)}}},onItemMouseOut:function(item){var me=this;if(item.series===me){me.unHighlightItem();if(me.tooltip){me.hideTip(item)}}},onMouseLeave:function(){var me=this;me.unHighlightItem();if(me.tooltip){me.hideTip()}},getItemForPoint:function(x,y){if(!this.items||!this.items.length||this.seriesIsHidden){return null}var me=this,items=me.items,bbox=me.bbox,item,i,ln;if(!Ext.draw.Draw.withinBox(x,y,bbox)){return null}for(i=0,ln=items.length;i<ln;i++){if(items[i]&&this.isItemInPoint(x,y,items[i],i)){return items[i]}}return null},isItemInPoint:function(x,y,item,i){return false},hideAll:function(){var me=this,items=me.items,item,len,i,j,l,sprite,shadows;me.seriesIsHidden=true;me._prevShowMarkers=me.showMarkers;me.showMarkers=false;me.hideLabels(0);for(i=0,len=items.length;i<len;i++){item=items[i];sprite=item.sprite;if(sprite){sprite.setAttributes({hidden:true},true)}if(sprite&&sprite.shadows){shadows=sprite.shadows;for(j=0,l=shadows.length;j<l;++j){shadows[j].setAttributes({hidden:true},true)}}}},showAll:function(){var me=this,prevAnimate=me.chart.animate;me.chart.animate=false;me.seriesIsHidden=false;me.showMarkers=me._prevShowMarkers;me.drawSeries();me.chart.animate=prevAnimate},hide:function(){if(this.items){var me=this,items=me.items,i,j,lsh,ln,shadows;if(items&&items.length){for(i=0,ln=items.length;i<ln;++i){if(items[i].sprite){items[i].sprite.hide(true);shadows=items[i].shadows||items[i].sprite.shadows;if(shadows){for(j=0,lsh=shadows.length;j<lsh;++j){shadows[j].hide(true)}}}}me.hideLabels()}}},getLegendColor:function(index){var me=this,fill,stroke;if(me.seriesStyle){fill=me.seriesStyle.fill;stroke=me.seriesStyle.stroke;if(fill&&fill!="none"){return fill}if(stroke){return stroke}}return me.colorArrayStyle?me.colorArrayStyle[me.themeIdx%me.colorArrayStyle.length]:"#000"},visibleInLegend:function(index){var excludes=this.__excludes;if(excludes){return!excludes[index]}return!this.seriesIsHidden},setTitle:function(index,title){var me=this,oldTitle=me.title;if(Ext.isString(index)){title=index;index=0}if(Ext.isArray(oldTitle)){oldTitle[index]=title}else{me.title=title}me.fireEvent("titlechange",title,index)}});