mainApp.controller("mareadampakCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};

    $scope.areadampak = {};
    $scope.areadampak.input = {};
    $scope.areadampak.isEditMode = false;

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        NProgress.set(0.20)
        // $scope.renderdataDampak();
    }

    //Event Handlers ===================================================================================================================
    $scope.eventClickAdd = function () {
        $scope.areadampak.input = {};
        $scope.areadampak.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        $scope.renderdataDampak();
        $scope.areadampak.isEditMode = false;
    }

    $scope.renderdataDampak = function () {
        NProgress.start();
        // alert("test")
        var apiUrl = "/api/MasterAreaDampak";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.areadampak.data = response;
            NProgress.done();
        });
    }

    $scope.eventAddDampak = function () {
        var apiUrl = "/api/MasterAreaDampak";
        HttpRequest.post(apiUrl, $scope.areadampak.input).success(function (response) {
            $scope.renderdataDampak();
            $scope.areadampak.isEditMode = false;
        });
    }

    $scope.eventEditDampak = function (id) {
        var apiUrl = "/api/MasterAreaDampak/" + id;
        HttpRequest.get(apiUrl).success(function (response) {
            NProgress.start();
            $scope.areadampak.input = response;
            $scope.areadampak.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventHapusDampak = function (id, name) {
        var apiUrl = "/api/MasterAreaDampak/" + id + "?email=" + $scope.currentUser.email;
        var hapus = confirm("Hapus " + name + "?");

        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                NProgress.start();
                $scope.renderdataDampak();
                $scope.areadampak.isEditMode = false;
                NProgress.done();
            });
        }
    }

    //Start of Application =============================================================================================================
    $scope.formLoad();
});