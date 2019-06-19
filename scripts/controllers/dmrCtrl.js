mainApp.controller("dmrCtrl", function ($scope, $routeParams, $cookies, $http, $injector, $sce, $location, Constant, HttpRequest, Model, Helper) {
    var $validationProvider = $injector.get('$validation');
    $scope.Helper = Helper;
    var currentUser = {};
    $scope.error = {};


    $scope.isInitMode = true;
    $scope.isEditMode = false;
    $scope.idDmr = Constant.emptyGuid;

    $scope.pk = {};
    $scope.pk.header = {};
    $scope.pk.data = {};
    $scope.pk.master = [];

    $scope.informasiUmum = {};
    $scope.informasiUmum.data = {};

    $scope.isInvestasi = false;

    $scope.informasiUmum.master = [];
    $scope.informasiUmum.isEditMode = false;

    $scope.pendahuluan = {};
    $scope.pendahuluan.data = {};
    $scope.pendahuluan.master = {};
    $scope.pendahuluan.isEditMode = false;

    $scope.kko = {};
    $scope.kko.data = {};
    $scope.kko.isEditMode = false;

    $scope.kkl = {};
    $scope.kkl.isEditMode = false;

    $scope.kh = {};
    $scope.kh.isEditMode = false;

    $scope.kkf = {};
    $scope.kkf.data = {};
    $scope.kkf.isEditMode = false;

    $scope.kesimpulan = {};
    $scope.kesimpulan.isEditMode = false;

    // KAJIAN RISIKO
    $scope.penetapanKonteks = {};
    $scope.penetapanKonteks.data = {};
    $scope.penetapanKonteks.master = {};
    $scope.penetapanKonteks.isEditMode = false;

    $scope.identifikasi = {};
    $scope.identifikasi.data = {};
    $scope.identifikasi.master = {};
    $scope.identifikasi.master.sasaranStrategis = [];
    $scope.identifikasi.master.sasaranOperasional = [];
    $scope.identifikasi.master.sasaranFinansial = [];
    $scope.identifikasi.sasaranStrategis = {};
    $scope.identifikasi.sasaranOperasional = {};
    $scope.identifikasi.sasaranFinansial = {};
    $scope.identifikasi.isEditMode = false;

    $scope.analisaEvaluasi = {};
    $scope.analisaEvaluasi.data = {};
    $scope.analisaEvaluasi.isEditMode = false;
    $scope.analisaEvaluasi.master = {};
    $scope.analisaEvaluasi.master.sasaranStrategis = [];
    $scope.analisaEvaluasi.master.sasaranOperasional = [];
    $scope.analisaEvaluasi.master.sasaranFinansial = [];
    $scope.analisaEvaluasi.master.peringkatDampak = [];
    $scope.analisaEvaluasi.master.efektivitasA = [];
    $scope.analisaEvaluasi.master.efektivitasA2 = [];
    $scope.analisaEvaluasi.master.efektivitasA3 = [];
    $scope.analisaEvaluasi.master.efektivitasDLI = [];
    $scope.analisaEvaluasi.master.efektivitasDLI2 = [];
    $scope.analisaEvaluasi.master.efektivitasDLI3 = [];

    $scope.rencanaMitigasi = {};
    $scope.rencanaMitigasi.data = {};
    $scope.rencanaMitigasi.master = {};
    $scope.rencanaMitigasi.isEditMode = false;
    $scope.panelClass1 = [];
    $scope.panelClass2 = [];

    $scope.persetujuan = {};
    $scope.persetujuan.data = {};
    $scope.persetujuan.isEditMode = false;

    $scope.logApprovals = [];
    $scope.isCurrentApprover = false;
    $scope.isDataEditable = false;
    $scope.approvalStatus = {};
    $scope.listNextApprover = [];
    $scope.listTujuanDisposisi = [];
    $scope.approver = {};
    $scope.reviser = {};
    $scope.dispositioner = {};
    $scope.isSubmitAble = false;
    $scope.rekomendasiComplete = true;
    $scope.approveDone = false;
    $scope.isSubmitClick = false;

    var idDmr = $routeParams.idDmr;

    // ====================================== SUBMIT, APPROVAL, REVISE ====================================\\
    $scope.getCurrentUser = function () {
        try {
            currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {
            currentUser = {};
        }
    }

    $scope.renderApprovalStatus = function () {
        NProgress.start();
        var apiUrl = "/api/DMRApprovalStatus/" + idDmr + "?email=" + currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.approvalStatus = response;

                if ($scope.approvalStatus.kodeApproval != 1) {
                    $scope.isSubmitAble = false;
                } else {
                    $scope.isSubmitAble = true;
                }

                $scope.isCurrentApprover = (response.currentApproval == currentUser.email) || (currentUser.email == "adminprorba@indonesiapower.co.id");
                $scope.isDataEditable = response.isDataEditable; //$scope.isCurrentApprover ; //&& response.kodeApproval == 1;
                $cookies.put('dmrApprovalStatus', JSON.stringify(response));

                apiUrl = "/api/DMRListNextApprover/" + idDmr;
                HttpRequest.get(apiUrl).success(function (response) {
                        $scope.listNextApprover = response;
                    })
                    .error(function (response, code) {
                        var data = {
                            title: "List Next Approver",
                            exception: response,
                            exceptionCode: code,
                            operation: "GET",
                            apiUrl: apiUrl
                        };

                        Helper.notifErrorHttp(data);
                    });

                apiUrl = "/api/DMRListTujuanDisposisi/" + idDmr;
                HttpRequest.get(apiUrl).success(function (response) {
                        $scope.listTujuanDisposisi = response;
                    })
                    .error(function (response, code) {
                        var data = {
                            title: "List Tujuan Disposisi",
                            exception: response,
                            exceptionCode: code,
                            operation: "GET",
                            apiUrl: apiUrl
                        };

                        Helper.notifErrorHttp(data);
                    });

                apiUrl = "/api/DMRLogTrail/" + idDmr;
                HttpRequest.get(apiUrl).success(function (response) {
                        $scope.logApprovals = response;
                        NProgress.done();
                    })
                    .error(function (response, code) {
                        var data = {
                            title: "Log Trail",
                            exception: response,
                            exceptionCode: code,
                            operation: "GET",
                            apiUrl: apiUrl
                        };

                        Helper.notifErrorHttp(data);
                    });

                $scope.approveDone = false;
            })
            .error(function (response, code) {
                NProgress.done();

                var data = {
                    title: "Approval Status",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.submitClick = function () {
        $scope.isSubmitClick = true;
        var konfirmasi = confirm('Apakah Anda yakin akan Submit Data ?');
        if (konfirmasi) {
            NProgress.start();

            $scope.approveDone = true;

            var apiUrl = "/api/DMRSubmit";
            var data = {
                idDmr: idDmr,
                userEmail: currentUser.email,
                nextApproval: $scope.approver.nextApproval
            };

            HttpRequest.post(apiUrl, data).success(function (response) {
                    alert('Data berhasil di-submit.');
                    $('#modalSubmit').modal('hide');
                    $scope.renderApprovalStatus();
                    $scope.approveDone = false;
                    NProgress.done();

                })
                .error(function (response, code) {
                    $scope.renderApprovalStatus();
                    NProgress.done();

                    var data = {
                        title: "DMR Submit",
                        exception: response,
                        exceptionCode: code,
                        operation: "POST",
                        apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                });
        }
        $scope.isSubmitClick = false;
    }

    $scope.approveClick = function () {
        $scope.isSubmitClick = true;
        var konfirmasi = confirm('Apakah Anda yakin akan Menyetujui Data ?');
        if (konfirmasi) {
            NProgress.start();
            $scope.approveDone = true;
            var apiUrl = "/api/DMRApproval";
            var data = {
                idDmr: idDmr,
                keterangan: $scope.approver.keterangan,
                nextApproval: $scope.approver.nextApproval,
                userEmail: currentUser.email,
                isVerifikasi: $scope.isVerifikasi
            };

            HttpRequest.post(apiUrl, data).success(function (response) {
                    alert('Data berhasil di-approve.');

                    //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
                    $('#modalApproval').modal('hide');

                    $scope.renderApprovalStatus();
                    $scope.approveDone = false;
                    NProgress.done();
                })
                .error(function (response, code) {
                    $scope.renderApprovalStatus();
                    NProgress.done();

                    var data = {
                        title: "DMR Approve",
                        exception: response,
                        exceptionCode: code,
                        operation: "POST",
                        apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                });
        }
        $scope.isSubmitClick = false;
    }

    $scope.reviseClick = function () {
        $scope.isSubmitClick = true;
        var konfirmasi = confirm('Apakah Anda yakin akan Merevise Data ?');
        if (konfirmasi) {
            NProgress.start();
            $scope.approveDone = true;
            $scope.isSubmitClick = true;

            var apiUrl = "/api/DMRRevise";
            var data = {
                idDmr: idDmr,
                keterangan: $scope.reviser.keterangan,
                userEmail: currentUser.email
            };

            HttpRequest.post(apiUrl, data).success(function (response) {
                    $scope.renderApprovalStatus();
                    alert('Data berhasil di-revise.');
                    //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
                    $('#modalRevise').modal('hide');
                    $scope.approveDone = false;
                    NProgress.done();
                })
                .error(function (response, code) {
                    $scope.renderApprovalStatus();
                    NProgress.done();

                    var data = {
                        title: "DMR Revise",
                        exception: response,
                        exceptionCode: code,
                        operation: "POST",
                        apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                });
        }
        $scope.isSubmitClick = false;
    }

    $scope.submitDispositionClick = function () {

        var konfirmasi = confirm('Apakah Anda yakin akan Men-disposisi Data ?');
        if (konfirmasi) {
            NProgress.start();
            $scope.isSubmitClick = true;
            $scope.approveDone = true;
            var apiUrl = "/api/DMRDisposition";
            var data = {
                idDmr: idDmr,
                keterangan: $scope.dispositioner.keterangan,
                tujuanDisposisi: $scope.dispositioner.tujuan,
                userEmail: currentUser.email
            };

            HttpRequest.post(apiUrl, data).success(function (response) {
                    $scope.renderApprovalStatus();
                    alert('Data berhasil didisposisi.');
                    //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
                    $('#modalDisposition').modal('hide');
                    $scope.approveDone = false;
                    NProgress.done();
                })
                .error(function (response, code) {
                    $scope.renderApprovalStatus();
                    NProgress.done();

                    var data = {
                        title: "DMR Disposition",
                        exception: response,
                        exceptionCode: code,
                        operation: "POST",
                        apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                });
        }
        $scope.isSubmitClick = false;
    }

    $scope.statusForm = function () {
        NProgress.start();
        var apiUrl = "/api/DMRStatusForm/" + idDmr;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.allowSubmit = response.status;
                $scope.rekomendasiComplete = response.rekomendasi;
                $scope.isSubmitClick = response.status;
                console.log($scope.allowSubmit);
                console.log("Submit : " + $scope.isSubmitClick);
                NProgress.done();
            })
            .error(function (response, code) {
                NProgress.done();
                var data = {
                    title: "DMR Status FORM",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };
                Helper.notifErrorHttp(data);
            });
    }



    // ====================================== HELPER, FUNCTION, FORM LOAD ====================================\\
    $scope.trustAsHtml = function (string) {
        return $sce.trustAsHtml(string);
    };

    $scope.checkKajianOptional = function () {
        var KH = null;

        NProgress.start();
        apiUrl = "/api/DMRKH/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kh.data = response; // null
            if ($scope.kh.data.penjelasanPelaksanaanKh != null && $scope.kh.data.penjelasanPelaksanaanKh != "") {
                $scope.kajianHukumModel = true;
            } else {
                $scope.kajianHukumModel = false;
            }
            NProgress.done();
        });

        NProgress.start();
        apiUrl = "/api/DMRKKL/" + idDmr;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kkl.data = response;
            if ($scope.kkl.data.penjelasanPelaksanaanKkl != null && $scope.kkl.data.penjelasanPelaksanaanKkl != "") {
                $scope.kajianKelayakModel = true;
            } else {
                $scope.kajianKelayakModel = false;
            }
            NProgress.done();
        });



    }

    $scope.formLoad = function () {
        if ($scope.idDmr != "") {

            $scope.currUrl = "main.aspx#" + $location.path();
            console.log(JSON.stringify($scope.currUrl));
            $cookies.put('lastUrl', $scope.currUrl);

            //NProgress.start();

            // KAJIAN KELAYAKAN
            $scope.renderDmr();
            $scope.renderPendahuluan();
            $scope.renderKkoForm();
            $scope.renderKesimpulanForm();
            $scope.renderKklForm();
            $scope.renderKhForm();
            $scope.renderKkfForm();

            // KAJIAN RISIKO
            $scope.renderPenetapanKonteks();
            $scope.renderIdentifikasi();
            $scope.renderAnalisaEvaluasi();
            $scope.renderRencanaMitigasi();

            // PERSETUJUAN
            $scope.renderPersetujuan();



            // LOAD FUNCTION,  APPROVAL, STATUS
            $scope.checkKajianOptional();
            $scope.renderDmr();
            $scope.getCurrentUser();
            $scope.renderApprovalStatus();
            $scope.statusForm();
            //NProgress.done();
        }
    }

    // ====================================== END OFs HELPER, FUNCTION, FORM LOAD ====================================\\

    // =========== INFORMASI UMUM ================ //

    $scope.renderDmr = function () {
        NProgress.start();

        apiUrl = "/api/DMRListJenisKegiatan";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.informasiUmum.master.jenisKegiatan = response;
        }).error(function (response, code) {
            $scope.errorCode = code;
            $('#modalError').modal("show");
            NProgress.done();
        });

        apiUrl = "/api/DMRListJenisValuta";
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.informasiUmum.master.jenisValuta = response;
        });

        apiUrl = "/api/DMRInformasiUmum?idDMR=" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.informasiUmum.data = response;

            if ($scope.informasiUmum.data.jenisKegiatan.name == 'Investasi') {
                $scope.isInvestasi = true;
                apiUrl = "/api/DMRGetProgram/" + idDmr;
                HttpRequest.get(apiUrl).success(function (response) {

                    $scope.informasiUmum.master.program = response;

                    NProgress.done();
                }).error(function (response, code) {

                    $scope.errorCode = code;
                    $('#modalError').modal("show");

                    NProgress.done();
                });
            }

            $scope.informasiUmum.data.periodeAwal = Helper.isNullOrEmpty($scope.informasiUmum.data.periodeAwal) ? null : $scope.informasiUmum.data.periodeAwal.toDate();
            $scope.informasiUmum.data.periodeAkhir = Helper.isNullOrEmpty($scope.informasiUmum.data.periodeAkhir) ? null : $scope.informasiUmum.data.periodeAkhir.toDate();

            apiUrl = "/api/DMRListRiskOwner/" + idDmr;

            HttpRequest.get(apiUrl).success(function (response) {
                $scope.informasiUmum.master.pemilikResiko = response;
            });

            NProgress.done();
        }).error(function (response, code) {
            $('#modalError2').modal("show");
            NProgress.done();
        });
    }


    $scope.eventClickInformasiUmumEdit = function () {
        $scope.informasiUmum.isEditMode = true;
    }

    $scope.eventClickInformasiUmumSave = function () {
        var apiUrl = "/api/DMRInformasiUmum";
        $scope.informasiUmum.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.informasiUmum.data).success(function (response) {
            $scope.renderDmr();
            $scope.informasiUmum.isEditMode = false;
            $scope.renderApprovalStatus();
        });
    }

    $scope.eventClickInformasiUmumDiscard = function () {
        $scope.renderDmr();
        $scope.informasiUmum.isEditMode = false;
    }

    $scope.eventChangeJenisKegiatan = function () {
        var masterJenisKegiatan = $scope.informasiUmum.master.jenisKegiatan;
        var selectedJenisKegiatan = Helper.findItem(masterJenisKegiatan, "id", $scope.informasiUmum.data.jenisKegiatan.id);
        $scope.informasiUmum.data.jenisKegiatan.name = selectedJenisKegiatan.name;

        if (selectedJenisKegiatan.name == 'Investasi') {
            NProgress.start();
            $scope.isInvestasi = true;
            apiUrl = "/api/DMRGetProgram/" + idDmr;
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.informasiUmum.master.program = response;
                NProgress.done();
            }).error(function (response, code) {
                $scope.errorCode = code;
                $('#modalError').modal("show");
                NProgress.done();
            });
        } else {
            $scope.isInvestasi = false;
        }
    }

    $scope.eventChangePemilikResiko = function () {
        var masterPemilikResiko = $scope.informasiUmum.master.pemilikResiko;
        var selectedPemilikResiko = Helper.findItem(masterPemilikResiko, "id", $scope.informasiUmum.data.pemilikResiko.id);
        $scope.informasiUmum.data.pemilikResiko.name = selectedPemilikResiko.name;
        console.log("id : " + $scope.informasiUmum.data.pemilikResiko.id);
        console.log("name : " + $scope.informasiUmum.data.pemilikResiko.name);
    }

    $scope.eventChangeJenisValuta = function () {
        var masterJenisValuta = $scope.informasiUmum.master.jenisValuta;
        var selectedJenisValuta = Helper.findItem(masterJenisValuta, "id", $scope.informasiUmum.data.jenisValuta.id);
        $scope.informasiUmum.data.jenisValuta.name = selectedJenisValuta.name;
    }

    $scope.eventChangeProgram = function () {
        var masterProgram = $scope.informasiUmum.master.program;
        var selectedProgram = Helper.findItem(masterProgram, "id", $scope.informasiUmum.data.program.id);

        $scope.informasiUmum.data.program.name = selectedProgram.name;
        $scope.informasiUmum.data.judulDMR = selectedProgram.name;

        apiUrl = "/api/DMRKRProgramInvestasi/" + selectedProgram.id + "?iddmr=" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            NProgress.start();
            $scope.infoumum = {};
            $scope.infoumum = response;

            var pAwal = Helper.isNullOrEmpty($scope.infoumum.periodeAwal) ? null : $scope.infoumum.periodeAwal.toDate();
            var pAkhir = Helper.isNullOrEmpty($scope.infoumum.periodeAkhir) ? null : $scope.infoumum.periodeAkhir.toDate();

            $scope.informasiUmum.data.periodeAwal = pAwal;
            $scope.informasiUmum.data.periodeAkhir = pAkhir;
            $scope.informasiUmum.data.jenisValuta = $scope.infoumum.jenisValuta;
            $scope.informasiUmum.data.nilaiAnggaran = $scope.infoumum.nilaiAnggaran;


            NProgress.done();
        }).error(function (response, code) {
            $scope.errorCode = code;
            $('#modalError').modal("show");
            NProgress.done();
        });
    }


    // =========== END INFORMASI UMUM ================ //

    // =========== PENDAHULUAN ================ //

    $scope.renderPendahuluan = function () {
        NProgress.start();

        apiUrl = "/api/DasarKebijakan/" + $scope.idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.listKebijakan = response;
            console.log(JSON.stringify($scope.listKebijakan));
        });

        apiUrl = "/api/DMRPendahuluan/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {

            $scope.pendahuluan.data = response;

            var tahunPendahuluan = $scope.pendahuluan.data.tahun;

            // RENDER DROPDOWN SASARAN STRATEGIS
            //apiUrl2 = "/api/DMRListSasaranStrategis?tahun=" + tahunPendahuluan;
            apiUrl2 = "/api/DMRListSasaranStrategis/" + idDmr;
            HttpRequest.get(apiUrl2).success(function (response) {
                $scope.pendahuluan.master.sasaranStrategis = response;
            });

            // RENDER DROPDOWN STRATEGIC INITIATIVE
            //apiUrl3 = "/api/DMRListStrategicInitiative?tahun=" + tahunPendahuluan;
            apiUrl3 = "/api/DMRListStrategicInitiative/" + idDmr;
            HttpRequest.get(apiUrl3).success(function (response) {
                $scope.pendahuluan.master.strategicInitiative = response;
            });

            NProgress.done();
        });

    }

    // CKEditor
    $scope.pendahuluanlatarBelakang = {
        language: 'en'
    };
    $scope.pendahuluanlatarBelakang.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.pendahuluanlatarBelakang.filebrowserUploadUrl = '../../upload.ashx';

    $scope.pendahuluanpermasalahan = {
        language: 'en'
    };
    $scope.pendahuluanpermasalahan.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.pendahuluanpermasalahan.filebrowserUploadUrl = '../../upload.ashx';

    $scope.pendahuluandeskripsiAlternatif = {
        language: 'en'
    };
    $scope.pendahuluandeskripsiAlternatif.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.pendahuluandeskripsiAlternatif.filebrowserUploadUrl = '../../upload.ashx';

    $scope.eventChangeSasaranStrategis = function () {
        var masterSasaranStrategis = $scope.pendahuluan.master.sasaranStrategis;
        var selectedSasaranStrategis = Helper.findItem(masterSasaranStrategis, "id", $scope.pendahuluan.data.sasaranStrategis.id);
        $scope.pendahuluan.data.sasaranStrategis.name = selectedSasaranStrategis.name;
    }

    $scope.eventChangeStrategicInitiative = function () {
        var masterStrategicInitiative = $scope.pendahuluan.master.strategicInitiative;
        var selectedStrategicInitiative = Helper.findItem(masterStrategicInitiative, "id", $scope.pendahuluan.data.strategicInitiative.id);
        $scope.pendahuluan.data.strategicInitiative.name = selectedStrategicInitiative.name;
    }

    $scope.eventClickAlternatifTambahCara = function () {
        $scope.pendahuluan.data.alternatifCaraPencapaianSasaran.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickAlternatifHapusCara = function (index) {
        $scope.pendahuluan.data.alternatifCaraPencapaianSasaran.splice(index, 1);
    }

    $scope.eventClickAlternatifTambahKebijakan = function () {
        $scope.pendahuluan.data.dasarKebijakan.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickAlternatifHapusKebijakan = function (index) {
        $scope.pendahuluan.data.dasarKebijakan.splice(index, 1);
    }

    $scope.eventClickPendahuluanEdit = function () {
        $scope.pendahuluan.isEditMode = true;
    }

    $scope.eventClickPendahuluanSave = function () {
        var apiUrl = "/api/DMRPendahuluan";

        $scope.pendahuluan.data.userEmail = currentUser.email;

        HttpRequest.post(apiUrl, $scope.pendahuluan.data).success(function (response) {
            $scope.renderPendahuluan();
            $scope.pendahuluan.isEditMode = false;
            $scope.renderApprovalStatus();
        });
    }

    $scope.eventClickPendahuluanDiscard = function () {
        $scope.renderPendahuluan();
        $scope.pendahuluan.isEditMode = false;
    }

    // =========== END PENDAHULUAN ================ //


    // =========== KKO ================ //
    $scope.kkoDataAspek = [];
    $scope.kkoStart = "";
    $scope.kkoEnd = "";
    $scope.renderKkoForm = function () {
        NProgress.start();
        apiUrl = "/api/DMRKKO/" + idDmr;
        HttpRequest.get(apiUrl)
            .success(function (response) {
                $scope.kko.data = response;
                $scope.fillAspekMain();
                $scope.fillTimeBound();

                $scope.kkoStart = $scope.kko.data.start.toDate();
                $scope.kkoEnd = $scope.kko.data.end.toDate();

                $scope.dateOptionsKKO = {
                    maxDate: $scope.kkoEnd,
                    minDate: $scope.kkoStart,
                    startingDay: 1
                };

                if ($scope.kko.data.file.length == 0) {
                    var newFile = [{
                        id: "",
                        idDmr: idDmr,
                        title: "",
                        url: "",
                        file: {
                            fileName: "",
                            fileType: "",
                            fileSize: "",
                            base64: ""
                        },
                        attachmentType: "KKO"
                    }];
                    $scope.kko.data.file = newFile;
                }

                NProgress.done();
            })
            .error(function (response, code) {
                $scope.errorCode = response.ExceptionMessage + " - " + code;
                if (response.ExceptionType == "System.ArgumentNullException") {
                    $scope.error = {};
                    $scope.error.message = "Silahkan lengkapi data pada Modul Informasi Umum & Modul Pendahuluan!";
                    $('#modalError2').modal('show');
                } else {
                    $scope.error.message = response.ExceptionMessage + " - " + code;
                    $('#modalError2').modal('show');
                }
                NProgress.done();
            });
    }

    $scope.bobotIsValid = false;
    $scope.jumlahBobot = 0;
    $scope.fillAspekMain = function () {
        $scope.jumlahBobot = 0;
        $scope.kkoDataAspek = [];
        var aspek = $scope.kko.data.penilaianAlternative.length;
        if (aspek > 0) {
            angular.forEach($scope.kko.data.penilaianAlternative[0].aspek, function (item, i) {
                $scope.kkoDataAspek.push({
                    id: item.id,
                    idPenilaian: item.idPenilaian,
                    idAlt: item.idAlt,
                    aspek: item.aspek,
                    bobot: item.bobot,
                    uraian: item.uraian,
                    nilai: 0
                });
                $scope.jumlahBobot = parseInt($scope.jumlahBobot) + parseInt(item.bobot);
            });
        }
        if ($scope.jumlahBobot != 100) {
            $scope.bobotIsValid = true;
        } else {
            $scope.bobotIsValid = false;
        }
        console.log($scope.bobotIsValid);
        console.log(aspek);
        //console.log($scope.kkoData.bobot);
    }


    // CKEDITOR
    $scope.kkocaraPencapaianSasaran = {
        language: 'en'
    };
    $scope.kkocaraPencapaianSasaran.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.kkocaraPencapaianSasaran.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.kkoruangLingkupPekerjaan = {
        language: 'en'
    };
    $scope.kkoruangLingkupPekerjaan.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.kkoruangLingkupPekerjaan.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.kkokesimpulanKko = {
        language: 'en'
    };
    $scope.kkokesimpulanKko.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.kkokesimpulanKko.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    // === KKO JADWAL KEGIATAN ===//
    $scope.eventClickKkoAspekAllAdd = function () {
        if ($scope.kkoData != null) {
            $scope.jumlahBobot = 0;
            $scope.kkoDataAspek.push({
                id: "",
                idPenilaian: "",
                idAlt: "",
                aspek: $scope.kkoData.aspek,
                bobot: $scope.kkoData.bobot,
                uraian: "",
                nilai: 0
            });
            angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
                if (Helper.isNullOrEmpty($scope.kko.data.penilaianAlternative[i].aspek)) {
                    $scope.kko.data.penilaianAlternative[i].aspek = [];
                }
                $scope.kko.data.penilaianAlternative[i].aspek.push({
                    id: "00000000-0000-0000-0000-000000000000",
                    idPenilaian: "",
                    idAlt: "",
                    aspek: $scope.kkoData.aspek,
                    bobot: $scope.kkoData.bobot,
                    uraian: "",
                    nilai: 0
                });
            });
            $scope.kkoData.aspek = "";
            $scope.kkoData.bobot = "";

            var nilaiTotal = 0;
            angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
                $scope.jumlahBobot = 0;
                angular.forEach(item.aspek, function (subItem, a) {
                    $scope.jumlahBobot = parseInt($scope.jumlahBobot) + parseInt(subItem.bobot);
                    var bobot = subItem.bobot;
                    var skor = subItem.skala;
                    subItem.nilai = (bobot * skor) / 100;
                    nilaiTotal = nilaiTotal + subItem.nilai;
                });
                item.totNilai = nilaiTotal;
            });
            if ($scope.jumlahBobot != 100) {
                $scope.bobotIsValid = true;
            } else {
                $scope.bobotIsValid = false;
            }
        } else {
            alert('ASPEK / BOBOT tidak boleh kosong!');
        }
    }

    $scope.eventChangeAspekMain = function (indexItem) {
        var val = $scope.kkoDataAspek[indexItem].aspek;
        angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
            angular.forEach(item.aspek, function (subItem, a) {
                if (a == indexItem) {
                    $scope.kko.data.penilaianAlternative[i].aspek[a].aspek = val;
                }
            });
        });
    }

    $scope.eventChangeBobotMain = function (indexItem) {
        var val = $scope.kkoDataAspek[indexItem].bobot;
        angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
            $scope.jumlahBobot = 0;
            angular.forEach(item.aspek, function (subItem, a) {
                if (a == indexItem) {
                    $scope.kko.data.penilaianAlternative[i].aspek[a].bobot = val;
                }
                $scope.jumlahBobot = parseInt($scope.jumlahBobot) + parseInt(subItem.bobot);
            });
        });
        if ($scope.jumlahBobot != 100) {
            $scope.bobotIsValid = true;
        } else {
            $scope.bobotIsValid = false;
        }
    }

    $scope.eventChangeUraianMain = function (indexItem) {
        var val = $scope.kkoDataAspek[indexItem].uraian;
        angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
            angular.forEach(item.aspek, function (subItem, a) {
                if (a == indexItem) {
                    $scope.kko.data.penilaianAlternative[i].aspek[a].uraian = val;
                }
            });
        });
    }

    $scope.eventAspekDeleteMain = function (index) {
        var nilaiTotal = 0;
        angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
            $scope.kko.data.penilaianAlternative[i].aspek.splice(index, 1);
            $scope.kkoDataAspek.splice(index, 1);
            $scope.jumlahBobot = 0;

            angular.forEach(item.aspek, function (subItem, a) {
                $scope.jumlahBobot = parseInt($scope.jumlahBobot) + parseInt(subItem.bobot);

                var bobot = subItem.bobot;
                var skor = subItem.skala;
                subItem.nilai = (bobot * skor) / 100;
                nilaiTotal = nilaiTotal + subItem.nilai;
            });
            item.totNilai = nilaiTotal;
        });
        if ($scope.jumlahBobot != 100) {
            $scope.bobotIsValid = true;
        } else {
            $scope.bobotIsValid = false;
        }
    }

    $scope.eventChangeAspek = function (index, indexItem) {
        var val = $scope.kko.data.penilaianAlternative[index].aspek[indexItem].aspek;
        angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
            angular.forEach(item.aspek, function (subItem, a) {
                if (i != index && a == indexItem) {
                    $scope.kko.data.penilaianAlternative[i].aspek[a].aspek = val;
                }
            });
        });
    }

    $scope.eventChangeBobot = function (index, indexItem) {
        var val = $scope.kko.data.penilaianAlternative[index].aspek[indexItem].bobot;
        angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
            angular.forEach(item.aspek, function (subItem, a) {
                if (i != index && a == indexItem) {
                    $scope.kko.data.penilaianAlternative[i].aspek[a].bobot = val;
                }
            });
        });
    }

    $scope.eventChangeUraian = function (index, indexItem) {
        var val = $scope.kko.data.penilaianAlternative[index].aspek[indexItem].uraian;
        angular.forEach($scope.kko.data.penilaianAlternative, function (item, i) {
            angular.forEach(item.aspek, function (subItem, a) {
                if (i != index && a == indexItem) {
                    $scope.kko.data.penilaianAlternative[i].aspek[a].uraian = val;
                }
            });
        });
    }

    $scope.eventGetNilai = function (index, indexItem) {
        var bobot = $scope.kko.data.penilaianAlternative[index].aspek[indexItem].bobot;
        var skor = $scope.kko.data.penilaianAlternative[index].aspek[indexItem].skala;
        $scope.kko.data.penilaianAlternative[index].aspek[indexItem].nilai = (bobot * skor) / 100;

        var nilaiTotal = 0;

        angular.forEach($scope.kko.data.penilaianAlternative[index].aspek, function (subItem, a) {
            if ($scope.kko.data.penilaianAlternative[index].aspek[a].nilai != "") {
                nilaiTotal = nilaiTotal + $scope.kko.data.penilaianAlternative[index].aspek[a].nilai;
            }
        });
        $scope.kko.data.penilaianAlternative[index].totNilai = nilaiTotal;
    }

    $scope.eventClickKkoAspekAdd = function (index) {
        $scope.kko.data.penilaianAlternative[index].aspek.push({
            id: "",
            idPenilaian: "",
            idAlt: "",
            aspek: "",
            bobot: "",
            uraian: "",
            skala: "",
            nilai: ""
        });
    }

    $scope.eventClickKkoAspekDelete = function (index) {
        $scope.kko.data.aspek.splice(index, 1);
    }

    $scope.eventClickKkoAddFile = function () {
        var newFile = {
            id: "",
            idDmr: idDmr,
            title: "",
            url: "",
            file: {
                fileName: "",
                fileType: "",
                fileSize: "",
                base64: ""
            },
            attachmentType: "KKO"
        };
        $scope.kko.data.file.push(newFile);
    }

    $scope.eventClickKkoDeleteFile = function (index) {
        $scope.kko.data.file.splice(index, 1);
    }

    $scope.eventClickKKOGetFile = function (idFile) {
        document.location.href = webServiceBaseUrl + "/api/UploadFile/" + idFile;
    }

    //$scope.setFileKKO = function (element) {
    //    $scope.$apply(function ($scope) {
    //        $scope.theFile = element.files[0];
    //        base64(element, function (data) {
    //            NProgress.start();
    //            $scope.kko.data.file[0] = {
    //                id: "",
    //                title: $scope.theFile.name,
    //                fileName: $scope.theFile.name,
    //                fileType: $scope.theFile.type,
    //                fileSize: $scope.theFile.size,
    //                base64: data.base64,
    //                attachmentType: "KKO"
    //            }
    //            //console.log($scope.kko.data.file);
    //            NProgress.done();
    //        })
    //    });
    //};

    //function base64(file, callback) {
    //    var coolFile = {};
    //    function readerOnload(e) {
    //        var base64 = btoa(e.target.result);
    //        coolFile.base64 = base64;
    //        callback(coolFile)
    //    };

    //    var reader = new FileReader();
    //    reader.onload = readerOnload;

    //    var file = file.files[0];
    //    coolFile.filetype = file.type;
    //    coolFile.size = file.size;
    //    coolFile.filename = file.name;
    //    reader.readAsBinaryString(file);
    //}
    // === KKO JADWAL KEGIATAN ===//
    $scope.fillTimeBound = function () {
        var waktu = $scope.kko.data.timebound;
        if (waktu.length == 0) {
            $scope.kko.data.timebound.push({
                id: "",
                deskripsi: "Perencanaan",
                start: "",
                end: ""
            }, {
                id: "",
                deskripsi: "Pengadaan",
                start: "",
                end: ""
            }, {
                id: "",
                deskripsi: "Pelaksanaan",
                start: "",
                end: ""
            }, {
                id: "",
                deskripsi: "Pengujian / Commissioning",
                start: "",
                end: ""
            }, {
                id: "",
                deskripsi: "Serah Terima",
                start: "",
                end: ""
            });
        }
    }

    $scope.eventClickKkoJadwalKegiatanAdd = function () {
        $scope.kko.data.timebound.push({
            id: "",
            deskripsi: "",
            start: "",
            end: ""
        });
    }
    $scope.eventClickKkoJadwalKegiatanDelete = function (index) {
        var hapus = confirm('Hapus Jadwal ?');
        if (hapus) {
            $scope.kko.data.timebound.splice(index, 1);
        }
    }

    $scope.eventClickKkoEdit = function () {
        $scope.kko.isEditMode = true;
    }

    $scope.eventClickKkoSave = function () {
        NProgress.start();
        var apiUrl = "/api/DMRKKO";
        $scope.kko.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.kko.data).success(function (response) {
            $scope.renderKkoForm();
            $scope.kko.isEditMode = false;
            $scope.renderApprovalStatus();
            NProgress.done();
        });

    }

    $scope.eventClickKkoDiscard = function () {
        $scope.renderKkoForm();
        $scope.kko.isEditMode = false;
    }

    // =========== END KKO ================ //

    // =========== KKL ================ //
    $scope.renderKklForm = function () {
        apiUrl = "/api/DMRKKL/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
                $scope.kkl.data = response;
                if ($scope.kkl.data.file.length == 0) {
                    var newFile = [{
                        id: "",
                        idDmr: idDmr,
                        title: "",
                        url: "",
                        file: {
                            fileName: "",
                            fileType: "",
                            fileSize: "",
                            base64: ""
                        },
                        attachmentType: "KKL"
                    }];
                    $scope.kkl.data.file = newFile;
                }
            })
            .error(function (response, code) {
                $scope.error.message = response.ExceptionMessage + " - " + code;
                $('#modalError2').modal('show');
                NProgress.done();
            });
    }

    $scope.kklpenjelasanPelaksanaan = {
        language: 'en'
    };
    $scope.kklpenjelasanPelaksanaan.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.kklpenjelasanPelaksanaan.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.kklpenjelasanSasaran = {
        language: 'en'
    };
    $scope.kklpenjelasanSasaran.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.kklpenjelasanSasaran.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.eventClickKklEdit = function () {
        $scope.kkl.isEditMode = true;
    }

    $scope.eventClickKklSave = function () {
        var apiUrl = "/api/DMRKKL";
        $scope.kkl.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.kkl.data).success(function (response) {
            $scope.renderKklForm();
            $scope.kkl.isEditMode = false;
            $scope.renderApprovalStatus();
        });
    }

    $scope.eventClickKklDiscard = function () {
        $scope.kkl.data = new Model.dmr.kkl.data();
        $scope.renderKklForm();
        $scope.kkl.isEditMode = false;
    }

    $scope.eventClickKKLAddFile = function () {
        var newFile = {
            id: "",
            idDmr: idDmr,
            title: "",
            url: "",
            file: {
                fileName: "",
                fileType: "",
                fileSize: "",
                base64: ""
            },
            attachmentType: "KKL"
        };
        $scope.kkl.data.file.push(newFile);
    }

    $scope.eventClickKKLDeleteFile = function (index) {
        $scope.kkl.data.file.splice(index, 1);
    }

    $scope.eventClickKKLGetFile = function (idFile) {
        document.location.href = webServiceBaseUrl + "/api/UploadFile/" + idFile;
    }

    // =========== END OF KKL ================ //

    // =========== KH ================ //
    $scope.renderKhForm = function () {
        NProgress.start();
        apiUrl = "/api/DMRKH/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kh.data = response;
            if ($scope.kh.data.file.length == 0) {
                var newFile = [{
                    id: "",
                    idDmr: idDmr,
                    title: "",
                    url: "",
                    file: {
                        fileName: "",
                        fileType: "",
                        fileSize: "",
                        base64: ""
                    },
                    attachmentType: "KH"
                }];
                $scope.kh.data.file = newFile;
            }
            NProgress.done();
        });
    }

    // CKEditor
    $scope.khpenjelasanPelaksanaanKh = {
        language: 'en'
    };
    $scope.khpenjelasanPelaksanaanKh.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.khpenjelasanPelaksanaanKh.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.khrekomendasi = {
        language: 'en'
    };
    $scope.khrekomendasi.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.khrekomendasi.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.eventClickKhEdit = function () {
        $scope.kh.isEditMode = true;
    }

    $scope.eventClickKhSave = function () {
        var apiUrl = "/api/DMRKH";
        $scope.kh.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.kh.data).success(function (response) {
            $scope.renderKhForm();
            $scope.kh.isEditMode = false;
            $scope.renderApprovalStatus();
        });
    }

    $scope.eventClickKhDiscard = function () {
        $scope.kh.data = new Model.dmr.kh.data();
        $scope.renderKhForm();
        $scope.kh.isEditMode = false;
    }

    $scope.eventClickKHAddFile = function () {
        var newFile = {
            id: "",
            idDmr: idDmr,
            title: "",
            url: "",
            file: {
                fileName: "",
                fileType: "",
                fileSize: "",
                base64: ""
            },
            attachmentType: "KH"
        };
        $scope.kh.data.file.push(newFile);
    }

    $scope.eventClickKHDeleteFile = function (index) {
        $scope.kh.data.file.splice(index, 1);
    }

    $scope.eventClickKHGetFile = function (idFile) {
        document.location.href = webServiceBaseUrl + "/api/UploadFile/" + idFile;
    }
    // =========== END OF KH ================ //

    // =========== KKF ================ //
    $scope.renderKkfForm = function () {
        NProgress.start();
        apiUrl = "/api/DMRKKF/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kkf.data = response;
            if ($scope.kkf.data.file.length == 0) {
                var newFile = [{
                    id: "",
                    idDmr: idDmr,
                    title: "",
                    url: "",
                    file: {
                        fileName: "",
                        fileType: "",
                        fileSize: "",
                        base64: ""
                    },
                    attachmentType: "KKF"
                }];
                $scope.kkf.data.file = newFile;
            }

            if ($scope.kkf.data.tangible.file.length == 0) {
                var newFile = [{
                    id: "",
                    idDmr: idDmr,
                    title: "",
                    url: "",
                    file: {
                        fileName: "",
                        fileType: "",
                        fileSize: "",
                        base64: ""
                    },
                    attachmentType: "TANGIBLE"
                }];
                $scope.kkf.data.tangible.file = newFile;
            }
            NProgress.done();
        });
    }

    // CKEditor
    $scope.intangibleBenefit = {
        language: 'en'
    };
    $scope.intangibleBenefit.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.intangibleBenefit.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    // CKEditor
    $scope.penjelasanTambahan = {
        language: 'en'
    };
    $scope.penjelasanTambahan.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.penjelasanTambahan.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    // CKEditor Kesimpulan
    $scope.kesimpulanKKF = {
        language: 'en'
    };
    $scope.kesimpulanKKF.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.kesimpulanKKF.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.eventClickKkfEdit = function () {
        $scope.kkf.isEditMode = true;
    }

    $scope.eventClickKkfSave = function () {
        var apiUrl = "/api/DMRKKF";
        $scope.kkf.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.kkf.data).success(function (response) {
            $scope.renderKkfForm();
            $scope.kkf.isEditMode = false;
            $scope.renderApprovalStatus();
        });
    }

    $scope.eventClickKkfDiscard = function () {
        $scope.kkf.data = new Model.dmr.kkf.data();
        $scope.renderKkfForm();
        $scope.kkf.isEditMode = false;
    }

    $scope.kkfChange = function (nama) {
        $scope.kkf.data.tangible.name = nama;
    }

    $scope.eventClickKKFAddFile = function () {
        var newFile = {
            id: "",
            idDmr: idDmr,
            title: "",
            url: "",
            file: {
                fileName: "",
                fileType: "",
                fileSize: "",
                base64: ""
            },
            attachmentType: "KKF"
        };
        $scope.kkf.data.file.push(newFile);
    }

    $scope.eventClickKKFDeleteFile = function (index) {
        $scope.kkf.data.file.splice(index, 1);
    }

    $scope.eventClickKKFTangibleAddFile = function () {
        var newFile = {
            id: "",
            idDmr: idDmr,
            title: "",
            url: "",
            file: {
                fileName: "",
                fileType: "",
                fileSize: "",
                base64: ""
            },
            attachmentType: "TANGIBLE"
        };
        $scope.kkf.data.tangible.file.push(newFile);
    }

    $scope.eventClickKKFTangibleDeleteFile = function (index) {
        $scope.kkf.data.tangible.file.splice(index, 1);
    }

    $scope.eventClickKKFGetFile = function (idFile) {
        document.location.href = webServiceBaseUrl + "/api/UploadFile/" + idFile;
    }

    // ========== Get KKF Tangible Attachment ================= //
    $scope.eventClickKKFTangibleGetFile = function (idFile) {
        document.location.href = webServiceBaseUrl + "/api/UploadFile/" + idFile;
    }

    // =========== END OF KKF ================ //

    // =========== KESIMPULAN ================ //

    $scope.renderKesimpulanForm = function () {
        NProgress.start();
        apiUrl = "/api/DMRKesimpulan?idDMR=" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.kesimpulan = response;
            NProgress.done();
        });
    }

    // CKEditor Kesimpulan
    $scope.editorOptions = {
        language: 'en'
    };
    $scope.editorOptions.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.editorOptions.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    // CKEditor Kesimpulan Akhir
    $scope.editorOptions2 = {
        language: 'en'
    };
    $scope.editorOptions2.filebrowserImageUploadUrl = '../../upload.ashx';
    $scope.editorOptions2.filebrowserUploadUrl = '../../upload.ashx';
    $scope.$on("ckeditor.ready", function (event) {
        $scope.isReady = true;
    });

    $scope.eventClickKesimpulanEdit = function () {
        $scope.kesimpulan.isEditMode = true;
    }

    $scope.eventClickKesimpulanSave = function () {
        var apiUrl = "/api/DMRKesimpulan";
        $scope.kesimpulan.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.kesimpulan).success(function (response) {
            $scope.renderKesimpulanForm();
            $scope.kesimpulan.isEditMode = false;
            $scope.renderApprovalStatus();
        });
    }

    $scope.eventClickKesimpulanDiscard = function () {
        $scope.renderKesimpulanForm();
        $scope.kesimpulan.isEditMode = false;
    }

    // =========== END OF KESIMPULAN ================ //


    // =========== KAJIAN RISIKO - PENETAPAN KONTEKS ================ //
    $scope.renderPenetapanKonteks = function () {
        NProgress.start();
        apiUrl = "/api/DMRKRPenetapanKonteks/" + idDmr
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.penetapanKonteks.data = response;

            if ($scope.penetapanKonteks.data.sasaranOperasional.length == 0) {
                $scope.penetapanKonteks.data.sasaranOperasional.push({
                    id: "",
                    name: ""
                });
            }


            if ($scope.penetapanKonteks.data.file.length == 0) {
                var newFile = [{
                    id: "",
                    idDmr: idDmr,
                    title: "",
                    url: "",
                    file: {
                        fileName: "",
                        fileType: "",
                        fileSize: "",
                        base64: ""
                    },
                    attachmentType: "PENETAPAN KONTEKS"
                }];
                $scope.penetapanKonteks.data.file = newFile;
            }
            var apiUrl2 = "/api/DMRKRListSasaranFinansial/" + idDmr;
            HttpRequest.get(apiUrl2).success(function (responseMaster) {
                $scope.penetapanKonteks.master.sasaranFinansial = responseMaster;
            });
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.eventClickPenetapanKonteksEdit = function () {
        $scope.penetapanKonteks.isEditMode = true;
    }

    $scope.eventClickPenetapanKonteksSave = function () {
        var apiUrl = "/api/DMRKRPenetapanKonteks";
        $scope.penetapanKonteks.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.penetapanKonteks.data).success(function (response) {
            $scope.renderPenetapanKonteks();
            $scope.penetapanKonteks.isEditMode = false;
            $scope.renderApprovalStatus();
        });
    }

    $scope.eventClickPenetapanKonteksDiscard = function () {
        $scope.renderPenetapanKonteks();
        $scope.penetapanKonteks.isEditMode = false;
    }

    $scope.eventChangePenetapanKonteksSasaranFinansial = function () {
        var masterSasaranFinansial = $scope.penetapanKonteks.master.sasaranFinansial;
        var selectedSasaranFinansial = Helper.findItem(masterSasaranFinansial, "id", $scope.penetapanKonteks.data.sasaranFinansial.id);
        $scope.penetapanKonteks.data.sasaranFinansial.name = selectedSasaranFinansial.name;
        $scope.penetapanKonteks.data.sasaranFinansial.keterangan = selectedSasaranFinansial.keterangan;
        $scope.penetapanKonteks.data.sasaranFinansial.id = selectedSasaranFinansial.id;
    }

    $scope.eventClickPenetapanKonteksSasaranOperasionalAdd = function () {
        $scope.penetapanKonteks.data.sasaranOperasional.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickPenetapanKonteksSasaranOperasionalRemove = function (index) {
        $scope.penetapanKonteks.data.sasaranOperasional.splice(index, 1);
    }

    $scope.eventClickPenetapanKonteksAddFile = function () {
        var newFile = {
            id: "",
            idDmr: idDmr,
            title: "",
            url: "",
            file: {
                fileName: "",
                fileType: "",
                fileSize: "",
                base64: ""
            },
            attachmentType: "PENETAPAN KONTEKS"
        };
        $scope.penetapanKonteks.data.file.push(newFile);
    }

    $scope.eventClickPenetapanKonteksDeleteFile = function (index) {
        $scope.penetapanKonteks.data.file.splice(index, 1);
    }

    $scope.eventClickPenetapanKonteksGetFile = function (idFile) {
        document.location.href = webServiceBaseUrl + "/api/UploadFile/" + idFile;
    }

    // =========== END OF KAJIAN RISIKO - PENETAPAN KONTEKS ================ //

    // =========== STAR KAJIAN RISIKO - IDENTIFIKASI =============//

    $scope.bidangStrategisModel = false;

    $scope.renderIdentifikasi = function () {
        NProgress.start();
        // DATA IDENTIFIKASI
        apiUrl = "/api/DMRKRIdentifikasi/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.data = response;
            console.log(JSON.stringify(response));

            angular.forEach($scope.identifikasi.data.sasaranStrategis, function (item, i) {
                angular.forEach(item.kategori, function (item, j) {
                    $scope.renderIdentifikasiMasterStrategis(i, j);
                });
            });

            angular.forEach($scope.identifikasi.data.sasaranOperasional, function (item, i) {
                angular.forEach(item.kategori, function (item, j) {
                    $scope.renderIdentifikasiMasterOperasional(i, j);
                });
            });

            angular.forEach($scope.identifikasi.data.sasaranFinansial, function (item, i) {
                angular.forEach(item.kategori, function (item, j) {
                    $scope.renderIdentifikasiMasterFinansial(i, j);
                });
            });

            NProgress.done();

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });

        //$scope.identifikasi.data.sasaranStrategis = {
        //                                        sasaran: "Meningkatnya Trust dari pemegang saham dan kepuasan",
        //                                        taksonomiRisiko: [{
        //                                                sasaran: "",
        //                                                judul: "Taksonomi Risiko 1",
        //                                                kategoriRisiko: "Strategis",
        //                                                subKategori: { id: "1", name: "Organisasi Korporat" },
        //                                                risiko: { id: "1", name: "Perubahan Organisasi Korporat" },
        //                                                kejadian: "Perubahan struktur organisasi korporat tidak sesuai dengan kebutuhan perusahaan",
        //                                                tipeSumberRisiko: { id: "1", name: "Internal" },
        //                                                sumberRisiko: { id: "1", name: "Machine" },
        //                                                penyebab: [
        //                                            { id: "1", name: "Machine Bag 1" },
        //                                            { id: "2", name: "Machine Bag 2" },
        //                                            { id: "3", name: "Machine Bag 3" },
        //                                        ],
        //                                            areaDampak: "Reputasi"
        //                                        },
        //                                        {
        //                                            sasaran: "Sasaran yang terbaik untuk keperluan bersama",
        //                                            judul: "Taksonomi Risiko 2",
        //                                            kategoriRisiko: "Strategis",
        //                                            subKategori: { id: "1", name: "Organisasi Korporat" },
        //                                            risiko: { id: "1", name: "Perubahan Organisasi Korporat" },
        //                                            kejadian: "Perubahan struktur organisasi korporat tidak sesuai dengan kebutuhan perusahaan",
        //                                            tipeSumberRisiko: { id: "1", name: "Internal" },
        //                                            sumberRisiko: { id: "1", name: "Machine" },
        //                                            penyebab: [
        //                                        { id: "1", name: "Machine Bag 1" },
        //                                        { id: "2", name: "Machine Bag 2" },
        //                                        { id: "3", name: "Machine Bag 3" },
        //                                        ],
        //                                            areaDampak: "Reputasi"
        //                                        }]};
        //$scope.identifikasi.data.sasaranOperasional = {
        //                                            sasaran: "Meningkatnya Trust dari pemegang saham dan kepuasan",
        //                                            taksonomiRisiko: [{
        //                                                sasaran: "",
        //                                                judul: "Taksonomi Risiko 1",
        //                                                kategoriRisiko: "Strategis",
        //                                                subKategori: { id: "1", name: "Organisasi Korporat" },
        //                                                risiko: { id: "1", name: "Perubahan Organisasi Korporat" },
        //                                                kejadian: "Perubahan struktur organisasi korporat tidak sesuai dengan kebutuhan perusahaan",
        //                                                tipeSumberRisiko: { id: "1", name: "Internal" },
        //                                                sumberRisiko: { id: "1", name: "Machine" },
        //                                                penyebab: [
        //                                            { id: "1", name: "Machine Bag 1" },
        //                                            { id: "2", name: "Machine Bag 2" },
        //                                            { id: "3", name: "Machine Bag 3" },
        //                                                ],
        //                                                areaDampak: "Reputasi"
        //                                            },
        //                                            {
        //                                                sasaran: "Sasaran yang terbaik untuk keperluan bersama",
        //                                                judul: "Taksonomi Risiko 2",
        //                                                kategoriRisiko: "Strategis",
        //                                                subKategori: { id: "1", name: "Organisasi Korporat" },
        //                                                risiko: { id: "1", name: "Perubahan Organisasi Korporat" },
        //                                                kejadian: "Perubahan struktur organisasi korporat tidak sesuai dengan kebutuhan perusahaan",
        //                                                tipeSumberRisiko: { id: "1", name: "Internal" },
        //                                                sumberRisiko: { id: "1", name: "Machine" },
        //                                                penyebab: [
        //                                            { id: "1", name: "Machine Bag 1" },
        //                                            { id: "2", name: "Machine Bag 2" },
        //                                            { id: "3", name: "Machine Bag 3" },
        //                                                ],
        //                                                areaDampak: "Reputasi"
        //                                            }]
        //                                        };
        //$scope.identifikasi.data.sasaranFinansial = {
        //                                                sasaran: "Meningkatnya Trust dari pemegang saham dan kepuasan",
        //                                                taksonomiRisiko: [{
        //                                                    sasaran: "",
        //                                                    judul: "Taksonomi Risiko 1",
        //                                                    kategoriRisiko: "Strategis",
        //                                                    subKategori: { id: "1", name: "Organisasi Korporat" },
        //                                                    risiko: { id: "1", name: "Perubahan Organisasi Korporat" },
        //                                                    kejadian: "Perubahan struktur organisasi korporat tidak sesuai dengan kebutuhan perusahaan",
        //                                                    tipeSumberRisiko: { id: "1", name: "Internal" },
        //                                                    sumberRisiko: { id: "1", name: "Machine" },
        //                                                    penyebab: [
        //                                                { id: "1", name: "Machine Bag 1" },
        //                                                { id: "2", name: "Machine Bag 2" },
        //                                                { id: "3", name: "Machine Bag 3" },
        //                                                    ],
        //                                                    areaDampak: "Reputasi"
        //                                                },
        //                                                {
        //                                                    sasaran: "Sasaran yang terbaik untuk keperluan bersama",
        //                                                    judul: "Taksonomi Risiko 2",
        //                                                    kategoriRisiko: "Strategis",
        //                                                    subKategori: { id: "1", name: "Organisasi Korporat" },
        //                                                    risiko: { id: "1", name: "Perubahan Organisasi Korporat" },
        //                                                    kejadian: "Perubahan struktur organisasi korporat tidak sesuai dengan kebutuhan perusahaan",
        //                                                    tipeSumberRisiko: { id: "1", name: "Internal" },
        //                                                    sumberRisiko: { id: "1", name: "Machine" },
        //                                                    penyebab: [
        //                                                { id: "1", name: "Machine Bag 1" },
        //                                                { id: "2", name: "Machine Bag 2" },
        //                                                { id: "3", name: "Machine Bag 3" },
        //                                                    ],
        //                                                    areaDampak: "Reputasi"
        //                                                }]
        //};
    }

    // ++ RENDER MASTER ++ //
    $scope.renderIdentifikasiMasterStrategis = function (induk, item) {
        $scope.identifikasi.master.sasaranStrategis[induk] = {
            kategoriRisiko: [],
            subKategori: [],
            risiko: [],
            kejadian: [],
            tipeSumberRisiko: [],
            sumberRisiko: [],
            penyebab: []
        };
        $scope.bidangStrategisModel = true;
        // MASTER KATEGORI
        apiUrl = "/api/DMRListKategoriRisiko/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranStrategis[induk].kategoriRisiko[item] = response;
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER KATEGORI

        // MASTER SUB KATEGORI
        var idKategoriRisiko = $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].kategoriRisiko.id;
        apiUrl = "/api/DMRListSubKategoriRisiko/" + idDmr + "?idKat=" + idKategoriRisiko;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranStrategis[induk].subKategori[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER SUB KATEGORI

        // MASTER TIPE SUMBER RISIKO
        apiUrl = "/api/DMRKRListTipeSumberRisiko";
        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranStrategis[induk].tipeSumberRisiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER TIPE SUMBER RISIKO

        // MASTER RISIKO
        var idSubKategori = $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].subKategori.id;
        apiUrl = "/api/DMRListRisiko/" + idDmr + "?idSubkat=" + idSubKategori;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranStrategis[induk].risiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER RISIKO


        // MASTER KEJADIAN
        var idKejadian = $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].risiko.id;
        apiUrl = "/api/DMRListKejadianRisiko/" + idDmr + "?idRisk=" + idKejadian;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranStrategis[induk].kejadian[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER KEJADIAN


        // MASTER SUMBER RISIKO
        var idTipeSumberRisiko = $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].tipeSumberRisiko.id;
        apiUrl = "/api/DMRListSumberRisiko/" + idTipeSumberRisiko;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranStrategis[induk].sumberRisiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER SUMBER RISIKO

    }

    $scope.renderIdentifikasiMasterOperasional = function (induk, item) {
        $scope.identifikasi.master.sasaranOperasional[induk] = {
            kategoriRisiko: [],
            subKategori: [],
            risiko: [],
            kejadian: [],
            tipeSumberRisiko: [],
            sumberRisiko: [],
            penyebab: []
        };

        // MASTER KATEGORI
        apiUrl = "/api/DMRListKategoriRisiko/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranOperasional[induk].kategoriRisiko[item] = response;
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER KATEGORI

        // MASTER SUB KATEGORI
        var idKategoriRisiko = $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kategoriRisiko.id;
        apiUrl = "/api/DMRListSubKategoriRisiko/" + idDmr + "?idKat=" + idKategoriRisiko;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranOperasional[induk].subKategori[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER SUB KATEGORI

        // MASTER TIPE SUMBER RISIKO
        apiUrl = "/api/DMRKRListTipeSumberRisiko";
        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranOperasional[induk].tipeSumberRisiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER TIPE SUMBER RISIKO

        // MASTER RISIKO
        var idSubKategori = $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].subKategori.id;
        apiUrl = "/api/DMRListRisiko/" + idDmr + "?idSubkat=" + idSubKategori;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranOperasional[induk].risiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER RISIKO


        // MASTER KEJADIAN
        var idKejadian = $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].risiko.id;
        apiUrl = "/api/DMRListKejadianRisiko/" + idDmr + "?idRisk=" + idKejadian;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranOperasional[induk].kejadian[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER KEJADIAN


        // MASTER SUMBER RISIKO
        var idTipeSumberRisiko = $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].tipeSumberRisiko.id;
        apiUrl = "/api/DMRListSumberRisiko/" + idTipeSumberRisiko;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranOperasional[induk].sumberRisiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER SUMBER RISIKO

    }

    $scope.renderIdentifikasiMasterFinansial = function (induk, item) {
        $scope.identifikasi.master.sasaranFinansial[induk] = {
            kategoriRisiko: [],
            subKategori: [],
            risiko: [],
            kejadian: [],
            tipeSumberRisiko: [],
            sumberRisiko: [],
            penyebab: []
        };

        // MASTER KATEGORI
        apiUrl = "/api/DMRListKategoriRisiko/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranFinansial[induk].kategoriRisiko[item] = response;
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER KATEGORI

        // MASTER SUB KATEGORI
        var idKategoriRisiko = $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kategoriRisiko.id;
        apiUrl = "/api/DMRListSubKategoriRisiko/" + idDmr + "?idKat=" + idKategoriRisiko;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranFinansial[induk].subKategori[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER SUB KATEGORI

        // MASTER TIPE SUMBER RISIKO
        apiUrl = "/api/DMRKRListTipeSumberRisiko";
        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranFinansial[induk].tipeSumberRisiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER TIPE SUMBER RISIKO

        // MASTER RISIKO
        var idSubKategori = $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].subKategori.id;
        apiUrl = "/api/DMRListRisiko/" + idDmr + "?idSubkat=" + idSubKategori;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranFinansial[induk].risiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER RISIKO


        // MASTER KEJADIAN
        var idKejadian = $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].risiko.id;
        apiUrl = "/api/DMRListKejadianRisiko/" + idDmr + "?idRisk=" + idKejadian;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranFinansial[induk].kejadian[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER KEJADIAN


        // MASTER SUMBER RISIKO
        var idTipeSumberRisiko = $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].tipeSumberRisiko.id;
        apiUrl = "/api/DMRListSumberRisiko/" + idTipeSumberRisiko;

        HttpRequest.get(apiUrl).success(function (response) {

            $scope.identifikasi.master.sasaranFinansial[induk].sumberRisiko[item] = response;

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
        });
        // END MASTER SUMBER RISIKO

    }
    // ++ END RENDER MASTER ++ //

    // ++ RENDER PENYEBAB ++ //
    $scope.renderPenyebab = function (keyword) {
        var apiUrl = "/api/DMRListPenyebab/" + idDmr + "?keyword=" + keyword;
        return HttpRequest.get(apiUrl).then(function (response) {
            return response.data;
        });
    }
    // ++ END RENDER PENYEBAB ++ //

    // ####### SASARAN STRATEGIS ####### //
    $scope.identifikasi.sasaranStrategis = {};
    $scope.identifikasi.sasaranStrategis.isEditMode = false;

    $scope.eventClickIdentifikasiPenyebabAdd = function (induk, item) {
        $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].penyebab.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickIdentifikasiPenyebabRemove = function (induk, item, item2) {
        if ($scope.identifikasi.data.sasaranStrategis[induk].kategori[item].penyebab.length == 1) {
            alert("Penyebab tidak dapat dihapus, minimal ada 1 penyebab.");
        } else {
            var hapus = confirm('Hapus Penyebab ?');
            if (hapus) {
                $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].penyebab.splice(item2, 1);
            }
        }
    }

    $scope.eventClickIdentifikasiSubKategoriAdd = function (induk) {
        NProgress.start();
        var newSubKategoriSasaranStrategis = {
            id: Constant.emptyGuid,
            kategoriRisiko: {
                id: "",
                name: ""
            },
            subKategori: {
                id: "",
                name: ""
            },
            risiko: {
                id: "",
                name: ""
            },
            kejadian: {
                id: "",
                name: ""
            },
            tipeSumberRisiko: {
                id: "",
                name: ""
            },
            sumberRisiko: {
                id: "",
                name: ""
            },
            penyebab: [{
                id: "00000000-0000-0000-0000-000000000000",
                name: ""
            }],
            areaDampak: {
                id: "",
                name: ""
            }
        };

        $scope.identifikasi.data.sasaranStrategis[induk].kategori.push(newSubKategoriSasaranStrategis);
        $scope.identifikasi.master.sasaranStrategis.push({
            kategoriRisiko: [],
            subKategori: [],
            risiko: [],
            kejadian: [],
            tipeSumberRisiko: [],
            sumberRisiko: [],
            penyebab: []
        });

        var latest = $scope.identifikasi.master.sasaranStrategis[induk].kategoriRisiko.length;
        // MASTER KATEGORI
        apiUrl = "/api/DMRListKategoriRisiko/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranStrategis[induk].kategoriRisiko[latest] = response;
            apiUrl = "/api/DMRKRListTipeSumberRisiko";
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.identifikasi.master.sasaranStrategis[induk].tipeSumberRisiko[latest] = response;
                NProgress.done();
            }).error(function (response, code) {
                $scope.error.message = response.ExceptionMessage + " - " + code;
                $('#modalError2').modal('show');
                NProgress.done();
            });

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.eventClickIdentifikasiStrategiEdit = function () {
        $scope.identifikasi.sasaranStrategis.isEditMode = true;
    }

    $scope.eventClickIdentifikasiStrategiSave = function () {
        $scope.identifikasi.sasaranStrategis.isEditMode = false;
    }

    $scope.eventClickIdentifikasiStrategiDiscard = function () {
        $scope.identifikasi.sasaranStrategis.isEditMode = false;
    }

    // EVENT CHANGE KATEGORI SASARAN STRATEGIS
    $scope.eventChangeKategoriStrategis = function (induk, item) {
        var masterKategori = $scope.identifikasi.master.sasaranStrategis[induk].kategoriRisiko[item];
        var selectedKategori = Helper.findItem(masterKategori, "id", $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].kategoriRisiko.id);

        $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].kategoriRisiko.name = selectedKategori.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListSubKategoriRisiko/" + idDmr + "?idKat=" + selectedKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranStrategis[induk].subKategori[item] = response;

            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].subKategori.id = "";
            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].subKategori.name = "";

            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].risiko.id = "";
            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].risiko.name = "";

            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].kejadian.id = "";
            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].kejadian.name = "";

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE SUB KATEGORI SASARAN STRATEGIS
    $scope.eventChangeSubKategoriStrategis = function (induk, item) {
        var masterSubKategori = $scope.identifikasi.master.sasaranStrategis[induk].subKategori[item];
        var selectedSubKategori = Helper.findItem(masterSubKategori, "id", $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].subKategori.id);
        $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].subKategori.name = selectedSubKategori.name;

        // MASTER RISIKO
        apiUrl = "/api/DMRListRisiko/" + idDmr + "?idSubkat=" + selectedSubKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranStrategis[induk].risiko.splice(item, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].risiko.push(response);

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE RISIKO SASARAN STRATEGIS
    $scope.eventChangeRisikoStrategis = function (induk, item) {
        var masterRisiko = $scope.identifikasi.master.sasaranStrategis[induk].risiko[item];
        var selectedRisiko = Helper.findItem(masterRisiko, "id", $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].risiko.id);
        $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].risiko.name = selectedRisiko.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListKejadianRisiko/" + idDmr + "?idRisk=" + selectedRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranStrategis[induk].kejadian.splice(item, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].kejadian.push(response);
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE KEJADIAN SASARAN STRATEGIS
    $scope.eventChangeKejadianStrategis = function (induk, item) {
        var masterKejadian = $scope.identifikasi.master.sasaranStrategis[induk].kejadian[item];
        var selectedKejadian = Helper.findItem(masterKejadian, "id", $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].kejadian.id);
        $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].kejadian.name = selectedKejadian.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListAreaDampak/" + selectedKejadian.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranStrategis.areaDampak = response;
            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].areaDampak.id = $scope.identifikasi.master.sasaranStrategis.areaDampak.id;
            $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].areaDampak.name = $scope.identifikasi.master.sasaranStrategis.areaDampak.name;
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE TIPE SUMBER RISIKO SASARAN STRATEGIS
    $scope.eventChangeTipeSumberRisikoStrategis = function (induk, item) {
        var masterTipeSumberRisiko = $scope.identifikasi.master.sasaranStrategis[induk].tipeSumberRisiko[item];
        var selectedTipeSumberRisiko = Helper.findItem(masterTipeSumberRisiko, "id", $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].tipeSumberRisiko.id);
        $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].tipeSumberRisiko.name = selectedTipeSumberRisiko.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListSumberRisiko/" + selectedTipeSumberRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranStrategis[induk].sumberRisiko.splice(item, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].sumberRisiko.push(response);
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE SUMBER RISIKO SASARAN STRATEGIS
    $scope.eventChangeSumberRisikoStrategis = function (induk, item) {
        var masterSumberRisiko = $scope.identifikasi.master.sasaranStrategis[induk].sumberRisiko[item];
        var selectedSumberRisiko = Helper.findItem(masterSumberRisiko, "id", $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].sumberRisiko.id);
        $scope.identifikasi.data.sasaranStrategis[induk].kategori[item].sumberRisiko.name = selectedSumberRisiko.name;
    }


    // ####### SASARAN OPERASIONAL ####### //
    $scope.identifikasi.sasaranOperasional = {};
    $scope.identifikasi.sasaranOperasional.isEditMode = false;

    $scope.eventClickIdentifikasiPenyebab2Add = function (induk, item) {
        $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].penyebab.push({
            id: "00000000-0000-0000-0000-000000000000",
            name: ""
        });
    }

    $scope.eventClickIdentifikasiPenyebab2Remove = function (induk, item, item2) {
        if ($scope.identifikasi.data.sasaranOperasional[induk].kategori[item].penyebab.length == 1) {
            alert("Penyebab tidak dapat dihapus, minimal ada 1 penyebab.");
        } else {
            var hapus = confirm('Hapus Penyebab ?');
            if (hapus) {
                $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].penyebab.splice(item2, 1);
            }
        }
    }

    $scope.eventClickIdentifikasiSubKategori2Add = function (induk) {
        NProgress.start();
        var newSubKategoriSasaranStrategis = {
            id: Constant.emptyGuid,
            kategoriRisiko: {
                id: "",
                name: ""
            },
            subKategori: {
                id: "",
                name: ""
            },
            risiko: {
                id: "",
                name: ""
            },
            kejadian: {
                id: "",
                name: ""
            },
            tipeSumberRisiko: {
                id: "",
                name: ""
            },
            sumberRisiko: {
                id: "",
                name: ""
            },
            penyebab: [{
                id: "00000000-0000-0000-0000-000000000000",
                name: ""
            }],
            areaDampak: {
                id: "",
                name: ""
            }
        };
        $scope.identifikasi.data.sasaranOperasional[induk].kategori.push(newSubKategoriSasaranStrategis);
        $scope.identifikasi.master.sasaranOperasional.push({
            kategoriRisiko: [],
            subKategori: [],
            risiko: [],
            kejadian: [],
            tipeSumberRisiko: [],
            sumberRisiko: [],
            penyebab: []
        });

        var latest = $scope.identifikasi.master.sasaranOperasional[induk].kategoriRisiko.length;
        // MASTER KATEGORI
        apiUrl = "/api/DMRListKategoriRisiko/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranOperasional[induk].kategoriRisiko[latest] = response;
            apiUrl = "/api/DMRKRListTipeSumberRisiko";
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.identifikasi.master.sasaranOperasional[induk].tipeSumberRisiko[latest] = response;
                NProgress.done();
            }).error(function (response, code) {
                $scope.error.message = response.ExceptionMessage + " - " + code;
                $('#modalError2').modal('show');
                NProgress.done();
            });

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.eventClickIdentifikasiOperasionalEdit = function () {
        $scope.identifikasi.sasaranOperasional.isEditMode = true;
    }

    $scope.eventClickIdentifikasiOperasionalSave = function () {
        $scope.identifikasi.sasaranOperasional.isEditMode = false;
    }

    $scope.eventClickIdentifikasiOperasionalDiscard = function () {
        $scope.identifikasi.sasaranOperasional.isEditMode = false;
    }

    // EVENT CHANGE KATEGORI SASARAN OPERASIONAL
    $scope.eventChangeKategoriOperasional = function (induk, item) {
        var masterKategori = $scope.identifikasi.master.sasaranOperasional[induk].kategoriRisiko[item];
        var selectedKategori = Helper.findItem(masterKategori, "id", $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kategoriRisiko.id);

        $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kategoriRisiko.name = selectedKategori.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListSubKategoriRisiko/" + idDmr + "?idKat=" + selectedKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranOperasional[induk].subKategori[item] = response;

            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].subKategori.id = "";
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].subKategori.name = "";

            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].risiko.id = "";
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].risiko.name = "";

            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.id = "";
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.name = "";

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE SUB KATEGORI SASARAN OPERASIONAL
    $scope.eventChangeSubKategoriOperasional = function (induk, item) {
        var masterSubKategori = $scope.identifikasi.master.sasaranOperasional[induk].subKategori[item];
        var selectedSubKategori = Helper.findItem(masterSubKategori, "id", $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].subKategori.id);
        $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].subKategori.name = selectedSubKategori.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListRisiko/" + idDmr + "?idSubkat=" + selectedSubKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranOperasional[induk].risiko[item] = response;

            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].risiko.id = "";
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].risiko.name = "";

            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.id = "";
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.name = "";

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE RISIKO SASARAN OPERASIONAL
    $scope.eventChangeRisikoOperasional = function (induk, item) {
        var masterRisiko = $scope.identifikasi.master.sasaranOperasional[induk].risiko[item];
        var selectedRisiko = Helper.findItem(masterRisiko, "id", $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].risiko.id);
        $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].risiko.name = selectedRisiko.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListKejadianRisiko/" + idDmr + "?idRisk=" + selectedRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranOperasional[induk].kejadian[item] = response;

            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.id = "";
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.name = "";

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE KEJADIAN SASARAN OPERASIONAL
    $scope.eventChangeKejadianOperasional = function (induk, item) {
        var masterKejadian = $scope.identifikasi.master.sasaranOperasional[induk].kejadian[item];
        var selectedKejadian = Helper.findItem(masterKejadian, "id", $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.id);
        $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].kejadian.name = selectedKejadian.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListAreaDampak/" + selectedKejadian.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranOperasional.areaDampak = response;
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].areaDampak.id = $scope.identifikasi.master.sasaranOperasional.areaDampak.id;
            $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].areaDampak.name = $scope.identifikasi.master.sasaranOperasional.areaDampak.name;
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE TIPE SUMBER RISIKO SASARAN OPERASIONAL
    $scope.eventChangeTipeSumberRisikoOperasional = function (induk, item) {
        var masterTipeSumberRisiko = $scope.identifikasi.master.sasaranOperasional[induk].tipeSumberRisiko[item];
        var selectedTipeSumberRisiko = Helper.findItem(masterTipeSumberRisiko, "id", $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].tipeSumberRisiko.id);
        $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].tipeSumberRisiko.name = selectedTipeSumberRisiko.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListSumberRisiko/" + selectedTipeSumberRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranOperasional[induk].sumberRisiko[item] = response;
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE SUMBER RISIKO SASARAN OPERASIONAL
    $scope.eventChangeSumberRisikoOperasional = function (induk, item) {
        var masterSumberRisiko = $scope.identifikasi.master.sasaranOperasional[induk].sumberRisiko[item];
        var selectedSumberRisiko = Helper.findItem(masterSumberRisiko, "id", $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].sumberRisiko.id);
        $scope.identifikasi.data.sasaranOperasional[induk].kategori[item].sumberRisiko.name = selectedSumberRisiko.name;
    }



    // ####### SASARAN FINANSIAL ####### //
    $scope.identifikasi.sasaranFinansial = {};
    $scope.identifikasi.sasaranFinansial.isEditMode = false;

    $scope.eventClickIdentifikasiPenyebab3Add = function (induk, item) {
        $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].penyebab.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickIdentifikasiPenyebab3Remove = function (induk, item, item2) {
        if ($scope.identifikasi.data.sasaranFinansial[induk].kategori[item].penyebab.length == 1) {
            alert("Penyebab tidak dapat dihapus, minimal ada 1 penyebab.");
        } else {
            var hapus = confirm('Hapus Penyebab ?');
            if (hapus) {
                $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].penyebab.splice(item2, 1);
            }
        }
    }

    $scope.eventClickIdentifikasiSubKategori3Add = function (induk) {
        NProgress.start();
        var newSubKategoriSasaranStrategis = {
            id: Constant.emptyGuid,
            kategoriRisiko: {
                id: "",
                name: ""
            },
            subKategori: {
                id: "",
                name: ""
            },
            risiko: {
                id: "",
                name: ""
            },
            kejadian: {
                id: "",
                name: ""
            },
            tipeSumberRisiko: {
                id: "",
                name: ""
            },
            sumberRisiko: {
                id: "",
                name: ""
            },
            penyebab: [{
                id: "00000000-0000-0000-0000-000000000000",
                name: ""
            }],
            areaDampak: {
                id: "",
                name: ""
            }
        };
        $scope.identifikasi.data.sasaranFinansial[induk].kategori.push(newSubKategoriSasaranStrategis);
        $scope.identifikasi.master.sasaranFinansial.push({
            kategoriRisiko: [],
            subKategori: [],
            risiko: [],
            kejadian: [],
            tipeSumberRisiko: [],
            sumberRisiko: []
        });


        // MASTER KATEGORI
        apiUrl = "/api/DMRListKategoriRisiko/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranFinansial[induk].kategoriRisiko.push(response);
            apiUrl = "/api/DMRKRListTipeSumberRisiko";
            HttpRequest.get(apiUrl).success(function (response) {
                $scope.identifikasi.master.sasaranFinansial[induk].tipeSumberRisiko.push(response);
                NProgress.done();
            }).error(function (response, code) {
                $scope.error.message = response.ExceptionMessage + " - " + code;
                $('#modalError2').modal('show');
                NProgress.done();
            });

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.eventClickIdentifikasiFinansialEdit = function () {
        $scope.identifikasi.sasaranFinansial.isEditMode = true;
    }

    $scope.eventClickIdentifikasiFinansialSave = function () {
        $scope.identifikasi.sasaranFinansial.isEditMode = false;
    }

    $scope.eventClickIdentifikasiFinansialDiscard = function () {
        $scope.identifikasi.sasaranFinansial.isEditMode = false;
    }

    // EVENT CHANGE KATEGORI SASARAN FINANSIAL
    $scope.eventChangeKategoriFinansial = function (induk, item) {
        var masterKategori = $scope.identifikasi.master.sasaranFinansial[induk].kategoriRisiko[item];
        var selectedKategori = Helper.findItem(masterKategori, "id", $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kategoriRisiko.id);

        $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kategoriRisiko.name = selectedKategori.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListSubKategoriRisiko/" + idDmr + "?idKat=" + selectedKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranFinansial[induk].subKategori.splice(item, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].subKategori.push(response);

            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].subKategori.id = "";
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].subKategori.name = "";

            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].risiko.id = "";
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].risiko.name = "";

            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.id = "";
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.name = "";

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE SUB KATEGORI SASARAN FINANSIAL
    $scope.eventChangeSubKategoriFinansial = function (induk, item) {
        var masterSubKategori = $scope.identifikasi.master.sasaranFinansial[induk].subKategori[item];
        var selectedSubKategori = Helper.findItem(masterSubKategori, "id", $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].subKategori.id);
        $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].subKategori.name = selectedSubKategori.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListRisiko/" + idDmr + "?idSubkat=" + selectedSubKategori.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranFinansial[induk].risiko.splice(item, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].risiko.push(response);

            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].risiko.id = "";
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].risiko.name = "";

            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.id = "";
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.name = "";

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE RISIKO SASARAN FINANSIAL
    $scope.eventChangeRisikoFinansial = function (induk, item) {
        var masterRisiko = $scope.identifikasi.master.sasaranFinansial[induk].risiko[item];
        var selectedRisiko = Helper.findItem(masterRisiko, "id", $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].risiko.id);
        $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].risiko.name = selectedRisiko.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListKejadianRisiko/" + idDmr + "?idRisk=" + selectedRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranFinansial[induk].kejadian.splice(item, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].kejadian.push(response);

            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.id = "";
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.name = "";

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE KEJADIAN SASARAN FINANSIAL
    $scope.eventChangeKejadianFinansial = function (induk, item) {
        var masterKejadian = $scope.identifikasi.master.sasaranFinansial[induk].kejadian[item];
        var selectedKejadian = Helper.findItem(masterKejadian, "id", $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.id);
        $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].kejadian.name = selectedKejadian.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListAreaDampak/" + selectedKejadian.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranFinansial.areaDampak = response;
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].areaDampak.id = $scope.identifikasi.master.sasaranFinansial.areaDampak.id;
            $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].areaDampak.name = $scope.identifikasi.master.sasaranFinansial.areaDampak.name;
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE TIPE SUMBER RISIKO SASARAN FINANSIAL
    $scope.eventChangeTipeSumberRisikoFinansial = function (induk, item) {
        var masterTipeSumberRisiko = $scope.identifikasi.master.sasaranFinansial[induk].tipeSumberRisiko[item];
        var selectedTipeSumberRisiko = Helper.findItem(masterTipeSumberRisiko, "id", $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].tipeSumberRisiko.id);
        $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].tipeSumberRisiko.name = selectedTipeSumberRisiko.name;

        // MASTER SUB KATEGORI
        apiUrl = "/api/DMRListSumberRisiko/" + selectedTipeSumberRisiko.id;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.identifikasi.master.sasaranFinansial[induk].sumberRisiko.splice(item, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].sumberRisiko.push(response);
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    // EVENT CHANGE SUMBER RISIKO SASARAN FINANSIAL
    $scope.eventChangeSumberRisikoFinansial = function (induk, item) {
        var masterSumberRisiko = $scope.identifikasi.master.sasaranFinansial[induk].sumberRisiko[item];
        var selectedSumberRisiko = Helper.findItem(masterSumberRisiko, "id", $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].sumberRisiko.id);
        $scope.identifikasi.data.sasaranFinansial[induk].kategori[item].sumberRisiko.name = selectedSumberRisiko.name;
    }


    // ####### EVENT DELETE TAKSONOMI RISIKO ####### //
    $scope.deleteTaksonomiRisikoSasaranStrategis = function (induk, index) {
        var hapus = confirm('Hapus Risiko ?');
        if (hapus) {
            $scope.identifikasi.data.sasaranStrategis[induk].kategori.splice(index, 1);

            $scope.identifikasi.master.sasaranStrategis[induk].kategoriRisiko.splice(index, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].subKategori.splice(index, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].risiko.splice(index, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].kejadian.splice(index, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].tipeSumberRisiko.splice(index, 1);
            $scope.identifikasi.master.sasaranStrategis[induk].sumberRisiko.splice(index, 1);
        }
    }

    $scope.deleteTaksonomiRisikoSasaranOperasional = function (induk, index) {
        var hapus = confirm('Hapus Risiko ?');
        if (hapus) {
            $scope.identifikasi.data.sasaranOperasional[induk].kategori.splice(index, 1);

            $scope.identifikasi.master.sasaranOperasional[induk].kategoriRisiko.splice(index, 1);
            $scope.identifikasi.master.sasaranOperasional[induk].subKategori.splice(index, 1);
            $scope.identifikasi.master.sasaranOperasional[induk].risiko.splice(index, 1);
            $scope.identifikasi.master.sasaranOperasional[induk].kejadian.splice(index, 1);
            $scope.identifikasi.master.sasaranOperasional[induk].tipeSumberRisiko.splice(index, 1);
            $scope.identifikasi.master.sasaranOperasional[induk].sumberRisiko.splice(index, 1);
        }
    }

    $scope.deleteTaksonomiRisikoSasaranFinansial = function (induk, index) {
        var hapus = confirm('Hapus Risiko ?');
        if (hapus) {
            $scope.identifikasi.data.sasaranFinansial[induk].kategori.splice(index, 1);

            $scope.identifikasi.master.sasaranFinansial[induk].kategoriRisiko.splice(index, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].subKategori.splice(index, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].risiko.splice(index, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].kejadian.splice(index, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].tipeSumberRisiko.splice(index, 1);
            $scope.identifikasi.master.sasaranFinansial[induk].sumberRisiko.splice(index, 1);
        }
    }
    // ####### END EVENT DELETE TAKSONOMI RISIKO ####### //

    // ####### MAIN EVENT ####### //
    $scope.eventClickIdentifikasiEdit = function () {
        $scope.identifikasi.isEditMode = true;
    }

    $scope.eventClickIdentifikasiSave = function () {
        NProgress.start();
        var apiUrl = "/api/DMRKRIdentifikasi";
        $scope.identifikasi.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.identifikasi.data).success(function (response) {
            $scope.renderIdentifikasi();
            $scope.identifikasi.isEditMode = false;
            $scope.renderApprovalStatus();
            NProgress.done();
        }).error(function (response, code) {

            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.eventClickIdentifikasiDiscard = function () {
        $scope.renderIdentifikasi();
        $scope.identifikasi.isEditMode = false;
    }
    // ####### END MAIN EVENT ####### //

    // =========== END OF KAJIAN RISIKO - IDENTIFIKASI ============//



    // =========== STAR KAJIAN RISIKO - ANALISA & EVALUASI =============//

    $scope.renderAnalisaEvaluasi = function () {
        NProgress.start();
        apiUrl = "/api/DmrKRAnalisaEvaluasi/" + idDmr
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.analisaEvaluasi.data = response;


            // SASARAN STRATEGIS //
            var sasaranStrategis = $scope.analisaEvaluasi.data.sasaranStrategis;
            if (!Helper.isNullOrEmpty(sasaranStrategis)) {
                angular.forEach($scope.analisaEvaluasi.data.sasaranStrategis, function (induk, i) {
                    $scope.analisaEvaluasi.master.sasaranStrategis[i] = [];
                    $scope.analisaEvaluasi.master.sasaranStrategis[i].peringkatDampak = [];
                    $scope.analisaEvaluasi.master.sasaranStrategis[i].tipePeringkatKemungkinan = [];
                    $scope.analisaEvaluasi.master.sasaranStrategis[i].peringkatKemungkinan = [];
                    angular.forEach(induk.risiko, function (subitem, j) {

                        $scope.analisaEvaluasi.master.efektivitasDLI.push([]);
                        $scope.analisaEvaluasi.master.peringkatDampak.push([]);

                        angular.forEach(subitem.penyebab, function (item, k) {
                            $scope.bidangStrategisModel = true;
                            $scope.analisaEvaluasi.master.sasaranStrategis[i].peringkatDampak[j] = [];
                            $scope.analisaEvaluasi.master.sasaranStrategis[i].tipePeringkatKemungkinan[j] = [];
                            $scope.analisaEvaluasi.master.sasaranStrategis[i].peringkatKemungkinan[j] = [];

                            $scope.renderListEfektivitasDLI(i, j, k, true);
                            $scope.renderPeringkatDampakSasaranStrategis(i, j, k, true);
                            $scope.renderTipePeringkatKemungkinanSasaranStrategis(i, j, k, true);
                            $scope.renderPeringkatKemungkinanSasaranStrategis(i, j, k);

                        });

                    });


                    //Master Efektivitas - Approach
                    var efektivitasA = [{
                            id: 0,
                            name: "0 : Tidak Ada"
                        },
                        {
                            id: 1,
                            name: "1 : Sangat Lemah"
                        },
                        {
                            id: 2,
                            name: "2 : Lemah"
                        },
                        {
                            id: 3,
                            name: "3 : Sedang"
                        },
                        {
                            id: 4,
                            name: "4 : Kuat"
                        },
                        {
                            id: 5,
                            name: "5 : Sangat Kuat"
                        }
                    ];
                    $scope.analisaEvaluasi.master.efektivitasA = efektivitasA;
                });
            }

            // SASARAN OPERASIONAL //
            var sasaranOperasional = $scope.analisaEvaluasi.data.sasaranOperasional;
            if (!Helper.isNullOrEmpty(sasaranOperasional)) {
                angular.forEach($scope.analisaEvaluasi.data.sasaranOperasional, function (induk, i) {

                    $scope.analisaEvaluasi.master.sasaranOperasional[i] = [];
                    $scope.analisaEvaluasi.master.sasaranOperasional[i].peringkatDampak = [];
                    $scope.analisaEvaluasi.master.sasaranOperasional[i].tipePeringkatKemungkinan = [];
                    $scope.analisaEvaluasi.master.sasaranOperasional[i].peringkatKemungkinan = [];
                    angular.forEach(induk.risiko, function (subitem, j) {

                        $scope.analisaEvaluasi.master.efektivitasDLI2.push([]);
                        $scope.analisaEvaluasi.master.peringkatDampak.push([]);

                        angular.forEach(subitem.penyebab, function (item, k) {

                            $scope.analisaEvaluasi.master.sasaranOperasional[i].peringkatDampak[j] = [];
                            $scope.analisaEvaluasi.master.sasaranOperasional[i].tipePeringkatKemungkinan[j] = [];
                            $scope.analisaEvaluasi.master.sasaranOperasional[i].peringkatKemungkinan[j] = [];

                            $scope.renderListEfektivitasDLI2(i, j, k, true);
                            $scope.renderPeringkatDampakSasaranOperasional(i, j, k, true);
                            $scope.renderTipePeringkatKemungkinanSasaranOperasional(i, j, k, true);
                            $scope.renderPeringkatKemungkinanSasaranOperasional(i, j, k);

                        });

                    });


                    //Master Efektivitas - Approach
                    var efektivitasA2 = [{
                            id: 0,
                            name: "0 : Tidak Ada"
                        },
                        {
                            id: 1,
                            name: "1 : Sangat Lemah"
                        },
                        {
                            id: 2,
                            name: "2 : Lemah"
                        },
                        {
                            id: 3,
                            name: "3 : Sedang"
                        },
                        {
                            id: 4,
                            name: "4 : Kuat"
                        },
                        {
                            id: 5,
                            name: "5 : Sangat Kuat"
                        }
                    ];
                    $scope.analisaEvaluasi.master.efektivitasA2 = efektivitasA2;
                });
            }

            // SASARAN FINANSIAL //
            var sasaranFinansial = $scope.analisaEvaluasi.data.sasaranFinansial;
            if (!Helper.isNullOrEmpty(sasaranFinansial)) {
                angular.forEach($scope.analisaEvaluasi.data.sasaranFinansial, function (induk, i) {

                    $scope.analisaEvaluasi.master.sasaranFinansial[i] = [];
                    $scope.analisaEvaluasi.master.sasaranFinansial[i].peringkatDampak = [];
                    $scope.analisaEvaluasi.master.sasaranFinansial[i].tipePeringkatKemungkinan = [];
                    $scope.analisaEvaluasi.master.sasaranFinansial[i].peringkatKemungkinan = [];
                    angular.forEach(induk.risiko, function (subitem, j) {

                        $scope.analisaEvaluasi.master.efektivitasDLI3.push([]);
                        $scope.analisaEvaluasi.master.peringkatDampak.push([]);

                        angular.forEach(subitem.penyebab, function (item, k) {

                            $scope.analisaEvaluasi.master.sasaranFinansial[i].peringkatDampak[j] = [];
                            $scope.analisaEvaluasi.master.sasaranFinansial[i].tipePeringkatKemungkinan[j] = [];
                            $scope.analisaEvaluasi.master.sasaranFinansial[i].peringkatKemungkinan[j] = [];

                            $scope.renderListEfektivitasDLI3(i, j, k, true);
                            $scope.renderPeringkatDampakSasaranFinansial(i, j, k, true);
                            $scope.renderTipePeringkatKemungkinanSasaranFinansial(i, j, k, true);
                            $scope.renderPeringkatKemungkinanSasaranFinansial(i, j, k);

                        });

                    });


                    //Master Efektivitas - Approach
                    var efektivitasA3 = [{
                            id: 0,
                            name: "0 : Tidak Ada"
                        },
                        {
                            id: 1,
                            name: "1 : Sangat Lemah"
                        },
                        {
                            id: 2,
                            name: "2 : Lemah"
                        },
                        {
                            id: 3,
                            name: "3 : Sedang"
                        },
                        {
                            id: 4,
                            name: "4 : Kuat"
                        },
                        {
                            id: 5,
                            name: "5 : Sangat Kuat"
                        }
                    ];
                    $scope.analisaEvaluasi.master.efektivitasA3 = efektivitasA3;
                });
            }

            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });

        //$scope.analisaEvaluasi.data.sasaranStrategis = [{
        //                                                    sasaran: "Meningkatnya Trust dari pemegang saham dan kepuasan",
        //                                                    risiko: [
        //                                                     {
        //                                                        risiko: "Risiko : Perubahan Organisasi Korporat, Perubahan Regulasi Pemerintah",
        //                                                        penyebab:
        //                                                            [{
        //                                                                namaPenyebab: "Penyebab : Kinerja mesin memburuk",
        //                                                                areaDampak: "Reputasi",
        //                                                                existingControl: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                                                                fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                                efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                                peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                                peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                                peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                                relatifRisiko: "48",
        //                                                                tingkatRisiko: "Tinggi (3,IV)",
        //                                                                keberterimaanRisiko: "Tidak Diterima"
        //                                                            },
        //                                                            {
        //                                                                namaPenyebab: "Penyebab : Kinerja mesin memburuk kedua kalinya",
        //                                                                areaDampak: "Reputasi",
        //                                                                existingControl: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                                                                fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                                efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                                peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                                peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                                peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                                relatifRisiko: "48",
        //                                                                tingkatRisiko: "Tinggi (3,IV)",
        //                                                                keberterimaanRisiko: "Tidak Diterima"
        //                                                            }]
        //                                                     }, {
        //                                                        risiko:"Risiko : Subsidi Listrik",
        //                                                        penyebab:
        //                                                            [{
        //                                                                namaPenyebab: "Penyebab : Perubahan APBN",
        //                                                                areaDampak: "Revenue",
        //                                                                existingControl: "Kontrok Eksisting Revenue Perubahan APBN",
        //                                                                fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                                efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                                peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                                peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                                peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                                relatifRisiko: "48",
        //                                                                tingkatRisiko: "Tinggi (3,IV)",
        //                                                                keberterimaanRisiko: "Tidak Diterima"
        //                                                            }]
        //                                                    }],
        //}];
        //$scope.analisaEvaluasi.data.sasaranOperasional = [{
        //                                            sasaran: "Meningkatnya Trust dari pemegang saham dan kepuasan",
        //                                            risiko: [
        //                                             {
        //                                                 risiko: "Risiko : Perubahan Organisasi Korporat, Perubahan Regulasi Pemerintah Operasional",
        //                                                 penyebab:
        //                                                     [{
        //                                                         namaPenyebab: "Penyebab : Kinerja mesin memburuk Operasional",
        //                                                         areaDampak: "Reputasi",
        //                                                         existingControl: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                                                         fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                         efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                         peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                         peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                         peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                         relatifRisiko: "48",
        //                                                         tingkatRisiko: "Tinggi (3,IV)",
        //                                                         keberterimaanRisiko: "Tidak Diterima"
        //                                                     },
        //                                                     {
        //                                                         namaPenyebab: "Penyebab : Kinerja mesin memburuk kedua kalinya Operasional",
        //                                                         areaDampak: "Reputasi",
        //                                                         existingControl: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                                                         fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                         efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                         peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                         peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                         peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                         relatifRisiko: "48",
        //                                                         tingkatRisiko: "Tinggi (3,IV)",
        //                                                         keberterimaanRisiko: "Tidak Diterima"
        //                                                     }]
        //                                             }, {
        //                                                 risiko: "Risiko : Subsidi Listrik Operasional",
        //                                                 penyebab:
        //                                                     [{
        //                                                         namaPenyebab: "Penyebab : Perubahan APBN Operasional",
        //                                                         areaDampak: "Revenue",
        //                                                         existingControl: "Kontrok Eksisting Revenue Perubahan APBN",
        //                                                         fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                         efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                         peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                         peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                         peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                         relatifRisiko: "48",
        //                                                         tingkatRisiko: "Tinggi (3,IV)",
        //                                                         keberterimaanRisiko: "Tidak Diterima"
        //                                                     }]
        //                                             }],
        //                                        }];
        //$scope.analisaEvaluasi.data.sasaranFinansial = [{
        //                                        sasaran: "Meningkatnya Trust dari pemegang saham dan kepuasan Finansial",
        //                                        risiko: [
        //                                         {
        //                                             risiko: "Risiko : Perubahan Organisasi Korporat, Perubahan Regulasi Pemerintah Finansial",
        //                                             penyebab:
        //                                                 [{
        //                                                     namaPenyebab: "Penyebab : Kinerja mesin memburuk",
        //                                                     areaDampak: "Reputasi",
        //                                                     existingControl: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                                                     fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                     efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                     peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                     peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                     peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                     relatifRisiko: "48",
        //                                                     tingkatRisiko: "Tinggi (3,IV)",
        //                                                     keberterimaanRisiko: "Tidak Diterima"
        //                                                 },
        //                                                 {
        //                                                     namaPenyebab: "Penyebab : Kinerja mesin memburuk kedua kalinya",
        //                                                     areaDampak: "Reputasi",
        //                                                     existingControl: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                                                     fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                     efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                     peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                     peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                     peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                     relatifRisiko: "48",
        //                                                     tingkatRisiko: "Tinggi (3,IV)",
        //                                                     keberterimaanRisiko: "Tidak Diterima"
        //                                                 }]
        //                                         }, {
        //                                             risiko: "Risiko : Subsidi Listrik Finansial",
        //                                             penyebab:
        //                                                 [{
        //                                                     namaPenyebab: "Penyebab : Perubahan APBN",
        //                                                     areaDampak: "Revenue",
        //                                                     existingControl: "Kontrok Eksisting Revenue Perubahan APBN",
        //                                                     fungsiKontrol: { dampak: false, kemungkinan: true, keduanya: false },
        //                                                     efektifitas: { approach: "", deployment: "", learning: "", integration: "", nilai: "" },
        //                                                     peringkatDampak: { id: "", name: "Penambahan 5% sampai dengan <10%" },
        //                                                     peringkatKemungkinan1: { id: "", name: "Frekuensi" },
        //                                                     peringkatKemungkinan2: { id: "", name: "Antara 15 sampai dengan 30" },
        //                                                     relatifRisiko: "48",
        //                                                     tingkatRisiko: "Tinggi (3,IV)",
        //                                                     keberterimaanRisiko: "Tidak Diterima"
        //                                                 }]
        //                                         }],
        //}];

        NProgress.done();
    }

    // === ++ RENDER MASTER SASARAN STRATEGIS
    $scope.renderPeringkatDampakSasaranStrategis = function (indexSasaran, indexAE, indexPenyebab, isAppended) {
        //Master Peringkat Kemungkinan
        var idAreaDampak = Constant.emptyGuid;
        var nilai = 0;
        try {
            idAreaDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].areaDampak.id, Constant.emptyGuid);
        } catch (err) {}

        var apiUrl = "/api/DmrKRListPeringkatDampak/" + idDmr + "?idArea=" + idAreaDampak;
        console.log("API Url", apiUrl);

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].peringkatDampak[indexAE].push(response);
                else
                    $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].peringkatDampak[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderTipePeringkatKemungkinanSasaranStrategis = function (indexSasaran, indexAE, indexPenyebab, isAppended) {
        //Master Tipe Peringkat Kemungkinan

        var apiUrl = "/api/DmrKRListTipePeringkatKemungkinan";

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].tipePeringkatKemungkinan[indexAE].push(response);
                else
                    $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].tipePeringkatKemungkinan[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderPeringkatKemungkinanSasaranStrategis = function (indexSasaran, indexAE, indexPenyebab) {
        var idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.id, Constant.emptyGuid);
        var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
        var nilaiDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai, 0);

        var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;
        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.peringkatDampakSasaranStrategisChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idPeringkatDampakIR = $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id;
        var masterPeringkatDampakIR = $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].peringkatDampak[indexAE][indexPenyebab];
        var selectedPeringkatDampakIR = Helper.findItem(masterPeringkatDampakIR, "id", idPeringkatDampakIR);

        $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;
        $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.keterangan = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.keterangan;
        $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.nilai;

        $scope.hitungTingkatRisikoSasaranStrategis(indexSasaran, indexAE, indexPenyebab);
    }

    $scope.tipePeringkatKemungkinanSasaranStrategisChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idTipePeringkatKemungkinan = $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.id;
        var masterTipePeringkatKemungkinan = $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].tipePeringkatKemungkinan[indexAE][indexPenyebab];
        var selectedPeringkatDampakIR = Helper.findItem(masterTipePeringkatKemungkinan, "id", idTipePeringkatKemungkinan);

        $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;

        var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
        var nilaiDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai, 0);

        var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab] = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.peringkatKemungkinanSasaranStrategisChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idPeringkatKemungkinan = $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id;
        var masterPeringkatKemungkinan = $scope.analisaEvaluasi.master.sasaranStrategis[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab];
        var selectedPeringkatKemungkinan = Helper.findItem(masterPeringkatKemungkinan, "id", idPeringkatKemungkinan);

        $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.name = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.name;
        $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.keterangan = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.keterangan;
        $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.nilai = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.nilai;
        $scope.hitungTingkatRisikoSasaranStrategis(indexSasaran, indexAE, indexPenyebab);
    }

    $scope.hitungTingkatRisikoSasaranStrategis = function (indexSasaran, indexAE, indexPenyebab) {
        var idPerDampak = Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id) ? Constant.emptyGuid : $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id;
        var idPerKemungkinan = Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id) ? Constant.emptyGuid : $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id;

        var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.data.sasaranStrategis[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tingkatRisiko = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "AE Hitung Tingkat Risiko CR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }



    // === ++ RENDER MASTER SASARAN OPERASIONAL
    $scope.renderPeringkatDampakSasaranOperasional = function (indexSasaran, indexAE, indexPenyebab, isAppended) {
        //Master Peringkat Kemungkinan
        var idAreaDampak = Constant.emptyGuid;
        var nilai = 0;
        try {
            idAreaDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].areaDampak.id, Constant.emptyGuid);
        } catch (err) {}

        var apiUrl = "/api/DmrKRListPeringkatDampak/" + idDmr + "?idArea=" + idAreaDampak;

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].peringkatDampak[indexAE].push(response);
                else
                    $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].peringkatDampak[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderTipePeringkatKemungkinanSasaranOperasional = function (indexSasaran, indexAE, indexPenyebab, isAppended) {
        //Master Tipe Peringkat Kemungkinan

        var apiUrl = "/api/DmrKRListTipePeringkatKemungkinan";

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].tipePeringkatKemungkinan[indexAE].push(response);
                else
                    $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].tipePeringkatKemungkinan[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderPeringkatKemungkinanSasaranOperasional = function (indexSasaran, indexAE, indexPenyebab) {
        var idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.id, Constant.emptyGuid);
        var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
        var nilaiDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai, 0);

        var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;
        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.peringkatDampakSasaranOperasionalChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idPeringkatDampakIR = $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id;
        var masterPeringkatDampakIR = $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].peringkatDampak[indexAE][indexPenyebab];
        var selectedPeringkatDampakIR = Helper.findItem(masterPeringkatDampakIR, "id", idPeringkatDampakIR);

        $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;
        $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.keterangan = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.keterangan;
        $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.nilai;

        $scope.hitungTingkatRisikoSasaranOperasional(indexSasaran, indexAE, indexPenyebab);
    }

    $scope.tipePeringkatKemungkinanSasaranOperasionalChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idTipePeringkatKemungkinan = $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.id;
        var masterTipePeringkatKemungkinan = $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].tipePeringkatKemungkinan[indexAE][indexPenyebab];
        var selectedPeringkatDampakIR = Helper.findItem(masterTipePeringkatKemungkinan, "id", idTipePeringkatKemungkinan);

        $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;

        var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
        var nilaiDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai, 0);

        var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab] = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.peringkatKemungkinanSasaranOperasionalChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idPeringkatKemungkinan = $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id;
        var masterPeringkatKemungkinan = $scope.analisaEvaluasi.master.sasaranOperasional[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab];
        var selectedPeringkatKemungkinan = Helper.findItem(masterPeringkatKemungkinan, "id", idPeringkatKemungkinan);

        $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.name = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.name;
        $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.keterangan = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.keterangan;
        $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.nilai = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.nilai;

        $scope.hitungTingkatRisikoSasaranOperasional(indexSasaran, indexAE, indexPenyebab);
    }

    $scope.hitungTingkatRisikoSasaranOperasional = function (indexSasaran, indexAE, indexPenyebab) {
        var idPerDampak = Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id) ? Constant.emptyGuid : $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id;
        var idPerKemungkinan = Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id) ? Constant.emptyGuid : $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id;

        var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.data.sasaranOperasional[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tingkatRisiko = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "AE Hitung Tingkat Risiko CR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }



    // === ++ RENDER MASTER SASARAN FINANSIAL
    $scope.renderPeringkatDampakSasaranFinansial = function (indexSasaran, indexAE, indexPenyebab, isAppended) {
        //Master Peringkat Kemungkinan
        var idAreaDampak = Constant.emptyGuid;
        var nilai = 0;
        try {
            idAreaDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].areaDampak.id, Constant.emptyGuid);
        } catch (err) {}

        var apiUrl = "/api/DmrKRListPeringkatDampak/" + idDmr + "?idArea=" + idAreaDampak;

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].peringkatDampak[indexAE].push(response);
                else
                    $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].peringkatDampak[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderTipePeringkatKemungkinanSasaranFinansial = function (indexSasaran, indexAE, indexPenyebab, isAppended) {
        //Master Tipe Peringkat Kemungkinan

        var apiUrl = "/api/DmrKRListTipePeringkatKemungkinan";

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].tipePeringkatKemungkinan[indexAE].push(response);
                else
                    $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].tipePeringkatKemungkinan[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderPeringkatKemungkinanSasaranFinansial = function (indexSasaran, indexAE, indexPenyebab) {
        var idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.id, Constant.emptyGuid);
        var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
        var nilaiDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai, 0);

        var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;
        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.peringkatDampakSasaranFinansialChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idPeringkatDampakIR = $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id;
        var masterPeringkatDampakIR = $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].peringkatDampak[indexAE][indexPenyebab];
        var selectedPeringkatDampakIR = Helper.findItem(masterPeringkatDampakIR, "id", idPeringkatDampakIR);

        $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;
        $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.keterangan = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.keterangan;
        $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.nilai;

        $scope.hitungTingkatRisikoSasaranFinansial(indexSasaran, indexAE, indexPenyebab);
    }

    $scope.tipePeringkatKemungkinanSasaranFinansialChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idTipePeringkatKemungkinan = $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.id;
        var masterTipePeringkatKemungkinan = $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].tipePeringkatKemungkinan[indexAE][indexPenyebab];
        var selectedPeringkatDampakIR = Helper.findItem(masterTipePeringkatKemungkinan, "id", idTipePeringkatKemungkinan);

        $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tipePeringkatKemungkinan.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;

        var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
        var nilaiDampak = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.nilai, 0);

        var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab] = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "AE List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.peringkatKemungkinanSasaranFinansialChange = function (indexSasaran, indexAE, indexPenyebab) {
        var idPeringkatKemungkinan = $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id;
        var masterPeringkatKemungkinan = $scope.analisaEvaluasi.master.sasaranFinansial[indexSasaran].peringkatKemungkinan[indexAE][indexPenyebab];
        var selectedPeringkatKemungkinan = Helper.findItem(masterPeringkatKemungkinan, "id", idPeringkatKemungkinan);

        $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.name = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.name;
        $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.keterangan = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.keterangan;
        $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.nilai = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.nilai;
        $scope.hitungTingkatRisikoSasaranFinansial(indexSasaran, indexAE, indexPenyebab);
    }

    $scope.hitungTingkatRisikoSasaranFinansial = function (indexSasaran, indexAE, indexPenyebab) {
        var idPerDampak = Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id) ? Constant.emptyGuid : $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatDampak.id;
        var idPerKemungkinan = Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id) ? Constant.emptyGuid : $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].peringkatKemungkinan.id;

        var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.analisaEvaluasi.data.sasaranFinansial[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].tingkatRisiko = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "AE Hitung Tingkat Risiko CR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }


    // EVENT SAVE , EDIT, DISCARD//

    $scope.eventClickAnalisaEdit = function () {
        $scope.analisaEvaluasi.isEditMode = true;
    }

    $scope.eventClickAnalisaSave = function () {
        NProgress.start();
        var apiUrl = "/api/DmrKRAnalisaEvaluasi";
        $scope.analisaEvaluasi.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.analisaEvaluasi.data).success(function (response) {
            $scope.renderAnalisaEvaluasi();
            $scope.analisaEvaluasi.isEditMode = false;
            $scope.renderApprovalStatus();
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');

            NProgress.done();
        });
    }

    $scope.eventClickAnalisaDiscard = function () {
        NProgress.start();
        $scope.analisaEvaluasi.isEditMode = false;
        $scope.renderAnalisaEvaluasi();
        NProgress.done();
    }



    // Sasaran Strategis
    $scope.eventClickAnalisaEvaluasiStrategiSave = function () {
        $scope.analisaEvaluasi.data.sasaranStrategis.isEditMode = false;
    }

    $scope.eventClickAnalisaEvaluasiStrategiDiscard = function () {
        $scope.analisaEvaluasi.data.sasaranStrategis.isEditMode = false;
    }

    $scope.eventClickAnalisaEvaluasiStrategiEdit = function () {
        $scope.analisaEvaluasi.data.sasaranStrategis.isEditMode = true;
    }

    $scope.eventClickAnalisaEvaluasiAdd = function (pIndex, jenis) {
        $scope.analisaEvaluasi.data.sasaranStrategis[pIndex].penyebab.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickAnalisaEvaluasiRemove = function (pIndex, index, jenis) {
        $scope.analisaEvaluasi.data.sasaranStrategis[pIndex].penyebab.splice(index, 1);
    }

    //SORRY UNTUK BAGIAN INI DIBIKIN BERULANG , LAGI PUSING//
    //START OF SASARAN STRATEGIS//

    $scope.adliChange = function (indexAE, indexPenyebab, indexExistingControl) {
        var approach = 0;
        var deployment = 0;
        var learning = 0;
        var integration = 0;
        var score = 0;

        if (!Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas)) {
            approach = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach);
            deployment = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment);
            learning = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning);
            integration = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration);
            score = (approach + deployment + learning + integration) / 4;

            $scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.nilai = (score >= 0 && score <= 5) ? score : 0;
            $scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.label = Helper.getLabelEfektivitas(score);
        };

        $scope.adjustValueDLI(indexAE, indexPenyebab, indexExistingControl);
        $scope.renderListEfektivitasDLI(indexAE, indexPenyebab, indexExistingControl, false);
    }

    $scope.adjustValueDLI = function (indexAE, indexPenyebab, indexExistingControl) {
        if (!Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas)) {
            var approach = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach);
            var deployment = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment);
            var learning = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning);
            var integration = parseInt($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration);

            if (deployment > approach)
                $scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment = approach;

            if (learning > approach)
                $scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning = approach;

            if (integration > approach)
                $scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration = approach;
        };
    }

    $scope.renderListEfektivitasDLI = function (indexAE, indexPenyebab, indexExistingControl, isAppended) {
        //Master Efektivitas - DLI
        var efektivitasDLI = [];
        var approach = 0;

        try {
            approach = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranStrategis[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach, 0);
        } catch (err) {}

        var labelEfektivitas = ["0 : Tidak Ada", "1 : Sangat Lemah", "2 : Lemah", "3 : Sedang", "4 : Kuat", "5 : Sangat Kuat"];

        for (var i = 0; i <= approach; i++)
            efektivitasDLI.push({
                id: i,
                name: labelEfektivitas[i]
            });
        if (isAppended)
            $scope.analisaEvaluasi.master.efektivitasDLI[indexPenyebab].push(efektivitasDLI);
        else
            $scope.analisaEvaluasi.master.efektivitasDLI[indexPenyebab][indexExistingControl] = efektivitasDLI;
    }

    //END OF SASARAN STRATEGIS//

    //START OF SASARAN OPERASIONAL//

    $scope.adliChange2 = function (indexAE, indexPenyebab, indexExistingControl) {
        var approach = 0;
        var deployment = 0;
        var learning = 0;
        var integration = 0;
        var score = 0;

        if (!Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas)) {
            approach = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach);
            deployment = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment);
            learning = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning);
            integration = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration);
            score = (approach + deployment + learning + integration) / 4;

            $scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.nilai = (score >= 0 && score <= 5) ? score : 0;
            $scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.label = Helper.getLabelEfektivitas(score);
        };

        $scope.adjustValueDLI2(indexAE, indexPenyebab, indexExistingControl);
        $scope.renderListEfektivitasDLI2(indexAE, indexPenyebab, indexExistingControl, false);
    }

    $scope.adjustValueDLI2 = function (indexAE, indexPenyebab, indexExistingControl) {
        if (!Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas)) {
            var approach = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach);
            var deployment = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment);
            var learning = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning);
            var integration = parseInt($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration);

            if (deployment > approach)
                $scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment = approach;

            if (learning > approach)
                $scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning = approach;

            if (integration > approach)
                $scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration = approach;
        };
    }

    $scope.renderListEfektivitasDLI2 = function (indexAE, indexPenyebab, indexExistingControl, isAppended) {
        var efektivitasDLI = [];
        var approach = 0;

        try {
            approach = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranOperasional[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach, 0);
        } catch (err) {}

        var labelEfektivitas = ["0 : Tidak Ada", "1 : Sangat Lemah", "2 : Lemah", "3 : Sedang", "4 : Kuat", "5 : Sangat Kuat"];

        for (var i = 0; i <= approach; i++)
            efektivitasDLI.push({
                id: i,
                name: labelEfektivitas[i]
            });
        if (isAppended)
            $scope.analisaEvaluasi.master.efektivitasDLI2[indexPenyebab].push(efektivitasDLI);
        else
            $scope.analisaEvaluasi.master.efektivitasDLI2[indexPenyebab][indexExistingControl] = efektivitasDLI;
    }

    //END OF SASARAN OPERASIONAL//

    //START OF SASARAN FINANSIAL//

    $scope.adliChange3 = function (indexAE, indexPenyebab, indexExistingControl) {
        var approach = 0;
        var deployment = 0;
        var learning = 0;
        var integration = 0;
        var score = 0;

        if (!Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas)) {
            approach = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach);
            deployment = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment);
            learning = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning);
            integration = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration);
            score = (approach + deployment + learning + integration) / 4;

            $scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.nilai = (score >= 0 && score <= 5) ? score : 0;
            $scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.label = Helper.getLabelEfektivitas(score);
        };

        $scope.adjustValueDLI3(indexAE, indexPenyebab, indexExistingControl);
        $scope.renderListEfektivitasDLI3(indexAE, indexPenyebab, indexExistingControl, false);
    }

    $scope.adjustValueDLI3 = function (indexAE, indexPenyebab, indexExistingControl) {
        if (!Helper.isNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas)) {
            var approach = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach);
            var deployment = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment);
            var learning = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning);
            var integration = parseInt($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration);

            if (deployment > approach)
                $scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.deployment = approach;

            if (learning > approach)
                $scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.learning = approach;

            if (integration > approach)
                $scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.integration = approach;
        };
    }

    $scope.renderListEfektivitasDLI3 = function (indexAE, indexPenyebab, indexExistingControl, isAppended) {
        var efektivitasDLI = [];
        var approach = 0;

        try {
            approach = Helper.ifNullOrEmpty($scope.analisaEvaluasi.data.sasaranFinansial[indexAE].risiko[indexPenyebab].penyebab[indexExistingControl].efektifitas.approach, 0);
        } catch (err) {}

        var labelEfektivitas = ["0 : Tidak Ada", "1 : Sangat Lemah", "2 : Lemah", "3 : Sedang", "4 : Kuat", "5 : Sangat Kuat"];

        for (var i = 0; i <= approach; i++)
            efektivitasDLI.push({
                id: i,
                name: labelEfektivitas[i]
            });
        if (isAppended)
            $scope.analisaEvaluasi.master.efektivitasDLI3[indexPenyebab].push(efektivitasDLI);
        else
            $scope.analisaEvaluasi.master.efektivitasDLI3[indexPenyebab][indexExistingControl] = efektivitasDLI;
    }

    //END OF SASARAN FINANSIAL//


    // Sasaran Operasional
    $scope.eventClickAnalisaEvaluasiOperasionalSave = function () {
        $scope.analisaEvaluasi.data.sasaranOperasional.isEditMode = false;
    }

    $scope.eventClickAnalisaEvaluasiOperasionalDiscard = function () {
        $scope.analisaEvaluasi.data.sasaranOperasional.isEditMode = false;
    }

    $scope.eventClickAnalisaEvaluasiOperasionalEdit = function () {
        $scope.analisaEvaluasi.data.sasaranOperasional.isEditMode = true;
    }

    $scope.eventClickAnalisaEvaluasiAdd = function (pIndex, jenis) {
        $scope.analisaEvaluasi.data.sasaranOperasional[pIndex].penyebab.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickAnalisaEvaluasiRemove = function (pIndex, index, jenis) {
        $scope.analisaEvaluasi.data.sasaranOperasional[pIndex].penyebab.splice(index, 1);
    }

    // Sasaran Finansial
    $scope.eventClickAnalisaEvaluasiFinansialSave = function () {
        $scope.analisaEvaluasi.data.sasaranFinansial.isEditMode = false;
    }

    $scope.eventClickAnalisaEvaluasiFinansialDiscard = function () {
        $scope.analisaEvaluasi.data.sasaranFinansial.isEditMode = false;
    }

    $scope.eventClickAnalisaEvaluasiFinansialEdit = function () {
        $scope.analisaEvaluasi.data.sasaranFinansial.isEditMode = true;
    }

    $scope.eventClickAnalisaEvaluasiAdd = function (pIndex, jenis) {
        $scope.analisaEvaluasi.data.sasaranFinansial[pIndex].penyebab.push({
            id: "",
            name: ""
        });
    }

    $scope.eventClickAnalisaEvaluasiRemove = function (pIndex, index, jenis) {
        $scope.analisaEvaluasi.data.sasaranFinansial[pIndex].penyebab.splice(index, 1);
    }

    // =========== END OF KAJIAN RISIKO - ANALISA & EVALUASI ============//


    // =========== KAJIAN RISIKO - RENCANA MITIGASI ================ //
    $scope.renderRencanaMitigasi = function () {
        NProgress.start();
        $scope.tampilSasaranStrategis = [];
        apiUrl = "/api/DmrKRRencanaMitigasi/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.rencanaMitigasi.data = response;

            var sasaran = $scope.rencanaMitigasi.data.sasaran;
            if (!Helper.isNullOrEmpty(sasaran)) {

                $scope.rencanaMitigasi.master.peringkatDampak = [];
                $scope.rencanaMitigasi.master.tipePeringkatKemungkinan = [];
                $scope.rencanaMitigasi.master.peringkatKemungkinan = [];
                $scope.rencanaMitigasi.master.jenisValuta = [];

                // SASARAN
                angular.forEach($scope.rencanaMitigasi.data.sasaran, function (induk, i) {

                    if ($scope.rencanaMitigasi.data.sasaran[i].risiko.length > 0) {
                        $scope.tampilSasaranStrategis[i] = true;
                    } else {
                        $scope.tampilSasaranStrategis[i] = false;
                    }

                    $scope.rencanaMitigasi.master.peringkatDampak[i] = [];
                    $scope.rencanaMitigasi.master.tipePeringkatKemungkinan[i] = [];
                    $scope.rencanaMitigasi.master.peringkatKemungkinan[i] = [];
                    $scope.rencanaMitigasi.master.jenisValuta[i] = [];

                    // RISIKO
                    angular.forEach(induk.risiko, function (subitem, j) {

                        $scope.rencanaMitigasi.master.peringkatDampak[i][j] = [];
                        $scope.rencanaMitigasi.master.tipePeringkatKemungkinan[i][j] = [];
                        $scope.rencanaMitigasi.master.peringkatKemungkinan[i][j] = [];
                        $scope.rencanaMitigasi.master.jenisValuta[i][j] = [];

                        // PENYEBAB
                        angular.forEach(subitem.penyebab, function (item, k) {

                            $scope.rencanaMitigasi.master.peringkatDampak[i][j][k] = [];
                            $scope.rencanaMitigasi.master.tipePeringkatKemungkinan[i][j][k] = [];
                            $scope.rencanaMitigasi.master.peringkatKemungkinan[i][j][k] = [];
                            $scope.rencanaMitigasi.master.jenisValuta[i][j][k] = [];

                            if (!(item.tingkatRisiko.keberterimaanRisiko == 'Diterima')) {
                                var mitigasi = item.rencanaMitigasi;
                                var newRencanaMitigasi = {
                                    id: "00000000-0000-0000-0000-000000000000",
                                    name: "",
                                    picKoordinator: {
                                        id: "00000000-0000-0000-0000-000000000000",
                                        employeeNumber: "",
                                        name: "",
                                        jabatan: "",
                                        email: "",
                                        payrollName: "",
                                        displayCol: ""
                                    },
                                    langkahKerja: [{
                                        id: "00000000-0000-0000-0000-000000000000",
                                        name: "",
                                        picLangkah: {
                                            id: "00000000-0000-0000-0000-000000000000",
                                            name: "",
                                            jabatan: "",
                                            email: "",
                                            payrollName: "",
                                            displayCol: ""
                                        },
                                        valutaBiaya: {
                                            id: "00000000-0000-0000-0000-000000000000",
                                            name: "",
                                            keterangan: ""
                                        },
                                        biaya: 0,
                                        targetMulai: "",
                                        targetSelesai: ""
                                    }],
                                    peringkatDampakRR: {
                                        id: "00000000-0000-0000-0000-000000000000",
                                        name: "",
                                        keterangan: "",
                                        nilai: ""
                                    },
                                    tipePeringkatKemungkinan: {
                                        id: "00000000-0000-0000-0000-000000000000",
                                        name: ""
                                    },
                                    peringkatKemungkinanRR: {
                                        id: "00000000-0000-0000-0000-000000000000",
                                        name: "",
                                        keterangan: "",
                                        nilai: ""
                                    },
                                    tingkatRisikoRR: {
                                        id: "00000000-0000-0000-0000-000000000000",
                                        name: "",
                                        keberterimaanRisiko: "",
                                        warna: "",
                                        relatifRisiko: ""
                                    }
                                }

                                if (mitigasi.length == 0) {
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0] = newRencanaMitigasi;

                                    // ISI PERINGKAT BERDASARKAN INDUK RISIKO //
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatDampakRR.id = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatDampak.id;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatDampakRR.name = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatDampak.name;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatDampakRR.keterangan = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatDampak.keterangan;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatDampakRR.nilai = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatDampak.nilai;

                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].tipePeringkatKemungkinan.id = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].tipePeringkatKemungkinan.id;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].tipePeringkatKemungkinan.name = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].tipePeringkatKemungkinan.name;

                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatKemungkinanRR.id = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatKemungkinan.id;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatKemungkinanRR.name = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatKemungkinan.name;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatKemungkinanRR.keterangan = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatKemungkinan.keterangan;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].peringkatKemungkinanRR.nilai = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].peringkatKemungkinan.nilai;

                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].tingkatRisikoRR.id = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].tingkatRisiko.id;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].tingkatRisikoRR.name = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].tingkatRisiko.name;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].tingkatRisikoRR.keberterimaanRisiko = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].tingkatRisiko.keberterimaanRisiko;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].tingkatRisikoRR.warna = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].tingkatRisiko.warna;
                                    $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].rencanaMitigasi[0].tingkatRisikoRR.relatifRisiko = $scope.rencanaMitigasi.data.sasaran[i].risiko[j].penyebab[k].tingkatRisiko.relatifRisiko;
                                }

                                // RENCANA MITIGASI
                                angular.forEach(item.rencanaMitigasi, function (rMitigasi, l) {

                                    $scope.rencanaMitigasi.master.jenisValuta[i][j][k][l] = [];

                                    //RENDER MASTER
                                    $scope.renderPeringkatDampakMitigasi(i, j, k, l, true);
                                    $scope.renderTipePeringkatKemungkinanMitigasi(i, j, k, l, true);
                                    $scope.renderPeringkatKemungkinanMitigasi(i, j, k, l);

                                    // LANGKAH KERJA
                                    angular.forEach(rMitigasi.langkahKerja, function (rLangkahKerja, m) {
                                        $scope.renderJenisValutaMitigasi(i, j, k, l, m, true);
                                    });

                                });
                            }

                        });

                    });
                });
            }
            $scope.generatePanelClass();
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
        //$scope.rencanaMitigasi.data = [{
        //    sasaran: "Mencapai Operasional Excellence (2017)",
        //    riskOwner:"Usbizal",
        //    risiko: [
        //     {
        //         risiko: "Risiko : Keberlangsungan Usaha (Bussiness Continuity)",
        //         sumberRisiko:"",
        //         penyebab:
        //             [{
        //                 namaPenyebab: "Penyebab : Alat tidak sesuai spek sehingga tidak bisa digunakan",
        //                 controlledRisk: "Tinggi (3, IV)",
        //                 rencanaMitigasi: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                 picKoordinator:"",
        //                 langkahKerja: [
        //                                { id: "", langkahKerja: "", picLangkah: "", biayaValuta: { id: "", name: "" }, biaya: "", targetMulai: "", targetSelesai: "" }
        //                 ],
        //                 fungsiKontrol: { dampak: false, kemungkinan: false, keduanya: true },
        //                 peringkatDampak: { id: "", name: "" },
        //                 peringkatKemungkinan: { id: "", name: "" },
        //                 peringkatKemungkinan2: { id: "", name: "" },
        //                 relatifRisiko: "",
        //                 tingkatRisiko: "",
        //                 keberterimaanRisiko: ""
        //             }]
        //     }, {
        //         risiko: "Risiko : Subsidi Listrik",
        //         sumberRisiko:"",
        //         penyebab:
        //             [{
        //                 namaPenyebab: "Penyebab : Alat tidak sesuai spek sehingga tidak bisa digunakan",
        //                 controlledRisk: "Tinggi (3, IV)",
        //                 rencanaMitigasi: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                 picKoordinator: "",
        //                 langkahKerja: [
        //                                { id: "", langkahKerja: "", picLangkah: "", biayaValuta: { id: "", name: "" }, biaya: "", targetMulai: "", targetSelesai: "" },
        //                                { id: "", langkahKerja: "", picLangkah: "", biayaValuta: { id: "", name: "" }, biaya: "", targetMulai: "", targetSelesai: "" }
        //                 ],
        //                 fungsiKontrol: { dampak: false, kemungkinan: false, keduanya: true },
        //                 peringkatDampak: { id: "", name: "" },
        //                 peringkatKemungkinan: { id: "", name: "" },
        //                 peringkatKemungkinan2: { id: "", name: "" },
        //                 relatifRisiko: "",
        //                 tingkatRisiko: "",
        //                 keberterimaanRisiko:""
        //             }]
        //     }],
        //},
        //{
        //    sasaran: "Mencapai Operasional Excellence (2018)",
        //    riskOwner: "Usbizal",
        //    risiko: [
        //     {
        //         risiko: "Risiko : Keberlangsungan Usaha (Bussiness Continuity)",
        //         sumberRisiko: "",
        //         penyebab:
        //             [{
        //                 namaPenyebab: "Penyebab : Alat tidak sesuai spek sehingga tidak bisa digunakan",
        //                 controlledRisk: "Tinggi (3, IV)",
        //                 rencanaMitigasi: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                 picKoordinator: "",
        //                 langkahKerja: [
        //                                { id: "", langkahKerja: "", picLangkah: "", biayaValuta: { id: "", name: "" }, biaya: "", targetMulai: "", targetSelesai: "" }
        //                 ],
        //                 fungsiKontrol: { dampak: false, kemungkinan: false, keduanya: true },
        //                 peringkatDampak: { id: "", name: "" },
        //                 peringkatKemungkinan: { id: "", name: "" },
        //                 peringkatKemungkinan2: { id: "", name: "" },
        //                 relatifRisiko: "",
        //                 tingkatRisiko: "",
        //                 keberterimaanRisiko: ""
        //             }]
        //     }, {
        //         risiko: "Risiko : Subsidi Listrik",
        //         sumberRisiko: "",
        //         penyebab:
        //             [{
        //                 namaPenyebab: "Penyebab : Alat tidak sesuai spek sehingga tidak bisa digunakan",
        //                 controlledRisk: "Tinggi (3, IV)",
        //                 rencanaMitigasi: "Kontrol Eksisting Strategis Perubahan Organisasi",
        //                 picKoordinator: "",
        //                 langkahKerja: [
        //                                { id: "", langkahKerja: "", picLangkah: "", biayaValuta: { id: "", name: "" }, biaya: "", targetMulai: "", targetSelesai: "" },
        //                                { id: "", langkahKerja: "", picLangkah: "", biayaValuta: { id: "", name: "" }, biaya: "", targetMulai: "", targetSelesai: "" }
        //                 ],
        //                 fungsiKontrol: { dampak: false, kemungkinan: false, keduanya: true },
        //                 peringkatDampak: { id: "", name: "" },
        //                 peringkatKemungkinan: { id: "", name: "" },
        //                 peringkatKemungkinan2: { id: "", name: "" },
        //                 relatifRisiko: "",
        //                 tingkatRisiko: "",
        //                 keberterimaanRisiko: ""
        //             }]
        //     }],
        //}];
        NProgress.done();
    }

    // EVENT CLICK
    $scope.eventClickRencanaMitigasiEdit = function () {
        $scope.rencanaMitigasi.isEditMode = true;
    }

    $scope.eventClickRencanaMitigasiSave = function () {
        NProgress.start();
        apiUrl = "/api/DmrKRRencanaMitigasi/" + idDmr;
        $scope.rencanaMitigasi.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.rencanaMitigasi.data).success(function (response) {
            $scope.renderRencanaMitigasi();
            $scope.rencanaMitigasi.isEditMode = false;
            $scope.renderApprovalStatus();
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.eventClickRencanaMitigasiDiscard = function () {
        $scope.rencanaMitigasi.isEditMode = false;
    }

    $scope.eventClickRencanaMitigasiAdd = function (induk, item, subItem) {
        var newRencanaMitigasi = {
            id: "00000000-0000-0000-0000-000000000000",
            name: "",
            picKoordinator: {
                id: "00000000-0000-0000-0000-000000000000",
                employeeNumber: "",
                name: "",
                jabatan: "",
                email: "",
                payrollName: "",
                displayCol: ""
            },
            langkahKerja: [],
            peringkatDampakRR: {
                id: "00000000-0000-0000-0000-000000000000",
                name: "",
                keterangan: "",
                nilai: ""
            },
            tipePeringkatKemungkinan: {
                id: "00000000-0000-0000-0000-000000000000",
                name: ""
            },
            peringkatKemungkinanRR: {
                id: "00000000-0000-0000-0000-000000000000",
                name: "",
                keterangan: "",
                nilai: ""
            },
            tingkatRisikoRR: {
                id: "00000000-0000-0000-0000-000000000000",
                name: "",
                keberterimaanRisiko: "",
                warna: "",
                relatifRisiko: ""
            }
        }

        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi.push(newRencanaMitigasi);

        var l = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi.length - 1;

        $scope.rencanaMitigasi.master.peringkatDampak[induk][item][subItem][l] = [];
        $scope.rencanaMitigasi.master.tipePeringkatKemungkinan[induk][item][subItem][l] = [];
        $scope.rencanaMitigasi.master.peringkatKemungkinan[induk][item][subItem][l] = [];
        $scope.rencanaMitigasi.master.jenisValuta[induk][item][subItem][l] = [];

        $scope.renderPeringkatDampakMitigasi(induk, item, subItem, l, false);
        $scope.renderTipePeringkatKemungkinanMitigasi(induk, item, subItem, l, false);

        $scope.eventClickRencanaMitigasiLangkahKerjaAdd(induk, item, subItem, l, false);


        // ISI PERINGKAT BERDASARKAN INDUK RISIKO //
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatDampakRR.id = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatDampak.id;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatDampakRR.name = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatDampak.name;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatDampakRR.keterangan = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatDampak.keterangan;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatDampakRR.nilai = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatDampak.nilai;

        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].tipePeringkatKemungkinan.id = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].tipePeringkatKemungkinan.id;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].tipePeringkatKemungkinan.name = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].tipePeringkatKemungkinan.name;

        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatKemungkinanRR.id = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatKemungkinan.id;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatKemungkinanRR.name = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatKemungkinan.name;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatKemungkinanRR.keterangan = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatKemungkinan.keterangan;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].peringkatKemungkinanRR.nilai = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].peringkatKemungkinan.nilai;

        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].tingkatRisikoRR.id = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].tingkatRisiko.id;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].tingkatRisikoRR.name = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].tingkatRisiko.name;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].tingkatRisikoRR.keberterimaanRisiko = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].tingkatRisiko.keberterimaanRisiko;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].tingkatRisikoRR.warna = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].tingkatRisiko.warna;
        $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi[l].tingkatRisikoRR.relatifRisiko = $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].tingkatRisiko.relatifRisiko;
    }

    $scope.eventClickRencanaMitigasiDelete = function (induk, item, subItem, index) {
        var hapus = confirm('Hapus Rencana Mitigasi ?');
        if (hapus) {
            $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subItem].rencanaMitigasi.splice(index, 1);
        }
    }

    $scope.eventClickRencanaMitigasiLangkahKerjaAdd = function (data_, risiko_, penyebab_, mitigasi_, isAppend) {
        var newLangkahKerja = {
            id: "",
            name: "",
            picLangkah: {
                id: "00000000-0000-0000-0000-000000000000",
                employeeNumber: "",
                name: "",
                jabatan: "",
                email: "",
                payrollName: "",
                displayCol: ""
            },
            valutaBiaya: {
                id: "",
                name: "",
                keterangan: ""
            },
            biaya: 0,
            targetMulai: "",
            targetSelesai: ""
        };

        if ($scope.rencanaMitigasi.data.sasaran[data_].risiko[risiko_].penyebab[penyebab_].rencanaMitigasi[mitigasi_].langkahKerja == "undefined")
            $scope.rencanaMitigasi.data.sasaran[data_].risiko[risiko_].penyebab[penyebab_].rencanaMitigasi[mitigasi_].langkahKerja = [];

        $scope.rencanaMitigasi.data.sasaran[data_].risiko[risiko_].penyebab[penyebab_].rencanaMitigasi[mitigasi_].langkahKerja.push(newLangkahKerja);

        var m = $scope.rencanaMitigasi.data.sasaran[data_].risiko[risiko_].penyebab[penyebab_].rencanaMitigasi[mitigasi_].langkahKerja.length - 1;

        $scope.renderJenisValutaMitigasi(data_, risiko_, penyebab_, mitigasi_, m, isAppend);
    }

    $scope.eventDeleteLangkahKerja = function (induk, item, subitem, mitigasi, anak) {
        var hapus = confirm('Hapus Langkah Kerja ?');
        if (hapus) {
            $scope.rencanaMitigasi.data.sasaran[induk].risiko[item].penyebab[subitem].rencanaMitigasi[mitigasi].langkahKerja.splice(anak, 1);
        }
    }


    // RENDER MASTER
    $scope.renderJenisValutaMitigasi = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi, indexLangkahKerja, isAppended) {
        var idAreaDampak = Constant.emptyGuid;
        var apiUrl = "/api/DMRListJenisValuta";

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.rencanaMitigasi.master.jenisValuta[indexSasaran][indexAE][indexPenyebab][indexMitigasi].push(response);
                else
                    $scope.rencanaMitigasi.master.jenisValuta[indexSasaran][indexAE][indexPenyebab][indexMitigasi][indexLangkahKerja] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "RENCANA MITIGASI List Jenis Valuta",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderPeringkatDampakMitigasi = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi, isAppended) {
        //Master Peringkat Kemungkinan
        var idAreaDampak = Constant.emptyGuid;
        var nilai = 0;
        try {
            idAreaDampak = Helper.ifNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].areaDampak.id, Constant.emptyGuid);
        } catch (err) {}

        var apiUrl = "/api/DmrKRListPeringkatDampak/" + idDmr + "?idArea=" + idAreaDampak;

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.rencanaMitigasi.master.peringkatDampak[indexSasaran][indexAE][indexPenyebab].push(response);
                else
                    $scope.rencanaMitigasi.master.peringkatDampak[indexSasaran][indexAE][indexPenyebab][indexMitigasi] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "RENCANA MITIGASI List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderTipePeringkatKemungkinanMitigasi = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi, isAppended) {
        //Master Tipe Peringkat Kemungkinan

        var apiUrl = "/api/DmrKRListTipePeringkatKemungkinan";

        HttpRequest.get(apiUrl).success(function (response) {

                if (isAppended)
                    $scope.rencanaMitigasi.master.tipePeringkatKemungkinan[indexSasaran][indexAE][indexPenyebab].push(response);
                else
                    $scope.rencanaMitigasi.master.tipePeringkatKemungkinan[indexSasaran][indexAE][indexPenyebab][indexMitigasi] = response;

            })
            .error(function (response, code) {
                var data = {
                    title: "RENCANA MITIGASI List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.renderPeringkatKemungkinanMitigasi = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi) {

        if ($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi != null || $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi != 'undefined') {
            var idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].tipePeringkatKemungkinan.id, Constant.emptyGuid);
            var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
            var nilaiDampak = Helper.ifNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.nilai, 0);

            var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;
            HttpRequest.get(apiUrl).success(function (response) {
                    $scope.rencanaMitigasi.master.peringkatKemungkinan[indexSasaran][indexAE][indexPenyebab][indexMitigasi] = response;

                })
                .error(function (response, code) {
                    var data = {
                        title: "RENCANA MITIGASI List Peringkat Dampak IR",
                        exception: response,
                        exceptionCode: code,
                        operation: "GET",
                        apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                });
        }
    }

    $scope.renderPic = function (keyword) {
        var apiUrl = "/api/KRListPIC/" + keyword + "?email=" + currentUser.email;
        return HttpRequest.get(apiUrl).then(function (response) {
            return response.data;
        });
    }

    $scope.generatePanelClass = function () {
        $scope.panelClass1 = [];
        $scope.panelClass2 = [];

        angular.forEach($scope.rencanaMitigasi.data.sasaran, function (induk, i) {
            $scope.panelClass1[i] = "panel-default";
            $scope.panelClass2[i] = [];

            angular.forEach(induk.risiko, function (subItem, j) {

                angular.forEach(subItem.penyebab, function (item, k) {
                    $scope.panelClass2[i][j] = "panel-default";

                    $scope.panelClass1[i] = item.tingkatRisiko.warna;

                });

            });
        });
    }


    // CHANGE RENCANA MITIGASI //
    $scope.peringkatDampakSasaranChange = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi) {
        var idPeringkatDampakIR = $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.id;
        var masterPeringkatDampakIR = $scope.rencanaMitigasi.master.peringkatDampak[indexSasaran][indexAE][indexPenyebab][indexMitigasi];
        var selectedPeringkatDampakIR = Helper.findItem(masterPeringkatDampakIR, "id", idPeringkatDampakIR);

        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;
        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.keterangan = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.keterangan;
        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.nilai = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.nilai;

        $scope.hitungTingkatRisikoMitigasi(indexSasaran, indexAE, indexPenyebab, indexMitigasi);
    }

    $scope.tipePeringkatKemungkinanMitigasiChange = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi) {
        var idTipePeringkatKemungkinan = $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].tipePeringkatKemungkinan.id;
        var masterTipePeringkatKemungkinan = $scope.rencanaMitigasi.master.tipePeringkatKemungkinan[indexSasaran][indexAE][indexPenyebab][indexMitigasi];
        var selectedPeringkatDampakIR = Helper.findItem(masterTipePeringkatKemungkinan, "id", idTipePeringkatKemungkinan);

        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].tipePeringkatKemungkinan.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;

        var nilaiEfektifitas = Helper.ifNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].efektifitas.nilai, 0);
        var nilaiDampak = Helper.ifNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.nilai, 0);

        var apiUrl = "/api/DmrKRListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilaiEfektifitas + "&dampak=" + nilaiDampak;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.rencanaMitigasi.master.peringkatKemungkinan[indexSasaran][indexAE][indexPenyebab][indexMitigasi] = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "RENCANA MITIGASI List Peringkat Dampak IR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.peringkatKemungkinanMitigasiChange = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi) {
        var idPeringkatKemungkinan = $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatKemungkinanRR.id;
        var masterPeringkatKemungkinan = $scope.rencanaMitigasi.master.peringkatKemungkinan[indexSasaran][indexAE][indexPenyebab][indexMitigasi];
        var selectedPeringkatKemungkinan = Helper.findItem(masterPeringkatKemungkinan, "id", idPeringkatKemungkinan);


        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatKemungkinanRR.name = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.name;
        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatKemungkinanRR.keterangan = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.keterangan;
        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatKemungkinanRR.nilai = Helper.isNullOrEmpty(selectedPeringkatKemungkinan) ? "" : selectedPeringkatKemungkinan.nilai;
        $scope.hitungTingkatRisikoMitigasi(indexSasaran, indexAE, indexPenyebab, indexMitigasi);
    }

    $scope.hitungTingkatRisikoMitigasi = function (indexSasaran, indexAE, indexPenyebab, indexMitigasi) {
        var idPerDampak = Helper.isNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.id) ? Constant.emptyGuid : $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatDampakRR.id;
        var idPerKemungkinan = Helper.isNullOrEmpty($scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatKemungkinanRR.id) ? Constant.emptyGuid : $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].peringkatKemungkinanRR.id;

        var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

        HttpRequest.get(apiUrl).success(function (response) {
                $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexAE].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].tingkatRisikoRR = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "RENCANA MITIGASI Hitung Tingkat Risiko CR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
    }

    $scope.eventChangeJenisValutaMitigasi = function (indexSasaran, indexRisiko, indexPenyebab, indexMitigasi, indexLangkahKerja) {

        var masterJenisValuta = $scope.rencanaMitigasi.master.jenisValuta[indexSasaran][indexRisiko][indexPenyebab][indexMitigasi][indexLangkahKerja];
        var selectedJenisValuta = Helper.findItem(masterJenisValuta, "id", $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexRisiko].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].langkahKerja[indexLangkahKerja].valutaBiaya.id);
        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexRisiko].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].langkahKerja[indexLangkahKerja].valutaBiaya.name = selectedJenisValuta.name;
        $scope.rencanaMitigasi.data.sasaran[indexSasaran].risiko[indexRisiko].penyebab[indexPenyebab].rencanaMitigasi[indexMitigasi].langkahKerja[indexLangkahKerja].valutaBiaya.keterangan = selectedJenisValuta.keterangan;
    }
    // =========== END OF KAJIAN RISIKO - RENCANA MITIGASI ================ //


    // =========== VALIDASI TAB ===============//


    // =========== VALIDASI TAB ===============//



    // =========== PERSETUJUAN ===============//
    $scope.renderPersetujuan = function () {
        NProgress.start();

        apiUrl = "/api/DMRPersetujuan/" + idDmr;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.persetujuan.data = response;


            apiUrl = "/api/DMRStatusVerifikasi?email=" + currentUser.email;
            HttpRequest.get(apiUrl).success(function (response) {

                    $scope.persetujuan.viewVerifikasi = response;
                })
                .error(function (response, code) {
                    var data = {
                        title: "Verifikasi DMR",
                        exception: response,
                        exceptionCode: code,
                        operation: "GET",
                        apiUrl: apiUrl
                    };
                    Helper.notifErrorHttp(data);
                });

            $scope.statusForm();

            NProgress.done();

        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });

    }

    $scope.eventClickPersetujuanEdit = function () {
        $scope.persetujuan.isEditMode = true;
    }

    $scope.eventClickPersetujuanSave = function () {
        NProgress.start();
        var apiUrl = "/api/DMRPersetujuan";
        $scope.persetujuan.data.userEmail = currentUser.email;
        HttpRequest.post(apiUrl, $scope.persetujuan.data).success(function (response) {
            $scope.renderPersetujuan();
            $scope.persetujuan.isEditMode = false;
            $scope.renderApprovalStatus();
            NProgress.done();
        }).error(function (response, code) {
            $scope.error.message = response.ExceptionMessage + " - " + code;
            $('#modalError2').modal('show');
            NProgress.done();
        });
    }

    $scope.eventClickPersetujuanDiscard = function () {
        $scope.renderPersetujuan();
        $scope.persetujuan.isEditMode = false;
    }


    // ====================================== RENDER FORM DMR ====================================\\
    $scope.checkKajianOptional();
    $scope.renderDmr();
    $scope.getCurrentUser();
    $scope.renderApprovalStatus();
    $scope.statusForm();

});