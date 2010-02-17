App5.Controller('documentation',{
    
    models: ['documentation']    
    ,
    
    onload: function(success,failure) {
		var list=App5.get('mylist');
		list.setModel(App5.getModel('documentation'));
		list.setKeys({ title: 'title'});
		success();
	}
	,
    
    onshow: function() {
	
	}
    ,
    
    onselect_mylist: function(data) {
		App5.pushView('singlepage', { index : data.index});
    }
	

		
});