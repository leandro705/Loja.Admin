var URL_API = "http://localhost:5000";
var URL_SITE = "http://localhost:5001";
var bindingBody = document.getElementById("body");
var binding = document.getElementById("binding");

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    URL_API = "http://localhost:5000";
    URL_SITE = "http://localhost:5001";
}

var redirectToLogin = function () {
    window.location.href = "/";
};

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

var logoff = function () {
    localStorage.removeItem("token");
    redirectToLogin();
}

var redirectToPageByRole = function () {

    var role = getDataToken().role;

    if (role === "Operador") {
        window.location.href = "/Entry/Create";
    }
    else if (role === "Motorista") {
        window.location.href = "/Schedule/Calendar";
    } else {
        window.location.href = "/Home/Index";
    }
};