
ckc.directive('adminChannelSellector', adminChannelSellector);

/* @ngInject */
function adminChannelSellector() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/adminChannelSellector-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "="
        },
        link: linkFunc,
        controller: adminChannelSellectorController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch('channelName', function(newValue, oldValue) {
            //console.log(scope.vm.channels);
            if(newValue) {
                Object.keys(scope.vm.channels).forEach(function(key) {
                    if(scope.vm.channels[key] != null) {
                        if(scope.vm.channels[key].name == newValue) {
                            scope.vm.channelId = key
                        }
                    }  
                })
                //console.log(scope.channelId);
            }

        })
        scope.$watch('merchantId', function(newValue, oldValue) {
            //console.log('merchant ', scope.vm.merchant);
            if(scope.vm.merchantId != undefined) {
                var path = '/Merchants/' + scope.vm.merchantId + '/Channels';
                //console.log('path: ', path);
                scope.vm.initFirebase(path);
            }
        });
    }
    
    adminChannelSellectorController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function adminChannelSellectorController($scope, $log, $firebaseObject) {
        //define local variables
        $scope.channelName ="";
        var self = this;
        self.initFirebase = function(path) {
            console.log('init firebase', path);
            var db = firebase.database();
            var ref = db.ref(path);
            self.channels = $firebaseObject(ref);
        };

    };

    return directive;		
};