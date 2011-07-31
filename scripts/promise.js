App5
.module('promise',function (globals) {
	
	
	function Promise() {
		this.finished=false;
		this.success=null;
		this.failure=null;
		this.finished=false;
		this.callbacks=[]; // { type: , f: }
	}
	
	Promise.prototype.fulfill=function() {
		_finish(this,'success',Array.prototype.slice.call(arguments))
	}
	Promise.prototype.fail=function() {
		_finish(this,'failure',Array.prototype.slice.call(arguments))
	}
	
	function _finish(self,type,args) {
		if (self.finished) throw new Error(" I already was finished!!!");
		self.finished=true;
		self[type]=args; // store the result.
		for (var i=0;i<self.callbacks.length;i++) {
			if (self.callbacks[i].type=='any' || self.callbacks[i].type==type) {
				var obj=self.callbacks[i].f;
				if (obj.constructor==Promise) {
					if (type=='success') obj.fulfill.apply(obj,args);
					if (type=='failure') obj.fail.apply(obj,args);
				}
				else {
					obj.apply(null,args);
				}
			}
		}
		
	}
	
	/**
		fulfills this promise if all passsed in promises are fulfilled.
		since the results of multiple promises are hard to track the result of this promise will be 
		a simple boolean: true value.
	*/
	Promise.prototype.join=function () {
		var self=this;
		var waitFor={};
		
		function resultReceiver(i){
			return function () {
				waitFor[i]=0;
				var waitCount=0;
				for (var j in waitFor) {
					waitCount+=waitFor[j];
				}
				if (waitCount==0) {
					self.fulfill(true);
				}
			}
		}
		if (arguments[0].length) {
			var arr=arguments[0];
			for (var i=0;i<arr.length;i++) {
				waitFor[i]=1;
			}
			for (var i=0;i<arr.length;i++) {
				arr[i].done(resultReceiver(i))
			}
		}
		else {
			for (var i=0;i<arguments.length;i++) {
				waitFor[i]=1;
			}
			for (var i=0;i<arguments.length;i++) {
				arguments[i].done(resultReceiver(i))
			}
		}
		return self;
	}
	
	
	
	Promise.prototype.done=function(obj) {
		if (obj.constructor == Promise) {
			if (this.success) obj.fulfill.apply(obj,this.success);
			else if (this.failure) obj.fail.apply(obj,this.failure);
			else this.callbacks.push({ type: 'any', f: obj })
			
			
		}
		else {
			if (this.success) {
				obj.apply(null,this.success);
			}
			else if (this.failure) {
				obj.apply(null,this.failure);
			}
			else {
				this.callbacks.push({ type: 'any', f: obj })
			}
		}
		return this;
	}

	Promise.prototype.whenFailed=function(obj) {
		if (obj.constructor == Promise) {
			if (this.failure) obj.fail.apply(obj,this.failure);
			else if (!this.finised) this.callbacks.push({ type: 'failure', f: obj })
			
		}
		else {
			if (this.failure) obj.apply(null,this.failure);
			else if (!this.finised) this.callbacks.push({ type: 'failure', f: obj })
		}
		return this;
	}
	Promise.prototype.whenSuccess=function(obj) {
		if (obj.constructor == Promise) {
			if (this.failure) obj.fail.apply(obj,this.failure);
			else if (!this.finised) this.callbacks.push({ type: 'success', f: obj })
			
		}
		else {
			if (this.success) obj.apply(null,this.success);
			else if (!this.finised) this.callbacks.push({ type: 'success', f: obj })
		}
		return this;
	}
	
	
	/**
	   about makes the promise go about the async result of function f.
	
	   f is called with success and failure callbacks.
	   so you can do something like this:
	
	     promise.about(function(success,failure) {
				ajaxCall(foo,bar,...,success,failure)
	    })	
	
	*/
	Promise.prototype.about=function(f) {
		var self=this;
		
		var success=function () { 
			self.fulfill.apply(self,arguments)
		}
		var failure=function () { 
			self.fail.apply(self,arguments)
		}
		f(success,failure);
		
		return self;
	}
	
	
	/**
		returns the resultarguments with which this promise was fulfilled/failed.
		can only be called on a finished promise.
	*/
	Promise.prototype.resultArguments=function() {
		if (!this.finished) throw new Error("can't access results from unfinished promise");
		if (this.success) return this.success;
		return this.failure;
	}

    /**
      the resultvalue is the first argument of the resultArguments.
    */
	Promise.prototype.resultValue=function() {
		var a=this.resultArguments();
		return a[0];
	}
	
	
	/**
		only if the first promise is fulfilled, makes a second promise of an function.
	
	**/
	Promise.prototype.then=function(f) {
		var result=new Promise();
		
		this.whenSuccess(function () {
			console.log("SUCCESS!!");
			var promise2=(new Promise()).about(f);
			promise2.whenSuccess(function () {
				console.log("SUCCESS 2!!");
				result.fulfill.apply(result,promise2.resultArguments());
			});
			promise2.whenFailed(function () {
				console.log("failed 2");
				result.fail.apply(result,promise2.resultArguments());
			})
		})
		.whenFailed(function () {
			result.fail.apply(result,pr.resultArguments());
		})
		return result;
	}
	
    

    /*
		creates a new promise.
		or, if you pass in something, the same thing as promise.of();
	*/	
	globals.promise=function() {
	  if (arguments.length==0) return new Promise();
	  else globals.of(arguments[0]); 	
	}
	
	globals.about=function(f) {
	  return (new Promise()).about(f);	
	}
	
	/**
	 returns a promise that will fulfill with true if all passed in promises succeed.
	  TODO: failures.
	*/
	globals.join=function() {
		var arr=Array.prototype.slice.call(arguments);
		var p=new Promise();
		return p.join.apply(p,arr)
	}
	
	globals.of=function(v) {
		if (v!=null && v.constructor == Promise) {
			return v;
		}
		else {
			var p=new Promise();
			p.fulfill(v);
			return p;
		}
	}
	
	return globals;
});