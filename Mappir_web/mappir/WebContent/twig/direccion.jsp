<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<script type="text/html" id="templateDireccion" data-value="" data-detalle="">
    <div class="row">
        <div class="input-group input-group-sm" style="width: 98%;">
            <span class="input-group-addon" style="width: 80px; cursor:move; padding: 2px;"></span>
            <input type="text"
				   onkeypress="return validateText(event)"
				   onblur="validateTextBlur(this)"
                   name="direccion[]"
                   autocomplete="off"
                   placeholder="Ciudad, delegación, lugar"
                   class="form-control catcomplete clearable"
                   value="{{desc}}"
                   data-id-categoria="{{idCategoria}}"
                   data-desc="{{desc}}"
                   data-id-tramo="{{idTramo}}" 
                   data-source="{{source}}"
                   data-target="{{target}}"
                   data-x="{{x}}"
                   data-y="{{y}}"/>
				<span onclick="MappirInterface.instance.limpiarCombos(this)" class="clear-block">x</span>
                <span class="input-group-btn no-collapse">
                    <button class="btn btn-default tooltip-info sct-helper-quitar" data-placement="left"
							title="Eliminar en la búsqueda de ruta"
                            onclick="MappirInterface.quitarDireccion(this);getMapMenuPosition();getPositionAlertZoom(false);" type="button">
                        <i class="glyphicon glyphicon-remove"></i>
                    </button>
                    <button class="btn btn-primary tooltip-info sort-handler sct-helper-intercambiar" data-placement="right"
                            title="Intercambiar origen y destino"
                            onclick="MappirInterface.moverDireccion(this);getMapMenuPosition();getPositionAlertZoom(false);" type="button">
                        <i class="glyphicon glyphicon-bold glyphicon-sort"></i>
                    </button>
					<button class="btn btn-default tooltip-info sct-helper-add" data-placement="bottom"
                            title="Agregar destino"
                            onclick="MappirInterface.addDireccion(this);getMapMenuPosition();getPositionAlertZoom(false);" type="button">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </span>
        </div>
    </div>
</script>