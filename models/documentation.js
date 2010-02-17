function documentation()
{
   this.listeners=[];
   this.data= [{
      "title":"Welcome to App5",
      "text":"Welcome to App5. App5 is a javascript library for making Apps/ GUI's.\u000aApps can be:\u000a\u000a- iphone Apps\u000a- iPad Apps\u000a- web browser Apps\u000a\u000aFor a demo \"watch this youtube movie\":(http://www.youtube.com/watch?v=TrIyEHIzrwg)\u000a\u000a\u000a\u000aYou can write just javascript! The library will do a lot of gui work for you: it will look like an iphone app on your iPhone, and in the browser it will look good too. This documentation site is written in App5.\u000a\u000aApp5 applications are highly structured in a model/view/controller/component like way. This is gives a clear structure to your code. You can put reusable HTML inside components and reuse them over more than one project.\u000a\u000aApp5 is licensed under the Creative Commons Attribution 3.0 license. So it's free to use!\u000a\u000aApp5 is currently finished for 90% (that explains the rough edges you are seeing right now ;-). Keep checking out this site for updates."
   },
   {
      "title":"Concepts - models"
   },
   {
      "title":"Concepts - views"
   },
   {
      "title":"Concepts - controllers"
   },
   {
      "title":"Concepts - components"
   },
   {
      "title":"App5 in the browser"
   },
   {
      "title":"Making native apps"
   },
   {
      "title":"Download"
   },
   {
      "title":"API Docs"
   },
   {
      "title":"FAQ"
   }
]

}

documentation.prototype=new App5Model();


App5.models['documentation']=documentation;