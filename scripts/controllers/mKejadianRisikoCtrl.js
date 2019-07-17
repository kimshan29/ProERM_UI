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

    }

    $scope.eventClickAdd = function () {
        $scope.kejadianRisiko.input = {};
        $scope.kejadianRisiko.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderkejadianRisiko();
        $scope.kejadianRisiko.isEditMode = false;
        $scope.clearData();
        NProgress.done();
    }

    $scope.eventClickSave = function () {

        var apiUrl = "/api/MasterKejadianRisiko";
        // $scope.kejadianRisiko.input.id = "";
        $scope.form.userEmail = $scope.currentUser.email;

        console.log(JSON.stringify($scope.form));

        HttpRequest.post(apiUrl, $scope.kejadianRisiko.input).success(function (response) {
            $scope.renderkejadianRisiko();
            $scope.kejadianRisiko.isEditMode = false;
        });
    }

    $scope.eventSearchByYear = (year) => {
        NProgress.start();
        var apiUrl = "/api/MasterKejadianRisiko?tahun=" + year;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kejadianRisiko.data = response;
            console.log("Kejadian Risiko:" + JSON.stringify($scope.kejadianRisiko.data));
            NProgress.done();
        });
    }

    $scope.clearData = () => {
        $scope.form = '';
    }
    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterKejadianRisiko/" + id;

        $scope.kejadianRisiko.input.userEmail = $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            console.log(JSON.stringify(response));
            $scope.form = response;
            $scope.kejadianRisiko.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();
        var apiUrl = "/api/MasterKejadianRisiko/" + id + "?email=" + $scope.currentUser.email;

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
        var apiUrl = "/api/MasterKejadianRisiko";
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

    $scope.getSubKategori = (idKategori) => {
        // alert(idKategori)
        console.log(idKategori);

        var apiUrl = "/api/GetSubKategori/" + idKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.subKategoriRisiko = response;
            console.log(JSON.stringify(response));
        });
    }



    $scope.formLoad();
});