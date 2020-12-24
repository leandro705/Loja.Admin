var pages = pages || {};
pages.menu = pages.menu || {};

pages.menu.services = function () {  

    var EPerfil = {
        ADMINISTRADOR: "Administrador",
        GERENTE: "Gerente",
        CLIENTE: "Cliente"
    }; 

    var login = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication/login");
        return pages.dataServices.postAjax(url, parametro);
    }  

    return {
        EPerfil,
        login
    };
}();