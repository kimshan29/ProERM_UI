var modules = [
    'ngRoute', 'ngSanitize', 'ngCookies',
    'validation', 'validation.rule',
    'ui.bootstrap', 'uiSwitch', 'ngCkeditor',
    'datatables', 'datatables.columnfilter',
    'naif.base64', 'highcharts-ng'
];

var mainApp = angular.module('mainApp', modules);

mainApp.run(function ($rootScope, $location, $routeParams, $cookies, HttpRequest, Helper) {
    $rootScope.$on('$routeChangeStart', function (e, current, next) {
        var currentUser = null;

        try {
            currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {}

        if (currentUser == null)
            document.location.href = 'login.aspx';

    });

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {

        //console.log('Current route name: ' + $location.path() + '. currentUser : ' + $cookies.get('currentUser'));
        var currentUser = null;

        try {
            currentUser = JSON.parse($cookies.get('currentUser'));
        } catch (err) {}

        $cookies.put('currentRoute', $location.path());

        //Script ini sangat tidak disarankan untuk ditiru, cara bodoh.
        var pIdKr = $routeParams.idKr;
        var pIdDmr = $routeParams.idDmr;
        var pEmail = $routeParams.email;
        var pTahun = $routeParams.tahun;
        var pIdOrm = $routeParams.idOrm;
        var pRefUrl = $routeParams.refUrl;
        var pIdRiskEvent = $routeParams.idRiskEvent;
        var path = $location.path()
            .replace("/" + pIdKr, "")
            .replace("/" + pIdDmr, "")
            .replace("/" + pEmail, "")
            .replace("/" + pTahun, "")
            .replace("/" + pIdOrm, "")
            .replace("/" + pRefUrl, "")
            .replace("/" + pIdRiskEvent, "");

        if (path != "/401" && path != "/error" && path != "/new-kr" && path != "/new-dmr" && path != "/map-risk") {
            var url = "/main.aspx#" + path;
            var encodedUrl = encodeURIComponent(url);
            var fullEncodedUrl = encodeURIComponent($location.absUrl());


            var apiUrl = "/api/hakAksesByURL?alamat=" + encodedUrl + "&email=" + currentUser.email;
            HttpRequest.get(apiUrl).success(function (response) {
                    if (!response.isAkses)
                        $location.path("/401/" + fullEncodedUrl);
                })
                .error(function (response, code) {
                    $location.path("/error");

                    var data = {
                        title: "Akses Halaman",
                        exception: response,
                        exceptionCode: code,
                        operation: "GET",
                        apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                });
        }
        //currentRoute = $location.path();
        // Get all URL parameter
        //console.log($routeParams);

    });
});

// Routes Config
mainApp.config(function ($routeProvider) {
    $routeProvider
        // Home
        .when('/', {
            templateUrl: 'templates/dashboard.html?' + $.now(),
            controller: 'dashboardCtrl',
            cache: false,
        })

        // Home
        .when('/home', {
            templateUrl: 'templates/dashboard.html?' + $.now(),
            controller: 'dashboardCtrl',
            cache: false,
        })

        // Notifikasi
        .when('/notifikasi', {
            cache: false,
            templateUrl: 'templates/notifikasi.html?' + $.now(),
            controller: 'notifikasiCtrl'
        })

        // Daftar Dokumen
        .when('/daftar-dokumen', {
            cache: false,
            templateUrl: 'templates/daftar-dokumen.html?' + $.now(),
            controller: 'daftarDokumenCtrl'
        })


        // Daftar Dokumen Admin Unit
        .when('/daftar-dokumen-admin-unit', {
            cache: false,
            templateUrl: 'templates/daftardokumenAdminUnit.html?' + $.now(),
            controller: 'daftarDokumenAdminUnitCtrl'
        })

        // Daftar Dokumen SMR
        .when('/daftar-dokumen-SMR', {
            cache: false,
            templateUrl: 'templates/daftar-dokumenSMR.html?' + $.now(),
            controller: 'daftarDokumenSMRCtrl'
        })


        // Daftar Dokumen Approval
        .when('/daftar-dokumen-approval', {
            cache: false,
            templateUrl: 'templates/daftar-dokumen-approval.html?' + $.now(),
            controller: 'daftarDokumenApprovalCtrl'
        })

        // Daftar Dokumen Approved
        .when('/daftar-dokumen-approved', {
            cache: false,
            templateUrl: 'templates/daftar-dokumen-approved.html?' + $.now(),
            controller: 'daftarDokumenApprovedCtrl'
        })

        // New KR
        .when('/new-kr/:email/:tahun', {
            cache: false,
            templateUrl: 'templates/blank.html?' + $.now(),
            controller: 'newKrCtrl'
        })

        // KR
        .when('/kr/:idKr', {
            cache: false,
            templateUrl: 'templates/kr.html?' + $.now(),
            controller: 'krCtrl'
        })

        // New Risk Event
        .when('/new-riskEvent/:email/:tahun', {
            cache: false,
            templateUrl: 'templates/blank.html?' + $.now(),
            controller: 'newRiskEventCtrl'
        })

        // Risk Event
        .when('/riskEvent/:idRiskEvent', {
            cache: false,
            templateUrl: 'templates/riskEvent.html?' + $.now(),
            controller: 'riskEventCtrl'
        })

        // New ORM
        .when('/orm', {
            cache: false,
            templateUrl: 'templates/orm.html?' + $.now(),
            controller: 'ormCtrl'
        })

        // ORM
        .when('/orm/:idOrm', {
            cache: false,
            templateUrl: 'templates/orm.html?' + $.now(),
            controller: 'ormCtrl'
        })

        //New DMR
        .when('/new-dmr/:email/:tahun', {
            cache: false,
            templateUrl: 'templates/blank.html?' + $.now(),
            controller: 'newDmrCtrl'
        })

        // DMR
        .when('/dmr/:idDmr', {
            cache: false,
            templateUrl: 'templates/dmr.html?' + $.now(),
            controller: 'dmrCtrl'
        })

        // Monitoring DMR
        .when('/monitoring-dmr', {
            cache: false,
            templateUrl: 'templates/monitoring-dmr.html?' + $.now(),
            controller: 'monitoringDMRCtrl'
        })

        // DISTRIBUSI DMR
        .when('/distribusi-dmr', {
            cache: false,
            templateUrl: 'templates/distribusiDMR.html?' + $.now(),
            controller: 'distDmrCtrl'
        })

        // Master Area Dampak
        .when('/m-areadampak', {
            cache: false,
            templateUrl: 'templates/m-areadampak.html?' + $.now(),
            controller: 'mareadampakCtrl'
        })


        // Master  Dampak
        .when('/mDampak', {
            cache: false,
            templateUrl: 'templates/mDampak.html?' + $.now(),
            controller: 'mDampakCtrl'
        })


        // Master Employee
        .when('/m-employee', {
            cache: false,
            templateUrl: 'templates/m-employee.html?' + $.now(),
            controller: 'mEmployeeCtrl'
        })

        // Master Entitas
        .when('/m-entitas', {
            cache: false,
            templateUrl: 'templates/m-entitas.html?' + $.now(),
            controller: 'mEntitasCtrl'
        })

        // Master Departemen
        .when('/m-departemen', {
            cache: false,
            templateUrl: 'templates/m-departemen.html?' + $.now(),
            controller: 'mDepartemenCtrl'
        })

        // Master Penyebab
        .when('/m-penyebab', {
            cache: false,
            templateUrl: 'templates/m-penyebab.html?' + $.now(),
            controller: 'mPenyebabCtrl'
        })

        // Master Risiko
        .when('/m-risiko', {
            cache: false,
            templateUrl: 'templates/m-risiko.html?' + $.now(),
            controller: 'mRisikoCtrl'
        })

        // Master Kategori Risiko
        .when('/m-kategoririsiko', {
            cache: false,
            templateUrl: 'templates/m-kategoririsiko.html?' + $.now(),
            controller: 'mKategoriRisikoCtrl'
        })

        // Master Sub Kategori Risiko
        .when('/m-SubKategoriRisiko', {
            cache: false,
            templateUrl: 'templates/m-subKategoriRisiko.html?' + $.now(),
            controller: 'mSubKategoriRisikoCtrl'
        })

        // Master Sumber Risiko
        .when('/m-sumberrisiko', {
            cache: false,
            templateUrl: 'templates/m-sumberrisiko.html?' + $.now(),
            controller: 'msumberRisikoCtrl'
        })

        // Master Taksonomi Risiko
        .when('/m-taksonomiRisiko', {
            cache: false,
            templateUrl: 'templates/m-taksonomiRisiko.html?' + $.now(),
            controller: 'mTaksonomiRisikoCtrl'
        })

        // Master Kejaidan Risiko
        .when('/m-kejadianRisiko', {
            cache: false,
            templateUrl: 'templates/m-kejadianRisiko.html?' + $.now(),
            controller: 'mKejadianRisikoCtrl'
        })

        // Master Kemungkinan
        .when('/m-kemungkinan', {
            cache: false,
            templateUrl: 'templates/m-kemungkinan.html?' + $.now(),
            controller: 'mKemungkinanCtrl'
        })

        // Master SO
        .when('/m-SO', {
            cache: false,
            templateUrl: 'templates/m-SO.html?' + $.now(),
            controller: 'mSOCtrl'
        })

        // Master KPI
        .when('/m-KPI', {
            cache: false,
            templateUrl: 'templates/m-KPI.html?' + $.now(),
            controller: 'mKPICtrl'
        })

        // Master Warna
        .when('/m-warna', {
            cache: false,
            templateUrl: 'templates/m-warna.html?' + $.now(),
            controller: 'mWarnaCtrl'
        })

        // Master Tingkat Risiko
        .when('/m-tingkat-risiko', {
            cache: false,
            templateUrl: 'templates/m-tingkat-risiko.html?' + $.now(),
            controller: 'mTingkatRisikoCtrl'
        })

        // Master Menu
        .when('/m-menu', {
            cache: false,
            templateUrl: 'templates/m-menu.html?' + $.now(),
            controller: 'mMenuCtrl'
        })

        // Master Peran
        .when('/m-peran', {
            cache: false,
            templateUrl: 'templates/m-peran.html?' + $.now(),
            controller: 'mPeranCtrl'
        })

        // Master User
        .when('/m-user', {
            cache: false,
            templateUrl: 'templates/m-user.html?' + $.now(),
            controller: 'mUserCtrl'
        })

        // Peta Risiko
        .when('/map-risk', {
            cache: false,
            templateUrl: 'templates/map-risk-all.html?' + $.now(),
            controller: 'mapRiskAllCtrl'
        })

        // Peta Risiko
        .when('/map-risk/:modul', {
            cache: false,
            templateUrl: 'templates/map-risk.html?' + $.now(),
            controller: 'mapRiskCtrl'
        })

        // Daftar Disposisi Dokumen
        .when('/daftar-disposisi-dokumen', {
            cache: false,
            templateUrl: 'templates/daftar-disposisi-dokumen.html?' + $.now(),
            controller: 'daftarDisposisiDokumenCtrl'
        })

        // Daftar Dokumen KSRM
        .when('/daftar-dokumen-ksrm', {
            cache: false,
            templateUrl: 'templates/daftar-dokumen-ksrm.html?' + $.now(),
            controller: 'daftarDokumenKSRMCtrl'
        })

        // Error 401 - Unauthorized
        .when('/401/:refUrl', {
            cache: false,
            templateUrl: 'templates/error-401.html?' + $.now(),
            controller: 'error401Ctrl'
        })

        // General error
        .when('/error', {
            cache: false,
            templateUrl: 'templates/error.html?' + $.now(),
            controller: 'errorCtrl'
        });
});