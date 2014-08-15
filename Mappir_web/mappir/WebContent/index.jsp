<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ page import="mx.gob.sct.mappir.util.Constantes" %>
<%@ page import="mx.gob.sct.mappir.util.Config" %>
<%@ page import="mx.gob.sct.mappir.helpers.CatalogosContenido" %>
<%@ page import="mx.gob.sct.mappir.helpers.MetaTags" %>
<%@ page import="java.util.List" %><html>
<head>
    <meta charset="utf-8">
	<script type="text/javascript" src="js/sct/redirect.js"></script>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title><%Config.getVariable(Constantes.GENERAL_UNSECURE_URL); %></title>

    <% out.println(MetaTags.metaTagasDesdeParametro(request.getParameter("ruta"))); %>
    <meta name="author" content="MAPPIR, SCT">
    <meta name="Keywords" content="MAPPIR, SCT, TTR, RUTA, TRAZA TU RUTA" >
    <meta property="og:image" content="http://ttr.sct.gob.mx/mappir/images/logo_min.png">

    <link rel="shortcut icon" href="favicon.png">

    <title><% out.println(Config.getVariable(Constantes.PAGINA_TITULO)); %></title>

    <link href="unificadoCSS.css" rel="stylesheet"/>

    <!--[if lt IE 9]
    <script src="js/html5shiv.js"></script>
    <script src="js/respond.min.js"></script>
    [endif]-->
	
    <script type="text/javascript" src="js/jquery/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="js/jquery/jquery-ui-1.10.3.custom.min.js"></script>
    <script type="text/javascript" src="js/jquery/plugins/jquery.form.js"></script>
    <script type="text/javascript" src="js/twig/twig.min.js"></script>
    <script type="text/javascript" src="js/OpenLayers/OpenLayers-min.js"></script>
    <script type="text/javascript" src="js/sct/ExportImage.js"></script>

    <script type="text/javascript" src="js/jspdf/jspdf.js"></script>
    <script type="text/javascript" src="./js/FileSaver.js/FileSaver.js"></script>
    <script type="text/javascript" src="./js/Blob.js/Blob.js"></script>
    <script type="text/javascript" src="./js/Blob.js/BlobBuilder.js"></script>
    <script type="text/javascript" src="./js/Deflate/deflate.js"></script>
    <script type="text/javascript" src="./js/Deflate/adler32cs.js"></script>

    <script type="text/javascript" src="./js/jspdf/jspdf.plugin.addimage.js"></script>
    <script type="text/javascript" src="./js/jspdf/jspdf.plugin.from_html.js"></script>
    <script type="text/javascript" src="./js/jspdf/jspdf.plugin.ie_below_9_shim.js"></script>
    <script type="text/javascript" src="./js/jspdf/jspdf.plugin.sillysvgrenderer.js"></script>
    <script type="text/javascript" src="./js/jspdf/jspdf.plugin.split_text_to_size.js"></script>
    <script type="text/javascript" src="./js/jspdf/jspdf.plugin.standard_fonts_metrics.js"></script>

    <script type="text/javascript" src="js/jquery/plugins/MPLTemplate.js"></script>
    <script type="text/javascript" src="js/sct/jquery.contextmenu.js"></script>
    <script type="text/javascript" src="js/sct/OpenLayers.js"></script>
    <script type="text/javascript" src="js/sct/MappirPdf.js"></script>
    <script type="text/javascript" src="js/sct/MappirMap.js"></script>
    <script type="text/javascript" src="js/sct/MappirInterface.js"></script>
    <script type="text/javascript" src="js/sct/validaciones.js"></script>
    
<!--     <script type="text/javascript" src="unificadoJS.js"></script> -->
    
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>

    <jsp:include page="twig/ruta.jsp"/>
    <jsp:include page="twig/direccion.jsp"/>
    <jsp:include page="twig/rutasMasBuscadas.jsp"/>
	
</head>

<body>
<!--precarga de imagenes-->
<img src="js/OpenLayers/img/cloud-popup-relative.png" class="ui-helper-hidden"/>
<img id="rutaDetalleIndicaciones2" src="images/indicaciones/2.png" class="ui-helper-hidden" />
<img id="rutaDetalleIndicaciones3" src="images/indicaciones/3.png" class="ui-helper-hidden" />
<img id="rutaDetalleIndicaciones4" src="images/indicaciones/4.png" class="ui-helper-hidden" />
<img id="rutaDetalleIndicaciones5" src="images/indicaciones/5.png" class="ui-helper-hidden" />
<img id="rutaDetalleIndicaciones6" src="images/indicaciones/6.png" class="ui-helper-hidden" />
<img id="rutaMapaPuntosFinales0" src="images/mapa-puntos/finales/0.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosFinales1" src="images/mapa-puntos/finales/1.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosFinales2" src="images/mapa-puntos/finales/2.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosFinales3" src="images/mapa-puntos/finales/3.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosFinales4" src="images/mapa-puntos/finales/4.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosFinales5" src="images/mapa-puntos/finales/5.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosFinales6" src="images/mapa-puntos/finales/6.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosIntermedios0" src="images/mapa-puntos/intermedios/0.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosIntermedios1" src="images/mapa-puntos/intermedios/1.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosIntermedios2" src="images/mapa-puntos/intermedios/2.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosIntermedios3" src="images/mapa-puntos/intermedios/3.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosIntermedios4" src="images/mapa-puntos/intermedios/4.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosIntermedios5" src="images/mapa-puntos/intermedios/5.png" class="ui-helper-hidden"/>
<img id="rutaMapaPuntosIntermedios6" src="images/mapa-puntos/intermedios/6.png" class="ui-helper-hidden"/>
<img id="imagenCasetas" src="images/layers/casetas.png" class="ui-helper-hidden"/>
<img id="imagenAlertas" src="images/mapa/advertencia.png" class="ui-helper-hidden"/>

<!--precarga de imagenes-->

<jsp:include page="modal/alerta.jsp" />
<jsp:include page="modal/enviarRutaPorCorreo.jsp" />
<jsp:include page="modal/contactoCorreo.jsp" />
<%-- <jsp:include page="modal/reportarIncidente.jsp" /> --%>
<jsp:include page="modal/telefonosEmergencia.jsp" />
<jsp:include page="modal/acercaDe.jsp" />
<jsp:include page="modal/cargando.jsp" />
<jsp:include page="modal/generandoPdf.jsp" />
<jsp:include page="modal/procesandoPeticion.jsp" />
<%-- <jsp:include page="modal/comoReportarIncidente.jsp" /> --%>

<div class="container" style="background: #fff;">
    <header>
        <div>
            <br/>
            <img src="images/logo.jpg" class="pull-left" id="logoMappir" onclick="location.reload();" style="cursor: pointer;" />
            <a href="http://sct.gob.mx/" target="_blank"><img src="images/SCT_small.jpg" class="pull-right" id="logoSct"/></a>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    </header>
</div>
<div class="container" style="min-width: 992px;max-width: 992px;width: 992px;max-height: 966px;min-height: 966px;height: 966px;overflow:cleared;">
<nav class="navbar navbar-default" role="navigation" style="margin: 10px; margin-bottom: 0px; padding: 0px;" id="barraDeLaCabecera">
    <div class="container-fluid">
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul id="Navigation" class="nav navbar-nav" style="width: 100%;">
<!--                 <li> -->
<!--                     <a href="javascript:void(null)" data-toggle="modal" data-target="#comoReportarIncidente"> -->
<!--                     	<img src="images/iconos/alerta.png" width="30px" -->
<!--                     		style="padding-right:10px;">Reportar Incidente</a> -->
<!--                 </li> -->
                <li class="dropdown" style="width: 21%;text-align: center;">
                    <a id="idRutasMasBuscadas" href="javascript:void(null)" class="dropdown-toggle" data-toggle="dropdown">
	                    <img src="images/iconos/populares.png" width="30px"
	                    	style="padding-right:10px;">Rutas Populares <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu" id="rutasMasBuscadas" style="z-index: 2000;text-align: left;"></ul>
                </li>
                <li class="dropdown" style="width: 22%;text-align: center;">
                    <a id="idRutasEnEquipo" href="javascript:void(null)" class="dropdown-toggle" data-toggle="dropdown">
                    	<img src="images/iconos/guardadas.png" width="30px"
                    		style="padding-right:10px;">Mis Rutas <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu" id="rutasEnEquipo" style="z-index: 2000;text-align: left;"></ul>
                </li>
                <li style="width: 27%;text-align: center;" >
                    <a href="javascript:void(null)" data-toggle="modal" data-target="#telefonsEmergencia">
                    	<img src="images/iconos/telefonos.png" width="30px"
                    		style="padding-right:10px;">Teléfonos de Emergencia</a>
                </li>
                <li style="width: 30%;text-align: center;">
                    <a href="http://www.aem.gob.mx/mibew/client.php?locale=es&style=silver" target="_blank">
                    	<img src="images/iconos/audifonos.png" width="30px"
                    		style="padding-right:10px;">Asistente en línea sobre rutas</a>
                </li>
            </ul>
        </div>
    </div>

</nav>

<div class="row">
    <div class="container" style="overflow:cleared;width: 100%;">
    <table id="configuradorDerutaYVehiculo" style="position: relative; width: 100%;background-color: #f8f9d8;" class="contenedor-rutas col-md-12">
    	<tr>
	    	<td style="width: 50%;">
		    	 <div style="width: 100%;">
	                <form style="width: 100%;">
	                    <div id="direcciones" style="width: 100%;margin-bottom: 5px;margin-top: 5px;"></div>
	                    <div class="text-right hidden"  style="width: 100%;">
	                        <input id="evitarCasetas" type="checkbox" value="1" /><label for="evitarCasetas" style=" color:#c4c490;">Sin peajes</label>
	                        <input id="evitarIncidentes" type="checkbox" value="1" /><label for="evitarIncidentes" style=" color:#c4c490;">Sin incidentes</label>
	                    </div>
	                </form>
					<div class="text-center" style="width: 100%; margin-bottom: 5px;margin-top: -10px;">
						<a class="btn btn-primary" id="buscarRuta"><i class="glyphicon glyphicon-search"></i><strong> Buscar Ruta</strong></a>
						<br />
					</div>
				</div>
	    	</td>
	    	<td style="width: 50%; vertical-align:text-top;">
                <div class="input-group input-group-sm col-md-12" style="margin-top: 5px;margin-bottom: 5px;">
                    <span class="input-group-addon" style="width: 120px;"><img src="images/iconos/vehiculo.png" width="30px" style="padding-right:10px;">Vehículo</span>
                    <%
                        List<Object[]> vehiculos = mx.gob.sct.mappir.helpers.CatalogosContenido.listaDeVehiculos();
                        String currentCategory = new String();
                        String divVehiculo = new String();
                        String vehiculosLista = "<li class=\"ui-helper-hidden\" id='vechiculoLista'><ul id='vechiculoList' tabindex='1' style='position:fixed !important;' onclick='getPosition();' class=\"sct-select-options\">";
                        for(Object[] record: vehiculos){
                            if(!currentCategory.equals(record[2].toString())){
                                if(!currentCategory.isEmpty()){
                                    vehiculosLista +="</ul></li>";
                                }
                                vehiculosLista +="<li class=\"sct-select-optgroup\">" + record[2] + "<ul>";
                                currentCategory = record[2].toString();
                            }
                            vehiculosLista += "<li class=\"sct-select-option\" data-value=\"" + record[0] + "\" data-categoria=\"" + record[1] + "\" data-rendimiento=\"" + record[4] + "\" " +
                                    " onclick=\"MappirInterface.auxiliarCombo($(this), $('#catalogoVehiculos'), $('#vechiculoLista')); \">"
                                    + record[3] + "</li>";
                            if(record[0].toString().equals("1")){
                                divVehiculo = "<div id=\"catalogoVehiculos\" tabindex=\"1\" onblur=\"MappirInterface.instance.hideCombo('#vechiculoLista');\" onclick=\"$('#btnVehiculos').click();event.preventDefault();\" data-value=\"" + record[0] + "\" data-categoria=\"" + record[1] + "\" data-rendimiento=\"" + record[4] + "\">" + record[3] + "</div>";
                            }
                        }

                        vehiculosLista += "</ul></li></ul></li></ul>";
                    %>
                    <ul class="sct-select">
                        <li id="totalVehiculos" class="sct-select-display" >
                            <div class="input-group input-group-sm" >
                                <% out.println(divVehiculo); %>
                                        <span class="input-group-btn no-collapse">
                                            <button id="btnVehiculos"
                                            	class="btn btn-default sct-select-button"
                                            	type="button" data-lista="#vechiculoLista"
                                            	onclick="getPosition();">
                                                <i class="caret"></i>
                                            </button>
                                        </span>
                            </div>
                        </li>
                            <% out.println(vehiculosLista); %>
                </div>
                 <!--start excedente -->
                <div class="input-group input-group-sm ui-helper-hidden col-md-12" style="margin-top: -5px;margin-bottom: 5px;" id="excedente" >
                    <span class="input-group-addon" style="width: 120px;"><img src="images/iconos/exedente.png" width="30px" style="padding-right:10px;">Ejes exced.</span>
                    <ul class="sct-select">
                        <li class="sct-select-display" onclick="getPosition();">
                            <div class="input-group input-group-sm" >
                                <div id="totalExcedente" data-value="0" tabindex="1" onblur="MappirInterface.instance.hideCombo('#excedenteLista');" onclick="$('#btnExcedenteLista').click();event.preventDefault();">Sin Ejes Excedentes</div>
                                            <span class="input-group-btn no-collapse">
                                                <button id="btnExcedenteLista"
                                                	class="btn btn-default sct-select-button"
                                                	type="button" data-lista="#excedenteLista"
                                                	onclick="getPosition();">
                                                    <i class="caret"></i>
                                                </button>
                                            </span>
                            </div>
                        </li>
                        <li class="ui-helper-hidden" id="excedenteLista">
                            <ul class="sct-select-options" id="excedenteList" style="position:fixed !important;" onclick="getPosition();" tabindex="1">
                                <li class="sct-select-option" data-value="0" onclick="MappirInterface.auxiliarCombo($(this), $('#totalExcedente'), $('#excedenteLista')); ">Sin Ejes Excedentes</li>
                                <li class="sct-select-option" data-value="1" onclick="MappirInterface.auxiliarCombo($(this), $('#totalExcedente'), $('#excedenteLista')); ">1</li>
                                <li class="sct-select-option" data-value="2" onclick="MappirInterface.auxiliarCombo($(this), $('#totalExcedente'), $('#excedenteLista')); ">2</li>
                                <li class="sct-select-option" data-value="3" onclick="MappirInterface.auxiliarCombo($(this), $('#totalExcedente'), $('#excedenteLista')); ">3</li>
                                <li class="sct-select-option" data-value="4" onclick="MappirInterface.auxiliarCombo($(this), $('#totalExcedente'), $('#excedenteLista')); ">4</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <!--end excedente -->
                <div class="input-group input-group-sm col-md-12" style="margin-top: -5px;margin-bottom: 5px;">
                    <span class="input-group-addon" style="width: 120px;">
                    	<img src="images/iconos/rendimiento.png" width="30px" style="padding-right:10px;">Rendimiento
                    </span>
                    <ul class="sct-select">
                        <li id="totalRend" class="sct-select-display">
                            <div class="input-group input-group-sm" >
                                <div id="rendimiento" onblur="MappirInterface.instance.hideCombo('#rendimientoLista');" tabindex="1" onclick="$('#btnRendimiento').click();event.preventDefault();"></div>
                                        <span class="input-group-btn no-collapse">
                                            <button id="btnRendimiento" 
                                            	class="btn btn-default sct-select-button"
                                            	type="button" data-lista="#rendimientoLista">
                                                <i class="caret"></i>
                                            </button>
                                        </span>
                            </div>
                        </li>
                        <li class="ui-helper-hidden" id="rendimientoLista"><ul id="rendimientoList" style="position:fixed !important;" onclick="getPosition();" class="sct-select-options" tabindex="1">
                            <%
                                for(int i = 1; i < 50; i++){
                                    out.println("<li class=\"sct-select-option\" data-value=\"" + i + "\"" +
                                            "onclick=\"MappirInterface.auxiliarCombo($(this), $('#rendimiento'), $('#rendimientoLista'));\" >" + i + " km/lt</li>");
                                }
                            %>
                        </ul>
                        </li>
                    </ul>
                </div>
                <div class="input-group input-group-sm col-md-12" style="margin-top: -5px;margin-bottom: 5px;">
                        <span class="input-group-addon" style="width: 120px;"><img src="images/iconos/gasolina.png" width="30px"
                                                                                   style="padding-right:10px;">Combustible</span>
                    <%
                        List<Object[]> combustibles = mx.gob.sct.mappir.helpers.CatalogosContenido.listaDeCombustibles();
                        String combustiblesList = new String();
                        String divCombustibles = new String();
                        for(Object[] record: combustibles){
                            if(divCombustibles.isEmpty()){
                                divCombustibles = "<div id=\"catalogoCombustibles\" tabindex=\"1\" onblur=\"MappirInterface.instance.hideCombo('#catalogoCombustiblesLista');\" onclick=\"$('#btnCombustible').click();event.preventDefault();\" data-value=\"" + record[0] + "\" data-costo=\"" + record[2] + "\" >" + record[1] + " "  + record[2] + " $/lt</div>";
                            }
                            combustiblesList += "<li class=\"sct-select-option\" data-value=\"" + record[0] + "\" data-costo=\"" + record[2] + "\" " +
                                    "onclick=\"MappirInterface.auxiliarCombo($(this), $('#catalogoCombustibles'), $('#catalogoCombustiblesLista'));\" >" + record[1] + " "  + record[2] + " $/lt</li>";
                        }
                    %>
                    <ul class="sct-select">
                        <li id="totalCombust" class="sct-select-display">
                            <div class="input-group input-group-sm" >
                                <% out.println(divCombustibles); %>
                                        <span class="input-group-btn no-collapse">
                                            <button id="btnCombustible"
                                            	class="btn btn-default sct-select-button"
                                            	type="button" data-lista="#catalogoCombustiblesLista">
                                                <i class="caret"></i>
                                            </button>
                                        </span>
                            </div>
                        </li>
                        <li class="ui-helper-hidden" id="catalogoCombustiblesLista"><ul id="combustibleList" tabindex='1' style="position:fixed !important;" onclick="getPosition();" class="sct-select-options" style="height:82px; overflow-y: hidden;">
                            <% out.println(combustiblesList); %>
                        </ul>
                        </li>
                    </ul>
                </div>
	    	</td>
    	</tr>
    </table>
	</div>
</div>
    

<div class="row" style="margin-top: 8px;">

    <div class="col-md-12 col-md-4 ui-helper-hidden panel-group" id="contenedorDeRutas">
        <div class="row" id="rutas">
            <div id="rutaUno"></div>
            <div id="rutaDos"></div>
        </div>
        <div style="text-align: left; margin-top: -20px;" id="compartir"> <div class="comparte-ruta">Comparte esta ruta</div>
            <a id="compartir-facebook"
               data-url="https://www.facebook.com/sharer/sharer.php?u="
               href=""
               target="_blank">
                <i class="compartir compartir-facebook"></i>
            </a>
            <a id="compartir-twitter"
               data-url="https://twitter.com/home?status="
               target="_blank">
                <i class="compartir compartir-twitter"></i>
            </a>
            <a href="javascript:void(null)" onclick="$('#enviarRutaPorCorreo').modal('show')">
                <i class="compartir compartir-correo"></i>
            </a>
        </div>
        <br />
    </div>
 
   	<div class="col-md-12 col-md-8" id="mapaContainer">
        <div id="mapa"></div>
        <div id="zoomAlert"></div>
        <div class="zoomText" id="zoomAlertContent">Para ver los puntos de interés, presionar Acercar.</div>
        <div id="divMenu" style="width: 215px;"> 
        	<a href="javascript:void(null)" onclick="menuActions()" >
	      	  <img id="OpenLayers_Control_MinimizeDiv_innerImage" class="olAlphaImg"
	      	  	src="js/OpenLayers/img/layer-switcher-minimize.png" style="position: relative;"
	      	  	title="Información">
	        </a>
        	<div id="menu"></div>
        </div>
        <canvas id="mapaCanvas" height="100px" width="100px" class="ui-helper-hidden" ></canvas>
    </div>

</div>
<br/>

<table style="width: 98%;background-color: #77b189; margin-top: -15px; z-index: 0; border-radius:10px; margin-left:10px; margin-right:10px;">
	<tr>
		<td style="width: 20%;">
    		<div class="col-md-3"><a href="javascript:void(null)" data-toggle="modal" data-target="#acercaDe"><img src="images/footer/acerca-de.png"></a></div>
		</td>
		<td style="width: 20%;">
			<div class="col-md-3"><a href="javascript:void(null)" data-toggle="modal" data-target="#contactoCorreo"><img src="images/footer/contacta.png"></a></div>
		</td>
		<td style="width: 20%;">
			<div class="col-md-3"><a href="<% out.print(Config.getVariable(Constantes.STORE_APPLE)); %>"><img src="images/footer/appstore.png"></a></div>
		</td>
		<td style="width: 20%;">
			<div class="col-md-3"><a href="<% out.print(Config.getVariable(Constantes.STORE_GOOGLE)); %>"><img src="images/footer/android.png"></a></div>
		</td>
		<td style="width: 20%;">
		        <div style="color:#FFFFFF;text-align: left;margin-top: 7px; margin-bottom:3px;">Siguenos en:</div>
		        <a href="<% out.print(Config.getVariable(Constantes.SEGUIR_FACEBOOK)); %>" target="_blank"><img src="images/footer/fb.png"></a>
		        <a href="<% out.print(Config.getVariable(Constantes.SEGUIR_TWITTER)); %>" target="_blank"><img src="images/footer/tw.png"></a>
		        <a href="<% out.print(Config.getVariable(Constantes.SEGUIR_GOOGLE)); %>" target="_blank"><img src="images/footer/google.png"></a>
		</td>
	</tr>
</table>

</div>
<script type="text/javascript" src="js/bootstrap/bootstrap.js"></script>
<!-- Análiticos -->
<script type="text/javascript">
  var _paq = _paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u=(("https:" == document.location.protocol) ? "https" : "http") + "://207.248.168.150/pwk/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', 4]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
    g.defer=true; g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<noscript><p><img src="http:// 207.248.168.150/pwk/piwik.php?idsite=4" style="border:0;" alt="" /></p></noscript>
<!-- Análiticos -->
 
</body>
</html>