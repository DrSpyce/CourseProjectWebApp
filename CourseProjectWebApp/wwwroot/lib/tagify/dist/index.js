(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Tagify = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  // console.json = console.json || function(argument){
  //     for(var arg=0; arg < arguments.length; ++arg)
  //         console.log(  JSON.stringify(arguments[arg], null, 4)  )
  // }
  // const isEdge = /Edge/.test(navigator.userAgent)
  var sameStr = function sameStr(s1, s2, caseSensitive, trim) {
    // cast to String
    s1 = "" + s1;
    s2 = "" + s2;

    if (trim) {
      s1 = s1.trim();
      s2 = s2.trim();
    }

    return caseSensitive ? s1 == s2 : s1.toLowerCase() == s2.toLowerCase();
  }; // const getUID = () => (new Date().getTime() + Math.floor((Math.random()*10000)+1)).toString(16)

  var removeCollectionProp = function removeCollectionProp(collection, unwantedProps) {
    return collection.map(function (v) {
      var props = {};

      for (var p in v) {
        if (unwantedProps.indexOf(p) < 0) props[p] = v[p];
      }

      return props;
    });
  };
  function decode(s) {
    var el = document.createElement('div');
    return s.replace(/\&#?[0-9a-z]+;/gi, function (enc) {
      el.innerHTML = enc;
      return el.innerText;
    });
  }
  /**
   * utility method
   * https://stackoverflow.com/a/35385518/104380
   * @param  {String} s [HTML string]
   * @return {Object}   [DOM node]
   */

  function parseHTML(s) {
    var parser = new DOMParser(),
        node = parser.parseFromString(s.trim(), "text/html");
    return node.body.firstElementChild;
  }
  /**
   * Removed new lines and irrelevant spaces which might affect layout, and are better gone
   * @param {string} s [HTML string]
   */

  function minify(s) {
    return s ? s.replace(/\>[\r\n ]+\</g, "><").replace(/(<.*?>)|\s+/g, function (m, $1) {
      return $1 ? $1 : ' ';
    }) // https://stackoverflow.com/a/44841484/104380
    : "";
  }
  function removeTextChildNodes(elm) {
    var iter = document.createNodeIterator(elm, NodeFilter.SHOW_TEXT, null, false),
        textnode; // print all text nodes

    while (textnode = iter.nextNode()) {
      if (!textnode.textContent.trim()) textnode.parentNode.removeChild(textnode);
    }
  }
  function getfirstTextNode(elm, action) {
    action = action || 'previous';

    while (elm = elm[action + 'Sibling']) {
      if (elm.nodeType == 3) return elm;
    }
  }
  /**
   * utility method
   * https://stackoverflow.com/a/6234804/104380
   */

  function escapeHTML(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/`|'/g, "&#039;");
  }

  function isArray(a) {
    return a instanceof Array;
  }
  /**
   * Checks if an argument is a javascript Object
   */


  function isObject(obj) {
    var type = Object.prototype.toString.call(obj).split(' ')[1].slice(0, -1);
    return obj === Object(obj) && type != 'Array' && type != 'Function' && type != 'RegExp' && type != 'HTMLUnknownElement';
  }
  /**
   * merge objects into a single new one
   * TEST: extend({}, {a:{foo:1}, b:[]}, {a:{bar:2}, b:[1], c:()=>{}})
   */

  function extend(o, o1, o2) {
    if (!(o instanceof Object)) o = {};
    copy(o, o1);
    if (o2) copy(o, o2);

    function copy(a, b) {
      // copy o2 to o
      for (var key in b) {
        if (b.hasOwnProperty(key)) {
          if (isObject(b[key])) {
            if (!isObject(a[key])) a[key] = Object.assign({}, b[key]);else copy(a[key], b[key]);
            continue;
          }

          if (isArray(b[key])) {
            a[key] = Object.assign([], b[key]);
            continue;
          }

          a[key] = b[key];
        }
      }
    }

    return o;
  }
  /**
   *  Extracted from: https://stackoverflow.com/a/37511463/104380
   * @param {String} s
   */

  function unaccent(s) {
    // if not supported, do not continue.
    // developers should use a polyfill:
    // https://github.com/walling/unorm
    if (!String.prototype.normalize) return s;
    if (typeof s === 'string') return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  /**
   * Meassures an element's height, which might yet have been added DOM
   * https://stackoverflow.com/q/5944038/104380
   * @param {DOM} node
   */

  function getNodeHeight(node) {
    var height,
        clone = node.cloneNode(true);
    clone.style.cssText = "position:fixed; top:-9999px; opacity:0";
    document.body.appendChild(clone);
    height = clone.clientHeight;
    clone.parentNode.removeChild(clone);
    return height;
  }
  var isChromeAndroidBrowser = /(?=.*chrome)(?=.*android)/i.test(navigator.userAgent);

  var dropdownMethods = {
    init: function init() {
      this.DOM.dropdown = this.parseTemplate('dropdown', [this.settings]);
      this.DOM.dropdown.content = this.DOM.dropdown.querySelector(this.settings.classNames.dropdownWrapperSelector);
    },

    /**
     * shows the suggestions select box
     * @param {String} value [optional, filter the whitelist by this value]
     */
    show: function show(value) {
      var _this = this;

      var _s = this.settings,
          firstListItem,
          firstListItemValue,
          selection = window.getSelection(),
          allowNewTags = _s.mode == 'mix' && !_s.enforceWhitelist,
          noWhitelist = !_s.whitelist || !_s.whitelist.length,
          noMatchListItem,
          isManual = _s.dropdown.position == 'manual'; // if text still exists in the input, and `show` method has no argument, then the input's text should be used

      value = value === undefined ? this.state.inputText : value; // ?????? Do not render suggestions list  if:
      // 1. there's no whitelist (can happen while async loading) AND new tags arn't allowed
      // 2. dropdown is disabled
      // 3. loader is showing (controlled outside of this code)

      if (noWhitelist && !allowNewTags && !_s.templates.dropdownItemNoMatch || _s.dropdown.enable === false || this.state.isLoading) return;
      clearTimeout(this.dropdownHide__bindEventsTimeout); // if no value was supplied, show all the "whitelist" items in the dropdown
      // @type [Array] listItems
      // TODO: add a Setting to control items' sort order for "listItems"

      this.suggestedListItems = this.dropdown.filterListItems.call(this, value); // trigger at this exact point to let the developer the chance to manually set "this.suggestedListItems"

      if (value && !this.suggestedListItems.length) {
        this.trigger('dropdown:noMatch', value);
        if (_s.templates.dropdownItemNoMatch) noMatchListItem = _s.templates.dropdownItemNoMatch.call(this, {
          value: value
        });
      } // if "dropdownItemNoMatch" was no defined, procceed regular flow.
      //


      if (!noMatchListItem) {
        // in mix-mode, if the value isn't included in the whilelist & "enforceWhitelist" setting is "false",
        // then add a custom suggestion item to the dropdown
        if (this.suggestedListItems.length) {
          if (value && allowNewTags && !this.state.editing.scope && !sameStr(this.suggestedListItems[0].value, value)) this.suggestedListItems.unshift({
            value: value
          });
        } else {
          if (value && allowNewTags && !this.state.editing.scope) {
            this.suggestedListItems = [{
              value: value
            }];
          } // hide suggestions list if no suggestion matched
          else {
              this.input.autocomplete.suggest.call(this);
              this.dropdown.hide.call(this);
              return;
            }
        }

        firstListItem = this.suggestedListItems[0];
        firstListItemValue = "" + (isObject(firstListItem) ? firstListItem.value : firstListItem);

        if (_s.autoComplete && firstListItemValue) {
          // only fill the sugegstion if the value of the first list item STARTS with the input value (regardless of "fuzzysearch" setting)
          if (firstListItemValue.indexOf(value) == 0) this.input.autocomplete.suggest.call(this, firstListItem);
        }
      }

      this.dropdown.fill.call(this, noMatchListItem);
      if (_s.dropdown.highlightFirst) this.dropdown.highlightOption.call(this, this.DOM.dropdown.content.children[0]); // bind events, exactly at this stage of the code. "dropdown.show" method is allowed to be
      // called multiple times, regardless if the dropdown is currently visible, but the events-binding
      // should only be called if the dropdown wasn't previously visible.

      if (!this.state.dropdown.visible) // timeout is needed for when pressing arrow down to show the dropdown,
        // so the key event won't get registered in the dropdown events listeners
        setTimeout(this.dropdown.events.binding.bind(this)); // set the dropdown visible state to be the same as the searched value.
      // MUST be set *before* position() is called

      this.state.dropdown.visible = value || true;
      this.state.dropdown.query = value;
      this.state.selection = {
        anchorOffset: selection.anchorOffset,
        anchorNode: selection.anchorNode
      }; // try to positioning the dropdown (it might not yet be on the page, doesn't matter, next code handles this)

      if (!isManual) {
        // a slight delay is needed if the dropdown "position" setting is "text", and nothing was typed in the input,
        // so sadly the "getCaretGlobalPosition" method doesn't recognize the caret position without this delay
        setTimeout(function () {
          _this.dropdown.position.call(_this);

          _this.dropdown.render.call(_this);
        });
      } // a delay is needed because of the previous delay reason.
      // this event must be fired after the dropdown was rendered & positioned


      setTimeout(function () {
        _this.trigger("dropdown:show", _this.DOM.dropdown);
      });
    },
    hide: function hide(force) {
      var _this2 = this;

      var _this$DOM = this.DOM,
          scope = _this$DOM.scope,
          dropdown = _this$DOM.dropdown,
          isManual = this.settings.dropdown.position == 'manual' && !force; // if there's no dropdown, this means the dropdown events aren't binded

      if (!dropdown || !document.body.contains(dropdown) || isManual) return;
      window.removeEventListener('resize', this.dropdown.position);
      this.dropdown.events.binding.call(this, false); // unbind all events
      // if the dropdown is open, and the input (scope) is clicked,
      // the dropdown should be now "close", and the next click (on the scope)
      // should re-open it, and without a timeout, clicking to close will re-open immediately
      //  clearTimeout(this.dropdownHide__bindEventsTimeout)
      //  this.dropdownHide__bindEventsTimeout = setTimeout(this.events.binding.bind(this), 250)  // re-bind main events

      scope.setAttribute("aria-expanded", false);
      dropdown.parentNode.removeChild(dropdown); // scenario: clicking the scope to show the dropdown, clicking again to hide -> calls dropdown.hide() and then re-focuses the input
      // which casues another onFocus event, which checked "this.state.dropdown.visible" and see it as "false" and re-open the dropdown

      setTimeout(function () {
        _this2.state.dropdown.visible = false;
      }, 100);
      this.state.dropdown.query = this.state.ddItemData = this.state.ddItemElm = this.state.selection = null; // if the user closed the dropdown (in mix-mode) while a potential tag was detected, flag the current tag
      // so the dropdown won't be shown on following user input for that "tag"

      if (this.state.tag && this.state.tag.value.length) {
        this.state.flaggedTags[this.state.tag.baseOffset] = this.state.tag;
      }

      this.trigger("dropdown:hide", dropdown);
      return this;
    },
    render: function render() {
      var _this3 = this;

      // let the element render in the DOM first, to accurately measure it.
      // this.DOM.dropdown.style.cssText = "left:-9999px; top:-9999px;";
      var ddHeight = getNodeHeight(this.DOM.dropdown),
          _s = this.settings;
      this.DOM.scope.setAttribute("aria-expanded", true); // if the dropdown has yet to be appended to the DOM,
      // append the dropdown to the body element & handle events

      if (!document.body.contains(this.DOM.dropdown)) {
        this.DOM.dropdown.classList.add(_s.classNames.dropdownInital);
        this.dropdown.position.call(this, ddHeight);

        _s.dropdown.appendTarget.appendChild(this.DOM.dropdown);

        setTimeout(function () {
          return _this3.DOM.dropdown.classList.remove(_s.classNames.dropdownInital);
        });
      }

      return this;
    },

    /**
     *
     * @param {String/Array} HTMLContent - optional
     */
    fill: function fill(HTMLContent) {
      HTMLContent = typeof HTMLContent == 'string' ? HTMLContent : this.dropdown.createListHTML.call(this, HTMLContent || this.suggestedListItems);
      this.DOM.dropdown.content.innerHTML = minify(HTMLContent);
    },

    /**
     * fill data into the suggestions list
     * (mainly used to update the list when removing tags, so they will be re-added to the list. not efficient)
     */
    refilter: function refilter(value) {
      value = value || this.state.dropdown.query || '';
      this.suggestedListItems = this.dropdown.filterListItems.call(this, value);
      this.dropdown.fill.call(this);
      if (!this.suggestedListItems.length) this.dropdown.hide.call(this);
      this.trigger("dropdown:updated", this.DOM.dropdown);
    },
    position: function position(ddHeight) {
      if (this.settings.dropdown.position == 'manual') return;
      var placeAbove,
          rect,
          top,
          bottom,
          left,
          width,
          parentsPositions,
          ddElm = this.DOM.dropdown,
          viewportHeight = document.documentElement.clientHeight,
          viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
          positionTo = viewportWidth > 480 ? this.settings.dropdown.position : 'all',
          ddTarget = this.DOM[positionTo == 'input' ? 'input' : 'scope'];
      ddHeight = ddHeight || ddElm.clientHeight;

      function getParentsPositions(p) {
        var left = 0,
            top = 0;

        while (p) {
          left += p.offsetLeft || 0;
          top += p.offsetTop || 0;
          p = p.parentNode;
        }

        return {
          left: left,
          top: top
        };
      }

      if (!this.state.dropdown.visible) return;

      if (positionTo == 'text') {
        rect = this.getCaretGlobalPosition();
        bottom = rect.bottom;
        top = rect.top;
        left = rect.left;
        width = 'auto';
      } else {
        parentsPositions = getParentsPositions(this.settings.dropdown.appendTarget);
        rect = ddTarget.getBoundingClientRect();
        top = rect.top + 2 - parentsPositions.top;
        bottom = rect.bottom - 1 - parentsPositions.top;
        left = rect.left - parentsPositions.left;
        width = rect.width + 'px';
      }

      top = Math.floor(top);
      bottom = Math.ceil(bottom);
      placeAbove = viewportHeight - rect.bottom < ddHeight; // flip vertically if there is no space for the dropdown below the input

      ddElm.style.cssText = "left:" + (left + window.pageXOffset) + "px; width:" + width + ";" + (placeAbove ? "top: " + (top + window.pageYOffset) + "px" : "top: " + (bottom + window.pageYOffset) + "px");
      ddElm.setAttribute('placement', placeAbove ? "top" : "bottom");
      ddElm.setAttribute('position', positionTo);
    },
    events: {
      /**
       * Events should only be binded when the dropdown is rendered and removed when isn't
       * because there might be multiple Tagify instances on a certain page
       * @param  {Boolean} bindUnbind [optional. true when wanting to unbind all the events]
       */
      binding: function binding() {
        var bindUnbind = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        // references to the ".bind()" methods must be saved so they could be unbinded later
        var _CB = this.dropdown.events.callbacks,
            // callback-refs
        _CBR = this.listeners.dropdown = this.listeners.dropdown || {
          position: this.dropdown.position.bind(this),
          onKeyDown: _CB.onKeyDown.bind(this),
          onMouseOver: _CB.onMouseOver.bind(this),
          onMouseLeave: _CB.onMouseLeave.bind(this),
          onClick: _CB.onClick.bind(this),
          onScroll: _CB.onScroll.bind(this)
        },
            action = bindUnbind ? 'addEventListener' : 'removeEventListener';

        if (this.settings.dropdown.position != 'manual') {
          window[action]('resize', _CBR.position);
          window[action]('keydown', _CBR.onKeyDown);
        }

        this.DOM.dropdown[action]('mouseover', _CBR.onMouseOver);
        this.DOM.dropdown[action]('mouseleave', _CBR.onMouseLeave);
        this.DOM.dropdown[action]('mousedown', _CBR.onClick);
        this.DOM.dropdown.content[action]('scroll', _CBR.onScroll);
      },
      callbacks: {
        onKeyDown: function onKeyDown(e) {
          // get the "active" element, and if there was none (yet) active, use first child
          var activeListElm = this.DOM.dropdown.querySelector(this.settings.classNames.dropdownItemActiveSelector),
              selectedElm = activeListElm;

          switch (e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
            case 'Down': // >IE11

            case 'Up':
              {
                // >IE11
                e.preventDefault();
                var dropdownItems;
                if (selectedElm) selectedElm = selectedElm[(e.key == 'ArrowUp' || e.key == 'Up' ? "previous" : "next") + "ElementSibling"]; // if no element was found, loop

                if (!selectedElm) {
                  dropdownItems = this.DOM.dropdown.content.children;
                  selectedElm = dropdownItems[e.key == 'ArrowUp' || e.key == 'Up' ? dropdownItems.length - 1 : 0];
                }

                this.dropdown.highlightOption.call(this, selectedElm, true);
                break;
              }

            case 'Escape':
            case 'Esc':
              // IE11
              this.dropdown.hide.call(this);
              break;

            case 'ArrowRight':
              if (this.state.actions.ArrowLeft) return;

            case 'Tab':
              {
                // in mix-mode, treat arrowRight like Enter key, so a tag will be created
                if (this.settings.mode != 'mix' && selectedElm && !this.settings.autoComplete.rightKey && !this.state.editing) {
                  e.preventDefault(); // prevents blur so the autocomplete suggestion will not become a tag

                  var tagifySuggestionIdx = selectedElm.getAttribute('tagifySuggestionIdx'),
                      data = tagifySuggestionIdx ? this.suggestedListItems[+tagifySuggestionIdx] : '',
                      value = this.dropdown.getMappedValue.call(this, data);
                  this.input.autocomplete.set.call(this, value);
                  return false;
                }

                return true;
              }

            case 'Enter':
              {
                e.preventDefault();
                this.dropdown.selectOption.call(this, activeListElm);
                break;
              }

            case 'Backspace':
              {
                if (this.settings.mode == 'mix' || this.state.editing.scope) return;

                var _value = this.state.inputText.trim();

                if (_value == "" || _value.charCodeAt(0) == 8203) {
                  if (this.settings.backspace === true) this.removeTags();else if (this.settings.backspace == 'edit') setTimeout(this.editTag.bind(this), 0);
                }
              }
          }
        },
        onMouseOver: function onMouseOver(e) {
          var ddItem = e.target.closest(this.settings.classNames.dropdownItemSelector); // event delegation check

          ddItem && this.dropdown.highlightOption.call(this, ddItem);
        },
        onMouseLeave: function onMouseLeave(e) {
          // de-highlight any previously highlighted option
          this.dropdown.highlightOption.call(this);
        },
        onClick: function onClick(e) {
          var _this4 = this;

          if (e.button != 0 || e.target == this.DOM.dropdown || e.target == this.DOM.dropdown.content) return; // allow only mouse left-clicks

          var listItemElm = e.target.closest(this.settings.classNames.dropdownItemSelector); // temporary set the "actions" state to indicate to the main "blur" event it shouldn't run

          this.state.actions.selectOption = true;
          setTimeout(function () {
            return _this4.state.actions.selectOption = false;
          }, 50);
          this.settings.hooks.suggestionClick(e, {
            tagify: this,
            suggestionElm: listItemElm
          }).then(function () {
            if (listItemElm) _this4.dropdown.selectOption.call(_this4, listItemElm);else _this4.dropdown.hide.call(_this4);
          }).catch(function (err) {
            return err;
          });
        },
        onScroll: function onScroll(e) {
          var elm = e.target,
              pos = elm.scrollTop / (elm.scrollHeight - elm.parentNode.clientHeight) * 100;
          this.trigger("dropdown:scroll", {
            percentage: Math.round(pos)
          });
        }
      }
    },

    /**
     * mark the currently active suggestion option
     * @param {Object}  elm            option DOM node
     * @param {Boolean} adjustScroll   when navigation with keyboard arrows (up/down), aut-scroll to always show the highlighted element
     */
    highlightOption: function highlightOption(elm, adjustScroll) {
      var className = this.settings.classNames.dropdownItemActive,
          itemData; // focus casues a bug in Firefox with the placeholder been shown on the input element
      // if( this.settings.dropdown.position != 'manual' )
      //     elm.focus();

      if (this.state.ddItemElm) {
        this.state.ddItemElm.classList.remove(className);
        this.state.ddItemElm.removeAttribute("aria-selected");
      }

      if (!elm) {
        this.state.ddItemData = null;
        this.state.ddItemElm = null;
        this.input.autocomplete.suggest.call(this);
        return;
      }

      itemData = this.suggestedListItems[this.getNodeIndex(elm)];
      this.state.ddItemData = itemData;
      this.state.ddItemElm = elm; // this.DOM.dropdown.querySelectorAll("." + this.settings.classNames.dropdownItemActive).forEach(activeElm => activeElm.classList.remove(className));

      elm.classList.add(className);
      elm.setAttribute("aria-selected", true);
      if (adjustScroll) elm.parentNode.scrollTop = elm.clientHeight + elm.offsetTop - elm.parentNode.clientHeight; // Try to autocomplete the typed value with the currently highlighted dropdown item

      if (this.settings.autoComplete) {
        this.input.autocomplete.suggest.call(this, itemData);
        this.dropdown.position.call(this); // suggestions might alter the height of the tagify wrapper because of unkown suggested term length that could drop to the next line
      }
    },

    /**
     * Create a tag from the currently active suggestion option
     * @param {Object} elm  DOM node to select
     */
    selectOption: function selectOption(elm) {
      var _this5 = this;

      var _this$settings$dropdo = this.settings.dropdown,
          clearOnSelect = _this$settings$dropdo.clearOnSelect,
          closeOnSelect = _this$settings$dropdo.closeOnSelect;

      if (!elm) {
        this.addTags(this.state.inputText, true);
        closeOnSelect && this.dropdown.hide.call(this);
        return;
      } // if in edit-mode, do not continue but instead replace the tag's text.
      // the scenario is that "addTags" was called from a dropdown suggested option selected while editing


      var tagifySuggestionIdx = elm.getAttribute('tagifySuggestionIdx'),
          tagData = this.suggestedListItems[+tagifySuggestionIdx];
      this.trigger("dropdown:select", {
        data: tagData,
        elm: elm
      }); // above event must  be triggered, regardless of anything else which might go wrong

      if (!tagifySuggestionIdx || !tagData) {
        this.dropdown.hide.call(this);
        return;
      }

      if (this.state.editing) this.onEditTagDone(null, extend({
        __isValid: true
      }, tagData)); // Tagify instances should re-focus to the input element once an option was selected, to allow continuous typing
      else {
          this[this.settings.mode == 'mix' ? "addMixTags" : "addTags"]([tagData], clearOnSelect);
        } // todo: consider not doing this on mix-mode

      setTimeout(function () {
        _this5.DOM.input.focus();

        _this5.toggleFocusClass(true);
      });

      if (closeOnSelect) {
        return this.dropdown.hide.call(this);
      }

      this.dropdown.refilter.call(this);
    },
    selectAll: function selectAll() {
      // having suggestedListItems with items messes with "normalizeTags" when wanting
      // to add all tags
      this.suggestedListItems.length = 0;
      this.dropdown.hide.call(this); // some whitelist items might have already been added as tags so when addings all of them,
      // skip adding already-added ones, so best to use "filterListItems" method over "settings.whitelist"

      this.addTags(this.dropdown.filterListItems.call(this, ''), true);
      return this;
    },

    /**
     * returns an HTML string of the suggestions' list items
     * @param {String} value string to filter the whitelist by
     * @param {Object} options "exact" - for exact complete match
     * @return {Array} list of filtered whitelist items according to the settings provided and current value
     */
    filterListItems: function filterListItems(value, options) {
      var _this6 = this;

      var _s = this.settings,
          _sd = _s.dropdown,
          options = options || {},
          list = [],
          whitelist = _s.whitelist,
          suggestionsCount = _sd.maxItems || Infinity,
          searchKeys = _sd.searchKeys,
          whitelistItem,
          valueIsInWhitelist,
          searchBy,
          isDuplicate,
          niddle,
          i = 0;

      if (!value || !searchKeys.length) {
        return (_s.duplicates ? whitelist : whitelist.filter(function (item) {
          return !_this6.isTagDuplicate(isObject(item) ? item.value : item);
        }) // don't include tags which have already been added.
        ).slice(0, suggestionsCount); // respect "maxItems" dropdown setting
      }

      niddle = _sd.caseSensitive ? "" + value : ("" + value).toLowerCase();

      function stringHasAll(s, query) {
        return query.toLowerCase().split(' ').every(function (q) {
          return s.includes(q.toLowerCase());
        });
      }

      for (; i < whitelist.length; i++) {
        whitelistItem = whitelist[i] instanceof Object ? whitelist[i] : {
          value: whitelist[i]
        }; //normalize value as an Object

        var itemWithoutSearchKeys = !Object.keys(whitelistItem).some(function (k) {
          return searchKeys.includes(k);
        }),
            _searchKeys = itemWithoutSearchKeys ? ["value"] : searchKeys;

        if (_sd.fuzzySearch && !options.exact) {
          searchBy = _searchKeys.reduce(function (values, k) {
            return values + " " + (whitelistItem[k] || "");
          }, "").toLowerCase();

          if (_sd.accentedSearch) {
            searchBy = unaccent(searchBy);
            niddle = unaccent(niddle);
          }

          valueIsInWhitelist = stringHasAll(searchBy, niddle);
        } else {
          valueIsInWhitelist = _searchKeys.some(function (k) {
            var v = '' + (whitelistItem[k] || ''); // if key exists, cast to type String

            if (_sd.accentedSearch) {
              v = unaccent(v);
              niddle = unaccent(niddle);
            }

            if (!_sd.caseSensitive) v = v.toLowerCase();
            return options.exact ? v == niddle : v.indexOf(niddle) == 0;
          });
        }

        isDuplicate = !_s.duplicates && this.isTagDuplicate(isObject(whitelistItem) ? whitelistItem.value : whitelistItem); // match for the value within each "whitelist" item

        if (valueIsInWhitelist && !isDuplicate && suggestionsCount--) list.push(whitelistItem);
        if (suggestionsCount == 0) break;
      }

      return list;
    },

    /**
     * Returns the final value of a tag data (object) with regards to the "mapValueTo" dropdown setting
     * @param {Object} tagData
     * @returns
     */
    getMappedValue: function getMappedValue(tagData) {
      var mapValueTo = this.settings.dropdown.mapValueTo,
          value = mapValueTo ? typeof mapValueTo == 'function' ? mapValueTo(tagData) : tagData[mapValueTo] || tagData.value : tagData.value;
      return value;
    },

    /**
     * Creates the dropdown items' HTML
     * @param  {Array} list  [Array of Objects]
     * @return {String}
     */
    createListHTML: function createListHTML(optionsArr) {
      var _this7 = this;

      return extend([], optionsArr).map(function (suggestion, idx) {
        if (typeof suggestion == 'string' || typeof suggestion == 'number') suggestion = {
          value: suggestion
        };

        var value = _this7.dropdown.getMappedValue.call(_this7, suggestion);

        suggestion.value = value && typeof value == 'string' ? escapeHTML(value) : value;

        var tagHTMLString = _this7.settings.templates.dropdownItem.call(_this7, suggestion); // make sure the sugestion index is present as attribute, to match the data when one is selected


        tagHTMLString = tagHTMLString.replace(/\s*tagifySuggestionIdx=(["'])(.*?)\1/gmi, '') // remove the "tagifySuggestionIdx" attribute if for some reason was there
        .replace('>', " tagifySuggestionIdx=\"".concat(idx, "\">")); // add "tagifySuggestionIdx"

        return tagHTMLString;
      }).join("");
    }
  };

  var DEFAULTS = {
    delimiters: ",",
    // [RegEx] split tags by any of these delimiters ("null" to cancel) Example: ",| |."
    pattern: null,
    // RegEx pattern to validate input by. Ex: /[1-9]/
    tagTextProp: 'value',
    // tag data Object property which will be displayed as the tag's text
    maxTags: Infinity,
    // Maximum number of tags
    callbacks: {},
    // Exposed callbacks object to be triggered on certain events
    addTagOnBlur: true,
    // Flag - automatically adds the text which was inputed as a tag when blur event happens
    duplicates: false,
    // Flag - allow tuplicate tags
    whitelist: [],
    // Array of tags to suggest as the user types (can be used along with "enforceWhitelist" setting)
    blacklist: [],
    // A list of non-allowed tags
    enforceWhitelist: false,
    // Flag - Only allow tags allowed in whitelist
    keepInvalidTags: false,
    // Flag - if true, do not remove tags which did not pass validation
    mixTagsAllowedAfter: /,|\.|\:|\s/,
    // RegEx - Define conditions in which mix-tags content allows a tag to be added after
    mixTagsInterpolator: ['[[', ']]'],
    // Interpolation for mix mode. Everything between this will becmoe a tag
    backspace: true,
    // false / true / "edit"
    skipInvalid: false,
    // If `true`, do not add invalid, temporary, tags before automatically removing them
    editTags: {
      clicks: 2,
      // clicks to enter "edit-mode": 1 for single click. any other value is considered as double-click
      keepInvalid: true // keeps invalid edits as-is until `esc` is pressed while in focus

    },
    // 1 or 2 clicks to edit a tag. false/null for not allowing editing
    transformTag: function transformTag() {},
    // Takes a tag input string as argument and returns a transformed value
    trim: true,
    // whether or not the value provided should be trimmed, before being added as a tag
    mixMode: {
      insertAfterTag: "\xA0" // String/Node to inject after a tag has been added (see #588)

    },
    autoComplete: {
      enabled: true,
      // Tries to suggest the input's value while typing (match from whitelist) by adding the rest of term as grayed-out text
      rightKey: false // If `true`, when Right key is pressed, use the suggested value to create a tag, else just auto-completes the input. in mixed-mode this is set to "true"

    },
    classNames: {
      namespace: 'tagify',
      mixMode: 'tagify--mix',
      selectMode: 'tagify--select',
      input: 'tagify__input',
      focus: 'tagify--focus',
      tag: 'tagify__tag',
      tagNoAnimation: 'tagify--noAnim',
      tagInvalid: 'tagify--invalid',
      tagNotAllowed: 'tagify--notAllowed',
      inputInvalid: 'tagify__input--invalid',
      tagX: 'tagify__tag__removeBtn',
      tagText: 'tagify__tag-text',
      dropdown: 'tagify__dropdown',
      dropdownWrapper: 'tagify__dropdown__wrapper',
      dropdownItem: 'tagify__dropdown__item',
      dropdownItemActive: 'tagify__dropdown__item--active',
      dropdownInital: 'tagify__dropdown--initial',
      scopeLoading: 'tagify--loading',
      tagLoading: 'tagify__tag--loading',
      tagEditing: 'tagify__tag--editable',
      tagFlash: 'tagify__tag--flash',
      tagHide: 'tagify__tag--hide',
      hasMaxTags: 'tagify--hasMaxTags',
      hasNoTags: 'tagify--noTags',
      empty: 'tagify--empty'
    },
    dropdown: {
      classname: '',
      enabled: 2,
      // minimum input characters needs to be typed for the suggestions dropdown to show
      maxItems: 10,
      searchKeys: ["value", "searchBy"],
      fuzzySearch: true,
      caseSensitive: false,
      accentedSearch: true,
      highlightFirst: false,
      // highlights first-matched item in the list
      closeOnSelect: true,
      // closes the dropdown after selecting an item, if `enabled:0` (which means always show dropdown)
      clearOnSelect: true,
      // after selecting a suggetion, should the typed text input remain or be cleared
      position: 'all',
      // 'manual' / 'text' / 'all'
      appendTarget: null // defaults to document.body one DOM has been loaded

    },
    hooks: {
      beforeRemoveTag: function beforeRemoveTag() {
        return Promise.resolve();
      },
      suggestionClick: function suggestionClick() {
        return Promise.resolve();
      }
    }
  };

  var templates = {
    /**
     *
     * @param {DOM Object} input     Original input DOm element
     * @param {Object}     settings  Tagify instance settings Object
     */
    wrapper: function wrapper(input, _s) {
      return "<tags class=\"".concat(_s.classNames.namespace, " ").concat(_s.mode ? "".concat(_s.classNames[_s.mode + "Mode"]) : "", " ").concat(input.className, "\"\n                    ").concat(_s.readonly ? 'readonly' : '', "\n                    ").concat(_s.required ? 'required' : '', "\n                    tabIndex=\"-1\">\n            <span ").concat(!_s.readonly || _s.mode != 'mix' ? 'contenteditable' : '', " data-placeholder=\"").concat(_s.placeholder || '&#8203;', "\" aria-placeholder=\"").concat(_s.placeholder || '', "\"\n                class=\"").concat(_s.classNames.input, "\"\n                role=\"textbox\"\n                aria-autocomplete=\"both\"\n                aria-multiline=\"").concat(_s.mode == 'mix' ? true : false, "\"></span>\n        </tags>");
    },
    tag: function tag(tagData) {
      return "<tag title=\"".concat(tagData.title || tagData.value, "\"\n                    contenteditable='false'\n                    spellcheck='false'\n                    tabIndex=\"-1\"\n                    class=\"").concat(this.settings.classNames.tag, " ").concat(tagData.class ? tagData.class : "", "\"\n                    ").concat(this.getAttributes(tagData), ">\n            <x title='' class=\"").concat(this.settings.classNames.tagX, "\" role='button' aria-label='remove tag'></x>\n            <div>\n                <span class=\"").concat(this.settings.classNames.tagText, "\">").concat(tagData[this.settings.tagTextProp] || tagData.value, "</span>\n            </div>\n        </tag>");
    },
    dropdown: function dropdown(settings) {
      var _sd = settings.dropdown,
          isManual = _sd.position == 'manual',
          className = "".concat(settings.classNames.dropdown);
      return "<div class=\"".concat(isManual ? "" : className, " ").concat(_sd.classname, "\" role=\"listbox\" aria-labelledby=\"dropdown\">\n                    <div class=\"").concat(settings.classNames.dropdownWrapper, "\"></div>\n                </div>");
    },
    dropdownItem: function dropdownItem(item) {
      return "<div ".concat(this.getAttributes(item), "\n                    class='").concat(this.settings.classNames.dropdownItem, " ").concat(item.class ? item.class : "", "'\n                    tabindex=\"0\"\n                    role=\"option\">").concat(item.value, "</div>");
    },
    dropdownItemNoMatch: null
  };

  function EventDispatcher(instance) {
    // Create a DOM EventTarget object
    var target = document.createTextNode('');

    function addRemove(op, events, cb) {
      if (cb) events.split(/\s+/g).forEach(function (name) {
        return target[op + 'EventListener'].call(target, name, cb);
      });
    } // Pass EventTarget interface calls to DOM EventTarget object


    return {
      off: function off(events, cb) {
        addRemove('remove', events, cb);
        return this;
      },
      on: function on(events, cb) {
        if (cb && typeof cb == 'function') addRemove('add', events, cb);
        return this;
      },
      trigger: function trigger(eventName, data, opts) {
        var e;
        opts = opts || {
          cloneData: true
        };
        if (!eventName) return;

        if (instance.settings.isJQueryPlugin) {
          if (eventName == 'remove') eventName = 'removeTag'; // issue #222

          jQuery(instance.DOM.originalInput).triggerHandler(eventName, [data]);
        } else {
          try {
            var eventData = _typeof(data) === 'object' ? data : {
              value: data
            };
            eventData = opts.cloneData ? extend({}, eventData) : eventData;
            eventData.tagify = this; // TODO: move the below to the "extend" function

            if (data instanceof Object) for (var prop in data) {
              if (data[prop] instanceof HTMLElement) eventData[prop] = data[prop];
            }
            e = new CustomEvent(eventName, {
              "detail": eventData
            });
          } catch (err) {
            console.warn(err);
          }

          target.dispatchEvent(e);
        }
      }
    };
  }

  function triggerChangeEvent() {
    if (this.settings.mixMode.integrated) return;
    var inputElm = this.DOM.originalInput,
        changed = this.state.lastOriginalValueReported !== inputElm.value,
        event = new CustomEvent("change", {
      bubbles: true
    }); // must use "CustomEvent" and not "Event" to support IE

    if (!changed) return; // must apply this BEFORE triggering the simulated event

    this.state.lastOriginalValueReported = inputElm.value; // React hack: https://github.com/facebook/react/issues/11488

    event.simulated = true;
    if (inputElm._valueTracker) inputElm._valueTracker.setValue(Math.random());
    inputElm.dispatchEvent(event); // also trigger a Tagify event

    this.trigger("change", this.state.lastOriginalValueReported); // React, for some reason, clears the input's value after "dispatchEvent" is fired

    inputElm.value = this.state.lastOriginalValueReported;
  }
  var events = {
    // bind custom events which were passed in the settings
    customBinding: function customBinding() {
      var _this2 = this;

      this.customEventsList.forEach(function (name) {
        _this2.on(name, _this2.settings.callbacks[name]);
      });
    },
    binding: function binding() {
      var bindUnbind = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var _CB = this.events.callbacks,
          _CBR,
          action = bindUnbind ? 'addEventListener' : 'removeEventListener'; // do not allow the main events to be bound more than once


      if (this.state.mainEvents && bindUnbind) return; // set the binding state of the main events, so they will not be bound more than once

      this.state.mainEvents = bindUnbind; // everything inside gets executed only once-per instance

      if (bindUnbind && !this.listeners.main) {
        // this event should never be unbinded:
        // IE cannot register "input" events on contenteditable elements, so the "keydown" should be used instead..
        this.DOM.input.addEventListener(this.isIE ? "keydown" : "input", _CB[this.isIE ? "onInputIE" : "onInput"].bind(this));
        if (this.settings.isJQueryPlugin) jQuery(this.DOM.originalInput).on('tagify.removeAllTags', this.removeAllTags.bind(this));
      } // setup callback references so events could be removed later


      _CBR = this.listeners.main = this.listeners.main || {
        focus: ['input', _CB.onFocusBlur.bind(this)],
        blur: ['input', _CB.onFocusBlur.bind(this)],
        keydown: ['input', _CB.onKeydown.bind(this)],
        click: ['scope', _CB.onClickScope.bind(this)],
        dblclick: ['scope', _CB.onDoubleClickScope.bind(this)],
        paste: ['input', _CB.onPaste.bind(this)]
      };

      for (var eventName in _CBR) {
        // make sure the focus/blur event is always regesitered (and never more than once)
        if (eventName == 'blur' && !bindUnbind) continue;

        this.DOM[_CBR[eventName][0]][action](eventName, _CBR[eventName][1]);
      }
    },

    /**
     * DOM events callbacks
     */
    callbacks: {
      onFocusBlur: function onFocusBlur(e) {
        var text = e.target ? this.trim(e.target.textContent) : '',
            // a string
        _s = this.settings,
            type = e.type,
            ddEnabled = _s.dropdown.enabled >= 0,
            eventData = {
          relatedTarget: e.relatedTarget
        },
            isTargetSelectOption = this.state.actions.selectOption && (ddEnabled || !_s.dropdown.closeOnSelect),
            isTargetAddNewBtn = this.state.actions.addNew && ddEnabled,
            shouldAddTags;

        if (type == 'blur') {
          if (e.relatedTarget === this.DOM.scope) {
            this.dropdown.hide.call(this);
            this.DOM.input.focus();
            return;
          }

          this.postUpdate();
          this.triggerChangeEvent();
        }

        if (isTargetSelectOption || isTargetAddNewBtn) return;
        this.state.hasFocus = type == "focus" ? +new Date() : false;
        this.toggleFocusClass(this.state.hasFocus);

        if (_s.mode == 'mix') {
          if (type == "focus") {
            this.trigger("focus", eventData);
          } else if (e.type == "blur") {
            this.trigger("blur", eventData);
            this.loading(false);
            this.dropdown.hide.call(this); // reset state which needs reseting

            this.state.dropdown.visible = undefined;
            this.setStateSelection();
          }

          return;
        }

        if (type == "focus") {
          this.trigger("focus", eventData); //  e.target.classList.remove('placeholder');

          if (_s.dropdown.enabled === 0) {
            // && _s.mode != "select"
            this.dropdown.show.call(this);
          }

          return;
        } else if (type == "blur") {
          this.trigger("blur", eventData);
          this.loading(false);
          shouldAddTags = this.settings.mode == 'select' ? !this.value.length || this.value[0].value != text : text && !this.state.actions.selectOption && _s.addTagOnBlur; // do not add a tag if "selectOption" action was just fired (this means a tag was just added from the dropdown)

          shouldAddTags && this.addTags(text, true);
        }

        this.DOM.input.removeAttribute('style');
        this.dropdown.hide.call(this);
      },
      onKeydown: function onKeydown(e) {
        var _this3 = this;

        var s = this.trim(e.target.textContent);
        this.trigger("keydown", {
          originalEvent: this.cloneEvent(e)
        });
        /**
         * ONLY FOR MIX-MODE:
         */

        if (this.settings.mode == 'mix') {
          switch (e.key) {
            case 'Left':
            case 'ArrowLeft':
              {
                // when left arrow was pressed, raise a flag so when the dropdown is shown, right-arrow will be ignored
                // because it seems likely the user wishes to use the arrows to move the caret
                this.state.actions.ArrowLeft = true;
                break;
              }

            case 'Delete':
            case 'Backspace':
              {
                if (this.state.editing) return;
                var sel = document.getSelection(),
                    deleteKeyTagDetected = e.key == 'Delete' && sel.anchorOffset == (sel.anchorNode.length || 0),
                    isCaretAfterTag = sel.anchorNode.nodeType == 1 || !sel.anchorOffset && sel.anchorNode.previousElementSibling,
                    lastInputValue = decode(this.DOM.input.innerHTML),
                    lastTagElems = this.getTagElms(),
                    //  isCaretInsideTag = sel.anchorNode.parentNode('.' + this.settings.classNames.tag),
                tagElmToBeDeleted,
                    firstTextNodeBeforeTag;

                if (isChromeAndroidBrowser && isCaretAfterTag) {
                  firstTextNodeBeforeTag = getfirstTextNode(isCaretAfterTag);
                  if (!isCaretAfterTag.hasAttribute('readonly')) isCaretAfterTag.remove(); // since this is Chrome, can safetly use this "new" DOM API
                  // Android-Chrome wrongly hides the keyboard, and loses focus,
                  // so this hack below is needed to regain focus at the correct place:

                  this.DOM.input.focus();
                  setTimeout(function () {
                    _this3.placeCaretAfterNode(firstTextNodeBeforeTag);

                    _this3.DOM.input.click();
                  });
                  return;
                }

                if (sel.anchorNode.nodeName == 'BR') return;
                if ((deleteKeyTagDetected || isCaretAfterTag) && sel.anchorNode.nodeType == 1) {
                  if (sel.anchorOffset == 0) // caret is at the very begining, before a tag
                    tagElmToBeDeleted = deleteKeyTagDetected // delete key pressed
                    ? lastTagElems[0] : null;else tagElmToBeDeleted = lastTagElems[sel.anchorOffset - 1]; // find out if a tag *might* be a candidate for deletion, and if so, which

                } else if (deleteKeyTagDetected) tagElmToBeDeleted = sel.anchorNode.nextElementSibling;else if (isCaretAfterTag) tagElmToBeDeleted = isCaretAfterTag; // tagElm.hasAttribute('readonly')

                if (sel.anchorNode.nodeType == 3 && // node at caret location is a Text node
                !sel.anchorNode.nodeValue && // has some text
                sel.anchorNode.previousElementSibling) // text node has a Tag node before it
                  e.preventDefault(); // if backspace not allowed, do nothing
                // TODO: a better way to detect if nodes were deleted is to simply check the "this.value" before & after

                if ((isCaretAfterTag || deleteKeyTagDetected) && !this.settings.backspace) {
                  e.preventDefault();
                  return;
                }

                if (sel.type != 'Range' && !sel.anchorOffset && sel.anchorNode == this.DOM.input && e.key != 'Delete') {
                  e.preventDefault();
                  return;
                }

                if (sel.type != 'Range' && tagElmToBeDeleted && tagElmToBeDeleted.hasAttribute('readonly')) {
                  // allows the continuation of deletion by placing the caret on the first previous textNode.
                  // since a few readonly-tags might be one after the other, iteration is needed:
                  this.placeCaretAfterNode(getfirstTextNode(tagElmToBeDeleted));
                  return;
                } // nodeType is "1" only when the caret is at the end after last tag (no text after), or before first first (no text before)


                if (this.isFirefox && sel.anchorNode.nodeType == 1 && sel.anchorOffset != 0) {
                  this.removeTags(); // removes last tag by default if no parameter supplied
                  // place caret inside last textNode, if exist. it's an annoying bug only in FF,
                  // if the last tag is removed, and there is a textNode before it, the caret is not placed at its end

                  this.placeCaretAfterNode(this.setRangeAtStartEnd());
                } // a minimum delay is needed before the node actually gets detached from the document (don't know why),
                // to know exactly which tag was deleted. This is the easiest way of knowing besides using MutationObserver


                setTimeout(function () {
                  var sel = document.getSelection(),
                      currentValue = decode(_this3.DOM.input.innerHTML),
                      prevElm = sel.anchorNode.previousElementSibling; // fixes #384, where the first and only tag will not get removed with backspace

                  if (!isChromeAndroidBrowser && currentValue.length >= lastInputValue.length && prevElm && !prevElm.hasAttribute('readonly')) {
                    _this3.removeTags(prevElm);

                    _this3.fixFirefoxLastTagNoCaret(); // the above "removeTag" methods removes the tag with a transition. Chrome adds a <br> element for some reason at this stage


                    if (_this3.DOM.input.children.length == 2 && _this3.DOM.input.children[1].tagName == "BR") {
                      _this3.DOM.input.innerHTML = "";
                      _this3.value.length = 0;
                      return true;
                    }
                  } // find out which tag(s) were deleted and trigger "remove" event
                  // iterate over the list of tags still in the document and then filter only those from the "this.value" collection


                  _this3.value = [].map.call(lastTagElems, function (node, nodeIdx) {
                    var tagData = _this3.tagData(node); // since readonly cannot be removed (it's technically resurrected if removed somehow)


                    if (node.parentNode || tagData.readonly) return tagData;else _this3.trigger('remove', {
                      tag: node,
                      index: nodeIdx,
                      data: tagData
                    });
                  }).filter(function (n) {
                    return n;
                  }); // remove empty items in the mapped array
                }, 50); // Firefox needs this higher duration for some reason or things get buggy when deleting text from the end

                break;
              }
            // currently commented to allow new lines in mixed-mode
            // case 'Enter' :
            //     e.preventDefault(); // solves Chrome bug - http://stackoverflow.com/a/20398191/104380
          }

          return true;
        }

        switch (e.key) {
          case 'Backspace':
            if (!this.state.dropdown.visible || this.settings.dropdown.position == 'manual') {
              if (s == "" || s.charCodeAt(0) == 8203) {
                // 8203: ZERO WIDTH SPACE unicode
                if (this.settings.backspace === true) this.removeTags();else if (this.settings.backspace == 'edit') setTimeout(this.editTag.bind(this), 0); // timeout reason: when edited tag gets focused and the caret is placed at the end, the last character gets deletec (because of backspace)
              }
            }

            break;

          case 'Esc':
          case 'Escape':
            if (this.state.dropdown.visible) return;
            e.target.blur();
            break;

          case 'Down':
          case 'ArrowDown':
            // if( this.settings.mode == 'select' ) // issue #333
            if (!this.state.dropdown.visible) this.dropdown.show.call(this);
            break;

          case 'ArrowRight':
            {
              var tagData = this.state.inputSuggestion || this.state.ddItemData;

              if (tagData && this.settings.autoComplete.rightKey) {
                this.addTags([tagData], true);
                return;
              }

              break;
            }

          case 'Tab':
            {
              var selectMode = this.settings.mode == 'select';
              if (s && !selectMode) e.preventDefault();else return true;
            }

          case 'Enter':
            if (this.state.dropdown.visible || e.keyCode == 229) return;
            e.preventDefault(); // solves Chrome bug - http://stackoverflow.com/a/20398191/104380
            // because the main "keydown" event is bound before the dropdown events, this will fire first and will not *yet*
            // know if an option was just selected from the dropdown menu. If an option was selected,
            // the dropdown events should handle adding the tag

            setTimeout(function () {
              if (_this3.state.actions.selectOption) return;

              _this3.addTags(s, true);
            });
        }
      },
      onInput: function onInput(e) {
        if (this.settings.mode == 'mix') return this.events.callbacks.onMixTagsInput.call(this, e);
        var value = this.input.normalize.call(this),
            showSuggestions = value.length >= this.settings.dropdown.enabled,
            eventData = {
          value: value,
          inputElm: this.DOM.input
        };
        eventData.isValid = this.validateTag({
          value: value
        });
        this.trigger('input', eventData); // "input" event must be triggered at this point, before the dropdown is shown
        // for IE; since IE doesn't have an "input" event so "keyDown" is used instead to trigger the "onInput" callback,
        // and so many keys do not change the input, and for those do not continue.

        if (this.state.inputText == value) return; // save the value on the input's State object

        this.input.set.call(this, value, false); // update the input with the normalized value and run validations
        // this.setRangeAtStartEnd(); // fix caret position

        if (value.search(this.settings.delimiters) != -1) {
          if (this.addTags(value)) {
            this.input.set.call(this); // clear the input field's value
          }
        } else if (this.settings.dropdown.enabled >= 0) {
          this.dropdown[showSuggestions ? "show" : "hide"].call(this, value);
        }
      },
      onMixTagsInput: function onMixTagsInput(e) {
        var _this4 = this;

        var range,
            rangeText,
            match,
            matchedPatternCount,
            tag,
            showSuggestions,
            selection,
            _s = this.settings,
            lastTagsCount = this.value.length,
            matchFlaggedTag,
            matchDelimiters,
            tagsElems = this.getTagElms(),
            fragment = document.createDocumentFragment(),
            range = window.getSelection().getRangeAt(0),
            remainingTagsValues = [].map.call(tagsElems, function (node) {
          return _this4.tagData(node).value;
        }); // Android Chrome "keydown" event argument does not report the correct "key".
        // this workaround is needed to manually call "onKeydown" method with a synthesized event object

        if (e.inputType == "deleteContentBackward" && isChromeAndroidBrowser) {
          this.events.callbacks.onKeydown.call(this, {
            target: e.target,
            key: "Backspace"
          });
        } // re-add "readonly" tags which might have been removed


        this.value.slice().forEach(function (item) {
          if (item.readonly && !remainingTagsValues.includes(item.value)) fragment.appendChild(_this4.createTagElem(item));
        });

        if (fragment.childNodes.length) {
          range.insertNode(fragment);
          this.setRangeAtStartEnd(false, fragment.lastChild);
        } // check if tags were "magically" added/removed (browser redo/undo or CTRL-A -> delete)


        if (tagsElems.length != lastTagsCount) {
          this.value = [].map.call(this.getTagElms(), function (node) {
            return _this4.tagData(node);
          });
          this.update({
            withoutChangeEvent: true
          });
          return;
        }

        if (this.hasMaxTags()) return true;

        if (window.getSelection) {
          selection = window.getSelection(); // only detect tags if selection is inside a textNode (not somehow on already-existing tag)

          if (selection.rangeCount > 0 && selection.anchorNode.nodeType == 3) {
            range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            range.setStart(selection.focusNode, 0);
            rangeText = range.toString().slice(0, range.endOffset); // slice the range so everything AFTER the caret will be trimmed
            // split = range.toString().split(_s.mixTagsAllowedAfter)  // ["foo", "bar", "@baz"]

            matchedPatternCount = rangeText.split(_s.pattern).length - 1;
            match = rangeText.match(_s.pattern);
            if (match) // tag string, example: "@aaa ccc"
              tag = rangeText.slice(rangeText.lastIndexOf(match[match.length - 1]));

            if (tag) {
              this.state.actions.ArrowLeft = false; // start fresh, assuming the user did not (yet) used any arrow to move the caret

              this.state.tag = {
                prefix: tag.match(_s.pattern)[0],
                value: tag.replace(_s.pattern, '') // get rid of the prefix

              };
              this.state.tag.baseOffset = selection.baseOffset - this.state.tag.value.length;
              matchDelimiters = this.state.tag.value.match(_s.delimiters); // if a delimeter exists, add the value as tag (exluding the delimiter)

              if (matchDelimiters) {
                this.state.tag.value = this.state.tag.value.replace(_s.delimiters, '');
                this.state.tag.delimiters = matchDelimiters[0];
                this.addTags(this.state.tag.value, _s.dropdown.clearOnSelect);
                this.dropdown.hide.call(this);
                return;
              }

              showSuggestions = this.state.tag.value.length >= _s.dropdown.enabled; // When writeing something that might look like a tag (an email address) but isn't one - it is unwanted
              // the suggestions dropdown be shown, so the user closes it (in any way), and while continue typing,
              // dropdown should stay closed until another tag is typed.
              // if( this.state.tag.value.length && this.state.dropdown.visible === false )
              //     showSuggestions = false
              // test for similar flagged tags to the current tag

              try {
                matchFlaggedTag = this.state.flaggedTags[this.state.tag.baseOffset];
                matchFlaggedTag = matchFlaggedTag.prefix == this.state.tag.prefix && matchFlaggedTag.value[0] == this.state.tag.value[0]; // reset

                if (this.state.flaggedTags[this.state.tag.baseOffset] && !this.state.tag.value) delete this.state.flaggedTags[this.state.tag.baseOffset];
              } catch (err) {} // scenario: (do not show suggestions of previous matched tag, if more than 1 detected)
              // (2 tags exist)                          " a@a.com and @"
              // (second tag is removed by backspace)    " a@a.com and "


              if (matchFlaggedTag || matchedPatternCount < this.state.mixMode.matchedPatternCount) showSuggestions = false;
            } // no (potential) tag found
            else {
                this.state.flaggedTags = {};
              }

            this.state.mixMode.matchedPatternCount = matchedPatternCount;
          }
        } // wait until the "this.value" has been updated (see "onKeydown" method for "mix-mode")
        // the dropdown must be shown only after this event has been driggered, so an implementer could
        // dynamically change the whitelist.


        setTimeout(function () {
          _this4.update({
            withoutChangeEvent: true
          });

          _this4.trigger("input", extend({}, _this4.state.tag, {
            textContent: _this4.DOM.input.textContent
          }));

          if (_this4.state.tag) _this4.dropdown[showSuggestions ? "show" : "hide"].call(_this4, _this4.state.tag.value);
        }, 10);
      },
      onInputIE: function onInputIE(e) {
        var _this = this; // for the "e.target.textContent" to be changed, the browser requires a small delay


        setTimeout(function () {
          _this.events.callbacks.onInput.call(_this, e);
        });
      },
      onClickScope: function onClickScope(e) {
        var _s = this.settings,
            tagElm = e.target.closest('.' + _s.classNames.tag),
            timeDiffFocus = +new Date() - this.state.hasFocus;

        if (e.target == this.DOM.scope) {
          if (!this.state.hasFocus) this.DOM.input.focus();
          return;
        } else if (e.target.classList.contains(_s.classNames.tagX)) {
          this.removeTags(e.target.parentNode);
          return;
        } else if (tagElm) {
          this.trigger("click", {
            tag: tagElm,
            index: this.getNodeIndex(tagElm),
            data: this.tagData(tagElm),
            originalEvent: this.cloneEvent(e)
          });
          if (_s.editTags === 1 || _s.editTags.clicks === 1) this.events.callbacks.onDoubleClickScope.call(this, e);
          return;
        } // when clicking on the input itself
        else if (e.target == this.DOM.input) {
            if (_s.mode == 'mix') {
              // firefox won't show caret if last element is a tag (and not a textNode),
              // so an empty textnode should be added
              this.fixFirefoxLastTagNoCaret();
            }

            if (timeDiffFocus > 500) {
              if (this.state.dropdown.visible) this.dropdown.hide.call(this);else if (_s.dropdown.enabled === 0 && _s.mode != 'mix') this.dropdown.show.call(this);
              return;
            }
          }

        if (_s.mode == 'select') !this.state.dropdown.visible && this.dropdown.show.call(this);
      },
      // special proccess is needed for pasted content in order to "clean" it
      onPaste: function onPaste(e) {
        var clipboardData, pastedData;
        e.preventDefault();
        if (this.settings.readonly) return; // Get pasted data via clipboard API

        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');
        this.injectAtCaret(pastedData, window.getSelection().getRangeAt(0));
        if (this.settings.mode != 'mix') this.addTags(this.DOM.input.textContent, true);
      },
      onEditTagInput: function onEditTagInput(editableElm, e) {
        var tagElm = editableElm.closest('.' + this.settings.classNames.tag),
            tagElmIdx = this.getNodeIndex(tagElm),
            tagData = this.tagData(tagElm),
            value = this.input.normalize.call(this, editableElm),
            hasChanged = tagElm.innerHTML != tagElm.__tagifyTagData.__originalHTML,
            isValid = this.validateTag(_defineProperty({}, this.settings.tagTextProp, value)); // the value could have been invalid in the first-place so make sure to re-validate it (via "addEmptyTag" method)
        // if the value is same as before-editing and the tag was valid before as well, ignore the  current "isValid" result, which is false-positive

        if (!hasChanged && editableElm.originalIsValid === true) isValid = true;
        tagElm.classList.toggle(this.settings.classNames.tagInvalid, isValid !== true);
        tagData.__isValid = isValid;
        tagElm.title = isValid === true ? tagData.title || tagData.value : isValid; // change the tag's title to indicate why is the tag invalid (if it's so)
        // show dropdown if typed text is equal or more than the "enabled" dropdown setting

        if (value.length >= this.settings.dropdown.enabled) {
          // this check is needed apparently because doing browser "undo" will fire
          //  "onEditTagInput" but "this.state.editing" will be "false"
          if (this.state.editing) this.state.editing.value = value;
          this.dropdown.show.call(this, value);
        }

        this.trigger("edit:input", {
          tag: tagElm,
          index: tagElmIdx,
          data: extend({}, this.value[tagElmIdx], {
            newValue: value
          }),
          originalEvent: this.cloneEvent(e)
        });
      },
      onEditTagFocus: function onEditTagFocus(tagElm) {
        this.state.editing = {
          scope: tagElm,
          input: tagElm.querySelector("[contenteditable]")
        };
      },
      onEditTagBlur: function onEditTagBlur(editableElm) {
        var _extend;

        if (!this.state.hasFocus) this.toggleFocusClass(); // one scenario is when selecting a suggestion from the dropdown, when editing, and by selecting it
        // the "onEditTagDone" is called directly, already replacing the tag, so the argument "editableElm"
        // node isn't in the DOM anynmore because it has been replaced.

        if (!this.DOM.scope.contains(editableElm)) return;

        var _s = this.settings,
            tagElm = editableElm.closest('.' + _s.classNames.tag),
            textValue = this.input.normalize.call(this, editableElm),
            originalData = this.tagData(tagElm).__originalData,
            // pre-edit data
        hasChanged = tagElm.innerHTML != tagElm.__tagifyTagData.__originalHTML,
            isValid = this.validateTag(_defineProperty({}, _s.tagTextProp, textValue)),
            newTagData; //  this.DOM.input.focus()


        if (!textValue) {
          this.onEditTagDone(tagElm);
          return;
        } // if nothing changed revert back to how it was before editing


        if (!hasChanged) {
          this.onEditTagDone(tagElm, originalData);
          return;
        }

        newTagData = this.getWhitelistItem(textValue) || extend({}, originalData, (_extend = {}, _defineProperty(_extend, _s.tagTextProp, textValue), _defineProperty(_extend, "value", textValue), _extend));

        _s.transformTag.call(this, newTagData, originalData); // MUST re-validate after tag transformation
        // only validate the "tagTextProp" because is the only thing that metters for validation


        isValid = this.validateTag(_defineProperty({}, _s.tagTextProp, newTagData[_s.tagTextProp]));

        if (isValid !== true) {
          this.trigger("invalid", {
            data: newTagData,
            tag: tagElm,
            message: isValid
          }); // do nothing if invalid, stay in edit-mode until corrected or reverted by presssing esc

          if (_s.editTags.keepInvalid) return;
          if (_s.keepInvalidTags) newTagData.__isValid = isValid;else // revert back if not specified to keep
            newTagData = originalData;
        } // tagElm.classList.toggle(_s.classNames.tagInvalid, true)


        this.onEditTagDone(tagElm, newTagData);
      },
      onEditTagkeydown: function onEditTagkeydown(e, tagElm) {
        this.trigger("edit:keydown", {
          originalEvent: this.cloneEvent(e)
        });

        switch (e.key) {
          case 'Esc':
          case 'Escape':
            tagElm.innerHTML = tagElm.__tagifyTagData.__originalHTML;

          case 'Enter':
          case 'Tab':
            e.preventDefault();
            e.target.blur();
        }
      },
      onDoubleClickScope: function onDoubleClickScope(e) {
        var tagElm = e.target.closest('.' + this.settings.classNames.tag),
            _s = this.settings,
            isEditingTag,
            isReadyOnlyTag;
        if (!tagElm) return;
        isEditingTag = tagElm.classList.contains(this.settings.classNames.tagEditing);
        isReadyOnlyTag = tagElm.hasAttribute('readonly');
        if (_s.mode != 'select' && !_s.readonly && !isEditingTag && !isReadyOnlyTag && this.settings.editTags) this.editTag(tagElm);
        this.toggleFocusClass(true);
        this.trigger('dblclick', {
          tag: tagElm,
          index: this.getNodeIndex(tagElm),
          data: this.tagData(tagElm)
        });
      }
    }
  };

  /**
   * @constructor
   * @param {Object} input    DOM element
   * @param {Object} settings settings object
   */

  function Tagify(input, settings) {
    if (!input) {
      console.warn('Tagify: ', 'input element not found', input);
      return this;
    }

    if (input.previousElementSibling && input.previousElementSibling.classList.contains('tagify')) {
      console.warn('Tagify: ', 'input element is already Tagified', input);
      return this;
    }

    extend(this, EventDispatcher(this));
    this.isFirefox = typeof InstallTrigger !== 'undefined';
    this.isIE = window.document.documentMode; // https://developer.mozilla.org/en-US/docs/Web/API/Document/compatMode#Browser_compatibility

    this.applySettings(input, settings || {});
    this.state = {
      inputText: '',
      editing: false,
      actions: {},
      // UI actions for state-locking
      mixMode: {},
      dropdown: {},
      flaggedTags: {} // in mix-mode, when a string is detetced as potential tag, and the user has chocen to close the suggestions dropdown, keep the record of the tasg here

    };
    this.value = []; // tags' data
    // events' callbacks references will be stores here, so events could be unbinded

    this.listeners = {};
    this.DOM = {}; // Store all relevant DOM elements in an Object

    this.build(input);
    this.getCSSVars();
    this.loadOriginalValues();
    this.events.customBinding.call(this);
    this.events.binding.call(this);
    input.autofocus && this.DOM.input.focus();
  }

  Tagify.prototype = {
    dropdown: dropdownMethods,
    TEXTS: {
      empty: "empty",
      exceed: "number of tags exceeded",
      pattern: "pattern mismatch",
      duplicate: "already exists",
      notAllowed: "not allowed"
    },
    customEventsList: ['change', 'add', 'remove', 'invalid', 'input', 'click', 'keydown', 'focus', 'blur', 'edit:input', 'edit:beforeUpdate', 'edit:updated', 'edit:start', 'edit:keydown', 'dropdown:show', 'dropdown:hide', 'dropdown:select', 'dropdown:updated', 'dropdown:noMatch'],
    trim: function trim(text) {
      return this.settings.trim && text && typeof text == "string" ? text.trim() : text;
    },
    // expose this handy utility function
    parseHTML: parseHTML,
    templates: templates,
    parseTemplate: function parseTemplate(template, data) {
      template = this.settings.templates[template] || template;
      return this.parseHTML(template.apply(this, data));
    },
    applySettings: function applySettings(input, settings) {
      DEFAULTS.templates = this.templates;

      var _s = this.settings = extend({}, DEFAULTS, settings);

      _s.readonly = input.hasAttribute('readonly'); // if "readonly" do not include an "input" element inside the Tags component

      _s.placeholder = input.getAttribute('placeholder') || _s.placeholder || "";
      _s.required = input.hasAttribute('required');

      var _loop = function _loop(name) {
        Object.defineProperty(_s.classNames, name + "Selector", {
          get: function get() {
            return "." + this[name].split(" ").join(".");
          }
        });
      };

      for (var name in _s.classNames) {
        _loop(name);
      }

      if (this.isIE) _s.autoComplete = false; // IE goes crazy if this isn't false

      ["whitelist", "blacklist"].forEach(function (name) {
        var attrVal = input.getAttribute('data-' + name);

        if (attrVal) {
          attrVal = attrVal.split(_s.delimiters);
          if (attrVal instanceof Array) _s[name] = attrVal;
        }
      }); // backward-compatibility for old version of "autoComplete" setting:

      if ("autoComplete" in settings && !isObject(settings.autoComplete)) {
        _s.autoComplete = DEFAULTS.autoComplete;
        _s.autoComplete.enabled = settings.autoComplete;
      }

      if (_s.mode == 'mix') {
        _s.autoComplete.rightKey = true;
        _s.delimiters = settings.delimiters || null; // default dlimiters in mix-mode must be NULL
        // needed for "filterListItems". This assumes the user might have forgotten to manually
        // define the same term in "dropdown.searchKeys" as defined in "tagTextProp" setting, so
        // by automatically adding it, tagify is "helping" out, guessing the intesntions of the developer.

        if (_s.tagTextProp && !_s.dropdown.searchKeys.includes(_s.tagTextProp)) _s.dropdown.searchKeys.push(_s.tagTextProp);
      }

      if (input.pattern) try {
        _s.pattern = new RegExp(input.pattern);
      } catch (e) {} // Convert the "delimiters" setting into a REGEX object

      if (this.settings.delimiters) {
        try {
          _s.delimiters = new RegExp(this.settings.delimiters, "g");
        } catch (e) {}
      } // make sure the dropdown will be shown on "focus" and not only after typing something (in "select" mode)


      if (_s.mode == 'select') _s.dropdown.enabled = 0;
      _s.dropdown.appendTarget = settings.dropdown && settings.dropdown.appendTarget ? settings.dropdown.appendTarget : document.body;
    },

    /**
     * Returns a string of HTML element attributes
     * @param {Object} data [Tag data]
     */
    getAttributes: function getAttributes(data) {
      // only items which are objects have properties which can be used as attributes
      if (Object.prototype.toString.call(data) != "[object Object]") return '';
      var keys = Object.keys(data),
          s = "",
          propName,
          i;

      for (i = keys.length; i--;) {
        propName = keys[i];
        if (propName != 'class' && data.hasOwnProperty(propName) && data[propName] !== undefined) s += " " + propName + (data[propName] !== undefined ? "=\"".concat(data[propName], "\"") : "");
      }

      return s;
    },
    setStateSelection: function setStateSelection() {
      var selection = window.getSelection(); // save last selection place to be able to inject anything from outside to that specific place

      var sel = {
        anchorOffset: selection.anchorOffset,
        anchorNode: selection.anchorNode,
        range: selection.getRangeAt && selection.rangeCount && selection.getRangeAt(0)
      };
      this.state.selection = sel;
      return sel;
    },

    /**
     * Get the caret position relative to the viewport
     * https://stackoverflow.com/q/58985076/104380
     *
     * @returns {object} left, top distance in pixels
     */
    getCaretGlobalPosition: function getCaretGlobalPosition() {
      var sel = document.getSelection();

      if (sel.rangeCount) {
        var r = sel.getRangeAt(0);
        var node = r.startContainer;
        var offset = r.startOffset;
        var rect, r2;

        if (offset > 0) {
          r2 = document.createRange();
          r2.setStart(node, offset - 1);
          r2.setEnd(node, offset);
          rect = r2.getBoundingClientRect();
          return {
            left: rect.right,
            top: rect.top,
            bottom: rect.bottom
          };
        }

        if (node.getBoundingClientRect) return node.getBoundingClientRect();
      }

      return {
        left: -9999,
        top: -9999
      };
    },

    /**
     * Get specific CSS variables which are relevant to this script and parse them as needed.
     * The result is saved on the instance in "this.CSSVars"
     */
    getCSSVars: function getCSSVars() {
      var compStyle = getComputedStyle(this.DOM.scope, null);

      var getProp = function getProp(name) {
        return compStyle.getPropertyValue('--' + name);
      };

      function seprateUnitFromValue(a) {
        if (!a) return {};
        a = a.trim().split(' ')[0];
        var unit = a.split(/\d+/g).filter(function (n) {
          return n;
        }).pop().trim(),
            value = +a.split(unit).filter(function (n) {
          return n;
        })[0].trim();
        return {
          value: value,
          unit: unit
        };
      }

      this.CSSVars = {
        tagHideTransition: function (_ref) {
          var value = _ref.value,
              unit = _ref.unit;
          return unit == 's' ? value * 1000 : value;
        }(seprateUnitFromValue(getProp('tag-hide-transition')))
      };
    },

    /**
     * builds the HTML of this component
     * @param  {Object} input [DOM element which would be "transformed" into "Tags"]
     */
    build: function build(input) {
      var DOM = this.DOM;

      if (this.settings.mixMode.integrated) {
        DOM.originalInput = null;
        DOM.scope = input;
        DOM.input = input;
      } else {
        DOM.originalInput = input;
        DOM.scope = this.parseTemplate('wrapper', [input, this.settings]);
        DOM.input = DOM.scope.querySelector(this.settings.classNames.inputSelector);
        input.parentNode.insertBefore(DOM.scope, input);
      }

      if (this.settings.dropdown.enabled >= 0) this.dropdown.init.call(this);
    },

    /**
     * revert any changes made by this component
     */
    destroy: function destroy() {
      this.DOM.scope.parentNode.removeChild(this.DOM.scope);
      this.dropdown.hide.call(this, true);
      clearTimeout(this.dropdownHide__bindEventsTimeout);
    },

    /**
     * if the original input had any values, add them as tags
     */
    loadOriginalValues: function loadOriginalValues(value) {
      var lastChild,
          _s = this.settings;
      value = value || (_s.mixMode.integrated ? this.DOM.input.textContent : this.DOM.originalInput.value);

      if (value) {
        this.removeAllTags({
          withoutChangeEvent: true
        });

        if (_s.mode == 'mix') {
          this.parseMixTags(value.trim());
          lastChild = this.DOM.input.lastChild;
          if (!lastChild || lastChild.tagName != 'BR') this.DOM.input.insertAdjacentHTML('beforeend', '<br>');
        } else {
          try {
            if (JSON.parse(value) instanceof Array) value = JSON.parse(value);
          } catch (err) {}

          this.addTags(value).forEach(function (tag) {
            return tag && tag.classList.add(_s.classNames.tagNoAnimation);
          });
        }
      } else this.postUpdate();

      this.state.lastOriginalValueReported = _s.mixMode.integrated ? '' : this.DOM.originalInput.value;
      this.state.loadedOriginalValues = true;
    },
    cloneEvent: function cloneEvent(e) {
      var clonedEvent = {};

      for (var v in e) {
        clonedEvent[v] = e[v];
      }

      return clonedEvent;
    },

    /**
     * Toogle global loading state on/off
     * Useful when fetching async whitelist while user is typing
     * @param {Boolean} isLoading
     */
    loading: function loading(isLoading) {
      this.state.isLoading = isLoading; // IE11 doesn't support toggle with second parameter

      this.DOM.scope.classList[isLoading ? "add" : "remove"](this.settings.classNames.scopeLoading);
      return this;
    },

    /**
     * Toogle specieif tag loading state on/off
     * @param {Boolean} isLoading
     */
    tagLoading: function tagLoading(tagElm, isLoading) {
      if (tagElm) // IE11 doesn't support toggle with second parameter
        tagElm.classList[isLoading ? "add" : "remove"](this.settings.classNames.tagLoading);
      return this;
    },

    /**
     * Toggles class on the main tagify container ("scope")
     * @param {String} className
     * @param {Boolean} force
     */
    toggleClass: function toggleClass(className, force) {
      if (typeof className == 'string') this.DOM.scope.classList.toggle(className, force);
    },
    toggleFocusClass: function toggleFocusClass(force) {
      this.toggleClass(this.settings.classNames.focus, !!force);
    },
    triggerChangeEvent: triggerChangeEvent,
    events: events,
    fixFirefoxLastTagNoCaret: function fixFirefoxLastTagNoCaret() {
      return; // seems to be fixed in newer version of FF, so retiring below code (for now)
    },
    placeCaretAfterNode: function placeCaretAfterNode(node) {
      if (!node || !node.parentNode) return;
      var nextSibling = node.nextSibling,
          sel = window.getSelection(),
          range = sel.getRangeAt(0);

      if (sel.rangeCount) {
        range.setStartBefore(nextSibling || node);
        range.setEndBefore(nextSibling || node);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },
    insertAfterTag: function insertAfterTag(tagElm, newNode) {
      newNode = newNode || this.settings.mixMode.insertAfterTag;
      if (!tagElm || !tagElm.parentNode || !newNode) return;
      newNode = typeof newNode == 'string' ? document.createTextNode(newNode) : newNode;
      tagElm.parentNode.insertBefore(newNode, tagElm.nextSibling);
      return newNode;
    },

    /**
     * Enters a tag into "edit" mode
     * @param {Node} tagElm the tag element to edit. if nothing specified, use last last
     */
    editTag: function editTag(tagElm, opts) {
      var _this = this;

      tagElm = tagElm || this.getLastTag();
      opts = opts || {};
      this.dropdown.hide.call(this);
      var _s = this.settings;

      function getEditableElm() {
        return tagElm.querySelector(_s.classNames.tagTextSelector);
      }

      var editableElm = getEditableElm(),
          tagIdx = this.getNodeIndex(tagElm),
          tagData = this.tagData(tagElm),
          _CB = this.events.callbacks,
          that = this,
          isValid = true,
          delayed_onEditTagBlur = function delayed_onEditTagBlur() {
        setTimeout(function () {
          return _CB.onEditTagBlur.call(that, getEditableElm());
        });
      };

      if (!editableElm) {
        console.warn('Cannot find element in Tag template: .', _s.classNames.tagTextSelector);
        return;
      }

      if (tagData instanceof Object && "editable" in tagData && !tagData.editable) return;
      editableElm.setAttribute('contenteditable', true);
      tagElm.classList.add(_s.classNames.tagEditing); // cache the original data, on the DOM node, before any modification ocurs, for possible revert

      this.tagData(tagElm, {
        __originalData: extend({}, tagData),
        __originalHTML: tagElm.innerHTML
      });
      editableElm.addEventListener('focus', _CB.onEditTagFocus.bind(this, tagElm));
      editableElm.addEventListener('blur', delayed_onEditTagBlur);
      editableElm.addEventListener('input', _CB.onEditTagInput.bind(this, editableElm));
      editableElm.addEventListener('keydown', function (e) {
        return _CB.onEditTagkeydown.call(_this, e, tagElm);
      });
      editableElm.focus();
      this.setRangeAtStartEnd(false, editableElm);
      if (!opts.skipValidation) isValid = this.editTagToggleValidity(tagElm, tagData.value);
      editableElm.originalIsValid = isValid;
      this.trigger("edit:start", {
        tag: tagElm,
        index: tagIdx,
        data: tagData,
        isValid: isValid
      });
      return this;
    },
    editTagToggleValidity: function editTagToggleValidity(tagElm, value) {
      var tagData = this.tagData(tagElm),
          toggleState;

      if (!tagData) {
        console.warn("tag has no data: ", tagElm, tagData);
        return;
      }

      toggleState = !!(tagData.__isValid && tagData.__isValid != true); //this.validateTag(tagData);

      tagElm.classList.toggle(this.settings.classNames.tagInvalid, toggleState);
      return tagData.__isValid;
    },
    onEditTagDone: function onEditTagDone(tagElm, tagData) {
      tagElm = tagElm || this.state.editing.scope;
      tagData = tagData || {};
      var eventData = {
        tag: tagElm,
        index: this.getNodeIndex(tagElm),
        previousData: this.tagData(tagElm),
        data: tagData
      };
      this.trigger("edit:beforeUpdate", eventData, {
        cloneData: false
      });
      this.state.editing = false;
      delete tagData.__originalData;
      delete tagData.__originalHTML;

      if (tagElm && tagData[this.settings.tagTextProp]) {
        this.editTagToggleValidity(tagElm);
        this.replaceTag(tagElm, tagData);
      } else if (tagElm) this.removeTags(tagElm);

      this.trigger("edit:updated", eventData);
      this.dropdown.hide.call(this); // check if any of the current tags which might have been marked as "duplicate" should be now un-marked

      if (this.settings.keepInvalidTags) this.reCheckInvalidTags();
    },

    /**
     * Replaces an exisitng tag with a new one. Used for updating a tag's data
     * @param {Object} tagElm  [DOM node to replace]
     * @param {Object} tagData [data to create new tag from]
     */
    replaceTag: function replaceTag(tagElm, tagData) {
      if (!tagData || !tagData.value) tagData = tagElm.__tagifyTagData; // if tag is invalid, make the according changes in the newly created element

      if (tagData.__isValid && tagData.__isValid != true) extend(tagData, this.getInvalidTagAttrs(tagData, tagData.__isValid));
      var newTag = this.createTagElem(tagData); // update DOM

      tagElm.parentNode.replaceChild(newTag, tagElm);
      this.updateValueByDOMTags();
    },

    /**
     * update "value" (Array of Objects) by traversing all valid tags
     */
    updateValueByDOMTags: function updateValueByDOMTags() {
      var _this2 = this;

      this.value.length = 0;
      [].forEach.call(this.getTagElms(), function (node) {
        if (node.classList.contains(_this2.settings.classNames.tagNotAllowed.split(' ')[0])) return;

        _this2.value.push(_this2.tagData(node));
      });
      this.update();
    },

    /** https://stackoverflow.com/a/59156872/104380
     * @param {Boolean} start indicating where to place it (start or end of the node)
     * @param {Object}  node  DOM node to place the caret at
     */
    setRangeAtStartEnd: function setRangeAtStartEnd(start, node) {
      start = typeof start == 'number' ? start : !!start;
      node = node || this.DOM.input;
      node = node.lastChild || node;
      var sel = document.getSelection();

      try {
        if (sel.rangeCount >= 1) {
          ['Start', 'End'].forEach(function (pos) {
            return sel.getRangeAt(0)["set" + pos](node, start ? start : node.length);
          });
        }
      } catch (err) {
        console.warn("Tagify: ", err);
      }
    },

    /**
     * injects nodes/text at caret position, which is saved on the "state" when "blur" event gets triggered
     * @param {Node} injectedNode [the node to inject at the caret position]
     * @param {Object} selection [optional range Object. must have "anchorNode" & "anchorOffset"]
     */
    injectAtCaret: function injectAtCaret(injectedNode, range) {
      range = range || this.state.selection.range;
      if (!range) return;
      if (typeof injectedNode == 'string') injectedNode = document.createTextNode(injectedNode);
      range.deleteContents();
      range.insertNode(injectedNode);
      this.setRangeAtStartEnd(false, injectedNode);
      this.updateValueByDOMTags(); // updates internal "this.value"

      this.update(); // updates original input/textarea

      return this;
    },

    /**
     * input bridge for accessing & setting
     * @type {Object}
     */
    input: {
      set: function set() {
        var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var updateDOM = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var hideDropdown = this.settings.dropdown.closeOnSelect;
        this.state.inputText = s;
        if (updateDOM) this.DOM.input.innerHTML = escapeHTML("" + s);
        if (!s && hideDropdown) this.dropdown.hide.bind(this);
        this.input.autocomplete.suggest.call(this);
        this.input.validate.call(this);
      },

      /**
       * Marks the tagify's input as "invalid" if the value did not pass "validateTag()"
       */
      validate: function validate() {
        var isValid = !this.state.inputText || this.validateTag({
          value: this.state.inputText
        }) === true;
        this.DOM.input.classList.toggle(this.settings.classNames.inputInvalid, !isValid);
        return isValid;
      },
      // remove any child DOM elements that aren't of type TEXT (like <br>)
      normalize: function normalize(node) {
        var clone = node || this.DOM.input,
            //.cloneNode(true),
        v = []; // when a text was pasted in FF, the "this.DOM.input" element will have <br> but no newline symbols (\n), and this will
        // result in tags not being properly created if one wishes to create a separate tag per newline.

        clone.childNodes.forEach(function (n) {
          return n.nodeType == 3 && v.push(n.nodeValue);
        });
        v = v.join("\n");

        try {
          // "delimiters" might be of a non-regex value, where this will fail ("Tags With Properties" example in demo page):
          v = v.replace(/(?:\r\n|\r|\n)/g, this.settings.delimiters.source.charAt(0));
        } catch (err) {}

        v = v.replace(/\s/g, ' '); // replace NBSPs with spaces characters

        if (this.settings.trim) v = v.replace(/^\s+/, ''); // trimLeft

        return v;
      },

      /**
       * suggest the rest of the input's value (via CSS "::after" using "content:attr(...)")
       * @param  {String} s [description]
       */
      autocomplete: {
        suggest: function suggest(data) {
          if (!this.settings.autoComplete.enabled) return;
          data = data || {};
          if (typeof data == 'string') data = {
            value: data
          };
          var suggestedText = data.value ? '' + data.value : '',
              suggestionStart = suggestedText.substr(0, this.state.inputText.length).toLowerCase(),
              suggestionTrimmed = suggestedText.substring(this.state.inputText.length);

          if (!suggestedText || !this.state.inputText || suggestionStart != this.state.inputText.toLowerCase()) {
            this.DOM.input.removeAttribute("data-suggest");
            delete this.state.inputSuggestion;
          } else {
            this.DOM.input.setAttribute("data-suggest", suggestionTrimmed);
            this.state.inputSuggestion = data;
          }
        },

        /**
         * sets the suggested text as the input's value & cleanup the suggestion autocomplete.
         * @param {String} s [text]
         */
        set: function set(s) {
          var dataSuggest = this.DOM.input.getAttribute('data-suggest'),
              suggestion = s || (dataSuggest ? this.state.inputText + dataSuggest : null);

          if (suggestion) {
            if (this.settings.mode == 'mix') {
              this.replaceTextWithNode(document.createTextNode(this.state.tag.prefix + suggestion));
            } else {
              this.input.set.call(this, suggestion);
              this.setRangeAtStartEnd();
            }

            this.input.autocomplete.suggest.call(this);
            this.dropdown.hide.call(this);
            return true;
          }

          return false;
        }
      }
    },

    /**
     * returns the index of the the tagData within the "this.value" array collection.
     * since values should be unique, it is suffice to only search by "value" property
     * @param {Object} tagData
     */
    getTagIdx: function getTagIdx(tagData) {
      return this.value.findIndex(function (item) {
        return item.value == tagData.value;
      });
    },
    getNodeIndex: function getNodeIndex(node) {
      var index = 0;
      if (node) while (node = node.previousElementSibling) {
        index++;
      }
      return index;
    },
    getTagElms: function getTagElms() {
      for (var _len = arguments.length, classess = new Array(_len), _key = 0; _key < _len; _key++) {
        classess[_key] = arguments[_key];
      }

      var classname = '.' + [].concat(_toConsumableArray(this.settings.classNames.tag.split(' ')), classess).join('.');
      return [].slice.call(this.DOM.scope.querySelectorAll(classname)); // convert nodeList to Array - https://stackoverflow.com/a/3199627/104380
    },

    /**
     * gets the last non-readonly, not-in-the-proccess-of-removal tag
     */
    getLastTag: function getLastTag() {
      var lastTag = this.DOM.scope.querySelectorAll("".concat(this.settings.classNames.tagSelector, ":not(.").concat(this.settings.classNames.tagHide, "):not([readonly])"));
      return lastTag[lastTag.length - 1];
    },

    /** Setter/Getter
     * Each tag DOM node contains a custom property called "__tagifyTagData" which hosts its data
     * @param {Node}   tagElm
     * @param {Object} data
     */
    tagData: function tagData(tagElm, data, override) {
      if (!tagElm) {
        console.warn("tag elment doesn't exist", tagElm, data);
        return data;
      }

      if (data) tagElm.__tagifyTagData = override ? data : extend({}, tagElm.__tagifyTagData || {}, data);
      return tagElm.__tagifyTagData;
    },

    /**
     * Searches if any tag with a certain value already exis
     * @param  {String/Object} v [text value / tag data object]
     * @return {Boolean}
     */
    isTagDuplicate: function isTagDuplicate(value, caseSensitive) {
      var _this3 = this;

      var duplications,
          _s = this.settings; // duplications are irrelevant for this scenario

      if (_s.mode == 'select') return false;
      duplications = this.value.reduce(function (acc, item) {
        return sameStr(_this3.trim("" + value), item.value, caseSensitive || _s.dropdown.caseSensitive) ? acc + 1 : acc;
      }, 0);
      return duplications;
    },
    getTagIndexByValue: function getTagIndexByValue(value) {
      var _this4 = this;

      var indices = [];
      this.getTagElms().forEach(function (tagElm, i) {
        if (sameStr(_this4.trim(tagElm.textContent), value, _this4.settings.dropdown.caseSensitive)) indices.push(i);
      });
      return indices;
    },
    getTagElmByValue: function getTagElmByValue(value) {
      var tagIdx = this.getTagIndexByValue(value)[0];
      return this.getTagElms()[tagIdx];
    },

    /**
     * Temporarily marks a tag element (by value or Node argument)
     * @param  {Object} tagElm [a specific "tag" element to compare to the other tag elements siblings]
     */
    flashTag: function flashTag(tagElm) {
      var _this5 = this;

      if (tagElm) {
        tagElm.classList.add(this.settings.classNames.tagFlash);
        setTimeout(function () {
          tagElm.classList.remove(_this5.settings.classNames.tagFlash);
        }, 100);
      }
    },

    /**
     * checks if text is in the blacklist
     */
    isTagBlacklisted: function isTagBlacklisted(v) {
      v = this.trim(v.toLowerCase());
      return this.settings.blacklist.filter(function (x) {
        return ("" + x).toLowerCase() == v;
      }).length;
    },

    /**
     * checks if text is in the whitelist
     */
    isTagWhitelisted: function isTagWhitelisted(v) {
      return !!this.getWhitelistItem(v);
      /*
      return this.settings.whitelist.some(item =>
          typeof v == 'string'
              ? sameStr(this.trim(v), (item.value || item))
              : sameStr(JSON.stringify(item), JSON.stringify(v))
      )
      */
    },

    /**
     * Returns the first whitelist item matched, by value (if match found)
     * @param {String} value [text to match by]
     */
    getWhitelistItem: function getWhitelistItem(value, prop, whitelist) {
      var result,
          prop = prop || 'value',
          _s = this.settings,
          whitelist = whitelist || _s.whitelist;
      whitelist.some(function (_wi) {
        var _wiv = typeof _wi == 'string' ? _wi : _wi[prop] || _wi.value,
            isSameStr = sameStr(_wiv, value, _s.dropdown.caseSensitive, _s.trim);

        if (isSameStr) {
          result = typeof _wi == 'string' ? {
            value: _wi
          } : _wi;
          return true;
        }
      }); // first iterate the whitelist, try find maches by "value" and if that fails
      // and a "tagTextProp" is set to be other than "value", try that also

      if (!result && prop == 'value' && _s.tagTextProp != 'value') {
        // if found, adds the first which matches
        result = this.getWhitelistItem(value, _s.tagTextProp, whitelist);
      }

      return result;
    },

    /**
     * validate a tag object BEFORE the actual tag will be created & appeneded
     * @param  {String} s
     * @param  {String} uid      [unique ID, to not inclue own tag when cheking for duplicates]
     * @return {Boolean/String}  ["true" if validation has passed, String for a fail]
     */
    validateTag: function validateTag(tagData) {
      var _s = this.settings,
          // when validating a tag in edit-mode, need to take "tagTextProp" into consideration
      prop = "value" in tagData ? "value" : _s.tagTextProp,
          v = this.trim(tagData[prop] + ""); // check for definitive empty value

      if (!(tagData[prop] + "").trim()) return this.TEXTS.empty; // check if pattern should be used and if so, use it to test the value

      if (_s.pattern && _s.pattern instanceof RegExp && !_s.pattern.test(v)) return this.TEXTS.pattern; // if duplicates are not allowed and there is a duplicate

      if (!_s.duplicates && this.isTagDuplicate(v, this.state.editing)) return this.TEXTS.duplicate;
      if (this.isTagBlacklisted(v) || _s.enforceWhitelist && !this.isTagWhitelisted(v)) return this.TEXTS.notAllowed;
      if (_s.validate) return _s.validate(tagData);
      return true;
    },
    getInvalidTagAttrs: function getInvalidTagAttrs(tagData, validation) {
      return {
        "aria-invalid": true,
        "class": "".concat(tagData.class || '', " ").concat(this.settings.classNames.tagNotAllowed).trim(),
        "title": validation
      };
    },
    hasMaxTags: function hasMaxTags() {
      if (this.value.length >= this.settings.maxTags) return this.TEXTS.exceed;
      return false;
    },
    setReadonly: function setReadonly(isReadonly) {
      var _s = this.settings;
      document.activeElement.blur(); // exists possible edit-mode

      _s.readonly = isReadonly;
      this.DOM.scope[(isReadonly ? 'set' : 'remove') + 'Attribute']('readonly', true);

      if (_s.mode == 'mix') {
        this.DOM.input.contentEditable = !isReadonly;
      }
    },

    /**
     * pre-proccess the tagsItems, which can be a complex tagsItems like an Array of Objects or a string comprised of multiple words
     * so each item should be iterated on and a tag created for.
     * @return {Array} [Array of Objects]
     */
    normalizeTags: function normalizeTags(tagsItems) {
      var _this6 = this;

      var _this$settings = this.settings,
          whitelist = _this$settings.whitelist,
          delimiters = _this$settings.delimiters,
          mode = _this$settings.mode,
          tagTextProp = _this$settings.tagTextProp,
          enforceWhitelist = _this$settings.enforceWhitelist,
          whitelistMatches = [],
          whitelistWithProps = whitelist ? whitelist[0] instanceof Object : false,
          isArray = tagsItems instanceof Array,
          mapStringToCollection = function mapStringToCollection(s) {
        return (s + "").split(delimiters).filter(function (n) {
          return n;
        }).map(function (v) {
          var _ref2;

          return _ref2 = {}, _defineProperty(_ref2, tagTextProp, _this6.trim(v)), _defineProperty(_ref2, "value", _this6.trim(v)), _ref2;
        });
      };

      if (typeof tagsItems == 'number') tagsItems = tagsItems.toString(); // if the argument is a "simple" String, ex: "aaa, bbb, ccc"

      if (typeof tagsItems == 'string') {
        if (!tagsItems.trim()) return []; // go over each tag and add it (if there were multiple ones)

        tagsItems = mapStringToCollection(tagsItems);
      } // is is an Array of Strings, convert to an Array of Objects
      else if (isArray) {
          var _ref3;

          // flatten the 2D array
          tagsItems = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(tagsItems.map(function (item) {
            return item.value ? item // mapStringToCollection(item.value).map(newItem => ({...item,...newItem}))
            : mapStringToCollection(item);
          })));
        } // search if the tag exists in the whitelist as an Object (has props),
      // to be able to use its properties


      if (whitelistWithProps) {
        tagsItems.forEach(function (item) {
          var whitelistMatchesValues = whitelistMatches.map(function (a) {
            return a.value;
          }); // if suggestions are shown, they are already filtered, so it's easier to use them,
          // because the whitelist might also include items which have already been added

          var filteredList = _this6.dropdown.filterListItems.call(_this6, item[tagTextProp], {
            exact: true
          }) // also filter out items which have already been matches in previous iterations
          .filter(function (filteredItem) {
            return !whitelistMatchesValues.includes(filteredItem.value);
          }); // get the best match out of list of possible matches.
          // if there was a single item in the filtered list, use that one


          var matchObj = filteredList.length > 1 ? _this6.getWhitelistItem(item[tagTextProp], tagTextProp, filteredList) : filteredList[0];

          if (matchObj && matchObj instanceof Object) {
            whitelistMatches.push(matchObj); // set the Array (with the found Object) as the new value
          } else if (mode != 'mix' && !enforceWhitelist) {
            if (item.value == undefined) item.value = item[tagTextProp];
            whitelistMatches.push(item);
          }
        }); // if( whitelistMatches.length )

        tagsItems = whitelistMatches;
      }

      return tagsItems;
    },

    /**
     * Parse the initial value of a textarea (or input) element and generate mixed text w/ tags
     * https://stackoverflow.com/a/57598892/104380
     * @param {String} s
     */
    parseMixTags: function parseMixTags(s) {
      var _this7 = this;

      var _this$settings2 = this.settings,
          mixTagsInterpolator = _this$settings2.mixTagsInterpolator,
          duplicates = _this$settings2.duplicates,
          transformTag = _this$settings2.transformTag,
          enforceWhitelist = _this$settings2.enforceWhitelist,
          maxTags = _this$settings2.maxTags,
          tagTextProp = _this$settings2.tagTextProp,
          tagsDataSet = [];
      s = s.split(mixTagsInterpolator[0]).map(function (s1, i) {
        var s2 = s1.split(mixTagsInterpolator[1]),
            preInterpolated = s2[0],
            maxTagsReached = tagsDataSet.length == maxTags,
            textProp,
            tagData,
            tagElm;

        try {
          // skip numbers and go straight to the "catch" statement
          if (preInterpolated == +preInterpolated) throw Error;
          tagData = JSON.parse(preInterpolated);
        } catch (err) {
          tagData = _this7.normalizeTags(preInterpolated)[0] || {
            value: preInterpolated
          };
        }

        if (!maxTagsReached && s2.length > 1 && (!enforceWhitelist || _this7.isTagWhitelisted(tagData.value)) && !(!duplicates && _this7.isTagDuplicate(tagData.value))) {
          transformTag.call(_this7, tagData); // in case "tagTextProp" setting is set to other than "value" and this tag does not have this prop

          textProp = tagData[tagTextProp] ? tagTextProp : 'value';
          tagData[textProp] = _this7.trim(tagData[textProp]);
          tagElm = _this7.createTagElem(tagData);
          tagsDataSet.push(tagData);
          tagElm.classList.add(_this7.settings.classNames.tagNoAnimation);
          s2[0] = tagElm.outerHTML; //+ "&#8288;"  // put a zero-space at the end so the caret won't jump back to the start (when the last input's child element is a tag)

          _this7.value.push(tagData);
        } else if (s1) return i ? mixTagsInterpolator[0] + s1 : s1;

        return s2.join('');
      }).join('');
      this.DOM.input.innerHTML = s;
      this.DOM.input.appendChild(document.createTextNode(''));
      this.DOM.input.normalize();
      this.getTagElms().forEach(function (elm, idx) {
        return _this7.tagData(elm, tagsDataSet[idx]);
      });
      this.update({
        withoutChangeEvent: true
      });
      return s;
    },

    /**
     * For mixed-mode: replaces a text starting with a prefix with a wrapper element (tag or something)
     * First there *has* to be a "this.state.tag" which is a string that was just typed and is staring with a prefix
     */
    replaceTextWithNode: function replaceTextWithNode(newWrapperNode, strToReplace) {
      if (!this.state.tag && !strToReplace) return;
      strToReplace = strToReplace || this.state.tag.prefix + this.state.tag.value;
      var idx,
          nodeToReplace,
          selection = window.getSelection(),
          nodeAtCaret = selection.anchorNode,
          firstSplitOffset = this.state.tag.delimiters ? this.state.tag.delimiters.length : 0; // STEP 1: ex. replace #ba with the tag "bart" where "|" is where the caret is:
      // CURRENT STATE: "foo #ba #ba| #ba"
      // split the text node at the index of the caret

      nodeAtCaret.splitText(selection.anchorOffset - firstSplitOffset); // node 0: "foo #ba #ba|"
      // node 1: " #ba"
      // get index of LAST occurence of "#ba"

      idx = nodeAtCaret.nodeValue.lastIndexOf(strToReplace);
      nodeToReplace = nodeAtCaret.splitText(idx); // node 0: "foo #ba "
      // node 1: "#ba"    <- nodeToReplace

      newWrapperNode && nodeAtCaret.parentNode.replaceChild(newWrapperNode, nodeToReplace); // must NOT normalize contenteditable or it will cause unwanetd issues:
      // https://monosnap.com/file/ZDVmRvq5upYkidiFedvrwzSswegWk7
      // nodeAtCaret.parentNode.normalize()

      return true;
    },

    /**
     * For selecting a single option (not used for multiple tags, but for "mode:select" only)
     * @param {Object} tagElm   Tag DOM node
     * @param {Object} tagData  Tag data
     */
    selectTag: function selectTag(tagElm, tagData) {
      if (this.settings.enforceWhitelist && !this.isTagWhitelisted(tagData.value)) return;
      this.input.set.call(this, tagData.value, true); // place the caret at the end of the input, only if a dropdown option was selected (and not by manually typing another value and clicking "TAB")

      if (this.state.actions.selectOption) setTimeout(this.setRangeAtStartEnd.bind(this));
      if (this.getLastTag()) this.replaceTag(this.getLastTag(), tagData);else this.appendTag(tagElm);
      this.value[0] = tagData;
      this.trigger('add', {
        tag: tagElm,
        data: tagData
      });
      this.update();
      return [tagElm];
    },

    /**
     * add an empty "tag" element in an editable state
     */
    addEmptyTag: function addEmptyTag(initialData) {
      var tagData = extend({
        value: ""
      }, initialData || {}),
          tagElm = this.createTagElem(tagData);
      this.tagData(tagElm, tagData); // add the tag to the component's DOM

      this.appendTag(tagElm);
      this.editTag(tagElm, {
        skipValidation: true
      });
    },

    /**
     * add a "tag" element to the "tags" component
     * @param {String/Array} tagsItems   [A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings]
     * @param {Boolean}      clearInput  [flag if the input's value should be cleared after adding tags]
     * @param {Boolean}      skipInvalid [do not add, mark & remove invalid tags]
     * @return {Array} Array of DOM elements (tags)
     */
    addTags: function addTags(tagsItems, clearInput) {
      var _this8 = this;

      var skipInvalid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.settings.skipInvalid;
      var tagElems = [],
          _s = this.settings;

      if (!tagsItems || tagsItems.length == 0) {
        // is mode is "select" clean all tagsargument of
        if (_s.mode == 'select') this.removeAllTags();
        return tagElems;
      } // converts Array/String/Object to an Array of Objects


      tagsItems = this.normalizeTags(tagsItems);

      if (_s.mode == 'mix') {
        return this.addMixTags(tagsItems);
      }

      if (_s.mode == 'select') clearInput = false;
      this.DOM.input.removeAttribute('style');
      tagsItems.forEach(function (tagData) {
        var tagElm,
            tagElmParams = {},
            originalData = Object.assign({}, tagData, {
          value: tagData.value + ""
        }); // shallow-clone tagData so later modifications will not apply to the source

        tagData = Object.assign({}, originalData);
        tagData.__isValid = _this8.hasMaxTags() || _this8.validateTag(tagData);

        _s.transformTag.call(_this8, tagData);

        if (tagData.__isValid !== true) {
          if (skipInvalid) return; // originalData is kept because it might be that this tag is invalid because it is a duplicate of another,
          // and if that other tags is edited/deleted, this one should be re-validated and if is no more a duplicate - restored

          extend(tagElmParams, _this8.getInvalidTagAttrs(tagData, tagData.__isValid), {
            __preInvalidData: originalData
          });
          if (tagData.__isValid == _this8.TEXTS.duplicate) // mark, for a brief moment, the tag (this this one) which THIS CURRENT tag is a duplcate of
            _this8.flashTag(_this8.getTagElmByValue(tagData.value));
        } /////////////////////////////////////////////////////


        if (tagData.readonly) tagElmParams["aria-readonly"] = true; // Create tag HTML element

        tagElm = _this8.createTagElem(extend({}, tagData, tagElmParams));
        tagElems.push(tagElm); // mode-select overrides

        if (_s.mode == 'select') {
          return _this8.selectTag(tagElm, tagData);
        } // add the tag to the component's DOM


        _this8.appendTag(tagElm);

        if (tagData.__isValid && tagData.__isValid === true) {
          // update state
          _this8.value.push(tagData);

          _this8.update();

          _this8.trigger('add', {
            tag: tagElm,
            index: _this8.value.length - 1,
            data: tagData
          });
        } else {
          _this8.trigger("invalid", {
            data: tagData,
            index: _this8.value.length,
            tag: tagElm,
            message: tagData.__isValid
          });

          if (!_s.keepInvalidTags) // remove invalid tags (if "keepInvalidTags" is set to "false")
            setTimeout(function () {
              return _this8.removeTags(tagElm, true);
            }, 1000);
        }

        _this8.dropdown.position.call(_this8); // reposition the dropdown because the just-added tag might cause a new-line

      });

      if (tagsItems.length && clearInput) {
        this.input.set.call(this);
      }

      this.dropdown.refilter.call(this);
      return tagElems;
    },

    /**
     * Adds a mix-content tag
     * @param {String/Array} tagData    A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings
     */
    addMixTags: function addMixTags(tagsData) {
      var _this9 = this;

      if (tagsData[0].prefix || this.state.tag) {
        this.prefixedTextToTag(tagsData[0]);
        return;
      }

      if (typeof tagsData == 'string') tagsData = [{
        value: tagsData
      }];
      var selection = !!this.state.selection,
          // must be cast, not to use the reference which is changing
      frag = document.createDocumentFragment();
      tagsData.forEach(function (tagData) {
        var tagElm = _this9.createTagElem(tagData);

        frag.appendChild(tagElm);

        _this9.insertAfterTag(tagElm);
      }); // if "selection" exists, assumes intention of inecting the new tag at the last
      // saved location of the caret inside "this.DOM.input"

      if (selection) {
        this.injectAtCaret(frag);
      } // else, create a range and inject the new tag as the last child of "this.DOM.input"
      else {
          this.DOM.input.focus();
          selection = this.setStateSelection();
          selection.range.setStart(this.DOM.input, selection.range.endOffset);
          selection.range.setEnd(this.DOM.input, selection.range.endOffset);
          this.DOM.input.appendChild(frag);
          this.updateValueByDOMTags(); // updates internal "this.value"

          this.update(); // updates original input/textarea
        }
    },

    /**
     * Adds a tag which was activly typed by the user
     * @param {String/Array} tagsItem   [A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings]
     */
    prefixedTextToTag: function prefixedTextToTag(tagsItem) {
      var _this10 = this;

      var _s = this.settings,
          tagElm,
          createdFromDelimiters = this.state.tag.delimiters;

      _s.transformTag.call(this, tagsItem);

      tagsItem.prefix = tagsItem.prefix || this.state.tag ? this.state.tag.prefix : (_s.pattern.source || _s.pattern)[0]; // TODO: should check if the tag is valid

      tagElm = this.createTagElem(tagsItem); // tries to replace a taged textNode with a tagElm, and if not able,
      // insert the new tag to the END if "addTags" was called from outside

      if (!this.replaceTextWithNode(tagElm)) {
        this.DOM.input.appendChild(tagElm);
      }

      setTimeout(function () {
        return tagElm.classList.add(_this10.settings.classNames.tagNoAnimation);
      }, 300);
      this.value.push(tagsItem);
      this.update();

      if (!createdFromDelimiters) {
        var elm = this.insertAfterTag(tagElm) || tagElm;
        this.placeCaretAfterNode(elm);
      }

      this.state.tag = null;
      this.trigger('add', extend({}, {
        tag: tagElm
      }, {
        data: tagsItem
      }));
      return tagElm;
    },

    /**
     * appened (validated) tag to the component's DOM scope
     */
    appendTag: function appendTag(tagElm) {
      var insertBeforeNode = this.DOM.scope.lastElementChild;
      if (insertBeforeNode === this.DOM.input) this.DOM.scope.insertBefore(tagElm, insertBeforeNode);else this.DOM.scope.appendChild(tagElm);
    },

    /**
     * creates a DOM tag element and injects it into the component (this.DOM.scope)
     * @param  {Object}  tagData [text value & properties for the created tag]
     * @return {Object} [DOM element]
     */
    createTagElem: function createTagElem(tagData) {
      var tagElm,
          templateData = extend({}, tagData, {
        value: escapeHTML(tagData.value + "")
      }); // if( this.settings.readonly )
      //     tagData.readonly = true

      tagElm = this.parseTemplate('tag', [templateData]); // crucial for proper caret placement when deleting content. if textNodes are allowed as children of
      // a tag element, a browser bug casues the caret to misplaced inside the tag element (especcially affects "readonly" tags)

      removeTextChildNodes(tagElm); // while( tagElm.lastChild.nodeType == 3 )
      //     tagElm.lastChild.parentNode.removeChild(tagElm.lastChild)

      this.tagData(tagElm, tagData);
      return tagElm;
    },

    /**
     * find all invalid tags and re-check them
     */
    reCheckInvalidTags: function reCheckInvalidTags() {
      var _this11 = this;

      var _s = this.settings,
          selector = "".concat(_s.classNames.tagSelector).concat(_s.classNames.tagNotAllowedSelector),
          tagElms = this.DOM.scope.querySelectorAll(selector);
      [].forEach.call(tagElms, function (node) {
        var tagData = _this11.tagData(node),
            wasNodeDuplicate = node.getAttribute('title') == _this11.TEXTS.duplicate,
            isNodeValid = _this11.validateTag(tagData) === true; // if this tag node was marked as a dulpicate, unmark. (might have been marked as "notAllowed" for other reasons)


        if (wasNodeDuplicate && isNodeValid) {
          if (tagData.__preInvalidData) tagData = tagData.__preInvalidData;else // start fresh
            tagData = {
              value: tagData.value
            };

          _this11.replaceTag(node, tagData);
        }
      });
    },

    /**
     * Removes a tag
     * @param  {Array|Node|String}  tagElms         [DOM element(s) or a String value. if undefined or null, remove last added tag]
     * @param  {Boolean}            silent          [A flag, which when turned on, does not remove any value and does not update the original input value but simply removes the tag from tagify]
     * @param  {Number}             tranDuration    [Transition duration in MS]
     * TODO: Allow multiple tags to be removed at-once
     */
    removeTags: function removeTags(tagElms, silent, tranDuration) {
      var _this12 = this;

      var tagsToRemove;
      tagElms = tagElms && tagElms instanceof HTMLElement ? [tagElms] : tagElms instanceof Array ? tagElms : tagElms ? [tagElms] : [this.getLastTag()]; // normalize tagElms array values:
      // 1. removing invalid items
      // 2, if an item is String try to get the matching Tag HTML node
      // 3. get the tag data
      // 4. return a collection of Objects

      tagsToRemove = tagElms.reduce(function (elms, tagElm) {
        if (tagElm && typeof tagElm == 'string') tagElm = _this12.getTagElmByValue(tagElm);
        if (tagElm) // because the DOM node might be removed by async animation, the state will be updated while
          // the node might still be in the DOM, so the "update" method should know which nodes to ignore
          elms.push({
            node: tagElm,
            idx: _this12.getTagIdx(_this12.tagData(tagElm)),
            // this.getNodeIndex(tagElm); // this.getTagIndexByValue(tagElm.textContent)
            data: _this12.tagData(tagElm, {
              '__removed': true
            })
          });
        return elms;
      }, []);
      tranDuration = typeof tranDuration == "number" ? tranDuration : this.CSSVars.tagHideTransition;

      if (this.settings.mode == 'select') {
        tranDuration = 0;
        this.input.set.call(this);
      } // if only a single tag is to be removed


      if (tagsToRemove.length == 1) {
        if (tagsToRemove[0].node.classList.contains(this.settings.classNames.tagNotAllowed)) silent = true;
      }

      if (!tagsToRemove.length) return;
      this.settings.hooks.beforeRemoveTag(tagsToRemove, {
        tagify: this
      }).then(function () {
        function removeNode(tag) {
          if (!tag.node.parentNode) return;
          tag.node.parentNode.removeChild(tag.node);

          if (!silent) {
            // this.removeValueById(tagData.__uid)
            this.trigger('remove', {
              tag: tag.node,
              index: tag.idx,
              data: tag.data
            });
            this.dropdown.refilter.call(this);
            this.dropdown.position.call(this);
            this.DOM.input.normalize(); // best-practice when in mix-mode (safe to do always anyways)
            // check if any of the current tags which might have been marked as "duplicate" should be now un-marked

            if (this.settings.keepInvalidTags) this.reCheckInvalidTags();
          } else if (this.settings.keepInvalidTags) this.trigger('remove', {
            tag: tag.node,
            index: tag.idx
          });
        }

        function animation(tag) {
          tag.node.style.width = parseFloat(window.getComputedStyle(tag.node).width) + 'px';
          document.body.clientTop; // force repaint for the width to take affect before the "hide" class below

          tag.node.classList.add(this.settings.classNames.tagHide); // manual timeout (hack, since transitionend cannot be used because of hover)

          setTimeout(removeNode.bind(this), tranDuration, tag);
        }

        if (tranDuration && tranDuration > 10 && tagsToRemove.length == 1) animation.call(_this12, tagsToRemove[0]);else tagsToRemove.forEach(removeNode.bind(_this12)); // update state regardless of animation

        if (!silent) {
          tagsToRemove.forEach(function (tag) {
            // remove "__removed" so the comparison in "getTagIdx" could work
            var tagData = Object.assign({}, tag.data); // shallow clone

            delete tagData.__removed;

            var tagIdx = _this12.getTagIdx(tagData);

            if (tagIdx > -1) _this12.value.splice(tagIdx, 1);
          }); // that.removeValueById(tagData.__uid)

          _this12.update(); // update the original input with the current value

        }
      }).catch(function (reason) {});
    },
    removeAllTags: function removeAllTags(opts) {
      var withoutChangeEvent = opts || {};
      this.value = [];
      if (this.settings.mode == 'mix') this.DOM.input.innerHTML = '';else Array.prototype.slice.call(this.getTagElms()).forEach(function (elm) {
        return elm.parentNode.removeChild(elm);
      });
      this.dropdown.position.call(this);
      if (this.settings.mode == 'select') this.input.set.call(this);
      this.update({
        withoutChangeEvent: withoutChangeEvent
      });
    },
    postUpdate: function postUpdate() {
      var classNames = this.settings.classNames,
          hasValue = this.settings.mode == 'mix' ? this.settings.mixMode.integrated ? this.DOM.input.textContent : this.DOM.originalInput.value : this.value.length;
      this.toggleClass(classNames.hasMaxTags, this.value.length >= this.settings.maxTags);
      this.toggleClass(classNames.hasNoTags, !this.value.length);
      this.toggleClass(classNames.empty, !hasValue);
    },

    /**
     * update the origianl (hidden) input field's value
     * see - https://stackoverflow.com/q/50957841/104380
     */
    update: function update(args) {
      var inputElm = this.DOM.originalInput,
          _ref4 = args || {},
          withoutChangeEvent = _ref4.withoutChangeEvent,
          value = removeCollectionProp(this.value, ['__isValid', '__removed']);

      if (!this.settings.mixMode.integrated) {
        inputElm.value = this.settings.mode == 'mix' ? this.getMixedTagsAsString(value) : value.length ? this.settings.originalInputValueFormat ? this.settings.originalInputValueFormat(value) : JSON.stringify(value) : "";
      }

      this.postUpdate();
      if (!withoutChangeEvent && this.state.loadedOriginalValues) this.triggerChangeEvent();
    },
    getMixedTagsAsString: function getMixedTagsAsString() {
      var result = "",
          that = this,
          _interpolator = this.settings.mixTagsInterpolator;

      function iterateChildren(rootNode) {
        rootNode.childNodes.forEach(function (node) {
          if (node.nodeType == 1) {
            if (node.classList.contains(that.settings.classNames.tag) && that.tagData(node)) {
              if (that.tagData(node).__removed) return;else result += _interpolator[0] + JSON.stringify(node.__tagifyTagData) + _interpolator[1];
              return;
            }

            if (node.tagName == 'BR' && (node.parentNode == that.DOM.input || node.parentNode.childNodes.length == 1)) {
              result += "\r\n";
            } else if (node.tagName == 'DIV' || node.tagName == 'P') {
              result += "\r\n";
              iterateChildren(node);
            }
          } else result += node.textContent;
        });
      }

      iterateChildren(this.DOM.input);
      return result;
    }
  }; // legacy support for changed methods names

  Tagify.prototype.removeTag = Tagify.prototype.removeTags;

  return Tagify;

})));
