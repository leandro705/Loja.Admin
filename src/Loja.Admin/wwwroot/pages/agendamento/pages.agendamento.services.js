﻿var pages = pages || {};
pages.agendamento = pages.agendamento || {};

pages.agendamento.services = function () {  

    var EPerfil = {
        ADMINISTRADOR: "Administrador",
        GERENTE: "Gerente",
        CLIENTE: "Cliente"
    }; 

    var ESituacao = {
        ATIVO: "Ativo",
        PENDENTE: "Pendente",
        FINALIZADO: "Finalizado",
        CANCELADO: "Cancelado",
        INATIVO: "Inativo"
    }; 

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

    var obterHorariosDisponiveis = function (dataAgendamento, estabelecimentoId, servicoId) {
        var url = pages.metadata.actionUrl("/api/agendamentos/horariosDisponiveis?dataAgendamento=" + dataAgendamento + "&estabelecimentoId=" + estabelecimentoId + "&servicoId=" + servicoId);
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
        ESituacao,
        obterTodosEstabelecimentos,
        obterTodosServicosPorEstabelecimentoId,
        obterTodosClientesPorEstabelecimentoId,
        obterHorariosDisponiveis,
        obterTodos,
        obterPorId,
        atualizar,
        salvar,
        deletar
    };
}();