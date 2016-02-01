var segmentCounter;
var crossings = [];
var seg = [];

function roadSegment(p, d, t){
    this.start = p.clone();
    this.start.z = 0.49*dataT[convert3(this.start)+3];


    this.l = 30*Math.random()+20;
    var r = 1.0*Math.PI*Math.random()-0.5*Math.PI;

    this.dir = d.clone();
    // this.dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), r);

    this.end = this.start.clone();
    this.end.addScaledVector(this.dir, this.l);
    this.end.z = 0.49*dataT[convert3(this.end)+3];
    // console.log(0.4*da taT[convert3(this.end)+3]);  

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

function createRoads(){
    if(!queue.isEmpty()){
        r = queue.deq();
        accepted = localConstraints(r);

        if(accepted){
            scene.add(r.line);
            seg.push(r.line);
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