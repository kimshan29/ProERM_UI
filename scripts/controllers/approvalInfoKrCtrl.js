mainApp.controller("approvalInfoKrCtrl", function($scope, $cookies, $interval, HttpRequest, Helper, Constant, Model) {
   
    $scope.data = {};

    //Start of Application =============================================================================================================
    $interval(function () {
        try {
            $scope.data = JSON.parse($cookies.get('krApprovalStatus'));
        }
        catch (err) {
        }
    }, 1000);
});