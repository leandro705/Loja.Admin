var pages = pages || {};

pages.interceptor = function () {

    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "Bearer " + getCurrentAccessToken());
        }
    });

    var verifyExpirationDateAcessToken = function () {

        var token = getDataToken();
        var currentDate = new Date();

        if (token === null || (new Date(token.expiration) < currentDate)) {
            //$('#AuthExpirationModal').modal('toggle');
            console.log('Token expirado');
        }
    };
   
    verifyExpirationDateAcessToken();   
    
}();