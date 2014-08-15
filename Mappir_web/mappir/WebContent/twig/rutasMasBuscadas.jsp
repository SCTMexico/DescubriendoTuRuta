<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<script type="text/html" id="templateRutaMasBuscadas">
    <li><a href="javascript:void(null)"
           data-config="{{config}}"
           onclick="MappirInterface.asignarDirecciones(this)"><strong>De</strong> {{origen.desc}}
        <strong>A</strong> {{destinos[destinos.length - 1].desc}}</a></li>
</script>