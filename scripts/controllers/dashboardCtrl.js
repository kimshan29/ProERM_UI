mainApp.controller("dashboardCtrl", function(
  $scope,
  $routeParams,
  $cookies,
  $http,
  $injector,
  $sce,
  Constant,
  HttpRequest,
  Model,
  Helper,
  FileHelper
) {
  $scope.Helper = Helper;
  var currentUser = {};

  $scope.unit = {};

  $scope.error = {};
  $scope.menuAktif = "PPRA";
  $scope.heightCategories = 0;

  $scope.data = {};
  $scope.data.PRU = [];
  $scope.data.PRK = [];
  $scope.data.PPRA = [];

  $scope.popupDataPRU = [];
  $scope.popupDataPRK = [];

  $scope.tahunFilter = [];

  $scope.dataIR = [];
  $scope.dataRisikoIR = [];
  $scope.showDataRisikoIR = [];

  $scope.dataCR = [];
  $scope.dataRisikoCR = [];
  $scope.showDataRisikoCR = [];

  $scope.dataRR = [];
  $scope.dataRisikoRR = [];
  $scope.showDataRisikoRR = [];

  $scope.dataAR = [];
  $scope.dataRisikoAR = [];
  $scope.showDataRisikoAR = [];

  $scope.dataDetail = [];

  $scope.tahun = null;
  $scope.bulan = null;
  $scope.jenis = Constant.emptyGuid;
  $scope.kategori = Constant.emptyGuid;
  $scope.subKategori = Constant.emptyGuid;
  $scope.kelompokRisiko = Constant.emptyGuid;
  $scope.unit = Constant.emptyGuid;
  $scope.isDownloadableIR = false;
  $scope.isDownloadableCR = false;
  $scope.isDownloadableRR = false;
  $scope.isDownloadableAR = false;

  $scope.master = {};
  $scope.master.tahun = [];
  $scope.master.jenis = [];
  $scope.master.kategori = [];
  $scope.master.subKategori = [];
  $scope.master.kelompokRisiko = [];
  $scope.master.unit = [];

  //Form Load ====================================================
  $scope.formLoad = function() {
    $scope.getCurrentUser();
    $scope.renderTahun(1, 10);
    $scope.renderMaster();
    $scope.renderMap();
  };

  $scope.getCurrentUser = function() {
    try {
      currentUser = JSON.parse($cookies.get("currentUser"));
      $scope.unit = currentUser.organization;
      console.log(JSON.stringify($scope.unit));
    } catch (err) {
      currentUser = {};
    }
  };

  // ========= MAIN =========== //
  $scope.renderTahun = function(offset, range) {
    var currentYear = new Date().getFullYear();

    for (var i = currentYear - range; i <= currentYear + range; i++) {
      $scope.tahunFilter.push(i);
    }
  };

  $scope.showPopUp = function(id) {
    NProgress.start();

    if ($scope.menuAktif == "PRU") {
      $scope.popupDataPRU = null;
      $scope.renderDataPopUpPRU(id);
    } else if ($scope.menuAktif == "PRK") {
      $scope.popupDataPRU = null;
      $scope.renderDataPopUpPRK(id);
    }
    $("#modalRisikoChart").modal("show");

    NProgress.done();
  };

  // ====== RENDER DATA ====== //
  $scope.renderChartPRU = function() {
    NProgress.start();

    if ($scope.tahunKajian == null) {
      var d = new Date();
      $scope.tahunKajian = d.getFullYear();
    }
    if ($scope.jenisKajian == null) {
      $scope.jenisKajian = "RKAP";
    }

    var apiUrl =
      "/api/Dashboard?tahun=" +
      $scope.tahunKajian +
      "&jenis=" +
      $scope.jenisKajian +
      "&email=" +
      currentUser.email;
    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.dataBaru = response;

        $scope.isVisible = [];
        $scope.isVisible[0] = false;
        $scope.isVisible[1] = false;
        $scope.isVisible[2] = false;
        $scope.isVisible[3] = false;

        // CEK DATA ADA (IF null CATEGORIES Visible=false)
        angular.forEach($scope.dataBaru.data, function(item, i) {
          if (item.data != null) {
            $scope.isVisible[i] = true;
          } else {
            item.data = [];
          }
        });

        var categories = $scope.dataBaru.categories;
        $scope.heightCategories = $scope.dataBaru.categories.length * 30;
        $scope.data.PRU = {
          options: {
            chart: {
              type: "bar",
              zoomType: "x",
              options3d: {
                enabled: false,
                alpha: 0,
                beta: 0,
                depth: 80
              },
              width: null,
              height: null,
              className: "width-100"
            }
          },
          xAxis: {
            categories: categories.map(mapCategories),
            showEmpty: false
          },
          series: [
            {
              name: ["RENDAH"],
              color: "#76f95c",
              visible: $scope.isVisible[3],
              data: $scope.dataBaru.data[3].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            },
            {
              name: ["MODERAT"],
              color: "#1993bc",
              visible: $scope.isVisible[2],
              data: $scope.dataBaru.data[2].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            },
            {
              name: ["TINGGI"],
              color: "#f7ff19",
              visible: $scope.isVisible[1],
              data: $scope.dataBaru.data[1].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            },
            {
              name: ["EKSTRIM"],
              color: "#fc1616",
              visible: $scope.isVisible[0],
              data: $scope.dataBaru.data[0].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            }
          ],
          title: {
            text: "PROFIL RISIKO " + $scope.unit,
            floating: false,
            align: "center",
            x: -30,
            y: 30
          },
          loading: false,
          credits: { enabled: false }
        };
        $scope.data.AvgPRU = $scope.dataBaru;

        NProgress.done();
      })
      .error(function(response, code) {
        $scope.errorCode = code;
        alert(response + $scope.errorCode);
        NProgress.done();
      });
  };

  $scope.renderChartPRK = function() {
    NProgress.start();

    if ($scope.tahunKajian == null) {
      var d = new Date();
      $scope.tahunKajian = d.getFullYear();
    }
    if ($scope.jenisKajian == null) {
      $scope.jenisKajian = "RKAP";
    }

    var apiUrl =
      "/api/Dashboard?tahun=" +
      $scope.tahunKajian +
      "&jenis=" +
      $scope.jenisKajian;
    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.dataBaru2 = response;

        $scope.isVisible = [];
        $scope.isVisible[0] = false;
        $scope.isVisible[1] = false;
        $scope.isVisible[2] = false;
        $scope.isVisible[3] = false;

        // CEK DATA ADA (IF null CATEGORIES Visible=false)
        angular.forEach($scope.dataBaru2.data, function(item, i) {
          if (item.data != null) {
            $scope.isVisible[i] = true;
          } else {
            item.data = [];
          }
        });

        var categories = $scope.dataBaru2.categories;

        $scope.heightCategories = $scope.dataBaru2.categories.length * 30;
        $scope.data.PRK = {
          options: {
            chart: {
              type: "bar",
              zoomType: "x",
              options3d: {
                enabled: false,
                alpha: 0,
                beta: 0,
                depth: 80
              },
              width: null,
              height: null,
              className: "width-100"
            }
          },
          xAxis: {
            categories: categories.map(mapCategories),
            showEmpty: false
          },
          series: [
            {
              name: ["RENDAH"],
              color: "#76f95c",
              visible: $scope.isVisible[3],
              data: $scope.dataBaru2.data[3].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            },
            {
              name: ["MODERAT"],
              color: "#1993bc",
              visible: $scope.isVisible[2],
              data: $scope.dataBaru2.data[2].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            },
            {
              name: ["TINGGI"],
              color: "#f7ff19",
              visible: $scope.isVisible[1],
              data: $scope.dataBaru2.data[1].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            },
            {
              name: ["EKSTRIM"],
              color: "#fc1616",
              visible: $scope.isVisible[0],
              data: $scope.dataBaru2.data[0].data,
              events: {
                click: function(item) {
                  $scope.showPopUp(item.point.id);
                }
              },
              dataLabels: { enabled: true, format: "{point.y}" },
              tooltip: {
                pointFormat: "<b>{series.name}</b>: <b>{point.y}</b><br/>",
                valueSuffix: "",
                shared: true
              }
            }
          ],
          title: {
            text: "PROFIL RISIKO KORPORAT",
            floating: false,
            align: "center",
            x: -30,
            y: 30
          },
          loading: false,
          credits: { enabled: false }
        };
        $scope.data.AvgPRK = $scope.dataBaru2;

        NProgress.done();
      })
      .error(function(response, code) {
        $scope.errorCode = code;
        alert(response + $scope.errorCode);
        NProgress.done();
      });
  };

  $scope.renderDataPopUpPRU = function(id) {
    NProgress.start();

    var apiUrl =
      "/api/DashboardDetail/" +
      id +
      "?tahun=" +
      $scope.tahunKajian +
      "&jenis=" +
      $scope.jenisKajian +
      "&email=" +
      currentUser.email;
    $scope.hasFinish = "display:inherit;";
    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.popupDataPRU = response;

        if (angular.element(document).ready) {
          $scope.hasFinish = "display:none";
          NProgress.done();
        }
      })
      .error(function(response, code) {
        $scope.errorCode = code;
        NProgress.done();
      });

    //$scope.popupDataPRU = {
    //    "name": "KEANDALAN PEMBANGKIT",
    //    "unit": [
    //        {
    //            "name": "KANTOR PUSAT",
    //            "divisi": [
    //                    {
    //                        "name": "DIVISI JASA PEMBANGKITAN",
    //                        "mitigasi": [
    //                            {
    //                                "name": "Meningkatkan Ketersediaan Suplai",
    //                                "data": [
    //                                    {
    //                                        "unit": "KANTOR PUSAT",
    //                                        "divisi": "DIVISI JASA PEMBANGKITAN",
    //                                        "mitigasi": "Meningkatkan Ketersediaan Suplai",
    //                                        "picKoordinator": "KEPALA DIVISI PEMBANGKITAN K3L II - PELITABARU PAKPAHAN",
    //                                        "rencanaKerja": "Melakukan diskusi dengan konsultan berbeda"
    //                                    },
    //                                    {
    //                                        "unit": "KANTOR PUSAT",
    //                                        "divisi": "DIVISI JASA PEMBANGKITAN",
    //                                        "mitigasi": "Meningkatkan Ketersediaan Suplai",
    //                                        "picKoordinator": "KEPALA DIVISI PEMBANGKITAN K3L II - PELITABARU PAKPAHAN",
    //                                        "rencanaKerja": "Melakukan diskusi dengan konsultan berbeda"
    //                                    }
    //                                ]
    //                            }
    //                        ]
    //                    }
    //            ]
    //        },
    //        {
    //            "name": "UJP ADIPALA",
    //            "divisi": [
    //                            {
    //                                "name": "DIVISI JASA PEMBANGKITAN",
    //                                "mitigasi": [
    //                                                {
    //                                                    "name": "Meningkatkan Ketersediaan Suplai",
    //                                                    "data": [
    //                                                                    {
    //                                                                        "unit": "KANTOR PUSAT",
    //                                                                        "divisi": "DIVISI JASA PEMBANGKITAN",
    //                                                                        "mitigasi": "Meningkatkan Ketersediaan Suplai",
    //                                                                        "picKoordinator": "KEPALA DIVISI PEMBANGKITAN K3L II - PELITABARU PAKPAHAN",
    //                                                                        "rencanaKerja": "Melakukan diskusi dengan konsultan berbeda"
    //                                                                    },
    //                                                                    {
    //                                                                        "unit": "KANTOR PUSAT",
    //                                                                        "divisi": "DIVISI JASA PEMBANGKITAN",
    //                                                                        "mitigasi": "Meningkatkan Ketersediaan Suplai",
    //                                                                        "picKoordinator": "KEPALA DIVISI PEMBANGKITAN K3L II - PELITABARU PAKPAHAN",
    //                                                                        "rencanaKerja": "Melakukan diskusi dengan konsultan berbeda"
    //                                                                    }
    //                                                    ]
    //                                                }
    //                                ]
    //                            }
    //            ]
    //        }
    //    ]
    //}
  };

  $scope.renderDataPopUpPRK = function(id) {
    NProgress.start();

    var apiUrl =
      "/api/DashboardDetail/" +
      id +
      "?tahun=" +
      $scope.tahunKajian +
      "&jenis=" +
      $scope.jenisKajian;
    $scope.hasFinish = "display:inherit;";
    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.popupDataPRU = response;

        if (angular.element(document).ready) {
          $scope.hasFinish = "display:none";
          NProgress.done();
        }
      })
      .error(function(response, code) {
        $scope.errorCode = code;
        NProgress.done();
      });
  };

  $scope.renderChart = function() {
    if ($scope.menuAktif == "PRU") {
      $scope.renderChartPRU();
    } else if ($scope.menuAktif == "PRK") {
      $scope.renderChartPRK();
    }
  };

  $scope.renderMap = function() {
    NProgress.start();
    var apiUrl = "/api/listPetaRisiko/" + $scope.tahun;

    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.dataIR = angular.copy(response);
        $scope.dataCR = angular.copy(response);
        $scope.dataRR = angular.copy(response);
        $scope.dataAR = angular.copy(response);

        NProgress.done();
      })
      .error(function(response, code) {
        NProgress.done();

        var data = {
          title: "List Peta Risiko",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });
  };

  $scope.renderData = function() {
    NProgress.start();

    //Inherent Risk
    var apiUrl =
      "/api/petaInherentRisk?tahun=" +
      $scope.tahun +
      "&bulan=" +
      $scope.bulan +
      "&idjenis=" +
      $scope.guidToEmpty($scope.jenis) +
      "&idkategori=" +
      $scope.guidToEmpty($scope.kategori) +
      "&idsubkategori=" +
      $scope.guidToEmpty($scope.subKategori) +
      "&idkelompok=" +
      $scope.guidToEmpty($scope.kelompokRisiko) +
      "&identitas=" +
      $scope.guidToEmpty($scope.unit);

    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.isDownloadableIR = true;

        var indexIR = 0;
        for (var i = 5; i > 0; i--) {
          var itemIR = angular.copy(
            Helper.findItems(response, "peringkatKemungkinan", i)
          );
          for (var j = 1; j <= 5; j++) {
            var itemIR2 = angular.copy(
              Helper.findItem(itemIR, "peringkatDampak", j)
            );

            $scope.showDataRisikoIR[indexIR] = false;

            if (itemIR2 == undefined) {
              $scope.dataIR[indexIR].jumlahKelompokRisiko = 0;
              $scope.dataRisikoIR[indexIR] = [];
            } else {
              $scope.dataIR[indexIR].jumlahKelompokRisiko =
                itemIR2.jumlahKelompokRisiko;
              $scope.dataRisikoIR[indexIR] = itemIR2.kelompokRisiko || [];
              console.log(JSON.stringify($scope.dataRisikoIR[indexIR]));
            }
            indexIR++;
          }
        }

        //Start of Controlled Risk ======================================================
        apiUrl =
          "/api/petaControlledRisk?tahun=" +
          $scope.tahun +
          "&bulan=" +
          $scope.bulan +
          "&idjenis=" +
          $scope.guidToEmpty($scope.jenis) +
          "&idkategori=" +
          $scope.guidToEmpty($scope.kategori) +
          "&idsubkategori=" +
          $scope.guidToEmpty($scope.subKategori) +
          "&idkelompok=" +
          $scope.guidToEmpty($scope.kelompokRisiko) +
          "&identitas=" +
          $scope.guidToEmpty($scope.unit);

        HttpRequest.get(apiUrl)
          .success(function(response) {
            $scope.isDownloadableCR = true;

            var indexCR = 0;
            for (var i = 5; i > 0; i--) {
              var itemCR = angular.copy(
                Helper.findItems(response, "peringkatKemungkinan", i)
              );
              for (var j = 1; j <= 5; j++) {
                var itemCR2 = angular.copy(
                  Helper.findItem(itemCR, "peringkatDampak", j)
                );

                $scope.showDataRisikoCR[indexCR] = false;

                if (itemCR2 == undefined) {
                  $scope.dataCR[indexCR].jumlahKelompokRisiko = 0;
                  $scope.dataRisikoCR[indexCR] = [];
                } else {
                  $scope.dataCR[indexCR].jumlahKelompokRisiko =
                    itemCR2.jumlahKelompokRisiko;
                  $scope.dataRisikoCR[indexCR] = itemCR2.kelompokRisiko || [];
                }
                indexCR++;
              }
            }

            //Start of Residual Risk ======================================================
            apiUrl =
              "/api/petaResidualRisk?tahun=" +
              $scope.tahun +
              "&bulan=" +
              $scope.bulan +
              "&idjenis=" +
              $scope.guidToEmpty($scope.jenis) +
              "&idkategori=" +
              $scope.guidToEmpty($scope.kategori) +
              "&idsubkategori=" +
              $scope.guidToEmpty($scope.subKategori) +
              "&idkelompok=" +
              $scope.guidToEmpty($scope.kelompokRisiko) +
              "&identitas=" +
              $scope.guidToEmpty($scope.unit);

            HttpRequest.get(apiUrl)
              .success(function(response) {
                $scope.isDownloadableRR = true;

                var indexRR = 0;
                for (var i = 5; i > 0; i--) {
                  var itemRR = angular.copy(
                    Helper.findItems(response, "peringkatKemungkinan", i)
                  );
                  for (var j = 1; j <= 5; j++) {
                    var itemRR2 = angular.copy(
                      Helper.findItem(itemRR, "peringkatDampak", j)
                    );

                    $scope.showDataRisikoRR[indexRR] = false;

                    if (itemRR2 == undefined) {
                      $scope.dataRR[indexRR].jumlahKelompokRisiko = 0;
                      $scope.dataRisikoRR[indexRR] = [];
                    } else {
                      $scope.dataRR[indexRR].jumlahKelompokRisiko =
                        itemRR2.jumlahKelompokRisiko;
                      $scope.dataRisikoRR[indexRR] =
                        itemRR2.kelompokRisiko || [];
                    }
                    indexRR++;
                  }
                }

                //Start of Actual Risk ======================================================
                apiUrl =
                  "/api/petaActualRisk?tahun=" +
                  $scope.tahun +
                  "&bulan=" +
                  $scope.bulan +
                  "&idjenis=" +
                  $scope.guidToEmpty($scope.jenis) +
                  "&idkategori=" +
                  $scope.guidToEmpty($scope.kategori) +
                  "&idsubkategori=" +
                  $scope.guidToEmpty($scope.subKategori) +
                  "&idkelompok=" +
                  $scope.guidToEmpty($scope.kelompokRisiko) +
                  "&identitas=" +
                  $scope.guidToEmpty($scope.unit);

                HttpRequest.get(apiUrl)
                  .success(function(response) {
                    $scope.isDownloadableAR = true;

                    var indexAR = 0;
                    for (var i = 5; i > 0; i--) {
                      var itemAR = angular.copy(
                        Helper.findItems(response, "peringkatKemungkinan", i)
                      );
                      for (var j = 1; j <= 5; j++) {
                        var itemAR2 = angular.copy(
                          Helper.findItem(itemAR, "peringkatDampak", j)
                        );

                        $scope.showDataRisikoAR[indexAR] = false;

                        if (itemAR2 == undefined) {
                          $scope.dataAR[indexAR].jumlahKelompokRisiko = 0;
                          $scope.dataRisikoAR[indexAR] = [];
                        } else {
                          $scope.dataAR[indexAR].jumlahKelompokRisiko =
                            itemAR2.jumlahKelompokRisiko;
                          $scope.dataRisikoAR[indexAR] =
                            itemAR2.kelompokRisiko || [];
                        }
                        indexAR++;
                      }
                    }

                    NProgress.done();
                  })
                  .error(function(response, code) {
                    NProgress.done();
                    $scope.isDownloadableAR = false;

                    var data = {
                      title: "Nilai Peta Risiko Actual Risk",
                      exception: response,
                      exceptionCode: code,
                      operation: "GET",
                      apiUrl: apiUrl
                    };

                    Helper.notifErrorHttp(data);
                  });
                //End of Actual Risk ========================================================
              })
              .error(function(response, code) {
                NProgress.done();
                $scope.isDownloadableRR = false;

                var data = {
                  title: "Nilai Peta Risiko Residual Risk",
                  exception: response,
                  exceptionCode: code,
                  operation: "GET",
                  apiUrl: apiUrl
                };

                Helper.notifErrorHttp(data);
              });
            //End of Residual Risk ========================================================
          })
          .error(function(response, code) {
            NProgress.done();
            $scope.isDownloadableCR = false;

            var data = {
              title: "Nilai Peta Risiko Controlled Risk",
              exception: response,
              exceptionCode: code,
              operation: "GET",
              apiUrl: apiUrl
            };

            Helper.notifErrorHttp(data);
          });
        //End of Controlled Risk ========================================================
      })
      .error(function(response, code) {
        NProgress.done();
        $scope.isDownloadableIR = false;

        var data = {
          title: "Nilai Peta Risiko Inherent Risk",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });
  };

  $scope.renderMaster = function() {
    NProgress.start();

    var currDate = new Date();
    $scope.tahun = currDate.getFullYear();
    $scope.bulan = currDate.getMonth() + 1;

    //Master Tahun
    var years = Helper.generateStackedYears(2010, 1);
    $scope.master.tahun = years;

    //Master Bulan
    var months = Helper.generateMonths();
    $scope.master.bulan = months;

    //Master Jenis
    var apiUrl = "/api/listJenisKajian";

    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.master.jenis = response;
      })
      .error(function(response, code) {
        var data = {
          title: "List Jenis",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });

    //Master Kategori
    apiUrl = "/api/listKategoriPetaRisiko";

    HttpRequest.get(apiUrl)
      .success(function(response) {
        response.unshift({ id: Constant.emptyGuid, name: "All" });
        $scope.master.kategori = response;
      })
      .error(function(response, code) {
        var data = {
          title: "List Kategori",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });

    //Master Sub Kategori
    apiUrl = "/api/listSubKategoriPetaRisiko/" + $scope.kategori;

    HttpRequest.get(apiUrl)
      .success(function(response) {
        response.unshift({ id: Constant.emptyGuid, name: "All" });
        $scope.master.subKategori = response;
      })
      .error(function(response, code) {
        var data = {
          title: "List Sub Kategori",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });

    //Master Kelompok Risiko
    apiUrl = "/api/listKelompokPetaRisiko?idSubKategori=" + $scope.subKategori;

    HttpRequest.get(apiUrl)
      .success(function(response) {
        response.unshift({ id: Constant.emptyGuid, name: "All" });
        $scope.master.kelompokRisiko = response;
      })
      .error(function(response, code) {
        var data = {
          title: "List Kelompok Risiko",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });

    //Master Unit
    apiUrl = "/api/listUnitPetaRisiko";

    HttpRequest.get(apiUrl)
      .success(function(response) {
        response.unshift({ id: Constant.emptyGuid, name: "All" });
        $scope.master.unit = response;

        NProgress.done();
      })
      .error(function(response, code) {
        NProgress.done();

        var data = {
          title: "List Unit",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });
  };

  //Event Handlers ==============================================================
  $scope.kategoriChange = function() {
    if (Helper.isNullOrEmpty($scope.kategori))
      $scope.kategori = Constant.emptyGuid;

    var apiUrl = "/api/listSubKategoriPetaRisiko/" + $scope.kategori;

    HttpRequest.get(apiUrl)
      .success(function(response) {
        response.unshift({ id: Constant.emptyGuid, name: "All" });
        $scope.master.subKategori = response;
      })
      .error(function(response, code) {
        var data = {
          title: "List Sub Kategori",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });
  };

  $scope.subKategoriChange = function() {
    if (Helper.isNullOrEmpty($scope.subKategori))
      $scope.subKategori = Constant.emptyGuid;

    var apiUrl =
      "/api/listKelompokPetaRisiko?idSubKategori=" + $scope.subKategori;

    HttpRequest.get(apiUrl)
      .success(function(response) {
        response.unshift({ id: Constant.emptyGuid, name: "All" });
        $scope.master.kelompokRisiko = response;
      })
      .error(function(response, code) {
        var data = {
          title: "List Kelompok Risiko",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });
  };

  $scope.refreshClick = function() {
    $scope.renderData();
  };

  $scope.downloadClick = function() {
    FileHelper.downloadPetaRisiko(
      $scope.tahun,
      $scope.bulan,
      $scope.guidToEmpty($scope.jenis),
      $scope.guidToEmpty($scope.kategori),
      $scope.guidToEmpty($scope.subKategori),
      $scope.guidToEmpty($scope.kelompokRisiko),
      $scope.guidToEmpty($scope.unit),
      "cr"
    );
  };

  $scope.cellMapClick = function(idMap, modul) {
    NProgress.start();
    $scope.dataDetail = [];

    var apiUrl =
      "/api/DetailMapRisk/" +
      idMap +
      "?tahun=" +
      $scope.tahun +
      "&bulan=" +
      $scope.bulan +
      "&idjenis=" +
      $scope.guidToEmpty($scope.jenis) +
      "&idkategori=" +
      $scope.guidToEmpty($scope.kategori) +
      "&idsubkategori=" +
      $scope.guidToEmpty($scope.subKategori) +
      "&idkelompok=" +
      $scope.guidToEmpty($scope.kelompokRisiko) +
      "&identitas=" +
      $scope.guidToEmpty($scope.unit) +
      "&mapType=" +
      modul;
    //console.log("detail", apiUrl);

    $scope.hasFinish = "display:inherit;";

    HttpRequest.get(apiUrl)
      .success(function(response) {
        $scope.dataDetail = response;

        if (angular.element(document).ready) {
          $scope.hasFinish = "display:none";
          NProgress.done();
        }
      })
      .error(function(response, code) {
        NProgress.done();

        var data = {
          title: "Detail Peta Risiko",
          exception: response,
          exceptionCode: code,
          operation: "GET",
          apiUrl: apiUrl
        };

        Helper.notifErrorHttp(data);
      });

    $("#modalDetail").modal({ backdrop: "static", show: true });
  };

  $scope.cellMapIRClick = function(idMap) {
    $scope.cellMapClick(idMap, "ir");
  };

  $scope.cellMapCRClick = function(idMap) {
    $scope.cellMapClick(idMap, "cr");
  };

  $scope.cellMapRRClick = function(idMap) {
    $scope.cellMapClick(idMap, "rr");
  };

  $scope.cellMapARClick = function(idMap) {
    $scope.cellMapClick(idMap, "ar");
  };

  $scope.guidToEmpty = function(pGuid) {
    var jenis = angular.copy(pGuid);

    if (Helper.isEmptyGuid(jenis)) return "";
    else return jenis;
  };

  // ====== HELPER ====== //
  function mapCategories(item, index) {
    var cat = [item.name].join(",");
    return cat;
  }

  $scope.changeMenu = function(menu) {
    $scope.menuAktif = menu;
  };

  //Application Starts ===========================================================
  $scope.formLoad();
});
