function a5_textarea(id)
{
	this.id=id;
	this.name='a5_textarea';
	this.childType='unordered';
	this.childsAllowed=[];
	this.keys={};
	this.children=[];
	this.attributeDefinitions=[{ name: 'label'}];
	this.attributes={}; 
}

a5_textarea.prototype=new App5Component();

a5_textarea.prototype.render=function(arr)
{
	arr.push('<div '+App5.writeId(this,'wrapper')+' >')
	this.renderContent(arr);
	arr.push('</div>')
}

a5_textarea.prototype.update=function()
{
	var o=App5.$(this.id,'wrapper');
	if (o.get(0)) {
		var el=o;
		var arr=[];
		this.renderContent(arr);
		el.html(arr.join(''));
	}
}

a5_textarea.prototype.renderContent=function(arr) {
	var form=this.getParentObject();
	arr.push('<label for="'+App5.writeId(this,null,true)+'" >')
	arr.push(this.attributes['label']);
	arr.push('</label>');
	var value='';
	var keys=form.getKeys();
	var key=keys[App5.shortId(this.id)];
	if (key && form.model) {
		value=App5.wrapModel(form.model).getValueForPath(form.getKeyPath(key));
		if (!value) value='';
	} 
    var nLines=0; var pos=0;
    while (value.indexOf("\n",pos)>=0) {
	   nLines++;
	   pos=value.indexOf("\n",pos)+1;
    }  
	arr.push('<textarea '+App5.writeId(this)+' rows="5" ');
	arr.push(App5.writeCaptureHandlers(['change','focus','blur',"keyup"]));
	arr.push(' >');
	arr.push(value);
	arr.push('</textarea>');	
	/*
	////console.log("we have "+(nLines+1)+" rows!");
	arr.push('<pre class="app5textarea" '+App5.writeId(this,'readview')+ '>')
	arr.push(value);
	arr.push('</pre>')
	*/
	//arr.push('<textarea '+App5.writeId(this)+' rows="'+(nLines+1)+'" ');
	//arr.push(App5.writeCaptureHandlers(['change','blur',"keydown"]));
	//arr.push(' >');
	//arr.push('</textarea>');
}

a5_textarea.prototype.onchange=function () {
	var value=App5.$(this.id).get(0).value;
	var form=this.getParentObject();
	var keys=form.getKeys();
	var key=keys[App5.shortId(this.id)];
	if (key && form.model) {
		App5.wrapModel(form.model).setValueForPath(form.getKeyPath(key),value);
	} 
	
}

a5_textarea.prototype.onfocus=function(event) {
	this.onkeyup(event);
	var self=this;

}


a5_textarea.prototype.onkeyup=function(event) {
	//console.log("keyup detected "+event.keyCode)
    if (this.getParentObject("a5_application").deviceModel==App5.DM_IPHONE ||this.getParentObject("a5_application").deviceModel==App5.DM_IPAD) {
	  var textarea = App5.$(this.id).get(0);
	  var newHeight = textarea.scrollHeight;
	  var currentHeight = textarea.clientHeight;

	  if (newHeight > currentHeight) {
	     textarea.style.height = (newHeight+50 )+ 'px';
	  }
	}
	else {
		// TODO: make this thing just as high as the window is 
		App5.$(this.id).css({ height: '250px'})
	}
}

a5_textarea.prototype.onblur=function () {
	this.getParentObject("a5_application").placeScreenOnTop();
	this.update();
}
