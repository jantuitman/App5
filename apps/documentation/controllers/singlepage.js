App5.Controller('singlepage',{
    
    models: ['documentation']
    ,	
	
	onshow: function (data) {
		this.treePath=data;
		var notes=App5.getModel('documentation');
		App5.get('mywiki').setModel(notes);
		App5.get('mywiki').setKeyPath(data);
		if (notes.getValueForPath(data).children != null) {
			App5.get('childlist').setModel(notes);
			App5.get('childlist').setKeyPath(App5.get('mywiki').getKeyPath('children'));
		}
		else {
			App5.get('childlist').setModel(null);
		}
	}
	,
    

    onselect_childlist: function(data) {
	    var arr=[];
		for (var i=0; i<this.treePath.length;i++) {
			arr.push(this.treePath[i]);
		}
		arr.push('children');
		arr.push(data.index);
		App5.pushView('singlepage', arr);
    }		
});