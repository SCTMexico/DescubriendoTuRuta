// inicio de mauricio
var __body = null;

function adjustModalMaxHeightAndPosition() {
	__body.css({
		overflow : "hidden",
		height : "100%"
	});
	$('.modal').each(function() {
		var me = $(this);
		if (me.hasClass('in') == false) {
			me.show(); // Need this to get modal dimensions
		}
		;
		var modalContent = me.find('.modal-content');
		var modalBody = me.find('.modal-body');
		var height = modalContent.height();
		var contentHeight = __body.height();
		if (contentHeight < (height + 80)) {
			modalBody.height(contentHeight - 100);
			modalBody.css('overflow-y', 'sroll');
			var height = modalContent.height();
		} else {
			modalBody.height('auto');
			modalBody.css('overflow-y', 'auto');
		}

		var top = ((contentHeight - height) / 2) - 40;

		me.css({
			"padding-top" : top + 'px'
		});

		if ($(this).hasClass('in') == false) {
			$(this).hide(); // Hide modal
		}
		;
	});
	__body.css({
		overflow : "auto",
		height : "100%"
	});
};

$(function() {

	__body = $('body');

	$(window).on('resize', adjustModalMaxHeightAndPosition);

	adjustModalMaxHeightAndPosition();

	$('.sct-select-button').on('click', MappirInterface.auxiliarAbrirCombo).on(
			'keydown', MappirInterface.auxiliarTeclaCombo).on('blur',
			MappirInterface.auxiliarCerrarCombo);

	var interface = new MappirInterface("mapa");

});
// fin de acomodo de mauricio

// funciones para las validaciones de los textos de busqueda
function validateForm() {
	var textosBusqueda = document.getElementsByName("direccion[]");
	var camposLlenos = 0;
	for (var x = textosBusqueda.length - 1; x >= 0; x--) {
		if (!isEmpty(textosBusqueda[x]) && validateTextBlur(textosBusqueda[x])) {
			camposLlenos++;
		}
	}
	if (camposLlenos == textosBusqueda.length) {
		// indica que todos los campos mostrados tiene algun valor
		return true;
	} else {
		// indica que no todos estan llenos
		if (textosBusqueda.length == 2) {
			// indica que solo se muestra el origen y un destino
			message("Debes seleccionar al menos un origen y un destino.");
		} else {
			message("Debes seleccionar una ubicación para el origen y para cada punto intermedio.");
		}
	}
	return false;
}

/* valida que un campo de texto contenga informacion */
function isEmpty(field) {
	var fieldData = field.value;
	if (fieldData == undefined || fieldData == null || fieldData == ""
			|| fieldData.length == 0) {
		return true;
	}
	return false;
}

/* Validacion del contenido que se va escribiendo en la caja de texto */
function validateText(evt) {
	var keyTecla = evt.keyCode || evt.which;
	if (keyTecla == 13) {// Enter
		// Se deja pasar porque las textAreas no funcionan bien
		return true;
	}
	var teclaTmp = String.fromCharCode(keyTecla);
	if (validaCaracter(teclaTmp)) {
		return true;
	}
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	return false;
}

/* Valida el contenido del texto cuando este pierde el foco */
function validateTextBlur(field) {
	for (var i = 0; i < field.value.length; i++) {
		if (!validaCaracter(field.value[i])) {
			field.value = '';
			// field.focus();
			return false;
		}
	}
	return true;
}

function validateTexto(texto) {
	for (var i = 0; i < texto.length; i++) {
		if (!validaCaracter(texto[i])) {
			return false;
		}
	}
	return true;
}

function validaCaracter(caracter) {
	tecla_especial = false;
	for ( var i=0; i<caracteresEspeciales.length; i++) {
		if (caracter.charCodeAt(0) == caracteresEspeciales[i]) {
			tecla_especial = true;
			break;
		}
	}
	if (letrasValidas.indexOf(caracter) == -1 && !tecla_especial) {
		return false;
	}
	return true;
}

var letrasValidas = "/#@,.-_:()[] 0123456789áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
var caracteresEspeciales = [09, 10, 11, 13, 32, 38, 40, 8629];

$(window).scroll(function() {
	getPosition();
	getMapMenuPosition();
	getPositionAlertZoom(false);
});

$(window).on('resize', function() {
	setTimeout(function() {
		try {
			getPosition();
			getMapMenuPosition();
			getPositionAlertZoom(false);
		} catch (e) {
		}
	}, 10);
});
$(window).on('ready', function() {
	setTimeout(function() {
		try {
			getPosition();
			getMapMenuPosition();
			getPositionAlertZoom(false);
		} catch (e) {
		}
	}, 150);
	$('#zoomAlert').hide();
	$('#zoomAlertContent').hide();
	//bind de combos de configuración de vehiculos
	$("#catalogoVehiculos").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("combo",e);});
	$("#totalExcedente").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("combo",e);});
	$("#rendimiento").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("combo",e);});
	$("#catalogoCombustibles").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("combo",e);});
	$("#btnVehiculos").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("boton",e);});
	$("#btnExcedenteLista").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("boton",e);});
	$("#btnRendimiento").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("boton",e);});
	$("#btnCombustible").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("boton",e);});
	
	// Funcionalidad del combo de Vehículo
	$("#vechiculoList").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("ul",e);});
	$("#vechiculoList").bind('focus', function(){
		if (clearing) {
	        clearTimeout(clearing);
	        clearing = null;
	    }
	});
	$("#vechiculoList").bind('blur', function(e) {
		if (clearing) {
			clearTimeout(clearing);
			clearing = null;
		}
		clearing = setTimeout(function() {
			$this = jQuery(e.target);
			$parent = jQuery($this[0].parentNode);
			$parent.hide();
		}, 200);
	});
	
	// Funcionalidad del combo de Ejes excedentes
	$("#excedenteList").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("ul",e);});
	$("#excedenteList").bind('focus', function(){
		if (clearing) {
	        clearTimeout(clearing);
	        clearing = null;
	    }
	});
	$("#excedenteList").bind('blur', function(e) {
		if (clearing) {
			clearTimeout(clearing);
			clearing = null;
		}
		clearing = setTimeout(function() {
			$this = jQuery(e.target);
			$parent = jQuery($this[0].parentNode);
			$parent.hide();
		}, 200);
	});
	
	// Funcionalidad del combo de rendimiento
	$("#rendimientoList").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("ul",e);});
	$("#rendimientoList").bind('focus', function(){
		if (clearing) {
	        clearTimeout(clearing);
	        clearing = null;
	    }
	});
	$("#rendimientoList").bind('blur', function(e) {
		if (clearing) {
			clearTimeout(clearing);
			clearing = null;
		}
		clearing = setTimeout(function() {
			$this = jQuery(e.target);
			$parent = jQuery($this[0].parentNode);
			$parent.hide();
		}, 200);
	});
	
	// Funcionalidad del combo de Combustible
	$("#combustibleList").bind('keydown', function(e){MappirInterface.instance.configComboKeyDown("ul",e);});
	$("#combustibleList").bind('focus', function(){
		if (clearing) {
	        clearTimeout(clearing);
	        clearing = null;
	    }
	});
	$("#combustibleList").bind('blur', function(e) {
		if (clearing) {
			clearTimeout(clearing);
			clearing = null;
		}
		clearing = setTimeout(function() {
			$this = jQuery(e.target);
			$parent = jQuery($this[0].parentNode);
			$parent.hide();
		}, 200);
	});
});

// Funcion utilizada para el correcto posicionamiento de los combos
function getPosition() {
	var scrollBodyTop = $('body').scrollTop();
	var scrollBodyLeft = $('body').scrollLeft();

	// Para los vehiculos
	var divVehic = $("#totalVehiculos").offset();
	var divVehicHeight = $("#totalVehiculos").height();
	if (divVehic !== undefined) {
		$('#vechiculoList').css("left", divVehic["left"] - scrollBodyLeft);
	}
	if (divVehic !== undefined) {
		$('#vechiculoList').css("top",
				(divVehic["top"] - scrollBodyTop + divVehicHeight));
	}

	// Para los ejes excedentes
	var divExced = $("#totalExcedente").offset();
	var divExcedHeight = $("#totalExcedente").height();
	if (divExced !== undefined) {
		$('#excedenteList').css("left", divExced["left"] - scrollBodyLeft);
	}
	if (divExced !== undefined) {
		$('#excedenteList').css("top",
				(divExced["top"] - scrollBodyTop + divExcedHeight));
	}

	// Para el rendimiento
	var divExced = $("#totalRend").offset();
	var divExcedHeight = $("#totalRend").height();
	if (divExced !== undefined) {
		$('#rendimientoList').css("left", divExced["left"] - scrollBodyLeft);
	}
	if (divExced !== undefined) {
		$('#rendimientoList').css("top",
				(divExced["top"] - scrollBodyTop + divExcedHeight));
	}

	// Para Combustible
	var divExced = $("#totalCombust").offset();
	var divExcedHeight = $("#totalCombust").height();
	if (divExced !== undefined) {
		$('#combustibleList').css("left", divExced["left"] - scrollBodyLeft);
	}
	if (divExced !== undefined) {
		$('#combustibleList').css("top",
				(divExced["top"] - scrollBodyTop + divExcedHeight));
	}
}

// validaciones y acomodo del menu de marcadores
var collapsed = false;
$(function() {
	$("#menu").hide();
});
function menuActions() {
	if (!collapsed) {
		$("#menu").show();
		collapsed = true;
	} else {
		$("#menu").hide();
		collapsed = false;
	}
	getMapMenuPosition();
}

function getMapMenuPosition() {
	var scrollBodyTop = $('body').scrollTop();
	var scrollBodyLeft = $('body').scrollLeft();

	var divMapWidth = $("#mapa").width();
	var divMenuWidth = $("#divMenu").width();
	var divMap = $("#mapa").offset();
	if (divMap !== undefined) {
		$('#divMenu').css("top", (divMap["top"] - scrollBodyTop));
		$('#divMenu').css("left",
				(divMap["left"] + divMapWidth - divMenuWidth) - scrollBodyLeft);
	}
}

function getPositionAlertZoom(isPantallaCompleta) {
	if (isPantallaCompleta == false) {
		$('#zoomAlert').css("position","absolute");
		$('#zoomAlertContent').css("position","absolute");
		var divMapWidth = $("#mapa").width();
		var divZoomAlertWidth = $("#zoomAlert").width();
		var divMap = $("#mapa").offset();
		if (divMap !== undefined) {
			$('#zoomAlert').css("top", (divMap["top"] - $("#zoomAlert").height()));
			$('#zoomAlert').css("left",
					(divMapWidth - divZoomAlertWidth ) / 2);
			$('#zoomAlertContent').css("top",(divMap["top"] - $("#zoomAlert").height()));
			$('#zoomAlertContent').css("left",
					(divMapWidth - divZoomAlertWidth ) / 2);
		}
	} else {
		// para la pantalla completa
		$('#zoomAlert').css("position","fixed");
		$('#zoomAlertContent').css("position","fixed");
		$('#zoomAlert').css("top", ($(window).height() / 2) - ($('#zoomAlert').outerHeight() / 2));
		$('#zoomAlert').css("left", ($(window).width() / 2) - ($('#zoomAlert').outerWidth() / 2));
		$('#zoomAlertContent').css("top", ($(window).height() / 2) - ($('#zoomAlertContent').outerHeight() / 2));
		$('#zoomAlertContent').css("left", ($(window).width() / 2) - ($('#zoomAlertContent').outerWidth() / 2));
	}	
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(
			/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	return pattern.test(emailAddress);
}

function formato_numero(numero, decimales, separador_decimal, separador_miles){ // v2007-08-06
    numero=parseFloat(numero);
    if(isNaN(numero)){
        return "";
    }

    if(decimales!==undefined){
        // Redondeamos
        numero=numero.toFixed(decimales);
    }

    // Convertimos el punto en separador_decimal
    numero=numero.toString().replace(".", separador_decimal!==undefined ? separador_decimal : ",");

    if(separador_miles){
        // Añadimos los separadores de miles
        var miles=new RegExp("(-?[0-9]+)([0-9]{3})");
        while(miles.test(numero)) {
            numero=numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }

    return numero;
}
