   var json;   

   var header = function(){
        return "<!DOCTYPE html>"+
                '<html>'+

                    '<head>'+
                        '<meta charset="UTF-8">'+
                        '<title>Futebol - Pplware</title>'+
                        "<script type='text/javascript' src='scripts/jquery.min.js'></script>"+
                        "<script type='text/javascript' src='scripts/bootstrap.min.js'></script>"+
                        "<link rel='stylesheet' href='https://netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css'>"+
                        "<link rel='stylesheet' href='https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css'>"+
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

    function getMainPageContent(req,res,pug,Futebol){
        var html ="";
        var cursor = Futebol.find({}).cursor();
        var i = 0;
        json = "{ \"jogos\": [";
        
        cursor.on('data', function(jogo){
            json+= "{ \"equipaCasa\": \""+jogo.equipaCasa.toString('base64')+"\","+
                    "\"nome\": \""+jogo.nome+"\","+
                    "\"equipaFora\": \""+jogo.equipaFora.toString('base64')+"\","+
                    "\"golosCasa\": \""+jogo.golosCasa+"\","+
                    "\"golosFora\": \""+jogo.golosFora+"\"},";
            /*html+='<div>'+
                    '<img style="height:100px" src="'+ jogo.equipaCasa.toString('base64') +'"/>'+
                    '<span>'+jogo.nome+
                    '<img style="height:100px" src="'+ jogo.equipaFora.toString('base64') +'"/>'+
                    '<br/>'+
                    jogo.golosCasa.toString()+' : '+jogo.golosFora.toString()+
                    '</span>'+
                '</div>';*/
        });

        cursor.on('close',function(){
            jogos = JSON.parse(json.substr(0,json.length-1)+"]}");
            var curuser = req.session.user;
            req.session.jogos=jogos;
            
            if(curuser){
                user = JSON.parse("{ \"user\": [{\"id\": \""+curuser.myid+"\","+
                "\"username\": \""+curuser.username+"\","+
                "\"pwd\": \""+curuser.pwd+"\"}]}");
            
                res.end(pug.renderFile('scripts/index.pug',{data:jogos,users:user}));
            }else{
                res.end(pug.renderFile('scripts/index.pug',{data:jogos,users:''}));
            }
        });
        
    };

    var endPage = function(){
        return '</body>'+
        '</html>';
    }

var exports = module.exports = {header,getMenu,getMainPageContent,endPage};