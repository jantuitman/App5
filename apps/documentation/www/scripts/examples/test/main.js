App5
.require('template')
.module('main',function (globals) {
    
    var template=App5.modules.template;
    
    $('body').css( { background: 'white' });
	template.render('examples/test/main.html',{ }).done(function (h) {
		h.appendTo($("#mainDiv"))
	});
	

	return globals;
});

