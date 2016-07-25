/**
 * Main entry point into all Java Script.
 * @module Main
 * @requires jquery

 * @requires jquery.exists
 * @author TODO: add author
 */
require([
  'jquery',
  'jquery.exists',
  'tabs'
], function(
  $,
  exists,
  Tabs
) {

  'use strict';

  var Main = {
    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    cacheElements: function() {
      // this.$bar = $('.bar');
    },
    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      this.cacheElements();
      Tabs.init();
    }
  };

  Main.init();

});
