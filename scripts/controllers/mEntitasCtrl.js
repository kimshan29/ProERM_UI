mainApp.controller("mEntitasCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};

    $scope.entitas = {};
    $scope.entitas.data = {};
    $scope.entitas.input = {};
    $scope.entitas.isEditMode = false;

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        $scope.renderDataEntitas();
    }

    $scope.renderDataEntitas = function () {
        NProgress.start();

        //$scope.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        var apiUrl = "/api/MasterEntitas";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.entitas.data = response;
            NProgress.done();
        }).error(function (response, code) {
            NProgress.done();
        });
    }

    //Event Handlers ===================================================================================================================
    $scope.eventClickAdd = function () {
        $scope.entitas.input = {};
        $scope.entitas.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        $scope.renderDataEntitas();
        $scope.entitas.isEditMode = false;
    }

    $scope.eventClickSave = function () {
        var apiUrl = "/api/MasterEntitas";

        $scope.entitas.input.id = "";
        var data = $scope.entitas.input;
        data.userEmail = $scope.currentUser.email;

        console.log(JSON.stringify(data));

        // HttpRequest.post(apiUrl, data).success(function (response) {
        //     $scope.renderDataEntitas();
        //     $scope.entitas.isEditMode = false;
        // })
        // .error(function (response, code) {
        //     var data = {
        //         title: "Entitas",
        //         exception: response,
        //         exceptionCode: code,
        //         operation: "POST",
        //         apiUrl: apiUrl
        //     };

        //     Helper.notifErrorHttp(data);
        // });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();

        var apiUrl = "/api/MasterEntitas/" + id;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.entitas.input = response;
                $scope.entitas.isEditMode = true;
                NProgress.done();
            })
            .error(function (response, code) {
                NProgress.done();

                var data = {
                    title: "Entitas",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.eventClickHapus = function (id, name) {

        var apiUrl = "/api/MasterEntitas/" + id + "?email=" + $scope.currentUser.email;
        var hapus = confirm("Hapus " + name + "?");

        if (hapus) {
            NProgress.start();

            HttpRequest.del(apiUrl).success(function (response) {
                    $scope.renderDataEntitas();
                    $scope.entitas.isEditMode = false;
                    NProgress.done();
                })
                .error(function (response, code) {
                    NProgress.done();

                    var data = {
                        title: "Entitas",
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