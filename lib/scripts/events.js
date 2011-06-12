
App5
.require('logging')
.module('events',function(globals) {
	
	var logging=App5.modules.logging; 
	
	globals.bind=function(object,eventName,f) {
		
		object.bind(eventName,function() {
			var self=this;
			try {
				return f.apply(self,arguments);
			}
			catch(e) {
				logging.topic('core').error(e.message+" ["+e.sourceURL+":"+e.line+"]");
				// todo. log error in server.
				throw(e);
			}
		});
		
	}
});