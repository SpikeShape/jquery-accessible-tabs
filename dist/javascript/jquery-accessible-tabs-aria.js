/**
 * @module Tabs
 * @requires jquery
 * @author dev@spike-shape.de
 */

 (function (window, factory) {
     if (typeof define === 'function' && define.amd) {
         // AMD
         define(['jquery'], factory);
     } else if (typeof exports === 'object') {
         // Node, CommonJS-like
         module.exports = factory(require('jquery'));
     } else {
         // Browser globals
         accessibleTabs = factory(window.jQuery);
     }
 }(this, function ($) {

  'use strict';

  var Tabs = {

    /**
     * Default Options for tabs as object.
     * @const defaults
     * @type {object}
     */
    options: {
      tab_parent: '.tabs', // div
      tab_list: '.tablist', // ul
      tab_item: '.tablist-item', // li
      tab_link: '.tablist-link', // a
      tab_content: '.tabcontent', // div
      js_link_to_tab: '.js-link-to-tab' // link class
    },

    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function(options_custom) {
      this.options = $.extend(this.options, options_custom);

      this.hash = window.location.hash.replace( "#", "" );

      this.$tabs = $(Tabs.options.tab_parent);
    },

    /**
     * Initiates the module.
     * @function init
     * @public
     */
    init: function(options_custom) {
      Tabs._cacheElements(options_custom);

      if (Tabs.$tabs.length) {
        Tabs.$tab_list = Tabs.$tabs.find(Tabs.options.tab_list);
        Tabs._initTabs();
        Tabs._bindEvents();
      }
    },

    /**
     * Initialize logic of the tabs.
     * @function _initTabs
     * @private
     */
    _initTabs: function() {
      Tabs.$tab_list.each( function () {
        var $this_tab_list = $( this ),
            options = $this_tab_list.data(),
            $tabs_prefix_classes = typeof options.tabsPrefixClass !== 'undefined' ? options.tabsPrefixClass + '-' : '',
            $hx = typeof options.hx !== 'undefined' ? options.hx : '',
            $existing_hx = typeof options.existingHx !== 'undefined' ? options.existingHx : '',
            $this_tab_list_items = $this_tab_list.children( Tabs.options.tab_item ),
            $this_tab_list_links = $this_tab_list.find( Tabs.options.tab_link );

        // roles init
        $this_tab_list.attr( "role", "tablist" );                   // ul
        $this_tab_list_items.attr( "role", "presentation" );        // li
        $this_tab_list_links.attr( "role", "tab" );                 // a

        // classes init
        $this_tab_list.addClass( $tabs_prefix_classes + Tabs.options.tab_list.replace('.', '') );
        $this_tab_list_items.addClass( $tabs_prefix_classes + Tabs.options.tab_item.replace('.', '') );
        $this_tab_list_links.addClass( $tabs_prefix_classes + Tabs.options.tab_link.replace('.', '') );

        // controls/tabindex attributes
        $this_tab_list_links.each( function () {
          var $this = $( this ),
              $hx_generated_class = typeof options.tabsGeneratedHxClass !== 'undefined' ? options.tabsGeneratedHxClass : 'invisible',
              $href = $this.attr( "href" ),
              $controls = $( $href ),
              $text = $this.text();

          if ( $hx !== "" ) {
            $controls.prepend('<' + $hx + ' class="' + $hx_generated_class + '" tabindex="0">' + $text + '</' + $hx + '>');
          }

          if ( $existing_hx !== "" ) {
            $controls.find($existing_hx + ':first-child').attr('tabindex',0);
          }

          if ( typeof $href !== "undefined" && $href !== "" && $href !== "#" ) {
            $this.attr({
              "aria-controls": $href.replace( "#", "" ),
              "tabindex": -1,
              "aria-selected": "false"
            });
          }

          $this.removeAttr("href");
        });
      });

      /* Tabs content ---------------------------------------------------------------------------------------------------- */
      $( Tabs.options.tab_content ).attr({
        "role": "tabpanel",             // contents
        "aria-hidden": "true"           // all hidden
        //"tabindex": 0
      })
      .each( function() {
        var $this = $( this ),
            $this_id = $this.attr( "id" ),
            $prefix_attribute = $("#label_" + $this_id ).closest(Tabs.options.tab_list).attr( 'data-tabs-prefix-class' ),
            $tabs_prefix_classes = typeof $prefix_attribute !== 'undefined' ? $prefix_attribute + '-' : '';
        // label by link
        $this.attr( "aria-labelledby", "label_" + $this_id );

        $this.addClass ( $tabs_prefix_classes + Tabs.options.tab_content.replace('.', ''));
      });

      // search if hash is ON tabs
      if ( Tabs.hash !== "" && $( "#" + Tabs.hash + Tabs.options.tab_content ).length !== 0 ) {
        // display
        $( "#" + Tabs.hash + Tabs.options.tab_content ).removeAttr( "aria-hidden" );
        // selection menu
        $( "#label_" + Tabs.hash + Tabs.options.tab_link ).attr({
          "aria-selected": "true",
          "tabindex": 0
        });
      }

      // search if hash is IN tabs
      if ( Tabs.hash !== "" && $( "#" + Tabs.hash ).parents( Tabs.options.tab_content ).length ){
        var $this_hash = $( "#" + Tabs.hash ),
            $tab_content_parent = $this_hash.parents( Tabs.options.tab_content ),
            $tab_content_parent_id = $tab_content_parent.attr( 'id' );

        $tab_content_parent.removeAttr( "aria-hidden" );
        // selection menu
        $( "#label_" + $tab_content_parent_id + Tabs.options.tab_link ).attr({
          "aria-selected": "true",
          "tabindex": 0
        });
      }

      // if no selected => select first
      Tabs.$tabs.each( function() {
        var $this = $( this ),
            $tab_selected = $this.find( Tabs.options.tab_link + '[aria-selected="true"]' ),
            $first_link = $this.find( Tabs.options.tab_link + ':first' ),
            $first_content = $this.find( Tabs.options.tab_content + ':first' );

        if ( !$tab_selected.length ) {
          $first_link.attr({
            "aria-selected": "true",
            "tabindex": 0
          });
          $first_content.removeAttr( "aria-hidden" );
        }
      });
    },

    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     */
    _bindEvents: function() {
      $( "body" ).on( "click", Tabs.options.tab_link, function( event ) {
        var $this = $( this ),
            $hash_to_update = $this.attr( "aria-controls" ),
            $tab_content_linked = $( "#" + $this.attr( "aria-controls" ) ),
            $parent = $this.closest( Tabs.options.tab_parent ),
            $all_tab_links = $parent.find( Tabs.options.tab_link ),
            $all_tab_contents = $parent.find( Tabs.options.tab_content );

        // aria selected false on all links
        $all_tab_links.attr({
          "tabindex": -1,
          "aria-selected": "false"
        });

        // add aria selected on $this
        $this.attr({
          "aria-selected": "true",
          "tabindex": 0
        });

        // add aria-hidden on all tabs contents
        $all_tab_contents.attr( "aria-hidden", "true" );

        // remove aria-hidden on tab linked
        $tab_content_linked.removeAttr( "aria-hidden" );

        // add fragment (timeout for transitions)
        setTimeout(function(){
          history.pushState(null, null, location.pathname + location.search + '#' + $hash_to_update);
        }, 1000);

        event.preventDefault();
      } )
      /* Key down in tabs */
      .on( "keydown", Tabs.options.tab_list, function( event ) {

        var $parent = $(this).closest( Tabs.options.tab_parent ),
            $activated = $parent.find( Tabs.options.tab_link + '[aria-selected="true"]' ).parent(),
            $last_link = $parent.find( Tabs.options.tab_item + ":last-child " + Tabs.options.tab_link ),
            $first_link = $parent.find( Tabs.options.tab_item + ":first-child " + Tabs.options.tab_link ),
            $focus_on_tab_only = false;

        // some event should be activated only if the focus is on tabs (not on tabpanel)
        if ( $( document.activeElement ).is( $parent.find(Tabs.options.tab_link) ) ){
          $focus_on_tab_only = true;
        }

        // catch keyboard event only if focus is on tab
        if ($focus_on_tab_only && !event.ctrlKey) {
          // strike up or left in the tab
          if ( event.keyCode == 37 || event.keyCode == 38 ) {
            // if we are on first => activate last
            if ( $activated.is( Tabs.options.tab_item + ":first-child" ) ) {
              $last_link.click().focus();
            }
            // else activate previous
            else {
              $activated.prev().children( Tabs.options.tab_link ).click().focus();
            }
            event.preventDefault();
          }
          // strike down or right in the tab
          else if ( event.keyCode == 40 || event.keyCode == 39 ) {
            // if we are on last => activate first
            if ( $activated.is( Tabs.options.tab_item + ":last-child" ) ) {
              $first_link.click().focus();
            }
            // else activate next
            else {
              $activated.next().children( Tabs.options.tab_link ).click().focus();
            }
            event.preventDefault();
          }
          else if ( event.keyCode == 36 ) {
            // activate first tab
            $first_link.click().focus();
            event.preventDefault();
          }
          else if ( event.keyCode == 35 ) {
            // activate last tab
            $last_link.click().focus();
            event.preventDefault();
          }
        }
      } )
      .on( "keydown", Tabs.options.tab_content, function( event ) {

        var $this = $(this),
            $selector_tab_to_focus = $this.attr('aria-labelledby'),
            $tab_to_focus = $("#" + $selector_tab_to_focus),
            $parent_item = $tab_to_focus.parent(),
            $parent_list = $parent_item.parent();

        // CTRL up/Left
        if ( (event.keyCode == 37 || event.keyCode == 38) && event.ctrlKey ) {
          $tab_to_focus.focus();
          event.preventDefault();
        }
        // CTRL PageUp
        if ( event.keyCode == 33 && event.ctrlKey ) {
          $tab_to_focus.focus();

          // if we are on first => activate last
          if ( $parent_item.is( Tabs.options.tab_item + ":first-child" ) ) {
            $parent_list.find( Tabs.options.tab_item + ":last-child " + Tabs.options.tab_link).click().focus();
          }
          // else activate prev
          else {
            $parent_item.prev().children( Tabs.options.tab_link ).click().focus();
          }
          event.preventDefault();
        }
        // CTRL PageDown
        if ( event.keyCode == 34 && event.ctrlKey ) {
          $tab_to_focus.focus();

          // if we are on last => activate first
          if ( $parent_item.is( Tabs.options.tab_item +  ":last-child" ) ) {
            $parent_list.find( Tabs.options.tab_item + ":first-child " + Tabs.options.tab_link).click().focus();
          }
          // else activate next
          else {
            $parent_item.next().children( Tabs.options.tab_link ).click().focus();
          }
          event.preventDefault();
        }

      })
      /* click on a tab link */
      .on( "click", Tabs.options.js_link_to_tab, function( event ) {
        var $this = $(this),
            $tab_to_go = $($this.attr('href')),
            $button_to_click = $( '#' + $tab_to_go.attr('aria-labelledby') );

        // activate tabs
        $button_to_click.click();
        // give focus to the good button
        setTimeout(function(){
          $button_to_click.focus();
        }, 10);
      });
    }
  };

  return /** @alias module:Tabs */ {
    /** init */
    init: Tabs.init
  };

}));
