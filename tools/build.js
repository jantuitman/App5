
var dependency={};

(function (dependency) {

    var items={};
	
	
	function Item(name) {
		this.name=name;
		this.level=0; // maximum number of childs to reach the bottom.
		this.parentCount=0; // number of top level parents.
		this.children=[];
		this.parents=[];
		this.reasons={};
	}
	
	function setLevel(item,level) {
		item.level=level;
		for (var i=0;i<item.parents.length;i++) {
			if (item.parents[i].level < item.level+1) {
				setLevel(item.parents[i],item.level+1);
			} 
		}
	}
	function updateParentCount(item) {
		
		var ancestors=item.ancestors();
		var count=0;
		for (var v in ancestors) {
			if (dependency.item(v).isRootNode()) count++; 
		}
		
		if (item.parentCount != count) {
			item.parentCount=count;
			for (var i=0;i<item.children.length;i++) {
				updateParentCount(item.children[i])
			}
		}
	}
	
	Item.prototype.descendants=function ( ) {
		var results={};
	    for (var i=0;i<this.children.length;i++) {
		   results[this.children[i].name]={ distance: 1 };
	    }
	    for (var i=0;i<this.children.length;i++) {
		   var other=this.children[i].descendants();
		   for (var j in other) {
		   		if (!results[j]) {
					results[j]= { distance: other[j].distance+1 };
				}
				else {
					if (other[j].distance+1 < results[j].distance) {
						results[j]= { distance: other[j].distance+1 };
					}
				}
		   }
	    }	 	
		return results;
	}
	
	Item.prototype.isRootNode=function () {
		return (this.parents.length==0)
	}

    
	Item.prototype.ancestors=function ( ) {
		var results={};
	    for (var i=0;i<this.parents.length;i++) {
		   results[this.parents[i].name]={ distance: 1 };
	    }
	    for (var i=0;i<this.parents.length;i++) {
		   var other=this.parents[i].ancestors();
		   for (var j in other) {
		   		if (!results[j]) {
					results[j]= { distance: other[j].distance+1 };
				}
				else {
					if (other[j].distance+1 < results[j].distance) {
						results[j]= { distance: other[j].distance+1 };
					}
				}
		   }
	    }	 	
		return results;

	}
	
	
	Item.prototype.dependsOn=function(name,reason) {
		if (this.name==name) return;
		var other=dependency.item(name);
		// we can't make circular references, nor can we depend on ourselves.
		if (other.descendants()[this.name]==null) {
			 
            if (this.reasons[name]==null) {
				this.children.push(other);
				if (this.level < other.level+1) {
					setLevel(this,other.level+1);
				}
				other.parents.push(this);
				updateParentCount(other);
				this.reasons[name]=[ reason || 'unspecified dependency' ];
			}
			else {
				this.reasons[name].push(reason || 'unspecified dependency');
			}
		}
		else {
			throw new Error("circular reference: '"+this.name+"' declares dependency on item '"+name+"' which is already dependant on '"+this.name+"'");
		}
	}
	
	
		 
	
	dependency.item=function(name) {
		if (items[name]==null) { 
			items[name]=new Item(name);
		}
		return items[name];
	}
	
	dependency.itemsByLevel=function() {
		var result={};
		for (var name in items) {
			if (result[items[name].level]) {
				result[items[name].level].push(items[name]);
			}
			else {
				result[items[name].level]= [ items[name] ];
			}
		}
		return result;
	}

	dependency.itemsByParentCount=function() {
		var result={};
		for (var name in items) {
			if (result[items[name].parentCount]) {
				result[items[name].parentCount].push(items[name]);
			}
			else {
				result[items[name].parentCount]= [ items[name] ];
			}
		}
		return result;
	}
	
	return dependency;

})(dependency);


(function (dependency) {

var modulesInScripts={};
var scriptForModule={};


dependency.addModule=function(script,module){
	if (modulesInScripts[script]==null) modulesInScripts[script]=[];
	modulesInScripts[script].push(module); 
	if (scriptForModule[module]!=null) throw new Error("Module "+module+" was is twice.");
	scriptForModule[module]=script; 
}

dependency.modulesForScript=function(script) {
	return modulesInScripts[script];
}

dependency.scriptForModule=function(module) {
	return scriptForModule[module];
}

}) (dependency)

// RHINO code.




function readScripts(path) {
	var f=new java.io.File(path+"/scripts/");
	var scripts=f.listFiles();
	// find out which script files exist and which modules they declare
	for (var i=0;i< scripts.length; i++) {
		dependency.item(scripts[i].getPath());
		var s=readFile(scripts[i].getPath(),"UTF-8");
    
     
	    var m=/LIB\.module\(['"](.*?)['"]/g;
		var match=m.exec(s);
		while (match != null) {
			print("adding module "+scripts[i].getPath()+" "+match[1])
		    dependency.addModule(scripts[i].getPath(),match[1]);
		    match = m.exec(s);
		}
	}	
	// find all imports and add them as dependency.
	for (var i=0;i< scripts.length; i++) {
		var s=readFile(scripts[i].getPath(),"UTF-8");
		var r=/LIB.require\(['"](.*?)['"]/g
		var match=r.exec(s);
		while (match != null) {
			var dependsOnScript=dependency.scriptForModule(match[1]);
			if (dependsOnScript==null) throw new Error("Module '"+match[1]+"' is required but not found.");
		    print("adding dependency "+scripts[i].getPath()+" on module "+match[1]+" in "+dependsOnScript); 
		    dependency.item(scripts[i].getPath()).dependsOn(dependsOnScript);
		    match = r.exec(s);
		}
	}
}


function writeFile(name,s) {
	try {
		var f=new java.io.File(name);
		var writer=new java.io.BufferedWriter(new java.io.FileWriter(f));
		writer.write(s);
		writer.flush();
		writer.close();
	}
	catch(e) {
		print("exception "+e);
	}
}

// main script


// concat <appdir> output.js -> copies all files in <appdir>/scripts into one new file, output.js
if (arguments[0]=="concat") {
    
    readScripts(arguments[1])
    var arr=[];
	var items=dependency.itemsByLevel();
	var keys=[];
	for (var v in items) keys.push(v);
	keys=keys.sort();
	for (var i=0; i<keys.length;i++) {
		
		print("level "+keys[i]);
		for (var j=0; j<items[keys[i]].length;j++) {
			print("item "+items[keys[i]][j].name);
			var s=readFile(items[keys[i]][j].name,"UTF-8");
			arr.push(s);
		}
	}
	
	print("writing output to "+arguments[2]);
	writeFile(arguments[2],arr.join("\n"));
}


