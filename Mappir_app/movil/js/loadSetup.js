var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //this is just a boolean to separate the movile version from the app version.
        if(!isApp){
            this.onDeviceReady();
        }
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        //mostrar splash atravez de pluggin
        /*
        if(navigator.splashscreen){
            try{
                navigator.splashscreen.show();
            }catch (e){debugger;}
        }
        */
        //ocultar splashscreen atravez de pluggin
        /*
        if(navigator.splashscreen){
            try{
                navigator.splashscreen.hide();
            }catch (e){debugger;}
        }
        */
        try{
            document.addEventListener("backbutton", handleBackButton, false);
        }catch (ex){debugger;}
        $.mobile.navigate('#loadpage');
        //Add menus
        appendMenu('routepageMenu');
        appendMenu('detailpageMenu');
        appendMenu('vehiclepageMenu');
        appendMenu('reportpageMenu');
        appendMenu('savedRoutespageMenu');
        appendMenu('phonepageMenu');
        appendMenu('aboutpageMenu');
        appendMenu('contactpageMenu');
        progressBar('20%');
        if(isApp){
            var connectionOnline = phonegapConnection.initialize();
            //skip connection Validation
            //var connectionOnline = 1;
        }else{
            var connectionOnline = 1;
        }
        //touchScroll("contentDetails");
        //touchScroll("contentDetailsMap");

        if(connectionOnline==null){
            try{
                navigator.notification.alert(
                    'No se pudo realizar la operación de detección de red, Esta aplicación requiere conexión a internet para poder funcionar.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert("No se pudo realizar la operación de detección de red, Esta aplicación requiere conexión a internet para poder funcionar.");
            }
            exitApp();
        }else if (!connectionOnline){
            try{
                navigator.notification.alert(
                    'No se detecto conexión a internet, Esta aplicación requiere conexión a internet para poder funcionar.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert("No se detecto conexión a internet, Esta aplicación requiere conexión a internet para poder funcionar.");
            }
            exitApp();
        }else{
            if(!isApp){
                //Apends html location for web app
                var head=document.getElementsByTagName('head')[0];
                var script=document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', 'js/geoLocationWeb/geo.js');
                head.appendChild(script);

                var script2   = document.createElement("script");
                script2.type  = "text/javascript";
                script2.text  = 'var _paq = _paq || [];_paq.push([\'trackPageView\']);_paq.push([\'enableLinkTracking\']);(function() {var u=(("https:" == document.location.protocol) ? "https" : "http") + "://207.248.168.150/pwk/";_paq.push([\'setTrackerUrl\', u+\'piwik.php\']);_paq.push([\'setSiteId\', 4]);var d=document, g=d.createElement(\'script\'), s=d.getElementsByTagName(\'script\')[0]; g.type=\'text/javascript\';g.defer=true; g.async=true; g.src=u+\'piwik.js\'; s.parentNode.insertBefore(g,s);})();';
                document.body.appendChild(script2);


                var noscript   = document.createElement("noscript");
                noscript.text  = '<p><img src="http://207.248.168.150/pwk/piwik.php?idsite=4" style="border:0;" alt="" /></p>'
                document.body.appendChild(noscript);
            }
            progressBar('30%');
            if (jqxhr) {
                jqxhr.abort();
                jqxhr=null;
            }
            jqxhr = $.get('res/config.json',{}, function(config){
                configArray = config;
                // Apend local onConfigReady JS
                var head=document.getElementsByTagName('head')[0];
                var script=document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', 'js/onConfigReady.js');
                head.appendChild(script);

                //setTimeout(function(){$.mobile.navigate('#routepage');},500);
            },'json')
                .fail(function() {
                    try{
                        navigator.notification.alert(
                            'Ocurrió un error al descargar el archivo de configuración, por lo que el aplicativo no funcionará correctamente.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert("Ocurrió un error al descargar el archivo de configuración, por lo que el aplicativo no funcionará correctamente.");
                    }
                    exitApp();
                });
        }
    }
};
var phonegapConnection ={
    initialize: function() {
        if (navigator.network)
        {
            var networkState = navigator.network.connection.type;
        }else if(navigator.connection){
            var networkState = navigator.connection.type;
        }else{
            return null;
        }
        var states = {};
        states["unknown"]  = true;
        states["ethernet"] = true;
        states["wifi"]     = true;
        states["2g"]       = true;
        states["3g"]       = true;
        states["4g"]       = true;
        states["cellular"] = true;
        states["none"]     = false;

        return(states[networkState]);
    }
};
var exitApp = function() {
    if(navigator.app){
        navigator.app.exitApp();
    }else if(navigator.device){
        navigator.device.exitApp();
    }else{
        try{
            navigator.notification.alert(
                'No se pudo cerrar automaticamente la app.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("No se pudo cerrar automaticamente la app.");
        }
    }
};