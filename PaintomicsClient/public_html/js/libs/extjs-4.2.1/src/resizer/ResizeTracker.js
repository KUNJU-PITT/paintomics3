Ext.define("Ext.resizer.ResizeTracker",{extend:"Ext.dd.DragTracker",dynamic:true,preserveRatio:false,constrainTo:null,proxyCls:Ext.baseCSSPrefix+"resizable-proxy",constructor:function(config){var me=this,widthRatio,heightRatio,throttledResizeFn;if(!config.el){if(config.target.isComponent){me.el=config.target.getEl()}else{me.el=config.target}}this.callParent(arguments);if(me.preserveRatio&&me.minWidth&&me.minHeight){widthRatio=me.minWidth/me.el.getWidth();heightRatio=me.minHeight/me.el.getHeight();if(heightRatio>widthRatio){me.minWidth=me.el.getWidth()*heightRatio}else{me.minHeight=me.el.getHeight()*widthRatio}}if(me.throttle){throttledResizeFn=Ext.Function.createThrottled(function(){Ext.resizer.ResizeTracker.prototype.resize.apply(me,arguments)},me.throttle);me.resize=function(box,direction,atEnd){if(atEnd){Ext.resizer.ResizeTracker.prototype.resize.apply(me,arguments)}else{throttledResizeFn.apply(null,arguments)}}}},onBeforeStart:function(e){this.startBox=this.target.getBox()},getDynamicTarget:function(){var me=this,target=me.target;if(me.dynamic){return target}else if(!me.proxy){me.proxy=me.createProxy(target)}me.proxy.show();return me.proxy},createProxy:function(target){var proxy,cls=this.proxyCls;if(target.isComponent){proxy=target.getProxy().addCls(cls)}else{proxy=target.createProxy({tag:"div",cls:cls,id:target.id+"-rzproxy"},Ext.getBody())}proxy.removeCls(Ext.baseCSSPrefix+"proxy-el");return proxy},onStart:function(e){this.activeResizeHandle=Ext.get(this.getDragTarget().id);if(!this.dynamic){this.resize(this.startBox,{horizontal:"none",vertical:"none"})}},onDrag:function(e){if(this.dynamic||this.proxy){this.updateDimensions(e)}},updateDimensions:function(e,atEnd){var me=this,region=me.activeResizeHandle.region,offset=me.getOffset(me.constrainTo?"dragTarget":null),box=me.startBox,ratio,widthAdjust=0,heightAdjust=0,snappedWidth,snappedHeight,adjustX=0,adjustY=0,dragRatio,horizDir=offset[0]<0?"right":"left",vertDir=offset[1]<0?"down":"up",oppositeCorner,axis,newBox,newHeight,newWidth;region=me.convertRegionName(region);switch(region){case"south":heightAdjust=offset[1];axis=2;break;case"north":heightAdjust=-offset[1];adjustY=-heightAdjust;axis=2;break;case"east":widthAdjust=offset[0];axis=1;break;case"west":widthAdjust=-offset[0];adjustX=-widthAdjust;axis=1;break;case"northeast":heightAdjust=-offset[1];adjustY=-heightAdjust;widthAdjust=offset[0];oppositeCorner=[box.x,box.y+box.height];axis=3;break;case"southeast":heightAdjust=offset[1];widthAdjust=offset[0];oppositeCorner=[box.x,box.y];axis=3;break;case"southwest":widthAdjust=-offset[0];adjustX=-widthAdjust;heightAdjust=offset[1];oppositeCorner=[box.x+box.width,box.y];axis=3;break;case"northwest":heightAdjust=-offset[1];adjustY=-heightAdjust;widthAdjust=-offset[0];adjustX=-widthAdjust;oppositeCorner=[box.x+box.width,box.y+box.height];axis=3;break}newBox={width:box.width+widthAdjust,height:box.height+heightAdjust,x:box.x+adjustX,y:box.y+adjustY};snappedWidth=Ext.Number.snap(newBox.width,me.widthIncrement);snappedHeight=Ext.Number.snap(newBox.height,me.heightIncrement);if(snappedWidth!=newBox.width||snappedHeight!=newBox.height){switch(region){case"northeast":newBox.y-=snappedHeight-newBox.height;break;case"north":newBox.y-=snappedHeight-newBox.height;break;case"southwest":newBox.x-=snappedWidth-newBox.width;break;case"west":newBox.x-=snappedWidth-newBox.width;break;case"northwest":newBox.x-=snappedWidth-newBox.width;newBox.y-=snappedHeight-newBox.height}newBox.width=snappedWidth;newBox.height=snappedHeight}if(newBox.width<me.minWidth||newBox.width>me.maxWidth){newBox.width=Ext.Number.constrain(newBox.width,me.minWidth,me.maxWidth);if(adjustX){newBox.x=box.x+(box.width-newBox.width)}}else{me.lastX=newBox.x}if(newBox.height<me.minHeight||newBox.height>me.maxHeight){newBox.height=Ext.Number.constrain(newBox.height,me.minHeight,me.maxHeight);if(adjustY){newBox.y=box.y+(box.height-newBox.height)}}else{me.lastY=newBox.y}if(me.preserveRatio||e.shiftKey){ratio=me.startBox.width/me.startBox.height;newHeight=Math.min(Math.max(me.minHeight,newBox.width/ratio),me.maxHeight);newWidth=Math.min(Math.max(me.minWidth,newBox.height*ratio),me.maxWidth);if(axis==1){newBox.height=newHeight}else if(axis==2){newBox.width=newWidth}else{dragRatio=Math.abs(oppositeCorner[0]-this.lastXY[0])/Math.abs(oppositeCorner[1]-this.lastXY[1]);if(dragRatio>ratio){newBox.height=newHeight}else{newBox.width=newWidth}if(region=="northeast"){newBox.y=box.y-(newBox.height-box.height)}else if(region=="northwest"){newBox.y=box.y-(newBox.height-box.height);newBox.x=box.x-(newBox.width-box.width)}else if(region=="southwest"){newBox.x=box.x-(newBox.width-box.width)}}}if(heightAdjust===0){vertDir="none"}if(widthAdjust===0){horizDir="none"}me.resize(newBox,{horizontal:horizDir,vertical:vertDir},atEnd)},getResizeTarget:function(atEnd){return atEnd?this.target:this.getDynamicTarget()},resize:function(box,direction,atEnd){var me=this,target=me.getResizeTarget(atEnd);target.setBox(box);if(me.originalTarget&&(me.dynamic||atEnd)){me.originalTarget.setBox(box)}},onEnd:function(e){this.updateDimensions(e,true);if(this.proxy){this.proxy.hide()}},convertRegionName:function(name){return name}});