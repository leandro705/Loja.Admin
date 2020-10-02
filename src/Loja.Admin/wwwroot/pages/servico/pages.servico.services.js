var pages = pages || {};
pages.servico = pages.servico || {};

pages.servico.services = function () {  

    var obterTodos = function () {
        var url = pages.metadata.actionUrl("/api/servicos");
        return pages.dataServices.get(url);
    }

    var salvar = function (parametro) {
        var url = pages.metadata.actionUrl("/api/servicos");
        return pages.dataServices.postAjax(url, parametro);
    }

    var obterPorId = function (id) {
        var url = pages.metadata.actionUrl("/api/servicos/" + id);
        return pages.dataServices.get(url);
    }           

    var deletar = function (id) {
        var url = pages.metadata.actionUrl("/api/servicos/" + id);
        return pages.dataServices.deleteAjax(url);
    }  

    var atualizar = function (id, parametro) {
        var url = pages.metadata.actionUrl("/api/servicos/" + id);
        return pages.dataServices.putAjax(url, parametro);
    } 

    return {       
        obterTodos,
        obterPorId,
        atualizar,
        salvar,
        deletar
    };
}();