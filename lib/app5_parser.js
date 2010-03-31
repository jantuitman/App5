function App5Parser()
{
	this.componentClasses={};
	this.componentList={  arr:[] };
}


/** 
   sets the root type that is used by this parser. A root type is a node above the documentElement
   because it controls which documentElement is allowed.
*/
App5Parser.prototype.setRootType=function(string) {
  this.rootType=string;
}

/**
  parses the string and adds the objects found as children  to object root.
  calls success or failure afterwards.
*/
App5Parser.prototype.parse=function(string,success,failure,root)
{
	var self=this;
	var xmlParser=new DOMParser();
	var xmlDoc = xmlParser.parseFromString(string, "text/xml");
	var el=xmlDoc.documentElement;
	var componentList={  arr:[] };
	componentList['a5_fragment']=1;
	componentList.arr.push({ name:'a5_fragment', uri: App5.URI });
	
	this.scanForComponents(el,componentList);
	this.loadComponents(componentList,function () {
		var su=false;
		try
		{
			self.parseElement(el, root);
			su=true;
		}
		catch(e)
		{
			failure(e.message)
		}
		// return the last parsed element.
		if (su) success(root.children[root.children.length-1]);
	},failure);
}

App5Parser.prototype.scanForComponents=function(element,componentList)
{
	if(element.nodeType==1 && !componentList[element.nodeName]) {
		componentList[element.nodeName]=1;
		componentList.arr.push({ name: element.nodeName, uri: element.namespaceURI });
	}
	for (var i=0;i<element.childNodes.length;i++) {
		this.scanForComponents(element.childNodes[i],componentList);
	}
}

App5Parser.prototype.loadComponents=function(componentList,z,failure) {
	var self=this;
	if (componentList.arr.length==0) {
		z() ;
	}
	else {
	var componentObj=componentList.arr.shift();
	
	var component=this.pureName(componentObj.name);
	var url;
	if (componentObj.uri==App5.URI) {
		url= App5.corePath+'components/'+component+'.js';
	}
	else {
		url= App5.appPath+'components/'+component+'.js';
	}
	console.log("loading component "+component+" at url: "+url);

	if (self.componentClasses[component]) {
		self.loadComponents(componentList,z,failure);
	}
	else {
			jQuery.ajax( {
				url: url,
				type: "get",
				success: function(t) {
					try {
						eval('( function (App5) {\n'+t+'\nApp5.components["'+component+'"]='+component+ '; \n} ) (App5)');
					}
					catch(e) {
						App5.error("error in loading component "+component+" : "+e.message);
					}
					self.componentClasses[component]=App5.components[component];
					//window[component];
					self.loadComponents(componentList,z,failure);
				},
				error: function () {
					failure("could not load component "+component);
				}
			});
		}
	}
}

App5Parser.prototype.pureName=function(string) {
	if (string.indexOf(":")>=0) return string.substr(string.indexOf(":")+1,string.length);
	return string;
}

App5Parser.prototype.parseElement=function(element,parent)
{
	var status=parent.canHaveChild(element.nodeName);
	if (status.success){
		if (element.nodeType==1) {
			if (this.componentClasses[this.pureName(element.nodeName)])  {
				var id=element.getAttribute("id");
				id=App5.genId(id);

				var f=this.componentClasses[this.pureName(element.nodeName)];
				var obj=new f(id);
				obj.parent=parent;

				this.parseElementList(element.childNodes,obj);
				parent.addChild(obj);
				App5.ids[id]=obj;
				
				
				// attributes
				if (obj.attributeDefinitions) {
					for (var i=0;i<obj.attributeDefinitions.length;i++) {
						var def=obj.attributeDefinitions[i];
						if (element.getAttribute(def.name)) {
							obj.attributes[def.name]=element.getAttribute(def.name);
						}
					}
				}
				
				
			}
		}
		else {
			// html or text, if the last child is already a5_fragment add content to that child.
			if (parent.children.length>0 && parent.children[parent.children.length-1].name=="a5_fragment") {
				parent.children[parent.children.length-1].addElement(element);
			}
			else {
				var f=this.componentClasses["a5_fragment"];
				var id=App5.genId();
				var fragment=new f(id);
				parent.addChild(fragment);
				fragment.addElement(element);
			}
		}
	}
	else {
		throw new Error("element "+element.nodeName+" is not allowed in context of parent component "+parent.name+": "+status.errorText);
	}
}

App5Parser.prototype.parseElementList=function(list,parent)
{
	for(var i=0;i<list.length;i++) {
		if (parent.ignoreWhiteSpace() && list[i].nodeName=='#text' && list[i].nodeValue.match(/^[ \t\n]*$/)) {
		    //ignore white space.	
		}
		else {
			this.parseElement(list[i],parent);
		}	
	}
}


