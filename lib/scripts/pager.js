
App5
.require('logging')
.module('pager',function(globals) {
	
	var logging=App5.modules.logging;
	
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
			if (!$(e.target).is('body')) return;
			
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
		
		if (this.options.keyboardEnabled && false) {
			$(document).bind('keydown',this.keydownHandler)
		}
		
		if (this.options.touchEnabled ) {
			alert('install events on scroller');
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
	
	
	
	
	
	/*
	function _refreshCache(that,fullClear) {
		logging.topic('pager').log('_refreshCache',that,fullClear);
		
		if (fullClear) that.pages={};
		var start=that.currentPage-that.options.cache/2;
		for (var i=start;i<start+that.cache;i++) {
			if (i>=0) {
				logging.topic('pager').log('caching ',i);
				if (_cachePage(that,i)==null) break;
			}
		}
	}
	
	
	
	function _renderTransport(that,index) {
		logging.topic('pager').log('renderTransport ',that,index);
		var transport=$('<div/>');
		var xx=0; var xi=0;
		for (var v in that.pages) {
			that.pages[v].data("transportX",null);
		}
		that.transportPages=[];
		for (var i=-1;i<=1;i++) {
			if (index+i >= 0 ) {
				var page=_cachePage(that,index+i);
				if (page !=null) {
					page.css({ 'display' : 'inline-block', 'width': that.el.width()+'px'});
					that.transportPages.push(index+i);
					logging.topic('pager').log('add page to transport ',index+i,xx);
					
					// we cant use the actual div on the transport, because we need to clone it for next
					transport.append(page.clone());
					xx+=that.el.width();
					xi+=1;
				}
			} 
		}
		transport.css("width",xx);
		return transport;
	}
	
	
	function _getTransportIndex(that,index) {
		var transportIndex=-1;
		for (var j=0;j<that.transportPages.length;j++) {
			if (that.transportPages[j]==index) {
				transportIndex=j;
				break;
			}
		}
		return transportIndex;
	}
	
	var counter=0;
	function _showPage(that,page,index,animated) {
		logging.topic('pager').log('showpage',that,page,index,animated);

		var transportIndex=_getTransportIndex(that,index);
		if (transportIndex<0) {
			_render(that);
		}
		else {
            var newTransport=null;
		    // build a new transport to center the page again.
		    newTransport=_renderTransport(that,index); 
		    var indexB=_getTransportIndex(that,index);
		    var transportX=transportIndex*that.el.width();
		    console.log("the transportX of the desired page ="+transportX);
		    newTransport.css("webkitTransform","translate3d("+(0-indexB*that.el.width())+"px,0,0)");
			newTransport.name=counter++;
			if (animated ) {
			    console.log("old transport "+that.transport.name+" scrolling to "+"pageNo "+index+"  x "+transportX); 
				if (newTransport) {
					that.transport.before(newTransport.css({"position":"absolute","opacity":0}));
				}
				that.transport.css("webkitTransitionProperty","all");
				that.transport.css("webkitTransitionDuration","400ms");
				that.transport.one('webkitTransitionEnd',function () {
				    console.log("replacing transport, animated "+newTransport.name); 
					if (newTransport) {
						that.transport.css("webkitTransitionDuration","100ms");
						newTransport.css("webkitTransitionProperty","all");
						newTransport.css("webkitTransitionDuration","100ms");
						that.transport.one('webkitTransitionEnd',function () {
					    	that.transport.remove();
							that.transport=newTransport;
						});
						newTransport.css("opacity",1)
						that.transport.css("opacity", 0);
					};
				});
				that.transport.css({ "webkitTransform": "translate3d("+(0-transportX)+"px,0,0)" });
		    }
			else {
				that.transport.css("webkitTransform","translate3d("+(0-transportX)+"px,0,0)");
			    if (newTransport) window.setTimeout(function () {
				    that.transport.css("webkitTransitionProperty","");
					that.transport.replaceWith(newTransport);
					that.transport=newTransport;
				},0);
			}
		} 
	}
	
	
	

	
	
	Pager.prototype.nextPage=function() {
		logging.topic('pager').log('nextPage');
		
		var page=_cachePage(this,this.currentPage+1);
		if (page != null) {
			this.currentPage++;
			_refreshCache(this);
			_showPage(this,page,this.currentPage,true);
			//_refreshTransport(this);
		}
	}
	
	Pager.prototype.prevPage=function() {
		logging.topic('pager').log('prevPage');
		var page=_cachePage(this,this.currentPage-1);
		if (page != null) {
			this.currentPage--;
			_refreshCache(this);
			_showPage(this,page,this.currentPage,true);
			//_refreshTransport(this);
		}
	}
	*/
	
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
		that.el.css("overflow","hidden");
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
		that.scroller.css("webkitTransform","translate3d("+(0-that.position[that.currentPage])+"px,0,0)");
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
		this.scroller.css("webkitTransitionProperty","all");
		this.scroller.css("webkitTransitionDuration","500ms");		
		this.scroller.css("webkitTransform","translate3d("+(0-xPos)+"px,0,0)")
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
	
	
	
	
	
	
	
	
	
	
	
	
	/**** standard component methods, init, destroy, bind ***/
	
	
    globals.create=function (el,options) {
		return new Pager(el,options)
	}	
})