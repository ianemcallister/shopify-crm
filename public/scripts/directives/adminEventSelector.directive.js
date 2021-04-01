
ckc.directive('adminEventSellector', adminEventSellector);

/* @ngInject */
function adminEventSellector() {
    //define the directive
    var directive = {
        restrict: "AECM",
        templateUrl: 'assets/views/adminEventSellector-directive.htm',
        replace: true,
        scope: {
            merchantId: "=",
            channelId: "=",
            seasonId: "=",
            eventId: "=",
            eventData: "="
        },
        link: linkFunc,
        controller: adminEventSellectorController,
        controllerAs: 'vm',
        bindToController: true
    };

    /* @ngInject */
    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch('eventWeek', function(newValue, oldValue) {
            //console.log('Season Name: ', scope.vm.seasonName);
            if(newValue) {
                Object.keys(scope.vm.events).forEach(function(key) {
                    if(scope.vm.events[key] != null) {
                        if(scope.vm.events[key].weekNum == newValue) {
                            scope.vm.eventId = key
                            scope.vm.eventData = scope.vm.events[key];
                        }
                    }  
                })
                //console.log(scope.channelId);
            }

        })
        scope.$watch('seasonId', function(newValue, oldValue) {
            //console.log('merchant ', scope.vm.merchant);
            if(scope.vm.seasonId != undefined) {
                var path = '/Merchants/' + scope.vm.merchantId + '/Events';
                //console.log('path: ', path);
                scope.vm.initFirebase(path);
            }
        });
    }
    
    adminEventSellectorController.$inject = ['$scope', '$log', '$firebaseObject'];

    /* @ngInject */
    function adminEventSellectorController($scope, $log, $firebaseObject) {
        //  NOTIFY PROGESS
        console.log('adminEventSellectorController');
        //define local variables
        $scope.eventWeek ="";
        var self = this;
        self.initFirebase = function(path) {
            console.log('init firebase', path);
            var db = firebase.database();
            var ref = db.ref(path).orderByChild('externalIds/seasonId').equalTo($scope.vm.seasonId);
            self.events = $firebaseObject(ref);
            console.log(self.events);
        };

    };

    return directive;		
};