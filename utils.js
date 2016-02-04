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

function createIntersection(v, color){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v);
    var intersectPoint = new THREE.Points(geometry, color);
    scene.add(intersectPoint);

    crossings.push(v);
}

function sqrdDist(p1, p2){
    return  (p1.x-p2.x)*(p1.x-p2.x)+
            (p1.y-p2.y)*(p1.y-p2.y);
}

function outsideArea(p){
    return (p.x <= -width/2.0)  || (p.x > width/2.0)  || 
    (p.y <= -height/2.0) || (p.y > height/2.0);
}

function inWater(p){
    return dataW[convert3(p)] == 0;

}

function inIlegalArea(p){
    return outsideArea(p) || inWater(p);
    // w = dataW[convert3(p)];
    // return  (p.x <= -width/2.0)  || (p.x > width/2.0)  || 
    //         (p.y <= -height/2.0) || (p.y > height/2.0) ||
    //         w == 0;

}

function densityAt(p){
    if(outsideArea(p)){
        return 0;
    }else{
        return dataP[convert(p)];
    }
}