Ext.define("Ext.container.Container",{extend:"Ext.container.AbstractContainer",alias:"widget.container",alternateClassName:"Ext.Container",getChildByElement:function(el,deep){var item,itemEl,i=0,it=this.getRefItems(),ln=it.length;el=Ext.getDom(el);for(;i<ln;i++){item=it[i];itemEl=item.getEl();if(itemEl&&(itemEl.dom===el||itemEl.contains(el))){return deep&&item.getChildByElement?item.getChildByElement(el,deep):item}}return null}});