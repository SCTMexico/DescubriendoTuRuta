function loadVehiclePage(){
    getVehicleSubtypeList(vehicleConfig.vType);
    isPanelOpen=false;
    openPanel="";
    $.mobile.navigate('#vehiclepage');
}
function setDefaultVehicle(){
    try{
        getVehicleSubtypeList(1);
        var el = $('#vehicle-type');
        el.val('1').attr('selected', true).siblings('option').removeAttr('selected');
        el.selectmenu("refresh", true);
        var el = $('#vehicle-subtype');
        el.val('2').attr('selected', true).siblings('option').removeAttr('selected');
        el.selectmenu("refresh", true);
        var el = $('#vehicle-axis');
        el.val(0).slider("refresh");
        var el = $('#gas-type');
        el.val('1').attr('selected', true).siblings('option').removeAttr('selected');
        el.selectmenu("refresh", true);
        var el = $('#performance');
        el.val(12).slider("refresh");
    }catch(ex) {}

}
function setVehicleConfig(){
    var type = $("#vehicle-type option:selected").val();
    var typeText = $("#vehicle-type option:selected").text();
    if (type==0){
        type=1;
        typeText="Automóvil";
    }
    var subtype = $("#vehicle-subtype option:selected").val();
    var subtypeText = $("#vehicle-subtype option:selected").text();
    if (subtype==0){
        subtype=2
        subtypeText="Automóvil mediano";
    }
    var axis = $("#vehicle-axis").val();
    var gas = $("#gas-type option:selected").val();
    var gasText = $("#gas-type option:selected").text();
    var vgas = $("#gas-type option:selected")[0].getAttribute("data-cost");
    if (gas==0){
        gas=1;
        gasText="combustible magna";
        vgas = gasValTipico;
    }
    var performance = $("#performance").val();
    var performanceText = performance+'km/lt';

    vehicleConfig=({"vType":type,"vText":typeText,"vSubtype":subtype,"axis":axis,"vsText":subtypeText,"vgas":vgas,"gas":gas,"gText":gasText,"perf":performance,"pText":performanceText});

    try{
        window.localStorage.setArray("vehicleConfig", vehicleConfig);
    }catch (e){
        try{
            navigator.notification.alert(
                'Ocurrió un error al guardar las configuraciones.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert('Ocurrió un error al guardar las configuraciones.');
        }
        return;
    }
    confirmRefresh();
}
function getVehicleConfig(){
    var value= gasValTipico;
    try {
        var vt = $('#vehicle-type');
        var vs = $('#vehicle-subtype');
        var ax = $('#vehicle-axis');
        var gt = $('#gas-type');
        var per = $('#performance');
        vt.val(vehicleConfig.vType).attr('selected', true).siblings('option').removeAttr('selected');
        vs.val(vehicleConfig.vSubtype).attr('selected', true).siblings('option').removeAttr('selected');
        try{
            var axis=parseInt(vehicleConfig.axis);
        }catch(e){}
        ax.val(axis);
        gt.val(vehicleConfig.gas).attr('selected', true).siblings('option').removeAttr('selected');
        try{
            value=parseInt(vehicleConfig.perf);
        }catch(e){}
        per.val(value);
    } catch (ex) {debugger;}
    try {
        vt.selectmenu("refresh",true);
        vs.selectmenu("refresh",true);
        gt.selectmenu("refresh",true);
        per.slider("refresh");
        ax.slider("refresh");
    } catch (ex) {debugger;}
    loader("hide");
}
function getVehicleSubtypeList(selected){
    $('#vehicle-subtype').empty();
    var failed= true;
    try{
        if(selected==0){
            failed=false;
        }else{
            for (var elem in vehicleType){
                if(vehicleType[elem]["name"].toLowerCase().indexOf("automóvil")>-1||vehicleType[elem]["name"].toLowerCase().indexOf("camión")>-1){
                    if(vehicleType[elem]["id"]==selected){
                        failed=false;
                    }
                }
            }
        }
        if(!failed){
            $('#axis').show();
            var per = $('#vehicle-axis');
            try{
                per.slider("refresh")
            }catch(ex){debugger;}
        }else{
            var per = $('#vehicle-axis');
            try{
                per.val(0).slider("refresh")
            }catch(ex){}
            $('#axis').hide();
        }
    }catch(ex) {debugger;}
    for(var elem in vehicleSubType){
        if (vehicleSubType[elem].category==selected){
            $('#vehicle-subtype').append('<option value="'+vehicleSubType[elem].id+'" data-rend="'+vehicleSubType[elem].rend+'">'+vehicleSubType[elem].name+'</option>');
        }
    }
    try{
        $('#vehicle-subtype').selectmenu("refresh",true);
    }catch (ex){debugger;}
}
function confirmRefresh(){
    $.mobile.navigate('#routepage');
    var startCount=0;var endCount=0;var opcionesSavedCount=0;
    if(start!=""){
        startCount= Object.keys(start).length;
    }
    if(end!=""){
        endCount= Object.keys(end).length;
    }
    if(opcionesSaved!=""){
        opcionesSavedCount= Object.keys(opcionesSaved).length;
    }
    if(resultRoute.length>0){
        if(startCount>0&&endCount>0&&opcionesSavedCount>0){
            $('#routepageResult').empty();
            try{
                navigator.notification.alert(
                    'Se guardaron las configuraciones exitosamente. Se intentará actualizar la ruta.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('Se guardaron las configuraciones exitosamente. Se intentará actualizar la ruta.');
            }
            setTimeout(function(){
                loader("show");
                var vehiculo = {
                    tipo : vehicleConfig.vType,
                    subtipo : vehicleConfig.vSubtype,
                    excedente : vehicleConfig.axis,
                    rendimiento : vehicleConfig.perf,
                    costoltgas : vehicleConfig.vgas
                }
                resultRoute=[];
                getRoute(start,destinosSaved,vehiculo,opcionesSaved,1);
            },1000);
            return;
        }
    }
    try{
        navigator.notification.alert(
            'Se guardaron las configuraciones exitosamente.',// mensaje (message)
            alertDismissed,                      // función 'callback' (alertCallback)
            'Mappir',                         // titulo (title)
            'Cerrar'                             // nombre del botón (buttonName)
        );
    }catch (e){
        alert('Se guardaron las configuraciones exitosamente.');
    }
}
