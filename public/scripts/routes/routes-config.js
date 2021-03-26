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
        templateUrl: 'assets/views/adminDash-page.htm',     //  Landing Page View
        controller: 'adminDashController',                  //  Landing Page Controller
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

