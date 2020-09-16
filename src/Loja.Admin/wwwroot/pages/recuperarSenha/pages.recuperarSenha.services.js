var pages = pages || {};
pages.recuperarSenha = pages.recuperarSenha || {};

pages.recuperarSenha.services = function () {  
    
    var recuperarSenha = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication/recuperar-senha");
        return pages.dataServices.postAjax(url, parametro);
    }    

    return {      
        recuperarSenha
    };
}();