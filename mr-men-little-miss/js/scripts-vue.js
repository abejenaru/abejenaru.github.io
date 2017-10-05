var myApp = new Vue({
	el: '#app',

	data: {
		lang: "",
		title: "",
		collections: {},

		ownedStorageVar: "mr-men-little-misses-owned",
		langStorageVar: "mr-men-little-misses-lang",
		config: {},
		owned: []
	},


	created: function(){
		var vm = this;

		// Load default configuration
		axios.get('config.json').then(function success(response){
			vm.config 	= response.data;
			vm.owned 	= (store.get(vm.ownedStorageVar) !== undefined) ? JSON.parse(store.get(vm.ownedStorageVar)) : vm.config.owned;
			vm.lang 	= (store.get(vm.langStorageVar) !== undefined) ? store.get(vm.langStorageVar) : vm.config.lang;
		});
	},


	methods: {
		changeLang: function(newLang){
			this.lang 	= newLang;
			this.title 	= this.config.title[newLang];

			this.loadCollections(newLang);
		},

		loadCollections: function(lang){
			var vm = this;

			// Load collection info
			axios.get('collection_'+ lang +'.json').then(function success(response){
				var data = response.data;

				vm.collections = {};
				for (var key in data) {
					vm.collections[key] = data[key];

					for (var idx in vm.collections[key].books) {
						var entry = vm.collections[key].books[idx];

						vm.collections[key].books[idx].collection = key;
						vm.collections[key].books[idx].cover = "img/" + key + "/" + entry.id + ".jpg";

						if (vm.owned.indexOf(entry.id) !== -1) {
							vm.collections[key].books[idx].owned = true;
						} else {
							vm.collections[key].books[idx].owned = false;
						}
					}
				}
			});
		},

		toggleItem: function(item){
			var id = item.id;

			var ownedIdx = this.owned.indexOf(id);
			if (ownedIdx !== -1) {
				this.owned.splice(ownedIdx, 1);
			} else {
				this.owned.push(id);
			}

			// hacks for Object refresh
			var _collections = this.collections;
			for (var idx in _collections[item.collection].books) {
				if (_collections[item.collection].books[idx].id === id) {
					_collections[item.collection].books[idx].owned = !item.owned;
					break;
				}
			}
			this.collections = {};
			this.collections = _collections;
		},

		orderedBooks: function(books) {
			return _.sortBy(books, 'order');
		}
	},

	watch: {
		lang: function(newLang){
			this.changeLang(newLang);
			store.set(this.langStorageVar, newLang);
		},

		title: function(newTitle){
			document.title = this.title;
		},

		owned: function(val){
			store.set(this.ownedStorageVar, JSON.stringify(this.owned));
		}
	}
});
