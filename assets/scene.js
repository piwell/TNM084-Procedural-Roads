


var fragShaderSource = "\
precision highp float;\
uniform vec4 u_color;\
void main(void) {\
gl_FragColor = u_color;\
}\
";

var vtxShaderSource = "\
attribute vec3 a_position;\
uniform vec4 u_color;\
uniform mat4 u_mvMatrix;\
uniform mat4 u_pMatrix;\
void main(void) {\
gl_Position = u_pMatrix * u_mvMatrix * vec4(a_position, 1.0);\
}\
";

var gl, vbuf,ibuf;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvMatrixStack = [];
var lastTime = 0;

mvMatrix =
          [1, 0, 0, 0
          , 0, 1, 0.00009999999747378752, 0,
          0, -0.00009999999747378752, 1, 0,
          0, 1.3552527156068805e-20, -8, 1];
pMatrix =
          [2.4142136573791504, 0, 0, 0,
          0, 2.4142136573791504, 0, 0,
          0, 0, -1.0020020008087158, -1,
          0, 0, -0.20020020008087158, 0];

function get_shader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMUniform, false, mvMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function initGl() {
    var canvas = document.getElementsByTagName('canvas')[0];
    gl = canvas.getContext("experimental-webgl",{preserveDrawingBuffer: true});
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initShaders() {
    var vertexShader = get_shader(gl.VERTEX_SHADER, vtxShaderSource);
    var fragmentShader = get_shader(gl.FRAGMENT_SHADER, fragShaderSource);
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    shaderProgram.aposAttrib = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(shaderProgram.aposAttrib);
    shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "u_color");
    shaderProgram.pMUniform = gl.getUniformLocation(shaderProgram, "u_pMatrix");
    shaderProgram.mvMUniform = gl.getUniformLocation(shaderProgram, "u_mvMatrix");
}

function initScene() {
    gl.enable(gl.DEPTH_TEST);
    gl.uniformMatrix4fv(shaderProgram.pMUniform, false, new Float32Array(pMatrix));
    gl.uniformMatrix4fv(shaderProgram.mvMUniform, false, new Float32Array(mvMatrix));

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initBuffer(glELEMENT_ARRAY_BUFFER, data) {
    var buf = gl.createBuffer();
    gl.bindBuffer(glELEMENT_ARRAY_BUFFER, buf);
    gl.bufferData(glELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buf;
}

function initBuffers(vtx, idx) {
    vbuf = initBuffer(gl.ARRAY_BUFFER, vtx);
    ibuf = initBuffer(gl.ELEMENT_ARRAY_BUFFER, idx);
    gl.vertexAttribPointer(shaderProgram.aposAttrib, 3, gl.FLOAT, false, 0, 0);
}

function unbindBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}


function tick(){
    requestAnimFrame(tick);
    update();
    unbindBuffers();
    //animate();
}

function init() {
    initGl();
    initShaders();    
    initScene();

    tick();
}