var pages = pages || {};

pages.interceptor = function () {

    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "Bearer " + getCurrentAccessToken());
        },
        complete: function (xhr) {
            if (xhr.status === 401) {
                bootbox.alert("Acesso não permitido!", function () {
                    logoff();
                });
            }
            else if (xhr.status === 403) {
                bootbox.alert("Acesso não permitido!", function () {
                    logoff();
                }); 
            }
        }
    });

    var verifyExpirationDateAcessToken = function () {

        var token = getDataToken();
        var currentDate = new Date();

        if (token === null || (new Date(token.expiration) < currentDate)) {
            //$('#AuthExpirationModal').modal('toggle');
            console.log('Token expirado');
            bootbox.alert("Sessão expirada!", function () {
                logoff();
            }); 
        }
    }; 
   
    verifyExpirationDateAcessToken();   
    
}();