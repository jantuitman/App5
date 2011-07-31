App5
.require('template')
.require('controller')
.require('layout')
.module('main',function (globals) {
    
    var template=App5.modules.template;
    var controller=App5.modules.controller;
    
    $('body').css( { background: 'white' });

	template.render('examples/controller/main.html',{ }).done(function (h) {
		h.appendTo($("#mainDiv"))
	});
	
	controller.handleUrl(/screen1/,function (params) {
		$("#message").css({ color: 'navy'}).html("screen1 visited!");	
	
	});
	controller.handleUrl(/screen2/,function (params) {
		$("#message").css({ color: 'lime'} ).html("screen2 visited!");
		window.setTimeout(function () {
			controller.redirect('#screen1');
		},700);
		
	});
	controller.handleUrl(/post\/(\S+)/,function (params) {
		$("#message").css({ color: 'red'} ).html("handling post "+params[1]);	
	});

	return globals;
});