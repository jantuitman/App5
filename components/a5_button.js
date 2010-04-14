function a5_button(id)
{
	this.id=id;
	this.viewName=null; // will be set by the parser.
	this.name='a5_button';
	this.childType='#text';
	this.children=[];
	this.attributes={}; 
	this.attributeDefinitions=[{ name: 'label'}, { name: 'icon'} ];

}

a5_button.prototype=new App5Component();

a5_button.prototype.render=function(arr) {
	
	if (this.getAttribute("icon")!=null) {
		arr.push('<input type="button" class="iconbutton" style="background-image:url('+App5.appPath+"images/"+this.getAttribute("icon")+')" '+App5.writeId(this)+'  />')		
	}
	else {
		arr.push('<input type="button" class="button" '+App5.writeId(this)+' value="'+this.getAttribute("label")+'" />')
	
	}
}
