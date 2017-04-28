(function(d){d.CanVGRenderer={};d.Chart.prototype.exportChartLocal=function(x,y){var i=this,e=d.merge(i.options.exporting,x),q=navigator.userAgent.indexOf("WebKit")>-1&&navigator.userAgent.indexOf("Chrome")<0,l=e.scale||2,n,r=window.URL||window.webkitURL||window,f,s=0,o,m,t,g=function(){if(e.fallbackToExportServer===!1)throw"Fallback to export server disabled";i.exportChart(e)},u=function(a,b,c,g,k,d,e){var j=new Image;if(!q)j.crossOrigin="Anonymous";j.onload=function(){var h=document.createElement("canvas"),d=h.getContext&&h.getContext("2d"),i;if(d){h.height=j.height*l;h.width=j.width*l;d.drawImage(j,0,0,h.width,h.height);try{i=h.toDataURL(),c(i,b)}catch(f){if(f.name==="SecurityError"||f.name==="SECURITY_ERR"||f.message==="SecurityError")g(a,b);else throw f}}else k(a,b);e&&e(a,b)};j.onerror=function(){d(a,b);e&&e(a,b)};j.src=a},v=function(a){try{if(!q)return r.createObjectURL(new Blob([a],{type:"image/svg+xml;charset-utf-16"}))}catch(b){}return"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(a)},p=function(a,b){var c=document.createElement("a"),d=(e.filename||"chart")+"."+b,k;if(navigator.msSaveOrOpenBlob)navigator.msSaveOrOpenBlob(a,d);else if(typeof c.download!=="undefined")c.href=a,c.download=d,c.target="_blank",document.body.appendChild(c),c.click(),document.body.removeChild(c);else try{if(k=window.open(a,"chart"),typeof k==="undefined"||k===null)throw 1}catch(g){window.location.href=a}},w=function(){var a,b,c=i.sanitizeSVG(n.innerHTML);if(e&&e.type==="image/svg+xml")try{navigator.msSaveOrOpenBlob?(b=new MSBlobBuilder,b.append(c),a=b.getBlob("image/svg+xml")):a=v(c),p(a,"svg")}catch(f){g()}else a=v(c),u(a,{},function(a){try{p(a,"png")}catch(c){g()}},function(){var a=document.createElement("canvas"),b=a.getContext("2d"),e=c.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1]*l,f=c.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1]*l,h=function(){b.drawSvg(c,0,0,e,f);try{p(navigator.msSaveOrOpenBlob?a.msToBlob():a.toDataURL("image/png"),"png")}catch(d){g()}};a.width=e;a.height=f;window.canvg?h():(i.showLoading(),HighchartsAdapter.getScript(d.getOptions().global.canvasToolsURL,function(){i.hideLoading();h()}))},g,g,function(){try{r.revokeObjectURL(a)}catch(b){}})};d.wrap(d.Chart.prototype,"getChartHTML",function(a){n=this.container.cloneNode(!0);return a.apply(this,Array.prototype.slice.call(arguments,1))});i.getSVGForExport(e,y);f=n.getElementsByTagName("image");try{f.length||w();var z=function(a,b){++s;b.imageElement.setAttributeNS("http://www.w3.org/1999/xlink","href",a);s===f.length&&w()};for(m=0,t=f.length;m<t;++m)o=f[m],u(o.getAttributeNS("http://www.w3.org/1999/xlink","href"),{imageElement:o},z,g,g,g)}catch(A){g()}};d.getOptions().exporting.buttons.contextButton.menuItems=[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChartLocal()}},{textKey:"downloadSVG",onclick:function(){this.exportChartLocal({type:"image/svg+xml"})}}]})(Highcharts);