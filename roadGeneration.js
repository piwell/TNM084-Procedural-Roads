var segmentCounter;
var crossings = [];

function roadSegment(p, d, t){
	this.start = p.clone();

	this.l = 40*Math.random()+10;
	var r = 1.0*Math.PI*Math.random()-0.5*Math.PI;

	this.dir = d.clone();
	this.dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), r);

	this.end = this.start.clone();
	this.end.addScaledVector(this.dir, this.l);

	this.t = t;
	this.spawn = true;

	this.updateLine = function(){
		this.geometry = new THREE.Geometry();
		this.geometry.vertices.push(this.start.clone(), this.end.clone());
		this.line = new THREE.Line(this.geometry, white);
	}

	this.updateLine();
} 

function firstSegment(){
	segmentCounter = 0;
	// var p = new THREE.Vector3(-width/2, -height/2, 1);
	var p = new THREE.Vector3(0, 0, 100);
	var d = new THREE.Vector3(0, 1, 0);
	queue.enq(new roadSegment(p, d, 0));
}

function createIntersection(r, p, t){
	r.end = p.clone(); 			//intersection.point.clone();
	r.l = r.end.distanceTo(p); 	//intersection.distance;
	r.spawn = false;
	r.updateLine()

	if(t){
		var geometry = new THREE.Geometry();
		geometry.vertices.push(r.end.clone());
		var intersectPoint = new THREE.Points(geometry, pointMaterial);
		scene.add(intersectPoint);

		crossings.push(r.end.clone());
	}
	// console.log(intersection.object);
	// console.log(intersection.parent);
	// intersection.parent.intersections.push(r.end.clone());
}

//work on it baby
function localConstraints(r){

		var x = r.end.x;
		var y = r.end.y;

		var i = Math.floor(x+width/2);
		var j = Math.floor(y+height/2);
		w = (dataW[(3*i)+3*j*width]>0)?1:0;
		console.log(waterMap[i][j] + " " + w);
		if(w == 0 ){
			r.spawn = false;
			return false;
		}

		var raycaster =  new THREE.Raycaster();
		raycaster.set(r.start.clone().addScaledVector(r.dir,0.001), r.dir, 0.001, r.l);
		var intersects = raycaster.intersectObjects(scene.children);
		if(intersects.length>0){
			var intersect = intersects[0];
			// console.log(inter.distance);
			if(intersect.distance <= 0.001){
				return false;
			}
			if(intersect.distance < r.l){
				//type 1: prune
				createIntersection(r, intersect.point, true);
				return true;
			 }
		}
			 //type 2: find nearest intersection
			 var mind = 10000;
			 var p;
			 for(var i=0; i< crossings.length; i++){
			 	var d = (r.end.x-crossings[i].x)*(r.end.x-crossings[i].x)+
			 			(r.end.y-crossings[i].y)*(r.end.y-crossings[i].y);
			 	if(mind > d){
			 		mind = d;
			 		p = r.end.clone();
			 	}	

			 }
			 if(d < 1.2*1.2*r.l*r.l){
			 	// console.log(d)
			 	createIntersection(r, p, false);
			 	return true; 
			 }
		if(intersects.length>0){
			 if(intersect.distance < 1.2*r.l){
				createIntersection(r, intersect.point, true);
				return true;
			 }

			 // return false;
		}
		// console.log(intersects.length);
		// if(intersects.length>0){
		// 	console.log(intersects[0].object);
		// }
		return true;
	}

	// return (intersects.length > 0) ? false:true;
// }

function globalGoals(r){
	var segments = [];
	// if(segmentCounter < 10){
	if(r.spawn){
		for(var i=0; i<2; i++){
			segments.push(new roadSegment(r.end, r.dir, r.t+1));
		}
	}
	// }

	return segments;
}

function createRoads(){
	if(!queue.isEmpty()){
		r = queue.deq();
		accepted = localConstraints(r);

		if(accepted){
			scene.add(r.line);
			segmentCounter++;
			// console.log(segmentCounter); 
			segments = globalGoals(r);
			for(var i=0; i<segments.length; i++){
				queue.enq(segments[i]);
			}
		}
	}
}