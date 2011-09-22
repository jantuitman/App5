App5.module('browser',function (globals) {

	// Browser capabilities
	globals.vendor =  (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
		'opera' in window ? 'O' : '',

	globals.has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
	globals.hasTouch = 'ontouchstart' in window,
	globals.hasTransform = globals.vendor + 'Transform' in document.documentElement.style,
	globals.isAndroid = (/android/gi).test(navigator.appVersion),
	globals.isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	globals.isPlaybook = (/playbook/gi).test(navigator.appVersion),
	globals.hasTransitionEnd = (globals.isIDevice || globals.isPlaybook) && 'onwebkittransitionend' in window	
	
	
});