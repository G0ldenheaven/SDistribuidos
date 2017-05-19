    var getSignedMenu = function(req){
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

    function getLoginPageContent(res,Futebol){
        var html ="";
        
    };

var exports = module.exports = {getSignedMenu,getLoginPageContent};