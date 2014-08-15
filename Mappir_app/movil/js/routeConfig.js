function intermediatePoint(removeAdd){
    if (removeAdd==0){
        for (var i = 0; i < visibleIntermediateArray.length; i++) {
            if (visibleIntermediateArray[i]==0){
                $('#intermedioBlock-'+(i+1)).show('fast');
                visibleIntermediateArray[i]=1;
                switchPoint(i+1);
                break;
            }
        }
        intermediateCount++;
        if(intermediateCount==maxIntermediate){
            $('#addIntermediatePoint').hide();
        }
    }else{
        intermediateCount--;
        $('#intermedioBlock-'+removeAdd).hide('fast');
        try{
        $('#select-intermedio-'+removeAdd).hide('fast');
        }catch (e){}
        visibleIntermediateArray[removeAdd-1]=0;
        if(intermediateCount==maxIntermediate-1){
            $('#addIntermediatePoint').show();
        }
    }
    // Iterates again to replace icons
    var count = 1;
    switchIcons();
}
function switchPoint(point){
    var tempValue="",tempValueHidden="";
    var inputText1,inputText1Hidden,inputText1Data;
    var inputText2,inputText2Hidden;
    var isIntermediate=false;
    if (point==0){
        inputText1=$("#origen").prev().find('input.ui-input-text')[0];
        inputText1Hidden = $("#origen-h");
    }else{
        inputText1=$("#intermedio-"+point).prev().find('input.ui-input-text')[0];
        inputText1Hidden = $("#intermedio-"+point+"-h");
    }
    for (var i = point; i < visibleIntermediateArray.length; i++) {
        if (visibleIntermediateArray[i]==1){
            isIntermediate=true;
            inputText2=$("#intermedio-"+(i+1)).prev().find('input.ui-input-text')[0];
            inputText2Hidden = $("#intermedio-"+(i+1)+"-h");
            break;
        }
        if (!isIntermediate){
            inputText2=$("#destino").prev().find('input.ui-input-text')[0];
            inputText2Hidden = $("#destino-h");
        }
    }
    tempValue = inputText2.value;
    inputText2.value = inputText1.value;
    inputText1.value=tempValue;
    tempValueHidden = inputText2Hidden.val();
    inputText2Hidden.val(inputText1Hidden.val());
    inputText1Hidden.val(tempValueHidden);
    inputText1Data = inputText1Hidden[0].getAttribute("data-info");
    inputText1Hidden[0].setAttribute("data-info",inputText2Hidden[0].getAttribute("data-info"));
    inputText2Hidden[0].setAttribute("data-info",inputText1Data);
}
function switchIcons(){
    var count=1;
    for (var i = 0; i < visibleIntermediateArray.length; i++) {
        if (visibleIntermediateArray[i]==1){
            switch (count){
                case 1:
                    $("#int-image-"+(i+1)).attr("src","img/layers/web-puntos/puntos_intermedios/b.png");
                    break;
                case 2:
                    $("#int-image-"+(i+1)).attr("src","img/layers/web-puntos/puntos_intermedios/c.png");
                    break;
                case 3:
                    $("#int-image-"+(i+1)).attr("src","img/layers/web-puntos/puntos_intermedios/d.png");
                    break;
                case 4:
                    $("#int-image-"+(i+1)).attr("src","img/layers/web-puntos/puntos_intermedios/e.png");
                    break;
                default :
                    break;
            }
            count++;
        }
    }
    switch (count){
        case 1:
            $("#int-dest").attr("src","img/layers/web-puntos/puntos_finales/b-v.png");
            break;
        case 2:
            $("#int-dest").attr("src","img/layers/web-puntos/puntos_finales/c-v.png");
            break;
        case 3:
            $("#int-dest").attr("src","img/layers/web-puntos/puntos_finales/d-v.png");
            break;
        case 4:
            $("#int-dest").attr("src","img/layers/web-puntos/puntos_finales/e-v.png");
            break;
        case 5:
            $("#int-dest").attr("src","img/layers/web-puntos/puntos_finales/f-v.png");
            break;
        default :
            break;
    }
}
// Autocomplete functions------------------------------------------------------------------------------------------------
function loadDestinationFunctions(){
    try{
        // initialize autocomplete functions
        autoComplete("#origenDestino");
        autoCompleteOnClick("#origenDestino");
        autoCompleteLoaded = true;
    }catch (e){debugger;}
}
function bindDestinationFocus(){
    $('#origenDestino input[data-type="search"]').bind( "focus", function(e,data){
        try{
           $('#news-banner').hide();
           this.focus();
            var originId = this.parentElement.parentElement.nextElementSibling.id;
            try{
                if(changedPoint!=""&&changedPoint!=originId){
                    var $ul2 = $('#'+changedPoint);
                    $ul2.children().addClass('ui-screen-hidden');
                    var elem2 =  $('#select-'+changedPoint);
                    elem2.hide();
                }
            }catch(ex){debugger;}
            changedPoint=originId;
            if(this.value==""){
                var $ul = $('#'+originId);
                var html="";
                $ul.html( "" );
                html = html+'<li id="myLocation"><a href=\"javascript:void(0);\" style=\"color: #00853D;font-size: .9em;\" >Mi Ubicación</li>';
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
            }
            showIfInitialSuggestions(originId)
        }catch (e){debugger;}
    });
    $('#origenDestino input[data-type="search"]').bind( "focusout", function(event){
        try{
            $('#news-banner').show();
            /*
            var originId = this.parentElement.parentElement.nextElementSibling.id;
            var elem =  $('#select-'+originId);
            elem.hide();
            */
        }catch (e){debugger;}
    });
}
function autoComplete(inputOrigin){
    $(inputOrigin).on("listviewbeforefilter",function (e,data) {
        var originId="#"+e.target.id;
        // Clean hidden value
        $(originId+"-h").val("");
        // Hide Historial
        $('#select-'+originId.slice(1)).hide();

        if (searching) {
            clearTimeout(searching);
        }
        var $ul = $(originId) ,$input = $( data.input ),value = $input.val(),html = "";
        removeScriptElemsListView(originId.slice(1));
        // remove loading icon
        $input.removeClass("origenLoading");
        if ( value && value.length > 1 ) {
            $('#select-'+originId.slice(1)).hide();
            searching = setTimeout(function () {
                $ul.html( "" );
                try{
                    if(changedPoint!=""&&changedPoint!=originId){
                        var $ul2 = $('#'+changedPoint);
                        $ul2.children().addClass('ui-screen-hidden');
                        var elem2 =  $('#select-'+changedPoint);
                        elem2.hide();
                    }
                }catch(ex){debugger;}
                changedPoint = e.target.id;

                $input.addClass("origenLoading");
                var sendData =  {"search" : value ,"usr" : usr,"key" : key};
                $.get( configArray['servicios']['busquedaDeDestinos'], sendData, function(msg){
                    $input.removeClass("origenLoading");
                    var emptyResults = true;
                    if (msg.results){
                        for (var i = 0; i < msg.results.length; ++i) {
                            var categoria = msg.results[i]["idCategoria"];
                            if (msg.results[i]["items"].length!=0){
                                html += '<li id=\"noPoint\" data-role="list-divider">' +  msg.results[i]["categoria"] + '</li>';
                                if (emptyResults){
                                    emptyResults = false;
                                }
                                for (var j in msg.results[i]["items"]){
                                    var tempArray = [];
                                    tempArray.push({"idTramo": msg.results[i]["items"][j].idTramo, "source": msg.results[i]["items"][j].source, "target": msg.results[i]["items"][j].target, "idCategoria":categoria });
                                    var tempString = setPointData(tempArray);
                                    html += '<li id="('+msg.results[i]["items"][j]["y"]+','+msg.results[i]["items"][j]["x"]+')" data-info="'+tempString+'"><a href="javascript:void(0);">' +  msg.results[i]["items"][j]["desc"] + '</a></li>';
                                }
                            }
                        }

                    }else if (msg.code!=100){
                        $input.removeClass("origenLoading");
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
                            return;
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
                            return;
                        }
                    }
                    if (emptyResults){//(msg.results.length == 0){
                        showPopupError("¡Advertencia!",'El lugar "'+ value +'" no fue encontrado<br/> Debes escoger destino.');
                        $input.removeClass("origenLoading");
                        return;
                    }
                    $ul.html( html );
                    $ul.listview( "refresh" );
                    $ul.trigger( "updatelayout");
                    //$("#select-"+inputOrigin.slice(1)+"R").selectmenu("open");
                },'jsonp')
                    .fail(function(msg) {
                        if (msg.statusText=="abort"){
                            try{$(originId).closest('[data-role=listview]').prev('form').find('input').removeClass("origenLoading");}catch (e){debugger;};
                        }else if (msg.code!=100){
                            $input.removeClass("origenLoading");
                            /*
                            var json = msg.responseText.substring(1,msg.responseText.length-2);
                            var msgArray = JSON.parse(json);
                            showPopupError("¡Error "+msgArray["code"]+"¡",msgArray["status"]);
                            */
                            if(msg.code){
                                showPopupError("¡Advertencia!","Ha ocurrido un error al procesar su petición, por favor intente más tarde.");
                            }else{
                                showPopupError("¡Advertencia!","Ha ocurrido un error al comunicarse con el servidor, por favor intente más tarde. ");
                            }

                        }else{
                            $input.removeClass("origenLoading");
                            showPopupError("¡Advertencia¡",'Ocurrió un error al comunicarse con el servidor, por favor intenta más tarde.');
                        }
                    });

            }, 500);
        }
    });
}
function autoCompleteOnClick(inputOrigen){
    $(inputOrigen).on('click','li',function (e) {
        var originId= this.parentElement.id;
        if (this.id=="myLocation"){
            addMyLocationTo(originId);
            var $ul=$(this).closest('[data-role=listview]');
            $ul.prev('form').find('input').val(text);
            $ul.children().addClass('ui-screen-hidden');
            $ul.html("");

        }else if (this.id == "noPoint"){
            // Create Popups Content.
            //showPopupError("¡Error!",'No puedes escoger una categoria como Origen/Destino.');
        }else{
            var text =  $(this).find('.ui-link-inherit').text();
            try{
                var tempElem = $(this).closest('[data-role=listview]').prev('form').find('input').val(text);
                var info= tempElem.context.getAttribute("data-info");
                if(info){
                    $("#"+originId+"-h")[0].attributes[2].value=info;
                }
            }catch (e){}
            $("#"+originId+"-h").val(this.id);
            var $ul=$(this).closest('[data-role=listview]');
            $ul.prev('form').find('input').val(text);
            $ul.children().addClass('ui-screen-hidden');
            $ul.html("");
        }
    });
}
function sendToAutoComplete(info,text,value,inputOrigin){
    if (typeof text == "undefined"||typeof value == "undefined"||typeof inputOrigin == "undefined"){
        return;
    }
    try{
        if(info){
            $('#'+inputOrigin+"-h")[0].attributes[2].value=info;
        }
    }catch (e){}
    $('#'+inputOrigin+"-h").val(value);
    $('#select-'+inputOrigin+'R').empty();
    $('#select-'+inputOrigin).hide();
    $('#'+inputOrigin).prev('form').find('input').val(text);
}
//Ends Autocomplete------------------------------------------------------------------------------------------------------
function validatePoints(){
    $('#routepageResult').empty();
    casetasArray=[];
    alertasArray=[];
    var popupMessageBody ="";
    var passedValidation = true;
    var count=0;
    var origenName= $("#origen").prev().find('input.ui-input-text')[0].value;
    var origenGeom = $("#origen-h").val();
    var origenData = $("#origen-h")[0].getAttribute("data-info");
    if(origenData=="false"){
        origenData="";
    }
    var intermedioName;
    var intermedioGeom;
    var intermedioData;
    var destinoName = $("#destino").prev().find('input.ui-input-text')[0].value;
    var destinoGeom = $("#destino-h").val();
    var destinoData = $("#destino-h")[0].getAttribute("data-info");
    if(destinoData=="false"){
        destinoData="";
    }
    var destinosInfo=[];
    var destinos=[];
    var arrayGeom=[];
    var latLon;
    if ( origenGeom == ""){
        var stringReturn=pointValidation1("#origen",0,popupMessageBody);
        if(stringReturn==""){
            validatePoints();
            return;
        }
        popupMessageBody = stringReturn;
    }else{
       pushIfNotInCache(
           origenName,
           origenGeom,
           origenData

       );
        arrayGeom.push(origenGeom);
    }
    for (var i = 0; i < visibleIntermediateArray.length; i++){
        if (visibleIntermediateArray[i]==1){
            intermedioGeom  = $("#intermedio-"+(i+1)+"-h").val();
            count++;
            if(intermedioGeom==""){
                var stringReturn=pointValidation1("#intermedio-"+(i+1),count,popupMessageBody);
                if(stringReturn==""){
                    validatePoints();
                    return;
                }
                popupMessageBody = stringReturn;
            }else{
                intermedioName = $("#intermedio-"+(i+1)).prev().find('input.ui-input-text')[0].value;
                intermedioData = $("#intermedio-"+(i+1)+"-h")[0].getAttribute("data-info");
                if(intermedioData=="false"){
                    intermedioData="";
                }
                pushIfNotInCache(
                    intermedioName,
                    intermedioGeom,
                    intermedioData
                );
                destinosInfo.push({destinoName:intermedioName,destinoGeom:intermedioGeom,destinoData:intermedioData});
                arrayGeom.push(intermedioGeom);
            }
        }
    }
    if (destinoGeom == ""){
        var stringReturn=pointValidation1("#destino",0,popupMessageBody);
        if(stringReturn==""){
            validatePoints();
            return;
        }
        popupMessageBody = stringReturn;
    }else{
        pushIfNotInCache(
            destinoName,
            destinoGeom,
            destinoData
        );
        destinosInfo.push({destinoName:destinoName,destinoGeom:destinoGeom,destinoData:destinoData});
        arrayGeom.push(destinoGeom);
    }
    if (popupMessageBody!=""){
        showPopupError("¡Advertencia!",popupMessageBody);
        return;
    }else{
        orName=$("#origen").prev().find('input.ui-input-text')[0].value;
        desName= $("#destino").prev().find('input.ui-input-text')[0].value;
    }
    var popupMessageBody=pointValidation2(arrayGeom,popupMessageBody);
    if (popupMessageBody!=""){
        showPopupError("¡Advertencia!",popupMessageBody);
        return;
    }
    popupMessageBody= pointValidation3(arrayGeom,popupMessageBody);
    if (popupMessageBody!=""){
        showPopupError("¡Advertencia!",popupMessageBody);
    }else{
        // save history max elems 10
        if (prevPuntosCount < prevPuntos.length){
            if(prevPuntos.length==11){
                prevPuntos.splice(0,1);
            }
            try{
                window.localStorage.setArray("cachedPoints", prevPuntos);
                prevPuntosCount = prevPuntos.length;
            }catch(e){}

        }
        latLon = origenGeom.toLatLon();
        if($('#casetas:checked').length){
            casetas=false;
        }else{
            casetas=true;
        }
        if($('#alertas:checked').length){
            alertas=false;
        }else{
            alertas=true;
        }
        var vehiculo = {
            tipo : vehicleConfig.vType,
            subtipo : vehicleConfig.vSubtype,
            excedente : vehicleConfig.axis,
            rendimiento : vehicleConfig.perf,
            costoltgas : vehicleConfig.vgas
        };
        var opciones = {
            casetas : casetas,
            alertas : alertas
        };
        if(origenData!=""){
            try{
                var origenDataArray = getPointData(origenData);
                var origen = {
                    x : latLon[1],
                    y : latLon[0],
                    desc : origenName,
                    idTramo : origenDataArray[0].idTramo,
                    source : origenDataArray[0].source,
                    target : origenDataArray[0].target,
                    idCategoria: origenDataArray[0].idCategoria
                };
            }catch(e){}
        }else{
            var origen = {
                x : latLon[1],
                y : latLon[0],
                desc:origenName
            };
        }
        origenDataArray=[];
        for(var des in destinosInfo){
            latLon = destinosInfo[des].destinoGeom.toLatLon();
            if(destinosInfo[des].destinoData!=""){
                try{
                    var destinosDataArray = getPointData(destinosInfo[des].destinoData);
                    destinos.push({
                        x : latLon[1],
                        y : latLon[0],
                        desc : destinosInfo[des].destinoName,
                        idTramo : destinosDataArray[0].idTramo,
                        source : destinosDataArray[0].source,
                        target : destinosDataArray[0].target,
                        idCategoria: destinosDataArray[0].idCategoria
                    });
                }catch (e){}
            }else{
                destinos.push({
                    x : latLon[1],
                    y : latLon[0],
                    desc: destinosInfo[des].destinoName
                });
            }
        }
        loader("show");
        resultRoute=[];
        getRoute(origen,destinos,vehiculo,opciones,1);
    }
}
function showIfInitialSuggestions(inputOrigin){
    if (prevPuntos.length!=0){
        var elem =  $('#select-'+inputOrigin);
        elem.show();
    }
}
// Add Chached Points uls when the datafilter is clicked
function addInitialSuggestions(inputOrigin){
    var $ul = $(inputOrigin);
    var html="";
    $ul.html( "" );
    try{
        if(changedPoint!=""&&changedPoint!=inputOrigin.slice(1)){
            var $ul2 = $('#'+changedPoint);
            $ul2.children().addClass('ui-screen-hidden');
            var elem2 =  $('#select-'+changedPoint);
            elem2.hide();
        }
    }catch(ex){debugger;}
    changedPoint = inputOrigin.slice(1);
    if (prevPuntos.length!=0){
        html = html+'<li data-role=\"list-divider\" id=\"noPoint\">Historial</li>';
        var text,point,data;
        for (var i = 0; i < prevPuntos.length; i++){
            point=prevPuntos[i].point;
            text=prevPuntos[i].name;
            data=prevPuntos[i].data;
            if(text!=null&&point!=null){
                html = html+'<li id=\"'+point+'\" data-info=\"'+data+'\"><a href=\"javascript:void(0);\" style=\"color: #00853D;font-size: .9em;\" >'+text+'</li>';
                text=null;
                point=null;
            }
        }
    }
    if(html!=""){
        $ul.html( html );
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");
    }
    try{
        $('#select-'+inputOrigin.slice(1)).hide();
    }catch(ex){};
}
// Check if its empty, if empty check if it has childs, if it has childs auto selects first viable child.
function pointValidation1(target,intermediate,popupMessageBody){
    debugger;
    var targetText = $(target).prev().find('input.ui-input-text')[0].value;
    if(targetText!=""){
        var recordExists =false;
        var child = $(target).children();
        var elem =  $('#select-'+target.slice(1)+'R')[0];
        if(child.length>0){
            for (elem in child){
                if (child[elem].id != "noPoint"){
                    $(target+"-h").val(child[elem].id );
                    var tempElem = $(target).closest('[data-role=listview]').prev('form').find('input').val(child[elem].textContent);
                    $(target).closest('[data-role=listview]').children().addClass('ui-screen-hidden');
                    var info= child[elem].getAttribute("data-info");
                    if(info){
                        $(target+"-h")[0].attributes[2].value=info;
                    }
                    pushIfNotInCache(
                        child[elem].textContent,
                        child[elem].id,
                        info
                    );
                    recordExists=true;
                    break;
                }
            }
        }
        if(recordExists){
            if (prevPuntosCount < prevPuntos.length){
                window.localStorage.setArray("cachedPoints", prevPuntos);
                prevPuntosCount = prevPuntos.length;
            }
            return "";
        }else{
            return popupMessageBody = popupMessageBody+'Escoge: ¿a cual \"'+targetText+'\" te refieres?<br/>';
        }
    }else{
        if (intermediate!=0){
            return popupMessageBody = popupMessageBody+'Debes escoger el punto intermedio '+intermediate+'<br/>';
        }else{
            return popupMessageBody = popupMessageBody+'Debes escoger '+target.substring(1,target.length)+'<br/>';
        }
    }
}
// Check that any point is repeated.
function pointValidation2(array,popupMessageBody){
    var topElem= (array.length-1);
    var rep1="",rep2="";
    for(i in array){
        var intI = parseInt(i);
        if(intI<array.length-1){
            var temp1 = array[i];
            var temp2 = array[intI+1];
            if(temp1==temp2){
                switch (intI) {
                    case 0:
                        rep1 = "origen";
                        break;
                    case (topElem):
                        rep2 ="destino";
                        break
                    case 1:
                        rep1 = "punto intermedio B";
                        break;
                    case 2:
                        rep1 = "punto intermedio C";
                        break;
                    case 3:
                        rep1 = "punto intermedio D";
                        break;
                    case 4:
                        rep1 = "punto intermedio E";
                        break;
                    default :
                        rep1="punto intermedio "+i;
                        break;
                }
                switch (intI+1) {
                    case (topElem):
                        rep2 ="destino";
                        break
                    case 1:
                        rep2 = "punto intermedio B";
                        break;
                    case 2:
                        rep2 = "punto intermedio C";
                        break;
                    case 3:
                        rep2 = "punto intermedio D";
                        break;
                    case 4:
                        rep2 = "punto intermedio E";
                        break;
                    default :
                        rep2="punto intermedio "+(intI+1);
                        break;
                }
                popupMessageBody = popupMessageBody+'El '+rep1+' y el '+rep2+' están repetidos.<br/>';
            }
        }
    }
    return popupMessageBody;
}
// Check that any point is not 500 m near the others.
function pointValidation3(array,popupMessageBody){
    var topElem= (array.length-1);
    var rep1="",rep2="";
    for(i in array){
        debugger;
        var intI = parseInt(i);
        if(intI<array.length-1){
            var temp1 = array[i].toLatLon();
            var temp2 = array[intI+1].toLatLon();
            var distanceMeters = 0;
            distanceMeters= distance(temp1[0],temp1[1],temp2[0],temp2[1]);
            if(distanceMeters<500){
                switch (intI) {
                    case 0:
                        rep1 = "origen";
                        break;
                    case (topElem):
                        rep2 ="destino";
                        break
                    case 1:
                        rep1 = "punto intermedio B";
                        break;
                    case 2:
                        rep1 = "punto intermedio C";
                        break;
                    case 3:
                        rep1 = "punto intermedio D";
                        break;
                    case 4:
                        rep1 = "punto intermedio E";
                        break;
                    default :
                        rep1="punto intermedio "+i;
                        break;
                }
                switch (intI+1) {
                    case (topElem):
                        rep2 ="destino";
                        break
                    case 1:
                        rep2 = "punto intermedio B";
                        break;
                    case 2:
                        rep2 = "punto intermedio C";
                        break;
                    case 3:
                        rep2 = "punto intermedio D";
                        break;
                    case 4:
                        rep2 = "punto intermedio E";
                        break;
                    default :
                        rep2="punto intermedio "+(intI+1);
                        break;
                }
                popupMessageBody = popupMessageBody+'La distancia entre el '+rep1+' y el '+rep2+' es demasiado corta para representarla en el mapa.<br/>';
            }
        }
    }
    return popupMessageBody;
}
function pushIfNotInCache(value,point,data){
    var repeated=false;
    if (value.indexOf("Mi U")!=0){
        for (var i = 0; i < prevPuntos.length; i++){
            if(prevPuntos[i].point==point||prevPuntos[i].name.indexOf(value)!=(-1)){
                repeated = true;
            }
        }
        if (!repeated){
            prevPuntos.push({name:value,point:point,data:data});
        }
    }
}
function getRouteSaved(origen,destinos,vehiculo,opciones,tipo){
    loader("show");
    var data = {"json" : JSON.stringify({"usr" : usr,"key" : key,"origen" : origen,"destinos" : destinos,"vehiculo" : vehiculo, "opciones":opciones,"ruta":tipo})};
    start=origen;
    end=destinos[(destinos.length-1)];
    destinosSaved=destinos;
    opcionesSaved=opciones;
    var tempVehiculo = new cloneObject(vehiculo);
    tempVehiculo.costoltgas=vehicleConfig.gas;
    peticionRuta = btoa(JSON.stringify({"usr" : usr,"key" : key,"origen" : origen,"destinos" : destinos,"vehiculo" : tempVehiculo, "opciones":opciones,"ruta":tipo}));

    $.ajax({
        type : 'GET',
        url : configArray['servicios']['busquedaDeRuta'],
        data :{
            "json":
                JSON.stringify({
                    "usr" : usr,
                    "key" : key,
                    "origen" : origen,
                    "destinos" : destinos,
                    "ruta" : tipo, // 1 - corta, 2 - rapida, etc.
                    "opciones" : opciones,
                    "vehiculo" :vehiculo
                })
        },
        contentType : 'application/json',
        dataType : 'jsonp',
        success : function(result) {
            if (result.results){
                if(result.results[0].grafo.length>0){
                    resultRoute=result.results;
                }
            }else if (result.code!=100){
                loader("hide");
                if(result.code){
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
                    return;
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
                    return;
                }
            }
            if (resultRoute.length>0){
                indexRoute=0;
                $('#saveRouteMap').addClass('ui-disabled');
                getDetailsMap(indexRoute);
            }else{
                loader("hide");
                try{
                    navigator.notification.alert(
                        'No se encontraron resultados.',// mensaje (message)
                        alertDismissed,                      // función 'callback' (alertCallback)
                        'Mappir',                         // titulo (title)
                        'Cerrar'                             // nombre del botón (buttonName)
                    );
                }catch (e){
                    alert('No se encontraron resultados.');
                }
            }
        },
        error : function(msg) {
            if(msg.code!=100){
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
            }else{
                loader("hide");
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
            }

        }
    });
}
function getRoute(origen,destinos,vehiculo,opciones,count){
    start=origen;
    end=destinos[(destinos.length-1)];
    destinosSaved=destinos;
    opcionesSaved=opciones;
    var tempVehiculo = new cloneObject(vehiculo);
    tempVehiculo.costoltgas=vehicleConfig.gas;
    peticionRuta = btoa(JSON.stringify({"usr" : usr,"key" : key,"origen" : origen,"destinos" : destinos,"vehiculo" : tempVehiculo, "opciones":opciones,"ruta":count}));
    $.ajax({
        type : 'GET',
        url : configArray['servicios']['busquedaDeRuta'],
        data :{
                "json":
                    JSON.stringify({
                    "usr" : usr,
                    "key" : key,
                    "origen" : origen,
                    "destinos" : destinos,
                    "ruta" : count, // 1 - corta, 2 - rapida, etc.
                    "opciones" : opciones,
                    "vehiculo" :vehiculo
                    })
            },
        contentType : 'application/json',
        dataType : 'jsonp',
        success : function(result) {
            if (result.results){
                if(result.results[0].grafo.length>0){
                    resultRoute.push(result.results[0]);
                    console.log(resultRoute);
                }
            }else if (result.code!=100){
                loader("hide");
                if(result.code){
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
                    return;
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
                    return;
                }
            }
            if (resultRoute.length>0){
                if (count==2){
                    $('#saveRouteMap').removeClass('ui-disabled');
                    showResults();
                }else if(count<2){
                    getRoute(origen,destinos,vehiculo,opciones,(count+1));
                }
            }else{
                loader("hide");
                try{
                    navigator.notification.alert(
                        'No se encontraron resultados.',// mensaje (message)
                        alertDismissed,                      // función 'callback' (alertCallback)
                        'Mappir',                         // titulo (title)
                        'Cerrar'                             // nombre del botón (buttonName)
                    );
                }catch (e){
                    alert('No se encontraron resultados.');
                }
            }
        },
        error : function(msg) {
            if (msg.code!=100){
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
            }else{
                loader("hide");
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
            }
        }
    });
}
function showResults(){
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    var count = resultRoute.length;
    var ruta="";
    var meters = 0,metersCaption="M";
    var minutes = 0, minutesCaption="Min:seg";
    $('#routepageResult').empty();
    var texto='<div class="text2" style="line-height: 50px;padding-right: 10px;padding-left: 10px">Resultados: <span>'+count+'</span> ruta(s) sugerida(s)</div>';
    var $div = $(texto).appendTo('#routepageResult');
    var i = 0;
    var tipoRuta="";
    for (var route in resultRoute){
        if(i==0){
            tipoRuta="sugerida";
        }else{
            tipoRuta="alterna";
        }
        meters=resultRoute[route].distanciaTotal;
        var temp = convertMeters(meters);
        meters= temp[0];
        metersCaption = temp[1];
        minutes = resultRoute[route].tiempoTotal;
        var temp = convertMinutes(minutes);
        minutes= temp[0];
        minutesCaption = temp[1];
        var alerta=0;
        var caseta = 0;
        caseta = resultRoute[route].casetasNo;
        try{
            for (var tramo in resultRoute[route].grafo){
                if(resultRoute[route].grafo[tramo][13].length>0){
                    alerta=alerta+1;
                    console.log(resultRoute[route].grafo[tramo][13]);
                }
            }
        }catch (e){} //'+resultRoute[route].tipo+'
        ruta= ruta +'<div class="mainResultHeader">Ruta '+tipoRuta+' De '+orName+' a '+desName+'<br/><span class="text10">'+resultRoute[route].descripcion+'</span>.</div>'
        /*
        if (alerta>0||caseta>0){
            var caption = "Hay ";
            if(alerta>0){
                caption= caption+'<span class="text5">'+alerta+' alerta(s)</span>';
            }
            if(alerta>0&&caseta>0){
                caption = caption+' y ';
            }
            if(caseta>0){
                caption= caption+'<span class="text1">'+caseta+' caseta(s)</span>';
            }
            caption=caption+' en esta ruta';

            ruta=ruta+'<div class="text8 resultBlock" style="font-size: .75em;padding-left: 10px;">'+caption+'.</div>';
        }
        */
        ruta= ruta +
            '<div class="ui-grid-c resultBlock">'+
            //'<div class="ui-block-a resultColumn1 text1" style="width: 100%;padding: 10px;text-align: left;">'+resultRoute[route].descripcion+'</div>'+
            '<div class="ui-block-a resultColumn1 borderRight" style="width:20%;"><div class="text2">Tiempo</div><div class="b1" style="font-weight: 900;">'+decimalsHourToMinutes(minutes.toString(),2).replace(".",":")+'</div><div class="text2">'+minutesCaption+'</div></div>'+
            '<div class="ui-block-b resultColumn1 borderRight"><div class="text2">Distancia</div><div class="b1">'+meters+'</div><div class="text2">'+metersCaption+'</div></div>'+
            '<div class="ui-block-c resultColumn1 borderRight"><div class="text2">Casetas</div><div class="b1" style="font-weight: 900;"> $'+resultRoute[route].casetasTotal.toFixed(2)+'</div><div class="text2">mxn</div></div>'+
            '<div class="ui-block-d resultColumn1"><div class="text2">Combustible</div><div class="b1"> $'+resultRoute[route].gasTotal.toFixed(2)+'</div><div class="text2">mxn</div></div>'+
            '<div class="ui-block-a resultColumn3" style="width: 45%;/*line-height: 1.75em;*/margin-left:5%;padding: 12px; padding-top: 22px" id="costs-block"><span class="text3">Costo total:</span><br/><span class="b1" style="font-weight: 900;">$'+resultRoute[route].total.toFixed(2)+'</span><span class="text2"> mxn</span></div>'+
            '<div class="ui-block-b resultColumn2" style="width: 50%;" id="gas-cost"><span class="text2">*Costos aproximados para:<br/>'+vehicleConfig.vText+'<br/>'+vehicleConfig.pText+' '+vehicleConfig.gText+'<br/>Casetas:'+caseta+'  Incidentes:'+alerta+'</span></div>'+
            //'<div class="ui-block-b resultColumn2" style="width: 50%;" id="gas-cost"><span class="text4">*Costos aproximados para:</span><br/><span class="text3">'+vehicleConfig.vText+'</span><br/><span class="b2">'+vehicleConfig.pText+' '+vehicleConfig.gText+'</span></div>'+//<br/><span class="b3">Ajustar</span>
            '</div>'+
            '<div class="ui-grid-a resultBlock" style="padding:0px;padding-left: 10%;">'+
            '<div class="ui-block-a resultColumn1" style="width: 48%;text-align: center;padding: 10px;" onclick="getDetails('+route+')"><div style="float:left;"><img src="img/indicaciones-verde.png" class="image35h"></div><div style="float:left;" class="text1 indicaciones">Ver<br/> indicaciones</div></div>'+
            '<div class="ui-block-b resultColumn1" style="width: 48%;text-align: center;padding: 10px;" onclick="getDetailsMap('+route+')"><div style="float:left;"><img src="img/mundo-verde.png" class="image35h"></div><div style="float:left;" class="text1 indicaciones">Ver mapa con </br> indicaciones</div></div>'+
            '</div><br/>';
            //'<div class="text6" style="min-height: 50px;padding-right: 10px;padding-left: 10px">'+resultRoute[route].descripcion+'</div>';
        i++;
    }
    $(ruta).appendTo('#routepageResult');
    equalHeight("#routepageResult .ui-grid-b");
    loader("hide");

}
function hideOriginResults(){
    $('#select-origen').hide();
    $('#select-intermedio-1').hide();
    $('#select-intermedio-2').hide();
    $('#select-intermedio-3').hide();
    $('#select-intermedio-4').hide();
    $('#select-destino').hide();
}
function addMyLocationTo(origenId){
    loader("show");
    if(!isApp){
        try{
            if(geo_position_js.init()){
                geo_position_js.getCurrentPosition(function(position){
                    geoOnSuccess(position,origenId);
                },function(error){
                    loader("hide");
                    debugger;alert("Ocurrió un error al intentar localizar tu ubicación, por favor intenta desde otro dispositivo o descarga la versión app.");
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
        navigator.geolocation.getCurrentPosition(function (position){
            geoOnSuccess(position,origenId)
        }, showLocationError , options);
    }
}
function getSharedRoute(ruta){
    var temp =JSON.parse(atob(ruta));
    var gas="";
    try{
        var int = parseInt(temp.vehiculo.costoltgas);
        gas = gasArray[int];
    }catch (ex){
        gas= gasValTipico;
    }
    temp.vehiculo.costoltgas=gas;
    getRouteSaved(temp.origen,temp.destinos,temp.vehiculo,temp.opciones,temp.ruta);
}
function geoOnSuccess(position,origenId){
    var location = "("+position.coords.latitude+", "+position.coords.longitude+")";
    try{
        var latLon = location.toLatLon();
        var val= parseFloat(latLon[1]).toFixed(2);
        var val2=parseFloat(latLon[0]).toFixed(2);
        var temp="Ubicación ("+val+","+val2+")";
        var tempString="false";
        var sendData =  {"usr" : usr,"key" : key,"x" : latLon[1],"y" : latLon[0]};
        $.get( configArray['servicios']['geoCodificacionInversa'], sendData, function(msg){
            if(msg.results){
                if(msg.code){
                    if(msg.code==400&&(msg.status.indexOf("fuera")>0)){
                        try{
                            navigator.notification.alert(
                                '¡Advertencia!, La coordenada se encuentra fuera de la republica mexicana.',// mensaje (message)
                                alertDismissed,                      // función 'callback' (alertCallback)
                                'Mappir',                         // titulo (title)
                                'Cerrar'                             // nombre del botón (buttonName)
                            );
                        }catch (e){
                            alert('¡Advertencia!, La coordenada se encuentra fuera de la republica mexicana.');
                        }
                        tempString=null;
                        temp=null;
                    }else if(msg.code==100){
                        temp = msg.results.desc;
                        var tempArray =[];
                        tempArray.push({"idTramo": msg.results.idTramo, "source": msg.results.source, "target": msg.results.target, "idCategoria": "-1"});
                        tempString = setPointData(tempArray);
                    }
                }
            }else if (msg.code!=100){
                if(msg.code){
                    try{
                        navigator.notification.alert(
                            'Ocurrió un error al procesar el nombre de tu Ubicación, se utilizará solo la coordenada.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert('Ocurrió un error al procesar el nombre de tu Ubicación, se utilizará solo la coordenada.');

                    }
                }else{
                    try{
                        navigator.notification.alert(
                            '¡Advertencia, Ocurrió un error al comunicarse con el servidor para obtener el nombre de tu Ubicación!, se utilizará solo la coordenada.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert('¡Advertencia, Ocurrió un error al comunicarse con el servidor para obtener el nombre de tu Ubicación!, se utilizará solo la coordenada.');
                    }
                }
            }
            if(temp==null||tempString==null){}else{
                sendToAutoComplete(tempString,temp,location,origenId);
            }
            loader("hide");
        },'jsonp')
            .fail(function(msg) {
                if (msg.statusText=="abort"){
                    return;
                }else if (msg.code!=100){
                    loader("hide");
                    if(msg.code){
                        showPopupError("¡Advertencia!","Error en la respueta del servidor geo al obtener el nombre de tu Ubicación, se utilizará solo la coordenada.");
                    }else{
                        showPopupError("¡Advertencia!","Error, el servidor geo no respondió al obtener el nombre de tu Ubicación, se utilizará solo la coordenada.");
                    }
                }else{
                    loader("hide");
                    showPopupError("¡Advertencia!",'Error en la respuesta del servidor geo al obtener el nombre de tu Ubicación,  se utilizará solo la coordenada.');
                    response = null;
                }
                sendToAutoComplete(tempString,temp,location,origenId);
                loader("hide");
            });
    }catch (e){loader("hide");debugger;}
}