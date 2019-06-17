mainApp.controller("mPenyebabCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};

    $scope.penyebab = {};
    $scope.penyebab.data = {};
    $scope.penyebab.master = {};
    $scope.penyebab.input = {};
    $scope.penyebab.isEditMode = false;


    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        $scope.renderPenyebab();
    }

    $scope.renderPenyebab = function () {
        NProgress.start();
        var apiUrl = "/api/MasterPenyebab";
        HttpRequest.get(apiUrl).success(function (response) {

            var apiUrl2 = "/api/MasterRisiko";
            HttpRequest.get(apiUrl2).success(function (response) {
                $scope.penyebab.master = response;
            });

            $scope.penyebab.data = response;
            NProgress.done();
        });
    }

    //Event Handlers ===================================================================================================================
    $scope.eventClickAdd = function () {
        $scope.penyebab.input = {};
        $scope.penyebab.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        $scope.renderPenyebab();
        $scope.penyebab.isEditMode = false;
    }

    $scope.eventClickSave = function () {
        var apiUrl = "/api/MasterPenyebab";
        
        var data = $scope.penyebab.input;
        data.userEmail = $scope.currentUser.email;

        HttpRequest.post(apiUrl, $scope.penyebab.input).success(function (response) {
            $scope.renderPenyebab();
            $scope.penyebab.isEditMode = false;
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Entitas",
                exception: response,
                exceptionCode: code,
                operation: "POST",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();

        var apiUrl = "/api/MasterPenyebab/" + id;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.penyebab.input = response;
            $scope.penyebab.isEditMode = true;
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Penyebab",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.eventClickHapus = function (id, name) {

        var apiUrl = "/api/MasterPenyebab/" + id + "?email=" + $scope.currentUser.email;
        var hapus = confirm("Hapus " + name + "?");

        if (hapus) {
            NProgress.start();

            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderPenyebab();
                $scope.penyebab.isEditMode = false;
                NProgress.done();
            })
            .error(function (response, code) {
                NProgress.done();

                var data = {
                    title: "Penyebab",
                    exception: response,
                    exceptionCode: code,
                    operation: "DELETE",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
        }
    }

    $scope.eventChangeRisiko = function ()
    {
        var masterRisiko = $scope.penyebab.master;
        var selectedRisiko = Helper.findItem(masterRisiko, "id", $scope.penyebab.input.risiko.id);
        $scope.penyebab.input.risiko.id = selectedRisiko.id;
        $scope.penyebab.input.risiko.risiko = selectedRisiko.risiko;
        $scope.penyebab.input.risiko.kejadian = selectedRisiko.kejadian;
        $scope.penyebab.input.risiko.idPustakaRisiko = selectedRisiko.idPustakaRisiko;
    }

    //Start of Application =============================================================================================================
    $scope.formLoad();
});