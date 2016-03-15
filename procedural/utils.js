function convertCoords(p){
    var i = Math.floor(p.x+width/2);
    var j = Math.floor(p.y+height/2);

    return i+j*width;
}

function convertCoordsRGB(p){
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

function sqrdDist(p1, p2){
    return  (p1.x-p2.x)*(p1.x-p2.x)+
            (p1.y-p2.y)*(p1.y-p2.y);
}

function outsideArea(p){
    return (p.x <= -width/2.0)  || (p.x > width/2.0)  || 
    (p.y <= -height/2.0) || (p.y > height/2.0);
}

function inWater(p){
    return wMap.inWater(p);

}

function inIlegalArea(p){
    return outsideArea(p) || inWater(p);
}

function densityAt(p){
    if(outsideArea(p)){
        return 0;
    }else{
        return pMap.densityAt(p);
    }
}

function searchBestAngle(r, maxAngle, steps, valfunc, angles, values){
    var steps = maxAngle/0.025;
    for(var i=-steps; i<=steps; i++){
        angles.push(maxAngle*(i/steps));
        values.push(valfunc(r, angles[i+steps]));
    }

    function cmprFunc(i,j){
        return values[j]-values[i];
    }

    return sortIndex(values, cmprFunc);
}

function populationDensity(r, rot){
    var steps = 20;
    var length = 1;

    p = r.start.clone();
    d = r.dir.clone();
    d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot*Math.PI)

    if(r.highway){
        length = 10;
        steps = steps*length;
    }

    var totDensity = 0;
    for(var i=0; i<steps; i++){
        p.addScaledVector(d, length*r.l*(i/steps));
        density = densityAt(p);
        totDensity += density;
        p = r.start.clone();
    }
    return totDensity/steps;
}

function createIntersection(pos, color){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(pos);
    var intersectPoint = new THREE.Points(geometry, color);
    // scene.add(intersectPoint);

    crossings.push(pos);
}