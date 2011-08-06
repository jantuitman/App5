App5
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
					dataType: 'text',
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
					    alert('error in template '+name+' '+x); 
						console.error('error in template '+name);
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


  /** renders a template but changes all id's. 
       for instance: template contains <div id="titlebar" /> and you call renderAsComponent('my',....)
       then the result will be <div id="my_titlebar" />
  */
  globals.renderAsComponent=function(id,name,vars) {
	 var templateResult=globals.render(name,vars); 
	 return templateResult.then(function (success,failure) {
			$("*",templateResult.resultValue()).each(function(){
				var el=$(this);
				if (el.attr('id')!=null) {
					el.attr('id',id+'_'+el.attr('id'))
				}
			})
			var x=templateResult.resultValue();
			if (x.attr('id') != null) {
				x.attr('id',id+'_'+x.attr('id'));
			}
			success(templateResult.resultValue());
	 }); 
  }
	
});