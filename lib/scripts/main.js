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
	var layout=App5.modules.layout;
	
	
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
	
	
	var myId=0;
	function showIndexForPage(name,isBackButton) {
		myId++;
		template.renderAsComponent("my"+myId,'list.html',{ title : name}).done(function (h){
			var page=doctree.getPage(name);
			//console.log("getting page "+name+" "+page.children.length+" myId:"+myId)
			var tree=$('#my'+myId+'_listcontainer',h);
			for (var i=0;i<page.children.length;i++) {
				function handler(str) {
					return function (e) {
					      showIndexForPage(str);
					}
				}
				var li=$('<li>'+page.children[i]+'</li>').click(handler(page.children[i]));
				//console.log("appending list item; "+tree.html())
				tree.append(li);
			}
			if (page.parent != null) {
				$('#my'+myId+'_backbutton',h).click(function () {
					showIndexForPage(page.parent,true)
				})
			} 
			else {
				$('#my'+myId+'_backbutton',h).css("display","none");
			}
			
			stackView1.replaceView(h,isBackButton?"back":"forward").done(function (){
				//h.layout({ dir : 'vertical'})
			})
		})
	}
	
	
	
	controller.handleUrl(/page\/(\S+)/,function (params) {
		loadDocPage(params[1]).done(function (result){
			$("#content").html($(minitext.process(result)))
			//TODO. params1 instead of welcome.
			showIndexForPage('welcome');
		})
	});


    controller.handleUrl(/examples\/(\S+)/,function (params) {
		controller.cancelNavigation('/page/welcome');
		
	});


	template.render('main.html',{ }).done(function (h) {
		h.appendTo($("#mainDiv"))
		
		layout.create($("#screen"),{ dir: 'horizontal' });
		stackView1 = stackview.create($("#sidebar"));
		
		
		
		
		if (window.location.hash != '') controller.reloadUrl();
		else controller.redirect('#page/welcome.txt');
	});	
	//if (window.location.hash =='#mainview') controller.reloadUrl();
	//else controller.redirect('#mainview');
	
	return globals
});