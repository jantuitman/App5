$(document).ready(function() {
	App5
	.require('logging')
	.require('layout')
	.require('scroller')
	.require('pager')
	.require('browser')
	.module('main',function () {

	    var logging=App5.modules.logging;
	    var layout=App5.modules.layout;
		var scroller=App5.modules.scroller;
		var pager=App5.modules.pager;
		var browser=App5.modules.browser;
		
	    if (browser.hasTouch) {
		    $('body').get(0).addEventListener('touchmove',function (e) {
				if (e.currentTarget.nodeName=='BODY') e.preventDefault();
		
			});
		}

		logging.topic('main').log('started main');
		$("#mainDiv").layout({ dir: 'vertical', container: 'window'});
		
		
		
		window.setTimeout(function () {
			var pager1=pager.create($("#mainArea"),{});
		
			pager1.setModel({
			
			
				renderPage: function (pageNo,pageDiv) {
					var arr=['#ffff00','#00ffff','#ff00ff','#ff0000','#00ff00','#0000ff']
				    if (pageNo > 10) {
						return false;
				    }
				    pageDiv.css('backgroundColor',arr[pageNo % arr.length]).append($("<h1>This is page "+pageNo+"</h1>"))
					return true;
				}
			})
			
			$("#nextButton").bind('click',logging.guard(function () { pager1.nextPage() }));
			$("#prevButton").bind('click',logging.guard(function () { pager1.prevPage() }));
		},100);
		
		/*
		var iScroll =new scroller.iScroll('wrapper');
		window.setTimeout(function (){
			iScroll.refresh();
		})
		*/
	});
})