Ext.define("Ext.dom.Element_fx",{override:"Ext.dom.Element"},function(){var Element=Ext.dom.Element,VISIBILITY="visibility",DISPLAY="display",NONE="none",HIDDEN="hidden",VISIBLE="visible",OFFSETS="offsets",ASCLASS="asclass",NOSIZE="nosize",ORIGINALDISPLAY="originalDisplay",VISMODE="visibilityMode",ISVISIBLE="isVisible",OFFSETCLASS=Ext.baseCSSPrefix+"hide-offsets",getDisplay=function(el){var data=(el.$cache||el.getCache()).data,display=data[ORIGINALDISPLAY];if(display===undefined){data[ORIGINALDISPLAY]=display=""}return display},getVisMode=function(el){var data=(el.$cache||el.getCache()).data,visMode=data[VISMODE];if(visMode===undefined){data[VISMODE]=visMode=Element.VISIBILITY}return visMode};Element.override({originalDisplay:"",visibilityMode:1,setVisible:function(visible,animate){var me=this,dom=me.dom,visMode=getVisMode(me);if(typeof animate=="string"){switch(animate){case DISPLAY:visMode=Element.DISPLAY;break;case VISIBILITY:visMode=Element.VISIBILITY;break;case OFFSETS:visMode=Element.OFFSETS;break;case NOSIZE:case ASCLASS:visMode=Element.ASCLASS;break}me.setVisibilityMode(visMode);animate=false}if(!animate||!me.anim){if(visMode==Element.DISPLAY){return me.setDisplayed(visible)}else if(visMode==Element.OFFSETS){me[visible?"removeCls":"addCls"](OFFSETCLASS)}else if(visMode==Element.VISIBILITY){me.fixDisplay();dom.style.visibility=visible?"":HIDDEN}else if(visMode==Element.ASCLASS){me[visible?"removeCls":"addCls"](me.visibilityCls||Element.visibilityCls)}}else{if(visible){me.setOpacity(.01);me.setVisible(true)}if(!Ext.isObject(animate)){animate={duration:350,easing:"ease-in"}}me.animate(Ext.applyIf({callback:function(){if(!visible){Ext.fly(dom,"_internal").setVisible(false).setOpacity(1)}},to:{opacity:visible?1:0}},animate))}(me.$cache||me.getCache()).data[ISVISIBLE]=visible;return me},hasMetrics:function(){var visMode=getVisMode(this);return this.isVisible()||visMode==Element.OFFSETS||visMode==Element.VISIBILITY},toggle:function(animate){var me=this;me.setVisible(!me.isVisible(),me.anim(animate));return me},setDisplayed:function(value){if(typeof value=="boolean"){value=value?getDisplay(this):NONE}this.setStyle(DISPLAY,value);return this},fixDisplay:function(){var me=this;if(me.isStyle(DISPLAY,NONE)){me.setStyle(VISIBILITY,HIDDEN);me.setStyle(DISPLAY,getDisplay(me));if(me.isStyle(DISPLAY,NONE)){me.setStyle(DISPLAY,"block")}}},hide:function(animate){if(typeof animate=="string"){this.setVisible(false,animate);return this}this.setVisible(false,this.anim(animate));return this},show:function(animate){if(typeof animate=="string"){this.setVisible(true,animate);return this}this.setVisible(true,this.anim(animate));return this}})});