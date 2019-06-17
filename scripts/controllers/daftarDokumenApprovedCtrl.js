mainApp.controller("daftarDokumenApprovedCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, FileHelper, DTOptionsBuilder, DTColumnBuilder) {

    $scope.currentUser = {};
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
        $scope.renderData();
    }

    $scope.renderData = function () {
        NProgress.start();

        var apiUrl = "/api/DocumentApproved/" + $scope.currentUser.email + "/";

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;
            NProgress.done();
        });

    }

    //Event Handler===========================================================================================================
    $scope.downloadDmr = function (idDmr) {
        FileHelper.downloadDmr(idDmr);
    }

    //Application Start====================================================================================================
    $scope.formLoad();
});