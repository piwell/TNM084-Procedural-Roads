var segments = [];
var newSegments = [];
var drawnSegments = 0;

function roadSegment(t, p){
    // var x = 2.0*Math.random()-1.0;
    // var y = 2.0*Math.random()-1.0;

    // while(x*x+y*y>0.1){
    //     x = 2.0*Math.random()-1.0;
    //     y = 2.0*Math.random()-1.0;
    // }

    this.start = {x: p.x, y: p.y}
    this.l = 0.2*(Math.random());
    this.r = 2.0*Math.PI*Math.random();
    this.end = {	x: this.start.x + this.l * Math.cos(this.r),
    			 	y: this.start.y + this.l * Math.sin(this.r)};

    this.vtx = new Float32Array(
                    [this.start.x, this.start.y, 0.0,
                       this.end.x,   this.end.y, 0.0]
                );
    this.t = t;
}


var r = 0;
function drawLine(rs){
    // var vtx = new Float32Array(
    //     [0.0, 0.0, 0.0, 
    //      0.0, 1.0, 0.0]
    // );

    vtx = rs.vtx;
    var idx = new Uint16Array([0, 1]);
    initBuffers(vtx, idx);
    gl.lineWidth(1.0);
    gl.uniform4f(shaderProgram.colorUniform, 1, 1, 1, 1);
    setMatrixUniforms();
    gl.drawElements(gl.LINES, 2, gl.UNSIGNED_SHORT, 0);
}

function animate() {
    var timeNow = new Date().getTime();
    if(lastTime != 0){
        var elapsed = timeNow - lastTime;
        r += (90 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

function drawScene(){
	// while(queue.size() > 0){
	// 	r = queue.deq();
	// 	drawLine(r);
	// 	segments.push(r);

	// 	while()
	// }

    // for(var i=0; i<newSegments.length; i++){
    //     r = newSegments[i];
    //     drawLine(r);
    //     segments.push(r);
    // }
    // newSegments = [];
    var oldDrawnSegments = drawnSegments;
    for(var i=oldDrawnSegments; i<segments.length; i++){
    	drawLine(segments[i]);
    }
    drawnSegments = segments.length;
}

function update(){
    // if(segments.length < 1000){
        // segments.push(new roadSegment());
        // queue.enq(new roadSegment(t)); 
        // console.log(queue.length());
        // newSegments.push(new roadSegment(t));
    // }


    // while()

    drawScene();
    animate();
}

function localConstraint(r){

}

function createRoads(){
	//console.log(queue.size());
	if(queue.size()>0){
		r = queue.deq()
		accepted = localConstraint(r)
		// if(accepted){
			segments.push(r);
			// console.log(r.t+1);
			//global constraints
			if(segments.length < 1000){
				// p = {x: r.end.x, y: r.p.y+r.ly}
				queue.enq(new roadSegment(r.t+1,r.end));
			}
		// }
	}
}
setInterval(createRoads,0);
// setInterval(drawScene,1000);