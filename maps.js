function createTerrainMap(){
	// // console.log(vertices[3] + " " + vertices[4] + " " + vertices[5]);
	// // console.log(vertices.length/3 + " " + width*height);
	// var b = 0;
	// for(var j=0; j<height; j++){
	// 	terrainMap[i] = new Array(width);
	// 	for(var i=0; i<width; i++){
	// 		var x = i-width/2;
	// 		var y = height/2-j;
	// 		var v = noise.simplex2(i/1000,j/1000);
			
	// 		var ii = 3*(i+ j*width);
	// 		// console.log(vertices[ii] + " " + vertices[ii+1] + " " + vertices[ii+2])
	// 		// console.log(x + " " + y + " " + 0);
	// 		// console.log(" ");
	// 		vertices[ ii + 0 ] = x/10.0;
	// 		vertices[ ii + 1 ] = y/10.0;
	// 		vertices[ ii + 2 ] = 0;
	// // // 		terrainMap[i][j] = value;
	// // // 		var ii = (i*height + x);
	// // // 		// console.log(ii);

	// // // 		vertices[ii+2] = value;
	// 	}
	// }
	// // geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	// // geometry.computeVertexNormals();
	// var mesh = new THREE.Mesh(geometry, red);
	// scene.add(mesh);
}

function createWaterMap(){
	var geometry = new THREE.PlaneBufferGeometry(width,height,width,height);
	// var data = new ArrayBuffer(width*height);
	dataW = new Uint8Array(width*height*3);
	dataT = new Uint8Array(width*height*3);
	dataP = new Uint8Array(width*height);
	waterMap = new Array(width);

	for(var i=0; i<width; i++){
		waterMap[i] = new Array(height);
		for(var j=0; j<height; j++){
			value = (1+noise.simplex2(i/1000,j/1000))/2;
			var x = i-width/2;
			var y = height/2-j;

			dataP[i+j*width] = 255*value;

			if(value > 0.5){
				waterMap[i][j] = 1;
				dataW[(3*i)+3*j*width+0] = 255*value;
				dataW[(3*i)+3*j*width+1] = 0;
				dataW[(3*i)+3*j*width+2] = 0;

				dataT[(3*i)+3*j*width+0] = 255*value;
				dataT[(3*i)+3*j*width+1] = 255*value;
				dataT[(3*i)+3*j*width+2] = 255*value;
			}else{
				waterMap[i][j] = 0;
				dataW[(3*i)+3*j*width+0] = 0;
				dataW[(3*i)+3*j*width+1] = 0;
				dataW[(3*i)+3*j*width+2] = 255*value;

				dataT[(3*i)+3*j*width+0] = 255*0.5;
				dataT[(3*i)+3*j*width+1] = 255*0.5;
				dataT[(3*i)+3*j*width+2] = 255*0.5;
			}

		}
	}
	var ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );

	colorTex = new THREE.DataTexture(dataW, width, height, THREE.RGBFormat);	
	dispTex = new THREE.DataTexture(dataT, width, height, THREE.RGBFormat);	
	colorTex.needsUpdate = true;
	dispTex.needsUpdate = true;
	var mat = new THREE.MeshPhongMaterial( {map: colorTex, displacementMap: dispTex, displacementScale: 100, side: THREE.DoubleSide} );
	// console.log(waterMap[50][535])
	var mesh = new THREE.Mesh(geometry, mat);
	mesh.position.z = -10;
	scene.add(mesh);
}