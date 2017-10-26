var myApp = angular.module('myApp', []);

myApp.controller('CollectionController', function($scope, $http) {
	var ownedStorageVar = "mr-men-little-misses-owned";
	var langStorageVar 	= "mr-men-little-misses-lang";

	// Defaults
	$scope.lang 	= "en";
	$scope.title 	= "Mr. Men & Little Misses";

	$scope.config 		= {};
	$scope.owned 		= [];
	$scope.collections 	= {};


	// Change language
	$scope.changeLang = function(newLang){
		$scope.lang 	= newLang;
		$scope.title 	= $scope.config.title[newLang];

		store.set(langStorageVar, newLang);

		$scope.loadCollection(newLang);
	};


	// Load collection
	$scope.loadCollection = function(lang){
		$scope.collections = {};

		$http.get('collection_'+ lang +'.json').then(function successCallback(response){
			var data = response.data;

			angular.forEach(data, function(collection, key){
				$scope.collections[key] = collection;

				angular.forEach($scope.collections[key].books, function(entry){
					var owned = false;
					if ($scope.owned.indexOf(entry.id) !== -1) {
						owned = true;
					}

					angular.extend(entry, {
						collection: key,
						cover: "img/" + key + "/" + entry.id + ".jpg",
						owned: owned
					});
				});
			});
		});
	};


	$scope.toggleItem = function(item){
		var index = $scope.owned.indexOf(item);

		if (index !== -1) {
			$scope.owned.splice(index, 1);
		} else {
			$scope.owned.push(item);
		}

		store.set(ownedStorageVar, JSON.stringify($scope.owned));
	};


	// Load default configuration
	$http.get('config.json').then(function successCallback(response){
		$scope.config = response.data;

		$scope.owned 	= (store.get(ownedStorageVar) !== undefined) ? JSON.parse(store.get(ownedStorageVar)) : $scope.config.owned;
		store.set(ownedStorageVar, JSON.stringify($scope.owned));

		$scope.lang 	= (store.get(langStorageVar) !== undefined) ? store.get(langStorageVar) : $scope.config.lang;
		store.set(langStorageVar, $scope.lang);

		// Load lang and collection
		$scope.changeLang($scope.lang);
	});

});
