/**
 * stormpath-sdk-angularjs
 * Copyright Stormpath, Inc. 2016
 * 
 * @version v1.0.0-dev-2016-03-02
 * @link https://github.com/stormpath/stormpath-sdk-angularjs
 * @license Apache-2.0
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'stormpath';
}

(function (window, angular, undefined) {
'use strict';

/**
 * @ngdoc object
 *
 * @name stormpath.SpStateConfig:SpStateConfig
 *
 * @property {boolean} authenticate
 *
 * If `true`, the user must be authenticated in order to view this state.
 * If the user is not authenticated, they will
 * be redirected to the `login` state.  After they login, they will be redirected to
 * the state that was originally requested.
 *
 * @property {object} authorize
 *
 * An object that defines access control rules.  Currently, it supports a group-based
 * check.  See the example below.
 *
 * @property {boolean} waitForUser
 *
 * If `true`, delay the state transition until we know
 * if the user is authenticated or not.  This is useful for situations where
 * you want everyone to see this state, but the state may look different
 * depending on the user's authentication state.
 *
 *
 * @description
 *
 * The Stormpath State Config is an object that you can define on a UI Router
 * state.  Use this configuration to define access control for your routes, as
 * defined by UI Router.
 *
 * You will need to be using the UI Router module, and you need
 * to enable the integration by calling
 * {@link stormpath.$stormpath#methods_uiRouter $stormpath.uiRouter()} in your
 * application's config block.
 *
 * If you're using Angular's built-in `$routeProvider` instead of UI Router, please
 * use {@link stormpath.$stormpath#methods_ngRouter $stormpath.ngRouter()} instead.
 *
 * **NOTE:** Do not define this configuration on a abstract state, it must go on
 * the child state.  However, the controller of the abstract state will be
 * initialized AFTER any configuration rules of the child state have been met.
 *
 * @example
 *
 * <pre>
 *
 * angular.module('myApp')
 *   .config(function ($stateProvider) {
 *
 *     // Wait until we know if the user is logged in before showing the homepage
 *     $stateProvider
 *       .state('main', {
 *         url: '/',
 *         sp: {
 *           waitForUser: true
 *         }
 *       });
 *
 *     // Require a user to be authenticated in order to see this state
 *     $stateProvider
 *       .state('secrets', {
 *         url: '/secrets',
 *         controller: 'SecretsCtrl',
 *         sp: {
 *           authenticate: true
 *         }
 *       });
 *
 *     // Require a user to be in the admins group in order to see this state
 *     $stateProvider
 *       .state('secrets', {
 *         url: '/admin',
 *         controller: 'AdminCtrl',
 *         sp: {
 *           authorize: {
 *             group: 'admins'
 *           }
 *         }
 *       });
 * });
 * </pre>
 */

 /**
 * @ngdoc object
 *
 * @name stormpath.SpRouteConfig:SpRouteConfig
 *
 * @property {boolean} authenticate
 *
 * If `true`, the user must be authenticated in order to view this route.
 * If the user is not authenticated, they will
 * be redirected to the `login` route.  After they login, they will be redirected to
 * the route that was originally requested.
 *
 * @property {object} authorize
 *
 * An object that defines access control rules.  Currently, it supports a group-based
 * check.  See the example below.
 *
 * @property {boolean} waitForUser
 *
 * If `true`, delay the route transition until we know
 * if the user is authenticated or not.  This is useful for situations where
 * you want everyone to see this route, but the route may look different
 * depending on the user's authentication route.
 *
 *
 * @description
 *
 * The Stormpath Route Config is an object that you can define on a route.
 * Use this configuration to define access control for your routes, as
 * defined by the ngRoute module.
 *
 * You will need to be using the ngRoute module, and you need
 * to enable the integration by calling
 * {@link stormpath.$stormpath#methods_ngRouter $stormpath.ngRouter()} in your
 * application's config block.
 *
 * If you're using UI Router instead of Angular's built-in `$routeProvider`, please
 * use {@link stormpath.$stormpath#methods_uiRouter $stormpath.uiRouter()} instead.
 *
 * @example
 *
 * <pre>
 *
 * angular.module('myApp')
 *   .config(function ($routeProvider) {
 *     // Wait until we know if the user is logged in before showing the homepage
 *     $routeProvider
 *       .when('/main', {
*         controller: 'MainCtrl',
 *         sp: {
 *           waitForUser: true
 *         }
 *       });
 *
 *     // Require a user to be authenticated in order to see this route
 *     $routeProvider
 *       .when('/secrets', {
 *         controller: 'SecretsCtrl',
 *         sp: {
 *           authenticate: true
 *         }
 *       });
 *
 *     // Require a user to be in the admins group in order to see this route
 *     $routeProvider
 *       .when('/secrets', {
 *         controller: 'AdminCtrl',
 *         sp: {
 *           authorize: {
 *             group: 'admins'
 *           }
 *         }
 *       });
 * });
 * </pre>
 */
angular.module('stormpath', [
  'stormpath.CONFIG',
  'stormpath.auth',
  'stormpath.userService',
  'stormpath.viewModelService',
  'stormpath.socialLogin',
  'stormpath.facebookLogin',
  'stormpath.googleLogin'
])
.factory('SpAuthInterceptor',[function(){
  function SpAuthInterceptor(){

  }
  SpAuthInterceptor.prototype.request = function(config){
    config.withCredentials=true;
    return config;
  };

  return new SpAuthInterceptor();
}])
.factory('StormpathAgentInterceptor',['$window',function($window){
  function getLocation (href) {
    var l = $window.document.createElement('a');
    l.href = href;
    return l;
  }

  function StormpathAgentInterceptor(){

  }
  /**
   * Adds the X-Stormpath-Agent header, if the requested URL is on the same
   * domain as the current document.
   *
   * @param  {Object} config $http config object.
   * @return {Object} config $http config object.
   */
  StormpathAgentInterceptor.prototype.request = function(config){
    var a = getLocation(config.url);
    var b = $window.location;
    if (a.host === b.host){
      // The placeholders in the value are replaced by the `grunt dist` command.
      config.headers['X-Stormpath-Agent'] = 'stormpath-sdk-angularjs/1.0.0' + ' angularjs/' + angular.version.full;
    }
    return config;
  };

  return new StormpathAgentInterceptor();
}])
/**
 * Interceptor that intercepts Stormpath error responses and
 * translates them to errors. Adds backward-compatibility for
 * the error structure prior to the framework spec.
 */
.factory('StormpathErrorInterceptor',['$q', function($q){
  function StormpathErrorInterceptor(){
  }

  StormpathErrorInterceptor.prototype.responseError = function(response){
    var errorMessage = null;

    if (response.data) {
      errorMessage = response.data.message || response.data.error;
    }

    if (!errorMessage) {
      errorMessage = 'An error occured when communicating with the API server.';
    }

    var error = new Error(errorMessage);
    
    error.response = response;
    error.statusCode = response.status;

    return $q.reject(error);
  };

  return new StormpathErrorInterceptor();
}])
.config(['$httpProvider',function($httpProvider){
  $httpProvider.interceptors.push('SpAuthInterceptor');
  $httpProvider.interceptors.push('StormpathAgentInterceptor');
  $httpProvider.interceptors.push('StormpathErrorInterceptor');
}])
.provider('$stormpath', [function $stormpathProvider(){
  /**
   * @ngdoc object
   *
   * @name stormpath.$stormpath
   *
   * @description
   *
   * This service allows you to enable application-wide features of the library.
   *
   * At the moment the only feature is the UI Router integration, which is
   * documented below.
   */

  this.$get = [
    '$user', '$injector', 'STORMPATH_CONFIG', '$rootScope', '$location',
    function stormpathServiceFactory($user, $injector, STORMPATH_CONFIG, $rootScope, $location) {
      var $state;
      var $route;

      function StormpathService(){
        var encoder = new UrlEncodedFormParser();
        this.encodeUrlForm = encoder.encode.bind(encoder);

        if ($injector.has('$state')) {
          $state = $injector.get('$state');
        }

        if ($injector.has('$route')) {
          $route = $injector.get('$route');
        }

        return this;
      }
      function stateChangeUnauthenticatedEvent(toState, toParams){
        /**
         * @ngdoc event
         *
         * @name stormpath.$stormpath#$stateChangeUnauthenticated
         *
         * @eventOf stormpath.$stormpath
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @param {Object} toState The state that the user attempted to access.
         *
         * @param {Object} toParams The state params of the state that the user
         * attempted to access.
         *
         * @description
         *
         * This event is broadcast when a UI state change is prevented,
         * because the user is not logged in.
         *
         * Use this event if you want to implement your own strategy for
         * presenting the user with a login form.
         *
         * To receive this event, you must be using the UI Router integration.
         *
         * @example
         *
         * <pre>
         *   $rootScope.$on('$stateChangeUnauthenticated',function(e,toState,toParams){
         *     // Your custom logic for deciding how the user should login, and
         *     // if you want to redirect them to the desired state afterwards
         *   });
         * </pre>
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.STATE_CHANGE_UNAUTHENTICATED,toState,toParams);
      }
      function stateChangeUnauthorizedEvent(toState,toParams){
        /**
         * @ngdoc event
         *
         * @name stormpath.$stormpath#$stateChangeUnauthorized
         *
         * @eventOf stormpath.$stormpath
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @param {Object} toState The state that the user attempted to access.
         *
         * @param {Object} toParams The state params of the state that the user
         * attempted to access.
         *
         * @description
         *
         * This event is broadcast when a UI state change is prevented,
         * because the user is not authorized by the rules defined in the
         * {@link stormpath.SpStateConfig:SpStateConfig Stormpath State Configuration}
         * for the requested state.
         *
         * Use this event if you want to implement your own strategy for telling
         * the user that they are forbidden from viewing that state.
         *
         * To receive this event, you must be using the UI Router integration.
         *
         * @example
         *
         * <pre>
         *   $rootScope.$on('$stateChangeUnauthorized',function(e,toState,toParams){
         *     // Your custom logic for deciding how the user should be
         *     // notified that they are forbidden from this state
         *   });
         * </pre>
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.STATE_CHANGE_UNAUTHORIZED,toState,toParams);
      }
      StormpathService.prototype.stateChangeInterceptor = function stateChangeInterceptor(config) {
        $rootScope.$on('$stateChangeStart', function(e,toState,toParams){
          var sp = toState.sp || {}; // Grab the sp config for this state

          if((sp.authenticate || sp.authorize) && (!$user.currentUser)){
            e.preventDefault();
            $user.get().then(function(){
              // The user is authenticated, continue to the requested state
              if(sp.authorize){
                if(authorizeStateConfig(sp)){
                  $state.go(toState.name,toParams);
                }else{
                  stateChangeUnauthorizedEvent(toState,toParams);
                }
              }else{
                $state.go(toState.name,toParams);
              }
            },function(){
              // The user is not authenticated, emit the necessary event
              stateChangeUnauthenticatedEvent(toState,toParams);
            });
          }else if(sp.waitForUser && ($user.currentUser===null)){
            e.preventDefault();
            $user.get().finally(function(){
              $state.go(toState.name,toParams);
            });
          }
          else if($user.currentUser && sp.authorize){
            if(!authorizeStateConfig(sp)){
              e.preventDefault();
              stateChangeUnauthorizedEvent(toState,toParams);
            }
          }else if(toState.name===config.loginState){
            /*
              If the user is already logged in, we will redirect
              away from the login page and send the user to the
              post login state.
             */
            if($user.currentUser!==false){
              e.preventDefault();
              $user.get().finally(function(){
                if($user.currentUser && $user.currentUser.href){
                  $state.go(config.defaultPostLoginState);
                } else {
                  $state.go(toState.name,toParams);
                }
              });
            }
          }
        });
      };

      function authorizeStateConfig(spStateConfig){
        var sp = spStateConfig;
        if(sp && sp.authorize && sp.authorize.group) {
          return $user.currentUser.inGroup(sp.authorize.group);
        }else{
          console.error('Unknown authorize configuration for spStateConfig',spStateConfig);
          return false;
        }

      }

      function routeChangeUnauthenticatedEvent(toRoute) {
        /**
         * @ngdoc event
         *
         * @name stormpath.$stormpath#$routeChangeUnauthenticated
         *
         * @eventOf stormpath.$stormpath
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @param {Object} toRoute The route that the user attempted to access.
         *
         * @description
         *
         * This event is broadcast when a route change is prevented,
         * because the user is not logged in.
         *
         * Use this event if you want to implement your own strategy for
         * presenting the user with a login form.
         *
         * To receive this event, you must be using the ngRoute module.
         *
         * @example
         *
         * <pre>
         *   $rootScope.$on('$routeChangeUnauthenticated', function(event, toRoute) {
         *     // Your custom logic for deciding how the user should login, and
         *     // if you want to redirect them to the desired route afterwards
         *   });
         * </pre>
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.ROUTE_CHANGE_UNAUTHENTICATED, toRoute);
      }

      function routeChangeUnauthorizedEvent(toRoute) {
        /**
         * @ngdoc event
         *
         * @name stormpath.$stormpath#$routeChangeUnauthorized
         *
         * @eventOf stormpath.$stormpath
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @param {Object} toRoute The route that the user attempted to access.
         *
         * @description
         *
         * This event is broadcast when a route change is prevented,
         * because the user is not authorized by the rules defined in the
         * {@link stormpath.SpRouteConfig:SpRouteConfig Stormpath Route Configuration}
         * for the requested route.
         *
         * Use this event if you want to implement your own strategy for telling
         * the user that they are forbidden from viewing that route.
         *
         * To receive this event, you must be using the ngRoute module.
         *
         * @example
         *
         * <pre>
         *   $rootScope.$on('$routeChangeUnauthorized', function(event, toRoute) {
         *     // Your custom logic for deciding how the user should be
         *     // notified that they are forbidden from this route
         *   });
         * </pre>
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.ROUTE_CHANGE_UNAUTHORIZED, toRoute);
      }

      StormpathService.prototype.routeChangeInterceptor = function routeChangeInterceptor(config) {
        function goToRoute(route) {
          setTimeout(function() {
            if (route.$$route.originalPath === $location.path()) {
              $route.reload();
            } else {
              $location.path(route);
            }
          });
        }

        $rootScope.$on('$routeChangeStart', function(event, toRoute) {
          if (!toRoute.$$route) {
            return;
          }

          var sp = toRoute.$$route.sp || {}; // Grab the sp config for this route

          if ((sp.authenticate || sp.authorize) && !$user.currentUser) {
            event.preventDefault();

            $user.get().then(function() {
              // The user is authenticated, continue to the requested route
              if (sp.authorize) {
                if (authorizeStateConfig(sp)) {
                  goToRoute(toRoute);
                } else {
                  stateChangeUnauthorizedEvent(toRoute);
                }
              } else {
                goToRoute(toRoute);
              }
            }, function() {
              // The user is not authenticated, emit the necessary event
              routeChangeUnauthenticatedEvent(toRoute);
            });
          } else if (sp.waitForUser && $user.currentUser === null) {
            event.preventDefault();

            $user.get().finally(function() {
              goToRoute(toRoute);
            });
          } else if ($user.currentUser && sp.authorize) {
            if (!authorizeStateConfig(sp)) {
              event.preventDefault();
              routeChangeUnauthorizedEvent(toRoute);
            }
          } else if (toRoute.$$route.originalPath === config.loginRoute) {
            /*
              If the user is already logged in, we will redirect
              away from the login page and send the user to the
              post login route.
             */
            if ($user.currentUser && $user.currentUser.href) {
              event.preventDefault();
              goToRoute(config.defaultPostLoginRoute);
            }
          }
        });
      };

      function authorizeRouteConfig(spRouteConfig) {
        var sp = spRouteConfig;

        if (sp && sp.authorize && sp.authorize.group) {
          return $user.currentUser.inGroup(sp.authorize.group);
        }

        console.error('Unknown authorize configuration for spRouteConfig', sp);
        return false;
      }

      /**
       * @ngdoc function
       *
       * @name stormpath#uiRouter
       *
       * @methodOf stormpath.$stormpath
       *
       * @param {object} config
       *
       * * **`autoRedirect`** - Defaults to true.  After the user logs in at
       * the state defined by `loginState`, they will be redirected back to the
       * state that was originally requested.
       *
       * * **`defaultPostLoginState`**  - Where the user should be sent, after login,
       * if they have visited the login page directly.  If you do not define a value,
       * nothing will happen at the login state.  You can alternatively use the
       * {@link stormpath.authService.$auth#events_$authenticated $authenticated} event to know
       * that login is successful.
       *
       * * **`forbiddenState`** - The UI state name that we should send the user
       * to if they try to an access a view that they are not authorized to view.
       * This happens in response to an `authorize` rule in one of your
       * {@link stormpath.SpStateConfig:SpStateConfig Stormpath State Configurations}
       *
       * * **`loginState`** - The UI state name that we should send the user
       * to if they need to login.  You'll probably use `login` for this value.
       *
       * @description
       *
       * Call this method to enable the integration with the UI Router module.
       *
       * When enabled, you can define {@link stormpath.SpStateConfig:SpStateConfig Stormpath State Configurations} on your UI states.
       * This object allows you to define access control for the state.
       *
       * You can pass config options to this integration, the options control the
       * default behavior around "need to login" and "forbidden" situations.
       * If you wish to implement your own logic for these situations, simply
       * omit the options and use the events (documented below) to know
       * what is happening in the application.
       *
       * @example
       *
       * <pre>
       * angular.module('myApp')
       *   .run(function($stormpath){
       *     $stormpath.uiRouter({
       *       forbiddenState: 'forbidden',
       *       defaultPostLoginState: 'main',
       *       loginState: 'login'
       *     });
       *   });
       * </pre>
       */
      StormpathService.prototype.uiRouter = function uiRouter(config){
        var self = this;
        config = typeof config === 'object' ? config : {};
        this.stateChangeInterceptor(config);

        if(config.loginState){
          self.unauthenticatedWather = $rootScope.$on(STORMPATH_CONFIG.STATE_CHANGE_UNAUTHENTICATED,function(e,toState,toParams){
            self.postLogin = {
              toState: toState,
              toParams: toParams
            };
            $state.go(config.loginState);
          });
        }

        $rootScope.$on(STORMPATH_CONFIG.AUTHENTICATION_SUCCESS_EVENT_NAME,function(){
          if(self.postLogin && (config.autoRedirect !== false)){
            $state.go(self.postLogin.toState,self.postLogin.toParams).then(function(){
              self.postLogin = null;
            });
          }else if(config.defaultPostLoginState){
            $state.go(config.defaultPostLoginState);
          }
        });

        if(config.forbiddenState){
          self.forbiddenWatcher = $rootScope.$on(STORMPATH_CONFIG.STATE_CHANGE_UNAUTHORIZED,function(){
            $state.go(config.forbiddenState);
          });
        }
      };

      /**
       * @ngdoc function
       *
       * @name stormpath#ngRouter
       *
       * @methodOf stormpath.$stormpath
       *
       * @param {object} config
       *
       * * **`autoRedirect`** - Defaults to true.  After the user logs in at
       * the route defined by `loginRoute`, they will be redirected back to the
       * route that was originally requested.
       *
       * * **`defaultPostLoginRoute`**  - Where the user should be sent, after login,
       * if they have visited the login page directly.  If you do not define a value,
       * nothing will happen at the login route.  You can alternatively use the
       * {@link stormpath.authService.$auth#events_$authenticated $authenticated} event to know
       * that login is successful.
       *
       * * **`forbiddenRoute`** - The route that we should send the user
       * to if they try to an access a view that they are not authorized to view.
       * This happens in response to an `authorize` rule in one of your
       * {@link stormpath.SpRouteConfig:SpRouteConfig Stormpath Route Configurations}
       *
       * * **`loginRoute`** - The route name that we should send the user
       * to if they need to login.  You'll probably use `login` for this value.
       *
       * @description
       *
       * Call this method to enable the integration with the ngRoute module.
       *
       * When enabled, you can define {@link stormpath.SpRouteConfig:SpRouteConfig Stormpath Route Configurations} on your routes.
       * This object allows you to define access control for the route.
       *
       * You can pass config options to this integration, the options control the
       * default behavior around "need to login" and "forbidden" situations.
       * If you wish to implement your own logic for these situations, simply
       * omit the options and use the events (documented below) to know
       * what is happening in the application.
       *
       * @example
       *
       * <pre>
       * angular.module('myApp')
       *   .run(function($stormpath){
       *     $stormpath.ngRouter({
       *       forbiddenRoute: '/forbidden',
       *       defaultPostLoginRoute: '/home',
       *       loginRoute: '/login'
       *     });
       *   });
       * </pre>
       */
      StormpathService.prototype.ngRouter = function ngRouter(config) {
        var self = this;

        config = typeof config === 'object' ? config : {};

        this.routeChangeInterceptor(config);

        if (config.loginRoute) {
          this.unauthenticatedWather = $rootScope.$on(STORMPATH_CONFIG.ROUTE_CHANGE_UNAUTHENTICATED, function(event, toRoute) {
            self.postLogin = {
              toRoute: toRoute
            };

            $location.path(config.loginRoute);
          });
        }

        $rootScope.$on(STORMPATH_CONFIG.AUTHENTICATION_SUCCESS_EVENT_NAME, function() {
          if (self.postLogin && config.autoRedirect !== false) {
            $location.path(self.postLogin.toRoute);
            self.postLogin = null;
          } else if (config.defaultPostLoginRoute) {
            $location.path(config.defaultPostLoginRoute);
          }
        });

        if (config.forbiddenRoute) {
          this.forbiddenWatcher = $rootScope.$on(STORMPATH_CONFIG.ROUTE_CHANGE_UNAUTHORIZED, function() {
            $location.path(config.forbiddenRoute);
          });
        }
      };

      StormpathService.prototype.regexAttrParser = function regexAttrParser(value){
        var expr;
        if(value instanceof RegExp){
          expr = value;
        }else if(value && /^\/.+\/[gim]?$/.test(value)){
          expr = new RegExp(value.split('/')[1],value.split('/')[2]);
        }else{
          expr = value;
        }
        return expr;
      };

      function UrlEncodedFormParser(){

        // Copy & modify from https://github.com/hapijs/qs/blob/master/lib/stringify.js

        this.delimiter = '&';
        this.arrayPrefixGenerators = {
          brackets: function (prefix) {
            return prefix + '[]';
          },
          indices: function (prefix, key) {
            return prefix + '[' + key + ']';
          },
          repeat: function (prefix) {
            return prefix;
          }
        };
        return this;
      }
      UrlEncodedFormParser.prototype.stringify = function stringify(obj, prefix, generateArrayPrefix) {

        if (obj instanceof Date) {
          obj = obj.toISOString();
        }
        else if (obj === null) {
          obj = '';
        }

        if (typeof obj === 'string' ||
          typeof obj === 'number' ||
          typeof obj === 'boolean') {

          return [encodeURIComponent(prefix) + '=' + encodeURIComponent(obj)];
        }

        var values = [];

        if (typeof obj === 'undefined') {
          return values;
        }

        var objKeys = Object.keys(obj);
        for (var i = 0, il = objKeys.length; i < il; ++i) {
          var key = objKeys[i];
          if (Array.isArray(obj)) {
            values = values.concat(this.stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix));
          }
          else {
            values = values.concat(this.stringify(obj[key], prefix + '[' + key + ']', generateArrayPrefix));
          }
        }

        return values;
      };
      UrlEncodedFormParser.prototype.encode = function encode(obj, options) {

        options = options || {};
        var delimiter = typeof options.delimiter === 'undefined' ? this.delimiter : options.delimiter;

        var keys = [];

        if (typeof obj !== 'object' ||
          obj === null) {

          return '';
        }

        var arrayFormat;
        if (options.arrayFormat in this.arrayPrefixGenerators) {
          arrayFormat = options.arrayFormat;
        }
        else if ('indices' in options) {
          arrayFormat = options.indices ? 'indices' : 'repeat';
        }
        else {
          arrayFormat = 'indices';
        }

        var generateArrayPrefix = this.arrayPrefixGenerators[arrayFormat];

        var objKeys = Object.keys(obj);
        for (var i = 0, il = objKeys.length; i < il; ++i) {
          var key = objKeys[i];
          keys = keys.concat(this.stringify(obj[key], key, generateArrayPrefix));
        }

        return keys.join(delimiter);
      };

      return new StormpathService();
    }
  ];
}])
.run(['$rootScope','$user','STORMPATH_CONFIG',function($rootScope,$user,STORMPATH_CONFIG){
  $rootScope.user = $user.currentUser || null;
  $user.get().finally(function(){
    $rootScope.user = $user.currentUser;
  });
  $rootScope.$on(STORMPATH_CONFIG.GET_USER_EVENT,function(){
    $rootScope.user = $user.currentUser;
  });
  $rootScope.$on(STORMPATH_CONFIG.SESSION_END_EVENT,function(){
    $rootScope.user = $user.currentUser;
  });
}])

/**
 * @ngdoc directive
 *
 * @name stormpath.ifUser:ifUser
 *
 * @description
 *
 * Use this directive to conditionally show an element if the user is logged in.
 *
 * @example
 *
 * <pre>
 * <div class="container">
 *   <h3 if-user>Hello, {{user.fullName}}</h3>
 * </div>
 * </pre>
 */
.directive('ifUser',['$user','$rootScope',function($user,$rootScope){
  return {
    link: function(scope,element){
      $rootScope.$watch('user',function(user){
        if(user && user.href){
          element.removeClass('ng-hide');
        }else{
          element.addClass('ng-hide');
        }
      });
    }
  };
}])

/**
 * @ngdoc directive
 *
 * @name stormpath.ifNotUser:ifNotUser
 *
 * @description
 *
 * Use this directive to conditionally show an element if the user is NOT logged in.
 *
 * @example
 *
 * <pre>
 * <div class="container">
 *   <h3 if-not-user>Hello, you need to login</h3>
 * </div>
 * </pre>
 */
.directive('ifNotUser',['$user','$rootScope',function($user,$rootScope){
  return {
    link: function(scope,element){
      $rootScope.$watch('user',function(user){
        if(user && user.href){
          element.addClass('ng-hide');
        }else{
          element.removeClass('ng-hide');
        }
      });
    }
  };
}])

/**
 * @ngdoc directive
 *
 * @name stormpath.ifUserInGroup:ifUserInGroup
 *
 * @description
 *
 * Use this directive to conditionally show an element if the user is logged in
 * and is a member of the group that is specified by the expression.
 *
 * The attribute value MUST be one of:
 *
 * * A string expression, surrounded by quotes
 * * A reference to a property on the $scope.  That property can be a string or
 * regular expression.
 *
 * **Note**: This feature depends on the data that is returned by the
 * {@link api/stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG#properties_CURRENT_USER_URI CURRENT_USER_URI}.
 * Your server should expand the account's groups before returning the user.
 * If you are using [express-stormpath](https://github.com/stormpath/express-stormpath), simply use
 * [Automatic Expansion](http://docs.stormpath.com/nodejs/express/latest/user_data.html#automatic-expansion)
 *
 * # Using Regular Expressions
 *
 * If using a string expression as the attribute value, you can pass a regular
 * expression by wrapping it in the literal
 * syntax, e.g.
 *  * `'/admins/'` would match any group which has *admins* in the name
 *  * `'/admin$/'` would match any group were the name **ends with** *admin*
 *
 * If referencing a scope property, you should create the value as a RegExp type,
 * e.g.:
 *
 *  <pre>
 *    $scope.matchGroup = new RegExp(/admins/);
 *  </pre>
 *
 * All regular expressions are evaluated via
 * [RegExp.prototype.test](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)
 *
 * @example
 *
 * <pre>
 *   <script type="text/javascript">
 *     function SomeController($scope){
 *       $scope.matchGroup = /admins/;
 *     }
 *   <script>
 *   <div ng-controller="SomeController">
 *     <h3 if-user-in-group="'admins'">
 *       Hello, {{user.fullName}}, you are an administrator
 *     </h3>
 *
 *     <div if-user-in-group="'/admins/'">
 *        <!-- would match any group which has *admins* in the name -->
 *     </div>
 *     <div if-user-in-group="matchGroup">
 *        <!-- equivalent to the last example -->
 *     </div>
 *     <div if-user-in-group="'/admin$/'">
 *        <!-- would match any group were the name **ends with** *admin* -->
 *     </div>
 *   </div>
 * </pre>
 */
.directive('ifUserInGroup',['$user','$rootScope','$parse','$stormpath',function($user,$rootScope,$parse,$stormpath){

  return {
    link: function(scope,element,attrs){

      var expr;
      var attrExpr = attrs.ifUserInGroup;

      function evalElement(){
        var user = $user.currentUser;
        if(user && user.groupTest(expr || attrExpr)){
          element.removeClass('ng-hide');
        }else{
          element.addClass('ng-hide');
        }
      }

      if(attrExpr){
        scope.$watch($parse(attrExpr),function(value){
          expr = $stormpath.regexAttrParser(value);
          evalElement();
        });
        $rootScope.$watch('user',function(){
          evalElement();
        });
      }
    }
  };
}])

/**
 * @ngdoc directive
 *
 * @name stormpath.ifUserNotInGroup:ifUserNotInGroup
 *
 * @description
 *
 * Use this directive to conditionally show an element if the user is logged in
 * and is NOT a member of the group that is specified by the expression.
 *
 * This is the inverse of {@link stormpath.ifUserInGroup:ifUserInGroup ifUserInGroup},
 * please refer to that directive for full usage information.
 *
 * **Note**: This feature depends on the data that is returned by the
 * {@link api/stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG#properties_CURRENT_USER_URI CURRENT_USER_URI}.
 * Your server should expand the account's groups before returning the user.
 * If you are using [express-stormpath](https://github.com/stormpath/express-stormpath), simply use
 * [Automatic Expansion](http://docs.stormpath.com/nodejs/express/latest/user_data.html#automatic-expansion)
 *
 * @example
 *
 * <pre>
 *   <div class="container">
 *     <h3 if-user-not-in-group="'admins'">
 *       Hello, {{user.fullName}}, please request administrator access
 *     </h3>
 *   </div>
 * </pre>
 */
.directive('ifUserNotInGroup',['$user','$rootScope','$parse','$stormpath',function($user,$rootScope,$parse,$stormpath){
  return {
    link: function(scope,element,attrs){

      var expr;
      var attrExpr = attrs.ifUserNotInGroup;

      function evalElement(){
        var user = $user.currentUser;
        if(user && user.groupTest(expr || attrExpr)){
          element.addClass('ng-hide');
        }else{
          element.removeClass('ng-hide');
        }
      }

      if(attrExpr){
        scope.$watch($parse(attrExpr),function(value){
          expr = $stormpath.regexAttrParser(value);
          evalElement();
        });
        $rootScope.$watch('user',function(){
          evalElement();
        });
      }
    }
  };
}])

/**
 * @ngdoc directive
 *
 * @name stormpath.whileResolvingUser:while-resolving-user
 *
 * @description
 *
 * # [DEPRECATED]
 * Please use {@link stormpath.ifUserStateUnknown:ifUserStateUnknown ifUserStateUnknown} instead.
 *
 */
.directive('whileResolvingUser',['$user','$rootScope',function($user,$rootScope){
  return {
    link: function(scope,element){
      $rootScope.$watch('user',function(){
        if($user.currentUser || ($user.currentUser===false)){
          element.addClass('ng-hide');
        }else{
          element.removeClass('ng-hide');
        }
      });
    }
  };
}])
/**
 * @ngdoc directive
 *
 * @name stormpath.ifUserStateKnown:ifUserStateKnown
 *
 * @description
 *
 * Use this directive to show an element once the user state is known.
 * The inverse of {@link stormpath.ifUserStateUnknown:ifUserStateUnknown ifUserStateUnknown}. You can
 * use this directive to show an element after we know if the user is logged in
 * or not.
 *
 * @example
 *
 * <pre>
 * <div if-user-state-known>
 *   <li if-not-user>
 *      <a ui-sref="login">Login</a>
 *    </li>
 *    <li if-user>
 *        <a ui-sref="main" sp-logout>Logout</a>
 *    </li>
 * </div>
 * </pre>
 */
.directive('ifUserStateKnown',['$user','$rootScope',function($user,$rootScope){
  return {
    link: function(scope,element){
      $rootScope.$watch('user',function(){
        if($user.currentUser || ($user.currentUser===false)){
          element.removeClass('ng-hide');
        }else{
          element.addClass('ng-hide');
        }
      });
    }
  };
}])
/**
 * @ngdoc directive
 *
 * @name stormpath.ifUserStateUnknown:ifUserStateUnknown
 *
 * @description
 *
 * Use this directive to show an element while waiting to know if the user
 * is logged in or not.  This is useful if you want to show a loading graphic
 * over your application while you are waiting for the user state.
 *
 * @example
 *
 * <pre>
 * <div if-user-state-unknown>
 *   <p>Loading.. </p>
 * </div>
 * </pre>
 */
.directive('ifUserStateUnknown',['$user','$rootScope',function($user,$rootScope){
  return {
    link: function(scope,element){
      $rootScope.$watch('user',function(){
        if($user.currentUser === null){
          element.removeClass('ng-hide');
        }else{
          element.addClass('ng-hide');
        }
      });
    }
  };
}])

/**
 * @ngdoc directive
 *
 * @name stormpath.spLogout:spLogout
 *
 * @description
 *
 * This directive adds a click handler to the element.  When clicked, the user will be logged out.
 *
 * **Note**: the click action triggers the logout request to the server and
 * deletes your authentication information, it does not automatically redirect
 * you to any view (we leave this in your control).
 *
 * The common use-case is to redirect users to the login view after they
 * logout.  This can be done by observing the
 * {@link stormpath.authService.$auth#events_$sessionEnd $sessionEnd} event.
 * For example, if you are using UI Router:
 *
 * ```javascript
 * $rootScope.$on('$sessionEnd',function () {
 *   $state.transitionTo('login');
 * });
 * ```
 *
 * @example
 *
 * <pre>
 *   <a ui-sref="main" sp-logout>Logout</a>
 * </pre>
 */
.directive('spLogout',['$auth',function($auth){
  return{
    link: function(scope,element){
      element.on('click',function(){
        $auth.endSession();
      });
    }
  };
}]);

'use strict';
/**
 * @ngdoc overview
 *
 * @name  stormpath.authService
 *
 * @description
 *
 * This module provides the {@link stormpath.authService.$auth $auth} service.
 *
 * Currently, this provider does not have any configuration methods.
 */
/**
 * @ngdoc object
 *
 * @name stormpath.authService.$authProvider
 *
 * @description
 *
 * Provides the {@link stormpath.authService.$auth $auth} service.
 *
 * Currently, this provider does not have any configuration methods.
 */
angular.module('stormpath.auth',['stormpath.CONFIG'])
.config(['$injector','STORMPATH_CONFIG',function $authProvider($injector,STORMPATH_CONFIG){
  /**
   * @ngdoc object
   *
   * @name stormpath.authService.$auth
   *
   * @description
   *
   * The auth service provides methods for authenticating a user, aka
   * "logging in" the user.
   */
  var authServiceProvider = {
    $get: ['$http','$user','$rootScope','$spFormEncoder',function authServiceFactory($http,$user,$rootScope,$spFormEncoder){

      function AuthService(){
        return this;
      }
      AuthService.prototype.authenticate = function authenticate(data) {
        /**
         * @ngdoc function
         *
         * @name  stormpath.authService.$auth#authenticate
         *
         * @methodOf stormpath.authService.$auth
         *
         * @param {Object} credentialData
         *
         * An object literal for passing username & password, or social provider
         * token.
         *
         * @returns {promise}
         *
         * A promise that is resolved with the authentication response or error
         * response (both are response objects from the $http service).
         *
         * @description
         *
         * Logs the user in.
         *
         * Sends the provided credential data to your backend server. The server
         * handler should verify the credentials and return an access token,
         * which is stored in an HTTP-only cookie.
         *
         * @example
         *
         * ## Username & Password example
         *
         * <pre>
         * myApp.controller('LoginCtrl', function ($scope, $auth, $state) {
         *   $scope.errorMessage = null;
         *   $scope.formData = {
         *     username: '',         // Expose to user as email/username field
         *     password: '',
         *   };
         *
         *   // Use this method with ng-submit on your form
         *   $scope.login = function login(formData){
         *     $auth.authenticate(formData)
         *      .then(function(){
         *        console.log('login success');
         *        $state.go('home');
         *      })
         *      .catch(function(err){
         *        $scope.errorMessage = err.message;
         *      });
         *   }
         *
         * });
         * </pre>
         *
         * ## Social Login example
         *
         * <pre>
         * myApp.controller('LoginCtrl', function ($scope, $auth, $state) {
         *   $scope.errorMessage = null;
         *   $scope.formData = {
         *     providerId: 'facebook',         // Get access token from FB sdk login
         *     accessToken: 'CABTmZxAZBxBADbr1l7ZCwHpjivBt9T0GZBqjQdTmgyO0OkUq37HYaBi4F23f49f5',
         *   };
         *
         *   // Use this method with ng-submit on your form
         *   $scope.login = function login(formData){
         *     $auth.authenticate(formData)
         *      .then(function(){
         *        console.log('login success');
         *        $state.go('home');
         *      })
         *      .catch(function(err){
         *        $scope.errorMessage = err.message;
         *      });
         *   }
         *
         * });
         * </pre>
         */
        var op = $http($spFormEncoder.formPost({
            url: STORMPATH_CONFIG.getUrl('AUTHENTICATION_ENDPOINT'),
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            withCredentials: true,
            data: data
          })
        );
        var op2 = op.then(cacheCurrentUser).then(authenticatedEvent);
        op.catch(authenticationFailureEvent);
        return op2;

      };

      /**
       * @ngdoc event
       *
       * @name stormpath.authService.$user#$sessionEnd
       *
       * @eventOf stormpath.authService.$auth
       *
       * @eventType broadcast on root scope
       *
       * @param {Object} event
       *
       * Angular event object.

       * @description
       *
       * This event is broadcast when a call to
       * {@link stormpath.authService.$auth#methods_endSession $auth.endSession()}
       * is successful.  Use this event when you want to do something after the
       * user has logged out.
       */
      function endSessionEvent () {
        $rootScope.$broadcast(STORMPATH_CONFIG.SESSION_END_EVENT);
      }

      /**
       * @ngdoc function
       *
       * @name stormpath.authService.$auth#endSession
       *
       * @methodOf stormpath.authService.$auth
       *
       * @return {promise} A promise that is resolved when the logout request
       * of the server is complete.
       *
       * @description Use this method to log the user out. It triggers a request
       * to the `/logout` endpoint on the server.  This will delete the cookies
       * that are used for authentication.  The
       * {@link stormpath.authService.$auth#events_$sessionEnd $sessionEnd}
       * event will be emitted after a successful logout.
       */
      AuthService.prototype.endSession = function endSession(){
        var op = $http.post(STORMPATH_CONFIG.getUrl('DESTROY_SESSION_ENDPOINT'), null, {
            headers: {
                'Accept': 'application/json'
            }
        });

        op.then(function(){
          endSessionEvent();
        },function(response){
          console.error('logout error',response);
        });

        return op;
      };

      function cacheCurrentUser(){
        return $user.get();
      }

      function authenticatedEvent(response){
        /**
         * @ngdoc event
         *
         * @name stormpath.authService.$auth#$authenticated
         *
         * @eventOf stormpath.authService.$auth
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @param {httpResponse} httpResponse
         *
         * The http response from the $http service.  If you are writing your access tokens to the response body
         * when a user authenticates, you will want to use this response object to get access to that token.
         *
         * @description
         *
         * This event is broadcast when a call to
         * {@link stormpath.authService.$auth#methods_authenticate $auth.authenticate()}
         * is successful.
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.AUTHENTICATION_SUCCESS_EVENT_NAME,response);
      }
      function authenticationFailureEvent(response){
        $rootScope.$broadcast(STORMPATH_CONFIG.AUTHENTICATION_FAILURE_EVENT_NAME,response);
      }
      return new AuthService();
    }]
  };

  $injector.get('$provide')
    .provider(STORMPATH_CONFIG.AUTH_SERVICE_NAME,authServiceProvider);

}]);

'use strict';

/**
* @ngdoc object
*
* @name stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
*
* @description
*
* This constant allows you to configure the internal settings of the module,
* such as authentication endpoints and the names of events. These properties
* must be modified within a config block.
*
* **Example:**
* <pre>
*     angular.module('myapp')
*       .config(function(STORMPATH_CONFIG){
*           STORMPATH_CONFIG.ENDPOINT_PREFIX = 'http://api.mydomain.com';
*       });
* </pre>
*/

angular.module('stormpath.CONFIG',[])
.constant('STORMPATH_CONFIG',(function stormpathConfigBuilder(){
  var c={
    /**
    * @ngdoc property
    *
    * @name AUTHENTICATION_SUCCESS_EVENT_NAME
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$authenticated`
    *
    * The name of the event that is fired when a user logs in, after
    * successfully submitting the login form.
    *
    */
    AUTHENTICATION_SUCCESS_EVENT_NAME: '$authenticated',


    /**
    * @ngdoc property
    *
    * @name AUTHENTICATION_FAILURE_EVENT_NAME
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$authenticationFailure`
    *
    * The name of the event that is fired when the user posts
    * invalid login credentials to the login form.
    */
    AUTHENTICATION_FAILURE_EVENT_NAME: '$authenticationFailure',


    /**
    * @ngdoc property
    *
    * @name AUTH_SERVICE_NAME
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$auth`
    *
    * The name of the authentication service, this changes the
    * service name that you inject.
    */
    AUTH_SERVICE_NAME: '$auth',


    /**
    * @ngdoc property
    *
    * @name SOCIAL_LOGIN_SERVICE_NAME
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$socialLogin`
    *
    * The name of the social login service, this changes the
    * service name that you inject.
    */
    SOCIAL_LOGIN_SERVICE_NAME: '$socialLogin',


    /**
    * @ngdoc property
    *
    * @name AUTHENTICATION_ENDPOINT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `/login`
    *
    * The URI that the login form will post to.  The endpoint MUST accept data
    * in the following format:
    *
    * ```
    * {
    *     username: '',
    *     password: ''
    * }
    * ```
    */
    AUTHENTICATION_ENDPOINT: '/login',


    /**
    * @ngdoc property
    *
    * @name CURRENT_USER_URI
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `/me`
    *
    * The URI that is used to fetch the account object of
    * the currently logged in user.  This endpoint MUST:
    *  * Respond with a JSON object that is the Stormpath account object,
    *  if the user has an active session.
    *  * Respond with `401 Unauthorized` if the user has no session.
    */
    CURRENT_USER_URI: '/me',


    /**
    * @ngdoc property
    *
    * @name DESTROY_SESSION_ENDPOINT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `/logout`
    *
    * The URL that the {@link stormpath.spLogout:spLogout spLogout} directive
    * will make a GET request to, this endpoint MUST delete the access token
    * cookie, XSRF token cookie, and any other cookies that relate to the user
    * session.
    */
    DESTROY_SESSION_ENDPOINT: '/logout',


    /**
    * @ngdoc property
    *
    * @name EMAIL_VERIFICATION_ENDPOINT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `/verify`
    *
    * The endpoint that is used for verifying an account that requires email
    * verification.  Used by
    * {@link stormpath.userService.$user#methods_verify $user.verify()} to POST
    * the `sptoken` that was delivered to the user by email.
    *
    * This endpoint MUST accept a POST request with the following format and
    * use Stormpath to verify the token:
    * ```
    * {
    *   sptoken: '<token from email sent to user>'
    * }
    * ```
    *
    */
    EMAIL_VERIFICATION_ENDPOINT: '/verify',


    /**
    * @ngdoc property
    *
    * @name ENDPOINT_PREFIX
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: *none*
    *
    * A prefix, e.g. "base URL" to add to all endpoints that are used by this SDK.
    * Use this if your backend API is running on a different port or domain than
    * your Angular application.  Omit the trailing forward slash.
    *
    * **NOTE:** This may trigger
    * [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
    * behaviour in the browser, and your server
    * will need to respond to requests accordingly.  If you are using our
    * Express SDK see
    * [allowedOrigins](https://github.com/stormpath/stormpath-sdk-express#allowedOrigins)
    *
    * **Example:**
    * <pre>
    *   ENDPOINT_PREFIX = 'http://api.mydomain.com'
    * </pre>
    */
    ENDPOINT_PREFIX: '',


    /**
    * @ngdoc property
    *
    * @name FORM_CONTENT_TYPE
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `'application/x-www-form-urlencoded'`
    *
    * The content type that is used for form posts.
    */
    FORM_CONTENT_TYPE: 'application/x-www-form-urlencoded',


    /**
    * @ngdoc property
    *
    * @name GET_USER_EVENT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$currentUser`
    *
    * The name of the event that is fired when
    * {@link stormpath.userService.$user#methods_get $user.get()}
    * is resolved with a user object.
    */
    GET_USER_EVENT: '$currentUser',


    /**
    * @ngdoc property
    *
    * @name NOT_LOGGED_IN_EVENT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$notLoggedin`
    *
    * The name of the event that is fired when
    * {@link stormpath.userService.$user#methods_get $user.get()}
    * is rejected without a user.
    */
    NOT_LOGGED_IN_EVENT: '$notLoggedin',


    /**
    * @ngdoc property
    *
    * @name FORGOT_PASSWORD_ENDPOINT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `/forgot`
    *
    * The endpoint that is used by
    * {@link stormpath.userService.$user#methods_passwordResetRequest $user.passwordResetRequest()}
    * to create password reset tokens.
    */
    FORGOT_PASSWORD_ENDPOINT: '/forgot',


    /**
    * @ngdoc property
    *
    * @name CHANGE_PASSWORD_ENDPOINT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `/change`
    *
    * The endpoint that is used by
    * {@link stormpath.userService.$user#methods_verifyPasswordResetToken $user.verifyPasswordResetToken()} and
    * {@link stormpath.userService.$user#methods_resetPassword $user.resetPassword()}
    * to verify and consume password reset tokens (change a user's password with the token).
    */
    CHANGE_PASSWORD_ENDPOINT: '/change',


    /**
    * @ngdoc property
    *
    * @name SESSION_END_EVENT
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$sessionEnd`
    *
    * The name of the event that is fired when the user logs out via the
    * {@link stormpath.spLogout:spLogout spLogout}
    * directive
    */
    SESSION_END_EVENT: '$sessionEnd',


    /**
    * @ngdoc property
    *
    * @name STATE_CHANGE_UNAUTHENTICATED
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$stateChangeUnauthenticated`
    *
    * The name of the event that is fired when the user attempts to visit a
    * UI Router state that requires authentication, but the user is not
    * authenticated.
    */
    STATE_CHANGE_UNAUTHENTICATED: '$stateChangeUnauthenticated',


    /**
    * @ngdoc property
    *
    * @name STATE_CHANGE_UNAUTHORIZED
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$stateChangeUnauthorized`
    *
    * The name of the event that is fired when the user attempts to visit a
    * UI Router state that has an access control rule which the user does not
    * meet (such as not being in a specified group)
    */
    STATE_CHANGE_UNAUTHORIZED: '$stateChangeUnauthorized',


    /**
    * @ngdoc property
    *
    * @name ROUTE_CHANGE_UNAUTHENTICATED
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$routeChangeUnauthenticated`
    *
    * The name of the event that is fired when the user attempts to visit a
    * route that requires authentication, but the user is not
    * authenticated.
    */
    ROUTE_CHANGE_UNAUTHENTICATED: '$routeChangeUnauthenticated',


    /**
    * @ngdoc property
    *
    * @name ROUTE_CHANGE_UNAUTHORIZED
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$routeChangeUnauthorized`
    *
    * The name of the event that is fired when the user attempts to visit a
    * route that has an access control rule which the user does not
    * meet (such as not being in a specified group)
    */
    ROUTE_CHANGE_UNAUTHORIZED: '$routeChangeUnauthorized',


    /**
    * @ngdoc property
    *
    * @name REGISTER_URI
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `/register`
    *
    * The endpoint that is used by
    * {@link stormpath.userService.$user#methods_create $user.create()}
    * to POST new users.  This endpoint MUST accept a stormpath account object
    * and use Stormpath to create the new user.
    */
    REGISTER_URI: '/register',

    /**
    * @ngdoc property
    *
    * @name REGISTERED_EVENT_NAME
    *
    * @propertyOf stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG
    *
    * @description
    *
    * Default: `$registered`
    *
    * The name of the event that is fired when
    * {@link stormpath.userService.$user#methods_create $user.create()}
    * is resolved with an account that was successfully created
    */
    REGISTERED_EVENT_NAME: '$registered',

  };
  c.getUrl = function(key) {
    return this.ENDPOINT_PREFIX + this[key];
  };
  return c;
})());

'use strict';

angular.module('stormpath')

.controller('SpEmailVerificationCtrl', ['$scope','$location','$user',function ($scope,$location,$user) {
  $scope.showVerificationError = false;
  $scope.verifying = false;
  $scope.reVerificationSent = false;
  $scope.needsReVerification = false;
  $scope.resendFailed = false;
  $scope.formModel = {
    username: ''
  };
  if($location.search().sptoken){
    $scope.verifying = true;
    $user.verify($location.search().sptoken)
      .then(function(){
        $scope.verified = true;
      })
      .catch(function(){
        $scope.needsReVerification = true;
        $scope.showVerificationError = true;
      })
      .finally(function(){
        $scope.verifying = false;
      });
  }else{
    $scope.needsReVerification = true;
    $scope.showVerificationError = true;
  }
  $scope.submit = function(){
    $scope.posting = true;
    $scope.resendFailed = false;
    $scope.showVerificationError = false;
    $user.resendVerificationEmail({login: $scope.formModel.username})
      .then(function(){
        $scope.reVerificationSent = true;
      })
      .catch(function(){
        $scope.resendFailed = true;
      }).finally(function(){
        $scope.posting = false;
      });
  };
}])

/**
 * @ngdoc directive
 *
 * @name stormpath.spEmailVerification:spEmailVerification
 *
 * @param {string} template-url
 *
 * An alternate template URL if you want
 * to use your own template for the form.
 *
 * @description
 *
 * Use this directive on the page that users land on when they click an email verification link.
 * These links are sent after a user registers, see
 * {@link stormpath.spRegistrationForm:spRegistrationForm spRegistrationForm}.
 *
 * This directive will render a view that does the following:
 * * Verifies that the current URL has an `sptoken` in it.  Shows an error if not.
 * * Verifies the given `sptoken` with Stormpath, then:
 *   * If the token is valid, tell the user that the confirmation is complete and prompt the user to login.
 *   * If the token is invalid (it is expired or malformed), we prompt the user to enter
 *     their email address, so that we can try sending them a new link.
 *
 * @example
 *
 * <pre>
 * <!-- If you want to use the default template -->
 * <div class="container">
 *   <div sp-email-verification></div>
 * </div>
 *
 * <!-- If you want to use your own template -->
 * <div class="container">
 *   <div sp-email-verification template-url="/path/to/my-custom-template.html"></div>
 * </div>
 * </pre>
 */
.directive('spEmailVerification',function(){
  return {
    templateUrl: function(tElemenet,tAttrs){
      return tAttrs.templateUrl || 'spEmailVerification.tpl.html';
    },
    controller: 'SpEmailVerificationCtrl'
  };
});

'use strict';

angular.module('stormpath')
.provider('$spFormEncoder', [function $spFormEncoder(){
  /**
   * This service is intentionally excluded from NG Docs.
   * It is an internal utility.
   */

  this.$get = [
    'STORMPATH_CONFIG',
    function formEncoderServiceFactory(STORMPATH_CONFIG){

      function FormEncoderService(){
        var encoder = new UrlEncodedFormParser();
        this.encodeUrlForm = encoder.encode.bind(encoder);
        return this;
      }

      FormEncoderService.prototype.formPost = function formPost(httpRequest){
        if(STORMPATH_CONFIG.FORM_CONTENT_TYPE==='application/x-www-form-urlencoded'){
          var h = httpRequest.headers ? httpRequest.headers : (httpRequest.headers = {});
          h['Content-Type'] = STORMPATH_CONFIG.FORM_CONTENT_TYPE;
          httpRequest.data = this.encodeUrlForm(httpRequest.data);
        }
        return httpRequest;
      };

      function UrlEncodedFormParser(){

        // Copy & modify from https://github.com/hapijs/qs/blob/master/lib/stringify.js

        this.delimiter = '&';
        this.arrayPrefixGenerators = {
          brackets: function (prefix) {
            return prefix + '[]';
          },
          indices: function (prefix, key) {
            return prefix + '[' + key + ']';
          },
          repeat: function (prefix) {
            return prefix;
          }
        };
        return this;
      }
      UrlEncodedFormParser.prototype.stringify = function stringify(obj, prefix, generateArrayPrefix) {

        if (obj instanceof Date) {
          obj = obj.toISOString();
        }
        else if (obj === null) {
          obj = '';
        }

        if (typeof obj === 'string' ||
          typeof obj === 'number' ||
          typeof obj === 'boolean') {

          return [encodeURIComponent(prefix) + '=' + encodeURIComponent(obj)];
        }

        var values = [];

        if (typeof obj === 'undefined') {
          return values;
        }

        var objKeys = Object.keys(obj);
        for (var i = 0, il = objKeys.length; i < il; ++i) {
          var key = objKeys[i];
          if (Array.isArray(obj)) {
            values = values.concat(this.stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix));
          }
          else {
            values = values.concat(this.stringify(obj[key], prefix + '[' + key + ']', generateArrayPrefix));
          }
        }

        return values;
      };
      UrlEncodedFormParser.prototype.encode = function encode(obj, options) {

        options = options || {};
        var delimiter = typeof options.delimiter === 'undefined' ? this.delimiter : options.delimiter;

        var keys = [];

        if (typeof obj !== 'object' ||
          obj === null) {

          return '';
        }

        var arrayFormat;
        if (options.arrayFormat in this.arrayPrefixGenerators) {
          arrayFormat = options.arrayFormat;
        }
        else if ('indices' in options) {
          arrayFormat = options.indices ? 'indices' : 'repeat';
        }
        else {
          arrayFormat = 'indices';
        }

        var generateArrayPrefix = this.arrayPrefixGenerators[arrayFormat];

        var objKeys = Object.keys(obj);
        for (var i = 0, il = objKeys.length; i < il; ++i) {
          var key = objKeys[i];
          keys = keys.concat(this.stringify(obj[key], key, generateArrayPrefix));
        }

        return keys.join(delimiter);
      };

      return new FormEncoderService();
    }
  ];
}]);
'use strict';

angular.module('stormpath')

.controller('SpLoginFormCtrl', ['$scope','$auth','$viewModel',function ($scope,$auth,$viewModel) {
  $scope.viewModel = null;

  $viewModel.getLoginModel().then(function (model) {
    var supportedProviders = ['facebook', 'google'];

    model.accountStores = model.accountStores.filter(function (accountStore) {
      var providerId = accountStore.provider.providerId;

      return supportedProviders.indexOf(providerId) > -1;
    });

    $scope.viewModel = model;
  }).catch(function (err) {
    throw new Error('Could not load login view model from back-end: ' + err.message);
  });

  $scope.formModel = {};
  $scope.posting = false;
  $scope.submit = function(){
    $scope.posting = true;
    $scope.error = null;
    $auth.authenticate($scope.formModel)
      .catch(function(err){
        $scope.posting = false;
        $scope.error = err.message;
      });
  };
}])


/**
 * @ngdoc directive
 *
 * @name stormpath.spLoginForm:spLoginForm
 *
 * @param {string} template-url
 *
 * An alternate template URL if you want
 * to use your own template for the form.
 *
 * @description
 *
 * This directive will render a pre-built login form with all
 * the necessary fields.  After the login is a success, the following
 * will happen:
 *
 * * The {@link stormpath.authService.$auth#events_$authenticated $authenticated} event will
 * be fired.
 * *  If you have configured the {@link stormpath.$stormpath#methods_uiRouter UI Router Integration},
 * the following can happen:
 *  * The user is sent back to the view they originally requested.
 *  * The user is sent to a default view of your choice.
 *
 * @example
 *
 * <pre>
 * <!-- If you want to use the default template -->
 * <div class="container">
 *   <div sp-login-form></div>
 * </div>
 *
 * <!-- If you want to use your own template -->
 * <div class="container">
 *   <div sp-login-form template-url="/path/to/my-custom-template.html"></div>
 * </div>
 * </pre>
 */
.directive('spLoginForm',function(){
  return {
    templateUrl: function(tElemenet,tAttrs){
      return tAttrs.templateUrl || 'spLoginForm.tpl.html';
    },
    controller: 'SpLoginFormCtrl'
  };
});

'use strict';

angular.module('stormpath')
.controller('SpPasswordResetRequestCtrl', ['$scope','$user',function ($scope,$user) {
  $scope.sent = false;
  $scope.posting = false;
  $scope.formModel = {
    username: ''
  };
  $scope.requestFailed = false;
  $scope.submit = function(){
    $scope.posting = true;
    $scope.requestFailed = false;
    $user.passwordResetRequest({email: $scope.formModel.email})
      .then(function(){
        $scope.sent = true;
      })
      .catch(function(){
        $scope.requestFailed = true;
      }).finally(function(){
        $scope.posting = false;
      });
  };
}])

.controller('SpPasswordResetCtrl', ['$scope','$location','$user',function ($scope,$location,$user) {
  var sptoken = $location.search().sptoken;
  $scope.showVerificationError = false;
  $scope.verifying = false;
  $scope.verified = false;
  $scope.posting = false;
  $scope.reset = false;
  $scope.error = null;

  $scope.resendFailed = false;
  $scope.formModel = {
    password: '',
    confirmPassword: ''
  };

  if(typeof sptoken==='string'){
    $scope.verifying = true;
    $user.verifyPasswordResetToken(sptoken)
      .then(function(){
        $scope.verified = true;
      })
      .catch(function(){
        $scope.showVerificationError = true;
      })
      .finally(function(){
        $scope.verifying = false;
      });
  }else{
    $scope.showVerificationError = true;
  }
  $scope.submit = function(){
    if($scope.formModel.password!==$scope.formModel.confirmPassword){
      $scope.error = 'Passwords do not match';
      return;
    }
    $scope.posting = true;
    $scope.error = null;
    $scope.showVerificationError = false;
    $user.resetPassword(sptoken, {password: $scope.formModel.password})
      .then(function(){
        $scope.reset = true;
      })
      .catch(function(err){
        $scope.error = err.message;
      }).finally(function(){
        $scope.posting = false;
      });
  };

}])

/**
 * @ngdoc directive
 *
 * @name stormpath.spPasswordResetRequestForm:spPasswordResetRequestForm
 *
 * @param {string} template-url
 *
 * An alternate template URL if you want
 * to use your own template for the form.
 *
 * @description
 *
 * This directive will render a pre-built form which prompts the user for their
 * username/email.  If an account is found, we will send them an email with a
 * password reset link.
 *
 * @example
 *
 * <pre>
 * <!-- If you want to use the default template -->
 * <div class="container">
 *   <div sp-password-reset-request-form></div>
 * </div>
 *
 * <!-- If you want to use your own template -->
 * <div class="container">
 *   <div sp-password-reset-request-form template-url="/path/to/my-custom-template.html"></div>
 * </div>
 * </pre>
 */
.directive('spPasswordResetRequestForm',function(){
  return {
    templateUrl: function(tElemenet,tAttrs){
      return tAttrs.templateUrl || 'spPasswordResetRequestForm.tpl.html';
    },
    controller: 'SpPasswordResetRequestCtrl'
  };
})
/**
 * @ngdoc directive
 *
 * @name stormpath.spPasswordResetForm:spPasswordResetForm
 *
 * @param {string} template-url
 *
 * An alternate template URL if you want
 * to use your own template for the form.
 *
 *
 * @description
 *
 * Use this directive on the page that users land on when they click on a password
 * reset link.  To send users a password reset link, see
 * {@link stormpath.spPasswordResetRequestForm:spPasswordResetRequestForm spPasswordResetRequestForm}.
 *
 * This directive will render a password reset form that does the following:
 * * Verifies that the current URL has an `sptoken` in it.  Shows an error if not.
 * * Verifies the given `sptoken` with Stormpath, then:
 *   * If the token is valid, shows a form that allows the user to enter a new password.
 *   * If the token is invalid (it is expired or malformed), we prompt the user to enter
 *     their email address, so that we can try sending them a new link.
 *
 * @example
 *
 * <pre>
 * <!-- If you want to use the default template -->
 * <div class="container">
 *   <div sp-password-reset-form></div>
 * </div>
 *
 * <!-- If you want to use your own template -->
 * <div class="container">
 *   <div sp-password-reset-form template-url="/path/to/my-custom-template.html"></div>
 * </div>
 * </pre>
 */
.directive('spPasswordResetForm',function(){
  return {
    templateUrl: function(tElemenet,tAttrs){
      return tAttrs.templateUrl || 'spPasswordResetForm.tpl.html';
    },
    controller: 'SpPasswordResetCtrl'
  };
});

'use strict';

angular.module('stormpath')
.controller('SpRegistrationFormCtrl', ['$scope','$user','$auth','$location','$viewModel','$injector', function ($scope,$user,$auth,$location,$viewModel, $injector) {
  $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {};
  $scope.created = false;
  $scope.enabled = false;
  $scope.creating = false;
  $scope.authenticating = false;
  $scope.viewModel = null;

  $viewModel.getRegisterModel().then(function (model) {
    var supportedProviders = ['facebook', 'google'];

    model.accountStores = model.accountStores.filter(function (accountStore) {
      var providerId = accountStore.provider.providerId;

      return supportedProviders.indexOf(providerId) > -1;
    });

    $scope.viewModel = model;
  }).catch(function (err) {
    throw new Error('Could not load login view model from back-end: ' + err.message);
  });

  $scope.submit = function(){
    $scope.creating = true;
    $scope.error = null;
    $user.create($scope.formModel)
      .then(function(account){
        $scope.created = true;
        $scope.enabled = account.status === 'ENABLED';
        if($scope.enabled && $scope.autoLogin){
          $scope.authenticating = true;
          $auth.authenticate({
            username: $scope.formModel.email,
            password: $scope.formModel.password
          })
          .then(function(){
            var $state = $injector.has('$state') ? $injector.get('$state') : null;
            if($scope.postLoginState && $state){
              $state.go($scope.postLoginState);
            }
            else if($scope.postLoginPath){
              $location.path($scope.postLoginPath);
            }
          })
          .catch(function(err){
            $scope.error = err.message;
          })
          .finally(function(){
            $scope.authenticating = false;
            $scope.creating = false;
          });
        }else{
          $scope.creating = false;
        }
      })
      .catch(function(err){
        $scope.creating = false;
        $scope.error = err.message;
      });
  };
}])


/**
 * @ngdoc directive
 *
 * @name stormpath.spRegistrationForm:spRegistrationForm
 *
 * @param {boolean} autoLogin
 *
 * Default `false`. Automatically authenticate the user
 * after creation.  This makes a call to
 * {@link stormpath.authService.$auth#methods_authenticate $auth.authenticate}, which will
 * trigger the event {@link stormpath.authService.$auth#events_$authenticated $authenticated}.
 * This is not possible if the email verification workflow is enabled on the directory that
 * the account is created in.
 *
 * @param {string} postLoginState
 *
 * If using the `autoLogin` option, you can specify the name of a UI state that the user
 * should be redirected to after they successfully have registered.  This is a UI Router
 * integration, and requires that module.
 *
 * @param {string} postLoginPath
 *
 * If using the `autoLogin` option, you can specify the path that the user
 * should be sent to after registration.  This value is passed to
 * `$location.path()` and does not require a specific routing module.
 *
 * @param {string} template-url
 *
 * An alternate template URL if you want
 * to use your own template for the form.
 *
 *
 * @description
 *
 * This directive will render a pre-built user registration form with the following
 * fields:
 *  * First Name
 *  * Last Name
 *  * Email
 *  * Password
 *
 * # Customizing the Form
 *
 * If you would like to customize the form:
 *
 * * Create a new view file in your application.
 * * Copy our default template HTML code into your file, found here:
 * <a href="https://github.com/stormpath/stormpath-sdk-angularjs/blob/master/src/spRegistrationForm.tpl.html" target="_blank">spRegistrationForm.tpl.html</a>.
 * * Modify the template to fit your needs, making sure to use `formModel.<FIELD>` as the
 * value for `ng-model` where `.<FIELD>` is the name of the field you want to set on
 * the new account (such as `middleName`).
 * * Use the `template-url` option on the directive to point to your new view file.
 *
 * Any form fields you supply that are not one of the default fields (first name, last name)
 * will be automatically placed into the new account's customa data object.
 *
 * # Email Verification
 *
 * If you are using the email verification workflow, the default template has a message,
 * which will be shown to the user, telling them that they need to check their email
 * for verification.
 *
 * If you are NOT using the email verification workflow, you can, optionally,
 * automatically login the user and redirect them to a UI state in your application.
 * See the options below.
 *
 * # Server Interaction
 *
 * This directive makes a call to
 * {@link stormpath.userService.$user#methods_create $user.create()}
 * when it is ready to POST the form to the server. Please see that method
 * for more information.
 *
 * @example
 *
 * <pre>
 * <!-- If you want to use the default template -->
 * <div class="container">
 *   <div sp-registration-form post-login-state="main"></div>
 * </div>
 *
 * <!-- If you want to use your own template -->
 * <div class="container">
 *   <div sp-registration-form template-url="/path/to/my-custom-template.html"></div>
 * </div>
 * </pre>
 */
.directive('spRegistrationForm',function(){
  return {
    templateUrl: function(tElemenet,tAttrs){
      return tAttrs.templateUrl || 'spRegistrationForm.tpl.html';
    },
    controller: 'SpRegistrationFormCtrl',
    link: function(scope,element,attrs){
      scope.autoLogin = attrs.autoLogin==='true';
      scope.postLoginPath = attrs.postLoginPath || '';
      scope.postLoginState = attrs.postLoginState || '';
    }
  };
});
(function() {
  'use strict';

  function loginCallback(deferred, response) {
    var data;

    switch (response.status) {
      case 'connected':
        deferred.resolve({
          providerData: {
            providerId: 'facebook',
            accessToken: response.authResponse.accessToken
          }
        });
        break;

      case 'not_authorized':
        deferred.reject(new Error('Please log into this app'));
        break;

      default:
        deferred.reject(new Error('Please log into Facebook.'));
    }
  }

  function FacebookLoginService($q, $spJsLoader) {
    this.name = 'Facebook';
    this.clientId = null;
    this.$q = $q;
    this.$spJsLoader = $spJsLoader;
  }

  FacebookLoginService.prototype.init = function init() {
    var clientId = this.clientId;

    window.fbAsyncInit = function() {
      FB.init({
        appId: clientId,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.4'
      });
    };

    if (window.FB) {
      window.fbAsyncInit();
    } else {
      this.$spJsLoader.load('facebook-jssdk', '//connect.facebook.net/en_US/sdk.js');
    }
  };

  FacebookLoginService.prototype.login = function login(options) {
    var deferred = this.$q.defer();

    FB.login(loginCallback.bind(null, deferred), options);

    return deferred.promise;
  };

  angular.module('stormpath.facebookLogin', [])
  .provider('$facebookLogin', function() {
    this.$get = ['$q', '$spJsLoader', function facebookLoginFactory($q, $spJsLoader) {
      return new FacebookLoginService($q, $spJsLoader);
    }];
  });
}());

(function() {
  'use strict';

  function GoogleLoginService($q, $spJsLoader) {
    this.name = 'Google';
    this.clientId = null;
    this.googleAuth = null;
    this.$q = $q;
    this.$spJsLoader = $spJsLoader;
  }

  GoogleLoginService.prototype.setGoogleAuth = function setGoogleAuth(auth) {
    this.googleAuth = auth;
  };

  GoogleLoginService.prototype.init = function init(element) {
    var clientId = this.clientId;
    var setGoogleAuth = this.setGoogleAuth.bind(this);

    this.$spJsLoader.load('google-jssdk', '//apis.google.com/js/api:client.js').then(function() {
      gapi.load('auth2', function() {
        var auth2 = gapi.auth2.init({
          client_id: clientId,
          cookiepolicy: 'single_host_origin'
        });

        setGoogleAuth(auth2);
      });
    });
  };

  GoogleLoginService.prototype.login = function login(options) {
    var deferred = this.$q.defer();

    options = options || {};
    options.redirect_uri = 'postmessage';

    this.googleAuth.grantOfflineAccess(options).then(function(response) {
      deferred.resolve({
        providerData: {
          providerId: 'google',
          code: response.code
        }
      });
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  angular.module('stormpath.googleLogin', [])
  .provider('$googleLogin', function() {
    this.$get = ['$q', '$spJsLoader', function googleLoginFactory($q, $spJsLoader) {
      return new GoogleLoginService($q, $spJsLoader);
    }];
  });
}());

(function() {
  'use strict';

  /**
   * @ngdoc overview
   *
   * @name  stormpath.socialLoginService
   *
   * @description
   *
   * This module provides the {@link stormpath.socialLoginService.$socialLogin $socialLogin} service.
   *
   * Currently, this provider does not have any configuration methods.
   */
  function SocialLoginService(STORMPATH_CONFIG, $injector, $http, $q) {
    this.providersPromise = null;
    this.STORMPATH_CONFIG = STORMPATH_CONFIG;
    this.$injector = $injector;
    this.$http = $http;
    this.$q = $q;
  }

  angular.module('stormpath.socialLogin', ['stormpath.CONFIG'])

  /**
   * @ngdoc object
   *
   * @name stormpath.socialLoginService.$socialLoginProvider
   *
   * @description
   *
   * Provides the {@link stormpath.socialLoginService.$socialLogin $socialLogin} service.
   *
   * Currently, this provider does not have any configuration methods.
   */
  .config(['$injector', 'STORMPATH_CONFIG', function $socialLoginProvider($injector, STORMPATH_CONFIG) {
    /**
     * @ngdoc object
     *
     * @name stormpath.socialLoginService.$socialLogin
     *
     * @description
     *
     * The social login service provides methods for letting users logging in with Facebook, Google, etc.
     */
    var socialLoginFactory = ['$http', '$q', '$injector', function socialLoginFactory($http, $q, $injector) {
      return new SocialLoginService(STORMPATH_CONFIG, $injector, $http, $q);
    }];

    $injector.get('$provide').factory(STORMPATH_CONFIG.SOCIAL_LOGIN_SERVICE_NAME, socialLoginFactory);
  }])

  /**
   * @ngdoc object
   *
   * @name stormpath.socialLoginService.$spJsLoader
   *
   * @description
   *
   * The `$spJsLoader` provides a method for loading scripts during runtime.
   * Used by the social provider services to load their SDKs.
   */
  .factory('$spJsLoader', ['$q', function($q) {
    return {
      load: function load(id, src, innerHTML) {
        var deferred = $q.defer();
        var firstJsElement = document.getElementsByTagName('script')[0];
        var jsElement = document.createElement('script');

        if (document.getElementById(id)) {
          deferred.resolve();
        } else {
          jsElement.id = id;
          jsElement.src = src;
          jsElement.innerHTML = innerHTML;
          jsElement.onload = deferred.resolve;

          firstJsElement.parentNode.insertBefore(jsElement, firstJsElement);
        }

        return deferred.promise;
      }
    };
  }])

  /**
   * @ngdoc directive
   *
   * @name stormpath.spSocialLogin:spSocialLogin
   *
   * @description
   *
   * Add this directive to a button or link in order to authenticate using a social provider.
   * The value should be a social provider ID such as `google` or `facebook`.
   *
   * **Note:** If you are using Google+ Sign-In for server-side apps, Google recommends that you
   * leave the Authorized redirect URI field blank in the Google Developer Console. In Stormpath,
   * when creating the Google Directory, you must set the redirect URI to `postmessage`.
   * 
   * {@link http://docs.stormpath.com/guides/social-integrations/}
   *
   * @example
   *
   * <pre>
   * <div class="container">
   *   <button sp-social-login="facebook" sp-client-id="oauth client id" sp-scope="public_profile,email">Login with Facebook</button>
   * </div>
   * </pre>
   */
  .directive('spSocialLogin', ['$viewModel', '$auth', '$injector', function($viewModel, $auth, $injector) {
    return {
      link: function(scope, element, attrs) {
        var providerService;
        var parentScope = scope.$parent;

        try {
          providerService = $injector.get('$' + attrs.spSocialLogin + 'Login');
        } catch (err) {
          return;
        }

        providerService.clientId = attrs.spClientId;
        providerService.init(element);

        scope.providerName = providerService.name;

        element.bind('click', function() {
          var options = { scope: attrs.spScope }; // `scope` is OAuth scope, not Angular scope

          parentScope.posting = true;

          providerService.login(options).then(function(data) {
            return $auth.authenticate(data);
          }).catch(function(err) {
            parentScope.posting = false;

            if (err.message) {
              parentScope.error = err.message;
            } else {
              parentScope.error = 'An error occured when communicating with server.';
            }
          });
        });
      }
    };
  }]);
}());

// We've disabled support for social login with LinkedIn until we've
// solved how to manage the differences between other OAuth providers.
// https://developer-programs.linkedin.com/documents/exchange-jsapi-tokens-rest-api-oauth-tokens

(function() {
  'use strict';

  // Returns a string in LinkedIn's format for initializing the SDK
  // https://developer.linkedin.com/docs/signin-with-linkedin
  function buildLinkedInSDKConfig(clientId) {
    return 'api_key: ' + clientId + '\n' + 'authorize: true';
  }

  function loadLinkedInSDK($spJsLoader, clientId) {
    var innerHTML = buildLinkedInSDKConfig(clientId);

    $spJsLoader.load('linkedin-jssdk', '//platform.linkedin.com/in.js', innerHTML);
  }

  function LinkedInLoginService($q, $spJsLoader) {
    this.name = 'LinkedIn';
    this.clientId = null;
    this.$q = $q;
    this.$spJsLoader = $spJsLoader;
  }

  LinkedInLoginService.prototype.init = function init(element) {
    loadLinkedInSDK(this.$spJsLoader, this.clientId);
  };

  LinkedInLoginService.prototype.login = function login(options) {
    var deferred = this.$q.defer();

    IN.User.authorize(function() {
      deferred.resolve({
        providerData: {
          providerId: 'linkedin',
          accessToken: IN.ENV.auth.oauth_token
        }
      });
    });

    return deferred.promise;
  };

  angular.module('stormpath.linkedinLogin', [])
  .provider('$linkedinLogin', function() {
    this.$get = ['$q', '$spJsLoader', function linkedInLoginFactory($q, $spJsLoader) {
      return new LinkedInLoginService($q, $spJsLoader);
    }];
  });
}());

'use strict';
/**
 * @ngdoc overview
 *
 * @name stormpath.userService
 *
 * @description
 *
 * This module provides the {@link stormpath.userService.$user $user} service.
 */

/**
 * @ngdoc object
 *
 * @name stormpath.userService.$userProvider
 *
 * @description
 *
 * Provides the {@link stormpath.userService.$user $user} service.
 *
 * Currently, this provider does not have any configuration methods.
 */

angular.module('stormpath.userService',['stormpath.CONFIG'])
.provider('$user', [function $userProvider(){

  /**
   * @ngdoc object
   *
   * @name stormpath.userService.$user
   *
   * @description
   *
   * Use this service to get the current user and do access control checks
   * on the user.
   */

  function User(data){
    var self = this;
    Object.keys(data).map(function(k){
      self[k] = data[k];
    });
  }
  /**
  * This method may change in the future, do not use.
  * Please use the `ifUserInGroup` directive instead
  */
  User.prototype.inGroup = function inGroup(groupName) {
    return this.groups.items.filter(function(group){
      return group.name === groupName;
    }).length >0;
  };
  /**
  * This method may change in the future, do not use.
  * Please use the `ifUserInGroup` directive instead
  */
  User.prototype.matchesGroupExpression = function matchesGroupExpression(regex) {
    return this.groups.items.filter(function(group){
      return regex.test(group.name);
    }).length >0;
  };
  /**
  * This method may change in the future, do not use.
  * Please use the `ifUserInGroup` directive instead
  */
  User.prototype.groupTest = function groupTest(expr) {
    if(expr instanceof RegExp && this.matchesGroupExpression(expr)){
      return true;
    }else if(this.inGroup(expr)){
      return true;
    }else{
      return false;
    }
  };

  this.$get = [
    '$q','$http','STORMPATH_CONFIG','$rootScope','$spFormEncoder',
    function userServiceFactory($q,$http,STORMPATH_CONFIG,$rootScope,$spFormEncoder){
      function UserService(){
        this.cachedUserOp = null;

        /**
          * @ngdoc property
          *
          * @name currentUser
          *
          * @propertyOf stormpath.userService.$user
          *
          * @description
          *
          * Retains the account object of the currently logged in user.
          *
          * If the user state is unknown, this value is `null`.
          *
          * If the user state is known and the user is not logged in
          * ({@link stormpath.userService.$user#methods_get $user.get()} has
          * been called, and rejected) then this value will be `false`.
          *
          */

        this.currentUser = null;
        return this;
      }
      UserService.prototype.create = function(accountData){
        /**
         * @ngdoc function
         *
         * @name create
         *
         * @methodOf stormpath.userService.$user
         *
         * @param {Object} accountData
         *
         * An object literal for passing the data
         * to the new account.
         *
         * Required fields:
         * * `givenName` - the user's first name
         * * `surname` - the user's last name
         * * `email` - the email address of the user
         * * `password` - the password that the user wishes to use for their
         * account.  Must meet the password requirements that you have specified
         * on the directory that this account will be created in.
         *
         * @returns {promise}
         *
         * A promise representing the operation to create a
         * new user.  If an error occurs (duplicate email, weak password), the
         * promise will be rejected and the http response will be passed.
         * If the operation is successful, the promise
         * will be resolved with a boolean `enabled` value.
         *
         * * If `true`, the account's status is Enabled and you can proceed with authenticating the user.
         *
         * * If `false`, the account's status is Unverified.
         * This will be the case when you have enabled the email verification workflow on the directory of this
         * account.
         *
         * @description
         *
         * Attempts to create a new user by submitting the given `accountData` as
         * JSON to `/register`.  The POST endpoint can be modified via the
         * {@link api/stormpath.STORMPATH_CONFIG:STORMPATH_CONFIG#properties_REGISTER_URI REGISTER_URI}
         * config option.
         *
         * @example
         *
         * <pre>
         * $user.create(accountData)
         *   .then(function(account){
         *     if(account.status === 'ENABLED'){
         *       // The account is enabled and ready to use
         *     }else if(account.status === 'UNVERIFIED'){
         *       // The account requires email verification
         *     }
         *   })
         *   .catch(function(err){
         *     // Show the error message to the user
         *     $scope.error = err.message;
         *   });
         * </pre>
         */
        var op = $q.defer();

        $http($spFormEncoder.formPost({
          url: STORMPATH_CONFIG.getUrl('REGISTER_URI'),
          method: 'POST',
          data: accountData
        }))
        .then(function(response){
          var account = response.data.account || response.data;

          op.resolve(account);
          registeredEvent(account);
        },op.reject);

        return op.promise;
      };
      UserService.prototype.get = function get() {
        /**
         * @ngdoc function
         *
         * @name get
         *
         * @methodOf stormpath.userService.$user
         *
         * @returns {promise}
         *
         * A promise representing the operation to get the current user data.
         *
         * @description
         *
         * Attempt to get the current user.  Returns a promise.  If the user
         * is authenticated, the promise will be resolved with the user object.
         * If the user is not authenticated, the promise will be rejected and
         * passed the error response from the $http service.
         *
         * If you cannot make use of the promise, you can also observe the
         * {@link $notLoggedin $notLoggedin} or {@link $currentUser $currentUser}
         * events.  They are emitted when this method has a success or failure.
         *
         * The user object is a Stormpath Account
         * object, which is wrapped by a {@link eh User} type.
         *
         * @example
         *
         * <pre>
         * var myApp = angular.module('myApp', ['stormpath']);
         *
         * myApp.controller('MyAppCtrl', function ($scope, $user) {
         *   $user.get()
         *     .then(function (user) {
         *       console.log('The current user is', user);
         *     })
         *     .catch(function (error) {
         *       console.log('Error getting user', error);
         *     });
         * });
         * </pre>
         *
         */
        var op = $q.defer();
        var self = this;

        if(self.cachedUserOp){
          return self.cachedUserOp.promise;
        }
        else if(self.currentUser !== null && self.currentUser!==false){
          op.resolve(self.currentUser);
          return op.promise;
        }else{
          self.cachedUserOp = op;

          $http.get(STORMPATH_CONFIG.getUrl('CURRENT_USER_URI'),{withCredentials:true}).then(function(response){
            self.cachedUserOp = null;
            self.currentUser = new User(response.data.account || response.data);
            currentUserEvent(self.currentUser);
            op.resolve(self.currentUser);
          },function(response){
            self.currentUser = false;
            if(response.status===401){
              notLoggedInEvent();
            }
            self.cachedUserOp = null;
            op.reject(response);
          });
          return op.promise;
        }

      };

      /**
       * @ngdoc function
       *
       * @name resendVerificationEmail
       *
       * @methodOf stormpath.userService.$user
       *
       * @returns {promise}
       *
       * An $http promise representing the operation to resend a verification token
       * to the given email address.  Will resolve, even if the email address
       * does not exist.  If rejected there was a network error.
       *
       * @description
       *
       * Re-sends the verification email to the account specified by the
       * username or email address.
       *
       * @param  {Object} data
       *
       * An object literal for passing the username or email.
       * ```
       * {
       *   username: 'email address or username'
       * }
       * ```
       */
      UserService.prototype.resendVerificationEmail = function resendVerificationEmail(data){
        return $http({
          method: 'POST',
          url: STORMPATH_CONFIG.getUrl('EMAIL_VERIFICATION_ENDPOINT'),
          data: data
        });
      };

      /**
       * @ngdoc function
       *
       * @name verify
       *
       * @methodOf stormpath.userService.$user
       *
       * @returns {promise}
       *
       * An $http promise representing the operation to verify the given
       * email verification token token.  If resolved the account has been
       * verified and can be used for login.  If rejected the token is expired
       * or has already been used.
       *
       * @param  {Object} data Data object
       *
       * An object literal for passing the email verification token.
       * Must follow this format:
       * ```
       * {
       *   sptoken: '<token from email>'
       * }```
       *
       * @description
       *
       * Verifies a new account, using the `sptoken` that was sent to the user
       * by email.
       */
      UserService.prototype.verify = function verify(token){
        return $http({
          url: STORMPATH_CONFIG.getUrl('EMAIL_VERIFICATION_ENDPOINT') + '?sptoken='+token
        });
      };

      /**
       * @ngdoc function
       *
       * @name verifyPasswordResetToken
       *
       * @methodOf stormpath.userService.$user
       *
       * @returns {promise}
       *
       * A $http promise representing the operation to verify the given password
       * reset token token.  If resolved, the token can be used.  If rejected
       * the token cannot be used.
       *
       * @description
       *
       * Verifies a password reset token that was sent to the user by email.
       * If valid, the token can be used to reset the user's password.  If not
       * valid it means that the token has expired or has already been used.
       *
       * Use this method to verify the token, before asking the user to specify
       * a new password.  If the token is invalid the user must ask for another.
       *
       * @param  {String} sptoken
       *
       * The `sptoken` that was delivered to the user by email
       */
      UserService.prototype.verifyPasswordResetToken = function verifyPasswordResetToken(token){
        return $http.get(STORMPATH_CONFIG.getUrl('CHANGE_PASSWORD_ENDPOINT')+'?sptoken='+token);
      };

      /**
       * @ngdoc function
       *
       * @name passwordResetRequest
       *
       * @methodOf stormpath.userService.$user
       *
       * @returns {promise}
       *
       * An $http promise representing the operation to generate a password
       * reset token for the given email address.  Will resolve, even if the
       * email address does not exist.  If rejected there was a network error.
       *
       * @description
       *
       * Triggers a password reset email to the given username or email address.
       *
       * @param  {Object} data
       *
       * An object literal for passing the email address.
       * ```
       * {
       *   email: 'email address of the user'
       * }
       * ```
       */
      UserService.prototype.passwordResetRequest = function passwordResetRequest(data){
        return $http($spFormEncoder.formPost({
          method: 'POST',
          url: STORMPATH_CONFIG.getUrl('FORGOT_PASSWORD_ENDPOINT'),
          data: data
        }));
      };

      /**
       * @ngdoc function
       *
       * @name resetPassword
       *
       * @methodOf stormpath.userService.$user
       *
       * @returns {promise}
       *
       * An $http promise representing the operation to reset the password and
       * consume the token.  If resolved the password was successfully changed,
       * if rejected the token is invalid or the posted password does not meet
       * the password strength rules of the directory.
       *
       * @description
       *
       * Resets a user's password, using a token that was emailed to the user.
       *
       * @param {String} token
       *
       * The `sptoken` that was sent to the user via email.
       *
       * @param  {Object} data
       *
       * An object literal for passing the new password.  Must follow this
       * format:
       * ```
       * {
       *   password: 'the new password'
       * }
       * ```
       */
      UserService.prototype.resetPassword = function resetPassword(token,data){
        data.sptoken = token;
        return $http($spFormEncoder.formPost({
          method: 'POST',
          url:STORMPATH_CONFIG.getUrl('CHANGE_PASSWORD_ENDPOINT'),
          data: data
        }));
      };
      function registeredEvent(account){
        /**
         * @ngdoc event
         *
         * @name stormpath.userService.$user#$registered
         *
         * @eventOf stormpath.userService.$user
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @param {account} account
         *
         * The object of the account that was created.
         *
         * @description
         *
         * This event is broadcast when a call to
         * {@link stormpath.userService.$user#methods_create $user.create()}
         * is successful.  The account object is returned, and you can inspec
         * the account's status to know if email verification is required.
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.REGISTERED_EVENT_NAME,account);
      }
      function currentUserEvent(user){
        /**
         * @ngdoc event
         *
         * @name stormpath.userService.$user#$currentUser
         *
         * @eventOf stormpath.userService.$user
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @param {User} user
         *
         * The current user object.
         *
         * @description
         *
         * This event is broadcast when a call to
         * {@link stormpath.userService.$user#methods_get $user.get()}
         * and provides the user object as the second parameter.
         *
         * See the next section, the $notLoggeInEvent, for example usage.
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.GET_USER_EVENT,user);
      }
      function notLoggedInEvent(){
        /**
         * @ngdoc event
         *
         * @name stormpath.userService.$user#$notLoggedIn
         *
         * @eventOf stormpath.userService.$user
         *
         * @eventType broadcast on root scope
         *
         * @param {Object} event
         *
         * Angular event object.
         *
         * @description
         *
         * This event is broadcast when a call to
         * {@link stormpath.userService.$user#methods_get $user.get()}
         * results in an authentication failure.
         *
         * This event is useful for situations where you want to trigger
         * the call to get the current user, but need to respond to it
         * from some other place in your application.  An example could be,
         * during application bootstrap, you make a single call to get the current
         * user from the run function, then react to it inside your
         * application controller.
         *
         * @example
         *
         * <pre>
         * var myApp = angular.module('myApp', ['stormpath']);
         * myApp.run(function($user){
         *   //
         *   // Once our app is ready to run, trigger a call to $user.get()
         *   // We can then do other things while we wait for the result
         *   //
         *   $user.get();
         * });
         *
         * myApp.controller('MyAppCtrl', function ($scope, $rootScope) {
         *   $scope.isVisible = false; // Wait for authentication
         *   $rootScope.$on('$notLoggedIn',function(){
         *      $state.$go('login');
         *   });
         *   $rootScope.$on('$currentUser',function(e,user){
         *      $scope.isVisible = true;
         *   });
         *
         * });
         * </pre>
         */
        $rootScope.$broadcast(STORMPATH_CONFIG.NOT_LOGGED_IN_EVENT);
      }

      var userService =  new UserService();
      $rootScope.$on(STORMPATH_CONFIG.SESSION_END_EVENT,function(){
        userService.currentUser = false;
      });
      return userService;
    }
  ];
}]);

(function () {
  'use strict';

  function ViewModelService($http, STORMPATH_CONFIG) {
    this.$http = $http;
    this.STORMPATH_CONFIG = STORMPATH_CONFIG;
  }

  ViewModelService.prototype.getLoginModel = function getLoginModel() {
    return this.$http.get(this.STORMPATH_CONFIG.getUrl('AUTHENTICATION_ENDPOINT'), {
      headers: {
        'Accept': 'application/json'
      }
    }).then(function (response) {
      return response.data;
    });
  };

  ViewModelService.prototype.getRegisterModel = function getRegisterModel() {
    return this.$http.get(this.STORMPATH_CONFIG.getUrl('REGISTER_URI'), {
      headers: {
        'Accept': 'application/json'
      }
    }).then(function (response) {
      return response.data;
    });
  };

  angular.module('stormpath.viewModelService', [])
  .provider('$viewModel', function () {
    this.$get = ['$http', 'STORMPATH_CONFIG', function viewModelFactory($http, STORMPATH_CONFIG) {
      return new ViewModelService($http, STORMPATH_CONFIG);
    }];
  });
}());
})(window, window.angular);