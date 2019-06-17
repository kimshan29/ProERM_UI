mainApp.controller("approvalInfoCtrl", function($scope, $cookies, $interval, HttpRequest, Helper, Constant, Model) {
    $scope.showApprovalInfo = '';
    $scope.data = {};

    //Start of Application =============================================================================================================

    $interval(function () {
        try {
            var currentRoute = $cookies.get('currentRoute');
            var modul = currentRoute.split('/')[1];

            $scope.showApprovalInfo = modul === 'kr' || modul === 'dmr' || modul === 'orm';

            if (modul === 'kr')
            {
                $scope.data = JSON.parse($cookies.get('krApprovalStatus'));
            } else if (modul === 'dmr') {
                $scope.data = JSON.parse($cookies.get('dmrApprovalStatus'));
            } else if (modul === 'orm') {
                $scope.data = JSON.parse($cookies.get('ormApprovalStatus'));
            } else {
                $scope.data = {};
            }
                
        }
        catch (err) {
        }
    }, 1000);
});