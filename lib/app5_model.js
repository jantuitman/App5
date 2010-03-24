function App5Model()
{
	this.name=null; // set by the init method.
	this.listeners=[];
}


App5Model.prototype.getStorageName=function()
{
	return 'app5model_'+this.name;
}


// --------------- array convenience functions. only works if the data object is an array. ----------------------------

/**
	
*/
App5Model.prototype.size=function()
{
	return this.data.length;
}

App5Model.prototype.get=function(index)
{
	return this.data[index];
}

// a path is an array composed of objects and strings. 
// if a path element is a string or number the model does this.data[string/number].
// if a path element is an object with a (key,value), ???????;


App5Model.prototype.getValueForPath=function(keyPath) {
   	var o=this.data;
   	for (var i=0;i<keyPath.length;i++) {
   		if (typeof keyPath[i]=="string" || typeof keyPath[i]=="number") {
			o=o[keyPath[i]];
			if (o==null) return '';
		}	
		// do we need this?
		if (typeof keyPath[i]=="object") {
			
		}
   	}	
	return o;
}

App5Model.prototype.setValueForPath=function(keyPath,value) {
   	var o=this.data;
   	for (var i=0;i<keyPath.length-1;i++) {
   		if (typeof keyPath[i]=="string" || typeof keyPath[i]=="number") {
			o=o[keyPath[i]];
			if (o==null) return;
		}	
   	}
	o[keyPath[keyPath.length-1]]=value;
	this.update();
}


//--------------- events ---------------------------------------------------------------------------------------

App5Model.prototype.init=function(name,success,failure) {
	this.name=name;
	// TODO: add applicationname
	if (window.localStorage[this.getStorageName()]) {
		if (App5.getApplication().settings.mode!="debug") {
			this.data=eval(window.localStorage[this.getStorageName()]);
		}
	} 
	success();
}

/**
   update - saves data property to localstorage, and notifies the listeners.
*/
App5Model.prototype.update=function()
{
	if (this.name) window.localStorage[this.getStorageName()]=JSON.stringify(this.data);
	for (var i=0;i<this.listeners.length;i++) {
		this.listeners[i].update();
	}
}

App5Model.prototype.addListener=function(listener) {
	this.listeners.push(listener);
}

App5Model.prototype.removeListener=function(listener) {
	for (var i=0;i<this.listeners.length;i++) {
		if (this.listeners[i] == listener) {
			this.listeners.splice(i,1);
			break;
		}
	}
}

App5.Model=App5Model;



