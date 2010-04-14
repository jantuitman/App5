function a5_input(id)
{
	this.id=id;
	this.viewName=null; // will be set by the parser.
	this.name='a5_input';
	this.childType='unordered';
	this.childsAllowed=[];
	this.keys={};
	this.children=[];
	this.attributeDefinitions=[{ name: 'label'}];
	this.attributes={}; 
}

a5_input.prototype=new App5Component();

a5_input.prototype.render=function(arr)
{
	arr.push('<div '+App5.writeId(this,'wrapper')+' >')
	this.renderContent(arr);
	arr.push('</div>')
}

a5_input.prototype.update=function()
{
	var o=App5.$(this,'wrapper');
	if (App5.$(this).get(0)) {
		var el=App5.$(this);
		var arr=[];
		this.renderContent(arr);
		//console.log("updating",el,arr);
		o.html(arr.join(''));
	}
}

a5_input.prototype.renderContent=function(arr) {
	var form=this.getParentObject();
	arr.push('<label for="'+App5.writeId(this,null,true)+'" >')
	arr.push(this.attributes['label']);
	arr.push('</label>');
	arr.push('<input type="text" '+App5.writeId(this));
	var value=form.getModelValueFor(this.shortid);
	if (value==null) value='';
	arr.push(' value="'+value+'" ');
	arr.push(App5.writeCaptureHandlers(['change','blur']));
	arr.push('/>');
}

a5_input.prototype.onchange=function () {
	var value=App5.$(this).get(0).value;
	var form=this.getParentObject();
	form.setModelValueFor(this.shortid,value);
}

a5_input.prototype.onblur=function () {
	this.getParentObject("a5_application").placeScreenOnTop();
}
