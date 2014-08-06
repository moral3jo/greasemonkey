// ==UserScript==
// @name       Imputacion Produce
// @namespace  http://produce-sa.insags.com/
// @version    1.0
// @description  imputacion en produce
// @include		http://produce-sa.insags.com/*
// @copyright  2014+, Roberto Moralejo
// ==/UserScript==


//TODO: Borrar un favorito

var miDiv;
unsafeWindow.myVar = "myVar";
var dialog;

/**
 * FUNCIONES GENERALES
 */
if (window.jQuery) {  
    console.log('jQuery ya cargado');
} else {
   	console.log('jQuery no cargado. Cargando');
    cargarJQuery();
}

function cargarJQuery() {
  var callback = main;
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function cargarUI() {
  var script = document.createElement("script");
  script.setAttribute("src", "http://produce-sa.insags.com/xplanner/jquery-ui-1.8.20.custom.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}




unsafeWindow.cargarJQueryTMP = function() {
	var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
	GM_JQ = document.createElement('script');
	GM_JQ.src = 'http://produce-sa.insags.com/xplanner/jquery-1.7.2.min.js';
	GM_JQ.type = 'text/javascript';
	GM_JQ.async = true;
	GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
}

unsafeWindow.get = function(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

unsafeWindow.addcss = function(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


/*
 * MENU
 */
unsafeWindow.montarMenu = function(){
    generarDiv();
    rellenarDiv();
    lanzarFechas();
}

function lanzarFechas(){
//  	$(function() {
//    	$( "#datepicker" ).datepicker();
//  	});
	$("#datepicker").datepicker({
        showButtonPanel: true,
        firstDay: 1,
		onSelect: function(dateText, inst) { 
			//var dateAsString = dateText;
			var dateAsObject = $(this).datepicker( 'getDate' );
           	ponerFecha(dateAsObject);
       }
    });
}

function ponerFecha(dateAsObject){
    $("#fechaFija").val($.datepicker.formatDate('dd-mm-yy', dateAsObject));
}

function generarDiv(){
	miDiv = document.createElement ('div');
	document.body.appendChild(miDiv);
    miDiv.id="miDiv";
    miDiv.style.position = "fixed";
	miDiv.style.top = "140px";
	miDiv.style.right = "10px";
	miDiv.style.width = "220px";
    miDiv.align="center";
}

function rellenarDiv(){
    
    var txt="";
    txt += '<div style="width: 100%; border: 1px solid #CCC; background: #EEE; text-align: center padding: 5px 0" id="informe">'
    txt += '<b>Config</b><br>';
    txt += '<hr style="margin: 5px">';
    txt += 'Horas:';
    txt += '<div class="hora" onclick="horasConfig(1);">1</div> <div class="hora" onclick="horasConfig(2);">2</div> <div class="hora" onclick="horasConfig(3);">3</div> <div class="hora" onclick="horasConfig(4);">4</div> <div class="hora" onclick="horasConfig(5);">5</div> <div class="hora" onclick="horasConfig(6);">6</div> <div class="hora" onclick="horasConfig(7);">7</div> <div class="hora" onclick="horasConfig(8);">8</div><br>';
    txt += '<input type="hidden" id="horasFijas" value="7" style="width: 20px;">';
    txt += '<br><br>';
    
    txt += 'Dias<br>';
    txt += '<div id="datepicker"></div>';
    var hoy = "";
    if($!==undefined){
    	if($.datepicker!==undefined){
     	  	hoy = $.datepicker.formatDate('dd-mm-yy', new Date());
    	}
    }
    txt += '<input type="hidden" id="fechaFija" value="'+hoy+'" style="width: 100px;">';
    txt += '<br><br><br><br>';
    
    txt += '<b>Favoritos</b> ';
    txt += '<a onclick="vaciarFavoritos();"><img width="10" height="10" alt="Recargar" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwEBAQkBAQgKCgELDRYPDQwMDRsUFRAWIB0cIiAdHx8kKDQsJBoxJx8fLT0tMTU3Li4uIys/RD84QzQ5OjcBCgoKDQENGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzcsNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIABAAEAMBEQACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAADBAcA/8QAJBAAAQMCBgIDAAAAAAAAAAAAAQIIIQUGAxExQYGRB2ESE1H/xAAYAQACAwAAAAAAAAAAAAAAAAABAgADBf/EACMRAAECBQQDAQAAAAAAAAAAAAIBBAADEaHwBgcxkRJBsSH/2gAMAwEAAhEDEQA/AKhWap5xbT5xRdNxoC27LHxASO52Xr6I5yoMy08VfUarVrJ3pkqIrQ8tesL0mpuQdY5o3ZZQ+pteFCwRGkDPdZg/gHGYAy1MVU4h3LaRsQ38S/TXOvvzVqkuedO5pNoXQsYbWUAKC0kcjLfEMyYA6MMC1KVF4iNXbfYxupClZi51dVgVFpDvmoPAVatmLTitDxAVLWsjTYZDTEESII6ACWemDonEM6dtt923kSUmJnV0W/8A/9k=" /></a> ';
    txt += '<a onclick="recargarMenu();"><img width="10" height="10" alt="Recargar" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwEBAQkIAQgKCgkLDRYPDQwMDRsUFRAWIB0iFiAdHx8kKDQsJCYxGx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKAQwBGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc0NP/AABEIAA8ADwMBEQACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAADBQYC/8QAJhAAAQIEBgEFAAAAAAAAAAAAAQIDBAUIEQAGCRIhMQcYMkFRcf/EABgBAAIDAAAAAAAAAAAAAAAAAAMFAgQG/8QAIREAAgEDBAMBAAAAAAAAAAAAAQMHAAIxBhETIQRBYRL/2gAMAwEAAhEDEQA/AGuZX68fOtQ049Ez0z2QzhSWoeLcJBB2EpSD8qB4HWNCgQyqM1hwG93wUpaZSZIt3ETsPtU0tnNUHhnVwiZF56dERDRilvQqj20LFYT+bQRb7GFtydE3wEG2dEdGrgbqG2WeO7B7FCm0ir8pkqniJppyht8Rdy6y4Uggk7j7iARfnu/eCr8iInRmFP6/OCKHemQ160LFd75FbytlysHMdXysxahy0Ji0pKGWGyDa423NuOjawwPyPIjwR9wpx7NTUrV51bytzX//2Q==" /></a> ';
	txt += '<br><hr style="margin: 5px">';
    
    txt += '<div style="text-align: left;margin: 5px;">';
    var listadoFavoritos = recuperarFavoritos();
    if(listadoFavoritos===null){
    	txt += 'Sin datos<br>';
    	//txt += '<a href="#" onclick="abrirPagina(1968357);">Prueba</a><br>';
        //txt += '<a href="#" onclick="abrirPagina(1773479);">Vacaciones - 3Q Julio - Septiembre</a><br>';
    }else{
        jQ(listadoFavoritos).each(function(i, val) {
            txt += '<a href="#" onclick="abrirPagina('+val.oid+');">'+val.nombre+'</a><br>';
        });
    }
    txt += '<br><br><br><br>';
    txt += '</div>';
    
    
    txt += '</div>';
    txt += '</div>';
    miDiv.innerHTML = txt;
    
    addcss('.hora { display: inline ! important; border: 1px solid #A9D0F5; background: #A9D0F5; border-radius: 5px; padding: 0px 4px; cursor: pointer; }');
    
}

unsafeWindow.horasConfig = function(horaConfig){
    jQ("#horasFijas").val(horaConfig);
    jQ(".hora").css("background","#A9D0F5");
    jQ(jQ(".hora")[horaConfig-1]).css("background","#7070ff");
}


unsafeWindow.abrirPagina = function(oid) {
    //console.log(jQuery());
 	var page = "http://produce-sa.insags.com/xplanner/do/edit/time?fkey=&returnto=%2Fdo%2FcerrarPopup&noMenu&liteHoras&oid="+oid;
    page +=  '&rapidodia='+jQ('#fechaFija').val();
    page +=  '&rapidohora='+jQ('#horasFijas').val();
	myVar = jQuery('<div></div>')
               .html('<iframe style="border: 0px; " src="' + page + '" width="100%" height="100%"></iframe>')
               .dialog({
                   autoOpen: false,
                   modal: true,
                   height: 260,
                   width: 660,
                   title: "IMPUTACION",
                   close: refrescarCalendario
               });
	myVar.dialog('open');
}

unsafeWindow.ponerBotonFavoritos = function(){
    var boton = '<a href="#"><img width="16" height="16" alt="Agregar a favoritos" onclick="anadirFavorito(1);" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwEHBgkIBwEBCgkLARYPDQwBDQ8UCRAWIBEWIiAdHxMkKDQgJCYxJx8TLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzQrNzc3Nzc3Nzc0LP/AABEIABAAEAMBEQACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAADBgL/xAAoEAABAgUCBAcAAAAAAAAAAAABAgMEBQYHEgARExQhIggXMTJBcbH/xAAYAQACAwAAAAAAAAAAAAAAAAACBAABA//EACQRAAEDAwMEAwAAAAAAAAAAAAIAAQMEESESQYGxwdHwI1Fh/9oADAMBAAIRAxEAPwC9ms1t1P0S4K8PlQmCTdjjuG/xhTDOI5d0J3bzKj3KbIBH5pCWqAma3ZKnIx2xjhPT82pyWQzUudsrXiGz4jnENOUSqGMKlLkWrhgJC8wNlNj29PrRRVIWYfCuORhbTb263MpLYeEXDclbu+iUivSHU0nzbjQRwnBth1Ttlh6DS9ZSAwfGO/6+z7KHEI2dm6ppJJ7KuJRERNCXlMSm7i3E+YiopLYAeUUdhOPQYfGtqWmDQxk2efvGEUcQ21O2V//Z"></a>';
	var filas = jQ("#objecttable tbody").find("tr.even, tr.odd");
    filas.each(function() {
        var primeraCelda = jQ(this).find("td")[0];
        var url = jQ(jQ(primeraCelda).find("a")[0]).attr("href");
        var oid = (new RegExp('[?&]'+encodeURIComponent("oid")+'=([^&]*)')).exec(url);
        var boton2 = jQ(boton).find('img').attr('onclick','anadirFavorito('+oid[1]+')')
        jQ(primeraCelda).append(boton2);
    });
    //var primera = jQ(filas[0]).find("td")[0];
    //jQ(primera).append(boton);
}

unsafeWindow.anadirFavorito = function(oid){
    var arrayFavoritos = recuperarFavoritos();
    if(arrayFavoritos===null){
        arrayFavoritos = [];
    }
    var elemento = new Object();
    elemento.oid = oid;
    var nombre = prompt("Descripción:");
    if(nombre!==""){
        elemento.nombre = nombre;
    	arrayFavoritos.push(elemento);
    	guardarFavoritos(arrayFavoritos);
    }
}

unsafeWindow.recargarMenu = function(){
    jQ("#miDiv").remove();
    montarMenu();
}

/**
 * GESTIÓN LOCALSTORAGE
 */

unsafeWindow.guardarFavoritos = function(favoritos){
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

unsafeWindow.recuperarFavoritos = function(){
    return JSON.parse(localStorage.getItem('favoritos'));
}

unsafeWindow.vaciarFavoritos = function(){
    localStorage.setItem('favoritos', null);
	recargarMenu();
}




/*
 * IMPUTACION RAPIDA
 */

unsafeWindow.ponerBotones = function(){
	var filasTabla = $('table.objecttable tr');
	var botones = filasTabla.last();
	var mitd = $(botones).find("td")
    var imputarHoy = '<input class="bot_imput button" type="button" value="Hoy" onclick="javascript: imputarHoy()">&nbsp; ';
	$(mitd).append(imputarHoy);
}

unsafeWindow.imputarHoy = function() {
    var filasTabla = $('table.objecttable tr');
    var ultimaImputacion = filasTabla[filasTabla.length-2];
    var camposFila = $(ultimaImputacion).find("input");
    imputaDia(ultimaImputacion, 0, 7);
}

unsafeWindow.imputaDia = function(fila, dateimp, horasimp) {
    //debugger;
    var camposFila = $(fila).find("input");
    if(dateimp!==null){
        $(camposFila[0]).val(dateimp);
    }
    if(horasimp!==null)
    	$(camposFila[1]).val(horasimp);
}

unsafeWindow.horasLite = function(){
    jQ(".page_header").hide();
    jQ(".title").hide();
    jQ("select").css("width","100px");
    jQ('[name ^="descrip"]').css("width","100px");
    var filasTabla = $('table.objecttable tr');
    if(filasTabla.length>3){
		for (i = 1; i <= filasTabla.length-3; i++) { 
			$(filasTabla[i]).hide();
		}
    }
}

unsafeWindow.cargarDia = function(){
    var desfasedia = get("rapidodia");
    var filasTabla = $('table.objecttable tr');
    var ultimaImputacion = filasTabla[filasTabla.length-2];
    imputaDia(ultimaImputacion, desfasedia, null);
}

unsafeWindow.cargarHora = function(){
    var hora = get("rapidohora");
    var filasTabla = $('table.objecttable tr');
    var ultimaImputacion = filasTabla[filasTabla.length-2];
    imputaDia(ultimaImputacion, null, hora);
}

unsafeWindow.cuentaAtras = function(){
	console.log('guardar hora-click');
	jQ("#btnsubmit").click();
}

unsafeWindow.cerrarPopup = function(){
	myVar.dialog("close");
}


unsafeWindow.refrescarCalendario = function(){
    $('#calendar').fullCalendar( 'refetchEvents' );
    $("#loading").hide();
    $("#loading2").hide();
}




function main() {
    jQ("#loading").hide();
    jQ("#loading2").hide();
	
    if(location.href.match(/do\/cerrarPopup/)!==null){
        window.parent.cerrarPopup();
    }else if(location.href.match(/listadouserstory/)!==null){
        ponerBotonFavoritos();
    }else{
        if(location.href.match(/noMenu/)===null){
    		montarMenu();
        	console.log('Menu montado');
		}
        
    }
    
    if(location.href.match(/liteHoras/)!==null){
        //imputando horas en version lite
        ponerBotones();
        horasLite();
        if(location.href.match(/rapidodia/)!==null){
            cargarDia();
        }
        if(location.href.match(/rapidohora/)!==null){
            cargarHora();
            console.log('guardar hora');
            jQ("#btnsubmit").attr("onclick","");
            setTimeout(function(){cuentaAtras();},300);
            
        }
    }
    
    if(location.href.match(/cerrPopup/)!==null){
        //estamos en popup, cerrar al terminar o cerrarlo directamente - pdte pruebas
    }
}
