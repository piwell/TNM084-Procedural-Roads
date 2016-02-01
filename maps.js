function createMaps(){
	var geometry = new THREE.PlaneBufferGeometry(width,height,width,height);
	// var data = new ArrayBuffer(width*height);
	dataW = new Uint8Array(width*height*3);
	dataT = new Uint8Array(width*height*3);
	dataP = new Uint8Array(width*height);

	for(var i=0; i<width; i++){
		for(var j=0; j<height; j++){
			value = (1+noise.simplex2(i/1000,j/1000))/2;

			dataP[i+j*width] = 255*value;

			if(value > 0.5){
				value = 2*(value-0.5);
				dataW[(3*i)+3*j*width+0] = 0.5*255*value+0.1*value;
				dataW[(3*i)+3*j*width+1] = 0.5*255*value+0.1*value;
				dataW[(3*i)+3*j*width+2] = 0.5*255*value+0.1*value;

				dataT[(3*i)+3*j*width+0] = 255*value;
				dataT[(3*i)+3*j*width+1] = 255*value;
				dataT[(3*i)+3*j*width+2] = 255*value;
			}else{
				dataW[(3*i)+3*j*width+0] = 0;
				dataW[(3*i)+3*j*width+1] = 0;
				dataW[(3*i)+3*j*width+2] = 0.4*255*value+0.2*255;

				dataT[(3*i)+3*j*width+0] = 0;//255*0.5;
				dataT[(3*i)+3*j*width+1] = 0;//255*0.5;
				dataT[(3*i)+3*j*width+2] = 0;//255*0.5;
			}

		}
	}
	var ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );

	colorTex = new THREE.DataTexture(dataW, width, height, THREE.RGBFormat);	
	dispTex = new THREE.DataTexture(dataT, width, height, THREE.RGBFormat);	
	colorTex.needsUpdate = true;
	dispTex.needsUpdate = true;
	var mat = new THREE.MeshPhongMaterial( {map: colorTex, displacementMap: dispTex, displacementScale: 0.5*255, side: THREE.DoubleSide} );
	// console.log(waterMap[50][535])
	var mesh = new THREE.Mesh(geometry, mat);
	mesh.position.z = -10;
	scene.add(mesh);
}