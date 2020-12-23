var pages = pages || {};
pages.atendimento = pages.atendimento || {};

pages.atendimento.services = function () {  

    var obterAgendamentoPorId = function (id) {
        var url = pages.metadata.actionUrl("/api/agendamentos/" + id);
        return pages.dataServices.get(url);
    } 

    var obterTodosEstabelecimentos = function () {
        var url = pages.metadata.actionUrl("/api/estabelecimentos");
        return pages.dataServices.get(url);
    }

    var obterTodosServicosPorEstabelecimentoId = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/servicos/ativo?estabelecimentoId=" + estabelecimentoId);
        return pages.dataServices.get(url);
    }

    var obterTodosClientesPorEstabelecimentoId = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/users/clientes?estabelecimentoId=" + estabelecimentoId);
        return pages.dataServices.get(url);
    }

    var obterTodos = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/atendimentos?estabelecimentoId=" + estabelecimentoId);
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

    var finalizarAtendimento = function (id) {
        var url = pages.metadata.actionUrl("/api/atendimentos/" + id + "/finalizar");
        return pages.dataServices.putAjax(url);
    }  

    var atualizar = function (id, parametro) {
        var url = pages.metadata.actionUrl("/api/atendimentos/" + id);
        return pages.dataServices.putAjax(url, parametro);
    }     

    return {    
        obterAgendamentoPorId,
        obterTodosEstabelecimentos,
        obterTodosServicosPorEstabelecimentoId,
        obterTodosClientesPorEstabelecimentoId,
        obterTodos,
        obterPorId,
        atualizar,
        salvar,
        deletar,
        finalizarAtendimento
    };
}();