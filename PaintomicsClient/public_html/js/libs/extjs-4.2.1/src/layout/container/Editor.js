Ext.define("Ext.layout.container.Editor",{alias:"layout.editor",extend:"Ext.layout.container.Container",autoSizeDefault:{width:"field",height:"field"},sizePolicies:{$:{$:{readsWidth:1,readsHeight:1,setsWidth:0,setsHeight:0},boundEl:{readsWidth:1,readsHeight:0,setsWidth:0,setsHeight:1}},boundEl:{$:{readsWidth:0,readsHeight:1,setsWidth:1,setsHeight:0},boundEl:{readsWidth:0,readsHeight:0,setsWidth:1,setsHeight:1}}},getItemSizePolicy:function(item){var me=this,autoSize=me.owner.autoSize,key=autoSize&&autoSize.width,policy=me.sizePolicies;policy=policy[key]||policy.$;key=autoSize&&autoSize.height;policy=policy[key]||policy.$;return policy},calculate:function(ownerContext){var me=this,owner=me.owner,autoSize=owner.autoSize,fieldWidth,fieldHeight;if(autoSize===true){autoSize=me.autoSizeDefault}if(autoSize){fieldWidth=me.getDimension(owner,autoSize.width,"getWidth",owner.width);fieldHeight=me.getDimension(owner,autoSize.height,"getHeight",owner.height)}ownerContext.childItems[0].setSize(fieldWidth,fieldHeight);ownerContext.setWidth(fieldWidth);ownerContext.setHeight(fieldHeight);ownerContext.setContentSize(fieldWidth||owner.field.getWidth(),fieldHeight||owner.field.getHeight())},getDimension:function(owner,type,getMethod,ownerSize){switch(type){case"boundEl":return owner.boundEl[getMethod]();case"field":return undefined;default:return ownerSize}}});