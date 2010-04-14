App5.Controller('notes',{
    
    models: ['notes']    
    ,
    
    onload: function(success,failure) {
		var list=this.getComponent('mylist');
		var notes=App5.getModel('notes');
		list.setModel(notes);
		list.setKeys({ title: 'title'});
		this.getComponent('myform').setModel(notes);
		success();
	}
	,
    
    onshow: function() {
	
	}
    ,
    
    onselect_mylist: function(data) {
		var form=this.getComponent("myForm");
		this.getComponent('myform').setKeyPath([ data.index ]);
		this.getComponent('myform').setKeys( { 'title': 'title', 'text': 'text'});
    }
	,
	
	onclick_addButton: function (event) {
		alert("adding!!!")
		var model=App5.getModel('notes');
		model.data.push({ title: 'New note' });
		model.update();
		this.getComponent('myform').setKeyPath([ model.data.length-1 ]);
		this.getComponent('myform').setKeys( { 'title': 'title', 'text': 'text'});
	}

		
});