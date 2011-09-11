
App5
.require('browser')
.require('promise')
.require('layout')
.require('bus')
.module('stackview',function(globals) {
	
	var browser=App5.modules.browser;
	var promise=App5.modules.promise;
	var layout=App5.modules.layout;
	var bus=App5.modules.bus;
	
	function StackView(el,options) {
		
		this.el=el.css({"overflow": "hidden"});
		this.scroller=$('<div/>'); //scroller div.
		this.el.append(this.scroller);
		this.scroller.css({"position":"absolute", width: this.el.width()+'px', height: this.el.height()+'px' });
		//this.scroller=null ; // scroller div.
		this.views=[]; // cached pages. jquery div objects.
		this.position=[]; // position for each page, by index.
		this.lastPage=0; // number of the last page in the cache.
		this.xPos=0; // current xPos of the page when a page is added to the right.
		this.xPosLeft=0; // xpos of the page that is left most.
		
		this.options=jQuery.extend({
			touchEnabled : true,
			keyboardEnabled : true
		},options);
		
		
		var self=this;
		this.keydownHandler=function (e){
			
			if (!$(e.target).is('body') && e.currentTarget != document) return;
			
			
			// TODO, replace arrow back with ESC?
			if (e.keyCode==37) {
				self.prevPage();
			}
		};
		
		if (this.options.keyboardEnabled ) {
			$(document).bind('keydown',this.keydownHandler)
		}
		
		// resizing
		var w=el.width();
		var h=el.height();
		var resizePlanned=false;
		bus.listenForElement('app5.layout.resize',el.attr("id"),function () {
			//console.log('resize in stackview '+w+' '+h+' '+el.width()+' '+el.height()+"   innerWidth: "+el.innerWidth());
			if (!resizePlanned && ( w != el.width() || h != el.height() )) {
				w=el.width();
				h=el.height();
				resizePlanned=true;
				window.setTimeout(function () {
					_resizeSubviews(self,true);
					resizePlanned=false;
				},30);
			}
		});
		//this.options=options;
	}
	
	StackView.prototype.width=function() {
		return this.el.width();
	}
	StackView.prototype.height=function() {
		return this.el.height();
	}
	
	
	
	function _resetTranslate(that) {
		var currentPos=0;
		if (that.position.length > 0) {
			currentPos=that.position[that.position.length-1];
		}
		that.scroller.css(browser.vendor+"TransitionProperty","");
		console.log("currentPos",currentPos);
		if (browser.has3d) {	
			that.scroller.css(browser.vendor+"Transform","translate3d("+(0-currentPos)+"px,0,0)")
		}
		else {
			that.scroller.css(browser.vendor+"Transform","translate("+(0-currentPos)+"px,0)")
		}
	}


	function _render(that) {
		console.log('render',that);
		that.el.css({"overflow":"hidden", "position":"relative"});
		_resizeSubviews(that);
	}
	
	
	function _resizeSubviews(that) {
		that.xPos=0;
		that.position=[];
		
		that.scroller.css("height",that.el.height())
		for (var i=0;i<that.views.length;i++) {
			that.views[i].css( { left: that.xPos +'px', width: that.el.width(), height: that.el.height() });
			that.position.push(that.xPos);
			that.xPos+=that.el.width();
			bus.publish('app5.layout.resize.'+that.views[i].attr('id'),{});
			//that.views[i].trigger('app5.layout.resize');
		}
		_resetTranslate(that);
	}
	
	/**
		returns a promise that fires when the animation is finished.
	*/
    function _scrollTo(that,xPos) {
		if (xPos==null) return promise.of(false);
		
		return promise.about(function (success,failure){
			if (browser.hasTransform) {
				that.scroller.css(browser.vendor+"TransitionProperty","all");
				that.scroller.css(browser.vendor+"TransitionDuration","500ms");	
				that.scroller.one(browser.vendor+'TransitionEnd',function () {
					that.scroller.css(browser.vendor+"TransitionProperty","");
					that.scroller.css(browser.vendor+"TransitionDuration","");
					success(true);	
				});
				if (browser.has3d) {	
					that.scroller.css(browser.vendor+"Transform","translate3d("+(0-xPos)+"px,0,0)")
				}
				else {
					that.scroller.css(browser.vendor+"Transform","translate("+(0-xPos)+"px,0)")
				}
			}
			else {
				 that.scroller.css("position", "absolute");
				 //TODO. call success promise.
				 that.scroller.animate({left: (0-xPos)+"px" },500);
			}
		});
	}    
	
	
	
	StackView.prototype.pushView=function(view) {
		var that= this;
		
		that.position.push(that.xPos);
		if (view.attr('data-layout-container') != null) {
			view.css({"position" : "absolute", "left" : that.xPos +"px"});
			layout.nested(view,that.el.width(),that.el.height())
		}
		else {
			view.css({"position" : "absolute", "left" : that.xPos +"px", width: that.el.width(), height: that.el.height() });
		}	



		that.views.push(view);
		that.scroller.append(view);
		var scrollX=that.xPos;
		that.xPos += that.el.width();
		return _scrollTo(that,scrollX);
		
	}
	
	StackView.prototype.popView=function() {
		var that=this;
		var pos=0;
		if (that.views.length > 1) {
			pos=that.position[that.views.length-2];
		}
		var pr=_scrollTo(that,pos);
		if (that.views.length > 0) {
			var vw=that.views.pop();
			vw.remove();
			that.position.pop();
		}
		return pr;
	
	}
	
	StackView.prototype.size=function() {
		return this.views.length;
	}
	
	/*
		replaces the stack with the supplied view. The direction paremeter ("direct"|"back"|"forward")
		determines how this new view is placed on the scroller. 
	*/
	StackView.prototype.replaceView=function(view,direction) {
		console.log("direction "+direction);
		if ((direction=="forward" || direction =="back") && this.views.length > 0) {
			
			var x=0;
			if (direction == "forward") {
				x=this.xPos;
			}
			else {
				x=this.xPosLeft-this.el.width();
			}
			if (view.attr('data-layout-container') != null) {
				view.css({"position" : "absolute", "left" : x +"px"});
				layout.nested(view,this.el.width(),this.el.height())
			}
			else {
				view.css({"position" : "absolute", "left" : x +"px", width: this.el.width(), height: this.el.height() });
			}	
			this.views = [ view ];
			this.position = [ x ];
			this.xPosLeft=x;
			this.xPos=x+this.el.width();
			this.scroller.append(view);
			var that=this;
			return _scrollTo(this,this.xPosLeft).done(function () {
				// remove all other nodes
				that.scroller.children().each(function (){
					var c=$(this);
					if (c.get(0) != view.get(0)) {
						c.remove();
					}
				});
			});
		}
		else if (direction=="direct" || this.views.length ==0) {
			this.views= [view];
			this.position=[0];
			this.xPosLeft=0;
			this.xPos=this.el.width();
			if (view.attr('data-layout-container') != null) {
				view.css({"position" : "absolute", "left" : "0px"});
				layout.nested(view,x,this.el.height())
			}
			else {
				view.css({"position" : "absolute", "left" : "0px", width: x, height: this.el.height() });
			}
			this.scroller.empty().append(view);
			_resetTranslate(this);
			return promise.of(true);
 		}
		else throw new Error("Illegal argument direction:'"+direction+"' in jumpToView");
	}
	
	
	StackView.prototype.destroy=function() {
		this.model=null;
		this.el.unbind();
		//TODO, bus.
		$(document).unbind(this.keydownHandler)
	}
	
	/*** exports **/
	
    globals.create=function (el,options) {
		return new StackView(el,options)
	}	
})
