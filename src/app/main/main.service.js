(function() {
  'use strict';

  angular
    .module('currencyapp')
    .factory('MainService', MainService);

  /** @ngInject */
  function MainService($log, $http, localStorageService) {
    var apiHost = 'http://api.fixer.io/latest';

    var service = {
      getExchangeRates: getExchangeRates,
      getRatesFromStorage: getRatesFromStorage,
      setRatesInLocalStorage: setRatesInLocalStorage
    };

    return service;

    function getExchangeRates(base) {
      return $http.get(apiHost + '?base=' + base);
    }

    // This function will return the stored json if available,
    // otherwise false
    function getRatesFromStorage() {
      // set this as a const in the app config?
      var storageKey = 'fixerio_rates';
      // First check if the browser supports the current set storage type
      if(localStorageService.isSupported) {
        // First check if we already have the latest rates in the localStorage / sessionStorage
        // TODO: Also check if its not older than a day
        
        var localStorage = localStorageService.get(storageKey);
        if(localStorage) {
          return localStorage;
        } else {
          return false;
        }

      } else {
        // NOTE: In this case we switch to cookie by default
        // Log storage type not supported
        // TODO: Get the json from cookie
      }
    }

    function setRatesInLocalStorage(json) {
      if(localStorageService.isSupported) {
        // Set the rates in storage
        localStorageService.set('fixerio_rates', json);
      } else {
        // TODO: Set the rates in Cookie
      }
    }

  }
})();
