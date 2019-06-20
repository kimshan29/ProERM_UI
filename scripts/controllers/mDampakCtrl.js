mainApp.controller("mDampakCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};

    $scope.form = {};
    $scope.dampak = {};
    $scope.dampak.isEditMode = false;
    $scope.master = {};
    $scope.master.tahun = [];

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);


        //Master Tahun
        var years = Helper.generateStackedYears(2018, 2);
        $scope.master.tahun = years;

        $scope.renderdataDampak();
        $scope.renderPeringkatDampak();
        $scope.renderAreaDampak();
    }

    //Event Handlers ===================================================================================================================
    $scope.eventClickAdd = function () {
        $scope.form = {};
        $scope.dampak.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        $scope.renderdataDampak();
        $scope.dampak.isEditMode = false;
    }

    $scope.renderdataDampak = function () {
        NProgress.start();
        // alert("test")
        var apiUrl = "/api/MasterDampak";
        // console.log(apiUrl);

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.dampak.data = response;
            // console.log(JSON.stringify($scope.dampak.data));

            NProgress.done();
        });
    }

    $scope.searchByTahun = function (tahun) {
        NProgress.start();
        // alert("test")
        var apiUrl = "/api/MasterDampak?tahun=" + tahun;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.dampak.data = response;
            NProgress.done();
        });
    }

    $scope.renderPeringkatDampak = function () {
        var apiUrl = "/api/MasterPeringkatDampak";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.peringkatDampak = response;
            // console.log(JSON.stringify($scope.master.peringkatDampak));

        });
    }

    $scope.renderAreaDampak = function () {
        var apiUrl = "/api/MasterAreaDampak";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.areaDampak = response;
            // console.log(JSON.stringify($scope.master.areaDampak));

        });
    }
    $scope.eventClickSave = function () {
        // $scope.form.id = "";
        console.log(JSON.stringify($scope.form));


        var apiUrl = "/api/MasterDampak";
        HttpRequest.post(apiUrl, $scope.form).success(function (response) {
            $scope.renderdataDampak();
            $scope.dampak.isEditMode = false;
        });
    }

    $scope.eventEditDampak = function (id) {
        var apiUrl = "/api/MasterDampak/" + id;
        HttpRequest.get(apiUrl).success(function (response) {
            NProgress.start();
            $scope.form = response;
            $scope.dampak.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventHapusDampak = function (id, name) {
        var apiUrl = "/api/MasterDampak/" + id + "?email=" + $scope.currentUser.email;
        var hapus = confirm("Hapus " + name + "?");

        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                NProgress.start();
                $scope.renderdataDampak();
                $scope.dampak.isEditMode = false;
                NProgress.done();
            });
        }
    }

    //Start of Application =============================================================================================================
    $scope.formLoad();
});