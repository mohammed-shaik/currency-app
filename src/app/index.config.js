(function() {
  'use strict';

  angular
    .module('currencyapp')
    .config(config);

  /** @ngInject */
  function config($logProvider, localStorageServiceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Prefix all localStorage keys with our app name
    // Change storage type to sessionStorage as we should have the latest rates per session
    localStorageServiceProvider
    .setPrefix('currencyapp')
    .setStorageType('sessionStorage');
    
  }

})();
