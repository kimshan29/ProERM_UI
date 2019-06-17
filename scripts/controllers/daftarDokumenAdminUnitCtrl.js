mainApp.controller("daftarDokumenAdminUnitCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, FileHelper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};
    $scope.data = [];
    $scope.dtOptions = {};

    $scope.master = {};
    $scope.filter = {};
    
    //Procedures===========================================================================================================
    $scope.formLoad = function()
    {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
            $scope.filter.unit = $scope.currentUser.idUnit;
        }
        catch (err) {
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('responsive', true)
            .withOption('order', [5, 'desc'])
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
        
        $scope.fillYears(-10, 11);
        $scope.renderData();
        $scope.renderMasterUnit();
    }

    $scope.renderData = function ()
    {
        NProgress.start();

        if ($scope.filter.tahun == null || $scope.filter.tahun == "") {
            $scope.filter.tahun = new Date().getFullYear();
        }

        if ($scope.filter.divisi == null || $scope.filter.divisi == "") {
            $scope.filter.divisi = "";
        }


        var apiUrl = "/api/DocumentByAdminUnit?email=" + $scope.currentUser.email + "&tahun=" + $scope.filter.tahun + "&divisi=" + $scope.filter.divisi;
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;
            //$scope.renderMasterDivisi($scope.filter.unit);
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            console.log("ERROR");
            var data = {
                title: "Daftar Dokumen",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.renderMasterUnit = function ()
    {
        try {
            var apiUrl = "/api/ListUnitMyDocument";

            HttpRequest.get(apiUrl).success(function (response) {
                $scope.master.unit = response;
            })
            .error(function (response, code) {
                var data = {
                    title: "Master Unit",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };
                Helper.notifErrorHttp(data);
            });
        } catch (e) {

        }
    }

    $scope.renderMasterDivisi = function (IDUNIT)
    {
        NProgress.start();
        try {
            var apiUrl = "/api/ListDivisiMyDocument/" + IDUNIT;

            HttpRequest.get(apiUrl).success(function (response) {
                $scope.master.divisi = response;
                NProgress.done();
            })
            .error(function (response, code) {
                var data = {
                    title: "Master Divisi",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };
                Helper.notifErrorHttp(data);
            });
        } catch (e) {

        }
    }

    //Event Handler===========================================================================================================
    $scope.downloadDmr = function (idDmr)
    {
        FileHelper.downloadDmr(idDmr);
    }

    $scope.endProgressBar = function() 
    {
        NProgress.done();
    }

    $scope.clear = function () {
        $scope.filter.tahun = "";
        $scope.filter.unit = "";
        $scope.filter.divisi = "";
        $scope.renderData();
    }

    //MASTER FILTER
    $scope.fillYears = function(offset, range) {
        var currentYear = new Date().getFullYear();
        var years = [];
        for (var i = 0; i < range + 1; i++) {
            years.push(currentYear + offset + i);
        }
        $scope.master.tahun = years;
    }



    //Application Start====================================================================================================
    $scope.formLoad();

    $scope.deleteDMRClick = function (idDmr) {
        var konfirmasi = confirm('Apakah Anda yakin akan Hapus Data ?');
        if (konfirmasi) {
            NProgress.start();
            $scope.approveDone = true;

            var apiUrl = "/api/DeleteDMR/";
            var data = {
                idDmr: idDmr,
                userEmail: $scope.currentUser.email
            };

            HttpRequest.post(apiUrl, data).success(function (response) {
                alert('Data berhasil dihapus.');
                $scope.filter.tahun = "";
                $scope.filter.unit = "";
                $scope.filter.divisi = "";
                $scope.renderData();
                $scope.approveDone = false;    
                NProgress.done();
            })
            .error(function (response, code) {
                $scope.filter.tahun = "";
                $scope.filter.unit = "";
                $scope.filter.divisi = "";
                $scope.renderData();
                NProgress.done();

                var data = {
                    title: "Hapus DMR",
                    exception: response,
                    exceptionCode: code,
                    operation: "POST",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
        }
    }

});