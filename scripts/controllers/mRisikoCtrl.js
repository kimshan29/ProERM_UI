mainApp.controller("mRisikoCtrl", function ($scope, $routeParams, $q, $cookies, Constant, HttpRequest, Model, Helper, DTOptionsBuilder, DTColumnBuilder) {
    $scope.currentUser = {};
    $scope.risiko = {};
    $scope.risiko.input = {};
    $scope.risiko.data = {};


    $scope.risiko.isEditMode = false;

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withDisplayLength(10);

        $scope.renderRisiko();
    }

    $scope.eventClickAdd = function () {
        $scope.risiko.input = {};
        $scope.risiko.isEditMode = true;
    }

    $scope.eventClickSave = function () {
        var apiUrl = "/api/MasterRisiko";

        $scope.risiko.input.userEmail = $scope.currentUser.email;

        HttpRequest.post(apiUrl, $scope.risiko.input).success(function (response) {
            $scope.renderRisiko();
            $scope.risiko.isEditMode = false;
        });
    }

    $scope.eventClickCancel = function () {
        NProgress.start();
        $scope.renderRisiko();
        $scope.risiko.isEditMode = false;
        NProgress.done();
    }

    $scope.eventClickEdit = function (id) {
        NProgress.start();
        var apiUrl = "/api/MasterRisiko/" + id;

        $scope.risiko.input.userEmail = $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.risiko.input = response;
            $scope.risiko.isEditMode = true;
            NProgress.done();
        });
    }

    $scope.eventClickHapus = function (id, name) {
        NProgress.start();

        var apiUrl = "/api/MasterRisiko/" + id + "?email=" + $scope.currentUser.email;
        var hapus = confirm("Hapus " + name + "?");
        if (hapus) {
            HttpRequest.del(apiUrl).success(function (response) {
                $scope.renderRisiko();
                $scope.risiko.isEditMode = false;
                NProgress.done();
            });
        } else {
            NProgress.done();
        }
    }

    $scope.renderRisiko = function ()
    {
        NProgress.start();
        
            var apiUrl = "/api/MasterRisiko";
            
            HttpRequest.get(apiUrl).success(function (response) {
                
                $scope.risiko.data = response;
                NProgress.done();
            });

        
    }

    $scope.formLoad();
});