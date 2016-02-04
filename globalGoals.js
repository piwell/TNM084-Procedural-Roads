function populationDensity(r, rot, steps){
	p = r.start.clone();
	d = r.dir.clone();
	d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot*Math.PI)
	var l=1;
	if(r.highway){
		l=10;
		steps = 100;
	}

	var density = 0;
	for(var i=0; i<steps; i++){
		p.addScaledVector(d,l*r.l*(i/steps));
		density += densityAt(p);//dataP[convert(p)];
		// createIntersection(p,pointMaterialBlue);
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
	// if(r.highway)
		// return basic(r,rot);
	return (basic(r, rot)*newYork(r,rot));
}

function angles(angle, prevAngle){
	function cmprFunc(i,j){
		return Math.abs(prevAngle[i]-angle)-Math.abs(prevAngle[j]-angle);
	}
	index = sortIndex(prevAngle, cmprFunc);
	// console.log(prevAngle);
	// console.log(index);
	// console.log(Math.abs(prevAngles[index[0]]-angle) + " " + Math.abs(prevAngles[index[1]]-angle)); 
	// console.log(prevAngles);
	return Math.abs(prevAngle[index[0]]-angle);
}

function bestSegment(r){
	var segments = [];
	var highway = r.highway;


	var angleSteps = 10;
	var maxAngle   = 0.5;
	var t = r.t+1;

	if(r.highway){
		maxAngle = 0.5;
		t = 0;
	}


	angleArray = [];
	valueArray = [];
	for(var i=-angleSteps; i<=angleSteps; i++){
		angleArray.push(maxAngle*(i/angleSteps));
		valueArray.push(valueFunction(r, angleArray[i+angleSteps], 10));
	}
	// console.log(angleArray);
	function cmprFunc(i,j){
		return valueArray[j] - valueArray[i]; //valueFunction(r, angleArray[j])-valueFunction(r, angleArray[i]);
	}
	index = sortIndex(angleArray, cmprFunc);
	prevAngles = [];
	if( valueArray[index[0]] > 0.0){
			prevAngles.push(angleArray[0]);

			var d = r.dir.clone();
			d.applyAxisAngle(new THREE.Vector3(0, 0, 1), angleArray[index[0]]*Math.PI);
			segments.push(new roadSegment(r.end, d, t, highway));	
	}else{
		return segments;
	}
	// highway = false;
	// console.log(index);
	// console.log(" ");
	for(var i=0; i<angleArray.length; i++){
		// console.log(angleArray[i] + " " + valueArray[i]*(angles(angleArray[i],prevAngles)/0.5));
		// console.log(valueArray[i]*(angles(angleArray[i],prevAngles)/0.5));
		if(valueArray[i]*(angles(angleArray[i],prevAngles)/0.5) > 0.2){
			prevAngles.push(angleArray[i]);

			var d = r.dir.clone();
			d.applyAxisAngle(new THREE.Vector3(0, 0, 1), angleArray[i]*Math.PI);
			var road = new roadSegment(r.end, d, r.t+1, false);
			// if(r.highway){
			// 	road.line.material = blue;
			// 	scene.add(road.line);
			// }

			segments.push(new roadSegment(r.end, d, r.t+1, false));
		}
	}
	// console.log(segments.length);
	// console.log(" ");
	return segments;
}

// //num of roads or threshold
// function bestRoadSegment(r, rot){
// 	var segments = [];

// 	//TODO: constant steps, decide possible angles
// 	var steps = 10; // on either side
// 	var angle = 0.25;
// 	var numSegments = 1;
// 	var t = r.t+1;
// 	var highway = false;

// 	if(r.highway && rot == 0){
// 		steps = 20; // on either side
// 		angle = 0.40;
// 		numSegments = 4;
// 		t = 0;
// 		highway = true;
// 	}

// 	rotArray = [];
// 	for(var i=-steps; i<=steps; i++){
// 		rotArray.push(rot + angle*(i/steps)); 
// 	}
// 	// console.log(rotArray);
// 	function cmprFunc(i,j){
// 		return valueFunction(r, rotArray[j])-valueFunction(r, rotArray[i]);
// 	}
// 	index = sortIndex(rotArray, cmprFunc);

// 	var s = 0;
// 	var a
// 	for(var i=0; i<rotArray.length; i++){
// 		console.log(valueFunction(r, rotArray[i]));	
// 	}
// 	for(var i=0; i<numSegments; i++){
// 		if( valueFunction(r, rotArray[index[i]]) > 0.2){
// 			var d = r.dir.clone();
// 			d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotArray[index[i]]*Math.PI);
// 			segments.push(new roadSegment(r.end, d, t, highway));
// 	}}
// 	return segments;
// } 


function globalGoals(r){
    if(r.spawn){
    	return bestSegment(r);
    	// return  bestRoadSegment(r,0).concat(
     //        	bestRoadSegment(r,0.5)).concat(
     //        	bestRoadSegment(r,-0.5));
    }
    return [];
}