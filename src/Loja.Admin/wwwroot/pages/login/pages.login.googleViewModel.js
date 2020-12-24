var pages = pages || {};
pages.login = pages.login || {};
pages.login.services = pages.login.services || {};
var service = pages.login.services;     

renderButton = function () {    
    gapi.load('auth2', function () {
        var auth2 = gapi.auth2.init({
            client_id: '773610970268-98pjeeu4kc5j147av9auh8q61oc5p9fk.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
        });
        
        document.getElementById('google-root').addEventListener('click', function () {
            auth2.signIn().then(onSuccess).catch(onFailure);
        });
    });
}

onSuccess = function (googleUser) {
    
    var profile = googleUser.getBasicProfile(); 
    var parametro = {
        email: profile.getEmail(),
        senha: profile.getId(),
        nome: profile.getName(),
        token: googleUser.getAuthResponse().access_token,
        estabelecimentoId: EstabelecimentoId
    };
    let token = googleUser.getAuthResponse().access_token;
    loginGoogle(parametro, token);
}


onFailure = function (error) {
    console.log(error);
}

loginGoogle = function (parametro, token) {
    pages.dataServices.bloquearTela();
    service.loginGoogle(parametro, token).then(function (result) {
        console.log(result.data)
        localStorage.setItem("token", JSON.stringify(result.data));
        redirectToPageByRole();
    }).catch(function (result) {
        if (result.exibeMensagem)
            bootbox.alert(result.data);
    }).finally(function () {
        pages.dataServices.desbloquearTela();
    });
};      
   
