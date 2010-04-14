App5.Controller('documentation',{
    
    models: ['documentation']    
    ,
    
    onload: function(success,failure) {
		var list=this.getComponent('mylist');
		var m=App5.getModel('documentation');
		list.setModel(m);
		list.setKeys({ title: 'title'});
		this.getComponent('mywiki').setModel(m);
		this.getComponent('myform').setModel(m);
		success();
	}
	,
    
    onshow: function(params) {
	    this.treePath=[];
		var panel1=this.getComponent("panel1");
		panel1.setAttribute("display","block");
		var panel2=this.getComponent("panel2");
		panel2.setAttribute("display","none");
		var wiki=this.getComponent("mywiki");
		var list=this.getComponent('mylist');
		list.setKeyPath(this.treePath);
		var arr=[];
		for (var i=0;i<this.treePath.length;i++) arr.push(this.treePath[i]);
		arr.push(0);
		wiki.setKeyPath(arr);
	
	}
    ,
    
    onsidebarnavigate: function (params) {
	   var list=this.getComponent('mylist');
	   if (params==null) {
	     	list.setKeyPath([]);
	   }
	   else {
	   		list.setKeyPath(params);
	   }
    },    


    onselect_mylist: function(data) {
		var list=this.getComponent('mylist');

		var panel1=this.getComponent("panel1");
		panel1.setAttribute("display","block");
		var panel2=this.getComponent("panel2");
		panel2.setAttribute("display","none");
		var wiki=this.getComponent("mywiki");
		wiki.setKeyPath(list.getKeyPath(data.index));

		this.getComponent('myform').setKeyPath(list.getKeyPath(data.index));
		this.getComponent('myform').setKeys( { 'title': 'title', 'text': 'text'});

		var model=App5.getModel('documentation');

		if (model.getValueForPath(list.getKeyPath(data.index)).children) {
			App5.navigateSidebar(model.getValueForPath(list.getKeyPath(data.index,'title')),list.getKeyPath(data.index,'children'));
			//list.setKeyPath(list.getKeyPath(data.index,'children'));
		}
		
    }
	,
	
	onclick_editButton: function (event) {
		//console.log("PANEL 1 display",panel1)
		
		console.log("Edit button clicked");
		var panel1=this.getComponent("panel1");
		panel1.setAttribute("display","none");
		var panel2=this.getComponent("panel2");
		panel2.setAttribute("display","block");
	}
	,
	
	onclick_addButton: function (event) {
		var model=App5.getModel('documentation');
		model.data.push({ title: 'New page' });
		model.update();
		//this.getComponent('myform').setKeyPath([ model.data.length-1 ]);
		//this.getComponent('myform').setKeys( { 'title': 'title', 'text': 'text'});
	}
	,
	
	onclick_toJSON: function (event) {
		
		var model=App5.getModel('documentation');
		var jsonStr=JSON.stringify(model.data,null,'   ');
		var sourceWindow = window.open('about:blank');
		var newDoc = sourceWindow.document;
		newDoc.open();
		newDoc.write('<html><head>' +
		    '<title>JSON </title>' +
		    '</head><body></body></html>');
		newDoc.close();
		var pre = newDoc.body.appendChild(newDoc.createElement("textarea"));
		pre.appendChild(newDoc.createTextNode(
		    jsonStr));
	    pre.style.width="500px";
	    pre.rows="30";
		
	}

		
});