// angular.module('myApp', ['ngAnimate']);
angular.module('myApp', []);

function CollectionController($scope, $http) {
	var storageVar 		= "mr-men-little-misses-owned";

	// Defaults
	$scope.lang 		= "en";
	$scope.appTitle 	= "Mr. Men & Little Misses";
	$scope.config 		= {};
	$scope.collection 	= {};
	$scope.owned 		= [];


	// Change language
	$scope.changeLang = function($newLang){
		$scope.lang 	= $newLang;
		$scope.appTitle = $scope.config.title[$newLang];

		$scope.loadCollection();
	};


	// Load collection
	$scope.loadCollection = function(){
		$scope.collection = {};

		$http.get('collection_'+ $scope.lang +'.json').success(function(response){
			angular.forEach(response, function(collectionEntries, collectionKey){
				$scope.collection[collectionKey] = [];

				angular.forEach(collectionEntries, function(value){
					if ($scope.owned.indexOf(value.id) !== -1) {
						angular.extend(value, { own: true });
					} else {
						angular.extend(value, { own: false });
					}
					this.push(value);
				}, $scope.collection[collectionKey]);
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

		store.set(storageVar, JSON.stringify($scope.owned));
	};


	// Load default configuration
	$http.get('config.json').success(function(response){
		$scope.config = response;

		$scope.owned = (store.get(storageVar) !== undefined) ? JSON.parse(store.get(storageVar)) : $scope.config.owned;
		store.set(storageVar, JSON.stringify($scope.owned));

		// Load lang and collection
		$scope.changeLang(response.lang);
	});

}
