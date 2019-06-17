mainApp.controller("mainNavigationCtrl", function ($scope, $routeParams, $cookies, $interval, $sce, HttpRequest, Helper, Constant, Model) {

    $scope.currentUser = {};
    $scope.totalNotifications;
    $scope.data = [];
    $scope.navigationHtml = [];

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }

        $interval(function () {
            var apiUrl = "/api/TotalNotification/" + $scope.currentUser.email + "/";

            HttpRequest.get(apiUrl).success(function (response) {
                $scope.totalNotifications = response == 0 ? "" : response;
                $("#totalNotifications").html($scope.totalNotifications);
            })
            .error(function (response, code) {
                if (response != undefined)
                    console.log("Error getting data ( " + apiUrl + " ) : " + response.Message + ". " + response.ExceptionMessage);
                else
                    console.log("Error getting data ( " + apiUrl + " ) : Unknown reason.");
            });
        }, 1000);

        $scope.renderData();
    };

    $scope.renderData = function ()
    {
        //Script di bawah ini sangat tidak disarankan untuk ditiru karena tidak efisien (mengembalikan html dan tidak rekursif).
        NProgress.start();

        var apiUrl = "/api/listAksesUserMenu?email=" + $scope.currentUser.email;
        
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;

            var menuLevel1 = Helper.findItems(response, "level", 1);
            var menuLevel2 = Helper.findItems(response, "level", 2);
            var menuLevel3 = Helper.findItems(response, "level", 3);

            var navigationHtml = "";

            //Start of Level 1
            angular.forEach(menuLevel1, function (item, i) {
                var isHeaderLevel1 = item.tipeMenu.toLowerCase() == "header";
                var arrow = "";
                var target = "";
                var badge = "";

                if (isHeaderLevel1)
                    arrow = " <span class='fa arrow'></span>";

                if (!isHeaderLevel1)
                    target = " target='" + item.targetUrl + "'";

                if (item.isNotif)
                    badge = " <span class='badge' id=\"totalNotifications\"></span>";

                navigationHtml += "<li> ";
                navigationHtml += "     <a href='" + item.url + "' onclick=\"" + item.onclickHandler + "\" " + target + "><i class='" + item.icon + "'></i> " + item.nmMenu + badge + arrow + "</a>";

                if (isHeaderLevel1) {
                    navigationHtml += "<ul class='nav nav-second-level'>";

                    var currMenuLevel2 = Helper.findItems(menuLevel2, "parent", item.id)

                    //Start of Level 2
                    angular.forEach(currMenuLevel2, function (item2, j) {
                        var isHeaderLevel2 = item2.tipeMenu.toLowerCase() == "header";
                        var arrow2 = "";
                        var target2 = "";

                        if (isHeaderLevel2)
                            arrow2 = " <span class='fa arrow'></span>";

                        if (!isHeaderLevel2)
                            target2 = " target='" + item2.targetUrl + "'";

                        navigationHtml += "<li> ";
                        navigationHtml += "     <a href='" + item2.url + "' " + target2 + "><i class='" + item2.icon + "'></i> " + item2.nmMenu + arrow2 + "</a>";

                        if (isHeaderLevel2) {
                            navigationHtml += "<ul class='nav nav-third-level'>";
                            navigationHtml += " <li>";

                            var currMenuLevel3 = Helper.findItems(menuLevel3, "parent", item2.id)

                            //Start of Level 3
                            angular.forEach(currMenuLevel3, function (item3, j) {
                                var isHeaderLevel3 = item3.tipeMenu.toLowerCase() == "header";
                                var arrow3 = "";
                                var target3 = "";

                                if (isHeaderLevel3)
                                    arrow3 = " <span class='fa arrow'></span>";

                                if (!isHeaderLevel3)
                                    target3 = " target='" + item3.targetUrl + "'";

                                navigationHtml += "<li> ";
                                navigationHtml += "     <a href='" + item3.url + "' " + target3 + "><i class='" + item3.icon + "'></i> " + item3.nmMenu + arrow3 + "</a>";
                                navigationHtml += "</li> ";
                            });
                            //End of Level 3

                            navigationHtml += " </li>";
                            navigationHtml += "</ul>";
                        }

                        navigationHtml += "</li> ";
                    }); 
                    //End of Level 2

                    navigationHtml += "</ul>";
                }

                navigationHtml += "</li>";
            });
            // End of Level 1

            $scope.navigationHtml.push(navigationHtml);
            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Menu Navigasi",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    };

    $scope.trustAsHtml = function (str) {
        //console.log(str);
        return $sce.trustAsHtml(str);
    };

    $scope.getMenuLevel1 = function () {
        return $scope.menuLevel1;
    };

    $scope.reconfigureSidebar = function () {
        $('#side-menu').metisMenu();
    };

    //Event Handler =============================================================================================================
    $scope.menuKRClick = function () {
        $('#modalNewKR').modal('show');
    };

    $scope.menuDMRClick = function () {
        $('#modalNewDMR').modal('show');
    };

    //Start of Application =============================================================================================================
    $scope.formLoad();
});