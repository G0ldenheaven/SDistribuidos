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

    var getMenu = function(req){
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
    };

    var endPage = function(){
        return '</body>'+
        '</html>';
    }

var exports = module.exports = {header,getMenu,getMainPageContent,endPage};