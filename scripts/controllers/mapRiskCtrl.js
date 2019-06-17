mainApp.controller("mapRiskCtrl", function ($scope, $routeParams, $location, $cookies, HttpRequest, Helper, FileHelper, Constant, Model, DTOptionsBuilder, DTColumnBuilder) {
    $scope.modul = Helper.isNullOrEmpty($routeParams.modul) ? "CR" : $routeParams.modul.toUpperCase();
    $scope.title = "";
    $scope.currentUser = {};

    $scope.data = [];
    $scope.dataDetail = [];

    $scope.tahun = null;
    $scope.bulan = null;
    $scope.jenis = Constant.emptyGuid;
    $scope.kategori = Constant.emptyGuid;
    $scope.subKategori = Constant.emptyGuid;
    $scope.kelompokRisiko = Constant.emptyGuid;
    $scope.unit = Constant.emptyGuid;
    $scope.isDownloadable = false;

    $scope.master = {};
    $scope.master.tahun = [];
    $scope.master.jenis = [];
    $scope.master.kategori = [];
    $scope.master.subKategori = [];
    $scope.master.kelompokRisiko = [];
    $scope.master.unit = [];

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }

        if ($scope.modul === "CR")
            $scope.title = "PETA RISIKO AGREGASI CONTROLLED RISK";
        else if ($scope.modul === "AR")
            $scope.title = "PETA RISIKO AGREGASI ACTUAL RISK";
        else if ($scope.modul === "RR")
            $scope.title = "PETA RISIKO AGREGASI RESIDUAL RISK";
        else if ($scope.modul === "IR")
            $scope.title = "PETA RISIKO AGREGASI INHERENT RISK";
        else
            $scope.title = "PETA RISIKO AGREGASI CONTROLLED RISK";

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('responsive', true)
            .withOption('order', [0, 'desc'])
            .withDisplayLength(10)
            .withColumnFilter({
                aoColumns: [
                    {
                        type: 'text'
                    },
                    {
                        type: 'text'
                    },
                    {
                        type: 'text'
                    },
                    {
                        type: 'text'
                    }
                ]
            });

        $scope.renderMaster();
        $scope.renderMap();
    }

    $scope.renderMap = function () {
        NProgress.start();
        var apiUrl = "/api/listPetaRisiko/" + $scope.tahun;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "List Peta Risiko",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.renderData = function () {
        NProgress.start();

        var apiUrl = "/api/petaControlledRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

        if ($scope.modul === "AR")
            apiUrl = "/api/petaActualRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);
        else if ($scope.modul === "RR")
            apiUrl = "/api/petaResidualRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);
        else if ($scope.modul === "IR")
            apiUrl = "/api/petaInherentRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

        //console.log("peta", apiUrl);

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.isDownloadable = true;

            var index = 0;
            for (var i = 5; i > 0; i--) {

                var item = Helper.findItems(response, "peringkatKemungkinan", i);
                for (var j = 1; j <= 5; j++) {
                    var item2 = angular.copy(Helper.findItem(item, "peringkatDampak", j));

                    if (item2 == undefined)
                        $scope.data[index].jumlahKelompokRisiko = 0;
                    else
                        $scope.data[index].jumlahKelompokRisiko = item2.jumlahKelompokRisiko;
                    index++;
                }
            }

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            $scope.isDownloadable = false;

            var data = {
                title: "Nilai Peta Risiko",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.renderMaster = function () {
        NProgress.start();

        var currDate = new Date();
        $scope.tahun = currDate.getFullYear();
        $scope.bulan = currDate.getMonth() + 1;

        //Master Tahun
        var years = Helper.generateStackedYears(2010, 1);
        $scope.master.tahun = years;

        //Master Bulan
        var months = Helper.generateMonths();
        $scope.master.bulan = months;

        //Master Jenis
        var apiUrl = "/api/listJenisKajian";

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.master.jenis = response;
        })
        .error(function (response, code) {
            var data = {
                title: "List Jenis",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });

        //Master Kategori
        apiUrl = "/api/listKategoriPetaRisiko";

        HttpRequest.get(apiUrl).success(function (response) {
            response.unshift({ id: Constant.emptyGuid, name: "All" });
            $scope.master.kategori = response;
        })
        .error(function (response, code) {
            var data = {
                title: "List Kategori",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });

        //Master Sub Kategori
        apiUrl = "/api/listSubKategoriPetaRisiko/" + $scope.kategori;

        HttpRequest.get(apiUrl).success(function (response) {
            response.unshift({ id: Constant.emptyGuid, name: "All" });
            $scope.master.subKategori = response;
        })
        .error(function (response, code) {
            var data = {
                title: "List Sub Kategori",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });

        //Master Kelompok Risiko
        apiUrl = "/api/listKelompokPetaRisiko?idSubKategori=" + $scope.subKategori;

        HttpRequest.get(apiUrl).success(function (response) {
            response.unshift({ id: Constant.emptyGuid, name: "All" });
            $scope.master.kelompokRisiko = response;
        })
        .error(function (response, code) {
            var data = {
                title: "List Kelompok Risiko",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });

        //Master Unit
        apiUrl = "/api/listUnitPetaRisiko";

        HttpRequest.get(apiUrl).success(function (response) {
            response.unshift({ id: Constant.emptyGuid, name: "All" });
            $scope.master.unit = response;

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "List Unit",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    //Event Handlers ===================================================================================================================
    $scope.kategoriChange = function () {
        if (Helper.isNullOrEmpty($scope.kategori))
            $scope.kategori = Constant.emptyGuid;

        var apiUrl = "/api/listSubKategoriPetaRisiko/" + $scope.kategori;

        HttpRequest.get(apiUrl).success(function (response) {
            response.unshift({ id: Constant.emptyGuid, name: "All" });
            $scope.master.subKategori = response;
        })
        .error(function (response, code) {
            var data = {
                title: "List Sub Kategori",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.subKategoriChange = function () {
        if (Helper.isNullOrEmpty($scope.subKategori))
            $scope.subKategori = Constant.emptyGuid;

        var apiUrl = "/api/listKelompokPetaRisiko?idSubKategori=" + $scope.subKategori;

        HttpRequest.get(apiUrl).success(function (response) {
            response.unshift({ id: Constant.emptyGuid, name: "All" });
            $scope.master.kelompokRisiko = response;
        })
        .error(function (response, code) {
            var data = {
                title: "List Kelompok Risiko",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.downloadClick = function () {
        FileHelper.downloadPetaRisiko($scope.tahun, $scope.bulan, $scope.guidToEmpty($scope.jenis), $scope.guidToEmpty($scope.kategori), $scope.guidToEmpty($scope.subKategori), $scope.guidToEmpty($scope.kelompokRisiko), $scope.guidToEmpty($scope.unit), $scope.modul.toLowerCase());
    };

    $scope.refreshClick = function () {
        $scope.renderData();
    };

    $scope.cellMapClick = function (idMap) {
        NProgress.start();
        $scope.dataDetail = [];

        var apiUrl = "/api/DetailMapRisk/" + idMap + "?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit) + "&mapType=" + $scope.modul.toLowerCase();
        //console.log("detail", apiUrl);

        $scope.hasFinish = 'display:inherit;';

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.dataDetail = response;

            if (angular.element(document).ready) {
                $scope.hasFinish = 'display:none';
                NProgress.done();
            }
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Detail Peta Risiko",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });

        $("#modalDetail").modal({ backdrop: 'static', show: true });
    };

    $scope.guidToEmpty = function (pGuid) {
        var jenis = angular.copy(pGuid);

        if (Helper.isEmptyGuid(jenis))
            return "";
        else
            return jenis;
    }

    //Start of Application =============================================================================================================
    $scope.formLoad();
});