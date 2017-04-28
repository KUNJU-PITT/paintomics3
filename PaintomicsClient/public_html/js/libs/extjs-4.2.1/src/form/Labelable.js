Ext.define("Ext.form.Labelable",{requires:["Ext.XTemplate"],autoEl:{tag:"table",cellpadding:0},childEls:["labelCell","labelEl","bodyEl","sideErrorCell","errorEl","inputRow"],labelableRenderTpl:['<tr role="presentation" id="{id}-inputRow" <tpl if="inFormLayout">id="{id}"</tpl> class="{inputRowCls}">','<tpl if="labelOnLeft">','<td role="presentation" id="{id}-labelCell" style="{labelCellStyle}" {labelCellAttrs}>',"{beforeLabelTpl}",'<label id="{id}-labelEl" {labelAttrTpl}<tpl if="inputId"> for="{inputId}"</tpl> class="{labelCls}"','<tpl if="labelStyle"> style="{labelStyle}"</tpl>',' unselectable="on"',">","{beforeLabelTextTpl}",'<tpl if="fieldLabel">{fieldLabel}{labelSeparator}</tpl>',"{afterLabelTextTpl}","</label>","{afterLabelTpl}","</td>","</tpl>",'<td role="presentation" class="{baseBodyCls} {fieldBodyCls} {extraFieldBodyCls}" id="{id}-bodyEl" colspan="{bodyColspan}" role="presentation">',"{beforeBodyEl}","<tpl if=\"labelAlign=='top'\">","{beforeLabelTpl}",'<div role="presentation" id="{id}-labelCell" style="{labelCellStyle}">','<label id="{id}-labelEl" {labelAttrTpl}<tpl if="inputId"> for="{inputId}"</tpl> class="{labelCls}"','<tpl if="labelStyle"> style="{labelStyle}"</tpl>',' unselectable="on"',">","{beforeLabelTextTpl}",'<tpl if="fieldLabel">{fieldLabel}{labelSeparator}</tpl>',"{afterLabelTextTpl}","</label>","</div>","{afterLabelTpl}","</tpl>","{beforeSubTpl}","{[values.$comp.getSubTplMarkup(values)]}","{afterSubTpl}","<tpl if=\"msgTarget==='side'\">","{afterBodyEl}","</td>","<td role=\"presentation\" id=\"{id}-sideErrorCell\" vAlign=\"{[values.labelAlign==='top' && !values.hideLabel ? 'bottom' : 'middle']}\" style=\"{[values.autoFitErrors ? 'display:none' : '']}\" width=\"{errorIconWidth}\">",'<div role="presentation" id="{id}-errorEl" class="{errorMsgCls}" style="display:none"></div>',"</td>","<tpl elseif=\"msgTarget=='under'\">",'<div role="presentation" id="{id}-errorEl" class="{errorMsgClass}" colspan="2" style="display:none"></div>',"{afterBodyEl}","</td>","</tpl>","</tr>",{disableFormats:true}],activeErrorsTpl:undefined,htmlActiveErrorsTpl:['<tpl if="errors && errors.length">','<ul class="{listCls}"><tpl for="errors"><li role="alert">{.}</li></tpl></ul>',"</tpl>"],plaintextActiveErrorsTpl:['<tpl if="errors && errors.length">','<tpl for="errors"><tpl if="xindex &gt; 1">\n</tpl>{.}</tpl>',"</tpl>"],isFieldLabelable:true,formItemCls:Ext.baseCSSPrefix+"form-item",labelCls:Ext.baseCSSPrefix+"form-item-label",errorMsgCls:Ext.baseCSSPrefix+"form-error-msg",baseBodyCls:Ext.baseCSSPrefix+"form-item-body",inputRowCls:Ext.baseCSSPrefix+"form-item-input-row",fieldBodyCls:"",clearCls:Ext.baseCSSPrefix+"clear",invalidCls:Ext.baseCSSPrefix+"form-invalid",fieldLabel:undefined,labelAlign:"left",labelWidth:100,labelPad:5,labelSeparator:":",hideLabel:false,hideEmptyLabel:true,preventMark:false,autoFitErrors:true,msgTarget:"qtip",noWrap:true,labelableInsertions:["beforeBodyEl","afterBodyEl","beforeLabelTpl","afterLabelTpl","beforeSubTpl","afterSubTpl","beforeLabelTextTpl","afterLabelTextTpl","labelAttrTpl"],labelableRenderProps:["allowBlank","id","labelAlign","fieldBodyCls","extraFieldBodyCls","baseBodyCls","clearCls","labelSeparator","msgTarget","inputRowCls"],initLabelable:function(){var me=this,padding=me.padding;if(padding){me.padding=undefined;me.extraMargins=Ext.Element.parseBox(padding)}if(!me.activeErrorsTpl){if(me.msgTarget=="title"){me.activeErrorsTpl=me.plaintextActiveErrorsTpl}else{me.activeErrorsTpl=me.htmlActiveErrorsTpl}}me.addCls(Ext.plainTableCls);me.addCls(me.formItemCls);me.lastActiveError="";me.addEvents("errorchange");me.enableBubble("errorchange")},trimLabelSeparator:function(){var me=this,separator=me.labelSeparator,label=me.fieldLabel||"",lastChar=label.substr(label.length-1);return lastChar===separator?label.slice(0,-1):label},getFieldLabel:function(){return this.trimLabelSeparator()},setFieldLabel:function(label){label=label||"";var me=this,separator=me.labelSeparator,labelEl=me.labelEl;me.fieldLabel=label;if(me.rendered){if(Ext.isEmpty(label)&&me.hideEmptyLabel){labelEl.parent().setDisplayed("none")}else{if(separator){label=me.trimLabelSeparator()+separator}labelEl.update(label);labelEl.parent().setDisplayed("")}me.updateLayout()}},getInsertionRenderData:function(data,names){var i=names.length,name,value;while(i--){name=names[i];value=this[name];if(value){if(typeof value!="string"){if(!value.isTemplate){value=Ext.XTemplate.getTpl(this,name)}value=value.apply(data)}}data[name]=value||""}return data},getLabelableRenderData:function(){var me=this,data,tempEl,topLabel=me.labelAlign==="top";if(!Ext.form.Labelable.errorIconWidth){tempEl=Ext.getBody().createChild({style:"position:absolute",cls:Ext.baseCSSPrefix+"form-invalid-icon"});Ext.form.Labelable.errorIconWidth=tempEl.getWidth()+tempEl.getMargin("l");tempEl.remove()}data=Ext.copyTo({inFormLayout:me.ownerLayout&&me.ownerLayout.type==="form",inputId:me.getInputId(),labelOnLeft:!topLabel,hideLabel:!me.hasVisibleLabel(),fieldLabel:me.getFieldLabel(),labelCellStyle:me.getLabelCellStyle(),labelCellAttrs:me.getLabelCellAttrs(),labelCls:me.getLabelCls(),labelStyle:me.getLabelStyle(),bodyColspan:me.getBodyColspan(),externalError:!me.autoFitErrors,errorMsgCls:me.getErrorMsgCls(),errorIconWidth:Ext.form.Labelable.errorIconWidth},me,me.labelableRenderProps,true);me.getInsertionRenderData(data,me.labelableInsertions);return data},xhooks:{beforeRender:function(){var me=this;me.setFieldDefaults(me.getHierarchyState().fieldDefaults);if(me.ownerLayout){me.addCls(Ext.baseCSSPrefix+me.ownerLayout.type+"-form-item")}},onRender:function(){var me=this,margins,side,style={};if(me.extraMargins){margins=me.el.getMargin();for(side in margins){if(margins.hasOwnProperty(side)){style["margin-"+side]=margins[side]+me.extraMargins[side]+"px"}}me.el.setStyle(style)}}},hasVisibleLabel:function(){if(this.hideLabel){return false}return!(this.hideEmptyLabel&&!this.getFieldLabel())},getLabelWidth:function(){var me=this;if(!me.hasVisibleLabel()){return 0}return me.labelWidth+me.labelPad},getBodyColspan:function(){var me=this,result;if(me.msgTarget==="side"&&(!me.autoFitErrors||me.hasActiveError())){result=1}else{result=2}if(me.labelAlign!=="top"&&!me.hasVisibleLabel()){result++}return result},getLabelCls:function(){var labelCls=this.labelCls+" "+Ext.dom.Element.unselectableCls,labelClsExtra=this.labelClsExtra;return labelClsExtra?labelCls+" "+labelClsExtra:labelCls},getLabelCellStyle:function(){var me=this,hideLabelCell=me.hideLabel||!me.getFieldLabel()&&me.hideEmptyLabel;return hideLabelCell?"display:none;":""},getErrorMsgCls:function(){var me=this,hideLabelCell=me.hideLabel||!me.fieldLabel&&me.hideEmptyLabel;return me.errorMsgCls+(!hideLabelCell&&me.labelAlign==="top"?" "+Ext.baseCSSPrefix+"lbl-top-err-icon":"")},getLabelCellAttrs:function(){var me=this,labelAlign=me.labelAlign,result="";if(labelAlign!=="top"){result='valign="top" halign="'+labelAlign+'" width="'+(me.labelWidth+me.labelPad)+'"'}return result+' class="'+Ext.baseCSSPrefix+'field-label-cell"'},getLabelStyle:function(){var me=this,labelPad=me.labelPad,labelStyle="";if(me.labelAlign!=="top"){if(me.labelWidth){labelStyle="width:"+me.labelWidth+"px;"}if(labelPad){labelStyle+="margin-right:"+labelPad+"px;"}}return labelStyle+(me.labelStyle||"")},getSubTplMarkup:function(){return""},getInputId:function(){return""},getActiveError:function(){return this.activeError||""},hasActiveError:function(){return!!this.getActiveError()},setActiveError:function(msg){this.setActiveErrors(msg)},getActiveErrors:function(){return this.activeErrors||[]},setActiveErrors:function(errors){errors=Ext.Array.from(errors);this.activeError=errors[0];this.activeErrors=errors;this.activeError=this.getTpl("activeErrorsTpl").apply({errors:errors,listCls:Ext.plainListCls});this.renderActiveError()},unsetActiveError:function(){delete this.activeError;delete this.activeErrors;this.renderActiveError()},renderActiveError:function(){var me=this,activeError=me.getActiveError(),hasError=!!activeError;if(activeError!==me.lastActiveError){me.fireEvent("errorchange",me,activeError);me.lastActiveError=activeError}if(me.rendered&&!me.isDestroyed&&!me.preventMark){me.el[hasError?"addCls":"removeCls"](me.invalidCls);me.getActionEl().dom.setAttribute("aria-invalid",hasError);if(me.errorEl){me.errorEl.dom.innerHTML=activeError}}},setFieldDefaults:function(defaults){var key;for(key in defaults){if(!this.hasOwnProperty(key)){this[key]=defaults[key]}}}});