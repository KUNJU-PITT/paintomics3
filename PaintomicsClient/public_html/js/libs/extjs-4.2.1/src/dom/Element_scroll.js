Ext.define("Ext.dom.Element_scroll",{override:"Ext.dom.Element",isScrollable:function(){var dom=this.dom;return dom.scrollHeight>dom.clientHeight||dom.scrollWidth>dom.clientWidth},getScroll:function(){var me=this,dom=me.dom,doc=document,body=doc.body,docElement=doc.documentElement,left,top;if(dom===doc||dom===body){left=docElement.scrollLeft||(body?body.scrollLeft:0);top=docElement.scrollTop||(body?body.scrollTop:0)}else{left=dom.scrollLeft;top=dom.scrollTop}return{left:left,top:top}},getScrollLeft:function(){var dom=this.dom,doc=document;if(dom===doc||dom===doc.body){return this.getScroll().left}else{return dom.scrollLeft}},getScrollTop:function(){var dom=this.dom,doc=document;if(dom===doc||dom===doc.body){return this.getScroll().top}else{return dom.scrollTop}},setScrollLeft:function(left){this.dom.scrollLeft=left;return this},setScrollTop:function(top){this.dom.scrollTop=top;return this},scrollBy:function(deltaX,deltaY,animate){var me=this,dom=me.dom;if(deltaX.length){animate=deltaY;deltaY=deltaX[1];deltaX=deltaX[0]}else if(typeof deltaX!="number"){animate=deltaY;deltaY=deltaX.y;deltaX=deltaX.x}if(deltaX){me.scrollTo("left",me.constrainScrollLeft(dom.scrollLeft+deltaX),animate)}if(deltaY){me.scrollTo("top",me.constrainScrollTop(dom.scrollTop+deltaY),animate)}return me},scrollTo:function(side,value,animate){var top=/top/i.test(side),me=this,prop=top?"scrollTop":"scrollLeft",dom=me.dom,animCfg;if(!animate||!me.anim){dom[prop]=value;dom[prop]=value}else{animCfg={to:{}};animCfg.to[prop]=value;if(Ext.isObject(animate)){Ext.applyIf(animCfg,animate)}me.animate(animCfg)}return me},scrollIntoView:function(container,hscroll,animate,highlight){var me=this,dom=me.dom,offsets=me.getOffsetsTo(container=Ext.getDom(container)||Ext.getBody().dom),left=offsets[0]+container.scrollLeft,top=offsets[1]+container.scrollTop,bottom=top+dom.offsetHeight,right=left+dom.offsetWidth,ctClientHeight=container.clientHeight,ctScrollTop=parseInt(container.scrollTop,10),ctScrollLeft=parseInt(container.scrollLeft,10),ctBottom=ctScrollTop+ctClientHeight,ctRight=ctScrollLeft+container.clientWidth,newPos;if(highlight){if(animate){animate=Ext.apply({listeners:{afteranimate:function(){me.scrollChildFly.attach(dom).highlight()}}},animate)}else{me.scrollChildFly.attach(dom).highlight()}}if(dom.offsetHeight>ctClientHeight||top<ctScrollTop){newPos=top}else if(bottom>ctBottom){newPos=bottom-ctClientHeight}if(newPos!=null){me.scrollChildFly.attach(container).scrollTo("top",newPos,animate)}if(hscroll!==false){newPos=null;if(dom.offsetWidth>container.clientWidth||left<ctScrollLeft){newPos=left}else if(right>ctRight){newPos=right-container.clientWidth}if(newPos!=null){me.scrollChildFly.attach(container).scrollTo("left",newPos,animate)}}return me},scrollChildIntoView:function(child,hscroll){this.scrollChildFly.attach(Ext.getDom(child)).scrollIntoView(this,hscroll)},scroll:function(direction,distance,animate){if(!this.isScrollable()){return false}var me=this,dom=me.dom,side=direction==="r"||direction==="l"?"left":"top",scrolled=false,currentScroll,constrainedScroll;if(direction==="r"){distance=-distance}if(side==="left"){currentScroll=dom.scrollLeft;constrainedScroll=me.constrainScrollLeft(currentScroll+distance)}else{currentScroll=dom.scrollTop;constrainedScroll=me.constrainScrollTop(currentScroll+distance)}if(constrainedScroll!==currentScroll){this.scrollTo(side,constrainedScroll,animate);scrolled=true}return scrolled},constrainScrollLeft:function(left){var dom=this.dom;return Math.max(Math.min(left,dom.scrollWidth-dom.clientWidth),0)},constrainScrollTop:function(top){var dom=this.dom;return Math.max(Math.min(top,dom.scrollHeight-dom.clientHeight),0)}},function(){this.prototype.scrollChildFly=new this.Fly;this.prototype.scrolltoFly=new this.Fly});