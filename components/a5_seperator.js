function a5_seperator(id)
{
	this.id=id;
	this.viewName=null; // will be set by the parser.
	this.name='a5_seperator';
	this.childType='#text';
	this.children=[];
	this.attributes={}; 
	
}

a5_seperator.prototype=new App5Component();

a5_seperator.prototype.render=function(arr) {
}
