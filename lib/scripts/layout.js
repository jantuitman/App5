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

App5
.require('bus')
.module('layout',function(globals){
	
	var bus=App5.modules.bus;
	
	// cache window size. resize events are sent even when hidden content is set. so we need to only
	// actually process the event if the size is unequal to the cached size.
	var windowWidth=null;
	var windowHeight=null; 
	
	var layouts={};

	$(window).bind('resize',resizer);

	
	function Layout(el,provider,dir) {
		this.target=el;
		this.provider=provider;
		this.providingEvent='';
		this.dir=dir;
		this.eventName=null; // dynamic layout will set this to the event that triggers the layout. 
		this.func=null; // dynamic layout will set this to a listener function that will have to be cleaned up when the layout is destroyed.
		/*
		if (this.target.get(0).style.width != "") {
		   this.width=parseInt(this.target.get(0).style.width,10)	
		}		
		else this.width=null;
		if (this.target.get(0).style.height != "") {
		   this.height=parseInt(this.target.get(0).style.height,10)	
		}
		else this.height=null;
		*/		
	}
	
	Layout.prototype.resize=function(sizer ) {
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
		
		var w,h;
        

        /*
		if (this.width !=null) {
		   w=this.width;	
		}
		else {
		   w=$(window).width();	
		   this.target.css("width",w+"px")	
		}
		
		if (this.height != null) {
		   h=this.height;	
		}
		else {
		   h=$(window).height();
		   this.target.css("height",h+"px")	
		}
		*/
		console.log("doing layout of "+this.target.attr('id')+" provider = "+this.provider);
		if (this.provider=='nested' || this.provider=='dynamic') {
			// nested layouts: the width/height needs to be set by the parent.
			// dynamic layouts: the width/height needs to be returned by the sizer function.
			if (sizer) {
				var obj=sizer();
				w=obj.width();
				h=obj.height();
			}
			else {
				w=this.target.width();
				h=this.target.height();
			}
		}
		else if (this.provider=='window') {
			if (this.width !=null) {
			   w=this.width;	
			}
			else {
			   console.log("SETTING WINDOW WIDTH on "+this.target.attr('id'));
			   w=$(window).width();	
			   this.target.css("width",w+"px")	
			}

			if (this.height != null) {
			   h=this.height;	
			}
			else {
			   h=$(window).height();
			   this.target.css("height",h+"px")	
			}
		}
		else {
			throw new Error("unknown layout providing option '"+provider+"'");
		}
		
		if (this.dir=="custom") {
		    // fire custom event on this node.
			if (this.target.attr('id') !=null) bus.publish('app5.layout.resize.'+this.target.attr('id'),{});
			// don't handle child nodes.
			return;
		}
		
		console.log(" w,h available ",w,h);
			
		if (this.dir=="horizontal") totalAvailable=w; else totalAvailable=h;
		
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
		
		var totalFlex=0;
		this.target.children().each(function () {
			var el=$(this);
			var flex=el.attr('data-layout-flex');
			if (flex != null) totalFlex=totalFlex+parseInt(flex,10);
		});
		
		var currentPos=0;
		this.target.children().each(function () {
			var el=$(this);
			var value=null;
			var flex=null;
            var elSize=0;
            var paddings=0;

			if (self.dir=="vertical") {
				value=el.attr('data-layout-height');
				paddings=parseInt(el.css("paddingTop"),10)+parseInt(el.css("paddingBottom"),10);
			}
			else {
				value=el.attr('data-layout-width');
				paddings=parseInt(el.css("paddingLeft"),10)+parseInt(el.css("paddingRight"),10);
			}
			if (isNaN(paddings)) paddings=0;

			flex=el.attr('data-layout-flex');
			if (value !=null) value=parseInt(value,10);
			if (flex !=null) flex=parseInt(flex,10);
            
			if (value != null && flex != null ) {
				elSize=Math.floor(rest * flex / totalFlex)+value ;
			}
			else if (value == null && flex != null ) {
				elSize=Math.floor(rest * flex / totalFlex)
			}
			if (value != null && flex == null ) {
				elSize=value;
			}
			console.log("elSize "+el.attr("id")+" = "+elSize);
			
			if (self.dir=="horizontal") {
				el.css({
					position: "absolute",
					left: currentPos +"px",
					width: (elSize-paddings)+"px",
				})
				if (el.attr('data-layout-stretch') != "false" ) {
					//console.log("setting a height "+self.target.height() +" on: "+el.attr("id"))
					el.css({ 'height': self.target.height() +"px"})
				}
			}
			else {
				console.log("setting height "+(elSize-paddings)+" !!!");
				el.css({
					position: "absolute",
					top: currentPos +"px",
					height: (elSize-paddings)+"px"
				})
				if (el.attr('data-layout-stretch') != "false" ) {
					//console.log("setting a width "+self.target.width() +" on: "+el.attr("id")+ " / " + el.parent().attr("id"))
					el.css({ 'width': self.target.width() +"px"})
				}
			}
			
			currentPos = currentPos + elSize ;
			
			// fire custom event on this node.
			if (el.attr('id') !=null) bus.publish('app5.layout.resize.'+el.attr('id'),{});
			
			// if it is a layoutcontainer, we are going to resize it after we have done the parent element.
			
			var s=el.attr('data-layout-container');
			if (s) {
				if (layouts[el.attr('id')]) resizeNeeded.push(layouts[el.attr('id')]);
			}
		
		});
		
		// when layout is resized fire resizedone.
		if (this.target.attr('id') !=null) bus.publish('app5.layout.resizedone.'+this.target.attr('id'),{});
		
	}
	
	var g_resize_started=null;
	function resizer() {
		if ($(window).width() == windowWidth && $(window).height() == windowHeight) return;
		if (g_resize_started) return;
		g_resize_started=window.setTimeout(function () {
			g_resize_started=null;
			windowWidth=$(window).width();
			windowHeight=$(window).height();
			for (var v in layouts) {
				var el=$('#'+v);
				if (!el || !el.is('.app5layout')) {
					delete layouts[v];
				}
				else {
					if (layouts[v].provider == 'window') {
						layouts[v].resize();
					}
				}
			}
		},250);
		
		
	}	
	resizer();
	
	function createLayout(el,provider,dir) {
		var l=new Layout(el,provider,dir);
		if (!el.attr('id')) throw new Error("no id present on layout element: "+el);
		layouts[el.attr('id')]=l;
		
		
		// nested elements get their width/height set by a parent layouter. but they need to listen to it.
		if (provider=='nested') {
			bus.listenForElement('app5.layout.resize',el.attr("id"),function (){
				console.log("resizing layout"+l.target.attr("id"));
				l.resize();
			})
			
		}

		// what's the cleanNode doing?
		//el.cleanNode().addClass('app5layout');
		el.addClass('app5layout');
		var position=el.css("position");
		console.log("creating a layout from node "+el.attr("id")+" left= "+el.css("left"));
		if (position != "absolute" && position != "relative") {
			el.css("position","relative");
		}
		el.children().each(function () {
			var c=$(this);
			if (c.attr('data-layout-container')!=null) {
				createLayout(c,'nested',c.attr('data-layout-container'))
			}
			//c.cleanNode().addClass('app5layout');
		})

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
	
	
	/** creates a layout that depends on the window **/
	globals.create=function(el,options) {
		var defaults={ dir : 'vertical', provider: 'window'}
		var opts=$.extend(defaults,options);
		var layout=createLayout(el,opts.provider,opts.dir);
		window.setTimeout(function () { layout.resize()},1);
	}
	
	/** creates a layout that depends on a parentElement 
		this layout will never be triggered directly by an event.
		However, if the parentElement is a layout itself, it will layout its child
		containers.
	*/
	globals.nested=function(el) {
		var layout=createLayout(el,'nested',el.attr('data-layout-container'));
		//el.css({ 'width' : width, 'height' : height });
		window.setTimeout(function () { layout.resize()},1);	
	}
	
	/**
		creates a layout that listens to another element.
		parameters: 
		parentElement : the element that receives the event.
		el - the element on which to create the layout.
		sizer (OPTIONAL) - a function that is called by the layout whenever an event is triggered on the parent element.
	            the sizer function must return an object that has width and height methods.
	            if sizer is not specified it will return the parentElement.
	    eventName (OPTIONAL) - the event that triggers the resizing. If not specified: the app5.layout.resizedone.<id> event of the parent element.       
	*/
	globals.dynamic=function(parentElement,el,sizer,eventName) {
		if (sizer==null) sizer=function () {
			//alert("In sizer : parentelement ("+parentElement.attr('id')+") currently has height "+parentElement.height());
			return parentElement;
		}
		var layout=createLayout(el,'dynamic',el.attr('data-layout-container'));
		layout.eventName=eventName!=null ? eventName : 'app5.layout.resizedone.'+parentElement.attr('id');
		layout.func=function() {
			layout.resize(sizer);		
		}
		bus.listen2(layout.eventName,parentElement,layout.func);
		layout.resize(sizer);
	}
	
	globals.destroy=function(element) {
		var layout = layouts[element.attr('id')];
		if (layout==null) {
			console.log('WARNING: found no layout for '+element.attr('id'));
			return;
		}
		if (layout.provider=='dynamic') {
			bus.removeListener(layout.eventName,layout.func);
		}
		delete layouts[element.attr('id')];
	
	}
	

	return globals;
	
});
