App5.module('doctree',function (globals) {
	
	var nodes = enrich({
	   'welcome.txt' : 		{   name: 'welcome'		,  children: ['helloworld.txt','modules.txt','layout.txt','controller.txt','templates.txt', 'tools.txt']},
	   'helloworld.txt' : 		{   name: 'hello world'		, children: []},
	   'modules.txt' : 		{   name: 'modules'		, children: []},
	   'layout.txt' : 		{   name: 'layout'		, children: []},
	   'controller.txt' : 	{	name: 'controller'	, children: []},
	   'templates.txt' : 	{	name: 'templates'	, children: []},
	   'tools.txt' : 	{	name: 'tools'	, children: []},
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
