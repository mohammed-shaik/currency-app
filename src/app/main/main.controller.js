(function() {
  'use strict';

  angular
    .module('currencyapp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(MainService, $log) {
    var vm = this;
    var exRates = {};
    var storageKey = "";
    init();

    function init() {
      // Set default values (if any)
      vm.fromAmount = 1;
      vm.toAmount = 1;
      vm.fromCurrency = 'CAD';
      vm.toCurrency = 'CAD';
      vm.exRateInfo = "";
      var storageKey = "";
      // Object containing exchange rates relative to the exRates.base currency
      exRates = {
        rates: {},
        base: ""
      };

      getExchangeRates();
      
    }

    var convert = function(amount, opts) {

      // Make sure we gots some opts
      opts = opts || {};
      // Set Disclaimer
      vm.exRateInfo = "1 " + opts.from + " = " + exRates.rates[opts.to] + " " + opts.to;
      // Multiply the amount by the exchange rate
      return amount * getExchangeRate( opts.to, opts.from );
    };

    vm.convertCurrency = function(e) {
      // Detect if the number keys pressed or backspace/delete, no action on any other keys 
      if ( (e.keyCode >= 48 && e.keyCode <= 57) 
        || (e.keyCode >= 96 && e.keyCode <= 105) 
        || (e.keyCode == 8 || e.keyCode == 46) ) {
        vm.toAmount = convert(vm.fromAmount, {from: vm.fromCurrency, to: vm.toCurrency});
      }
    };

    vm.currencyChange = function() {
      vm.toAmount = convert(vm.fromAmount, {from: vm.fromCurrency, to: vm.toCurrency});
    };

    vm.currencyBaseChange = function() {
      getExchangeRatesFromAPI(vm.fromCurrency);
      vm.currencyChange();
    };

    var getExchangeRate = function(toCurrency, fromCurrency) {

      var rates = exRates.rates;

      // Make sure the base rate is in the rates object:
      rates[exRates.base] = 1;

      // Throw an error if either rate isn't in the rates array
      if ( !rates[toCurrency] || !rates[fromCurrency] ) {
        throw "Currency type error";
      }

      // If `from` currency === exRates.base, return the basic exchange rate for the `to` currency
      if ( fromCurrency === exRates.base ) {
        return rates[toCurrency];
      }

      // If `to` currency === exRates.base, return the basic inverse rate of the `from` currency
      if ( toCurrency === exRates.base ) {
        return 1 / rates[fromCurrency];
      }

      // Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the
      // relative exchange rate between the two currencies
      return rates[toCurrency] * (1 / rates[fromCurrency]);
    };

    function getExchangeRates() {
      var storageRates = MainService.getRatesFromStroge();

      if(storageRates) {
        exRates.rates = storageRates.data.rates;
        exRates.base = storageRates.data.base;
        return;
      }
      getExchangeRatesFromAPI(vm.fromCurrency);
      
    }

    function getExchangeRatesFromAPI(base) {
      var response = MainService.getExchangeRates(base);
        response
        .then(getExchangeRatesSuccess)
        .catch(getExchangeRatesFailed);
    }

    function getExchangeRatesSuccess(response) {
      exRates.rates = response.data.rates;
      exRates.base = response.data.base;
      // Set the json response in storage
      MainService.setRatesInLocalStorage(response);
    }

    function getExchangeRatesFailed(error) {
      $log.error('XHR Failed for http://api.fixer.io/latest.\n' + angular.toJson(error.data, true));
    }

  }
})();
