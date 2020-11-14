var pages = pages || {};
pages.agendamento = pages.agendamento || {};

pages.agendamento.services = function () {  

    var EPerfil = {
        ADMINISTRADOR: "Administrador",
        GERENTE: "Gerente",
        CLIENTE: "Cliente",
        FUNCIONARIO: "Funcionario"
    }; 

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

    var obterTodos = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/agendamentos?estabelecimentoId=" + estabelecimentoId);
        return pages.dataServices.get(url);
    }

    var salvar = function (parametro) {
        var url = pages.metadata.actionUrl("/api/agendamentos");
        return pages.dataServices.postAjax(url, parametro);
    }

    var obterPorId = function (id) {
        var url = pages.metadata.actionUrl("/api/agendamentos/" + id);
        return pages.dataServices.get(url);
    }           

    var deletar = function (id) {
        var url = pages.metadata.actionUrl("/api/agendamentos/" + id);
        return pages.dataServices.deleteAjax(url);
    }  

    var atualizar = function (id, parametro) {
        var url = pages.metadata.actionUrl("/api/agendamentos/" + id);
        return pages.dataServices.putAjax(url, parametro);
    } 

    return {  
        EPerfil,
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