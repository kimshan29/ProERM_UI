mainApp.controller("daftarDokumenSMRCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, FileHelper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};
    $scope.data = [];
    $scope.dtOptions = {};

    $scope.master = {};
    $scope.filter = {};

    $scope.isUnitAble = true;
    
    //Procedures===========================================================================================================
    $scope.formLoad = function()
    {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
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
        $scope.renderMasterUnit();
        $scope.renderData();
    }

    $scope.renderData = function ()
    {
        NProgress.start();

        if ($scope.filter.tahun == null || $scope.filter.tahun == "") {
            $scope.filter.tahun = new Date().getFullYear();
        }

        if ($scope.filter.unit == null || $scope.filter.unit == "") {
            $scope.filter.unit = $scope.currentUser.idUnit; 
        }

        if ($scope.filter.divisi == null || $scope.filter.divisi == "") {
            $scope.filter.divisi = "";
        }


        var apiUrl = "/api/DocumentBySMR?email=" + $scope.currentUser.email + "&tahun=" + $scope.filter.tahun + "&unit=" + $scope.filter.unit + "&divisi=" + $scope.filter.divisi;
        
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            var data = {
                title: "Daftar Dokumen",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });

        /*
        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
            var apiUrl = "/api/MyDocuments/" + $scope.currentUser.email + "/";
            var defer = $q.defer();

            HttpRequest.get(apiUrl).success(function (response) {
                defer.resolve(response);
                
                NProgress.done();
            });
            
            return defer.promise;

        })
        .withPaginationType('full_numbers')
        .withOption('responsive', true);;

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
            DTColumnBuilder.newColumn('dokumen').withTitle('Dokumen').withOption('width', '12%'),
            DTColumnBuilder.newColumn(null).withTitle('No Dokumen')
                .renderWith(function (data, type, full, meta) {
                    var modul = data.dokumen.toLowerCase();
                    if (modul === 'kr' || modul === 'dmr' || modul === 'orm')
                        return "<a href='#" + modul + "/" + data.id + "' title='Lihat detail data'>" + data.noDokumen + "</a>";
                    else
                        return data.noDokumen;
                }),
            DTColumnBuilder.newColumn('judul').withTitle('Judul'),
            DTColumnBuilder.newColumn('status').withTitle('Status'),
            DTColumnBuilder.newColumn('pemilikRisiko').withTitle('Pemilik Risiko'),
            DTColumnBuilder.newColumn(null).withTitle('Terakhir Diubah')
                .renderWith(function (data, type, full, meta) {
                    return data.tanggal.defaultDateFormat();
                })
        ];
        */
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
            $scope.isUnitAble = false;
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
});