function a5_body(id)
{
	this.id=id;
	this.name='a5_body';
	//this.childType='untyped';
	this.childType='unordered';
	this.childsAllowed=['a5_buttonmenu','a5_html','a5_list','a5_form','a5_wiki','a5_panel'];
	this.children=[];
	this.attributeDefinitions=[{ name:'scrollwrapping'}];
	this.attributes={};
	this.scrollhandler=null; 
	
	this.isAreaObject=true;
}

a5_body.prototype=new App5Component();

a5_body.prototype.getInnerWidth=function() {
	var application=this.getParentObject('a5_application');
	var screen=this.getParentObject("a5_screen");
	if (screen.getChildObject("a5_sidebar")!=null) {
		return application.windowWidth-application.sidebarWidth;
	}
	else {
		return application.windowWidth ;
	}
}

a5_body.prototype.getInnerHeight=function() {
	var application=this.getParentObject('a5_application');
	return application.bodyHeight;
}





a5_body.prototype.ontouchstart=function(e)
{
	
	if (this.scrollhandler) { 
	  if (!this.scrollhandler.initialized) this.scrollhandler.init(App5.$(this.id),App5.$(this.id,'scrollpane'));
	  return this.scrollhandler.onTouchStart(e);
	}
}

a5_body.prototype.ontouchmove=function(e)
{
	if (this.scrollhandler && this.scrollhandler.initialized) return this.scrollhandler.onTouchMove(e);
	
}

a5_body.prototype.ontouchend=function(e)
{
	if (this.scrollhandler && this.scrollhandler.initialized) return this.scrollhandler.onTouchEnd(e);
	
}

a5_body.prototype.onwebkittransitionend_scrollpane=function(e)
{
	if (this.scrollhandler && this.scrollhandler.initialized) return this.scrollhandler.onTransitionEnd(e);
	
}




a5_body.prototype.render=function(arr) {

    var height=this.getParentObject("a5_application").bodyHeight;
    if (this.getAttribute('scrollwrapping') == "true") {
		var scrollBar='hidden';
		if (this.getParentObject("a5_application").deviceModel==App5.DM_BROWSER) {
			scrollBar='scroll';
		}
		arr.push('<div '+App5.writeId(this.id)+App5.writeCaptureHandlers(['touchstart','touchend','touchmove'])+' style="background-color:white;padding-left:5px;padding-right:10px;height:'+height+'px;overflow-y:'+scrollBar+';" >');		
		arr.push('<div '+App5.writeId(this.id,'scrollpane')+'>');
		if (this.getParentObject("a5_application").deviceModel==App5.DM_IPHONE || this.getParentObject("a5_application").deviceModel==App5.DM_IPAD) {
			this.scrollhandler=new IPhoneScrollHandler();
		}
    }
    else
    {
		arr.push('<div '+App5.writeId(this.id)+App5.writeCaptureHandlers(['touchstart','touchend','touchmove'])+' style="background-color:white;min-height:'+height+'px;" >');		
	
    }
	for (var i=0;i<this.children.length;i++) {
		this.children[i].render(arr);
	}
    if (this.getAttribute('scrollwrapping') == "true") {
		arr.push('</div>')
    }
	arr.push('</div>');
}

App5.components['a5_body']=a5_body;