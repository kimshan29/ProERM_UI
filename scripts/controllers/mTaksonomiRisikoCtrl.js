mainApp.controller("mTaksonomiRisikoCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {
    $scope.currentUser = {};
    $scope.taksonomiRisiko = {};
    $scope.taksonomiRisiko.data = {};
    $scope.taksonomiRisiko.input = {};


    $scope.taksonomiRisiko.isEditMode = false;
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

        $scope.renderTaksonomiRisiko();
        $scope.renderKategoriRisiko();
        $scope.renderSubKategoriRisiko();

    }


    $scope.eventClickAdd = function () {
        $scope.taksonomiRisiko.input = {};
        $scope.taksonomiRisiko.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderTaksonomiRisiko();
        $scope.taksonomiRisiko.isEditMode = false;
        $scope.clearData();
        NProgress.done();
    }

    $scope.clearData = () => {
        $scope.form = '';
    }
    $scope.eventClickSave = function () {

        var apiUrl = "/api/MasterTaksonomiRisiko";
        // $scope.taksonomiRisiko.input.id = "";
        console.log(JSON.stringify($scope.form));

        HttpRequest.post(apiUrl, $scope.form).success(function (response) {
            $scope.renderTaksonomiRisiko();
            $scope.taksonomiRisiko.isEditMode = false;
        });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterTaksonomiRisiko/" + id;
        HttpRequest.get(apiUrl).success(function (response) {
            console.log(JSON.stringify(response));
            $scope.form = response;
            console.log($scope.form.subKategoriRisiko.id);

            $scope.getKelompokRisiko($scope.form.subKategoriRisiko);
            $scope.getKejadianRisiko($scope.form.subKategoriRisiko);
            $scope.taksonomiRisiko.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();
        var apiUrl = "/api/MasterTaksonomiRisiko/" + id + "?email=" + $scope.currentUser.email;

        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderTaksonomiRisiko();
                $scope.taksonomiRisiko.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
    }


    $scope.renderTaksonomiRisiko = function () {
        NProgress.start();
        var apiUrl = "/api/MasterTaksonomiRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.taksonomiRisiko.data = response;
            console.log("Taksonomi:" + JSON.stringify($scope.taksonomiRisiko.data));
            NProgress.done();
        });
    }

    $scope.eventSearchByYear = (year) => {
        NProgress.start();
        var apiUrl = "/api/MasterTaksonomiRisiko?tahun=" + year;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.taksonomiRisiko.data = response;
            console.log("Taksonomi:" + JSON.stringify($scope.taksonomiRisiko.data));
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


    $scope.getSubKategori = (idKategori) => {
        // alert(idKategori)
        console.log(idKategori);

        var apiUrl = "/api/GetSubKategori/" + idKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.subKategoriRisiko = response;
            console.log(JSON.stringify(response));
        });
    }

    $scope.getKejadianRisiko = (idSubKatRisiko) => {
        var apiUrl = "/api/GetKejadianRisiko/" + idSubKatRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.kejadianRisiko = response;
            console.log("Kejadian Risiko: " + JSON.stringify($scope.master.kejadianRisiko));
        });
    }



    $scope.getKelompokRisiko = (idSubKatRisiko) => {
        console.log(idSubKatRisiko);

        var apiUrl = "/api/GetKelompokRisiko/" + idSubKatRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.kelompokRisiko = response;
            console.log(JSON.stringify(response));
        });
    }


    $scope.formLoad();
});