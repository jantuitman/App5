$(document).ready(function() {
	App5
	.require('logging')
	.require('layout')
	.require('scroller')
	.require('pager')
	.require('promise')
	.require('browser')
	.module('main',function () {

	    var logging=App5.modules.logging;
	    var layout=App5.modules.layout;
		var scroller=App5.modules.scroller;
		var pager=App5.modules.pager;
		var promise=App5.modules.promise;
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
			
			    /**
			      returns promise of boolean (if page exists)
			    */
				renderPage: function (pageNo,pageDiv) {
					var arr=['#ffff00','#00ffff','#ff00ff','#ff0000','#00ff00','#0000ff']
				    if (pageNo > 12) {
						return promise.of(null);
				    }
				    pageDiv.css('backgroundColor',arr[pageNo % arr.length]).append($("<h1>This is page "+pageNo+"</h1>"))
					return promise.of(pageDiv);
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