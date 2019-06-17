mainApp.controller("mWarnaCtrl", function ($scope, $routeParams, $q, $cookies, $injector, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};
    var $validationProvider = $injector.get('$validation');

    $scope.data = {};
    $scope.input = {};
    $scope.formTitle = "";
    $scope.isEditMode = false;

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        $scope.renderData();
    }

    $scope.renderData = function () {
        NProgress.start();

        var apiUrl = "/api/MasterWarna";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Warna",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    //Event Handlers ===================================================================================================================
    $scope.eventClickAdd = function () {
        $scope.isEditMode = true;

        $scope.formTitle = "Tambah Warna";
        $scope.input = {};
        $scope.input.rgb = "#FFFFFF";
    }

    $scope.eventClickCancel = function () {
        $scope.isEditMode = false;
    }

    $scope.eventClickSave = function () {
        var apiUrl = "/api/MasterWarna";

        var data = $scope.input;
        data.userEmail = $scope.currentUser.email;

        HttpRequest.post(apiUrl, data).success(function (response) {
            $scope.renderData();

            $scope.isEditMode = false;
        })
        .error(function (response, code) {
            var data = {
                title: "Warna",
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

        $scope.formTitle = "Edit Warna";

        var apiUrl = "/api/MasterWarna/" + id;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.input = response;
            $scope.isEditMode = true;
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Warna",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.eventClickHapus = function (id, name) {
        var apiUrl = "/api/MasterWarna/" + id + "?email=" + $scope.currentUser.email;
        var hapus = confirm("Hapus " + name + "?");

        if (hapus) {
            NProgress.start();

            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderData();
                $scope.isEditMode = false;
                NProgress.done();
            })
            .error(function (response, code) {
                NProgress.done();

                var data = {
                    title: "Warna",
                    exception: response,
                    exceptionCode: code,
                    operation: "DELETE",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
        }
    }

    //Start of Application =============================================================================================================
    $scope.formLoad();
});