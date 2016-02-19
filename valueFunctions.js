function basic(r, rot){
	return populationDensity(r, rot);
}

function newYork(r, rot){
	   if(rot == 0 || Math.abs(rot) == 0.5){
	   		return 1.0;
	   }else if(Math.abs(rot) == 0.25 || Math.abs(rot) == 0.75){
	   		return 0.0;
	   }
	   return 0.0;
}

function paris(r, rot){
	   
}

function sanFran(r, rot){
	   
}

function valueFunction(r, rot){
	return (basic(r, rot)*newYork(r, rot));
}