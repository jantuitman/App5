/**
	the ios_core module is the module that makes it possible to call the ios_wrapper,
	and be called back from objective C.

*/
App5
.require('bus')
.module('ios_core',function (globals) {

	var bus=App5.modules.bus;



	// store callback functions by call id.
	var id=0; // callid sequence.
	var callbacks={};
	
	/**
		dispatch: first parameter is the method name, second ... n parameters are passed in to
		the IOS_wrapper.
	*/
	globals.dispatch=function(command,args,callback) {
		callbacks[id]=callback;
		args.unshift(id);
		id++;
		window.location="command://"+command+"/"+escape(JSON.stringify(args));
	}

    globals.receive_callback=function(result) {
    	//alert("receive callback"+result);
    	if (!result.id) return;
		var id=result.id;
		var callback=callbacks[id];
		if (callback!=null) {
			callback(result);
			delete callbacks[id];
		}
		else {
			//console.log("error dispatch: callback disappeared");
		} 
	}
	
	/**
		objective c events are passed in through this function.
	*/
	globals.postEvent=function(name,data) {
	 
		window.setTimeout( function () { bus.publish(name,data); },0);
	}
    
    // convenience module name.
    App5.IOS=globals;
    return globals;

});
