//Http Request

// var webServiceBaseUrl = "http://192.168.100.185:20081"; // Dev IP
var webServiceBaseUrl = "http://10.28.0.35:1080"; //Dev Batam

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