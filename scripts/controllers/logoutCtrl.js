mainApp.controller("logoutCtrl", function($scope, $routeParams, $location, $cookies, HttpRequest, Helper, Constant, Model) {

    try
    {
        $scope.currentUser = JSON.parse($cookies.get('currentUser'));
    }
    catch(err) {
        $scope.currentUser = {};
    }

    $scope.logout = function ()
    {
        try {
            $cookies.remove('currentUser');
        }catch(err) { 
        }
        
        try {
            $cookies.remove('krApprovalStatus');
        }catch(err) {
        }

        try {
            $cookies.remove('dmrApprovalStatus');
        }catch(err) {
        }

        try {
            $cookies.remove('ormApprovalStatus');
        }catch(err) { 
        }

        try {
            $cookies.remove('currentRoute');
        }catch(err) {
        }

        document.location.href = '/login.aspx';
    }
});