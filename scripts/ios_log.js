App5
.require('ios_core')
.module('ios_log', function (globals) {
	

	function IosConsole() {
		this.hasLogged=false;
		this.count=0;
		return this;
	}
	
	IosConsole.prototype.log=function () {
	    
		var arr=[];
		//if (this.count<20) alert(arguments[0]);
		this.count++;
		for (var i=0;i<arguments.length;i++) {
			//arr.push(arguments[i]);
			
			if (typeof(arguments[i])=="string") {
				arr.push(arguments[i])
			}
			else {
				arr.push(JSON.stringify(arguments[i]));
			}
		}
		var s=arr.join(" ");
		if (App5.IOS) App5.IOS.dispatch('log', [ s ],function () {});
		else {
			alert('IOS core undefined');	
		}
		
		this.hasLogged=true;
	}

	IosConsole.prototype.debug=function () {
	   this.log.apply(this,arguments);
	}
	
	if (window.console) {
		globals._console=window.console;
	}
	window.console = new IosConsole();
	
	
	return globals;

});