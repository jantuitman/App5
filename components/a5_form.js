function a5_form(id)
{
	this.id=id;
	this.name='a5_form';
	this.childType='unordered';
	this.childsAllowed=['a5_input','a5_textarea'];
	this.keys={};
	this.keyPath=[];
	this.children=[];
	this.attributeDefinitions=[];
	this.attributes={}; 
    this.model=null;
}

a5_form.prototype=new App5Component();


a5_form.prototype.setModel=function(model) {
	if (this.model !=null) this.model.removeListener(this);
	this.model=model;
	this.model.addListener(this);
	for (var i=0;i<this.children.length;i++) {
		this.children[i].update();
	}

}



a5_form.prototype.setKeys=function(keys) {
	this.keys=keys;
	for (var i=0;i<this.children.length;i++) {
		this.children[i].update();
	}
}



a5_form.prototype.render=function(arr) {
	arr.push('<div style="padding-top:10px;padding-bottom:10px">')
	var width=this.getAreaObject().getInnerWidth()-40;
	arr.push('<fieldset '+App5.writeId(this.id)+' style="width:'+width+'px">');
	this.renderContents(arr);
	arr.push('</fieldset></div>');
}

a5_form.prototype.renderContents=function(arr) {
	for (var i=0;i<this.children.length;i++) {
		this.children[i].render(arr);
	}
}

a5_form.prototype.update=function () {
	if (App5.$(this.id).get(0)) {
		var el=App5.$(this.id);
		var arr=[];
		this.renderContents(arr);
		el.html(arr.join(''));
	}
}
