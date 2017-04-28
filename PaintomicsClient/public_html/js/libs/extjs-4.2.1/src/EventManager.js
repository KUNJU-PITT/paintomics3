Ext.EventManager=new function(){var EventManager=this,doc=document,win=window,escapeRx=/\\/g,prefix=Ext.baseCSSPrefix,supportsAddEventListener=!Ext.isIE9&&"addEventListener"in doc,readyEvent,initExtCss=function(){var bd=doc.body||doc.getElementsByTagName("body")[0],cls=[prefix+"body"],htmlCls=[],supportsLG=Ext.supports.CSS3LinearGradient,supportsBR=Ext.supports.CSS3BorderRadius,html;if(!bd){return false}html=bd.parentNode;function add(c){cls.push(prefix+c)}if(Ext.isIE&&Ext.isIE9m){add("ie");if(Ext.isIE6){add("ie6")}else{add("ie7p");if(Ext.isIE7){add("ie7")}else{add("ie8p");if(Ext.isIE8){add("ie8")}else{add("ie9p");if(Ext.isIE9){add("ie9")}}}}if(Ext.isIE7m){add("ie7m")}if(Ext.isIE8m){add("ie8m")}if(Ext.isIE9m){add("ie9m")}if(Ext.isIE7||Ext.isIE8){add("ie78")}}if(Ext.isIE10){add("ie10")}if(Ext.isGecko){add("gecko");if(Ext.isGecko3){add("gecko3")}if(Ext.isGecko4){add("gecko4")}if(Ext.isGecko5){add("gecko5")}}if(Ext.isOpera){add("opera")}if(Ext.isWebKit){add("webkit")}if(Ext.isSafari){add("safari");if(Ext.isSafari2){add("safari2")}if(Ext.isSafari3){add("safari3")}if(Ext.isSafari4){add("safari4")}if(Ext.isSafari5){add("safari5")}if(Ext.isSafari5_0){add("safari5_0")}}if(Ext.isChrome){add("chrome")}if(Ext.isMac){add("mac")}if(Ext.isLinux){add("linux")}if(!supportsBR){add("nbr")}if(!supportsLG){add("nlg")}if(html){if(Ext.isStrict&&(Ext.isIE6||Ext.isIE7)){Ext.isBorderBox=false}else{Ext.isBorderBox=true}if(!Ext.isBorderBox){htmlCls.push(prefix+"content-box")}if(Ext.isStrict){htmlCls.push(prefix+"strict")}else{htmlCls.push(prefix+"quirks")}Ext.fly(html,"_internal").addCls(htmlCls)}Ext.fly(bd,"_internal").addCls(cls);return true};Ext.apply(EventManager,{hasBoundOnReady:false,hasFiredReady:false,deferReadyEvent:1,onReadyChain:[],readyEvent:function(){readyEvent=new Ext.util.Event;readyEvent.fire=function(){Ext._beforeReadyTime=Ext._beforeReadyTime||(new Date).getTime();readyEvent.self.prototype.fire.apply(readyEvent,arguments);Ext._afterReadytime=(new Date).getTime()};return readyEvent}(),idleEvent:new Ext.util.Event,isReadyPaused:function(){return/[?&]ext-pauseReadyFire\b/i.test(location.search)&&!Ext._continueFireReady},bindReadyEvent:function(){if(EventManager.hasBoundOnReady){return}if(doc.readyState=="complete"){EventManager.onReadyEvent({type:doc.readyState||"body"})}else{doc.addEventListener("DOMContentLoaded",EventManager.onReadyEvent,false);win.addEventListener("load",EventManager.onReadyEvent,false);EventManager.hasBoundOnReady=true}},onReadyEvent:function(e){if(e&&e.type){EventManager.onReadyChain.push(e.type)}if(EventManager.hasBoundOnReady){doc.removeEventListener("DOMContentLoaded",EventManager.onReadyEvent,false);win.removeEventListener("load",EventManager.onReadyEvent,false)}if(!Ext.isReady){EventManager.fireDocReady()}},fireDocReady:function(){if(!Ext.isReady){Ext._readyTime=(new Date).getTime();Ext.isReady=true;Ext.supports.init();EventManager.onWindowUnload();readyEvent.onReadyChain=EventManager.onReadyChain;if(Ext.isNumber(EventManager.deferReadyEvent)){Ext.Function.defer(EventManager.fireReadyEvent,EventManager.deferReadyEvent);EventManager.hasDocReadyTimer=true}else{EventManager.fireReadyEvent()}}},fireReadyEvent:function(){EventManager.hasDocReadyTimer=false;EventManager.isFiring=true;while(readyEvent.listeners.length&&!EventManager.isReadyPaused()){readyEvent.fire()}EventManager.isFiring=false;EventManager.hasFiredReady=true;Ext.EventManager.idleEvent.fire()},onDocumentReady:function(fn,scope,options){options=options||{};options.single=true;readyEvent.addListener(fn,scope,options);if(!(EventManager.isFiring||EventManager.hasDocReadyTimer)){if(Ext.isReady){EventManager.fireReadyEvent()}else{EventManager.bindReadyEvent()}}},stoppedMouseDownEvent:new Ext.util.Event,propRe:/^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|freezeEvent)$/,getId:function(element){var id;element=Ext.getDom(element);if(element===doc||element===win){id=element===doc?Ext.documentId:Ext.windowId}else{id=Ext.id(element)}if(!Ext.cache[id]){Ext.addCacheEntry(id,null,element)}return id},prepareListenerConfig:function(element,config,isRemove){var propRe=EventManager.propRe,key,value,args;for(key in config){if(config.hasOwnProperty(key)){if(!propRe.test(key)){value=config[key];if(typeof value=="function"){args=[element,key,value,config.scope,config]}else{args=[element,key,value.fn,value.scope,value]}if(isRemove){EventManager.removeListener.apply(EventManager,args)}else{EventManager.addListener.apply(EventManager,args)}}}}},mouseEnterLeaveRe:/mouseenter|mouseleave/,normalizeEvent:function(eventName,fn){if(EventManager.mouseEnterLeaveRe.test(eventName)&&!Ext.supports.MouseEnterLeave){if(fn){fn=Ext.Function.createInterceptor(fn,EventManager.contains)}eventName=eventName=="mouseenter"?"mouseover":"mouseout"}else if(eventName=="mousewheel"&&!Ext.supports.MouseWheel&&!Ext.isOpera){eventName="DOMMouseScroll"}return{eventName:eventName,fn:fn}},contains:function(event){event=event.browserEvent||event;var parent=event.currentTarget,child=EventManager.getRelatedTarget(event);if(parent&&parent.firstChild){while(child){if(child===parent){return false}child=child.parentNode;if(child&&child.nodeType!=1){child=null}}}return true},addListener:function(element,eventName,fn,scope,options){if(typeof eventName!=="string"){EventManager.prepareListenerConfig(element,eventName);return}var dom=element.dom||Ext.getDom(element),hasAddEventListener,bind,wrap,cache,id,cacheItem,capture;if(typeof fn==="string"){fn=Ext.resolveMethod(fn,scope||element)}if(!fn){Ext.Error.raise({sourceClass:"Ext.EventManager",sourceMethod:"addListener",targetElement:element,eventName:eventName,msg:'Error adding "'+eventName+'" listener. The handler function is undefined.'})}options=options||{};bind=EventManager.normalizeEvent(eventName,fn);wrap=EventManager.createListenerWrap(dom,eventName,bind.fn,scope,options);cache=EventManager.getEventListenerCache(element.dom?element:dom,eventName);eventName=bind.eventName;hasAddEventListener=supportsAddEventListener||Ext.isIE9&&!dom.attachEvent;if(!hasAddEventListener){id=EventManager.normalizeId(dom);if(id){cacheItem=Ext.cache[id][eventName];if(cacheItem&&cacheItem.firing){cache=EventManager.cloneEventListenerCache(dom,eventName)}}}capture=!!options.capture;cache.push({fn:fn,wrap:wrap,scope:scope,capture:capture});if(!hasAddEventListener){if(cache.length===1){id=EventManager.normalizeId(dom,true);fn=Ext.Function.bind(EventManager.handleSingleEvent,EventManager,[id,eventName],true);Ext.cache[id][eventName]={firing:false,fn:fn};dom.attachEvent("on"+eventName,fn)}}else{dom.addEventListener(eventName,wrap,capture)}if(dom==doc&&eventName=="mousedown"){EventManager.stoppedMouseDownEvent.addListener(wrap)}},normalizeId:function(dom,force){var id;if(dom===document){id=Ext.documentId}else if(dom===window){id=Ext.windowId}else{id=dom.id}if(!id&&force){id=EventManager.getId(dom)}return id},handleSingleEvent:function(e,id,eventName){var listenerCache=EventManager.getEventListenerCache(id,eventName),attachItem=Ext.cache[id][eventName],len,i;if(attachItem.firing){return}attachItem.firing=true;for(i=0,len=listenerCache.length;i<len;++i){listenerCache[i].wrap(e)}attachItem.firing=false},removeListener:function(element,eventName,fn,scope){if(typeof eventName!=="string"){EventManager.prepareListenerConfig(element,eventName,true);return}var dom=Ext.getDom(element),id,el=element.dom?element:Ext.get(dom),cache=EventManager.getEventListenerCache(el,eventName),bindName=EventManager.normalizeEvent(eventName).eventName,i=cache.length,j,cacheItem,hasRemoveEventListener,listener,wrap;if(!dom){return}hasRemoveEventListener=supportsAddEventListener||Ext.isIE9&&!dom.detachEvent;if(typeof fn==="string"){fn=Ext.resolveMethod(fn,scope||element)}while(i--){listener=cache[i];if(listener&&(!fn||listener.fn==fn)&&(!scope||listener.scope===scope)){wrap=listener.wrap;if(wrap.task){clearTimeout(wrap.task);delete wrap.task}j=wrap.tasks&&wrap.tasks.length;if(j){while(j--){clearTimeout(wrap.tasks[j])}delete wrap.tasks}if(!hasRemoveEventListener){id=EventManager.normalizeId(dom,true);cacheItem=Ext.cache[id][bindName];if(cacheItem&&cacheItem.firing){cache=EventManager.cloneEventListenerCache(dom,bindName)}if(cache.length===1){fn=cacheItem.fn;delete Ext.cache[id][bindName];dom.detachEvent("on"+bindName,fn)}}else{dom.removeEventListener(bindName,wrap,listener.capture)}if(wrap&&dom==doc&&eventName=="mousedown"){EventManager.stoppedMouseDownEvent.removeListener(wrap)}Ext.Array.erase(cache,i,1)}}},removeAll:function(element){var id=typeof element==="string"?element:element.id,cache,events,eventName;if(id&&(cache=Ext.cache[id])){events=cache.events;for(eventName in events){if(events.hasOwnProperty(eventName)){EventManager.removeListener(element,eventName)}}cache.events={}}},purgeElement:function(element,eventName){var dom=Ext.getDom(element),i=0,len,childNodes;if(eventName){EventManager.removeListener(element,eventName)}else{EventManager.removeAll(element)}if(dom&&dom.childNodes){childNodes=dom.childNodes;for(len=childNodes.length;i<len;i++){EventManager.purgeElement(childNodes[i],eventName)}}},createListenerWrap:function(dom,ename,fn,scope,options){options=options||{};var f,gen,wrap=function(e,args){if(!gen){f=["if(!"+Ext.name+") {return;}"];if(options.buffer||options.delay||options.freezeEvent){if(options.freezeEvent){f.push("e = X.EventObject.setEvent(e);")}f.push("e = new X.EventObjectImpl(e, "+(options.freezeEvent?"true":"false")+");")}else{f.push("e = X.EventObject.setEvent(e);")}if(options.delegate){f.push('var result, t = e.getTarget("'+(options.delegate+"").replace(escapeRx,"\\\\")+'", this);');f.push("if(!t) {return;}")}else{f.push("var t = e.target, result;")}if(options.target){f.push("if(e.target !== options.target) {return;}")}if(options.stopEvent){f.push("e.stopEvent();")}else{if(options.preventDefault){f.push("e.preventDefault();")}if(options.stopPropagation){f.push("e.stopPropagation();")}}if(options.normalized===false){f.push("e = e.browserEvent;")}if(options.buffer){f.push("(wrap.task && clearTimeout(wrap.task));");f.push("wrap.task = setTimeout(function() {")}if(options.delay){f.push("wrap.tasks = wrap.tasks || [];");f.push("wrap.tasks.push(setTimeout(function() {")}f.push("result = fn.call(scope || dom, e, t, options);");if(options.single){f.push("evtMgr.removeListener(dom, ename, fn, scope);")}if(ename!=="mousemove"&&ename!=="unload"){f.push("if (evtMgr.idleEvent.listeners.length) {");f.push("evtMgr.idleEvent.fire();");f.push("}")}if(options.delay){f.push("}, "+options.delay+"));")}if(options.buffer){f.push("}, "+options.buffer+");")}f.push("return result;");gen=Ext.cacheableFunctionFactory("e","options","fn","scope","ename","dom","wrap","args","X","evtMgr",f.join("\n"))}return gen.call(dom,e,options,fn,scope,ename,dom,wrap,args,Ext,EventManager)};return wrap},getEventCache:function(element){var elementCache,eventCache,id;if(!element){return[]}if(element.$cache){elementCache=element.$cache}else{if(typeof element==="string"){id=element}else{id=EventManager.getId(element)}elementCache=Ext.cache[id]}eventCache=elementCache.events||(elementCache.events={});return eventCache},getEventListenerCache:function(element,eventName){var eventCache=EventManager.getEventCache(element);return eventCache[eventName]||(eventCache[eventName]=[])},cloneEventListenerCache:function(element,eventName){var eventCache=EventManager.getEventCache(element),out;if(eventCache[eventName]){out=eventCache[eventName].slice(0)}else{out=[]}eventCache[eventName]=out;return out},mouseLeaveRe:/(mouseout|mouseleave)/,mouseEnterRe:/(mouseover|mouseenter)/,stopEvent:function(event){EventManager.stopPropagation(event);EventManager.preventDefault(event)},stopPropagation:function(event){event=event.browserEvent||event;if(event.stopPropagation){event.stopPropagation()}else{event.cancelBubble=true}},preventDefault:function(event){event=event.browserEvent||event;if(event.preventDefault){event.preventDefault()}else{event.returnValue=false;try{if(event.ctrlKey||event.keyCode>111&&event.keyCode<124){event.keyCode=-1}}catch(e){}}},getRelatedTarget:function(event){event=event.browserEvent||event;var target=event.relatedTarget;if(!target){if(EventManager.mouseLeaveRe.test(event.type)){target=event.toElement}else if(EventManager.mouseEnterRe.test(event.type)){target=event.fromElement}}return EventManager.resolveTextNode(target)},getPageX:function(event){return EventManager.getPageXY(event)[0]},getPageY:function(event){return EventManager.getPageXY(event)[1]},getPageXY:function(event){event=event.browserEvent||event;var x=event.pageX,y=event.pageY,docEl=doc.documentElement,body=doc.body;if(!x&&x!==0){x=event.clientX+(docEl&&docEl.scrollLeft||body&&body.scrollLeft||0)-(docEl&&docEl.clientLeft||body&&body.clientLeft||0);y=event.clientY+(docEl&&docEl.scrollTop||body&&body.scrollTop||0)-(docEl&&docEl.clientTop||body&&body.clientTop||0)}return[x,y]},getTarget:function(event){event=event.browserEvent||event;return EventManager.resolveTextNode(event.target||event.srcElement)},resolveTextNode:Ext.isGecko?function(node){if(node){var s=HTMLElement.prototype.toString.call(node);if(s!=="[xpconnect wrapped native prototype]"&&s!=="[object XULElement]"){return node.nodeType==3?node.parentNode:node}}}:function(node){return node&&node.nodeType==3?node.parentNode:node},curWidth:0,curHeight:0,onWindowResize:function(fn,scope,options){var resize=EventManager.resizeEvent;if(!resize){EventManager.resizeEvent=resize=new Ext.util.Event;EventManager.on(win,"resize",EventManager.fireResize,null,{buffer:100})}resize.addListener(fn,scope,options)},fireResize:function(){var w=Ext.Element.getViewWidth(),h=Ext.Element.getViewHeight();if(EventManager.curHeight!=h||EventManager.curWidth!=w){EventManager.curHeight=h;EventManager.curWidth=w;EventManager.resizeEvent.fire(w,h)}},removeResizeListener:function(fn,scope){var resize=EventManager.resizeEvent;if(resize){resize.removeListener(fn,scope)}},onWindowUnload:function(fn,scope,options){var unload=EventManager.unloadEvent;if(!unload){EventManager.unloadEvent=unload=new Ext.util.Event;EventManager.addListener(win,"unload",EventManager.fireUnload)}if(fn){unload.addListener(fn,scope,options)}},fireUnload:function(){try{doc=win=undefined;var gridviews,i,ln,el,cache;EventManager.unloadEvent.fire();if(Ext.isGecko3){gridviews=Ext.ComponentQuery.query("gridview");i=0;ln=gridviews.length;for(;i<ln;i++){gridviews[i].scrollToTop()}}cache=Ext.cache;for(el in cache){if(cache.hasOwnProperty(el)){EventManager.removeAll(el)}}}catch(e){}},removeUnloadListener:function(fn,scope){var unload=EventManager.unloadEvent;if(unload){unload.removeListener(fn,scope)}},useKeyDown:Ext.isWebKit?parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1],10)>=525:!(Ext.isGecko&&!Ext.isWindows||Ext.isOpera),getKeyEvent:function(){return EventManager.useKeyDown?"keydown":"keypress"}});if(!supportsAddEventListener&&document.attachEvent){Ext.apply(EventManager,{pollScroll:function(){var scrollable=true;try{document.documentElement.doScroll("left")}catch(e){scrollable=false}if(scrollable&&document.body){EventManager.onReadyEvent({type:"doScroll"})}else{EventManager.scrollTimeout=setTimeout(EventManager.pollScroll,20)}return scrollable},scrollTimeout:null,readyStatesRe:/complete/i,checkReadyState:function(){var state=document.readyState;if(EventManager.readyStatesRe.test(state)){EventManager.onReadyEvent({type:state})}},bindReadyEvent:function(){var topContext=true;if(EventManager.hasBoundOnReady){return}try{topContext=window.frameElement===undefined}catch(e){topContext=false}if(!topContext||!doc.documentElement.doScroll){EventManager.pollScroll=Ext.emptyFn}if(EventManager.pollScroll()===true){return}if(doc.readyState=="complete"){EventManager.onReadyEvent({type:"already "+(doc.readyState||"body")})}else{doc.attachEvent("onreadystatechange",EventManager.checkReadyState);window.attachEvent("onload",EventManager.onReadyEvent);EventManager.hasBoundOnReady=true}},onReadyEvent:function(e){if(e&&e.type){EventManager.onReadyChain.push(e.type)}if(EventManager.hasBoundOnReady){document.detachEvent("onreadystatechange",EventManager.checkReadyState);window.detachEvent("onload",EventManager.onReadyEvent)}if(Ext.isNumber(EventManager.scrollTimeout)){clearTimeout(EventManager.scrollTimeout);delete EventManager.scrollTimeout}if(!Ext.isReady){EventManager.fireDocReady()}},onReadyChain:[]})}Ext.onReady=function(fn,scope,options){Ext.Loader.onReady(fn,scope,true,options)};Ext.onDocumentReady=EventManager.onDocumentReady;EventManager.on=EventManager.addListener;EventManager.un=EventManager.removeListener;Ext.onReady(initExtCss)};