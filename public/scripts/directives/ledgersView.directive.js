
ckc.directive('ledgersView', ledgersView);

	/* @ngInject */
	function ledgersView() {
		//define the directive
		var directive = {
			restrict: "AECM",
			templateUrl: 'assets/views/ledgers-directive.htm',
			replace: true,
			scope: {},
			link: linkFunc,
			controller: ledgersViewController,
			controllerAs: 'vm',
			bindToController: true
		};

		/* @ngInject */
		function linkFunc(scope, el, attr, ctrl) {}
		
		ledgersViewController.$inject = ['$scope', '$log', '$firebaseObject'];

		/* @ngInject */
		function ledgersViewController($scope, $log, $firebaseObject) {
			//define local variables
			var self = this;
			var db = firebase.database();
			var ref = db.ref('/Merchants/-MVrZajcORbaTjkuZL2a/AssetAccts')
			self.accounts = $firebaseObject(ref);
            
            console.log('this is the ledger directive');

		};

		return directive;		
	};