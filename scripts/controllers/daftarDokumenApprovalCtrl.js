mainApp.controller("daftarDokumenApprovalCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, FileHelper, DTOptionsBuilder, DTColumnBuilder) {

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
                    },
                    {
                        type: ''
                    }
                ]
            });
        $scope.renderData();
    }

    $scope.renderData = function () {
        NProgress.start();

        var apiUrl = "/api/MultipleApproval?email=" + $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;
            NProgress.done();
        });

    }

    $scope.eventClickApprove = function ()
    {
        NProgress.start();
        var apiUrl = "/api/MultipleApproval";
        HttpRequest.post(apiUrl, $scope.data).success(function (response) {
            $scope.renderData();
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();
            var data = {
                title: "APPROVE ALL",
                exception: response,
                exceptionCode: code,
                operation: "POST",
                apiUrl: apiUrl
            };
            console.log(JSON.stringify($scope.data));
            Helper.notifErrorHttp(data);
        });
    }

    //Application Start====================================================================================================
    $scope.formLoad();
});