function localConstraints(r){
    if(illegalArea(r) && intersections(r)){
        if(!r.highway && dataP[convert(r.end)] < 20){ // Stop if no popdensity 
            // r.spawn = false;
            // return false;
        }
        return true;
    }
    return false;
}

function illegalArea(r){
    if(r.highway && !outsideArea(r.end)){
        return true;
    }
    if(inIlegalArea(r.end)){        //inside illegal area
        //(if highway, extend?)
        if(pruneLine(r,10)){
            return true;
        }

        if(rotateLine(r,100, 2.0)){
            return true;
        }
        
        return false;
    }
    return true;
}

function intersections(r){
    var raycaster =  new THREE.Raycaster();
    raycaster.set(r.start.clone().addScaledVector(r.dir,0.1*r.l), r.dir, 0.1*r.l, r.l);
    var intersects = raycaster.intersectObjects(placedSegments);

    function cmprFunc(i,j){
        return sqrdDist(r.end,crossings[i])-sqrdDist(r.end, crossings[j]);
    }

    if(!pruneSegment(r, intersects)){
        return false;
    }

    if(findClosestCrossing(r, intersects)){
        createIntersection(r.end, pointMaterialRed);
        return true;
    }

    if(extendSegment(r, intersects)){
        createIntersection(r.end, pointMaterialBlue);
        return true;
    }

    crossings.push(r.end);
    return true;
}

function pruneSegment(r, intersects){
    if(intersects.length>0.0){
        var intersect = intersects[0];
        if(intersect.distance <= 0.1*r.l){
            return false;
        }
        if(intersect.distance < r.l){
            r.updateLine(intersect.point, r.highway);
            return true;
         }
    }
    return true;
}

function findClosestCrossing(r, intersects){
    function cmprFunc(i,j){
        return sqrdDist(r.end,crossings[i])-sqrdDist(r.end, crossings[j]);
    }

    if(crossings.length > 0){
        index = sortIndex(crossings, cmprFunc);
        var p = crossings[index[0]];
        var d = Math.sqrt(sqrdDist(r.end, p));

        if(d < 0.8*r.l){
            r.updateLine(p, false);
            return true; 
        }
    }
    return false;
}


function extendSegment(r, intersects){
    if(intersects.length>0){
         var intersect = intersects[0];
         if(intersect.distance < 1.5*r.l && intersect.distance > 1.0*r.l){
            r.updateLine(intersect.point, r.highway);
            findClosestCrossing(r, intersects);
            return true;
         }
    }
    return false;
}

function pruneLine(r, steps){
    var v = r.end.clone();
    for(var i=1; i< steps; i++){
        v.addScaledVector(r.dir.clone().negate(),r.l*0.0*(i/steps));
        if(!inIlegalArea(v)){
            r.updateLine(v, true);
            return true;
        }
        v = r.end.clone();
    }
    return false;
}

function rotateLine(r, steps, angle){
    v = r.start.clone();
    var d = r.dir.clone();

    for(var i=1; i<2*steps; i++){
        var rot = (i/steps)*angle;
        if(i%2 == 0){
            rot = -((i-1)/steps)*angle;
        }
        
        d.applyAxisAngle(new THREE.Vector3(0, 0, 1), rot*Math.PI);
        v.addScaledVector(d,r.l);
        if(!inIlegalArea(v)){
            r.dir = d;
            r.updateLine(v, true); 
            return true;
        }

        d = r.dir.clone();
        v = r.start.clone();
    }
    return false;
}