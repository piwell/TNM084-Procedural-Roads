function createTerrain(){
	var geometry = new THREE.PlaneGeometry(width,height,100,100);
	var mesh = new THREE.Mesh(geometry, red);
	scene.add(mesh);
}