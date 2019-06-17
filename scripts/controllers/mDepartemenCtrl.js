mainApp.controller("mDepartemenCtrl", function($scope, $http, $routeParams, HttpRequest, Helper, Constant, Model) {
	// Any function returning a promise object can be used to load values asynchronously
	var pic = {
			id: 'id', 
			employeeNumber: '0000', 
			name: 'alan', 
			jabatan: 'programmer'
	};
	$scope.selectedPic = pic;

	$scope.date1 = {};
	$scope.date1.value = new Date("2016-10-06T00:00:00");//new Date();

	$scope.getLocation = function(val) {
		return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
				  params: {
				    address: val,
				    sensor: false
				  }
			}).then(function(response){
				console.log(JSON.stringify(response.data.results));
			  return response.data.results.map(function(item){
			  	//console.log(item.formatted_address);
			    return item.formatted_address;
			  });
			});
	};

	$scope.listPIC = function(keyword)
	{
		var apiUrl = "/api/KRListPIC/" + keyword;
		
		return HttpRequest.get(apiUrl).then(function(response) {
			return response.data.map(function(item) {
				var pic = {
						id: item.id, 
						employeeNumber: item.employeeNumber, 
						name: item.name, 
						jabatan: item.jabatan, 
						searchCol: item.name + '|' + item.jabatan
				};
				return pic;
			});	
		});	
	};

	$scope.picChange = function(item)
	{
		console.log("picChange", JSON.stringify(item));
	}

	$scope.setValuePic = function()
	{
		var pic = {
				id: 'id', 
				employeeNumber: '0000', 
				name: 'alan', 
				jabatan: 'programmer'
		};
		$scope.selectedPic = pic;
		console.log(pic);
	}

	$scope.openDate1 = function()
	{
		$scope.date1.opened = true;
	}
});