mainApp.controller("mKejadianRisikoCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {
    $scope.currentUser = {};
    $scope.kejadianRisiko = {};
    $scope.kejadianRisiko.data = {};
    $scope.kejadianRisiko.input = {};


    $scope.kejadianRisiko.isEditMode = false;
    $scope.master = {};
    $scope.master.tahun = [];

    //Master Tahun
    var years = Helper.generateStackedYears(2018, 2);
    $scope.master.tahun = years;


    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        $scope.renderkejadianRisiko();
        $scope.renderKategoriRisiko();
        $scope.renderSubKategoriRisiko();
        $scope.renderAreaDampak();
    }

    $scope.eventClickAdd = function () {
        $scope.kejadianRisiko.input = {};
        $scope.kejadianRisiko.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderkejadianRisiko();
        $scope.kejadianRisiko.isEditMode = false;
        NProgress.done();
    }

    $scope.eventClickSave = function () {

        var apiUrl = "/api/MasterkejadianRisiko";
        // $scope.kejadianRisiko.input.id = "";
        $scope.kejadianRisiko.input.userEmail = $scope.currentUser.email;

        console.log(JSON.stringify($scope.kejadianRisiko.input));

        HttpRequest.post(apiUrl, $scope.kejadianRisiko.input).success(function (response) {
            $scope.renderkejadianRisiko();
            $scope.kejadianRisiko.isEditMode = false;
        });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterkejadianRisiko/" + id;



        $scope.kejadianRisiko.input.userEmail = $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            console.log(JSON.stringify(response));
            $scope.kejadianRisiko.input = response;
            $scope.kejadianRisiko.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();
        var apiUrl = "/api/MasterkejadianRisiko/" + id + "?email=" + $scope.currentUser.email;

        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderkejadianRisiko();
                $scope.kejadianRisiko.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
    }


    $scope.renderkejadianRisiko = function () {
        NProgress.start();
        var apiUrl = "/api/MasterkejadianRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kejadianRisiko.data = response;
            console.log(JSON.stringify(response));
            NProgress.done();
        });
    }

    $scope.renderKategoriRisiko = function () {
        var apiUrl = "/api/MasterKategoriRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.kategoriRisiko = response;
            console.log(JSON.stringify(response));
        });
    }

    $scope.renderSubKategoriRisiko = function () {
        var apiUrl = "/api/MasterSubKategoriRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.subKategoriRisiko = response;
            console.log(JSON.stringify(response));
        });
    }

    $scope.renderAreaDampak = function () {
        var apiUrl = "/api/MasterAreaDampak";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.areaDampak = response;
            console.log(JSON.stringify(response));
        });
    }

    $scope.formLoad();
});