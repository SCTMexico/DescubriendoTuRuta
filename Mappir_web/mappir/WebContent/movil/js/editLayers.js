function createRouteLayer(points){
    var puntosLine = [];
    for(var point in points){
        var lonlatObject=(new OpenLayers.LonLat(points[point][0],points[point][1]));
        var lonlatsB =new Array(lonlatObject);
        puntosLine.push(new OpenLayers.Geometry.Point(lonlatsB[0].lon, lonlatsB[0].lat));
    }
    linestringRoute = new OpenLayers.Geometry.LineString(puntosLine);
    return linestringRoute;
}
function addRoute() {
    var prevRoute = map.getLayersByName("Route Layer");
    var routeLayer;
    if(prevRoute.length>0){
        routeLayer = prevRoute[0]
        routeLayer.removeAllFeatures();
    }
    for(var tramo in arrayRoutes){
        // create feature from linestring
        var route = new OpenLayers.Feature.Vector(
            arrayRoutes[tramo].transform(projWGS84,map.getProjectionObject())
        );
        var meters=resultRoute[indexRoute].grafo[tramo][7];
        var temp = convertMeters(meters);
        meters= temp[0];
        var metersCaption = temp[1];
        var minutes = resultRoute[indexRoute].grafo[tramo][6];
        var temp = convertMinutes(minutes);
        minutes= temp[0];
        var minutesCaption = temp[1];
        var tempString = resultRoute[indexRoute].grafo[tramo][2]+"<span style='font-size: .75em'> distancia: "+meters+metersCaption+', tiempo: '+decimalsHourToMinutes(minutes,2).replace(".",":")+minutesCaption+"</span>";
        if(resultRoute[indexRoute].grafo[tramo][12].length>0){
            tempString+="<br/><span style='font-size: .75em'> acepta: "+resultRoute[indexRoute].grafo[tramo][12][0][5]+"</span>";
        }
        route.data = tempString
        route.attributes= {"id":tramo};
        routeLayer.addFeatures(route);
    }

    // Center the map according to boundaries
    var totalBounds = routeLayer.getDataExtent();
    map.zoomToExtent(totalBounds);
    var detail = $("#mapdetail");
    detail.html('<div class="background2" style="padding-top: 15px;padding-bottom: 15px;padding-left: 10px;">'+resultRoute[indexRoute].descripcion+'</div>');
    // reset global variable to save space.
    arrayRoutes=[];
}
function switchRouteFeature(direction){
    var r1;
    var layer = map.getLayersByName("Route Layer")[0];
    if (layer){
        if (currentRouteFeature==null){
            currentRouteFeature=0;
        }else if(direction == '>'){
            currentRouteFeature++;
        }else {
            currentRouteFeature--;
        }
        r1 = layer.features[currentRouteFeature];
    }
   var control = map.getControlsBy("CLASS_NAME", "OpenLayers.Control.SelectFeature")[0];
    if (control){
        control.unselectAll();
        control.select(r1);
    }
}
function onSelectRouteSection(e){
    try{
        currentRouteFeature= e.feature.attributes.id;
        var currentReal = parseInt(currentRouteFeature)+1;
        if (currentReal == e.feature.layer.features.length){
            $("#routePlus").addClass('ui-disabled');
            $("#routeMinus").removeClass('ui-disabled');
        }else if (currentRouteFeature==0){
            $("#routePlus").removeClass('ui-disabled');
            $("#routeMinus").addClass('ui-disabled');
        }else{
            $("#routePlus").removeClass('ui-disabled');
            $("#routeMinus").removeClass('ui-disabled');
        }
        var detail = $("#mapdetail");
        detail.html('<div class="background2" style="padding-top: 15px;padding-bottom: 15px;padding-left: 10px;">'+ e.feature.data+'</div>');
        resizeMapHeaderWidth();
        fixContentHeight("mappage");
        var totalBounds = e.feature.geometry.bounds;
        map.zoomToExtent(totalBounds);
    }catch (ex){debugger;}
}
function onUnSelectRouteSection(e){
    try{
        var detail = $("#mapdetail");
        detail.html('<div class="background2" style="padding-top: 15px;padding-bottom: 15px;padding-left: 10px;">'+resultRoute[indexRoute].descripcion+'</div>');
        fixContentHeight("mappage");
    }catch (ex){debugger;}

}
function switchLayer(){
    var caption = $("#mapLayer");
    caption.html('');
    var layers = map.getLayersBy("visibility", true);
    var activeLayer = layers[0];
    var base="";
    if (activeLayer.name=="OpenStreetMap"){//TTR//OpenStreetMap
        base = map.getLayersByName("Google Hybrid")[0];
        caption.html('Cambiar a Mapa SCT'); //Mapa SCT//Mapa OpenStreet
    }else if(activeLayer.name=="Google Hybrid"){
        base = map.getLayersByName("TTR")[0];//TTR//OpenStreetMap
        caption.html('Cambiar a Mapa OpenStreet');
    }else{
        base = map.getLayersByName("OpenStreetMap")[0];//TTR//OpenStreetMap
        caption.html('Cambiar a Mapa Google');
    }
    map.setBaseLayer(base);
    map.baseLayer.setVisibility(true);
}