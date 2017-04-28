Ext.define("Ext.layout.ContextItem",{requires:["Ext.layout.ClassList"],heightModel:null,widthModel:null,sizeModel:null,optOut:false,ownerSizePolicy:null,boxChildren:null,boxParent:null,isBorderBoxValue:null,children:[],dirty:null,dirtyCount:0,hasRawContent:true,isContextItem:true,isTopLevel:false,consumersContentHeight:0,consumersContentWidth:0,consumersContainerHeight:0,consumersContainerWidth:0,consumersHeight:0,consumersWidth:0,ownerCtContext:null,remainingChildDimensions:0,props:null,state:null,wrapsComponent:false,constructor:function(config){var me=this,sizeModels=Ext.layout.SizeModel.sizeModels,configured=sizeModels.configured,shrinkWrap=sizeModels.shrinkWrap,el,lastBox,ownerCt,ownerCtContext,props,sizeModel,target,lastWidth,lastHeight,sameWidth,sameHeight,widthModel,heightModel,optOut;Ext.apply(me,config);el=me.el;me.id=el.id;me.flushedProps={};me.props=props={};me.styles={};target=me.target;if(!target.isComponent){lastBox=el.lastBox}else{me.wrapsComponent=true;me.framing=target.frameSize||null;me.isComponentChild=target.ownerLayout&&target.ownerLayout.isComponentLayout;lastBox=target.lastBox;ownerCt=target.ownerCt;if(ownerCt&&(ownerCtContext=ownerCt.el&&me.context.items[ownerCt.el.id])){me.ownerCtContext=ownerCtContext}me.sizeModel=sizeModel=target.getSizeModel(ownerCtContext&&ownerCtContext.widthModel.pairsByHeightOrdinal[ownerCtContext.heightModel.ordinal]);me.widthModel=widthModel=sizeModel.width;me.heightModel=heightModel=sizeModel.height;if(lastBox&&lastBox.invalid===false){sameWidth=target.width===(lastWidth=lastBox.width);sameHeight=target.height===(lastHeight=lastBox.height);if(widthModel===shrinkWrap&&heightModel===shrinkWrap){optOut=true}else if(widthModel===configured&&sameWidth){optOut=heightModel===shrinkWrap||heightModel===configured&&sameHeight}if(optOut){me.optOut=true;props.width=lastWidth;props.height=lastHeight}}}me.lastBox=lastBox},init:function(full,options){var me=this,oldProps=me.props,oldDirty=me.dirty,ownerCtContext=me.ownerCtContext,ownerLayout=me.target.ownerLayout,firstTime=!me.state,ret=full||firstTime,children,i,n,ownerCt,sizeModel,target,oldHeightModel=me.heightModel,oldWidthModel=me.widthModel,newHeightModel,newWidthModel,remainingCount=0;me.dirty=me.invalid=false;me.props={};me.remainingChildDimensions=0;if(me.boxChildren){me.boxChildren.length=0}if(!firstTime){me.clearAllBlocks("blocks");me.clearAllBlocks("domBlocks")}if(!me.wrapsComponent){return ret}target=me.target;me.state={};if(firstTime){if(target.beforeLayout&&target.beforeLayout!==Ext.emptyFn){target.beforeLayout()}if(!ownerCtContext&&(ownerCt=target.ownerCt)){ownerCtContext=me.context.items[ownerCt.el.id]}if(ownerCtContext){me.ownerCtContext=ownerCtContext;me.isBoxParent=target.ownerLayout.isItemBoxParent(me)}else{me.isTopLevel=true}me.frameBodyContext=me.getEl("frameBody")}else{ownerCtContext=me.ownerCtContext;me.isTopLevel=!ownerCtContext;children=me.children;for(i=0,n=children.length;i<n;++i){children[i].init(true)}}me.hasRawContent=!(target.isContainer&&target.items.items.length>0);if(full){me.widthModel=me.heightModel=null;sizeModel=target.getSizeModel(ownerCtContext&&ownerCtContext.widthModel.pairsByHeightOrdinal[ownerCtContext.heightModel.ordinal]);if(firstTime){me.sizeModel=sizeModel}me.widthModel=sizeModel.width;me.heightModel=sizeModel.height;if(ownerCtContext&&!me.isComponentChild){ownerCtContext.remainingChildDimensions+=2}}else if(oldProps){me.recoverProp("x",oldProps,oldDirty);me.recoverProp("y",oldProps,oldDirty);if(me.widthModel.calculated){me.recoverProp("width",oldProps,oldDirty)}else if("width"in oldProps){++remainingCount}if(me.heightModel.calculated){me.recoverProp("height",oldProps,oldDirty)}else if("height"in oldProps){++remainingCount}if(ownerCtContext&&!me.isComponentChild){ownerCtContext.remainingChildDimensions+=remainingCount}}if(oldProps&&ownerLayout&&ownerLayout.manageMargins){me.recoverProp("margin-top",oldProps,oldDirty);me.recoverProp("margin-right",oldProps,oldDirty);me.recoverProp("margin-bottom",oldProps,oldDirty);me.recoverProp("margin-left",oldProps,oldDirty)}if(options){newHeightModel=options.heightModel;newWidthModel=options.widthModel;if(newWidthModel&&newHeightModel&&oldWidthModel&&oldHeightModel){if(oldWidthModel.shrinkWrap&&oldHeightModel.shrinkWrap){if(newWidthModel.constrainedMax&&newHeightModel.constrainedMin){newHeightModel=null}}}if(newWidthModel){me.widthModel=newWidthModel}if(newHeightModel){me.heightModel=newHeightModel}if(options.state){Ext.apply(me.state,options.state)}}return ret},initContinue:function(full){var me=this,ownerCtContext=me.ownerCtContext,comp=me.target,widthModel=me.widthModel,hierarchyState=comp.getHierarchyState(),boxParent;if(widthModel.fixed){hierarchyState.inShrinkWrapTable=false}else{delete hierarchyState.inShrinkWrapTable}if(full){if(ownerCtContext&&widthModel.shrinkWrap){boxParent=ownerCtContext.isBoxParent?ownerCtContext:ownerCtContext.boxParent;if(boxParent){boxParent.addBoxChild(me)}}else if(widthModel.natural){me.boxParent=ownerCtContext}}return full},initDone:function(containerLayoutDone){var me=this,props=me.props,state=me.state;if(me.remainingChildDimensions===0){props.containerChildrenSizeDone=true}if(containerLayoutDone){props.containerLayoutDone=true}if(me.boxChildren&&me.boxChildren.length&&me.widthModel.shrinkWrap){me.el.setWidth(1e4);state.blocks=(state.blocks||0)+1}},initAnimation:function(){var me=this,target=me.target,ownerCtContext=me.ownerCtContext;if(ownerCtContext&&ownerCtContext.isTopLevel){me.animatePolicy=target.ownerLayout.getAnimatePolicy(me)}else if(!ownerCtContext&&target.isCollapsingOrExpanding&&target.animCollapse){me.animatePolicy=target.componentLayout.getAnimatePolicy(me)}if(me.animatePolicy){me.context.queueAnimation(me)}},addCls:function(newCls){this.getClassList().addMany(newCls)},removeCls:function(removeCls){this.getClassList().removeMany(removeCls)},addBlock:function(name,layout,propName){var me=this,collection=me[name]||(me[name]={}),blockedLayouts=collection[propName]||(collection[propName]={});if(!blockedLayouts[layout.id]){blockedLayouts[layout.id]=layout;++layout.blockCount;++me.context.blockCount}},addBoxChild:function(boxChildItem){var me=this,children,widthModel=boxChildItem.widthModel;boxChildItem.boxParent=this;boxChildItem.measuresBox=widthModel.shrinkWrap?boxChildItem.hasRawContent:widthModel.natural;if(boxChildItem.measuresBox){children=me.boxChildren;if(children){children.push(boxChildItem)}else{me.boxChildren=[boxChildItem]}}},addPositionStyles:function(styles,props){var x=props.x,y=props.y,count=0;if(x!==undefined){styles.left=x+"px";++count}if(y!==undefined){styles.top=y+"px";++count}return count},addTrigger:function(propName,inDom){var me=this,name=inDom?"domTriggers":"triggers",collection=me[name]||(me[name]={}),context=me.context,layout=context.currentLayout,triggers=collection[propName]||(collection[propName]={});if(!triggers[layout.id]){triggers[layout.id]=layout;++layout.triggerCount;triggers=context.triggers[inDom?"dom":"data"];(triggers[layout.id]||(triggers[layout.id]=[])).push({item:this,prop:propName});if(me.props[propName]!==undefined){if(!inDom||!(me.dirty&&propName in me.dirty)){++layout.firedTriggers}}}},boxChildMeasured:function(){var me=this,state=me.state,count=state.boxesMeasured=(state.boxesMeasured||0)+1;if(count==me.boxChildren.length){state.clearBoxWidth=1;++me.context.progressCount;me.markDirty()}},borderNames:["border-top-width","border-right-width","border-bottom-width","border-left-width"],marginNames:["margin-top","margin-right","margin-bottom","margin-left"],paddingNames:["padding-top","padding-right","padding-bottom","padding-left"],trblNames:["top","right","bottom","left"],cacheMissHandlers:{borderInfo:function(me){var info=me.getStyles(me.borderNames,me.trblNames);info.width=info.left+info.right;info.height=info.top+info.bottom;return info},marginInfo:function(me){var info=me.getStyles(me.marginNames,me.trblNames);info.width=info.left+info.right;info.height=info.top+info.bottom;return info},paddingInfo:function(me){var item=me.frameBodyContext||me,info=item.getStyles(me.paddingNames,me.trblNames);info.width=info.left+info.right;info.height=info.top+info.bottom;return info}},checkCache:function(entry){return this.cacheMissHandlers[entry](this)},clearAllBlocks:function(name){var collection=this[name],propName;if(collection){for(propName in collection){this.clearBlocks(name,propName)}}},clearBlocks:function(name,propName){var collection=this[name],blockedLayouts=collection&&collection[propName],context,layout,layoutId;if(blockedLayouts){delete collection[propName];context=this.context;for(layoutId in blockedLayouts){layout=blockedLayouts[layoutId];--context.blockCount;if(!--layout.blockCount&&!layout.pending&&!layout.done){context.queueLayout(layout)}}}},block:function(layout,propName){this.addBlock("blocks",layout,propName)},domBlock:function(layout,propName){this.addBlock("domBlocks",layout,propName)},fireTriggers:function(name,propName){var collection=this[name],triggers=collection&&collection[propName],context=this.context,layout,layoutId;if(triggers){for(layoutId in triggers){layout=triggers[layoutId];++layout.firedTriggers;if(!layout.done&&!layout.blockCount&&!layout.pending){context.queueLayout(layout)}}}},flush:function(){var me=this,dirty=me.dirty,state=me.state,targetEl=me.el;me.dirtyCount=0;if(me.classList&&me.classList.dirty){me.classList.flush()}if("attributes"in me){targetEl.set(me.attributes);delete me.attributes}if("innerHTML"in me){targetEl.innerHTML=me.innerHTML;delete me.innerHTML}if(state&&state.clearBoxWidth){state.clearBoxWidth=0;me.el.setStyle("width",null);if(!--state.blocks){me.context.queueItemLayouts(me)}}if(dirty){delete me.dirty;me.writeProps(dirty,true)}},flushAnimations:function(){var me=this,animateFrom=me.previousSize,target,targetAnim,duration,animateProps,anim,changeCount,j,propsLen,propName,oldValue,newValue;if(animateFrom){target=me.target;targetAnim=target.layout&&target.layout.animate;if(targetAnim){duration=Ext.isNumber(targetAnim)?targetAnim:targetAnim.duration}animateProps=Ext.Object.getKeys(me.animatePolicy);anim=Ext.apply({},{from:{},to:{},duration:duration||Ext.fx.Anim.prototype.duration},targetAnim);for(changeCount=0,j=0,propsLen=animateProps.length;j<propsLen;j++){propName=animateProps[j];oldValue=animateFrom[propName];newValue=me.peek(propName);if(oldValue!=newValue){propName=me.translateProps[propName]||propName;anim.from[propName]=oldValue;anim.to[propName]=newValue;++changeCount}}if(changeCount){if(me.isCollapsingOrExpanding===1){target.componentLayout.undoLayout(me)}else{me.writeProps(anim.from)}me.el.animate(anim);Ext.fx.Manager.getFxQueue(me.el.id)[0].on({afteranimate:function(){if(me.isCollapsingOrExpanding===1){target.componentLayout.redoLayout(me);target.afterCollapse(true)}else if(me.isCollapsingOrExpanding===2){target.afterExpand(true)}}})}}},getBorderInfo:function(){var me=this,info=me.borderInfo;if(!info){me.borderInfo=info=me.checkCache("borderInfo")}return info},getClassList:function(){return this.classList||(this.classList=new Ext.layout.ClassList(this))},getEl:function(nameOrEl,owner){var me=this,src,el,elContext;if(nameOrEl){if(nameOrEl.dom){el=nameOrEl}else{src=me.target;if(owner){src=owner}el=src[nameOrEl];if(typeof el=="function"){el=el.call(src);if(el===me.el){return this}}}if(el){elContext=me.context.getEl(me,el)}}return elContext||null},getFrameInfo:function(){var me=this,info=me.frameInfo,framing,border;if(!info){framing=me.framing;border=me.getBorderInfo();me.frameInfo=info=framing?{top:framing.top+border.top,right:framing.right+border.right,bottom:framing.bottom+border.bottom,left:framing.left+border.left,width:framing.width+border.width,height:framing.height+border.height}:border}return info},getMarginInfo:function(){var me=this,info=me.marginInfo,comp,manageMargins,margins,ownerLayout,ownerLayoutId;if(!info){if(!me.wrapsComponent){info=me.checkCache("marginInfo")}else{comp=me.target;ownerLayout=comp.ownerLayout;ownerLayoutId=ownerLayout?ownerLayout.id:null;manageMargins=ownerLayout&&ownerLayout.manageMargins;info=comp.margin$;if(info&&info.ownerId!==ownerLayoutId){info=null}if(!info){info=me.parseMargins(comp,comp.margin)||me.checkCache("marginInfo");if(manageMargins){margins=me.parseMargins(comp,comp.margins,ownerLayout.defaultMargins);if(margins){info={top:info.top+margins.top,right:info.right+margins.right,bottom:info.bottom+margins.bottom,left:info.left+margins.left}}me.setProp("margin-top",0);me.setProp("margin-right",0);me.setProp("margin-bottom",0);me.setProp("margin-left",0)}info.ownerId=ownerLayoutId;comp.margin$=info}info.width=info.left+info.right;info.height=info.top+info.bottom}me.marginInfo=info}return info},clearMarginCache:function(){delete this.marginInfo;delete this.target.margin$},getPaddingInfo:function(){var me=this,info=me.paddingInfo;if(!info){me.paddingInfo=info=me.checkCache("paddingInfo")}return info},getProp:function(propName){var me=this,result=me.props[propName];me.addTrigger(propName);return result},getDomProp:function(propName){var me=this,result=me.dirty&&propName in me.dirty?undefined:me.props[propName];me.addTrigger(propName,true);return result},getStyle:function(styleName){var me=this,styles=me.styles,info,value;if(styleName in styles){value=styles[styleName]}else{info=me.styleInfo[styleName];value=me.el.getStyle(styleName);if(info&&info.parseInt){value=parseInt(value,10)||0}styles[styleName]=value}return value},getStyles:function(styleNames,altNames){var me=this,styleCache=me.styles,values={},hits=0,n=styleNames.length,i,missing,missingAltNames,name,info,styleInfo,styles,value;altNames=altNames||styleNames;for(i=0;i<n;++i){name=styleNames[i];if(name in styleCache){values[altNames[i]]=styleCache[name];++hits;if(i&&hits==1){missing=styleNames.slice(0,i);missingAltNames=altNames.slice(0,i)}}else if(hits){(missing||(missing=[])).push(name);(missingAltNames||(missingAltNames=[])).push(altNames[i])}}if(hits<n){missing=missing||styleNames;missingAltNames=missingAltNames||altNames;styleInfo=me.styleInfo;styles=me.el.getStyle(missing);for(i=missing.length;i--;){name=missing[i];info=styleInfo[name];value=styles[name];if(info&&info.parseInt){value=parseInt(value,10)||0}values[missingAltNames[i]]=value;styleCache[name]=value}}return values},hasProp:function(propName){return this.getProp(propName)!=null},hasDomProp:function(propName){return this.getDomProp(propName)!=null},invalidate:function(options){this.context.queueInvalidate(this,options)},markDirty:function(){if(++this.dirtyCount==1){this.context.queueFlush(this)}},onBoxMeasured:function(){var boxParent=this.boxParent,state=this.state;if(boxParent&&boxParent.widthModel.shrinkWrap&&!state.boxMeasured&&this.measuresBox){state.boxMeasured=1;boxParent.boxChildMeasured()}},parseMargins:function(comp,margins,defaultMargins){if(margins===true){margins=5}var type=typeof margins,ret;if(type=="string"||type=="number"){ret=comp.parseBox(margins)}else if(margins||defaultMargins){ret={top:0,right:0,bottom:0,left:0};if(defaultMargins){Ext.apply(ret,this.parseMargins(comp,defaultMargins))}if(margins){margins=Ext.apply(ret,comp.parseBox(margins))}}return ret},peek:function(propName){return this.props[propName]},recoverProp:function(propName,oldProps,oldDirty){var me=this,props=me.props,dirty;if(propName in oldProps){props[propName]=oldProps[propName];if(oldDirty&&propName in oldDirty){dirty=me.dirty||(me.dirty={});dirty[propName]=oldDirty[propName]}}},redo:function(deep){var me=this,items,len,i;me.revertProps(me.props);if(deep&&me.wrapsComponent){if(me.childItems){for(i=0,items=me.childItems,len=items.length;i<len;i++){items[i].redo(deep)}}for(i=0,items=me.children,len=items.length;i<len;i++){items[i].redo()}}},removeEl:function(nameOrEl,owner){var me=this,src,el;if(nameOrEl){if(nameOrEl.dom){el=nameOrEl}else{src=me.target;if(owner){src=owner}el=src[nameOrEl];if(typeof el=="function"){el=el.call(src);if(el===me.el){return this}}}if(el){me.context.removeEl(me,el)}}},revertProps:function(props){var name,flushed=this.flushedProps,reverted={};for(name in props){if(flushed.hasOwnProperty(name)){reverted[name]=props[name]}}this.writeProps(reverted)},setAttribute:function(name,value){var me=this;if(!me.attributes){me.attributes={}}me.attributes[name]=value;me.markDirty()},setBox:function(box){var me=this;if("left"in box){me.setProp("x",box.left)}if("top"in box){me.setProp("y",box.top)}me.setSize(box.width,box.height)},setContentHeight:function(height,measured){if(!measured&&this.hasRawContent){return 1}return this.setProp("contentHeight",height)},setContentWidth:function(width,measured){if(!measured&&this.hasRawContent){return 1}return this.setProp("contentWidth",width)},setContentSize:function(width,height,measured){return this.setContentWidth(width,measured)+this.setContentHeight(height,measured)==2},setProp:function(propName,value,dirty){var me=this,valueType=typeof value,borderBox,info;if(valueType=="undefined"||valueType==="number"&&isNaN(value)){return 0}if(me.props[propName]===value){return 1}me.props[propName]=value;++me.context.progressCount;if(dirty===false){me.fireTriggers("domTriggers",propName);me.clearBlocks("domBlocks",propName)}else{info=me.styleInfo[propName];if(info){if(!me.dirty){me.dirty={}}if(propName=="width"||propName=="height"){borderBox=me.isBorderBoxValue;if(borderBox===null){me.isBorderBoxValue=borderBox=!!me.el.isBorderBox()}if(!borderBox){me.borderInfo||me.getBorderInfo();me.paddingInfo||me.getPaddingInfo()}}me.dirty[propName]=value;me.markDirty()}}me.fireTriggers("triggers",propName);me.clearBlocks("blocks",propName);return 1},setHeight:function(height,dirty){var me=this,comp=me.target,ownerCtContext=me.ownerCtContext,frameBody,frameInfo,min,oldHeight,rem;if(height<0){height=0}if(!me.wrapsComponent){if(!me.setProp("height",height,dirty)){return NaN}}else{min=me.collapsedVert?0:comp.minHeight||0;height=Ext.Number.constrain(height,min,comp.maxHeight);oldHeight=me.props.height;if(!me.setProp("height",height,dirty)){return NaN}if(ownerCtContext&&!me.isComponentChild&&isNaN(oldHeight)){rem=--ownerCtContext.remainingChildDimensions;if(!rem){ownerCtContext.setProp("containerChildrenSizeDone",true)}}frameBody=me.frameBodyContext;if(frameBody){frameInfo=me.getFrameInfo();frameBody.setHeight(height-frameInfo.height,dirty)}}return height},setWidth:function(width,dirty){var me=this,comp=me.target,ownerCtContext=me.ownerCtContext,frameBody,frameInfo,min,oldWidth,rem;if(width<0){width=0}if(!me.wrapsComponent){if(!me.setProp("width",width,dirty)){return NaN}}else{min=me.collapsedHorz?0:comp.minWidth||0;width=Ext.Number.constrain(width,min,comp.maxWidth);oldWidth=me.props.width;if(!me.setProp("width",width,dirty)){return NaN}if(ownerCtContext&&!me.isComponentChild&&isNaN(oldWidth)){rem=--ownerCtContext.remainingChildDimensions;if(!rem){ownerCtContext.setProp("containerChildrenSizeDone",true)}}frameBody=me.frameBodyContext;if(frameBody){frameInfo=me.getFrameInfo();frameBody.setWidth(width-frameInfo.width,dirty)}}return width},setSize:function(width,height,dirty){this.setWidth(width,dirty);this.setHeight(height,dirty)},translateProps:{x:"left",y:"top"},undo:function(deep){var me=this,items,len,i;me.revertProps(me.lastBox);if(deep&&me.wrapsComponent){if(me.childItems){for(i=0,items=me.childItems,len=items.length;i<len;i++){items[i].undo(deep)}}for(i=0,items=me.children,len=items.length;i<len;i++){items[i].undo()}}},unsetProp:function(propName){var dirty=this.dirty;delete this.props[propName];if(dirty){delete dirty[propName]}},writeProps:function(dirtyProps,flushing){if(!(dirtyProps&&typeof dirtyProps=="object")){Ext.Logger.warn("writeProps expected dirtyProps to be an object");return}var me=this,el=me.el,styles={},styleCount=0,styleInfo=me.styleInfo,info,propName,numericValue,width=dirtyProps.width,height=dirtyProps.height,isBorderBox=me.isBorderBoxValue,target=me.target,max=Math.max,paddingWidth=0,paddingHeight=0,hasWidth,hasHeight,isAbsolute,scrollbarSize,style,targetEl;if("displayed"in dirtyProps){el.setDisplayed(dirtyProps.displayed)}for(propName in dirtyProps){if(flushing){me.fireTriggers("domTriggers",propName);me.clearBlocks("domBlocks",propName);me.flushedProps[propName]=1}info=styleInfo[propName];if(info&&info.dom){if(info.suffix&&(numericValue=parseInt(dirtyProps[propName],10))){styles[propName]=numericValue+info.suffix}else{styles[propName]=dirtyProps[propName]}++styleCount}}if("x"in dirtyProps||"y"in dirtyProps){if(target.isComponent){target.setPosition(dirtyProps.x,dirtyProps.y)}else{styleCount+=me.addPositionStyles(styles,dirtyProps)}}if(!isBorderBox&&(width>0||height>0)){if(!(me.borderInfo&&me.paddingInfo)){throw Error("Needed to have gotten the borderInfo and paddingInfo when the width or height was setProp'd")}if(!me.frameBodyContext){paddingWidth=me.paddingInfo.width;paddingHeight=me.paddingInfo.height}if(width){width=max(parseInt(width,10)-(me.borderInfo.width+paddingWidth),0);styles.width=width+"px";++styleCount}if(height){height=max(parseInt(height,10)-(me.borderInfo.height+paddingHeight),0);styles.height=height+"px";++styleCount}}if(me.wrapsComponent&&Ext.isIE9&&Ext.isStrict){if((hasWidth=width!==undefined&&me.hasOverflowY)||(hasHeight=height!==undefined&&me.hasOverflowX)){isAbsolute=me.isAbsolute;if(isAbsolute===undefined){isAbsolute=false;targetEl=me.target.getTargetEl();style=targetEl.getStyle("position");if(style=="absolute"){style=targetEl.getStyle("box-sizing");isAbsolute=style=="border-box"}me.isAbsolute=isAbsolute}if(isAbsolute){scrollbarSize=Ext.getScrollbarSize();if(hasWidth){width=parseInt(width,10)+scrollbarSize.width;styles.width=width+"px";++styleCount}if(hasHeight){height=parseInt(height,10)+scrollbarSize.height;styles.height=height+"px";++styleCount}}}}if(styleCount){el.setStyle(styles)}}},function(){var px={dom:true,parseInt:true,suffix:"px"},isDom={dom:true},faux={dom:false};this.prototype.styleInfo={containerChildrenSizeDone:faux,containerLayoutDone:faux,displayed:faux,done:faux,x:faux,y:faux,columnWidthsDone:faux,left:px,top:px,right:px,bottom:px,width:px,height:px,"border-top-width":px,"border-right-width":px,"border-bottom-width":px,"border-left-width":px,"margin-top":px,"margin-right":px,"margin-bottom":px,"margin-left":px,"padding-top":px,"padding-right":px,"padding-bottom":px,"padding-left":px,"line-height":isDom,display:isDom}});