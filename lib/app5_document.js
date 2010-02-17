function App5Document(arrAllowedContent)
{
	this.arrAllowedContent=arrAllowedContent;
	this.children=[];
}

App5Document.prototype.canHaveChild=function(nodeName) {
	for (var i=0;i<this.arrAllowedContent.length;i++) {
		if (this.arrAllowedContent[i]==nodeName) return { success: true };
	}
	var s='expecting one of ('+this.arrAllowedContent.join(",")+')';
	return { success: 'false', errorText: s }
}

App5Document.prototype.addChild=function(child) {
	this.children.push(child)
}