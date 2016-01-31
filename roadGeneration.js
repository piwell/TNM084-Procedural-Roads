var segmentCounter;
var crossings = [];

function roadSegment(p, d, t){
    this.start = p.clone();

    this.l = 30*Math.random()+10;
    var r = 1.0*Math.PI*Math.random()-0.5*Math.PI;

    this.dir = d.clone();
    // this.dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), r);

    this.end = this.start.clone();
    this.end.addScaledVector(this.dir, this.l);

    this.t = t;
    this.spawn = true;
    this.highway = false;

    this.updateLine = function(p, spawn){
        this.end = p.clone();
        this.l = this.start.distanceTo(this.end);
        this.spawn = spawn;

        this.geometry = new THREE.Geometry();
        this.geometry.vertices.push(this.start.clone(), this.end.clone());
        this.line = new THREE.Line(this.geometry, white);
    }

    this.updateLine(this.end, true);
} 

function firstSegment(){
    segmentCounter = 0;
    // var p = new THREE.Vector3(-width/2, -height/2, 100);
    var p = new THREE.Vector3(0, 0, 0);
    var d = new THREE.Vector3(0, 1, 0);
    queue.enq(new roadSegment(p, d, 0));
}

function createIntersection(r){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(r.end.clone());
    var intersectPoint = new THREE.Points(geometry, pointMaterial);
    scene.add(intersectPoint);

    crossings.push(r.end.clone());
}


function inIlegalArea(p){
    w = dataW[convert3(p)];
    return  (p.x < -width/2.0) || (p.x > width/2.0) || 
            (p.y < -height/2.0) || (p.y > height/2.0) ||
            w == 0;

}

function illegalArea(r){

    if(inIlegalArea(r.end)){        //inside illegal area
        //(if highway, extend)
        
        // prune
        var v = r.end.clone();
        var steps = 5;
        for(var i=1; i< steps; i++){
            v.addScaledVector(r.dir.clone().negate(),r.l*0.5*(i/steps));
            if(!inIlegalArea(v)){
                r.updateLine(v, true);
                console.log("illegal area, pruned")
                return true;
            }
            v = r.end.clone();
        }

        //rotate
        var rSteps = 10;
        v = r.start.clone();
        var d = r.dir.clone();
        for(var i=1; i<rSteps; i++){
            var rot = (i/rSteps)*0.5*Math.PI;
            d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot);
            v.addScaledVector(d,r.l);
            if(!inIlegalArea(v)){
                console.log("illegal area, rotated");
                r.dir = d;
                r.updateLine(v, true); 
                return true;
            }

            d = r.dir.clone();
            v = r.start.clone();
        
            d.applyAxisAngle(new THREE.Vector3(0, 0, 1), -rot);
            v.addScaledVector(r.dir,r.l);
            if(!inIlegalArea(v)){
                console.log("illegal area, rotated");
                r.dir = d;
                r.updateLine(v, true); 

                return true;
            }
            d = r.dir.clone();
            v = r.start.clone();
        }

        return false;
    }

    return true;
}

function intersections(r){
    var raycaster =  new THREE.Raycaster();
    raycaster.set(r.start.clone().addScaledVector(r.dir,0.001), r.dir, 0.001, r.l);

    var intersects = raycaster.intersectObjects(scene.children);

    //type 1: prune
    if(intersects.length>0){
        var intersect = intersects[0];
        if(intersect.distance <= 0.01*r.l){
        	// r.line.color = red;
        	// scene.add(r.line)
            return false;
        }
        if(intersect.distance < r.l){
            console.log("intersection, prune");
            r.updateLine(intersect.point, false)
            createIntersection(r);
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
        console.log("intersection, nearest");
        r.updateLine(p, false);
        return true; 
    }
    
    //type 3: extend
    if(intersects.length>0){
         if(intersect.distance < 1.2*r.l){
            console.log("intersection, extend");
            r.updateLine(intersect.point, false);
            createIntersection(r);
            return true;
         }
    }

    //noting wrong, return true
    return true;
}

function localConstraints(r){
    if(illegalArea(r)){
       return intersections(r);
    }
    return false;
}

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
function towardsPopulationDensity(r, rot){
	var segments = [];

	steps = 10; // on either side
	rotArray = [];
	for(var i=-steps; i<=steps; i++){
		rotArray.push(rot + 0.05*(i/steps)*Math.PI); 
	}

	function func(a,b){
		return populationDensity(r,rotArray[b],10)-populationDensity(r,rotArray[a],10);
	}
	index = sortIndex(rotArray, func);

	for(var i=0; i<2; i++){
		var d = r.dir.clone();
		d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotArray[index[i]]);
		segments.push(new roadSegment(r.end, d, r.t+1));
	}
	return segments;
} 

function newYork(){
    return  towardsPopulationDensity(r,0).concat(
            towardsPopulationDensity(r,0.5*Math.PI)).concat(
            towardsPopulationDensity(r,-0.5*Math.PI));
}


function globalGoals(r){
    var segments = [];
    // if(segmentCounter < 10){
    // r.spawn = false;
    if(r.spawn){
    	return newYork(r);
		// return towardsPopulationDensity(r, r.dir);

        // for(var i=0; i<2; i++){
            // segments.push(new roadSegment(r.end, r.dir, r.t+1));
        // }
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
    }else{
        clearInterval(intervalId);
        console.log("Oh what a pretty city");
    }
}