    var header = function(){
        return "<!DOCTYPE html>"+
                '<html>'+

                    '<head>'+
                        '<meta charset="UTF-8">'+
                        '<title>Futebol - Pplware</title>'+
                        "<script type='text/javascript' src='scripts/jquery.min.js'></script>"+
                        "<script type='text/javascript' src='scripts/bootstrap.min.js'></script>"+
                        "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'/>"+
                    '</head>';
    };

    var getMenu = function(){
        return '<body style="width:100%">'+
                    '<nav class="navbar navbar-inverse" role="navigation" style="padding-right:130px;">'+
                        '<ul class="nav navbar-nav">'+
                            '<li class="active">'+
                                '<a href="/">Home<span class="sr-only">(current)</span></a>'+
                            '</li>'+
                            '<li>'+
                                '<a href="/login">Login</a>'+
                            '</li>'+
                            '<li>'+
                                '<a href="/contact">Contact us</a>'+
                            '</li>'+
                        '</ul>'+
                    '</nav>';
    };

    function getMainPageContent(res,Futebol){
        var html ="";
        var cursor = Futebol.find({}).cursor();

        cursor.on('data', function(jogo){
            html+='<div>'+
                    '<img style="height:100px" src="data:image/jpeg;base64,'+ jogo.equipaCasa.toString('base64') +'"/>'+
                    '<span>'+jogo.nome+
                    '<img style="height:100px" src="data:image/jpeg;base64,'+ jogo.equipaCasa.toString('base64') +'"/>'+
                    '<br/>'+
                    jogo.golosCasa.toString()+' : '+jogo.golosFora.toString()+
                    '</span>'+
                '</div>';
        });

        cursor.on('close',function(){
            html = '<center style="width:100%"'+
                    '<div>'+
                        '<b style="font-size:30px">Resultados dos Jogos Disputados Hoje'+
                        '<br/>'+
                        '<br/>'+
                        html+
                        '</b>'+
                    '</div>'+
                '</center>';
            res.write(html);  
            res.end(endPage);
        });

        
    };

    var endPage = function(){
        return '</body>'+
        '</html>';
    }

var exports = module.exports = {header,getMenu,getMainPageContent,endPage};