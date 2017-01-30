function existsLogin(worker){
    var worker = worker;

    var emailArray =new Array();
    var passwordArray = new Array();
    var dataArray = new Array();
    database.ref('reto/users/').once('value',
        function(snapshot){
        	//console.log(snapshot.val());
            snapshot.forEach(
                function(currentValue){
                    dataArray.push(currentValue.val());
                    emailArray.push(currentValue.val().email);
                    passwordArray.push(currentValue.val().password);
                }
                );
            
            index = emailArray.indexOf(worker.email);
            //var dataSession = JSON.stringify(dataArray[index]);
            var dataSession = dataArray[index];
            
            //var lol = Object.entries(dataSession);

            if(index>-1){
                if(passwordArray[index]===worker.password){
                                            
                        sessionStorage.id = dataSession.id;
                        sessionStorage.username = dataSession.username;
                        sessionStorage.password = dataSession.password;
                        sessionStorage.email = dataSession.email;
                        sessionStorage.img = dataSession.img;
                        sessionStorage.question = dataSession.question;
                        sessionStorage.answer = dataSession.answer;
                                        
                    location.href = "assistance/assistance.html";
                    console.log("Te has logueado con exito");
                }
                else{
                    alert("Contraseña Incorrecta");
                }
            }
            else{
                alert("Correo inexistente");
            }
        }
        );

}
function defineRegisterId(){
    $('#register-id').val(parseInt(Math.random()*10000000));
}
function obtenerRegisterId(){
    return $('#register-id').val();
}

function existsEmail(worker){

    var worker=worker;
    
    var emailArray = new Array();
    database.ref('reto/users/').once('value',
        function(snapshot) {
        	//console.log(snapshot.val());
            snapshot.forEach(
                function(currentValue){
                    emailArray.push(currentValue.val().email)
                }
                );
            if( emailArray.indexOf(worker.email)>-1) {
                alert("Este email esta en uso, por favor seleccione otro");
            }
            else{
                
                registerWorker(worker);
                alert("Registro Satisfactorio");
                $("#login-form").delay(100).fadeIn(100);
                $("#register-form").fadeOut(100);
                $('#register-form-link').removeClass('active');
                $("#forgot-form").fadeOut(100);
                $('#forgot-form-link').removeClass('active');
                $('#login-form-link').addClass('active');
            
            }
        }
        );
}
function existsEmailForgot(worker){

    var worker=worker;    
    var emailArray = new Array();
    var questionArray = new Array();
    var answerArray = new Array();
    var passwordArray = new Array();
    database.ref('reto/users/').once('value',
        function(snapshot) {
            //console.log(snapshot.val());
            snapshot.forEach(
                function(currentValue){
                    emailArray.push(currentValue.val().email);
                    questionArray.push(currentValue.val().question);
                    answerArray.push(currentValue.val().answer);
                    passwordArray.push(currentValue.val().password);
                }
                );
            
            index = emailArray.indexOf(worker.email);
            
            if(index>-1) {
               
                if(questionArray[index]!==worker.question){
                    
                    alert("Pregunta Incorrecta");
                    return false;
                }
                if(answerArray[index]!==worker.answer){
                    
                    alert("Respuesta Incorrecta");
                    return false;
                }
                alert("Tu contraseña es: "+passwordArray[index]);
                $("#login-form").delay(100).fadeIn(100);
                $("#register-form").fadeOut(100);
                $('#register-form-link').removeClass('active');
                $("#forgot-form").fadeOut(100);
                $('#forgot-form-link').removeClass('active');
                $('#login-form-link').addClass('active');
            }
            else{
                alert("Correo Inexistente");
            }
            
        }
        );
}

function registerWorker(worker){
    
    database.ref('reto/users/'+worker.id).set(worker);
}

var config = {
	apiKey: "AIzaSyBXK9HrXsUbWUkQrIdHIGs6ZUPcrZZ_MsM",
	authDomain: "core-upgrade-5d3e2.firebaseapp.com",
	databaseURL: "https://core-upgrade-5d3e2.firebaseio.com",
	storageBucket: "core-upgrade-5d3e2.appspot.com",
	messagingSenderId: "344233321206"
};
firebase.initializeApp(config);

var database = firebase.database();
var storage = firebase.storage();

$(document).ready(function() {


	$('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$("#forgot-form").fadeOut(100);
		$('#forgot-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$("#forgot-form").fadeOut(100);
		$('#forgot-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#forgot-form-link').click(function(e) {
		$("#forgot-form").delay(100).fadeIn(100);
		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#forgot-password').click(function(e) {
		$("#forgot-form").delay(100).fadeIn(100);
		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$('#forgot-form-link').addClass('active');
		e.preventDefault();
	});
    //var url=new Array();
    var url=new Array();
    $('#img').on('change',
        function(e){
            var file = e.target.files[0];

            var metadata = {
                'contentType' : file.type
            }
            var uploadTask = storage.ref().child(obtenerRegisterId()+'reto/img/'+file.name).put(file,metadata);
            uploadTask.on('state_changed',null,
                function(error){
                    console.log(error);
                },
                function(){
                    //url.push(uploadTask.snapshot.metadata.downloadURLs[0])
                    url = uploadTask.snapshot.metadata.downloadURLs[0];
                });
        }
        );
	//boton login
	$("#login-form").submit(function(e){
		worker = new Object();
        $('#login-form').serializeArray().forEach(
            function(currentValue,index){
                worker[currentValue.name]=currentValue.value;
            }
            );
        existsLogin(worker);
        e.preventDefault();
    });
	//boton registro
	$('#register-form').submit(function(e){
        defineRegisterId();
        worker = new Object();

        if ($('#password').val()!=$('#confirm-password').val()) {
            alert("contraseña incorrecta");
            return false;
        }

        $('#register-form').serializeArray().forEach(
            function(currentValue,index){
                worker[currentValue.name]=currentValue.value;
            }
            );
        worker['img'] = url;

        existsEmail(worker);
        e.preventDefault();
    });
    //boton forgot
    $('#forgot-form').submit(function(e){
    	worker = new Object();
        $('#forgot-form').serializeArray().forEach(
            function(currentValue,index){
                worker[currentValue.name]=currentValue.value;
            }
            );
        existsEmailForgot(worker);
    	e.preventDefault();
    });

//fin jquery
});
