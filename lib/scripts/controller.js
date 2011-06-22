App5.module('controller',function (globals) {
	
	
	$(window).bind('hashchange',function () {
		
		console.log('hash changed '+window.location.hash)
		_dispatch(window.location.hash)
	})
	
	var handlers=[];
	var dialogs={};
	var errorHandler;
	
	
	function _dispatch(hash) {
		
		for(var i=0;i<handlers.length;i++) {
			var res=hash.match(handlers[i].pattern);
			if (res) {
				handlers[i].fn(res);
				return;
			}
		}
		if (errorHandler) errorHandler(404);
				
	}
	
	
	/******* handlers ****/
	globals.errorHandler=function (f) {
		errorHandler=f;
	}
	
	globals.handleUrl=function(pattern,handler) {
		handlers.push( { pattern: pattern, fn: handler });
		
	}
	
	globals.handleDialog=function(name,handler) {
		dialogs[name]= { pattern: pattern, fn: handler };
	}

	/****** navigation ****/
	
	globals.redirect=function(url) {
		window.location=url;
	}
	
	
	globals.showDialog=function(name) {
		
	}
	
	globals.reloadUrl=function () {
		_dispatch(window.location.hash);
	}
	
	
	return globals;
});