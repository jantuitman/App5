var layout = {
	  'toolbarColor'      :  '#204000'
	, 'toolbarColor2'     :  '#80c000'
	, 'buttonColor'       :  '#408000'
	, 'buttonColor2'      :  '#80e000'
	, 'buttonBorderColor' :  '#ffffff'
	, 'toolbarTextColor'  :  '#ffffff'
	, 'windowColor'       :  '#ffffff' 
	, 'textColor'         :  '#000000'
}

var settings= { 
	layout: layout
	, renderStyle: App5.RS_LARGE
/*	
	, preferred_sizes: [
		{ minX: 800 , minY: 400,  width:600, height: 350 , sidebar: 200  },
		{ minX: 800 , minY: 500,  width:600, height: 450 , sidebar: 200  },
		{ minX: 1200, minY: 400,  width:900, height: 350 , sidebar: 275  },
		{ minX: 1200, minY: 500,  width:900, height: 450 , sidebar: 275  },
		{ minX: 1200, minY: 800,  width:900, height: 600 , sidebar: 275  }
	]
*/
, preferred_sizes: [
	{ minX: 800 , minY: 1,  width:600, height: 500 , sidebar: 200  },
	{ minX: 1200, minY: 1,  width:900, height: 500 , sidebar: 275  }
  ]
	, mode: "debug"	
};


$(document).ready(function() {
	
     	App5.runApplication("App5Documentation","documentation",settings);
})