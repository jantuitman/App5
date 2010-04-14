App5.Controller('singlepage',{
    
    models: ['documentation']
    ,	
	
	onshow: function (data) {
		this.treePath=data;
		var notes=App5.getModel('documentation');
		this.getComponent('mywiki').setModel(notes);
		this.getComponent('mywiki').setKeyPath(data);
		if (notes.getValueForPath(data).children != null) {
			this.getComponent('childlist').setModel(notes);
			this.getComponent('childlist').setKeyPath(this.getComponent('mywiki').getKeyPath('children'));
		}
		else {
			this.getComponent('childlist').setModel(null);
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