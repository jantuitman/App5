App5
.require('controller')
.require('browser')
.module('dialog',function(globals){
	
	var browser=App5.modules.browser;
	
	
	function Dialog(name,options) {
		
		this.options=options;
		this.el=$('<div id="dialogwrapper_'+name+'" ><div id="dialog_'+name+'" style="display:none;"/></div>');
		this.contents=$('#dialog_'+name,this.el);
		var that=this;
		this.handler=function (e) {
				
			_resize(that);
			
		}
		
	}
	
	function _measure(that) {
		
		var o={};
		console.log(that.options);
		o.w=Math.min(that.options.width,$(window).width());
		o.w=Math.max(o.w,that.options.minWidth);
		o.h=Math.min(that.options.width,$(window).width());
		o.h=Math.max(o.w,that.options.minHeight);
		o.posX=($(window).width()-o.w)/2;
		o.posY=($(window).height()-o.h)/2;
		console.log('measure',o)
		return o;
	}
	
	function _resize(that) {
		var o=_measure(that);
		_styleBackground(that);
		that.contents.css({ "position": "absulute"
			, left: o.posX +"px"
			, top: o.posY+ "px"
			, width: o.w + "px"
			, height: o.h + "px"
		})
	}
	
	function _styleBackground(that) {
		that.el.css({ position: "absolute", left: '0px', top: '0px'
			, zOrder: 100
			, width: $(window).width() +'px'
			, height: $(window).height() +'px'
			, background: 'rgba(0,0,0,0.3)'
			, overflow: 'hidden'
		});
		
	}
	
	
	Dialog.prototype.element=function () {
		return this.contents;
	}
	
	
	Dialog.prototype.show=function () {
		_styleBackground(this);
		
		var o=_measure(this);
		this.contents.css({position: "absolute"
			, left: o.posX +"px"
			, width: o.w +"px"
			, height: o.h + "px"
			, background : 'white'
			, display: "none"
		});
		
		
		
		// position the element outside the screen.s
		if (browser.hasTransform) {
			this.contents.css("top",o.posY + "px")
			if (browser.has3d) {	
				this.contents.css(browser.vendor+"Transform","translate3d(0,"+(0-$(window).height())+"px,0)");
			}
			else {
				this.contents.css(browser.vendor+"Transform","translate(0,"+(0-$(window).height())+"px)");
			}
			this.contents.css('display','block');
			this.contents.css(browser.vendor+"TransitionProperty","all");
			this.contents.css(browser.vendor+"TransitionDuration","500ms");	
			this.contents.one(browser.vendor+'TransitionEnd',function () {
				this.contents.css(browser.vendor+"TransitionProperty","");
				this.contents.css(browser.vendor+"TransitionDuration","");
				//success(true);	
			});
		}
		else  {
			this.contents.css({"top" : (0- window.height()) + "px", display: "block" })
		}
		
		
		
		
		$(window).bind('resize',this.handler);
		$('body').append(this.el);
		
		// run animation.
		var that=this;
		window.setTimeout(function () {
			if (browser.hasTransform) {
				if (browser.has3d) {	
					that.contents.css(browser.vendor+"Transform","translate3d(0,0px,0)");
				}
				else {
					that.contents.css(browser.vendor+"Transform","translate(0,0px)");
				}
			}
			else {
				that.contents.animate({"top": o.posY + "px"})
			}
		},15)
	}
	
	Dialog.prototype.close=function () {
		
		this.el.remove();
		$(window).unbind(this.handler);
		
	}
	
	/*
		options: minWidth (minimal Width of dialog box), if null, equals width
	             minHeight (minimal height of dialog box), if null equals height.
	             width (optimal width) 
	             height (optimal height) 
	
	             position: top | bottom | center
	
	*/
	globals.create=function(name,options,handler) {
	   var defaults={ width: 200, height: 200};
	   var opts=$.extend(defaults,options);
	   if (opts.minWidth==null) opts.minWidth=opts.width;
	   if (opts.minHeight==null) opts.minHeight=opts.width;
	   var d=new Dialog(name,opts);
	   handler(d.element());
	   return d;
	}
	
	
	return globals;
})