var pages = pages || {};
pages.perfil = pages.perfil || {};

pages.perfil.services = function () {  

    var EPerfil = {
        ADMINISTRADOR: "Administrador",
        GERENTE: "Gerente",
        CLIENTE: "Cliente"
    }; 

    var obterUsuarioPorId = function (id) {
        var url = pages.metadata.actionUrl("/api/users/" + id);
        return pages.dataServices.get(url);
    }

    var atualizarUsuario = function (id, parametro) {
        var url = pages.metadata.actionUrl("/api/users/" + id);
        return pages.dataServices.putAjax(url, parametro);
    }

    var atualizarSenhaUsuario = function (id, parametro) {
        var url = pages.metadata.actionUrl("/api/users/" + id + "/atualizar-senha");
        return pages.dataServices.putAjax(url, parametro);
    }

    var obterMunicipioPorEstadoId = function (estadoId) {
        var url = pages.metadata.actionUrl("/api/municipios/estado/" + estadoId);
        return pages.dataServices.get(url);
    }

    var obterEstados = function () {
        var url = pages.metadata.actionUrl("/api/estados");
        return pages.dataServices.get(url);
    }

    return {
        EPerfil,
        obterUsuarioPorId,
        atualizarUsuario,
        atualizarSenhaUsuario,
        obterMunicipioPorEstadoId,
        obterEstados
    };
}();