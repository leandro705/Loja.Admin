var pages = pages || {};
pages.login = pages.login || {};
pages.login.services = pages.login.services || {};
var service = pages.login.services;
        
// Load the JavaScript SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/pt_BR/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
        

fbAsyncInit = function () {
    // FB JavaScript SDK configuration and setup
    FB.init({
        appId: '331933181397981',
        cookie: true,
        xfbml: true,
        status: true,
        version: 'v8.0'
    });   
};

// Facebook login with JavaScript SDK
checkLoginState = function () {
    FB.getLoginStatus(function (response) {
        if (response.authResponse) 
            getFbUserData();
        else 
            bootbox.alert("Falha na autenticação!");
    });
}

// Fetch the user profile data from facebook
getFbUserData = function() {
    FB.api('/me', { locale: 'pt_BR', fields: 'name,email' },
        function (response) {
            console.log(JSON.stringify(response));
            var parametro = {
                email: response.email,
                senha: response.id,
                nome: response.name
            };
            loginFacebook(parametro);
        });
}        

loginFacebook = function (parametro) {
    pages.dataServices.bloquearTela();
    service.loginFacebook(parametro).then(function (result) {
        console.log(result)
        localStorage.setItem("token", JSON.stringify(result));
        window.location.href = "/Home/Index";
    }).catch(function (mensagem) {
        bootbox.alert(mensagem);
    }).finally(function () {
        pages.dataServices.desbloquearTela();
    });
};      
   
