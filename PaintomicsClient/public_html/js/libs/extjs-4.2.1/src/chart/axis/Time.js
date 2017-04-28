Ext.define("Ext.chart.axis.Time",{extend:"Ext.chart.axis.Numeric",alternateClassName:"Ext.chart.TimeAxis",type:"Time",alias:"axis.time",uses:["Ext.data.Store"],dateFormat:false,fromDate:false,toDate:false,step:[Ext.Date.DAY,1],constrain:false,constructor:function(config){var me=this,label,f,df;me.callParent([config]);label=me.label||{};df=this.dateFormat;if(df){if(label.renderer){f=label.renderer;label.renderer=function(v){v=f(v);return Ext.Date.format(new Date(f(v)),df)}}else{label.renderer=function(v){return Ext.Date.format(new Date(v>>0),df)}}}},processView:function(){var me=this;if(me.fromDate){me.minimum=+me.fromDate}if(me.toDate){me.maximum=+me.toDate}if(me.constrain){me.doConstrain()}},calcEnds:function(){var me=this,range,step=me.step;if(step){range=me.getRange();range=Ext.draw.Draw.snapEndsByDateAndStep(new Date(range.min),new Date(range.max),Ext.isNumber(step)?[Date.MILLI,step]:step);if(me.minimum){range.from=me.minimum}if(me.maximum){range.to=me.maximum}return range}else{return me.callParent(arguments)}}});