var URL_API = "http://localhost:5000";
var URL_SITE = "http://localhost:5001";
var binding = document.getElementById("body");

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

var doLogoff = function () {
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