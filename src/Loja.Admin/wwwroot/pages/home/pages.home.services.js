var pages = pages || {};
pages.home = pages.home || {};

pages.home.services = function () {  

    var ESituacao = {
        ATIVO: 1,
        PENDENTE: 2,
        FINALIZADO: 3,
        CANCELADO: 4
    };

    var obterTodosEstabelecimentos = function () {
        var url = pages.metadata.actionUrl("/api/estabelecimentos");
        return pages.dataServices.get(url);
    }    

    var obterTodosClientesPorEstabelecimentoId = function (estabelecimentoId) {
        var url = pages.metadata.actionUrl("/api/users/clientes?estabelecimentoId=" + estabelecimentoId);
        return pages.dataServices.get(url);
    }

    var obterTotalUsuarios = function (estabelecimentoId, usuarioId) {
        var url = pages.metadata.actionUrl("/api/home/totalUsuarios?estabelecimentoId=" + estabelecimentoId + "&usuarioId=" + usuarioId);
        return pages.dataServices.get(url);
    }

    var obterTotalAgendamentos = function (estabelecimentoId, usuarioId) {
        var url = pages.metadata.actionUrl("/api/home/totalAgendamentos?estabelecimentoId=" + estabelecimentoId + "&usuarioId=" + usuarioId);
        return pages.dataServices.get(url);
    }

    var obterTotalAtendimentos = function (estabelecimentoId, usuarioId) {
        var url = pages.metadata.actionUrl("/api/home/totalAtendimentos?estabelecimentoId=" + estabelecimentoId + "&usuarioId=" + usuarioId);
        return pages.dataServices.get(url);
    }

    var obterTotalAtendimentosMes = function (estabelecimentoId, usuarioId, situacaoId) {
        var url = pages.metadata.actionUrl("/api/home/totalAtendimentosMes?situacaoId=" + situacaoId + "&estabelecimentoId=" + estabelecimentoId + "&usuarioId=" + usuarioId);
        return pages.dataServices.get(url);
    }    

    var obterValorTotal = function (estabelecimentoId, usuarioId, situacaoId) {
        var url = pages.metadata.actionUrl("/api/home/valorTotal?situacaoId=" + situacaoId + "&estabelecimentoId=" + estabelecimentoId + "&usuarioId=" + usuarioId);
        return pages.dataServices.get(url);
    }

    return {  
        ESituacao,
        obterTodosEstabelecimentos,
        obterTodosClientesPorEstabelecimentoId,
        obterTotalUsuarios,
        obterTotalAgendamentos,
        obterTotalAtendimentos,
        obterTotalAtendimentosMes,
        obterValorTotal
    };
}();