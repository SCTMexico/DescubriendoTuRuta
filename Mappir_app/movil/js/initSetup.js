// enabling crossdomain calls
$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

//get Cached Items_______________________________________________________________________________
if(window.localStorage.getArray("cachedPoints")!= null){
    prevPuntos = window.localStorage.getArray("cachedPoints");
    prevPuntosCount = prevPuntos.length;
}
if(window.localStorage.getArray("vehicleConfig")!= null){
    vehicleConfig = window.localStorage.getArray("vehicleConfig");
}
if(window.localStorage.getArray("savedRoutes")!= null){
    savedRoutes = window.localStorage.getArray("savedRoutes");
}
// one-time initialisation of button handlers and controlls _____________________________________
$(document).on('click', '#plus', function () {map.zoomIn();});
$(document).on('click', '#minus', function () {map.zoomOut();});
$(document).on( "panelbeforeclose", "#markersMenu", function( event, ui ) {
    getMarks();
} );

//The panel handlers for menu are set here but has to be the same sent to function appendMenu in initSetup.js
$(document).on('panelopen', '#routepageMenu', function () {
    isPanelOpen=true;
    openPanel="#routepageMenu";
});
$(document).on('panelopen', '#detailpageMenu', function () {
    isPanelOpen=true;
    openPanel="#detailpageMenu";
});
$(document).on('panelopen', '#vehiclepageMenu', function () {
    isPanelOpen=true;
    openPanel="#vehiclepageMenu";
});
$(document).on('panelopen', '#reportpageMenu', function () {
    isPanelOpen=true;
    openPanel="#reportpageMenu";
});
$(document).on('panelopen', '#savedRoutespageMenu', function () {
    isPanelOpen=true;
    openPanel="#savedRoutespageMenu";
});
$(document).on('panelopen', '#phonepageMenu', function () {
    isPanelOpen=true;
    openPanel="#phonepageMenu";
});
$(document).on('panelopen', '#aboutpageMenu', function () {
    isPanelOpen=true;
    openPanel="#aboutpageMenu";
});

$(document).on('panelopen', '#markersMenu', function () {
    isPanelOpen=true;
    openPanel="#markersMenu";
    //resizeBWidth("#markersMenu",35)
    resizeBMenuWidth("#markersMenu",50);
    mapMenuHeight();
    $('#navigation').hide();
});
$(document).on('panelopen', '#detailMenu', function () {
    isPanelOpen=true;
    openPanel="#detailMenu";
    mapDetailMenuHeight ();
    try{
        $('#markers').hide();
    }catch(e){}
    if(detailsHidden){
        try{
            $("#showDetail").removeClass('ui-icon-arrow-u');
            $("#showDetail").addClass('ui-icon-arrow-d');
        }catch (e){}
        try{
            $("#showDetail2").removeClass('ui-icon-arrow-u');
            $("#showDetail2").addClass('ui-icon-arrow-d');
        }catch (e){}
    }else{
        try{
            $("#showDetail").removeClass('ui-icon-arrow-d');
            $("#showDetail").addClass('ui-icon-arrow-u');
        }catch (e){}
        try{
            $("#showDetail2").removeClass('ui-icon-arrow-d');
            $("#showDetail2").addClass('ui-icon-arrow-u');
        }catch (e){}
    }
});
$(document).on('panelclose', '#markersMenu', function () {
    $('#navigation').show();
});
$(document).on('panelclose', '#detailMenu', function () {
    $('#markers').show();
});
$(document).on('popupafterclose', '#popupMapa', function () {
    if(fromReport==true&&useReportLocation==true){
        $.mobile.navigate('#reportpage');
        getLocationName();
        fromReport=false;
    }
});
$(document).on('pageshow', '#routepage', function () {
    if (!autoCompleteLoaded){
        loadDestinationFunctions();
        //modified no longer required since element type change
        //bindDestinationChanges();
        bindDestinationFocus();
    }
});
$(document).on('pageshow', '#detailpage', function () {
    if(detailsHidden){
        try{
            $("#showDetail").removeClass('ui-icon-arrow-u');
            $("#showDetail").addClass('ui-icon-arrow-d');
        }catch (e){}
        try{
            $("#showDetail2").removeClass('ui-icon-arrow-u');
            $("#showDetail2").addClass('ui-icon-arrow-d');
        }catch (e){}
    }else{
        try{
            $("#showDetail").removeClass('ui-icon-arrow-d');
            $("#showDetail").addClass('ui-icon-arrow-u');
        }catch (e){}
        try{
            $("#showDetail2").removeClass('ui-icon-arrow-d');
            $("#showDetail2").addClass('ui-icon-arrow-u');
        }catch (e){}
    }
});
$(document).on('pageshow', '#reportpage', function (e, data) {
    try{
        $("#reportTel").keypress(function (e) {
            //if the letter is not digit then display error and don't type anything
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        });
    }catch (e){}
    try{
        $("#useText").keypress(function (e) {
            var s = e.target.value.length;
            //if the letter is not digit then display error and don't type anything
            return (e.target.value.length <= 299)||(e.which == 8 || e.which==46||(e.which>=35&& e.which<=40))
        });
    }catch (e){}
    try{
        var captcha = $("#captcha");
        captcha.empty();
        var image = '<img src="'+configArray['servicios']['captcha']+'"><a href="javascript:void(0);" onclick="reloadCaptcha()"><img src="img/layers/restaurar.png" class="image35h"></a>';
        $(image).appendTo(captcha);
    }catch(e){
        try{
            navigator.notification.alert(
                'Ha ocurrido un error al descargar el captcha',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("Ha ocurrido un error al descargar el captcha");
        }
    }
    prevPage = '#'+data.prevPage.attr('id');
    if(prevPage=="#mappage"&& resultRoute.length<1){
        prevPage="#routepage";
    }
    //locationReport();
});
$(document).on('pageshow', '#vehiclepage', function (e, data){
    if(ajustesDisabled){
        try{
            navigator.notification.alert(
                'esta página esta deshabilitada por esta sesión ya que no se pudo descargar la lista de vehículos o combustibles.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("esta página esta deshabilitada por esta sesión ya que no se pudo descargar la lista de vehículos o combustibles.");
        }
        alert("esta página esta deshabilitada por esta sesión ya que no se pudo descargar la lista de vehículos o combustibles.");
        var prevPage = '#'+data.prevPage.attr('id');
        if (prevPage!= null){
            try{
                $.mobile.navigate(prevPage);
            }catch (e){
                $.mobile.navigate('#routepage');
            }
        }else{
            $.mobile.navigate('#routepage');
        }
        return;
    }
    $("#vehicle-type").bind( "change", function(event) {
        getVehicleSubtypeList(event.target.value);
    });
    $("#vehicle-subtype").bind( "change", function(event) {
        var selected = event.target[event.target.selectedIndex];
        if(selected.index>0){
            var value = selected.getAttribute("data-rend");
            var per = $('#performance');
            try{
                value=parseInt(value);
            }catch(e){}
            per.val(value).slider("refresh");
        }
        if (selected.index==0){
            var per = $('#performance');
            per.val(12).slider("refresh");
        }
    });
    $("axis").hide();
});
$(document).on('pageshow', '#mappage', function(){
    if (map) {
        resizeMapHeaderWidth();
    }
    try{
        resizeMapHeaderWidth();
        mapDetailMenuHeight ();
    }catch (e){}
});
// hide intermediatePoint if empty
$(document).on('pagebeforeshow', '#routepage', function () {
    var i=1;
    hideOriginResults();
    while (i<maxIntermediate+1)
    {
        if(visibleIntermediateArray[i-1]==0){
            $('#intermedioBlock-'+i).hide();
        }
        i++;
    }
});
// hide zoomAlert
$(document).on('pagebeforeshow', '#mappage', function () {
    $('#zoomAlert').hide();
    $('#zoomAlertContent').hide();
});
$(document).on('pagebeforeshow', '#vehiclepage', function () {
    getVehicleConfig();
});
// bind fixContent
$(window).bind("orientationchange pageshow resize", function(e,data){
    var page="";
    var height = $(window).outerHeight();
    var width = $(window).outerWidth();
    if(e.type){
        if(e.type=='orientationchange'){
            setTimeout(function(){
                var url =window.location.href.split("#");
                page = url[1];
                try{
                    if (e.orientation=="landscape"){
                        if (height>width){
                            screehWidth=height;
                            screenHeight=width;
                        }else{
                            screehWidth=width;
                            screenHeight=height;
                        }
                    }else{
                        if (height<width){
                            screehWidth=height;
                            screenHeight=width;
                        }else{
                            screehWidth=width;
                            screenHeight=height;
                        }
                    }
                }catch (ex){
                    screehWidth=width;
                    screenHeight=height;
                }
                switch (page){
                    case'savedRoutespage':
                        equalHeightSavedRoutes();
                        //equalHeight("#savedRoutesBlock .ui-grid-a");
                        break;
                    case'mappage':
                        bubbleHeight();
                        try{
                            resizeMapHeaderWidth();
                            mapDetailMenuHeight ();
                        }catch (e){}
                        break;
                    default :
                        break;
                }
                if (page){
                    fixContentHeight(page);
                }
            },500);
            return;
        }else{
            page = e.target.id;
            screehWidth=width;
            screenHeight=height;
        }
        switch (page){
            case'savedRoutespage':
                equalHeightSavedRoutes();
                //equalHeight("#savedRoutesBlock .ui-grid-a");
                break;
            case'mappage':
                bubbleHeight();
                try{
                    resizeMapHeaderWidth();
                    mapDetailMenuHeight ();
                }catch (e){}
                break;
            default :
                break;
        }
    }
    if (page){
        fixContentHeight(page);
    }
});
