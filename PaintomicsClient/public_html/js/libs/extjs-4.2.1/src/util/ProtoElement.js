Ext.define("Ext.util.ProtoElement",function(){var splitWords=Ext.String.splitWords,toMap=Ext.Array.toMap;return{isProtoEl:true,clsProp:"cls",styleProp:"style",removedProp:"removed",styleIsText:false,constructor:function(config){var me=this;Ext.apply(me,config);me.classList=splitWords(me.cls);me.classMap=toMap(me.classList);delete me.cls;if(Ext.isFunction(me.style)){me.styleFn=me.style;delete me.style}else if(typeof me.style=="string"){me.style=Ext.Element.parseStyles(me.style)}else if(me.style){me.style=Ext.apply({},me.style)}},flush:function(){this.flushClassList=[];this.removedClasses={};delete this.style;delete this.unselectableAttr},addCls:function(cls){var me=this,add=typeof cls==="string"?splitWords(cls):cls,length=add.length,list=me.classList,map=me.classMap,flushList=me.flushClassList,i=0,c;for(;i<length;++i){c=add[i];if(!map[c]){map[c]=true;list.push(c);if(flushList){flushList.push(c);delete me.removedClasses[c]}}}return me},hasCls:function(cls){return cls in this.classMap},removeCls:function(cls){var me=this,list=me.classList,newList=me.classList=[],remove=toMap(splitWords(cls)),length=list.length,map=me.classMap,removedClasses=me.removedClasses,i,c;for(i=0;i<length;++i){c=list[i];if(remove[c]){if(removedClasses){if(map[c]){removedClasses[c]=true;Ext.Array.remove(me.flushClassList,c)}}delete map[c]}else{newList.push(c)}}return me},setStyle:function(prop,value){var me=this,style=me.style||(me.style={});if(typeof prop=="string"){if(arguments.length===1){me.setStyle(Ext.Element.parseStyles(prop))}else{style[prop]=value}}else{Ext.apply(style,prop)}return me},unselectable:function(){this.addCls(Ext.dom.Element.unselectableCls);if(Ext.isOpera){this.unselectableAttr=true}},writeTo:function(to){var me=this,classList=me.flushClassList||me.classList,removedClasses=me.removedClasses,style;if(me.styleFn){style=Ext.apply({},me.styleFn());Ext.apply(style,me.style)}else{style=me.style}to[me.clsProp]=classList.join(" ");if(style){to[me.styleProp]=me.styleIsText?Ext.DomHelper.generateStyles(style):style}if(removedClasses){removedClasses=Ext.Object.getKeys(removedClasses);if(removedClasses.length){to[me.removedProp]=removedClasses.join(" ")}}if(me.unselectableAttr){to.unselectable="on"}return to}}}());