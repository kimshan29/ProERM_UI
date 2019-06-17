mainApp.controller("distDmrCtrl", function ($scope, $routeParams, $cookies, $http, $injector,$sce, Constant, HttpRequest, Model, Helper) {
    $scope.Helper = Helper;
    var currentUser = {};

    $scope.data = {};
    $scope.data.kepadaList = [];
    
    $scope.log = {};
    $scope.log.data = [];

    $scope.getCurrentUser = function () {
        try {
            currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            currentUser = {};
        }
    }


    $scope.renderPic = function (keyword) {
        var apiUrl = "/api/KRListPIC/" + keyword;
        return HttpRequest.get(apiUrl).then(function (response) {
            return response.data;
        });
    }

    $scope.renderDmr = function (searchParam) {
        var apiUrl = "/api/SearchDMR?key=" + searchParam + "&email=" + currentUser.email;
        return HttpRequest.get(apiUrl).then(function (response) {
            return response.data;
        });
    }

    $scope.eventClickAddPenerima = function ()
    {
        $scope.data.kepadaList.push($scope.kepada);
        $scope.kepada = null;
    }

    $scope.eventClickHapusPenerima = function(index)
    {
        var hapus = confirm('Hapus Penerima ?');
        if (hapus) {
            $scope.data.kepadaList.splice(index, 1);
        }
    }

    $scope.eventClickSend = function ()
    {
        NProgress.start();
        var apiUrl = "/api/DMRDistribution";
        $scope.data.noDMR = $scope.dataDMR.noDMR;
        $scope.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.data).success(function (response) {
            $scope.kepadaList = null;
            $scope.dataDMR = null;
            $scope.data = [];
            $scope.getLogDistributionDMR();
            confirm('Data DMR berhasil di distribusikan.');
            NProgress.done();
        }).error(function (response, code) {
            $scope.error = response.ExceptionMessage + " - " + code;
            alert($scope.error);
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.getLogDistributionDMR = function () {
        NProgress.start();

        apiUrl = "/api/DMRDistribution";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.log.data = response;
            NProgress.done();
        }).error(function (response, code) {
            alert(response);
            $scope.errorCode = code;
            $('#modalError').modal("show");
            NProgress.done();
        });
    }

    // ======== FORM LOAD ======== //
    $scope.getLogDistributionDMR();
    $scope.getCurrentUser();
});