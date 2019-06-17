mainApp.controller("mTingkatRisikoCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};

    $scope.tingkatRisiko = {};
    $scope.tingkatRisiko.data = {};
    $scope.tingkatRisiko.input = {};
    $scope.tingkatRisiko.master = {};
    $scope.tingkatRisiko.isEditMode = false;

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);
        
        $scope.renderDataTingkatRisiko();
    }

    $scope.renderDataTingkatRisiko = function () {
        NProgress.start();

        var apiUrl = "/api/MasterTingkatRisiko";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.tingkatRisiko.data = response;
            
            var currentYear = new Date().getFullYear();
            $scope.tingkatRisiko.master.tahun = [];
            for (var i = currentYear - 10; i <= currentYear + 10; i++) {
                $scope.tingkatRisiko.master.tahun.push(i);
            };
            

            var apiUrl = "/api/MasterDampak";
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.tingkatRisiko.master.dampak = response;
            }).error(function (response, code) {
                
            });

            var apiUrl = "/api/MasterKemungkinan";
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.tingkatRisiko.master.kemungkinan = response;
            }).error(function (response, code) {
                
            });

            var apiUrl = "/api/MasterTingkatRisikoCombo";
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.tingkatRisiko.master.tingkatRisiko = response;
            }).error(function (response, code) {
                
            });

            var apiUrl = "/api/MasterWarna";
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.tingkatRisiko.master.warna = response;
            }).error(function (response, code) {
                
            });

            NProgress.done();

        }).error(function (response, code) {
            NProgress.done();
            alert(code + '</br>' + response);
        });
    }

    //Event Handlers ===================================================================================================================
    $scope.eventClickAdd = function () {
        $scope.tingkatRisiko.input = {};
        $scope.tingkatRisiko.isEditMode = true;
        $scope.tingkatRisiko.input = {
                                        id: "00000000-0000-0000-0000-000000000000",
                                        tahun: 2,
                                        dampak: {
                                            id: 1,
                                            dampak: ""
                                        },
                                        kemungkinan: {
                                            id: 1,
                                            kemungkinan: ""
                                        },
                                        tingkatRisiko: {
                                            id: "",
                                            tingrisk: "",
                                            idWarna: "",
                                            warna: ""
                                        }
                                    };
    }

    $scope.eventClickCancel = function () {
        $scope.renderDataTingkatRisiko();
        $scope.tingkatRisiko.isEditMode = false;
    }

    $scope.eventClickSave = function () {
        var apiUrl = "/api/MasterTingkatRisiko";

        var data = $scope.tingkatRisiko.input;
        HttpRequest.post(apiUrl, data).success(function (response) {
            $scope.renderDataTingkatRisiko();
            $scope.tingkatRisiko.isEditMode = false;
        })
        .error(function (response, code) {
            var data = {
                title: "TINGKAT RISIKO",
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

        var apiUrl = "/api/MasterTingkatRisiko/" + id;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.tingkatRisiko.input = response;
            $scope.tingkatRisiko.isEditMode = true;
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "TINGKAT RISIKO",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.eventClickHapus = function (id, name) {

        var apiUrl = "/api/MasterTingkatRisiko/" + id;
        var hapus = confirm("Hapus " + name + "?");

        if (hapus) {
            NProgress.start();

            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderDataTingkatRisiko();
                $scope.tingkatRisiko.isEditMode = false;
                NProgress.done();
            })
            .error(function (response, code) {
                NProgress.done();

                var data = {
                    title: "TINGKAT RISIKO",
                    exception: response,
                    exceptionCode: code,
                    operation: "DELETE",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
        }
    }

    // EVENT CHANGE

    $scope.eventChangeTahun = function () {
        var masterTahun = $scope.tingkatRisiko.master.tahun;
        var selectedTahun = Helper.findItem(masterTahun, "id", $scope.tingkatRisiko.input.tahun.id);
        $scope.tingkatRisiko.input.tahun.id = selectedTahun.id;
        $scope.tingkatRisiko.input.tahun.name = selectedTahun.name;
    }

    $scope.eventChangeDampak = function () {
        var masterDampak = $scope.tingkatRisiko.master.dampak;
        var selectedDampak = Helper.findItem(masterDampak, "id", $scope.tingkatRisiko.input.dampak.id);
        $scope.tingkatRisiko.input.dampak.id = selectedDampak.id;
        $scope.tingkatRisiko.input.dampak.dampak = selectedDampak.dampak;
    }

    $scope.eventChangeKemungkinan = function () {
        var masterKemungkinan = $scope.tingkatRisiko.master.kemungkinan;
        var selectedKemungkinan = Helper.findItem(masterKemungkinan, "id", $scope.tingkatRisiko.input.kemungkinan.id);
        $scope.tingkatRisiko.input.kemungkinan.id = selectedKemungkinan.id;
        $scope.tingkatRisiko.input.kemungkinan.kemungkinan = selectedKemungkinan.kemungkinan;
    }

    $scope.eventChangeTingkatRisiko = function () {
        var masterTingkatRisiko = $scope.tingkatRisiko.master.tingkatRisiko;
        var selectedTingkatRisiko = Helper.findItem(masterTingkatRisiko, "id", $scope.tingkatRisiko.input.tingkatRisiko.id);
        $scope.tingkatRisiko.input.tingkatRisiko.id = selectedTingkatRisiko.id;
        $scope.tingkatRisiko.input.tingkatRisiko.tingrisk = selectedTingkatRisiko.tingrisk;
        $scope.tingkatRisiko.input.tingkatRisiko.idWarna = selectedTingkatRisiko.idWarna;
        $scope.tingkatRisiko.input.tingkatRisiko.warna = selectedTingkatRisiko.warna;
    }

    //$scope.eventChangeWarna = function () {
    //    var masterWarna = $scope.tingkatRisiko.master.warna;
    //    var selectedWarna = Helper.findItem(masterWarna, "id", $scope.tingkatRisiko.input.warna.id);
    //    $scope.tingkatRisiko.input.warna.id = selectedWarna.id;
    //    $scope.tingkatRisiko.input.warna.tingkatRisiko = selectedWarna.tingkatRisiko;
    //    $scope.tingkatRisiko.input.warna.warna = selectedWarna.warna;
    //    $scope.tingkatRisiko.input.warna.rgb = selectedWarna.rgb;
    //}

    

    //Start of Application =============================================================================================================
    $scope.formLoad();
});