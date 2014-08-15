function getDetails(index){
    //Finaliza en para poner el cada punto intermedio
    loader("show");
    indexRoute = index;
    currentRouteFeature=null;
    intermediateArray=[];
    arrayRoutes=[];
    casetasArray=[];
    alertasArray=[];
    var meters = 0,metersCaption="M";
    var minutes = 0, minutesCaption="Min:seg";
    var count =1;
    meters=resultRoute[index].distanciaTotal;
    var temp = convertMeters(meters);
    meters= temp[0];
    metersCaption = temp[1];
    minutes = resultRoute[index].tiempoTotal;
    var temp = convertMinutes(minutes);
    minutes= temp[0];
    minutesCaption = temp[1];
    $('#detailOrigenDestino').empty();
    var head = '<div style="padding: 10px;display: inline-block;width: 90%;" onclick="showHideDetails(false)"><span id="showDetail" class="ui-icon ui-icon-arrow-u ui-icon-shadow" style="display: inline-block;"></span><span style="padding-right: 5px;"></span>Detalles</div>';
    $(head).appendTo('#detailOrigenDestino');
    $('#detailTable').empty();
    var alerta=0;
    var caseta = 0;
    caseta = resultRoute[index].casetasNo;
    var ruta="";
    try{
        for (var tramo in resultRoute[index].grafo){
            if(resultRoute[index].grafo[tramo][13].length>0){
                alerta=alerta+1;
            }
        }
    }catch (e){}
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

        ruta=ruta+'<div class="text8" style="font-size: .75em;padding-left: 10px;">'+caption+'.</div>';
    }
     ruta= ruta+
        '<div class="ui-block-a resultColumn1 text1" style="width: 100%;padding: 10px;text-align: left;">'+resultRoute[index].descripcion+'</div>'+
        '<div class="ui-block-a resultColumn1 borderRight" style="width:20%;"><div class="text2">Tiempo</div><div class="b1">'+decimalsHourToMinutes(minutes.toString(),2).replace(".",":")+'</div><div class="text2">'+minutesCaption+'</div></div>'+
        '<div class="ui-block-b resultColumn1 borderRight"><div class="text2">Distancia</div><div class="b1">'+meters+'</div><div class="text2">'+metersCaption+'</div></div>'+
        '<div class="ui-block-c resultColumn1 borderRight"><div class="text2">Casetas</div><div class="b1"> $'+resultRoute[index].casetasTotal.toFixed(2)+'</div><div class="text2">mxn</div></div>'+
        '<div class="ui-block-d resultColumn1"><div class="text2">Combustible</div><div class="b1"> $'+resultRoute[index].gasTotal.toFixed(2)+'</div><div class="text2">mxn</div></div>'+
        '<div class="ui-block-a resultColumn2" style="width: 50%; margin-left:5%;" id="gas-cost"><span class="text4">*Costos aproximados para:</span><br/><span class="text3">'+vehicleConfig.vText+'</span><br/><span class="b2">'+vehicleConfig.pText+' '+vehicleConfig.gText+'</span></div>'+//<br/><span class="b3">Ajustar</span>
        '<div class="ui-block-b resultColumn3" style="width: 45%;line-height: 1.75em;" id="costs-block"><span class="text3">Costo total:</span><br/><span class="b1">$'+resultRoute[index].total.toFixed(2)+'</span><span class="text2"> mxn</span></div>';
    $(ruta).appendTo('#detailTable');
    var content='<div class="detailHeaderFooter"><span  style="padding-left: .5em">Indicaciones</span></div>';
    $('#detailContent').empty();
    for (var tramo in resultRoute[index].grafo){
        meters=resultRoute[index].grafo[tramo][7];
        var temp = convertMeters(meters);
        meters= temp[0];
        metersCaption = temp[1];
        minutes = resultRoute[index].grafo[tramo][6];
        var temp = convertMinutes(minutes);
        minutes= temp[0];
        minutesCaption = temp[1];
        var caseta=[];
        var alerta=[];
        var indicacion=0;
        var intermedio = null;
        caseta = resultRoute[index].grafo[tramo][12];
        alerta = resultRoute[index].grafo[tramo][13];
        indicacion= resultRoute[index].grafo[tramo][14];
        intermedio = resultRoute[index].grafo[tramo][15];

        var contentElem =
            '<div class="ui-grid-a" style="padding: 10px">'+
            '<div class="ui-block-a detailtColumn1"><span class="text8">'+count+' </span>';
        count++;
        if (caseta.length>0){
            casetasArray.push(caseta[0]);
            var contentCaseta =
                '<div class="ui-grid-b caseta" style="padding: 10px">'+
                '<div class="ui-block-a detailtColumn1"><img src="img/mapa/'+"caseta-1.png"+'" class="image35h"></div>'+
                '<div class="ui-block-b detailtColumn2"><span class="text2">Caseta: '+caseta[0][1]+'</span><br/>'+
                '<span class="text2" style="font-size:.75em"> Acepta: '+caseta[0][5]+'</span><br/>';
        }
        contentElem= contentElem +
            '<span class="text1">'+resultRoute[index].grafo[tramo][1]+'</span><br/><span class="text7">'
        switch (indicacion){
            case 2:
                contentElem+='<img src="img/indicaciones/derecho.png" class="image15h">';
                break;
            case 3:
                contentElem+='<img src="img/indicaciones/lig-izquierda.png" class="image15h">';
                break;
            case 4:
                contentElem+='<img src="img/indicaciones/lig-derecha.png" class="image15h">';
                break;
            case 5:
                contentElem+='<img src="img/indicaciones/izquierda.png" class="image15h">';
                break;
            case 6:
                contentElem+='<img src="img/indicaciones/derecha.png" class="image15h">';
                break;
            default :
                break;
        }
        if (intermedio!=null){
            switch (intermediateArray.length){
                case 0:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/b.png" class="image15h">';
                    break;
                case 1:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/c.png" class="image15h">';
                    break;
                case 2:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/d.png" class="image15h">';
                    break;
                case 3:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/e.png" class="image15h">';
                    break;
                default :
                    break;
            }
            intermediateArray.push(intermedio);
        }
        if (tramo==0||tramo=="0"){
            start.x=resultRoute[index].grafo[tramo][11][0][0];
            start.y=resultRoute[index].grafo[tramo][11][0][1];
            contentElem+='<img src="img/layers/web-puntos/a.png" class="image15h">';
        }
        if(tramo==(resultRoute[index].grafo.length-1)||tramo==(resultRoute[index].grafo.length-1)+""){
            var indexR=resultRoute[index].grafo[tramo][11].length-1;
            end.x=resultRoute[index].grafo[tramo][11][indexR][0];
            end.y=resultRoute[index].grafo[tramo][11][indexR][1];
            switch (intermediateArray.length){
                case 0:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/b-v.png" class="image15h">';
                    break;
                case 1:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/c-v.png" class="image15h">';
                    break;
                case 2:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/d-v.png" class="image15h">';
                    break;
                case 3:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/e-v.png" class="image15h">';
                    break;
                case 4:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/f-v.png" class="image15h">';
                    break;
                default :
                    break;
            }
        }
        contentElem=contentElem+
            resultRoute[index].grafo[tramo][2]+'</span><br/><span class="text8">'+resultRoute[index].grafo[tramo][5]+' ,'+resultRoute[index].grafo[tramo][4]+'</span>';
        if (alerta.length>0){
            alertasArray.push(alerta[0]);
            contentElem= contentElem+'<br/><span class="text5" style="font-size:.75em;"> Alerta: '+alerta[0][1]+'</span>';
        }
        contentElem = contentElem +
            '</div>'+
            '<div class="ui-block-b detailtColumn2">';
        if (caseta.length>0){
            contentCaseta = contentCaseta +
                '</div>'+
                '<div class="ui-block-c detailtColumn3">';
            var metodos ='<br/>';
            var electronico = false;
            for(var m in caseta[0][5]){
                try{
                    if(caseta[0][5][m].toLowerCase().indexOf("tdc")>-1){
                        metodos += '<img src="img/tc.png" class="image15h">';
                    }else if(caseta[0][5][m].toLowerCase().indexOf("efectivo")>-1){
                        metodos += '<img src="img/efectivo.png" class="image15h">';
                    }else if((caseta[0][5][m].toLowerCase().indexOf("tag")>-1||caseta[0][5][m].toLowerCase().indexOf("iave")>-1)&&electronico==false){
                        metodos += '<img src="img/electronico.png" class="image15h">';
                        electronico=true;
                    }
                }catch (e){}
            }
            contentCaseta= contentCaseta+
                '<span class="text2" style="font-size: 1em"> $'+caseta[0][3]+'</span>'+metodos+'<br/>'+
                '</div></div>';
            content=content+contentCaseta;
        }
        contentElem = contentElem +
            '<span class="b4">'+meters+' '+metersCaption+'</span><br/><span class="text2">'+decimalsHourToMinutes(minutes,2).replace(".",":")+' '+minutesCaption+'</span></div>'+
            '</div>'+
            '<div class="detail-sepbar"><div class="detail-sepbarInn" ></div></div>';
        content=content+contentElem;
    }
    $(content).appendTo('#detailContent');
    $.mobile.navigate('#detailpage');
    equalHeight('#detailTable .ui-grid-b');
    loader("hide");
}
function getDetailsMap(index){
    loader("show");
    currentRouteFeature=null;
    indexRoute = index;
    intermediateArray=[];
    arrayRoutes=[];
    casetasArray=[];
    alertasArray=[];
    var meters = 0,metersCaption="M";
    var minutes = 0, minutesCaption="Min:seg"
    var count=1;
    meters=resultRoute[index].distanciaTotal;
    var temp = convertMeters(meters);
    meters= temp[0];
    metersCaption = temp[1];
    minutes = resultRoute[index].tiempoTotal;
    var temp = convertMinutes(minutes);
    minutes= temp[0];
    minutesCaption = temp[1];
    $('#detailOrigenDestinoMap').empty();
    var head = '<div style="padding: 10px;display: inline-block;width: 90%;" onclick="showHideDetails(true)"><span id="showDetail2" class="ui-icon ui-icon-arrow-u ui-icon-shadow" style="display: inline-block;"></span><span style="padding-right: 5px;"></span>Detalles</div>';
    $(head).appendTo('#detailOrigenDestinoMap');
    $('#detailTableMap').empty();
    var alerta=0;
    var caseta = 0;
    caseta = resultRoute[index].casetasNo;
    var ruta="";
    try{
        for (var tramo in resultRoute[index].grafo){
            if(resultRoute[index].grafo[tramo][13].length>0){
                alerta=alerta+1;
            }
        }
    }catch (e){}
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

        ruta=ruta+'<div class="text8" style="font-size: .75em;padding-left: 10px;">'+caption+'.</div>';
    }
    ruta= ruta+
        '<div class="ui-block-a resultColumn1 text1" style="width: 100%;padding-bottom: 10px;text-align: left;">'+resultRoute[index].descripcion+'</div>'+
        '<div class="ui-block-a resultColumn1 borderRight" style="width: 20%;"><div class="text2" >Tiempo</div><div class="b1">'+decimalsHourToMinutes(minutes.toString(),2).replace(".",":")+'</div><div class="text2">'+minutesCaption+'</div></div>'+
        '<div class="ui-block-b resultColumn1 borderRight"><div class="text2" >Distancia</div><div class="b1">'+meters+'</div><div class="text2">'+metersCaption+'</div></div>'+
        '<div class="ui-block-c resultColumn1 borderRight"><div class="text2" >Casetas</div><div class="b1"> $'+resultRoute[index].casetasTotal.toFixed(2)+'</div><div class="text2">mxn</div></div>'+
        '<div class="ui-block-d resultColumn1" ><div class="text2" >Combustible</div><div class="b1"> $'+resultRoute[index].gasTotal.toFixed(2)+'</div><div class="text2">mxn</div></div>'+
        '<div class="ui-block-a resultColumn2" style="width: 53%;" id="gas-cost"><span class="text4">*Costos aproximados para:</span><br/><span class="text3">'+vehicleConfig.vText+'</span><br/><span class="b2">'+vehicleConfig.pText+' '+vehicleConfig.gText+'</span></div>'+//<br/><span class="b3">Ajustar</span>
        '<div class="ui-block-b resultColumn3" style="width: 47%;line-height: 1.75em; padding-left:5px;" id="costs-block"><span class="text3">Costo total:</span><br/><span class="b1">$'+resultRoute[index].total.toFixed(2)+'</span><span class="text2">mxn</span></div>';
    $(ruta).appendTo('#detailTableMap');
    var content='<div class="detailHeaderFooter"><span  style="padding-left: .5em">Indicaciones</span></div>';
    $('#detailContentMap').empty();
    for (var tramo in resultRoute[index].grafo){
        meters=resultRoute[index].grafo[tramo][7];
        var temp = convertMeters(meters);
        meters= temp[0];
        metersCaption = temp[1];
        minutes = resultRoute[index].grafo[tramo][6];
        var temp = convertMinutes(minutes);
        minutes= temp[0];
        minutesCaption = temp[1];
        var caseta=[];
        var alerta=[];
        var indicacion=0;
        var intermedio = null;
        caseta = resultRoute[index].grafo[tramo][12];
        alerta = resultRoute[index].grafo[tramo][13];
        indicacion= resultRoute[index].grafo[tramo][14];
        intermedio = resultRoute[index].grafo[tramo][15];

        var contentElem =
            '<div class="ui-grid-a" style="padding: 10px" onclick="SelectFeatureFromDetail('+tramo+',0)">'+
            '<div class="ui-block-a detailtColumn1"><span class="text8">'+count+' </span>';
        count++;
        if (caseta.length>0){
            casetasArray.push(caseta[0]);
            var contentCaseta =
                '<div class="ui-grid-b caseta" style="padding: 10px">'+
                    '<div class="ui-block-a detailtColumn1"><img src="img/mapa/'+"caseta-1.png"+'" class="image35h"></div>'+
                    '<div class="ui-block-b detailtColumn2"><span class="text2">Caseta: '+caseta[0][1]+'</span><br/>'+
                    '<span class="text2" style="font-size:.75em"> Acepta: '+caseta[0][5]+'</span><br/>';
        }
        contentElem= contentElem +
            '<span class="text1">'+resultRoute[index].grafo[tramo][1]+'</span><br/><span class="text7">'
        switch (indicacion){
            case 2:
                contentElem+='<img src="img/indicaciones/derecho.png" class="image15h">';
                break;
            case 3:
                contentElem+='<img src="img/indicaciones/lig-izquierda.png" class="image15h">';
                break;
            case 4:
                contentElem+='<img src="img/indicaciones/lig-derecha.png" class="image15h">';
                break;
            case 5:
                contentElem+='<img src="img/indicaciones/izquierda.png" class="image15h">';
                break;
            case 6:
                contentElem+='<img src="img/indicaciones/derecha.png" class="image15h">';
                break;
            default :
                break;
        }
        if (intermedio!=null){
            switch (intermediateArray.length){
                case 0:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/b.png" class="image15h">';
                    break;
                case 1:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/c.png" class="image15h">';
                    break;
                case 2:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/d.png" class="image15h">';
                    break;
                case 3:
                    contentElem+='<img src="img/layers/web-puntos/puntos_intermedios/e.png" class="image15h">';
                    break;
                default :
                    break;
            }
            intermediateArray.push(intermedio);
        }
        if (tramo==0||tramo=="0"){
            start.x=resultRoute[index].grafo[tramo][11][0][0];
            start.y=resultRoute[index].grafo[tramo][11][0][1];
            contentElem+='<img src="img/layers/web-puntos/a.png" class="image15h">';
        }
        if(tramo==(resultRoute[index].grafo.length-1)||tramo==(resultRoute[index].grafo.length-1)+""){
            var indexR=resultRoute[index].grafo[tramo][11].length-1;
            end.x=resultRoute[index].grafo[tramo][11][indexR][0];
            end.y=resultRoute[index].grafo[tramo][11][indexR][1];
            if(start.x==end.x&&start.y==end.y){
                end.x=end.x+0.0001;
            }
            switch (intermediateArray.length){
                case 0:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/b-v.png" class="image15h">';
                    break;
                case 1:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/c-v.png" class="image15h">';
                    break;
                case 2:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/d-v.png" class="image15h">';
                    break;
                case 3:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/e-v.png" class="image15h">';
                    break;
                case 4:
                    contentElem+='<img src="img/layers/web-puntos/puntos_finales/f-v.png" class="image15h">';
                    break;
                default :
                    break;
            }
        }
        contentElem=contentElem+
            resultRoute[index].grafo[tramo][2]+'</span><br/><span class="text8">'+resultRoute[index].grafo[tramo][5]+' ,'+resultRoute[index].grafo[tramo][4]+'</span>';
        if (alerta.length>0){
            alertasArray.push(alerta[0]);
            contentElem= contentElem+'<br/><span class="text5" style="font-size:.75em;"> Alerta: '+alerta[0][1]+'</span>';
        }
        contentElem = contentElem +
            '</div>'+
            '<div class="ui-block-b detailtColumn2">';
        if (caseta.length>0){
            contentCaseta = contentCaseta +
                '</div>'+
                '<div class="ui-block-c detailtColumn3">';
            var metodos ='<br/>';
            var electronico = false;
            for(var m in caseta[0][5]){
                try{
                    if(caseta[0][5][m].toLowerCase().indexOf("tdc")>-1){
                        metodos += '<img src="img/tc.png" class="image15h">';
                    }else if(caseta[0][5][m].toLowerCase().indexOf("efectivo")>-1){
                        metodos += '<img src="img/efectivo.png" class="image15h">';
                    }else if((caseta[0][5][m].toLowerCase().indexOf("tag")>-1||caseta[0][5][m].toLowerCase().indexOf("iave")>-1)&&electronico==false){
                        metodos += '<img src="img/electronico.png" class="image15h">';
                        electronico=true;
                    }
                }catch (e){}
            }
            contentCaseta= contentCaseta+
                '<span class="text2" style="font-size: 1em"> $'+caseta[0][3]+'</span>'+metodos+'<br/>'+
                '</div></div>';
            content=content+contentCaseta;
        }
        contentElem = contentElem +
            '<span class="b4">'+meters+' '+metersCaption+'</span><br/><span class="text2">'+decimalsHourToMinutes(minutes,2).replace(".",":")+' '+minutesCaption+'</span></div>'+
            '</div>'+
            '<div class="detail-sepbar"><div class="detail-sepbarInn" ></div></div>';

        var tempLine = createRouteLayer(resultRoute[index].grafo[tramo][11]);
        arrayRoutes.push(tempLine);
        content = content+contentElem;
    }
    content = content + '<div class="detailHeaderFooter"><img src="img/smallPin.png" style="padding-left: .5em"/><span  style="padding-left: .5em">Destino</span></div>';
    $(content).appendTo('#detailContentMap');
    if (map) {
        addRoute();
        addTollToMap();
        loader("hide");
    }
    $.mobile.navigate('#mappage');
}
function shareRoute(){
    if(!isApp){
        try{
            navigator.notification.alert(
                'Esta opción solo esta disponible en la version app.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("Esta opción solo esta disponible en la version app.");
        }
    }else{
        try{
            if(peticionRuta!="");{
                try{
                    var text=configArray['url']['webApp']+"?ruta="+peticionRuta;
                    var temp =JSON.parse(atob(peticionRuta));
                    var tempString = "Ruta desde "+temp.origen.desc;
                    for (var elem in temp.destinos){
                        if(elem==(temp.destinos.length-1)){
                            tempString+= " hasta "+temp.destinos[elem].desc;
                        }else{
                            tempString+= " a "+temp.destinos[elem].desc;
                        }
                    }
                    $.get(
                        "https://api-ssl.bitly.com/v3/shorten",
                        {
                            "access_token": 'd0e447350a6b617b08b368e79a0327efbbe16ea3',
                            "longUrl": text
                        },
                        function(response)
                        {
                            var link = response.data.url;
                            window.plugins.socialsharing.share('Te comparto esta ruta y te invito a que conozcas este aplicativo. ', tempString,null,link);
                        }).fail(function(msg) {
                            try{
                                navigator.notification.alert(
                                    'Ocurrió un error al intentar acortar la url se intentara usar la url completa.',// mensaje (message)
                                    alertDismissed,                      // función 'callback' (alertCallback)
                                    'Mappir',                         // titulo (title)
                                    'Cerrar'                             // nombre del botón (buttonName)
                                );
                            }catch (e){
                                alert("Ocurrió un error al intentar acortar la url se intentara usar la url completa.");
                            }
                            window.plugins.socialsharing.share('Te comparto esta ruta y te invito a que conozcas este aplicativo. ', tempString,null,text);
                        });
                }catch (ex){
                    try{
                        navigator.notification.alert(
                            'Ocurrió un error al intentar utilizar el control nativo de compartir.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert("Ocurrió un error al intentar utilizar el control nativo de compartir.");
                    }
                }
            }
        }catch(e){
            try{
                navigator.notification.alert(
                    'Ocurrió un error al intentar utilizar el control nativo de compartir.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert("Ocurrió un error al intentar utilizar el control nativo de compartir.");
            }
        }
    }
}
function SelectFeatureFromDetail(index){
    $.mobile.navigate("#mappage");
    if(window.map && window.map instanceof OpenLayers.Map){
        currentRouteFeature=index;
        var r1;
        var layer = map.getLayersByName("Route Layer")[0];
        if (layer){
            if (currentRouteFeature==null){
                currentRouteFeature=0;
            }
            r1 = layer.features[currentRouteFeature];
        }
        var control = map.getControlsBy("CLASS_NAME", "OpenLayers.Control.SelectFeature")[0];
        if (control){
            control.unselectAll();
            control.select(r1);
        }
    }
}
