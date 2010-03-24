function a5_label(id)
{
	this.id=id;
	this.name='a5_label';
	this.childType='#text';
	this.children=[];
	this.attributes={}; 
	this.attributeDefinitions=[ ];

}

a5_label.prototype=new App5Component();



a5_label.prototype.render=function(arr) {
	var form=this.getParentObject();
	
	var keys=form.getKeys();
	var key='';
	console.log("keys is ",keys);
	if (keys!=null) {
		key=keys[App5.shortId(this.id)];
	}
	var value='';
	if (key && form.model) {
		value=App5.wrapModel(form.model).getValueForPath([ key ]);
	}
	 arr.push("<span "+App5.writeId(this)+" >"+value+"</span>");
	
}
