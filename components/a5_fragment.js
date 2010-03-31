
/*
  a5_fragment is a very special class, it is not a component but it is used for untyped xml.
  the xml is stored as a string. 
*/
function a5_fragment(id)
{
   this.id=id;
   this.name="a5_fragment";
   this.children=[];
   this.attributes={ str: "" };
   this.attributeDefinitions=[{ name: "str"}]; 
  return this;
}

a5_fragment.prototype=new App5Component();

a5_fragment.prototype.addElement=function(el) {
	this.attributes.str+=this.elementToString(el);
}

a5_fragment.prototype.elementToString=function(el)
{
	if (el.nodeName=='#text') {
		return el.nodeValue ;
	}
	else {
		var arr=[];
		arr.push('<'+el.nodeName+' ');
		for (var i=0;i<el.attributes.length;i++) {
			arr.push(el.attributes.item(i).name+'="'+this.escape(el.attributes.item(i).value)+'" ')
		}
		if (el.childNodes.length>0) {
			arr.push('>');
			for (var i=0;i<el.childNodes.length;i++) {
				arr.push(this.elementToString(el.childNodes[i]));
			}
			arr.push('</'+el.nodeName+'>');
		}
		else {
			arr.push('/>');
		}
		
		return arr.join("");
	}
	
}

a5_fragment.prototype.escape=function(s)
{
	if (s==null) return '';
	return s.replace(/&/,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	
}

a5_fragment.prototype.toString=function()
{
	return this.attributes.str;
}
