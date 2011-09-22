// the big global hook on which everything hangs....
var App5 = {};

(function (App5) {


var location= 'scripts/%n.js'

// here all modules are placed.
App5.modules={};

// a status object .loaded and .callback 
var loadingInfo={};  


App5.scriptLocation=function(url) {
	location=url;
}


    // debugging.
    //TODO, turn off when production.
    var showErrors=true;
    window.addEventListener('error',function(e) {
    	if (showErrors) {
    		showErrors=confirm(e.filename+":"+e.lineno+"\n"+e.message+"\nkeep showing errors?");
    	}	
    });


function loadModule(module, dependencyChain) {

	//Check if script has already been added to the loader
	if (loadingInfo[module] != undefined)
	{
		if (loadingInfo[module].loaded) //File loaded
		{
		 	dependencyChain.resolve(module);
		}
		else //Still loading
		{
			//Add dependencyChain to list for resolving when the module is ready.
			loadingInfo[module].chains.push(dependencyChain);
		}

		//Script already requested so exit here
		return;
	}

	//Create tracker for this script to monitor status and build a list of callbacks
	loadingInfo[module] = {loaded: false, chains: [dependencyChain]};

	//Add script element to DOM and add onload handlers for callbacks
	var script = document.createElement("script")
	script.type = "text/javascript";

	var url=location.replace(/%n/,module);
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
};


function DependencyChain() {
	this.dependencies={};
}

DependencyChain.prototype.require=function() {
	return App5.require.apply(this,arguments);
}
DependencyChain.prototype.module=function() {
	return App5.module.apply(this,arguments);
}

DependencyChain.prototype.setCallback=function(callback) {
	this.callback=callback;
	this.resolve(null); // call the callback if everything is already resolved.
}

DependencyChain.prototype.resolve=function(moduleName) {
	var ready=true;
	if (moduleName !=null) this.dependencies[moduleName]='resolved';
	for (var v in this.dependencies) {
		if (this.dependencies[v]=='unresolved') {
			ready=false;
			break;
		}
	}
	if (ready && this.callback) this.callback() 
}


App5.require=function(name) {
	
	var chain;
	if (this.constructor!=DependencyChain) {
		chain=new DependencyChain();
	}
	else {
		chain=this;
	}
	chain.dependencies[name]='unresolved';
	loadModule(name,chain);
	return chain;
}	


App5.module=function(name,module) {
	
	function resolveModule(name) {
		if (window.console && window.console.log) window.console.log('module '+name+' is loaded');
		if (loadingInfo[name]==null) {
			loadingInfo[name]={ loaded: true }
			return;
		}
		
		loadingInfo[name].loaded=true;
		for (var i=0;i<loadingInfo[name].chains.length;i++) {
			loadingInfo[name].chains[i].resolve(name);
		}
	}
    
    function startModule() {
	    if (App5.modules[name]!=null ) {
			if (console && console.warn) console.warn('module '+name+' was already initialized and is defined again.');
	 	}
	    else {
			App5.modules[name]={};
		}
		
		try {
			module(App5.modules[name]);
		}
		catch(e) {
			// for more errors, schedule the "starting" of the failed module.
			// hmmm. seems to give problems because the activation record is clearead after throwing the exception.
			//window.setTimeout(function () { resolveModule(name); },100);
			throw(e);
		}
		// notify dependent modules 
	    resolveModule(name);
	}
	
	if (this.constructor==DependencyChain) {
		
		this.setCallback(startModule)
	}
	else {
		startModule();
	}	
}
	
	
	/*
	if (modules[name]==null) {
		var s=loader.location.replace(/%n/,name);
		modules[name]={};
		console.log('going to load '+s);
		$('<script src="'+s+'" type="text/javascript" ></script>').appendTo($('head'));
		console.log('loaded '+s)
		//console.log($('body').html());
	}
	else {
		// module is already loading.
		return modules[name];
    */


/* execute the module */



return App5;

})(App5);

