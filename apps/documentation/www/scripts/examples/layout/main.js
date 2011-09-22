App5
.require('template')
.require('layout')
.module('main',function (globals) {
    
    var template=App5.modules.template;
    var layout=App5.modules.layout;
    
    $('body').css( { background: 'white' });
    
    
    
	template.render('examples/layout/main.html',{ }).done(function (h) {
		h.appendTo($("#mainDiv"))
	    layout.create($("#mainDiv"),{ dir: 'vertical' });
	});


	return globals;
});