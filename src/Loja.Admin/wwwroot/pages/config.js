var URL_API = "http://localhost:5000";
var URL_SITE = "http://localhost:5001";
var bindingBody = document.getElementById("body");
var binding = document.getElementById("binding");

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    URL_API = "http://localhost:5000";
    URL_SITE = "http://localhost:5001";
} else if (location.hostname === "loja-705-app.herokuapp.com") {
    URL_API = "https://loja-705-api.herokuapp.com";
    URL_SITE = "https://loja-705-app.herokuapp.com";
}

var getCurrentAccessToken = function () {
    return JSON.parse(localStorage.getItem("token")).accessToken;
};

var getDataToken = function () {
    return JSON.parse(localStorage.getItem("token"));
};

var atualizaNome = function (nome) {
    var usuarioLogado = JSON.parse(localStorage.getItem("token"));
    usuarioLogado.nome = nome;
    localStorage.setItem("token", JSON.stringify(usuarioLogado));    
};

var redirectToPageByRole = function () {

    var role = getDataToken().role;

    if (role === "Cliente") {
        window.location.href = "/Agendamento/Calendario";
    }
    else {
        window.location.href = "/Home/Index";
    }
};


var logoff = function () {
    var usuario = getDataToken();

    if (usuario?.estabelecimentoId) {
        localStorage.removeItem("token");
        window.location.href = "/Login/Index/" + usuario.estabelecimentoNomeUrl;
    }
    else {
        localStorage.removeItem("token");
        window.location.href = "/";
    }    
    
}