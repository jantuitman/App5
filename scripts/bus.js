App5.module('bus',function (globals) {
	
	
    var handlers={};
    var elements={};
	var count=0;
	
	$(document).bind('DOMNodeRemoved',function (e) {
		if (e.target.id !=null) {
			var a=elements[e.target.id];
			if (a!=null) {
				for (var i=0;i<a.length;i++) {
					count--;
					console.log(" DECREASING,"+e.target.id+" number of listeners = "+count);
					delete handlers[a[i]];
				}
				delete elements[e.target.id];
			}
		} 
		
	});
	
	
	globals.publish=function(channel,payload) {
		if (handlers[channel]!=null) {
			console.log('publish '+channel)
			for(var i=0;i<handlers[channel].length;i++) {
				console.log('handling '+channel);
				handlers[channel][i](payload);
			}
		}
	}
	
	globals.listen=function(channel,handler) {
		count++;
		console.log(channel+" number of listeners = "+count);
		if (!handlers[channel]) handlers[channel]=[];
		handlers[channel].push(handler);
	}
	
	globals.listenForElement=function(channel,id,handler) {
		globals.listen(channel+'.'+id,handler);
		if (elements[id]==null) elements[id]=[];
		elements[id].push(channel+'.'+id);
	}
	
	return globals;
	
});