App5
.require('controller')
.require('template')
.require('layout')
.require('promise')
.require('minitext')
.require('stackview')
.require('doctree')
.require('dialog')
.module('main',function (globals) {
    
	var controller=App5.modules.controller;
	var template=App5.modules.template;
	var promise=App5.modules.promise;
	var minitext=App5.modules.minitext;
	var stackview=App5.modules.stackview;
	var doctree=App5.modules.doctree;
	var layout=App5.modules.layout;
	var dialog=App5.modules.dialog;
	
	
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
	var lastPage=null;
	function showIndexForPage(name) {
		myId++;
		template.renderAsComponent("my"+myId,'list.html',{ title : name}).done(function (h){
			var page=doctree.getPage(name);
			//console.log("getting page "+name+" "+page.children.length+" myId:"+myId)
			var tree=$('#my'+myId+'_listcontainer',h);
			for (var i=0;i<page.children.length;i++) {
				function handler(str) {
					return function (e) {
						   controller.redirect('#page/'+str);
					      //showIndexForPage(str);
					}
				}
				var li=$('<li>'+page.children[i]+'</li>').click(handler(page.children[i]));
				//console.log("appending list item; "+tree.html())
				tree.append(li);
			}
			if (page.parent != null) {
				$('#my'+myId+'_backbutton',h).click(function () {
					controller.redirect('#page/'+page.parent);
					//showIndexForPage(page.parent,true)
				})
			} 
			else {
				$('#my'+myId+'_backbutton',h).css("display","none");
			}
			
			var dir="forward";
			if (lastPage !=null && lastPage.parent==name) dir="back";
			lastPage=page;
			stackView1.replaceView(h,dir).done(function (){
				//h.layout({ dir : 'vertical'})
			})
		})
	}
	
	
	
	controller.handleUrl(/page\/(\S+)/,function (params) {
		loadDocPage(params[1]).done(function (result){
			$("#content").html($(minitext.process(result)))
			//TODO. params1 instead of welcome.
			console.log('show index for page '+params[1])
			showIndexForPage(params[1]);
		})
	});


    controller.handleUrl(/examples\/(\S+)/,function (params) {
		controller.cancelNavigation('/page/welcome');
		
		
		var d1=dialog.create('example',{ minHeight:50, minWidth:50, width: 700, height: 300 },function (el) {
			template.render('testdialog.html',{}).done(function (h){
				
				console.log("#EL:",el.width(),el.height())
				layout.nested(h,el.width(),el.height());
				
				$('#closebutton',h).click(function () {
					d1.close();
				})
				el.append(h);
			});
				
		});
		
		d1.show();
		
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