<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="IP.ProRBA.Web.login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title>ERM Enterprise Risk Management</title>
    <link rel="icon" href="./images/icoBatam.png" />
    <!-- Bootstrap Core CSS -->
    <link href="plugins/bootstrap/css/bootstrap-semi-compact.min.css" rel="stylesheet" />
    <style>
        .bg-login {
            background: #2865ac;
            background: url('/images/pltg-panaran-batam.jpg') no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }

        /*
 * Specific styles of signin component
 */
        /*
 * General styles
 */
        body,
        html {
            height: 100%;
            background-repeat: no-repeat;
        }

        .card-container.card {
            max-width: 350px;
            /*padding: 40px 40px;*/
        }

        .btn {
            font-weight: 700;
            height: 36px;
            -moz-user-select: none;
            -webkit-user-select: none;
            user-select: none;
            cursor: default;
        }

        /*
 * Card component
 */
        .card {
            /* background-color: #F7F7F7; */
            background: rgba(255, 199, 30, 0.95);
            background: -moz-linear-gradient(top, rgba(255, 199, 30, 0.95) 0%, rgba(255, 199, 30, 1) 0%, rgba(226, 141, 14, 1) 100%);
            background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255, 199, 30, 0.95)), color-stop(0%, rgba(255, 199, 30, 1)), color-stop(100%, rgba(226, 141, 14, 1)));
            background: -webkit-linear-gradient(top, rgba(255, 199, 30, 0.95) 0%, rgba(255, 199, 30, 1) 0%, rgba(226, 141, 14, 1) 100%);
            background: -o-linear-gradient(top, rgba(255, 199, 30, 0.95) 0%, rgba(255, 199, 30, 1) 0%, rgba(226, 141, 14, 1) 100%);
            background: -ms-linear-gradient(top, rgba(255, 199, 30, 0.95) 0%, rgba(255, 199, 30, 1) 0%, rgba(226, 141, 14, 1) 100%);
            background: linear-gradient(to bottom, rgba(255, 199, 30, 0.95) 0%, rgba(255, 199, 30, 1) 0%, rgba(226, 141, 14, 1) 100%);
            border: 2px solid #fff;
            /* just in case there no content*/
            padding: 20px 25px 30px;
            margin: 0 auto 25px;
            margin-top: 80px;
            /* shadows and rounded borders */
            -moz-border-radius: 2px;
            -webkit-border-radius: 2px;
            border-radius: 2px;
            -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
            -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        }

        .profile-img-card {
            /* width: 96px;
            height: 96px;
            margin: 0 auto 10px;
            display: block;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            border-radius: 50%; */

            width: 250px;
            height: 125px;
            margin: 0 auto 10px;
            display: block;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            border-radius: 13px;
        }

        /*
 * Form styles
 */
        .profile-name-card {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0 0;
            min-height: 1em;
            color: #fff;
            /* font-family: 'Bliss 2 reguler'; */
        }

        .profile-name-card2 {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0 0;
            min-height: 1em;
            color: #fff;
            margin-bottom: 40px;
        }

        .reauth-email {
            display: block;
            color: #404040;
            line-height: 2;
            margin-bottom: 10px;
            font-size: 14px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }

        .form-signin #inputEmail,
        .form-signin #inputPassword {
            direction: ltr;
            height: 44px;
            font-size: 16px;
            border-radius: 20px;
        }

        .form-signin input[type=email],
        .form-signin input[type=password],
        .form-signin input[type=text],
        .form-signin button {
            width: 100%;
            display: block;
            margin-bottom: 10px;
            z-index: 1;
            position: relative;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }

        .form-signin .form-control:focus {
            border-color: rgb(104, 145, 162);
            outline: 0;
            -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 5px rgb(104, 145, 162);
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 5px rgb(104, 145, 162);
        }

        .btn.btn-signin {
            /*background-color: #4d90fe; */
            background-color: #fff;
            /* background-color: linear-gradient(rgb(104, 145, 162), rgb(12, 97, 33));*/
            padding: 0px;
            font-weight: 700;
            font-size: 14px;
            height: 36px;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            border-radius: 10px;
            border: none;
            -o-transition: all 0.218s;
            -moz-transition: all 0.218s;
            -webkit-transition: all 0.218s;
            transition: all 0.218s;
            border: #FB991E 1px solid;
            color: #FB991E;
        }

        .btn.btn-signin:hover,
        .btn.btn-signin:active,
        .btn.btn-signin:focus {
            background-color: #fff;
            color: #b3aaa4;
            border: #b3aaa4 1px solid;
            cursor: pointer;
        }

        .forgot-password {
            color: rgb(104, 145, 162);
        }

        .forgot-password:hover,
        .forgot-password:active,
        .forgot-password:focus {
            color: rgb(12, 97, 33);
        }

        .header-login {
            float: left;
            top: 0;
            padding: 10px;
            width: 100%;
            color: #2865ac;
            background: #F7F7F7;
            font-size: 20px;
        }

        .form-control:focus {
            border-color: #FB991E !important;
            outline: 0;
            -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px #f4ba44 !important;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px #f4ba44 !important;
        }
    </style>
</head>

<body class="bg-login">
    <div class="container" ng-app="loginApp" ng-controller="loginCtrl">
        <div class="card card-container">
            <img id="profile-img" class="profile-img-card" src="images/logo-bright-putih.gif" />
            <p id="profile-name" class="profile-name-card">ERM </p>
            <p id="profile-name2" class="profile-name-card2">Enterprise Risk Management</p>
            <form class="form-signin">
                <span id="reauth-email" class="reauth-email"></span>
                <input type="text" ng-model="email" id="inputEmail" class="form-control" placeholder="Username" required autofocus>
                <input type="password" ng-model="password" id="inputPassword" class="form-control" placeholder="Password" required>
                <div id="remember" class="checkbox" style="margin-top:20px;margin-bottom:20px;font-size:10px;">
                    <label style="padding-left:0px;">Jika terdapat masalah pada username / password silahkan hubungi admin</label>
                </div>
                <button class="btn btn-lg btn-primary btn-block btn-signin" ng-click="loginClick()">Sign in</button>
            </form>
            <div class="text-danger" ng-show="!isValidLogin">Username atau password salah</div>
        </div>
    </div>
    <!-- jQuery -->
    <script src="plugins/jquery/jquery.min.js"></script>

    <!-- Angular JS -->
    <script src="plugins/angular-js/angular.min.js"></script>
    <script src="plugins/angular-js/angular-route.min.js"></script>
    <script src="plugins/angular-js/angular-animate.min.js"></script>
    <script src="plugins/angular-js/angular-sanitize.min.js"></script>
    <script src="plugins/angular-js/angular-cookies.min.js"></script>

    <!-- Angular Loading Bar -->
    <script src="plugins/loader/nprogress.js"></script>
    <link href="plugins/loader/nprogress.css" rel='stylesheet' />

    <script type="text/javascript">
        var app = angular.module('loginApp', ['ngCookies', 'ngSanitize']);

        app.controller('loginCtrl', function ($scope, $http, $rootScope, $cookies) {

            $scope.isValidLogin = true;
            $scope.loginClick = function () {
                NProgress.start();

                var apiUrl = "http://10.28.0.35:1080/api/login";
                //var apiUrl = "http://localhost:83/api/login";
                //var apiUrl = "http://erm.indonesiapower.co.id:9010/api/login";
                var data = {
                    userEmail: $scope.email,
                    password: $scope.password
                };

                $http.post(apiUrl, data).success(function (response) {
                        console.log(JSON.stringify(response));

                        if (response.employeeNumber == null && response.name == null) {
                            $scope.isValidLogin = false;
                            NProgress.done();
                        } else {
                            $cookies.put('currentUser', JSON.stringify(response));
                            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
                            NProgress.done();
                            document.location.href = "main.aspx#/home";
                        }
                    })
                    .error(function (response, code) {
                        NProgress.done();
                        alert('Terjadi kesalahan saat proses Sign In. ' + response.ExceptionMessage);
                        console.log("error : " + JSON.stringify(response));
                    });
            };
        });
    </script>
</body>

</html>