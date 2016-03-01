function waterMap(w, h, scale, waterlevel){
	noise.seed(Math.random());

	this.data = new Uint8Array(w*h);
	this.level = waterlevel;

	for(var i=0; i<w; i++){
		for(var j=0; j<h; j++){
			value = (1+noise.simplex2(i/scale, j/scale))/2;
			value += 0.5*(1+noise.simplex2(i/(0.5*scale), j/(0.5*scale)))/2;
			value /= 2.0;

			this.data[i+j*w] = Math.floor(255*value);
		}
	}

	this.changeWaterlevel = function(waterlevel){
		this.level = waterlevel;
	}

	this.inWater = function(p){
		return (this.data[convertCoords(p)] < this.level);
	}

}

function populationDensityMap(w, h, scale){
	noise.seed(Math.random());

	this.data = new Uint8Array(w*h);
	var x=0, y=0, maxD = 0;
	for(var i=0; i<w; i++){
		for(var j=0; j<h; j++){
			value = (1+noise.simplex2(i/scale, j/scale))/2;
			value += 0.5*(1+noise.simplex2(i/(0.5*scale), j/(0.5*scale)))/2;
			value += 0.25*(1+noise.simplex2(i/(0.25*scale), j/(0.25*scale)))/2;
			value /= 2.5;

			this.data[i+j*w] = Math.floor(255*value);
			if(value > maxD){
				x = i; y=j; maxD = value;
			}
		}	
	}

	this.center = new THREE.Vector3(x-w/2, y-h/2, 0);

	this.densityAt = function(p){
		return this.data[convertCoords(p)]/255.0;
	}
}

function textureMap(w, h, waterMap, popMap, showPop){
	var data = new Uint8Array(w*h*3);

	for(var i=0; i<w; i++){
		for(var j=0; j<h; j++){
			var p = {x:i-w/2, y:j-h/2};

			if(waterMap.inWater(p)){
				data[3*(i+j*w)+0] = 60;
				data[3*(i+j*w)+1] = 60;//0.5*popMap.data[i+j*w];
				data[3*(i+j*w)+2] = 80+0.4*waterMap.data[i+j*w];
			}else{
				data[3*(i+j*w)+0] = 60;
				data[3*(i+j*w)+1] = 40+0.4*popMap.data[i+j*w];
				data[3*(i+j*w)+2] = 60;
			}
		}
	}

	this.tex = new THREE.DataTexture(data, w, h, THREE.RGBFormat);
	this.tex.needsUpdate = true;
	this.material = new THREE.MeshPhongMaterial({map: this.tex, side: THREE.DoubleSide});
}

function displationMap(w, h){

}