function a5_button(id)
{
	this.id=id;
	this.name='a5_button';
	this.childType='#text';
	this.children=[];
	this.attributes={}; 
	this.attributeDefinitions=[{ name: 'label'} ];

}

a5_button.prototype=new App5Component();

a5_button.prototype.render=function(arr) {
	
	arr.push('<input type="button" class="button" '+App5.writeId(this.id)+' value="'+this.getAttribute("label")+'" />')
}
