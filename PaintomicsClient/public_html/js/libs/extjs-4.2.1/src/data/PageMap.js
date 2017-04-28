Ext.define("Ext.data.PageMap",{extend:"Ext.util.LruCache",clear:function(initial){var me=this;me.pageMapGeneration=(me.pageMapGeneration||0)+1;me.callParent(arguments)},forEach:function(fn,scope){var me=this,pageNumbers=Ext.Object.getKeys(me.map),pageCount=pageNumbers.length,i,j,pageNumber,page,pageSize;for(i=0;i<pageCount;i++){pageNumbers[i]=Number(pageNumbers[i])}Ext.Array.sort(pageNumbers);scope=scope||me;for(i=0;i<pageCount;i++){pageNumber=pageNumbers[i];page=me.getPage(pageNumber);pageSize=page.length;for(j=0;j<pageSize;j++){if(fn.call(scope,page[j],(pageNumber-1)*me.pageSize+j)===false){return}}}},findBy:function(fn,scope){var me=this,result=null;scope=scope||me;me.forEach(function(rec,index){if(fn.call(scope,rec,index)){result=rec;return false}});return result},findIndexBy:function(fn,scope){var me=this,result=-1;scope=scope||me;me.forEach(function(rec,index){if(fn.call(scope,rec)){result=index;return false}});return result},getPageFromRecordIndex:function(){return Ext.data.Store.prototype.getPageFromRecordIndex.apply(this,arguments)},addAll:function(records){if(this.getCount()){Ext.Error.raise("Cannot addAll to a non-empty PageMap")}this.addPage(1,records)},addPage:function(pageNumber,records){var me=this,lastPage=pageNumber+Math.floor((records.length-1)/me.pageSize),startIdx,page;for(startIdx=0;pageNumber<=lastPage;pageNumber++,startIdx+=me.pageSize){page=Ext.Array.slice(records,startIdx,startIdx+me.pageSize);me.add(pageNumber,page);me.fireEvent("pageAdded",pageNumber,page)}},getCount:function(){var result=this.callParent();if(result){result=(result-1)*this.pageSize+this.last.value.length}return result},indexOf:function(record){return record?record.index:-1},insert:function(){Ext.Error.raise("insert operation not suppported into buffered Store")},remove:function(){Ext.Error.raise("remove operation not suppported from buffered Store")},removeAt:function(){Ext.Error.raise("removeAt operation not suppported from buffered Store")},getPage:function(pageNumber){return this.get(pageNumber)},hasRange:function(start,end){var pageNumber=this.getPageFromRecordIndex(start),endPageNumber=this.getPageFromRecordIndex(end);for(;pageNumber<=endPageNumber;pageNumber++){if(!this.hasPage(pageNumber)){return false}}return true},hasPage:function(pageNumber){return!!this.get(pageNumber)},getAt:function(index){return this.getRange(index,index)[0]},getRange:function(start,end){if(!this.hasRange(start,end)){Ext.Error.raise("PageMap asked for range which it does not have")}var me=this,startPageNumber=me.getPageFromRecordIndex(start),endPageNumber=me.getPageFromRecordIndex(end),dataStart=(startPageNumber-1)*me.pageSize,dataEnd=endPageNumber*me.pageSize-1,pageNumber=startPageNumber,result=[],sliceBegin,sliceEnd,doSlice,i=0,len;for(;pageNumber<=endPageNumber;pageNumber++){if(pageNumber==startPageNumber){sliceBegin=start-dataStart;doSlice=true}else{sliceBegin=0;doSlice=false}if(pageNumber==endPageNumber){sliceEnd=me.pageSize-(dataEnd-end);doSlice=true}if(doSlice){Ext.Array.push(result,Ext.Array.slice(me.getPage(pageNumber),sliceBegin,sliceEnd))}else{Ext.Array.push(result,me.getPage(pageNumber))}}for(len=result.length;i<len;i++){result[i].index=start++}return result}});