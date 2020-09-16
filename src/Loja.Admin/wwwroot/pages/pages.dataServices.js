var pages = pages || {};

pages.dataServices = function () {

    var get = function (url) {       
        return new Promise(function (sucesso, falha) {
            $.get(url)
                .done(function (resposta) {
                    if (resposta.statusCode === 200) {
                        var data = null;
                        try { data = JSON.parse(resposta.data); }
                        catch (ex) { data = resposta.data; }
                        sucesso(data);
                    }
                    else
                        falha(resposta.errors.join("</br>") || "Erro ao realizar operação.");
                })
                .fail(function (error) {
                    falha(error || "Erro ao realizar operação.");
                });
        });
    }

    var post = function (url, parametros) {
        if (!parametros) parametros = {};
        return new Promise(function (sucesso, falha) {
            $.post(url, parametros, function (resposta, status) {
                if (status === "success" && resposta.statusCode === 200)
                    sucesso(resposta.data);
                else 
                    falha(resposta.errors.join("</br>") || "Erro ao realizar operação.");
            }, "json");
        });
    }

    var postAjax = function (url, parametros) {
        if (!parametros) parametros = {};
        return new Promise(function (sucesso, falha) {
            $.ajax({
                type: "POST",
                dataType: "JSON",
                contentType: "application/json; charset=utf-8",
                url: url,
                data: JSON.stringify(parametros),
                success: function (resposta) {
                    if (resposta.statusCode === 200)
                        sucesso(resposta.data);
                    else
                        falha(resposta.errors.join("</br>") || "Erro ao realizar operação.");
                },
                error: function (resposta) {
                    falha(resposta.errors.join("</br>") || "Erro ao realizar operação.");                    
                }
            });
        });
    }

    return {
        get,
        post,
        postAjax
    };
}();