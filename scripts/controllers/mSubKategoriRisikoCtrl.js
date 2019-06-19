mainApp.controller("mSubKategoriRisikoCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {
    $scope.currentUser = {};

    $scope.subKategoriRisiko = {};
    $scope.subKategoriRisiko.data = {};

    $scope.form = {};
    $scope.master = {};

    $scope.subKategoriRisiko.isEditMode = false;


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

        $scope.rendersubKategoriRisiko();
    }

    $scope.eventClickAdd = function () {
        $scope.form = {};
        $scope.subKategoriRisiko.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.rendersubKategoriRisiko();
        $scope.subKategoriRisiko.isEditMode = false;
        NProgress.done();
    }

    $scope.eventClickSave = function () {

        // var apiUrl = "/api/MastersubKategoriRisiko";
        $scope.form.id = "";
        $scope.form.userEmail = $scope.currentUser.email;

        console.log(JSON.stringify($scope.form));

        // HttpRequest.post(apiUrl, $scope.form).success(function (response) {
        //     $scope.rendersubKategoriRisiko();
        //     $scope.subKategoriRisiko.isEditMode = false;
        // });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MastersubKategoriRisiko/" + id;

        $scope.form.userEmail = $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.form = response;
            $scope.subKategoriRisiko.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();
        var apiUrl = "/api/MastersubKategoriRisiko/" + id + "?email=" + $scope.currentUser.email;

        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.rendersubKategoriRisiko();
                $scope.subKategoriRisiko.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
    }


    $scope.rendersubKategoriRisiko = function () {
        NProgress.start();
        var apiUrl = "/api/MastersubKategoriRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.subKategoriRisiko.data = response;

            // console.log(JSON.stringify($scope.subKategoriRisiko.data));

            NProgress.done();
        });
    }

    $scope.formLoad();
});