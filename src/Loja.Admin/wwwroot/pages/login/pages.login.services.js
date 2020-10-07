var pages = pages || {};
pages.login = pages.login || {};

pages.login.services = function () {

    var ETelaLogin = {
        LOGIN: 1,
        CADASTRO: 2,
        RECUPERACAO: 3
    };  
    var obterEstabelecimentoPorNomeUrl = function (nomeUrl) {
        var url = pages.metadata.actionUrl("/api/estabelecimentos?url=" + nomeUrl);
        return pages.dataServices.get(url);
    }

    var login = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication/login");
        return pages.dataServices.postAjax(url, parametro);
    }

    var loginFacebook = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication/facebook");
        return pages.dataServices.postAjax(url, parametro);
    }

    var loginGoogle = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication/google");
        return pages.dataServices.postAjax(url, parametro);
    }    

    var salvar = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication");
        return pages.dataServices.postAjax(url, parametro);
    }

    var recuperarSenha = function (parametro) {
        var url = pages.metadata.actionUrl("/api/authentication/enviar-email-recuperacao-senha");
        return pages.dataServices.postAjax(url, parametro);
    }    

    return {
        ETelaLogin,
        obterEstabelecimentoPorNomeUrl,
        login,
        loginFacebook,
        loginGoogle,
        salvar,
        recuperarSenha
    };
}();