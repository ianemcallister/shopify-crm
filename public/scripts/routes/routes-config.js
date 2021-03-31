/*
*	ROUTES-CONFIG
*
*	This module sets up all the required angular routes for this web app.
*/
angular
    .module('ckc')
    .config(config);

/* @ngInject */
function config($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
    $routeProvider

	//PUBLIC ROUTES
    .when('/', {
        redirectTo: '/login'
    })
    .when('/login', {
        templateUrl: 'assets/views/login-page.htm',     //  Landing Page View
        controller: 'loginController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:teamId', {
        templateUrl: 'assets/views/teamDash-page.htm',     //  Landing Page View
        controller: 'teamDashController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:teamId/mobile_retail/reports/closing/:reportId', {
        templateUrl: 'assets/views/closingReport-page.htm',     //  Landing Page View
        controller: 'closingReportController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:teamId/warehouse/reports/mafg/:reportId', {
        templateUrl: 'assets/views/manufacturingReport-page.htm',     //  Landing Page View
        controller: 'manufacturingReportController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:teamId/warehouse/reports/inventory/:reportId', {
        templateUrl: 'assets/views/inventoryReport-page.htm',     //  Landing Page View
        controller: 'inventoryReportController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/admin', {
        templateUrl: 'assets/views/adminDash-page.htm',     //  Landing Page View
        controller: 'adminDashController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/admin/planning/:merchId', {
        templateUrl: 'assets/views/adminPlanning-page.htm',     //  Landing Page View
        controller: 'adminPlanningController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/admin/channels', {
        templateUrl: 'assets/views/adminChannels-page.htm',     //  Landing Page View
        controller: 'adminChannelsController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/admin/channel/:channelId', {
        templateUrl: 'assets/views/adminChannel-page.htm',     //  Landing Page View
        controller: 'adminChannelController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/admin/shifts/assign', {
        templateUrl: 'assets/views/admin-shiftsAssignment-page.htm',     //  Landing Page View
        controller: 'adminShiftAssignmentController',                  //  Landing Page Controller
        controllerAs: 'vm'
    }) 
    .when('/admin/shipping_orders/build', {
        templateUrl: 'assets/views/admin-buildShippingOrders-page.htm',     //  Landing Page View
        controller: 'adminBuildShippingOrdersController',                  //  Landing Page Controller
        controllerAs: 'vm'
    }) 
    .when('/admin/ledgers', {
        templateUrl: 'assets/views/admin-allLedgers-page.htm',     //  Landing Page View
        controller: 'adminAllLedgersController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })      
	.otherwise({
        redirectTo: '/'
    });
}

/*
*   REQUIRED FUNCTIONS
*
*/

