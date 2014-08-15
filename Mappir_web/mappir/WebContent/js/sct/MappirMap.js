MappirMap = function (selector) {
    this.init(selector);
};
//var zIndex = 200;
var switcheos=0;
var zoom=0;
var weatherFunction=false;
var markerFunction=false;
var cloudsFunction=false;
var marksArray=[];
var searching=null;
MappirMap.instance = null;

jQuery.extend(MappirMap.prototype, {

    proyeccionInterna        : null,
    proyeccionExterna        : null,
    reader                   : null,
    mapa                     : null,
    capaMapa                 : null,
    estiloLinea              : null,
    capasDeRutaVisible       : null,
    tramoResaltado           : null,
    controlSeleccion         : null,
    controlHover             : null,
    controlClick             : null,
    centroOriginal           : null,
    extendDeRuta             : null,
    capaDirecciones          : null,
    layerControl             : null,
    modoPantallaCompleta     : false,
    exportMapControl         : null,
    ajaxClima                : null,
    ajaxMarcadores           : null,
    marcadresContinuarSuccess: true,
    climaContinuarSuccess    : true,

    init: function (selector) {

        MappirMap.instance = this;

        this.proyeccionInterna = new OpenLayers.Projection('EPSG:900913');
        this.proyeccionExterna = new OpenLayers.Projection("EPSG:4326");
        this.reader = new OpenLayers.Format.GeoJSON({
            "internalProjection": this.proyeccionInterna,
            "externalProjection": this.proyeccionExterna
        });

        this.capasDeRuta = new Array();

        this._createMap(selector);
        var tmp = $("#mapa").offset();
        
        
        this.capaDirecciones = new OpenLayers.Layer.Vector('CAPA_MARCADORES_DIRECCIONES', {
           // renders               : OpenLayers.Layer.Vector.prototype.renderers,
           // rendererOptions       : { zIndexing: true },
            styleMap              : new OpenLayers.StyleMap({
                graphicOpacity: 0.6,
                graphicWidth  : 16,
                graphicHeight : 26,
                graphicYOffset: -26
            })
        });

        this.mapa.addLayer(this.capaDirecciones);
        this.capaDirecciones.setZIndex(200);
        

        this.mapaOffset = tmp.top;

        MappirMap.instance.restaurarPantalla();
    },

    pantallaCompleta: function () {
        var instance = MappirMap.instance;
        $('body').css('overflow', 'hidden');
//        var windowWidth = $(window).width();
// var windowHeight = $(window).height();
        $("#contenedorDeRutas").addClass("full-screen-left");
        $(instance.mapa.div).addClass("full-screen-right");
        if ($("#contenedorDeRutas").find(".indicadores").length != 0) {
            instance.mapa.div.style.width = ($(window).width() - $("#contenedorDeRutas").width()) + "px";
        } else {
            instance.mapa.div.style.width = $(window).width() + "px";
        }
        instance.modoPantallaCompleta = true;
        $(instance.mapa.div).data('altoAnterior', instance.mapa.div.style.height);
        instance.mapa.div.style.height = "100%";
        instance.mapa.updateSize();
    },

    restaurarPantalla: function () {

        var instance = MappirMap.instance;
        $('body').css('overflow', 'auto');
        $("#contenedorDeRutas").removeClass("full-screen-left");
        $(instance.mapa.div).removeClass("full-screen-right");
        if ($("#contenedorDeRutas").find(".indicadores").length != 0) {
            windowWidth = $("#configuradorDerutaYVehiculo").width() - $("#contenedorDeRutas").width() - 15;
            instance.mapa.div.style.width = windowWidth + "px";
        } else {
            instance.mapa.div.style.width = $("#configuradorDerutaYVehiculo").width() + "px";
        }
        instance.modoPantallaCompleta = false;
        instance.mapa.div.style.height = $(instance.mapa.div).data('altoAnterior');
        instance.mapa.updateSize();

    },

    _createMap: function (selector) {

        this.mapa = new OpenLayers.Map({
            div       : selector,
            theme     : null,
            units     : 'm',
            projection: 'EPSG:900913',
        });

        this.mapa.maxScale = 100;

        var matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        for (var i = 0; i < 21; ++i) {
            matrixIds[i] = this.proyeccionInterna.getCode() + ":" + i;
        }

        this.capaMapa = new OpenLayers.Layer.OSM("Open Street Maps", undefined,
            {
                renderers	: ["Canvas", "SVG", "VML"],
                isBaseLayer	: true,
                useCanvas: OpenLayers.Layer.Grid.ONECANVASPERLAYER
            });

        var matrixIds = new Array(21);
        for (var i = 0; i < 21; ++i) {
            matrixIds[i] = 'EPSG:900913:' + i;
        }

        this.capaMapaBase = new OpenLayers.Layer.WMTS({
        	name             : "Mapa base TTR",
        	url              : "http://geoserver.sct.gob.mx/geoserver/gwc/service/wmts/",
            layer            : "MAPPIR:MAPPIR_MB_V1",// "TTR_MB_V2",
            matrixSet        : 'EPSG:900913',
            tiled            : true,
            renderers        : ["Canvas", "SVG", "VML"],
            resolutions      : [156543.03390625, 78271.516953125, 39135.7584765625,
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
            matrixIds        : matrixIds,
            format           : "image/png",
            style            : "_null",
            opacity          : 1,
            visible			 : true,
            visibility		 : true,
            useCanvas: OpenLayers.Layer.Grid.ONECANVASPERLAYER
// isBaseLayer : false
        });

        this.capaMapa.label = "Open Street Maps";

        this.capaMapaBase.label = "Mapa SCT";

        var gsat = new OpenLayers.Layer.Google(
            "Google Satellite",
            {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22, label: "Mapa Google Maps"}, {useCanvas: OpenLayers.Layer.Grid.ONECANVASPERLAYER}
        );
        
        this.mapa.setBaseLayer(this.capaMapa);
        
        // ROS, define el orden de los mapas en la capa de vistas
        this.mapa.addLayers([this.capaMapa,this.capaMapaBase,gsat]);
// this.mapa.setBaseLayer(this.capaMapa);
        
// this.mapa.addLayer(this.capaMapaBase);
        
// this.mapa.addLayer(this.capaMapa);
        // this.mapa.setBaseLayer(this.capaMapa);
        
        //this.mapa.setLayerIndex(this.capaMapaBase, 0);
        //this.mapa.setLayerIndex(this.capaMapa, 1);
        //this.mapa.setLayerIndex(gsat, 2);
        
// this.mapa.addLayer(gsat);
        
// this.mapa.setBaseLayer(this.capaMapa);
//        this.capaMapaBase.visible = true;
//        this.capaMapaBase.visibility = true;
        
// this.capaMapaBase.setVisible(true);
// this.capaMapaBase.redraw();


        var vistaInicial = new OpenLayers.Control();
        OpenLayers.Util.extend(vistaInicial, {
            draw: function () {
                k = $('<div style="position: absolute; top: 60px; left: 5px; cursor: pointer;" class="olSctRestaurar">' +
                    '<img style="position: relative;" width="26px;"  title="Vista Inicial" class="olAlphaImg" src="images/mapa/restaurar.png">' +
                    '</div>');
                k.click(function () {
                    instance = MappirMap.instance;
                    if (null == instance.extendDeRuta) {
                        instance.mapa.setCenter(instance.centroOriginal[0], instance.centroOriginal[1]);
                    } else {
                        instance.mapa.setCenter(instance.extendDeRuta[0], instance.extendDeRuta[1]);
                    }
                });
                return k[0];
            }
        });

        this.mapa.addControl(vistaInicial);

        var pantallaCompleta = new OpenLayers.Control();
        OpenLayers.Util.extend(pantallaCompleta, {
            draw: function () {
                k = $('<div style="position: absolute; top: 93px; left: 8px; cursor: pointer;" class="olSctPantallaCompleta">' +
                    '<img style="position: relative;" width="25px;" title="Pantalla Completa" id="__sctControlFullScreen" class="olAlphaImg" src="images/mapa/fullScreen.png">' +
                    '<img style="position: relative;" width="25px;" title="Restaurar Pantalla" id="__sctControlFullScreenExit" class="olAlphaImg ui-helper-hidden" src="images/mapa/fullScreenExit.png">' +
                    '</div>');
                k.click(function () {
                    me = $(this);
                    var fullScreen = me.data("fullScreen");
                    if (!fullScreen) {
                    	MappirMap.instance.pantallaCompleta();
                        me.data("fullScreen", true);
                        me.find("#__sctControlFullScreenExit").show();
                        me.find("#__sctControlFullScreen").hide();
                        MappirMap.instance.mapa.zoomIn(1);
                        setTimeout(function () {
                        	MappirMap.instance.mapa.zoomOut(1);
                        },500);
                    } else {
                    	MappirMap.instance.restaurarPantalla();
                        me.data("fullScreen", false);
                        me.find("#__sctControlFullScreenExit").hide();
                        me.find("#__sctControlFullScreen").show();
                    }
                    getMapMenuPosition();
                    getPositionAlertZoom(!fullScreen);
                });
                return k[0];
            }
        });

        this.mapa.addControl(pantallaCompleta);

        var oClick = new OpenLayers.Control.Click({eventMethods: {
            'rightclick': function (e) {
                e.returnValue = false;
                $(MappirMap.instance.mapa.div).trigger('sctContextMenu', [e]);
                return false;
            }
        }});

        this.mapa.addControl(oClick);
        oClick.activate();
        
        /*
        var a = new OpenLayers.LonLat(-13114328.750295, 3960400.2681264);
        var b = new OpenLayers.LonLat(-9550483.1673849, 1530195.4077269);
        */
        var a = new OpenLayers.LonLat(-13177206.855962, 1675148.2791677);
        var b = new OpenLayers.LonLat(-9550483.1673849, 3961583.447785591);
        bounds = new OpenLayers.Bounds();
        bounds.extend(a);
        bounds.extend(b);
        
        this.mapa.setCenter([-11036721.23618, 2209377.2207211], 5);
        this.centroOriginal = [this.mapa.getCenter(), 5];
        this.mapa.setOptions({restrictedExtent: bounds});
        
        var ruta1 = MappirMap.instance.crearCapa('capaDeRuta1', "rutaSugerida", 1, false, "red");
        var ruta2 = MappirMap.instance.crearCapa('capaDeRuta2', "rutaAlterna", 2, false, "green");
        
        var markers = MappirMap.instance.crearCapa("capaDeMarcadores", null, "capaMarcadores", true);
        markers.isMarker = true;
        
        var layweather = MappirMap.instance.crearCapa("Clima", null, "capaClima", true);
        layweather.isMarker = true;
                
        MappirMap.instance.controlSeleccion = new OpenLayers.Control.SelectFeature(MappirMap.instance.mapa.getLayersBy('cliqueable', true),
                {
                    click         : true,
                    clickout      : true,
                    toggle        : false,
                    multiple      : false,
                    hover         : false,
                    toggleKey     : "ctrlKey", // ctrl key removes from selection
                    multipleKey   : "shiftKey", // shift key adds to selection
                    pixelTolerance: 0,
                    box           : false,
                    id            : 'FEATURE_SELECT_CONTROL'
                });
        MappirMap.instance.mapa.addControl(MappirMap.instance.controlSeleccion);
        MappirMap.instance.controlSeleccion.activate();
        
        d = $( "#menu" );
        var header = document.createElement("div");
        header.innerHTML="Vistas";
        header.className ="menuHeader";
        header.style.cssText="-moz-border-radius-topleft: 10px;-webkit-border-top-left-radius: 10px;border-top-left-radius: 10px;";
        d.append(header);
        appendToMenu("Open Street Maps", "switchlayer", "Open Street Maps","radio","menu",null);
        appendToMenu("Mapa SCT", "switchlayer", "Mapa base TTR","radio","menu",null);
        appendToMenu("Mapa Google Maps", "switchlayer", "Google Satellite","radio","menu",null);
        var l = document.createElement("br");
        d.append(l);
        var header2 = document.createElement("div");
        header2.innerHTML="Puntos de Interés";
        header2.className ="menuHeader";
        d.append(header2);
        var content = document.createElement("div");
        content.id= "pointsContent";
        content.className ="pointsContent";
        d.append(content);
        appendToMenu("Clima", "getWeather", "","checkbox","pointsContent","clima.png");
        appendToMenu("Precipitación", "getClouds", "","checkbox","pointsContent","clima.png");
        
        
        $.ajax({
            url     : Mappir.config.servicios.listaDeMarcadores,
            dataType: 'json',
            success : function (result) {
                for (var c = 0; c < result.data.length; c++) {
                    appendToMenu(result.data[c].tipo, "addMarkToArray", result.data[c].codigo,"checkbox","pointsContent",result.data[c].icono_url);
                }
                moveEvent();
            }
        });

        this.exportMapControl = new OpenLayers.Control.ExportMap();
        this.mapa.addControl(this.exportMapControl);

    },

    actualizarCapaDeMarcadores: function (capa, puntos) {
        for (var p = 0; p < puntos.length; p++) {
            item = puntos[p];
            this.dibujarMarcador(capa, item.label, item.html, item.punto, !item.icono_absolute ? ("images/mapa/" + item.icono) : item.icono);
        }
    },

    dibujarMarcador: function (capa, label, html, punto, imagen, dimension) {
        var estilo = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
        dimension = undefined == dimension ? 30 : dimension;
        estilo.graphicWidth = dimension;
        estilo.graphicHeight = dimension;
        estilo.graphicYOffset = -24;
        estilo.graphicXOffset = -10;
        estilo.graphicOpacity = 1;
        estilo.externalGraphic = imagen;
        estilo.maxWidth = 200;
        estilo.label = "";
        estilo.labelYOffset = -10;
        estilo.cursor = 'pointer';

        var geoPunto = new OpenLayers.Geometry.Point(punto[0], punto[1]).transform("EPSG:4326", 'EPSG:900913');
        estilo.externalGraphic = imagen;
        var vector = new OpenLayers.Feature.Vector(geoPunto, null, estilo);
        vector.attributes = {
            html: html
        };
        vector.isMarker = true;

        capa.addFeatures([vector]);
    },

    dibujarTramoRuta: function (capa, descripcion, puntos) {
        var tramo = this.reader.read({type: "FeatureCollection", features: [
            {type: "Feature", geometry: {type: "LineString", coordinates: puntos }}
        ]});

        var centroide = puntos[Math.ceil(puntos.length / 2)];
        var center = new OpenLayers.LonLat(centroide[0], centroide[1]).transform("EPSG:4326", 'EPSG:900913');
        tramo[0].attributes = {html: '<div style="color:#00853d;">' + descripcion + '</div>', centroide: center};
        capa.addFeatures(tramo);
    },

    mostrarTodasOMostrarSolo: function (idx) {
        if (idx == this.capasDeRutaVisible) {
            for (var i = 0; i < this.capasDeRuta.length; i++) {
                this.mapa.getLayer(this.capasDeRuta[i]).setVisibility(true);
            }
            this.capasDeRutaVisible = null;
        } else {
            for (var i = 0; i < this.capasDeRuta.length; i++) {
                var capaId = this.capasDeRuta[i];
                this.mapa.getLayer(capaId).setVisibility(capaId == idx);
            }
            this.capasDeRutaVisible = idx;
        }
    },

    resaltarTramo: function (capaId, tramo, extent) {
        layer = this.mapa.getLayer(capaId);
        feature = layer.features[tramo];
        //control = this.controlHover;
        control = this.controlSeleccion;
        if (control.handlers.feature.lastFeature != feature) {
            control.unselectAll();
            control.select(feature);
        }
        this.mapa.zoomToExtent(extent);
        this.mapa.setCenter(feature.attributes.centroide);
    },

    crearCapa: function (name, label, idx, showInLayerControls, color) {

        var esCapaDeRuta = name == 'capaDeRuta'+idx;
        if(esCapaDeRuta) {
        	var capa = new OpenLayers.Layer.Vector(name, {
                //hovereable            : true,
        		cliqueable            : true,
                styleMap              : new OpenLayers.StyleMap({
                    graphicOpacity: 0.6,
                    graphicWidth  : 16,
                    graphicHeight : 26,
                    graphicYOffset: -26
                }) , renderers : ["Canvas", "SVG", "VML"]
            });
        }else{
        	var capa = new OpenLayers.Layer.Vector(name, {
                cliqueable            : true,
                styleMap              : new OpenLayers.StyleMap({
                    graphicOpacity: 0.6,
                    graphicWidth  : 16,
                    graphicHeight : 26,
                    graphicYOffset: -26
                })
            });
        }
        

        capa.styleMap = new OpenLayers.StyleMap({"default": {strokeColor: (undefined == color ? 'black' : color), strokeWidth: 6, cursor: 'pointer'}});

        this.mapa.addLayer(capa);
        
        if (esCapaDeRuta) {
            capa.id = 'capaDeRuta' + idx;
            this.capasDeRuta.push(capa.id);
        }
        capa.events.on({
            featureselected  : function (event, data) {
                var feature = event.feature;
                if (!MappirMap.instance.controlSeleccion.handlers.feature.evt) {
                    return;
                }
                var popup = new OpenLayers.Popup.FramedCloud("chicken",
                    feature.attributes.centroide || feature.geometry.getBounds().getCenterLonLat(),
                    null,
                    "<div style='font-size:.8em'>" + feature.attributes.html + "</div>",
                    null, true, function (event) {
                        MappirMap.instance.controlSeleccion.unselect(this.feature);
                        feature.layer.map.removePopup(this);
                        if ((popupIndex = feature.layer.popups.indexOf(popup)) > -1) {
                            feature.layer.popups.splice(popupIndex, 1);
                        }
                        this.destroy();
                        this.feature.popup = null;
                        popup = undefined;
                    });
                popup.feature = feature;
                feature.popup = popup;
                if(feature.layer.map !== null && feature.layer.map.addPopup !== null){
                	feature.layer.map.addPopup(popup);
                }
                if(feature.layer.popups !== undefined){
                	if(feature.popup !== undefined){
                		feature.layer.popups.push(feature.popup);
                	}
                }
            },
            featureunselected: function (event) {
                !event.feature.popup || event.feature.popup.destroy();
            },
            visibilitychanged: function (event) {
                var popups = event.object.popups;
                var map = event.object.map;
                if (popups!=null){
	                for (var p = 0; p < popups.length; p++) {
	                    try {
		                    map.removePopup(popups[p]);
		                    popups[p].destroy();
		                    popups[p].feature.popup = null;
                        } catch(e){
                        	//console.log(e);
                        }
	                }// for
                }// if
            }// visibilitychanged
        });
        return capa;
    },

    dibujarPuntoDireccion: function (descripcion, punto, carperta, consecutivo) {
        MappirMap.instance.dibujarMarcador(this.capaDirecciones, null, descripcion, punto, "images/mapa-puntos/" + carperta + "/" + consecutivo + ".png");
    },
    limpiarPuntosDireccion: function () {
    	try{
            MappirMap.instance.capaDirecciones.removeAllFeatures();
    	}catch(ex){
    		//alert(ex.message);
    	}
    }

});

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
    if (searching) {
        clearTimeout(searching);
    }
        searching = setTimeout(function () {
        	getMarks();
        },1000);
}
function getMarks(){
    if (marksArray.length>0){
        zoom = MappirMap.instance.mapa.getZoom();
        getMarksValidations(zoom);
        markerFunction=true;
    }else{
        markerFunction=false;
    	clearLayer("capaDeMarcadores");
    	$('#zoomAlert').hide();
        $('#zoomAlertContent').hide();
    }
    moveEvent();
}
function getWeather(){
    if ($("#Clima").is(':checked')){
        getWeatherMap();
        weatherFunction=true;
    }else{
        weatherFunction=false;
        var layerWeather = MappirMap.instance.mapa.getLayersByName("Clima")[0];
        // remove previous features from layer
        layerWeather.removeAllFeatures();
        try{
        	var mapnik = MappirMap.instance.mapa.getLayersByName("mapnik")[0];
	        // remove precipitation layer
	        if (mapnik !== undefined){
	    		MappirMap.instance.mapa.removeLayer(mapnik);
	    	}
	    }catch(e){
	    	//console.log(e);
	    }
    }
    moveEvent();
}
function getMarksValidations(zoom){
    if(marksArray.length != 0){
        if(zoom > 10){
        	$('#zoomAlert').hide();
            $('#zoomAlertContent').hide();
            var viewPort = MappirMap.instance.mapa.getExtent();
            viewPort =   viewPort.transform(MappirMap.instance.proyeccionInterna, MappirMap.instance.proyeccionExterna);
            var x1=viewPort.left,y1=viewPort.bottom,x2=viewPort.right,y2=viewPort.top;
            var data = {"x1":x1,"x2":x2,"y1":y1,"y2":y2,"tipos":marksArray};
            if (MappirMap.instance.ajaxMarcadores) {
                MappirMap.instance.ajaxMarcadores.abort();
                MappirMap.instance.marcadresContinuarSuccess = false;
            }
            MappirMap.instance.ajaxMarcadores = $.get(Mappir.config['servicios']['marcadoresEnMapa'],data, function(msg){
            	if (msg.data.length == 0){
            		clearLayer("capaDeMarcadores");
                    return;
                }
                addMarkToMap(msg);
            },'json')
                .fail(function(msg) {
                    if (msg.statusText=="abort"){
                    }else{
                    	alert('Ocurrió un error al descargar los puntos de interés en el mapa.');
                    }
                });
        }else{
        	$('#zoomAlert').show();
            $('#zoomAlertContent').show();
            var markers = MappirMap.instance.mapa.getLayersByName("capaDeMarcadores")[0];
            // remove previous features from layer
            clearLayer("capaDeMarcadores");
            setTimeout(function () {
            	$('#zoomAlert').hide();
                $('#zoomAlertContent').hide();
            },2500);
        }
    }else{
    	 $('#zoomAlert').hide();
         $('#zoomAlertContent').hide();
        var markers = MappirMap.instance.mapa.getLayersByName("capaDeMarcadores")[0];
        // remove previous features from layer
        clearLayer("capaDeMarcadores");
    }
}
function moveEvent(){
	var eventMovend = MappirMap.instance.mapa.events.listeners["moveend"];
    var eventCount=0;
    if (eventMovend){
        eventCount = eventMovend.length;
    }
    if (weatherFunction==false&&cloudsFunction==false&&markerFunction==false){
    	MappirMap.instance.mapa.events.unregister('moveend', MappirMap.instance.mapa , function(){
    		if (weatherFunction==true){
                getWeatherMap();
            }
    		if (cloudsFunction==true){
    			var precipitationWeather = MappirMap.instance.mapa.getLayersByName("Precipitación")[0];
    			if (precipitationWeather === undefined){
			        getCloudsMap();
				}
            }
            if (markerFunction==true){
                zoom = MappirMap.instance.mapa.getZoom();
                getMarksValidations(zoom);
            }
        });
    }else{
        if(eventCount==0){
        	MappirMap.instance.mapa.events.register('moveend', MappirMap.instance.mapa , function(){
        		if (weatherFunction==true){
                    getWeatherMap();
                }
        		if (cloudsFunction==true){
        			var precipitationWeather = MappirMap.instance.mapa.getLayersByName("Precipitación")[0];
        			if (precipitationWeather === undefined){
    			        getCloudsMap();
    				}
                }
                if (markerFunction==true){
                    zoom = MappirMap.instance.mapa.getZoom();
                    getMarksValidations(zoom);
                }
            });
        }

    }
}
function addMarkToMap(result){
	MappirMap.instance.marcadresContinuarSuccess = true;
    var categorias = [];
    for (var d in result.data) {
        if (!MappirMap.instance.marcadresContinuarSuccess) {
            break;
        }
        var marcador = result.data[d];
        var crcCategoria = crc32(marcador.categoria);
        if (undefined == categorias[crcCategoria]) {
            categorias[crcCategoria] = [];
        }
        categorias[crcCategoria].push({
                label: null,
                html : marcador.info == '' ? 'SIN INFORMACION' : ('<b>' + marcador.categoria + '</b><br>' + marcador.info),
                punto: [marcador.x, marcador.y],
                icono: marcador.icono_url
            }
        );
    }
	clearLayer("capaDeMarcadores");
    for (var crcCategoria in categorias) {
        capa = MappirMap.instance.mapa.getLayersByName("capaDeMarcadores")[0];
        MappirMap.instance.actualizarCapaDeMarcadores(capa, categorias[crcCategoria]);
    }
}
function getWeatherMap(){
	if (MappirMap.instance.ajaxClima) {
        MappirMap.instance.ajaxClima.abort();
        MappirMap.instance.climaContinuarSuccess = false;
    }
	var bbox =   MappirMap.instance.mapa.getExtent();
    bbox =   bbox.transform( MappirMap.instance.proyeccionInterna,  MappirMap.instance.proyeccionExterna);
    
    MappirMap.instance.ajaxClima = $.ajax({
        dataType: "json",
        url     : 'http://api.openweathermap.org/data/2.5/box/city?cluster=yes&lang=es&bbox=' + bbox.toBBOX() + ',' + MappirMap.instance.mapa.getZoom(),
        success : function (data) {
            var climaData = [];
            MappirMap.instance.climaContinuarSuccess = true;
            for (var i = 0; i < data.list.length; i++) {
                if (!MappirMap.instance.climaContinuarSuccess) {
                    break;
                }
                var item = data.list[i];
                var idIcono = item.weather[0].icon;
                climaData.push(
                    {
                        label         : null,
                        html          : '<div style="height: 170px;"><p><label>' + item.name + '</label></p>' +
                            '<div id="weather_block" style="float: left;">' +
                            '<div id="cur_weather_block" style="float: left;">' +
                            '<img id="weather_image" alt=" ' + item.weather[0].description + '" src="images/clima/' + idIcono + '.png">' +
                            '<div id="temp_block" style="float: left;">' +
                            '<div id="big_temp" style="font-size:30px; padding-top:6px;" title="Temperatura Actual">' + item.main.temp + '</div>' +
                            '<div id="small_temp_block" style"width:30px; overflow:visible;">' +
                            '<div id="small_temp">' + item.weather[0].main + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div id="small_val_grey" style="color:gray;" title="Temperatura Minima y Maxima">Min:' + item.main.temp_min + '\xBA / Max: ' + item.main.temp_max + '\xBA</div>' +
                            '<div id="small_val_grey" style="color:gray;">Humedad: ' + item.main.humidity + ' % </div>' +
                            '<div id="small_val_grey" style="color:gray;">Viento: ' + item.wind.speed + ' m/s </div>' +
                            '<div id="small_val_grey" style="color:gray;">Precipitación: ' + item.clouds.all + ' % </div>' +
                            '</div></div>',
                        punto         : [data.list[i].coord.lon, data.list[i].coord.lat],
                        icono         : 'images/clima/' + idIcono + '.png',
                        icono_absolute: true
                    }
                );
            }
            var capa = MappirMap.instance.mapa.getLayersByName("Clima")[0];
            MappirMap.instance.actualizarCapaDeMarcadores(capa, climaData);

        }
    });
}
function clearLayer(layer){
	var markers = MappirMap.instance.mapa.getLayersByName(layer)[0];
    // remove previous features from layer
    try {
        var popups = markers.popups;
        var mapa = MappirMap.instance.mapa;
        for (var p = 0; p < popups.length; p++) {
            try {
                var popup = popups[p];
                if (!popup.destroy) {
                    continue;
                }
                mapa.removePopup(popup);
                popup.destroy();
                popup.feature.popup = null;
            } catch(e) {
            	//console.log(e);
            }
        }
        capa.popups = [];
    } catch(e) {
    	//console.log(e);
    }
    markers.removeAllFeatures();
}
function appendToMenu(id, action, param,type,target,image){
	var k = document.createElement("input");
	k.checked = false;
	if(type=="radio"){
		// Mapa por defecto
//		if(param=="Mapa base TTR"){
		if(param=="Open Street Maps"){
			k.checked = true;
		}
		k.name = "View_baseLayers";
	}else{
		k.name = id+"_baseLayers";
	}
	if(param==""){
		k.id = id;
	}else{
		k.id = param;
	}
    k.type = type;
    k.setAttribute("onchange", action+"('"+param+"')");
    k.defaultChecked = false;
    var h = document.createElement("label");
    h.htmlFor = k.id;
    
    // OpenLayers.Element.addClass(h, "labelSpan olButton");

	if(image!=null){
		h.innerHTML = '<img src="images/layers/'+image+'" class="image18w"/> '+id;
	}else{
		h.innerHTML = ' '+id;
	}
    h.style.verticalAlign = "baseline";
    h.style.whiteSpace = "nowrap";
    var l = document.createElement("br");
    
    d = $( "#"+target );
    d.append(k);
    d.append(h);
    d.append(l);
}
function switchlayer(name){
	switcheos++;
	try{
		$("#capaDeRuta1Exportar").hide();
		$("#capaDeRuta2Exportar").hide();
	}catch(ex){debugger;}
	 var base = MappirMap.instance.mapa.getLayersByName(name)[0];
	 MappirMap.instance.mapa.setBaseLayer(base);
	 MappirMap.instance.mapa.baseLayer.setVisibility(true);
}
function getClouds(){
	var precipitationWeather = MappirMap.instance.mapa.getLayersByName("Precipitación")[0];
	if ($("#Precipitación").is(':checked')){
		if (precipitationWeather === undefined){
	        getCloudsMap();
		}
        cloudsFunction=true;
    }else{
        cloudsFunction=false;
        // remove precipitation layer
        MappirMap.instance.mapa.removeLayer(precipitationWeather);
        try{
        	var mapnik = MappirMap.instance.mapa.getLayersByName("mapnik")[0];
        // remove precipitation layer
        	if (mapnik !== undefined){
        		MappirMap.instance.mapa.removeLayer(mapnik);
        	}
        }catch(e){
        	//console.log(e);
        }
    }
    moveEvent();
    //MappirMap.instance.mapa.layers[8].zIndex=338;
}
function getCloudsMap(){
    var clouds = new OpenLayers.Layer.XYZ(
            "Precipitación",
            "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
            {
                numZoomLevels    : 19,
                isBaseLayer      : false,
                opacity          : 0.5,
                zIndex			 : 300,
                sphericalMercator: true
            }
        );

        clouds.label = '<img height="18px" src="images/layers/clima.png"> Precipitación';
        clouds.className += " cssClouds";
        clouds.setVisibility(true);
        MappirMap.instance.mapa.addLayer(clouds);
}
