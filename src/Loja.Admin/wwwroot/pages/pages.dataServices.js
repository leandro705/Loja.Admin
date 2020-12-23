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
                        let result = {
                            data,
                            status: true,
                            exibeMensagem: false
                        };
                        sucesso(result);                        
                    }
                    else {                        
                        let result = {
                            data: resposta.errors.join("</br>") || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }  
                })
                .fail(function (error) {
                    if (typeof error == 'string') {
                        let result = {
                            data: error || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                    else if (error.status === 401 || error.status === 403) {
                        let result = {
                            data: "Acesso não permitido!",
                            status: false,
                            exibeMensagem: false
                        };
                        falha(result);      
                    }                      
                    else {
                        let result = {
                            data: "Erro ao realizar operação!",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);                      
                    }
                });
        });
    }

    var post = function (url, parametros) {
        if (!parametros) parametros = {};
        return new Promise(function (sucesso, falha) {
            $.post(url, parametros, function (resposta, status) {
                if (status === "success" && resposta.statusCode === 200) {
                    let result = {
                        data: resposta.data,
                        status: true,
                        exibeMensagem: false
                    };
                    sucesso(result); 
                }                  
                else {
                    let result = {
                        data: resposta.errors.join("</br>") || "Erro ao realizar operação.",
                        status: false,
                        exibeMensagem: true
                    };
                    falha(result);                  
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
                    if (resposta.statusCode === 200) {
                        let result = {
                            data: resposta.data,
                            status: true,
                            exibeMensagem: false
                        };
                        sucesso(result);
                    }
                    else {
                        let result = {
                            data: resposta.errors.join("</br>") || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                },
                error: function (error) {
                    if (typeof error == 'string') {
                        let result = {
                            data: error || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                    else if (error.status === 401 || error.status === 403) {
                        let result = {
                            data: "Acesso não permitido!",
                            status: false,
                            exibeMensagem: false
                        };
                        falha(result);
                    }
                    else {
                        let result = {
                            data: "Erro ao realizar operação!",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
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
                    if (resposta.statusCode === 200) {
                        let result = {
                            data: resposta.data,
                            status: true,
                            exibeMensagem: false
                        };
                        sucesso(result);
                    }
                    else {
                        let result = {
                            data: resposta.errors.join("</br>") || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }                    
                },
                error: function (error) {
                    if (typeof error == 'string') {
                        let result = {
                            data: error || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                    else if (error.status === 401 || error.status === 403) {
                        let result = {
                            data: "Acesso não permitido!",
                            status: false,
                            exibeMensagem: false
                        };
                        falha(result);
                    }
                    else {
                        let result = {
                            data: "Erro ao realizar operação!",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                }
            });
        });
    }

    var postAuthorizationAjax = function (url, parametros, token) {
        if (!parametros) parametros = {};
        return new Promise(function (sucesso, falha) {
            $.ajax({
                type: "POST",
                dataType: "JSON",
                contentType: "application/json; charset=utf-8",
                url: url,
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: JSON.stringify(parametros),
                success: function (resposta) {
                    if (resposta.statusCode === 200) {
                        let result = {
                            data: resposta.data,
                            status: true,
                            exibeMensagem: false
                        };
                        sucesso(result);
                    }
                    else {
                        let result = {
                            data: resposta.errors.join("</br>") || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                },
                error: function (error) {
                    if (typeof error == 'string') {
                        let result = {
                            data: error || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                    else if (error.status === 401 || error.status === 403) {
                        let result = {
                            data: "Acesso não permitido!",
                            status: false,
                            exibeMensagem: false
                        };
                        falha(result);
                    }
                    else {
                        let result = {
                            data: "Erro ao realizar operação!",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
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
                    if (resposta.statusCode === 200) {
                        let result = {
                            data: resposta.data,
                            status: true,
                            exibeMensagem: false
                        };
                        sucesso(result);
                    }
                    else {
                        let result = {
                            data: resposta.errors.join("</br>") || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }                                     
                },
                error: function (error) {
                    if (typeof error == 'string') {
                        let result = {
                            data: error || "Erro ao realizar operação.",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
                    }
                    else if (error.status === 401 || error.status === 403) {
                        let result = {
                            data: "Acesso não permitido!",
                            status: false,
                            exibeMensagem: false
                        };
                        falha(result);
                    }
                    else {
                        let result = {
                            data: "Erro ao realizar operação!",
                            status: false,
                            exibeMensagem: true
                        };
                        falha(result);
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
        desbloquearTela,
        postAuthorizationAjax
    };
}();