
App5.module('logging',function(globals){
	
	var DEBUG=true;
	
	// 0=debug 1=....?
	var levelByTopic={
		"core": 0
		
	};
	
	var loggerByLevel={
		0: {
			debug: debugLogger,
			error: errorLogger
		},
		1: {
			debug: voidLogger,
			error: errorLogger
		}
	}
	
	var voidLogger=function (){	}
	var debugLogger=console?console.debug:voidLogger;
	var errorLogger=console?console.error:voidLogger;
	
	var console=null;
	if (window && window.console) {
		console=window.console;
	}
	else {
		// TODO. implement a fake console
		console= {
			debug: function () {
				
			},
			log: function () {
				
			},
			error: function() {
				alert('error '+arguments[1]);
			}
		}
		// install fake console on window.
		if (window) window.console=console;
	}
	
	
	globals.topic=function (str) {
                                             		
		return {
			
			
			debug: function () {
				var args=Array.prototype.slice.call(arguments);
				if (typeof args[0]=="string") {
					args[0]=(str+"          ").substr(0,10)+"  "+args[0];
				}
				
				console.debug.apply(console,args);
			},
			
			log: function () {
				var args=Array.prototype.slice.call(arguments);
				if (typeof args[0]=="string") {
					args[0]=(str+"          ").substr(0,10)+"  "+args[0];
				}
				if (console.log.apply) console.log.apply(console,args);
				else if (console.log) {
					if (args.length==1) console.log(args[0])
					if (args.length==2) console.log(args[0],args[1])
					if (args.length==3) console.log(args[0],args[1],args[2])
				}
			},
			
			error: function () {
				var args=Array.prototype.slice.call(arguments);
				if (typeof args[0]=="string") {
					args[0]=(str+"          ").substr(0,10)+"  "+args[0];
				}
				if (console.error.apply) console.error.apply(console,args);
				else if (console.error) {
					if (args.length==1) console.log(args[0])
					if (args.length==2) console.log(args[0],args[1])
					if (args.length==3) console.log(args[0],args[1],args[2])
				}
			} 
		}
	}
	
	globals.guard=function(f) {
		return function() {
			var self=this;
			try {
				return f.apply(self,arguments);
			}
			catch(e) {
				globals.topic('core').error(e.message+" ["+e.sourceURL+":"+e.line+"]");
				// todo. log error in server.
				throw(e);
			}
		};
	}
	
		
	return globals;
	
});