Ext.is={init:function(navigator){var platforms=this.platforms,ln=platforms.length,i,platform;navigator=navigator||window.navigator;for(i=0;i<ln;i++){platform=platforms[i];this[platform.identity]=platform.regex.test(navigator[platform.property])}this.Desktop=this.Mac||this.Windows||this.Linux&&!this.Android;this.Tablet=this.iPad;this.Phone=!this.Desktop&&!this.Tablet;this.iOS=this.iPhone||this.iPad||this.iPod;this.Standalone=!!window.navigator.standalone},platforms:[{property:"platform",regex:/iPhone/i,identity:"iPhone"},{property:"platform",regex:/iPod/i,identity:"iPod"},{property:"userAgent",regex:/iPad/i,identity:"iPad"},{property:"userAgent",regex:/Blackberry/i,identity:"Blackberry"},{property:"userAgent",regex:/Android/i,identity:"Android"},{property:"platform",regex:/Mac/i,identity:"Mac"},{property:"platform",regex:/Win/i,identity:"Windows"},{property:"platform",regex:/Linux/i,identity:"Linux"}]};Ext.is.init();(function(){var getStyle=function(element,styleName){var view=element.ownerDocument.defaultView,style=(view?view.getComputedStyle(element,null):element.currentStyle)||element.style;return style[styleName]},supportsVectors={"IE6-quirks":[0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0],"IE6-strict":[0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0],"IE7-quirks":[0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0],"IE7-strict":[0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,0,0,1,0,1,0,0,0],"IE8-quirks":[0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0],"IE8-strict":[0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,1,0,1,0,0,1],"IE9-quirks":[0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0],"IE9-strict":[0,1,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,0,0,0,1],"IE10-quirks":[1,1,0,0,1,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,1],"IE10-strict":[1,1,0,0,1,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,1]};function getBrowserKey(){var browser=Ext.isIE6?"IE6":Ext.isIE7?"IE7":Ext.isIE8?"IE8":Ext.isIE9?"IE9":Ext.isIE10?"IE10":"";return browser?browser+(Ext.isStrict?"-strict":"-quirks"):""}Ext.supports={init:function(){var me=this,doc=document,toRun=me.toRun||me.tests,n=toRun.length,div=n&&Ext.isReady&&doc.createElement("div"),notRun=[],browserKey=getBrowserKey(),test,vector,value;if(div){div.innerHTML=['<div style="height:30px;width:50px;">','<div style="height:20px;width:20px;"></div>',"</div>",'<div style="width: 200px; height: 200px; position: relative; padding: 5px;">','<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>',"</div>",'<div style="position: absolute; left: 10%; top: 10%;"></div>','<div style="float:left; background-color:transparent;"></div>'].join("");doc.body.appendChild(div)}vector=supportsVectors[browserKey];while(n--){test=toRun[n];value=vector&&vector[n];if(value!==undefined){me[test.identity]=value}else if(div||test.early){me[test.identity]=test.fn.call(me,doc,div)}else{notRun.push(test)}}if(div){doc.body.removeChild(div)}me.toRun=notRun},generateVector:function(){var tests=this.tests,vector=[],i=0,ln=tests.length,test;for(;i<ln;i++){test=tests[i];vector.push(this[test.identity]?1:0)}return vector},PointerEvents:"pointerEvents"in document.documentElement.style,LocalStorage:function(){try{return"localStorage"in window&&window["localStorage"]!==null}catch(e){return false}}(),CSS3BoxShadow:"boxShadow"in document.documentElement.style||"WebkitBoxShadow"in document.documentElement.style||"MozBoxShadow"in document.documentElement.style,ClassList:!!document.documentElement.classList,OrientationChange:typeof window.orientation!="undefined"&&"onorientationchange"in window,DeviceMotion:"ondevicemotion"in window,Touch:"ontouchstart"in window&&!Ext.is.Desktop,TimeoutActualLateness:function(){setTimeout(function(){Ext.supports.TimeoutActualLateness=arguments.length!==0},0)}(),tests:[{identity:"Transitions",fn:function(doc,div){var prefix=["webkit","Moz","o","ms","khtml"],TE="TransitionEnd",transitionEndName=[prefix[0]+TE,"transitionend",prefix[2]+TE,prefix[3]+TE,prefix[4]+TE],ln=prefix.length,i=0,out=false;for(;i<ln;i++){if(getStyle(div,prefix[i]+"TransitionProperty")){Ext.supports.CSS3Prefix=prefix[i];Ext.supports.CSS3TransitionEnd=transitionEndName[i];out=true;break}}return out}},{identity:"RightMargin",fn:function(doc,div){var view=doc.defaultView;return!(view&&view.getComputedStyle(div.firstChild.firstChild,null).marginRight!="0px")}},{identity:"DisplayChangeInputSelectionBug",early:true,fn:function(){var webKitVersion=Ext.webKitVersion;return 0<webKitVersion&&webKitVersion<533}},{identity:"DisplayChangeTextAreaSelectionBug",early:true,fn:function(){var webKitVersion=Ext.webKitVersion;return 0<webKitVersion&&webKitVersion<534.24}},{identity:"TransparentColor",fn:function(doc,div,view){view=doc.defaultView;return!(view&&view.getComputedStyle(div.lastChild,null).backgroundColor!="transparent")}},{identity:"ComputedStyle",fn:function(doc,div,view){view=doc.defaultView;return view&&view.getComputedStyle}},{identity:"Svg",fn:function(doc){return!!doc.createElementNS&&!!doc.createElementNS("http:/"+"/www.w3.org/2000/svg","svg").createSVGRect}},{identity:"Canvas",fn:function(doc){return!!doc.createElement("canvas").getContext}},{identity:"Vml",fn:function(doc){var d=doc.createElement("div");d.innerHTML="<!--[if vml]><br/><br/><![endif]-->";return d.childNodes.length==2}},{identity:"Float",fn:function(doc,div){return!!div.lastChild.style.cssFloat}},{identity:"AudioTag",fn:function(doc){return!!doc.createElement("audio").canPlayType}},{identity:"History",fn:function(){var history=window.history;return!!(history&&history.pushState)}},{identity:"CSS3DTransform",fn:function(){return typeof WebKitCSSMatrix!="undefined"&&(new WebKitCSSMatrix).hasOwnProperty("m41")}},{identity:"CSS3LinearGradient",fn:function(doc,div){var property="background-image:",webkit="-webkit-gradient(linear, left top, right bottom, from(black), to(white))",w3c="linear-gradient(left top, black, white)",moz="-moz-"+w3c,ms="-ms-"+w3c,opera="-o-"+w3c,options=[property+webkit,property+w3c,property+moz,property+ms,property+opera];div.style.cssText=options.join(";");return(""+div.style.backgroundImage).indexOf("gradient")!==-1&&!Ext.isIE9}},{identity:"CSS3BorderRadius",fn:function(doc,div){var domPrefixes=["borderRadius","BorderRadius","MozBorderRadius","WebkitBorderRadius","OBorderRadius","KhtmlBorderRadius"],pass=false,i;for(i=0;i<domPrefixes.length;i++){if(document.body.style[domPrefixes[i]]!==undefined){return true}}return pass}},{identity:"GeoLocation",fn:function(){return typeof navigator!="undefined"&&"geolocation"in navigator||typeof google!="undefined"&&typeof google.gears!="undefined"}},{identity:"MouseEnterLeave",fn:function(doc,div){return"onmouseenter"in div&&"onmouseleave"in div}},{identity:"MouseWheel",fn:function(doc,div){return"onmousewheel"in div}},{identity:"Opacity",fn:function(doc,div){if(Ext.isIE6||Ext.isIE7||Ext.isIE8){return false}div.firstChild.style.cssText="opacity:0.73";return div.firstChild.style.opacity=="0.73"}},{identity:"Placeholder",fn:function(doc){return"placeholder"in doc.createElement("input")}},{identity:"Direct2DBug",fn:function(){return Ext.isString(document.body.style.msTransformOrigin)&&Ext.isIE10m}},{identity:"BoundingClientRect",fn:function(doc,div){return Ext.isFunction(div.getBoundingClientRect)}},{identity:"RotatedBoundingClientRect",fn:function(){var body=document.body,supports=false,el=document.createElement("div"),style=el.style;if(el.getBoundingClientRect){style.WebkitTransform=style.MozTransform=style.OTransform=style.transform="rotate(90deg)";style.width="100px";style.height="30px";body.appendChild(el);supports=el.getBoundingClientRect().height!==100;body.removeChild(el)}return supports}},{identity:"IncludePaddingInWidthCalculation",fn:function(doc,div){return div.childNodes[1].firstChild.offsetWidth==210}},{identity:"IncludePaddingInHeightCalculation",fn:function(doc,div){return div.childNodes[1].firstChild.offsetHeight==210}},{identity:"ArraySort",fn:function(){var a=[1,2,3,4,5].sort(function(){return 0});return a[0]===1&&a[1]===2&&a[2]===3&&a[3]===4&&a[4]===5}},{identity:"Range",fn:function(){return!!document.createRange}},{identity:"CreateContextualFragment",fn:function(){var range=Ext.supports.Range?document.createRange():false;return range&&!!range.createContextualFragment}},{identity:"WindowOnError",fn:function(){return Ext.isIE||Ext.isGecko||Ext.webKitVersion>=534.16}},{identity:"TextAreaMaxLength",fn:function(){var el=document.createElement("textarea");return"maxlength"in el}},{identity:"GetPositionPercentage",fn:function(doc,div){return getStyle(div.childNodes[2],"left")=="10%"}},{identity:"PercentageHeightOverflowBug",fn:function(doc){var hasBug=false,style,el;if(Ext.getScrollbarSize().height){el=doc.createElement("div");style=el.style;style.height="50px";style.width="50px";style.overflow="auto";style.position="absolute";el.innerHTML=['<div style="display:table;height:100%;">','<div style="width:51px;"></div>',"</div>"].join("");doc.body.appendChild(el);if(el.firstChild.offsetHeight===50){hasBug=true}doc.body.removeChild(el)}return hasBug}},{identity:"xOriginBug",fn:function(doc,div){div.innerHTML='<div id="b1" style="height:100px;width:100px;direction:rtl;position:relative;overflow:scroll">'+'<div id="b2" style="position:relative;width:100%;height:20px;"></div>'+'<div id="b3" style="position:absolute;width:20px;height:20px;top:0px;right:0px"></div>'+"</div>";var outerBox=document.getElementById("b1").getBoundingClientRect(),b2=document.getElementById("b2").getBoundingClientRect(),b3=document.getElementById("b3").getBoundingClientRect();return b2.left!==outerBox.left&&b3.right!==outerBox.right}},{identity:"ScrollWidthInlinePaddingBug",fn:function(doc){var hasBug=false,style,el;el=doc.createElement("div");style=el.style;style.height="50px";style.width="50px";style.padding="10px";style.overflow="hidden";style.position="absolute";el.innerHTML='<span style="display:inline-block;zoom:1;height:60px;width:60px;"></span>';doc.body.appendChild(el);if(el.scrollWidth===70){hasBug=true}doc.body.removeChild(el);return hasBug}}]}})();Ext.supports.init();