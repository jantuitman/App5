App5.module('controller',function (globals) {
	
	
	$(window).bind('hashchange',function () {
		
		console.log('hash changed '+window.location.hash)
		_dispatch(window.location.hash)
	})
	
	var handlers=[];
	var errorHandler;
	var history=[];
	var silenceCount=0;
	
	
	function _dispatch(hash) {
		
		if ((history.length > 0 && history[history.length-1] != hash) || history.length==0) {
			history.push(hash);
		}
		
		// for navigating back silently.
		if (silenceCount>0) {
			silenceCount--;
			return;
		}
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
	
	

	

	/****** navigation ****/
	globals.cancelNavigation=function(rescueHash) {
		if (history.length < 2) {
			window.location.hash=rescueHash;
			return;
		}
		var current=history.pop();
		var previous=history.pop();
		silenceCount++;
		window.location.hash=previous
	}
	
	
	globals.redirect=function(url) {
		window.location=url;
	}
	
		
	globals.reloadUrl=function () {
		_dispatch(window.location.hash);
	}
	
	
	return globals;
});