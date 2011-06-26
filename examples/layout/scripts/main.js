


$(document).ready(function() {
	App5
	.require('layout')
	.module('main',function () {
	    
	    var layout=App5.modules.layout;
		layout.create($("#mainDiv"),{ dir: 'vertical', provider: 'window'});
	});
})