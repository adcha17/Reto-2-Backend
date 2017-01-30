var config = {
	apiKey: "AIzaSyBXK9HrXsUbWUkQrIdHIGs6ZUPcrZZ_MsM",
	authDomain: "core-upgrade-5d3e2.firebaseapp.com",
	databaseURL: "https://core-upgrade-5d3e2.firebaseio.com",
	storageBucket: "core-upgrade-5d3e2.appspot.com",
	messagingSenderId: "344233321206"
};
firebase.initializeApp(config);

var database=firebase.database();
var idAutoIncrement = 0;

function defineMensajeId(){
    //NOTA: Note que si se generaba de esta forma el id, al ser guardado en orden en firebase, usando childSnapshot
    //traia la data en el orden guardado y se perdia la logica de la conversacion cuando se recarga la pagina.
    //por eso opte por hacerlo de esta forma.
    ++idAutoIncrement;
    $('#messageId').val(idAutoIncrement);
}
function obtenerMensajeId(){
    return $('#messageId').val();
}
function actualizarChat(datos) {

    var emisor;
    if (datos.idUsuario!=sessionStorage.id) {       
        emisor = 'chat-message-recipient';        
    }else{        
        emisor = 'chat-message-sender';       
    }
    addText(datos.texto,datos.username,emisor);
}

function addText(text,name,emisor) {

    var $template=$('.template').clone();

    $template.children('div')
    .children('img')
    .attr('src','img/avatar.jpg');
    $template.children('div')
    .children('div').children('.chat-message-content').append('<p>'+text+'</p');
    $template.children('div')
    .children('div').children('.chat-details').append(name);
    $template.children('div').addClass(emisor);
    $('.chat-wrapper>.chat-message').append($template.html());
}
function addAdminMessage() {
    var $template=$('.template').clone();

    $template.children('div')
    .children('img')
    .attr('src','img/avatar.jpg');
    $template.children('div')
    .children('div').children('.chat-message-content').append('<p>'+sessionStorage.username+', '+sessionStorage.message+'</p');
    $template.children('div')
    .children('div').children('.chat-details').append("Administrador");
    $template.children('div').addClass('chat-message-recipient');
    $('.chat-wrapper>.chat-message').append($template.html());
}
function enviarATodos(datos){
	
    database.ref('reto/messages/'+datos.id).set(datos);
    datos= new Object();
    //console.log("Tu mensaje fue enviado a todos los que estan conectados");
}
//var datos = new Object();
    $('#message').on('keypress',function(evt){
        var datos = new Object();

        if(evt.which==13){
            
            
            defineMensajeId();
            datos['id'] = obtenerMensajeId();
            datos['idUsuario'] = sessionStorage.id;
            datos['username'] = sessionStorage.username;
            datos['texto'] = $(this).val();

            enviarATodos(datos);
            $(this).val("");
            evt.preventDefault();
            
        }
    });

$(document).ready(function() {

    if (sessionStorage.username && sessionStorage.password && sessionStorage.username && sessionStorage.email && sessionStorage.id) {
        
        console.log(sessionStorage);
        
    }else{
        alert("Por favor logueate");
        location.href = "../";
    }
	
	database.ref('reto/messages/').on('child_added', function(childSnapshot) {
        //console.log(childSnapshot.val());
        idAutoIncrement = childSnapshot.val().id;        
        actualizarChat(childSnapshot.val());       

    });
    if (sessionStorage.message) {
        addAdminMessage();
    }

    $('.cerrar-sesion').on('click', function(event) {
        sessionStorage.clear()
        
    });
    
});
