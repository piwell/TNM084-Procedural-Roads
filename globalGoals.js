function populationDensity(r, rot, steps){
	p = r.start.clone();
	d = r.dir.clone();
	d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot*Math.PI)

	var density = 0;
	for(var i=0; i<steps; i++){
		p.addScaledVector(d,r.l*(i/steps));
		density += dataP[convert(p)];
		p = r.start.clone();
	}
	return density;
}

function basic(r, rot){
	return populationDensity(r, rot, 10)/(255*10);
}

function newYork(r, rot){
	   if(rot == 0 || Math.abs(rot) == 0.5){
	   		return 1.0;
	   }else if(Math.abs(rot) == 0.25 || Math.abs(rot) == 0.75){
	   		return 0.5;
	   }
	   return 0.0;
}

function paris(r, rot){
	   
}

function sanFran(r, rot){
	   
}

function valueFunction(r, rot){
	return (basic(r, rot)*newYork(r,rot));
}

//num of roads or threshold
function bestRoadSegment(r, rot){
	var segments = [];

	//TODO: constant steps, decide possible angles
	var steps = 10; // on either side
	var angle = 0.25;
	var numSegments = 1;
	var t = r.t+1;
	var highway = false;

	if(r.highway && rot == 0){
		steps = 2; // on either side
		angle = 0.05;
		numSegments = 1;
		t = 0;
		highway = true;
	}

	rotArray = [];
	for(var i=-steps; i<=steps; i++){
		rotArray.push(rot + angle*(i/steps)); 
	}
	// console.log(rotArray);
	function cmprFunc(i,j){
		return valueFunction(r, rotArray[j])-valueFunction(r, rotArray[i]);
	}
	index = sortIndex(rotArray, cmprFunc);


	for(var i=0; i<numSegments; i++){
		if( valueFunction(r, rotArray[index[i]]) > 0.0){
			var d = r.dir.clone();
			d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotArray[index[i]]*Math.PI);
			segments.push(new roadSegment(r.end, d, t, highway));
	}}
	return segments;
} 


function globalGoals(r){
    if(r.spawn){
    	return  bestRoadSegment(r,0).concat(
            	bestRoadSegment(r,0.5)).concat(
            	bestRoadSegment(r,-0.5));
    }
    return [];
}