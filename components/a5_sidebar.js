function a5_sidebar(id)
{
	this.id=id;
	this.name='a5_sidebar';


	this.childType='unordered';
	this.childsAllowed=['a5_buttonmenu','a5_html','a5_list','a5_form','a5_wiki','a5_panel'];
	this.children=[];
	
	this.isAreaObject=true;

	this.attributes={}; 
	this.attributeDefinitions=[{ name: 'title'}, { name: 'scrollwrapping'} ];
}


a5_sidebar.prototype=new App5Component();


a5_sidebar.prototype.getInnerWidth=function() {
	return this.getParentObject('a5_application').sidebarWidth;
}

a5_sidebar.prototype.getInnerHeight=function() {
	var application=this.getParentObject('a5_application');
	return application.bodyHeight;
}



a5_sidebar.prototype.onclick_backbutton=function () {
	App5.popView();
}

a5_sidebar.prototype.render=function(arr) {

	var fontsize=this.getParentObject("a5_application").getFontSize();
	var headerheight=fontsize+10; 
	var application=this.getParentObject('a5_application');
	var totalHeight=headerheight+application.bodyHeight;
	arr.push('<div '+App5.writeId(this.id)+' style="float:left;width:'+application.sidebarWidth+'px;height:'+totalHeight+'px" class="app5sidebar" >');

	this.renderContents(arr);

	arr.push('</div>');
}

a5_sidebar.prototype.renderContents=function(arr) {
	
	var fontsize=this.getParentObject("a5_application").getFontSize();
	var headerheight=fontsize+10; 
	var application=this.getParentObject('a5_application');
	var totalHeight=headerheight+application.bodyHeight;
	arr.push('<div  style="height:'+headerheight+'px;" class="app5barstyle" >');
	// add back button.
	var backItem=null;
	if (application.viewStack.length > 1) {
		backItem=application.viewStack[application.viewStack.length-2];
		currentItem=application.viewStack[application.viewStack.length-1]
		// modal views do not need a back button, normal views do.
		if (currentItem.viewMode==App5.VM_NORMAL  || currentItem.viewMode==App5.VM_SIDEBAR ) {
			arr.push('<input type="button"   '+App5.writeId(this.id,'backbutton')+' class="button" value="&lt;&nbsp;'+backItem.viewName+'"/>')
		}
		
	}
	// add title
	arr.push('<span>'+this.getAttribute("title")+'</span>');
	arr.push('</div>')

    this.renderBody(arr);
	
}

a5_sidebar.prototype.renderBody=function(arr) {
	
	// body of the sidebar.
	var height=this.getParentObject("a5_application").bodyHeight;
	if (this.getAttribute('scrollwrapping') == "true") {
        
		var overflow="hidden";
		if (this.getParentObject("a5_application").deviceModel != App5.DM_IPHONE) {
			overflow="scroll"
		}
		
		arr.push('<div '+App5.writeId(this.id)+App5.writeCaptureHandlers(['touchstart','touchend','touchmove'])+' class="app5windowstyle" style="height:'+height+'px;overflow-y:'+overflow+';" >');		
		arr.push('<div '+App5.writeId(this.id,'scrollpane')+'>');
		if (this.getParentObject("a5_application").iphone) {
			this.scrollhandler=new IPhoneScrollHandler();
		}
	}
	else
	{
		arr.push('<div '+App5.writeId(this.id)+App5.writeCaptureHandlers(['touchstart','touchend','touchmove'])+' class="app5windowstyle" style="min-height:'+height+'px;" >');		

	}
	for (var i=0;i<this.children.length;i++) {
		this.children[i].render(arr);
	}
	if (this.getAttribute('scrollwrapping') == "true") {
		arr.push('</div>')
	}
	arr.push('</div>');
	
}

a5_sidebar.prototype.update=function() {
	
	var arr=[];
	this.renderContents(arr);
	App5.$(this.id).html(arr.join(""));
}

App5.components['a5_sidebar']=a5_sidebar;