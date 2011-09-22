App5
.require('arrays')
.module('bus',function (globals) {
	
	var arrays=App5.modules.arrays;
	
    var handlers={}; //array of handler functions per channel.
    var elements={}; // array of {handler:,channel:} per element. 
	var count=0;
	
	$(document).bind('DOMNodeRemoved',function (e) {
		if (e.target.id !=null) {
			var a=elements[e.target.id];
			if (a!=null) {
				for (var i=0;i<a.length;i++) {
					if (handlers[a[i].channel]) {
						arrays.remove(handlers[a[i].channel],a[i].handler);
					} 
					 
				}
				delete elements[e.target.id];
			}
		} 
		
	});
	
	
	globals.publish=function(channel,payload) {
		if (handlers[channel]!=null) {
			for(var i=0;i<handlers[channel].length;i++) {
				handlers[channel][i](payload);
			}
		}
	}
	
	// deprecated. refactoring needed. use listen2 instead.
	globals.listen=function(channel,handler) {
		count++;
		console.log(channel+" number of listeners = "+count);
		if (!handlers[channel]) handlers[channel]=[];
		handlers[channel].push(handler);
	}
	
	globals.listen2=function(channel,element,handler) {
		if (element.attr('id')==null) throw new Error("can only listen on behalf of elements with an id");
		
		var id=element.attr('id');
		count++;
		console.log(channel+" number of listeners = "+handlers.length);
		if (!handlers[channel]) handlers[channel]=[];
		handlers[channel].push(handler);
		if (elements[id]==null) elements[id]=[];
		elements[id].push({ handler: handler, channel : channel });		
	}
	
	globals.removeListener=function(channel,handler) {
		arrays.remove(handlers[channel],handler);
		// TODO: also remove handler from the elements structure? the elements structure
		// currently is only used for garbage collection so it does not seem to be to wrong 
		// to skip it. 
		
	}
	
	

	// deprecated. refactoring needed.
	globals.listenForElement=function(channel,id,handler) {
		globals.listen(channel+'.'+id,handler);
		if (elements[id]==null) elements[id]=[];
		elements[id].push({ handler: handler, channel : channel+'.'+id });		
		//elements[id].push(channel+'.'+id);
	}
	
	return globals;
	
});
