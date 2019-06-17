mainApp.controller("notifikasiCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};
    $scope.Helper = Helper;
    $scope.data = [];
    $scope.dtOptions = {};

    //Procedures===========================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('order', [7, 'desc'])
            .withOption('responsive', true)
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
                    },
                    {
                        type: 'text'
                    }
                ]
            });
        $scope.renderData();
    }

    $scope.renderData = function () {
        NProgress.start();

        var apiUrl = "/api/myNotification/" + $scope.currentUser.email + "/";

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;
        })
        .error(function (response, code) {
            NProgress.done();
            var data = {
                title: "Notifikasi",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });;

        /*
        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
            var apiUrl = "/api/myNotification/" + $scope.currentUser.email + "/";
            console.log(apiUrl);
            var defer = $q.defer();

            HttpRequest.get(apiUrl).success(function (response) {
                defer.resolve(response);

                NProgress.done();
            });

            return defer.promise;

        }).withPaginationType('full_numbers');

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
            DTColumnBuilder.newColumn('dokumen').withTitle('Dokumen').withOption('width', '10%'),
            DTColumnBuilder.newColumn(null).withTitle('No Dokumen')
                .renderWith(function (data, type, full, meta) {
                    var modul = data.dokumen.toLowerCase();
                    if (modul === 'kr' || modul === 'dmr' || modul === 'orm')
                        return "<a href='#" + modul + "/" + data.id + "' title='Lihat detail data'>" + data.noDokumen + "</a>";
                    else
                        return data.noDokumen;
                }).withOption('width', '15%'),
            DTColumnBuilder.newColumn('judul').withTitle('Judul').withOption('width', '20%'),
            DTColumnBuilder.newColumn('status').withTitle('Status'),
            DTColumnBuilder.newColumn('pengirim').withTitle('Pengirim'),
            DTColumnBuilder.newColumn('unit').withTitle('Unit'),
            DTColumnBuilder.newColumn('pemilikRisiko').withTitle('Pemilik Risiko'),
            DTColumnBuilder.newColumn(null).withTitle('Tanggal')
                .renderWith(function (data, type, full, meta) {
                    return data.tanggal.defaultDateFormat();
                }).withOption('width', '12%')
        ];
        */
    }

    //Event Handler===========================================================================================================
    $scope.endProgressBar = function () {
        NProgress.done();
    }

    //Application Start====================================================================================================
    $scope.formLoad();
});