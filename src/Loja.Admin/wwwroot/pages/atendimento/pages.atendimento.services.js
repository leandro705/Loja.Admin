var pages = pages || {};
pages.atendimento = pages.atendimento || {};

pages.atendimento.services = function () {  

    var obterTodosEstabelecimentos = function () {
        var url = pages.metadata.actionUrl("/api/estabelecimentos");
        return pages.dataServices.get(url);
    }

    var obterTodosServicosPorEstabelecimentoId = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/servicos?estabelecimentoId=" + estabelecimentoId);
        return pages.dataServices.get(url);
    }

    var obterTodosClientesPorEstabelecimentoId = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/users/clientes?estabelecimentoId=" + estabelecimentoId);
        return pages.dataServices.get(url);
    }

    var obterTodos = function () {
        var url = pages.metadata.actionUrl("/api/atendimentos");
        return pages.dataServices.get(url);
    }

    var salvar = function (parametro) {
        var url = pages.metadata.actionUrl("/api/atendimentos");
        return pages.dataServices.postAjax(url, parametro);
    }

    var obterPorId = function (id) {
        var url = pages.metadata.actionUrl("/api/atendimentos/" + id);
        return pages.dataServices.get(url);
    }           

    var deletar = function (id) {
        var url = pages.metadata.actionUrl("/api/atendimentos/" + id);
        return pages.dataServices.deleteAjax(url);
    }  

    var atualizar = function (id, parametro) {
        var url = pages.metadata.actionUrl("/api/atendimentos/" + id);
        return pages.dataServices.putAjax(url, parametro);
    } 

    return {    
        obterTodosEstabelecimentos,
        obterTodosServicosPorEstabelecimentoId,
        obterTodosClientesPorEstabelecimentoId,
        obterTodos,
        obterPorId,
        atualizar,
        salvar,
        deletar
    };
}();