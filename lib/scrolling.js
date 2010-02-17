/*
* 
*This IPhoneScrollHandler for iphone is derived from iScroll: 
*
*Which is copyright (c) 2009 Matteo Spinelli, http://cubiq.org/
* Released under MIT license
* http://cubiq.org/dropbox/mit-license.txt
Find more about the scrolling function at
* http://cubiq.org/scrolling-div-on-iphone-ipod-touch/5
*
*/
function IPhoneScrollHandler(screenelement)
{
	this.screenElement=screenelement;
	this.initialized=false;
	//this.installEventHandling();
	this.position=0;
	this.moved=false; // will be true if we are in a move event handling cycle.
	this.running=false; // will be true if an animation is running.
}

IPhoneScrollHandler.prototype.init=function(screenElement,scrollingElement)
{
	this.screenElement=screenElement;
	this.scrollingElement=scrollingElement;
	this.viewHeight=screenElement.height();
	this.initialized=true;
	this.scrollingElement.get(0).addEventListener('webkitTransitionEnd', this, false);
}

/* deprecated */
IPhoneScrollHandler.prototype.update=function(scrollingElement,viewHeight)
{
	this.scrollingElement=scrollingElement;
	this.viewHeight=viewHeight;
	this.scrollingElement.get(0).addEventListener('webkitTransitionEnd', this, false);
}

/* deprecated */
IPhoneScrollHandler.prototype.installEventHandling=function()
{
	this.screenElement.get(0).addEventListener('touchstart', this, false);
	this.screenElement.get(0).addEventListener('touchmove', this, false);
	this.screenElement.get(0).addEventListener('touchend', this, false);
}

/* handles the end transitions of the scrolling animations */
IPhoneScrollHandler.prototype.handleEvent=function(e)
{
	switch(e.type) {
		//case 'touchstart': this.createHandler(this.onTouchStart)(e); break;
		//case 'touchmove': this.createHandler(this.onTouchMove)(e); break;
		//case 'touchend': this.createHandler(this.onTouchEnd)(e); break;
		case 'webkitTransitionEnd': this.onTransitionEnd(e); break;
	}
}

IPhoneScrollHandler.prototype.getPosition=function() {
	var theTransform = window.getComputedStyle(this.scrollingElement.get(0)).webkitTransform;
	theTransform = new WebKitCSSMatrix(theTransform).m42;
	return theTransform;
}

/*
   only handle events when we have a scrollingElement.
*/
IPhoneScrollHandler.prototype.createHandler=function(f) {
	var self=this;
    return function(e) {
		if (self.scrollingElement!=null) {
			e.preventDefault();
            return f.call(self,e);
		}
		
	}
}

IPhoneScrollHandler.prototype.onTouchStart=function(e)
{
	e.preventDefault();
	//e.cancelBubble=true;
	this.startY = e.targetTouches[0].clientY;
	this.moved=false; 
	this.scrollStartTime=e.timeStamp;
	
	// remove any animation
	this.scrollingElement.get(0).style.webkitTransitionDuration = '0';	// Remove any transition
	this.scrollingElement.get(0).style.webkitTransform = 'translate(0, ' + this.getPosition() + 'px)';
}

IPhoneScrollHandler.prototype.onTouchMove=function(e)
{
	e.preventDefault();
	this.moved=true;
	this.deltaY=e.targetTouches[0].clientY-this.startY;
	// time is in ms, so multiply * 1000 to get pixels/sec.
	this.speed = 1000*Math.abs(this.deltaY)/(e.timeStamp-this.scrollStartTime);


	//alert("Speed "+this.speed)
	if (this.speed<200) {
		// speed is very slow, so just follow and don't do any acceleration stuff.
		this.scrollingElement.get(0).style.webkitTransition='';
	    this.scrollingElement.get(0).style.webkitTransform = 'translate(0, ' + (this.getPosition()+this.deltaY) + 'px)';
		this.startY=e.targetTouches[0].clientY;
		this.scrollStartTime=e.timeStamp;
	}
	else {
		// speed is fast so scroll 2s with a speed in range this.speed...0 
		// assuming the average speed is 0.5*this.speed, the total pixels will be 0.5*2*this.speed px.
		this.scrollingElement.get(0).style.webkitTransformStyle = 'flat';
		var sign=1;
		if (this.deltaY<0) sign=-1;
		var currentPosition=this.getPosition();
		var scrollTo=currentPosition+sign*this.speed ;
		var duration=2000
		
		// constrain scrolling
		if (scrollTo>0.5*this.viewHeight) {
			duration=duration*(0.5*this.viewHeight-currentPosition)/(scrollTo-currentPosition);
			scrollTo=0.5*this.viewHeight;
		}
		if (scrollTo +this.scrollingElement.height() < 0.5 * this.viewHeight) {
			duration=duration*(0.5*this.viewHeight-this.scrollingElement.height() -currentPosition)/(scrollTo-currentPosition);
			scrollTo=0.5*this.viewHeight-this.scrollingElement.height();
			
		}
		this.scrollingElement.get(0).style.webkitTransition=' -webkit-transform '+duration+'ms ease-out ';
		this.scrollingElement.get(0).style.webkitTransform = 'translate(0, ' + (scrollTo) + 'px)';
		this.running=true;
	}
		
}

IPhoneScrollHandler.prototype.onTouchEnd=function(e)
{
	//console.log("Touch end!");
	e.preventDefault();

	if(!this.running || !this.moved ) {
		
		//alert("handling button click "+e.srcElement.id+' , ');
		//App5.handleEvent(e);
		
		var theTarget = e.target;
		if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
		var theEvent = document.createEvent("MouseEvents");
		//console.log("sending click event to target");
		theEvent.initEvent('click', true, true);
		theTarget.dispatchEvent(theEvent);
		
		return false
	}
	
}

IPhoneScrollHandler.prototype.onTransitionEnd=function(e)
{
	this.running=false;
	if (this.getPosition() > 0) {
		this.scrollingElement.get(0).style.webkitTransition=' -webkit-transform 300ms ease-out ';
		this.scrollingElement.get(0).style.webkitTransform = 'translate(0, 0px)';
		return;	
	}
	if (this.getPosition() +this.scrollingElement.height() < this.viewHeight) {
		var y=0-Math.max(0,this.scrollingElement.height()-this.viewHeight)
		this.scrollingElement.get(0).style.webkitTransition=' -webkit-transform 100ms ease-out ';
		this.scrollingElement.get(0).style.webkitTransform = 'translate(0, '+y+'px)';
		return;	
	}
	
	
}