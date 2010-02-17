function a5_screen(id)
{
	this.id=id;
	this.name='a5_screen';
	this.childsAllowed=['a5_sidebar?','a5_header','a5_body','a5_footer?'];
	this.children=[];
	this.attributes={}; 

}

a5_screen.prototype=new App5Component();

a5_screen.prototype.render=function(replace)
{
	var arr=[];
	var width=this.getParentObject("a5_application").windowWidth;
	var sidebarWidth=this.getParentObject("a5_application").sidebarWidth;
	//if (width==null) width=320;
	arr.push('<div '+App5.writeId(this.id)+' style="display:'+(replace?'block':'none')+';width:'+width+'px">')
	var sidebar=this.getChildObject('a5_sidebar');
	if (sidebar != null ) {
		this.getChildObject('a5_sidebar').render(arr);
		var newWidth=width-sidebarWidth;
		arr.push('<div>')
	}
	this.getChildObject('a5_header').render(arr);
	this.getChildObject('a5_body').render(arr);
	this.getChildObject('a5_footer').render(arr);
	if (sidebar) arr.push('</div>'); // close main area.
	arr.push('</div>'); // close screen
	if (replace) {
		var s=arr.join('');
		$('#app5application').html(arr.join(''));
	}
	else {
		$('#app5application').append(arr.join(''));
		
	}
}

a5_screen.prototype.activate=function(transition) {
	// TODO: this might go wrong if the screen is already the current screen.
	this.render(false);
	this.parent.animateScreen(this.id,transition);
}



App5.components['a5_screen']=a5_screen;