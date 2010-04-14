App5.Controller('documentation',{
    
    models: ['documentation']    
    ,
    
    onload: function(success,failure) {
		var list=this.getComponent('mylist');
		list.setModel(App5.getModel('documentation'));
		list.setKeys({ title: 'title'});
		success();
	}
	,
    
    onshow: function() {
	
	}
    ,
    
    onselect_mylist: function(data) {
		App5.pushView('singlepage', [ data.index ]);
    }
	,
	
	onclick_notesButton: function(evt) {
		window.location='../notes/index.html';
	}

		
});