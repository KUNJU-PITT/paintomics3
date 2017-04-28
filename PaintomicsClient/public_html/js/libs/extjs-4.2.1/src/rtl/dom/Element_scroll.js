Ext.define("Ext.rtl.dom.Element_scroll",{override:"Ext.dom.Element",rtlGetScroll:function(){var me=this,dom=me.dom,doc=document,body=doc.body,scroll=me.getScroll(),left=Math.abs(scroll.left),isDocOrBody=dom===doc||dom===body;if(isDocOrBody?3&me._rtlDocScrollFlag:me._rtlScrollFlag===1){if(isDocOrBody){dom=body}left=dom.scrollWidth-left-(isDocOrBody?Ext.Element.getViewportWidth():dom.clientWidth)}scroll.left=left;return scroll},rtlGetScrollLeft:function(){return this.rtlGetScroll().left},rtlSetScrollLeft:function(left){var me=this;me.dom.scrollLeft=me.rtlNormalizeScrollLeft(left);return me},rtlScrollTo:function(side,value,animate){if(side==="left"){value=this.rtlNormalizeScrollLeft(value)}return this.scrollTo(side,value,animate)},rtlScrollBy:function(deltaX,deltaY,animate){var me=this,dom=me.dom,left,maxScroll;if(deltaX.length){animate=deltaY;deltaY=deltaX[1];deltaX=deltaX[0]}else if(typeof deltaX!="number"){animate=deltaY;deltaY=deltaX.y;deltaX=deltaX.x}if(deltaX){left=me.rtlNormalizeScrollLeft(me.constrainScrollLeft(me.rtlGetScrollLeft()+deltaX));me.scrollTo("left",left,animate)}if(deltaY){me.scrollTo("top",me.constrainScrollTop(dom.scrollTop+deltaY),animate)}return me},rtlScroll:function(direction,distance,animate){if(!this.isScrollable()){return false}var me=this,side=direction==="r"||direction==="l"?"left":"top",scrolled=false,currentScroll,constrainedScroll;if(direction==="r"){distance=-distance}if(side==="left"){currentScroll=me.rtlGetScrollLeft();constrainedScroll=me.constrainScrollLeft(currentScroll+distance)}else{currentScroll=me.dom.scrollTop;constrainedScroll=me.constrainScrollTop(currentScroll+distance)}if(constrainedScroll!==currentScroll){this.rtlScrollTo(side,constrainedScroll,animate);scrolled=true}return scrolled},rtlNormalizeScrollLeft:function(left){var dom=this.dom,flag=this._rtlScrollFlag;if(flag===0){left=-left}else if(flag===1){left=dom.scrollWidth-left-dom.clientWidth}return left}},function(){var Element=this;function cacheRtlScrollFlag(){var el=Ext.getBody().createChild({tag:"div",style:"direction:rtl;position:absolute;overflow:auto;height:100px;width:100px;",children:[{tag:"div",style:"height:30px;width:150px;"}]}),dom=el.dom,flag=2;if(dom.scrollLeft===50){flag=1}else{dom.scrollLeft=-1;if(dom.scrollLeft){flag=0}}el.remove();Element.prototype._rtlScrollFlag=flag}function cacheRtlDocScrollFlag(){var doc=document,docEl=doc.documentElement,body=doc.body,flag=4,bodyStyle=body.style,direction=bodyStyle.direction,el=Ext.getBody().createChild('<div style="height:20000px;width:20000px;"></div>'),dom=el.dom,ltrRight,rtlRight;bodyStyle.direction="ltr";ltrRight=dom.getBoundingClientRect().right;bodyStyle.direction="rtl";rtlRight=dom.getBoundingClientRect().right;Element.prototype._rtlBodyScrollbarOnRight=ltrRight===rtlRight;if(docEl.scrollLeft>0){flag=1}else if(body.scrollLeft>0){flag=5}else{docEl.scrollLeft=-1;if(docEl.scrollLeft){flag=0}else{docEl.scrollLeft=1;if(docEl.scrollLeft){flag=2}}}el.remove();if(!direction){bodyStyle.direction="ltr";body.scrollWidth}bodyStyle.direction=direction;Element.prototype._rtlDocScrollFlag=flag}Ext.on({ready:function(){cacheRtlDocScrollFlag();cacheRtlScrollFlag()},single:true,priority:1001})});