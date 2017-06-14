function subform(id){
    var imgcasa = $("#jogosForm"+id).find('input[name="imgcasa"]').val();

    var imgfora = $("#jogosForm"+id).find('input[name="imgfora"]').val();

    var njogo = $("#jogosForm"+id).find('input[name="njogo"]').val();

    var gcasa = $("#jogosForm"+id).find('input[name="gcasa"]').val();

    var gfora = $("#jogosForm"+id).find('input[name="gfora"]').val();

    //var data = $("#jogosForm"+id).find('input[name="pass"]').val(); a adicionar no futuro
  
    // Se o butao save for carregado, o jquery usara o ajax para enviar um request do tipo put para /games/:id
    // Desta forma iremos obter os dados a actualizar em app.js na função app.put('/games/:id') e os seus
    // valores estarão accessiveis atraves do req.body
    $.ajax({
        url: '/games/'+id,
        data: {
        'game':{
            'equipaCasa':imgcasa,
            'equipaFora':imgfora,
            'nome':njogo,
            'golosCasa':gcasa,
            'golosFora':gfora,
            'data': ''
        }},                         // valores que irão para o body -> req.body.game tera o objecto
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
    // Se o butao save for carregado, o jquery usara o ajax para enviar um request do tipo put para /games/:id
    // Desta forma iremos obter os dados a actualizar em app.js na função app.delete('/games/:id') e  id
    // valores estarão accessiveis atraves do req.body
    $.ajax({
        url: '/games/'+id,
        type: 'DELETE',             // Tipo de request a enviar
        cache:false,                // Não guarda em cache os valores para aumentar a performance
        
        // Caso ocorra algum erro iremos executar a função abaixo e obter um log do erro na consola.
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
}