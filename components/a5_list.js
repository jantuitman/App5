function a5_list(id)
{
	this.id=id;
	this.name='a5_list';
	this.childType='unordered';
	this.childsAllowed=['a5_test','a5_panel'];
	this.children=[];
	this.keys={ title: 'title'};
	this.attributeDefinitions=[{ name:'arrows'}];
	this.attributes={}; 
    this.model=null;
}

a5_list.prototype=new App5Component();

a5_list.prototype.setModel=function(model) {
	this.model=model;
	if (this.model !=null) this.model.removeListener(this);
	this.model=model;
	if (this.model !=null) this.model.addListener(this);
	App5.markUpdate(this);
}

a5_list.prototype.getKeys=function () {
	if (this.subid !=null) {
		return this.getParentObject().getKeys();
	}
	else return this.keys;
}


a5_list.prototype.setKeys=function(keys) {
	this.keys=keys;
	for (var i=0;i<this.children.length;i++) {
		this.children[i].update();
	}
}


a5_list.prototype.onclick=function(event)
{
	var el;
    if (event.target) {
	   el=event.target;
    }
   	if (event.srcElement) {
	   el=event.srcElement;
    }
	while (el.nodeName.toUpperCase() != 'LI' && el.nodeName.toUpperCase() != 'UL') {
		el=el.parentNode ;
	}
	if (el.nodeName.toUpperCase() =='LI') {
		var s=el.id;
		if (s.indexOf("_xAPP5x_")>0) {
			s=s.substr(s.indexOf("_xAPP5x_")+8,s.length);
			var x=parseInt(s,10);
			if (typeof x=="number") {
				this.sendEventToController('select',{ index: x });
			}
		}
	}
	
}

a5_list.prototype.render=function(arr) {

	var height=this.getParentObject("a5_application").getFontSize()+10;
	arr.push('<ul '+App5.writeId(this)+' class="app5list" '+App5.writeCaptureHandlers(['click'])+' >');
	this.renderContents(arr);
	arr.push('</ul>');
}

a5_list.prototype.renderContents=function(arr) {
	
	if (this.model) {
		var listArray=this.model.getValueForPath(this.getKeyPath(null));
		if (this.children.length>0 ) {
			// render via child nodes. 
			// 1. remove all children >1 and remove listeners.
			if (this.children.length>1 ) {
				for (var j=this.children.length-1; j>1; j--) {
					this.children[j].detach();
					this.children[j]=null;
				}
				// TODO: check lenth of array.
			}
			//debugger;
			// 2. clone child 1 as needed.
			for (var i=0; i<listArray.length;i++) {
				if (i==0) {
					this.children[i].subid='0';
				}
				if (i>0) {
					this.children[i]=this.children[0].clone(i);
				}
				this.children[i].setModel(this.model.getValueForPath(this.getKeyPath(i)));
			}
			// 3. render
			for (var i=0; i<listArray.length;i++) {
				arr.push('<li '+App5.writeId(this,''+i)+'>');
				this.children[i].render(arr);
				arr.push('</li>');
			}
		}
		else {
			for (var i=0;i<listArray.length;i++) {
				arr.push('<li '+App5.writeId(this,''+i)+'>');
			
				if (this.keys.title) {
					var value=this.model.getValueForPath(this.getKeyPath(i,'title'));
					arr.push(value);
				}
				if (this.getAttribute('arrows')) {
					arr.push('<span class="app5listarrow">&gt;</span>');
				}
				arr.push('</li>');
			}
		}
	}	
}

a5_list.prototype.update=function() {
	if (App5.$(this.id).get(0)) {
		var el=App5.$(this.id);
		var arr=[];
		this.renderContents(arr);
		el.html(arr.join(''));
	}
	
}
