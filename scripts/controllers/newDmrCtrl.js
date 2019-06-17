mainApp.controller("newDmrCtrl", function ($scope, HttpRequest, $location, $cookies, $routeParams, Helper) {
    var email = $routeParams.email;
    var tahun = $routeParams.tahun;
    var currentUser = {};

    try {
        currentUser = JSON.parse($cookies.get('currentUser'));
    }
    catch (err) {
        currentUser = {};
    }

    $scope.data = {};
    $scope.listTahun = [];
    $scope.message = '';

    if (email != "" && tahun != "" && !isNaN(tahun)) {
        var apiUrl = "/api/NewDMR";
        var data = { email: email, tahun: parseInt(tahun) };

        HttpRequest.post(apiUrl, data)
        .success(function (response) {
            $location.path("/dmr/" + response.id);
        })
        .error(function (err, code) {
            console.log(err.ExceptionMessage);
            $scope.message = err.ExceptionMessage;
        });
    }

    $scope.renderTahun = function () {
        var tahun = Helper.generateYears(1, 1);

        $scope.listTahun = tahun;
    }

    $scope.lanjutDMRClick = function () {
        //console.log("Lanjut pembuatan DMR baru oleh : " + currentUser.email + ". Tahun : " + $scope.data.tahun);
        
        $location.path("/new-dmr/" + currentUser.email + "/" + $scope.data.tahun);

        //script jquery ini sangat tidak disarankan digunakan di dalam angular, jangan ditiru.
        $('#modalNewDMR').modal('hide');
    }

    $scope.formLoad = function () {
        $scope.renderTahun();

        var curDate = new Date();
        $scope.data.tahun = curDate.getFullYear();
    }

    //Application Start
    $scope.formLoad();
});