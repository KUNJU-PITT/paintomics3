Ext.define("Ext.dom.Element_anim",{override:"Ext.dom.Element",animate:function(config){var me=this,listeners,anim,animId=me.dom.id||Ext.id(me.dom);if(!Ext.fx.Manager.hasFxBlock(animId)){if(config.listeners){listeners=config.listeners;delete config.listeners}if(config.internalListeners){config.listeners=config.internalListeners;delete config.internalListeners}anim=new Ext.fx.Anim(me.anim(config));if(listeners){anim.on(listeners)}Ext.fx.Manager.queueFx(anim)}return me},anim:function(config){if(!Ext.isObject(config)){return config?{}:false}var me=this,duration=config.duration||Ext.fx.Anim.prototype.duration,easing=config.easing||"ease",animConfig;if(config.stopAnimation){me.stopAnimation()}Ext.applyIf(config,Ext.fx.Manager.getFxDefaults(me.id));Ext.fx.Manager.setFxDefaults(me.id,{delay:0});animConfig={target:me.dom,remove:config.remove,alternate:config.alternate||false,duration:duration,easing:easing,callback:config.callback,listeners:config.listeners,iterations:config.iterations||1,scope:config.scope,block:config.block,concurrent:config.concurrent,delay:config.delay||0,paused:true,keyframes:config.keyframes,from:config.from||{},to:Ext.apply({},config)};Ext.apply(animConfig.to,config.to);delete animConfig.to.to;delete animConfig.to.from;delete animConfig.to.remove;delete animConfig.to.alternate;delete animConfig.to.keyframes;delete animConfig.to.iterations;delete animConfig.to.listeners;delete animConfig.to.target;delete animConfig.to.paused;delete animConfig.to.callback;delete animConfig.to.scope;delete animConfig.to.duration;delete animConfig.to.easing;delete animConfig.to.concurrent;delete animConfig.to.block;delete animConfig.to.stopAnimation;delete animConfig.to.delay;return animConfig},slideIn:function(anchor,obj,slideOut){var me=this,dom=me.dom,elStyle=dom.style,beforeAnim,wrapAnim,restoreScroll,wrapDomParentNode;anchor=anchor||"t";obj=obj||{};beforeAnim=function(){var animScope=this,listeners=obj.listeners,el=Ext.fly(dom,"_anim"),box,originalStyles,anim,wrap;if(!slideOut){el.fixDisplay()}box=el.getBox();if((anchor=="t"||anchor=="b")&&box.height===0){box.height=dom.scrollHeight}else if((anchor=="l"||anchor=="r")&&box.width===0){box.width=dom.scrollWidth}originalStyles=el.getStyles("width","height","left","right","top","bottom","position","z-index",true);el.setSize(box.width,box.height);if(obj.preserveScroll){restoreScroll=el.cacheScrollValues()}wrap=el.wrap({id:Ext.id()+"-anim-wrap-for-"+el.dom.id,style:{visibility:slideOut?"visible":"hidden"}});wrapDomParentNode=wrap.dom.parentNode;wrap.setPositioning(el.getPositioning(true));if(wrap.isStyle("position","static")){wrap.position("relative")}el.clearPositioning("auto");wrap.clip();if(restoreScroll){restoreScroll()}el.setStyle({visibility:"",position:"absolute"});if(slideOut){wrap.setSize(box.width,box.height)}switch(anchor){case"t":anim={from:{width:box.width+"px",height:"0px"},to:{width:box.width+"px",height:box.height+"px"}};elStyle.bottom="0px";break;case"l":anim={from:{width:"0px",height:box.height+"px"},to:{width:box.width+"px",height:box.height+"px"}};me.anchorAnimX(anchor);break;case"r":anim={from:{x:box.x+box.width,width:"0px",height:box.height+"px"},to:{x:box.x,width:box.width+"px",height:box.height+"px"}};me.anchorAnimX(anchor);break;case"b":anim={from:{y:box.y+box.height,width:box.width+"px",height:"0px"},to:{y:box.y,width:box.width+"px",height:box.height+"px"}};break;case"tl":anim={from:{x:box.x,y:box.y,width:"0px",height:"0px"},to:{width:box.width+"px",height:box.height+"px"}};elStyle.bottom="0px";me.anchorAnimX("l");break;case"bl":anim={from:{y:box.y+box.height,width:"0px",height:"0px"},to:{y:box.y,width:box.width+"px",height:box.height+"px"}};me.anchorAnimX("l");break;case"br":anim={from:{x:box.x+box.width,y:box.y+box.height,width:"0px",height:"0px"},to:{x:box.x,y:box.y,width:box.width+"px",height:box.height+"px"}};me.anchorAnimX("r");break;case"tr":anim={from:{x:box.x+box.width,width:"0px",height:"0px"},to:{x:box.x,width:box.width+"px",height:box.height+"px"}};elStyle.bottom="0px";me.anchorAnimX("r");break}wrap.show();wrapAnim=Ext.apply({},obj);delete wrapAnim.listeners;wrapAnim=new Ext.fx.Anim(Ext.applyIf(wrapAnim,{target:wrap,duration:500,easing:"ease-out",from:slideOut?anim.to:anim.from,to:slideOut?anim.from:anim.to}));wrapAnim.on("afteranimate",function(){var el=Ext.fly(dom,"_anim");el.setStyle(originalStyles);if(slideOut){if(obj.useDisplay){el.setDisplayed(false)}else{el.hide()}}if(wrap.dom){if(wrap.dom.parentNode){wrap.dom.parentNode.insertBefore(el.dom,wrap.dom)}else{wrapDomParentNode.appendChild(el.dom)}wrap.remove()}if(restoreScroll){restoreScroll()}animScope.end()});if(listeners){wrapAnim.on(listeners)}};me.animate({duration:obj.duration?Math.max(obj.duration,500)*2:1e3,listeners:{beforeanimate:beforeAnim}});return me},slideOut:function(anchor,o){return this.slideIn(anchor,o,true)},puff:function(obj){var me=this,dom=me.dom,beforeAnim,box=me.getBox(),originalStyles=me.getStyles("width","height","left","right","top","bottom","position","z-index","font-size","opacity",true);obj=Ext.applyIf(obj||{},{easing:"ease-out",duration:500,useDisplay:false});beforeAnim=function(){var el=Ext.fly(dom,"_anim");el.clearOpacity();el.show();this.to={width:box.width*2,height:box.height*2,x:box.x-box.width/2,y:box.y-box.height/2,opacity:0,fontSize:"200%"};this.on("afteranimate",function(){var el=Ext.fly(dom,"_anim");if(el){if(obj.useDisplay){el.setDisplayed(false)}else{el.hide()}el.setStyle(originalStyles);Ext.callback(obj.callback,obj.scope)}})};me.animate({duration:obj.duration,easing:obj.easing,listeners:{beforeanimate:{fn:beforeAnim}}});return me},switchOff:function(obj){var me=this,dom=me.dom,beforeAnim;obj=Ext.applyIf(obj||{},{easing:"ease-in",duration:500,remove:false,useDisplay:false});beforeAnim=function(){var el=Ext.fly(dom,"_anim"),animScope=this,size=el.getSize(),xy=el.getXY(),keyframe,position;el.clearOpacity();el.clip();position=el.getPositioning();keyframe=new Ext.fx.Animator({target:dom,duration:obj.duration,easing:obj.easing,keyframes:{33:{opacity:.3},66:{height:1,y:xy[1]+size.height/2},100:{width:1,x:xy[0]+size.width/2}}});keyframe.on("afteranimate",function(){var el=Ext.fly(dom,"_anim");if(obj.useDisplay){el.setDisplayed(false)}else{el.hide()}el.clearOpacity();el.setPositioning(position);el.setSize(size);animScope.end()})};me.animate({duration:Math.max(obj.duration,500)*2,listeners:{beforeanimate:{fn:beforeAnim}},callback:obj.callback,scope:obj.scope});return me},frame:function(color,count,obj){var me=this,dom=me.dom,beforeAnim;color=color||"#C3DAF9";count=count||1;obj=obj||{};beforeAnim=function(){var el=Ext.fly(dom,"_anim"),animScope=this,box,proxy,proxyAnim;el.show();box=el.getBox();proxy=Ext.getBody().createChild({id:el.dom.id+"-anim-proxy",style:{position:"absolute","pointer-events":"none","z-index":35e3,border:"0px solid "+color}});proxyAnim=new Ext.fx.Anim({target:proxy,duration:obj.duration||1e3,iterations:count,from:{top:box.y,left:box.x,borderWidth:0,opacity:1,height:box.height,width:box.width},to:{top:box.y-20,left:box.x-20,borderWidth:10,opacity:0,height:box.height+40,width:box.width+40}});proxyAnim.on("afteranimate",function(){proxy.remove();animScope.end()})};me.animate({duration:Math.max(obj.duration,500)*2||2e3,listeners:{beforeanimate:{fn:beforeAnim}},callback:obj.callback,scope:obj.scope});return me},ghost:function(anchor,obj){var me=this,dom=me.dom,beforeAnim;anchor=anchor||"b";beforeAnim=function(){var el=Ext.fly(dom,"_anim"),width=el.getWidth(),height=el.getHeight(),xy=el.getXY(),position=el.getPositioning(),to={opacity:0};switch(anchor){case"t":to.y=xy[1]-height;break;case"l":to.x=xy[0]-width;break;case"r":to.x=xy[0]+width;break;case"b":to.y=xy[1]+height;break;case"tl":to.x=xy[0]-width;to.y=xy[1]-height;break;case"bl":to.x=xy[0]-width;to.y=xy[1]+height;break;case"br":to.x=xy[0]+width;to.y=xy[1]+height;break;case"tr":to.x=xy[0]+width;to.y=xy[1]-height;break}this.to=to;this.on("afteranimate",function(){var el=Ext.fly(dom,"_anim");if(el){el.hide();el.clearOpacity();el.setPositioning(position)}})};me.animate(Ext.applyIf(obj||{},{duration:500,easing:"ease-out",listeners:{beforeanimate:beforeAnim}}));return me},highlight:function(color,o){var me=this,dom=me.dom,from={},restore,to,attr,lns,event,fn;if(dom.tagName.match(me.tableTagRe)){return me.select("div").highlight(color,o)}o=o||{};lns=o.listeners||{};attr=o.attr||"backgroundColor";from[attr]=color||"ffff9c";if(!o.to){to={};to[attr]=o.endColor||me.getColor(attr,"ffffff","")}else{to=o.to}o.listeners=Ext.apply(Ext.apply({},lns),{beforeanimate:function(){restore=dom.style[attr];var el=Ext.fly(dom,"_anim");el.clearOpacity();el.show();event=lns.beforeanimate;if(event){fn=event.fn||event;return fn.apply(event.scope||lns.scope||window,arguments)}},afteranimate:function(){if(dom){dom.style[attr]=restore}event=lns.afteranimate;if(event){fn=event.fn||event;fn.apply(event.scope||lns.scope||window,arguments)}}});me.animate(Ext.apply({},o,{duration:1e3,easing:"ease-in",from:from,to:to}));return me},pause:function(ms){var me=this;Ext.fx.Manager.setFxDefaults(me.id,{delay:ms});return me},fadeIn:function(o){var me=this,dom=me.dom;me.animate(Ext.apply({},o,{opacity:1,internalListeners:{beforeanimate:function(anim){var el=Ext.fly(dom,"_anim");if(el.isStyle("display","none")){el.setDisplayed("")}else{el.show()}}}}));return this},fadeOut:function(o){var me=this,dom=me.dom;o=Ext.apply({opacity:0,internalListeners:{afteranimate:function(anim){if(dom&&anim.to.opacity===0){var el=Ext.fly(dom,"_anim");if(o.useDisplay){el.setDisplayed(false)}else{el.hide()}}}}},o);me.animate(o);return me},scale:function(w,h,o){this.animate(Ext.apply({},o,{width:w,height:h}));return this},shift:function(config){this.animate(config);return this},anchorAnimX:function(anchor){var xName=anchor==="l"?"right":"left";this.dom.style[xName]="0px"}});