//Http Request

// var webServiceBaseUrl = "http://localhost:10081";
var webServiceBaseUrl = "http://172.18.18.65:20081";

mainApp.factory("HttpRequest", function ($http, $q) {
    var get = function (query) {
        return $http.get(webServiceBaseUrl + query);
    };
    var post = function (query, data) {
        return $http.post(webServiceBaseUrl + query, data);
    };
    var del = function (query) {
        return $http.delete(webServiceBaseUrl + query);
    };

    return {
        get: get,
        post: post,
        del: del
    };
});