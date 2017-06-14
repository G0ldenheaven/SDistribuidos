var picurl = "";
var firstName = "";
var lastName = "";
var email = "";
var username = "";
var password = "";

/*********************************************************************************************/
/*************************     Valores do Formulario a actualizar     ************************/
/*********************************************************************************************/
// Se os valores de um destes inputs mudarem vamos alterar o valor da variavel correspondente
// para enviar apenas os dados que foram alterados no formulario.

$("input[name='picurl']").on('change paste keyup',function(){
    // Vai guardar em picurl o valor da string introduzida no input picurl que esta a frente da
    // label Enter Url: 
    picurl = $("#userprof").find('input[name="picurl"]').val();
    $("#procpic").attr("src",picurl);
});

$("input[name='firstName']").on('change keyup',function(){
    // Vai guardar em firstName o valor da string introduzida no input firstName
    firstName = $("#userprof").find('input[name="firstName"]').val();
});

$("input[name='lastName']").on('change paste keyup',function(){
    // Vai guardar em lastName o valor da string introduzida no input lastName
    lastName = $("#userprof").find('input[name="lastName"]').val();
});

$("input[name='email']").on('change keyup',function(){
    // Vai guardar em email o valor da string introduzida no input email
    email = $("#userprof").find('input[name="email"]').val();
});

$("input[name='usernm']").on('change keyup',function(){
    // Vai guardar em username o valor da string introduzida no input usernm
    username = $("#userprof").find('input[name="usernm"]').val();
});

$("input[name='pass']").on('change keyup',function(){
    // Vai guardar em password o valor da string introduzida no input pass
    password = $("#userprof").find('input[name="pass"]').val();
});
/*********************************************************************************************/
/****************************     Fim dos Valores a actualizar     ***************************/
/*********************************************************************************************/
    
// Obtem o formulario de perfil atraves do seu id (userprof) com jquery
$("#userprof").submit(function(event) {
            
    // Impede o form de executar a função submit
    event.preventDefault();
    
    var id = $("#userprof").find('input[type="hidden"]').val();
    
    // Se um dos campos for alterado usamos o ajax para enviar um request do tipo put para /profile
    // Desta forma iremos obter os dados a actualizar em app.js na função app.put('/profile') e os seus
    // valores estarão accessiveis atraves do req.body
    $.ajax({
        url: '/profile/'+id,
        data: {
        'profile':{
            'username':username,
            'firstName':firstName,
            'lastName':lastName,
            'email':email,
            'password':password,
            'picurl': picurl
        }},                         // valores que irão para o body -> req.body.profile tera o objecto
                                    // com os valores a actualizar.
                                    
        type: 'PUT',                // Tipo de request a enviar
        cache:false,                // Não guarda em cache os valores para aumentar a performance
        
        // Caso ocorra algum erro iremos executar a função abaixo e obter um log do erro na consola.
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        },
    });
});

function delform(id){
    // Se o butao save for carregado, o jquery usara o ajax para enviar um request do tipo delete para /profile/:id
    // Desta forma iremos obter os dados a actualizar em app.js na função app.delete('/profile/:id') e  id
    // valores estarão accessiveis atraves do req.body
    $.ajax({
        url: '/profile/'+id,
        type: 'DELETE',             // Tipo de request a enviar
        cache:false,                // Não guarda em cache os valores para aumentar a performance
        
        // Caso ocorra algum erro iremos executar a função abaixo e obter um log do erro na consola.
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
}

// Obtem o input do tipo reset e altera o seu evento on click
$("input[type='reset']").on("click",function(event) {
    
    // Impede o form de executar a função reset
    event.preventDefault();
    
    // Obter o elemento que mostra a mensagem que confirma se as passwords sao iguais ou não
    var mensagem = document.getElementById('confirmMessage');
    
    // Obter o elemento que tem o valor da confirmação da password
    var confirmPass = document.getElementById('confirmPass');
    
    // Faz reset a cor do input Confirm Password
    confirmPass.style.backgroundColor = "";
    
    // Faz esconde a mensagem de erro
    mensagem.style.display = 'none';
    
    // Executa a função reset do formulario de perfil para limpar os campos por nos
    $("#userprof")[0].reset();
});

// Função para verificar se a password é igual a pass de confirmação
function verificaPass()
{
    // Obter o elemento que tem o valor da password
    var pass = document.getElementById('pass');
    
    // Obter o elemento que tem o valor da confirmação da password
    var confirmPass = document.getElementById('confirmPass');
    
    // Obter o elemento que ira mostrar a mensagem
    var mensagem = document.getElementById('confirmMessage');
    
    var verde = "#66cc66";
    var vermelho = "#ff6666";
    
    // Compara os valores das passwords quando temos algo escrito nas duas caixas de texto
    if(pass.value.length>0 && confirmPass.value.length>0){
        if(pass.value == confirmPass.value){
        
            // Muda a cor do input confirmPass para verde.
            confirmPass.style.backgroundColor = verde;
            
            // Mostra a mensagem
            mensagem.style.display = 'block';
            
            // com a cor verde
            mensagem.style.color = verde;
            
            // e mensagem a indicar que as passwords sao iguais.
            mensagem.innerHTML = "Passwords são iguais."
            
        }else{
            
            // Muda a cor do input confirmPass para vermelho.
            confirmPass.style.backgroundColor = vermelho;
            
            // Mostra a mensagem
            mensagem.style.display = 'block';
            
            // com a cor verde
            mensagem.style.color = vermelho;
            
            // e mensagem a indicar que as passwords não são iguais.
            mensagem.innerHTML = "Passwords não são iguais! <br/> Verifique onde se enganou..."
        }
    }
}