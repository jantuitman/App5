console.log('logging is loading');


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
				
				console.log.apply(console,args);
			},
			
			error: function () {
				var args=Array.prototype.slice.call(arguments);
				if (typeof args[0]=="string") {
					args[0]=(str+"          ").substr(0,10)+"  "+args[0];
				}
				console.error.apply(console,args);
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