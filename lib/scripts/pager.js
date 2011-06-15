
App5
.require('logging')
.require('browser')
.module('pager',function(globals) {
	
	var logging=App5.modules.logging;
	var browser=App5.modules.browser;
	
	function Pager(el,options) {
		
		this.el=el;
		this.scroller=null ; // scroller div.
		this.cacheCount=0;  // number of pages in the scroller.
		                    // nextPage will append a page if the scroller holds less than maxCache items.
		                    // otherwise it will generate a new scroller and replace the old scroller with the new one.
							// if you go back, there is always a new scroller generated.
		this.currentPage=0;
		this.lastPage=0; // number of the last page in the cache.
		this.position={} // position for each page, by index.
		this.xPos=0; // current xPos of the page when a page is added to the right.
		
		this.options=jQuery.extend({
			maxCache: 10,
			minCache: 4,
			touchEnabled : true,
			keyboardEnabled : true
		},options);
		
		
		var self=this;
		this.keydownHandler=logging.guard(function (e){
			
			console.log(e);
			if (!$(e.target).is('body') && e.currentTarget != document) return;
			
			if (e.keyCode == 32) {
				if (!e.shiftKey) self.nextPage();
				else self.prevPage();
			}
			if (e.keyCode==39) {
				self.nextPage();
			}
			if (e.keyCode==37) {
				self.prevPage();
			}
		});
		
		if (this.options.keyboardEnabled ) {
			$(document).bind('keydown',this.keydownHandler)
		}
		
		if (browser.hasTouch && this.options.touchEnabled ) {
			var swiping=false;
			var swipeX=0;
			var swipeDirection;
			
			this.el.get(0).addEventListener('touchstart',function (e) {
				if (e.touches.length == 1) {
					swiping=true;
					swipeX=e.touches[0].pageX;
				}
				else swiping=false;				
			});
			
			this.el.get(0).addEventListener('touchmove',function (e) {

				if (! swiping) return;
				if (e.touches.length == 1) {
					var swipeXX=e.touches[0].pageX-swipeX;
					_translate(self,swipeXX);
					if (swipeXX > 70) {
						//e.stopPropagation();
						swipeDirection=-1;
					}
					else if (swipeXX < -70) {
						//e.stopPropagation();
						swipeDirection=1;
					}
				}
				
			});
			this.el.get(0).addEventListener('touchend',function (e) {

				if (! swiping) return;
				if (swipeDirection==1) {
					self.nextPage();
				}
				else if (swipeDirection==-1)  {
					self.prevPage();
				}
				else {
					_resetTranslate(self);
				}
				swiping=false;
			});
 		}
		
		//this.options=options;
	}
	
	
	function _translate(that,x) {
		that.scroller.css("webkitTransitionProperty","");
		that.scroller.css("webkitTransform","translate3d("+(0-that.position[that.currentPage]+x)+"px,0,0)")
	}
	
	function _resetTranslate(that) {
		that.scroller.css("webkitTransitionProperty","");
		that.scroller.css("webkitTransform","translate3d("+(0-that.position[that.currentPage])+"px,0,0)")
	}


	function _render(that) {
		logging.topic('pager').log('render',that);
		that.el.css({"overflow":"hidden", "position":"relative"});
		_replaceCache(that);
	}
	
	function _replaceCache(that) {
		that.cacheCount=0;
		that.xPos=0;
		that.lastPage=0;
		that.position={};
		that.scroller=$('<div/>');
		for (var i = -1;i<that.options.minCache;i++) {
			_renderPage(that,that.currentPage+i);
		}
		if (browser.hasTransform) {
			if (browser.has3d) {	
				that.scroller.css(browser.vendor+"Transform","translate3d("+(0-that.position[that.currentPage])+"px,0,0)")
			}
			else {
				that.scroller.css(browser.vendor+"Transform","translate("+ (0-that.position[that.currentPage])+"px,0)")
			}
		}
		else {
			that.scroller.css("position","absolute");
			that.scroller.css("left",(0-that.position[that.currentPage])+"px");
		}
		that.el.empty().append(that.scroller);

		
	}
	
	
	function _renderPage(that,index) {
		logging.topic('pager').log("render page "+index)
		var page=_cachePage(that,index);
		if (page != null) {
			that.scroller.append(page);
			
			that.cacheCount++;
			that.lastPage=index;
			that.position[index]=that.xPos;
			that.xPos=that.xPos+that.el.width();
			that.scroller.css("width",that.xPos);
		}
	}
	

	function _cachePage(that,index) {
		logging.topic('pager').log('_cachePage',that,index);
		if (index<0) return null;

		var page=$('<div/>').css({'width' : that.el.width(), 'height': that.el.height() , 'display': 'inline-block'});
		if (!that.model.renderPage(index,page)) return null;
		return page;
		
	}
	
	
	Pager.prototype.nextPage=function () {
		var that=this;
		
		if (that.cacheCount < that.options.maxCache) {
			_renderPage(that,that.lastPage+1);
		}
		
		if (that.position[that.currentPage+1] != null) {
			that.scrollToPage(that.currentPage+1);
			if (that.cacheCount >= that.options.maxCache) {
				// replace the cache
				window.setTimeout(function () {
					_replaceCache(that);
				},100);
			}	
		}
		else {
			if (_cachePage(that,that.currentPage+1) != null) {
				// the page exists but is somehow not cached.
				that.currentPage++;
				window.setTimeout(function () {
					_replaceCache(that);
				},100);
			}
			// page does not exist. reset possible scrolling.
			_resetTranslate(that);
		}
	}
	
	Pager.prototype.prevPage=function() {
		var that=this;
		if (that.position[that.currentPage-1] != null) {
			var prevPage=that.currentPage-1;
			that.scrollToPage(prevPage);
			if (that.position[prevPage]==0) {
				window.setTimeout(function () {
					_replaceCache(that);
				},100);
			}		}
		else {
			if (_cachePage(that,that.currentPage-1) != null) {
				// the page exists but is not cached.
				that.currentPage--;
				window.setTimeout(function () {
					_replaceCache(that);
				},100);
			}
			// page does not exist, reset the scroll to the current page.
			_resetTranslate(that);
		}
		
	}

    
    Pager.prototype.scrollToPage=function(index) {
		var xPos=this.position[index];
		if (xPos==null) return;
		this.currentPage=index;
		logging.topic("pager").log("has transform?",browser.hasTransform,browser.has3d);
		if (browser.hasTransform) {
			this.scroller.css(browser.vendor+"TransitionProperty","all");
			this.scroller.css(browser.vendor+"TransitionDuration","500ms");	
			if (browser.has3d) {	
				this.scroller.css(browser.vendor+"Transform","translate3d("+(0-xPos)+"px,0,0)")
			}
			else {
				this.scroller.css(browser.vendor+"Transform","translate("+(0-xPos)+"px,0)")
			}
		}
		else {
			 this.scroller.css("position", "absolute");
			 this.scroller.animate({left: (0-xPos)+"px" },500);
		}
	}    

 

	Pager.prototype.setModel=function(model) {
		//this.el.unbind('app5.pager.model');
		//this.el.bind('app5.pager.model.retrievePage',function (event,pageNo,pageDiv) { 
		//	obj.retrievePage(pageNo,pageDiv);
		//});
		this.model=model;
		this.currentPage=0;
		
		//_refreshCache(this,true);
		_render(this);
	}

	
	Pager.prototype.destroy=function() {
		this.model=null;
		this.el.unbind();
		$(document).unbind(this.keydownHandler)
	}
	
	/*** exports **/
	
    globals.create=function (el,options) {
		return new Pager(el,options)
	}	
})