function a5_buttonmenu(id)
{
	this.id=id;
	this.name='a5_buttonmenu';
	this.childType='unordered';
	this.childsAllowed=['a5_button'];
	this.children=[];
	this.attributes={}; 

}

a5_buttonmenu.prototype=new App5Component();

a5_buttonmenu.prototype.render=function(arr) {

	var height=this.getParentObject("a5_application").getFontSize()+10;
	for (var i=0;i<this.children.length;i++) {
		arr.push('<div '+App5.writeId(this.id)+' style="height:'+height+'px;width:100%">');
		this.children[i].render(arr);
		arr.push('</div>');
	}
}


App5.components['a5_buttonmenu']=a5_buttonmenu;