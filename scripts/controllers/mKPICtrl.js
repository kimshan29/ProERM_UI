mainApp.controller("mKPICtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {
    $scope.currentUser = {};
    $scope.KPI = {};
    $scope.KPI.data = {};
    $scope.KPI.input = {};


    $scope.KPI.isEditMode = false;
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

        $scope.renderKPI();
        $scope.renderKategoriRisiko();
        $scope.renderSubKategoriRisiko();
        $scope.renderAreaDampak();
    }

    $scope.eventClickAdd = function () {
        $scope.KPI.input = {};
        $scope.KPI.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderKPI();
        $scope.KPI.isEditMode = false;
        NProgress.done();
    }

    $scope.eventClickSave = function () {

        var apiUrl = "/api/MasterKPI";
        // $scope.KPI.input.id = "";
        $scope.form.userEmail = $scope.currentUser.email;

        console.log(JSON.stringify($scope.form));

        HttpRequest.post(apiUrl, $scope.form).success(function (response) {
            $scope.renderKPI();
            $scope.KPI.isEditMode = false;
        });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterKPI/" + id;



        $scope.KPI.input.userEmail = $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            console.log(JSON.stringify(response));
            $scope.KPI.input = response;
            $scope.KPI.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();
        var apiUrl = "/api/MasterKPI/" + id + "?email=" + $scope.currentUser.email;

        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderKPI();
                $scope.KPI.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
    }


    $scope.renderKPI = function () {
        NProgress.start();
        var apiUrl = "/api/MasterKPI";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.KPI.data = response;
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