Ext.define("Ext.form.action.Submit",{extend:"Ext.form.action.Action",alternateClassName:"Ext.form.Action.Submit",alias:"formaction.submit",type:"submit",run:function(){var me=this,form=me.form;if(me.clientValidation===false||form.isValid()){me.doSubmit()}else{me.failureType=Ext.form.action.Action.CLIENT_INVALID;form.afterAction(me,false)}},doSubmit:function(){var me=this,ajaxOptions=Ext.apply(me.createCallback(),{url:me.getUrl(),method:me.getMethod(),headers:me.headers}),form=me.form,jsonSubmit=me.jsonSubmit||form.jsonSubmit,paramsProp=jsonSubmit?"jsonData":"params",formEl,formInfo;if(form.hasUpload()){formInfo=me.buildForm();ajaxOptions.form=formInfo.formEl;ajaxOptions.isUpload=true}else{ajaxOptions[paramsProp]=me.getParams(jsonSubmit)}Ext.Ajax.request(ajaxOptions);if(formInfo){me.cleanup(formInfo)}},cleanup:function(formInfo){var formEl=formInfo.formEl,uploadEls=formInfo.uploadEls,uploadFields=formInfo.uploadFields,len=uploadFields.length,i,field;for(i=0;i<len;++i){field=uploadFields[i];if(!field.clearOnSubmit){field.restoreInput(uploadEls[i])}}if(formEl){Ext.removeNode(formEl)}},getParams:function(useModelValues){var falseVal=false,configParams=this.callParent(),fieldParams=this.form.getValues(falseVal,falseVal,this.submitEmptyText!==falseVal,useModelValues);return Ext.apply({},fieldParams,configParams)},buildForm:function(){var me=this,fieldsSpec=[],formSpec,formEl,basicForm=me.form,params=me.getParams(),uploadFields=[],uploadEls=[],fields=basicForm.getFields().items,i,len=fields.length,field,key,value,v,vLen,el;for(i=0;i<len;++i){field=fields[i];if(field.rendered&&field.isFileUpload()){uploadFields.push(field)}}for(key in params){if(params.hasOwnProperty(key)){value=params[key];if(Ext.isArray(value)){vLen=value.length;for(v=0;v<vLen;v++){fieldsSpec.push(me.getFieldConfig(key,value[v]))}}else{fieldsSpec.push(me.getFieldConfig(key,value))}}}formSpec={tag:"form",action:me.getUrl(),method:me.getMethod(),target:me.target||"_self",style:"display:none",cn:fieldsSpec};if(uploadFields.length){formSpec.encoding=formSpec.enctype="multipart/form-data"}formEl=Ext.DomHelper.append(Ext.getBody(),formSpec);len=uploadFields.length;for(i=0;i<len;++i){el=uploadFields[i].extractFileInput();formEl.appendChild(el);uploadEls.push(el)}return{formEl:formEl,uploadFields:uploadFields,uploadEls:uploadEls}},getFieldConfig:function(name,value){return{tag:"input",type:"hidden",name:name,value:Ext.String.htmlEncode(value)}},onSuccess:function(response){var form=this.form,success=true,result=this.processResponse(response);if(result!==true&&!result.success){if(result.errors){form.markInvalid(result.errors)}this.failureType=Ext.form.action.Action.SERVER_INVALID;success=false}form.afterAction(this,success)},handleResponse:function(response){var form=this.form,errorReader=form.errorReader,rs,errors,i,len,records,result;if(errorReader){rs=errorReader.read(response);records=rs.records;errors=[];if(records){for(i=0,len=records.length;i<len;i++){errors[i]=records[i].data}}if(errors.length<1){errors=null}result={success:rs.success,errors:errors}}else{try{result=Ext.decode(response.responseText)}catch(e){result={success:false,errors:[]}}}return result}});