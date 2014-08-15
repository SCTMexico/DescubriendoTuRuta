
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );
    },

    trigger: function(e) {
        if (map.getProjectionObject()!=projWGS84){
            var s = map.getLonLatFromPixel(e.xy);
            var lonlat = map.getLonLatFromPixel(e.xy).transform(map.getProjectionObject(),projWGS84);
        }else{
            lonlat = map.getLonLatFromPixel(e.xy)
        }
        var html = popupLocationCreatHtml(("Coordenada: " + lonlat.lat + " N, " + lonlat.lon + " E <br/> Deseas usar esta coordenada?"),lonlat.lat,lonlat.lon);
        $("#popupMapa").empty()
        $(html).appendTo("#popupMapa");
        $( "#popupMapa" ).popup( "open" );
    }
});

// initialize map when page ready
var map;
var projWGS84 = new OpenLayers.Projection("EPSG:4326"); //"EPSG:4326"
var projMeters = new OpenLayers.Projection("EPSG:900913"); //"EPSG:900913"
var projUsing = 'EPSG:900913';

var init = function () {
    // create map
    map = new OpenLayers.Map({
        div: "map",
        units:'m',
        theme: null,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            })
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize',
                maxZoomLevel: 11
            })
        ],
        projection: projUsing
    });

    var matrixIds = new Array(21);
    for (var i=0; i<21; ++i) {
        matrixIds[i] = projUsing + ":" + i;
    }
    var wmts = new OpenLayers.Layer.WMTS({
        name: "TTR",
        url: configArray['url']['mapaBase'],
        layer: "MAPPIR:MAPPIR_MB_V1", //IMPORTANTE "TTR_MB_V2"
        bgcolor: '#FFFFFF',
        matrixSet: projUsing,
        tiled:true,
        renders:["Canvas","SVG","VML"],
        resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
            19567.87923828125, 9783.939619140625, 4891.9698095703125,
            2445.9849047851562, 1222.9924523925781, 611.4962261962891,
            305.74811309814453, 152.87405654907226, 76.43702827453613,
            38.218514137268066, 19.109257068634033, 9.554628534317017,
            4.777314267158508, 2.388657133579254, 1.194328566789627,
            0.5971642833948135, 0.25, 0.1, 0.05],
        serverResolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
            19567.87923828125, 9783.939619140625,
            4891.9698095703125, 2445.9849047851562,
            1222.9924523925781, 611.4962261962891,
            305.74811309814453, 152.87405654907226,
            76.43702827453613, 38.218514137268066,
            19.109257068634033, 9.554628534317017,
            4.777314267158508, 2.388657133579254,
            1.194328566789627, 0.5971642833948135],
        matrixIds: matrixIds,
        format: "image/png",
        style: "_null",
        opacity:1,
        isBaseLayer: true,
        attribution:"Proporcionado por la Secretaría de Comunicaciones y Transportes"
    });
    /*
    var options = {
        singleTile: true,
        ratio: 1,
        isBaseLayer: true,
        wrapDateLine: true,
        transitionEffect:'rezise',
        getURL: function() {
            debugger;
            var s =this.map.getCenter();
            var center = this.map.getCenter().transform("EPSG:3857", "EPSG:4326"),
                size = this.map.getSize();
            return [
                this.url, "&center=", center.lat, ",", center.lon,
                "&zoom=", this.map.getZoom(), "&size=", size.w, "x", size.h
            ].join("");
        }
    };
    var gmap = new OpenLayers.Layer.Grid(
        "Google Physical",
        "http://maps.googleapis.com/maps/api/staticmap?sensor=false&maptype=terrain",
        null, options
    );
    */
    var gmap =  new OpenLayers.Layer.Google(
        "Google Hybrid",
        {type: google.maps.MapTypeId.HYBRID}
    );
    gmap.animationEnabled=true;
    map.addLayers([wmts,gmap]);//[wmts,gmap]
    //map.addControl(new OpenLayers.Control.LayerSwitcher());

    var routeLayer = new OpenLayers.Layer.Vector("Route Layer", {
        styleMap: new OpenLayers.StyleMap({
            default:{
                strokeColor: 'red',
                strokeWidth: 6
            },
            select:{
                strokeColor: '#006633',
                strokeWidth: 6
            }
        })
    });
    map.addLayer(routeLayer);
    var location = new OpenLayers.Layer.Vector("Location", {
        styleMap              : new OpenLayers.StyleMap({
            graphicOpacity: 0.6,
            graphicWidth  : 16,
            graphicHeight : 26,
            graphicYOffset: -26
        })
    });
    map.addLayer(location);
    var warnToll = new OpenLayers.Layer.Vector("Tolls/Warnings/Intermediates", {
        styleMap              : new OpenLayers.StyleMap({
            graphicOpacity: 0.6,
            graphicWidth  : 16,
            graphicHeight : 26,
            graphicYOffset: -26
        })
    });
    map.addLayer(warnToll);
    var markers = new OpenLayers.Layer.Vector("Markers", {
        styleMap              : new OpenLayers.StyleMap({
            graphicOpacity: 0.6,
            graphicWidth  : 16,
            graphicHeight : 26,
            graphicYOffset: -26
        })
    });
    map.addLayer(markers);
    var layerWeather = new OpenLayers.Layer.Vector("layerWeather", {
        styleMap              : new OpenLayers.StyleMap({
            graphicOpacity: 0.6,
            graphicWidth  : 16,
            graphicHeight : 26,
            graphicYOffset: -26
        })
    });
    map.addLayer(layerWeather);

    var a = new OpenLayers.LonLat(-13077206.855962, 1605148.2791677);
    var b = new OpenLayers.LonLat(-9633260.110024, 3855454.39157);
    bounds = new OpenLayers.Bounds();
    bounds.extend(a);
    bounds.extend(b);

    map.setCenter([-11036721.23618, 2209377.2207211], 11);
    map.setOptions({restrictedExtent: bounds,zoom_level :11});

    var selectFeature = new OpenLayers.Control.SelectFeature([routeLayer,warnToll,markers,layerWeather], {
        clickout: true, toggle: true, //toggle:false
        multiple: false, hover: false
        });
    map.addControl(selectFeature);
    selectFeature.activate();
    routeLayer.events.on({
        "featureselected": function(e) {
            onSelectRouteSection(e);
        } ,
        "featureunselected": function(e) {
            onUnSelectRouteSection(e);
        }
    });
    warnToll.events.on({
        "featureselected": function(e) {
            var htmlToAppend = popupCreatHtml(e.feature.attributes.id,e.feature.attributes.info);
            // Delete previous Popups Content.
            $("#popupMapa").empty()
            $(htmlToAppend).appendTo("#popupMapa");
            $( "#popupMapa" ).popup( "open" );
        }
    });
    markers.events.on({
        "featureselected": function(e) {
            var htmlToAppend = popupCreatHtml(e.feature.attributes.id,e.feature.attributes.info);
            // Delete previous Popups Content.
            $("#popupMapa").empty()
            $(htmlToAppend).appendTo("#popupMapa");
            $( "#popupMapa" ).popup( "open" );
        }
    });
    layerWeather.events.on({
        "featureselected": function(e) {
            try{
                var html = '<p><label>' + e.feature.attributes.data.name + '</label></p>';
                html += '<div id="weather_block" >'; // Inicio weather_block ---style="float: left;"
                html += '<div id="cur_weather_block" style="float: left;">'; // Inicio cur_weather_block
                html += '<img id="weather_image" alt=" ' + e.feature.attributes.data.weather[0].description + '" src="' + e.feature.style.externalGraphic +'">';
                html += '<div id="temp_block" style="float: left;">'; // Inicio temp_block
                html += '<div id="big_temp" style="font-size:30px; padding-top:6px;" title="Temperatura Actual">' + e.feature.attributes.data.main.temp + '</div>';
                html += '<div id="small_temp_block" style"width:30px; overflow:visible;">'; // Inicio small_temp_block
                html += '<div id="small_temp">' + e.feature.attributes.data.weather[0].main + '</div>';
                html += '</div>'; // Cierre small_temp_block
                html += '</div>'; // Cierre temp_block
                html += '</div>'; // Cierre cur_weather_block
                html += '<div id="small_val_grey" style="color:gray;" title="Temperatura Minima y Maxima">Min:' + e.feature.attributes.data.main.temp_min + '\xBA / Max: ' + e.feature.attributes.data.main.temp_max + '\xBA</div>';
                html += '<div id="small_val_grey" style="color:gray;">Humedad: ' + e.feature.attributes.data.main.humidity + '% </div>';
                html += '<div id="small_val_grey" style="color:gray;">Viento: ' + e.feature.attributes.data.wind.speed + ' m/s </div>';
                html += '<div id="small_val_grey" style="color:gray;">Nubosidad: ' + e.feature.attributes.data.clouds.all + '% </div>';
                html += '</div>'; // Cierre weather_block
                var htmlToAppend = popupCreatHtml("Clima",html);
                // Delete previous Popups Content.
                $("#popupMapa").empty()
                $(htmlToAppend).appendTo("#popupMapa");
                $( "#popupMapa" ).popup( "open" );
            }catch (e){debugger;}

        }
    });

    if (addClickControl==true) {
        var control = map.getControlsBy("CLASS_NAME", "OpenLayers.Control")[0];
        if (control) {
            if (!control.active) {
                control.activate();
            }
        }else{
            var click = new OpenLayers.Control.Click();
            map.addControl(click);
            click.activate();
        }
        var footer = $('#mapfooter');
        var header = $('#mapheader');
        var home = $('#homeButton');
        var extent = $('#allExtent');
        var report = $('#reportMapMenu');
        try{
            footer.hide();
            header.hide();
            home.hide();
            extent.hide();
            report.hide();
        }catch (e){debugger;}
    }else{
        //generate route layer instance and its style
        try{
            addRoute();
            addTollToMap();
        }catch(e){debugger;}
    }
    resizeMapHeaderWidth();
    fixContentHeight("mappage");
    loader("hide");
};
