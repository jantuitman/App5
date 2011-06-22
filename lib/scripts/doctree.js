App5.module('doctree',function (globals) {
	
	var nodes = enrich({
	   welcome : {            children: ['overview','topic a','topic b']}
	});
	
	function addParent(nodes,nodeName,parent) {
		if (nodes[nodeName] == null) nodes[nodeName]={};
		nodes[nodeName].parent=parent;
	}
	
	function enrich(nodes) {
		for (var v in nodes) {
			if (nodes[v].children) {
				for (var i=0;i<nodes[v].children.length;i++) {
					addParent(nodes,nodes[v].children[i],v);
				}
			}
		}
		return nodes;
	}
	
	
	
	
	
	globals.getPage=function(name) {
		return nodes[name];
	}

	
	return globals;
	
});