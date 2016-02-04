function illegalArea(r){
    if(r.highway && !outsideArea(r.end)){
        return true;
    }
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

    function cmprFunc(i,j){
        return sqrdDist(r.end,crossings[i])-sqrdDist(r.end, crossings[j]);
    }

    inter = false;
    //type 1: prune
    if(intersects.length>0.0){
        var intersect = intersects[0];
        if(intersect.distance <= 0.1*r.l){
            // createIntersection(r.end, pointMaterialBlue);

            return false;
        }
        if(intersect.distance < r.l){
            // console.log("intersection, prune"); 
            r.updateLine(intersect.point, r.highway)
            // createIntersection(r.end, pointMaterialRed);
            // return true;
            inter = true;
         }
    }


    //type 2: find nearest crossing
    if(crossings.length > 0){
        index = sortIndex(crossings, cmprFunc);
        var p = crossings[index[0]];
        var d = Math.sqrt(sqrdDist(r.end, p));

        if(d <  0.5*r.l){
            console.log("intersection, nearest");
            // console.log(d + " " + r.l);
            r.updateLine(p, false);
            // createIntersection(r.end, pointMaterialBlue);

            return true; 
        }

        if(inter){
            createIntersection(r.end, pointMaterialRed);
            return true;

        }

    }
    
    //type 3: extend
    if(intersects.length>0){
         if(intersect.distance < 1.2*r.l){
            // console.log("intersection, extend"); 
            r.updateLine(intersect.point, r.highway);
            createIntersection(r.end, pointMaterialGreen);
            return true;
         }
    }

    //noting wrong, return true
    // createIntersection(r.end, pointMaterialBlue);
    crossings.push(r.end);
    return true;
}

function localConstraints(r){
    if(illegalArea(r) && intersections(r)){
        // console.log(dataP[convert(r.end)])
        if(!r.highway && dataP[convert(r.end)] < 20){
            // r.spawn = false;
            // return false;
        }
        return true;
    }
    return false;
}