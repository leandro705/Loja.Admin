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
                    else {
                        bootbox.alert(resposta.errors.join("</br>") || "Erro ao realizar operação.");
                        falha();
                    }  
                })
                .fail(function (error) {
                    if (typeof error == 'string') {
                        bootbox.alert(error);
                        falha();
                    }
                    else if (error.status === 401 || error.status === 403)
                        falha("Acesso não permitido!");
                    else {
                        bootbox.alert("Erro ao realizar operação.");
                        falha();
                    }
                });
        });
    }

    var post = function (url, parametros) {
        if (!parametros) parametros = {};
        return new Promise(function (sucesso, falha) {
            $.post(url, parametros, function (resposta, status) {
                if (status === "success" && resposta.statusCode === 200)
                    sucesso(resposta.data);
                else {
                    bootbox.alert(resposta.errors.join("</br>") || "Erro ao realizar operação.");
                    falha();
                }  
            }, "json");
        });
    }    

    var putAjax = function (url, parametros) {
        if (!parametros) parametros = {};
        return new Promise(function (sucesso, falha) {
            $.ajax({
                type: "PUT",
                dataType: "JSON",
                contentType: "application/json; charset=utf-8",
                url: url,
                data: JSON.stringify(parametros),
                success: function (resposta) {
                    if (resposta.statusCode === 200)
                        sucesso(resposta.data);
                    else {
                        bootbox.alert(resposta.errors.join("</br>") || "Erro ao realizar operação.");
                        falha();
                    }  
                },
                error: function (error) {
                    if (typeof error == 'string') {
                        bootbox.alert(error);
                        falha();
                    }
                    else if (error.status === 401 || error.status === 403)
                        falha("Acesso não permitido!");
                    else {
                        bootbox.alert("Erro ao realizar operação.");
                        falha();
                    }            
                }
            });
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
                    else {
                        bootbox.alert(resposta.errors.join("</br>") || "Erro ao realizar operação.");
                        falha();
                    }  
                },
                error: function (error) {
                    if (typeof error == 'string') {
                        bootbox.alert(error);
                        falha();
                    }
                    else if (error.status === 401 || error.status === 403)
                        falha("Acesso não permitido!");
                    else {
                        bootbox.alert("Erro ao realizar operação.");
                        falha();
                    }
                }
            });
        });
    }

    var deleteAjax = function (url) {        
        return new Promise(function (sucesso, falha) {
            $.ajax({
                type: "DELETE",
                dataType: "JSON",
                contentType: "application/json; charset=utf-8",
                url: url,                
                success: function (resposta) {
                    if (resposta.statusCode === 200)
                        sucesso(resposta.data);
                    else {
                        bootbox.alert(resposta.errors.join("</br>") || "Erro ao realizar operação.");
                        falha();
                    }                        
                },
                error: function (error) {
                    if (typeof error == 'string') {
                        bootbox.alert(error);
                        falha();
                    }
                    else if (error.status === 401 || error.status === 403)
                        falha("Acesso não permitido!");
                    else {
                        bootbox.alert("Erro ao realizar operação.");
                        falha();
                    }
                }
            });
        });
    }

    var bloquearTela = function () {

        $.blockUI({
            css: {                
                border: 'none',
                backgroundColor: 'transparent'
            },
            message: '<img src="/assets/images/ajax-loader.gif" />',
            baseZ: 99999
        });
    }

    var desbloquearTela = function () {
        $(document).ajaxStop($.unblockUI());
    }

    return {
        get,
        post,
        putAjax,
        postAjax,
        deleteAjax,
        bloquearTela,
        desbloquearTela
    };
}();