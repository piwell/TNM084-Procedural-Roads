function convert(p){
    var i = Math.floor(p.x+width/2);
    var j = Math.floor(p.y+height/2);

    return i+j*width;
}

function convert3(p){
    var i = Math.floor(p.x+width/2);
    var j = Math.floor(p.y+height/2);

    return 3*i+3*j*width;
}

function sortIndex(array, func){
	var indices = [];//new Array(array.length);
	for(var i=0; i<array.length; i++){
		indices.push(i)
	}
	indices.sort(func);
	return indices;
}