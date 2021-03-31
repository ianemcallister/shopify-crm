
ckc.directive('adminChannelSellector', adminChannelSellector);

/* @ngInject */
function adminChannelSellector() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/adminChannelSellector-directive.htm',
        replace: true,
        scope: {
            merchant: "=",
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
            console.log(scope.vm.channels);
            if(newValue) {
                Object.keys(scope.vm.channels).forEach(function(key) {
                    if(scope.vm.channels[key] != null) {
                        if(scope.vm.channels[key].name == newValue) {
                            scope.vm.channelId = key
                        }
                    }  
                })
                console.log(scope.channelId);
            }

        })
    }
    
    adminChannelSellectorController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function adminChannelSellectorController($scope, $log, $firebaseObject) {
        //define local variables
        $scope.channelName ="";
        var self = this;
        var db = firebase.database();
        var path = '/Merchants/' + '-MVrZajcORbaTjkuZL2a' + '/Channels';
        var ref = db.ref(path);
        self.channels = $firebaseObject(ref);
        
        console.log('this is the admin channel sellector directive', path);

    };

    return directive;		
};