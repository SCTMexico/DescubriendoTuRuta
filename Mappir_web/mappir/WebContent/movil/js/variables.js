String.prototype.toLatLon = function () {
    return this.replace(/\((.*)\)/, '$1').split(',');
};
Storage.prototype.setArray = function (key, array){
    return window.localStorage.setItem(key, JSON.stringify(array));
};

Storage.prototype.getArray = function (key){
    if(window.localStorage.getItem(key)){
        var s = (window.localStorage.getItem(key));
        return JSON.parse(window.localStorage.getItem(key));
    }
};
OpenLayers.Map.prototype.isValidZoomLevel = function (zoomLevel) {
    return ( (zoomLevel != null) &&
        (zoomLevel >= 4) && // set min level here, could read from property
        (zoomLevel < this.getNumZoomLevels()));
}

/*
    *Nota: se tomo la decisión de no almacenar en memoria los elementos que se buscan en tiempo de ejecución en el Documento
    * ejemplo  $("#origen") , si se guardan se evita buscarlas en toodo el documento cada que se necesiten, si no se guardan
    * se ahorra memoria.
 */
var visibleIntermediateArray = new Array(4);
visibleIntermediateArray[0]=0;visibleIntermediateArray[1]=0;visibleIntermediateArray[2]=0;visibleIntermediateArray[3]=0;
var intermediateCount=0;
var maxIntermediate=4;
//var myLocation=null;
var jqxhr;
var prevPuntos = [];
var prevPuntosCount =0;
var changedPoint="";
var marksArray = [];
var iconArray = [];

iconArray.push('img/mapa/gasolineria.png');
iconArray.push('img/mapa/area-descanso.png');
iconArray.push('img/mapa/autobus.png');
iconArray.push('img/mapa/bahia-auxilio.png');
iconArray.push('img/mapa/ciudad-turistica.png');
iconArray.push('img/mapa/museo.png');
iconArray.push('img/mapa/patrimonio.png');
iconArray.push('img/mapa/playa.png');
iconArray.push('img/mapa/pueblo-magico.png');
iconArray.push('img/mapa/restaurant.png');
iconArray.push('img/mapa/servicio-medico.png');
iconArray.push('img/mapa/taller.png');
iconArray.push('img/mapa/tienda.png');
iconArray.push('img/mapa/zona-arqueologica.png');
iconArray.push('img/mapa/grua.png');
iconArray.push('img/mapa/incidente.jpg');
iconArray.push('img/mapa/evento.jpg');


var zoom;
var skipIconList = [];
var configArray =[];
var imageArray = [];
var vehicleConfig=({"vType":1,"vText":"Automóvil","vSubtype":2,"axis":0,"vsText":"Automóvil mediano","vgas":12,"gas":1,"gText":"combustible Magna","perf":12,"pText":"12km/lt"});
var savedRoutes = [];
var resultRoute =[];
var autoCompleteLoaded = false;
var arrayRoutes=[];
var currentRouteFeature = null;
var indexRoute=null;
var searching = null;
var prevPage = null;
var locationArray = [];
var locationSequenceArray =[];
var stopAnim=true;
var casetas = true;
var alertas = true;
var gasValTipico=13;
var gasArray=[];
var peticionRuta="";
var casetasArray=[];
var alertasArray=[];
var intermediateArray=[];
var start="";
var end="";
var alertasList = [];
var ajustesDisabled=false;
var detailsHidden=false;
var vehicleType =[];
var vehicleSubType = [];
var reportLocation=null;
var addClickControl=false;
var fromReport=false;
var markerFunction=false;
var weatherFunction=false;
var useReportLocation =false;
var screenHeight=0;
var screehWidth=0;
var orName="";
var desName="";
var isApp=false;
var isPanelOpen=false;
var openPanel="";
var usr="sct";//ttr_mobile
var key="sct";//WTGS10BG
var destinosSaved="";
var opcionesSaved="";
var scriptElems =["<",">","/","&","?","$","#","%","|","!","=",":","script"];