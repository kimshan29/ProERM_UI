mainApp.controller("mKategoriRisikoCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {
    $scope.currentUser = {};
    $scope.kategoriRisiko = {};
    $scope.kategoriRisiko.data = {};
    $scope.kategoriRisiko.input = {};


    $scope.kategoriRisiko.isEditMode = false;


    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        $scope.renderKategoriRisiko();
    }

    $scope.eventClickAdd = function () {
        $scope.kategoriRisiko.input = {};
        $scope.kategoriRisiko.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderKategoriRisiko();
        $scope.kategoriRisiko.isEditMode = false;
        NProgress.done();
    }

    $scope.eventClickSave = function () {

        // var apiUrl = "/api/MasterKategoriRisiko";
        $scope.kategoriRisiko.input.id = "";
        $scope.kategoriRisiko.input.userEmail = $scope.currentUser.email;

        console.log(JSON.stringify($scope.kategoriRisiko.input));

        // HttpRequest.post(apiUrl, $scope.kategoriRisiko.input).success(function (response) {
        //     $scope.renderKategoriRisiko();
        //     $scope.kategoriRisiko.isEditMode = false;
        // });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterKategoriRisiko/" + id;

        $scope.kategoriRisiko.input.userEmail = $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kategoriRisiko.input = response;
            $scope.kategoriRisiko.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();
        var apiUrl = "/api/MasterKategoriRisiko/" + id + "?email=" + $scope.currentUser.email;

        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderKategoriRisiko();
                $scope.kategoriRisiko.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
    }


    $scope.renderKategoriRisiko = function () {
        NProgress.start();
        var apiUrl = "/api/MasterKategoriRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kategoriRisiko.data = response;
            NProgress.done();
        });
    }

    $scope.formLoad();
});