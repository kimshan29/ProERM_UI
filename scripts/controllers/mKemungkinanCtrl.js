mainApp.controller("mKemungkinanCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {
    $scope.currentUser = {};
    $scope.kemungkinan = {};
    $scope.kemungkinan.data = {};
    $scope.kemungkinan.input = {};


    $scope.kemungkinan.isEditMode = false;
    $scope.master = {};
    $scope.master.tahun = [];
    $scope.master.peringkatKemungkinan = [];

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

        $scope.renderKemungkinan();
        $scope.renderTipeKemungkinan();
        $scope.renderPeringkatKemungkinan();


    }

    $scope.eventClickAdd = function () {
        $scope.kemungkinan.input = {};
        $scope.kemungkinan.isEditMode = true;
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderKemungkinan();
        $scope.kemungkinan.isEditMode = false;
        $scope.clearForm();
        NProgress.done();
    }

    $scope.eventClickSave = function () {

        var apiUrl = "/api/MasterKemungkinan";
        $scope.form.userEmail = $scope.currentUser.email;


        console.log(JSON.stringify($scope.form));

        HttpRequest.post(apiUrl, $scope.form).success(function (response) {
            $scope.renderKemungkinan();
            $scope.kemungkinan.isEditMode = false;
        });
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterKemungkinan/" + id;

        HttpRequest.get(apiUrl).success(function (response) {
            console.log(JSON.stringify(response));
            $scope.form = response;
            $scope.kemungkinan.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();
        var apiUrl = "/api/MasterKemungkinan/" + id + "?email=" + $scope.currentUser.email;

        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderKemungkinan();
                $scope.kemungkinan.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
    }


    $scope.renderKemungkinan = function () {
        NProgress.start();
        var apiUrl = "/api/MasterKemungkinan";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kemungkinan.data = response;
            // console.log(JSON.stringify(response));
            NProgress.done();
        });
    }

    $scope.renderPeringkatKemungkinan = function () {
        var apiUrl = "/api/MasterPeringkatKemungkinan";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.peringkatKemungkinan = response;
            console.log(JSON.stringify(response));

        })

    }

    $scope.renderTipeKemungkinan = function () {
        NProgress.start();
        var apiUrl = "/api/MasterTipeKemungkinan";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.tipeKemungkinan = response;
            console.log(JSON.stringify(response));
            // alert("Tipe Kemungkinan")
            NProgress.done();
        });
    }

    $scope.clearForm = () => {
        $scope.form = {
            peringkatKemungkinan: '',
            tipeKemungkinan: '',
            kemungkinan: '',
            isActive: ''

        }
    }



    $scope.formLoad();
});