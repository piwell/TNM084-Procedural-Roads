function populationDensity(r, rot, steps){
	p = r.start.clone();
	d = r.dir.clone();
	d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot)

	var density = 0;
	for(var i=0; i<steps; i++){
		p.addScaledVector(d,r.l*(i/steps));
		density += dataP[convert(p)];
		p = r.start.clone();
	}
	return density;
}


//num of roads or threshold
function bestRoadSegment(r, rot){
	var segments = [];

	steps = 10; // on either side
	rotArray = [];
	for(var i=-steps; i<=steps; i++){
		rotArray.push(rot + 0.05*(i/steps)*Math.PI); 
	}

	function cmprFunc(i,j){
		return populationDensity(r,rotArray[j],10)-populationDensity(r,rotArray[i],10);
	}
	index = sortIndex(rotArray, cmprFunc);

	console.log(populationDensity(r,rotArray[index[0]],10) + " " +populationDensity(r,rotArray[index[1]],10));

	for(var i=0; i<2; i++){
		var d = r.dir.clone();
		d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotArray[index[i]]);
		segments.push(new roadSegment(r.end, d, r.t+1));
	}
	return segments;
} 

function newYork(){
    return  bestRoadSegment(r,0).concat(
            bestRoadSegment(r,0.5*Math.PI)).concat(
            bestRoadSegment(r,-0.5*Math.PI));
}


function globalGoals(r){
    if(r.spawn){
    	return newYork(r);
    }
    return segments;
}