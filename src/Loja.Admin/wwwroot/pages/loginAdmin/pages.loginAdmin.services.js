var pages = pages || {};
pages.loginAdmin = pages.loginAdmin || {};

pages.loginAdmin.services = function () {

    var login = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication/loginAdmin");
        return pages.dataServices.postAjax(url, parametro);
    }

    return {       
        login
    };
}();