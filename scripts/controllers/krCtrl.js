mainApp.controller("krCtrl", function ($scope, $routeParams, $timeout, $cookies, $injector, $location, HttpRequest, Helper, Constant, Model) {
	var idKr = $routeParams.idKr;
	var currentUser = {};
	var $validationProvider = $injector.get('$validation');

	$scope.Helper = Helper;

	$scope.isFormComplete = false;
	$scope.editingTab = "";

	$scope.krHeader = {};
	$scope.krHeader.data = {};
	$scope.krHeader.isEditMode = false;

	$scope.pk = {};
	$scope.pk.header = {};
	$scope.pk.data = {};
	$scope.pk.master = [];
	$scope.pk.master.sasaranStrategis = [];
	$scope.pk.master.sasaranKPIKM = [];
	$scope.pk.isEditMode = false;

	$scope.id = {};
	$scope.id.data = [];
	$scope.id.master = {};
	$scope.id.master.kategoriRisiko = [];
	$scope.id.master.subKategoriRisiko = [];
	$scope.id.master.risiko = [];
	$scope.id.master.areaDampak = [];
	$scope.id.master.kejadian = [];
	$scope.id.master.tipeSumberRisiko = [];
	$scope.id.master.sumberRisiko = [];
	$scope.id.collapse = [];
	$scope.id.isEditMode = [];
	$scope.id.totalOpenedForEditing = 0;
	$scope.id.isValidForm = [];
	$scope.id.forms = [];

	$scope.ae = {};
	$scope.ae.data = [];
	$scope.ae.master = {};
	$scope.ae.master.peringkatDampakIR = [];
	$scope.ae.master.tipePeringkatKemungkinanIR = [];
	$scope.ae.master.peringkatKemungkinanIR = [];
	$scope.ae.master.peringkatDampakCR = [];
	$scope.ae.master.tipePeringkatKemungkinanCR = [];
	$scope.ae.master.peringkatKemungkinanCR = [];
	$scope.ae.master.efektivitasA = [];
	$scope.ae.master.efektivitasDLI = [];
	$scope.ae.collapse1 = [];
	$scope.ae.collapse2 = [];
	$scope.ae.isEditMode = [];
	$scope.ae.totalOpenedForEditing = 0;

	$scope.rm = {};
	$scope.rm.data = [];
	$scope.rm.master = {};
	$scope.rm.master.peringkatDampak = [];
	$scope.rm.master.peringkatKemungkinan = [];
	$scope.rm.ref = {};
	$scope.rm.ref.existingControlAE = [];
	$scope.rm.ref.peringkatDampakCR = [];
	$scope.rm.ref.tipePeringkatKemungkinanCR = [];
	$scope.rm.ref.peringkatKemungkinanCR = [];
	$scope.rm.ref.tingkatRisikoCR = [];
	$scope.rm.master.currency = [];
	$scope.rm.collapse1 = [];
	$scope.rm.collapse2 = [];
	$scope.rm.panelClass1 = [];
	$scope.rm.panelClass2 = [];
	$scope.rm.isEditMode = [];
	$scope.rm.totalOpenedForEditing = 0;

	$scope.logApprovals = [];
	$scope.isCurrentApprover = false;
	$scope.isDataEditable = false;
	$scope.approvalStatus = {};
	$scope.listNextApprover = [];
	$scope.listTujuanDisposisi = [];
	$scope.approver = {};
	$scope.reviser = {};
	$scope.dispositioner = {};
	$scope.currUrl = "";

	//Procedures =====================================================================================================================
	$scope.formLoad = function () {
		$scope.currUrl = "main.aspx#" + $location.path();
		console.log(JSON.stringify($scope.currUrl));
		$cookies.put('lastUrl', $scope.currUrl);
		try {
			currentUser = JSON.parse($cookies.get('currentUser'));
		} catch (err) {
			currentUser = {};
		}

		if (idKr != "") {
			$scope.renderApprovalStatus();
			$scope.renderKrHeader();
			$scope.pk.renderData();
			$scope.id.renderData();
			$scope.ae.renderData(); //=> This render ($scope.ae.renderData()) has $scope.rm.renderData() inside.
			//$scope.rm.renderData();

			//$scope.tabClick(0);
		}
	}

	$scope.renderApprovalStatus = function () {
		NProgress.start();
		var apiUrl = "/api/KRApprovalStatus/" + idKr + "?email=" + currentUser.email;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.approvalStatus = response;

				//$scope.isCurrentApprover = response.currentApproval == currentUser.email;
				$scope.isCurrentApprover = (response.currentApproval == currentUser.email) || (currentUser.email == "adminprorba@indonesiapower.co.id");
				$scope.isDataEditable = ($scope.isCurrentApprover && response.kodeApproval == 1) || (currentUser.email == "adminprorba@indonesiapower.co.id");
				$cookies.put('krApprovalStatus', JSON.stringify(response));

				apiUrl = "/api/KRListNextApprover/" + idKr;

				HttpRequest.get(apiUrl).success(function (response) {
						$scope.listNextApprover = response;
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

				apiUrl = "/api/KRListTujuanDisposisi/" + idKr;

				HttpRequest.get(apiUrl).success(function (response) {
						$scope.listTujuanDisposisi = response;
					})
					.error(function (response, code) {
						var data = {
							title: "List Tujuan Disposisi",
							exception: response,
							exceptionCode: code,
							operation: "GET",
							apiUrl: apiUrl
						};

						Helper.notifErrorHttp(data);
					});

				apiUrl = "/api/KRLogTrail/" + idKr;

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

	$scope.renderKrHeader = function () {
		//KR Header
		NProgress.start();

		var apiUrl = "/api/KRHeader/" + idKr;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.krHeader.data = response;

				//KR Penetapan Konteks - Master Risk Owner
				apiUrl = "/api/KRListRiskOwner/" + idKr;
				HttpRequest.get(apiUrl).success(function (response) {
						$scope.pk.master.riskOwner = response;
					})
					.error(function (response, code) {
						var data = {
							title: "List Risk Owner",
							exception: response,
							exceptionCode: code,
							operation: "GET",
							apiUrl: apiUrl
						};

						Helper.notifErrorHttp(data);
					});

				$scope.krHeader.isEditMode = Helper.isNullOrEmpty($scope.krHeader.data.judulKR);

				NProgress.done();
			})
			.error(function (response, code) {
				NProgress.done();

				var data = {
					title: "KR Header",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.triggerClick = function ($event, elementId) {
		$event.stopPropagation(); // <-- this is important

		$timeout(function () {
			angular.element(elementId).trigger('click');
		}, 0);
	};

	$scope.pk.renderData = function () {
		NProgress.start();

		var apiUrl = "/api/KRPenetapanKonteks/" + idKr;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.pk.data = response;

				//KR Penetapan Konteks - Master Jenis Kajian
				apiUrl = "/api/KRListJenisKajian/KR";

				HttpRequest.get(apiUrl).success(function (response) {
						$scope.pk.master.jenisKajian = response;
					})
					.error(function (response, code) {
						var data = {
							title: "List Jenis Kajian",
							exception: response,
							exceptionCode: code,
							operation: "GET",
							apiUrl: apiUrl
						};

						Helper.notifErrorHttp(data);
					});

				//KR Penetapan Konteks - Master Sub Jenis Kajian
				apiUrl = "/api/KRListSubJenisKajian/KR";

				HttpRequest.get(apiUrl).success(function (response) {
						$scope.pk.master.subJenisKajian = response;
					})
					.error(function (response, code) {
						var data = {
							title: "List Sub Jenis Kajian",
							exception: response,
							exceptionCode: code,
							operation: "GET",
							apiUrl: apiUrl
						};

						Helper.notifErrorHttp(data);
					});

				//KR Penetapan Konteks - Master Sasaran Strategis
				angular.forEach($scope.pk.data.detailSasaran, function (item, i) {
					apiUrl = "/api/KRListSasaranStrategis/" + idKr;
					HttpRequest.get(apiUrl).success(function (response) {
							$scope.pk.master.sasaranStrategis[i] = response;
						})
						.error(function (response, code) {
							var data = {
								title: "List Sasaran Strategis",
								exception: response,
								exceptionCode: code,
								operation: "GET",
								apiUrl: apiUrl
							};

							Helper.notifErrorHttp(data);
						});

					//KR Penetapan Konteks - Master KPI/KM
					$scope.pk.master.sasaranKPIKM[i] = [];
					angular.forEach($scope.pk.data.detailSasaran[i].sasaranKPIKM, function (item, j) {
						apiUrl = "/api/KRListKPIKM?idKR=" + idKr + "&idSO=" + $scope.pk.data.detailSasaran[i].sasaranStrategis.id;
						HttpRequest.get(apiUrl).success(function (response) {
								$scope.pk.master.sasaranKPIKM[i].push(response);
							})
							.error(function (response, code) {
								var data = {
									title: "List KPI/KM",
									exception: response,
									exceptionCode: code,
									operation: "GET",
									apiUrl: apiUrl
								};

								Helper.notifErrorHttp(data);
							});
					});
				});

				NProgress.done();
			})
			.error(function (response, code) {
				NProgress.done();

				var data = {
					title: "Penetapan Konteks",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.renderData = function () {
		NProgress.start();

		//KR Identifikasi - Identifikasi
		var apiUrl = "/api/KRDetailIdentifikasi/" + idKr;

		$scope.id.collapse = [];
		HttpRequest.get(apiUrl).success(function (response) {
				$scope.id.data = response;
				console.log("Detail Identifikasi", JSON.stringify(response));
				$scope.id.totalOpenedForEditing = 0;

				angular.forEach($scope.id.data, function (item, i) {
					$scope.id.master.kategoriRisiko[i] = [];
					$scope.id.master.subKategoriRisiko[i] = [];
					$scope.id.master.risiko[i] = [];
					$scope.id.master.areaDampak[i] = [];
					$scope.id.master.kejadian[i] = [];
					$scope.id.master.tipeSumberRisiko[i] = [];
					$scope.id.master.sumberRisiko[i] = [];

					$scope.id.collapse[i] = "collapse";
					$scope.id.isEditMode[i] = false;

					angular.forEach($scope.id.data[i].detailRisiko, function (item, j) {
						$scope.id.renderMaster(i, j);
					});
				});

				NProgress.done();
			})
			.error(function (response, code) {
				NProgress.done();

				var data = {
					title: "Identifikasi",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.renderDetailIdentifikasi = function (indexIdentifikasi) {
		NProgress.start();

		var idDetailIdentifikasi = $scope.id.data[indexIdentifikasi].id;
		var apiUrl = "/api/KRIdentifikasiRisiko/" + idDetailIdentifikasi;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.id.data[indexIdentifikasi] = response;
				// console.log("Detail Identifikasi", JSON.stringify(response));
				$scope.id.master.kategoriRisiko[indexIdentifikasi] = [];
				$scope.id.master.subKategoriRisiko[indexIdentifikasi] = [];
				$scope.id.master.risiko[indexIdentifikasi] = [];
				$scope.id.master.areaDampak[indexIdentifikasi] = [];
				$scope.id.master.kejadian[indexIdentifikasi] = [];
				$scope.id.master.tipeSumberRisiko[indexIdentifikasi] = [];
				$scope.id.master.sumberRisiko[indexIdentifikasi] = [];

				$scope.id.collapse[indexIdentifikasi] = "";

				angular.forEach(response.detailRisiko, function (item, i) {
					$scope.id.renderMaster(indexIdentifikasi, i);
				});

				NProgress.done();
			})
			.error(function (response, code) {
				NProgress.done();

				var data = {
					title: "Detail Identifikasi",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.renderMaster = function (indexIdentifikasi, indexDetailKatRisk) {
		//KR Identifikasi - Master Kategori Risiko
		apiUrl = "/api/krListKategoriRisiko/" + idKr;
		HttpRequest.get(apiUrl).success(function (response) {
				//$scope.id.master.kategoriRisiko[indexIdentifikasi].push(response);
				$scope.id.master.kategoriRisiko[indexIdentifikasi][indexDetailKatRisk] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "List Kategori Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});

		//KR Identifikasi - Master Sub Kategori Risiko
		var idKatRisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kategoriRisiko == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kategoriRisiko.id;
		apiUrl = "/api/krListSubKategoriRisiko/" + idKr + "?idKat=" + idKatRisiko;

		HttpRequest.get(apiUrl).success(function (response) {
				//$scope.id.master.subKategoriRisiko[indexIdentifikasi].push(response);
				$scope.id.master.subKategoriRisiko[indexIdentifikasi][indexDetailKatRisk] = response;
				console.log(JSON.stringify(response));
			})
			.error(function (response, code) {
				var data = {
					title: "List Sub Kategori Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});

		//KR Identifikasi - Master Risiko
		var idSubKatRisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].subKategori == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].subKategori.id;
		apiUrl = "/api/krListRisiko/" + idKr + "?idSubkat=" + idSubKatRisiko;

		HttpRequest.get(apiUrl).success(function (response) {
				//$scope.id.master.risiko[indexIdentifikasi].push(response);
				$scope.id.master.risiko[indexIdentifikasi][indexDetailKatRisk] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "List Kelompok Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});


		//KR Identifikasi - Master Area Dampak
		// var idAreaDampak = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].areaDampak == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].areaDampak.id;
		apiUrl = "/api/krListAreaDampak/" + idKr;


		HttpRequest.get(apiUrl).success(function (response) {

				$scope.id.master.areaDampak[indexIdentifikasi][indexDetailKatRisk] = response;
				console.log(JSON.stringify(response));
				console.log("Area Dampak");


			})
			.error(function (response, code) {
				var data = {
					title: "List Area Dampak",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});

		//KR Identifikasi - Master Kejadian
		var idRisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko.id;
		console.log(idRisiko);
		apiUrl = "/api/krListKejadianRisiko/" + idKr + "?idRisk=" + idRisiko;

		HttpRequest.get(apiUrl).success(function (response) {
				//$scope.id.master.kejadian[indexIdentifikasi].push(response);
				$scope.id.master.kejadian[indexIdentifikasi][indexDetailKatRisk] = response;

			})
			.error(function (response, code) {
				var data = {
					title: "List Kejadian Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});

		//KR Identifikasi - Master Tipe Sumber Risiko
		apiUrl = "/api/krListTipeSumberRisiko";

		HttpRequest.get(apiUrl).success(function (response) {
				//$scope.id.master.tipeSumberRisiko[indexIdentifikasi].push(response);
				$scope.id.master.tipeSumberRisiko[indexIdentifikasi][indexDetailKatRisk] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "List Tipe Sumber Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});

		//KR Identifikasi - Master Sumber Risiko
		var idTipeSumberRisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].tipeSumberRisiko == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].tipeSumberRisiko.id;
		apiUrl = "/api/krListSumberRisiko/" + idTipeSumberRisiko;

		HttpRequest.get(apiUrl).success(function (response) {
				//$scope.id.master.sumberRisiko[indexIdentifikasi].push(response);
				$scope.id.master.sumberRisiko[indexIdentifikasi][indexDetailKatRisk] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "List Sumber Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.listPenyebab = function (keyword) {
		// var apiUrl = "/api/krListPenyebab/" + currentUser.idUnit + "?keyword=" + keyword; idR
		var apiUrl = "/api/krListPenyebab/" + idKr + "?keyword=" + keyword;
		console.log(currentUser.idUnit);
		return HttpRequest.get(apiUrl).then(function (response) {
			return response.data;
		});
	}

	$scope.id.listLcm = function (keyword) {
		var apiUrl = "/api/KRListLCM/" + currentUser.idUnit + "?keyword=" + keyword;
		return HttpRequest.get(apiUrl).then(function (response) {
			console.log(JSON.stringify(response.data));
			return response.data;
		});
	}

	$scope.ae.renderData = function () {
		//KR Analisa dan Evaluasi - Render Data
		var apiUrl = "/api/KRAnalisaDanEvaluasi/" + idKr;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.ae.data = response;

				//KR Analisis dan Evaluasi - Master Efektivitas
				var efektivitas = [{
						id: 0,
						name: "0 : Tidak Ada"
					},
					{
						id: 1,
						name: "1 : Sangat Lemah"
					},
					{
						id: 2,
						name: "2 : Lemah"
					},
					{
						id: 3,
						name: "3 : Sedang"
					},
					{
						id: 4,
						name: "4 : Kuat"
					},
					{
						id: 5,
						name: "5 : Sangat Kuat"
					}
				];
				$scope.ae.master.efektivitas = efektivitas;

				$scope.ae.totalOpenedForEditing = 0;

				//KR Analisis dan Evaluasi - Master
				angular.forEach($scope.ae.data, function (item, i) {
					$scope.ae.master.peringkatDampakIR[i] = [];
					$scope.ae.master.tipePeringkatKemungkinanIR[i] = [];
					$scope.ae.master.peringkatKemungkinanIR[i] = [];
					$scope.ae.master.peringkatDampakCR[i] = [];
					$scope.ae.master.tipePeringkatKemungkinanCR[i] = [];
					$scope.ae.master.peringkatKemungkinanCR[i] = [];
					$scope.ae.master.efektivitasDLI[i] = [];

					$scope.ae.collapse1[i] = "collapse";
					$scope.ae.collapse2[i] = [];
					$scope.ae.isEditMode[i] = [];

					//Master Efektivitas - Approach
					var efektivitasA = [{
							id: 0,
							name: "0 : Tidak Ada"
						},
						{
							id: 1,
							name: "1 : Sangat Lemah"
						},
						{
							id: 2,
							name: "2 : Lemah"
						},
						{
							id: 3,
							name: "3 : Sedang"
						},
						{
							id: 4,
							name: "4 : Kuat"
						},
						{
							id: 5,
							name: "5 : Sangat Kuat"
						}
					];

					$scope.ae.master.efektivitasA = efektivitasA;

					angular.forEach($scope.ae.data[i].listPenyebab, function (item, j) {
						$scope.ae.renderMaster(i, j, true);
						$scope.ae.master.efektivitasDLI[i].push([]);
						$scope.ae.collapse2[i].push("collapse");
						$scope.ae.isEditMode[i].push(false);

						angular.forEach(item.existingControl, function (item, k) {
							$scope.ae.renderListEfektivitasDLI(i, j, k, true);
							$scope.ae.adliChange(i, j, k);
						});
					});
				});

				//Render Rencana Mitigasi
				$scope.rm.renderData();
			})
			.error(function (response, code) {
				var data = {
					title: "Analisa dan Evaluasi",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.renderDetaillPenyebab = function (indexAE, indexPenyebab) {
		//KR Analisa dan Evaluasi - Render Detail Penyebab
		var id = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].id;
		var apiUrl = "/api/krAEDetailPenyebab/" + id;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.ae.data[indexAE].listPenyebab[indexPenyebab] = response;

				$scope.ae.collapse1[indexAE] = "";
				$scope.ae.collapse2[indexAE][indexPenyebab] = "";

				//Master Efektivitas - Approach
				var efektivitasA = [{
						id: 0,
						name: "0 : Tidak Ada"
					},
					{
						id: 1,
						name: "1 : Sangat Lemah"
					},
					{
						id: 2,
						name: "2 : Lemah"
					},
					{
						id: 3,
						name: "3 : Sedang"
					},
					{
						id: 4,
						name: "4 : Kuat"
					},
					{
						id: 5,
						name: "5 : Sangat Kuat"
					}
				];

				$scope.ae.master.efektivitasA = efektivitasA;

				$scope.ae.renderMaster(indexAE, indexPenyebab, false);

				angular.forEach($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl, function (item, i) {
					$scope.ae.renderListEfektivitasDLI(indexAE, indexPenyebab, i, false);
					$scope.ae.adliChange(indexAE, indexPenyebab, i);
				});
			})
			.error(function (response, code) {
				var data = {
					title: "AE Detail Penyebab",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.renderMaster = function (indexAE, indexPenyebab, isAppended) {
		var penyebab = $scope.ae.data[indexAE].listPenyebab[indexPenyebab];

		$scope.ae.renderListPeringkatDampakIR(indexAE, indexPenyebab, isAppended);
		$scope.ae.renderListPeringkatDampakCR(indexAE, indexPenyebab, isAppended);

		//KR Analisis dan Evaluasi - Master Tipe Peringkat Kemungkinan
		apiUrl = "/api/krListTipePeringkatKemungkinan";
		HttpRequest.get(apiUrl).success(function (response) {
				if (isAppended) {
					$scope.ae.master.tipePeringkatKemungkinanIR[indexAE].push(response);
					$scope.ae.master.tipePeringkatKemungkinanCR[indexAE].push(response);
				} else {
					$scope.ae.master.tipePeringkatKemungkinanIR[indexAE][indexPenyebab] = response;
					$scope.ae.master.tipePeringkatKemungkinanCR[indexAE][indexPenyebab] = response;
				}
			})
			.error(function (response, code) {
				var data = {
					title: "AE List Tipe Peringkat Kemungkinan",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});

		$scope.ae.renderListPeringkatKemungkinanIR(indexAE, indexPenyebab, isAppended);
		$scope.ae.renderListPeringkatKemungkinanCR(indexAE, indexPenyebab, isAppended);
	}

	$scope.ae.renderListPeringkatDampakIR = function (indexAE, indexPenyebab, isAppended) {
		//Master Peringkat Kemungkinan
		var idAreaDampak = Constant.emptyGuid;
		var nilai = 0;
		try {
			idAreaDampak = Helper.ifNullOrEmpty($scope.ae.data[indexAE].areaDampak.id, Constant.emptyGuid);
			console.log("ID Area Dampak : " + idAreaDampak);
		} catch (err) {}

		var apiUrl = "/api/krListPeringkatDampak/" + idKr + "?idArea=" + idAreaDampak + "&efektifitas=" + nilai;
		console.log("List Peringkat Dampak Inherent : " + apiUrl);

		HttpRequest.get(apiUrl).success(function (response) {
				if (isAppended)
					$scope.ae.master.peringkatDampakIR[indexAE].push(response);
				else
					$scope.ae.master.peringkatDampakIR[indexAE][indexPenyebab] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "AE List Peringkat Dampak IR",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.renderListEfektivitasDLI = function (indexAE, indexPenyebab, indexExistingControl, isAppended) {
		//Master Efektivitas - DLI
		var efektivitasDLI = [];
		var approach = 0;

		try {
			approach = Helper.ifNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].approach, 0);
		} catch (err) {}

		var labelEfektivitas = ["0 : Tidak Ada", "1 : Sangat Lemah", "2 : Lemah", "3 : Sedang", "4 : Kuat", "5 : Sangat Kuat"];

		for (var i = 0; i <= approach; i++)
			efektivitasDLI.push({
				id: i,
				name: labelEfektivitas[i]
			});

		if (isAppended)
			$scope.ae.master.efektivitasDLI[indexAE][indexPenyebab].push(efektivitasDLI);
		else
			$scope.ae.master.efektivitasDLI[indexAE][indexPenyebab][indexExistingControl] = efektivitasDLI;
	}

	$scope.ae.renderListPeringkatKemungkinanIR = function (indexAE, indexPenyebab, isAppended) {
		//Master Peringkat Kemungkinan
		var nilaiDampak = 0;
		var idTipePeringkatKemungkinan = Constant.emptyGuid;
		var nilai = 0;

		try {
			nilaiDampak = Helper.ifNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakIR.nilai, 0);
		} catch (err) {}

		try {
			idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].tipePeringkatKemungkinanIR.id, Constant.emptyGuid);
		} catch (err) {}

		try {
			if ($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.length > 0)
				nilai = Helper.ifNullOrEmpty(Math.max.apply(Math, $scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.map(function (item) {
					return item.nilai;
				})), 0);
		} catch (err) {}

		apiUrl = "/api/krListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilai + "&dampak=" + nilaiDampak;
		HttpRequest.get(apiUrl).success(function (response) {
				if (isAppended)
					$scope.ae.master.peringkatKemungkinanIR[indexAE].push(response);
				else
					$scope.ae.master.peringkatKemungkinanIR[indexAE][indexPenyebab] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "AE List Peringkat Kemungkinan IR",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.renderListPeringkatDampakCR = function (indexAE, indexPenyebab, isAppended) {
		//Master Peringkat Kemungkinan
		var idAreaDampak = Constant.emptyGuid;
		var nilai = 0;
		try {
			idAreaDampak = Helper.ifNullOrEmpty($scope.ae.data[indexAE].areaDampak.id, Constant.emptyGuid);
		} catch (err) {}

		try {
			if ($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.length > 0)
				nilai = Helper.ifNullOrEmpty(Math.max.apply(Math, $scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.map(function (item) {
					return item.nilai;
				})), 0);
		} catch (err) {}

		var apiUrl = "/api/krListPeringkatDampak/" + idKr + "?idArea=" + idAreaDampak + "&efektifitas=" + nilai;

		HttpRequest.get(apiUrl).success(function (response) {
				if (isAppended)
					$scope.ae.master.peringkatDampakCR[indexAE].push(response);
				else
					$scope.ae.master.peringkatDampakCR[indexAE][indexPenyebab] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "AE List Peringkat Dampak CR",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.renderListPeringkatKemungkinanCR = function (indexAE, indexPenyebab, isAppended) {
		//Master Peringkat Kemungkinan
		var nilaiDampak = 0;
		var idTipePeringkatKemungkinan = Constant.emptyGuid;
		var nilai = 0;

		try {
			nilaiDampak = Helper.ifNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakCR.nilai, 0);
		} catch (err) {}

		try {
			idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].tipePeringkatKemungkinanCR.id, Constant.emptyGuid);
		} catch (err) {}

		try {
			if ($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl > 0)
				nilai = Helper.ifNullOrEmpty(Math.max.apply(Math, $scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.map(function (item) {
					return item.nilai;
				})), 0);
		} catch (err) {}

		apiUrl = "/api/krListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilai + "&dampak=" + nilaiDampak;
		HttpRequest.get(apiUrl).success(function (response) {
				if (isAppended)
					$scope.ae.master.peringkatKemungkinanCR[indexAE].push(response);
				else
					$scope.ae.master.peringkatKemungkinanCR[indexAE][indexPenyebab] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "AE List Peringkat Kemungkinan CR",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.listExistingControl = function (keyword) {
		var apiUrl = "/api/krListExistingControl/" + keyword;

		return HttpRequest.get(apiUrl).then(function (response) {
			return response.data;
		});
	}

	$scope.rm.renderData = function () {
		NProgress.start();
		//KR Rencana Mitigasi - Render Data
		var apiUrl = "/api/KRRencanaMitigasi/" + idKr;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.rm.data = response;
				$scope.rm.generatePanelClass();

				$scope.rm.totalOpenedForEditing = 0;

				//KR Rencana Mitigasi - Master
				angular.forEach($scope.rm.data, function (item, i) {
					$scope.rm.master.peringkatDampak[i] = [];
					$scope.rm.master.peringkatKemungkinan[i] = [];

					$scope.rm.ref.existingControlAE[i] = [];
					$scope.rm.ref.peringkatDampakCR[i] = [];
					$scope.rm.ref.tipePeringkatKemungkinanCR[i] = [];
					$scope.rm.ref.peringkatKemungkinanCR[i] = [];
					$scope.rm.ref.tingkatRisikoCR[i] = [];

					$scope.rm.collapse1[i] = "collapse";
					$scope.rm.collapse2[i] = [];
					$scope.rm.isEditMode[i] = [];

					angular.forEach($scope.rm.data[i].listPenyebab, function (item, j) {
						$scope.rm.master.peringkatDampak[i][j] = [];
						$scope.rm.master.peringkatKemungkinan[i][j] = [];

						$scope.rm.ref.existingControlAE[i][j] = [];
						$scope.rm.ref.peringkatDampakCR[i][j] = {};
						$scope.rm.ref.tipePeringkatKemungkinanCR[i][j] = {};
						$scope.rm.ref.peringkatKemungkinanCR[i][j] = {};
						$scope.rm.ref.tingkatRisikoCR[i][j] = {};

						//Set default Residual Risk
						var crAE = null;
						angular.forEach($scope.ae.data, function (itemAe, iAe) {
							var selectedItem = angular.copy(Helper.findItem(itemAe.listPenyebab, "id", item.id));

							if (selectedItem != null)
								crAE = angular.copy(selectedItem);
						});

						$scope.rm.ref.existingControlAE[i][j] = angular.copy(crAE.existingControl);
						$scope.rm.ref.peringkatDampakCR[i][j] = angular.copy(crAE.peringkatDampakCR);
						$scope.rm.ref.tipePeringkatKemungkinanCR[i][j] = angular.copy(crAE.tipePeringkatKemungkinanCR);
						$scope.rm.ref.peringkatKemungkinanCR[i][j] = angular.copy(crAE.peringkatKemungkinanCR);
						$scope.rm.ref.tingkatRisikoCR[i][j] = angular.copy(crAE.tingkatRisikoCR);
						//-------------------------

						//console.log("Penyebab Id" + item.id + " | AE - Penyebab Id : " + crAE.id, JSON.stringify($scope.rm.ref));

						$scope.rm.collapse2[i].push("collapse");
						$scope.rm.isEditMode[i].push(false);

						angular.forEach(item.rencanaMitigasi, function (item, k) {
							$scope.rm.renderMaster(i, j, k, true);
						});
					});
				});

				apiUrl = "/api/krStatusForm/" + idKr;

				HttpRequest.get(apiUrl).success(function (response) {
						NProgress.done();

						$scope.isFormComplete = response.status;
					})
					.error(function (response, code) {
						NProgress.done();

						var data = {
							title: "Status Form",
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
					title: "Rencana Mitigasi",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.rm.renderDetaillPenyebab = function (indexRM, indexPenyebab) {
		//KR Rencana Mitigasi - Render Detail Penyebab
		var id = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].id;
		var idRM = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].id;
		var apiUrl = "/api/krRMDetailPenyebab/" + id;
		console.log("id : " + id);
		console.log("idRM : " + idRM);

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.rm.data[indexRM].listPenyebab[indexPenyebab] = response;

				$scope.rm.collapse1[indexRM] = "";
				$scope.rm.collapse2[indexRM][indexPenyebab] = "";
				$scope.rm.generatePanelClass();

				angular.forEach($scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi, function (item, i) {
					$scope.rm.renderMaster(indexRM, indexPenyebab, i, false);
					//$scope.rm.adliChange(indexRM, indexPenyebab, i);
				});

				apiUrl = "/api/krStatusForm/" + idKr;

				HttpRequest.get(apiUrl).success(function (response) {
						$scope.isFormComplete = response.status;
					})
					.error(function (response, code) {
						var data = {
							title: "Status Form",
							exception: response,
							exceptionCode: code,
							operation: "GET",
							apiUrl: apiUrl
						};

						Helper.notifErrorHttp(data);
					});
			})
			.error(function (response, code) {
				var data = {
					title: "RM Detail Penyebab",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.rm.renderMaster = function (indexRM, indexPenyebab, indexRencanaMitigasi, isAppended) {
		var currency = [{
				id: "IDR",
				name: "IDR"
			},
			{
				id: "USD",
				name: "USD"
			}
		];
		$scope.rm.master.currency = currency;

		$scope.rm.renderListPeringkatDampak(indexRM, indexPenyebab, indexRencanaMitigasi, isAppended);
		$scope.rm.renderListPeringkatKemungkinan(indexRM, indexPenyebab, indexRencanaMitigasi, isAppended);
	}

	$scope.rm.renderListPeringkatDampak = function (indexRM, indexPenyebab, indexRencanaMitigasi, isAppended) {
		//Master Peringkat Dampak
		var idAreaDampak = Constant.emptyGuid;
		var nilai = 0;
		try {
			idAreaDampak = Helper.ifNullOrEmpty($scope.rm.data[indexRM].areaDampak.id, Constant.emptyGuid);
		} catch (err) {}

		try {
			var existingControlAE = angular.copy($scope.rm.ref.existingControlAE[indexRM][indexPenyebab]);

			if (existingControlAE > 0)
				nilai = Helper.ifNullOrEmpty(Math.max.apply(Math, existingControlAE.map(function (item) {
					return item.nilai;
				})), 0);
		} catch (err) {}

		var apiUrl = "/api/krListPeringkatDampak/" + idKr + "?idArea=" + idAreaDampak + "&efektifitas=" + nilai;

		/*
		var apiUrl = "/api/krListPeringkatDampakRM/" + $scope.rm.data[indexRM].listPenyebab[indexPenyebab].id;

		//console.log("renderListPeringkatDampak [iRM :" + indexRM + "][ iPenyebab : " + indexPenyebab + "]", apiUrl);
		*/

		HttpRequest.get(apiUrl).success(function (response) {
				if (isAppended)
					$scope.rm.master.peringkatDampak[indexRM][indexPenyebab].push(response);
				else
					$scope.rm.master.peringkatDampak[indexRM][indexPenyebab][indexRencanaMitigasi] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "RM List Peringkat Dampak",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.rm.renderListPeringkatKemungkinan = function (indexRM, indexPenyebab, indexRencanaMitigasi, isAppended) {
		//Master Peringkat Kemungkinan

		var nilaiDampak = 0;
		var idTipePeringkatKemungkinan = Constant.emptyGuid;
		var nilai = 0;

		try {
			nilaiDampak = Helper.ifNullOrEmpty($scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatDampakRR.nilai, 0);
		} catch (err) {}

		try {
			idTipePeringkatKemungkinan = Helper.ifNullOrEmpty($scope.rm.data[indexRM].listPenyebab[indexPenyebab].tipePeringkatKemungkinan.id, Constant.emptyGuid);
		} catch (err) {}

		var apiUrl = "/api/krListPeringkatKemungkinan/" + idTipePeringkatKemungkinan + "?efektifitas=" + nilai + "&dampak=" + nilaiDampak;

		/*
		var nilai = 0;

		try{
		    nilaiDampak = Helper.ifNullOrEmpty($scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatDampakRR.nilai, 0);
		}
		catch(err){
		}
		
		var apiUrl = "/api/krListPeringkatKemungkinanRM/" + $scope.rm.data[indexRM].listPenyebab[indexPenyebab].id + "?dampak=" + nilaiDampak;

		//console.log("renderListPeringkatKemungkinan [iRM :" + indexRM + "][ iPenyebab : " + indexPenyebab + "]", apiUrl);
		*/

		HttpRequest.get(apiUrl).success(function (response) {
				if (isAppended)
					$scope.rm.master.peringkatKemungkinan[indexRM][indexPenyebab].push(response);
				else
					$scope.rm.master.peringkatKemungkinan[indexRM][indexPenyebab][indexRencanaMitigasi] = response;
			})
			.error(function (response, code) {
				var data = {
					title: "RM List Peringkat Kemungkinan",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.rm.listPeringkatDampak = function (indexRM, indexPenyebab) {
		var idAreaDampak = Helper.iif($scope.rm.data[indexRM].listPenyebab[indexPenyebab].areaDampak == undefined) ? Constant.emptyGuid : $scope.rm.data[indexRM].listPenyebab[indexPenyebab].areaDampak.id;
		var apiUrl = "/api/krListPeringkatDampak/" + idKr + "?idArea=" + idAreaDampak + "&efektifitas=0";

		HttpRequest.get(apiUrl).success(function (response) {
			return response;
		});
	}

	$scope.rm.listPIC = function (keyword) {
		var apiUrl = "/api/KRListPIC/" + keyword + "?email=" + currentUser.email;

		return HttpRequest.get(apiUrl).then(function (response) {
			return response.data.map(function (item) {
				var pic = {
					id: item.id,
					employeeNumber: item.employeeNumber,
					name: item.name,
					jabatan: item.jabatan,
					email: item.email,
					payrollName: item.payrollName,
					displayCol: item.displayCol
				};
				return pic;
			});
		});
	}

	//Event Handlers ===================================================================================================================
	$scope.tabClick = function (tabIndex) {
		/*
		if (tabIndex == 0)
		    $scope.pk.renderData();

		if (tabIndex == 1)
		    $scope.id.renderData();

		if (tabIndex == 2)
		    $scope.ae.renderData();

		if (tabIndex == 3)
		    $scope.rm.renderData();
		*/
		$scope.editingTab = "";

		if ($scope.pk.isEditMode && tabIndex != 0)
			$scope.editingTab += ", Penetapan Konteks";

		if ($scope.id.totalOpenedForEditing > 0 && tabIndex != 1)
			$scope.editingTab += ", Identifikasi";

		if ($scope.ae.totalOpenedForEditing > 0 && tabIndex != 2)
			$scope.editingTab += ", Analisa & Evaluasi";

		if ($scope.rm.totalOpenedForEditing > 0 && tabIndex != 3)
			$scope.editingTab += ", Rencana Mitigasi";

		if ($scope.editingTab != "")
			$scope.editingTab = $scope.editingTab.substr(2);
	}

	$scope.krHeader.editClick = function () {
		$scope.krHeader.isEditMode = true;
	}

	$scope.krHeader.judulChange = function () {
		var apiUrl = "/api/KRHeader";

		HttpRequest.post(apiUrl, $scope.krHeader.data).success(function (response) {
			$scope.renderKrHeader();

			$scope.krHeader.isEditMode = false;
		});
	}

	$scope.pk.riskOwnerChange = function () {
		if (!Helper.isNullOrEmptyOrEmptyGuid($scope.pk.data.riskOwner.id) && $scope.pk.data.detailSasaran.length == 0)
			$scope.pk.tambahSasaranClick();

		//console.log(Helper.isNullOrEmptyOrEmptyGuid($scope.pk.data.riskOwner.id));
		//console.log($scope.pk.data.detailSasaran.length == 0);
	}

	$scope.pk.tambahSasaranClick = function () {
		apiUrl = "/api/KRListSasaranStrategis/" + idKr;
		HttpRequest.get(apiUrl).success(function (response) {
				$scope.pk.master.sasaranStrategis.push(response);

				var sasaranStrategis = new Model.kr.pk.sasaranStrategis();
				sasaranStrategis.id = Constant.emptyGuid;
				sasaranStrategis.tahun = $scope.pk.header.tahun;

				var detailSasaran = new Model.kr.pk.detailSasaran();
				detailSasaran.id = Constant.emptyGuid;
				detailSasaran.idKR = idKr;
				detailSasaran.sasaranStrategis = sasaranStrategis;
				detailSasaran.username = currentUser.email;

				$scope.pk.data.detailSasaran.push(detailSasaran);
			})
			.error(function (response, code) {
				var data = {
					title: "List Sasaran Strategis",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.pk.hapusSasaranClick = function (indexDetailSasaran) {
		var hapus = confirm("Hapus sasaran ?");
		if (hapus) {
			$scope.pk.data.detailSasaran.splice(indexDetailSasaran, 1);
			$scope.pk.master.sasaranKPIKM.splice(indexDetailSasaran, 1);
		};
	}

	$scope.pk.sasaranStrategisChange = function (index, idSasaranStrategis) {
		$scope.pk.data.detailSasaran[index].sasaranKPIKM = [];
		$scope.pk.master.sasaranKPIKM[index] = []

		$scope.pk.sasaranKPIKMAdd(index);
	}

	$scope.pk.sasaranKPIKMChange = function (indexDetailSasaran, indexSasaranKPIKM) {
		var idKPIKM = $scope.pk.data.detailSasaran[indexDetailSasaran].sasaranKPIKM[indexSasaranKPIKM].kpikmId;
		var masterKPIKM = $scope.pk.master.sasaranKPIKM[indexDetailSasaran][indexSasaranKPIKM];
		var selectedKPIKM = Helper.findItem(masterKPIKM, "kpikmId", idKPIKM);

		$scope.pk.data.detailSasaran[indexDetailSasaran].sasaranKPIKM[indexSasaranKPIKM].name = selectedKPIKM.name;
		$scope.pk.data.detailSasaran[indexDetailSasaran].sasaranKPIKM[indexSasaranKPIKM].keterangan = selectedKPIKM.keterangan;
		$scope.pk.data.detailSasaran[indexDetailSasaran].sasaranKPIKM[indexSasaranKPIKM].sasaranType = "";
	}

	$scope.pk.sasaranKPIKMAdd = function (indexDetailSasaran) {
		var sasaranKPIKM = new Model.kr.pk.sasaranKPIKM();
		sasaranKPIKM.id = Constant.emptyGuid;
		sasaranKPIKM.kpikmId = Constant.emptyGuid;
		sasaranKPIKM.soId = $scope.pk.data.detailSasaran[indexDetailSasaran].sasaranStrategis.id;

		apiUrl = "/api/KRListKPIKM?idKR=" + idKr + "&idSO=" + $scope.pk.data.detailSasaran[indexDetailSasaran].sasaranStrategis.id;
		HttpRequest.get(apiUrl).success(function (response) {
				$scope.pk.master.sasaranKPIKM[indexDetailSasaran].push(response);
				$scope.pk.data.detailSasaran[indexDetailSasaran].sasaranKPIKM.push(sasaranKPIKM);
			})
			.error(function (response, code) {
				var data = {
					title: "List KPI/KM",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.pk.sasaranKPIKMDelete = function (indexDetailSasaran, indexSasaranKPIKM) {
		var hapus = confirm("Hapus data ?");
		if (hapus) {
			$scope.pk.data.detailSasaran[indexDetailSasaran].sasaranKPIKM.splice(indexSasaranKPIKM, 1);
			$scope.pk.master.sasaranKPIKM[indexDetailSasaran].splice(indexSasaranKPIKM, 1);
		};
	}

	$scope.pk.editClick = function (form) {
		$scope.pk.isEditMode = true;

		//$validationProvider.reset(form);
	}

	$scope.pk.saveChangesClick = function () {
		NProgress.start();
		//Save KR Penetapan Konteks - Header
		var apiUrl = "/api/KRPenetapanKonteks";

		HttpRequest.post(apiUrl, $scope.pk.data).success(function (response) {
				//console.log("( " + apiUrl + " )", JSON.stringify($scope.pk.data));

				$scope.pk.renderData();
				$scope.pk.isEditMode = false;

				$scope.id.renderData();
				$scope.ae.renderData();
				//$scope.rm.renderData();

				NProgress.done();
			})
			.error(function (response, code) {
				var data = {
					title: "Penetapan Konteks",
					exception: response,
					exceptionCode: code,
					operation: "POST",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.pk.discardChangesClick = function () {
		$scope.pk.renderData();
		$scope.pk.isEditMode = false;
	}

	$scope.id.penyebabAdd = function (indexIdentifikasi, indexDetailKatRisk) {
		var penyebab = new Model.kr.id.penyebab();
		//penyebab.idPustakaPenyebab = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].penyebab.idPustakaPenyebab;

		penyebab.idPustakarisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko.id;

		$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].penyebab.push(penyebab);
		$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].lcm.push(penyebab);
	}

	$scope.id.kategoriRisikoChange = function (indexIdentifikasi, indexDetailKatRisk) {
		//KR Identifikasi - Master Sub Kategori Risiko
		var idKatRisk = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kategoriRisiko == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kategoriRisiko.id;
		apiUrl = "/api/krListSubKategoriRisiko/" + idKr + "?idKat=" + idKatRisk;

		HttpRequest.get(apiUrl).success(function (response) {
				//Update KR Identifikasi - Kategori Risiko
				var masterKatRisk = $scope.id.master.kategoriRisiko[indexIdentifikasi][indexDetailKatRisk];
				var selectedKatRisk = Helper.findItem(masterKatRisk, "id", idKatRisk);

				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kategoriRisiko.name = selectedKatRisk.name;

				//Update KR Identifikasi - Sub Kategori
				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].subKategori = {
					id: Constant.emptyGuid,
					idKategoriRisiko: "",
					name: ""
				};
				$scope.id.master.subKategoriRisiko[indexIdentifikasi][indexDetailKatRisk] = response;

				$scope.id.subKategoriRisikoChange(indexIdentifikasi, indexDetailKatRisk);
			})
			.error(function (response, code) {
				var data = {
					title: "List Sub Kategori Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.subKategoriRisikoChange = function (indexIdentifikasi, indexDetailKatRisk) {
		//KR Identifikasi - Master Sub Kategori Risiko
		var idSubKatRisk = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].subKategori == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].subKategori.id;
		apiUrl = "/api/krListRisiko/" + idKr + "?idSubkat=" + idSubKatRisk;

		HttpRequest.get(apiUrl).success(function (response) {
				//Update KR Identifikasi - Sub Kategori Risiko
				var masterSubKatRisk = $scope.id.master.subKategoriRisiko[indexIdentifikasi][indexDetailKatRisk];
				var selectedSubKatRisk = Helper.findItem(masterSubKatRisk, "id", idSubKatRisk);

				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].subKategori.idKategoriRisiko = Helper.isNullOrEmpty(selectedSubKatRisk) ? "" : selectedSubKatRisk.idKategoriRisiko;
				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].subKategori.name = Helper.isNullOrEmpty(selectedSubKatRisk) ? "" : selectedSubKatRisk.name;

				//Update KR Identifikasi - Risiko
				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko = {
					id: Constant.emptyGuid,
					idPustakarisiko: "",
					name: ""
				};
				$scope.id.master.risiko[indexIdentifikasi][indexDetailKatRisk] = response;

				$scope.id.risikoChange(indexIdentifikasi, indexDetailKatRisk);
			})
			.error(function (response, code) {
				var data = {
					title: "List Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.risikoChange = function (indexIdentifikasi, indexDetailKatRisk) {
		//KR Identifikasi - Master Risiko
		var idRisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko.id;
		console.log("idrisk:" + idRisiko);
		apiUrl = "/api/krListKejadianRisiko/" + idKr + "?idRisk=" + idRisiko;

		HttpRequest.get(apiUrl).success(function (response) {
				//Update KR Identifikasi - Risiko
				var masterRisiko = $scope.id.master.risiko[indexIdentifikasi][indexDetailKatRisk];
				var selectedRisiko = Helper.findItem(masterRisiko, "id", idRisiko);

				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko.idPustakarisiko = Helper.isNullOrEmpty(selectedRisiko) ? "" : selectedRisiko.idPustakarisiko;
				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].risiko.name = Helper.isNullOrEmpty(selectedRisiko) ? "" : selectedRisiko.name;

				//Update KR Identifikasi - Kejadian
				var kejadian = new Model.kr.id.kejadian();
				kejadian.id = Constant.emptyGuid;
				areaDampak.id = Constant.emptyGuid;

				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kejadian = kejadian;
				$scope.id.master.kejadian[indexIdentifikasi][indexDetailKatRisk] = response;

				$scope.id.kejadianChange(indexIdentifikasi, indexDetailKatRisk);

				// Get List Area Dmapak
				var apiAreaDampak = "/api/krListAreaDampak/" + idKr;
				HttpRequest.get(apiAreaDampak).success(function (responseAreaDampak) {
					$scope.id.master.areaDampak[indexIdentifikasi][indexDetailKatRisk] = responseAreaDampak
					console.log("List Area Dampak:" + JSON.stringify(responseAreaDampak));

				})
			})
			.error(function (response, code) {
				var data = {
					title: "List Kejadian Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}


	$scope.id.kejadianChange = function (indexIdentifikasi, indexDetailKatRisk) {
		//Update KR Identifikasi - Kejadian
		var idKejadian = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kejadian == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kejadian.id;
		var masterKejadian = $scope.id.master.kejadian[indexIdentifikasi][indexDetailKatRisk];
		var selectedKejadian = Helper.findItem(masterKejadian, "id", idKejadian);

		$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kejadian.idRisk = Helper.isNullOrEmpty(selectedKejadian) ? "" : selectedKejadian.idRisk;
		$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kejadian.name = Helper.isNullOrEmpty(selectedKejadian) ? "" : selectedKejadian.name;
		// $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].kejadian.areaDampak = Helper.isNullOrEmpty(selectedKejadian) ? {
		// 	id: "",
		// 	name: ""
		// } : selectedKejadian.areaDampak;
	}

	$scope.id.tipeSumberRisikoChange = function (indexIdentifikasi, indexDetailKatRisk) {
		//KR Identifikasi - Master Tipe Sumber Risiko
		var idTipeSumberRisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].tipeSumberRisiko == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].tipeSumberRisiko.id;
		apiUrl = "/api/krListSumberRisiko/" + idTipeSumberRisiko;

		HttpRequest.get(apiUrl).success(function (response) {
				//Update KR Identifikasi - Tipe Sumber Risiko
				var masterTipeSumberRisiko = $scope.id.master.tipeSumberRisiko[indexIdentifikasi][indexDetailKatRisk];
				var selectedTipeSumberRisiko = Helper.findItem(masterTipeSumberRisiko, "id", idTipeSumberRisiko);

				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].tipeSumberRisiko.name = Helper.isNullOrEmpty(selectedTipeSumberRisiko) ? "" : selectedTipeSumberRisiko.name;

				//Update KR Identifikasi - Sumber Risiko
				$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].sumberRisiko = {
					id: Constant.emptyGuid,
					idPustakarisiko: "",
					name: ""
				};

				$scope.id.master.sumberRisiko[indexIdentifikasi][indexDetailKatRisk] = response;

				$scope.id.sumberRisikoChange(indexIdentifikasi, indexDetailKatRisk);
			})
			.error(function (response, code) {
				var data = {
					title: "List Sumber Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.sumberRisikoChange = function (indexIdentifikasi, indexDetailKatRisk) {
		//Update KR Identifikasi - Sumber Risiko
		var idSumberRisiko = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].sumberRisiko == undefined ? Constant.emptyGuid : $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].sumberRisiko.id;
		var masterSumberRisiko = $scope.id.master.sumberRisiko[indexIdentifikasi][indexDetailKatRisk];
		var selectedSumberRisiko = Helper.findItem(masterSumberRisiko, "id", idSumberRisiko);

		$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].sumberRisiko.idPustakarisiko = Helper.isNullOrEmpty(selectedSumberRisiko) ? "" : selectedSumberRisiko.idPustakarisiko;
		$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].sumberRisiko.name = Helper.isNullOrEmpty(selectedSumberRisiko) ? "" : selectedSumberRisiko.name;

		var totalPenyebab = 0;
		try {
			totalPenyebab = $scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].penyebab.length;
		} catch (e) {}

		if (totalPenyebab == 0)
			$scope.id.penyebabAdd(indexIdentifikasi, indexDetailKatRisk);
	}

	$scope.id.penyebabDelete = function (indexIdentifikasi, indexDetailKatRisk, indexPenyebab) {
		var hapus = confirm("Hapus data ?");
		if (hapus)
			$scope.id.data[indexIdentifikasi].detailRisiko[indexDetailKatRisk].penyebab.splice(indexPenyebab, 1);
	}

	$scope.id.detailKategoriRisikoDelete = function (indexIdentifikasi, indexDetailKatRisk) {
		var hapus = confirm("Hapus data ?");
		if (hapus) {
			$scope.id.master.kategoriRisiko[indexIdentifikasi].splice(indexDetailKatRisk, 1);
			$scope.id.master.subKategoriRisiko[indexIdentifikasi].splice(indexDetailKatRisk, 1)
			$scope.id.master.risiko[indexIdentifikasi].splice(indexDetailKatRisk, 1)
			$scope.id.master.areaDampak[indexIdentifikasi].splice(indexDetailKatRisk, 1)
			$scope.id.master.kejadian[indexIdentifikasi].splice(indexDetailKatRisk, 1)
			$scope.id.master.tipeSumberRisiko[indexIdentifikasi].splice(indexDetailKatRisk, 1)
			$scope.id.master.sumberRisiko[indexIdentifikasi].splice(indexDetailKatRisk, 1)

			$scope.id.data[indexIdentifikasi].detailRisiko.splice(indexDetailKatRisk, 1);
		}
	}

	$scope.id.kategoriRisikoAdd = function (indexIdentifikasi) {
		//KR Identifikasi - Master Kategori Risiko
		apiUrl = "/api/krListKategoriRisiko/" + idKr;
		HttpRequest.get(apiUrl).success(function (response) {
				$scope.id.master.kategoriRisiko[indexIdentifikasi].push(response);

				//KR Identifikasi - Master Tipe Sumber Risiko
				apiUrl = "/api/krListTipeSumberRisiko";

				HttpRequest.get(apiUrl).success(function (response) {
						$scope.id.master.tipeSumberRisiko[indexIdentifikasi].push(response);
					})
					.error(function (response, code) {
						var data = {
							title: "List Tipe Sumber Risiko",
							exception: response,
							exceptionCode: code,
							operation: "GET",
							apiUrl: apiUrl
						};

						Helper.notifErrorHttp(data);
					});

				if (Helper.isNullOrEmpty($scope.id.data[indexIdentifikasi].detailRisiko))
					$scope.id.data[indexIdentifikasi].detailRisiko = [];

				var detailRisiko = new Model.kr.id.detailRisiko();
				detailRisiko.idKR = idKr;
				detailRisiko.idSasaranKPIKM = $scope.id.data[indexIdentifikasi].idSasaranKPIKM;

				$scope.id.data[indexIdentifikasi].detailRisiko.push(detailRisiko);
			})
			.error(function (response, code) {
				var data = {
					title: "List Kategori Risiko",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.id.editClick = function (indexIdentifikasi, form) {
		$scope.id.isEditMode[indexIdentifikasi] = true;
		$scope.id.totalOpenedForEditing = $scope.id.totalOpenedForEditing + 1;

		var totalDetailRisko = 0;
		try {
			totalDetailRisko = $scope.id.data[indexIdentifikasi].detailRisiko.length;
		} catch (e) {}

		if (totalDetailRisko == 0)
			$scope.id.kategoriRisikoAdd(indexIdentifikasi);

		//$validationProvider.reset(form);
	}

	$scope.id.saveChangesClick = function (indexIdentifikasi, form) {
		var isValidForm = $validationProvider.checkValid(form);

		if (isValidForm) {
			NProgress.start();
			console.log(JSON.stringify($scope.id.data[indexIdentifikasi]));
			var apiUrl = "/api/KRIdentifikasiRisiko";
			var data = $scope.id.data[indexIdentifikasi];

			HttpRequest.post(apiUrl, data).success(function (response) {
					$scope.id.renderDetailIdentifikasi(indexIdentifikasi);
					$scope.id.isEditMode[indexIdentifikasi] = false;
					$scope.id.totalOpenedForEditing = $scope.id.totalOpenedForEditing - 1;

					$scope.ae.renderData();
					$scope.rm.renderData();

					NProgress.done();
				})
				.error(function (response, code) {
					NProgress.done();

					var data = {
						title: "Detail Identifikasi",
						exception: response,
						exceptionCode: code,
						operation: "POST",
						apiUrl: apiUrl
					};

					Helper.notifErrorHttp(data);
				});
		} else {
			alert("Form belum valid atau belum terisi lengkap.");

			$validationProvider.validate(form);
		}
	}

	$scope.id.discardChangesClick = function (indexIdentifikasi) {
		$scope.id.renderDetailIdentifikasi(indexIdentifikasi);
		$scope.id.isEditMode[indexIdentifikasi] = false;
		$scope.id.totalOpenedForEditing = $scope.id.totalOpenedForEditing - 1;
	}

	$scope.id.saveAllChangesClick = function () {

		var iMaxEdit = 0;
		var isValidForm = true;

		angular.forEach($scope.id.data, function (item, i) {
			if ($scope.id.isEditMode[i]) {
				iMaxEdit = i;

				if (!$validationProvider.checkValid($scope.formID[i])) {
					isValidForm = false;
					$validationProvider.validate($scope.formID[i]);
				}
			}
		});

		if (isValidForm) {
			NProgress.start();

			angular.forEach($scope.id.data, function (item, i) {
				if ($scope.id.isEditMode[i]) {
					var apiUrl = "/api/KRIdentifikasiRisiko";
					var data = $scope.id.data[i];

					HttpRequest.post(apiUrl, data).success(function (response) {
							$scope.id.renderDetailIdentifikasi(i);
							$scope.id.isEditMode[i] = false;
							$scope.id.totalOpenedForEditing = $scope.id.totalOpenedForEditing - 1;

							if (i == iMaxEdit) {
								$scope.ae.renderData();
								//$scope.rm.renderData();
								NProgress.done();
							}
						})
						.error(function (response, code) {
							NProgress.done();

							var data = {
								title: "Identifikasi",
								exception: response,
								exceptionCode: code,
								operation: "POST",
								apiUrl: apiUrl
							};

							Helper.notifErrorHttp(data);
						});
				}
			});
		} else {
			alert("Form belum valid atau belum terisi lengkap.");
		}
	}

	$scope.id.discardAllChangesClick = function () {
		NProgress.start();

		var iMaxEdit = 0;
		angular.forEach($scope.id.data, function (item, i) {
			if ($scope.id.isEditMode[i])
				iMaxEdit = i;
		});

		angular.forEach($scope.id.data, function (item, i) {
			if ($scope.id.isEditMode[i]) {
				$scope.id.renderDetailIdentifikasi(i);
				$scope.id.isEditMode[i] = false;
				$scope.id.totalOpenedForEditing = $scope.id.totalOpenedForEditing - 1;

				if (i == iMaxEdit)
					NProgress.done();
			}
		});

	}

	$scope.ae.peringkatDampakIRChange = function (indexAE, indexPenyebab) {
		var idPeringkatDampakIR = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakIR.id;
		var masterPeringkatDampakIR = $scope.ae.master.peringkatDampakIR[indexAE][indexPenyebab];
		var selectedPeringkatDampakIR = Helper.findItem(masterPeringkatDampakIR, "id", idPeringkatDampakIR);

		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakIR.name = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.name;
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakIR.keterangan = Helper.isNullOrEmpty(selectedPeringkatDampakIR) ? "" : selectedPeringkatDampakIR.keterangan;

		$scope.ae.hitungTingkatRisikoIR(indexAE, indexPenyebab);
	}

	$scope.ae.tipePeringkatKemungkinanIRChange = function (indexAE, indexPenyebab) {
		var id = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].tipePeringkatKemungkinanIR.id;

		//KR Analisa dan Evaluasi - Master Peringkat Kemungkinan
		$scope.ae.renderListPeringkatKemungkinanIR(indexAE, indexPenyebab, false);

		//KR Analisa dan Evaluasi - Tipe Peringkat Kemungkinan
		var master = $scope.ae.master.tipePeringkatKemungkinanIR[indexAE][indexPenyebab];
		var selectedItem = Helper.findItem(master, "id", id);

		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].tipePeringkatKemungkinanIR.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name;

		//KR Analisa dan Evaluasi - Peringkat Kemungkinan
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanIR = {
			id: Constant.emptyGuid,
			name: "",
			keterangan: ""
		};

		$scope.ae.peringkatKemungkinanIRChange(indexAE, indexPenyebab);

		//KR Analisa dan Evaluasi - Hitung Tingkat Risiko
		//$scope.ae.hitungTingkatRisikoIR(indexAE, indexPenyebab);
	}

	$scope.ae.peringkatKemungkinanIRChange = function (indexAE, indexPenyebab) {
		var id = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanIR.id;
		var master = $scope.ae.master.peringkatKemungkinanIR[indexAE][indexPenyebab];
		var selectedItem = Helper.findItem(master, "id", id);

		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanIR.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name;
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanIR.keterangan = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.keterangan;
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanIR.nilai = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.nilai;

		$scope.ae.hitungTingkatRisikoIR(indexAE, indexPenyebab);
	}

	$scope.ae.hitungTingkatRisikoIR = function (indexAE, indexPenyebab) {
		var idPerDampak = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakIR.id;
		var idPerKemungkinan = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanIR.id;
		var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.ae.data[indexAE].listPenyebab[indexPenyebab].tingkatRisikoIR = response;
				$scope.ae.setDefaultExistingControl(indexAE, indexPenyebab);
				$scope.ae.toggleExistingControlAndCR(indexAE, indexPenyebab);
			})
			.error(function (response, code) {
				var data = {
					title: "AE Hitung Tingkat Risiko IR",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.toggleExistingControlAndCR = function (indexAE, indexPenyebab) {
		var trIR = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].tingkatRisikoIR.name;

		if (trIR == "Rendah" || trIR == "Moderat") {
			var peringkatDampakCR = new Model.kr.ae.peringkatDampak();
			var peringkatKemungkinanCR = new Model.kr.ae.peringkatKemungkinan();
			var tingkatRisikoCR = new Model.kr.ae.tingkatRisiko();

			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl = [];
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakCR = peringkatDampakCR;
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].tipePeringkatKemungkinanCR = {
				id: Constant.emptyGuid,
				name: ""
			};
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanCR = peringkatKemungkinanCR;
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].tingkatRisikoCR = tingkatRisikoCR;

			if (!Helper.isNullOrEmpty($scope.ae.master.efektivitasDLI))
				$scope.ae.master.efektivitasDLI[indexAE][indexPenyebab] = [];

			if (!Helper.isNullOrEmpty($scope.ae.master.peringkatDampakCR))
				$scope.ae.master.peringkatDampakCR[indexAE][indexPenyebab] = [];

			if (!Helper.isNullOrEmpty($scope.ae.master.tipePeringkatKemungkinanCR))
				$scope.ae.master.tipePeringkatKemungkinanCR[indexAE][indexPenyebab] = [];

			if (!Helper.isNullOrEmpty($scope.ae.master.peringkatKemungkinanCR))
				$scope.ae.master.peringkatKemungkinanCR[indexAE][indexPenyebab] = [];

			if (!Helper.isNullOrEmpty($scope.ae.master.tingkatRisikoCR))
				$scope.ae.master.tingkatRisikoCR[indexAE][indexPenyebab] = [];
		} else {
			$scope.ae.renderMaster(indexAE, indexPenyebab, false);
		};
	}

	$scope.ae.peringkatDampakCRChange = function (indexAE, indexPenyebab) {
		var idPeringkatDampakCR = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakCR.id;
		var masterPeringkatDampakCR = $scope.ae.master.peringkatDampakCR[indexAE][indexPenyebab];
		var selectedPeringkatDampakCR = Helper.findItem(masterPeringkatDampakCR, "id", idPeringkatDampakCR);

		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakCR.name = Helper.isNullOrEmpty(selectedPeringkatDampakCR) ? "" : selectedPeringkatDampakCR.name;
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakCR.keterangan = Helper.isNullOrEmpty(selectedPeringkatDampakCR) ? "" : selectedPeringkatDampakCR.keterangan;

		$scope.ae.hitungTingkatRisikoCR(indexAE, indexPenyebab);
	}

	$scope.ae.tipePeringkatKemungkinanCRChange = function (indexAE, indexPenyebab) {
		var id = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].tipePeringkatKemungkinanCR.id;

		//KR Analisa dan Evaluasi - Master Peringkat Kemungkinan
		$scope.ae.renderListPeringkatKemungkinanCR(indexAE, indexPenyebab, false);

		//KR Analisa dan Evaluasi - Tipe Peringkat Kemungkinan
		var master = $scope.ae.master.tipePeringkatKemungkinanCR[indexAE][indexPenyebab];
		var selectedItem = Helper.findItem(master, "id", id);

		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].tipePeringkatKemungkinanCR.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name;

		//KR Analisa dan Evaluasi - Peringkat Kemungkinan
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanCR = {
			id: Constant.emptyGuid,
			name: "",
			keterangan: ""
		};

		$scope.ae.peringkatKemungkinanCRChange(indexAE, indexPenyebab);

		//KR Analisa dan Evaluasi - Hitung Tingkat Risiko
		$scope.ae.hitungTingkatRisikoCR(indexAE, indexPenyebab);
	}

	$scope.ae.peringkatKemungkinanCRChange = function (indexAE, indexPenyebab) {
		var id = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanCR.id;
		var master = $scope.ae.master.peringkatKemungkinanCR[indexAE][indexPenyebab];
		var selectedItem = Helper.findItem(master, "id", id);

		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanCR.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name;
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanCR.keterangan = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.keterangan;
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanCR.nilai = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.nilai;

		$scope.ae.hitungTingkatRisikoCR(indexAE, indexPenyebab);
	}

	$scope.ae.hitungTingkatRisikoCR = function (indexAE, indexPenyebab) {
		var idPerDampak = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatDampakCR.id;
		var idPerKemungkinan = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].peringkatKemungkinanCR.id;
		var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

		HttpRequest.get(apiUrl).success(function (response) {
				$scope.ae.data[indexAE].listPenyebab[indexPenyebab].tingkatRisikoCR = response;
			})
			.error(function (response, code) {
				var data = {
					title: "AE Hitung Tingkat Risiko CR",
					exception: response,
					exceptionCode: code,
					operation: "GET",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	$scope.ae.existingControlAdd = function (indexAE, indexPenyebab) {
		if (Helper.isNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl))
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl = [];

		var existingControl = new Model.kr.ae.existingControl();
		$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.push(existingControl);

		$scope.ae.adliChange(indexAE, indexPenyebab, $scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.length - 1);
	}

	$scope.ae.existingControlDelete = function (indexAE, indexPenyebab, indexExistingControl) {
		var hapus = confirm("Hapus data ?");
		if (hapus) {
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.splice(indexExistingControl, 1);
			$scope.ae.master.efektivitasDLI[indexAE][indexPenyebab].splice(indexExistingControl, 1);
		}
	}

	$scope.ae.setDefaultExistingControl = function (indexAE, indexPenyebab) {
		var currentPenyebab = $scope.ae.data[indexAE].listPenyebab[indexPenyebab];

		if (Helper.isNullOrEmpty(currentPenyebab.existingControl))
			currentPenyebab.existingControl = [];

		if (currentPenyebab.existingControl.length == 0 &&
			!(currentPenyebab.tingkatRisikoIR.name.toLowerCase().includes('rendah') ||
				currentPenyebab.tingkatRisikoIR.name.toLowerCase().includes('moderat'))
		) {
			var existingControl = new Model.kr.ae.existingControl();
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl.push(existingControl);

			$scope.ae.adliChange(indexAE, indexPenyebab, currentPenyebab.existingControl.length - 1);
		}
	}

	$scope.ae.editClick = function (indexAE, indexPenyebab, form) {
		$scope.ae.isEditMode[indexAE][indexPenyebab] = true;
		$scope.ae.totalOpenedForEditing = $scope.ae.totalOpenedForEditing + 1;

		$scope.ae.setDefaultExistingControl(indexAE, indexPenyebab);

		//$validationProvider.reset(form);
	}

	$scope.ae.saveChangesClick = function (indexAE, indexPenyebab, form) {
		var isValidForm = true;
		var needExistingControl = true;

		try {
			var tingkatRisiko = $scope.ae.data[indexAE].listPenyebab[indexPenyebab].tingkatRisikoIR;

			needExistingControl = !(tingkatRisiko.name.toLowerCase().includes('rendah') || tingkatRisiko.name.toLowerCase().includes('moderat'));
		} catch (e) {

		}

		if (!$validationProvider.checkValid(form)) {
			if (needExistingControl) {
				isValidForm = false;
			}
		}

		if (isValidForm) {
			NProgress.start();

			var apiUrl = "/api/krAEDetailPenyebab";
			var data = $scope.ae.data[indexAE].listPenyebab[indexPenyebab];

			HttpRequest.post(apiUrl, data).success(function (response) {
					$scope.ae.renderDetaillPenyebab(indexAE, indexPenyebab);
					$scope.ae.isEditMode[indexAE][indexPenyebab] = false;
					$scope.ae.totalOpenedForEditing = $scope.ae.totalOpenedForEditing - 1;

					$scope.rm.renderData();

					NProgress.done();
				})
				.error(function (response, code) {
					NProgress.done();

					var data = {
						title: "AE Detail Detail Penyebab",
						exception: response,
						exceptionCode: code,
						operation: "POST",
						apiUrl: apiUrl
					};

					Helper.notifErrorHttp(data);
				});
		} else {
			alert("Form belum valid atau belum terisi lengkap.");

			$validationProvider.validate(form);
		}
	}

	$scope.ae.discardChangesClick = function (indexAE, indexPenyebab) {
		$scope.ae.renderDetaillPenyebab(indexAE, indexPenyebab);
		$scope.ae.isEditMode[indexAE][indexPenyebab] = false;
		$scope.ae.totalOpenedForEditing = $scope.ae.totalOpenedForEditing - 1;
	}

	$scope.ae.saveAllChangesClick = function () {
		var iMaxEdit = 0;
		var jMaxEdit = 0;
		var isValidForm = true;
		var data = [];

		angular.forEach($scope.ae.data, function (item, i) {
			angular.forEach(item.listPenyebab, function (subItem, j) {
				if ($scope.ae.isEditMode[i][j]) {
					iMaxEdit = i;
					jMaxEdit = j;
					data.push(subItem);

					var needExistingControl = true;

					try {
						needExistingControl = !(subItem.tingkatRisikoIR.name.toLowerCase().includes('rendah') || subItem.tingkatRisikoIR.name.toLowerCase().includes('moderat'));
					} catch (e) {

					}

					if (!$validationProvider.checkValid($scope.formAE[i].penyebab[j])) {
						if (needExistingControl) {
							isValidForm = false;
							$validationProvider.validate($scope.formAE[i].penyebab[j]);
						}
					}
				}
			});
		});

		if (isValidForm) {
			NProgress.start();

			var apiUrl = "/api/krAllAEDetailPenyebab";

			HttpRequest.post(apiUrl, data).success(function (response) {
					angular.forEach($scope.ae.data, function (item, i) {
						angular.forEach(item.listPenyebab, function (subItem, j) {
							if ($scope.ae.isEditMode[i][j]) {
								$scope.ae.renderDetaillPenyebab(i, j);
								$scope.ae.isEditMode[i][j] = false;
								$scope.ae.totalOpenedForEditing = $scope.ae.totalOpenedForEditing - 1;

								if (i == iMaxEdit && j == jMaxEdit) {
									$scope.rm.renderData();

									NProgress.done();
								}
							}
						});
					});
				})
				.error(function (response, code) {
					NProgress.done();

					var data = {
						title: "AE Detail Penyebab",
						exception: response,
						exceptionCode: code,
						operation: "POST",
						apiUrl: apiUrl
					};

					Helper.notifErrorHttp(data);
				});
		} else {
			alert("Form belum valid atau belum terisi lengkap.");
		}
	}

	$scope.ae.discardAllChangesClick = function () {
		NProgress.start();

		var iMaxEdit = 0;
		var jMaxEdit = 0;

		angular.forEach($scope.ae.data, function (item, i) {
			angular.forEach(item.listPenyebab, function (subItem, j) {
				if ($scope.ae.isEditMode[i][j]) {
					iMaxEdit = i;
					jMaxEdit = j;
				}
			});
		});

		angular.forEach($scope.ae.data, function (item, i) {
			angular.forEach(item.listPenyebab, function (subItem, j) {
				if ($scope.ae.isEditMode[i][j]) {
					$scope.ae.renderDetaillPenyebab(i, j);
					$scope.ae.isEditMode[i][j] = false;
					$scope.ae.totalOpenedForEditing = $scope.ae.totalOpenedForEditing - 1;

					if (i == iMaxEdit && j == jMaxEdit) {
						NProgress.done();
					}
				}
			});
		});
	}

	$scope.ae.adliChange = function (indexAE, indexPenyebab, indexExistingControl) {
		var approach = 0;
		var deployment = 0;
		var learning = 0;
		var integration = 0;
		var score = 0;

		if (!Helper.isNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl])) {
			approach = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].approach);
			deployment = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].deployment);
			learning = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].learning);
			integration = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].integration);
			score = (approach + deployment + learning + integration) / 4;

			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].nilai = (score >= 0 && score <= 5) ? score : 0;
			$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].efektifitas = Helper.getLabelEfektivitas(score);
		};

		$scope.ae.adjustValueDLI(indexAE, indexPenyebab, indexExistingControl);
		$scope.ae.renderListEfektivitasDLI(indexAE, indexPenyebab, indexExistingControl, false);
		$scope.ae.renderListPeringkatDampakCR(indexAE, indexPenyebab, false);
	}

	$scope.ae.adjustValueDLI = function (indexAE, indexPenyebab, indexExistingControl) {
		if (!Helper.isNullOrEmpty($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl])) {
			var approach = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].approach);
			var deployment = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].deployment);
			var learning = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].learning);
			var integration = parseInt($scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].integration);

			if (deployment > approach)
				$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].deployment = approach;

			if (learning > approach)
				$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].learning = approach;

			if (integration > approach)
				$scope.ae.data[indexAE].listPenyebab[indexPenyebab].existingControl[indexExistingControl].integration = approach;
		};
	}

	$scope.rm.rencanaMitigasiAdd = function (indexRM, indexPenyebab) {
		if (Helper.isNullOrEmpty($scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi))
			$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi = [];

		var langkahKerja = new Model.kr.rm.langkahKerja();
		var rencanaMitigasi = new Model.kr.rm.rencanaMitigasi();

		//Set default Residual Risk
		rencanaMitigasi.peringkatDampakRR = angular.copy($scope.rm.ref.peringkatDampakCR[indexRM][indexPenyebab]);
		rencanaMitigasi.tipePeringkatKemungkinan = angular.copy($scope.rm.ref.tipePeringkatKemungkinanCR[indexRM][indexPenyebab]);
		rencanaMitigasi.peringkatKemungkinanRR = angular.copy($scope.rm.ref.peringkatKemungkinanCR[indexRM][indexPenyebab]);
		rencanaMitigasi.tingkatRisikoCR = angular.copy($scope.rm.ref.tingkatRisikoCR[indexRM][indexPenyebab]);
		//-------------------------

		rencanaMitigasi.langkahKerja.push(langkahKerja);

		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi.push(rencanaMitigasi);

		var indexRencanaMitigasi = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi.length - 1;

		var tipePeringkatKemungkinan = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].tipePeringkatKemungkinan;
		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].tipePeringkatKemungkinan = tipePeringkatKemungkinan;

		$scope.rm.renderMaster(indexRM, indexPenyebab, indexRencanaMitigasi, false);

		$scope.rm.hitungTingkatRisiko(indexRM, indexPenyebab, indexRencanaMitigasi);
	}

	$scope.rm.rencanaMitigasiDelete = function (indexRM, indexPenyebab, indexRencanaMitigasi) {
		var hapus = confirm("Hapus data ?");
		if (hapus)
			$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi.splice(indexRencanaMitigasi, 1);
	}

	$scope.rm.langkahKerjaAdd = function (indexRM, indexPenyebab, indexRencanaMitigasi) {
		if (Helper.isNullOrEmpty($scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].langkahKerja))
			$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].langkahKerja = [];

		var langkahKerja = new Model.kr.rm.langkahKerja();
		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].langkahKerja.push(langkahKerja);
	}

	$scope.rm.langkahKerjaDelete = function (indexRM, indexPenyebab, indexRencanaMitigasi, indexLangkahKerja) {
		var hapus = confirm("Hapus data ?");
		if (hapus)
			$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].langkahKerja.splice(indexLangkahKerja, 1);
	}

	$scope.rm.peringkatDampakChange = function (indexRM, indexPenyebab, indexRencanaMitigasi) {
		var idPeringkatDampak = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatDampakRR.id;
		var masterPeringkatDampak = $scope.rm.master.peringkatDampak[indexRM][indexPenyebab][indexRencanaMitigasi];
		var selectedPeringkatDampak = Helper.findItem(masterPeringkatDampak, "id", idPeringkatDampak);

		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatDampakRR.name = Helper.isNullOrEmpty(selectedPeringkatDampak) ? "" : selectedPeringkatDampak.name;
		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatDampakRR.keterangan = Helper.isNullOrEmpty(selectedPeringkatDampak) ? "" : selectedPeringkatDampak.keterangan;
		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatDampakRR.nilai = Helper.isNullOrEmpty(selectedPeringkatDampak) ? "" : selectedPeringkatDampak.nilai;

		$scope.rm.hitungTingkatRisiko(indexRM, indexPenyebab, indexRencanaMitigasi);
	}

	$scope.rm.peringkatKemungkinanChange = function (indexRM, indexPenyebab, indexRencanaMitigasi) {
		var id = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatKemungkinanRR.id;
		var master = $scope.rm.master.peringkatKemungkinan[indexRM][indexPenyebab][indexRencanaMitigasi];
		var selectedItem = Helper.findItem(master, "id", id);

		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatKemungkinanRR.name = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.name;
		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatKemungkinanRR.keterangan = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.keterangan;
		$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatKemungkinanRR.nilai = Helper.isNullOrEmpty(selectedItem) ? "" : selectedItem.nilai;

		$scope.rm.hitungTingkatRisiko(indexRM, indexPenyebab, indexRencanaMitigasi);
	}

	$scope.rm.hitungTingkatRisiko = function (indexRM, indexPenyebab, indexRencanaMitigasi) {
		var idPerDampak = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatDampakRR.id;
		var idPerKemungkinan = $scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].peringkatKemungkinanRR.id;
		var apiUrl = "/api/KRHitungTingkatRisiko?idPeringkatDampak=" + idPerDampak + "&idPeringkatKemungkinan=" + idPerKemungkinan;

		HttpRequest.get(apiUrl).success(function (response) {
			$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi[indexRencanaMitigasi].tingkatRisikoRR = response;
		});
	}

	$scope.rm.editClick = function (indexRM, indexPenyebab, form) {
		$scope.rm.isEditMode[indexRM][indexPenyebab] = true;
		$scope.rm.totalOpenedForEditing = $scope.rm.totalOpenedForEditing + 1;

		if (Helper.isNullOrEmpty($scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi))
			$scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi = [];

		if ($scope.rm.data[indexRM].listPenyebab[indexPenyebab].rencanaMitigasi.length == 0)
			$scope.rm.rencanaMitigasiAdd(indexRM, indexPenyebab);

		//$validationProvider.reset(form);
	}

	$scope.rm.saveChangesClick = function (indexRM, indexPenyebab, form) {
		var isValidForm = $validationProvider.checkValid(form);

		if (isValidForm) {
			NProgress.start();

			var apiUrl = "/api/krRMDetailPenyebab";
			var data = $scope.rm.data[indexRM].listPenyebab[indexPenyebab];

			HttpRequest.post(apiUrl, data).success(function (response) {
					$scope.rm.renderDetaillPenyebab(indexRM, indexPenyebab);
					$scope.rm.isEditMode[indexRM][indexPenyebab] = false;
					$scope.rm.totalOpenedForEditing = $scope.rm.totalOpenedForEditing - 1;

					NProgress.done();
				})
				.error(function (response, code) {
					NProgress.done();

					var data = {
						title: "RM Detail Penyebab",
						exception: response,
						exceptionCode: code,
						operation: "POST",
						apiUrl: apiUrl
					};

					Helper.notifErrorHttp(data);
				})
		} else {
			alert("Form belum valid atau belum terisi lengkap.");

			$validationProvider.validate(form);
		}
	}

	$scope.rm.discardChangesClick = function (indexRM, indexPenyebab) {
		$scope.rm.renderDetaillPenyebab(indexRM, indexPenyebab);
		$scope.rm.isEditMode[indexRM][indexPenyebab] = false;
		$scope.rm.totalOpenedForEditing = $scope.rm.totalOpenedForEditing - 1;
	}

	$scope.rm.saveAllChangesClick = function () {
		var iMaxEdit = 0;
		var jMaxEdit = 0;
		var isValidForm = true;
		var data = [];

		angular.forEach($scope.rm.data, function (item, i) {
			angular.forEach(item.listPenyebab, function (subItem, j) {
				if ($scope.rm.isEditMode[i][j]) {
					iMaxEdit = i;
					jMaxEdit = j;
					data.push($scope.rm.data[i].listPenyebab[j]);

					if (!$validationProvider.checkValid($scope.formRM[i].penyebab[j])) {
						isValidForm = false;
						$validationProvider.validate($scope.formRM[i].penyebab[j]);
					}
				}
			});
		});

		if (isValidForm) {
			NProgress.start();

			var apiUrl = "/api/krAllRMDetailPenyebab";

			HttpRequest.post(apiUrl, data).success(function (response) {
					angular.forEach($scope.rm.data, function (item, i) {
						angular.forEach(item.listPenyebab, function (subItem, j) {
							if ($scope.rm.isEditMode[i][j]) {
								$scope.rm.renderDetaillPenyebab(i, j);
								$scope.rm.isEditMode[i][j] = false;
								$scope.rm.totalOpenedForEditing = $scope.rm.totalOpenedForEditing - 1;

								if (i == iMaxEdit && j == jMaxEdit) {
									NProgress.done();
								}
							}
						});
					});
				})
				.error(function (response, code) {
					NProgress.done();

					var data = {
						title: "RM Detail Penyebab",
						exception: response,
						exceptionCode: code,
						operation: "POST",
						apiUrl: apiUrl
					};

					Helper.notifErrorHttp(data);
				});
		} else {
			alert("Form belum valid atau belum terisi lengkap.");
		}
	}

	$scope.rm.discardAllChangesClick = function () {
		NProgress.start();

		var iMaxEdit = 0;
		var jMaxEdit = 0;

		angular.forEach($scope.rm.data, function (item, i) {
			angular.forEach(item.listPenyebab, function (subItem, j) {
				if ($scope.rm.isEditMode[i][j]) {
					iMaxEdit = i;
					jMaxEdit = j;
				}
			});
		});

		angular.forEach($scope.rm.data, function (item, i) {
			angular.forEach(item.listPenyebab, function (subItem, j) {
				if ($scope.rm.isEditMode[i][j]) {
					$scope.rm.renderDetaillPenyebab(i, j);
					$scope.rm.isEditMode[i][j] = false;
					$scope.rm.totalOpenedForEditing = $scope.rm.totalOpenedForEditing - 1;

					if (i == iMaxEdit && j == jMaxEdit) {
						NProgress.done();
					}
				}
			});
		});
	}

	$scope.rm.generatePanelClass = function () {
		$scope.rm.panelClass1 = [];
		$scope.rm.panelClass2 = [];

		angular.forEach($scope.rm.data, function (item, i) {
			$scope.rm.panelClass1[i] = "panel-default";
			$scope.rm.panelClass2[i] = [];

			angular.forEach(item.listPenyebab, function (subItem, j) {
				$scope.rm.panelClass2[i][j] = "panel-default";

				var cr = subItem.controlledRisk.name.toLowerCase();

				if (cr.includes('tinggi')) {
					$scope.rm.panelClass2[i][j] = "pnl-orange";

					if ($scope.rm.panelClass1[i] != "pnl-red")
						$scope.rm.panelClass1[i] = "pnl-orange";
				}

				if (cr.includes('ekstrim')) {
					$scope.rm.panelClass2[i][j] = "pnl-red";
					$scope.rm.panelClass1[i] = "pnl-red";
				}
			});
		});
	}

	$scope.submitClick = function () {
		NProgress.start();

		var apiUrl = "/api/krSubmit";
		var data = {
			idKR: idKr,
			userEmail: currentUser.email,
			nextApproval: $scope.approver.nextApproval
		};

		HttpRequest.post(apiUrl, data).success(function (response) {
				alert('Data berhasil di-submit.');
				$scope.approver = {};

				//Jangan meniru script di bawah ini, sangat tidak direkomendasikan
				$('#modalSubmit').modal('hide');

				$scope.renderApprovalStatus();

				NProgress.done();
			})
			.error(function (response, code) {
				$scope.renderApprovalStatus();
				NProgress.done();

				var data = {
					title: "KR Submit",
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

		var apiUrl = "/api/krApproval";
		var data = {
			idKR: idKr,
			keterangan: $scope.approver.keterangan,
			nextApproval: $scope.approver.nextApproval,
			userEmail: currentUser.email
		};

		HttpRequest.post(apiUrl, data).success(function (response) {
				alert('Data berhasil di-approve.');

				$scope.approver = {};

				//Jangan meniru script di bawah ini, sangat tidak direkomendasikan
				$('#modalApproval').modal('hide');

				$scope.renderApprovalStatus();
				NProgress.done();
			})
			.error(function (response, code) {
				$scope.renderApprovalStatus();
				NProgress.done();

				var data = {
					title: "KR Approve",
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

		var apiUrl = "/api/krRevise";
		var data = {
			idKR: idKr,
			keterangan: $scope.reviser.keterangan,
			userEmail: currentUser.email
		};

		HttpRequest.post(apiUrl, data).success(function (response) {
				$scope.renderApprovalStatus();
				alert('Data berhasil di-revise.');

				$scope.reviser = {};

				//Jangan meniru script di bawah ini, sangat tidak direkomendasikan
				$('#modalRevise').modal('hide');

				NProgress.done();
			})
			.error(function (response, code) {
				$scope.renderApprovalStatus();
				NProgress.done();

				var data = {
					title: "KR Revise",
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

		var apiUrl = "/api/krDisposition";
		var data = {
			idKR: idKr,
			keterangan: $scope.dispositioner.keterangan,
			tujuanDisposisi: $scope.dispositioner.tujuan,
			userEmail: currentUser.email
		};

		HttpRequest.post(apiUrl, data).success(function (response) {
				$scope.renderApprovalStatus();
				alert('Data berhasil didisposisi.');

				$scope.dispositioner = {};

				//Jangan meniru script di bawah ini, sangat tidak direkomendasikan
				$('#modalDisposition').modal('hide');

				NProgress.done();
			})
			.error(function (response, code) {
				$scope.renderApprovalStatus();
				NProgress.done();

				var data = {
					title: "KR Disposition",
					exception: response,
					exceptionCode: code,
					operation: "POST",
					apiUrl: apiUrl
				};

				Helper.notifErrorHttp(data);
			});
	}

	//Start of Application =============================================================================================================
	$scope.formLoad();
});