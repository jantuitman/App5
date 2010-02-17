function a5_panel(id)
{
	this.id=id;
	this.name='a5_panel';
	//this.childType='untyped';
	this.childType='unordered';
	this.childsAllowed=['a5_buttonmenu','a5_html','a5_list','a5_form','a5_wiki','a5_panel'];
	this.children=[];
	this.attributeDefinitions=[{ name:'display'}];
	this.attributes={};
	this.scrollhandler=null; 
	
}

a5_panel.prototype=new App5Component();


a5_panel.prototype.render=function(arr)
{
	arr.push('<div '+App5.writeId(this.id,'wrapper')+' >')
	this.renderContent(arr);
	arr.push('</div>')
}

a5_panel.prototype.update=function()
{
	var o=App5.$(this.id,'wrapper');
	if (o) {
		var arr=[];
		this.renderContent(arr);
		o.html(arr.join(''));
	}
}

a5_panel.prototype.renderContent=function(arr) {

	//alert(this.getAttribute("display"));
	arr.push('<div style="display:'+(this.getAttribute("display"))+'">');
	for (var i=0;i<this.children.length;i++) {
		this.children[i].render(arr);
	}
	arr.push('</div>');
}

App5.components['a5_panel']=a5_panel;