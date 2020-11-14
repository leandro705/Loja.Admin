var pages = pages || {};
pages.estabelecimento = pages.estabelecimento || {};

pages.estabelecimento.services = function () {  

    var obterTodos = function (estabelecimentoNomeUrl) {
        var url = pages.metadata.actionUrl("/api/estabelecimentos?url=" + estabelecimentoNomeUrl);
        return pages.dataServices.get(url);
    }

    var salvar = function (parametro) {
        var url = pages.metadata.actionUrl("/api/estabelecimentos");
        return pages.dataServices.postAjax(url, parametro);
    }

    var obterPorId = function (id) {
        var url = pages.metadata.actionUrl("/api/estabelecimentos/" + id);
        return pages.dataServices.get(url);
    }           

    var deletar = function (id) {
        var url = pages.metadata.actionUrl("/api/estabelecimentos/" + id);
        return pages.dataServices.deleteAjax(url);
    }  

    var atualizar = function (id, parametro) {
        var url = pages.metadata.actionUrl("/api/estabelecimentos/" + id);
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