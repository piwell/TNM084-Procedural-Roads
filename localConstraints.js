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
            v.addScaledVector(r.dir.clone().negate(),r.l*0.0*(i/steps));
            if(!inIlegalArea(v)){
                r.updateLine(v, true);
                console.log("illegal area, pruned"); 
                return true;
            }
            v = r.end.clone();
        }

        //rotate TODO: Make much better!
        var rSteps = 100;
        v = r.start.clone();
        var d = r.dir.clone();
        for(var i=1; i<rSteps; i++){
            var rot = (i/rSteps)*2.0;
            d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot*Math.PI);
            v.addScaledVector(d,r.l);
            if(!inIlegalArea(v)){
                // console.log("illegal area, rotated " + rot); 
                r.dir = d;
                r.updateLine(v, true); 
                return true;
            }

            d = r.dir.clone();
            v = r.start.clone();
        
            d.applyAxisAngle(new THREE.Vector3(0, 0, 1), -rot*Math.PI);
            v.addScaledVector(r.dir,r.l);
            if(!inIlegalArea(v)){
                // console.log("illegal area, rotated " + (-rot)); 
                r.dir = d;
                r.updateLine(v, true); 
                return true;
            }
            d = r.dir.clone();
            v = r.start.clone();
        }

        // console.log("Failed illegalArea");
        return false;
    }

    return true;
}

function intersections(r){
    var raycaster =  new THREE.Raycaster();
    raycaster.set(r.start.clone().addScaledVector(r.dir,0.1*r.l), r.dir, 0.1*r.l, r.l);
    var intersects = raycaster.intersectObjects(seg);

    //type 1: prune
    if(intersects.length>0.0){
        var intersect = intersects[0];
        if(intersect.distance <= 0.1*r.l){
            // createIntersection(r, pointMaterialBlue);

            return false;
        }
        if(intersect.distance < r.l){
            console.log("intersection, prune"); 
            r.updateLine(intersect.point, false)
            createIntersection(r, pointMaterialRed);
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

        if(d <  1.1*1.1*r.l*r.l){
            r.updateLine(p, false);
            return true; 
        }
    }
    
    //type 3: extend
    if(intersects.length>0){
         if(intersect.distance < 1.2*r.l){
            console.log("intersection, extend"); 
            r.updateLine(intersect.point, false);
            createIntersection(r, pointMaterialGreen);
            return true;
         }
    }

    //noting wrong, return true
    return true;
}

function localConstraints(r){
    if(illegalArea(r) && intersections(r)){
        // console.log(dataP[convert(r.end)])
        if(!r.highway && dataP[convert(r.end)] < 50){
            // r.spawn = false;
            return false;
        }
        return true;
    }
    return false;
}