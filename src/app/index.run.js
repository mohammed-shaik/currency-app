(function() {
  'use strict';

  angular
    .module('currencyapp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
