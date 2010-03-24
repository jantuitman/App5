function a5_input(id)
{
	this.id=id;
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
	var o=App5.$(this.id,'wrapper');
	if (App5.$(this.id).get(0)) {
		var el=App5.$(this.id);
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
	var value='';
	var keys=form.getKeys();
	var key=keys[App5.shortId(this.id)];
	if (key && form.model) {
		//console.log("keypath",form.getKeyPath(key));
		value=App5.wrapModel(form.model).getValueForPath(form.getKeyPath(key));
		//console.log(form.model,value);
	} 
	arr.push(' value="'+value+'" ');
	arr.push(App5.writeCaptureHandlers(['change','blur']));
	arr.push('/>');
}

a5_input.prototype.onchange=function () {
	var value=App5.$(this.id).get(0).value;
	var form=this.getParentObject();
	var keys=form.getKeys();
	var key=keys[App5.shortId(this.id)];
	if (key && form.model) {
		App5.wrapModel(form.model).setValueForPath(form.getKeyPath(key),value);
	} 
}

a5_input.prototype.onblur=function () {
	this.getParentObject("a5_application").placeScreenOnTop();
}
