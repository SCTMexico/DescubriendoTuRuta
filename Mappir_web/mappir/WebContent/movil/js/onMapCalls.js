function getMarks(){
    if (marksArray.length>0){
        zoom = map.getZoom();
        getMarksValidations(zoom);
        markerFunction=true;
    }else{
        markerFunction=false;
        $('#zoomAlert').hide();
        $('#zoomAlertContent').hide();
        var markers = map.getLayersByName("Markers")[0];
        // remove previous features from layer
        markers.removeAllFeatures();
    }
    moveEvent();
}
function getWeather(){
    var type = $("#clima option:selected").val();
    if (type=="on"){
        getWeatherMap();
        weatherFunction=true;
    }else{
        weatherFunction=false;
        var layerWeather = map.getLayersByName("layerWeather")[0];
        // remove previous features from layer
        layerWeather.removeAllFeatures();
        var precipitationWeather = map.getLayersByName("precipitation")[0];
        // remove precipitation layer
        map.removeLayer(precipitationWeather);
        var mapnik = map.getLayersByName("mapnik")[0];
        // remove precipitation layer
        map.removeLayer(mapnik);
    }
    moveEvent()
}
function moveEvent(){
    var eventMovend = map.events.listeners["moveend"];
    var eventCount=0;
    if (eventMovend){
        eventCount = eventMovend.length;
    }
    if (weatherFunction==false&&markerFunction==false){
        map.events.unregister('moveend', map , function(){
            if (weatherFunction==true){
                getWeatherMap();
            }
            if (markerFunction==true){
                zoom = map.getZoom();
                getMarksValidations(zoom);
            }
        });
    }else{
        if(eventCount==0){
            map.events.register('moveend', map , function(){
                if (weatherFunction==true){
                    getWeatherMap();
                }
                if (markerFunction==true){
                    zoom = map.getZoom();
                    getMarksValidations(zoom);
                }
            });
        }

    }
}
function getMarksValidations(zoom){
    if(marksArray.length != 0){
        if(zoom > 8){
            $('#zoomAlert').hide();
            $('#zoomAlertContent').hide();
            var viewPort = map.getExtent();
            viewPort =   viewPort.transform(projMeters, projWGS84);
            var x1=viewPort.left,y1=viewPort.bottom,x2=viewPort.right,y2=viewPort.top;
            var data = {"x1":x1,"x2":x2,"y1":y1,"y2":y2,"tipos":marksArray};
            if (jqxhr) {
                jqxhr.abort();
                jqxhr=null;
            }
            jqxhr = $.get(configArray['servicios']['marcadoresEnMapa'],data, function(msg){
                if (msg.data.length == 0){
                    var markers = map.getLayersByName("Markers")[0];
                    // remove previous features from layer
                    markers.removeAllFeatures();
                    return;
                }
                addMarkToMap(msg);
            },'json')
                .fail(function(msg) {
                    if (msg.statusText=="abort"){
                    }else{
                        try{
                            navigator.notification.alert(
                                'Ocurrió un error al descargar los puntos de interés en el mapa.',// mensaje (message)
                                alertDismissed,                      // función 'callback' (alertCallback)
                                'Mappir',                         // titulo (title)
                                'Cerrar'                             // nombre del botón (buttonName)
                            );
                        }catch (e){
                            alert('Ocurrió un error al descargar los puntos de interés en el mapa.');
                        }
                    }
                });
        }else{
            $('#zoomAlert').show();
            $('#zoomAlertContent').show();
            var markers = map.getLayersByName("Markers")[0];
            // remove previous features from layer
            markers.removeAllFeatures();
        }
    }else{
        $('#zoomAlert').hide();
        $('#zoomAlertContent').hide();
        var markers = map.getLayersByName("Markers")[0];
        // remove previous features from layer
        markers.removeAllFeatures();
    }
}
function addMarkToArray(mark){
    var repeated =false;
    for (var i = 0; i < marksArray.length; i++){
        if(marksArray[i]==mark){
            repeated = true;
            if (i > -1) {
                marksArray.splice(i, 1);
            }
            break;
        }
    }
    if (!repeated){
        marksArray.push(mark);
    }
}
function addMarkToMap(result){
    var markers = map.getLayersByName("Markers")[0];
    // remove previous features from layer
    markers.removeAllFeatures();

    var dimension = undefined == dimension ? 37 : dimension;

    for (var m in result.data) {
        var estilo = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
        estilo.graphicWidth = dimension;estilo.graphicHeight = dimension;estilo.graphicYOffset = -estilo.graphicHeight;estilo.graphicOpacity = 1;estilo.externalGraphic = "img/mapa/inicio.png";estilo.maxWidth = 200;estilo.label = "";estilo.labelYOffset = -10;

        var urlServer = configArray['url']['base']+"img/mapa/"+result.data[m].icono_url;
        var urlPhone = "img/mapa/"+result.data[m].icono_url;
        var geoPunto = new OpenLayers.Geometry.Point(result.data[m].x,result.data[m].y).transform(projWGS84, projMeters);
        var mark = null;
        var arrayPosition = null;
        // checks if the icon is already in the iconArray
        for (var icon in iconArray){
            if(urlPhone==iconArray[icon]){
                arrayPosition=icon;
                break;
            }
        }
        // if the icon is not in the array alerts and shows generic icon
        if (arrayPosition==null){
            estilo.externalGraphic =urlServer;
            mark =  new OpenLayers.Feature.Vector(geoPunto, null, estilo);
        }else{
            estilo.externalGraphic =urlPhone;
            mark =  new OpenLayers.Feature.Vector(geoPunto, null, estilo);
        }
        mark.attributes = {
            "id":result.data[m].categoria,
            "info": result.data[m].info
        };
        markers.addFeatures([mark]);
    }
}
function getAllExtent(){
    var detail = $("#mapdetail");
    detail.html('<div class="background2" style="padding-top: 15px;padding-bottom: 15px;padding-left: 10px;">'+resultRoute[indexRoute].descripcion+'</div>');
    $('#markersMenu').panel('close');
    var layer = map.getLayersByName("Route Layer")[0];
    if (layer){
        var totalBounds = layer.getDataExtent();
        map.zoomToExtent(totalBounds);
    }
    resizeMapHeaderWidth();
    fixContentHeight("mappage");
}
function addTollToMap(){
    var warnToll = map.getLayersByName("Tolls/Warnings/Intermediates")[0];
    // remove previous features from layer
    warnToll.removeAllFeatures();
    var estilo = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
    var dimension = undefined == dimension ? 37 : dimension;
    estilo.graphicWidth = dimension;
    estilo.graphicHeight = dimension;
    estilo.graphicYOffset = -estilo.graphicHeight;
    estilo.graphicOpacity = 1;
    estilo.externalGraphic = "img/mapa/caseta-1.png";
    estilo.maxWidth = 200;
    estilo.label = "";
    estilo.labelYOffset = -10;

    for (var m in casetasArray) {
        var geoPunto = new OpenLayers.Geometry.Point(casetasArray[m][4][0],casetasArray[m][4][1]).transform(projWGS84, projMeters);
        var mark = null;

        mark =  new OpenLayers.Feature.Vector(geoPunto, null, estilo);
        var metodos ='';
        var electronico = false;
        for (var j in casetasArray[m][5]){
            try{
                if(casetasArray[m][5][j].toLowerCase().indexOf("tdc")>-1){
                    metodos += '<img src="img/tc.png" class="image15h">';
                }else if(casetasArray[m][5][j].toLowerCase().indexOf("efectivo")>-1){
                    metodos += '<img src="img/efectivo.png" class="image15h">';
                }else if((casetasArray[m][5][j].toLowerCase().indexOf("tag")>-1||casetasArray[m][5][j].toLowerCase().indexOf("iave")>-1)&&electronico==false){
                    metodos += '<img src="img/electronico.png" class="image15h">';
                    electronico=true;
                }
            }catch (e){}
        }
        mark.attributes = {
            "id":casetasArray[m][1],
            "info": "Costo : $"+ casetasArray[m][3]+"  -  "+metodos+"<br/>Metodos de pago: "+casetasArray[m][5]
        };
        warnToll.addFeatures([mark]);
    }
    addWarningToMap();
}
function addWarningToMap(){
    var warnToll = map.getLayersByName("Tolls/Warnings/Intermediates")[0];
    var dimension = undefined == dimension ? 37 : dimension;


    for (var m in alertasArray) {
        var estilo = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
        estilo.graphicWidth = dimension;
        estilo.graphicHeight = dimension;
        estilo.graphicYOffset = -estilo.graphicHeight;
        estilo.graphicOpacity = 1;
        estilo.externalGraphic = "img/mapa/incidente.jpg";
        estilo.maxWidth = 200;
        estilo.label = "";
        estilo.labelYOffset = -10

        var urlServer = configArray['url']['base']+"img/mapa/"+alertasArray[m][3];
        var urlPhone = "img/mapa/"+alertasArray[m][3];

        var arrayPosition = null;
        for (var icon in iconArray){
            if(urlPhone==iconArray[icon]){
                arrayPosition=icon;
                break;
            }
        }
        if (arrayPosition==null){
            estilo.externalGraphic =urlServer;
        }else{
            estilo.externalGraphic =urlPhone;
        }

        var geoPunto = new OpenLayers.Geometry.Point(alertasArray[m][2][0],alertasArray[m][2][1]).transform(projWGS84, projMeters);
        var mark = null;

        mark =  new OpenLayers.Feature.Vector(geoPunto, null, estilo);
        var titulo = "alerta de camino.";
        try{
            titulo= alertasList[alertasArray[m][0]].name;
        }catch (e){}
         mark.attributes = {
            "id":titulo,
            "info": alertasArray[m][1]
        };
        warnToll.addFeatures([mark]);
    }
    addIntermediateToMap();
}
function addIntermediateToMap(){
    var warnToll = map.getLayersByName("Tolls/Warnings/Intermediates")[0];
    var dimension = undefined == dimension ? 37 : dimension;
    var estiloStart = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
    estiloStart.graphicWidth = dimension;estiloStart.graphicHeight = dimension;estiloStart.graphicYOffset = -estiloStart.graphicHeight;estiloStart.graphicOpacity = 1;estiloStart.externalGraphic = "img/mapa/inicio.png";estiloStart.maxWidth = 200;estiloStart.label = "";estiloStart.labelYOffset = -10;
    var estiloEnd = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
    estiloEnd.graphicWidth = dimension;estiloEnd.graphicHeight = dimension;estiloEnd.graphicYOffset = -estiloEnd.graphicHeight;estiloEnd.graphicOpacity = 1;estiloEnd.externalGraphic = "img/mapa/inicio.png";estiloEnd.maxWidth = 200;estiloEnd.label = "";estiloEnd.labelYOffset = -10;
    var estiloInt=[],markInt=[];
    var markStart;
    var markEnd;
    for (var m in intermediateArray) {
        var tempLocation = "("+intermediateArray[m].y+","+intermediateArray[m].x+")";
        var geoPunto = new OpenLayers.Geometry.Point(intermediateArray[m].x,intermediateArray[m].y).transform(projWGS84, projMeters);
        var estiloTemp = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
        estiloTemp.graphicWidth = dimension;estiloTemp.graphicHeight = dimension;estiloTemp.graphicYOffset = -estiloTemp.graphicHeight;estiloTemp.graphicOpacity = 1;estiloTemp.externalGraphic = "img/mapa/inicio.png";estiloTemp.maxWidth = 200;estiloTemp.label = "";estiloTemp.labelYOffset = -10;
        estiloInt.push(estiloTemp);
        switch (m){
            case "0":
                estiloInt[m].externalGraphic = "img/mapa/mapa-puntos/puntos_intermedios/b.png";break;
            case "1":
                estiloInt[m].externalGraphic = "img/mapa/mapa-puntos/puntos_intermedios/c.png";break;
            case "2":
                estiloInt[m].externalGraphic = "img/mapa/mapa-puntos/puntos_intermedios/d.png";break;
            case "3":
                estiloInt[m].externalGraphic = "img/mapa/mapa-puntos/puntos_intermedios/e.png";break;
            default :
                break;
        }

        markInt.push(new OpenLayers.Feature.Vector(geoPunto, null, estiloInt[m]));
        var titulo = intermediateArray[m].desc;

        markInt[m].attributes = {
            "id":titulo,
            "info": tempLocation
        };
        warnToll.addFeatures([markInt[m]]);
    }
    // add start icon
        tempLocation = "("+start.y+","+start.x+")";
    var geoPunto = new OpenLayers.Geometry.Point(start.x,start.y).transform(projWGS84, projMeters);

    estiloStart.externalGraphic = "img/mapa/mapa-puntos/a.png"
    markStart =  new OpenLayers.Feature.Vector(geoPunto, null, estiloStart);
    var titulo = start.desc;

    markStart.attributes = {
        "id":titulo,
        "info": tempLocation
    };
    warnToll.addFeatures([markStart]);
    // add end icon
        tempLocation = "("+end.y+","+end.x+")";
    var geoPunto = new OpenLayers.Geometry.Point(end.x,end.y).transform(projWGS84, projMeters);

    switch (intermediateArray.length){
        case 0:
            estiloEnd.externalGraphic = "img/mapa/mapa-puntos/puntos_finales/b-v.png";break;
        case 1:
            estiloEnd.externalGraphic = "img/mapa/mapa-puntos/puntos_finales/c-v.png";break;
        case 2:
            estiloEnd.externalGraphic = "img/mapa/mapa-puntos/puntos_finales/d-v.png";break;
        case 3:
            estiloEnd.externalGraphic = "img/mapa/mapa-puntos/puntos_finales/e-v.png";break;
        case 4:
            estiloEnd.externalGraphic = "img/mapa/mapa-puntos/puntos_finales/f-v.png";break;
        default :
            estiloEnd.externalGraphic = "img/mapa/inicio.png";break;
    }

    markEnd =  new OpenLayers.Feature.Vector(geoPunto, null, estiloEnd);
    var titulo = end.desc;

    markEnd.attributes = {
        "id":titulo,
        "info": tempLocation
    };
    warnToll.addFeatures([markEnd]);
}
function addLocationToMap(){
    loader("show");
    if (!isApp){
        try{
            if(geo_position_js.init()){
                geo_position_js.getCurrentPosition(function(position){
                    locationMapSucces(position);
                },function(error){
                    loader("hide");
                    alert("Ocurrió un error al intentar localizar tu ubicación, por favor intenta desde otro dispositivo o descarga la versión app.");
                });
            }
            else{
                loader("hide");
                try{
                    navigator.notification.alert(
                        'Esta funcionalidad no esta disponible en este dispositivo, por favor intenta desde otro dispositivo o descarga la versión app.',// mensaje (message)
                        alertDismissed,                      // función 'callback' (alertCallback)
                        'Mappir',                         // titulo (title)
                        'Cerrar'                             // nombre del botón (buttonName)
                    );
                }catch (e){
                    alert("Esta funcionalidad no esta disponible en este dispositivo, por favor intenta desde otro dispositivo o descarga la versión app.");
                }
            }
        }catch (ex){debugger;}
    }else{
        var options = {timeout: 15000, enableHighAccuracy:false};
        navigator.geolocation.getCurrentPosition(locationMapSucces, showLocationError, options);
    }
}
function locationMapSucces(position){
    var location = "("+position.coords.latitude+", "+position.coords.longitude+")";
    var locationLayer = map.getLayersByName("Location")[0];
    // remove previous features from layer
    locationLayer.removeAllFeatures();

    var estilo = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
    var dimension = undefined == dimension ? 37 : dimension;
    estilo.graphicWidth = dimension;
    estilo.graphicHeight = dimension;
    estilo.graphicYOffset = -estilo.graphicHeight;
    estilo.graphicOpacity = 1;
    estilo.externalGraphic = "img/mapa/inicio.png";
    estilo.maxWidth = 200;
    estilo.label = "";
    estilo.labelYOffset = -10;

    var location = location.toLatLon();
    var geoPunto = new OpenLayers.Geometry.Point(location[1],location[0]).transform(projWGS84, projMeters);
    var mark = null;
    mark =  new OpenLayers.Feature.Vector(geoPunto, null, estilo);

    locationLayer.addFeatures([mark]);
    //map.zoomToExtent(longlat);
    var longlat =  new OpenLayers.LonLat(location[1],location[0]).transform(projWGS84,projMeters);
    map.setCenter(longlat,16);
    loader("hide");
}
function getWeatherMap(){
    var layer_precipitation = map.getLayersByName("precipitation");
    var mapnik = map.getLayersByName("mapnik");
    if(layer_precipitation.length<1){
        var layer_precipitation = new OpenLayers.Layer.XYZ(
            "precipitation",
            "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
            {
                isBaseLayer: false,
                opacity: 0.7,
                sphericalMercator: true
            }
        );
        map.addLayers([layer_precipitation]);
    }
    if(mapnik.length<1){
        var mapnik = new OpenLayers.Layer.OSM("mapnik");
        map.addLayers([ mapnik ]);
    }
    var zoom = map.getZoom();
    var bbox =  map.getExtent();
    bbox =   bbox.transform(projMeters, projWGS84);
    var layerWeather = map.getLayersByName("layerWeather")[0];
    // remove previous features from layer
    layerWeather.removeAllFeatures();
    var dimension = undefined == dimension ? 35 : dimension;
    var estilo = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
    estilo.graphicWidth = dimension;
    estilo.graphicHeight = dimension;
    estilo.graphicYOffset = -estilo.graphicHeight;
    estilo.graphicOpacity = 1;
    estilo.externalGraphic = "";
    estilo.maxWidth = 200;
    estilo.label = "";
    estilo.labelYOffset = -10;

    var url = 'http://api.openweathermap.org/data/2.5/box/city?cluster=yes&bbox=' + bbox + ',' + zoom + ',EPSG%3A4326&lang=sp';
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    jqxhr = $.ajax({
        dataType: "json",
        url: url,
        success: function (data) {
            for ( var i = 0; i < data.list.length; i++) {

                var lonlat = new OpenLayers.LonLat(data.list[i].coord.lon, data.list[i].coord.lat);


                var idIcono = data.list[i].weather[0].icon;
                estilo.externalGraphic = "http://openweathermap.org/img/w/"+idIcono+".png";

                var geoPunto = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat).transform(projWGS84, projMeters);
                var mark = null;

                mark =  new OpenLayers.Feature.Vector(geoPunto, null, estilo);
                mark.attributes = {
                    "data":data.list[i]
                };

                /*
                 if (infoWeather != null) {
                 infoWeather.hide();
                 infoWeather = null;
                 }

                 infoWeather = new OpenLayers.Popup.FramedCloud("infoWeather", this.lonlat, new OpenLayers.Size(250, 275), html, icon, true, null);
                 map.addPopup(infoWeather);
                 infoWeather.show();*/
                layerWeather.addFeatures([mark]);
            }
        },
        error : function(msg) {
            if (msg.statusText=="abort"){}else{
                loader("hide");
                try{
                    navigator.notification.alert(
                        'Ocurrió un error al obtener el clima.',// mensaje (message)
                        alertDismissed,                      // función 'callback' (alertCallback)
                        'Mappir',                         // titulo (title)
                        'Cerrar'                             // nombre del botón (buttonName)
                    );
                }catch (e){
                    alert('Ocurrió un error al obtener el clima.');
                }
            }
        }
    });
}
