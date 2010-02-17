function App5Global()
{
	this.applicationName='';
	this.sequence=0;
	this.views={}; // view classes (NOT instances , they are stored in the a5_application object)
	this.models={}; // model classes (NOT instances, they are stored in the a5_application object)
	this.ids={}; // for fast lookup of all instances.
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

// render styles
App5Global.prototype.RS_SMALL              = 1;  // 320x480 screens
App5Global.prototype.RS_LARGE              = 2;  // large screens.

// viewmodes
App5Global.prototype.VM_NORMAL             = 1; // non modal view, full screen.
App5Global.prototype.VM_MODAL_MENU         = 2; // menu view, modal overlay.
App5Global.prototype.VM_MODAL_DIALOG       = 3; // dialog view, modal overlay.



App5Global.prototype.getApplication=function() {
	return this.application;
}


App5Global.prototype.Controller=function(name,extensionObject) {
	var o=new App5Controller(name);
	for(var v in extensionObject) {
		o[v]=extensionObject[v];
	}
	console.log("loaded controller "+name)
	this.application.addController(name,o);
}

/**
	returns the instance of the model
*/
App5Global.prototype.getModel=function(name) {
	return this.application.models[name];
}

// id stuff

App5Global.prototype.get=function(name) {
	return this.ids['app5id_'+this.applicationName+'_'+name];
}
 
App5Global.prototype.genId=function(name) {
	
	if (name) {
		return 'app5id_'+this.applicationName+'_'+name ;
	}
	this.sequence++;
	return 'app5id_'+this.applicationName+'_'+this.sequence ;
}

App5Global.prototype.shortId=function(longid) {
	var s='app5id_'+this.applicationName+'_';
	if (longid.indexOf(s)==0) {
		return longid.substr(s.length,longid.length);
	}
	else {
		return longid;
	}
}

App5Global.prototype.writeId=function(id,suffix,skipAttribute) {
	var s=id+'_xAPP5x_';
	if (suffix) s+=suffix;
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
}

App5Global.prototype.captureEvent=function(evt) {
	this.application.captureEvent(evt);
}

App5Global.prototype.$=function(id,suffix) {
	return $('#'+id+'_xAPP5x_'+(suffix==null?'':suffix));
}



App5Global.prototype.pushView=function(viewName,data) {
	this.application.pushView(viewName,data);
}

App5Global.prototype.popView=function() {
	this.application.popView();
}

App5Global.prototype.loadModel=function(name,success,failure) {
    this.application.loadModel(name,success,failure);	
}


App5Global.prototype.runApplication=function(applicationName,viewName,settings) {
	
	var self=this;
	this.applicationName=applicationName;
	this.parser.parse('<a5_application/>',
		function (application) {
			self.application=application;
			console.log("Loaded application",application.children[0]);
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