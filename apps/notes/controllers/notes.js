App5.Controller('notes',{
    
    models: ['notes']    
    ,
    
    onload: function(success,failure) {
		var list=this.getComponent('mylist');
		list.setModel(App5.getModel('notes'));
		list.setKeys({ title: 'title'});
		success();
	}
	,
    
    onshow: function() {
	
	}
    ,
    
    onselect_mylist: function(data) {
		App5.pushView('note', { index : data.index});
    }
	,
	
	onclick_addButton: function (event) {
		var model=App5.getModel('notes');
		model.data.push({ title: 'New note' });
		model.update();
		App5.pushView('note', { index : model.data.length-1 });
	}

		
});