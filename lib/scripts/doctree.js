App5.module('doctree',function (globals) {
	
	var nodes = enrich({
	   'welcome.txt' : {            children: ['overview','a.txt','topic b']},
	   'a.txt' : {   children: ['topic d','topic e']}
	});
	
	function addParent(nodes,nodeName,parent) {
		if (nodes[nodeName] == null) nodes[nodeName]={ children:[] };
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