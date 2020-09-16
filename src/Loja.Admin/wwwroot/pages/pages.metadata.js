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

    return {
        actionUrl,
        actionUrlParams
    };
}();