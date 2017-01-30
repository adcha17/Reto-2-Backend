var config = {
	apiKey: "AIzaSyBXK9HrXsUbWUkQrIdHIGs6ZUPcrZZ_MsM",
	authDomain: "core-upgrade-5d3e2.firebaseapp.com",
	databaseURL: "https://core-upgrade-5d3e2.firebaseio.com",
	storageBucket: "core-upgrade-5d3e2.appspot.com",
	messagingSenderId: "344233321206"
};
firebase.initializeApp(config);

var led = document.getElementById('led'),
els = led.childNodes,
uid=0, size=15, w=0, h=0, row=0, col=0,
arr_lights=[];

var hh = document.getElementById('time-hh'),
hx = document.getElementById('time-h'),
mm = document.getElementById('time-mm'),
mx = document.getElementById('time-m'),
ss = document.getElementById('time-ss'),
sx = document.getElementById('time-s');

for(var k=0, len=els.length; k<len; k++){
	if(els[k].nodeType!=1)
		continue;
	w = parseInt(els[k].clientWidth);
	h = parseInt(els[k].clientHeight);
	row   = parseInt(h/size);
	col = parseInt(w/size);

	var t, l, sum=0;
	for(var i=0; i<row; i++){
		for(var j=0; j<col; j++){
			uid++;
			t = size*i;
			l = size*j;
			arr_lights.push( '<div uid="'+uid+'" id="l-'+uid+'" class="light row-'+i+' col-'+j+'" style="top:'+t+'px;left:'+l+'px"></div>');
		}
	}
	els[k].innerHTML = arr_lights.join("");
	arr_lights=[];
}

setInterval(function(){
	var now = new Date(),
	time_hh = parseInt(now.getHours()),
	time_mm = parseInt(now.getMinutes()),
	time_ss = parseInt(now.getSeconds());
	hh.className = "block-digital num-"+parseInt(time_hh/10);
	hx.className = "block-digital num-"+parseInt(time_hh%10);
	mm.className = "block-digital num-"+parseInt(time_mm/10);
	mx.className = "block-digital num-"+parseInt(time_mm%10);
	ss.className = "block-digital num-"+parseInt(time_ss/10);
	sx.className = "block-digital num-"+parseInt(time_ss%10);

}, 1000);

function getHour() {
	return hh.className.slice(-1)+hx.className.slice(-1);
};
function getMinute() {
	return mm.className.slice(-1)+mx.className.slice(-1);
};
function getSecond() {
	return ss.className.slice(-1)+sx.className.slice(-1);
};
function getMessage(hour, minute) {
	
	if (hour < 9) {
		var text_msg = 'Has madrugado, te mereces un premio';
		var html_msg = '<div class="alert alert-success" role="alert">'+text_msg+'</div>';
		$('.template').html(html_msg);
	}else if(hour == 9 && minute >= 0 && minute <= 15){
		var text_msg = 'Llegaste a la hora';
		var html_msg = '<div class="alert alert-info" role="alert">'+text_msg+'</div>';
		$('.template').html(html_msg);
	}else {
		var text_msg = 'Has llegado tarde';
		var html_msg = '<div class="alert alert-danger" role="alert">'+text_msg+'</div>';
		$('.template').html(html_msg);
	}		
	
	return text_msg;
};
function defineMarcaId(){
    $('#marca-id').val(parseInt(Math.random()*10000000));
}
function obtenerMarcaId(){
    return $('#marca-id').val();
}
var usuarioId = sessionStorage.getItem('id');
function storeMessage(hour, minute, second, message) {
	var marcaId = obtenerMarcaId();

	firebase.database().ref('reto/assistance/'+marcaId).set({
		id: marcaId,
		idUsuario: usuarioId,
		entrada: {hora: "09", minuto: "00"},
		llegada: {hora: hour, minuto:minute, segundo: second},
		mensaje: message
	});
		
}


$(document).ready(function() {

	if (sessionStorage.username && sessionStorage.password && sessionStorage.username && sessionStorage.email && sessionStorage.id) {
		
		console.log(sessionStorage);
		
	}else{
		alert("Por favor logueate");
		location.href = "../";
	}

	
	$('#btn-marcar').on('click', function(event) {
		defineMarcaId();
		var hour = getHour();
		var minute = getMinute();
		var second = getSecond();
		var message = getMessage(hour, minute);
		
		sessionStorage.message = message;
		
		storeMessage(hour,minute,second,message);
		event.preventDefault();

	});

	$('.cerrar-sesion').on('click', function(event) {
		sessionStorage.clear()
		
	});
});