function loadSavedRoutesPage(){
    getSavedRoutes();
    isPanelOpen=false;
    openPanel="";
    $.mobile.navigate('#savedRoutespage');
}
function saveRoute(){
    loader('show');
    locationSequenceArray=[];
    locationSequenceArray.push("#origen");locationSequenceArray.push("#destino");
    for (var i in visibleIntermediateArray){
        if(visibleIntermediateArray[i]==1){
            locationSequenceArray.push("#intermedio-"+(parseInt(i)+1))
        }
    }
    getLocation(0);
}
function getLocation(count){
    var location = $(locationSequenceArray[count]).prev().find('input.ui-input-text')[0].value;
    var locationCoord = $(locationSequenceArray[count]+"-h").val();
    var locationData = $(locationSequenceArray[count]+"-h")[0].getAttribute("data-info");
    if (locationData=="false"){
        locationData="";
    }
    var tempArray=[];
    if(!location.indexOf("Mi U")){
        getLocationCoord(locationCoord,null,count);
    }else{
        tempArray.push(location);tempArray.push(locationCoord);tempArray.push(locationData);
        getLocationCoord(null,tempArray,count);
    }
}
function getLocationCoord(coord,skip,count){
    if(skip==null){
        var latLon = coord.toLatLon();
        var sendData =  {"usr" : usr,"key" : key,"x" : latLon[1],"y" : latLon[0]};
        $.get( configArray['servicios']['geoCodificacionInversa'], sendData, function(msg){
            var val= parseFloat(latLon[1]).toFixed(2);
            var val2=parseFloat(latLon[0]).toFixed(2);
            var temp="Ubicación ("+val+","+val2+")";
            var tempString="";
            if(msg.results){
                var s = msg.results.desc.indexOf("Se enc");
                if (msg.results.desc.indexOf("Se enc")<0){
                    temp = msg.results.desc;
                    var tempArray =[];
                    tempArray.push({"idTramo": msg.results.idTramo, "source": msg.results.source, "target": msg.results.target, "idCategoria": "-1"});
                    tempString = setPointData(tempArray);
                }
                locationArray.push({"nombre":temp,"coord":coord,"data":tempString});
                count++;
                if (count<locationSequenceArray.length){
                    getLocation(count);
                }else{
                    getLocationEnd();
                }
            }else if (msg.code!=100){
                loader("hide");
                if(msg.code){
                    try{
                        navigator.notification.alert(
                            'Ha ocurrido un error al procesar su petición, por favor intente más tarde.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert('Ha ocurrido un error al procesar su petición, por favor intente más tarde.');
                    }
                }else{
                    try{
                        navigator.notification.alert(
                            'Ha ocurrido un error al comunicarse con el servidor, por favor intente más tarde.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert('Ha ocurrido un error al comunicarse con el servidor, por favor intente más tarde.');
                    }
                }
                var tempArray =[];
                tempArray.push({"idTramo": -1, "source": -1, "target":-1, "idCategoria": "-1"});
                tempString = setPointData(tempArray);
                locationArray.push({"nombre":temp,"coord":coord,"data":tempString});
                count++;
                if (count<locationSequenceArray.length){
                    getLocation(count);
                }else{
                    getLocationEnd();
                }
            }
        },'jsonp')
            .fail(function(msg) {
                if (msg.statusText=="abort"){
                }else if (msg.code!=100){
                    loader("hide");
                    if(msg.code){
                        showPopupError("¡Advertencia!","Error en la respuesta del servidor geo al obtener el nombre de tu Ubicación!.");
                    }else{
                        showPopupError("¡Advertencia!","Error, el servidor geo no respondió al obtener el nombre de tu Ubicación!.");
                    }
                    return null;
                }else{
                    loader("hide");
                    showPopupError("¡Advertencia!",'Ocurrió un error al obtener el nombre de tu Ubicación');
                    return null;
                }
            });
    }else{
        locationArray.push({"nombre":skip[0],"coord":skip[1],"data":skip[2]});
        count++;
        if (count<locationSequenceArray.length){
            getLocation(count);
        }else{
            getLocationEnd();
        }
    }
}
function getLocationEnd(){
    var tipoRuta =1;
    var intermedios=[];
    for (var elem in locationArray){
        if (elem>1){
            intermedios.push({"nombre":locationArray[elem].nombre,"coord" : locationArray[elem].coord, "data": locationArray[elem].data});
        }
    }
    if(resultRoute[indexRoute].tipo==("Corta")){
        tipoRuta = 1;
    }else{
        tipoRuta = 2;
    }
    var opciones = {
        casetas : casetas,
        alertas : alertas
    };
    savedRoutes.push({"origen":{"nombre":locationArray[0].nombre,"coord" : locationArray[0].coord,"data":locationArray[0].data },"intermedios":intermedios,"destino":{"nombre":locationArray[1].nombre ,"coord" : locationArray[1].coord,"data" : locationArray[1].data},"tipo":tipoRuta,"opciones":opciones});
    if (savedRoutes.length>0){
         try{
         if(savedRoutes.length==11){
         savedRoutes.splice(0,1);
         }
         window.localStorage.setArray("savedRoutes", savedRoutes);
             try{
                 navigator.notification.alert(
                     'Se guardó la ruta exitosamente.',// mensaje (message)
                     alertDismissed,                      // función 'callback' (alertCallback)
                     'Mappir',                         // titulo (title)
                     'Cerrar'                             // nombre del botón (buttonName)
                 );
             }catch (e){
                 alert('Se guardó la ruta exitosamente.');
             }
             loader("hide");
         }catch(e){
             try{
                 navigator.notification.alert(
                     'Ocurrió un error al guardar la ruta en memoria.',// mensaje (message)
                     alertDismissed,                      // función 'callback' (alertCallback)
                     'Mappir',                         // titulo (title)
                     'Cerrar'                             // nombre del botón (buttonName)
                 );
             }catch (e){
                 alert('Ocurrió un error al guardar la ruta en memoria.');
             }
             loader("hide");
         }
        locationArray=[];
    }
}
function getSavedRoutes(){
    var routeBlock="";
    $('#savedRoutesBlock').empty();
    if (savedRoutes.length==0){
        var routeBlock ='<div class="background1" style="padding: .75em;">No hay rutas guardadas</div>';
    }
    for (var route in savedRoutes){
        routeBlock = routeBlock +
        '<div class="ui-grid-a resultTable">'+
        '<div class="ui-block-a background1" style="width: 80%;min-height: 69px;padding: .75em">'+
                'De: '+savedRoutes[route].origen.nombre+'<br/>';
        for (var intermediatePoint in savedRoutes[route].intermedios ){
            routeBlock = routeBlock+'A: '+savedRoutes[route].intermedios[intermediatePoint].nombre+'<br/>';
        }
        routeBlock = routeBlock +
            'A: '+savedRoutes[route].destino.nombre+
        '</div>'+
        '<div class="ui-block-b background1" style="width: 20%;padding: .75em;"><img src="img/flecha.png" class="imageFlecha" onclick="getChoosenSavedRoute('+route+')"/></div>'+
        '</div></div>'+
        '<div><a href="javascript:void(0);" onclick="deleteRoute('+route+')" style="line-height: 2em;"><span>Borrar esta ruta</span></a></div>';
    }
    $(routeBlock).appendTo('#savedRoutesBlock');
}
function deleteRoute(index){
    if (index > -1) {
        savedRoutes.splice(index, 1);
    }
    try{
        window.localStorage.setArray("savedRoutes", savedRoutes);
        try{
            navigator.notification.alert(
                'Se borró la ruta exitosamente.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert('Se borró la ruta exitosamente.');
        }
    }catch(e){
        try{
            navigator.notification.alert(
                'Ocurrío un error al borrar la ruta, se borró de la lista pero no se borró de memoria.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert('Ocurrío un error al borrar la ruta, se borró de la lista pero no se borró de memoria.');
        }
    }
    getSavedRoutes();
}
function getChoosenSavedRoute(index){
    loader("show");
    var latLon = "";
    var vehiculo =1;
    var destinos=[];
    var ruta=1;
    ruta = savedRoutes[index].tipo;
    latLon = savedRoutes[index].origen.coord.toLatLon();
    var vehiculo = {
        tipo : vehicleConfig.vType,
        subtipo : vehicleConfig.vSubtype,
        excedente : vehicleConfig.axis,
        rendimiento : vehicleConfig.perf,
        costoltgas : vehicleConfig.vgas
    };
    var opciones = savedRoutes[index].opciones;
    if(savedRoutes[index].origen.data!=""){
        try{
            var origenDataArray = getPointData(savedRoutes[index].origen.data);
            var origen = {
                x : latLon[1],
                y : latLon[0],
                desc : savedRoutes[index].origen.nombre,
                idTramo : origenDataArray[0].idTramo,
                source : origenDataArray[0].source,
                target : origenDataArray[0].target,
                idCategoria : origenDataArray[0].idCategoria
            };
        }catch(e){}
    }else{
        var origen = {
            x : latLon[1],
            y : latLon[0],
            desc:savedRoutes[index].origen.nombre
        };
    }
    for(var des in savedRoutes[index].intermedios){
        latLon = savedRoutes[index].intermedios[des].coord.toLatLon();
        if(savedRoutes[index].intermedios[des].data!=""){
            try{
                var destinosDataArray = getPointData(savedRoutes[index].intermedios[des].data);
                destinos.push({
                    x : latLon[1],
                    y : latLon[0],
                    desc : savedRoutes[index].intermedios[des].nombre,
                    idTramo : destinosDataArray[0].idTramo,
                    source : destinosDataArray[0].source,
                    target : destinosDataArray[0].target,
                    idCategoria : origenDataArray[0].idCategoria
                });
            }catch (e){}
        }else{
            destinos.push({
                x : latLon[1],
                y : latLon[0],
                desc : savedRoutes[index].intermedios[des].nombre
            });
        }
    }
    latLon = savedRoutes[index].destino.coord.toLatLon();
    if(savedRoutes[index].destino.data!=""){
        try{
            var destinoDataArray = getPointData(savedRoutes[index].destino.data);
            destinos.push({
                x : latLon[1],
                y : latLon[0],
                desc : savedRoutes[index].destino.nombre,
                idTramo : destinoDataArray[0].idTramo,
                source : destinoDataArray[0].source,
                target : destinoDataArray[0].target,
                idCategoria : origenDataArray[0].idCategoria
            });
        }catch(e){}
    }else{
        destinos.push({
            x : latLon[1],
            y : latLon[0],
            desc : savedRoutes[index].destino.nombre
        });
    }
    resultRoute=[];
    getRouteSaved(origen,destinos,vehiculo,opciones,ruta);
}