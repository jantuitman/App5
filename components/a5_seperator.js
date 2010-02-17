function a5_seperator(id)
{
	this.id=id;
	this.name='a5_seperator';
	this.childType='#text';
	this.children=[];
	this.attributes={}; 
	
}

a5_seperator.prototype=new App5Component();

a5_seperator.prototype.render=function(arr) {
}

App5.components['a5_seperator']=a5_seperator;
