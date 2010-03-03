function a5_header(id)
{
	this.id=id;
	this.name='a5_header';
	this.childType='unordered';
	this.childsAllowed=['a5_button'];
	this.children=[];
	this.attributes={}; 
	this.attributeDefinitions=[{ name: 'title'} ];
}

a5_header.prototype=new App5Component();

a5_header.prototype.onclick_backbutton=function () {
	App5.popView();
}

a5_header.prototype.render=function(arr) {

	//var fontsize=this.getParentObject("a5_application").getFontSize();
	var height=40; 
	arr.push('<div '+App5.writeId(this.id)+' style="height:'+height+'px;" class="app5barstyle" >');
	// add back button.
	var backItem=null;
	var application=this.getParentObject('a5_application');
	if (application.viewStack.length > 1) {
		backItem=application.viewStack[application.viewStack.length-2];
		currentItem=application.viewStack[application.viewStack.length-1]
		// modal views do not need a back button, normal views do.
		if (currentItem.viewMode==App5.VM_NORMAL) {
			arr.push('<input type="button"   '+App5.writeId(this.id,'backbutton')+' class="button" value="&lt;&nbsp;'+backItem.viewName+'"/>')
		}
		
	}
	// add title
	arr.push('<span>'+this.output(this.getAttribute("title"))+'</span>');
	arr.push('<div style="float:right">')
	for (var i=0;i<this.children.length;i++) {
		this.children[i].render(arr);
	}
	arr.push('</div>')
	
	arr.push('</div>');
}
