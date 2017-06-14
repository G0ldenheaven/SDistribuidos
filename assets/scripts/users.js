function subform(id){
    var picurl = $("#usersForm"+id).find('input[name="picurl"]').val();

    var firstName = $("#usersForm"+id).find('input[name="firstName"]').val();

    var lastName = $("#usersForm"+id).find('input[name="lastName"]').val();

    var email = $("#usersForm"+id).find('input[name="email"]').val();

    var username = $("#usersForm"+id).find('input[name="usernm"]').val();

    var password = $("#usersForm"+id).find('input[name="pass"]').val();
    
    var admin = $("#usersForm"+id).find('input[name="admin"]').val();

    // Se o butao save for carregado, o jquery usara o ajax para enviar um request do tipo put para /users/:id
    // Desta forma iremos obter os dados a actualizar em app.js na função app.put('/users/:id') e os seus
    // valores estarão accessiveis atraves do req.body
    $.ajax({
        url: '/users/'+id,
        data: {
        'profile':{
            'username':username,
            'firstName':firstName,
            'lastName':lastName,
            'email':email,
            'password':password,
            'picurl': picurl,
            'admin': admin
        }},                         // valores que irão para o body -> req.body.profile tera o objecto
                                    // com os valores a actualizar.
                                    
        type: 'PUT',                // Tipo de request a enviar
        cache:false,                // Não guarda em cache os valores para aumentar a performance
        
        // Caso ocorra algum erro iremos executar a função abaixo e obter um log do erro na consola.
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
}

function delform(id){
    // Se o butao save for carregado, o jquery usara o ajax para enviar um request do tipo put para /users
    // Desta forma iremos obter os dados a actualizar em app.js na função app.delete('/users') e  id
    // valores estarão accessiveis atraves do req.body
    $.ajax({
        url: '/users/'+id,
        type: 'DELETE',             // Tipo de request a enviar
        cache:false,                // Não guarda em cache os valores para aumentar a performance
        
        // Caso ocorra algum erro iremos executar a função abaixo e obter um log do erro na consola.
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
}

// Obtem o input do tipo reset e altera o seu evento on click
function rstform(id){
      
    // Obter o elemento que mostra a mensagem que confirma se as passwords sao iguais ou não
    var mensagem = document.getElementById('confirmMessage'+id);
    
    // Obter o elemento que tem o valor da confirmação da password
    var confirmPass = document.getElementById('confirmPass'+id);
    
    // Faz reset a cor do input Confirm Password
    confirmPass.style.backgroundColor = "";
    
    // Faz esconde a mensagem de erro
    mensagem.style.display = 'none';
    
    // Executa a função reset do formulario de perfil para limpar os campos por nos
    $("#usersForm"+id)[0].reset();
};

// Função para verificar se a password é igual a pass de confirmação
function verificaPass(id)
{
    // Obter o elemento que tem o valor da password
    var pass = document.getElementById('pass'+id);
    
    // Obter o elemento que tem o valor da confirmação da password
    var confirmPass = document.getElementById('confirmPass'+id);
    
    // Obter o elemento que ira mostrar a mensagem
    var mensagem = document.getElementById('confirmMessage'+id);
    
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
            mensagem.innerHTML = "Passwords não são iguais! &emsp; Verifique onde se enganou..."
        }
    }
}