function a5_application()
{
  this.name='a5_application';
  this.viewName=null; // will be set by the parser.
  this.childType='unordered';	
  this.childsAllowed=['a5_screen'];
  this.children=[];  
  this.currentView='';

  this.applicationName=null;
  this.views={};   // instances of App5Controller loaded with view (xml/html).
  this.models={}; // instances of App5Model
  this.viewStack=[];  	
}

a5_application.prototype=new App5Component();

a5_application.prototype.init=function(applicationName,settings){

  //console.log("INIT CALLED "+applicationName);
  var self=this;
  this.applicationName=applicationName;	
  this.settings=settings;


  // device model and renderingStyle.
  if (navigator.userAgent.indexOf("iPhone")>=0) {
	 this.deviceModel=App5.DM_IPHONE;
	 this.renderStyle=App5.RS_SMALL;
     $('body').get(0).addEventListener('orientationchange', function ()  { self.resize(); })	;
  }
  else if (navigator.userAgent.indexOf("iPad")>=0 ) {
	 this.deviceModel=App5.DM_IPAD;
	 this.renderStyle=this.settings.renderStyle;
     $('body').get(0).addEventListener('orientationchange', function ()  { self.resize(); })	;
  }
  else {
	 this.deviceModel=App5.DM_BROWSER;
	 this.renderStyle=this.settings.renderStyle;
     
	  $(window).resize(function (evt) {
	    self.resize();

	  });	
  }
  
  this.generateStyleSheet();
  

  // initial call to get window sizes and render for first time.
  this.resize();
	
}


a5_application.prototype.generateStyleSheet=function() {
	var arr=[];
	var self=this;
	arr.push('<style id="app5stylesheet" type="text/css">')
	var processStyle=function(text) {
		 
	    text=text.replace(/\[(.*?)\]/g,function (str,p1) { return self.settings.layout[p1];  })
		arr.push(text);
	    //inserting basic stylesheet
		arr.push('</style>');
	    $('head').append(arr.join(''));
	}
	$.ajax({
	  url: App5.appPath+'style/app5.css',
	  responseType: 'text',
	  	success: function(txt) {
			if (txt=='' || txt==null) {
				$.ajax({ 
				  url: App5.corePath+'style/app5.css',
				  responseType: 'text',
				  success: processStyle,
				  error: function (a1,a2,a3) {
					
				  } 
				});
			}
			else processStyle(txt);
		
     	},
		error: function() {
			$.ajax({ 
			  url: App5.corePath+'style/app5.css',
			  responseType: 'text',
			  success: processStyle
			});
		}
	}
	)
}

a5_application.prototype.getFontSize=function() {
	return 22;
}

/**
  this hides the safara adress bar and scrolls the window to the top.
  must be called on initial rendering and everytime when the iphone keyboard is hidden (onblur of form elements)
*/
a5_application.prototype.placeScreenOnTop=function()
{
    if (this.deviceModel==App5.DM_IPHONE || this.deviceModel==App5.DM_IPAD ) {
		window.setTimeout(function () { 
			window.scrollTo(0,0);

	    },50)
	}
	
}


a5_application.prototype.resize=function(){

     if (this.deviceModel==App5.DM_IPHONE) {
	    // 1. find out orientation
	    var orientation = $(window).width()==320?"portrait":"landscape" ;
	    // compare
	    if (this.orientation != orientation) {
            // in portrait, we can have at least 416 pixels (=480 - bottom bar - address bar)
            // in landscape it is 268.
            var minHeight= orientation=="portrait"?416:268;	
			this.windowWidth=$(window).width();
			this.windowHeight=Math.max($(window).height(),minHeight)
			this.orientation=orientation
		}
		else return;
	 }
	else if (this.deviceModel==App5.DM_IPAD) {
	    // 1. find out orientation
	    var orientation = $(window).width()==1024?"portrait":"landscape" ;
	    // compare
	    if (this.orientation != orientation) {
            var minHeight= orientation=="portrait"?1:1;	
			this.windowWidth=$(window).width();
			this.windowHeight=Math.max($(window).height(),minHeight)
			this.sidebarWidth=240; // TODO...?
			this.orientation=orientation
		}
		else return;
	}
	else {
		this.orientation="portrait";
		this.windowWidth=520;
		this.windowHeight=350;
		this.sidebarWidth=200;
	    //console.log("windowsizes",$(window).width(),$(window).height());
	    var selectedSize=-1;
	    for (var i=0; i<this.settings.preferred_sizes.length;i++) {
		    //alert(""+$(window).width()+" , "+$(window).height())
			if ($(window).width() >= this.settings.preferred_sizes[i].minX && 
				$(window).height() >= this.settings.preferred_sizes[i].minY) {
					selectedSize=i;
				} 
		}
		if (selectedSize>=0) {
			this.windowWidth=this.settings.preferred_sizes[selectedSize].width;
			this.windowHeight=this.settings.preferred_sizes[selectedSize].height;
			this.sidebarWidth=this.settings.preferred_sizes[selectedSize].sidebar;
		}
		
	
	} 
    
    this.bodyHeight=this.windowHeight-2*(40);    
    this.isDirty=true;
    var self=this;
    
    // render immediately on iphone. on browser, whait a while to improve performance of resizing.
    if (this.deviceModel==App5.DM_IPHONE || this.deviceModel==App5.DM_IPAD) {
	   this.render();
	   self.placeScreenOnTop();
		App5.processUpdates();
    }
    else {
	    window.setTimeout(function () {
		    if (!self.isDirty) return;
			self.render();
			self.placeScreenOnTop();
			self.isDirty=false;	
			App5.processUpdates();
	    },50);
    } 	 
	    
}


a5_application.prototype.render=function()
{
    if (!this.hasRendered) {
		this.initFirstRendering();
	}
	if (this.currentView !='') {
		this.views[this.currentView].render(true);
	} 	

    // resize.
    if (this.deviceModel != App5.DM_IPHONE && this.deviceModel != App5.DM_IPAD) {
	       var width=this.windowWidth;
	       var height=this.windowHeight;
		   var top=Math.max( ( $(window).height()-height )/2, 10);
		   var left=Math.max( ( $(window).width()-width )/2 , 10) ;
		   $('#app5application').css(
				{ 
					position: "absolute", 
					width: width+"px", 
					height: height+"px",
					left: left+"px",
					top: top+"px",
					overflow: 'hidden'
				}
			)
	}		
    this.hasRendered=true;
}




a5_application.prototype.initFirstRendering=function() {
	    
    if (this.deviceModel==App5.DM_IPHONE || this.deviceModel==App5.DM_IPAD) {
	   	$('body').html('<div id="app5application" />')
		$('body').get(0).addEventListener('touchmove',this,false)
		$('body').get(0).addEventListener('touchstart',this,false)
		$('body').get(0).addEventListener('touchend',this,false)
	    $('body').get(0).addEventListener('click',this,false)
    }
    else {
	   var width=this.windowWidth;
	   var height=this.windowHeight; // = 480 -20px (battery status area) - 44 px ( bottom button bar of safari)
	   var top=( $(window).height()-height )/2;
	   var left=( $(window).width()-width )/2;
		$("body").html('<div id="app5application" />')
		// register global event handlers.
		$('body').get(0).addEventListener('click',this,false)
    }
	
}


/********** eventHandler ******************/

/**
   handleEvent handles events that fire on their original targets
   and have bubbled up to the global event handlers.
*/
a5_application.prototype.handleEvent=function(e) {
    
    var s;
    if (e.target) {
	   // sometimes in firefox the originalTarget is a chrome element (if for instance an input was clicked.)
	   // trying to get the id will throw an error at that point.
	   	try {
	   		s=e.target.id;
	   	}
		catch(e) {
			s=null;
		}
    }
   	if (e.srcElement) {
	   s=e.srcElement.id;
    }
    if (s) return this.dispatchEventForId(e,s);
}

/**
   captureEvent handles events that have been explicitly captured at a
   specific targetElement. The id relevant is the id of the target element,
   not the id of the original source element.
*/
a5_application.prototype.captureEvent=function(e) {
    var s=null;
    if (e.currentTarget) {
	   s=e.currentTarget.id;
    }
	if (e.type=='touchstart') {
		console.log("touch event :"+s);
	}
    if (s) return this.dispatchEventForId(e,s);
}

a5_application.prototype.dispatchEventForId=function(e,s) {

   if (s.indexOf("app5_")==0) {
	    // parse the id.
	 
		var rest=s.substr(5,s.length);
		var applicationId=rest.substr(0,rest.indexOf("_"));
		rest=rest.substr(rest.indexOf("_")+1,rest.length);
		var viewName=rest.substr(0,rest.indexOf("_"));
		rest=rest.substr(rest.indexOf("_")+1,rest.length);
		var componentId=rest.substr(0,rest.indexOf("_"));
		rest=rest.substr(rest.indexOf("_")+1,rest.length);
		var subId='';
		var suffix='';
		var shortSuffix='';
		var suffixRest='';
		// suffix is not allways there.
		if (rest.indexOf("_")>=0) {
			subId=rest.substr(0,rest.indexOf("_"));
			suffix=rest.substr(rest.indexOf("_")+1,rest.length);
			if (suffix.indexOf("_")>=0) {
				shortSuffix=suffix.substr(0,suffix.indexOf("_"));
				suffixRest=suffix.substr(suffix.indexOf("_")+1,suffix.length);
			}
			else {
				shortSuffix=suffix;
			}
    	}
		else {
			subId=rest;
		}
		
		// now fire event.
		console.log("Event handling "+applicationId+" "+viewName+" "+componentId+" "+subId);
		var app5Id='app5_'+applicationId+'_'+viewName+'_'+componentId+(subId==''?'':'_'+subId);
		if (App5.ids[app5Id]) {
			var eventType=e.type;
			if (eventType=="touchstart") eventType="click";
			var restOfName=(shortSuffix==''?'':'_'+shortSuffix)
			console.log("restOfName "+restOfName)
			if (App5.ids[app5Id]['on'+eventType+restOfName]) {
				App5.ids[app5Id]['on'+eventType+restOfName](e,subId,suffixRest);
			}
			else {
				console.log("looking on controller: "+'on'+eventType+'_'+componentId+restOfName);
				var controller=this.views[this.currentView];
				if (controller != null && controller['on'+eventType+'_'+componentId+restOfName]) {
					controller['on'+eventType+'_'+componentId+restOfName](e,subId,suffixRest);
				}
				
			}
			
			// after an event is been handled, there might be updates in the queue.
	        App5.processUpdates();
		}
		else {
			console.log(" component does not exist: "+app5Id);
		}
   }
   else return true;

}

/********** views/controllers *************/

a5_application.prototype.navigateSidebar=function(viewName,data) {

	this.viewStack.push( { viewName: viewName, data: data, viewMode: App5.VM_SIDEBAR });
	if (this.views[this.currentView] && this.views[this.currentView].onsidebarnavigate){
		this.views[this.currentView].onsidebarnavigate(data);
		this.views[this.currentView].component.getChildObject("a5_sidebar").update();
	}
}



a5_application.prototype.pushView=function(viewName,data,viewMode) {
	if (!viewMode) viewMode=App5.VM_NORMAL;
	this.viewStack.push( { viewName: viewName, data: data, viewMode: viewMode });
	this.showView(viewName,data,App5.TRANSITION_GOFORWARD) ;
}

a5_application.prototype.popView=function() {
	if (this.viewStack.length > 1 ) {
		var currentView=this.viewStack.pop();
		if (currentView.viewMode==App5.VM_SIDEBAR) {
			var previousView=this.viewStack[this.viewStack.length-1];
			if (previousView.viewMode==App5.VM_SIDEBAR) {
				this.views[this.currentView].onsidebarnavigate(previousView.data);
			}
			else {
				this.views[this.currentView].onsidebarnavigate(null);
			}
			this.views[this.currentView].component.getChildObject("a5_sidebar").update();
		}
		else {
			var previousView=this.viewStack[this.viewStack.length-1];
			if (previousView.viewMode==App5.VM_NORMAL) {
				this.showView(previousView.viewName,previousView.data,App5.TRANSITION_GOBACK);
			}
		}
	}
}


a5_application.prototype.showView=function(viewName,data,transition) {
    
    var self=this;
	var resourceSuffix='';
	if (this.renderStyle==App5.RS_LARGE) resourceSuffix='_large';
    
	if (this.views[viewName]) {
		this.views[viewName].activate(data,transition);
		self.currentView=viewName;
		self.placeScreenOnTop();
	}
	else
	{
		$.ajax({
			url: App5.appPath+'views/'+viewName+resourceSuffix+'.xml',
			type: 'get',
			responseType: 'text',
			success: function(txt) {
				if (txt.documentElement) {
				    var s=(new XMLSerializer()).serializeToString(txt);	
					txt=s
				}				
				$.ajax({
					url: App5.appPath+'controllers/'+viewName+resourceSuffix+'.js',
					type: 'get',
					success: function (t) {
						
						try
						{
							eval('( function (App5) { \n'+t+'\n} )(App5)');
						}
						catch(e) {
							App5.error('error in controller:\n'+e.message);	
						}
						
						// so now we can initialise the controller with the view text.
						self.views[viewName].init(txt, function () {
							self.views[viewName].activate(data,transition,location);
							self.currentView=viewName;
							// after a view is loaded a processUpdates is needed.
							// because this is an asynchronous process and the updates for the event that triggered
							// this may already be processed. 
							App5.processUpdates();
							self.placeScreenOnTop();
						},
						function (errorText) { 
							console.error(errorText);
						});
					},
					error: function () {
						//console.log('cannot load controllers/'+viewName+'.js')
					}
				})
			},
			error: function () {
				//console.log('cannot load views/'+viewName+'.html')
			}
		})
	}
}

a5_application.prototype.animateScreen=function(component,transition) {
	
	// TODO: add different transitions.
	if (this.currentScreen != null && App5.$(this.currentScreen).get(0)) {
		var self=this;
		var previousScreen=this.currentScreen;
		App5.$(this.currentScreen).animate({'left':'-=320px'},'fast');
		
		if (this.currentScreen != component ) {
			window.setTimeout(function () {
				App5.$(previousScreen).remove();
			},20)
		}
	}

	
	// first make visible.
	//console.log("Making visible: "+id);
	
	
	if (transition==App5.TRANSITION_GOFORWARD) {
		
		if (this.deviceModel==App5.DM_IPHONE || this.deviceModel==App5.DM_IPAD ) {
			var o=App5.$(component).css({ display: 'block' , position: 'absolute', left: '0px' , top: '0px' }).get(0);
			if (o==null) {
				debugger;
			}
			o.style.webkitTransitionDuration='0';
			o.style.webkitTransform='translate(320px,0px)';
			
			window.setTimeout(function ()
			{
				o.style.webkitTransition=' -webkit-transform 200ms ease-out ';
				o.style.webkitTransform='translate(0px,0px)';
			},10);
			
			
		}
		if (this.deviceModel==App5.DM_BROWSER ) {
			App5.$(component).css({ display: 'block', position: 'absolute' , left:'320px' , top:'0px'})
			//alert(App5.$(id).get(0).style.display);
			//now animate.
			.animate({'left':'-=320px'},'fast');
			
		}
		
		
	}
	if (transition==App5.TRANSITION_GOBACK) {
		if (this.deviceModel==App5.DM_IPHONE || this.deviceModel==App5.DM_IPAD ) {
			var o=App5.$(component).css({ display: 'block' , position: 'absolute', left: '0px' , top: '0px'}).get(0);
			o.style.webkitTransitionDuration='0';
			o.style.webkitTransform='translate(-320px,0px)';
			
			window.setTimeout(function ()
			{
				o.style.webkitTransition=' -webkit-transform 200ms ease-out ';
				o.style.webkitTransform='translate(0px,0px)';
			},10);
			
		}
		if (this.deviceModel==App5.DM_BROWSER ) {
			App5.$(component).css({ display: 'block', position: 'absolute' , left:'-320px' , top:'0px'})
			//alert(App5.$(id).get(0).style.display);
			//now animate.
			.animate({'left':'+=320px'},'fast');
			
		}
	}
	
	this.currentScreen=component;
}


a5_application.prototype.addController=function(name,object) {
	this.views[name]=object;
}


a5_application.prototype.loadModel=function(name,success,failure)
{
    var self=this;
	if (this.models[name]) {
		success(this.models[name]);
	}
	else
	{
		$.ajax({
			url: App5.appPath+'models/'+name+'.js',
			type: 'get',
			success: function(txt) {
				try {
					eval('(function (App5) { \n'+txt+'\n App5.models["'+name+'"]='+name+' ;\n}\n)(App5)');
				}
				catch(e) {
					App5.error('error while loading model '+name+'\nmessage: '+e.message);
				}
				self.models[name]=new App5.models[name]();
				if (self.models[name].init) {
					self.models[name].init(name,success,failure);
				}
				else {
					success();
				}
			},
			error: function () {
				//console.log('cannot load models/'+name+'.js')
			}
		})
	}
	
}

