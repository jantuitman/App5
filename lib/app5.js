if (!window.console) {
	window.console={};
	window.console.log=window.console.info=window.console.debug = function () {}
	
}

function App5Global()
{
	this.applicationName='';
	this.sequence=0;
	this.views={}; // view classes (NOT instances , they are stored in the a5_application object)
	this.models={}; // model classes (NOT instances, they are stored in the a5_application object)
	this.ids={}; // for fast lookup of all instances.
	this.dirty={}; // all components that need updating.
	this.parser=new App5Parser();
	this.parser.setRootType('a5_application');
	this.application = null ; // will be set by the first controller that parses a screen, by doing a call to initApplication();
	this.components={};
	
}

App5Global.prototype.TRANSITION_GOFORWARD  = 1;
App5Global.prototype.TRANSITION_GOBACK     = 2;

// device models
App5Global.prototype.DM_IPHONE             = 1;  // iphone
App5Global.prototype.DM_BROWSER            = 2;  // generic browser.
App5Global.prototype.DM_IPAD               = 3;  // ipad.

// render styles
App5Global.prototype.RS_SMALL              = 1;  // 320x480 screens
App5Global.prototype.RS_LARGE              = 2;  // large screens.

// viewmodes
App5Global.prototype.VM_NORMAL             = 1; // non modal view, full screen.
App5Global.prototype.VM_MODAL_MENU         = 2; // menu view, modal overlay.
App5Global.prototype.VM_MODAL_DIALOG       = 3; // dialog view, modal overlay.
App5Global.prototype.VM_SIDEBAR            = 4; // used when sidebar changes are put on the viewstack.

App5Global.prototype.URI='http://www.tuitman.org/app5';  // uri needed in the xml

App5Global.prototype.getApplication=function() {
	return this.application;
}



App5Global.prototype.corePath="../../" ; // path from index.html to the app5 root.
App5Global.prototype.appPath="" ; //   path from index.html to the application root.
 

App5Global.prototype.error=function(msg) {
	if (console != null) console.log(msg);
	var s='a'+'lert(msg)'; // to prevent search to alerts to find this line. handy to remove debug alerts.
	eval(s);
}


App5Global.prototype.Controller=function(name,extensionObject) {
	var o=new App5Controller(name);
	for(var v in extensionObject) {
		o[v]=extensionObject[v];
	}
	//console.log("loaded controller "+name)
	this.application.addController(name,o);
}

/**
	returns the instance of the model.
	there are two styles of models: factory and singleton.
	
	a factory model allways returns a new model and passes param in.
	a singleton model allways returns the same object once loaded.
*/
App5Global.prototype.getModel=function(name,param) {
	if (App5.models[name].prototype && App5.models[name].prototype.modelType=="factory") {
	   return new App5.models[name](param); 	
	}
	else {
		return this.application.models[name];
	}
}

// id stuff


/* is proxied by controller - for viewName
   see controller.getComponent(shordId);
 */
App5Global.prototype.getComponent=function(viewName,shortId) {
	return this.ids['app5_'+this.applicationName+'_'+viewName+'_'+shortId]
	//return this.ids['app5id_'+this.applicationName+'_'+shortId];
}

 
App5Global.prototype.genId=function(viewName,shortId) {
	
	if (shortId) {
		return 'app5_'+this.applicationName+'_'+viewName+'_'+shortId ;
	}
	this.sequence++;
	return 'app5_'+this.applicationName+'_'+viewName+'_'+this.sequence ;
}


App5Global.prototype.writeId=function(component,suffix,skipAttribute) {
	// id already contains app5_<applicationName>_<viewName>_<shortId>
	// added must be the <subId> and the suffix.
	var s=component.id
		+'_'+(component.subid?component.subid:'');
	if (suffix!=null) s+="_"+suffix;
	if (skipAttribute) return s;
	return ' id="'+s+'" '
}

App5Global.prototype.writeCaptureHandlers=function(arrEvents) {
	var s='';
	for (var i=0;i<arrEvents.length;i++) {
		s+=' on'+arrEvents[i]+'="App5.captureEvent(event)" '
	}
	return s;
}


App5Global.prototype.handleEvent=function(evt)
{
	this.application.handleEvent(evt);
	this.processUpdates();
}

App5Global.prototype.captureEvent=function(evt) {
	this.application.captureEvent(evt);
	this.processUpdates();
}


App5Global.prototype.processUpdates=function()
{
   while (true) {
      var v=null;
      // get the first dirty component.
      for (v in this.dirty) {
	     break;
      }	
	  // nothing left?
	  if (v==null) break;
      
      var component=this.ids[v];
      component.update(); 	
	
	  // force updated if children did not notify.
	  if (this.dirty[v]) this.markUpdated(component); 
    	
   }
}

App5Global.prototype.markUpdate=function(component) {
   console.log("marking for update ");	
   this.dirty[component.id]=true;	
}

App5Global.prototype.markUpdated=function(component) {
   delete this.dirty[component.id];	
	
}


App5Global.prototype.$=function(component,suffix) {
	var s=('#'+component.id
	        +'_'+(component.subid?component.subid:'')+(suffix==null?'':('_'+suffix) ) );
	console.log("getting "+s);
	if ($(s).get(0)==null) {
		//alert("cannot fetch "+s);
		//debugger;
	}
	return $(s);
}



App5Global.prototype.pushView=function(viewName,data) {
	this.application.pushView(viewName,data);
}

App5Global.prototype.navigateSidebar=function(title,data) {
	this.application.navigateSidebar(title,data);
}



App5Global.prototype.popView=function() {
	this.application.popView();
}

App5Global.prototype.loadModel=function(name,success,failure) {
    this.application.loadModel(name,success,failure);	
}


App5Global.prototype.wrapModel=function(model) {
	// if model is a true model, it is returned.
	// if it is just a plain json object, it is wrapped inside a model and returned.
	if (model.getValueForPath) return model;
	var modelWrapper=new App5.Model();
	modelWrapper.data=model;
	return modelWrapper;
	
}




App5Global.prototype.runApplication=function(applicationName,viewName,settings) {
	
	var self=this;
	this.applicationName=applicationName;
	this.parser.parse(null,'<a5_application xmlns="'+this.URI+'" />',
		function (application) {
			self.application=application;
			//console.log("Loaded application",application.children[0]);
			application.init(applicationName,settings);
			self.application.pushView(viewName,null,App5.VM_NORMAL);
		},
		function (message) { alert("failure to start application! \n"+message) },
		new App5Document(['a5_application'])
	)
}

App5Global.prototype.getGlobalParser=function() {
	return this.parser;
}

window.App5=new App5Global();