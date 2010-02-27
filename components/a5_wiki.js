function a5_wiki(id)
{
	this.id=id;
	this.name='a5_wiki';
	this.childType='#text';
	this.children=[];
	this.attributes={}; 
	this.editMode=false;
}


a5_wiki.prototype=new App5Component();



a5_wiki.prototype.setModel=function(model) {
	if (this.model !=null) this.model.removeListener(this);
	this.model=model;
	this.model.addListener(this);
	this.update();
}


a5_wiki.prototype.update=function()
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

a5_wiki.prototype.render=function(arr)
{
	arr.push('<div '+App5.writeId(this.id,'wrapper')+' class="app5wiki" >')
	this.renderContent(arr);
	arr.push('</div>')
}


a5_wiki.prototype.renderContent=function(arr) {

	var title='';
	var value='';
	if (this.model) {
		title=this.model.getValueForPath(this.getKeyPath('title'));
		value=this.model.getValueForPath(this.getKeyPath('text'));
	}
	arr.push('<div '+App5.writeId(this.id)+ '  style="padding-left:10px;" >');
	var value='';
	if (this.model) {
		var title=this.model.getValueForPath(this.getKeyPath('title'));
		value=this.model.getValueForPath(this.getKeyPath('text'));
		var m=new MiniText();
		value=m.process(value);
	} 
	arr.push('<h1>'+this.output(title)+'</h1>')
	arr.push(value);
	arr.push('</div>');
}
