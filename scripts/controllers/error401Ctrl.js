mainApp.controller("error401Ctrl", function ($scope, $routeParams) {
    $scope.refUrl = "";

    //Procedures===========================================================================================================
    $scope.formLoad = function()
    {
        $scope.refUrl = decodeURIComponent($routeParams.refUrl);
    }

    //Application Start====================================================================================================
    $scope.formLoad();
});