function App5Controller(viewName)
{
	this.viewName=viewName;
	this.component=null;
}

App5Controller.prototype.init=function(text,success,failure)
{
	if (this.parser==null) {
		this.parser=App5.getGlobalParser();
	}
	var self=this;
	this.parser.parse(text, function(screen) {
		
		self.component=screen;
		screen.controller=self;
		
		//determine which models are needed. 
		var arr=[];
		if (self.models) {
			for (i=0;i<self.models.length;i++){
				arr.push(self.models[i]);
			}
		}
		// load the models and afterwards call onload.
		self.loadModels(arr,function () {
			if (self.onload) {
				self.onload(function () {
					success();
				},failure);
			}
			else {
				success();
			}
		},
		failure);
		
	},
	failure,
	App5.getApplication()          // the screen is added to existing application. 
	);
}

App5Controller.prototype.render=function(replace) {
	this.component.render(replace);
} 



App5Controller.prototype.activate=function(data,transition,location) 
{
	// do something to make the view visible again.
	if (this.onshow) {
		this.onshow(data);
	}
	// call the activate method on the screen. it handles the transition.
	this.component.activate(transition,location);
}

App5Controller.prototype.loadModels=function(arr,success,failure) {
	
	if (arr.length==0) {
		console.log("finished loading models");
		success();
	} 
	else {
		var self=this;
		var model=arr.shift();
		console.log("load model "+model);
		App5.loadModel(model,function (){
			self.loadModels(arr,success,failure);
		}, failure);
	}
}
