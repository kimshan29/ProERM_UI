mainApp.controller("monitoringDmrSMRCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, FileHelper, DTOptionsBuilder, DTColumnBuilder) {

    console.log(alert("testing"));
    // $scope.currentUser = {};
    // $scope.data = [];
    // $scope.dtOptions = {};

    // $scope.master = {};
    // $scope.filter = {};

    // $scope.isUnitAble = true;

    // //Procedures===========================================================================================================
    // $scope.formLoad = function () {
    //     try {
    //         $scope.currentUser = JSON.parse($cookies.get('currentUser'));
    //         console.log(JSON.stringify($scope.currentUser));
    //     } catch (err) {}

    //     $scope.dtOptions = DTOptionsBuilder.newOptions()
    //         .withPaginationType('full_numbers')
    //         .withOption('responsive', true)
    //         .withOption('order', [5, 'desc'])
    //         .withDisplayLength(10)
    //         .withColumnFilter({
    //             aoColumns: [{
    //                     type: 'text'
    //                 },
    //                 {
    //                     type: 'text'
    //                 },
    //                 {
    //                     type: 'text'
    //                 },
    //                 {
    //                     type: 'text'
    //                 },
    //                 {
    //                     type: 'text'
    //                 },
    //                 {
    //                     type: 'text'
    //                 },
    //                 {
    //                     type: 'text'
    //                 }
    //             ]
    //         });

    //     $scope.fillYears(-10, 11);
    //     $scope.renderMasterUnit();
    //     $scope.renderData();
    // }

    // $scope.renderData = function () {
    //     NProgress.start();

    //     if ($scope.filter.tahun == null || $scope.filter.tahun == "") {
    //         $scope.filter.tahun = new Date().getFullYear();
    //     }

    //     if ($scope.filter.unit == null || $scope.filter.unit == "") {
    //         $scope.filter.unit = $scope.currentUser.idUnit;
    //     }

    //     var apiUrl = "/api/monitoringDmrBySMR?email=" + $scope.currentUser.email + "&tahun=" + $scope.filter.tahun + "&unit=" + $scope.filter.unit;

    //     HttpRequest.get(apiUrl).success(function (response) {
    //             $scope.data = response;
    //             NProgress.done();
    //         })
    //         .error(function (response, code) {
    //             NProgress.done();
    //             var data = {
    //                 title: "Daftar Monitoring DMR",
    //                 exception: response,
    //                 exceptionCode: code,
    //                 operation: "GET",
    //                 apiUrl: apiUrl
    //             };

    //             Helper.notifErrorHttp(data);
    //         });

    // }

    // $scope.renderMasterUnit = function () {
    //     try {
    //         var apiUrl = "/api/ListUnitMyDocument";

    //         HttpRequest.get(apiUrl).success(function (response) {
    //                 $scope.master.unit = response;
    //             })
    //             .error(function (response, code) {
    //                 var data = {
    //                     title: "Master Unit",
    //                     exception: response,
    //                     exceptionCode: code,
    //                     operation: "GET",
    //                     apiUrl: apiUrl
    //                 };
    //                 Helper.notifErrorHttp(data);
    //             });
    //     } catch (e) {

    //     }
    // }


    // //Event Handler===========================================================================================================

    // $scope.endProgressBar = function () {
    //     NProgress.done();
    // }

    // $scope.clear = function () {
    //     $scope.filter.tahun = "";
    //     $scope.filter.unit = "";
    //     $scope.renderData();
    // }

    // //MASTER FILTER
    // $scope.fillYears = function (offset, range) {
    //     var currentYear = new Date().getFullYear();
    //     var years = [];
    //     for (var i = 0; i < range + 1; i++) {
    //         years.push(currentYear + offset + i);
    //     }
    //     $scope.master.tahun = years;
    // }

    // //Application Start====================================================================================================
    // $scope.formLoad();
});