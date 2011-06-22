App5
.require('controller')
.require('template')
.require('layout')
.require('promise')
.require('minitext')
.require('stackview')
.require('doctree')
.module('main',function (globals) {
    
	var controller=App5.modules.controller;
	var template=App5.modules.template;
	var promise=App5.modules.promise;
	var minitext=App5.modules.minitext;
	var stackview=App5.modules.stackview;
	var doctree=App5.modules.doctree;
	
	
	var stackView1; // the side view;
	
	
	
	function loadDocPage(name) {
		return promise.about(function (success,failure) {
			$.ajax({ 
				//TODO, prefix for url.
				url: 'documentation/'+name,
				type: 'GET',
				success: function (result) {
					success(result);
				}
			});
		});
	}
	
	
	
	controller.handleUrl(/page\/(\S+)/,function (params) {
		
		
		loadDocPage(params[1]).done(function (result){
			
			$("#content").html($(minitext.process(result)))
			
			template.render('list.html',{ title : params[1]}).done(function (h){
				stackView1.replaceView(h,"direct").done(function (){
					h.layout({ dir : 'vertical'})
					var page=doctree.getPage('welcome');
					var tree=$('#listcontainer');
					for (var i=0;i<page.children.length;i++) {
						
						function handler(i) {
							return function (e) {
								alert('clicking on '+page.children[i]);
							}
						}
						var li=$('<li>'+page.children[i]+'</li>').click(handler(i));
						tree.append(li);
					}
				})
			})
		})
	});
	

	template.render('main.html',{ }).done(function (h) {
		h.appendTo($("#mainDiv"))
		
		$("#screen").layout({ dir: 'horizontal' });
		stackView1 = stackview.create($("#sidebar"));
		
		
		
		
		if (window.location.hash != '') controller.reloadUrl();
		else controller.redirect('#page/welcome.txt');
	});	
	//if (window.location.hash =='#mainview') controller.reloadUrl();
	//else controller.redirect('#mainview');
	
	return globals
});