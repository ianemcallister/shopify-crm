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
    .when('/team/:memberId', {
        templateUrl: 'assets/views/teamDash-page.htm',     //  Landing Page View
        controller: 'teamDashController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:memberId/checklists/setup/:shippingReportId', {
        templateUrl: 'assets/views/team-setupChecklist-page.htm',     //  Landing Page View
        controller: 'teamSetupChecklistController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:memberId/checklists/closing/:shippingReportId', {
        templateUrl: 'assets/views/teamClosingChecklist-page.htm',     //  Landing Page View
        controller: 'teamClosingReportController',                  //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:memberId/reports/mfg/:mfgReportId', {
        templateUrl: 'assets/views/teamMfgReport-page.htm',     //  Landing Page View
        controller: 'teamMfgReportController',                  //  Landing Page Controller
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
    .when('/admin/planning/:merchId/:channelId/:seasonId/:eventId', {
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

