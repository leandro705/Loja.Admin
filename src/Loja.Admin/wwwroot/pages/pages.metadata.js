var pages = pages || {};

pages.metadata = function () {

    var actionUrl = function (endpoint) {       
        return URL_API + endpoint;
    };

    var actionUrlParams = function (endpoint, params) {
        var hasFirst = false;
        var queryString = "";

        for (var paramName in params) {
            if (params[paramName] != undefined) {
                if (hasFirst === false)
                    queryString += "?" + paramName + "=" + params[paramName];
                else
                    queryString += "&" + paramName + "=" + params[paramName];

                hasFirst = true;
            }
        }

        return actionUrl(endpoint) + queryString;
    };

    var getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    return {
        actionUrl,
        actionUrlParams,
        getUrlParameter
    };
}();