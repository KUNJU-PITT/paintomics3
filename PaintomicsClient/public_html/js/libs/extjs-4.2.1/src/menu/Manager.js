Ext.define("Ext.menu.Manager",{singleton:true,requires:["Ext.util.MixedCollection","Ext.util.KeyMap"],alternateClassName:"Ext.menu.MenuMgr",uses:["Ext.menu.Menu"],menuSelector:"."+Ext.baseCSSPrefix+"menu",menus:{},groups:{},attached:false,lastShow:new Date,init:function(){var me=this;me.active=new Ext.util.MixedCollection;Ext.getDoc().addKeyListener(27,function(){if(me.active.length>0){me.hideAll()}},me)},hideAll:function(){var active=this.active,menus,m,mLen;if(active&&active.length>0){menus=Ext.Array.slice(active.items);mLen=menus.length;for(m=0;m<mLen;m++){menus[m].hide()}return true}return false},onHide:function(m){var me=this,active=me.active;active.remove(m);if(active.length<1){Ext.getDoc().un("mousedown",me.onMouseDown,me);me.attached=false}},onShow:function(m){var me=this,active=me.active,attached=me.attached;me.lastShow=new Date;active.add(m);if(!attached){Ext.getDoc().on("mousedown",me.onMouseDown,me,{buffer:Ext.isIE9m?10:undefined});me.attached=true}m.toFront()},onBeforeHide:function(m){if(m.activeChild){m.activeChild.hide()}if(m.autoHideTimer){clearTimeout(m.autoHideTimer);delete m.autoHideTimer}},onBeforeShow:function(m){var active=this.active,parentMenu=m.parentMenu;active.remove(m);if(!parentMenu&&!m.allowOtherMenus){this.hideAll()}else if(parentMenu&&parentMenu.activeChild&&m!=parentMenu.activeChild){parentMenu.activeChild.hide()}},onMouseDown:function(e){var me=this,active=me.active,lastShow=me.lastShow,doHide=true;if(Ext.Date.getElapsed(lastShow)>50&&active.length>0&&!e.getTarget(me.menuSelector)){if(Ext.isIE9m&&!Ext.getDoc().contains(e.target)){doHide=false}if(doHide){me.hideAll()}}},register:function(menu){var me=this;if(!me.active){me.init()}if(menu.floating){me.menus[menu.id]=menu;menu.on({beforehide:me.onBeforeHide,hide:me.onHide,beforeshow:me.onBeforeShow,show:me.onShow,scope:me})}},get:function(menu){var menus=this.menus;if(typeof menu=="string"){if(!menus){return null}return menus[menu]}else if(menu.isMenu){return menu}else if(Ext.isArray(menu)){return new Ext.menu.Menu({items:menu})}else{return Ext.ComponentManager.create(menu,"menu")}},unregister:function(menu){var me=this,menus=me.menus,active=me.active;delete menus[menu.id];active.remove(menu);menu.un({beforehide:me.onBeforeHide,hide:me.onHide,beforeshow:me.onBeforeShow,show:me.onShow,scope:me})},registerCheckable:function(menuItem){var groups=this.groups,groupId=menuItem.group;if(groupId){if(!groups[groupId]){groups[groupId]=[]}groups[groupId].push(menuItem)}},unregisterCheckable:function(menuItem){var groups=this.groups,groupId=menuItem.group;if(groupId){Ext.Array.remove(groups[groupId],menuItem)}},onCheckChange:function(menuItem,state){var groups=this.groups,groupId=menuItem.group,i=0,group,ln,curr;if(groupId&&state){group=groups[groupId];ln=group.length;for(;i<ln;i++){curr=group[i];if(curr!=menuItem){curr.setChecked(false)}}}}});