App5.Controller('note',{
    
    models: ['notes']
    ,	
	
	onshow: function (data) {
		this.index=data.index;

		var notes=App5.getModel('notes');
		App5.get('myform').setKeyPath([ data.index ]);
		App5.get('myform').setKeys( { 'title': 'title', 'text': 'text'});
		App5.get('myform').setModel(notes);
	}
	,
	
	
	onclick_doneNote: function () {
		App5.popView();
	}
	,
	
	onclick_deleteNote: function () {
		var notes=App5.getModel('notes');
		notes.data.splice(this.index,1);
		notes.update();
		App5.popView();
	}
		
});