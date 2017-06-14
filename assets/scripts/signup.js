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