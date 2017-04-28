Ext.define("Ext.form.FieldContainer",{extend:"Ext.container.Container",mixins:{labelable:"Ext.form.Labelable",fieldAncestor:"Ext.form.FieldAncestor"},requires:"Ext.layout.component.field.FieldContainer",alias:"widget.fieldcontainer",componentLayout:"fieldcontainer",componentCls:Ext.baseCSSPrefix+"form-fieldcontainer",customOverflowEl:"containerEl",childEls:["containerEl"],combineLabels:false,labelConnector:", ",combineErrors:false,maskOnDisable:false,invalidCls:"",fieldSubTpl:'<div id="{id}-containerEl" class="{containerElCls}">{%this.renderContainer(out,values)%}</div>',initComponent:function(){var me=this;me.initLabelable();me.initFieldAncestor();me.callParent();me.initMonitor()},getOverflowEl:function(){return this.containerEl},onAdd:function(labelable){var me=this;if(Ext.isGecko&&me.layout.type==="absolute"&&!me.hideLabel&&me.labelAlign!=="top"){labelable.x+=me.labelWidth+me.labelPad}me.callParent(arguments);if(me.combineLabels){labelable.oldHideLabel=labelable.hideLabel;labelable.hideLabel=true}me.updateLabel()},onRemove:function(labelable,isDestroying){var me=this;me.callParent(arguments);if(!isDestroying){if(me.combineLabels){labelable.hideLabel=labelable.oldHideLabel}me.updateLabel()}},initRenderTpl:function(){var me=this;if(!me.hasOwnProperty("renderTpl")){me.renderTpl=me.getTpl("labelableRenderTpl")}return me.callParent()},initRenderData:function(){var me=this,data=me.callParent();data.containerElCls=me.containerElCls;return Ext.applyIf(data,me.getLabelableRenderData())},getFieldLabel:function(){var label=this.fieldLabel||"";if(!label&&this.combineLabels){label=Ext.Array.map(this.query("[isFieldLabelable]"),function(field){return field.getFieldLabel()}).join(this.labelConnector)}return label},getSubTplData:function(){var ret=this.initRenderData();Ext.apply(ret,this.subTplData);return ret},getSubTplMarkup:function(){var me=this,tpl=me.getTpl("fieldSubTpl"),html;if(!tpl.renderContent){me.setupRenderTpl(tpl)}html=tpl.apply(me.getSubTplData());return html},updateLabel:function(){var me=this,label=me.labelEl;if(label){me.setFieldLabel(me.getFieldLabel())}},onFieldErrorChange:function(field,activeError){if(this.combineErrors){var me=this,oldError=me.getActiveError(),invalidFields=Ext.Array.filter(me.query("[isFormField]"),function(field){return field.hasActiveError()}),newErrors=me.getCombinedErrors(invalidFields);if(newErrors){me.setActiveErrors(newErrors)}else{me.unsetActiveError()}if(oldError!==me.getActiveError()){me.doComponentLayout()}}},getCombinedErrors:function(invalidFields){var errors=[],f,fLen=invalidFields.length,field,activeErrors,a,aLen,error,label;for(f=0;f<fLen;f++){field=invalidFields[f];activeErrors=field.getActiveErrors();aLen=activeErrors.length;for(a=0;a<aLen;a++){error=activeErrors[a];label=field.getFieldLabel();errors.push((label?label+": ":"")+error)}}return errors},getTargetEl:function(){return this.containerEl},applyTargetCls:function(targetCls){var containerElCls=this.containerElCls;this.containerElCls=containerElCls?containerElCls+" "+targetCls:targetCls}});