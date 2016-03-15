var length = 20;

var crossings = [];
var placedSegments = [];

function roadSegment(p, d, t, highway){
    this.start = p.clone();
    this.highway = highway;

    this.l = length+(varyingRoadLength/100.0)*length*(2*Math.random()-1);

    this.dir = d.clone();

    this.end = this.start.clone();
    this.end.addScaledVector(this.dir, this.l);

    this.t = t;
    this.spawn = true;
    

    this.updateLine = function(end, spawn){
        this.end = end.clone();
        this.l = this.start.distanceTo(this.end);
        this.spawn = spawn;

        this.geometry = new THREE.Geometry();
        this.geometry.vertices.push(this.start.clone(), this.end.clone());
        if(!this.highway){
            this.line = new THREE.Line(this.geometry, roadColor);
        }else{
            this.line = new THREE.Line(this.geometry, highwayColor);
        }
    }

    this.extendSegment = function(rot, t, highway){
        var d = r.dir.clone();
        d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot*Math.PI);
        return new roadSegment(r.end, d, t, highway);
    }

    this.updateLine(this.end, true);
} 

function firstSegment(center){
    segmentCounter = 0;

    var d = new THREE.Vector3(0, 1, 0);
    var r = new roadSegment(center, d, 0, true);
    
    angles = [];
    values = [];
    index = searchBestAngle(r, 2.0, 100, basic, angles, values);


    for(var i=0; i<angles.length; i++){

        r.dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), angles[index[0]]*Math.PI);
        end = center.clone();
        end.addScaledVector(r.dir, r.l);
        r.updateLine(end, true);

        queue.enq(r);
        d = d.clone().negate();
        r = new roadSegment(center, d, 0, true); 
        queue.enq(r);

        if(values[i] < highwayContThresh){
            break;
        }
    }
}

function createRoads(){
    if(!queue.isEmpty()){
        r = queue.deq();
        accepted = localConstraints(r);
        
        if(accepted){
            scene.add(r.line);
            placedSegments.push(r.line);
            segmentCounter++;
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