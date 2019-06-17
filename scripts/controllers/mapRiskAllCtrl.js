mainApp.controller("mapRiskAllCtrl", function ($scope, $routeParams, $location, $cookies, HttpRequest, Helper, FileHelper, Constant, Model, DTOptionsBuilder, DTColumnBuilder) {
    $scope.title = "PETA PROFIL RISIKO AGREGASI";
    $scope.currentUser = {};

    $scope.dataIR = [];
    $scope.dataRisikoIR = [];
    $scope.showDataRisikoIR = [];

    $scope.dataCR = [];
    $scope.dataRisikoCR = [];
    $scope.showDataRisikoCR = [];

    $scope.dataRR = [];
    $scope.dataRisikoRR = [];
    $scope.showDataRisikoRR = [];

    $scope.dataAR = [];
    $scope.dataRisikoAR = [];
    $scope.showDataRisikoAR = [];

    $scope.dataDetail = [];

    $scope.tahun = null;
    $scope.bulan = null;
    $scope.jenis = Constant.emptyGuid;
    $scope.kategori = Constant.emptyGuid;
    $scope.subKategori = Constant.emptyGuid;
    $scope.kelompokRisiko = Constant.emptyGuid;
    $scope.unit = Constant.emptyGuid;
    $scope.isDownloadableIR = false;
    $scope.isDownloadableCR = false;
    $scope.isDownloadableRR = false;
    $scope.isDownloadableAR = false;

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

        $scope.renderMaster();
        $scope.renderMap();
    }

    $scope.renderMap = function () {
        NProgress.start();
        var apiUrl = "/api/listPetaRisiko/" + $scope.tahun;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.dataIR = angular.copy(response);
            $scope.dataCR = angular.copy(response);
            $scope.dataRR = angular.copy(response);
            $scope.dataAR = angular.copy(response);

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

        //Inherent Risk
        var apiUrl = "/api/petaInherentRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.isDownloadableIR = true;

            var indexIR = 0;
            for (var i = 5; i > 0; i--) {

                var itemIR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                for (var j = 1; j <= 5; j++) {
                    var itemIR2 = angular.copy(Helper.findItem(itemIR, "peringkatDampak", j));

                    $scope.showDataRisikoIR[indexIR] = false;

                    if (itemIR2 == undefined) {
                        $scope.dataIR[indexIR].jumlahKelompokRisiko = 0;
                        $scope.dataRisikoIR[indexIR] = [];
                    }
                    else {
                        $scope.dataIR[indexIR].jumlahKelompokRisiko = itemIR2.jumlahKelompokRisiko;

                        var dtRisikoIR = [];
                        for (var k = 0; k < itemIR2.jumlahKelompokRisiko; k++) {
                            dtRisikoIR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexIR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexIR + k)).substr(-3) }
                        }

                        $scope.dataRisikoIR[indexIR] = dtRisikoIR;
                    }
                    indexIR++;
                }
            }

            //Start of Controlled Risk ======================================================
            apiUrl = "/api/petaControlledRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

            HttpRequest.get(apiUrl).success(function (response) {
                $scope.isDownloadableCR = true;

                var indexCR = 0;
                for (var i = 5; i > 0; i--) {

                    var itemCR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                    for (var j = 1; j <= 5; j++) {
                        var itemCR2 = angular.copy(Helper.findItem(itemCR, "peringkatDampak", j));

                        $scope.showDataRisikoCR[indexCR] = false;

                        if (itemCR2 == undefined) {
                            $scope.dataCR[indexCR].jumlahKelompokRisiko = 0;
                            $scope.dataRisikoCR[indexCR] = [];
                        }
                        else {
                            $scope.dataCR[indexCR].jumlahKelompokRisiko = itemCR2.jumlahKelompokRisiko;

                            var dtRisikoCR = [];
                            for (var k = 0; k < itemCR2.jumlahKelompokRisiko; k++) {
                                dtRisikoCR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexCR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexCR + k)).substr(-3) }
                            }

                            $scope.dataRisikoCR[indexCR] = dtRisikoCR;
                        }
                        indexCR++;
                    }
                }

                //Start of Residual Risk ======================================================
                apiUrl = "/api/petaResidualRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

                HttpRequest.get(apiUrl).success(function (response) {
                    $scope.isDownloadableRR = true;

                    var indexRR = 0;
                    for (var i = 5; i > 0; i--) {

                        var itemRR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                        for (var j = 1; j <= 5; j++) {
                            var itemRR2 = angular.copy(Helper.findItem(itemRR, "peringkatDampak", j));

                            $scope.showDataRisikoRR[indexRR] = false;

                            if (itemRR2 == undefined) {
                                $scope.dataRR[indexRR].jumlahKelompokRisiko = 0;
                                $scope.dataRisikoRR[indexRR] = [];
                            }
                            else {
                                $scope.dataRR[indexRR].jumlahKelompokRisiko = itemRR2.jumlahKelompokRisiko;

                                var dtRisikoRR = [];
                                for (var k = 0; k < itemRR2.jumlahKelompokRisiko; k++) {
                                    dtRisikoRR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexRR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexRR + k)).substr(-3) }
                                }

                                $scope.dataRisikoRR[indexRR] = dtRisikoRR;
                            }
                            indexRR++;
                        }
                    }

                    //Start of Actual Risk ======================================================
                    apiUrl = "/api/petaActualRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

                    HttpRequest.get(apiUrl).success(function (response) {
                        $scope.isDownloadableAR = true;

                        var indexAR = 0;
                        for (var i = 5; i > 0; i--) {

                            var itemAR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                            for (var j = 1; j <= 5; j++) {
                                var itemAR2 = angular.copy(Helper.findItem(itemAR, "peringkatDampak", j));

                                $scope.showDataRisikoAR[indexAR] = false;

                                if (itemAR2 == undefined) {
                                    $scope.dataAR[indexAR].jumlahKelompokRisiko = 0;
                                    $scope.dataRisikoAR[indexAR] = [];
                                }
                                else {
                                    $scope.dataAR[indexAR].jumlahKelompokRisiko = itemAR2.jumlahKelompokRisiko;

                                    var dtRisikoAR = [];
                                    for (var k = 0; k < itemAR2.jumlahKelompokRisiko; k++) {
                                        dtRisikoAR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexAR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexAR + k)).substr(-3) }
                                    }

                                    $scope.dataRisikoAR[indexAR] = dtRisikoAR;
                                }
                                indexAR++;
                            }
                        }

                        NProgress.done();
                    })
                    .error(function (response, code) {
                        NProgress.done();
                        $scope.isDownloadableAR = false;

                        var data = {
                            title: "Nilai Peta Risiko Actual Risk",
                            exception: response,
                            exceptionCode: code,
                            operation: "GET",
                            apiUrl: apiUrl
                        };

                        Helper.notifErrorHttp(data);
                    });
                    //End of Actual Risk ========================================================

                })
                .error(function (response, code) {
                    NProgress.done();
                    $scope.isDownloadableRR = false;

                    var data = {
                        title: "Nilai Peta Risiko Residual Risk",
                        exception: response,
                        exceptionCode: code,
                        operation: "GET",
                        apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                });
                //End of Residual Risk ========================================================

            })
            .error(function (response, code) {
                NProgress.done();
                $scope.isDownloadableCR = false;

                var data = {
                    title: "Nilai Peta Risiko Controlled Risk",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
            //End of Controlled Risk ========================================================

        })
        .error(function (response, code) {
            NProgress.done();
            $scope.isDownloadableIR = false;

            var data = {
                title: "Nilai Peta Risiko Inherent Risk",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.renderDataIR = function () {
        NProgress.start();

        var apiUrlIR = "/api/petaInherentRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

        HttpRequest.get(apiUrlIR).success(function (response) {
            $scope.isDownloadableIR = true;
            console.log(apiUrlIR, JSON.stringify(response));

            var indexIR = 0;
            for (var i = 5; i > 0; i--) {

                var itemIR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                for (var j = 1; j <= 5; j++) {
                    var itemIR2 = angular.copy(Helper.findItem(itemIR, "peringkatDampak", j));

                    $scope.showDataRisikoIR[indexIR] = false;

                    if (itemIR2 == undefined) {
                        $scope.dataIR[indexIR].jumlahKelompokRisiko = 0;
                        $scope.dataRisikoIR[indexIR] = [];
                    }
                    else {
                        $scope.dataIR[indexIR].jumlahKelompokRisiko = itemIR2.jumlahKelompokRisiko;

                        var dtRisikoIR = [];
                        for (var k = 0; k < itemIR2.jumlahKelompokRisiko; k++) {
                            dtRisikoIR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexIR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexIR + k)).substr(-3) }
                        }

                        $scope.dataRisikoIR[indexIR] = dtRisikoIR;
                    }
                    indexIR++;
                }
            }

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            $scope.isDownloadableIR = false;

            var data = {
                title: "Nilai Peta Risiko Inherent Risk",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrlIR
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.renderDataCR = function () {
        NProgress.start();

        var apiUrlCR = "/api/petaControlledRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

        HttpRequest.get(apiUrlCR).success(function (response) {
            $scope.isDownloadableCR = true;
            console.log(apiUrlCR, JSON.stringify(response));

            var indexCR = 0;
            for (var i = 5; i > 0; i--) {

                var itemCR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                for (var j = 1; j <= 5; j++) {
                    var itemCR2 = angular.copy(Helper.findItem(itemCR, "peringkatDampak", j));

                    $scope.showDataRisikoCR[indexCR] = false;

                    if (itemCR2 == undefined) {
                        $scope.dataCR[indexCR].jumlahKelompokRisiko = 0;
                        $scope.dataRisikoCR[indexCR] = [];
                    }
                    else {
                        $scope.dataCR[indexCR].jumlahKelompokRisiko = itemCR2.jumlahKelompokRisiko;

                        var dtRisikoCR = [];
                        for (var k = 0; k < itemCR2.jumlahKelompokRisiko; k++) {
                            dtRisikoCR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexCR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexCR + k)).substr(-3) }
                        }

                        $scope.dataRisikoCR[indexCR] = dtRisikoCR;
                    }
                    indexCR++;
                }
            }

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            $scope.isDownloadableCR = false;

            var data = {
                title: "Nilai Peta Risiko Controlled Risk",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrlCR
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.renderDataRR = function () {
        NProgress.start();

        var apiUrlRR = "/api/petaResidualRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

        HttpRequest.get(apiUrlRR).success(function (response) {
            $scope.isDownloadableRR = true;
            console.log(apiUrlRR, JSON.stringify(response));

            var indexRR = 0;
            for (var i = 5; i > 0; i--) {

                var itemRR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                for (var j = 1; j <= 5; j++) {
                    var itemRR2 = angular.copy(Helper.findItem(itemRR, "peringkatDampak", j));

                    $scope.showDataRisikoRR[indexRR] = false;

                    if (itemRR2 == undefined) {
                        $scope.dataRR[indexRR].jumlahKelompokRisiko = 0;
                        $scope.dataRisikoRR[indexRR] = [];
                    }
                    else {
                        $scope.dataRR[indexRR].jumlahKelompokRisiko = itemRR2.jumlahKelompokRisiko;

                        var dtRisikoRR = [];
                        for (var k = 0; k < itemRR2.jumlahKelompokRisiko; k++) {
                            dtRisikoRR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexRR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexRR + k)).substr(-3) }
                        }

                        $scope.dataRisikoRR[indexRR] = dtRisikoRR;
                    }
                    indexRR++;
                }
            }

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            $scope.isDownloadableRR = false;

            var data = {
                title: "Nilai Peta Risiko Residual Risk",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrlRR
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.renderDataAR = function () {
        NProgress.start();

        var apiUrlAR = "/api/petaActualRisk?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit);

        HttpRequest.get(apiUrlAR).success(function (response) {
            $scope.isDownloadableAR = true;
            console.log(apiUrlAR, JSON.stringify(response));

            var indexAR = 0;
            for (var i = 5; i > 0; i--) {

                var itemAR = angular.copy(Helper.findItems(response, "peringkatKemungkinan", i));
                for (var j = 1; j <= 5; j++) {
                    var itemAR2 = angular.copy(Helper.findItem(itemAR, "peringkatDampak", j));

                    $scope.showDataRisikoAR[indexAR] = false;

                    if (itemAR2 == undefined) {
                        $scope.dataAR[indexAR].jumlahKelompokRisiko = 0;
                        $scope.dataRisikoAR[indexAR] = [];
                    }
                    else {
                        $scope.dataAR[indexAR].jumlahKelompokRisiko = itemAR2.jumlahKelompokRisiko;

                        var dtRisikoAR = [];
                        for (var k = 0; k < itemAR2.jumlahKelompokRisiko; k++) {
                            dtRisikoAR[k] = { kodeRisiko: "RISK01601" + ("000" + (indexAR + k)).substr(-3), namaRisiko: "Risiko dengan kode RISK01601" + ("000" + (indexAR + k)).substr(-3) }
                        }

                        $scope.dataRisikoAR[indexAR] = dtRisikoAR;
                    }
                    indexAR++;
                }
            }

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            $scope.isDownloadableAR = false;

            var data = {
                title: "Nilai Peta Risiko Actual Risk",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrlAR
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
        //$scope.renderDataIR();
        //$scope.renderDataCR();
        //$scope.renderDataRR();
        //$scope.renderDataAR();
    };

    $scope.cellMapClick = function (idMap, modul) {
        NProgress.start();
        $scope.dataDetail = [];

        var apiUrl = "/api/DetailMapRisk/" + idMap + "?tahun=" + $scope.tahun + "&bulan=" + $scope.bulan + "&idjenis=" + $scope.guidToEmpty($scope.jenis) + "&idkategori=" + $scope.guidToEmpty($scope.kategori) + "&idsubkategori=" + $scope.guidToEmpty($scope.subKategori) + "&idkelompok=" + $scope.guidToEmpty($scope.kelompokRisiko) + "&identitas=" + $scope.guidToEmpty($scope.unit) + "&mapType=" + modul;
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

    $scope.cellMapIRClick = function (idMap) {
        $scope.cellMapClick(idMap, 'ir')
    };

    $scope.cellMapCRClick = function (idMap) {
        $scope.cellMapClick(idMap, 'cr')
    };

    $scope.cellMapRRClick = function (idMap) {
        $scope.cellMapClick(idMap, 'rr')
    };

    $scope.cellMapARClick = function (idMap) {
        $scope.cellMapClick(idMap, 'ar')
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