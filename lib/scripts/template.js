App5
.require('logging')
.require('promise')
.module('template',function(globals) {
	
	
	var promise=App5.modules.promise;
	var templates={};
	var i18nTable={};
   
	function _cacheTemplate(name) {
		console.log("caching "+name);
		if (templates[name]){
			return promise.of(templates[name]);
		}
		else {
			return promise.about(function (success,failure) {
				console.log("trying to load "+name);
				$.ajax({ 
					//TODO, prefix for url.
					url: 'templates/'+name,
					type: 'GET',
					success: function (result) {
						// i18n
						result=result.replace(/%%([a-zA-Z\_0-9]+)%%/g,function(varname){ 
							varname=varname.substr(2,varname.length-4);
							return i18nTable[varname]==null?'':i18nTable[varname]
						} )
						templates[name]=$.template(name,result);
						success(templates[name]);
					},
					error: function (x) {
						logging.topic('TEMPLATE').log('error in loading template '+name)
						if (failure) failure();
					}
				});			
			});
		}
	}	


  //self.templates[name]=$.template(name,result);

  globals.render=function(name,vars) {
	return promise
		.of(_cacheTemplate(name))
		.then(function (success,failure) {
			
			console.log("In render function")
			success($.tmpl(name,vars))
		});
  }	
	
});