function App5Component()
{
	this.id=null;
	this.name='*unnamed class*';
	this.childType='sequence'; // values are 
	                           //         sequence (childsAllowed contains the nodenames expected, some marked as optional)
	                           //         untyped (parent can have only a5_fragment as child)
                               //         unordered (childsAllowed contains multiple alternatives)
							   //         #text   (will add a5_fragment of type text);  
							   // note:
							   //    .validateCompleteness must check the cardinality of the children.
	
	this.childsAllowed=[]; // fill this in in the descendant to allow childnodes.
	this.attributeDefinitions=[]; // fill this in in the descendant to allow attributes.
}

//--------------------------  metadata secion ----------------

/**
  this function returns { success: true } if a child node with name string can be added as last child.
  else it returns { success: false, errorText: message }.
  
  Todo: for a designer it would be nice to have a function .getPossibleChildren();
*/
App5Component.prototype.canHaveChild=function(string) {
	if (this.childType=="sequence") {
		if (this.children.length>=this.childsAllowed.length) return { success: false, errorText: "node already has all children."};
		var index=0;
		for (var i=0;i<this.children.length;i++) {
			while (this.children[i].name!=this.childsAllowed[index] && this.children[i].name + '?' != this.childsAllowed[index]){
				index++;
				if (index>100 ) {
					debugger;
					return;
				}
			}
			// so for the next child we expect...
			index=index+1;
		}
		// skip unmatched optional childsAllowed.
		var list=[];
		while(string!=this.childsAllowed[index] && string+'?' != this.childsAllowed[index] 
		         && (""+this.childsAllowed[index]).substr(-1,1)=="?" ) {
			list.push(this.childsAllowed[index]);
			index=index+1;
		}
		if (string==this.childsAllowed[index] || string+'?' == this.childsAllowed[index] ) return { success: true, errorText: '' };
		list.push(this.childsAllowed[index]);
		return { success: false, errorText: "expecting ("+list.join(",")+")"}
	}
	if (this.childType=="untyped") {
		if (string=="#text" || !string.match(/^a5_/) ) {
			return { success: true }
		}
		else  {
			return { success: false , errorText: "untyped fragment expected"};
		}
	}
	if (this.childType=="#text") {
		if (string=="#text" ) {
			return { success: true }
		}
		else  {
			return { success: false , errorText: "textnode expected"};
		}
	}
	if (this.childType=="unordered") {
		for (var index=0;index<this.childsAllowed.length; index++) {
			if (string== this.childsAllowed[index] || string + '?' == this.childsAllowed[index]) return { success: true};	
		}
		return { success: false, errorText: "expecting ("+this.childsAllowed.join(",")+")"}
	}
}


App5Component.prototype.ignoreWhiteSpace=function()
{
	return (this.childType=='sequence' || this.childType=='unordered')
}

App5Component.prototype.validateCompleteness=function()
{
	// unimplemented for now.
	return true;
}


// attributes
App5Component.prototype.getAttribute=function (name) {
	return this.attributes[name];
}

// attributes
App5Component.prototype.setAttribute=function (name,value) {
	this.attributes[name]=value;
	this.update();
}


// keyPath for access in the model.
App5Component.prototype.getKeyPath=function() {
	var params=Array.prototype.slice.call(arguments);
	if (this.keyPath==null) return params ;
	var arr=[];
	for (var i=0;i<this.keyPath.length;i++) {
		arr.push(this.keyPath[i]);
	}
	for (var i=0;i<params.length;i++) {
		arr.push(params[i]);
	}
	return arr;
}

App5Component.prototype.setKeyPath=function(keyPath) {
	this.keyPath=keyPath;
	this.update();
}


App5Component.prototype.setModel=function(model) {
	//this.model=model;
	if (this.model !=null && this.model.removeListener) this.model.removeListener(this);
	this.model=model;
	if (this.model !=null && this.model.addListener) this.model.addListener(this);
	// TODO: schedule update.
	//this.update();
}



/**

  adds a child node.  

*/
App5Component.prototype.addChild=function(child) {
	this.children.push(child)
}




/**

searches for child with the specified name. The search level is just 1 deep, so grandchilds are not returned. Returns null if object could not be found.
*/
App5Component.prototype.getChildObject=function(name) {
	for (var i=0;i<this.children.length;i++) {
		if (this.children[i].name==name) return this.children[i];
	}
	return null;
}

/**

searches for a parent (or grandparent...) with the specified name. Returns null if object could not be found.

*/
App5Component.prototype.getParentObject=function(name) {
	var o=this.parent;
	if (name==null) return o;
	while (o != null && o.name != name) o=o.parent;
	return o;
}

/**
  returns the first parent that defines widths and heights.
*/
App5Component.prototype.getAreaObject=function() {
	var o=this.parent;
	while (o != null && !o.isAreaObject) o=o.parent;
	return o;
}



App5Component.prototype.sendEventToController=function(eventName,data) {
	var o=this.getParentObject("a5_screen");
	if (o && o.controller) {
		var shortId=App5.shortId(this.id);
		if (o.controller['on'+eventName+'_'+shortId]) {
			o.controller['on'+eventName+'_'+shortId](data);
		}
	}
}


App5Component.prototype.detach=function() {
	if (this.model) this.model.removeListener(this);
}

App5Component.prototype.clone=function(subId) {
	var shortId=App5.shortId(this.id);
	var o=new App5.components[this.name](App5.genId(shortId));
	o.subid=subId;
	for (var v in this.attributes) {
		// TODO: clone attributes?
		o.attributes[v]=this.attributes[v];
	}
	o.parent=this.parent;
	for (var j=0;j<this.children.length;j++) {
		o.children[j]=this.children[j].clone(subId);
		o.children[j].parent=o;
	}
	return o;
}


//-------------------------- html rendering ------------------

/**
   pushes html content for this componennt into the array

*/
App5Component.prototype.render=function(arr)
{
	arr.push('<div id="'+this.id+'">'+this.name+' has no render function yet</div>');
}

/**
   updates a component that is already on the screen. the component should take care of its own id's
   and find back it's own html elements.

*/
App5Component.prototype.update=function()
{
	$('#'+this.id).html(this.name+" has no update function yet.");
}


App5Component.prototype.output=function(s) {
	if (s==null) return '';
	s=(''+s).replace(/&/,'&amp;').replace(/</g,'&lt;').replace(/>/,'&gt;');
	return s;
}
