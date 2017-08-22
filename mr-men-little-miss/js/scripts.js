// angular.module('myApp', ['ngAnimate']);
angular.module('myApp', []);


function CollectionController($scope, $http) {
	var ownedStorageVar = "mr-men-little-misses-owned";
	var langStorageVar 	= "mr-men-little-misses-lang";

	// Defaults
	$scope.lang 		= "en";
	$scope.appTitle 	= "Mr. Men & Little Misses";

	$scope.config 		= {};
	$scope.collection 	= {};
	$scope.owned 		= [];


	// Change language
	$scope.changeLang = function(newLang){
		$scope.lang 	= newLang;
		$scope.appTitle = $scope.config.title[newLang];

		store.set(langStorageVar, newLang);

		$scope.loadCollection(newLang);
	};


	// Load collection
	$scope.loadCollection = function(lang){
		$scope.collection = {};

		$http.get('collection_'+ lang +'.json').success(function(response){
			angular.forEach(response, function(subcollection, key){
				$scope.collection[key] = subcollection;

				angular.forEach($scope.collection[key].library, function(entry){
					if ($scope.owned.indexOf(entry.id) !== -1) {
						angular.extend(entry, { own: true });
					} else {
						angular.extend(entry, { own: false });
					}
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
	$http.get('config.json').success(function(response){
		$scope.config = response;

		$scope.owned 	= (store.get(ownedStorageVar) !== undefined) ? JSON.parse(store.get(ownedStorageVar)) : $scope.config.owned;
		store.set(ownedStorageVar, JSON.stringify($scope.owned));

		$scope.lang 	= (store.get(langStorageVar) !== undefined) ? store.get(langStorageVar) : $scope.config.lang;
		store.set(langStorageVar, $scope.lang);

		// Load lang and collection
		$scope.changeLang($scope.lang);
	});

}
