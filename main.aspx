<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="main.aspx.cs" Inherits="IP.ProRBA.Web.main" %>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>ERM Enterprise Risk Management</title>
    <link rel="icon" href="./images/icoBatam.png" />
    <!-- Bootstrap Core CSS -->
    <link href="plugins/bootstrap/css/bootstrap-semi-compact.min.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="plugins/metisMenu/metisMenu.min.css" rel="stylesheet">

    <!-- DataTables CSS -->
    <!--<link href="plugins/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.css" rel="stylesheet">-->
    <link href="plugins/angular-datatables/css/angular-datatables.min.css" rel="stylesheet">
    <link href="plugins/angular-datatables/plugins/bootstrap/datatables.bootstrap.min.css" rel="stylesheet">

    <!-- DataTables Responsive CSS -->
    <link href="plugins/angular-datatables/css/responsive.dataTables.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/sb-admin-2.css?version=<%= CodeVersion %>" rel="stylesheet">
    <link href="css/default-theme.css?version=<%= CodeVersion %>" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- Custom Fonts -->
    <link href="plugins/angular-switch/angular-ui-switch.css" rel="stylesheet" type="text/css">

    <!--angular CKEditor-->
    <link href="plugins/angular-ckeditor/ng-ckeditor.css" rel="stylesheet" type="text/css">

    <!-- Sweet Alert -->
    <!-- <link href="plugins/sweet-alert/sweetalert.css" rel="stylesheet" type="text/css"> -->

    <!-- Css Custome Batam -->

    <link href="./css/customCssBatam.css" rel="stylesheet" type="text/css">
    <!-- Angular Loading Bar -->
    <script src="plugins/loader/nprogress.js"></script>
    <link href="plugins/loader/nprogress.css" rel='stylesheet' />

    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.css" rel="stylesheet" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body ng-app="mainApp">
    <div id="wrapper">
        <!-- Navigation -->
        <nav class="navbar navbar-default navbar-static-top pln-batam-bg" role="navigation" style="margin-bottom: 0;">
            <div class="navbar-header" style="width:100%;">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a class="navbar-brand" href="#notifikasi" style="color:#FFF;"><b>Enterprise Risk Management</b></a>
                <ul class="nav navbar-nav navbar-right" style="position: relative;float: right;" ng-controller="logoutCtrl">
                    <li class="dropdown no-border" style="border:none !important; ">
                        <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><b><i class="fa fa-user fa-fw"></i> &nbsp; <span ng-bind="currentUser.name"></span><span class="caret"></span></b></a>
                        <ul class="dropdown-menu padding-10 bg-orange" style="width:300px;border-bottom: 1px solid #fff !important;">
                            <li style="border-bottom: 1px solid #fff !important;">
                                <img id="profile-img" class="profile-img-card" src="../css/asset/avatar_2x.png" />
                            </li>
                            <li class="text-left" style="border-bottom: 1px solid #fff !important;">
                                <p class="padding-5 margin-5 main-font-2" ng-bind="currentUser.name"></p>
                            </li>
                            <li class="text-left" style="border-bottom: 1px solid #fff !important;">
                                <p class="padding-5 margin-5 main-font-2" ng-bind="currentUser.jobTitle"></p>
                            </li>
                            <!-- <li class="text-center" style="border-bottom: 1px solid #fff !important;">
                                <a class="color-blue" href="" ng-click="logout()"><b class="main-font-2"><i class="fa fa-sign-out fa-fw"></i> Sign Out</b></a>
                                
                            </li> -->
                            <div class="text-center" style="margin-top:10px;">
                                <button class="btn btn-primary" ng-click="logout()"><i class="fa fa-sign-out fa-fw"></i> Sign Out</button>
                            </div>

                        </ul>
                    </li>
                    <li style="border:none !important">

                        <a href="" style="color:#FFF" title="Download Panduan Penggunaan Aplikasi" onclick="return downloadManualGuide();">
                            <i class="fa fa-question-circle" style="font-size:15px"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-header -->

            <div class="navbar-default sidebar" role="navigation" ng-controller="mainNavigationCtrl">
                <div class="sidebar-nav navbar-collapse" ng-repeat="item in navigationHtml" on-finish-render="reconfigureSidebar()">
                    <ul class="nav" id="side-menu" ng-bind-html="trustAsHtml(item)" style="background:white !important;"></ul>
                </div>
                <!-- /.sidebar-collapse -->
            </div>
            <!-- /.navbar-static-side -->
        </nav>

        <!-- Start of Sidebar Toggle -->
        <div class="sidebar-toggle">
            <button class="btn btn-primary-2 btn-xs btn-sidebar-toggle" onclick="sidebarToggle(this)">
                <i id="iconSidebarToggle" class="fa arrow"></i>
            </button>
        </div>
        <!-- End of Sidebar Toggle -->

        <!-- Start of Content -->
        <div id="page-wrapper" ng-view></div>
        <!-- End of Content -->

        <!-- Start of New KR Modal -->
        <div class="modal fade" id="modalNewKR" tabindex="-1" role="dialog" aria-labelledby="modalNewKRLabel" ng-controller="newKrCtrl">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="modalNewKRLabel">Pembuatan KR</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <label class="col-md-6 control-label">Pilih Tahun</label>
                                <div class="col-md-6">
                                    <select class="form-control" ng-model="data.tahun" ng-options="item.id as item.name for item in listTahun">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-md-12 text-right">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Batal</button>
                                    <button type="button" class="btn btn-primary" ng-click="lanjutKRClick()">Lanjut</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of New KR Modal-->

        <!-- Start of New DMR -->
        <div class="modal fade" id="modalNewDMR" tabindex="-1" role="dialog" aria-labelledby="modalNewKRLabel" ng-controller="newDmrCtrl">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="modalNewDMRLabel">Pembuatan DMR</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <label class="col-md-6 control-label">Pilih Tahun</label>
                                <div class="col-md-6">
                                    <select id="ddTahunDMR" class="form-control" ng-model="data.tahun" ng-options="item.id as item.name for item in listTahun">
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="col-md-12 text-right">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Batal</button>
                                    <button type="button" class="btn btn-primary" ng-click="lanjutDMRClick()">Lanjut</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of New DMR-->

        <!-- START ALERT ERROR -->
        <div class="modal fade" id="modalError" tabindex="-1" role="dialog" aria-labelledby="modalErrorLabel">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header alert-danger">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="modalErrorLabel">ERROR APLIKASI</h4>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger">
                            <strong>ERROR!</strong> Mohon maaf, terjadi kesalahan pada aplikasi. {{ errorCode }} (silahkan melapor ke administrator aplikasi).
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END OF ALERT ERROR -->

    </div>
    <!-- /#wrapper -->

    <!-- jQuery -->
    <script src="plugins/jquery/jquery.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.js"></script>


    <!-- Bootstrap Core JavaScript -->
    <script src="plugins/bootstrap/js/bootstrap.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script src="plugins/metisMenu/metisMenu.min.js"></script>

    <!-- DataTables JavaScript -->
    <script src="plugins/datatables/js/jquery.dataTables.min.js"></script>
    <!-- <%--<script src="plugins/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.min.js"></script>--%> -->
    <script src="plugins/datatables/js/dataTables.columnFilter.js"></script>

    <!-- Angular JS -->
    <script src="plugins/angular-js/angular.min.js"></script>
    <script src="plugins/angular-js/angular-route.min.js"></script>
    <script src="plugins/angular-js/angular-animate.min.js"></script>
    <script src="plugins/angular-js/angular-sanitize.min.js"></script>
    <script src="plugins/angular-js/angular-cookies.min.js"></script>
    <script src="plugins/angular-js/angular-locale_custom.js"></script>

    <!-- Angular Validation-->
    <script src="plugins/angular-validation/angular-validation.min.js"></script>
    <script src="plugins/angular-validation/angular-validation-rule.js?version=<%= CodeVersion %>"></script>

    <!-- Angular DataTables-->
    <script src="plugins/angular-datatables/angular-datatables.min.js"></script>
    <script src="plugins/angular-datatables/dataTables.responsive.min.js"></script>
    <script src="plugins/angular-datatables/plugins/columnfilter/angular-datatables.columnfilter.min.js"></script>

    <!-- Angular UI -->
    <script src="plugins/angular-ui/ui-bootstrap-tpls-2.1.3.min.js"></script>

    <!-- Angular SWITCH -->
    <script src="plugins/angular-switch/angular-ui-switch.js"></script>

    <!-- Angular Base64 -->
    <script src="plugins/angular-base64/src/angular-base64-upload.js"></script>

    <!-- CKEditor WYSIWYG -->
    <script src="plugins/ckeditor/ckeditor.js"></script>

    <!-- Angular CKEditor -->
    <script src="plugins/angular-ckeditor/ng-ckeditor.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="scripts/sb-admin-2.js"></script>

    <!-- <%--Angular HighCharts--%> -->
    <script src="plugins/highcharts/highchart.js"></script>
    <script src="plugins/angular-highcharts/src/highcharts-3d.js"></script>
    <script src="plugins/angular-highcharts/src/highcharts-ng.js"></script>

    <!-- ANGULAR TREE -->
    <link href="plugins/jquery-tree/css/jquery.treegrid.css" rel="stylesheet">
    <script src="plugins/jquery-tree/js/jquery.treegrid.js"></script>
    <script src="plugins/jquery-tree/js/jquery.treegrid.min.js"></script>

    <!-- Hotfix -->
    <script src="scripts/hotfix.js?version=<%= CodeVersion %>"></script>

    <!-- Hotfix -->
    <script src="scripts/functions.js?version=<%= CodeVersion %>"></script>

    <!-- Angular JS Config -->
    <script src="scripts/route-config.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/directives.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/http-request.js?version=<%= CodeVersion %>"></script>

    <!-- Angular Factories -->
    <script src="scripts/factories.js?version=<%= CodeVersion %>"></script>

    <!-- Sweet Alert -->
    <!-- <script src="plugins/sweet-alert/sweetalert.js"></script> -->

    <!-- SummerNote -->
    <!-- <script src="./plugins/summernote/summernote.min.js"></script>

    <script src="./plugins/summernote/angular-summernote.min.js"></script>


    <script src="./plugins/summernote/html2canvas.min.js"></script>
    <script src="./plugins/summernote/jspdf.debug.js"></script> -->

    <!-- Angular JS Controllers -->
    <script src="scripts/controllers/dashboardCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/notifikasiCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/daftarDokumenCtrl.js?version=<%= CodeVersion %>"></script>

    <script src="scripts/controllers/daftarDokumenAdminUnitCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/daftarDokumenSMRCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/daftarDisposisiDokumenCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/daftarDokumenKSRMCtrl.js?version=<%= CodeVersion %>"></script>

    <script src="scripts/controllers/daftarDokumenApprovalCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/daftarDokumenApprovedCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/newKrCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/krCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/ormCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/dmrCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/newDmrCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/monitoringDMRCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/distDmrCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mareadampakCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mEmployeeCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mEntitasCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mDepartemenCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mPenyebabCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mRisikoCtrl.js?version=<%= CodeVersion %>"></script>

    <script src="scripts/controllers/mKejadianRisikoCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mTaksonomiRisikoCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mKemungkinanCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mSOCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mKPICtrl.js?version=<%= CodeVersion %>"></script>


    <!-- <script src="scripts/controllers/duplikasiDmrCtrl.js?version=<%= CodeVersion %>"></script> -->
    <script src="scripts/controllers/riskEventCtrl.js?version=<%= CodeVersion %>"></script>

    <script src="scripts/controllers/mMenuCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mPeranCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mUserCtrl.js?version=<%= CodeVersion %>"></script>

    <script src="scripts/controllers/msumberRisikoCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mKategoriRisikoCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mWarnaCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mTingkatRisikoCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mapRiskCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mapRiskAllCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/logoutCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/approvalInfoCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mainNavigationCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/errorCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/error401Ctrl.js?version=<%= CodeVersion %>"></script>


    <script src="scripts/controllers/mDampakCtrl.js?version=<%= CodeVersion %>"></script>
    <script src="scripts/controllers/mSubKategoriRisikoCtrl.js?version=<%= CodeVersion %>"></script>



    <!-- Angular Input Masks -->
    <!-- <%--<script src="plugins/angular-input-masks/masks.js"></script>--%> -->

    <script type="text/javascript">
        function downloadManualGuide() {
            // window.open("/media/User Guide New ProRBA.pdf", "_blank");
            // return false;

            alert("Manual Book Belum Tersedia");
        }



        // FOR LOGIN
        function loginFormClick(e) {
            $('#modalLogin').modal('show');
        }

        function menuKRClick(e) {
            $('#modalNewKR').modal('show');
            return false;
        }

        // FOR DMR
        function menuDMRClick(e) {
            $('#modalNewDMR').modal('show');
            return false;
        }
        // END FOR DMR

        $(document).ready(function () {
            var currYear = new Date().getFullYear();

            $('#ddTahun').empty();
            //$('#ddTahunDMR').empty();
            for (var i = currYear - 1; i <= currYear + 1; i++) {
                $('#ddTahun').append($("<option></option>").attr("value", i).text(i));
                //$('#ddTahunDMR').append($("<option></option>").attr("value", i).text(i));
            };

            $('#ddTahun').val(currYear);
        });

        //Sidebar Toggle
        function sidebarToggle(obj) {
            var sidebar = $(".sidebar-toggle");
            var isSidebarHidden = $(".sidebar-toggle").hasClass("sidebar-collapse");

            if (isSidebarHidden) {
                sidebar.removeClass("sidebar-collapse");
                $("#page-wrapper").removeClass("page-wrapper-expanded");
                $(".navbar-collapse").removeClass("display-none");
                $("#iconSidebarToggle").removeClass("arrow-r");
                $("#iconSidebarToggle").addClass("arrow-l");
            } else {
                sidebar.addClass("sidebar-collapse");
                $("#page-wrapper").addClass("page-wrapper-expanded");
                $(".navbar-collapse").addClass("display-none");
                $("#iconSidebarToggle").removeClass("arrow-l");
                $("#iconSidebarToggle").addClass("arrow-r");
            }
        }
    </script>
</body>

</html>