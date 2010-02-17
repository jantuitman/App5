App5.Controller('singlepage',{
    
    models: ['documentation']
    ,	
	
	onshow: function (data) {
		this.index=data.index;
		var notes=App5.getModel('documentation');
		App5.get('mywiki').setModel(notes);
		App5.get('mywiki').setKeyPath([ data.index ]);
	}
		
});