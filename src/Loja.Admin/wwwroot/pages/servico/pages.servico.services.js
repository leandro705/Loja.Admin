var pages = pages || {};
pages.servico = pages.servico || {};

pages.servico.services = function () {  

    var obterTodosEstabelecimentos = function () {
        var url = pages.metadata.actionUrl("/api/estabelecimentos");
        return pages.dataServices.get(url);
    }

    var obterTodos = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/servicos?estabelecimentoId=" + estabelecimentoId);
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

    var ativar = function (id) {
        var url = pages.metadata.actionUrl("/api/servicos/" + id + "/ativar");
        return pages.dataServices.putAjax(url);
    } 

    var desativar = function (id) {
        var url = pages.metadata.actionUrl("/api/servicos/" + id + "/desativar");
        return pages.dataServices.putAjax(url);
    } 

    return {    
        obterTodosEstabelecimentos,
        obterTodos,
        obterPorId,
        atualizar,
        salvar,
        deletar,
        ativar,
        desativar
    };
}();