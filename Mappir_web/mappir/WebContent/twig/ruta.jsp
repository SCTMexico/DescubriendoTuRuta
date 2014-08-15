<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="mx.gob.sct.mappir.util.Config"%>
<script type="text/html" id="templateRuta" data-class="" data-titulo=""
	data-tiempo="" data-distancia="" data-costo="" data-id="">
    <div>
        <div class="panel panel-{{class}}">
            <div class="panel-heading titulo-ruta">{{titulo}}
                <div class="row">
                    <div class="col-xs-10 descripcion-ruta" style="padding-left:0px;">{{descripcion}}</div>
                    <div class="col-xs-2 descripcion-ruta" style="padding-left:0px;">
                        <a href="javascript:void(null)" onclick="MappirInterface.renderPdf('{{id}}')"
							class="pull-right ui-helper-hidden" id="capaDeRuta{{id}}Exportar">
								<img src="images/pdf.png">
						</a>
                    </div>
                </div>
            </div>

            <div class="panel-body text-center contenedor-detalles">
                <div class="row">

                    <div class="pull-left small valor"><span class="decimal"><strong>Tiempo</strong></span><br><span class="verde"><strong>{{tiempo}}</strong></span></div>
                    <div class="pull-left separador"></div>

                    <div class="pull-left small valor"><span class="decimal">Distancia</span><br><span class="verde">{{distancia}}</span></div>
                    <div class="pull-left separador"></div>

                    <div class="pull-left small valor" style="min-width:60px;"><span class="decimal"><strong>Casetas</strong></span><br><span
                            class="verde"><strong>{{costoCasetas}}</strong></span><br><span class="decimal">mxn</span></div>
                    <div class="pull-left separador"></div>

                    <div class="pull-left small valor" style="min-width:60px;"><span class="decimal">Combustible</span><br><span class="verde">{{costoGasolina}}</span><br><span
                            class="decimal">mxn</span></div>
                    <br>

                    <div class="pull-left small valor"
                         style="width:42%; text-align:left; margin-top: 10px; margin-left:10px; font-size:1.3em !important;">Costo total:<br/><span
                            class="verde">{{costo}} mxn</span></span>
                    </div>

                    <div class="row text-left pull-left" style="margin-top:10px; width:53%; margin-bottom:5px;text-align:left;">
                        <div class="small resumen">Costos aproximados para:<br> {{tipoVehiculo}}</div>
                        <div class="small resumen">Rendimiento: {{rendimiento}}</div>
                        <div class="small resumen">
                            {% if numeroCasetas > 0 %}
                            Casetas: {{numeroCasetas}}
                            {% else %}
                            Sin peajes
                            {% endif %}&nbsp;&nbsp;&nbsp;
                            {% if numeroAlertas > 0 %}
                            Incidentes: {{numeroAlertas}}
                            {% else %}
                            Sin incidentes
                            {% endif %}
                        </div>
                    </div>

                    <div class="pull-left boton-detalles" style="background-color:{{color}};">
                        <a class="btn-link rutaCapaDetalleBoton" id="botonCapaDeRuta{{id}}" data-capa-id="capaDeRuta{{id}}"
                           style="color: #FFF; width: 100%; padding: 9px; cursor:pointer">
                            <i class="glyphicon glyphicon-plus-sign"></i> Detalles</a>
                    </div>

                </div>
            </div>
            <div class="panel-footer small no-gutter" style="overflow-x: hidden;">

                <div id="capaDeRuta{{id}}Detalle" class="list-group ui-helper-hidden show-print"
                     style="height: 213px; overflow-y: scroll; overflow-x: visible; padding: 0px; margin: 0px;">
                    {% for detalle in detalles %}
                    <div class="row small" style="padding: 0px; margin: 0px;">

                        <div class="col-xs-2 text-center indicadores">
                            {% if detalle.indicacionId > 1 %}
                            <img src="images/indicaciones/{{detalle.indicacionId}}.png" width="40">
                            {% else %}
                            {% if detalle.indicacionId == 1 %}
                            <img src="images/mapa-puntos/finales/{{ultimoTramoIntermedio}}.png" width="40">
                            {% else %}
                            <img src="images/mapa-puntos/intermedios/0.png" width="40">
                            {% endif %}
                            {% endif %}
                        </div>
                        <div class="col-xs-10" style="padding-top:5px; padding-bottom:5px;">
                            <div class="row">
                                <div class="col-xs-12">{{detalle.consecutivo}} ) {{detalle.indicacion}}</div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">{{detalle.descripcion}}<br>
                                    {{detalle.estado}}, {{detalle.municipio}}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-6 detalle-resumen">{{detalle.distancia}}</div>
                                <div class="col-xs-4 detalle-resumen">{{detalle.tiempo}}</div>
                                <div class="col-xs-2 ">
                                    <button class="btn btn-primary btn-sm rutaDetalleFilaBoton"
                                            type="button"
                                            data-min-x="{{detalle.caja.minX}}"
                                            data-min-y="{{detalle.caja.minY}}"
                                            data-max-x="{{detalle.caja.maxX}}"
                                            data-max-y="{{detalle.caja.maxY}}"
                                            data-capa="{{detalle.capa}}"
                                            data-tramo="{{detalle.tramo}}"><i class="glyphicon glyphicon-arrow-right"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        {% for caseta in detalle.casetas %}
                        <div style="vertical-align: bottom; background-color:#e8e8e8; padding-top: 4px;" class="row">
                            <div style="padding-left: 14px;" class="col-xs-6">
                                <div class="icono-caseta"></div>
                                <span class="titulo-caseta" style="line-height: 24px; vertical-align: bottom;">{{caseta.titulo}}</span><br>
                            </div>
                            <div class="col-xs-5 detalle-resumen">{{caseta.costo}}</div>
                            <span class="col-xs-12 small">{% if caseta.acepta %}
                                Acepta: {{caseta.acepta}}.
                                {% else %}
                                Acepta: Sin información.
                                {% endif %}</span>
                        </div>
                        {% endfor %}
                    </div>
                    <div class="row" style="background-color:#e8e8e8;">
                        {% for alerta in detalle.alertas %}
                        <div class="row" style="line-height: 24px; vertical-align: bottom;">
                            <div class="col-xs-12"
                                 style="padding-left: 30px; background: url('images/mapa/advertencia.png'); background-size: 24px 24px; background-repeat: no-repeat; background-position: 5px">
                                {{alerta.descripcion}}
                            </div>
                        </div>
                        {% endfor %}
                    </div>

                    <div class="separador-h"></div>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</script>