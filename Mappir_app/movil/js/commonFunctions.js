// fix height of content
function fixContentHeight(page) {
    var header, footer , content,contentHeight,
        viewHeight = screenHeight;
    if(page=="detailpage"){
        content =$("#contentDetails");
        var detailHeader = $("#headDetails");
        var detailFooter = $("#footDetails");
        var d=detailHeader.outerHeight(),df=detailFooter.outerHeight(), c=content.outerHeight();
        if(d==null){d=0;}if(df==null){df=0;}if(c==null){c=0;}
        contentHeight = viewHeight - (d + df);
        if ((c + df + d) !== viewHeight) {
            contentHeight -= ((c+2) - content.height());
            content.height(contentHeight);
        }
    }
    else if(page == "routepage"){
        resizeBWidth("#origenDestino",40);
        header = $("div[data-role='header']:visible");
        footer = $("div[data-role='footer']:visible");
        content = $("div[data-role='content']:visible:visible");
        var h=header.outerHeight(),f=footer.outerHeight(), c=content.outerHeight();
        if(h==null){h=0;}if(f==null){f=0;}if(c==null){c=0;}
        contentHeight= viewHeight - (f + h);
        if ((c + f + h) !== viewHeight) {
            contentHeight -= ((c+2) - content.height());
            content.height(contentHeight);
        }
    }else if(page == "mappage"){
        var mapHeader = $("#mapheader:visible"),
            mapFooter = $("#mapfooter:visible");
        content= $("div[data-role='content']:visible:visible");
        var m=mapHeader.outerHeight(),mf=mapFooter.outerHeight(), c=content.outerHeight();
        if(m==null){m=0;}if(mf==null){mf=0;}if(c==null){c=0;}
        contentHeight = viewHeight - ( mf + m);
        if ((c + m + mf) !== viewHeight) {
            contentHeight -= ((c+2) - content.height());
            content.height(contentHeight);
        }
        if (window.map && window.map instanceof OpenLayers.Map) {
            map.updateSize();
        }else{
            // initialize map
            init();
        }
    }
    else{
        header = $("div[data-role='header']:visible");
        footer = $("div[data-role='footer']:visible");
        content = $("div[data-role='content']:visible:visible");
        var h=header.outerHeight(),f=footer.outerHeight(), c=content.outerHeight();
        if(h==null){h=0;}if(f==null){f=0;}if(c==null){c=0;}
        contentHeight= viewHeight - (f + h);
        if ((c + f + h) !== viewHeight) {
            contentHeight -= ((c+2) - content.height());
            content.height(contentHeight);
        }
    }
}
/* Set same height to all the blocks inside the selected grid*/
function equalHeight(group) {
    var tallest = 0;
    $( group + ' > div').each(function() {
        var thisHeight = $(this).height();
        if(thisHeight > tallest) {
            tallest = thisHeight;
        }
    });
    var blockGroup = group.substring(group.length - 10,group.length)
    /*
    @ToDo en la tabla de detalles no esta ajustando bien la altura.
     */
    switch(blockGroup) {
        case ".ui-grid-a":
            $(group+' .ui-block-a, '+group+' .ui-block-b').height(tallest);
            break;
        case ".ui-grid-b":
            $(group+' .ui-block-a, '+group+' .ui-block-b, '+group+' .ui-block-c').height(tallest);
            break;
        case ".ui-grid-c":
            $(group+' .ui-block-a, '+group+' .ui-block-b, '+group+' .ui-block-c, '+group+' .ui-block-d').height(tallest);
            break;
        case ".ui-grid-d":
            $(group+' .ui-block-a, '+group+' .ui-block-b, '+group+' .ui-block-c, '+group+' .ui-block-d, '+group+' .ui-block-e').height(tallest);
            break;
        default:break;
    }
}
function popupCreatHtml(popupMessageHeader,popupMessageBody){
    return htmlToAppend = '<div class="detailHeaderFooter" >'+popupMessageHeader+'</h1></div>'+
        '<div class="text1">'+
        '<div class="alerta" style="text-align: left">'+popupMessageBody+'</div>'+
        '<a href="#" data-role="button" data-inline="true" data-rel="back" data-theme="c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-btn-up-c ui-shadow ui-btn-corner-all ui-btn-inline"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Cerrar</span></span></a>'+
        '</div>';
}
function popupLocationCreatHtml(popupMessageBody,lat,long){
    return htmlToAppend = '<div class="detailHeaderFooter" >Selecciona una Ubicación</h1></div>'+
        '<div class="text1">'+
        '<div class="location" style="text-align: left">'+popupMessageBody+'</div>'+
        '<a href="#" data-role="button" data-inline="true" data-rel="back" data-theme="c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-btn-up-c ui-shadow ui-btn-corner-all ui-btn-inline"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">NO</span></span></a>'+
        '<a href="#" data-role="button" data-inline="true" data-rel="back" data-theme="c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-btn-up-c ui-shadow ui-btn-corner-all ui-btn-inline" onclick="endChooseLocation('+lat+','+long+');"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">SI</span></span></a>'+
        '</div>';
}
function showPopupError(popupMessageHeader,popupMessageBody){
    var htmlToAppend = popupCreatHtml(popupMessageHeader,popupMessageBody);
    // Delete previous Popups Content.
    $("#popupNotice").empty()
    $(htmlToAppend).appendTo("#popupNotice");
    $( "#popupNotice" ).popup( "open" );
}
// create Openlayers Icons from de imageArray;
var loadImages = function(count){
    image = new Image();
    image.onload = function(e){
        var x = 30/this.width;
        var height = Math.floor(this.height*x);
        var tempIcon = new OpenLayers.Icon(imageArray[count],new OpenLayers.Size(30,height),new OpenLayers.Pixel(-(30/2), -height));
        iconArray.push(tempIcon);
        count+=1;
        if (count<imageArray.length){
            loadImages(count);
        }
    }
    image.src = imageArray[count];
};
function appendMenu(page){
    var menu =
    '<div data-role="panel" class="menuPanel" data-position="left" data-display="overlay" id="'+page+'">'+
            '<div class="menuHeader" style="font-size: 1em" >'+
            '<div class="ui-grid-b">'+
            '<div class="ui-block-a"><a href="#routepage" data-rel="close"><img class="imageLogo" src="img/menu.png"/></a></div>'+
            '<div class="ui-block-b" style="text-align: center"><img class="imageLogo" src="img/logo.png"/></div>'+
            '<div class="ui-block-c"></div>'+
            '</div>'+
        '</div>'+
        '<div class="menuElement" onclick="navigateFromMenu(\'#routepage\')"><img class="imageMenu" src="img/menu_buscar.png">Buscar Ruta</div>'+
        '<div class="menuElement" onclick="loadSavedRoutesPage()"><img class="imageMenu" src="img/menu_guardado.png">Rutas guardadas</div>'+
        '<div class="menuElement" onclick="loadVehiclePage()"><img class="imageMenu" src="img/menu_auto.png">Ajustar vehículo y combustible</div>'+
        //'<div class="menuElement" onclick="navigateFromMenu(\'#reportpage\')"><img class="imageMenu" src="img/menu_accidente.png">Reportar incidente</div>'+
        '<div class="menuElement" onclick="navigateFromMenu(\'#phonepage\')"><img class="imageMenu" src="img/menu_tel.png">Teléfonos de emergencia</div>'+
        '<div class="menuElement" onclick="navigateFromMenu(\'#aboutpage\')"><img class="imageMenu" src="img/menu_acerca-de.png">Acerca de...</div>'+
        '<div class="menuElement" onclick="navigateFromMenu(\'#contactpage\')"><img class="imageMenu" src="img/contacta.png">Ayudanos a mejorar...</div>'+
    '</div>'+
    '<div class="ui-grid-b">'+
    '<div class="ui-block-a"><a href="#'+page+'" title="Menu" style="margin-left: 0em;"><img class="imageLogo" src="img/menu.png"/></a></div>'+
    '<div class="ui-block-b" style="text-align: center;"><img class="imageLogo" src="img/logo.png" onclick="$.mobile.navigate(\'#routepage\')"/></div>'+
    '<div class="ui-block-c"></div>'+
    '</div>';
    $(menu).appendTo('#'+page+'Div');
}
function decimalsHourToMinutes(time,decimales){
    i=1;
    var entre=10;
    while(i<decimales){
        entre = entre*10;
        i++;
    }
    var values = time.split(".");
    var decimals = values[1];
    var hours = values[0];
    var minutes = (Math.floor((decimals*60)/entre));
    if (minutes<10){
        minutes="0"+minutes;
    }
    return hours+'.'+minutes;
}
//Works only with ui-grid-b to resize blockB
function resizeBWidth(target,pixels){
    var blockA = $(target +" .ui-grid-b .ui-block-a"),
        blockB = $(target+" .ui-grid-b .ui-block-b"),
        blockC = $(target+" .ui-grid-b .ui-block-c"),
        totalWidth = $(target+" .ui-grid-b:visible");
    var a = blockA.outerWidth(),b    =blockB.outerWidth(),c=blockC.outerWidth(),t=totalWidth.outerWidth();
    if(a==null){a=0;}if(b==null){b=0;}if(c==null){c=0;}if(t==null){t=0;}
    if ((a + c + b) !== t) {
        try{pixels = parseInt(pixels);}catch (ex){}
        var blockBWidth = t - (a + c) - pixels;
        blockB.width(blockBWidth);
    }
}
//Works only with ui-grid-a to resize blockB
function resizeMapHeaderWidth(){
    var blockA = 65,
        blockB = $("#mapdetail"),
        totalWidth = $("#mapheader:visible");
    var b =blockB.outerWidth(),t=totalWidth.outerWidth();
    if ((65 + blockB.outerWidth()) !== totalWidth) {
        var blockBWidth = totalWidth.outerWidth() - (blockA) ;
        blockB.width(blockBWidth);
    }
}
//Works only with ui-grid-a to resize blockB
function resizeBMenuWidth(target,pixels){
    var blockA = $(target +" .ui-grid-a .ui-block-a"),
        blockB = $(target+" .ui-grid-a .ui-block-b"),
        totalWidth = $(target+" .ui-grid-a:visible");
    var a = blockA.outerWidth(),b =blockB.outerWidth(),t=totalWidth.outerWidth();
    if ((blockA.outerWidth() + blockB.outerWidth()) !== totalWidth) {
        var blockBWidth = totalWidth.outerWidth() - blockA.outerWidth() - pixels;
        blockB.width(blockBWidth);
    }
}
var progressBar = function(progress){
    var prog = $(".progressBarIndicator"),
        progLabel = $(".progressBarLabel");
    prog.width(progress);
    progLabel.html(progress);
}
function convertMinutes(minutes){
    var returnArray=[];
    var layer="";
    if (minutes>60){
        minutes=minutes/60;
        try{
            minutes= minutes.toFixed(2);
        }catch(e){}
        layer="h:min";
    }else{
        try{
            minutes= minutes.toFixed(2);
            if (minutes<1){
                minutes="01.0000000001";
            }else if(minutes<10){
                minutes="0"+minutes;
            }
        }catch(e){}
        layer="min:seg";
    }
    returnArray.push(minutes);
    returnArray.push(layer);
    return returnArray;
}
function convertMeters(meters){
    var returnArray=[];
    var layer;
    if (meters>1000){
        meters=meters/1000;
        try{
            meters= meters.toFixed(2);
        }catch(e){}
        layer = "km";
    }else{
        try{
            meters= meters.toFixed(2);
        }catch(e){}
        layer="M";
    }
    returnArray.push(meters);
    returnArray.push(layer);
    return returnArray;
}
function loader(status){
    if(status=='hide'){
        $.mobile.loading( "hide" );
        $('#block-ui').hide();
    }else if (status=='show'){
        var theme = "b",
            msgText = "Cargando",
            textVisible = "true" ,
            textonly = false;
        $.mobile.loading( "show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly
        });
        $('#block-ui').show();
    }else{
        try{
            navigator.notification.alert(
                'El estatus enviado es incorrecto.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("El estatus enviado es incorrecto.");
        }
    }
}
function bubbleHeight() {
    var heigth = $('#zoomAlertContent').outerHeight()+10;
    $('#zoomAlert').height(heigth);
}
function equalHeightSavedRoutes() {
    var tallest = 0;
    $( "#savedRoutesBlock .ui-grid-a" + ' > div').each(function() {
        var temp = $(this);
        var thisHeight = $(this).height();
        if(thisHeight > tallest) {
            tallest = thisHeight;
        }
        if (temp[0].className.toString()=="ui-block-b background1"){
            $(this).height(tallest)
            tallest=0;
        }
    });
}
function setPointData(tempArray){
    var tempString = JSON.stringify(tempArray);
    tempString = tempString.replace(/\"/g,"'");
    return tempString;
}
function getPointData(tempString){
    tempString = tempString.replace(/\'/g,"\"");
    var tempArray= JSON.parse(tempString);
    return tempArray;
}
function loadBanner(data){
    var bannerElem=$('#news-banner');
    bannerElem.empty();
    var banner = data;
    //var banner = '<span id="news"><img src="img/banner.png" class="image35h"/><span style="top: -30%;">Antes de viajar verifique el estado de su vehículo y en caso necesario llévelo a mantenimiento; Evite conducir si ha consumido bebidas alcohólicas o enervantes; Respete a los demás usuarios evitando deslumbrar con sus luces altas; Evite distracciones, No utilice dispositivos móviles mientras conduce; Mantenga la distancia con respecto a otros vehículos; Todos los ocupantes del vehículo deberán utilizar el cinturón de seguridad; Todos los ocupantes del vehículo deberán utilizar el cinturón de seguridad; Respete las señales y la velocidad máxima indicada;</span></span>';
    try{
        $(banner).appendTo('#news-banner');
        $('#news-banner').click(
            function () {
                if(stopAnim==false){
                    stopAnim=true;
                    var elem=$('#news');
                    elem.stop(true, true).css("left", "10");
                }else{
                    var elem=$('#news');
                    var scrollingWidth = elem.width();
                    scrollingWidth = scrollingWidth + 10;
                    var initialOffset = elem.offset().left;
                    stopAnim = false;
                    animateTitle(scrollingWidth, initialOffset,elem);
                }

            }
        );
    }catch (e){
        try{
            navigator.notification.alert(
                'Ocurrió un error con el contenido.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("Ocurrió un error con el contenido.");
        }
        $('#news-banner').hide();
    }

}
function animateTitle(scrollingWidth, initialOffset,elem){
    if(!stopAnim ){
        try{
            var durationSegs = scrollingWidth*20;
            var $a = elem;
            $a.animate({left: (($a.offset().left == (scrollingWidth + initialOffset ))?-initialOffset:("-="+scrollingWidth))},
                {
                    duration:durationSegs,
                    easing: 'linear',
                    complete: function(){
                        if($a.offset().left < 10){
                            initialOffset=10;
                            $(this).css("left", 10);
                        }
                        animateTitle(scrollingWidth,initialOffset,elem);
                    }

                });
        }catch (e){}
    }
}
function mapMenuHeight(){
    var viewHeight = screenHeight;
    var menuHeight = $('#markersMenu');
    var mapPageHeight = $('#mappage');
    mapPageHeight.css('max-height', viewHeight);
    mapPageHeight.css('min-height', viewHeight);
    menuHeight.css('max-height', viewHeight);
    menuHeight.css('min-height', viewHeight);
}
function mapDetailMenuHeight(){
    var viewHeight = screenHeight;
    var detailHeight = $('#detailMenu');
    var mapPageHeight = $('#mappage');
    mapPageHeight.css('max-height', viewHeight);
    mapPageHeight.css('min-height', viewHeight);
    detailHeight.css('max-height', viewHeight);
    detailHeight.css('min-height', viewHeight);
    fixDetailHeight()
}
function showHideDetails(map){
    if(detailsHidden){
        try{
            $('#detailTable').show();
            $("#showDetail").removeClass('ui-icon-arrow-d');
            $("#showDetail").addClass('ui-icon-arrow-u');
        }catch (e){debugger;}
        try{
            $('#detailTableMap').show();
            $("#showDetail2").removeClass('ui-icon-arrow-d');
            $("#showDetail2").addClass('ui-icon-arrow-u');
        }catch (e){debugger;}
        detailsHidden=false;
    }else{
        try{
            $('#detailTable').hide();
            $("#showDetail").removeClass('ui-icon-arrow-u');
            $("#showDetail").addClass('ui-icon-arrow-d');
        }catch (e){debugger;}
        try{
            $('#detailTableMap').hide();
            $("#showDetail2").removeClass('ui-icon-arrow-u');
            $("#showDetail2").addClass('ui-icon-arrow-d');
        }catch (e){debugger}
        detailsHidden=true;
    }
    if (!map){
        fixContentHeight("detailpage");
    }else{
        mapDetailMenuHeight();
    }
}
function fixDetailHeight(){
    debugger;
    var viewHeight = screenHeight;
    var content =$("#contentDetailsMap");
    var detailHeader = $("#headDetailsMap");
    var detailFooter = $("#footDetailsMap");
    var d=detailHeader.outerHeight(),df=detailFooter.outerHeight(), c=content.outerHeight();
    if(d==null){d=0;}if(df==null){df=0;}if(c==null){c=0;}
    var contentHeight = viewHeight - (d + df);
    var ch = content.height();
    if(ch==null){ch=0;}
    if ((c + df + d) !== viewHeight) {
        contentHeight -= ((c+2) - ch);
        content.height(contentHeight);
    }
}
function distance(lat1, lon1, lat2, lon2) {
    try{
        lat1 = parseFloat(lat1);
        lon1 = parseFloat(lon1);
        lat2 = parseFloat(lat2);
        lon2 = parseFloat(lon2);
    }catch (e){}
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) *  Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344*1000
    return dist
}
function reloadCaptcha(){
    var captcha = $("#captcha");
    captcha.empty();
    var image = '<img src="'+configArray['servicios']['captcha']+'"><a href="javascript:void(0);" onclick="reloadCaptcha()"><img src="img/layers/restaurar.png" class="image35h"></a>';
    $(image).appendTo(captcha);
}
function alertDismissed() {
    return;
}
function handleBackButton(){
    if(isPanelOpen){
        $( openPanel ).panel( "close" );
        isPanelOpen=false;
        openPanel="";
    }else if ($.mobile.activePage.is("#routepage")){
        navigator.app.exitApp();
    }
    else{
        $.mobile.navigate("#routepage" );
    }
}
function cloneObject(source) {
    for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        }
        else{
            this[i] = source[i];
        }
    }
}
function isTouchDevice(){
    try{
        document.createEvent("TouchEvent");
        return true;
    }catch(e){
        return false;
    }
}
function touchScroll(id){
    if(isTouchDevice()){ //if touch events exist...
        var el=document.getElementById(id);
        var scrollStartPos=0;

        document.getElementById(id).addEventListener("touchstart", function(event) {
            scrollStartPos=this.scrollTop+event.touches[0].pageY;
            event.preventDefault();
        },false);

        document.getElementById(id).addEventListener("touchmove", function(event) {
            this.scrollTop=scrollStartPos-event.touches[0].pageY;
            event.preventDefault();
        },false);
    }
}
function navigateFromMenu(page){
    isPanelOpen=false;
    openPanel="";
    $.mobile.navigate(page);
}
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
function removeScriptElems(target) {
    debugger;
    var str = $("#"+target).val();
    for(var i in scriptElems){
        if (str.indexOf(scriptElems[i])!=(-1)){
            str = str.replace(new RegExp(escapeRegExp(scriptElems[i]), 'g'),"");
            $("#"+target).val(str);
            try{
                navigator.notification.alert(
                    'El caractér utilizado "'+scriptElems[i]+'" no es permitido, por lo que se eliminó..',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('El caractér utilizado "'+scriptElems[i]+'" no es permitido, por lo que se eliminó.');
            }
        }
    }
}
function removeScriptElemsListView(target) {
    var str = $("#"+target).closest('[data-role=listview]').prev('form').find('input').val();
    for(var i in scriptElems){
        if (str.indexOf(scriptElems[i])!=(-1)){
            str = str.replace(new RegExp(escapeRegExp(scriptElems[i]), 'g'),"");
            $("#"+target).closest('[data-role=listview]').prev('form').find('input').val(str);
            try{
                navigator.notification.alert(
                    'El caractér utilizado "'+scriptElems[i]+'" no es permitido, por lo que se eliminó..',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('El caractér utilizado "'+scriptElems[i]+'" no es permitido, por lo que se eliminó.');
            }
        }
    }

}
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function showLocationError(error){
    loader("hide")
    reportLocation=null;
    //"TIMEOUT"
    //"POSITION_UNAVAILABLE"
    //"PERMISSION_DENIED"
    if(error.code =="3" || error.code ==3){
        try{
            navigator.notification.alert(
                'Se agoto el tiempo de espera, no se pudo localizar tu ubicación.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("Se agoto el tiempo de espera, no se pudo localizar tu ubicación.");
        }
    }else if(error.code =="2" || error.code ==2){
        try{
            navigator.notification.alert(
                'La geolocalización no está disponible verifique si el GPS esta encendido o si hay conectividad de red, no se pudo localizar tu ubicación.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("La geolocalización no está disponible verifique si el GPS esta encendido o si hay conectividad de red, no se pudo localizar tu ubicación.");
        }
    }else if(error.code =="1" || error.code ==1){
        try{
            navigator.notification.alert(
                'El dispositivo negó la geolocalización, no se pudo localizar tu ubicación.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("El dispositivo negó la geolocalización, no se pudo localizar tu ubicación.");
        }
    }else{
        try{
            navigator.notification.alert(
                'code: '    + error.code    + '\n' +      'message: ' + error.message + '\n',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert('code: '    + error.code    + '\n' +      'message: ' + error.message + '\n');
        }
    }
}
