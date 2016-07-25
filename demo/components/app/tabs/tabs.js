/**
 * TODO: add description
 * @module Tabs
 * @requires jquery
 * @requires jquery.exists
 * @author TODO: add author
 */
define(['jquery', 'jquery.exists', 'jquery-accessible-tabs'], function($, exists, A11yTabs) {

  'use strict';

  var Tabs = {

    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function() {
      this.$tabs = $('.tabs');
    },

    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function() {
      Tabs._cacheElements();

      Tabs.$tabs.exists(function() {
        A11yTabs.init();
        Tabs._bindEvents();
      });
    },

    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     */
    _bindEvents: function() {
    }

  };

  return /** @alias module:Tabs */ {
    /** init */
    init: Tabs.init
  };

});
