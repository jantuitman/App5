function a5_footer(id)
{
	this.id=id;
	this.name='a5_footer';
	this.childType='unordered';
	this.childsAllowed=['a5_button','a5_seperator'];
	this.children=[];
	this.attributes={}; 

}

a5_footer.prototype=new App5Component();

a5_footer.prototype.render=function(arr) {

	//var height=this.getParentObject("a5_application").getFontSize()+10;
	var height=40;
	arr.push('<div '+App5.writeId(this)+'  class="app5barstyle" style="height:'+height+'px;">');
	var seperators=0;
	for (var i=0;i<this.children.length;i++) {
		if (this.children[i].name=="a5_seperator") {
			arr.push('<div style="float:right;">');
		    seperators++;	
		}
		this.children[i].render(arr);
	}
	for (var j=0;j<seperators;j++) {
		arr.push('</div>');
	}
	arr.push('</div>');
    arr.push('<div style="height:3000px" >&nbsp;</div>'); // height fixer. makes textarea work right on iphone.
}
