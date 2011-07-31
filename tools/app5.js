
var APP5_HOME=java.lang.System.getenv("APP5_HOME");
if (APP5_HOME==null) {
	print("ERROR: APP5_HOME environment variable is missing!");
	quit();
}
else APP5_HOME=""+APP5_HOME; // convert to String.


var options={};
var args=[];
for (var i=0; i<arguments.length; i++) {
	if (arguments[i].indexOf("-")==0) {
		var key=arguments[i].substr(1);
		var value=arguments[i+1];
		options[key]=value;
		i=i+1;
	}
	else {
		args.push(arguments[i]);	
	}
}



/*
 server [dir] [basedir]
 server [basedir]
 server
 if called without arguments, the current dir is served, the app5 basedir is loaded from environment variable.
 if called with 1 argument, the specified dir is served, and the app5 basedir is perhaps loaded from environment variable.
 if called with 2 arguments, the server first looks in the first dir, looks in specified basedir.
 
 options: -port <portnumber>

*/
if (args[0]=="server") {

	var c = JavaImporter(
	org.mortbay.jetty.Handler,
	org.mortbay.jetty.Server,
	org.mortbay.jetty.handler.DefaultHandler,
	org.mortbay.jetty.handler.HandlerList,
	org.mortbay.jetty.handler.ResourceHandler,
	org.mortbay.log.Log);
	   
	   
	with (c) {
	   var welcomeFiles=java.lang.reflect.Array.newInstance(java.lang.String, 1);
	   welcomeFiles[0]="index.html";
	   
	   
	   var server;
	   if (options['port']==null) {
	   	server=new Server(8888);
	   }
	   else {
	   	server=new Server(parseInt(options['port'],10));
	   }
	   
	   var resourceHandler=new ResourceHandler();
	   
	   var dir=".";
	   if (args[1]) {
	   		dir=args[1];
	   		if (dir.indexOf("www")<0) {
	   			print("WARNING: directory specified does not end on www. Are you sure it is the right dir?");
	   		}
	   }
	   // check if dir wasn't specified and contains www. if so, automaticly assume that the user wants to serve <www>
	   if (dir=="." && (new java.io.File(dir+"/www")).exists() ) {
	   		dir=dir+"/www";
	   }
	   
	   resourceHandler.setResourceBase(dir);
	   resourceHandler.setWelcomeFiles(welcomeFiles);

	   var handlers=new HandlerList();
	   var app5location=".";
	   if (args[2]) {
	   		app5location=args[2];
	   }
	   else {
	   		if (java.lang.System.getenv("APP5_HOME")!=null) {
	   			app5location=""+java.lang.System.getenv("APP5_HOME")+"/lib";
	   		}
	   		else {
	   			print("ERROR: Cannot find basedir. Have you set the APP5_HOME environment variable?");
	   			quit();
	   		}
	   }
	   print("serving from: "+resourceHandler.getResourceBase()+"\nand :"+app5location+"\n");
	   var arr=java.lang.reflect.Array.newInstance(Handler, 3);
	   arr[0]=resourceHandler;
	   arr[1]=new ResourceHandler();
	   arr[1].setResourceBase(app5location);
	   arr[1].setWelcomeFiles(welcomeFiles);
	   arr[2]=new DefaultHandler();
	   handlers.setHandlers(arr);
	   server.setHandler(handlers);
	   
	   server.start();
	   server.join();
	}
	quit();
}

if (args[0]=="generate") {
	if (args[1]) {
	    var c = JavaImporter(java.io.File,org.apache.commons.io.FileUtils);
	    
	    with(c) {
			var cur=new File("./"+args[1]+"/www");
			cur.mkdirs();
			var scripts=new File("./"+args[1]+"/www/scripts");
			FileUtils.copyFile(new File(APP5_HOME+"/lib/index.html"),new File(cur,"/index.html"));
			scripts.mkdirs();
			FileUtils.copyFile(new File(APP5_HOME+"/lib/scripts/main.js"),new File(scripts,"/main.js"));
			var target=new File("./"+args[1]+"/target");
			target.mkdirs();
			print("made directory "+args[1]+"/www with index.html and main.js script. Also made target directory for output later on. Happy coding!");	
	    
	    
	    }
	    
	}
	quit();
}

if (args[0]=="ios") {

	quit();
}

if (args[0]=="production") {
    print("TODO : current version of this command doesn't do minify yet.");
	var c = JavaImporter(java.io.File,org.apache.commons.io.FileUtils);
	with(c) {
		var targetwww=new File("./target/www");
		FileUtils.copyDirectory(new File(APP5_HOME+"/lib"),targetwww);
		FileUtils.copyDirectory(new File("./www"),targetwww);
		var ios_wrapper=new File("./target/ios_wrapper");
		if (ios_wrapper.exists()) {
			var targetwww=new File("./target/ios_wrapper/www");
			FileUtils.copyDirectory(new File("./target/www"),targetwww);
		}
	
	}    
	quit();
}

if (args[0]=="help") {

	print("app5 server [dir [basedir]] - starts a web server. if no dir specified the current dir (or current_dir/www) is used.");
	print("app5 generate [name] - creates a new dir with an empty application in it.");
	print("app5 ios - creates/updates IOS wrapper in the target directory.");
	print("app5 production - creates www with minimized javascript in the target directory. Updates ios wrapper in target to be the production.");
	print("\nVisit http://jantuitman.github.com/App5/#pages/tools.txt for full command options.");
	quit();
}

print("Error: Unknown option. please type\n\napp5 help\n\n to show available options."); 

