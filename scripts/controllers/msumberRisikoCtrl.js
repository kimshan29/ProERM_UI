mainApp.controller("msumberRisikoCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
    $scope.currentUser = {};
    $scope.sumberrisiko = {};
    $scope.sumberrisiko.data = {};
    $scope.sumberrisiko.input = {};

    $scope.sumberrisiko.isEditMode = false;

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        $scope.renderSumberRisiko();
    }

    $scope.eventClickAdd = function () {
        $scope.sumberrisiko.input = {};
        $scope.sumberrisiko.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderSumberRisiko();
        $scope.sumberrisiko.isEditMode = false;
        NProgress.done();
    }

    $scope.eventClickSave = function () {
        var apiUrl = "/api/MasterSumberRisiko";

        $scope.sumberrisiko.input.userEmail = $scope.currentUser.email;

        HttpRequest.post(apiUrl, $scope.sumberrisiko.input).success(function (response) {
            $scope.renderSumberRisiko();
            $scope.sumberrisiko.isEditMode = false;
        });
        console.log($scope.sumberrisiko.input);
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterSumberRisiko/" + id;

        $scope.sumberrisiko.input.userEmail = $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.sumberrisiko.input = response;
            $scope.sumberrisiko.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id,name) {
        NProgress.start();
        var apiUrl = "/api/MasterSumberRisiko/" + id + "?email=" + $scope.currentUser.email;

        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderSumberRisiko();
                $scope.sumberrisiko.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
        
    }

    $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

    $scope.renderSumberRisiko = function ()
    {
        NProgress.start();
        var apiUrl = "/api/MasterSumberRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.sumberrisiko.data = response;

            var apiUrl2 = "/api/MasterTipeSumberRisiko";
            HttpRequest.get(apiUrl2).success(function (response) {
                $scope.sumberrisiko.master = response;
            });

            NProgress.done();
        });
    }

    $scope.eventChangeTipe = function () {
        var masterSumberRisiko = $scope.sumberrisiko.master;
        var selectedSumberRisiko = Helper.findItem(masterSumberRisiko, "id", $scope.sumberrisiko.input.tipeSumberRisiko.id);
        $scope.sumberrisiko.input.tipeSumberRisiko.id = selectedSumberRisiko.id;
        $scope.sumberrisiko.input.tipeSumberRisiko.tipeSumberRisiko = selectedSumberRisiko.tipeSumberRisiko;
    }

    $scope.formLoad();
});