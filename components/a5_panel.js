function a5_panel(id)
{
	this.id=id;
	this.name='a5_panel';
	//this.childType='untyped';
	this.childType='unordered';
	this.childsAllowed=['a5_buttonmenu','a5_html','a5_list','a5_form','a5_wiki','a5_panel','a5_icon','a5_label'];
	this.children=[];
	this.attributeDefinitions=[{ name:'display'}];
	this.attributes={};
	this.attributes.display="block";
	this.scrollhandler=null; 
	
}

a5_panel.prototype=new App5Component();


/*** mix-in for data binding */

a5_panel.prototype.getKeys=function () {
	if (this.subid !=null) {
		return this.getParentObject().getKeys();
	}
	else return this.keys;
}


a5_panel.prototype.setKeys=function(keys) {
	this.keys=keys;
	for (var i=0;i<this.children.length;i++) {
		this.children[i].update();
	}
}
a5_panel.prototype.getModelValueFor=function (id) {
	var keys=this.getKeys();
	var key=keys[App5.shortId(id)];
	if (key!=null && this.model != null) {
		return App5.wrapModel(this.model).getValueForPath(this.getKeyPath(key));
	}
	return null;
}

a5_panel.prototype.setModelValueFor=function (id,value) {
	var keys=this.getKeys();
	var key=keys[App5.shortId(id)];
	if (key!=null && this.model != null) {
		App5.wrapModel(this.model).setValueForPath(key,value);
	}
}



a5_panel.prototype.render=function(arr)
{
	arr.push('<div '+App5.writeId(this,'wrapper')+' >')
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
