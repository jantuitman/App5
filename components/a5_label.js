function a5_label(id)
{
	this.id=id;
	this.viewName=null; // will be set by the parser.
	this.name='a5_label';
	this.childType='#text';
	this.children=[];
	this.attributes={}; 
	this.attributeDefinitions=[ ];

}

a5_label.prototype=new App5Component();



a5_label.prototype.render=function(arr) {
	var form=this.getParentObject();
	var value=form.getModelValueFor(this.shortid);
	if (value==null) value='';
    arr.push("<span "+App5.writeId(this)+" >"+value+"</span>");
	
}
