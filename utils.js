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

function createIntersection(r, color){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(r.end.clone());
    var intersectPoint = new THREE.Points(geometry, color);
    scene.add(intersectPoint);

    crossings.push(r.end.clone());
}

function sqrdDist(p1, p2){
    return  (p1.x-p2.x)*(p1.x-p2.x)+
            (p1.y-p2.y)*(p1.y-p2.y);
}