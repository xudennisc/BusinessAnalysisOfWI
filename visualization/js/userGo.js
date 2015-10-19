
function userAct( inJSON, root, rankBy ){

    var revArr = inJSON.review;
    //used to store all reviews, including duplicate
    var jStr = '{"nearList":[]}';
    var jObjTemp = JSON.parse(jStr);

    var userRevArr = new Object();
    revArr.forEach(function(d) {
        userRevArr[d.user_id] = [];
    })
    root.forEach( function(root) {
        data = root;

        var d1 = data.review;
        var innercounter = 0;

        //all review info
        d1.forEach(function(d){
            if( userRevArr.hasOwnProperty( d.user_id )){
                if(d.business_id.localeCompare( inJSON.business_id) != 0)
                    jObjTemp['nearList'].push(data);
            }
        })
    })

    //remove duplicate
    //suppose there are at least 1 store in the list!
    var jObjNoDup = [];
    jObjNoDup[0] = jObjTemp['nearList'][0];
    if( jObjTemp['nearList'].length > 1 ){
        var j = 1;
        for( var k=1; k<jObjTemp['nearList'].length; k++){
            if(jObjTemp['nearList'][k].business_id != jObjTemp['nearList'][k-1].business_id)
                jObjNoDup[j++] = jObjTemp['nearList'][k];
        }
    }

    return getRank(inJSON,jObjNoDup,rankBy);

}

function calculateCategoryVec(obj){
    var vec = [0,0,0,0,0,0,0,0,0];
    if(obj.hasOwnProperty("categories")) {
        if (obj.categories.indexOf("Restaurants") != -1) {
            vec[0]++;
        }
        if (obj.categories.indexOf("Shopping") != -1) {
            vec[1]++;
        }
        if (obj.categories.indexOf("Beauty & Spas") != -1) {
            vec[2]++;
        }
        if (obj.categories.indexOf("Nightlife") != -1) {
            vec[3]++;
        }
        if (obj.categories.indexOf("Bars") != -1) {
            vec[4]++;
        }
        if (obj.categories.indexOf("Automotive") != -1) {
            vec[5]++;
        }
        if (obj.categories.indexOf("Fashion") != -1) {
            vec[6]++;
        }
        if (obj.categories.indexOf("Health & Medical") != -1) {
            vec[7]++;
        }
        if (vec[0] == 0 && vec[1] == 0 && vec[2] == 0 && vec[3] == 0 &&
            vec[4] == 0 && vec[5] == 0 && vec[6] == 0 && vec[7] == 0) {
            vec[8]++;
        }
    }
    return vec;
}

function calculateSimilarity(vec1, vec2){
    var len = vec1.length;
    var top = 0;
    var bottom1 = 0;
    var bottom2 = 0;
    for(var i=0;i<len;i++){
        top += vec1[i] * vec2[i];
        bottom1 += vec1[i] * vec1[i];
        bottom2 += vec2[i] * vec2[i];
    }
    return top / (bottom1 * bottom2);
}

function calculateAttributeSim(d1, d2){
    var obj1 = d1.attributes;
    var obj2 = d2.attributes;
    var count = 0;
    for (var prop in obj1) {
        if (obj1.hasOwnProperty(prop)) {
            if(obj1[prop] == obj2[prop]) {
                count++;
            }
        }
    }
    return count;
}

function getRank(obj, jObjNoDup, rankBy){
    var result = [];
    var vec = calculateCategoryVec(obj);
    jObjNoDup.forEach(function (d) {
        var tmpvec = calculateCategoryVec(d);
        d["categorySim"] = calculateSimilarity(vec,tmpvec);
        d["distance"] = calculateDistance(obj.latitude, obj.longitude, d.latitude, d.longitude);
        d["attributeSim"] = calculateAttributeSim(obj, d);

        if(d["categorySim"] > 0){
            result.push(d);
        }
    });
    if(rankBy == "similarity") {
        result.sort(function (a, b) {
            if (a.categorySim != b.categorySim) {
                return b.categorySim - a.categorySim;
            }
            else {
                if (a.attributeSim != b.attributeSim) {
                    return b.attributeSim - a.attributeSim;
                }
                else {
                    if (a.stars != b.stars) {
                        return b.stars - a.stars;
                    }
                    else {
                        return a.distance - b.distance;
                    }
                }
            }
        });
    }
    else if(rankBy == "rating"){
        result.sort(function (a, b) {
            if (a.stars != b.stars) {
                return b.stars - a.stars;
            }
            else {
                if (a.categorySim != b.categorySim) {
                    return b.categorySim - a.categorySim;
                }
                else {
                    if (a.attributeSim != b.attributeSim) {
                        return b.attributeSim - a.attributeSim;
                    }
                    else {
                        return a.distance - b.distance;
                    }
                }
            }
        });
    }
    else if(rankBy == "distance"){
        result.sort(function (a, b) {
            if (a.distance != b.distance) {
                return a.distance - b.distance;
            }
            else {
                if (a.categorySim != b.categorySim) {
                    return b.categorySim - a.categorySim;
                }
                else {
                    if (a.attributeSim != b.attributeSim) {
                        return b.attributeSim - a.attributeSim;
                    }
                    else {
                        return b.stars - a.stars;
                    }
                }
            }
        });
    }
    return result;
}
