var highwayContThresh = 0.1; 
var highwayToRoadThres = 0.0;
var highwayToRoadAngle = 0.5;
var highwaySearchAngle = 0.05;

var roadContThresh = 0.3;
var roadSearchAngle = 0.5;

function globalGoals(r){
    if(r.spawn){
    	if(r.highway)
    		return bestHighways(r);
    	return bestRoads(r);
    }
    return [];
}

function bestHighways(r){
	var segments = [];

	var angles = [];
	var values = [];

	var nr;
	index = searchBestAngle(r, highwaySearchAngle, 30, basic,
							angles, values);

	// for(var i=0; i<index.length; i++){
	if(values[index[0]] > highwayContThresh){
		nr = r.extendSegment(angles[index[0]], 0, true);
		segments.push(nr);

		// console.log(basic(r, 0.25));
		//TODO: Explore more angles
		if(basic(r, highwayToRoadAngle) > highwayToRoadThres){
			nr = r.extendSegment(highwayToRoadAngle, r.t+1, false);
			segments.push(nr);
		}

		if(basic(r, -highwayToRoadAngle) > highwayToRoadThres){
			nr = r.extendSegment(-highwayToRoadAngle, r.t+1, false);
			segments.push(nr);
		}
	}
	// }
	
	return segments;
}

function bestRoads(r){
	var segments = [];
	var angles = [];
	var values = [];

	var index = searchBestAngle(r, roadSearchAngle, 20, valueFunction,
								angles, values);

	var prevAngles = [];
	// if(values[index[0]] > roadContThresh){
		// prevAngles.push(angles[index[0]]);
		
		// nr = r.extendSegment(angles[index[0], r.t+1, false]);
		// segments.push(nr);

		for(var i=0; i<index.length; i++){
			if(values[index[i]] > roadContThresh ){
				prevAngles.push(angles[index[i]]);

				nr = r.extendSegment(angles[index[i]], r.t+1, false);
				segments.push(nr);
			}
		}	
	// }

	return segments;
}