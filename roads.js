var segments = [];
var newSegments = [];

function roadSegment(){
    var x = 2.0*Math.random()-1.0;
    var y = 2.0*Math.random()-1.0;

    while(x*x+y*y>1.0){
        x = 2.0*Math.random()-1.0;
        y = 2.0*Math.random()-1.0;
    }

    this.vtx = new Float32Array(
                    [0.0, 0.0, 0.0,
                       x,   y, 0.0]
                );
}


var r = 0;
function drawLine(rs){
    var vtx = new Float32Array(
        [0.0, 0.0, 0.0, 
         0.0, 1.0, 0.0]
    );
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
    for(var i=0; i<newSegments.length; i++){
        drawLine(newSegments[i]);
    }
    newSegments = [];
}

function update(){
    if(segments.length < 1000){
        segments.push(new roadSegment());
        newSegments.push(segments[segments.length-1]);
    }
    drawScene();
    animate();
}