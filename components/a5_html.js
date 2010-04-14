function a5_html(id)
{
	this.id=id;
	this.viewName=null; // will be set by the parser.
	this.name='a5_html';
	this.childType='untyped';
	this.children=[];
	this.attributes={}; 

}

a5_html.prototype=new App5Component();

a5_html.prototype.render=function(arr) {
	if (this.children.length) {
		arr.push(this.children[0].toString());
	}
}
