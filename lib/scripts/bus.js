App5.module('bus',function (globals) {
	
	
    var handlers={};
    var elements={};
	var count=0;
	
	$(document).bind('DOMNodeRemoved',function (e) {
		if (e.target.id !=null) {
			var a=elements[e.target.id];
			if (a!=null) {
				for (var i=0;i<a.length;i++) {
					if (channels[a[i].channel]) {
						var arr=channels[a[i].channel];
						for (var j=0;j<arr.length;j++) {
							if (arr[j]==a[i].handler) {
								count--;
								console.log(" DECREASING,"+e.target.id+" number of listeners = "+count);
								arr.splice(j,1);
							}
						}						
					}  
				}
				/*
				for (var i=0;i<a.length;i++) {
					count--;
					console.log(" DECREASING,"+e.target.id+" number of listeners = "+count);
					delete handlers[a[i]];
				}
				*/
				delete elements[e.target.id];
			}
		} 
		
	});
	
	
	globals.publish=function(channel,payload) {
		if (handlers[channel]!=null) {
			//console.log('publish '+channel)
			for(var i=0;i<handlers[channel].length;i++) {
				//console.log('handling '+channel);
				handlers[channel][i](payload);
			}
		}
	}
	
	// deprecated. refactoring needed.
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
		console.log(channel+" number of listeners = "+count);
		if (!handlers[channel]) handlers[channel]=[];
		handlers[channel].push(handler);
		if (elements[id]==null) elements[id]=[];
		elements[id].push({ handler: handler, channel : channel });		
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
