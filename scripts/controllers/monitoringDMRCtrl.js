mainApp.controller("monitoringDMRCtrl", function ($scope, $routeParams, $location, $cookies, HttpRequest, FileHelper, Helper, Constant, Model, DTOptionsBuilder, DTColumnBuilder) {

    $scope.Helper = Helper;

    $scope.currentUser = {};
    $scope.isDetailMode = false;
    $scope.isEditMode = false;
    $scope.canEdit = false;
    $scope.idDmr = Constant.emptyGuid;

    $scope.data = [];
    $scope.detailData = {};
    $scope.totalPersentase = 0;
    $scope.dtOptions = {};

    //Procedures =====================================================================================================================
    $scope.formLoad = function () {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('responsive', true)
            .withOption('order', [7, 'desc'])
            .withDisplayLength(10);

        $scope.renderData();
    }

    $scope.renderData = function () {
        NProgress.start();
        var apiUrl = "/api/dmrUpdateMonitoring?email=" + $scope.currentUser.email;

        HttpRequest.get(apiUrl).success(function (response) {
            $scope.data = response;

            NProgress.done();
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Data Monitoring DMR",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.renderDetailData = function () {
        NProgress.start();

        var apiUrl = "/api/dmrDetailMonitoring/" + $scope.idDmr;
        
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.detailData = response;

            $scope.countTotalPersentase();

            apiUrl = "/api/updateMonitoringDMR/" + $scope.idDmr + "?email=" + $scope.currentUser.email;

            HttpRequest.get(apiUrl).success(function (response) {
                $scope.canEdit = response.akses;

                NProgress.done();
            })
            .error(function (response, code) {
                NProgress.done();

                $scope.canEdit = false;

                var data = {
                    title: "Pengecekan Hak Akses untuk Edit Monitoring DMR",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Detail Monitoring DMR",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    //Event Handlers ===================================================================================================================
    $scope.gotoDetailClick = function (idDmr) {
        $scope.isDetailMode = true;
        $scope.idDmr = idDmr;

        $scope.detailData = {};
        $scope.renderDetailData();
    }

    $scope.backToListClick = function () {
        $scope.isDetailMode = false;
        $scope.isEditMode = false;
    }

    $scope.tambahLampiranClick = function (indexKegiatan) {
        var file = new Model.mtrDmr.jadwalPK.lampiran();

        file.idTB = $scope.detailData.jadwalPK[indexKegiatan].id;

        $scope.detailData.jadwalPK[indexKegiatan].attachment.push(file);
    };

    $scope.hapusLampiran = function(indexKegiatan, indexLampiran, needConfirm)
    {
        var fileName = $scope.detailData.jadwalPK[indexKegiatan].attachment[indexLampiran].file.filename;
        var hapus = needConfirm ? confirm("Hapus " + fileName) : true;

        if (hapus) 
            $scope.detailData.jadwalPK[indexKegiatan].attachment.splice(indexLampiran, 1);
    }

    $scope.downloadLampiranClick = function (idLampiran) {
        FileHelper.downloadFromApi(idLampiran);
    }

    $scope.editClick = function () {
        $scope.isEditMode = true;
    }

    $scope.saveChangesClick = function () {
        NProgress.start();

        var apiUrl = "/api/dmrDetailMonitoring";
        var data = $scope.detailData.jadwalPK;

        angular.forEach(data, function (item, i) {
            item.userEmail = $scope.currentUser.email;
        });
        //console.log("POST (" + apiUrl + ")", JSON.stringify(data));
        HttpRequest.post(apiUrl, data).success(function (response) {
		    $scope.renderDetailData();
		    $scope.renderData();
		    $scope.isEditMode = false;

		    $scope.countTotalPersentase();

		    NProgress.done();
		})
		.error(function (response, code) {
		    NProgress.done();

		    var data = {
		        title: "Detail Monitoring DMR",
		        exception: response,
		        exceptionCode: code,
		        operation: "POST",
		        apiUrl: apiUrl
		    };

		    Helper.notifErrorHttp(data);
		});
    }

    $scope.discardChangesClick = function () {
        $scope.renderDetailData();
        $scope.isEditMode = false;
    }

    $scope.countTotalPersentase = function()
    {
        if ($scope.detailData.jadwalPK != null && $scope.detailData.jadwalPK.length > 0) {
            var total = 0;
            
            for (var i = 0; i < $scope.detailData.jadwalPK.length; i++)
                total = total + $scope.detailData.jadwalPK[i].persentase;

            total = total / $scope.detailData.jadwalPK.length;
            $scope.totalPersentase = angular.copy(total);
        }
    }

    //Start of Application =============================================================================================================
    $scope.formLoad();
});