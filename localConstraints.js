function inIlegalArea(p){
    w = dataW[convert3(p)];
    return  (p.x <= -width/2.0)  || (p.x > width/2.0)  || 
            (p.y <= -height/2.0) || (p.y > height/2.0) ||
            w == 0;

}

function illegalArea(r){
    if(inIlegalArea(r.end)){        //inside illegal area
        //(if highway, extend)
        
        // prune
        var v = r.end.clone();
        var steps = 5;
        for(var i=1; i< steps; i++){
            v.addScaledVector(r.dir.clone().negate(),r.l*0.5*(i/steps));
            if(!inIlegalArea(v)){
                r.updateLine(v, true);
                // console.log("illegal area, pruned"); 
                return true;
            }
            v = r.end.clone();
        }

        //rotate
        var rSteps = 10;
        v = r.start.clone();
        var d = r.dir.clone();
        for(var i=1; i<rSteps; i++){
            var rot = (i/rSteps)*0.5*Math.PI;
            d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot);
            v.addScaledVector(d,r.l);
            if(!inIlegalArea(v)){
                // console.log("illegal area, rotated"); 
                r.dir = d;
                r.updateLine(v, true); 
                return true;
            }

            d = r.dir.clone();
            v = r.start.clone();
        
            d.applyAxisAngle(new THREE.Vector3(0, 0, 1), -rot);
            v.addScaledVector(r.dir,r.l);
            if(!inIlegalArea(v)){
                // console.log("illegal area, rotated"); 
                r.dir = d;
                r.updateLine(v, true); 

                return true;
            }
            d = r.dir.clone();
            v = r.start.clone();
        }

        return false;
    }

    return true;
}

function intersections(r){
    var raycaster =  new THREE.Raycaster();
    raycaster.set(r.start.clone().addScaledVector(r.dir,0.001), r.dir, 0.001, r.l);
    var intersects = raycaster.intersectObjects(seg);

    //type 1: prune
    if(intersects.length>0){
        var intersect = intersects[0];
        if(intersect.distance <= 0.01*r.l){
        	// r.line.color = red;
        	// scene.add(r.line)
            return false;
        }
        if(intersect.distance < r.l){
            // console.log("intersection, prune"); 
            r.updateLine(intersect.point, false)
            createIntersection(r);
            return true;
         }
    }

    //type 2: find nearest crossing
    function cmprFunc(i,j){
        return sqrdDist(r.end,crossings[i])-sqrdDist(r.end, crossings[j]);
    }

    if(crossings.length > 0){
        index = sortIndex(crossings, cmprFunc);
        var p = crossings[index[0]];
        var d = sqrdDist(r.end, p);

        if(d < 1.2*1.2*r.l*r.l){
            // console.log("intersection, nearest"); 
            r.updateLine(p, false);
            return true; 
        }
    }
    
    //type 3: extend
    if(intersects.length>0){
         if(intersect.distance < 1.2*r.l){
            // console.log("intersection, extend"); 
            r.updateLine(intersect.point, false);
            createIntersection(r);
            return true;
         }
    }

    //noting wrong, return true
    return true;
}

function localConstraints(r){
    if(illegalArea(r)){
       return intersections(r);
    }
    return false;
}