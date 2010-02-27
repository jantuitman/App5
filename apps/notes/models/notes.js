function notes()
{
   this.listeners=[];
   this.data=[
               { title: "Hello World!", text:"Welcome to the App5 notes example"}, 
               {title: "That's nice" }, 
               {title: "What?"},
               {title: "Note 4"},
               {title: "Note 5"},
               {title: "Note 6"},
               {title: "Note 7"},
               {title: "Note 8"},
               {title: "Note 9"},
               {title: "Note 10"},
               {title: "Note 11"},
               {title: "Note 12"},
               {title: "Note 13"},
               {title: "Note 14"},
               {title: "Note 15"},
               {title: "Note 16"},
               {title: "Note 17"},
               {title: "Note 18"},
               {title: "Note 19"},
               {title: "Note 20"},
   ];	
}

notes.prototype=new App5Model();


App5.models['notes']=notes;