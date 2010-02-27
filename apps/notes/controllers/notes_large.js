App5.Controller('notes',{
    
    models: ['notes']    
    ,
    
    onload: function(success,failure) {
		var list=App5.get('mylist');
		var notes=App5.getModel('notes');
		list.setModel(notes);
		list.setKeys({ title: 'title'});
		App5.get('myform').setModel(notes);
		success();
	}
	,
    
    onshow: function() {
	
	}
    ,
    
    onselect_mylist: function(data) {
		var form=App5.get("myForm");
		App5.get('myform').setKeyPath([ data.index ]);
		App5.get('myform').setKeys( { 'title': 'title', 'text': 'text'});
    }
	,
	
	onclick_addButton: function (event) {
		var model=App5.getModel('notes');
		model.data.push({ title: 'New note' });
		model.update();
		App5.get('myform').setKeyPath([ model.data.length-1 ]);
		App5.get('myform').setKeys( { 'title': 'title', 'text': 'text'});
	}

		
});