
App5
.require('logging')
.require('browser')
.require('promise')
.module('pager',function(globals) {
	
	var logging=App5.modules.logging;
	var browser=App5.modules.browser;
	var promise=App5.modules.promise;
	
	function Pager(el,options) {
		
		this.el=el;
		this.scroller=$('<div/>'); //scroller div.
		this.el.append(this.scroller);
		this.scroller.css("position","absolute");
		//this.scroller=null ; // scroller div.
		this.cacheCount=0;  // number of pages in the scroller.
		                    // nextPage will append a page if the scroller holds less than maxCache items.
		                    // otherwise it will generate a new scroller and replace the old scroller with the new one.
							// if you go back, there is always a new scroller generated.
		this.currentPage=0;
		this.lastPage=0; // number of the last page in the cache.
		this.position={} // position for each page, by index.
		this.pages={} // cached pages. jquery div objects.
		this.xPos=0; // current xPos of the page when a page is added to the right.
		
		this.options=jQuery.extend({
			maxCache: 10,
			minCache: 4,
			touchEnabled : true,
			keyboardEnabled : true
		},options);
		
		
		var self=this;
		this.keydownHandler=logging.guard(function (e){
			
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
		
		
		// resizing
		var w=el.width();
		var h=el.height();
		var resizePlanned=false;
		el.bind('app5.layout.resize',function () {
			if (!resizePlanned && ( w != el.width() || h != el.height() )) {
				resizePlanned=true;
				window.setTimeout(function () {
					_replaceCache(self,true);
					resizePlanned=false;
				},100);
			}
		});
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
	
	/**
		replaces the chache with pages in proximity to the current page,
		and renders them all.
	*/
	function _replaceCache(that,fullReplace) {
		that.lastPage=-1;
		
		// whenever the cache is updated, every page that is not in range currentPage-1...currentPage...currentPage+minCache 
		// is removed.
		for (var v in that.position) {
			if ((v<that.currentPage-1 || v> that.currentPage+that.options.minCache) || fullReplace) {
				that.pages[v].remove();
				delete that.pages[v];
				delete that.position[v];
				that.cacheCount--;
				
			}
		}
		
		//that.position={};
		//that.el.empty();
		//that.scroller=$('<div/>');
		var promises=[];
		for (var i = -1;i<that.options.minCache;i++) {
			//_renderPage(that,that.currentPage+i);
			promises.push(_cachePage(that,that.currentPage+i));
		}
		var result=promise.join(promises).done(function () {
			for (var i = -1;i<that.options.minCache;i++) {
				if (that.pages[that.currentPage+i] != null) {
					_renderPage(that,that.currentPage+i);
				}
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
				that.scroller.css("left",(0-that.position[that.currentPage])+"px");
			}
			//that.el.append(that.scroller);
		});
		
		return result;
	}
	
	
	function _renderPage(that,index) {
		logging.topic('pager').log("render page "+index);
		if (index<0) return;
		if(index>that.lastPage) that.lastPage=index; // keep track of the last rendered page.
		if (that.position[index]) return; // already rendered.
		var page=that.pages[index];
		if (page==null) throw new Error("page should be cached before it can be rendered.");
		var pos=that.el.width()*index;
		that.position[index]=pos;
		page.css({"position" : "absolute", "left" : pos +"px"});
		that.scroller.append(page);
	}
	

	function _cachePage(that,index) {
		logging.topic('pager').log('_cachePage',that,index);
		if (index<0) return promise.of(null);
		if (that.pages[index]) {
			return promise.of(that.pages[index]);
		}
		var page=$('<div/>').css({'width' : that.el.width(), 'height': that.el.height() });
		var p=promise.of(that.model.renderPage(index,page));
		p.done(function (page) {
			if (page!=null && that.pages[index]==null) {
				that.pages[index]=page;
				that.cacheCount++;
			}
		});
		return p;
		
	}
	
	
	Pager.prototype.nextPage=function () {
		var that=this;
		
		if (this.busy) {
			// using caching only.
			if (that.position[that.currentPage+1] != null) {
				that.scrollToPage(that.currentPage+1);
			}
			else {
				_resetTranslate(that);
			}
			return;
		}
		this.busy=true;
		
		// the async actions that are happening in this function.
		// make sure that all of them are filled with promises, because in the end we are waiting for them.
		var prefetch;
		var replaceCache ;
		var checkExist;
		
		
		// prefetch.
		if (that.cacheCount < that.options.maxCache) {
			prefetch=_cachePage(that,that.lastPage+1).done(function (page){
				if (page!=null) _renderPage(that,that.lastPage+1);
			})	
		}	
		else {
			prefetch=promise.of(null);
		}
		

		// if we have the required page, scroll to it.
		if (that.position[that.currentPage+1] != null) {
			that.scrollToPage(that.currentPage+1);
			//and cleanup the cache if it gets too big.
			if (that.cacheCount >= that.options.maxCache) {
				replaceCache=_replaceCache(that);
			}
			else {
				replaceCache=promise.of(null);
			}
			checkExist=promise.of(null);	
		}
		else {
			// we don't have the required page. Probably means it does not exist.
			// but to prove that it really does not exist and is not a stupid bug from 
			// jumping around in the file, we fetch it one more time.
			replaceCache=promise.promise();
			checkExist=_cachePage(that,that.currentPage+1).done(function (page) {
				// the page exists but was not cached somehow.
				if (page != null) {
						replaceCache.join(_replaceCache(that));
				}
				else {
					// page does not exist. reset possible scrolling.
					replaceCache.fulfill(null);
					_resetTranslate(that);
				}
			});
		}
		
		promise.join([ prefetch, replaceCache,checkExist]).done( function () {
			that.busy=false;
		});
	}
	
	Pager.prototype.prevPage=function() {
		var that=this;
		
		if (this.busy) {
			if (that.position[that.currentPage-1] != null) {
				that.scrollToPage(that.currentPage-1);
			}
			else {
				_resetTranslate(that);
			}
			return;
		}
		this.busy=true;
		
		var replaceCache ;
		var checkExist;
		
		if (that.position[that.currentPage-1] != null) {
			var prevPage=that.currentPage-1;
			that.scrollToPage(prevPage);
			replaceCache=_replaceCache(that);
			checkExist=promise.of(null);
		}		
		else {
			replaceCache=promise.promise();
			checkExist=_cachePage(that,that.currentPage-1).done(function (page) {
				if (page != null) {
					// the page exists but is not cached.
					that.currentPage--;
					replaceCache.join(_replaceCache(that));
				}
				else {
					// page does not exist, reset the scroll to the current page.
					replaceCache.fulfill(null);
					_resetTranslate(that);
				}
			});
		}
		promise.join([ replaceCache,checkExist]).done( function () {
			that.busy=false;
		});
		
	}

    
    Pager.prototype.scrollToPage=function(index) {
		var xPos=this.position[index];
		if (xPos==null) return;
		this.currentPage=index;
		logging.topic("pager").log("has transform?",browser.hasTransform,browser.has3d);
		if (browser.hasTransform) {
			this.scroller.css(browser.vendor+"TransitionProperty","all");
			this.scroller.css(browser.vendor+"TransitionDuration","500ms");	
			var that=this;
			this.scroller.one(browser.vendor+'TransitionEnd',function () {
				that.scroller.css(browser.vendor+"TransitionProperty","");
				that.scroller.css(browser.vendor+"TransitionDuration","");	
			});
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