Ext.define("Ext.chart.series.Area",{extend:"Ext.chart.series.Cartesian",alias:"series.area",requires:["Ext.chart.axis.Axis","Ext.draw.Color","Ext.fx.Anim"],type:"area",stacked:true,style:{},constructor:function(config){this.callParent(arguments);var me=this,surface=me.chart.surface,i,l;config.highlightCfg=Ext.Object.merge({},{lineWidth:3,stroke:"#55c",opacity:.8,color:"#f00"},config.highlightCfg);Ext.apply(me,config,{__excludes:[]});if(me.highlight){me.highlightSprite=surface.add({type:"path",path:["M",0,0],zIndex:1e3,opacity:.3,lineWidth:5,hidden:true,stroke:"#444"})}me.group=surface.getGroup(me.seriesId)},shrink:function(xValues,yValues,size){var len=xValues.length,ratio=Math.floor(len/size),i,j,xSum=0,yCompLen=this.areas.length,ySum=[],xRes=[],yRes=[];for(j=0;j<yCompLen;++j){ySum[j]=0}for(i=0;i<len;++i){xSum+=+xValues[i];for(j=0;j<yCompLen;++j){ySum[j]+=+yValues[i][j]}if(i%ratio==0){xRes.push(xSum/ratio);for(j=0;j<yCompLen;++j){ySum[j]/=ratio}yRes.push(ySum);xSum=0;for(j=0,ySum=[];j<yCompLen;++j){ySum[j]=0}}}return{x:xRes,y:yRes}},getBounds:function(){var me=this,chart=me.chart,store=chart.getChartStore(),data=store.data.items,i,l,record,areas=[].concat(me.yField),areasLen=areas.length,xValues=[],yValues=[],infinity=Infinity,minX=infinity,minY=infinity,maxX=-infinity,maxY=-infinity,math=Math,mmin=math.min,mmax=math.max,boundAxis=me.getAxesForXAndYFields(),boundXAxis=boundAxis.xAxis,boundYAxis=boundAxis.yAxis,ends,allowDate,tmp,bbox,xScale,yScale,xValue,yValue,areaIndex,acumY,ln,sumValues,clipBox,areaElem,axis,out;me.setBBox();bbox=me.bbox;if(axis=chart.axes.get(boundXAxis)){if(axis.type==="Time"){allowDate=true}ends=axis.applyData();minX=ends.from;maxX=ends.to}if(axis=chart.axes.get(boundYAxis)){ends=axis.applyData();minY=ends.from;maxY=ends.to}if(me.xField&&!Ext.isNumber(minX)){axis=me.getMinMaxXValues();allowDate=true;minX=axis[0];maxX=axis[1]}if(me.yField&&!Ext.isNumber(minY)){axis=me.getMinMaxYValues();minY=axis[0];maxY=axis[1]}if(!Ext.isNumber(minY)){minY=0}if(!Ext.isNumber(maxY)){maxY=0}l=data.length;if(l>0&&allowDate){tmp=data[0].get(me.xField);if(typeof tmp!="number"){tmp=+tmp;if(isNaN(tmp)){allowDate=false}}}for(i=0;i<l;i++){record=data[i];xValue=record.get(me.xField);yValue=[];if(typeof xValue!="number"){if(allowDate){xValue=+xValue}else{xValue=i}}xValues.push(xValue);acumY=0;for(areaIndex=0;areaIndex<areasLen;areaIndex++){if(me.__excludes[areaIndex]){continue}areaElem=record.get(areas[areaIndex]);if(typeof areaElem=="number"){yValue.push(areaElem)}}yValues.push(yValue)}xScale=bbox.width/(maxX-minX||1);yScale=bbox.height/(maxY-minY||1);ln=xValues.length;if(ln>bbox.width&&me.areas){sumValues=me.shrink(xValues,yValues,bbox.width);xValues=sumValues.x;yValues=sumValues.y}return{bbox:bbox,minX:minX,minY:minY,xValues:xValues,yValues:yValues,xScale:xScale,yScale:yScale,areasLen:areasLen}},getPaths:function(){var me=this,chart=me.chart,store=chart.getChartStore(),first=true,bounds=me.getBounds(),bbox=bounds.bbox,items=me.items=[],componentPaths=[],componentPath,count=0,paths=[],i,ln,x,y,xValue,yValue,acumY,areaIndex,prevAreaIndex,areaElem,path,startX;ln=bounds.xValues.length;for(i=0;i<ln;i++){xValue=bounds.xValues[i];yValue=bounds.yValues[i];x=bbox.x+(xValue-bounds.minX)*bounds.xScale;if(startX===undefined){startX=x}acumY=0;count=0;for(areaIndex=0;areaIndex<bounds.areasLen;areaIndex++){if(me.__excludes[areaIndex]){continue}if(!componentPaths[areaIndex]){componentPaths[areaIndex]=[]}areaElem=yValue[count];acumY+=areaElem;y=bbox.y+bbox.height-(acumY-bounds.minY)*bounds.yScale;if(!paths[areaIndex]){paths[areaIndex]=["M",x,y];componentPaths[areaIndex].push(["L",x,y])}else{paths[areaIndex].push("L",x,y);componentPaths[areaIndex].push(["L",x,y])}if(!items[areaIndex]){items[areaIndex]={pointsUp:[],pointsDown:[],series:me}}items[areaIndex].pointsUp.push([x,y]);count++}}for(areaIndex=0;areaIndex<bounds.areasLen;areaIndex++){if(me.__excludes[areaIndex]){continue}path=paths[areaIndex];if(areaIndex==0||first){first=false;path.push("L",x,bbox.y+bbox.height,"L",startX,bbox.y+bbox.height,"Z")}else{componentPath=componentPaths[prevAreaIndex];componentPath.reverse();path.push("L",x,componentPath[0][2]);for(i=0;i<ln;i++){path.push(componentPath[i][0],componentPath[i][1],componentPath[i][2]);items[areaIndex].pointsDown[ln-i-1]=[componentPath[i][1],componentPath[i][2]]}path.push("L",startX,path[2],"Z")}prevAreaIndex=areaIndex}return{paths:paths,areasLen:bounds.areasLen}},drawSeries:function(){var me=this,chart=me.chart,store=chart.getChartStore(),surface=chart.surface,animate=chart.animate,group=me.group,endLineStyle=Ext.apply(me.seriesStyle,me.style),colorArrayStyle=me.colorArrayStyle,colorArrayLength=colorArrayStyle&&colorArrayStyle.length||0,themeIndex=me.themeIdx,areaIndex,areaElem,paths,path,rendererAttributes,idx;me.unHighlightItem();me.cleanHighlights();if(!store||!store.getCount()||me.seriesIsHidden){me.hide();me.items=[];return}paths=me.getPaths();if(!me.areas){me.areas=[]}for(areaIndex=0;areaIndex<paths.areasLen;areaIndex++){if(me.__excludes[areaIndex]){continue}idx=themeIndex+areaIndex;if(!me.areas[areaIndex]){me.items[areaIndex].sprite=me.areas[areaIndex]=surface.add(Ext.apply({},{type:"path",group:group,path:paths.paths[areaIndex],stroke:endLineStyle.stroke||colorArrayStyle[idx%colorArrayLength],fill:colorArrayStyle[idx%colorArrayLength]},endLineStyle||{}))}areaElem=me.areas[areaIndex];path=paths.paths[areaIndex];if(animate){rendererAttributes=me.renderer(areaElem,false,{path:path,fill:colorArrayStyle[areaIndex%colorArrayLength],stroke:endLineStyle.stroke||colorArrayStyle[areaIndex%colorArrayLength]},areaIndex,store);me.animation=me.onAnimate(areaElem,{to:rendererAttributes})}else{rendererAttributes=me.renderer(areaElem,false,{path:path,hidden:false,fill:colorArrayStyle[idx%colorArrayLength],stroke:endLineStyle.stroke||colorArrayStyle[idx%colorArrayLength]},areaIndex,store);me.areas[areaIndex].setAttributes(rendererAttributes,true)}}me.renderLabels();me.renderCallouts()},onAnimate:function(sprite,attr){sprite.show();return this.callParent(arguments)},onCreateLabel:function(storeItem,item,i,display){return null;var me=this,group=me.labelsGroup,config=me.label,bbox=me.bbox,endLabelStyle=Ext.apply({},config,me.seriesLabelStyle||{});return me.chart.surface.add(Ext.apply({type:"text","text-anchor":"middle",group:group,x:Number(item.point[0]),y:bbox.y+bbox.height/2},endLabelStyle||{}))},onPlaceLabel:function(label,storeItem,item,i,display,animate,index){var me=this,chart=me.chart,resizing=chart.resizing,config=me.label,format=config.renderer,field=config.field,bbox=me.bbox,x=Number(item.point[i][0]),y=Number(item.point[i][1]),labelBox,width,height;label.setAttributes({text:format(storeItem.get(field[index]),label,storeItem,item,i,display,animate,index),hidden:true},true);labelBox=label.getBBox();width=labelBox.width/2;height=labelBox.height/2;if(x<bbox.x+width){x=bbox.x+width}else if(x+width>bbox.x+bbox.width){x=bbox.x+bbox.width-width}y=y-height;if(y<bbox.y+height){y+=2*height}else if(y+height>bbox.y+bbox.height){y-=2*height}if(me.chart.animate&&!me.chart.resizing){label.show(true);me.onAnimate(label,{to:{x:x,y:y}})}else{label.setAttributes({x:x,y:y},true);if(resizing&&me.animation){me.animation.on("afteranimate",function(){label.show(true)})}else{label.show(true)}}},onPlaceCallout:function(callout,storeItem,item,i,display,animate,index){var me=this,chart=me.chart,surface=chart.surface,resizing=chart.resizing,config=me.callouts,items=me.items,prev=i==0?false:items[i-1].point,next=i==items.length-1?false:items[i+1].point,cur=item.point,dir,norm,normal,a,aprev,anext,bbox=callout&&callout.label?callout.label.getBBox():{width:0,height:0},offsetFromViz=30,offsetToSide=10,offsetBox=3,boxx,boxy,boxw,boxh,p,clipRect=me.clipRect,x,y;if(!bbox.width||!bbox.height){return}if(!prev){prev=cur}if(!next){next=cur}a=(next[1]-prev[1])/(next[0]-prev[0]);aprev=(cur[1]-prev[1])/(cur[0]-prev[0]);anext=(next[1]-cur[1])/(next[0]-cur[0]);norm=Math.sqrt(1+a*a);dir=[1/norm,a/norm];normal=[-dir[1],dir[0]];if(aprev>0&&anext<0&&normal[1]<0||aprev<0&&anext>0&&normal[1]>0){normal[0]*=-1;normal[1]*=-1}else if(Math.abs(aprev)<Math.abs(anext)&&normal[0]<0||Math.abs(aprev)>Math.abs(anext)&&normal[0]>0){normal[0]*=-1;normal[1]*=-1}x=cur[0]+normal[0]*offsetFromViz;y=cur[1]+normal[1]*offsetFromViz;boxx=x+(normal[0]>0?0:-(bbox.width+2*offsetBox));boxy=y-bbox.height/2-offsetBox;boxw=bbox.width+2*offsetBox;boxh=bbox.height+2*offsetBox;if(boxx<clipRect[0]||boxx+boxw>clipRect[0]+clipRect[2]){normal[0]*=-1}if(boxy<clipRect[1]||boxy+boxh>clipRect[1]+clipRect[3]){normal[1]*=-1}x=cur[0]+normal[0]*offsetFromViz;y=cur[1]+normal[1]*offsetFromViz;boxx=x+(normal[0]>0?0:-(bbox.width+2*offsetBox));boxy=y-bbox.height/2-offsetBox;boxw=bbox.width+2*offsetBox;boxh=bbox.height+2*offsetBox;callout.lines.setAttributes({path:["M",cur[0],cur[1],"L",x,y,"Z"]},true);callout.box.setAttributes({x:boxx,y:boxy,width:boxw,height:boxh},true);callout.label.setAttributes({x:x+(normal[0]>0?offsetBox:-(bbox.width+offsetBox)),y:y},true);for(p in callout){callout[p].show(true)}},isItemInPoint:function(x,y,item,i){var me=this,pointsUp=item.pointsUp,pointsDown=item.pointsDown,abs=Math.abs,distChanged=false,last=false,dist=Infinity,p,pln,point;for(p=0,pln=pointsUp.length;p<pln;p++){point=[pointsUp[p][0],pointsUp[p][1]];distChanged=false;last=p==pln-1;if(dist>abs(x-point[0])){dist=abs(x-point[0]);distChanged=true;if(last){++p}}if(!distChanged||distChanged&&last){point=pointsUp[p-1];if(y>=point[1]&&(!pointsDown.length||y<=pointsDown[p-1][1])){item.storeIndex=p-1;item.storeField=me.yField[i];item.storeItem=me.chart.getChartStore().getAt(p-1);item._points=pointsDown.length?[point,pointsDown[p-1]]:[point];return true}else{break}}}return false},highlightSeries:function(){var area,to,fillColor;if(this._index!==undefined){area=this.areas[this._index];if(area.__highlightAnim){area.__highlightAnim.paused=true}area.__highlighted=true;area.__prevOpacity=area.__prevOpacity||area.attr.opacity||1;area.__prevFill=area.__prevFill||area.attr.fill;area.__prevLineWidth=area.__prevLineWidth||area.attr.lineWidth;fillColor=Ext.draw.Color.fromString(area.__prevFill);to={lineWidth:(area.__prevLineWidth||0)+2};if(fillColor){to.fill=fillColor.getLighter(.2).toString()}else{to.opacity=Math.max(area.__prevOpacity-.3,0)}if(this.chart.animate){area.__highlightAnim=new Ext.fx.Anim(Ext.apply({target:area,to:to},this.chart.animate))}else{area.setAttributes(to,true)}}},unHighlightSeries:function(){var area;if(this._index!==undefined){area=this.areas[this._index];if(area.__highlightAnim){area.__highlightAnim.paused=true}if(area.__highlighted){area.__highlighted=false;area.__highlightAnim=new Ext.fx.Anim({target:area,to:{fill:area.__prevFill,opacity:area.__prevOpacity,lineWidth:area.__prevLineWidth}})}}},highlightItem:function(item){var me=this,points,path;if(!item){this.highlightSeries();return}points=item._points;path=points.length==2?["M",points[0][0],points[0][1],"L",points[1][0],points[1][1]]:["M",points[0][0],points[0][1],"L",points[0][0],me.bbox.y+me.bbox.height];me.highlightSprite.setAttributes({path:path,hidden:false},true)},unHighlightItem:function(item){if(!item){this.unHighlightSeries()}if(this.highlightSprite){this.highlightSprite.hide(true)}},hideAll:function(index){var me=this;index=(isNaN(me._index)?index:me._index)||0;me.__excludes[index]=true;me.areas[index].hide(true);me.redraw()},showAll:function(index){var me=this;index=(isNaN(me._index)?index:me._index)||0;me.__excludes[index]=false;me.areas[index].show(true);me.redraw()},redraw:function(){var me=this,prevLegendConfig;prevLegendConfig=me.chart.legend.rebuild;me.chart.legend.rebuild=false;me.chart.redraw();me.chart.legend.rebuild=prevLegendConfig},hide:function(){if(this.areas){var me=this,areas=me.areas,i,j,l,ln,shadows;if(areas&&areas.length){for(i=0,ln=areas.length;i<ln;++i){if(areas[i]){areas[i].hide(true)}}me.hideLabels()}}},getLegendColor:function(index){var me=this;index+=me.themeIdx;return me.colorArrayStyle[index%me.colorArrayStyle.length]}});