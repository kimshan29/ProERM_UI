mainApp.controller("ormCtrl", function($scope, $routeParams, $location, $cookies, HttpRequest, Helper, Constant, Model) {

    $scope.currentUser = {};
    $scope.isInitMode = true;
    $scope.isEditMode = false;
	$scope.isLKEditMode = false;
    $scope.idOrm = Constant.emptyGuid;

    $scope.Helper = Helper;
    $scope.data = {};
    $scope.master = {};
    $scope.master.orm = [];
    $scope.master.efektivitasA = [];
    $scope.master.efektivitasDLI = [];
    $scope.master.risikoBaru = [];

	$scope.lk = {};
	$scope.lk.data = [];
	$scope.lk.isEditMode = [];

    $scope.hasCompleteStep = false;
    $scope.logApprovals = [];
    $scope.isCurrentApprover = false;
    $scope.isPicCoordinator = false;
    $scope.isDataEditable = false;
    $scope.approvalStatus = {};
    $scope.listNextApprover = [];
    $scope.listTujuanDisposisi = [];
    $scope.initiator = {};
    $scope.submitter = {};
    $scope.approver = {};
    $scope.reviser = {};
    $scope.dispositioner = {};

    //Procedures =====================================================================================================================
    $scope.formLoad = function()
    {
        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        }
        catch (err) {
            $scope.currentUser = {};
        }
        
    	if ($scope.idOrm != "") 
		{
    	    $scope.initVariables();
    	    $scope.renderData();
    	    $scope.renderApprovalStatus();
		}
    }

    $scope.initVariables = function()
    {
    	if (!Helper.isNullOrEmpty($routeParams.idOrm)) 
    	{
    		$scope.isInitMode = false;
    		$scope.idOrm = $routeParams.idOrm;
    	};
    }

    $scope.renderApprovalStatus = function () {
        NProgress.start();
        var apiUrl = "/api/ormApprovalStatus/" + $scope.idOrm + "?email=" + $scope.currentUser.email;
        
        HttpRequest.get(apiUrl).success(function (response) {
            $scope.approvalStatus = response;

            try {
                $scope.isCurrentApprover = response.currentApproval.toLowerCase().includes($scope.currentUser.email.toLowerCase());
            } catch (e) {
                $scope.isCurrentApprover = false;
            }
            
            //$scope.isDataEditable = $scope.isCurrentApprover && response.kodeApproval == 1;
            //$scope.isDataEditable = $scope.isPicCoordinator && response.kodeApproval == 1;
            $scope.isDataEditable = response.isDataEditable;//response.kodeApproval == 1;
			$scope.hasCompleteStep = response.hasCompleteStep;
			//console.log($scope.hasCompleteStep);

            $cookies.put('ormApprovalStatus', JSON.stringify(response));

            apiUrl = "/api/ormListNextApprover/" + $scope.idOrm;

            HttpRequest.get(apiUrl).success(function (response) {
				$scope.listNextApprover = response;
				console.log("List approver : " + JSON.stringify(response));
            })
            .error(function (response, code) {
                var data = {
                    title: "List Next Approver",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });

            // apiUrl = "/api/ormListTujuanDisposisi/" + $scope.idOrm;

            // HttpRequest.get(apiUrl).success(function (response) {
            //     $scope.listTujuanDisposisi = response;
            // })
            // .error(function (response, code) {
            //     var data = {
            //         title: "List Tujuan Disposisi",
            //         exception: response,
            //         exceptionCode: code,
            //         operation: "GET",
            //         apiUrl: apiUrl
            //     };

            //     Helper.notifErrorHttp(data);
            // });

            /*
            apiUrl = "/api/ormLogTrail/" + $scope.idOrm;

            HttpRequest.get(apiUrl).success(function (response) {
                $scope.logApprovals = response;
                NProgress.done();
            })
            .error(function (response, code) {
                var data = {
                    title: "Log Trail",
                    exception: response,
                    exceptionCode: code,
                    operation: "GET",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
            */
        })
        .error(function (response, code) {
            NProgress.done();

            var data = {
                title: "Approval Status",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.renderData = function()
    {
		NProgress.start();
		var apiUrl = "/api/ormDetailORM/" + $scope.idOrm;
		
    	HttpRequest.get(apiUrl).success(function(response) {
    	    $scope.data = response;
			$scope.renderMaster();
			$scope.adliChange();
			$scope.renderApprovalStatus();
		
			var apiPic = "/api/PicORM/" + $scope.idOrm + "?email=" + $scope.currentUser.email;
			HttpRequest.get(apiPic).success(function(response){
				$scope.isPicCoordinator = response;
			});
			
    	    // try {
    	    //     var picCoordinator = angular.copy(response.detailRencanaMitigasi.picKoordinator || {});
    	    //     $scope.isPicCoordinator = $scope.currentUser.email.toLowerCase() == picCoordinator.email.toLowerCase();
    	    // } catch (e) {

    	    // }

    	    var rm = $scope.data.detailRencanaMitigasi || {};
    	    // $scope.hasCompleteStep = false;

    	    // try {
    	    //     angular.forEach(langkahKerja.langkahKerja, function (item, i) {
    	    //         try {
    	    //             if (item.progresPersentase.value == 100)
    	    //                 $scope.hasCompleteStep = true;
    	    //         } catch (e) {

    	    //         }
    	    //     });
    	    // } catch (e) {

    	    // }
    	    
            

			NProgress.done();
    	})
        .error(function (response, code) {
            $scope.renderApprovalStatus();
            NProgress.done();

            var data = {
                title: "Detail ORM",
                exception: response,
                exceptionCode: code,
                operation: "GET",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
    }

    $scope.renderDetailMitigasi = function()
    {
    	var apiUrl = "/api/ormDetailMitigasi/" + $scope.idOrm;

    	HttpRequest.get(apiUrl).success(function(response) {
    		$scope.data.detailMitigasi = response;

    		$scope.renderMaster();
			$scope.adliChange();
			//console.log(JSON.stringify($scope.data.detailMitigasi));
    	})
    	.error(function(response, code) {
    		//console.log(response.Message);
    	});
    }

    $scope.renderMaster = function()
    {
    	//Master ORM
    	if ($scope.isInitMode) 
    	{	
    	    var apiUrl = "/api/OrmListORM/" + $scope.currentUser.email + "/";
	    	HttpRequest.get(apiUrl).success(function(response) {
	    		$scope.master.orm = response;
	    	});
    	}

		//Master Efektivitas - Approach
    	var efektivitasA = 
		[
			{id:0, name:"0 : Tidak Ada"},
			{id:1, name:"1 : Sangat Lemah"},
			{id:2, name:"2 : Lemah"},
			{id:3, name:"3 : Sedang"},
			{id:4, name:"4 : Kuat"},
			{id:5, name:"5 : Sangat Kuat"}
		];
		
		//Master Efektivitas Approach
		$scope.master.efektivitasA = efektivitasA;
		
    	//Master Efektivitas DLI
    	$scope.renderListEfektivitasDLI();

		//Master Risiko Baru
		$scope.master.risikoBaru = [ {value:"Y", name:"Ya"}, {value:"N", name:"Tidak"} ];
    	
    	//Master Peringkat Dampak
		// console.log("Render Peringkat Dampak");
		// console.log("Detail Risiko : " + JSON.stringify($scope.data.detailRisikoSM));
		$scope.renderListPeringkatDampak();
		
    	//Master Peringkat Kemungkinan
    	$scope.renderListPeringkatKemungkinan();
    }

    $scope.renderListPeringkatDampak = function()
    {
    	//Master Peringkat Kemungkinan
    	var idAreaDampak = Constant.emptyGuid;
    	var nilai = 0;
    	try{
			idAreaDampak = Helper.ifNullOrEmpty($scope.data.detailRisikoSM.areaDampak.id, Constant.emptyGuid);
			
    	}
    	catch(err){
    	}

    	try{
    		nilai = Helper.ifNullOrEmpty($scope.data.detailMitigasi.nilai, 0);
    	}
    	catch(err){
    	}

		var apiUrl = "/api/krListPeringkatDampak/" + $scope.idOrm + "?idArea=" + idAreaDampak + "&efektifitas=" + nilai + "&tipe=ORM"; 
		//console.log(apiUrl);

	    HttpRequest.get(apiUrl).success(function(response) {
	        $scope.master.peringkatDampak = response;
	    });
    }

    $scope.renderListEfektivitasDLI = function()
    {
    	//Master Efektivitas - DLI
    	var efektivitasDLI = [];
    	var approach = 0;
    	
    	try{
    		approach = $scope.data.detailMitigasi.approach;
    	}
    	catch(err){
    	}
    	
    	var efektivitasLabel = ["0: Tidak Ada", "1 : Sangat Lemah", "2 : Lemah", "3 : Kuat", "4 : Kuat", "5 : Sangat Kuat"];

    	for (var i = 0; i <= approach; i++)
    	    efektivitasDLI.push({ id: i, name: efektivitasLabel[i] });

		$scope.master.efektivitasDLI = efektivitasDLI;
    }

    $scope.renderListPeringkatKemungkinan = function()
    {
    	//Master Peringkat Kemungkinan
    	var nilaiDampak = 0;
    	var idTipePeringkatKemungkinan = Constant.emptyGuid;
    	var nilai = 0;

    	try{
    		nilaiDampak = Helper.ifNullOrEmpty($scope.data.detailMitigasi.peringkatDampak.nilai, 0);
    	}
    	catch(err){
    	}
    	
    	try{
    		idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.data.detailMitigasi.tipePeringkatKemungkinan.id, Constant.emptyGuid);
    	}
    	catch(err){
    	}

    	try{
    		nilai = Helper.ifNullOrEmpty($scope.data.detailMitigasi.nilai, 0);
    	}
    	catch(err){
    	}

		apiUrl = "/api/krListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilai + "&dampak=" + nilaiDampak;
	    HttpRequest.get(apiUrl).success(function(response) {
	        $scope.master.peringkatKemungkinan = response;
	    });
    }

    //Event Handlers ===================================================================================================================
	$scope.noOrmChange = function()
	{
		$scope.renderData();	
	}
	
	$scope.adliChange = function()
	{
		var approach = 0;
		var deployment = 0;
		var learning = 0;
		var integration = 0;
		var score = 0;

		if (!Helper.isNullOrEmpty($scope.data.detailMitigasi)) 
		{
		   	approach = parseInt($scope.data.detailMitigasi.approach);
			deployment = parseInt($scope.data.detailMitigasi.deployment);
			learning = parseInt($scope.data.detailMitigasi.learning);
			integration = parseInt($scope.data.detailMitigasi.integration);
			score = (approach + deployment + learning  + integration) / 4;

			$scope.data.detailMitigasi.nilai = (score >= 0 && score <= 5) ? score : 0;
			$scope.data.detailMitigasi.efektifitas = Helper.getLabelEfektivitas(score);
		};

		//$scope.data.detailMitigasi.peringkatDampak.id = Constant.emptyGuid;
		//$scope.peringkatDampakChange();
		$scope.adjustValueDLI();
		$scope.renderListEfektivitasDLI();
		$scope.renderListPeringkatDampak();
	}

	$scope.adjustValueDLI = function()
	{
		if (!Helper.isNullOrEmpty($scope.data.detailMitigasi))
		{
			var approach = $scope.data.detailMitigasi.approach;
			var deployment = $scope.data.detailMitigasi.deployment;
			var learning = $scope.data.detailMitigasi.learning;
			var integration = $scope.data.detailMitigasi.integration;

			if (deployment > approach)
				$scope.data.detailMitigasi.deployment = approach;

			if (learning > approach)
				$scope.data.detailMitigasi.learning = approach;
			
			if (integration > approach)
				$scope.data.detailMitigasi.integration = approach;
		};
	}

	$scope.peringkatDampakChange = function()
	{
		var id = Helper.ifNullOrEmpty($scope.data.detailMitigasi.peringkatDampak.id, Constant.emptyGuid);
		var master = $scope.master.peringkatDampak;
		var selectedItem = Helper.findItem(master, "id", id);

		$scope.data.detailMitigasi.peringkatDampak.id = id;
		$scope.data.detailMitigasi.peringkatDampak.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name; 	
		$scope.data.detailMitigasi.peringkatDampak.keterangan = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.keterangan; 	
		$scope.data.detailMitigasi.peringkatDampak.nilai = Helper.isNullOrEmpty(selectedItem) ? 0 : selectedItem.nilai; 	

		$scope.data.detailMitigasi.peringkatKemungkinan.id = Constant.emptyGuid;

		$scope.peringkatKemungkinanChange();
		$scope.renderListPeringkatKemungkinan();
	}

	$scope.peringkatKemungkinanChange = function()
	{
		var id = $scope.data.detailMitigasi.peringkatKemungkinan.id;
		var master = $scope.master.peringkatKemungkinan;
		var selectedItem = Helper.findItem(master, "id", id);

		$scope.data.detailMitigasi.peringkatKemungkinan.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name;
		$scope.data.detailMitigasi.peringkatKemungkinan.keterangan = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.keterangan;

		$scope.hitungTingkatRisiko();
	}

	$scope.hitungTingkatRisiko = function()
	{
	    NProgress.start();

		var idPerDampak = Constant.emptyGuid;
		var idPerKemungkinan = Constant.emptyGuid;

		try{
			idPerDampak = Helper.ifNullOrEmpty($scope.data.detailMitigasi.peringkatDampak.id, Constant.emptyGuid);
		}
		catch(err){}

		try{
			idPerKemungkinan = Helper.ifNullOrEmpty($scope.data.detailMitigasi.peringkatKemungkinan.id, Constant.emptyGuid);
		}
		catch(err){}

		var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

		HttpRequest.get(apiUrl).success(function(response) {
		    $scope.data.detailMitigasi.realisasiTingkatRR = response;

		    NProgress.done();
		});
	}

	$scope.risikoBaruChange = function()
	{
		var value = $scope.data.detailMitigasi.risikoBaru.value;
		var master = $scope.master.risikoBaru;
		var selectedItem = Helper.findItem(master, "value", value);

		$scope.data.detailMitigasi.risikoBaru.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name;
	}

	$scope.editClick = function()
	{
		$scope.isEditMode = true;
	}

	$scope.lk.editClick = function(indexLK)
	{
		$scope.lk.isEditMode[indexLK] = true;
		//console.log("lk.isEditMode: "+$scope.lk.isEditMode[indexLK]);
	}

	$scope.editProgressClick = function()
	{
		$scope.isEditProgressMode = true;
	}

	$scope.saveChangesClick = function()
	{
	    NProgress.start();

		var apiUrl = "/api/ormDetailMitigasi";
		var data = $scope.data.detailMitigasi;
		
		data.userEmail = $scope.currentUser.email;

		HttpRequest.post(apiUrl, data)
		.success(function(response) {
			$scope.renderDetailMitigasi();
			$scope.isEditMode = false;

			NProgress.done();
		})
		.error(function (response, code) {
		    NProgress.done();

			//console.log(response.Message, JSON.stringify(data));
		});
	}

	$scope.lk.saveChangesClick = function(indexLK)
	{
		
			NProgress.start();

			var apiUrl = "/api/ormDetailORM";
			var data = $scope.data;
			
			data.userEmail = $scope.currentUser.email;
			//console.log(JSON.stringify(data));

			HttpRequest.post(apiUrl, data)
			.success(function(response) {
				$scope.renderData();
				
				$scope.lk.isEditMode[indexLK] = false;

				NProgress.done();
			})
			.error(function (response, code) {
				NProgress.done();

				//console.log(response.Message, JSON.stringify(data));
			});
		
	}

	$scope.discardChangesClick = function()
	{
		$scope.renderDetailMitigasi();
		$scope.isEditMode = false;
	}

	$scope.lk.discardChangesClick = function(indexLK)
	{
		$scope.renderData();
		$scope.lk.isEditMode[indexLK] = false;
	}

	$scope.sendClick = function()
	{
	    NProgress.start();

		if ($scope.isInitMode)
		{
			var apiUrl = "/api/ormInisiasi"
			var data = {
			    id: $scope.data.id,
                comment: $scope.initiator.keterangan,
			    userEmail: $scope.currentUser.email
			};
            
			HttpRequest.post(apiUrl, data).success(function () {
			    NProgress.done();
			    alert("Data berhasil diinisiasi.");

			    $location.path("/orm/" + $scope.data.id);
			    
			    //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
			    $('#modalInisiasi').modal('hide');
			    $('body').removeClass('modal-open');
			    $('.modal-backdrop').remove();
			})
            .error(function (response, code) {
                $scope.renderApprovalStatus();
                NProgress.done();

                var data = {
                    title: "Laporan Monitoring Mitigasi Inisiasi",
                    exception: response,
                    exceptionCode: code,
                    operation: "POST",
                    apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
            });
		}
	}

	$scope.submitClick = function () {
	    NProgress.start();

	    var apiUrl = "/api/ormSubmit";
	    var data = {
	        idOrm: $scope.idOrm,
	        keterangan: $scope.submitter.keterangan,
            nextApproval: $scope.submitter.nextApproval,
	        userEmail: $scope.currentUser.email
	    };
	    //console.log(apiUrl, JSON.stringify(data));
	    HttpRequest.post(apiUrl, data).success(function (response) {
	        alert('Data berhasil di-submit.');
	        $scope.renderApprovalStatus();

	        NProgress.done();

	        //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
	        $('#modalSubmit').modal('hide');
	    })
        .error(function (response, code) {
            $scope.renderApprovalStatus();
            NProgress.done();

            var data = {
                title: "Laporan Monitoring Mitigasi Submit",
                exception: response,
                exceptionCode: code,
                operation: "POST",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
	}

	$scope.approveClick = function () {
	    NProgress.start();

	    var apiUrl = "/api/ormApproval";
	    var data = {
	        idOrm: $scope.idOrm,
	        keterangan: $scope.approver.keterangan,
	        nextApproval: $scope.approver.nextApproval,
	        userEmail: $scope.currentUser.email
	    };

	    //console.log(apiUrl, JSON.stringify(data));
	    HttpRequest.post(apiUrl, data).success(function (response) {
	        alert('Data berhasil di-approve.');

	        //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
	        $('#modalApproval').modal('hide');

	        $scope.renderApprovalStatus();
	        NProgress.done();
	    })
        .error(function (response, code) {
            $scope.renderApprovalStatus();
            NProgress.done();

            var data = {
                title: "ORM Approve",
                exception: response,
                exceptionCode: code,
                operation: "POST",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
	}

	$scope.reviseClick = function () {
	    NProgress.start();

	    var apiUrl = "/api/ormRevise";
	    var data = {
	        idOrm: $scope.idOrm,
	        keterangan: $scope.reviser.keterangan,
	        userEmail: $scope.currentUser.email
	    };

	    //console.log(apiUrl, JSON.stringify(data));
	    HttpRequest.post(apiUrl, data).success(function (response) {
	        $scope.renderApprovalStatus();
	        alert('Data berhasil di-revise.');

	        //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
	        $('#modalRevise').modal('hide');

	        NProgress.done();
	    })
        .error(function (response, code) {
            $scope.renderApprovalStatus();
            NProgress.done();

            var data = {
                title: "ORM Revise",
                exception: response,
                exceptionCode: code,
                operation: "POST",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });
	}

	$scope.submitDispositionClick = function () {
	    NProgress.start();

	    var apiUrl = "/api/ormDisposition";
	    var data = {
	        idOrm: $scope.idOrm,
	        keterangan: $scope.dispositioner.keterangan,
	        tujuanDisposisi: $scope.dispositioner.tujuan,
	        userEmail: $scope.currentUser.email
	    };

	    //console.log(apiUrl, JSON.stringify(data));
	    HttpRequest.post(apiUrl, data).success(function (response) {
	        $scope.renderApprovalStatus();
	        alert('Data berhasil didisposisi.');

	        //Jangan meniru script di bawah ini, sangat tidak direkomendasikan
	        $('#modalDisposition').modal('hide');

	        NProgress.done();
	    })
        .error(function (response, code) {
            $scope.renderApprovalStatus();
            NProgress.done();

            var data = {
                title: "ORM Disposition",
                exception: response,
                exceptionCode: code,
                operation: "POST",
                apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
        });

		$scope.tambahLampiranClick = function (indexKegiatan) {
        var file = new Model.mtrDmr.jadwalPK.lampiran();

        file.idTB = $scope.detailData.jadwalPK[indexKegiatan].id;

        $scope.detailData.jadwalPK[indexKegiatan].attachment.push(file);
    };
	}

    //Start of Application =============================================================================================================
    $scope.formLoad();
});