/***


usage:


  var layout=App5.require('layout');

  $('el').layout({ dir: 'vertical', provider: 'window' }); 
    - register listeners for the window size.
  layout.init will assume that jqEl is an element has one layer of elements. these will be layed out vertical or horizontal, 
  according to the dir parameter.
  layout will read style.height (style.width) from all children. It will get the height from the provider
  and distribute any extra space on elements that have data-layout-vgrow set. 

  provider: 'window' : window.height, window.width are taken as input parameters. 
  auto: if height/width are set, css property will be listened to, otherwise, window is used.
  object: always the computed height is used.
  nested: object is not auto-layouted, but will be layouted when a parent layout is changed.


  attributes: data-layout-vgrow, data-layout-hgrow, data-layout-container, data-layout-width, data-layout-height.
   


*/
console.log('module layout is loading');

App5
.require('events')
.module('layout',function(globals){
	
	var layouts={};
	var events=App5.modules.events;

	events.bind($(window),'resize',resizer);

	
	function Layout(el,provider,dir) {
		this.target=el;
		this.provider=provider;
		this.dir=dir;
	}
	
	Layout.prototype.resize=function( ) {
		var self=this;
		var totalNeeded=0;
		var totalAvailable=0;
		var rest=0;
		var resizeNeeded=[];
		
		this.target.children().each(function () {
			var el=$(this);
			if (self.dir=="vertical" && el.attr('data-layout-height')!= null) {
				totalNeeded +=parseInt(el.attr('data-layout-height'),10);
			}
			if (self.dir=="horizontal" && el.attr('data-layout-width') != null) {
				totalNeeded += parseInt(el.attr('data-layout-width'),10);
			}
		});
		
		var s=this.dir=="vertical"? this.target.get(0).style.height : this.target.get(0).style.width ;
		if (s=="" || this.provider=="window") {
			totalAvailable=this.dir=="vertical"? $ (window).height() : $(window).width()
		}
		else {
			totalAvailable=parseInt(s,10);
		}
		
		
		if (totalNeeded < totalAvailable) {
			rest=totalAvailable-totalNeeded ;
		} 
		else {
			rest=0;
			if (this.dir=="vertical") {
				this.target.css('height',totalNeeded+'px');
			}
			else {
				this.target.css('width',totalNeeded+'px');
			}
		}
		this.target.children().each(function () {
			var el=$(this);
			if (self.dir=="vertical") {
				var value=el.attr('data-layout-height');
				var grow=el.attr('data-layout-vgrow'); 
				if (value != null && grow != null ) {
					el.css('height',(Math.floor(rest * grow / 100)+parseInt(value,10)) +'px');
				}
				else if (value == null && grow != null ) {
					el.css('height',(Math.floor(rest * grow / 100)+0) +'px');
				}
				if (value != null && grow == null ) {
					el.css('height',parseInt(value,10) +'px');
				}
			}
			if (self.dir=="horizontal") {
				var value=el.attr('data-layout-width');
				var grow=el.attr('data-layout-hgrow'); 
				if (value != null && grow != null ) {
					el.css('width',(Math.floor(rest * grow / 100)+parseInt(value,10)) +'px');
				}
				else if (value == null && grow != null ) {
					el.css('width',(Math.floor(rest * grow / 100)+0) +'px');
				}
				if (value != null && grow == null ) {
					el.css('width',parseInt(value,10) +'px');
				}
			}
			
			var s=el.attr('data-layout-container');
			if (s) {
				resizeNeeded.push(layouts[el.attr('id')]);
			}
		});
		
		// resize child containers.
		for (var i=0;i<resizeNeeded.length;i++) resizeNeeded[i].resize();
		
	}
	
	function resizer() {
		for (var v in layouts) {
			var el=$('#'+v);
			if (!el || !el.is('.app5layout')) {
				delete layouts[v];
			}
			else {
			    layouts[v].resize();	
			}
		}
		
	}	
	
	function createLayout(el,provider,dir) {
		var l=new Layout(el,provider,dir);
		if (!el.attr('id')) throw new Error("no id present on layout element: "+el);
		layouts[el.attr('id')]=l;
		return l;
	}
	

	if (!$.fn.cleanNode) $.fn.cleanNode = function() {
	    this.contents().filter(function() {
	        if (this.nodeType != 3) {
	            return false;
	        }
	        else {
	            return !/\S/.test(this.nodeValue);
	        }
	    }).remove();
		return this;
	}	
	
	$.fn.layout=function (options) {
		var defaults={ dir : 'vertical', provider: 'auto'}
		var opts=$.extend(defaults,options);
		var x, y;
		
		
		return this.each(function() {
			var el=$(this);
			var layout=createLayout(el,opts.provider,opts.dir);
			el.cleanNode().addClass('app5layout');
			el.children().each(function () {
				var c=$(this);
				if (c.attr('data-layout-container')!=null) {
					c.layout({ provider: 'nested',dir: c.attr('data-layout-container') })
				}
				//c.cleanNode().addClass('app5layout');
			})
			window.setTimeout(function () { layout.resize()},15);
		});
	}
	


	return globals;
	
});