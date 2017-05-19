    var getSignedMenu = function(req){
        var txt;
        
        if(req!=null){
            txt='<a href="/login">Signed in as '+req.username+'</a>';
        }else{
            txt='<a href="/login">Login</a>';
        }
        
        return '<body style="width:100%">'+
                    '<nav class="navbar navbar-inverse" role="navigation" style="padding-right:130px;">'+
                        '<ul class="nav navbar-nav">'+
                            '<li class="active">'+
                                '<a href="/">Home<span class="sr-only">(current)</span></a>'+
                            '</li>'+
                            '<li>'+
                            txt+
                            '</li>'+
                            '<li>'+
                                '<a href="/contact">Contact us</a>'+
                            '</li>'+
                        '</ul>'+
                    '</nav>';;
    };

    function getLoginPageContent(){
        var html ="";
        return html;
    };

var exports = module.exports = {getSignedMenu,getLoginPageContent};