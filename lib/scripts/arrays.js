App5.module('arrays',function (globals) {

	var arrays=globals;

	arrays.indexOf=function (arr,el) {
		for (var i=0;i<arr.length;i++) {
			if (arr[i]===el) {
				return i;
			}
		}
		return -1;
	}
	
	arrays.remove=function (arr,el) {
		var i=arrays.indexOf(arr,el);	
		if (i > -1 ) {
			return arr.splice(i,1);
		}	
		else {
			return arr;
		}
	}


});
