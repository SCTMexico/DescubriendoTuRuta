var clearing = null;
var makeCRCTable = function () {
    var k, n, c, crcTable = [];
    for (n = 0; n < 256; n++) {
        c = n;
        for (k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
};

var crc32 = function (str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable()), crc = 0 ^ (-1), i;
    for (i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
};

Storage.prototype.setObject = function (key, value) {
    this[key] = JSON.stringify(value);
};

Storage.prototype.getObject = function (key, defaultValue) {
    if (undefined != this[key]) {
        return JSON.parse(this[key]);
    }
    return defaultValue;
};

jQuery.fn.extend({
    saveInLocalStorage     : function () {
        localStorage.setItem(this.attr('id'), this.val());
        data = {};
        for (var i in arguments) {
            data[arguments[i]] = this.data(arguments[i]);
        }
        localStorage.setObject(this.attr('id') + 'Data', data);
    },
    restoreFromLocalStorage: function () {
        this.val(localStorage.getItem(this.attr('id')));
        this.data(localStorage.getObject(this.attr('id') + 'Data'));
    }
});

function message(mensaje, titulo) {
	MappirInterface.instance.modalMenseaje.html(mensaje);
	if (titulo !== null && titulo !== undefined && titulo !== "") {
		MappirInterface.instance.modalTitulo.html(titulo);
	} else {
		MappirInterface.instance.modalTitulo.html('Atención');
	}
    MappirInterface.instance.modal.modal();
}
Mappir = function () {
    this.init();
};

// Se movieron las IP's al index
Mappir.config = {
    "url"      : {
        "base"         : "img/",
        "mapaBase"     : "http://geoserver.sct.gob.mx/geoserver/wms", // para SCT acceso Publico
        "url_compartir": ___servidor,// Habiliar para redes sociales
        "usr"          : 'sct',
        "key"          : 'sct'
    },
    "servicios": {
        "listaDeMarcadores"   : ___servidor + "servicios/geo/obtenerTiposDeMarcadores",
        "marcadoresEnMapa"    : ___servidor + "servicios/geo/obtenerMarcadores",
        "catalogoVehiculos"   : ___servidor + "servicios/geo/obtenerVehiculos",
        "catalogoCombustibles": ___servidor + "servicios/geo/obtenerCombustibles",
        "enviarRutaPorCorreo" : ___servidor + "servicios/geo/enviarCorreo",
        "contacto"            : ___servidor + "servicios/geo/contacto",
        "repotarIncidente"    : ___servidor + "servicios/geo/repotarIncidente",
        "busquedaDeDestinos"  : __servidorServiciosCoconut + "TTR/rest/GeoSearchLocationSvt",
        "busquedaDeRuta"      : __servidorServiciosCoconut + "TTR/rest/GeoRouteSvt",
        "rutasRecientes"      : __servidorServiciosCoconut + "TTR/rest/GeoRouteSvt/last",
        "rutasMasBuscadas"    : __servidorServiciosCoconut + "TTR/rest/GeoRouteSvt/top"        
    }
};

String.prototype.isEmpty = function () {
    return this == undefined || this == null || this.trim() == '';
};

$.fn.swapValData = function (other) {
    var tmpVal = other.val(), tmpData = other.getGeoData();
    other.val(this.val()).setGeoData(this.getGeoData());
    this.val(tmpVal).setGeoData(tmpData);
};

$.fn.getGeoData = function () {
    return {
        idCategoria: this.data("idCategoria"),
        desc       : this.data("desc"),
        idTramo    : this.data("idTramo"),
        source     : this.data("source"),
        target     : this.data("target"),
        x          : this.data("x"),
        y          : this.data("y")
    };
};

$.fn.setGeoData = function (geoData) {
	if (undefined !== geoData) {
		this.data("idCategoria", undefined == geoData.idCategoria ? null : geoData.idCategoria);
	    this.data("desc", undefined == geoData.desc ? null : geoData.desc);
	    this.data("idTramo", undefined == geoData.idTramo ? null : geoData.idTramo);
	    this.data("source", undefined == geoData.source ? null : geoData.source);
	    this.data("target", undefined == geoData.target ? null : geoData.target);
	    this.data("x", undefined == geoData.x ? null : geoData.x);
	    this.data("y", undefined == geoData.y ? null : geoData.y);	
	} else {
		this.data("idCategoria", "");
	    this.data("desc", "");
	    this.data("idTramo", "");
	    this.data("source", "");
	    this.data("target", "");
	    this.data("x", "");
	    this.data("y", "");
	}
};

$.fn.esValidoParaBusqueda = function () {
    var data = this.getGeoData();
    var esValido = undefined != data['idCategoria'] &&
        undefined != data['desc'] &&
        undefined != data['idTramo'] &&
        undefined != data['source'] &&
        undefined != data['target'] &&
        undefined != data['x'] &&
        undefined != data['y'] &&
        '' != data['idCategoria'] &&
        '' != data['desc'] &&
        '' != data['idTramo'] &&
        '' != data['source'] &&
        '' != data['target'] &&
        '' != data['x'] &&
        '' != data['y'] &&
        null != data['idCategoria'] &&
        null != data['desc'] &&
        null != data['idTramo'] &&
        null != data['source'] &&
        null != data['target'] &&
        null != data['x'] &&
        null != data['y'];
//    esValido = esValido && 
    return esValido;
};

$.widget("custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function (ul, items) {
        var me = this, currentCategory = "";
        $.each(items, function (index, item) {
            if (item.category != currentCategory) {
                ul.append("<li class='ui-autocomplete-category'><strong>" + item.category + "</strong></li>");
                currentCategory = item.category;
            }
            me._renderItemData(ul, item);
        });
    }
});

MappirInterface = function (selector) {
    this.init(selector);
};

MappirInterface.instance = null;
MappirInterface.primeraOcurrenciaDeResultados = undefined;
MappirInterface.comboAbierto = null;

MappirInterface.renderPdf = function (id) {
    $("#generandoPdf").modal('show');
//    switchlayer("Open Street Maps");
//    MappirMap.instance.mapa.layers[2].label, devuelve: "Mapa SCT"
    var base= MappirMap.instance.mapa.getLayersByName("Open Street Maps")[0];
    //var layerOpenStreetMaps = MappirMap.instance.mapa.layers[1];
//    var layerOpenStreetMaps = MappirMap.instance.mapa.baseLayer;
    MappirMap.instance.mapa.setBaseLayer(base);
    MappirMap.instance.mapa.baseLayer.setVisibility(true);
    MappirMap.instance.mapa.baseLayer.redraw();
//    layerOpenStreetMaps.setVisibility(true);
//    layerOpenStreetMaps.redraw();
    
    
//    MappirMap.instance.mapa
//    layerOpenStreetMaps.redraw();
    
//    alert('Pasa: ' + (layerOpenStreetMaps.label == "Open Street Maps") + "Vivible:" + layerOpenStreetMaps.visibility);
//    if (base.visibility == true) {
    	
//    	MappirMap.instance.mapa.setBaseLayer(layerOpenStreetMaps);
//    	layerOpenStreetMaps.setVisibility(true);
    	
	    var ruta = MappirInterface.instance.rutaEnPantalla[id];
	    var limites = new OpenLayers.Bounds(
	        ruta.caja.minX,
	        ruta.caja.minY,
	        ruta.caja.maxX,
	        ruta.caja.maxY
	    );
	   var layer = MappirMap.instance.mapa.getLayersByName("capaDeRuta1")[0];
	    var layer2 = MappirMap.instance.mapa.getLayersByName("capaDeRuta2")[0];
    	try{
    		var totalBounds = layer.getDataExtent();
    	}catch(ex){debugger;}
    	try{
    		var totalBounds2 = layer2.getDataExtent();
    	}catch(ex){debugger;}
    	if(totalBounds && totalBounds2){
    		
    		var size = totalBounds.getSize();
    		var size2 = totalBounds2.getSize();
    		if(size2.h>size.h || size2.w>size.w){
    			var maxBounds = totalBounds2;
    		}else{
    			var maxBounds = totalBounds;
    		}
    		MappirMap.instance.mapa.zoomToExtent(maxBounds);
    		
    	}else if(totalBounds){
    		MappirMap.instance.mapa.zoomToExtent(totalBounds);	
    	}else if(totalBounds2){
    		MappirMap.instance.mapa.zoomToExtent(totalBounds2);
    	}else{
    		MappirMap.instance.mapa.setCenter([-11036721.23618, 2209377.2207211], 5);
    	}
	//    MappirMap.instance.mapa.zoomToExtent(limites.transform(MappirMap.instance.proyeccionExterna, MappirMap.instance.proyeccionInterna));
	//    MappirMap.instance.mapa.setCenter(limites.getCenterLonLat());
	//    MappirMap.instance.mapa.layers[0].redraw();
	    
	    setTimeout(function () {
	        try {
		        MappirPdf.generarPdf(ruta);
	        } catch(e){
	        	console.log(e);
	        	$("#generandoPdf").modal('hide');
	        	message("Ocurrió un error al exportar el pdf.");
	        }
	        $("#generandoPdf").modal('hide');
//	        this.mapa.setBaseLayer(this.capaMapaBase);
	    }, 5000);
//    } else {
//    	MappirInterface.instance.modalCargando.modal('hide');
//    	message("Sólo se puede exportar el mapa 'Open Street Maps'.");
////    	MappirMap.instance.mapa.setBaseLayer(MappirMap.instance.mapa.layers[1]);
//    }
};

MappirInterface.moverDireccion = function (button) {
    var row = jQuery(button.parentNode.parentNode.parentNode);
    var next = $(row.next().find('input:first'));
    var current = $(row.find('input:first'));
    current.swapValData(next);
    MappirInterface.instance.actualizarPuntosEnMapa();
};

MappirInterface.quitarDireccion = function (button) {
    $(button).tooltip('destroy');
    $(button.parentNode.parentNode.parentNode).remove();
    MappirInterface.instance.maximoDeDirecciones();
};

MappirInterface.addDireccion = function (button) {
    $(button).tooltip('destroy');
    MappirInterface.instance.agregarControlDestino();
};

MappirInterface.auxiliarCombo = function (source, target, list) {
    target.text(source.text());
    target.data(source.data());
    target.trigger('change');
    list.hide();
};

MappirInterface.auxiliarAbrirCombo = function (e) {
	if (clearing) {
        clearTimeout(clearing);
        clearing = null;
    }
    var $this = $(this);
    var lista = $this.data('lista');
    if (lista != '#vechiculoLista') $('#vechiculoLista').hide();
    if (lista != '#rendimientoLista') $('#rendimientoLista').hide();
    if (lista != '#catalogoCombustiblesLista') $('#catalogoCombustiblesLista').hide();
    $(lista).toggle()
        .mouseenter(function () {
            $this.off('blur');
        })
        .mouseleave(function () {
            $this.on('blur', MappirInterface.auxiliarCerrarCombo);
        });
};

MappirInterface.auxiliarCerrarCombo = function () {
    var $this = $(this);
    $($this.data('lista')).hide();
};

MappirInterface.auxiliarTeclaCombo = function (e) {
    var $this = $(this);
    if (e.keyCode == 27 || e.keyCode == 9) {
        $($this.data('lista')).hide();
    }
};

MappirInterface.agregarDireccionDesdeMapa = function (lon, lat, posicion) {
    if (MappirInterface.instance.listaDirecciones.find('input').length > 4 && posicion == 'intermedio') {
    	var intermediosVacios=false;
    	var instance = MappirInterface.instance;
    	var direcciones = instance.listaDirecciones.find('input');
		for (var i = direcciones.length - 2; i >= 1; i--) {
			var input = $(direcciones[i]);
			if(input.val()==""){
				input[0].parentNode.parentNode.remove();
				intermediosVacios=true;
			}
			
		}
		if(!intermediosVacios){
			message("Máximo de destinos alcanzado");
	    	return;	
		}
    }

    MappirInterface.instance.modalCargando.modal("show");

    $.ajax({
        url     : __servidorServiciosCoconut + 'TTR/rest/ReverseGeocodeSvt',
        data    : {
            "x"  : lon,
            "y"  : lat,
            "usr": Mappir.config.url.usr,
            "key": Mappir.config.url.key
        },
        dataType: 'jsonp',
        success : function (_resp) {
            if (100 == _resp.code) {

                var instance = MappirInterface.instance;

                if (!_resp.results.idCategoria) {
                    _resp.results.idCategoria = -1;
                }
                if (posicion == 'inicio') {
                    var origen = MappirInterface.instance.listaDirecciones.find('input:first');
                    origen.setGeoData(_resp.results);
                    origen.val(_resp.results.desc);
                } else {
                    if (posicion != 'final') {
                		var direcciones = instance.listaDirecciones.find('input');
                    		for (var i = direcciones.length - 2; i >= 1; i--) {
                    			var input = $(direcciones[i]);
                    			if(input.val()==""){
                    				input[0].parentNode.parentNode.remove();
                    			}
                    		}
                        //instance.mapaControl.capaDirecciones.redraw();
                        var tmpFinal = instance.listaDirecciones.find('input:last');
                        instance.agregarControlDestino(null);
                 	    var _final = instance.listaDirecciones.find('input:last');
                        _final.setGeoData(_resp.results);
                        _final.val(_resp.results.desc);
                        tmpFinal.parent().find('span .sct-helper-intercambiar').trigger('click');
                    } else {
                        var _final = instance.listaDirecciones.find('input:last');
                        _final.setGeoData(_resp.results);
                        _final.val(_resp.results.desc);
                    }
                }

                instance.actualizarPuntosEnMapa();

                var campos = instance.listaDirecciones.find('input');
                var lanzarBusqueda = false;
                for (var i = 0; i < campos.length; i++) {
                    lanzarBusqueda = lanzarBusqueda && $(campos[i]).esValidoParaBusqueda();
                    if (!lanzarBusqueda) {
                        break;
                    }
                }

                if (lanzarBusqueda) {
                    instance.modalCargando.modal("hide");
                    instance.buscarRuta();
                    return;
                }

                instance.modalCargando.modal("hide");

            } else {
                message('El punto está fuera de la cobertura carretera.');
                MappirInterface.instance.modalCargando.modal("hide");
            }
        },
        error   : function () {
            MappirInterface.instance.modalCargando.modal("hide");
        }
    });

};
MappirInterface.asignarDirecciones = function (item) {

    var data;
    var instance = MappirInterface.instance;
    if (item.origen) {
        data = item;
    } else {
        data = $(item).data('config');
    }

    if (data.vehiculo) {
        $('#vechiculoLista li[data-value=' + data.vehiculo.subtipo + ']').trigger('click');

        $('#catalogoCombustiblesLista li[data-value=' + data.vehiculo.combustible + ']').trigger('click');

        $('#rendimiento').text(data.vehiculo.rendimiento + ' km/lt');
        $('#rendimiento').data('value', data.vehiculo.rendimiento);

    }

    $("#evitarCasetas").attr('checked', !!data.casetas);
    $("#evitarIncidentes").attr('checked', !!data.alertas);

    instance.listaDirecciones.empty();

    var origen = data.origen;
    instance.agregarControlDestino(origen);
    if (undefined != data.destinos) {
        for (var i = 0; i < data.destinos.length; i++) {
            var destino = data.destinos[i];
            instance.agregarControlDestino(destino);
        }
    } else {
        instance.agregarControlDestino(data.destino);
    }

    instance.buscarRuta();
};

Mappir.ruta = {};

jQuery.extend(MappirInterface.prototype, {

    templateRutaUno        : null,
    templateRutaDos        : null,
    templateRutaDireccion  : null,
    templateRutaMasBuscadas: null,
    templateRutasEnEquipo  : null,
    templateDireccion      : null,
    listaDirecciones       : null,
    origen                 : null,
    destino0               : null,
    buscarRutaBoton        : null,
    agregarDestino         : null,
    mapaControl            : null,
    resultado              : null,
    tramoResaltado         : null,
    modal                  : null,
    modalMenseaje          : null,
    modalCargando          : null,
    consecutivoRuta        : 0,
    rutaBase64             : null,
    rendimiento            : null,
    vehiculo               : null,
    excedente              : null,
    combustible            : null,
    climaCargado           : false,
    rutaCargada            : false,
    rutaEnPantalla         : [null, null],

    catCompletSettings: {
        source   : function (request, response) {
            $.ajax({
                url        : Mappir.config.servicios.busquedaDeDestinos,
                dataType   : "jsonp",
                crossDomain: true,
                data       : {
                    search: request.term,
                    usr   : Mappir.config.url.usr,
                    key   : Mappir.config.url.key
                },
                success    : function (data) {
                    $(this).removeClass("ui-autocomplete-loading");
                    
                    if (data !== undefined && data.results !== undefined) {
	                    var dataArreglado = $.map(data.results, function (categoria) {
	                        var toReturn = [];
	                        if (categoria !== null && categoria.items !== null && categoria.items.length !== null) {
		                        if (0 < categoria.items.length) {
		                            var items = categoria.items;
		                            for (var j in items) {
		                                var item = items[j];
		                                item.idCategoria = categoria.idCategoria;
		                                toReturn.push({
		                                    label   : item.desc,
		                                    value   : item.desc,
		                                    data    : item,
		                                    category: categoria.categoria
		                                });
		                            }
		                        }
	                        }
	                        return toReturn;
	                    });
	                    if (undefined !== dataArreglado && undefined !== dataArreglado[0]) {
	                        MappirInterface.primeraOcurrenciaDeResultados = dataArreglado[0];
	                    }
	                    response(dataArreglado);
	                }// fin $.map
            	}// Fin if
            });
        },
        minLength: 2,
        select   : function (event, ui) {
            var me = $(this);
            if (!ui.item) {
                me.data(null);
            } else {
                me.data(ui.item.data);
            }
            me.removeClass("ui-autocomplete-loading");
        },
        change   : function (event, ui) {
            var me = $(this);
            if (!ui.item && undefined != MappirInterface.primeraOcurrenciaDeResultados) {
                me.data(MappirInterface.primeraOcurrenciaDeResultados.data);
            }
            MappirInterface.primeraOcurrenciaDeResultados = undefined;
            MappirInterface.instance.actualizarPuntosEnMapa();
            me.removeClass("ui-autocomplete-loading");
        }
    },

    auxiliarTiempoCabecera: function (tiempo) {
        var minutes;
        if (tiempo >= 60) {
            minutes = Math.floor(tiempo % 60);
            if (minutes == 0) {
                return Math.floor(tiempo / 60) + ' <br ><span class="decimal">h</span>';
            }
            return Math.floor(tiempo / 60) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ' <br><span class="decimal">h:min</span>';
        } else {
            minutes = Math.ceil(tiempo % 60);
            return minutes + ' <span class="decimal">min</span>';
        }
    },

    auxiliarTiempo: function (tiempo) {
        var minutes;
        if (tiempo >= 60) {
            minutes = Math.floor(tiempo % 60);
            if (minutes == 0) {
                return Math.floor(tiempo / 60) + ' <span class="decimal">h</span>';
            }
            return Math.floor(tiempo / 60) + ' <span class="decimal">h</span> ' + (minutes < 10 ? ('0' + minutes) : minutes) + ' <span class="decimal">min</span>';
        } else {
            minutes = Math.ceil(tiempo % 60);
            return minutes + ' <span class="decimal">min</span>';
        }
    },

    auxiliarDistanciaCabecera: function (distancia) {
        if (distancia >= 1000) {
        	var distanciaEnKm = distancia/1000;
        	if (distanciaEnKm >= 1000) {
        		distanciaEnKm = formato_numero(distanciaEnKm, 2, ".", ",");
        		return distanciaEnKm + '<br><span class="decimal">km</span>';
        	}
            return distanciaEnKm.toFixed(2) + '<br><span class="decimal">km</span>';
        } else {
            return distancia.toFixed(2) + '<br ><span class="decimal">m</span>';
        }
    },

    auxiliarDistancia: function (distancia) {
        if (distancia >= 1000) {
        	var distanciaEnKm = distancia/1000;
        	if (distanciaEnKm >= 1000) {
        		distanciaEnKm = formato_numero(distanciaEnKm, 2, ".", ",");
        		return distanciaEnKm + ' <span class="decimal">km</span>';
        	}
            return distanciaEnKm.toFixed(2) + ' <span class="decimal">km</span>';
        } else {
            return distancia.toFixed(2) + ' <span class="decimal">m</span>';
        }
    },

    auxiliarMoneda: function (cantidad) {
        return '<span>$</span>' + cantidad.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },

    procesarRutaUno: function (response) {
        var instance = MappirInterface.instance;
        var instanceMap = MappirMap.instance;
        
        var resultado = instance.procesarRuta(response, 1, 'red', instance.templateRutaUno) !== false;
        if (resultado) {
        	if (!instanceMap.modoPantallaCompleta) {
                instanceMap.restaurarPantalla();
            } else {
                instanceMap.pantallaCompleta();
            }
        }
        return resultado;
    },

    procesarRutaDos: function (response) {
        var instance = MappirInterface.instance;
//        var instanceMap = MappirMap.instance;

        //instance.procesarRuta(response, 2, '#f406b1');
        instance.procesarRuta(response, 2, 'green', instance.templateRutaDos);
    },

    postProcesarRutaDos: function () {
//        var instance = MappirInterface.instance;
        var instanceMap = MappirMap.instance;

        //instanceMap.layerControl.maximizeControl();
        if (!instanceMap.modoPantallaCompleta) {
            instanceMap.restaurarPantalla();
        } else {
            instanceMap.pantallaCompleta();
        }
        var cajaRuta = null;
        if (undefined != MappirInterface.instance.rutaEnPantalla[1]) {
            cajaRuta = MappirInterface.instance.rutaEnPantalla[1].caja;
        } else if (undefined != MappirInterface.instance.rutaEnPantalla[2]) {
            cajaRuta = MappirInterface.instance.rutaEnPantalla[2].caja;
        } else {
            return;
        }

        var limites = new OpenLayers.Bounds(
            cajaRuta.minX,
            cajaRuta.minY,
            cajaRuta.maxX,
            cajaRuta.maxY
        );
        //postprocesarRuta2
        var layer = MappirMap.instance.mapa.getLayersByName("capaDeRuta1")[0];
	    var layer2 = MappirMap.instance.mapa.getLayersByName("capaDeRuta2")[0];
    	try{
    		var totalBounds = layer.getDataExtent();
    	}catch(ex){debugger;}
    	try{
    		var totalBounds2 = layer2.getDataExtent();
    	}catch(ex){debugger;}
    	if(totalBounds && totalBounds2){
    		
    		var size = totalBounds.getSize();
    		var size2 = totalBounds2.getSize();
    		if(size2.h>size.h || size2.w>size.w){
    			var maxBounds = totalBounds2;
    		}else{
    			var maxBounds = totalBounds;
    		}
    		MappirMap.instance.mapa.zoomToExtent(maxBounds);
    		
    	}else if(totalBounds){
    		MappirMap.instance.mapa.zoomToExtent(totalBounds);	
    	}else if(totalBounds2){
    		MappirMap.instance.mapa.zoomToExtent(totalBounds2);
    	}else{
    		MappirMap.instance.mapa.setCenter([-11036721.23618, 2209377.2207211], 5);
    	}
//        instanceMap.mapa.updateSize();
//        instanceMap.mapa.zoomToExtent(limites.transform(instanceMap.proyeccionExterna, instanceMap.proyeccionInterna));
        //instanceMap.mapa.setCenter(limites.getCenterLonLat());

        instanceMap.extendDeRuta = [instanceMap.mapa.getCenter(), instanceMap.mapa.getZoom()];

        /*
        if (instanceMap.controlHover) {
            instanceMap.mapa.removeControl(instanceMap.controlHover);
        }
        instanceMap.controlHover = new OpenLayers.Control.SelectFeature(instanceMap.mapa.getLayersByName('capaDeRuta'),
            {
                click         : false,
                clickout      : false,
                toggle        : false,
                multiple      : false,
                hover         : true,
                toggleKey     : "ctrlKey", // ctrl key removes from selection
                multipleKey   : "shiftKey", // shift key adds to selection
                pixelTolerance: 0,
                box           : false,
                id            : 'FEATURE_HOVER_CONTROL'
            });

        instanceMap.mapa.addControl(instanceMap.controlHover);
        instanceMap.controlHover.activate();
        */
    },

    procesarRuta: function (response, tipo, color, template) {

        var instance = MappirInterface.instance;

        if ('100' != response.code) {
            instance.modalCargando.modal("hide");
            message("Ha ocurrido un error al procesar su petición, por favor intente más tarde.");
            return false;
        }

        if (undefined == response.results) {
            instance.modalCargando.modal("hide");
            message("No hemos podido determinar una ruta.");
            MappirInterface.instance.habilitarBusqueda();
            return false;
        }

        MappirMap.instance.limpiarPuntosDireccion();
        var idxLimit = response.results.length;
        var idx = 0, j = 0, k = 0;

        var cajasRutas = {};

        var result = response.results;

        for (var idx = 0; idx < idxLimit; idx++) {
            var ruta = result[idx];

            if (undefined == ruta.grafo[0]) {
                instance.modalCargando.modal("hide");
                message("No hemos podido determinar una ruta.");
                MappirInterface.instance.habilitarBusqueda();
                return false;
            }

            var capaIndex = tipo;

            var jLimit = ruta.grafo.length;
            var cajaRuta = {
                minX: ruta.grafo[0][11][0][0],
                minY: ruta.grafo[0][11][0][1],
                maxX: ruta.grafo[0][11][0][0],
                maxY: ruta.grafo[0][11][0][1]
            };

            var idCapa= "capaDeRuta"+(capaIndex);
            var capaDeRuta = MappirMap.instance.mapa.getLayersByName(idCapa)[0];
            clearLayer(idCapa);

            var origenCoordenada = ruta.grafo[0][11][0];
            var ultimoTramo = ruta.grafo[ruta.grafo.length - 1];
            var puntosUltimoTramo = ruta.grafo[ruta.grafo.length - 1][11];
            var ultimoPunto = puntosUltimoTramo[puntosUltimoTramo.length - 1];
            var finalCoordenada = ultimoPunto;

            instance.mapaControl.dibujarMarcador(capaDeRuta, 'Origen', ruta.grafo[0][1], origenCoordenada, "images/mapa-puntos/finales/0.png", 35);

            var detalleTemplateData = [];
            var consecutivo = 1;
            var puntoIntermedioConsecutivo = 1;
            var totalAlertas = 0;
            for (var j = 0; j < jLimit; j++) {
                var tramo = ruta.grafo[j];

                var detalleTmp = {
                    consecutivo : consecutivo++,
                    descripcion : tramo[1],
                    indicacion  : tramo[2],
                    estado      : tramo[3],
                    municipio   : tramo[5],
                    indicacionId: tramo[14],
                    tiempo      : instance.auxiliarTiempo(tramo[6]),
                    distancia   : instance.auxiliarDistancia(tramo[7]),
                    caja        : null,
                    tramo       : null,
                    capa        : capaDeRuta.id,
                    casetas     : null,
                    alertas     : null
                };

                // DIBUJA EL TRAM0
                var detallePopup = "<div><b>" + detalleTmp.consecutivo + " ) " + detalleTmp.indicacion + "</b></div>" +
                    "    <div>" + detalleTmp.descripcion + "<br>" +
                    "        " + detalleTmp.estado + ", " + detalleTmp.municipio + "" +
                    "    </div>" +
                    "    <div>" + detalleTmp.distancia + " " + detalleTmp.tiempo + "</div>";

                var casetasTemplateData = [];

                for (var casetaId in tramo[12]) {
                    var caseta = tramo[12][casetaId];
                    var html = '<b>Costo: </b>' + instance.auxiliarMoneda(caseta[3]) + '</br>' +
                        '<b>Acepta: </b>' + caseta[5].join(', ') + '<hr>' +
                        caseta[2];
                    var mPagos =  caseta[5].join(', ');
                    casetasTemplateData.push({titulo: tramo[12][0][1], acepta: mPagos, costo: instance.auxiliarMoneda(tramo[12][0][3])});
                    instance.mapaControl.dibujarMarcador(capaDeRuta, caseta[1], html, caseta[4], "images/mapa/caseta.png");
                }

                detalleTmp.casetas = casetasTemplateData;

                var caja = {};
                for (k = 0; k < tramo[11].length; k++) {
                    var punto = tramo[11][k];
                    caja.minX = caja.minX < punto[0] ? caja.minX : punto[0];
                    caja.minY = caja.minY < punto[1] ? caja.minY : punto[1];
                    caja.maxX = caja.maxX > punto[0] ? caja.maxX : punto[0];
                    caja.maxY = caja.maxY > punto[1] ? caja.maxY : punto[1];
                    cajaRuta.minX = cajaRuta.minX < punto[0] ? cajaRuta.minX : punto[0];
                    cajaRuta.minY = cajaRuta.minY < punto[1] ? cajaRuta.minY : punto[1];
                    cajaRuta.maxX = cajaRuta.maxX > punto[0] ? cajaRuta.maxX : punto[0];
                    cajaRuta.maxY = cajaRuta.maxY > punto[1] ? cajaRuta.maxY : punto[1];
                }

                detalleTmp.caja = caja;

                // DIBUJA EL TRAM0
                var detallePopup = "<div><b>" + detalleTmp.consecutivo + " ) " + detalleTmp.indicacion + "</b></div>" +
                    "    <div>" + detalleTmp.descripcion + "<br>" +
                    "        " + detalleTmp.estado + ", " + detalleTmp.municipio + "" +
                    "    </div>" +
                    "    <div>" + detalleTmp.distancia + " " + detalleTmp.tiempo + "</div>";

                instance.mapaControl.dibujarTramoRuta(capaDeRuta, detallePopup, tramo[11]);

                detalleTmp.tramo = capaDeRuta.features.length - 1;
                // DIBUJA LAS ALERTAS
                detalleTmp.alertas = [];
                for (var t = 0; t < tramo[13].length; t++) {
                    detalleTmp.alertas.push({descripcion: tramo[13][t][1]});
                    instance.mapaControl.dibujarMarcador(capaDeRuta, '', tramo[13][t][1], tramo[13][t][2], "images/mapa/advertencia.png");
                }
                totalAlertas += tramo[13].length;

                // PREGUNTA SI ES UN PUNTO INTERMEDIO
                if (tramo[15]) {
                    var direccion = tramo[15];
                    instance.mapaControl.dibujarMarcador(capaDeRuta, direccion.desc, direccion.desc, [direccion.x, direccion.y], "images/mapa-puntos/intermedios/" + (puntoIntermedioConsecutivo++) + ".png", 40);
                }

                detalleTemplateData.push(detalleTmp);

            }

            instance.mapaControl.dibujarMarcador(capaDeRuta, 'Destino', ultimoTramo[1], finalCoordenada, "images/mapa-puntos/finales/" + puntoIntermedioConsecutivo + ".png", 35);

            $("#compartir_titulo").val(ruta.titulo);

            var informacionRuta = {
                consecutivo          : instance.consecutivoRuta++,
                id                   : capaIndex,
                class                : 'primary',
                titulo               : (ruta.tipo == 1 ? "Ruta sugerida: ":"Ruta alterna: ") + ruta.titulo,
                descripcion          : ruta.descripcion,
                tiempo               : instance.auxiliarTiempoCabecera(ruta.tiempoTotal),
                distancia            : instance.auxiliarDistanciaCabecera(ruta.distanciaTotal),
                costoCasetas         : instance.auxiliarMoneda(ruta.casetasTotal),
                costoGasolina        : instance.auxiliarMoneda(ruta.gasTotal),
                costo                : instance.auxiliarMoneda(ruta.gasTotal + ruta.casetasTotal),
                detalles             : detalleTemplateData,
                tipoVehiculo         : instance.excedente.data('value') == 0 ? instance.vehiculo.text() : (instance.vehiculo.text() + " con " + instance.excedente.data('value') + " ejes excedentes"),
                rendimiento          : instance.rendimiento.text(),
                numeroCasetas        : ruta.casetasNo,
                numeroAlertas        : totalAlertas,
                ultimoTramoIntermedio: puntoIntermedioConsecutivo,
                color                : color,
                caja                 : cajaRuta
            };

            template.perform(informacionRuta);
            $("#contenedorDeRutas").show();
            cajasRutas["capaDeRuta" + capaIndex + "Detalle"] = new OpenLayers.Bounds(
                cajaRuta.minX,
                cajaRuta.minY,
                cajaRuta.maxX,
                cajaRuta.maxY
            ).transform(instance.mapaControl.proyeccionExterna, instance.mapaControl.proyeccionInterna);
        }

        instance.rutaEnPantalla[capaIndex] = informacionRuta;

        $('.rutaDetalleFilaBoton').each(function (idx, item) {
            var jItem = $(item);
            var caja = jItem.data("caja");
            jItem.data('minX');
            jItem.data("caja",
                new OpenLayers.Bounds(
                    jItem.data('minX'),
                    jItem.data('minY'),
                    jItem.data('maxX'),
                    jItem.data('maxY')
                ).transform(MappirInterface.instance.mapaControl.proyeccionExterna, MappirInterface.instance.mapaControl.proyeccionInterna));

            jItem.click(function () {
                var me = $(this);
                MappirInterface.instance.mapaControl.resaltarTramo(me.data('capa'), me.data('tramo'), me.data("caja"));
                parent = me.parents(".list-group");
                parent.find('.list-group-item').removeClass('active');
                parent.find('.btn-default').toggleClass("btn-default btn-primary");
                me.parents(".list-group-item").addClass('active');
                me.toggleClass("btn-default btn-primary");
            });
        });

        $('a.rutaCapaDetalleBoton').each(function (idx, item) {
            var jItem = $(item);
            if (jItem.data('icon')) {
                return;
            }
            jItem.data("icon", jItem.find('i:first'));
            jItem.data("detalle", $('#' + jItem.data('capaId') + 'Detalle'));
            jItem.data("exportar", $('#' + jItem.data('capaId') + 'Exportar'));
            jItem.data("caja", cajasRutas[jItem.data('capaId') + 'Detalle']);

            jItem.click(function () {
                var me = $(this);
                if (me.data("hold") === true && me.data('icon').hasClass('glyphicon-minus-sign')) {
                    //prevenir doble click, ya que openlayers es algo lento para redibujar
                    return;
                }
                me.data("hold", true);
                var instance = MappirInterface.instance;

                var jBoton = $('a.rutaCapaDetalleBoton[data-capa-id!="' + me.data('capaId') + '"]');
                if (jBoton.length > 0) {
                    if (jBoton.data('icon').hasClass('glyphicon-minus-sign')) {
                        jBoton.data('icon').toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
                        jBoton.data("detalle").hide(0);
                        jBoton.data("exportar").hide(0);
                    }
                }

                me.data('icon').toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
                me.data("detalle").toggle(0);
                if(switcheos==0){
                    me.data("exportar").toggle(0);
                }else{
                	me.data("exportar").hide();
                }
                //JItemClick
                MappirMap.instance.mapa.updateSize();
                instance.mapaControl.mapa.zoomToExtent(me.data("caja"));

                instance.mapaControl.mostrarTodasOMostrarSolo(me.data('capaId'));
                me.data("hold", false);
            });
        });

        $('#contenedorDeRutas').show();

        var compartirFacebook = $('#compartir-facebook');
        compartirFacebook.attr('href', compartirFacebook.data('url') + Mappir.config.url.url_compartir + '?ruta=' + instance.rutaBase64);
        var compartirTwitter = $('#compartir-twitter');
        compartirTwitter.attr('href', compartirTwitter.data('url') + Mappir.config.url.url_compartir + '?ruta=' + instance.rutaBase64);
        var compartirGoogle = $('#compartir-google');
        compartirGoogle.attr('href', compartirGoogle.data('url') + Mappir.config.url.url_compartir + '?ruta=' + instance.rutaBase64);

        instance.modalCargando.modal("hide");

        instance.rutaCargada = true;

        return cajaRuta;
    },

    agregarControlDestino: function (data) {
    	var numDirs = MappirInterface.instance.listaDirecciones.find('input').length;
    	if(null != numDirs && undefined != numDirs && numDirs < 5) {
	        var instance = MappirInterface.instance;
	        if (null != data && data.type) {
	            instance.templateDireccion.perform(null);
	            instance.listaDirecciones.find('button:last').trigger('click');
	        } else {
	            instance.templateDireccion.perform(data);
	        }
	
	        instance.listaDirecciones.find('input.catcomplete:last').catcomplete(instance.catCompletSettings).on('blur',
	            function () {
	                var me = $(this);
	                if (!me.esValidoParaBusqueda()) {
	                    me.val("");
	                } else {
	                    if ('' == me.val()) {
	                        me.setGeoData();
	                    }
	                }
	            }
	        );
	
	        $('div.tooltip.fade.bottom').remove();
	        instance.listaDirecciones.find('button[title]').tooltip();
	
	        instance.activarEnterEnBusqueda();
	        
	        instance.maximoDeDirecciones();
    	}// Fin del if de numero de direcciones(maximo 5)
    	else {
    		message("Máximo de destinos alcanzado");
    	}
    },
    
    activarEnterEnBusqueda: function () {
		MappirInterface.instance.listaDirecciones.find('input').on('keydown', function (evt) {
			var ultimo = MappirInterface.instance.listaDirecciones.find('input:last');
            if (evt.keyCode == 13 && ultimo[0] === evt.currentTarget) {
            	try {
            		evt.preventDefault();
            		evt.stopImmediatePropagation();
                	evt.stopPropagation();
            	}catch(ex){}
            	if (ultimo.esValidoParaBusqueda()) {
            		$("#buscarRuta").click();
            	}
            }
        });
    },

    buscarRuta: function (evt) {
    	try {
    		if (evt !== undefined) {
    			evt.preventDefault();
    			evt.stopImmediatePropagation();
    			evt.stopPropagation();
    		}
    	}catch(ex){}
    	
    	MappirInterface.instance.deshabilitarBusqueda();
    	
        var instance = MappirInterface.instance;
        var ultimoDestino = $('destino:last');
        if (instance.destino0.val() == '' && ultimoDestino.val() != '') {
            instance.destino0.swapValData(ultimoDestino);
        }

        instance.maximoDeDirecciones();

        var direcciones = instance.listaDirecciones.find('input');

        var origen = $(direcciones[0]);

        var data = {
            "usr"     : Mappir.config.url.usr,
            "key"     : Mappir.config.url.key,
            "origen"  : origen.getGeoData(),
            "destinos": [],
            "opciones": {
                "casetas": !$("#evitarCasetas").is(':checked'),
                "alertas": !$("#evitarIncidentes").is(':checked')
            },
            "vehiculo": {
                "tipo"       : instance.vehiculo.data('categoria'),
                "subtipo"    : instance.vehiculo.data('value'),
                "rendimiento": instance.rendimiento.data('value'),
                "combustible": instance.combustible.data('value'),
                "costoltgas" : instance.combustible.data('costo'),
		        "excedente"  : instance.excedente.data('value')
            },
            "ruta"    : 1 // 1 - corta, 2 - rapida, etc.
        };
        
        var cleanedAutocomplete = ("" == data.origen.desc && "" == data.origen.idCategoria && "" == data.origen.idTramo && "" == data.origen.source && "" == data.origen.target && "" == data.origen.x &&  "" == data.origen.y);

        if (null == data.origen.desc ||
            null == data.origen.idCategoria ||
            null == data.origen.idTramo ||
            null == data.origen.source ||
            null == data.origen.target ||
            null == data.origen.x ||
            null == data.origen.y || cleanedAutocomplete) {
            message("Debes seleccionar al menos un origen y un destino.");
            MappirInterface.instance.habilitarBusqueda();
            return;
            
            
        }

        var previo = data.origen;
        var tieneElementosVacios = false;
        for (var i = 1; i < direcciones.length; i++) {
            jElement = $(direcciones[i]);
            geoData = jElement.getGeoData();
            if (instance.distancia(previo, geoData) <= 10 && previo.desc == geoData.desc) {
                message("Hay ubicaciones repetidas.");
                MappirInterface.instance.habilitarBusqueda();
                return;
            } else {
                if (instance.distancia(previo, geoData) < 500) {
                    message("Los puntos " + previo.desc + " y " + geoData.desc + ", están muy cerca, no se puede calcular la ruta.");
                    MappirInterface.instance.habilitarBusqueda();
                    return;
                }
            }

            if (jElement.esValidoParaBusqueda()) {
                data.destinos.push(geoData);
                previo = geoData;
            } else {
                tieneElementosVacios = true;
                continue;
            }

        }

        if (data.destinos.length == 0) {
            message("Debes seleccionar almenos un origen y un destino.");
            MappirInterface.instance.habilitarBusqueda();
            return;
        }

        if (tieneElementosVacios || (direcciones.length - 1) != data.destinos.length) {
            message("Debes seleccionar una ubicación para el origen y para cada punto intermedio.");
            MappirInterface.instance.habilitarBusqueda();
            return;
        }

        //INICIA LIMPIADO DE MAPA
        
        instance.mapaControl.limpiarPuntosDireccion();
        instance.templateRutaUno.empty();
        instance.templateRutaDos.empty();
        clearLayer("capaDeRuta1");
        clearLayer("capaDeRuta2");
//        MappirMap.instance.mapa.zoomToMaxExtent();
        if (!instance.mapaControl.modoPantallaCompleta) {
            $("#contenedorDeRutas").hide();
            instance.mapaControl.restaurarPantalla();
        } else {
            instance.mapaControl.pantallaCompleta();
        }
        instance.mapaControl.capasDeRutaVisible = null;
        instance.mapaControl.tramoResaltado = null;
        instance.rutaCargada = false;
        var mapa = instance.mapaControl.mapa;
        var capasDeRuta = mapa.getLayersByName('capaDeRuta');
        for (var cr = 0; cr < capasDeRuta.length; cr++) {
            mapa.removeLayer(capasDeRuta[cr]);
        }
        capasDeRuta = null;
        delete capasDeRuta;

        //TERMINALIMPIADO DE MAPA
        instance.modalCargando.modal("show");
        instance.rutaBase64 = btoa(JSON.stringify(data));
        
//console.log(data);
        $.ajax({
                url        : Mappir.config.servicios.busquedaDeRuta,
                data       : {"json":JSON.stringify(data)},
                contentType: 'application/json',
                dataType   : 'jsonp',
                timeout    : 60000,
                cache      : false,
                success    : function (resp) {
                	var resultadoRuta1 = instance.procesarRutaUno(resp);
                	
                	if (resultadoRuta1 == true && resp.status == "OK" && resp.results !== undefined && resp.results[0] !== undefined 
                		&& resp.results[0].grafo !== undefined && resp.results[0].grafo.length > 0) {
                		
                		// Esta linea es para hacer el zoom, se llama aqui para hacer el zoom 
                        // desde que termine la busqueda de la primera ruta
                        MappirInterface.instance.postProcesarRutaDos();
                		
                		var data2= data;
                        data2.ruta = 2;
                        
                        $.ajax({
                        		url		   : Mappir.config.servicios.busquedaDeRuta,
                                data       :  {"json":JSON.stringify(data2)},
                                contentType: 'application/json',
                                dataType   : 'jsonp',
//                                success    : instance.procesarRutaDos,
                                success    : function (resp) {
                                	instance.procesarRutaDos(resp);
                                },
                                timeout    : 60000,
                                cache      : false,
                                complete   : function () {
                                    MappirInterface.instance.postProcesarRutaDos();
                                    MappirInterface.instance.habilitarBusqueda();
                                },
                                error      : function () {
                                	MappirInterface.instance.habilitarBusqueda();
                                    MappirInterface.instance.modalCargando.modal("hide");
                                    message("Ha ocurrido un error al intentar cargar la ruta alterna.");
                                }
                            }
                        );//fin ajax ruta 2
                	} else {// fin if resp "OK"
                		
                        MappirInterface.instance.modalCargando.modal("hide");
                        message("Ha ocurrido un error al intentar cargar la ruta sugerida.");
                        if (!instance.mapaControl.modoPantallaCompleta) {
                            $("#contenedorDeRutas").hide();
                            instance.mapaControl.restaurarPantalla();
                        } else {
                            instance.mapaControl.pantallaCompleta();
                        }
                        MappirInterface.instance.habilitarBusqueda();
                	}
                },// fin success
                error      : function (e) {
                	MappirInterface.instance.habilitarBusqueda();
                    MappirInterface.instance.modalCargando.modal("hide");
                    message("Ha ocurrido un error al intentar cargar la ruta sugerida.");
                }
            }
        );
        
        var rutas = localStorage.getObject('rutasBuscadasEsteEquipo', []);
        var cargadas = [];
        var tmpRutas = [];
        for (var r = 0; r < rutas.length; r++) {
            var ruta = rutas[r];
            rutaCrc32 = instance.obtenerHashRuta(ruta);
            if (cargadas.indexOf(rutaCrc32) > -1) {
                continue;
            }
            cargadas.push(rutaCrc32);
            tmpRutas.push(ruta);
        }

        rutas = tmpRutas;

        if (rutas.length >= 10) {
            rutas.splice(0, 1);
        }

        rutas.push({
            origen  : data.origen,
            destinos: data.destinos,
            opciones: data.opciones,
            vehiculo: data.vehiculo
        });

        localStorage.setObject('rutasBuscadasEsteEquipo', rutas);

        instance.cargarRutasEnEquipo();
    },


    cargarRutasEnEquipo: function () {
        var rutas = localStorage.getObject('rutasBuscadasEsteEquipo', []);
        this.templateRutasEnEquipo.empty();
        var cargadas = [];
        var instance = MappirInterface.instance;
        for (var i in rutas) {
            ruta = rutas[i];
            rutaCrc32 = instance.obtenerHashRuta(ruta);

            if (cargadas.indexOf(rutaCrc32) > -1) {
                continue;
            }
            cargadas.push(rutaCrc32);
            rutas[i].config = JSON.stringify(ruta).replace(/"/g, "&quot;");
            this.templateRutasEnEquipo.perform(ruta);
        }
    },

    obtenerHashRuta: function (ruta) {
        return crc32(JSON.stringify(ruta));
    },

    obtenerParametroRuta: function () {
        var regex = new RegExp("[\\?&]ruta=([^&#]*)"),
            results = regex.exec(location.search);
        try {
            return results == null ? {} : JSON.parse(atob(decodeURIComponent(results[1].replace(/\+/g, " "))));
        } catch (e) {
//        	console.log(e);
            return {};
        }
    },

    init: function (selector) {
        $('[title]').tooltip({placement: 'right'});

        MappirInterface.instance = this;

        this.mapaControl = new MappirMap(selector);
        this.templateRutaUno = new MPLTemplate("#rutaUno").load("#templateRuta");
        this.templateRutaDos = new MPLTemplate("#rutaDos").load("#templateRuta");
        this.templateDireccion = new MPLTemplate("#direcciones").load("#templateDireccion");
        this.templateRutaMasBuscadas = new MPLTemplate("#rutasMasBuscadas").load("#templateRutaMasBuscadas");
        this.templateRutasEnEquipo = new MPLTemplate("#rutasEnEquipo").load("#templateRutaMasBuscadas");
        this.listaDirecciones = $('#direcciones');
        this.listaDirecciones.sortable({items: ">div.row", axis: "y", cursor: "move", stop: MappirInterface.instance.maximoDeDirecciones});
        this.agregarDestino = $("#agregarDestino");
        this.modalCargando = $("#cargandoEspere");
        this.rendimiento = $('#rendimiento');
        this.vehiculo = $('#catalogoVehiculos');
        this.excedente = $('#totalExcedente');
        this.combustible = $('#catalogoCombustibles');

        this.vehiculo.on('change', this.asignarRendimiento);
        this.vehiculo.trigger('change');

        this.agregarControlDestino(null);
        this.agregarControlDestino(null);

        this.cargarRutas(Mappir.config.servicios.rutasMasBuscadas, this.templateRutaMasBuscadas);
        this.cargarRutasEnEquipo();

        this.buscarRutaBoton = $("#buscarRuta");

        this.origen = $('#origen');

        this.destino0 = this.listaDirecciones.find('input:first');

        this.modal = $('#mappirAlert');
        this.modalMenseaje = $('#mappirAlertContenido');
        this.modalTitulo = $('#tituloAlerta');

        //this.agregarDestino.click(this.agregarControlDestino);

        this.buscarRutaBoton.click(this.buscarRuta);

        this.origen.next().click($.proxy(function () {
            this.origen.swapValData(this.destino0);
        }, this));

        this.destino0.catcomplete(this.catCompletSettings);
        this.origen.catcomplete(this.catCompletSettings);

        var data = this.obtenerParametroRuta();
        if (data.origen) {
            MappirInterface.asignarDirecciones(data);
        }

        $(this.mapaControl.mapa.div).contextPopup({
            items: [
				{label: 'Limpiar Ruta', icon: "images/arrastre.jpg", action: function (e) {
					MappirInterface.instance.limpiarCombos("all");
				} },
                {label: 'Ruta desde aquí', icon: "images/mapa-puntos/inicio.png", action: function (e) {
                    var me = $(this);
                    MappirInterface.agregarDireccionDesdeMapa(me.data('lon'), me.data('lat'), 'inicio');
                } },
                {label : 'Pasar por aquí', icon: "images/mapa-puntos/intermedio.png", action: function () {
                    var me = $(this);
                    MappirInterface.agregarDireccionDesdeMapa(me.data('lon'), me.data('lat'), 'intermedio');
                }, show: function () {
                    return MappirInterface.instance.listaDirecciones.find('input').length <= 5;
                } },
                {label: 'Ruta hasta aquí', icon: "images/mapa-puntos/final.png", action: function () {
                    var me = $(this);
                    MappirInterface.agregarDireccionDesdeMapa(me.data('lon'), me.data('lat'), 'final');
                } }
//                null,// separator
//                {label: 'Reportar incidente', icon: "images/mapa/advertencia.png", action: function () {
//                	
//                	// Esta parte unicamente es para mostrar e inicializar el pop de Reportar incidente
//                    MappirInterface.instance.modalCargando.modal("show");
//                    var me = $(this);
//                    $('#incidente_x').val(me.data('lon'));
//                    $('#incidente_y').val(me.data('lat'));
//
//                    $.ajax({
//                        url     : __servidorServiciosCoconut + 'TTR/rest/ReverseGeocodeSvt',
//                        data    : {
//                            "x"  : me.data('lon'),
//                            "y"  : me.data('lat'),
//                            "usr": Mappir.config.url.usr,
//                            "key": Mappir.config.url.key
//                        },
//                        dataType: 'jsonp',
//                        success : function (_resp) {
//                            MappirInterface.instance.modalCargando.modal("hide");
//                            if (100 == _resp.code) {
//                                $('#modalReportarIncidenteLugar').text(_resp.results.desc);
//                                $('#incidente_titulo').val("REPORTE: " + _resp.results.desc);
//                                $('#reportarIncidente').modal('show');
//                            } else {
//                                message('El punto está fuera de la cobertura carretera.');
//                            }
//                        },
//                        error   : function () {
//                            MappirInterface.instance.modalCargando.modal("hide");
//                        }
//                    }); // ROS, fin .ajax
//
//                }} // ROS, fin del action; fin array {label
            ]// ROS, fin items
        }); // fin, context pop up

    }, // Fin de la funcion init

    cargarRutas: function (url, template) {
        template.empty();
        $.ajax({    url    : url,
                data       : {usr: Mappir.config.url.usr, key: Mappir.config.url.key, limit: 10},
                //contentType: 'application/json',
                dataType   : 'jsonp',
                success    : function (resp) {
                    for (var i in resp.results) {
                        var tmp = resp.results[i];
						tmp.origen.idCategoria = -1;
						tmp.destino.idCategoria = -1;
                        tmp.config = JSON.stringify(tmp).replace(/"/g, "&quot;");
                        tmp.destinos = [tmp.destino];
                        template.perform(tmp);
                    }
                }
            }
        );
    },

    maximoDeDirecciones: function () {
        var me = MappirInterface.instance;
        var numDirs = me.listaDirecciones.find('input').length;
        if (numDirs <= 5) {
            me.agregarDestino.removeClass('disabled');
        } else {
            me.agregarDestino.addClass('disabled');
            message("Máximo de destinos alcanzado");
        }
        var tas = me.listaDirecciones.find('.input-group-addon');
        for (var i = 0; i < tas.length; i++) {
            tas[i].innerHTML = ' <img src="images/arrastre.jpg" width="10" height="12"> <img src="images/web-puntos/intermedios/' + i + '.png" height="18" style="margin:3px;"/> A';
        }
        tas[--i].innerHTML = '<img src="images/arrastre.jpg" width="10" height="12"> <img src="images/web-puntos/finales/' + i + '.png" height="24"/> Hasta';
        tas[0].innerHTML = ' <img src="images/arrastre.jpg" width="10" height="12"> <img src="images/web-puntos/finales/0.png" height="24" /> Desde';

        me.listaDirecciones.find('.btn').show();
        me.listaDirecciones.find('.btn.sct-helper-quitar:first').hide();
        if (numDirs <= 2) {
        	me.listaDirecciones.find('.btn.sct-helper-quitar:last').hide();
        }
        me.listaDirecciones.find('.btn.sct-helper-intercambiar').show();
        me.listaDirecciones.find('.btn.sct-helper-intercambiar:last').hide();
        me.listaDirecciones.find('.btn.sct-helper-add').hide();
        me.listaDirecciones.find('.btn.sct-helper-add:last').show();

        me.actualizarPuntosEnMapa();
    },

    actualizarPuntosEnMapa: function () {
        var me = MappirInterface.instance;
        me.mapaControl.limpiarPuntosDireccion();
        var direcciones = me.listaDirecciones.find('input');
        if(direcciones.length <= 5) {
	        var carpeta = 'finales';
	        for (var i = direcciones.length - 1; i >= 0; i--) {
	            var input = $(direcciones[i]);
	            var direccion = input.getGeoData();
	            if (!isNaN(direccion.x) && !isNaN(direccion.y) && direccion.desc && input.val()) {
	                me.mapaControl.dibujarPuntoDireccion(direccion.desc, [direccion.x, direccion.y], carpeta, i);
	            }
	            carpeta = 'intermedios';
	        }
	     }
    },

    distancia: function (a, b) {
        var point1 = new OpenLayers.Geometry.Point(a.x, a.y).transform("EPSG:4326", "EPSG:900913");
        var point2 = new OpenLayers.Geometry.Point(b.x, b.y).transform("EPSG:4326", "EPSG:900913");
        return point1.distanceTo(point2);
    },

    // compartir ruta por correo
    enviarCorreo: function () {

    	$("#procesandoPeticion").modal('show');
    	$("#compartir_error").hide().text("");
    	
        var dataPantalla = {respuesta: $('#compartir_respuesta').val(),
                para     : $('#compartir_para').val(),
                de       : $('#compartir_de').val(),
                mensaje  : $('#compartir_mensaje').val(),
                ruta     : MappirInterface.instance.rutaBase64,
                titulo   : $('#compartir_titulo').val()};
        
        var msgError = null;
		if (dataPantalla["para"] == undefined
				|| dataPantalla["para"] == "") {
			msgError = "Debe escribir un correo electrónico";
		} else if (!validateTexto(dataPantalla["para"]) || !isValidEmailAddress(dataPantalla["para"])) {
			msgError = "El correo no parece válido";
		}
		if (msgError == null) {
			if (dataPantalla["de"] == undefined
					|| dataPantalla["de"] == "") {
				msgError = "Debe escribir su nombre";
			} else if (!validateTexto(dataPantalla["de"])) {
				msgError = "Error en el nombre, contenido no válido";
			}
		}
		if (msgError == null) {
			if (dataPantalla["mensaje"] == undefined
					|| dataPantalla["mensaje"] == "") {
				msgError = "Debe escribir un mensaje";
			} else if (!validateTexto(dataPantalla["mensaje"])) {
				msgError = "Error en el mensaje, contenido no válido";
			}
		}
		if (msgError == null) {
			if (dataPantalla["respuesta"] == undefined
					|| dataPantalla["respuesta"] == "") {
				msgError = "Debe escribir el código de seguridad (captcha)";
			} else if (!validateTexto(dataPantalla["respuesta"])) {
				msgError = "Error en el código de seguridad (captcha), contenido no válido";
			}
		}

        if (msgError == null) {
        	$("#procesandoPeticion").modal('show');
	        $.ajax({
	                url        : Mappir.config.servicios.enviarRutaPorCorreo,
	                data       : dataPantalla,
	                contentType: 'application/json',
	                dataType   : 'jsonp',
	                success    : function (resp) {
	                	$("#procesandoPeticion").modal('hide');
	                    if (!resp.error) {
	                        $('#compartir_respuesta').val();
	                        $('#compartir_para').val();
	                        $('#compartir_de').val();
	                        $('#compartir_mensaje').val();
	                        $("#compartir_error").hide().text();
	                        $("#enviarRutaPorCorreo").modal("hide");
	                        $(".modal-backdrop").remove();
	                        message(resp.message, "Mappir");
	                    } else {
	                    	$("#btnEnviarRutaPorCorreo").attr("disabled", false);
		                    $("#compartir_error").show().text(resp.message);
	                    	$("#enviarRutaPorCorreo").modal("show");
	                    }
	                },
	                timeout    : 60000,
	                error      : function () {
	                	$("#procesandoPeticion").modal('hide');
	                    $("#btnEnviarRutaPorCorreo").attr("disabled", false);
	                    $(".modal-backdrop").remove();
	                    $("#enviarRutaPorCorreo").modal("hide");
	                    message("Ha ocurrido un error al procesar su petición, por favor intente más tarde.");
	                }
	            });
	        // fin if msgError
        } else {
        	$("#procesandoPeticion").modal('hide');
        	$("#btnEnviarRutaPorCorreo").attr("disabled", false);
            $("#compartir_error").show().text(msgError);
        }
    },
    enviarContacto: function () {

    	$("#procesandoPeticion").modal('show');
    	$("#contacto_error").hide().text("");
    	
        var dataPantalla = {respuesta: $('#contacto_respuesta').val(),
                            de       : $('#contacto_de').val(),
                            mensaje  : $('#contacto_mensaje').val()};

		var msgError = null;
		if (dataPantalla["de"] == undefined
				|| dataPantalla["de"] == "") {
			msgError = "Debe escribir un correo electrónico";
		} else if (!validateTexto(dataPantalla["de"]) || !isValidEmailAddress(dataPantalla["de"])) {
			msgError = "El correo no parece válido";
		}
		if (msgError == null) {
			if (dataPantalla["mensaje"] == undefined
					|| dataPantalla["mensaje"] == "") {
				msgError = "Debe escribir un mensaje";
			} else if (!validateTexto(dataPantalla["mensaje"])) {
				msgError = "Error en el mensaje, contenido no válido";
			}
		}
		if (msgError == null) {
			if (dataPantalla["respuesta"] == undefined
					|| dataPantalla["respuesta"] == "") {
				msgError = "Debe escribir el código de seguridad (captcha)";
			} else if (!validateTexto(dataPantalla["respuesta"])) {
				msgError = "Error en el código de seguridad (captcha), contenido no válido";
			}
		}

        if (msgError == null) {
        	$("#procesandoPeticion").modal('show');
	        $.ajax({
	                url        : Mappir.config.servicios.contacto,
	                data       : dataPantalla,
	                contentType: 'application/json',
	                dataType   : 'jsonp',
	                success    : function (resp) {
	                	$("#procesandoPeticion").modal('hide');
	                    if (!resp.error) {
	                        $('#contacto_respuesta').val();
	                        $('#contacto_de').val();
	                        $('#contacto_mensaje').val();
	                        $("#contacto_error").hide().text();
	                        $("#contactoCorreo").modal("hide");
	                        $(".modal-backdrop").remove();
	                        message(resp.message, "Mappir");
	                    } else {
	                    	$("#btnEnviarContacto").attr("disabled", false);
		                    $("#contacto_error").show().text(resp.message);
	                    	$("#contactoCorreo").modal("show");
	                    }
	                },
	                timeout    : 60000,
	                error      : function () {
	                	$("#procesandoPeticion").modal('hide');
	                    $("#btnEnviarContacto").attr("disabled", false);
	                    $(".modal-backdrop").remove();
	                    $("#contactoCorreo").modal("hide");
	                    message("Ha ocurrido un error al procesar su petición, por favor intente más tarde.");
	                }
	            });
	         // fin if msgError
	        } else {
	        	$("#procesandoPeticion").modal('hide');
	        	$("#btnEnviarContacto").attr("disabled", false);
                $("#contacto_error").show().text(msgError);
	        } 
    },

    reportarIncidente: function () {
        MappirInterface.instance.modalCargando.modal("show");
        $.ajax({
                url        : Mappir.config.servicios.repotarIncidente,
                data       : {
                    titulo     : $('#incidente_titulo').val(),
                    nombre     : $('#incidente_nombre').val(),
                    correo     : $('#incidente_correo').val(),
                    telefono   : $('#incidente_telefono').val(),
                    tipo       : $('#incidente_tipo').data("value"),
                    descripcion: $('#incidente_descripcion').val(),
                    respuesta  : $('#incidente_respuesta').val(),
                    coord_x		   : $('#incidente_x').val(),
                    coord_y		   : $('#incidente_y').val()
                },
                //contentType: 'application/json',
                dataType   : 'jsonp',
                success    : function (resp) {
                    MappirInterface.instance.modalCargando.modal("hide");
                    if (!resp.error) {
                        message("Su mensaje ha sido enviado.");
                        $('#incidente_nombre').val();
                        $('#incidente_correo').val();
                        $('#incidente_telefono').val();
                        $('#incidente_tipo').text();
                        $('#incidente_descripcion').val();
                        $('#incidente_respuesta').val();
                        $("#reportarIncidenteError").hide().text();
                        return;
                    }
                    $("#reportarIncidente").modal("show");
                    $("#reportarIncidenteError").show().text(resp.message);
                },
                timeout    : 60000,
                error      : function () {
                    MappirInterface.instance.modalCargando.modal("hide");
                    message("Ha ocurrido un error al procesar su petición, por favor intente más tarde.");
                }
            }
        );
    },

    asignarRendimiento: function () {
        try {
            var rendimiento = parseInt(MappirInterface.instance.vehiculo.data('rendimiento'));
            MappirInterface.instance.rendimiento.text(rendimiento + ' km/lt').data('value', rendimiento);

            MappirInterface.instance.excedente.text('Sin Ejes Excedentes');
            MappirInterface.instance.excedente.data('value', '0');
            if(MappirInterface.instance.vehiculo.data('categoria') == 1 || MappirInterface.instance.vehiculo.data('categoria') == 4){
                $("#excedente").show();
            } else {
                $("#excedente").hide();
            }
        } catch (e) {
//        	console.log(e);
            //SILENCIADO
        }
    },
    
    deshabilitarBusqueda: function () {
        // Deshabilitar todas las busquedas
    	var textosBusqueda = document.getElementsByName("direccion[]");
        for(var x=0; x<textosBusqueda.length; x++) {
        	textosBusqueda[x].disabled = true;
        }
        
    	$("#buscarRuta").attr("disabled", true);
		setTimeout(function(){
			$('#idRutasMasBuscadas').attr('data-toggle', 'none');
        	$("#idRutasEnEquipo").attr("data-toggle", 'none');
		}, 500);
//        var textosBusqueda = document.getElementsByName("direccion[]").length
    },
    
    habilitarBusqueda: function () {
        // Habilitar todas las busquedas
    	var textosBusqueda = document.getElementsByName("direccion[]");
        for(var x=0; x<textosBusqueda.length; x++) {
        	textosBusqueda[x].disabled = false;
        }
        
    	$("#buscarRuta").attr("disabled", false);
		setTimeout(function(){
			$('#idRutasMasBuscadas').attr('data-toggle', 'dropdown');
        	$("#idRutasEnEquipo").attr("data-toggle", 'dropdown');
		}, 500);
    },
    limpiarCombos:function (origen){
    	var instance= MappirInterface.instance;
		var direcciones = instance.listaDirecciones.find('input');
    	if(origen=="all"){
    		for (var i = direcciones.length - 1; i >= 0; i--) {
    			var input = $(direcciones[i]);
    			if(i>=2){
    	            input[0].parentNode.parentNode.remove();
    			}else{
    				input.setGeoData();
    				input.val("");
    			}
    		}
    		instance.maximoDeDirecciones();
            instance.actualizarPuntosEnMapa();
            instance.templateRutaUno.empty();
            instance.templateRutaDos.empty();
            clearLayer("capaDeRuta1");
            clearLayer("capaDeRuta2");
            if (!instance.mapaControl.modoPantallaCompleta) {
                $("#contenedorDeRutas").hide();
                instance.mapaControl.restaurarPantalla();
            } else {
            	$("#contenedorDeRutas").hide();
                instance.mapaControl.pantallaCompleta();
            }
            instance.mapaControl.capasDeRutaVisible = null;
            instance.mapaControl.tramoResaltado = null;
            instance.rutaCargada = false;
            var mapa = instance.mapaControl.mapa;
            MappirMap.instance.mapa.setCenter([-11036721.23618, 2209377.2207211], 5);
    	}else{
			try{
	    		var row = jQuery(origen.parentNode.parentNode);
	    	    var next = $(row.next().find('input:first'));
	    	    var input = $(row.find('input:first'));
	    	    $('#combobox').autocomplete('close');
	    		input.setGeoData();
				input.val("");
				input.removeClass("ui-autocomplete-loading");
				var menu = $(".ui-menu");
				menu.empty();
				menu.hide();
			    MappirInterface.instance.actualizarPuntosEnMapa();
			}catch(ex){
				debugger;
			}
    	}
    },
    hideCombo: function(id){
    	// ToDo: Validar que scroll no cierre combo en IE;
    	 if (clearing) {
    	        clearTimeout(clearing);
    	        clearing = null;
    	    }
    	 clearing = setTimeout( function(){
    			$(id).hide();
    	},200);
    },
    configComboKeyDown: function (origen,e){

    	if (!/(38|40|27|13|9)/.test(e.keyCode)) return
    	
    	var $this= e.target;
    	var $ul,$lis,$combo;

        if(origen=="combo"){
        	$ul = jQuery($this.parentNode.parentNode.parentNode);
            $lis = $($ul.find('li'));
    	    $combo = jQuery($lis[1].childNodes);
        }else if(origen =="boton"){
        	$ul = jQuery($this.parentNode.parentNode.parentNode.parentNode);
            $lis = $($ul.find('li'));
    	    $combo = jQuery($lis[1].childNodes);
        }else if(origen == "ul"){
        	$ul = jQuery($this.parentNode.parentNode);
        	$lis = $($ul.find('li'))
    	    $combo = jQuery($this);
        }        else{
        	return;
        }
        
        var $lista = jQuery($lis[1]);
        
        if(!$lista.is(':visible')){
        	return ;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
    	if(e.keyCode == 27){
    		$lista.hide(); return;
    	}
        

        var $items = $($combo.find('li:not(.sct-select-optgroup)'));
        
        if ($items.length < 1) return

        var index = $items.index($items.filter('.itemhover'));

        if (e.keyCode == 38 && index > 0)                 index--	;                       // up
        if (e.keyCode == 40 && index < $items.length - 1) index++	;                      // down
        if (!~index)                                      index=0	;

       	var $item = jQuery($items.eq(index));
        
        if(e.which === 40){
        	try{
            	$items.eq(index-1).removeClass( "itemhover" );
        	}catch(ex){}
        }
        if(e.which === 38){
        	try{
            	$items.eq(index+1).removeClass( "itemhover" );
        	}catch(ex){}
        }
        if ( e.keyCode == 13 || e.keyCode == 9 ) {
        	$item.click();return ;
          }
        if(index<1){
        	$combo.scrollTop( 0 );
        }else{
        	$combo.scrollTop( ($item[0].offsetTop-25) );
        }
        $items.eq(index).addClass( "itemhover" );
    }

});
