(function() {
  'use strict';

  describe('controllers', function(){
    var vm;

    beforeEach(module('currencyapp'));
    beforeEach(inject(function(_$controller_) {
      
      vm = _$controller_('MainController');
      
    }));

    it('should have all the scope variables initialized', function() {
      //...TODO: Check all the variables initialized in init() and globally
    });

    // TODO: more test cases here...

  });
})();
