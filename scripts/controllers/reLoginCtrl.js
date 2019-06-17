mainApp.controller("reLoginCtrl", function($scope, $routeParams, $location, $cookies, HttpRequest, Helper, Constant, Model) {

    try
    {
        $scope.currentUser = JSON.parse($cookies.get('currentUser'));
    }
    catch(err) {
        $scope.currentUser = {};
    }
    $scope.isValidLogin = true;

    $scope.loginClick = function ()
    {
        var apiUrl = "/api/login";
        var data = {
            userEmail: $scope.email,
            password: $scope.password
        };

        if (!Helper.isNullOrEmpty($scope.email) && !Helper.isNullOrEmpty($scope.password))
        {
            console.log(JSON.stringify(data));
            HttpRequest.post(apiUrl, data)
            .success(function (response) {
                if (Helper.isNullOrEmpty(response.employeeNumber) && Helper.isNullOrEmpty(response.name))
                {
                    console.log('N/A', response);
                    $scope.isValidLogin = false;
            }
            else
                {
                    $cookies.put('currentUser', JSON.stringify(response));
                    $scope.currentUser = response;

                    document.location.href = $location.path();
                }
            })
            .error(function (response, code) {
                $scope.isValidLogin = false;
            })
        }
    }
});