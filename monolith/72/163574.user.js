// ==UserScript==
// @name           4chan xy
// @version        3
// @namespace      asdfafafafgsgdgff
// @description    Adds various features.
// @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright      2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://images.4chan.org/*
// @include        https://images.4chan.org/*
// @include        http://sys.4chan.org/*
// @include        https://sys.4chan.org/*
// @run-at         document-start
// @updateURL      https://github.com/ihavenoface/4chan-x/raw/stable/4chan_x.user.js
// @downloadURL    https://github.com/ihavenoface/4chan-x/raw/stable/4chan_x.user.js
// @icon           https://raw.github.com/ihavenoface/4chan-x/gh-pages/favicon.gif
// ==/UserScript==

/* 4chan X - Version 3.0.4 - 2013-04-11
 * https://4chan-x.just-believe.in/
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012-2013 Nicolas Stepien <stepien.nicolas@gmail.com>
 * Licensed under the MIT license.
 * https://github.com/MayhemYDG/4chan-x/blob/master/LICENSE
 *
 * Contributors:
 * https://github.com/MayhemYDG/4chan-x/graphs/contributors
 * Non-GitHub contributors:
 * ferongr, xat-, Ongpot, thisisanon and Anonymous - favicon contributions
 * e000 - cooldown sanity check
 * Seiba - chrome quick reply focusing
 * herpaderpderp - recaptcha fixes
 * WakiMiko - recaptcha tab order http://userscripts.org/scripts/show/82657
 *
 * All the people who've taken the time to write bug reports.
 *
 * Thank you.
 * REMOVED: NavBar Bottom CSS block, update count increasing
 */

(function() {
  var $, $$, Anonymize, ArchiveLink, AutoGIF, Board, Build, Clone, Conf, Config, CustomCSS, DataBoard, DataBoards, DeleteLink, DownloadLink, ExpandComment, ExpandThread, Favicon, FileInfo, Filter, Fourchan, Get, Header, ImageExpand, ImageHover, Keybinds, Main, Menu, Nav, Notification, Polyfill, Post, PostHiding, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, QuoteStrikeThrough, QuoteYou, Quotify, Recursive, Redirect, RelativeDates, Report, ReportLink, RevealSpoilers, Sauce, Settings, Thread, ThreadExcerpt, ThreadHiding, ThreadStats, ThreadUpdater, ThreadWatcher, Time, UI, Unread, c, d, doc, g,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Config = {
    main: {
      'Miscellaneous': {
        'Enable 4chan\'s Extension': [false, 'Compatibility between 4chan X and 4chan\'s inline extension is NOT guaranteed.'],
        'Custom Board Navigation': [true, 'Show custom links instead of the full board list'],
        '404 Redirect': [true, 'Redirect dead threads and images.'],
        'Keybinds': [true, 'Bind actions to keyboard shortcuts.'],
        'Time Formatting': [true, 'Localize and format timestamps.'],
        'Relative Post Dates': [false, 'Display dates like "3 minutes ago". Tooltip shows the timestamp.'],
        'File Info Formatting': [true, 'Reformat the file information.'],
        'Comment Expansion': [true, 'Add buttons to expand too long comments.'],
        'Thread Expansion': [true, 'Add buttons to expand threads.'],
        'Index Navigation': [false, 'Add buttons to navigate between threads.'],
        'Reply Navigation': [false, 'Add buttons to navigate to top / bottom of thread.'],
        'Check for Updates': [true, 'Notify when updated versions of 4chan X are available.']
      },
      'Filtering': {
        'Anonymize': [false, 'Make everyone Anonymous.'],
        'Filter': [true, 'Self-moderation placebo.'],
        'Recursive Hiding': [true, 'Hide replies of hidden posts, recursively.'],
        'Thread Hiding': [true, 'Add buttons to hide entire threads.'],
        'Reply Hiding': [true, 'Add buttons to hide single replies.'],
        'Stubs': [true, 'Show stubs of hidden threads / replies.']
      },
      'Images': {
        'Auto-GIF': [false, 'Animate GIF thumbnails (disabled on /gif/, /wsg/).'],
        'Image Expansion': [true, 'Expand images inline.'],
        'Image Hover': [false, 'Show a floating expanded image on hover.'],
        'Sauce': [true, 'Add sauce links to images.'],
        'Reveal Spoilers': [false, 'Reveal spoiler thumbnails.']
      },
      'Menu': {
        'Menu': [true, 'Add a drop-down menu to posts.'],
        'Report Link': [true, 'Add a report link to the menu.'],
        'Thread Hiding Link': [true, 'Add a link to hide entire threads.'],
        'Reply Hiding Link': [true, 'Add a link to hide single replies.'],
        'Delete Link': [true, 'Add post and image deletion links to the menu.'],
        'Download Link': [true, 'Add a download with original filename link to the menu. Chrome-only currently.'],
        'Archive Link': [true, 'Add an archive link to the menu.']
      },
      'Monitoring': {
        'Thread Updater': [true, 'Fetch and insert new replies. Has more options in its own dialog.'],
        'Unread Count': [true, 'Show the unread posts count in the tab title.'],
        'Unread Tab Icon': [true, 'Show a different favicon when there are unread posts.'],
        'Unread Line': [true, 'Show a line to distinguish read posts from unread ones.'],
        'Thread Excerpt': [true, 'Show an excerpt of the thread in the tab title.'],
        'Thread Stats': [true, 'Display reply and image count.'],
        'Thread Watcher': [true, 'Bookmark threads.'],
        'Auto Watch': [true, 'Automatically watch threads you start.'],
        'Auto Watch Reply': [false, 'Automatically watch threads you reply to.']
      },
      'Posting': {
        'Quick Reply': [true, 'All-in-one form to reply, create threads, automate dumping and more.'],
        'Persistent QR': [false, 'The Quick reply won\'t disappear after posting.'],
        'Auto-Hide QR': [false, 'Automatically hide the quick reply when posting.'],
        'Open Post in New Tab': [true, 'Open new threads or replies to a thread from the index in a new tab.'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Hide Original Post Form': [true, 'Hide the normal post form.'],
        'Cooldown': [true, 'Prevent "flood detected" errors.']
      },
      'Quote Links': {
        'Quote Backlinks': [true, 'Add quote backlinks.'],
        'OP Backlinks': [true, 'Add backlinks to the OP.'],
        'Quote Inlining': [true, 'Inline quoted post on click.'],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks.'],
        'Quote Previewing': [true, 'Show quoted post on hover.'],
        'Quote Highlighting': [true, 'Highlight the previewed post.'],
        'Resurrect Quotes': [true, 'Link dead quotes to the archives.'],
        'Mark Quotes of You': [true, 'Add \'(You)\' to quotes linking to your posts.'],
        'Mark OP Quotes': [true, 'Add \'(OP)\' to OP quotes.'],
        'Mark Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes.']
      }
    },
    imageExpansion: {
      'Fit width': [true, ''],
      'Fit height': [false, ''],
      'Expand spoilers': [false, 'Expand all images along with spoilers.'],
      'Expand from here': [true, 'Expand all images only from current position to thread end.']
    },
    filter: {
      name: ['# Filter any namefags:', '#/^(?!Anonymous$)/'].join('\n'),
      uniqueID: ['# Filter a specific ID:', '#/Txhvk1Tl/'].join('\n'),
      tripcode: ['# Filter any tripfag', '#/^!/'].join('\n'),
      capcode: ['# Set a custom class for mods:', '#/Mod$/;highlight:mod;op:yes', '# Set a custom class for moot:', '#/Admin$/;highlight:moot;op:yes'].join('\n'),
      email: ['# Filter any e-mails that are not `sage` on /a/ and /jp/:', '#/^(?!sage$)/;boards:a,jp'].join('\n'),
      subject: ['# Filter Generals on /v/:', '#/general/i;boards:v;op:only'].join('\n'),
      comment: ['# Filter Stallman copypasta on /g/:', '#/what you\'re refer+ing to as linux/i;boards:g'].join('\n'),
      flag: [''].join('\n'),
      filename: [''].join('\n'),
      dimensions: ['# Highlight potential wallpapers:', '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'].join('\n'),
      filesize: [''].join('\n'),
      MD5: [''].join('\n')
    },
    sauces: ['https://www.google.com/searchbyimage?image_url=%TURL', 'http://iqdb.org/?url=%TURL', '#//tineye.com/search?url=%TURL', '#http://saucenao.com/search.php?url=%TURL', '#http://3d.iqdb.org/?url=%TURL', '#http://regex.info/exif.cgi?imgurl=%URL', '# uploaders:', '#http://imgur.com/upload?url=%URL;text:Upload to imgur', '#http://ompldr.org/upload?url1=%URL;text:Upload to ompldr', '# "View Same" in archives:', '#//archive.foolz.us/_/search/image/%MD5/;text:View same on foolz', '#//archive.foolz.us/%board/search/image/%MD5/;text:View same on foolz /%board/', '#//archive.installgentoo.net/%board/image/%MD5;text:View same on installgentoo /%board/'].join('\n'),
    'Custom CSS': false,
    'Bottom header': false,
    'Header auto-hide': false,
    'Header catalog links': false,
    boardnav: '[current-title / toggle-all]',
    time: '%m/%d/%y(%a)%H:%M:%S',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    usercss: '',
    hotkeys: {
      'Toggle board list': ['Ctrl+b', 'Toggle the full board list.'],
      'Open empty QR': ['q', 'Open QR without post number inserted.'],
      'Open QR': ['Shift+q', 'Open QR with post number inserted.'],
      'Open settings': ['Alt+o', 'Open Settings.'],
      'Close': ['Esc', 'Close Settings, Notifications or QR.'],
      'Spoiler tags': ['Ctrl+s', 'Insert spoiler tags.'],
      'Code tags': ['Alt+c', 'Insert code tags.'],
      'Eqn tags': ['Alt+e', 'Insert eqn tags.'],
      'Math tags': ['Alt+m', 'Insert math tags.'],
      'Submit QR': ['Alt+s', 'Submit post.'],
      'Watch': ['w', 'Watch thread.'],
      'Update': ['r', 'Update the thread.'],
      'Expand image': ['Shift+e', 'Expand selected image.'],
      'Expand images': ['e', 'Expand all images.'],
      'Front page': ['0', 'Jump to page 0.'],
      'Open front page': ['Shift+0', 'Open page 0 in a new tab.'],
      'Next page': ['Right', 'Jump to the next page.'],
      'Previous page': ['Left', 'Jump to the previous page.'],
      'Next thread': ['Down', 'See next thread.'],
      'Previous thread': ['Up', 'See previous thread.'],
      'Expand thread': ['Ctrl+e', 'Expand thread.'],
      'Open thread': ['o', 'Open thread in current tab.'],
      'Open thread tab': ['Shift+o', 'Open thread in new tab.'],
      'Next reply': ['j', 'Select next reply.'],
      'Previous reply': ['k', 'Select previous reply.'],
      'Hide': ['x', 'Hide thread.']
    },
    updater: {
      checkbox: {
        'Beep': [false, 'Beep on new post to completely read thread.'],
        'Auto Scroll': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Bottom Scroll': [false, 'Always scroll to the bottom, not the first new post. Useful for event threads.'],
        'Scroll BG': [false, 'Auto-scroll background tabs.'],
        'Auto Update': [true, 'Automatically fetch new posts.']
      },
      'Interval': 30
    }
  };

  Conf = {};

  c = console;

  d = document;

  doc = d.documentElement;

  g = {
    VERSION: '3.0.4',
    NAMESPACE: '4chan X.',
    boards: {},
    threads: {},
    posts: {}
  };

  UI = (function() {
    var Menu, dialog, drag, dragend, dragstart, hover, hoverend, hoverstart, touchend, touchmove;

    dialog = function(id, position, html) {
      var el, move;

      el = $.el('div', {
        className: 'dialog',
        innerHTML: html,
        id: id
      });
      el.style.cssText = localStorage.getItem("" + g.NAMESPACE + id + ".position") || position;
      move = $('.move', el);
      $.on(move, 'touchstart mousedown', dragstart);
      return el;
    };
    Menu = (function() {
      var close, currentMenu, lastToggledButton;

      currentMenu = null;

      lastToggledButton = null;

      function Menu(type) {
        this.type = type;
        $.on(d, 'AddMenuEntry', this.addEntry.bind(this));
        this.close = close.bind(this);
        this.entries = [];
      }

      Menu.prototype.makeMenu = function() {
        var menu;

        menu = $.el('div', {
          className: 'dialog',
          id: 'menu',
          tabIndex: 0
        });
        $.on(menu, 'click', function(e) {
          return e.stopPropagation();
        });
        $.on(menu, 'keydown', this.keybinds.bind(this));
        return menu;
      };

      Menu.prototype.toggle = function(e, button, data) {
        var previousButton;

        e.preventDefault();
        e.stopPropagation();
        if (currentMenu) {
          previousButton = lastToggledButton;
          this.close();
          if (previousButton === button) {
            return;
          }
        }
        if (!this.entries.length) {
          return;
        }
        return this.open(button, data);
      };

      Menu.prototype.open = function(button, data) {
        var bLeft, bRect, bTop, bottom, cHeight, cWidth, entry, left, mRect, menu, prevEntry, right, style, top, _i, _len, _ref, _ref1, _ref2;

        menu = this.makeMenu();
        currentMenu = menu;
        lastToggledButton = button;
        _ref = this.entries;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          this.insertEntry(entry, menu, data);
        }
        entry = $('.entry', menu);
        while (prevEntry = this.findNextEntry(entry, -1)) {
          entry = prevEntry;
        }
        this.focus(entry);
        $.on(d, 'click', this.close);
        $.on(d, 'CloseMenu', this.close);
        $.add(button, menu);
        mRect = menu.getBoundingClientRect();
        bRect = button.getBoundingClientRect();
        bTop = doc.scrollTop + d.body.scrollTop + bRect.top;
        bLeft = doc.scrollLeft + d.body.scrollLeft + bRect.left;
        cHeight = doc.clientHeight;
        cWidth = doc.clientWidth;
        _ref1 = bRect.top + bRect.height + mRect.height < cHeight ? ['100%', null] : [null, '100%'], top = _ref1[0], bottom = _ref1[1];
        _ref2 = bRect.left + mRect.width < cWidth ? ['0px', null] : [null, '0px'], left = _ref2[0], right = _ref2[1];
        style = menu.style;
        style.top = top;
        style.right = right;
        style.bottom = bottom;
        style.left = left;
        return menu.focus();
      };

      Menu.prototype.insertEntry = function(entry, parent, data) {
        var subEntry, submenu, _i, _len, _ref;

        if (typeof entry.open === 'function') {
          if (!entry.open(data)) {
            return;
          }
        }
        $.add(parent, entry.el);
        if (!entry.subEntries) {
          return;
        }
        if (submenu = $('.submenu', entry.el)) {
          $.rm(submenu);
        }
        submenu = $.el('div', {
          className: 'dialog submenu'
        });
        _ref = entry.subEntries;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subEntry = _ref[_i];
          this.insertEntry(subEntry, submenu, data);
        }
        $.add(entry.el, submenu);
      };

      close = function() {
        $.rm(currentMenu);
        currentMenu = null;
        lastToggledButton = null;
        return $.off(d, 'click CloseMenu', this.close);
      };

      Menu.prototype.findNextEntry = function(entry, direction) {
        var entries;

        entries = __slice.call(entry.parentNode.children);
        entries.sort(function(first, second) {
          return +(first.style.order || first.style.webkitOrder) - +(second.style.order || second.style.webkitOrder);
        });
        return entries[entries.indexOf(entry) + direction];
      };

      Menu.prototype.keybinds = function(e) {
        var entry, next, nextPrev, subEntry, submenu;

        entry = $('.focused', currentMenu);
        while (subEntry = $('.focused', entry)) {
          entry = subEntry;
        }
        switch (e.keyCode) {
          case 27:
            lastToggledButton.focus();
            this.close();
            break;
          case 13:
          case 32:
            entry.click();
            break;
          case 38:
            if (next = this.findNextEntry(entry, -1)) {
              this.focus(next);
            }
            break;
          case 40:
            if (next = this.findNextEntry(entry, +1)) {
              this.focus(next);
            }
            break;
          case 39:
            if ((submenu = $('.submenu', entry)) && (next = submenu.firstElementChild)) {
              while (nextPrev = this.findNextEntry(next, -1)) {
                next = nextPrev;
              }
              this.focus(next);
            }
            break;
          case 37:
            if (next = $.x('parent::*[contains(@class,"submenu")]/parent::*', entry)) {
              this.focus(next);
            }
            break;
          default:
            return;
        }
        e.preventDefault();
        return e.stopPropagation();
      };

      Menu.prototype.focus = function(entry) {
        var bottom, cHeight, cWidth, eRect, focused, left, right, sRect, style, submenu, top, _i, _len, _ref, _ref1, _ref2;

        while (focused = $.x('parent::*/child::*[contains(@class,"focused")]', entry)) {
          $.rmClass(focused, 'focused');
        }
        _ref = $$('.focused', entry);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          focused = _ref[_i];
          $.rmClass(focused, 'focused');
        }
        $.addClass(entry, 'focused');
        if (!(submenu = $('.submenu', entry))) {
          return;
        }
        sRect = submenu.getBoundingClientRect();
        eRect = entry.getBoundingClientRect();
        cHeight = doc.clientHeight;
        cWidth = doc.clientWidth;
        _ref1 = eRect.top + sRect.height < cHeight ? ['0px', 'auto'] : ['auto', '0px'], top = _ref1[0], bottom = _ref1[1];
        _ref2 = eRect.right + sRect.width < cWidth ? ['100%', 'auto'] : ['auto', '100%'], left = _ref2[0], right = _ref2[1];
        style = submenu.style;
        style.top = top;
        style.bottom = bottom;
        style.left = left;
        return style.right = right;
      };

      Menu.prototype.addEntry = function(e) {
        var entry;

        entry = e.detail;
        if (entry.type !== this.type) {
          return;
        }
        this.parseEntry(entry);
        return this.entries.push(entry);
      };

      Menu.prototype.parseEntry = function(entry) {
        var el, style, subEntries, subEntry, _i, _len;

        el = entry.el, subEntries = entry.subEntries;
        $.addClass(el, 'entry');
        $.on(el, 'focus mouseover', (function(e) {
          e.stopPropagation();
          return this.focus(el);
        }).bind(this));
        style = el.style;
        style.webkitOrder = style.order = entry.order || 100;
        if (!subEntries) {
          return;
        }
        $.addClass(el, 'has-submenu');
        for (_i = 0, _len = subEntries.length; _i < _len; _i++) {
          subEntry = subEntries[_i];
          this.parseEntry(subEntry);
        }
      };

      return Menu;

    })();
    dragstart = function(e) {
      var el, isTouching, o, rect, screenHeight, screenWidth;

      if (e.type === 'mousedown' && e.button !== 0) {
        return;
      }
      e.preventDefault();
      if (isTouching = e.type === 'touchstart') {
        e = e.changedTouches[e.changedTouches.length - 1];
      }
      el = $.x('ancestor::div[contains(@class,"dialog")][1]', this);
      rect = el.getBoundingClientRect();
      screenHeight = doc.clientHeight;
      screenWidth = doc.clientWidth;
      o = {
        id: el.id,
        style: el.style,
        dx: e.clientX - rect.left,
        dy: e.clientY - rect.top,
        height: screenHeight - rect.height,
        width: screenWidth - rect.width,
        screenHeight: screenHeight,
        screenWidth: screenWidth,
        isTouching: isTouching
      };
      if (isTouching) {
        o.identifier = e.identifier;
        o.move = touchmove.bind(o);
        o.up = touchend.bind(o);
        $.on(d, 'touchmove', o.move);
        return $.on(d, 'touchend touchcancel', o.up);
      } else {
        o.move = drag.bind(o);
        o.up = dragend.bind(o);
        $.on(d, 'mousemove', o.move);
        return $.on(d, 'mouseup', o.up);
      }
    };
    touchmove = function(e) {
      var touch, _i, _len, _ref;

      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        if (touch.identifier === this.identifier) {
          drag.call(this, touch);
          return;
        }
      }
    };
    drag = function(e) {
      var bottom, clientX, clientY, left, right, style, top;

      clientX = e.clientX, clientY = e.clientY;
      left = clientX - this.dx;
      left = left < 10 ? 0 : this.width - left < 10 ? null : left / this.screenWidth * 100 + '%';
      top = clientY - this.dy;
      top = top < 10 ? 0 : this.height - top < 10 ? null : top / this.screenHeight * 100 + '%';
      right = left === null ? 0 : null;
      bottom = top === null ? 0 : null;
      style = this.style;
      style.left = left;
      style.right = right;
      style.top = top;
      return style.bottom = bottom;
    };
    touchend = function(e) {
      var touch, _i, _len, _ref;

      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        if (touch.identifier === this.identifier) {
          dragend.call(this);
          return;
        }
      }
    };
    dragend = function() {
      if (this.isTouching) {
        $.off(d, 'touchmove', this.move);
        $.off(d, 'touchend touchcancel', this.up);
      } else {
        $.off(d, 'mousemove', this.move);
        $.off(d, 'mouseup', this.up);
      }
      return localStorage.setItem("" + g.NAMESPACE + this.id + ".position", this.style.cssText);
    };
    hoverstart = function(_arg) {
      var asapTest, cb, el, endEvents, latestEvent, o, root;

      root = _arg.root, el = _arg.el, latestEvent = _arg.latestEvent, endEvents = _arg.endEvents, asapTest = _arg.asapTest, cb = _arg.cb;
      o = {
        root: root,
        el: el,
        style: el.style,
        cb: cb,
        endEvents: endEvents,
        latestEvent: latestEvent,
        clientHeight: doc.clientHeight,
        clientWidth: doc.clientWidth
      };
      o.hover = hover.bind(o);
      o.hoverend = hoverend.bind(o);
      $.asap(function() {
        return !el.parentNode || asapTest();
      }, function() {
        if (el.parentNode) {
          return o.hover(o.latestEvent);
        }
      });
      $.on(root, endEvents, o.hoverend);
      return $.on(root, 'mousemove', o.hover);
    };
    hover = function(e) {
      var clientX, clientY, height, left, right, style, top, _ref;

      this.latestEvent = e;
      height = this.el.offsetHeight;
      clientX = e.clientX, clientY = e.clientY;
      top = clientY - 120;
      top = this.clientHeight <= height || top <= 0 ? 0 : top + height >= this.clientHeight ? this.clientHeight - height : top;
      _ref = clientX <= this.clientWidth - 400 ? [clientX + 45 + 'px', null] : [null, this.clientWidth - clientX + 45 + 'px'], left = _ref[0], right = _ref[1];
      style = this.style;
      style.top = top + 'px';
      style.left = left;
      return style.right = right;
    };
    hoverend = function() {
      $.rm(this.el);
      $.off(this.root, this.endEvents, this.hoverend);
      $.off(this.root, 'mousemove', this.hover);
      if (this.cb) {
        return this.cb.call(this);
      }
    };
    return {
      dialog: dialog,
      Menu: Menu,
      hover: hoverstart
    };
  })();

  $ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return root.querySelector(selector);
  };

  $$ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return __slice.call(root.querySelectorAll(selector));
  };

  $.extend = function(object, properties) {
    var key, val;

    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
  };

  $.extend($, {
    SECOND: 1000,
    MINUTE: 1000 * 60,
    HOUR: 1000 * 60 * 60,
    DAY: 1000 * 60 * 60 * 24,
    engine: 'webkit',
    id: function(id) {
      return d.getElementById(id);
    },
    ready: function(fc) {
      var cb, _ref;

      if ((_ref = d.readyState) === 'interactive' || _ref === 'complete') {
        $.queueTask(fc);
        return;
      }
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    formData: function(form) {
      var fd, key, val;

      if (form instanceof HTMLFormElement) {
        return new FormData(form);
      }
      fd = new FormData();
      for (key in form) {
        val = form[key];
        if (!val) {
          continue;
        }
        if (val.size && val.name) {
          fd.append(key, val, val.name);
        } else {
          fd.append(key, val);
        }
      }
      return fd;
    },
    ajax: function(url, callbacks, opts) {
      var cred, form, headers, key, r, sync, type, upCallbacks, val;

      if (opts == null) {
        opts = {};
      }
      type = opts.type, cred = opts.cred, headers = opts.headers, upCallbacks = opts.upCallbacks, form = opts.form, sync = opts.sync;
      r = new XMLHttpRequest();
      type || (type = form && 'post' || 'get');
      r.open(type, url, !sync);
      for (key in headers) {
        val = headers[key];
        r.setRequestHeader(key, val);
      }
      $.extend(r, callbacks);
      $.extend(r.upload, upCallbacks);
      r.withCredentials = cred;
      r.send(form);
      return r;
    },
    cache: (function() {
      var reqs;

      reqs = {};
      return function(url, cb) {
        var req, rm;

        if (req = reqs[url]) {
          if (req.readyState === 4) {
            cb.call(req);
          } else {
            req.callbacks.push(cb);
          }
          return;
        }
        rm = function() {
          return delete reqs[url];
        };
        req = $.ajax(url, {
          onload: function(e) {
            var _i, _len, _ref;

            _ref = this.callbacks;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              cb = _ref[_i];
              cb.call(this, e);
            }
            return delete this.callbacks;
          },
          onabort: rm,
          onerror: rm
        });
        req.callbacks = [cb];
        return reqs[url] = req;
      };
    })(),
    cb: {
      checked: function() {
        $.set(this.name, this.checked);
        return Conf[this.name] = this.checked;
      },
      value: function() {
        $.set(this.name, this.value.trim());
        return Conf[this.name] = this.value;
      }
    },
    asap: function(test, cb) {
      if (test()) {
        return cb();
      } else {
        return setTimeout($.asap, 25, test, cb);
      }
    },
    addStyle: function(css) {
      var style;

      style = $.el('style', {
        textContent: css
      });
      $.asap((function() {
        return d.head;
      }), function() {
        return $.add(d.head, style);
      });
      return style;
    },
    x: function(path, root) {
      if (root == null) {
        root = d.body;
      }
      return d.evaluate(path, root, null, 8, null).singleNodeValue;
    },
    addClass: function(el, className) {
      return el.classList.add(className);
    },
    rmClass: function(el, className) {
      return el.classList.remove(className);
    },
    hasClass: function(el, className) {
      return el.classList.contains(className);
    },
    rm: function(el) {
      return el.parentNode.removeChild(el);
    },
    tn: function(s) {
      return d.createTextNode(s);
    },
    nodes: function(nodes) {
      var frag, node, _i, _len;

      if (!(nodes instanceof Array)) {
        return nodes;
      }
      frag = d.createDocumentFragment();
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        frag.appendChild(node);
      }
      return frag;
    },
    add: function(parent, el) {
      return parent.appendChild($.nodes(el));
    },
    prepend: function(parent, el) {
      return parent.insertBefore($.nodes(el), parent.firstChild);
    },
    after: function(root, el) {
      return root.parentNode.insertBefore($.nodes(el), root.nextSibling);
    },
    before: function(root, el) {
      return root.parentNode.insertBefore($.nodes(el), root);
    },
    replace: function(root, el) {
      return root.parentNode.replaceChild($.nodes(el), root);
    },
    el: function(tag, properties) {
      var el;

      el = d.createElement(tag);
      if (properties) {
        $.extend(el, properties);
      }
      return el;
    },
    on: function(el, events, handler) {
      var event, _i, _len, _ref;

      _ref = events.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        el.addEventListener(event, handler, false);
      }
    },
    off: function(el, events, handler) {
      var event, _i, _len, _ref;

      _ref = events.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        el.removeEventListener(event, handler, false);
      }
    },
    event: function(event, detail, root) {
      if (root == null) {
        root = d;
      }
      return root.dispatchEvent(new CustomEvent(event, {
        bubbles: true,
        detail: detail
      }));
    },
    open: (function() {
      if (typeof GM_openInTab !== "undefined" && GM_openInTab !== null) {
        return function(URL) {
          var a;

          a = $.el('a', {
            href: URL
          });
          return GM_openInTab(a.href);
        };
      } else {
        return function(URL) {
          return window.open(URL, '_blank');
        };
      }
    })(),
    debounce: function(wait, fn) {
      var args, exec, that, timeout;

      timeout = null;
      that = null;
      args = null;
      exec = function() {
        fn.apply(that, args);
        return timeout = null;
      };
      return function() {
        args = arguments;
        that = this;
        if (timeout) {
          clearTimeout(timeout);
        } else {
          exec();
        }
        return timeout = setTimeout(exec, wait);
      };
    },
    queueTask: (function() {
      var execTask, taskChannel, taskQueue;

      taskQueue = [];
      execTask = function() {
        var args, func, task;

        task = taskQueue.shift();
        func = task[0];
        args = Array.prototype.slice.call(task, 1);
        return func.apply(func, args);
      };
      if (window.MessageChannel) {
        taskChannel = new MessageChannel();
        taskChannel.port1.onmessage = execTask;
        return function() {
          taskQueue.push(arguments);
          return taskChannel.port2.postMessage(null);
        };
      } else {
        return function() {
          taskQueue.push(arguments);
          return setTimeout(execTask, 0);
        };
      }
    })(),
    globalEval: function(code) {
      var script;

      script = $.el('script', {
        textContent: code
      });
      $.add(d.head || doc, script);
      return $.rm(script);
    },
    bytesToString: function(size) {
      var unit;

      unit = 0;
      while (size >= 1024) {
        size /= 1024;
        unit++;
      }
      size = unit > 1 ? Math.round(size * 100) / 100 : Math.round(size);
      return "" + size + " " + ['B', 'KB', 'MB', 'GB'][unit];
    },
    syncing: {},
    sync: (function() {
      chrome.storage.onChanged.addListener(function(changes) {
        var cb, key;

        for (key in changes) {
          if (cb = $.syncing[key]) {
            cb(changes[key].newValue);
          }
        }
      });
      return function(key, cb) {
        return $.syncing[key] = cb;
      };
    })(),
    item: function(key, val) {
      var item;

      item = {};
      item[key] = val;
      return item;
    },
    "delete": function(keys) {
      return chrome.storage.sync.remove(keys);
    },
    get: function(key, val, cb) {
      var items;

      if (typeof cb === 'function') {
        items = $.item(key, val);
      } else {
        items = key;
        cb = val;
      }
      return chrome.storage.sync.get(items, cb);
    },
    set: function(key, val) {
      var items;

      items = typeof key === 'string' ? $.item(key, val) : key;
      return chrome.storage.sync.set(items);
    }
  });

  Polyfill = {
    init: function() {
      return Polyfill.visibility();
    },
    visibility: function() {
      var event, prefix, property;

      if ('visibilityState' in document) {
        return;
      }
      if ('webkitVisibilityState' in document) {
        prefix = 'webkit';
      } else if ('mozVisibilityState' in document) {
        prefix = 'moz';
      } else {
        return;
      }
      property = prefix + 'VisibilityState';
      event = prefix + 'visibilitychange';
      d.visibilityState = d[property];
      d.hidden = d.visibilityState === 'hidden';
      return $.on(d, event, function() {
        d.visibilityState = d[property];
        d.hidden = d.visibilityState === 'hidden';
        return $.event('visibilitychange');
      });
    }
  };

  Header = {
    init: function() {
      var catalogToggler, headerEl;

      headerEl = $.el('div', {
        id: 'header',
        innerHTML: "<div id=header-bar class=dialog>\n  <span class='menu-button brackets-wrap'><a href=javascript:;><i></i></a></span>\n  <span id=shortcuts class=brackets-wrap></span>\n  <span id=board-list>\n    <span id=custom-board-list></span>\n    <span id=full-board-list hidden></span>\n  </span>\n  <div id=toggle-header-bar title=\"Toggle the header auto-hiding.\"></div>\n</div>\n<div id=notifications></div>".replace(/>\s+</g, '><')
      });
      this.bar = $('#header-bar', headerEl);
      this.toggle = $('#toggle-header-bar', this.bar);
      this.menu = new UI.Menu('header');
      $.on($('.menu-button', this.bar), 'click', this.menuToggle);
      $.on(this.toggle, 'mousedown', this.toggleBarVisibility);
      $.on(window, 'load hashchange', Header.hashScroll);
      catalogToggler = $.el('label', {
        innerHTML: "<input type=checkbox " + (Conf['Header catalog links'] ? 'checked' : '') + "> Use catalog board links"
      });
      $.on(catalogToggler.firstElementChild, 'change', this.toggleCatalogLinks);
      $.sync('Header catalog links', this.setCatalogLinks);
      $.event('AddMenuEntry', {
        type: 'header',
        el: catalogToggler,
        order: 50
      });
      this.positionToggler = $.el('label', {
        innerHTML: "<input type=checkbox " + (Conf['Bottom header'] ? 'checked' : '') + "> Bottom header"
      });
      $.on(this.positionToggler.firstElementChild, 'change', this.toggleBarPosition);
      $.event('AddMenuEntry', {
        type: 'header',
        el: this.positionToggler,
        order: 108
      });
      this.setBarPosition(Conf['Bottom header']);
      $.sync('Bottom header', this.setBarPosition);
      this.headerToggler = $.el('label', {
        innerHTML: "<input type=checkbox " + (Conf['Header auto-hide'] ? 'checked' : '') + "> Auto-hide header"
      });
      $.on(this.headerToggler.firstElementChild, 'change', this.toggleBarVisibility);
      $.event('AddMenuEntry', {
        type: 'header',
        el: this.headerToggler,
        order: 109
      });
      this.setBarVisibility(Conf['Header auto-hide']);
      $.sync('Header auto-hide', this.setBarVisibility);
      $.on(d, 'CreateNotification', this.createNotification);
      return $.asap((function() {
        return d.body;
      }), function() {
        if (!Main.isThisPageLegit()) {
          return;
        }
        $.asap((function() {
          return $.id('boardNavMobile');
        }), Header.setBoardList);
        return $.prepend(d.body, headerEl);
      });
    },
    setBoardList: function() {
      var a, btn, fullBoardList, nav;

      nav = $.id('boardNavDesktop');
      if (a = $("a[href*='/" + g.BOARD + "/']", nav)) {
        a.className = 'current';
      }
      fullBoardList = $('#full-board-list', Header.bar);
      $.add(fullBoardList, __slice.call(nav.childNodes));
      if (Conf['Custom Board Navigation']) {
        Header.generateBoardList(Conf['boardnav']);
        $.sync('boardnav', Header.generateBoardList);
        btn = $.el('span', {
          className: 'hide-board-list-button brackets-wrap',
          innerHTML: '<a href=javascript:;> - </a>'
        });
        $.on(btn, 'click', Header.toggleBoardList);
        $.add(fullBoardList, btn);
      } else {
        $.rm($('#custom-board-list', Header.bar));
        fullBoardList.hidden = false;
      }
      return Header.setCatalogLinks(Conf['Header catalog links']);
    },
    generateBoardList: function(text) {
      var as, list, nodes;

      list = $('#custom-board-list', Header.bar);
      list.innerHTML = null;
      if (!text) {
        return;
      }
      as = $$('#full-board-list a', Header.bar).slice(0, -2);
      nodes = text.match(/[\w@]+(-(all|title|full|index|catalog|text:"[^"]+"))*|[^\w@]+/g).map(function(t) {
        var a, board, m, _i, _len;

        if (/^[^\w@]/.test(t)) {
          return $.tn(t);
        }
        if (/^toggle-all/.test(t)) {
          a = $.el('a', {
            className: 'show-board-list-button',
            textContent: (t.match(/-text:"(.+)"/) || [null, '+'])[1],
            href: 'javascript:;'
          });
          $.on(a, 'click', Header.toggleBoardList);
          return a;
        }
        board = /^current/.test(t) ? g.BOARD.ID : t.match(/^[^-]+/)[0];
        for (_i = 0, _len = as.length; _i < _len; _i++) {
          a = as[_i];
          if (a.textContent === board) {
            a = a.cloneNode(true);
            if (/-title/.test(t)) {
              a.textContent = a.title;
            } else if (/-full/.test(t)) {
              a.textContent = "/" + board + "/ - " + a.title;
            } else if (/-(index|catalog|text)/.test(t)) {
              if (m = t.match(/-(index|catalog)/)) {
                a.setAttribute('data-only', m[1]);
                a.href = "//boards.4chan.org/" + board + "/";
                if (m[1] === 'catalog') {
                  a.href += 'catalog';
                }
              }
              if (m = t.match(/-text:"(.+)"/)) {
                a.textContent = m[1];
              }
            } else if (board === '@') {
              $.addClass(a, 'navSmall');
            }
            return a;
          }
        }
        return $.tn(t);
      });
      return $.add(list, nodes);
    },
    toggleBoardList: function() {
      var bar, custom, full, showBoardList;

      bar = Header.bar;
      custom = $('#custom-board-list', bar);
      full = $('#full-board-list', bar);
      showBoardList = !full.hidden;
      custom.hidden = !showBoardList;
      return full.hidden = showBoardList;
    },
    setCatalogLinks: function(useCatalog) {
      var a, as, str, _i, _len;

      as = $$('#board-list a[href*="boards.4chan.org"]', Header.bar);
      str = useCatalog ? 'catalog' : '';
      for (_i = 0, _len = as.length; _i < _len; _i++) {
        a = as[_i];
        if (a.dataset.only) {
          continue;
        }
        a.pathname = "/" + (a.pathname.split('/')[1]) + "/" + str;
      }
    },
    toggleCatalogLinks: function() {
      Header.setCatalogLinks(this.checked);
      return $.set('Header catalog links', this.checked);
    },
    setBarPosition: function(bottom) {
      $.event('CloseMenu');
      Header.positionToggler.firstElementChild.checked = bottom;
      return Header.bar.parentNode.className = bottom ? 'bottom' : 'top';
    },
    toggleBarPosition: function() {
      var bottom;

      bottom = this.checked;
      Header.setBarPosition(bottom);
      Conf['Bottom header'] = bottom;
      return $.set('Bottom header', bottom);
    },
    setBarVisibility: function(hide) {
      Header.headerToggler.firstElementChild.checked = hide;
      return (hide ? $.addClass : $.rmClass)(Header.bar, 'autohide');
    },
    hashScroll: function() {
      var post;

      if (!(post = $.id(this.location.hash.slice(1)))) {
        return;
      }
      return Header.scrollToPost(post);
    },
    scrollToPost: function(post) {
      var headRect, top;

      top = post.getBoundingClientRect().top;
      if (!Conf['Bottom header']) {
        headRect = Header.toggle.getBoundingClientRect();
        top += -headRect.top - headRect.height;
      }
      return ($.engine === 'webkit' ? d.body : doc).scrollTop += top;
    },
    toggleBarVisibility: function(e) {
      var hide, message;

      if (e.type === 'mousedown' && e.button !== 0) {
        return;
      }
      hide = this.nodeName === 'INPUT' ? this.checked : !$.hasClass(Header.bar, 'autohide');
      Header.setBarVisibility(hide);
      message = hide ? 'The header bar will automatically hide itself.' : 'The header bar will remain visible.';
      new Notification('info', message, 2);
      return $.set('Header auto-hide', hide);
    },
    addShortcut: function(el) {
      var shortcut;

      shortcut = $.el('span', {
        className: 'shortcut'
      });
      $.add(shortcut, el);
      return $.prepend($('#shortcuts', Header.bar), shortcut);
    },
    menuToggle: function(e) {
      return Header.menu.toggle(e, this, g);
    },
    createNotification: function(e) {
      var cb, content, lifetime, notif, type, _ref;

      _ref = e.detail, type = _ref.type, content = _ref.content, lifetime = _ref.lifetime, cb = _ref.cb;
      notif = new Notification(type, content, lifetime);
      if (cb) {
        return cb(notif);
      }
    }
  };

  Notification = (function() {
    var add, close;

    function Notification(type, content, timeout) {
      this.timeout = timeout;
      this.add = add.bind(this);
      this.close = close.bind(this);
      this.el = $.el('div', {
        innerHTML: '<a href=javascript:; class=close title=Close>×</a><div class=message></div>'
      });
      this.el.style.opacity = 0;
      this.setType(type);
      $.on(this.el.firstElementChild, 'click', this.close);
      if (typeof content === 'string') {
        content = $.tn(content);
      }
      $.add(this.el.lastElementChild, content);
      $.ready(this.add);
    }

    Notification.prototype.setType = function(type) {
      return this.el.className = "notification " + type;
    };

    add = function() {
      if (d.hidden) {
        $.on(d, 'visibilitychange', this.add);
        return;
      }
      $.off(d, 'visibilitychange', this.add);
      $.add($.id('notifications'), this.el);
      this.el.clientHeight;
      this.el.style.opacity = 1;
      if (this.timeout) {
        return setTimeout(this.close, this.timeout * $.SECOND);
      }
    };

    close = function() {
      if (this.el.parentNode) {
        return $.rm(this.el);
      }
    };

    return Notification;

  })();

  Settings = {
    init: function() {
      var link, settings;

      link = $.el('a', {
        className: 'settings-link',
        textContent: '4chan X Settings',
        href: 'javascript:;'
      });
      $.on(link, 'click', Settings.open);
      $.event('AddMenuEntry', {
        type: 'header',
        el: link,
        order: 111
      });
      link = $.el('a', {
        className: 'fourchan-settings-link',
        textContent: '4chan Settings',
        href: 'javascript:;'
      });
      $.on(link, 'click', function() {
        return $.id('settingsWindowLink').click();
      });
      $.event('AddMenuEntry', {
        type: 'header',
        el: link,
        order: 110,
        open: function() {
          return Conf['Enable 4chan\'s Extension'];
        }
      });
      $.get('previousversion', null, function(item) {
        var changelog, curr, el, prev, previous;

        if (previous = item['previousversion']) {
          if (previous === g.VERSION) {
            return;
          }
          prev = previous.match(/\d+/g).map(Number);
          curr = g.VERSION.match(/\d+/g).map(Number);
          if (!(prev[0] <= curr[0] && prev[1] <= curr[1] && prev[2] <= curr[2])) {
            return;
          }
          changelog = 'https://github.com/MayhemYDG/4chan-x/blob/v3/CHANGELOG.md';
          el = $.el('span', {
            innerHTML: "4chan X has been updated to <a href='" + changelog + "' target=_blank>version " + g.VERSION + "</a>."
          });
          new Notification('info', el, 30);
        } else {
          $.on(d, '4chanXInitFinished', Settings.open);
        }
        return $.set({
          lastupdate: Date.now(),
          previousversion: g.VERSION
        });
      });
      Settings.addSection('Main', Settings.main);
      Settings.addSection('Filter', Settings.filter);
      Settings.addSection('Sauce', Settings.sauce);
      Settings.addSection('Rice', Settings.rice);
      Settings.addSection('Keybinds', Settings.keybinds);
      $.on(d, 'AddSettingsSection', Settings.addSection);
      $.on(d, 'OpenSettings', function(e) {
        return Settings.open(e.detail);
      });
      if (Conf['Enable 4chan\'s Extension']) {
        return;
      }
      settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
      if (settings.disableAll) {
        return;
      }
      settings.disableAll = true;
      return localStorage.setItem('4chan-settings', JSON.stringify(settings));
    },
    open: function(openSection) {
      var html, link, links, overlay, section, sectionToOpen, _i, _len, _ref;

      if (Settings.dialog) {
        return;
      }
      $.event('CloseMenu');
      html = "<div id=fourchanx-settings class=dialog>\n  <nav>\n    <div class=sections-list></div>\n    <div class=credits>\n      <a href='https://4chan-x.just-believe.in/' target=_blank>4chan X</a> |\n      <a href='https://github.com/MayhemYDG/4chan-x/blob/v3/CHANGELOG.md' target=_blank>" + g.VERSION + "</a> |\n      <a href='https://github.com/MayhemYDG/4chan-x/blob/v3/CONTRIBUTING.md#reporting-bugs' target=_blank>Issues</a> |\n      <a href=javascript:; class=close title=Close>×</a>\n    </div>\n  </nav>\n  <hr>\n  <div class=section-container><section></section></div>\n</div>";
      Settings.dialog = overlay = $.el('div', {
        id: 'overlay',
        innerHTML: html
      });
      links = [];
      _ref = Settings.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        link = $.el('a', {
          className: "tab-" + section.hyphenatedTitle,
          textContent: section.title,
          href: 'javascript:;'
        });
        $.on(link, 'click', Settings.openSection.bind(section));
        links.push(link, $.tn(' | '));
        if (section.title === openSection) {
          sectionToOpen = link;
        }
      }
      links.pop();
      $.add($('.sections-list', overlay), links);
      (sectionToOpen ? sectionToOpen : links[0]).click();
      $.on($('.close', overlay), 'click', Settings.close);
      $.on(overlay, 'click', Settings.close);
      $.on(overlay.firstElementChild, 'click', function(e) {
        return e.stopPropagation();
      });
      d.body.style.width = "" + d.body.clientWidth + "px";
      $.addClass(d.body, 'unscroll');
      return $.add(d.body, overlay);
    },
    close: function() {
      if (!Settings.dialog) {
        return;
      }
      d.body.style.removeProperty('width');
      $.rmClass(d.body, 'unscroll');
      $.rm(Settings.dialog);
      return delete Settings.dialog;
    },
    sections: [],
    addSection: function(title, open) {
      var hyphenatedTitle, _ref;

      if (typeof title !== 'string') {
        _ref = title.detail, title = _ref.title, open = _ref.open;
      }
      hyphenatedTitle = title.toLowerCase().replace(/\s+/g, '-');
      return Settings.sections.push({
        title: title,
        hyphenatedTitle: hyphenatedTitle,
        open: open
      });
    },
    openSection: function() {
      var section, selected;

      if (selected = $('.tab-selected', Settings.dialog)) {
        $.rmClass(selected, 'tab-selected');
      }
      $.addClass($(".tab-" + this.hyphenatedTitle, Settings.dialog), 'tab-selected');
      section = $('section', Settings.dialog);
      section.innerHTML = null;
      section.className = "section-" + this.hyphenatedTitle;
      this.open(section, g);
      return section.scrollTop = 0;
    },
    main: function(section) {
      var arr, button, description, div, fs, hiddenNum, input, inputs, items, key, obj, _ref;

      section.innerHTML = "<div class=imp-exp>\n  <button class=export>Export Settings</button>\n  <button class=import>Import Settings</button>\n  <input type=file style='visibility:hidden'>\n</div>\n<p class=imp-exp-result></p>";
      $.on($('.export', section), 'click', Settings["export"]);
      $.on($('.import', section), 'click', Settings["import"]);
      $.on($('input', section), 'change', Settings.onImport);
      items = {};
      inputs = {};
      _ref = Config.main;
      for (key in _ref) {
        obj = _ref[key];
        fs = $.el('fieldset', {
          innerHTML: "<legend>" + key + "</legend>"
        });
        for (key in obj) {
          arr = obj[key];
          description = arr[1];
          div = $.el('div', {
            innerHTML: "<label><input type=checkbox name=\"" + key + "\">" + key + "</label><span class=description>: " + description + "</span>"
          });
          input = $('input', div);
          $.on(input, 'change', $.cb.checked);
          items[key] = Conf[key];
          inputs[key] = input;
          $.add(fs, div);
        }
        $.add(section, fs);
      }
      $.get(items, function(items) {
        var val;

        for (key in items) {
          val = items[key];
          inputs[key].checked = val;
        }
      });
      div = $.el('div', {
        innerHTML: "<button></button><span class=description>: Clear manually-hidden threads and posts on all boards. Refresh the page to apply."
      });
      button = $('button', div);
      hiddenNum = 0;
      $.get('hiddenThreads', {
        boards: {}
      }, function(item) {
        var ID, board, thread, _ref1;

        _ref1 = item.hiddenThreads.boards;
        for (ID in _ref1) {
          board = _ref1[ID];
          for (ID in board) {
            thread = board[ID];
            hiddenNum++;
          }
        }
        return button.textContent = "Hidden: " + hiddenNum;
      });
      $.get('hiddenPosts', {
        boards: {}
      }, function(item) {
        var ID, board, post, thread, _ref1;

        _ref1 = item.hiddenPosts.boards;
        for (ID in _ref1) {
          board = _ref1[ID];
          for (ID in board) {
            thread = board[ID];
            for (ID in thread) {
              post = thread[ID];
              hiddenNum++;
            }
          }
        }
        return button.textContent = "Hidden: " + hiddenNum;
      });
      $.on(button, 'click', function() {
        this.textContent = 'Hidden: 0';
        return $.get('hiddenThreads', {
          boards: {}
        }, function(item) {
          var boardID;

          for (boardID in item.hiddenThreads.boards) {
            localStorage.removeItem("4chan-hide-t-" + boardID);
          }
          return $["delete"](['hiddenThreads', 'hiddenPosts']);
        });
      });
      return $.after($('input[name="Stubs"]', section).parentNode.parentNode, div);
    },
    "export": function(now, data) {
      var a, db, p, _i, _len;

      if (typeof now !== 'number') {
        now = Date.now();
        data = {
          version: g.VERSION,
          date: now
        };
        Conf['WatchedThreads'] = {};
        for (_i = 0, _len = DataBoards.length; _i < _len; _i++) {
          db = DataBoards[_i];
          Conf[db] = {
            boards: {}
          };
        }
        $.get(Conf, function(Conf) {
          data.Conf = Conf;
          return Settings["export"](now, data);
        });
        return;
      }
      a = $.el('a', {
        className: 'warning',
        textContent: 'Save me!',
        download: "4chan X v" + g.VERSION + "-" + now + ".json",
        href: "data:application/json;base64," + (btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))))),
        target: '_blank'
      });
      if ($.engine !== 'gecko') {
        a.click();
        return;
      }
      p = $('.imp-exp-result', Settings.dialog);
      p.innerHTML = null;
      return $.add(p, a);
    },
    "import": function() {
      return this.nextElementSibling.click();
    },
    onImport: function() {
      var file, output, reader;

      if (!(file = this.files[0])) {
        return;
      }
      output = this.parentNode.nextElementSibling;
      if (!confirm('Your current settings will be entirely overwritten, are you sure?')) {
        output.textContent = 'Import aborted.';
        return;
      }
      reader = new FileReader();
      reader.onload = function(e) {
        var data, err;

        try {
          data = JSON.parse(e.target.result);
          Settings.loadSettings(data);
          if (confirm('Import successful. Refresh now?')) {
            return window.location.reload();
          }
        } catch (_error) {
          err = _error;
          output.textContent = 'Import failed due to an error.';
          return c.error(err.stack);
        }
      };
      return reader.readAsText(file);
    },
    loadSettings: function(data) {
      var key, val, version, _ref;

      version = data.version.split('.');
      if (version[0] === '2') {
        data = Settings.convertSettings(data, {
          'Disable 4chan\'s extension': '',
          'Catalog Links': '',
          'Reply Navigation': '',
          'Show Stubs': 'Stubs',
          'Image Auto-Gif': 'Auto-GIF',
          'Expand From Current': '',
          'Unread Favicon': 'Unread Tab Icon',
          'Post in Title': 'Thread Excerpt',
          'Auto Hide QR': '',
          'Open Reply in New Tab': '',
          'Remember QR size': '',
          'Quote Inline': 'Quote Inlining',
          'Quote Preview': 'Quote Previewing',
          'Indicate OP quote': 'Mark OP Quotes',
          'Indicate Cross-thread Quotes': 'Mark Cross-thread Quotes',
          'uniqueid': 'uniqueID',
          'mod': 'capcode',
          'country': 'flag',
          'md5': 'MD5',
          'openEmptyQR': 'Open empty QR',
          'openQR': 'Open QR',
          'openOptions': 'Open settings',
          'close': 'Close',
          'spoiler': 'Spoiler tags',
          'code': 'Code tags',
          'submit': 'Submit QR',
          'watch': 'Watch',
          'update': 'Update',
          'unreadCountTo0': '',
          'expandAllImages': 'Expand images',
          'expandImage': 'Expand image',
          'zero': 'Front page',
          'nextPage': 'Next page',
          'previousPage': 'Previous page',
          'nextThread': 'Next thread',
          'previousThread': 'Previous thread',
          'expandThread': 'Expand thread',
          'openThreadTab': 'Open thread',
          'openThread': 'Open thread tab',
          'nextReply': 'Next reply',
          'previousReply': 'Previous reply',
          'hide': 'Hide',
          'Scrolling': 'Auto Scroll',
          'Verbose': ''
        });
        data.Conf.sauces = data.Conf.sauces.replace(/\$\d/g, function(c) {
          switch (c) {
            case '$1':
              return '%TURL';
            case '$2':
              return '%URL';
            case '$3':
              return '%MD5';
            case '$4':
              return '%board';
            default:
              return c;
          }
        });
        _ref = Config.hotkeys;
        for (key in _ref) {
          val = _ref[key];
          if (!(key in data.Conf)) {
            continue;
          }
          data.Conf[key] = data.Conf[key].replace(/ctrl|alt|meta/g, function(s) {
            return "" + (s[0].toUpperCase()) + s.slice(1);
          }).replace(/(^|.+\+)[A-Z]$/g, function(s) {
            return "Shift+" + s.slice(0, -1) + (s.slice(-1).toLowerCase());
          });
        }
        data.Conf.WatchedThreads = data.WatchedThreads;
      }
      return $.set(data.Conf);
    },
    convertSettings: function(data, map) {
      var newKey, prevKey;

      for (prevKey in map) {
        newKey = map[prevKey];
        if (newKey) {
          data.Conf[newKey] = data.Conf[prevKey];
        }
        delete data.Conf[prevKey];
      }
      return data;
    },
    filter: function(section) {
      var select;

      section.innerHTML = "<select name=filter>\n  <option value=guide>Guide</option>\n  <option value=name>Name</option>\n  <option value=uniqueID>Unique ID</option>\n  <option value=tripcode>Tripcode</option>\n  <option value=capcode>Capcode</option>\n  <option value=email>E-mail</option>\n  <option value=subject>Subject</option>\n  <option value=comment>Comment</option>\n  <option value=flag>Flag</option>\n  <option value=filename>Filename</option>\n  <option value=dimensions>Image dimensions</option>\n  <option value=filesize>Filesize</option>\n  <option value=MD5>Image MD5</option>\n</select>\n<div></div>";
      select = $('select', section);
      $.on(select, 'change', Settings.selectFilter);
      return Settings.selectFilter.call(select);
    },
    selectFilter: function() {
      var div, name, ta;

      div = this.nextElementSibling;
      if ((name = this.value) !== 'guide') {
        div.innerHTML = null;
        ta = $.el('textarea', {
          name: name,
          className: 'field',
          spellcheck: false
        });
        $.get(name, Conf[name], function(item) {
          return ta.value = item[name];
        });
        $.on(ta, 'change', $.cb.value);
        $.add(div, ta);
        return;
      }
      return div.innerHTML = "<div class=warning " + (Conf['Filter'] ? 'hidden' : '') + "><code>Filter</code> is disabled.</div>\n<p>\n  Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\n  Lines starting with a <code>#</code> will be ignored.<br>\n  For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.<br>\n  MD5 filtering uses exact string matching, not regular expressions.\n</p>\n<ul>You can use these settings with each regular expression, separate them with semicolons:\n  <li>\n    Per boards, separate them with commas. It is global if not specified.<br>\n    For example: <code>boards:a,jp;</code>.\n  </li>\n  <li>\n    Filter OPs only along with their threads (`only`), replies only (`no`), or both (`yes`, this is default).<br>\n    For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.\n  </li>\n  <li>\n    Overrule the `Show Stubs` setting if specified: create a stub (`yes`) or not (`no`).<br>\n    For example: <code>stub:yes;</code> or <code>stub:no;</code>.\n  </li>\n  <li>\n    Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>\n    For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.\n  </li>\n  <li>\n    Highlighted OPs will have their threads put on top of board pages by default.<br>\n    For example: <code>top:yes;</code> or <code>top:no;</code>.\n  </li>\n</ul>";
    },
    sauce: function(section) {
      var sauce;

      section.innerHTML = "<div class=warning " + (Conf['Sauce'] ? 'hidden' : '') + "><code>Sauce</code> is disabled.</div>\n<div>Lines starting with a <code>#</code> will be ignored.</div>\n<div>You can specify a display text by appending <code>;text:[text]</code> to the URL.</div>\n<ul>These parameters will be replaced by their corresponding values:\n  <li><code>%TURL</code>: Thumbnail URL.</li>\n  <li><code>%URL</code>: Full image URL.</li>\n  <li><code>%MD5</code>: MD5 hash.</li>\n  <li><code>%board</code>: Current board.</li>\n</ul>\n<textarea name=sauces class=field spellcheck=false></textarea>";
      sauce = $('textarea', section);
      $.get('sauces', Conf['sauces'], function(item) {
        return sauce.value = item['sauces'];
      });
      return $.on(sauce, 'change', $.cb.value);
    },
    rice: function(section) {
      var event, input, inputs, items, name, _i, _len, _ref;

      section.innerHTML = "<fieldset>\n  <legend>Custom Board Navigation <span class=warning " + (Conf['Custom Board Navigation'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=boardnav class=field spellcheck=false></div>\n  <div>In the following, <code>board</code> can translate to a board ID (<code>a</code>, <code>b</code>, etc...), the current board (<code>current</code>), or the Status/Twitter link (<code>status</code>, <code>@</code>).</div>\n  <div>Board link: <code>board</code></div>\n  <div>Title link: <code>board-title</code></div>\n  <div>Full text link: <code>board-full</code></div>\n  <div>Custom text link: <code>board-text:\"VIP Board\"</code></div>\n  <div>Index-only link: <code>board-index</code></div>\n  <div>Catalog-only link: <code>board-catalog</code></div>\n  <div>Combinations are possible: <code>board-index-text:\"VIP Index\"</code></div>\n  <div>Full board list toggle: <code>toggle-all</code></div>\n</fieldset>\n\n<fieldset>\n  <legend>Time Formatting <span class=warning " + (Conf['Time Formatting'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=time class=field spellcheck=false>: <span class=time-preview></span></div>\n  <div>Supported <a href=//en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</div>\n  <div>Day: <code>%a</code>, <code>%A</code>, <code>%d</code>, <code>%e</code></div>\n  <div>Month: <code>%m</code>, <code>%b</code>, <code>%B</code></div>\n  <div>Year: <code>%y</code></div>\n  <div>Hour: <code>%k</code>, <code>%H</code>, <code>%l</code>, <code>%I</code>, <code>%p</code>, <code>%P</code></div>\n  <div>Minute: <code>%M</code></div>\n  <div>Second: <code>%S</code></div>\n</fieldset>\n\n<fieldset>\n  <legend>Quote Backlinks formatting <span class=warning " + (Conf['Quote Backlinks'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=backlink class=field spellcheck=false>: <span class=backlink-preview></span></div>\n</fieldset>\n\n<fieldset>\n  <legend>File Info Formatting <span class=warning " + (Conf['File Info Formatting'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=fileInfo class=field spellcheck=false>: <span class='fileText file-info-preview'></span></div>\n  <div>Link: <code>%l</code> (truncated), <code>%L</code> (untruncated), <code>%T</code> (Unix timestamp)</div>\n  <div>Original file name: <code>%n</code> (truncated), <code>%N</code> (untruncated), <code>%t</code> (Unix timestamp)</div>\n  <div>Spoiler indicator: <code>%p</code></div>\n  <div>Size: <code>%B</code> (Bytes), <code>%K</code> (KB), <code>%M</code> (MB), <code>%s</code> (4chan default)</div>\n  <div>Resolution: <code>%r</code> (Displays 'PDF' for PDF files)</div>\n</fieldset>\n\n<fieldset>\n  <legend>Unread Tab Icon <span class=warning " + (Conf['Unread Tab Icon'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <select name=favicon>\n    <option value=ferongr>ferongr</option>\n    <option value=xat->xat-</option>\n    <option value=Mayhem>Mayhem</option>\n    <option value=Original>Original</option>\n  </select>\n  <span class=favicon-preview></span>\n</fieldset>\n\n<fieldset>\n  <legend>\n    <label><input type=checkbox name='Custom CSS' " + (Conf['Custom CSS'] ? 'checked' : '') + "> Custom CSS</label>\n  </legend>\n  <button id=apply-css>Apply CSS</button>\n  <textarea name=usercss class=field spellcheck=false " + (Conf['Custom CSS'] ? '' : 'disabled') + "></textarea>\n</fieldset>";
      items = {};
      inputs = {};
      _ref = ['boardnav', 'time', 'backlink', 'fileInfo', 'favicon', 'usercss'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        input = $("[name=" + name + "]", section);
        items[name] = Conf[name];
        inputs[name] = input;
        event = name === 'favicon' || name === 'usercss' ? 'change' : 'input';
        $.on(input, event, $.cb.value);
      }
      $.get(items, function(items) {
        var key, val;

        for (key in items) {
          val = items[key];
          input = inputs[key];
          input.value = val;
          if (key !== 'usercss') {
            $.on(input, event, Settings[key]);
            Settings[key].call(input);
          }
        }
      });
      $.on($('input[name="Custom CSS"]', section), 'change', Settings.togglecss);
      return $.on($.id('apply-css'), 'click', Settings.usercss);
    },
    boardnav: function() {
      return Header.generateBoardList(this.value);
    },
    time: function() {
      var funk;

      funk = Time.createFunc(this.value);
      return this.nextElementSibling.textContent = funk(Time, new Date());
    },
    backlink: function() {
      return this.nextElementSibling.textContent = Conf['backlink'].replace(/%id/, '123456789');
    },
    fileInfo: function() {
      var data, funk;

      data = {
        isReply: true,
        file: {
          URL: '//images.4chan.org/g/src/1334437723720.jpg',
          name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg',
          size: '276 KB',
          sizeInBytes: 276 * 1024,
          dimensions: '1280x720',
          isImage: true,
          isSpoiler: true
        }
      };
      funk = FileInfo.createFunc(this.value);
      return this.nextElementSibling.innerHTML = funk(FileInfo, data);
    },
    favicon: function() {
      Favicon["switch"]();
      if (g.VIEW === 'thread' && Conf['Unread Tab Icon']) {
        Unread.update();
      }
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon["default"] + ">\n<img src=" + Favicon.unreadSFW + ">\n<img src=" + Favicon.unreadNSFW + ">\n<img src=" + Favicon.unreadDead + ">";
    },
    togglecss: function() {
      if ($('textarea[name=usercss]', $.x('ancestor::fieldset[1]', this)).disabled = !this.checked) {
        CustomCSS.rmStyle();
      } else {
        CustomCSS.addStyle();
      }
      return $.cb.checked.call(this);
    },
    usercss: function() {
      return CustomCSS.update();
    },
    keybinds: function(section) {
      var arr, input, inputs, items, key, tbody, tr, _ref;

      section.innerHTML = "<div class=warning " + (Conf['Keybinds'] ? 'hidden' : '') + "><code>Keybinds</code> are disabled.</div>\n<div>Allowed keys: <kbd>a-z</kbd>, <kbd>0-9</kbd>, <kbd>Ctrl</kbd>, <kbd>Shift</kbd>, <kbd>Alt</kbd>, <kbd>Meta</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Up</kbd>, <kbd>Down</kbd>, <kbd>Right</kbd>, <kbd>Left</kbd>.</div>\n<div>Press <kbd>Backspace</kbd> to disable a keybind.</div>\n<table><tbody>\n  <tr><th>Actions</th><th>Keybinds</th></tr>\n</tbody></table>";
      tbody = $('tbody', section);
      items = {};
      inputs = {};
      _ref = Config.hotkeys;
      for (key in _ref) {
        arr = _ref[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input class=field></td>"
        });
        input = $('input', tr);
        input.name = key;
        input.spellcheck = false;
        items[key] = Conf[key];
        inputs[key] = input;
        $.on(input, 'keydown', Settings.keybind);
        $.add(tbody, tr);
      }
      return $.get(items, function(items) {
        var val;

        for (key in items) {
          val = items[key];
          inputs[key].value = val;
        }
      });
    },
    keybind: function(e) {
      var key;

      if (e.keyCode === 9) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if ((key = Keybinds.keyCode(e)) == null) {
        return;
      }
      this.value = key;
      return $.cb.value.call(this);
    }
  };

  Fourchan = {
    init: function() {
      var board;

      if (g.VIEW === 'catalog') {
        return;
      }
      board = g.BOARD.ID;
      if (board === 'g') {
        $.globalEval("window.addEventListener('prettyprint', function(e) {\n  var pre = e.detail;\n  pre.innerHTML = prettyPrintOne(pre.innerHTML);\n}, false);");
        Post.prototype.callbacks.push({
          name: 'Parse /g/ code',
          cb: this.code
        });
      }
      if (board === 'sci') {
        $.globalEval("window.addEventListener('jsmath', function(e) {\n  if (jsMath.loaded) {\n    // process one post\n    jsMath.ProcessBeforeShowing(e.detail);\n  } else {\n    // load jsMath and process whole document\n    jsMath.Autoload.Script.Push('ProcessBeforeShowing', [null]);\n    jsMath.Autoload.LoadJsMath();\n  }\n}, false);");
        return Post.prototype.callbacks.push({
          name: 'Parse /sci/ math',
          cb: this.math
        });
      }
    },
    code: function() {
      var pre, _i, _len, _ref;

      if (this.isClone) {
        return;
      }
      _ref = $$('.prettyprint', this.nodes.comment);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pre = _ref[_i];
        $.event('prettyprint', pre, window);
      }
    },
    math: function() {
      if (this.isClone || !$('.math', this.nodes.comment)) {
        return;
      }
      return $.event('jsmath', this.nodes.post, window);
    },
    parseThread: function(threadID, offset, limit) {
      return $.event('4chanParsingDone', {
        threadId: threadID,
        offset: offset,
        limit: limit
      });
    }
  };

  CustomCSS = {
    init: function() {
      if (!Conf['Custom CSS']) {
        return;
      }
      return this.addStyle();
    },
    addStyle: function() {
      return this.style = $.addStyle(Conf['usercss']);
    },
    rmStyle: function() {
      if (this.style) {
        $.rm(this.style);
        return delete this.style;
      }
    },
    update: function() {
      if (!this.style) {
        this.addStyle();
      }
      return this.style.textContent = Conf['usercss'];
    }
  };

  Filter = {
    filters: {},
    init: function() {
      var boards, err, filter, hl, key, op, regexp, stub, top, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

      if (g.VIEW === 'catalog' || !Conf['Filter']) {
        return;
      }
      for (key in Config.filter) {
        this.filters[key] = [];
        _ref = Conf[key].split('\n');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (filter[0] === '#') {
            continue;
          }
          if (!(regexp = filter.match(/\/(.+)\/(\w*)/))) {
            continue;
          }
          filter = filter.replace(regexp[0], '');
          boards = ((_ref1 = filter.match(/boards:([^;]+)/)) != null ? _ref1[1].toLowerCase() : void 0) || 'global';
          if (boards !== 'global' && !(_ref2 = g.BOARD.ID, __indexOf.call(boards.split(','), _ref2) >= 0)) {
            continue;
          }
          if (key === 'uniqueID' || key === 'MD5') {
            regexp = regexp[1];
          } else {
            try {
              regexp = RegExp(regexp[1], regexp[2]);
            } catch (_error) {
              err = _error;
              new Notification('warning', err.message, 60);
              continue;
            }
          }
          op = ((_ref3 = filter.match(/[^t]op:(yes|no|only)/)) != null ? _ref3[1] : void 0) || 'yes';
          stub = (function() {
            var _ref4;

            switch ((_ref4 = filter.match(/stub:(yes|no)/)) != null ? _ref4[1] : void 0) {
              case 'yes':
                return true;
              case 'no':
                return false;
              default:
                return Conf['Stubs'];
            }
          })();
          if (hl = /highlight/.test(filter)) {
            hl = ((_ref4 = filter.match(/highlight:(\w+)/)) != null ? _ref4[1] : void 0) || 'filter-highlight';
            top = ((_ref5 = filter.match(/top:(yes|no)/)) != null ? _ref5[1] : void 0) || 'yes';
            top = top === 'yes';
          }
          this.filters[key].push(this.createFilter(regexp, op, stub, hl, top));
        }
        if (!this.filters[key].length) {
          delete this.filters[key];
        }
      }
      if (!Object.keys(this.filters).length) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Filter',
        cb: this.node
      });
    },
    createFilter: function(regexp, op, stub, hl, top) {
      var settings, test;

      test = typeof regexp === 'string' ? function(value) {
        return regexp === value;
      } : function(value) {
        return regexp.test(value);
      };
      settings = {
        hide: !hl,
        stub: stub,
        "class": hl,
        top: top
      };
      return function(value, isReply) {
        if (isReply && op === 'only' || !isReply && op === 'no') {
          return false;
        }
        if (!test(value)) {
          return false;
        }
        return settings;
      };
    },
    node: function() {
      var filter, firstThread, key, result, thisThread, value, _i, _len, _ref;

      if (this.isClone) {
        return;
      }
      for (key in Filter.filters) {
        value = Filter[key](this);
        if (value === false) {
          continue;
        }
        _ref = Filter.filters[key];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (!(result = filter(value, this.isReply))) {
            continue;
          }
          if (result.hide) {
            if (this.isReply) {
              PostHiding.hide(this, result.stub);
            } else if (g.VIEW === 'index') {
              ThreadHiding.hide(this.thread, result.stub);
            } else {
              continue;
            }
            return;
          }
          $.addClass(this.nodes.root, result["class"]);
          if (!this.isReply && result.top && g.VIEW === 'index') {
            thisThread = this.nodes.root.parentNode;
            if (firstThread = $('div[class="postContainer opContainer"]')) {
              if (firstThread !== this.nodes.root) {
                $.before(firstThread.parentNode, [thisThread, thisThread.nextElementSibling]);
              }
            }
          }
        }
      }
    },
    name: function(post) {
      if ('name' in post.info) {
        return post.info.name;
      }
      return false;
    },
    uniqueID: function(post) {
      if ('uniqueID' in post.info) {
        return post.info.uniqueID;
      }
      return false;
    },
    tripcode: function(post) {
      if ('tripcode' in post.info) {
        return post.info.tripcode;
      }
      return false;
    },
    capcode: function(post) {
      if ('capcode' in post.info) {
        return post.info.capcode;
      }
      return false;
    },
    email: function(post) {
      if ('email' in post.info) {
        return post.info.email;
      }
      return false;
    },
    subject: function(post) {
      if ('subject' in post.info) {
        return post.info.subject || false;
      }
      return false;
    },
    comment: function(post) {
      if ('comment' in post.info) {
        return post.info.comment;
      }
      return false;
    },
    flag: function(post) {
      if ('flag' in post.info) {
        return post.info.flag;
      }
      return false;
    },
    filename: function(post) {
      if (post.file) {
        return post.file.name;
      }
      return false;
    },
    dimensions: function(post) {
      if (post.file && post.file.isImage) {
        return post.file.dimensions;
      }
      return false;
    },
    filesize: function(post) {
      if (post.file) {
        return post.file.size;
      }
      return false;
    },
    MD5: function(post) {
      if (post.file) {
        return post.file.MD5;
      }
      return false;
    },
    menu: {
      init: function() {
        var div, entry, type, _i, _len, _ref;

        if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Filter']) {
          return;
        }
        div = $.el('div', {
          textContent: 'Filter'
        });
        entry = {
          type: 'post',
          el: div,
          order: 50,
          open: function(post) {
            Filter.menu.post = post;
            return true;
          },
          subEntries: []
        };
        _ref = [['Name', 'name'], ['Unique ID', 'uniqueID'], ['Tripcode', 'tripcode'], ['Capcode', 'capcode'], ['E-mail', 'email'], ['Subject', 'subject'], ['Comment', 'comment'], ['Flag', 'flag'], ['Filename', 'filename'], ['Image dimensions', 'dimensions'], ['Filesize', 'filesize'], ['Image MD5', 'MD5']];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          type = _ref[_i];
          entry.subEntries.push(Filter.menu.createSubEntry(type[0], type[1]));
        }
        return $.event('AddMenuEntry', entry);
      },
      createSubEntry: function(text, type) {
        var el;

        el = $.el('a', {
          href: 'javascript:;',
          textContent: text
        });
        el.setAttribute('data-type', type);
        $.on(el, 'click', Filter.menu.makeFilter);
        return {
          el: el,
          open: function(post) {
            var value;

            value = Filter[type](post);
            return value !== false;
          }
        };
      },
      makeFilter: function() {
        var re, type, value;

        type = this.dataset.type;
        value = Filter[type](Filter.menu.post);
        re = type === 'uniqueID' || type === 'MD5' ? value : value.replace(/\/|\\|\^|\$|\n|\.|\(|\)|\{|\}|\[|\]|\?|\*|\+|\|/g, function(c) {
          if (c === '\n') {
            return '\\n';
          } else if (c === '\\') {
            return '\\\\';
          } else {
            return "\\" + c;
          }
        });
        re = type === 'uniqueID' || type === 'MD5' ? "/" + re + "/" : "/^" + re + "$/";
        return $.get(type, Conf[type], function(item) {
          var save, section, select, ta, tl;

          save = item[type];
          save = save ? "" + save + "\n" + re : re;
          $.set(type, save);
          Settings.open('Filter');
          section = $('.section-container');
          select = $('select[name=filter]', section);
          select.value = type;
          Settings.selectFilter.call(select);
          ta = $('textarea', section);
          tl = ta.textLength;
          ta.setSelectionRange(tl, tl);
          return ta.focus();
        });
      }
    }
  };

  ThreadHiding = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Thread Hiding'] && !Conf['Thread Hiding Link']) {
        return;
      }
      this.db = new DataBoard('hiddenThreads');
      this.syncCatalog();
      return Thread.prototype.callbacks.push({
        name: 'Thread Hiding',
        cb: this.node
      });
    },
    node: function() {
      var data;

      if (data = ThreadHiding.db.get({
        boardID: this.board.ID,
        threadID: this.ID
      })) {
        ThreadHiding.hide(this, data.makeStub);
      }
      if (!Conf['Thread Hiding']) {
        return;
      }
      return $.prepend(this.OP.nodes.root, ThreadHiding.makeButton(this, 'hide'));
    },
    syncCatalog: function() {
      var e, hiddenThreads, hiddenThreadsOnCatalog, threadID;

      hiddenThreads = ThreadHiding.db.get({
        boardID: g.BOARD.ID,
        defaultValue: {}
      });
      try {
        hiddenThreadsOnCatalog = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      } catch (_error) {
        e = _error;
        localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify({}));
        return ThreadHiding.syncCatalog();
      }
      for (threadID in hiddenThreadsOnCatalog) {
        if (!(threadID in hiddenThreads)) {
          hiddenThreads[threadID] = {};
        }
      }
      for (threadID in hiddenThreads) {
        if (!(threadID in hiddenThreadsOnCatalog)) {
          delete hiddenThreads[threadID];
        }
      }
      if ((ThreadHiding.db.data.lastChecked || 0) > Date.now() - $.MINUTE) {
        ThreadHiding.cleanCatalog(hiddenThreadsOnCatalog);
      }
      return ThreadHiding.db.set({
        boardID: g.BOARD.ID,
        val: hiddenThreads
      });
    },
    cleanCatalog: function(hiddenThreadsOnCatalog) {
      return $.cache("//api.4chan.org/" + g.BOARD + "/threads.json", function() {
        var page, thread, threads, _i, _j, _len, _len1, _ref, _ref1;

        if (this.status !== 200) {
          return;
        }
        threads = {};
        _ref = JSON.parse(this.response);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          page = _ref[_i];
          _ref1 = page.threads;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            thread = _ref1[_j];
            if (thread.no in hiddenThreadsOnCatalog) {
              threads[thread.no] = hiddenThreadsOnCatalog[thread.no];
            }
          }
        }
        if (Object.keys(threads).length) {
          return localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify(threads));
        } else {
          return localStorage.removeItem("4chan-hide-t-" + g.BOARD);
        }
      });
    },
    menu: {
      init: function() {
        var apply, div, makeStub;

        if (g.VIEW !== 'index' || !Conf['Menu'] || !Conf['Thread Hiding Link']) {
          return;
        }
        div = $.el('div', {
          className: 'hide-thread-link',
          textContent: 'Hide thread'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', ThreadHiding.menu.hide);
        makeStub = $.el('label', {
          innerHTML: "<input type=checkbox checked=" + Conf['Stubs'] + "> Make stub"
        });
        return $.event('AddMenuEntry', {
          type: 'post',
          el: div,
          order: 20,
          open: function(_arg) {
            var isReply, thread;

            thread = _arg.thread, isReply = _arg.isReply;
            if (isReply || thread.isHidden) {
              return false;
            }
            ThreadHiding.menu.thread = thread;
            return true;
          },
          subEntries: [
            {
              el: apply
            }, {
              el: makeStub
            }
          ]
        });
      },
      hide: function() {
        var makeStub, thread;

        makeStub = $('input', this.parentNode).checked;
        thread = ThreadHiding.menu.thread;
        ThreadHiding.hide(thread, makeStub);
        ThreadHiding.saveHiddenState(thread, makeStub);
        return $.event('CloseMenu');
      }
    },
    makeButton: function(thread, type) {
      var a;

      a = $.el('a', {
        className: "" + type + "-thread-button",
        innerHTML: "<span>[&nbsp;" + (type === 'hide' ? '-' : '+') + "&nbsp;]</span>",
        href: 'javascript:;'
      });
      a.setAttribute('data-fullid', thread.fullID);
      $.on(a, 'click', ThreadHiding.toggle);
      return a;
    },
    saveHiddenState: function(thread, makeStub) {
      var hiddenThreadsOnCatalog;

      hiddenThreadsOnCatalog = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      if (thread.isHidden) {
        ThreadHiding.db.set({
          boardID: thread.board.ID,
          threadID: thread.ID,
          val: {
            makeStub: makeStub
          }
        });
        hiddenThreadsOnCatalog[thread] = true;
      } else {
        ThreadHiding.db["delete"]({
          boardID: thread.board.ID,
          threadID: thread.ID
        });
        delete hiddenThreadsOnCatalog[thread];
      }
      return localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify(hiddenThreadsOnCatalog));
    },
    toggle: function(thread) {
      if (!(thread instanceof Thread)) {
        thread = g.threads[this.dataset.fullid];
      }
      if (thread.isHidden) {
        ThreadHiding.show(thread);
      } else {
        ThreadHiding.hide(thread);
      }
      return ThreadHiding.saveHiddenState(thread);
    },
    hide: function(thread, makeStub) {
      var OP, a, numReplies, opInfo, span, threadRoot;

      if (makeStub == null) {
        makeStub = Conf['Stubs'];
      }
      if (thread.hidden) {
        return;
      }
      OP = thread.OP;
      threadRoot = OP.nodes.root.parentNode;
      threadRoot.hidden = thread.isHidden = true;
      if (!makeStub) {
        threadRoot.nextElementSibling.hidden = true;
        return;
      }
      numReplies = 0;
      if (span = $('.summary', threadRoot)) {
        numReplies = +span.textContent.match(/\d+/);
      }
      numReplies += $$('.opContainer ~ .replyContainer', threadRoot).length;
      numReplies = numReplies === 1 ? '1 reply' : "" + numReplies + " replies";
      opInfo = Conf['Anonymize'] ? 'Anonymous' : $('.nameBlock', OP.nodes.info).textContent;
      a = ThreadHiding.makeButton(thread, 'show');
      $.add(a, $.tn(" " + opInfo + " (" + numReplies + ")"));
      thread.stub = $.el('div', {
        className: 'stub'
      });
      $.add(thread.stub, a);
      if (Conf['Menu']) {
        $.add(thread.stub, [$.tn(' '), Menu.makeButton(OP)]);
      }
      return $.before(threadRoot, thread.stub);
    },
    show: function(thread) {
      var threadRoot;

      if (thread.stub) {
        $.rm(thread.stub);
        delete thread.stub;
      }
      threadRoot = thread.OP.nodes.root.parentNode;
      return threadRoot.nextElementSibling.hidden = threadRoot.hidden = thread.isHidden = false;
    }
  };

  PostHiding = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reply Hiding'] && !Conf['Reply Hiding Link']) {
        return;
      }
      this.db = new DataBoard('hiddenPosts');
      return Post.prototype.callbacks.push({
        name: 'Reply Hiding',
        cb: this.node
      });
    },
    node: function() {
      var data;

      if (!this.isReply || this.isClone) {
        return;
      }
      if (data = PostHiding.db.get({
        boardID: this.board.ID,
        threadID: this.thread.ID,
        postID: this.ID
      })) {
        if (data.thisPost) {
          PostHiding.hide(this, data.makeStub, data.hideRecursively);
        } else {
          Recursive.apply(PostHiding.hide, this, data.makeStub, true);
          Recursive.add(PostHiding.hide, this, data.makeStub, true);
        }
      }
      if (!Conf['Reply Hiding']) {
        return;
      }
      return $.replace($('.sideArrows', this.nodes.root), PostHiding.makeButton(this, 'hide'));
    },
    menu: {
      init: function() {
        var apply, div, makeStub, replies, thisPost;

        if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Reply Hiding Link']) {
          return;
        }
        div = $.el('div', {
          className: 'hide-reply-link',
          textContent: 'Hide reply'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', PostHiding.menu.hide);
        thisPost = $.el('label', {
          innerHTML: '<input type=checkbox name=thisPost checked> This post'
        });
        replies = $.el('label', {
          innerHTML: "<input type=checkbox name=replies  checked=" + Conf['Recursive Hiding'] + "> Hide replies"
        });
        makeStub = $.el('label', {
          innerHTML: "<input type=checkbox name=makeStub checked=" + Conf['Stubs'] + "> Make stub"
        });
        $.event('AddMenuEntry', {
          type: 'post',
          el: div,
          order: 20,
          open: function(post) {
            if (!post.isReply || post.isClone || post.isHidden) {
              return false;
            }
            PostHiding.menu.post = post;
            return true;
          },
          subEntries: [
            {
              el: apply
            }, {
              el: thisPost
            }, {
              el: replies
            }, {
              el: makeStub
            }
          ]
        });
        div = $.el('div', {
          className: 'show-reply-link',
          textContent: 'Show reply'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', PostHiding.menu.show);
        thisPost = $.el('label', {
          innerHTML: '<input type=checkbox name=thisPost> This post'
        });
        replies = $.el('label', {
          innerHTML: "<input type=checkbox name=replies> Show replies"
        });
        return $.event('AddMenuEntry', {
          type: 'post',
          el: div,
          order: 20,
          open: function(post) {
            var data;

            if (!post.isReply || post.isClone || !post.isHidden) {
              return false;
            }
            if (!(data = PostHiding.db.get({
              boardID: post.board.ID,
              threadID: post.thread.ID,
              postID: post.ID
            }))) {
              return false;
            }
            PostHiding.menu.post = post;
            thisPost.firstChild.checked = post.isHidden;
            replies.firstChild.checked = (data != null ? data.hideRecursively : void 0) != null ? data.hideRecursively : Conf['Recursive Hiding'];
            return true;
          },
          subEntries: [
            {
              el: apply
            }, {
              el: thisPost
            }, {
              el: replies
            }
          ]
        });
      },
      hide: function() {
        var makeStub, parent, post, replies, thisPost;

        parent = this.parentNode;
        thisPost = $('input[name=thisPost]', parent).checked;
        replies = $('input[name=replies]', parent).checked;
        makeStub = $('input[name=makeStub]', parent).checked;
        post = PostHiding.menu.post;
        if (thisPost) {
          PostHiding.hide(post, makeStub, replies);
        } else if (replies) {
          Recursive.apply(PostHiding.hide, post, makeStub, true);
          Recursive.add(PostHiding.hide, post, makeStub, true);
        } else {
          return;
        }
        PostHiding.saveHiddenState(post, true, thisPost, makeStub, replies);
        return $.event('CloseMenu');
      },
      show: function() {
        var data, parent, post, replies, thisPost;

        parent = this.parentNode;
        thisPost = $('input[name=thisPost]', parent).checked;
        replies = $('input[name=replies]', parent).checked;
        post = PostHiding.menu.post;
        if (thisPost) {
          PostHiding.show(post, replies);
        } else if (replies) {
          Recursive.apply(PostHiding.show, post, true);
          Recursive.rm(PostHiding.hide, post, true);
        } else {
          return;
        }
        if (data = PostHiding.db.get({
          boardID: post.board.ID,
          threadID: post.thread.ID,
          postID: post.ID
        })) {
          PostHiding.saveHiddenState(post, !(thisPost && replies), !thisPost, data.makeStub, !replies);
        }
        return $.event('CloseMenu');
      }
    },
    makeButton: function(post, type) {
      var a;

      a = $.el('a', {
        className: "" + type + "-reply-button",
        innerHTML: "<span>[&nbsp;" + (type === 'hide' ? '-' : '+') + "&nbsp;]</span>",
        href: 'javascript:;'
      });
      $.on(a, 'click', PostHiding.toggle);
      return a;
    },
    saveHiddenState: function(post, isHiding, thisPost, makeStub, hideRecursively) {
      var data;

      data = {
        boardID: post.board.ID,
        threadID: post.thread.ID,
        postID: post.ID
      };
      if (isHiding) {
        data.val = {
          thisPost: thisPost !== false,
          makeStub: makeStub,
          hideRecursively: hideRecursively
        };
        return PostHiding.db.set(data);
      } else {
        return PostHiding.db["delete"](data);
      }
    },
    toggle: function() {
      var post;

      post = Get.postFromNode(this);
      if (post.isHidden) {
        PostHiding.show(post);
      } else {
        PostHiding.hide(post);
      }
      return PostHiding.saveHiddenState(post, post.isHidden);
    },
    hide: function(post, makeStub, hideRecursively) {
      var a, postInfo, quotelink, _i, _len, _ref;

      if (makeStub == null) {
        makeStub = Conf['Stubs'];
      }
      if (hideRecursively == null) {
        hideRecursively = Conf['Recursive Hiding'];
      }
      if (post.isHidden) {
        return;
      }
      post.isHidden = true;
      if (hideRecursively) {
        Recursive.apply(PostHiding.hide, post, makeStub, true);
        Recursive.add(PostHiding.hide, post, makeStub, true);
      }
      _ref = Get.allQuotelinksLinkingTo(post);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        $.addClass(quotelink, 'filtered');
      }
      if (!makeStub) {
        post.nodes.root.hidden = true;
        return;
      }
      a = PostHiding.makeButton(post, 'show');
      postInfo = Conf['Anonymize'] ? 'Anonymous' : $('.nameBlock', post.nodes.info).textContent;
      $.add(a, $.tn(" " + postInfo));
      post.nodes.stub = $.el('div', {
        className: 'stub'
      });
      $.add(post.nodes.stub, a);
      if (Conf['Menu']) {
        $.add(post.nodes.stub, [$.tn(' '), Menu.makeButton(post)]);
      }
      return $.prepend(post.nodes.root, post.nodes.stub);
    },
    show: function(post, showRecursively) {
      var quotelink, _i, _len, _ref;

      if (showRecursively == null) {
        showRecursively = Conf['Recursive Hiding'];
      }
      if (post.nodes.stub) {
        $.rm(post.nodes.stub);
        delete post.nodes.stub;
      } else {
        post.nodes.root.hidden = false;
      }
      post.isHidden = false;
      if (showRecursively) {
        Recursive.apply(PostHiding.show, post, true);
        Recursive.rm(PostHiding.hide, post);
      }
      _ref = Get.allQuotelinksLinkingTo(post);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        $.rmClass(quotelink, 'filtered');
      }
    }
  };

  Recursive = {
    recursives: {},
    init: function() {
      if (g.VIEW === 'catalog') {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Recursive',
        cb: this.node
      });
    },
    node: function() {
      var i, obj, quote, recursive, _i, _j, _len, _len1, _ref, _ref1;

      if (this.isClone) {
        return;
      }
      _ref = this.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (obj = Recursive.recursives[quote]) {
          _ref1 = obj.recursives;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            recursive = _ref1[i];
            recursive.apply(null, [this].concat(__slice.call(obj.args[i])));
          }
        }
      }
    },
    add: function() {
      var args, obj, post, recursive, _base, _name;

      recursive = arguments[0], post = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      obj = (_base = Recursive.recursives)[_name = post.fullID] || (_base[_name] = {
        recursives: [],
        args: []
      });
      obj.recursives.push(recursive);
      return obj.args.push(args);
    },
    rm: function(recursive, post) {
      var i, obj, rec, _i, _len, _ref;

      if (!(obj = Recursive.recursives[post.fullID])) {
        return;
      }
      _ref = obj.recursives;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        rec = _ref[i];
        if (rec === recursive) {
          obj.recursives.splice(i, 1);
          obj.args.splice(i, 1);
        }
      }
    },
    apply: function() {
      var ID, args, fullID, post, recursive, _ref;

      recursive = arguments[0], post = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      fullID = post.fullID;
      _ref = g.posts;
      for (ID in _ref) {
        post = _ref[ID];
        if (__indexOf.call(post.quotes, fullID) >= 0) {
          recursive.apply(null, [post].concat(__slice.call(args)));
        }
      }
    }
  };

  QuoteStrikeThrough = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reply Hiding'] && !Conf['Reply Hiding Link'] && !Conf['Filter']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Strike-through Quotes',
        cb: this.node
      });
    },
    node: function() {
      var boardID, postID, quotelink, _i, _len, _ref, _ref1, _ref2;

      if (this.isClone) {
        return;
      }
      _ref = this.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        _ref1 = Get.postDataFromLink(quotelink), boardID = _ref1.boardID, postID = _ref1.postID;
        if ((_ref2 = g.posts["" + boardID + "." + postID]) != null ? _ref2.isHidden : void 0) {
          $.addClass(quotelink, 'filtered');
        }
      }
    }
  };

  Menu = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Menu']) {
        return;
      }
      this.menu = new UI.Menu('post');
      return Post.prototype.callbacks.push({
        name: 'Menu',
        cb: this.node
      });
    },
    node: function() {
      var button;

      button = Menu.makeButton(this);
      if (this.isClone) {
        $.replace($('.menu-button', this.nodes.info), button);
        return;
      }
      return $.add(this.nodes.info, [$.tn('\u00A0'), button]);
    },
    makeButton: (function() {
      var a;

      a = null;
      return function(post) {
        var clone;

        a || (a = $.el('a', {
          className: 'menu-button',
          innerHTML: '[<i></i>]',
          href: 'javascript:;'
        }));
        clone = a.cloneNode(true);
        clone.setAttribute('data-postid', post.fullID);
        if (post.isClone) {
          clone.setAttribute('data-clone', true);
        }
        $.on(clone, 'click', Menu.toggle);
        return clone;
      };
    })(),
    toggle: function(e) {
      var post;

      post = this.dataset.clone ? Get.postFromNode(this) : g.posts[this.dataset.postid];
      return Menu.menu.toggle(e, this, post);
    }
  };

  ReportLink = {
    init: function() {
      var a;

      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Report Link']) {
        return;
      }
      a = $.el('a', {
        className: 'report-link',
        href: 'javascript:;',
        textContent: 'Report this post'
      });
      $.on(a, 'click', ReportLink.report);
      return $.event('AddMenuEntry', {
        type: 'post',
        el: a,
        order: 10,
        open: function(post) {
          ReportLink.post = post;
          return !post.isDead;
        }
      });
    },
    report: function() {
      var id, post, set, url;

      post = ReportLink.post;
      url = "//sys.4chan.org/" + post.board + "/imgboard.php?mode=report&no=" + post;
      id = Date.now();
      set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200";
      return window.open(url, id, set);
    }
  };

  DeleteLink = {
    init: function() {
      var div, fileEl, fileEntry, postEl, postEntry;

      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Delete Link'] || !Conf['Quick Reply']) {
        return;
      }
      div = $.el('div', {
        className: 'delete-link',
        textContent: 'Delete'
      });
      postEl = $.el('a', {
        className: 'delete-post',
        href: 'javascript:;'
      });
      fileEl = $.el('a', {
        className: 'delete-file',
        href: 'javascript:;'
      });
      postEntry = {
        el: postEl,
        open: function() {
          postEl.textContent = 'Post';
          $.on(postEl, 'click', DeleteLink["delete"]);
          return true;
        }
      };
      fileEntry = {
        el: fileEl,
        open: function(_arg) {
          var file;

          file = _arg.file;
          if (!file || file.isDead) {
            return false;
          }
          fileEl.textContent = 'File';
          $.on(fileEl, 'click', DeleteLink["delete"]);
          return true;
        }
      };
      return $.event('AddMenuEntry', {
        type: 'post',
        el: div,
        order: 40,
        open: function(post) {
          var node;

          if (post.isDead) {
            return false;
          }
          DeleteLink.post = post;
          node = div.firstChild;
          node.textContent = 'Delete';
          DeleteLink.cooldown.start(post, node);
          return true;
        },
        subEntries: [postEntry, fileEntry]
      });
    },
    "delete": function() {
      var form, link, m, post, pwd;

      post = DeleteLink.post;
      if (DeleteLink.cooldown.counting === post) {
        return;
      }
      $.off(this, 'click', DeleteLink["delete"]);
      this.textContent = "Deleting " + this.textContent + "...";
      pwd = (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $.id('delPassword').value;
      form = {
        mode: 'usrdel',
        onlyimgdel: $.hasClass(this, 'delete-file'),
        pwd: pwd
      };
      form[post.ID] = 'delete';
      link = this;
      return $.ajax($.id('delform').action.replace("/" + g.BOARD + "/", "/" + post.board + "/"), {
        onload: function() {
          return DeleteLink.load(link, post, this.response);
        },
        onerror: function() {
          return DeleteLink.error(link);
        }
      }, {
        cred: true,
        form: $.formData(form)
      });
    },
    load: function(link, post, html) {
      var msg, s, tmpDoc;

      tmpDoc = d.implementation.createHTMLDocument('');
      tmpDoc.documentElement.innerHTML = html;
      if (tmpDoc.title === '4chan - Banned') {
        s = 'Banned!';
      } else if (msg = tmpDoc.getElementById('errmsg')) {
        s = msg.textContent;
        $.on(link, 'click', DeleteLink["delete"]);
      } else {
        if (tmpDoc.title === 'Updating index...') {
          (post.origin || post).kill();
        }
        s = 'Deleted';
      }
      return link.textContent = s;
    },
    error: function(link) {
      link.textContent = 'Connection error, please retry.';
      return $.on(link, 'click', DeleteLink["delete"]);
    },
    cooldown: {
      start: function(post, node) {
        var length, seconds, _ref;

        if (!((_ref = QR.db) != null ? _ref.get({
          boardID: post.board.ID,
          threadID: post.thread.ID,
          postID: post.ID
        }) : void 0)) {
          delete DeleteLink.cooldown.counting;
          return;
        }
        DeleteLink.cooldown.counting = post;
        length = post.board.ID === 'q' ? 600 : 30;
        seconds = Math.ceil((length * $.SECOND - (Date.now() - post.info.date)) / $.SECOND);
        return DeleteLink.cooldown.count(post, seconds, length, node);
      },
      count: function(post, seconds, length, node) {
        if (DeleteLink.cooldown.counting !== post) {
          return;
        }
        if (!((0 <= seconds && seconds <= length))) {
          if (DeleteLink.cooldown.counting === post) {
            delete DeleteLink.cooldown.counting;
          }
          return;
        }
        setTimeout(DeleteLink.cooldown.count, 1000, post, seconds - 1, length, node);
        if (seconds === 0) {
          node.textContent = 'Delete';
          return;
        }
        return node.textContent = "Delete (" + seconds + ")";
      }
    }
  };

  DownloadLink = {
    init: function() {
      var a;

      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Download Link']) {
        return;
      }
      if ($.engine === 'gecko' || $.el('a').download === void 0) {
        return;
      }
      a = $.el('a', {
        className: 'download-link',
        textContent: 'Download file'
      });
      return $.event('AddMenuEntry', {
        type: 'post',
        el: a,
        order: 70,
        open: function(_arg) {
          var file;

          file = _arg.file;
          if (!file) {
            return false;
          }
          a.href = file.URL;
          a.download = file.name;
          return true;
        }
      });
    }
  };

  ArchiveLink = {
    init: function() {
      var div, entry, type, _i, _len, _ref;

      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Archive Link']) {
        return;
      }
      div = $.el('div', {
        textContent: 'Archive'
      });
      entry = {
        type: 'post',
        el: div,
        order: 90,
        open: function(_arg) {
          var ID, board, redirect, thread;

          ID = _arg.ID, thread = _arg.thread, board = _arg.board;
          redirect = Redirect.to({
            postID: ID,
            threadID: thread.ID,
            boardID: board.ID
          });
          return redirect !== ("//boards.4chan.org/" + board + "/");
        },
        subEntries: []
      };
      _ref = [['Post', 'post'], ['Name', 'name'], ['Tripcode', 'tripcode'], ['E-mail', 'email'], ['Subject', 'subject'], ['Filename', 'filename'], ['Image MD5', 'MD5']];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        entry.subEntries.push(this.createSubEntry(type[0], type[1]));
      }
      return $.event('AddMenuEntry', entry);
    },
    createSubEntry: function(text, type) {
      var el, open;

      el = $.el('a', {
        textContent: text,
        target: '_blank'
      });
      open = type === 'post' ? function(_arg) {
        var ID, board, thread;

        ID = _arg.ID, thread = _arg.thread, board = _arg.board;
        el.href = Redirect.to({
          postID: ID,
          threadID: thread.ID,
          boardID: board.ID
        });
        return true;
      } : function(post) {
        var value;

        value = Filter[type](post);
        if (!value) {
          return false;
        }
        el.href = Redirect.to({
          boardID: post.board.ID,
          type: type,
          value: value,
          isSearch: true
        });
        return true;
      };
      return {
        el: el,
        open: open
      };
    }
  };

  Keybinds = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Keybinds']) {
        return;
      }
      return $.on(d, '4chanXInitFinished', function() {
        var node, _i, _len, _ref;

        $.on(d, 'keydown', Keybinds.keydown);
        _ref = $$('[accesskey]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          node.removeAttribute('accesskey');
        }
      });
    },
    keydown: function(e) {
      var form, key, notification, notifications, op, target, thread, threadRoot, _i, _len, _ref;

      if (!(key = Keybinds.keyCode(e))) {
        return;
      }
      target = e.target;
      if ((_ref = target.nodeName) === 'INPUT' || _ref === 'TEXTAREA') {
        if (!/(Esc|Alt|Ctrl|Meta)/.test(key)) {
          return;
        }
      }
      threadRoot = Nav.getThread();
      if (op = $('.op', threadRoot)) {
        thread = Get.postFromNode(op).thread;
      }
      switch (key) {
        case Conf['Toggle board list']:
          if (Conf['Custom Board Navigation']) {
            Header.toggleBoardList();
          }
          break;
        case Conf['Open empty QR']:
          Keybinds.qr(threadRoot);
          break;
        case Conf['Open QR']:
          Keybinds.qr(threadRoot, true);
          break;
        case Conf['Open settings']:
          Settings.open();
          break;
        case Conf['Close']:
          if ($.id('fourchanx-settings')) {
            Settings.close();
          } else if ((notifications = $$('.notification')).length) {
            for (_i = 0, _len = notifications.length; _i < _len; _i++) {
              notification = notifications[_i];
              $('.close', notification).click();
            }
          } else if (QR.nodes) {
            QR.close();
          }
          break;
        case Conf['Spoiler tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('spoiler', target);
          break;
        case Conf['Code tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('code', target);
          break;
        case Conf['Eqn tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('eqn', target);
          break;
        case Conf['Math tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('math', target);
          break;
        case Conf['Submit QR']:
          if (QR.nodes && !QR.status()) {
            QR.submit();
          }
          break;
        case Conf['Watch']:
          ThreadWatcher.toggle(thread);
          break;
        case Conf['Update']:
          ThreadUpdater.update();
          break;
        case Conf['Expand image']:
          Keybinds.img(threadRoot);
          break;
        case Conf['Expand images']:
          Keybinds.img(threadRoot, true);
          break;
        case Conf['Front page']:
          window.location = "/" + g.BOARD + "/0#delform";
          break;
        case Conf['Open front page']:
          $.open("/" + g.BOARD + "/#delform");
          break;
        case Conf['Next page']:
          if (form = $('.next form')) {
            window.location = form.action;
          }
          break;
        case Conf['Previous page']:
          if (form = $('.prev form')) {
            window.location = form.action;
          }
          break;
        case Conf['Next thread']:
          if (g.VIEW === 'thread') {
            return;
          }
          Nav.scroll(+1);
          break;
        case Conf['Previous thread']:
          if (g.VIEW === 'thread') {
            return;
          }
          Nav.scroll(-1);
          break;
        case Conf['Expand thread']:
          ExpandThread.toggle(thread);
          break;
        case Conf['Open thread']:
          Keybinds.open(thread);
          break;
        case Conf['Open thread tab']:
          Keybinds.open(thread, true);
          break;
        case Conf['Next reply']:
          Keybinds.hl(+1, threadRoot);
          break;
        case Conf['Previous reply']:
          Keybinds.hl(-1, threadRoot);
          break;
        case Conf['Hide']:
          if (g.VIEW === 'index') {
            ThreadHiding.toggle(thread);
          }
          break;
        default:
          return;
      }
      e.preventDefault();
      return e.stopPropagation();
    },
    keyCode: function(e) {
      var kc, key;

      key = (function() {
        switch (kc = e.keyCode) {
          case 8:
            return '';
          case 13:
            return 'Enter';
          case 27:
            return 'Esc';
          case 37:
            return 'Left';
          case 38:
            return 'Up';
          case 39:
            return 'Right';
          case 40:
            return 'Down';
          default:
            if ((48 <= kc && kc <= 57) || (65 <= kc && kc <= 90)) {
              return String.fromCharCode(kc).toLowerCase();
            } else {
              return null;
            }
        }
      })();
      if (key) {
        if (e.altKey) {
          key = 'Alt+' + key;
        }
        if (e.ctrlKey) {
          key = 'Ctrl+' + key;
        }
        if (e.metaKey) {
          key = 'Meta+' + key;
        }
        if (e.shiftKey) {
          key = 'Shift+' + key;
        }
      }
      return key;
    },
    qr: function(thread, quote) {
      if (!(Conf['Quick Reply'] && QR.postingIsEnabled)) {
        return;
      }
      QR.open();
      if (quote) {
        QR.quote.call($('input', $('.post.highlight', thread) || thread));
      }
      return QR.nodes.com.focus();
    },
    tags: function(tag, ta) {
      var range, selEnd, selStart, value;

      value = ta.value;
      selStart = ta.selectionStart;
      selEnd = ta.selectionEnd;
      ta.value = value.slice(0, selStart) + ("[" + tag + "]") + value.slice(selStart, selEnd) + ("[/" + tag + "]") + value.slice(selEnd);
      range = ("[" + tag + "]").length + selEnd;
      ta.setSelectionRange(range, range);
      return $.event('input', null, ta);
    },
    img: function(thread, all) {
      var post;

      if (all) {
        return ImageExpand.cb.toggleAll();
      } else {
        post = Get.postFromNode($('.post.highlight', thread) || $('.op', thread));
        return ImageExpand.toggle(post);
      }
    },
    open: function(thread, tab) {
      var url;

      if (g.VIEW !== 'index') {
        return;
      }
      url = "/" + thread.board + "/res/" + thread;
      if (tab) {
        return $.open(url);
      } else {
        return location.href = url;
      }
    },
    hl: function(delta, thread) {
      var headRect, next, postEl, rect, replies, reply, root, topMargin, _i, _len;

      if (Conf['Bottom header']) {
        topMargin = 0;
      } else {
        headRect = Header.toggle.getBoundingClientRect();
        topMargin = headRect.top + headRect.height;
      }
      if (postEl = $('.reply.highlight', thread)) {
        $.rmClass(postEl, 'highlight');
        rect = postEl.getBoundingClientRect();
        if (rect.bottom >= topMargin && rect.top <= doc.clientHeight) {
          root = postEl.parentNode;
          next = $.x('child::div[contains(@class,"post reply")]', delta === +1 ? root.nextElementSibling : root.previousElementSibling);
          if (!next) {
            this.focus(postEl);
            return;
          }
          if (!(g.VIEW === 'thread' || $.x('ancestor::div[parent::div[@class="board"]]', next) === thread)) {
            return;
          }
          rect = next.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > doc.clientHeight) {
            if (delta === -1) {
              window.scrollBy(0, rect.top - topMargin);
            } else {
              next.scrollIntoView(false);
            }
          }
          this.focus(next);
          return;
        }
      }
      replies = $$('.reply', thread);
      if (delta === -1) {
        replies.reverse();
      }
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        rect = reply.getBoundingClientRect();
        if (delta === +1 && rect.top >= topMargin || delta === -1 && rect.bottom <= doc.clientHeight) {
          this.focus(reply);
          return;
        }
      }
    },
    focus: function(post) {
      return $.addClass(post, 'highlight');
    }
  };

  Nav = {
    init: function() {
      var next, prev, span;

      if (g.VIEW === 'index' && !Conf['Index Navigation'] || g.VIEW === 'thread' && !Conf['Reply Navigation']) {
        return;
      }
      span = $.el('span', {
        id: 'navlinks'
      });
      prev = $.el('a', {
        textContent: '▲',
        href: 'javascript:;'
      });
      next = $.el('a', {
        textContent: '▼',
        href: 'javascript:;'
      });
      $.on(prev, 'click', this.prev);
      $.on(next, 'click', this.next);
      $.add(span, [prev, $.tn(' '), next]);
      return $.on(d, '4chanXInitFinished', function() {
        return $.add(d.body, span);
      });
    },
    prev: function() {
      if (g.VIEW === 'thread') {
        return window.scrollTo(0, 0);
      } else {
        return Nav.scroll(-1);
      }
    },
    next: function() {
      if (g.VIEW === 'thread') {
        return window.scrollTo(0, d.body.scrollHeight);
      } else {
        return Nav.scroll(+1);
      }
    },
    getThread: function(full) {
      var headRect, i, rect, thread, threads, topMargin, _i, _len;

      if (Conf['Bottom header']) {
        topMargin = 0;
      } else {
        headRect = Header.toggle.getBoundingClientRect();
        topMargin = headRect.top + headRect.height;
      }
      threads = $$('.thread:not([hidden])');
      for (i = _i = 0, _len = threads.length; _i < _len; i = ++_i) {
        thread = threads[i];
        rect = thread.getBoundingClientRect();
        if (rect.bottom > topMargin) {
          if (full) {
            return [threads, thread, i, rect, topMargin];
          } else {
            return thread;
          }
        }
      }
      return $('.board');
    },
    scroll: function(delta) {
      var i, rect, thread, threads, top, topMargin, _ref, _ref1;

      _ref = Nav.getThread(true), threads = _ref[0], thread = _ref[1], i = _ref[2], rect = _ref[3], topMargin = _ref[4];
      top = rect.top - topMargin;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      top = ((_ref1 = threads[i]) != null ? _ref1.getBoundingClientRect().top : void 0) - topMargin;
      return window.scrollBy(0, top);
    }
  };

  Redirect = {
    image: function(boardID, filename) {
      switch (boardID) {
        case 'a':
        case 'gd':
        case 'jp':
        case 'm':
        case 'q':
        case 'tg':
        case 'vg':
        case 'vp':
        case 'vr':
        case 'wsg':
          return "//archive.foolz.us/" + boardID + "/full_image/" + filename;
        case 'u':
          return "//nsfw.foolz.us/" + boardID + "/full_image/" + filename;
        case 'po':
          return "//archive.thedarkcave.org/" + boardID + "/full_image/" + filename;
        case 'ck':
        case 'fa':
        case 'lit':
        case 's4s':
          return "//fuuka.warosu.org/" + boardID + "/full_image/" + filename;
        case 'cgl':
        case 'g':
        case 'mu':
        case 'w':
          return "//rbt.asia/" + boardID + "/full_image/" + filename;
        case 'an':
        case 'k':
        case 'toy':
        case 'x':
          return "http://archive.heinessen.com/" + boardID + "/full_image/" + filename;
        case 'c':
          return "//archive.nyafuu.org/" + boardID + "/full_image/" + filename;
      }
    },
    post: function(boardID, postID) {
      switch (boardID) {
        case 'a':
        case 'co':
        case 'gd':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'vp':
        case 'vr':
        case 'wsg':
          return "//archive.foolz.us/_/api/chan/post/?board=" + boardID + "&num=" + postID;
        case 'u':
          return "//nsfw.foolz.us/_/api/chan/post/?board=" + boardID + "&num=" + postID;
        case 'c':
        case 'int':
        case 'out':
        case 'po':
          return "//archive.thedarkcave.org/_/api/chan/post/?board=" + boardID + "&num=" + postID;
      }
    },
    to: function(data) {
      var boardID;

      boardID = data.boardID;
      switch (boardID) {
        case 'a':
        case 'co':
        case 'gd':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'vp':
        case 'vr':
        case 'wsg':
          return Redirect.path('//archive.foolz.us', 'foolfuuka', data);
        case 'u':
          return Redirect.path('//nsfw.foolz.us', 'foolfuuka', data);
        case 'int':
        case 'out':
        case 'po':
          return Redirect.path('//archive.thedarkcave.org', 'foolfuuka', data);
        case 'ck':
        case 'fa':
        case 'lit':
        case 's4s':
          return Redirect.path('//fuuka.warosu.org', 'fuuka', data);
        case 'diy':
        case 'sci':
          return Redirect.path('//archive.installgentoo.net', 'fuuka', data);
        case 'cgl':
        case 'g':
        case 'mu':
        case 'w':
          return Redirect.path('//rbt.asia', 'fuuka', data);
        case 'an':
        case 'fit':
        case 'k':
        case 'mlp':
        case 'r9k':
        case 'toy':
        case 'x':
          return Redirect.path('http://archive.heinessen.com', 'fuuka', data);
        case 'c':
          return Redirect.path('//archive.nyafuu.org', 'fuuka', data);
        default:
          if (data.threadID) {
            return "//boards.4chan.org/" + boardID + "/";
          } else {
            return '';
          }
      }
    },
    path: function(base, archiver, data) {
      var boardID, path, postID, threadID, type, value;

      if (data.isSearch) {
        boardID = data.boardID, type = data.type, value = data.value;
        type = type === 'name' ? 'username' : type === 'MD5' ? 'image' : type;
        value = encodeURIComponent(value);
        if (archiver === 'foolfuuka') {
          return "" + base + "/" + boardID + "/search/" + type + "/" + value;
        } else if (type === 'image') {
          return "" + base + "/" + boardID + "/?task=search2&search_media_hash=" + value;
        } else {
          return "" + base + "/" + boardID + "/?task=search2&search_" + type + "=" + value;
        }
      }
      boardID = data.boardID, threadID = data.threadID, postID = data.postID;
      path = threadID ? "" + boardID + "/thread/" + threadID : "" + boardID + "/post/" + postID;
      if (archiver === 'foolfuuka') {
        path += '/';
      }
      if (threadID && postID) {
        path += archiver === 'foolfuuka' ? "#" + postID : "#p" + postID;
      }
      return "" + base + "/" + path;
    }
  };

  Build = {
    spoilerRange: {},
    shortFilename: function(filename, isReply) {
      var threshold;

      threshold = isReply ? 30 : 40;
      if (filename.length - 4 > threshold) {
        return "" + filename.slice(0, threshold - 5) + "(...)." + filename.slice(-3);
      } else {
        return filename;
      }
    },
    postFromObject: function(data, boardID) {
      var o;

      o = {
        postID: data.no,
        threadID: data.resto || data.no,
        boardID: boardID,
        name: data.name,
        capcode: data.capcode,
        tripcode: data.trip,
        uniqueID: data.id,
        email: data.email ? encodeURI(data.email.replace(/&quot;/g, '"')) : '',
        subject: data.sub,
        flagCode: data.country,
        flagName: data.country_name,
        date: data.now,
        dateUTC: data.time,
        comment: data.com,
        isSticky: !!data.sticky,
        isClosed: !!data.closed
      };
      if (data.ext || data.filedeleted) {
        o.file = {
          name: data.filename + data.ext,
          timestamp: "" + data.tim + data.ext,
          url: "//images.4chan.org/" + boardID + "/src/" + data.tim + data.ext,
          height: data.h,
          width: data.w,
          MD5: data.md5,
          size: data.fsize,
          turl: "//thumbs.4chan.org/" + boardID + "/thumb/" + data.tim + "s.jpg",
          theight: data.tn_h,
          twidth: data.tn_w,
          isSpoiler: !!data.spoiler,
          isDeleted: !!data.filedeleted
        };
      }
      return Build.post(o);
    },
    post: function(o, isArchived) {
      /*
      This function contains code from 4chan-JS (https://github.com/4chan/4chan-JS).
      @license: https://github.com/4chan/4chan-JS/blob/master/LICENSE
      */

      var a, boardID, capcode, capcodeClass, capcodeStart, closed, comment, container, date, dateUTC, email, emailEnd, emailStart, ext, file, fileDims, fileHTML, fileInfo, fileSize, fileThumb, filename, flag, flagCode, flagName, href, imgSrc, isClosed, isOP, isSticky, name, postID, quote, shortFilename, spoilerRange, staticPath, sticky, subject, threadID, tripcode, uniqueID, userID, _i, _len, _ref;

      postID = o.postID, threadID = o.threadID, boardID = o.boardID, name = o.name, capcode = o.capcode, tripcode = o.tripcode, uniqueID = o.uniqueID, email = o.email, subject = o.subject, flagCode = o.flagCode, flagName = o.flagName, date = o.date, dateUTC = o.dateUTC, isSticky = o.isSticky, isClosed = o.isClosed, comment = o.comment, file = o.file;
      isOP = postID === threadID;
      staticPath = '//static.4chan.org';
      if (email) {
        emailStart = '<a href="mailto:' + email + '" class="useremail">';
        emailEnd = '</a>';
      } else {
        emailStart = '';
        emailEnd = '';
      }
      subject = "<span class=subject>" + (subject || '') + "</span>";
      userID = !capcode && uniqueID ? (" <span class='posteruid id_" + uniqueID + "'>(ID: ") + ("<span class=hand title='Highlight posts by this ID'>" + uniqueID + "</span>)</span> ") : '';
      switch (capcode) {
        case 'admin':
        case 'admin_highlight':
          capcodeClass = " capcodeAdmin";
          capcodeStart = " <strong class='capcode hand id_admin'" + "title='Highlight posts by the Administrator'>## Admin</strong>";
          capcode = (" <img src='" + staticPath + "/image/adminicon.gif' ") + "alt='This user is the 4chan Administrator.' " + "title='This user is the 4chan Administrator.' class=identityIcon>";
          break;
        case 'mod':
          capcodeClass = " capcodeMod";
          capcodeStart = " <strong class='capcode hand id_mod' " + "title='Highlight posts by Moderators'>## Mod</strong>";
          capcode = (" <img src='" + staticPath + "/image/modicon.gif' ") + "alt='This user is a 4chan Moderator.' " + "title='This user is a 4chan Moderator.' class=identityIcon>";
          break;
        case 'developer':
          capcodeClass = " capcodeDeveloper";
          capcodeStart = " <strong class='capcode hand id_developer' " + "title='Highlight posts by Developers'>## Developer</strong>";
          capcode = (" <img src='" + staticPath + "/image/developericon.gif' ") + "alt='This user is a 4chan Developer.' " + "title='This user is a 4chan Developer.' class=identityIcon>";
          break;
        default:
          capcodeClass = '';
          capcodeStart = '';
          capcode = '';
      }
      flag = flagCode ? (" <img src='" + staticPath + "/image/country/" + (boardID === 'pol' ? 'troll/' : '')) + flagCode.toLowerCase() + (".gif' alt=" + flagCode + " title='" + flagName + "' class=countryFlag>") : '';
      if (file != null ? file.isDeleted : void 0) {
        fileHTML = isOP ? ("<div id=f" + postID + " class=file><div class=fileInfo></div><span class=fileThumb>") + ("<img src='" + staticPath + "/image/filedeleted.gif' alt='File deleted.' class='fileDeleted retina'>") + "</span></div>" : ("<div id=f" + postID + " class=file><span class=fileThumb>") + ("<img src='" + staticPath + "/image/filedeleted-res.gif' alt='File deleted.' class='fileDeletedRes retina'>") + "</span></div>";
      } else if (file) {
        ext = file.name.slice(-3);
        if (!file.twidth && !file.theight && ext === 'gif') {
          file.twidth = file.width;
          file.theight = file.height;
        }
        fileSize = $.bytesToString(file.size);
        fileThumb = file.turl;
        if (file.isSpoiler) {
          fileSize = "Spoiler Image, " + fileSize;
          if (!isArchived) {
            fileThumb = '//static.4chan.org/image/spoiler';
            if (spoilerRange = Build.spoilerRange[boardID]) {
              fileThumb += ("-" + boardID) + Math.floor(1 + spoilerRange * Math.random());
            }
            fileThumb += '.png';
            file.twidth = file.theight = 100;
          }
        }
        if (boardID.ID !== 'f') {
          imgSrc = ("<a class='fileThumb" + (file.isSpoiler ? ' imgspoiler' : '') + "' href='" + file.url + "' target=_blank>") + ("<img src='" + fileThumb + "' alt='" + fileSize + "' data-md5=" + file.MD5 + " style='height: " + file.theight + "px; width: " + file.twidth + "px;'></a>");
        }
        a = $.el('a', {
          innerHTML: file.name
        });
        filename = a.textContent.replace(/%22/g, '"');
        a.textContent = Build.shortFilename(filename);
        shortFilename = a.innerHTML;
        a.textContent = filename;
        filename = a.innerHTML.replace(/'/g, '&apos;');
        fileDims = ext === 'pdf' ? 'PDF' : "" + file.width + "x" + file.height;
        fileInfo = ("<span class=fileText id=fT" + postID + (file.isSpoiler ? " title='" + filename + "'" : '') + ">File: <a href='" + file.url + "' target=_blank>" + file.timestamp + "</a>") + ("-(" + fileSize + ", " + fileDims + (file.isSpoiler ? '' : ", <span title='" + filename + "'>" + shortFilename + "</span>")) + ")</span>";
        fileHTML = "<div id=f" + postID + " class=file><div class=fileInfo>" + fileInfo + "</div>" + imgSrc + "</div>";
      } else {
        fileHTML = '';
      }
      tripcode = tripcode ? " <span class=postertrip>" + tripcode + "</span>" : '';
      sticky = isSticky ? ' <img src=//static.4chan.org/image/sticky.gif alt=Sticky title=Sticky class=stickyIcon>' : '';
      closed = isClosed ? ' <img src=//static.4chan.org/image/closed.gif alt=Closed title=Closed class=closedIcon>' : '';
      container = $.el('div', {
        id: "pc" + postID,
        className: "postContainer " + (isOP ? 'op' : 'reply') + "Container",
        innerHTML: (isOP ? '' : "<div class=sideArrows id=sa" + postID + ">&gt;&gt;</div>") + ("<div id=p" + postID + " class='post " + (isOP ? 'op' : 'reply') + (capcode === 'admin_highlight' ? ' highlightPost' : '') + "'>") + ("<div class='postInfoM mobile' id=pim" + postID + ">") + ("<span class='nameBlock" + capcodeClass + "'>") + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + capcode + userID + flag + sticky + closed + ("<br>" + subject) + ("</span><span class='dateTime postNum' data-utc=" + dateUTC + ">" + date) + ("<a href=" + ("/" + boardID + "/res/" + threadID + "#p" + postID) + ">No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREADID === +threadID ? "javascript:quote(" + postID + ")" : "/" + boardID + "/res/" + threadID + "#q" + postID) + "'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? fileHTML : '') + ("<div class='postInfo desktop' id=pi" + postID + ">") + ("<input type=checkbox name=" + postID + " value=delete> ") + ("" + subject + " ") + ("<span class='nameBlock" + capcodeClass + "'>") + emailStart + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + emailEnd + capcode + userID + flag + sticky + closed + ' </span> ' + ("<span class=dateTime data-utc=" + dateUTC + ">" + date + "</span> ") + "<span class='postNum desktop'>" + ("<a href=" + ("/" + boardID + "/res/" + threadID + "#p" + postID) + " title='Highlight this post'>No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREADID === +threadID ? "javascript:quote(" + postID + ")" : "/" + boardID + "/res/" + threadID + "#q" + postID) + "' title='Quote this post'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? '' : fileHTML) + ("<blockquote class=postMessage id=m" + postID + ">" + (comment || '') + "</blockquote> ") + '</div>'
      });
      _ref = $$('.quotelink', container);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "/" + boardID + "/res/" + href;
      }
      return container;
    }
  };

  Get = {
    threadExcerpt: function(thread) {
      var OP, excerpt, _ref;

      OP = thread.OP;
      excerpt = ((_ref = OP.info.subject) != null ? _ref.trim() : void 0) || OP.info.comment.replace(/\n+/g, ' // ') || Conf['Anonymize'] && 'Anonymous' || $('.nameBlock', OP.nodes.info).textContent.trim();
      return "/" + thread.board + "/ - " + excerpt;
    },
    postFromRoot: function(root) {
      var boardID, index, link, post, postID;

      link = $('a[title="Highlight this post"]', root);
      boardID = link.pathname.split('/')[1];
      postID = link.hash.slice(2);
      index = root.dataset.clone;
      post = g.posts["" + boardID + "." + postID];
      if (index) {
        return post.clones[index];
      } else {
        return post;
      }
    },
    postFromNode: function(root) {
      return Get.postFromRoot($.x('ancestor::div[contains(@class,"postContainer")][1]', root));
    },
    contextFromLink: function(quotelink) {
      return Get.postFromRoot($.x('ancestor::div[parent::div[@class="thread"]][1]', quotelink));
    },
    postDataFromLink: function(link) {
      var boardID, path, postID, threadID;

      if (link.hostname === 'boards.4chan.org') {
        path = link.pathname.split('/');
        boardID = path[1];
        threadID = path[3];
        postID = link.hash.slice(2);
      } else {
        boardID = link.dataset.boardid;
        threadID = link.dataset.threadid || 0;
        postID = link.dataset.postid;
      }
      return {
        boardID: boardID,
        threadID: +threadID,
        postID: +postID
      };
    },
    allQuotelinksLinkingTo: function(post) {
      var ID, quote, quotedPost, quotelinks, quoterPost, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4;

      quotelinks = [];
      _ref = g.posts;
      for (ID in _ref) {
        quoterPost = _ref[ID];
        if (_ref1 = post.fullID, __indexOf.call(quoterPost.quotes, _ref1) >= 0) {
          _ref2 = [quoterPost].concat(quoterPost.clones);
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            quoterPost = _ref2[_i];
            quotelinks.push.apply(quotelinks, quoterPost.nodes.quotelinks);
          }
        }
      }
      if (Conf['Quote Backlinks']) {
        _ref3 = post.quotes;
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          quote = _ref3[_j];
          if (!(quotedPost = g.posts[quote])) {
            continue;
          }
          _ref4 = [quotedPost].concat(quotedPost.clones);
          for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
            quotedPost = _ref4[_k];
            quotelinks.push.apply(quotelinks, __slice.call(quotedPost.nodes.backlinks));
          }
        }
      }
      return quotelinks.filter(function(quotelink) {
        var boardID, postID, _ref5;

        _ref5 = Get.postDataFromLink(quotelink), boardID = _ref5.boardID, postID = _ref5.postID;
        return boardID === post.board.ID && postID === post.ID;
      });
    },
    postClone: function(boardID, threadID, postID, root, context) {
      var post, url;

      if (post = g.posts["" + boardID + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      root.textContent = "Loading post No." + postID + "...";
      if (threadID) {
        return $.cache("//api.4chan.org/" + boardID + "/res/" + threadID + ".json", function() {
          return Get.fetchedPost(this, boardID, threadID, postID, root, context);
        });
      } else if (url = Redirect.post(boardID, postID)) {
        return $.cache(url, function() {
          return Get.archivedPost(this, boardID, postID, root, context);
        });
      }
    },
    insert: function(post, root, context) {
      var clone, nodes;

      if (!root.parentNode) {
        return;
      }
      clone = post.addClone(context);
      Main.callbackNodes(Post, [clone]);
      nodes = clone.nodes;
      nodes.root.innerHTML = null;
      $.add(nodes.root, nodes.post);
      root.innerHTML = null;
      return $.add(root, nodes.root);
    },
    fetchedPost: function(req, boardID, threadID, postID, root, context) {
      var board, post, posts, status, thread, url, _i, _len;

      if (post = g.posts["" + boardID + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      status = req.status;
      if (status !== 200 && status !== 304) {
        if (url = Redirect.post(boardID, postID)) {
          $.cache(url, function() {
            return Get.archivedPost(this, boardID, postID, root, context);
          });
        } else {
          $.addClass(root, 'warning');
          root.textContent = status === 404 ? "Thread No." + threadID + " 404'd." : "Error " + req.statusText + " (" + req.status + ").";
        }
        return;
      }
      posts = JSON.parse(req.response).posts;
      Build.spoilerRange[boardID] = posts[0].custom_spoiler;
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        post = posts[_i];
        if (post.no === postID) {
          break;
        }
        if (post.no > postID) {
          if (url = Redirect.post(boardID, postID)) {
            $.cache(url, function() {
              return Get.archivedPost(this, boardID, postID, root, context);
            });
          } else {
            $.addClass(root, 'warning');
            root.textContent = "Post No." + postID + " was not found.";
          }
          return;
        }
      }
      board = g.boards[boardID] || new Board(boardID);
      thread = g.threads["" + boardID + "." + threadID] || new Thread(threadID, board);
      post = new Post(Build.postFromObject(post, boardID), thread, board);
      Main.callbackNodes(Post, [post]);
      return Get.insert(post, root, context);
    },
    archivedPost: function(req, boardID, postID, root, context) {
      var board, bq, comment, data, o, post, thread, threadID, _ref;

      if (post = g.posts["" + boardID + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      data = JSON.parse(req.response);
      if (data.error) {
        $.addClass(root, 'warning');
        root.textContent = data.error;
        return;
      }
      bq = $.el('blockquote', {
        textContent: data.comment
      });
      bq.innerHTML = bq.innerHTML.replace(/\n|\[\/?b\]|\[\/?spoiler\]|\[\/?code\]|\[\/?moot\]|\[\/?banned\]/g, function(text) {
        switch (text) {
          case '\n':
            return '<br>';
          case '[b]':
            return '<b>';
          case '[/b]':
            return '</b>';
          case '[spoiler]':
            return '<span class=spoiler>';
          case '[/spoiler]':
            return '</span>';
          case '[code]':
            return '<pre class=prettyprint>';
          case '[/code]':
            return '</pre>';
          case '[moot]':
            return '<div style="padding:5px;margin-left:.5em;border-color:#faa;border:2px dashed rgba(255,0,0,.1);border-radius:2px">';
          case '[/moot]':
            return '</div>';
          case '[banned]':
            return '<b style="color: red;">';
          case '[/banned]':
            return '</b>';
        }
      });
      comment = bq.innerHTML.replace(/(^|>)(&gt;[^<$]*)(<|$)/g, '$1<span class=quote>$2</span>$3').replace(/((&gt;){2}(&gt;\/[a-z\d]+\/)?\d+)/g, '<span class=deadlink>$1</span>');
      threadID = data.thread_num;
      o = {
        postID: "" + postID,
        threadID: "" + threadID,
        boardID: boardID,
        name: data.name_processed,
        capcode: (function() {
          switch (data.capcode) {
            case 'M':
              return 'mod';
            case 'A':
              return 'admin';
            case 'D':
              return 'developer';
          }
        })(),
        tripcode: data.trip,
        uniqueID: data.poster_hash,
        email: data.email ? encodeURI(data.email) : '',
        subject: data.title_processed,
        flagCode: data.poster_country,
        flagName: data.poster_country_name_processed,
        date: data.fourchan_date,
        dateUTC: data.timestamp,
        comment: comment
      };
      if ((_ref = data.media) != null ? _ref.media_filename : void 0) {
        o.file = {
          name: data.media.media_filename_processed,
          timestamp: data.media.media_orig,
          url: data.media.media_link || data.media.remote_media_link,
          height: data.media.media_h,
          width: data.media.media_w,
          MD5: data.media.media_hash,
          size: data.media.media_size,
          turl: data.media.thumb_link || ("//thumbs.4chan.org/" + boardID + "/thumb/" + data.media.preview_orig),
          theight: data.media.preview_h,
          twidth: data.media.preview_w,
          isSpoiler: data.media.spoiler === '1'
        };
      }
      board = g.boards[boardID] || new Board(boardID);
      thread = g.threads["" + boardID + "." + threadID] || new Thread(threadID, board);
      post = new Post(Build.post(o, true), thread, board, {
        isArchived: true
      });
      Main.callbackNodes(Post, [post]);
      return Get.insert(post, root, context);
    }
  };

  Quotify = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Resurrect Quotes']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Resurrect Quotes',
        cb: this.node
      });
    },
    node: function() {
      var a, boardID, deadlink, m, post, postID, quote, quoteID, redirect, _i, _len, _ref, _ref1;

      if (this.isClone) {
        return;
      }
      _ref = $$('.deadlink', this.nodes.comment);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        deadlink = _ref[_i];
        if (deadlink.parentNode.className === 'prettyprint') {
          $.replace(deadlink, __slice.call(deadlink.childNodes));
          continue;
        }
        quote = deadlink.textContent;
        if (!(postID = (_ref1 = quote.match(/\d+$/)) != null ? _ref1[0] : void 0)) {
          continue;
        }
        boardID = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : this.board.ID;
        quoteID = "" + boardID + "." + postID;
        if (post = g.posts[quoteID]) {
          if (!post.isDead) {
            a = $.el('a', {
              href: "/" + boardID + "/" + post.thread + "/res/#p" + postID,
              className: 'quotelink',
              textContent: quote
            });
          } else {
            a = $.el('a', {
              href: "/" + boardID + "/" + post.thread + "/res/#p" + postID,
              className: 'quotelink deadlink',
              target: '_blank',
              textContent: "" + quote + "\u00A0(Dead)"
            });
            a.setAttribute('data-boardid', boardID);
            a.setAttribute('data-threadid', post.thread.ID);
            a.setAttribute('data-postid', postID);
          }
        } else if (redirect = Redirect.to({
          boardID: boardID,
          threadID: 0,
          postID: postID
        })) {
          a = $.el('a', {
            href: redirect,
            className: 'deadlink',
            target: '_blank',
            textContent: "" + quote + "\u00A0(Dead)"
          });
          if (Redirect.post(boardID, postID)) {
            $.addClass(a, 'quotelink');
            a.setAttribute('data-boardid', boardID);
            a.setAttribute('data-postid', postID);
          }
        }
        if (__indexOf.call(this.quotes, quoteID) < 0) {
          this.quotes.push(quoteID);
        }
        if (!a) {
          deadlink.textContent += "\u00A0(Dead)";
          continue;
        }
        $.replace(deadlink, a);
        if ($.hasClass(a, 'quotelink')) {
          this.nodes.quotelinks.push(a);
        }
        a = null;
      }
    }
  };

  QuoteInline = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Quote Inlining']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Inlining',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _len, _ref;

      _ref = this.nodes.quotelinks.concat(__slice.call(this.nodes.backlinks));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'click', QuoteInline.toggle);
      }
    },
    toggle: function(e) {
      var boardID, context, postID, threadID, _ref;

      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      _ref = Get.postDataFromLink(this), boardID = _ref.boardID, threadID = _ref.threadID, postID = _ref.postID;
      context = Get.contextFromLink(this);
      if ($.hasClass(this, 'inlined')) {
        QuoteInline.rm(this, boardID, threadID, postID, context);
      } else {
        if ($.x("ancestor::div[@id='p" + postID + "']", this)) {
          return;
        }
        QuoteInline.add(this, boardID, threadID, postID, context);
      }
      return this.classList.toggle('inlined');
    },
    findRoot: function(quotelink, isBacklink) {
      if (isBacklink) {
        return quotelink.parentNode.parentNode;
      } else {
        return $.x('ancestor-or-self::*[parent::blockquote][1]', quotelink);
      }
    },
    add: function(quotelink, boardID, threadID, postID, context) {
      var inline, isBacklink, post;

      isBacklink = $.hasClass(quotelink, 'backlink');
      inline = $.el('div', {
        id: "i" + postID,
        className: 'inline'
      });
      $.after(QuoteInline.findRoot(quotelink, isBacklink), inline);
      Get.postClone(boardID, threadID, postID, inline, context);
      if (!((post = g.posts["" + boardID + "." + postID]) && context.thread === post.thread)) {
        return;
      }
      if (isBacklink && Conf['Forward Hiding']) {
        $.addClass(post.nodes.root, 'forwarded');
        post.forwarded++ || (post.forwarded = 1);
      }
      if (!Unread.posts) {
        return;
      }
      return Unread.readSinglePost(post);
    },
    rm: function(quotelink, boardID, threadID, postID, context) {
      var el, inlined, isBacklink, post, root, _ref;

      isBacklink = $.hasClass(quotelink, 'backlink');
      root = QuoteInline.findRoot(quotelink, isBacklink);
      root = $.x("following-sibling::div[@id='i" + postID + "'][1]", root);
      $.rm(root);
      if (!(el = root.firstElementChild)) {
        return;
      }
      post = g.posts["" + boardID + "." + postID];
      post.rmClone(el.dataset.clone);
      if (Conf['Forward Hiding'] && isBacklink && context.thread === g.threads["" + boardID + "." + threadID] && !--post.forwarded) {
        delete post.forwarded;
        $.rmClass(post.nodes.root, 'forwarded');
      }
      while (inlined = $('.inlined', el)) {
        _ref = Get.postDataFromLink(inlined), boardID = _ref.boardID, threadID = _ref.threadID, postID = _ref.postID;
        QuoteInline.rm(inlined, boardID, threadID, postID, context);
        $.rmClass(inlined, 'inlined');
      }
    }
  };

  QuotePreview = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Quote Previewing']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Previewing',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _len, _ref;

      _ref = this.nodes.quotelinks.concat(__slice.call(this.nodes.backlinks));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var boardID, clone, origin, post, postID, posts, qp, quote, quoterID, threadID, _i, _j, _len, _len1, _ref, _ref1;

      if ($.hasClass(this, 'inlined')) {
        return;
      }
      _ref = Get.postDataFromLink(this), boardID = _ref.boardID, threadID = _ref.threadID, postID = _ref.postID;
      qp = $.el('div', {
        id: 'qp',
        className: 'dialog'
      });
      $.add(d.body, qp);
      Get.postClone(boardID, threadID, postID, qp, Get.contextFromLink(this));
      UI.hover({
        root: this,
        el: qp,
        latestEvent: e,
        endEvents: 'mouseout click',
        cb: QuotePreview.mouseout,
        asapTest: function() {
          return qp.firstElementChild;
        }
      });
      if (!(origin = g.posts["" + boardID + "." + postID])) {
        return;
      }
      if (Conf['Quote Highlighting']) {
        posts = [origin].concat(origin.clones);
        posts.pop();
        for (_i = 0, _len = posts.length; _i < _len; _i++) {
          post = posts[_i];
          $.addClass(post.nodes.post, 'qphl');
        }
      }
      quoterID = $.x('ancestor::*[@id][1]', this).id.match(/\d+$/)[0];
      clone = Get.postFromRoot(qp.firstChild);
      _ref1 = clone.nodes.quotelinks.concat(__slice.call(clone.nodes.backlinks));
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        if (quote.hash.slice(2) === quoterID) {
          $.addClass(quote, 'forwardlink');
        }
      }
    },
    mouseout: function() {
      var clone, post, root, _i, _len, _ref;

      if (!(root = this.el.firstElementChild)) {
        return;
      }
      clone = Get.postFromRoot(root);
      post = clone.origin;
      post.rmClone(root.dataset.clone);
      if (!Conf['Quote Highlighting']) {
        return;
      }
      _ref = [post].concat(post.clones);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        $.rmClass(post.nodes.post, 'qphl');
      }
    }
  };

  QuoteBacklink = {
    init: function() {
      var format;

      if (g.VIEW === 'catalog' || !Conf['Quote Backlinks']) {
        return;
      }
      format = Conf['backlink'].replace(/%id/g, "' + id + '");
      this.funk = Function('id', "return '" + format + "'");
      this.containers = {};
      Post.prototype.callbacks.push({
        name: 'Quote Backlinking Part 1',
        cb: this.firstNode
      });
      return Post.prototype.callbacks.push({
        name: 'Quote Backlinking Part 2',
        cb: this.secondNode
      });
    },
    firstNode: function() {
      var a, clone, container, containers, link, post, quote, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;

      if (this.isClone || !this.quotes.length) {
        return;
      }
      a = $.el('a', {
        href: "/" + this.board + "/res/" + this.thread + "#p" + this,
        className: this.isHidden ? 'filtered backlink' : 'backlink',
        textContent: QuoteBacklink.funk(this.ID)
      });
      _ref = this.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        containers = [QuoteBacklink.getContainer(quote)];
        if ((post = g.posts[quote]) && post.nodes.backlinkContainer) {
          _ref1 = post.clones;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            clone = _ref1[_j];
            containers.push(clone.nodes.backlinkContainer);
          }
        }
        for (_k = 0, _len2 = containers.length; _k < _len2; _k++) {
          container = containers[_k];
          link = a.cloneNode(true);
          if (Conf['Quote Previewing']) {
            $.on(link, 'mouseover', QuotePreview.mouseover);
          }
          if (Conf['Quote Inlining']) {
            $.on(link, 'click', QuoteInline.toggle);
          }
          $.add(container, [$.tn(' '), link]);
        }
      }
    },
    secondNode: function() {
      var container;

      if (this.isClone && (this.origin.isReply || Conf['OP Backlinks'])) {
        this.nodes.backlinkContainer = $('.container', this.nodes.info);
        return;
      }
      if (!(this.isReply || Conf['OP Backlinks'])) {
        return;
      }
      container = QuoteBacklink.getContainer(this.fullID);
      this.nodes.backlinkContainer = container;
      return $.add(this.nodes.info, container);
    },
    getContainer: function(id) {
      var _base;

      return (_base = this.containers)[id] || (_base[id] = $.el('span', {
        className: 'container'
      }));
    }
  };

  QuoteYou = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Mark Quotes of You'] || !Conf['Quick Reply']) {
        return;
      }
      this.text = '\u00A0(You)';
      return Post.prototype.callbacks.push({
        name: 'Mark Quotes of You',
        cb: this.node
      });
    },
    node: function() {
      var quotelink, quotelinks, quotes, _i, _len;

      if (this.isClone) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
        quotelink = quotelinks[_i];
        if (QR.db.get(Get.postDataFromLink(quotelink))) {
          $.add(quotelink, $.tn(QuoteYou.text));
        }
      }
    }
  };

  QuoteOP = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Mark OP Quotes']) {
        return;
      }
      this.text = '\u00A0(OP)';
      return Post.prototype.callbacks.push({
        name: 'Mark OP Quotes',
        cb: this.node
      });
    },
    node: function() {
      var boardID, op, postID, quotelink, quotelinks, quotes, _i, _j, _len, _len1, _ref, _ref1;

      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      if (this.isClone && (_ref = this.thread.fullID, __indexOf.call(quotes, _ref) >= 0)) {
        for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
          quotelink = quotelinks[_i];
          quotelink.textContent = quotelink.textContent.replace(QuoteOP.text, '');
        }
      }
      op = (this.isClone ? this.context : this).thread.fullID;
      if (__indexOf.call(quotes, op) < 0) {
        return;
      }
      for (_j = 0, _len1 = quotelinks.length; _j < _len1; _j++) {
        quotelink = quotelinks[_j];
        _ref1 = Get.postDataFromLink(quotelink), boardID = _ref1.boardID, postID = _ref1.postID;
        if (("" + boardID + "." + postID) === op) {
          $.add(quotelink, $.tn(QuoteOP.text));
        }
      }
    }
  };

  QuoteCT = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Mark Cross-thread Quotes']) {
        return;
      }
      this.text = '\u00A0(Cross-thread)';
      return Post.prototype.callbacks.push({
        name: 'Mark Cross-thread Quotes',
        cb: this.node
      });
    },
    node: function() {
      var board, boardID, quotelink, quotelinks, quotes, thread, threadID, _i, _len, _ref, _ref1;

      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      _ref = this.isClone ? this.context : this, board = _ref.board, thread = _ref.thread;
      for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
        quotelink = quotelinks[_i];
        _ref1 = Get.postDataFromLink(quotelink), boardID = _ref1.boardID, threadID = _ref1.threadID;
        if (!threadID) {
          continue;
        }
        if (this.isClone) {
          quotelink.textContent = quotelink.textContent.replace(QuoteCT.text, '');
        }
        if (boardID === this.board.ID && threadID !== thread.ID) {
          $.add(quotelink, $.tn(QuoteCT.text));
        }
      }
    }
  };

  Anonymize = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Anonymize']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Anonymize',
        cb: this.node
      });
    },
    node: function() {
      var email, name, tripcode, _ref;

      if (this.info.capcode || this.isClone) {
        return;
      }
      _ref = this.nodes, name = _ref.name, tripcode = _ref.tripcode, email = _ref.email;
      if (this.info.name !== 'Anonymous') {
        name.textContent = 'Anonymous';
      }
      if (tripcode) {
        $.rm(tripcode);
        delete this.nodes.tripcode;
      }
      if (this.info.email) {
        if (/sage/i.test(this.info.email)) {
          return email.href = 'mailto:sage';
        } else {
          $.replace(email, name);
          return delete this.nodes.email;
        }
      }
    }
  };

  Time = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Time Formatting']) {
        return;
      }
      this.funk = this.createFunc(Conf['time']);
      return Post.prototype.callbacks.push({
        name: 'Time Formatting',
        cb: this.node
      });
    },
    node: function() {
      if (this.isClone) {
        return;
      }
      return this.nodes.date.textContent = Time.funk(Time, this.info.date);
    },
    createFunc: function(format) {
      var code;

      code = format.replace(/%([A-Za-z])/g, function(s, c) {
        if (c in Time.formatters) {
          return "' + Time.formatters." + c + ".call(date) + '";
        } else {
          return s;
        }
      });
      return Function('Time', 'date', "return '" + code + "'");
    },
    day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    zeroPad: function(n) {
      if (n < 10) {
        return "0" + n;
      } else {
        return n;
      }
    },
    formatters: {
      a: function() {
        return Time.day[this.getDay()].slice(0, 3);
      },
      A: function() {
        return Time.day[this.getDay()];
      },
      b: function() {
        return Time.month[this.getMonth()].slice(0, 3);
      },
      B: function() {
        return Time.month[this.getMonth()];
      },
      d: function() {
        return Time.zeroPad(this.getDate());
      },
      e: function() {
        return this.getDate();
      },
      H: function() {
        return Time.zeroPad(this.getHours());
      },
      I: function() {
        return Time.zeroPad(this.getHours() % 12 || 12);
      },
      k: function() {
        return this.getHours();
      },
      l: function() {
        return this.getHours() % 12 || 12;
      },
      m: function() {
        return Time.zeroPad(this.getMonth() + 1);
      },
      M: function() {
        return Time.zeroPad(this.getMinutes());
      },
      p: function() {
        if (this.getHours() < 12) {
          return 'AM';
        } else {
          return 'PM';
        }
      },
      P: function() {
        if (this.getHours() < 12) {
          return 'am';
        } else {
          return 'pm';
        }
      },
      S: function() {
        return Time.zeroPad(this.getSeconds());
      },
      y: function() {
        return this.getFullYear() - 2000;
      }
    }
  };

  RelativeDates = {
    INTERVAL: $.MINUTE / 2,
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Relative Post Dates']) {
        return;
      }
      $.on(d, 'visibilitychange ThreadUpdate', this.flush);
      this.flush();
      return Post.prototype.callbacks.push({
        name: 'Relative Post Dates',
        cb: this.node
      });
    },
    node: function() {
      var dateEl;

      if (this.isClone) {
        return;
      }
      dateEl = this.nodes.date;
      dateEl.title = dateEl.textContent;
      return RelativeDates.setUpdate(this);
    },
    relative: function(diff, now, date) {
      var days, months, number, rounded, unit, years;

      unit = (number = diff / $.DAY) >= 1 ? (years = now.getYear() - date.getYear(), months = now.getMonth() - date.getMonth(), days = now.getDate() - date.getDate(), years > 1 ? (number = years - (months < 0 || months === 0 && days < 0), 'year') : years === 1 && (months > 0 || months === 0 && days >= 0) ? (number = years, 'year') : (months = (months + 12) % 12) > 1 ? (number = months - (days < 0), 'month') : months === 1 && days >= 0 ? (number = months, 'month') : 'day') : (number = diff / $.HOUR) >= 1 ? 'hour' : (number = diff / $.MINUTE) >= 1 ? 'minute' : (number = Math.max(0, diff) / $.SECOND, 'second');
      rounded = Math.round(number);
      if (rounded !== 1) {
        unit += 's';
      }
      return "" + rounded + " " + unit + " ago";
    },
    stale: [],
    flush: function() {
      var now, update, _i, _len, _ref;

      if (d.hidden) {
        return;
      }
      now = new Date();
      _ref = RelativeDates.stale;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        update = _ref[_i];
        update(now);
      }
      RelativeDates.stale = [];
      clearTimeout(RelativeDates.timeout);
      return RelativeDates.timeout = setTimeout(RelativeDates.flush, RelativeDates.INTERVAL);
    },
    setUpdate: function(post) {
      var markStale, setOwnTimeout, update;

      setOwnTimeout = function(diff) {
        var delay;

        delay = diff < $.MINUTE ? $.SECOND - (diff + $.SECOND / 2) % $.SECOND : diff < $.HOUR ? $.MINUTE - (diff + $.MINUTE / 2) % $.MINUTE : diff < $.DAY ? $.HOUR - (diff + $.HOUR / 2) % $.HOUR : $.DAY - (diff + $.DAY / 2) % $.DAY;
        return setTimeout(markStale, delay);
      };
      update = function(now) {
        var date, diff, relative, singlePost, _i, _len, _ref;

        date = post.info.date;
        diff = now - date;
        relative = RelativeDates.relative(diff, now, date);
        _ref = [post].concat(post.clones);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          singlePost = _ref[_i];
          singlePost.nodes.date.textContent = relative;
        }
        return setOwnTimeout(diff);
      };
      markStale = function() {
        return RelativeDates.stale.push(update);
      };
      return update(new Date());
    }
  };

  FileInfo = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['File Info Formatting']) {
        return;
      }
      this.funk = this.createFunc(Conf['fileInfo']);
      return Post.prototype.callbacks.push({
        name: 'File Info Formatting',
        cb: this.node
      });
    },
    node: function() {
      if (!this.file || this.isClone) {
        return;
      }
      return this.file.text.innerHTML = FileInfo.funk(FileInfo, this);
    },
    createFunc: function(format) {
      var code;

      code = format.replace(/%(.)/g, function(s, c) {
        if (c in FileInfo.formatters) {
          return "' + FileInfo.formatters." + c + ".call(post) + '";
        } else {
          return s;
        }
      });
      return Function('FileInfo', 'post', "return '" + code + "'");
    },
    convertUnit: function(size, unit) {
      var i;

      if (unit === 'B') {
        return "" + (size.toFixed()) + " Bytes";
      }
      i = 1 + ['KB', 'MB'].indexOf(unit);
      while (i--) {
        size /= 1024;
      }
      size = unit === 'MB' ? Math.round(size * 100) / 100 : size.toFixed();
      return "" + size + " " + unit;
    },
    escape: function(name) {
      return name.replace(/<|>/g, function(c) {
        return c === '<' && '&lt;' || '&gt;';
      });
    },
    formatters: {
      t: function() {
        return this.file.URL.match(/\d+\..+$/)[0];
      },
      T: function() {
        return "<a href=" + this.file.URL + " target=_blank>" + (FileInfo.formatters.t.call(this)) + "</a>";
      },
      l: function() {
        return "<a href=" + this.file.URL + " target=_blank>" + (FileInfo.formatters.n.call(this)) + "</a>";
      },
      L: function() {
        return "<a href=" + this.file.URL + " target=_blank>" + (FileInfo.formatters.N.call(this)) + "</a>";
      },
      n: function() {
        var fullname, shortname;

        fullname = this.file.name;
        shortname = Build.shortFilename(this.file.name, this.isReply);
        if (fullname === shortname) {
          return FileInfo.escape(fullname);
        } else {
          return "<span class=fntrunc>" + (FileInfo.escape(shortname)) + "</span><span class=fnfull>" + (FileInfo.escape(fullname)) + "</span>";
        }
      },
      N: function() {
        return FileInfo.escape(this.file.name);
      },
      p: function() {
        if (this.file.isSpoiler) {
          return 'Spoiler, ';
        } else {
          return '';
        }
      },
      s: function() {
        return this.file.size;
      },
      B: function() {
        return FileInfo.convertUnit(this.file.sizeInBytes, 'B');
      },
      K: function() {
        return FileInfo.convertUnit(this.file.sizeInBytes, 'KB');
      },
      M: function() {
        return FileInfo.convertUnit(this.file.sizeInBytes, 'MB');
      },
      r: function() {
        if (this.file.isImage) {
          return this.file.dimensions;
        } else {
          return 'PDF';
        }
      }
    }
  };

  Sauce = {
    init: function() {
      var link, links, _i, _len, _ref;

      if (g.VIEW === 'catalog' || !Conf['Sauce']) {
        return;
      }
      links = [];
      _ref = Conf['sauces'].split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        if (link[0] === '#') {
          continue;
        }
        links.push(this.createSauceLink(link.trim()));
      }
      if (!links.length) {
        return;
      }
      this.links = links;
      this.link = $.el('a', {
        target: '_blank'
      });
      return Post.prototype.callbacks.push({
        name: 'Sauce',
        cb: this.node
      });
    },
    createSauceLink: function(link) {
      var m, text;

      link = link.replace(/%(T?URL|MD5|board)/g, function(parameter) {
        switch (parameter) {
          case '%TURL':
            return "' + encodeURIComponent(post.file.thumbURL) + '";
          case '%URL':
            return "' + encodeURIComponent(post.file.URL) + '";
          case '%MD5':
            return "' + encodeURIComponent(post.file.MD5) + '";
          case '%board':
            return "' + encodeURIComponent(post.board) + '";
          default:
            return parameter;
        }
      });
      text = (m = link.match(/;text:(.+)$/)) ? m[1] : link.match(/(\w+)\.\w+\//)[1];
      link = link.replace(/;text:.+$/, '');
      return Function('post', 'a', "a.href = '" + link + "';\na.textContent = '" + text + "';\nreturn a;");
    },
    node: function() {
      var link, nodes, _i, _len, _ref;

      if (this.isClone || !this.file) {
        return;
      }
      nodes = [];
      _ref = Sauce.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        nodes.push($.tn('\u00A0'), link(this, Sauce.link.cloneNode(true)));
      }
      return $.add(this.file.info, nodes);
    }
  };

  ImageExpand = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Image Expansion']) {
        return;
      }
      this.EAI = $.el('a', {
        className: 'expand-all-shortcut',
        textContent: 'EAI',
        title: 'Expand All Images',
        href: 'javascript:;'
      });
      $.on(this.EAI, 'click', ImageExpand.cb.toggleAll);
      Header.addShortcut(this.EAI);
      return Post.prototype.callbacks.push({
        name: 'Image Expansion',
        cb: this.node
      });
    },
    node: function() {
      var thumb, _ref;

      if (!((_ref = this.file) != null ? _ref.isImage : void 0)) {
        return;
      }
      thumb = this.file.thumb;
      $.on(thumb.parentNode, 'click', ImageExpand.cb.toggle);
      if (this.isClone && $.hasClass(thumb, 'expanding')) {
        ImageExpand.contract(this);
        ImageExpand.expand(this);
        return;
      }
      if (ImageExpand.on && !this.isHidden) {
        return ImageExpand.expand(this);
      }
    },
    cb: {
      toggle: function(e) {
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        return ImageExpand.toggle(Get.postFromNode(this));
      },
      toggleAll: function() {
        var ID, file, func, post, _i, _len, _ref, _ref1;

        $.event('CloseMenu');
        if (ImageExpand.on = $.hasClass(ImageExpand.EAI, 'expand-all-shortcut')) {
          ImageExpand.EAI.className = 'contract-all-shortcut';
          ImageExpand.EAI.title = 'Contract All Images';
          func = ImageExpand.expand;
        } else {
          ImageExpand.EAI.className = 'expand-all-shortcut';
          ImageExpand.EAI.title = 'Expand All Images';
          func = ImageExpand.contract;
        }
        _ref = g.posts;
        for (ID in _ref) {
          post = _ref[ID];
          _ref1 = [post].concat(post.clones);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            post = _ref1[_i];
            file = post.file;
            if (!(file && file.isImage && doc.contains(post.nodes.root))) {
              continue;
            }
            if (ImageExpand.on && (!Conf['Expand spoilers'] && file.isSpoiler || Conf['Expand from here'] && file.thumb.getBoundingClientRect().top < 0)) {
              continue;
            }
            $.queueTask(func, post);
          }
        }
      },
      setFitness: function() {
        var checked;

        checked = this.checked;
        (checked ? $.addClass : $.rmClass)(doc, this.name.toLowerCase().replace(/\s+/g, '-'));
        if (this.name !== 'Fit height') {
          return;
        }
        if (checked) {
          $.on(window, 'resize', ImageExpand.resize);
          if (!ImageExpand.style) {
            ImageExpand.style = $.addStyle(null);
          }
          return ImageExpand.resize();
        } else {
          return $.off(window, 'resize', ImageExpand.resize);
        }
      }
    },
    toggle: function(post) {
      var headRect, rect, root, thumb, top;

      thumb = post.file.thumb;
      if (!(post.file.isExpanded || $.hasClass(thumb, 'expanding'))) {
        ImageExpand.expand(post);
        return;
      }
      ImageExpand.contract(post);
      rect = post.nodes.root.getBoundingClientRect();
      if (!(rect.top <= 0 || rect.left <= 0)) {
        return;
      }
      top = rect.top;
      if (!Conf['Bottom header']) {
        headRect = Header.toggle.getBoundingClientRect();
        top += -headRect.top - headRect.height;
      }
      root = $.engine === 'webkit' ? d.body : doc;
      if (rect.top < 0) {
        root.scrollTop += top;
      }
      if (rect.left < 0) {
        return root.scrollLeft = 0;
      }
    },
    contract: function(post) {
      $.rmClass(post.nodes.root, 'expanded-image');
      $.rmClass(post.file.thumb, 'expanding');
      return post.file.isExpanded = false;
    },
    expand: function(post, src) {
      var img, thumb;

      thumb = post.file.thumb;
      if (post.isHidden || post.file.isExpanded || $.hasClass(thumb, 'expanding')) {
        return;
      }
      $.addClass(thumb, 'expanding');
      if (post.file.fullImage) {
        $.asap((function() {
          return post.file.fullImage.naturalHeight;
        }), function() {
          return ImageExpand.completeExpand(post);
        });
        return;
      }
      post.file.fullImage = img = $.el('img', {
        className: 'full-image',
        src: src || post.file.URL
      });
      $.on(img, 'error', ImageExpand.error);
      $.asap((function() {
        return post.file.fullImage.naturalHeight;
      }), function() {
        return ImageExpand.completeExpand(post);
      });
      return $.after(thumb, img);
    },
    completeExpand: function(post) {
      var prev, thumb;

      thumb = post.file.thumb;
      if (!$.hasClass(thumb, 'expanding')) {
        return;
      }
      post.file.isExpanded = true;
      if (!post.nodes.root.parentNode) {
        $.addClass(post.nodes.root, 'expanded-image');
        $.rmClass(post.file.thumb, 'expanding');
        return;
      }
      prev = post.nodes.root.getBoundingClientRect();
      return $.queueTask(function() {
        var curr, root;

        $.addClass(post.nodes.root, 'expanded-image');
        $.rmClass(post.file.thumb, 'expanding');
        if (!(prev.top + prev.height <= 0)) {
          return;
        }
        root = $.engine === 'webkit' ? d.body : doc;
        curr = post.nodes.root.getBoundingClientRect();
        return root.scrollTop += curr.height - prev.height + curr.top - prev.top;
      });
    },
    error: function() {
      var URL, post, src, timeoutID;

      post = Get.postFromNode(this);
      $.rm(this);
      delete post.file.fullImage;
      if (!($.hasClass(post.file.thumb, 'expanding') || $.hasClass(post.nodes.root, 'expanded-image'))) {
        return;
      }
      ImageExpand.contract(post);
      src = this.src.split('/');
      if (src[2] === 'images.4chan.org') {
        if (URL = Redirect.image(src[3], src[5])) {
          setTimeout(ImageExpand.expand, 10000, post, URL);
          return;
        }
        if (g.DEAD || post.isDead || post.file.isDead) {
          return;
        }
      }
      timeoutID = setTimeout(ImageExpand.expand, 10000, post);
      return $.ajax("//api.4chan.org/" + post.board + "/res/" + post.thread + ".json", {
        onload: function() {
          var postObj, _i, _len, _ref;

          if (this.status !== 200) {
            return;
          }
          _ref = JSON.parse(this.response).posts;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            postObj = _ref[_i];
            if (postObj.no === post.ID) {
              break;
            }
          }
          if (postObj.no !== post.ID) {
            clearTimeout(timeoutID);
            return post.kill();
          } else if (postObj.filedeleted) {
            clearTimeout(timeoutID);
            return post.kill(true);
          }
        }
      });
    },
    menu: {
      init: function() {
        var conf, createSubEntry, el, key, subEntries, _ref;

        if (g.VIEW === 'catalog' || !Conf['Image Expansion']) {
          return;
        }
        el = $.el('span', {
          textContent: 'Image Expansion',
          className: 'image-expansion-link'
        });
        createSubEntry = ImageExpand.menu.createSubEntry;
        subEntries = [];
        _ref = Config.imageExpansion;
        for (key in _ref) {
          conf = _ref[key];
          subEntries.push(createSubEntry(key, conf));
        }
        return $.event('AddMenuEntry', {
          type: 'header',
          el: el,
          order: 80,
          subEntries: subEntries
        });
      },
      createSubEntry: function(type, config) {
        var input, label;

        label = $.el('label', {
          innerHTML: "<input type=checkbox name='" + type + "'> " + type
        });
        input = label.firstElementChild;
        if (type === 'Fit width' || type === 'Fit height') {
          $.on(input, 'change', ImageExpand.cb.setFitness);
        }
        if (config) {
          label.title = config[1];
          input.checked = Conf[type];
          $.event('change', null, input);
          $.on(input, 'change', $.cb.checked);
        }
        return {
          el: label
        };
      }
    },
    resize: function() {
      return ImageExpand.style.textContent = ":root.fit-height .full-image {max-height:" + doc.clientHeight + "px}";
    }
  };

  RevealSpoilers = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reveal Spoilers']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Reveal Spoilers',
        cb: this.node
      });
    },
    node: function() {
      var thumb, _ref;

      if (this.isClone || !((_ref = this.file) != null ? _ref.isSpoiler : void 0)) {
        return;
      }
      thumb = this.file.thumb;
      thumb.removeAttribute('style');
      return thumb.src = this.file.thumbURL;
    }
  };

  AutoGIF = {
    init: function() {
      var _ref;

      if (g.VIEW === 'catalog' || !Conf['Auto-GIF'] || ((_ref = g.BOARD.ID) === 'gif' || _ref === 'wsg')) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Auto-GIF',
        cb: this.node
      });
    },
    node: function() {
      var URL, gif, style, thumb, _ref, _ref1;

      if (this.isClone || this.isHidden || this.thread.isHidden || !((_ref = this.file) != null ? _ref.isImage : void 0)) {
        return;
      }
      _ref1 = this.file, thumb = _ref1.thumb, URL = _ref1.URL;
      if (!(/gif$/.test(URL) && !/spoiler/.test(thumb.src))) {
        return;
      }
      if (this.file.isSpoiler) {
        style = thumb.style;
        style.maxHeight = style.maxWidth = this.isReply ? '125px' : '250px';
      }
      gif = $.el('img');
      $.on(gif, 'load', function() {
        return thumb.src = URL;
      });
      return gif.src = URL;
    }
  };

  ImageHover = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Image Hover']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Image Hover',
        cb: this.node
      });
    },
    node: function() {
      var _ref;

      if (!((_ref = this.file) != null ? _ref.isImage : void 0)) {
        return;
      }
      return $.on(this.file.thumb, 'mouseover', ImageHover.mouseover);
    },
    mouseover: function(e) {
      var el, post;

      post = Get.postFromNode(this);
      el = $.el('img', {
        id: 'ihover',
        src: post.file.URL
      });
      el.setAttribute('data-fullid', post.fullID);
      $.add(d.body, el);
      UI.hover({
        root: this,
        el: el,
        latestEvent: e,
        endEvents: 'mouseout click',
        asapTest: function() {
          return el.naturalHeight;
        }
      });
      return $.on(el, 'error', ImageHover.error);
    },
    error: function() {
      var URL, post, src, timeoutID,
        _this = this;

      if (!doc.contains(this)) {
        return;
      }
      post = g.posts[this.dataset.fullid];
      src = this.src.split('/');
      if (src[2] === 'images.4chan.org') {
        if (URL = Redirect.image(src[3], src[5].replace(/\?.+$/, ''))) {
          this.src = URL;
          return;
        }
        if (g.DEAD || post.isDead || post.file.isDead) {
          return;
        }
      }
      timeoutID = setTimeout((function() {
        return _this.src = post.file.URL + '?' + Date.now();
      }), 3000);
      return $.ajax("//api.4chan.org/" + post.board + "/res/" + post.thread + ".json", {
        onload: function() {
          var postObj, _i, _len, _ref;

          if (this.status !== 200) {
            return;
          }
          _ref = JSON.parse(this.response).posts;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            postObj = _ref[_i];
            if (postObj.no === post.ID) {
              break;
            }
          }
          if (postObj.no !== post.ID) {
            clearTimeout(timeoutID);
            return post.kill();
          } else if (postObj.filedeleted) {
            clearTimeout(timeoutID);
            return post.kill(true);
          }
        }
      });
    }
  };

  ExpandComment = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Comment Expansion']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Comment Expansion',
        cb: this.node
      });
    },
    node: function() {
      var a;

      if (a = $('.abbr > a', this.nodes.comment)) {
        return $.on(a, 'click', ExpandComment.cb);
      }
    },
    cb: function(e) {
      var post;

      e.preventDefault();
      post = Get.postFromNode(this);
      return ExpandComment.expand(post);
    },
    expand: function(post) {
      var a;

      if (post.nodes.longComment && !post.nodes.longComment.parentNode) {
        $.replace(post.nodes.shortComment, post.nodes.longComment);
        post.nodes.comment = post.nodes.longComment;
        return;
      }
      if (!(a = $('.abbr > a', post.nodes.comment))) {
        return;
      }
      a.textContent = "Post No." + post + " Loading...";
      return $.cache("//api.4chan.org" + a.pathname + ".json", function() {
        return ExpandComment.parse(this, a, post);
      });
    },
    contract: function(post) {
      var a;

      if (!post.nodes.shortComment) {
        return;
      }
      a = $('.abbr > a', post.nodes.shortComment);
      a.textContent = 'here';
      $.replace(post.nodes.longComment, post.nodes.shortComment);
      return post.nodes.comment = post.nodes.shortComment;
    },
    parse: function(req, a, post) {
      var clone, comment, href, postObj, posts, quote, spoilerRange, status, _i, _j, _len, _len1, _ref;

      status = req.status;
      if (status !== 200 && status !== 304) {
        a.textContent = "Error " + req.statusText + " (" + status + ")";
        return;
      }
      posts = JSON.parse(req.response).posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[g.BOARD] = spoilerRange;
      }
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        postObj = posts[_i];
        if (postObj.no === post.ID) {
          break;
        }
      }
      if (postObj.no !== post.ID) {
        a.textContent = "Post No." + post + " not found.";
        return;
      }
      comment = post.nodes.comment;
      clone = comment.cloneNode(false);
      clone.innerHTML = postObj.com;
      _ref = $$('.quotelink', clone);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        quote = _ref[_j];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "/" + post.board + "/res/" + href;
      }
      post.nodes.shortComment = comment;
      $.replace(comment, clone);
      post.nodes.comment = post.nodes.longComment = clone;
      post.parseComment();
      post.parseQuotes();
      if (Conf['Resurrect Quotes']) {
        Quotify.node.call(post);
      }
      if (Conf['Quote Previewing']) {
        QuotePreview.node.call(post);
      }
      if (Conf['Quote Inlining']) {
        QuoteInline.node.call(post);
      }
      if (Conf['Mark OP Quotes']) {
        QuoteOP.node.call(post);
      }
      if (Conf['Mark Cross-thread Quotes']) {
        QuoteCT.node.call(post);
      }
      if (g.BOARD.ID === 'g') {
        Fourchan.code.call(post);
      }
      if (g.BOARD.ID === 'sci') {
        return Fourchan.math.call(post);
      }
    }
  };

  ExpandThread = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Thread Expansion']) {
        return;
      }
      return Thread.prototype.callbacks.push({
        name: 'Thread Expansion',
        cb: this.node
      });
    },
    node: function() {
      var a, span;

      if (!(span = $('.summary', this.OP.nodes.root.parentNode))) {
        return;
      }
      a = $.el('a', {
        textContent: "+ " + span.textContent,
        className: 'summary',
        href: 'javascript:;'
      });
      $.on(a, 'click', ExpandThread.cbToggle);
      return $.replace(span, a);
    },
    cbToggle: function() {
      var op;

      op = Get.postFromRoot(this.previousElementSibling);
      return ExpandThread.toggle(op.thread);
    },
    toggle: function(thread) {
      var a, inlined, num, post, replies, reply, threadRoot, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;

      threadRoot = thread.OP.nodes.root.parentNode;
      a = $('.summary', threadRoot);
      switch (thread.isExpanded) {
        case false:
        case void 0:
          thread.isExpanded = 'loading';
          _ref = $$('.thread > .postContainer', threadRoot);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            ExpandComment.expand(Get.postFromRoot(post));
          }
          if (!a) {
            thread.isExpanded = true;
            return;
          }
          thread.isExpanded = 'loading';
          a.textContent = a.textContent.replace('+', '× Loading...');
          $.cache("//api.4chan.org/" + thread.board + "/res/" + thread + ".json", function() {
            return ExpandThread.parse(this, thread, a);
          });
          break;
        case 'loading':
          thread.isExpanded = false;
          if (!a) {
            return;
          }
          a.textContent = a.textContent.replace('× Loading...', '+');
          break;
        case true:
          thread.isExpanded = false;
          if (a) {
            a.textContent = a.textContent.replace('-', '+');
            num = (function() {
              if (thread.isSticky) {
                return 1;
              } else {
                switch (g.BOARD.ID) {
                  case 'b':
                  case 'vg':
                  case 'q':
                    return 3;
                  case 't':
                    return 1;
                  default:
                    return 5;
                }
              }
            })();
            replies = $$('.thread > .replyContainer', threadRoot).slice(0, -num);
            for (_j = 0, _len1 = replies.length; _j < _len1; _j++) {
              reply = replies[_j];
              if (Conf['Quote Inlining']) {
                while (inlined = $('.inlined', reply)) {
                  inlined.click();
                }
              }
              $.rm(reply);
            }
          }
          _ref1 = $$('.thread > .postContainer', threadRoot);
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            post = _ref1[_k];
            ExpandComment.contract(Get.postFromRoot(post));
          }
      }
    },
    parse: function(req, thread, a) {
      var link, node, nodes, post, posts, replies, reply, spoilerRange, status, _i, _len;

      if (a.textContent[0] === '+') {
        return;
      }
      status = req.status;
      if (status !== 200 && status !== 304) {
        a.textContent = "Error " + req.statusText + " (" + status + ")";
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      thread.isExpanded = true;
      a.textContent = a.textContent.replace('× Loading...', '-');
      posts = JSON.parse(req.response).posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[g.BOARD] = spoilerRange;
      }
      replies = posts.slice(1);
      posts = [];
      nodes = [];
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        if (post = thread.posts[reply.no]) {
          nodes.push(post.nodes.root);
          continue;
        }
        node = Build.postFromObject(reply, thread.board);
        post = new Post(node, thread, thread.board);
        link = $('a[title="Highlight this post"]', node);
        link.href = "res/" + thread + "#p" + post;
        link.nextSibling.href = "res/" + thread + "#q" + post;
        posts.push(post);
        nodes.push(node);
      }
      Main.callbackNodes(Post, posts);
      $.after(a, nodes);
      if (Conf['Enable 4chan\'s Extension']) {
        return $.globalEval("Parser.parseThread(" + thread.ID + ", 1, " + nodes.length + ")");
      } else {
        return Fourchan.parseThread(thread.ID, 1, nodes.length);
      }
    }
  };

  ThreadExcerpt = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Thread Excerpt']) {
        return;
      }
      return Thread.prototype.callbacks.push({
        name: 'Thread Excerpt',
        cb: this.node
      });
    },
    node: function() {
      var excerpt;

      return d.title = (excerpt = Get.threadExcerpt(this)).length > 80 ? "" + excerpt.slice(0, 77) + "..." : excerpt;
    }
  };

  Unread = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Unread Count'] && !Conf['Unread Tab Icon']) {
        return;
      }
      this.db = new DataBoard('lastReadPosts', this.sync);
      this.hr = $.el('hr', {
        id: 'unread-line'
      });
      this.posts = [];
      this.postsQuotingYou = [];
      return Thread.prototype.callbacks.push({
        name: 'Unread',
        cb: this.node
      });
    },
    node: function() {
      var ID, hash, post, posts, _ref;

      Unread.thread = this;
      Unread.title = d.title;
      posts = [];
      _ref = this.posts;
      for (ID in _ref) {
        post = _ref[ID];
        if (post.isReply) {
          posts.push(post);
        }
      }
      Unread.lastReadPost = Unread.db.get({
        boardID: this.board.ID,
        threadID: this.ID,
        defaultValue: 0
      });
      Unread.addPosts(posts);
      if ((hash = location.hash.match(/\d+/)) && (post = this.posts[hash[0]])) {
        Header.scrollToPost(post.nodes.root);
      } else if (Unread.posts.length) {
        $.x('preceding-sibling::div[contains(@class,"postContainer")][1]', Unread.posts[0].nodes.root).scrollIntoView(false);
      } else if (posts.length) {
        Header.scrollToPost(posts[posts.length - 1].nodes.root);
      }
      $.on(d, 'ThreadUpdate', Unread.onUpdate);
      $.on(d, 'scroll visibilitychange', Unread.read);
      if (Conf['Unread Line']) {
        return $.on(d, 'visibilitychange', Unread.setLine);
      }
    },
    sync: function() {
      var lastReadPost;

      lastReadPost = Unread.db.get({
        boardID: Unread.thread.board.ID,
        threadID: Unread.thread.ID,
        defaultValue: 0
      });
      if (!(Unread.lastReadPost < lastReadPost)) {
        return;
      }
      Unread.lastReadPost = lastReadPost;
      Unread.readArray(Unread.posts);
      Unread.readArray(Unread.postsQuotingYou);
      Unread.setLine();
      return Unread.update();
    },
    addPosts: function(newPosts) {
      var ID, data, post, _i, _len, _ref;

      for (_i = 0, _len = newPosts.length; _i < _len; _i++) {
        post = newPosts[_i];
        ID = post.ID;
        if (ID <= Unread.lastReadPost || post.isHidden) {
          continue;
        }
        if (QR.db) {
          data = {
            boardID: post.board.ID,
            threadID: post.thread.ID,
            postID: post.ID
          };
          if (QR.db.get(data)) {
            continue;
          }
        }
        Unread.posts.push(post);
        Unread.addPostQuotingYou(post);
      }
      if (Conf['Unread Line']) {
        Unread.setLine((_ref = Unread.posts[0], __indexOf.call(newPosts, _ref) >= 0));
      }
      Unread.read();
      return Unread.update();
    },
    addPostQuotingYou: function(post) {
      var quotelink, _i, _len, _ref;

      if (!QR.db) {
        return;
      }
      _ref = post.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        if (QR.db.get(Get.postDataFromLink(quotelink))) {
          Unread.postsQuotingYou.push(post);
        }
      }
    },
    onUpdate: function(e) {
      if (e.detail[404]) {
        return Unread.update();
      } else {
        return Unread.addPosts(e.detail.newPosts);
      }
    },
    readSinglePost: function(post) {
      var i;

      if ((i = Unread.posts.indexOf(post)) === -1) {
        return;
      }
      Unread.posts.splice(i, 1);
      if (i === 0) {
        Unread.lastReadPost = post.ID;
        Unread.saveLastReadPost();
      }
      if ((i = Unread.postsQuotingYou.indexOf(post)) !== -1) {
        Unread.postsQuotingYou.splice(i, 1);
      }
      return Unread.update();
    },
    readArray: function(arr) {
      var i, post, _i, _len;

      for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
        post = arr[i];
        if (post.ID > Unread.lastReadPost) {
          break;
        }
      }
      return arr.splice(0, i);
    },
    read: function(e) {
      var bottom, height, i, post, _i, _len, _ref;

      if (d.hidden || !Unread.posts.length) {
        return;
      }
      height = doc.clientHeight;
      _ref = Unread.posts;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        post = _ref[i];
        bottom = post.nodes.root.getBoundingClientRect().bottom;
        if (bottom > height) {
          break;
        }
      }
      if (!i) {
        return;
      }
      Unread.lastReadPost = Unread.posts[i - 1].ID;
      Unread.saveLastReadPost();
      Unread.posts.splice(0, i);
      Unread.readArray(Unread.postsQuotingYou);
      if (e) {
        return Unread.update();
      }
    },
    saveLastReadPost: $.debounce(2 * $.SECOND, function() {
      return Unread.db.set({
        boardID: Unread.thread.board.ID,
        threadID: Unread.thread.ID,
        val: Unread.lastReadPost
      });
    }),
    setLine: function(force) {
      var post, root;

      if (!(d.hidden || force === true)) {
        return;
      }
      if (post = Unread.posts[0]) {
        root = post.nodes.root;
        if (root !== $('.thread > .replyContainer', root.parentNode)) {
          return $.before(root, Unread.hr);
        }
      } else if (Unread.hr.parentNode) {
        return $.rm(Unread.hr);
      }
    },
    update: function(dontrepeat) {
      var count;

      count = Unread.posts.length;
      if (Conf['Unread Count']) {
        d.title = g.DEAD ? "(" + Unread.posts.length + ") /" + g.BOARD + "/ - 404" : "(" + Unread.posts.length + ") " + Unread.title;
        if (!dontrepeat) {
          setTimeout(function() {
            d.title = '';
            return Unread.update(true);
          }, $.SECOND);
        }
      }
      if (!Conf['Unread Tab Icon']) {
        return;
      }
      return Favicon.el.href = g.DEAD ? Unread.postsQuotingYou.length ? Favicon.unreadDeadY : count ? Favicon.unreadDead : Favicon.dead : count ? Unread.postsQuotingYou.length ? Favicon.unreadY : Favicon.unread : Favicon["default"];
    }
  };

  Favicon = {
    init: function() {
      return $.ready(function() {
        var href;

        Favicon.el = $('link[rel="shortcut icon"]', d.head);
        Favicon.el.type = 'image/x-icon';
        href = Favicon.el.href;
        Favicon.SFW = /ws\.ico$/.test(href);
        Favicon["default"] = href;
        return Favicon["switch"]();
      });
    },
    "switch": function() {
      switch (Conf['favicon']) {
        case 'ferongr':
          Favicon.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAOMHAOgLAnMFAL8AAOgLAukMA/+AgP+rq////////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAS1BMVEUAAAAAAAAAAAAJAAASAAAZAQAaAQAiAQAkAQAoFBQyAgAzAgA1AgA4AABBAgBXAwBzBQCEBgGvCAG/AADoCwLpDAP/gID/q6v///9zILr8AAAAA3RSTlMAx9dmesIgAAAAc0lEQVQY02WPgQ6DIBBDmTqnbE70Cvb/v3TAnW5OSKB9ybXg3HUBOAmEEH4FQtrSn4gxi+xjVC9SVOEiSvbZI8zSV+/Xo7icnryZ15GObMxvtWUkB/VJW57kHU7fUcHStm8FkncGE/mwP6CGzq/eauHwvT7sWQt3gZLW+AAAAABJRU5ErkJggg==';
          Favicon.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAADX8QBwfgC2zADX8QDY8nnl8qLp8v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAASFBMVEUAAAAAAAAAAAAACAkAERMAGBsAGR0AISUALzQALzUAMTcANjwAP0cAVF8AcH4AeokAorYAtswA1/EA2PISIyV55fKi6fL////l+pZqAAAAA3RSTlMAx9dmesIgAAAAcklEQVQY02VPARLCIAxjsjnUWdcg6/9/ukIr00nvIMldEhrC/wHwA0BE3wBUtnICOStQnrNx5oqqzmzKx9vDPH1Nae3F9U4ig3OzjCIX51treYvMxou13EQmBPtHE14xLiawjgoPtfgOaKHP+9VrEXA8O1v7CmSPE3u0AAAAAElFTkSuQmCC';
          Favicon.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAFT+ACh5AEncAFT+AFX/Acz/su7/5v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAS1BMVEUAAAAAAAAAAAADCgAGEgAIGgAJGwALJAANJwASNwASOAATOgAVQQAWRAAeWwAgKBsoeQAwkQA/wABJ3ABU/gBV/wHM/7Lu/+b////r+K2AAAAAA3RSTlMAx9dmesIgAAAAc0lEQVQY02WPgQ6DIBBDmTonbk70Cvb/v3TAnW5OSKB9ybXg3HUBOAmEEH4FQtrSn4gxi+xjVC9SVOEiSvbZI8zSV+/Xo7icnryZ15GObMxvtWUmB/VJW0byDqfvqGBp20mB5J3Bi3zYH1BD38/eauHwvT7sEAt1Fb320QAAAABJRU5ErkJggg==';
          break;
        case 'xat-':
          Favicon.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4y61TQQrCMBDMQ8WDIEV6LbT2A4og2Hq0veo7fIAH04dY9N4xmyYlpGmI2MCQTWYy3Wy2DAD7B2wWAzWgcTgVeZKlZRxHNYFi2jM18oBh0IcKtC6ixf22WT4IFLs0owxswXu9egm0Ls6bwfCFfNsJYJKfqoEkd3vgUgFVLWObtzNgVKyruC+ljSzr5OEnBzjvjcQecaQhbZgBb4CmGQw+PoMkTUtdbd8VSEPakcGxPOcsoIgUKy0LecY29BmdBrqRfjIwZ93KLs5loHvBnL3cLH/jF+C/+z5dgUysAAAAAElFTkSuQmCC';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAAAAAACKkJGNkpN0d3d0eHdra2dGRkORZ1wAAACmaV6naV4PDw8LCwsLCwvyZWLyZWIeExEyFBTAWlr/eHj/enkAAAAKAAAoAAA4AAA4GhpMAACRAAD/AAD/enn/h4j/m5z/nJ3/0dL/0tL/0tP/09P///9VK8WFAAAAFnRSTlMAPnp6kpKdtcHEzc3p6u7v8PT7/v7++jx7+QAAAIFJREFUGNONj90OgjAMhStKmU5k/h1UmAzUvv8jSrYBIeGC9qLtl/a0JVphAJKUOU36xNfWWiitlU9GUphZbXF/hxg10Li2QdQgPhQ3133c9XLOJvD9uZfI0YOdiiMiJw+2CKIPkZzGtcbgKYIJaI26LAfQOzOqoYNA4Z49Nguv/gEEhw2/C5BUZgAAAABJRU5ErkJggg==';
          Favicon.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y2P4//8/AyWYgSoGQMF/GJ7Y11VVUVoyKTM9ey4Ig9ggMWQ1YA1IBvzXm34YjkH8mPyJB+Nqlp8FYRAbmxoMF6ArSNrw6T0Qf8Amh9cFMEWVR/7/A+L/uORxhgEIt5/+/3/2lf//5wAxiI0uj+4CBlBgxVUvOwtydgXQZpDmi2/+/7/0GmIQSAwkB1IDUkuUAZeABlx+g2zAZ9wGlAOjChba+LwAUgNSi2HA5Am9VciBhSsQQWyoWgZiovEDsdGI1QBYQiLJAGQalpSxyWEzAJYWkGm8clTJjQCZ1hkoVG0CygAAAABJRU5ErkJggg==';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAAAAAACRjoqTkI13dXR4dXRpZ2tFQ0Zcb5EAAABee6ZefKcPDw8LCwsLCwtisPJisPIRFh4UJDJalMB4xP95xP8AAAABBQcHFx4KISoNLToaKzgaVW4ul8N5xP+Hy/+b1P+c1P/R7P/S6//S7P/T7P////9P0rk0AAAAFnRSTlMAPnp6kpKdtcHEzc3p6u7v8PT7/v7++jx7+QAAAIFJREFUGNONj90OgjAMhStKmU5k/h1UmAzUvv8jSrYBIeGC9qLtl/a0JVphAJKUOU36xNfWWiitlU9GUphZbXF/hxg10Li2QdQgPhQ3133c9XLOJvD9uUrk6MFOxRGRkwdbBNGHSE7jWmPwFMEEtEZdlgPonRmvoYNA4Z49Nguv/gEE3A2/sQ7iRgAAAABJRU5ErkJggg==';
          Favicon.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4y2P4//8/AyWYgSoGQMF/GJ7YNbGqrKRiUnp21lwQBrFBYshqwBqQDPifdsYYjkH8mInxB+OWx58FYRAbmxoMF6ArKPmU9B6IP2CTw+sCmKKe/5X/gPg/LnmcYQDCs/63/1/9fzYQzwGz0eXRXcAACqy4ZfFnQc7u+V/xD6T55v+LQHwJbBBIDCQHUgNSS5QBt4Cab/2/jDDgMx4DykrKJ8FCG58XQGpAajEMmNw7uQo5sHAFIogNVctATDR+IDYasRoAS0gkGYBMw5IyNjlsBsDSAjKNV44quREAx58Mr9vt5wQAAAAASUVORK5CYII=';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAAAAAACRipGTjZN2dHd2dHhna2pDRkVckV8AAABepl9ep18PDw8LCwsLCwt08mJ08mIRHhEYMhRpwFqM/3iM/3kAAAAECAIQIAgWLAseOBoePA86dB1mzDOM/3ma/4er/5ur/5zZ/9HZ/9La/9La/9P///85Jx7jAAAAFnRSTlMAPnp6kpKdtcHEzc3p6u7v8PT7/v7++jx7+QAAAIFJREFUGNONj90OgjAMhStKmU5k/h1UmAzUvv8jSrYBIeGC9qLtl/a0JVphAJKUOU36xNfWWiitlU9GUphZbXF/hxg10Li2QdQgPhQ3133c9XLOJvD9uZfI0YOdiiMiJw+2CKIPkZzGtcbgKYIJaI26LAfQOzOqoYNA4Z49Nguv/gEEhw2/C5BUZgAAAABJRU5ErkJggg==';
          break;
        case 'Mayhem':
          Favicon.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg==';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABj0lEQVQ4y42TQUorQRCGv+oekpj43pOhOyIiKoHBxTMkuAnEtWcwx/AY3sUbBIRcwCw8gCfIMkaTOOUiNdgGRRuKoav+v2qq/i4BakBmXweUwDoxLF5ZhVkC64rYBHYMUAIvwKuBMEwdaFiCNbAAngEC0NHkxBi73vsOsG92HGPsphigY1wOzfNhqhpC6AEd730RQuh9hQEOAY6A/jeAs3a7/f+bWB84ckCpqg+I8Osjgqo+AKUDViJS8LkGMcY+sJrNZssYY387LiIFsBLgL9AC/pgaArzZlF+sZgO4BG7sfgvcA3MxUtOStBIpX7cS3Klqd9OBTIEr4DlLOsuAmqpODXQOiHMuy/O8FkLoJth/6Uh2gQPg87Q3k+7leX6hqnpmPvM/GWfXWeWGqj5+oUS9LMs6wF7iHAwGJ9ZW5uxpup+UGwEtEVoijEYjKl66PJujmvIW3vsFwBiYqzJXZTweY5wSU6Bd7UP1KoECODUrJpOJAtPhcKjAtXGaYptWs57qWyv9Zn/it1a5knj5Dm3v4q8APeACAAAAAElFTkSuQmCC';
          Favicon.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBQcHFx4KISoNLToaVW4oKCgul8M4ODg7OztMTEyRkZHBwcH///9dzWZ0AAAAI3RSTlMEBggKDA4QEhQWFxkbHR8hIyUmKCosLjAxN1hbYc7P0dLc3mzWzBUAAAC+SURBVBjTNY3pcsIwEIM3ePERx/bG5IIe0NIrhVbv/3Y4Ydj9Ic030ogqpY3mDdGGi1EVsYuSvGE2Pkl0TFYAdLGuY1eMWGowzzN6kX41DYVpNbvdKlO4Jx5gSbi2VO+Vcq2jrc/jNLQhtM+n05PfkrKxG/oFHIEXqwqQsVRy7n+AtwLYL3sYR3wA755Jp3Vvv8cn8Js0GXmA7/P5TwzpiLn8MOALuEZNygkm5JTy/+vl4BRVbJvQ1NbWRSxXN64PGOBlhG0qAAAAAElFTkSuQmCC';
          Favicon.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII=';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECAIQIAgWLAsePA8oKCg4ODg6dB07OztMTExmzDORkZHBwcH///92I3mvAAAAI3RSTlMEBggKDA4QEhQWFxkbHR8hIyUmKCosLjAxN1hbYc7P0dLc3mzWzBUAAAC+SURBVBjTNY3pcsIwEIM3ePERx/bG5IIe0NIT0ur93w4nDLs/pPlGGlGltNG8IdpwMaoidlGSN8zGJ4mOyQqALtZ17IoRSw3meUYv0q+moTCtZrdbZQr3xAMsCdeW6r1SrnW09XmchjaE9vl0evJbUjZ2Q7+AI/BiVQEylkrO/TfwVgD7ZQ/jiA/g3TPptO7t9/gEfpImIw/wez7/iSEdMZcfBnwB16hJOcGEnFL+f70cnKKKbROa2tq6iOXqBuMXGTe4CAUbAAAAAElFTkSuQmCC';
          break;
        case 'Original':
          Favicon.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEUAAAAAAAAAAAAAAAAKAAAoAAAoKCg4AAA4ODg7OztMAACRAADBwcH/AAD///+WCcPSAAAAA3RSTlMAx9dmesIgAAAAZ0lEQVQI1z2LsQmAUAxEb4Isk0rwp3EPR3ECcRQrh7C3/nAasPwzmCgYuPBy5AH/NALSImqAK+H1oJRqyJVHNAnZqDITVhj7/PrAciJ9il0BHs/jjU+fnB9sQ0IxX6OBO6Xr0xKAxANLZzUanCWzZQAAAABJRU5ErkJggg==';
          Favicon.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAC6Xw////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEUAAAAAAAAAAAAAAAABBQcHFx4KISoNLToaVW4oKCgul8M4ODg7OzvBwcH///8uS/CdAAAAA3RSTlMAx9dmesIgAAAAZ0lEQVQI1z2LsQ2AUAhEbwKWoftRGvdwBEewchM7d9BFbE6pbP4Mgj+R5MjjwgP+qQSkRtQAV8K3lVI2Q648oknIRpWZsMI4988HjgvpU+wO8HgeHzR9cjZYhoRiPkcDd0rXpyUAiRd5YjKC7MvNRgAAAABJRU5ErkJggg==';
          Favicon.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEUAAAAAAAAAAAAAAAAECAIQIAgWLAsePA8oKCg4ODg6dB07OztmzDPBwcH///+rsf3XAAAAA3RSTlMAx9dmesIgAAAAZ0lEQVQI1z2LsQ2AUAhEbwKWofRL4x6O4AhuopWb2P4F7E5prP4MgiaSHHlceMA/jYC0iBrgSnjdKaUacuURTUI2qsyEFcaxvD6wnkifYleAx/N449Mn5wfbkFDM52jgTun6tAQg8QAEvjQg42KY2AAAAABJRU5ErkJggg==';
      }
      if (Favicon.SFW) {
        Favicon.unread = Favicon.unreadSFW;
        return Favicon.unreadY = Favicon.unreadSFWY;
      } else {
        Favicon.unread = Favicon.unreadNSFW;
        return Favicon.unreadY = Favicon.unreadNSFWY;
      }
    },
    empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  };

  ThreadStats = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Thread Stats']) {
        return;
      }
      this.dialog = UI.dialog('thread-stats', 'bottom: 0; left: 0;', "<div class=move><span id=post-count>0</span> / <span id=file-count>0</span></div>");
      this.postCountEl = $('#post-count', this.dialog);
      this.fileCountEl = $('#file-count', this.dialog);
      return Thread.prototype.callbacks.push({
        name: 'Thread Stats',
        cb: this.node
      });
    },
    node: function() {
      var ID, fileCount, post, postCount, _ref;

      postCount = 0;
      fileCount = 0;
      _ref = this.posts;
      for (ID in _ref) {
        post = _ref[ID];
        postCount++;
        if (post.file) {
          fileCount++;
        }
      }
      ThreadStats.thread = this;
      ThreadStats.update(postCount, fileCount);
      $.on(d, 'ThreadUpdate', ThreadStats.onUpdate);
      return $.add(d.body, ThreadStats.dialog);
    },
    onUpdate: function(e) {
      var fileCount, postCount, _ref;

      if (e.detail[404]) {
        return;
      }
      _ref = e.detail, postCount = _ref.postCount, fileCount = _ref.fileCount;
      return ThreadStats.update(postCount, fileCount);
    },
    update: function(postCount, fileCount) {
      var fileCountEl, postCountEl, thread;

      thread = ThreadStats.thread, postCountEl = ThreadStats.postCountEl, fileCountEl = ThreadStats.fileCountEl;
      postCountEl.textContent = postCount;
      fileCountEl.textContent = fileCount;
      (thread.postLimit && !thread.isSticky ? $.addClass : $.rmClass)(postCountEl, 'warning');
      return (thread.fileLimit && !thread.isSticky ? $.addClass : $.rmClass)(fileCountEl, 'warning');
    }
  };

  ThreadUpdater = {
    init: function() {
      var checked, conf, html, name, _ref;

      if (g.VIEW !== 'thread' || !Conf['Thread Updater']) {
        return;
      }
      html = '';
      _ref = Config.updater.checkbox;
      for (name in _ref) {
        conf = _ref[name];
        checked = Conf[name] ? 'checked' : '';
        html += "<div><label title='" + conf[1] + "'><input name='" + name + "' type=checkbox " + checked + "> " + name + "</label></div>";
      }
      checked = Conf['Auto Update'] ? 'checked' : '';
      html = "<div class=move><span id=update-status></span> <span id=update-timer></span></div>\n" + html + "\n<div><label title='Controls whether *this* thread automatically updates or not'><input type=checkbox name='Auto Update This' " + checked + "> Auto Update This</label></div>\n<div><label><input type=number name=Interval class=field min=5 value=" + Conf['Interval'] + "> Refresh rate (s)</label></div>\n<div><input value='Update' type=button name='Update'></div>";
      this.dialog = UI.dialog('updater', 'bottom: 0; right: 0;', html);
      this.timer = $('#update-timer', this.dialog);
      this.status = $('#update-status', this.dialog);
      return Thread.prototype.callbacks.push({
        name: 'Thread Updater',
        cb: this.node
      });
    },
    node: function() {
      var input, _i, _len, _ref;

      ThreadUpdater.thread = this;
      ThreadUpdater.root = this.OP.nodes.root.parentNode;
      ThreadUpdater.lastPost = +ThreadUpdater.root.lastElementChild.id.match(/\d+/)[0];
      ThreadUpdater.outdateCount = 0;
      ThreadUpdater.lastModified = '0';
      _ref = $$('input', ThreadUpdater.dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        if (input.type === 'checkbox') {
          $.on(input, 'change', $.cb.checked);
        }
        switch (input.name) {
          case 'Scroll BG':
            $.on(input, 'change', ThreadUpdater.cb.scrollBG);
            ThreadUpdater.cb.scrollBG();
            break;
          case 'Auto Update This':
            $.on(input, 'change', ThreadUpdater.cb.autoUpdate);
            $.event('change', null, input);
            break;
          case 'Interval':
            $.on(input, 'change', ThreadUpdater.cb.interval);
            ThreadUpdater.cb.interval.call(input);
            break;
          case 'Update':
            $.on(input, 'click', ThreadUpdater.update);
        }
      }
      $.on(window, 'online offline', ThreadUpdater.cb.online);
      $.on(d, 'QRPostSuccessful', ThreadUpdater.cb.post);
      $.on(d, 'visibilitychange', ThreadUpdater.cb.visibility);
      ThreadUpdater.cb.online();
      return $.add(d.body, ThreadUpdater.dialog);
    },
    /*
    http://freesound.org/people/pierrecartoons1979/sounds/90112/
    cc-by-nc-3.0
    */

    beep: 'data:audio/wav;base64,UklGRjQDAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAc21wbDwAAABBAAADAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkYXRhzAIAAGMms8em0tleMV4zIpLVo8nhfSlcPR102Ki+5JspVEkdVtKzs+K1NEhUIT7DwKrcy0g6WygsrM2k1NpiLl0zIY/WpMrjgCdbPhxw2Kq+5Z4qUkkdU9K1s+K5NkVTITzBwqnczko3WikrqM+l1NxlLF0zIIvXpsnjgydZPhxs2ay95aIrUEkdUdC3suK8N0NUIjq+xKrcz002WioppdGm091pK1w0IIjYp8jkhydXPxxq2K295aUrTkoeTs65suK+OUFUIzi7xqrb0VA0WSoootKm0t5tKlo1H4TYqMfkiydWQBxm16+85actTEseS8y7seHAPD9TIza5yKra01QyWSson9On0d5wKVk2H4DYqcfkjidUQB1j1rG75KsvSkseScu8seDCPz1TJDW2yara1FYxWSwnm9Sn0N9zKVg2H33ZqsXkkihSQR1g1bK65K0wSEsfR8i+seDEQTxUJTOzy6rY1VowWC0mmNWoz993KVc3H3rYq8TklSlRQh1d1LS647AyR0wgRMbAsN/GRDpTJTKwzKrX1l4vVy4lldWpzt97KVY4IXbUr8LZljVPRCxhw7W3z6ZISkw1VK+4sMWvXEhSPk6buay9sm5JVkZNiLWqtrJ+TldNTnquqbCwilZXU1BwpKirrpNgWFhTaZmnpquZbFlbVmWOpaOonHZcXlljhaGhpZ1+YWBdYn2cn6GdhmdhYGN3lp2enIttY2Jjco+bnJuOdGZlZXCImJqakHpoZ2Zug5WYmZJ/bGlobX6RlpeSg3BqaW16jZSVkoZ0bGtteImSk5KIeG5tbnaFkJKRinxxbm91gY2QkIt/c3BwdH6Kj4+LgnZxcXR8iI2OjIR5c3J0e4WLjYuFe3VzdHmCioyLhn52dHR5gIiKioeAeHV1eH+GiYqHgXp2dnh9hIiJh4J8eHd4fIKHiIeDfXl4eHyBhoeHhH96eHmA',
    cb: {
      online: function() {
        if (ThreadUpdater.online = navigator.onLine) {
          ThreadUpdater.outdateCount = 0;
          ThreadUpdater.set('timer', ThreadUpdater.getInterval());
          if (Conf['Auto Update This']) {
            ThreadUpdater.update();
          }
          ThreadUpdater.set('status', null, null);
        } else {
          ThreadUpdater.set('timer', null);
          ThreadUpdater.set('status', 'Offline', 'warning');
        }
        return ThreadUpdater.cb.autoUpdate();
      },
      post: function(e) {
        if (!(Conf['Auto Update This'] && e.detail.threadID === ThreadUpdater.thread.ID)) {
          return;
        }
        ThreadUpdater.outdateCount = 0;
        if (ThreadUpdater.seconds > 2) {
          return setTimeout(ThreadUpdater.update, 1000);
        }
      },
      visibility: function() {
        if (d.hidden) {
          return;
        }
        ThreadUpdater.outdateCount = 0;
        if (ThreadUpdater.seconds > ThreadUpdater.interval) {
          return ThreadUpdater.set('timer', ThreadUpdater.getInterval());
        }
      },
      scrollBG: function() {
        return ThreadUpdater.scrollBG = Conf['Scroll BG'] ? function() {
          return true;
        } : function() {
          return !d.hidden;
        };
      },
      autoUpdate: function() {
        if (Conf['Auto Update This'] && ThreadUpdater.online) {
          return ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.timeout, 1000);
        } else {
          return clearTimeout(ThreadUpdater.timeoutID);
        }
      },
      interval: function() {
        var val;

        val = Math.max(5, parseInt(this.value, 10));
        ThreadUpdater.interval = this.value = val;
        return $.cb.value.call(this);
      },
      load: function() {
        var klass, req, text, _ref, _ref1;

        req = ThreadUpdater.req;
        switch (req.status) {
          case 200:
            g.DEAD = false;
            ThreadUpdater.parse(JSON.parse(req.response).posts);
            ThreadUpdater.lastModified = req.getResponseHeader('Last-Modified');
            ThreadUpdater.set('timer', ThreadUpdater.getInterval());
            break;
          case 404:
            g.DEAD = true;
            ThreadUpdater.set('timer', null);
            ThreadUpdater.set('status', '404', 'warning');
            clearTimeout(ThreadUpdater.timeoutID);
            ThreadUpdater.thread.kill();
            $.event('ThreadUpdate', {
              404: true,
              thread: ThreadUpdater.thread
            });
            break;
          default:
            ThreadUpdater.outdateCount++;
            ThreadUpdater.set('timer', ThreadUpdater.getInterval());
            /*
            Status Code 304: Not modified
            By sending the `If-Modified-Since` header we get a proper status code, and no response.
            This saves bandwidth for both the user and the servers and avoid unnecessary computation.
            */

            _ref1 = (_ref = req.status) === 0 || _ref === 304 ? [null, null] : ["" + req.statusText + " (" + req.status + ")", 'warning'], text = _ref1[0], klass = _ref1[1];
            ThreadUpdater.set('status', text, klass);
        }
        return delete ThreadUpdater.req;
      }
    },
    getInterval: function() {
      var i, j;

      i = ThreadUpdater.interval;
      j = Math.min(ThreadUpdater.outdateCount, 10);
      if (!d.hidden) {
        j = Math.min(j, 7);
      }
      return ThreadUpdater.seconds = Math.max(i, [0, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10][j]);
    },
    set: function(name, text, klass) {
      var el, node;

      el = ThreadUpdater[name];
      if (node = el.firstChild) {
        node.data = text;
      } else {
        el.textContent = text;
      }
      if (klass !== void 0) {
        return el.className = klass;
      }
    },
    timeout: function() {
      var n;

      ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.timeout, 1000);
      if (!(n = --ThreadUpdater.seconds)) {
        return ThreadUpdater.update();
      } else if (n <= -60) {
        ThreadUpdater.set('status', 'Retrying', null);
        return ThreadUpdater.update();
      } else if (n > 0) {
        return ThreadUpdater.set('timer', n);
      }
    },
    update: function() {
      var url;

      if (!ThreadUpdater.online) {
        return;
      }
      ThreadUpdater.seconds = 0;
      ThreadUpdater.set('timer', '...');
      if (ThreadUpdater.req) {
        ThreadUpdater.req.onloadend = null;
        ThreadUpdater.req.abort();
      }
      url = "//api.4chan.org/" + ThreadUpdater.thread.board + "/res/" + ThreadUpdater.thread + ".json";
      return ThreadUpdater.req = $.ajax(url, {
        onloadend: ThreadUpdater.cb.load
      }, {
        headers: {
          'If-Modified-Since': ThreadUpdater.lastModified
        }
      });
    },
    updateThreadStatus: function(title, OP) {
      var icon, message, root, titleLC;

      titleLC = title.toLowerCase();
      if (ThreadUpdater.thread["is" + title] === !!OP[titleLC]) {
        return;
      }
      if (!(ThreadUpdater.thread["is" + title] = !!OP[titleLC])) {
        message = title === 'Sticky' ? 'The thread is not a sticky anymore.' : 'The thread is not closed anymore.';
        new Notification('info', message, 30);
        $.rm($("." + titleLC + "Icon", ThreadUpdater.thread.OP.nodes.info));
        return;
      }
      message = title === 'Sticky' ? 'The thread is now a sticky.' : 'The thread is now closed.';
      new Notification('info', message, 30);
      icon = $.el('img', {
        src: "//static.4chan.org/image/" + titleLC + ".gif",
        alt: title,
        title: title,
        className: "" + titleLC + "Icon"
      });
      root = $('[title="Quote this post"]', ThreadUpdater.thread.OP.nodes.info);
      if (title === 'Closed') {
        root = $('.stickyIcon', ThreadUpdater.thread.OP.nodes.info) || root;
      }
      return $.after(root, [$.tn(' '), icon]);
    },
    parse: function(postObjects) {
      var ID, OP, count, deletedFiles, deletedPosts, files, index, node, nodes, num, post, postObject, posts, scroll, _i, _len, _ref;

      OP = postObjects[0];
      Build.spoilerRange[ThreadUpdater.thread.board] = OP.custom_spoiler;
      ThreadUpdater.updateThreadStatus('Sticky', OP);
      ThreadUpdater.updateThreadStatus('Closed', OP);
      ThreadUpdater.thread.postLimit = !!OP.bumplimit;
      ThreadUpdater.thread.fileLimit = !!OP.imagelimit;
      nodes = [];
      posts = [];
      index = [];
      files = [];
      count = 0;
      for (_i = 0, _len = postObjects.length; _i < _len; _i++) {
        postObject = postObjects[_i];
        num = postObject.no;
        index.push(num);
        if (postObject.fsize) {
          files.push(num);
        }
        if (num <= ThreadUpdater.lastPost) {
          continue;
        }
        count++;
        node = Build.postFromObject(postObject, ThreadUpdater.thread.board);
        nodes.push(node);
        posts.push(new Post(node, ThreadUpdater.thread, ThreadUpdater.thread.board));
      }
      deletedPosts = [];
      deletedFiles = [];
      _ref = ThreadUpdater.thread.posts;
      for (ID in _ref) {
        post = _ref[ID];
        ID = +ID;
        if (post.isDead && __indexOf.call(index, ID) >= 0) {
          post.resurrect();
        } else if (__indexOf.call(index, ID) < 0) {
          post.kill();
          deletedPosts.push(post);
        } else if (post.file && !post.file.isDead && __indexOf.call(files, ID) < 0) {
          post.kill(true);
          deletedFiles.push(post);
        }
      }
      if (!count) {
        ThreadUpdater.set('status', null, null);
        ThreadUpdater.outdateCount++;
      } else {
        ThreadUpdater.set('status', "+" + count, 'new');
        ThreadUpdater.outdateCount = 0;
        if (Conf['Beep'] && d.hidden && Unread.posts && !Unread.posts.length) {
          if (!ThreadUpdater.audio) {
            ThreadUpdater.audio = $.el('audio', {
              src: ThreadUpdater.beep
            });
          }
          ThreadUpdater.audio.play();
        }
        ThreadUpdater.lastPost = posts[count - 1].ID;
        Main.callbackNodes(Post, posts);
        scroll = Conf['Auto Scroll'] && ThreadUpdater.scrollBG() && ThreadUpdater.root.getBoundingClientRect().bottom - doc.clientHeight < 25;
        $.add(ThreadUpdater.root, nodes);
        if (scroll) {
          if (Conf['Bottom Scroll']) {
            ($.engine === 'webkit' ? d.body : doc).scrollTop = d.body.clientHeight;
          } else {
            Header.scrollToPost(nodes[0]);
          }
        }
        $.queueTask(function() {
          var length, threadID;

          threadID = ThreadUpdater.thread.ID;
          length = $$('.thread > .postContainer', ThreadUpdater.root).length;
          if (Conf['Enable 4chan\'s Extension']) {
            return $.globalEval("Parser.parseThread(" + threadID + ", " + (-count) + ")");
          } else {
            return Fourchan.parseThread(threadID, length - count, length);
          }
        });
      }
      return $.event('ThreadUpdate', {
        404: false,
        thread: ThreadUpdater.thread,
        newPosts: posts,
        deletedPosts: deletedPosts,
        deletedFiles: deletedFiles,
        postCount: OP.replies + 1,
        fileCount: OP.images + (!!ThreadUpdater.thread.OP.file && !ThreadUpdater.thread.OP.file.isDead)
      });
    }
  };

  ThreadWatcher = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Thread Watcher']) {
        return;
      }
      this.dialog = UI.dialog('watcher', 'top: 50px; left: 0px;', '<div class=move>Thread Watcher</div>');
      $.on(d, 'QRPostSuccessful', this.cb.post);
      $.on(d, '4chanXInitFinished', this.ready);
      $.sync('WatchedThreads', this.refresh);
      return Thread.prototype.callbacks.push({
        name: 'Thread Watcher',
        cb: this.node
      });
    },
    node: function() {
      var favicon,
        _this = this;

      favicon = $.el('img', {
        className: 'favicon'
      });
      $.on(favicon, 'click', ThreadWatcher.cb.toggle);
      $.before($('input', this.OP.nodes.post), favicon);
      if (g.VIEW !== 'thread') {
        return;
      }
      return $.get('AutoWatch', 0, function(item) {
        if (item['AutoWatch'] !== _this.ID) {
          return;
        }
        ThreadWatcher.watch(_this);
        return $["delete"]('AutoWatch');
      });
    },
    ready: function() {
      if (!Main.isThisPageLegit()) {
        return;
      }
      ThreadWatcher.refresh();
      return $.add(d.body, ThreadWatcher.dialog);
    },
    refresh: function(watched) {
      var ID, board, div, favicon, id, link, nodes, props, thread, x, _ref, _ref1;

      if (!watched) {
        $.get('WatchedThreads', {}, function(item) {
          return ThreadWatcher.refresh(item['WatchedThreads']);
        });
        return;
      }
      nodes = [$('.move', ThreadWatcher.dialog)];
      for (board in watched) {
        _ref = watched[board];
        for (id in _ref) {
          props = _ref[id];
          x = $.el('a', {
            textContent: '×',
            href: 'javascript:;'
          });
          $.on(x, 'click', ThreadWatcher.cb.x);
          link = $.el('a', props);
          link.title = link.textContent;
          div = $.el('div');
          $.add(div, [x, $.tn(' '), link]);
          nodes.push(div);
        }
      }
      ThreadWatcher.dialog.innerHTML = '';
      $.add(ThreadWatcher.dialog, nodes);
      watched = watched[g.BOARD] || {};
      _ref1 = g.BOARD.threads;
      for (ID in _ref1) {
        thread = _ref1[ID];
        favicon = $('.favicon', thread.OP.nodes.post);
        favicon.src = ID in watched ? Favicon["default"] : Favicon.empty;
      }
    },
    cb: {
      toggle: function() {
        return ThreadWatcher.toggle(Get.postFromNode(this).thread);
      },
      x: function() {
        var thread;

        thread = this.nextElementSibling.pathname.split('/');
        return ThreadWatcher.unwatch(thread[1], thread[3]);
      },
      post: function(e) {
        var board, postID, threadID, _ref;

        _ref = e.detail, board = _ref.board, postID = _ref.postID, threadID = _ref.threadID;
        if (postID === threadID) {
          if (Conf['Auto Watch']) {
            return $.set('AutoWatch', threadID);
          }
        } else if (Conf['Auto Watch Reply']) {
          return ThreadWatcher.watch(board.threads[threadID]);
        }
      }
    },
    toggle: function(thread) {
      if ($('.favicon', thread.OP.nodes.post).src === Favicon.empty) {
        return ThreadWatcher.watch(thread);
      } else {
        return ThreadWatcher.unwatch(thread.board, thread.ID);
      }
    },
    unwatch: function(board, threadID) {
      return $.get('WatchedThreads', {}, function(item) {
        var watched;

        watched = item['WatchedThreads'];
        delete watched[board][threadID];
        if (!Object.keys(watched[board]).length) {
          delete watched[board];
        }
        ThreadWatcher.refresh(watched);
        return $.set('WatchedThreads', watched);
      });
    },
    watch: function(thread) {
      return $.get('WatchedThreads', {}, function(item) {
        var watched, _name;

        watched = item['WatchedThreads'];
        watched[_name = thread.board] || (watched[_name] = {});
        watched[thread.board][thread] = {
          href: "/" + thread.board + "/res/" + thread,
          textContent: Get.threadExcerpt(thread)
        };
        ThreadWatcher.refresh(watched);
        return $.set('WatchedThreads', watched);
      });
    }
  };

  QR = {
    init: function() {
      if (!Conf['Quick Reply']) {
        return;
      }
      this.db = new DataBoard('yourPosts');
      if (Conf['Hide Original Post Form']) {
        $.addClass(doc, 'hide-original-post-form');
      }
      $.on(d, '4chanXInitFinished', this.initReady);
      return Post.prototype.callbacks.push({
        name: 'Quick Reply',
        cb: this.node
      });
    },
    initReady: function() {
      var sc;

      QR.postingIsEnabled = !!$.id('postForm');
      if (!QR.postingIsEnabled) {
        return;
      }
      sc = $.el('a', {
        className: 'qr-shortcut',
        textContent: 'QR',
        title: 'Quick Reply',
        href: 'javascript:;'
      });
      $.on(sc, 'click', function() {
        $.event('CloseMenu');
        QR.open();
        QR.resetThreadSelector();
        return QR.nodes.com.focus();
      });
      Header.addShortcut(sc);
      if ($.engine === 'webkit') {
        $.on(d, 'paste', QR.paste);
      }
      $.on(d, 'dragover', QR.dragOver);
      $.on(d, 'drop', QR.dropFile);
      $.on(d, 'dragstart dragend', QR.drag);
      $.on(d, 'ThreadUpdate', function() {
        if (g.DEAD) {
          return QR.abort();
        } else {
          return QR.status();
        }
      });
      if (Conf['Persistent QR']) {
        return QR.persist();
      }
    },
    node: function() {
      return $.on($('a[title="Quote this post"]', this.nodes.info), 'click', QR.quote);
    },
    persist: function() {
      QR.open();
      if (Conf['Auto-Hide QR']) {
        return QR.hide();
      }
    },
    open: function() {
      var err;

      if (QR.nodes) {
        QR.nodes.el.hidden = false;
        QR.unhide();
        return;
      }
      try {
        return QR.dialog();
      } catch (_error) {
        err = _error;
        delete QR.nodes;
        return Main.handleErrors({
          message: 'Quick Reply dialog creation crashed.',
          error: err
        });
      }
    },
    close: function() {
      var i, _i, _len, _ref;

      if (QR.req) {
        QR.abort();
        return;
      }
      QR.nodes.el.hidden = true;
      QR.cleanNotifications();
      d.activeElement.blur();
      $.rmClass(QR.nodes.el, 'dump');
      _ref = QR.posts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        QR.posts[0].rm();
      }
      QR.cooldown.auto = false;
      QR.status();
      if (!Conf['Remember Spoiler'] && QR.nodes.spoiler.checked) {
        return QR.nodes.spoiler.click();
      }
    },
    hide: function() {
      d.activeElement.blur();
      $.addClass(QR.nodes.el, 'autohide');
      return QR.nodes.autohide.checked = true;
    },
    unhide: function() {
      $.rmClass(QR.nodes.el, 'autohide');
      return QR.nodes.autohide.checked = false;
    },
    toggleHide: function() {
      if (this.checked) {
        return QR.hide();
      } else {
        return QR.unhide();
      }
    },
    error: function(err) {
      var el;

      QR.open();
      if (typeof err === 'string') {
        el = $.tn(err);
      } else {
        el = err;
        el.removeAttribute('style');
      }
      if (QR.captcha.isEnabled && /captcha|verification/i.test(el.textContent)) {
        QR.captcha.nodes.input.focus();
      }
      if (d.hidden) {
        alert(el.textContent);
      }
      return QR.notifications.push(new Notification('warning', el));
    },
    notifications: [],
    cleanNotifications: function() {
      var notification, _i, _len, _ref;

      _ref = QR.notifications;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        notification = _ref[_i];
        notification.close();
      }
      return QR.notifications = [];
    },
    status: function() {
      var disabled, status, value;

      if (!QR.nodes) {
        return;
      }
      if (g.DEAD) {
        value = 404;
        disabled = true;
        QR.cooldown.auto = false;
      }
      value = QR.req ? QR.req.progress : QR.cooldown.seconds || value;
      status = QR.nodes.status;
      status.value = !value ? 'Submit' : QR.cooldown.auto ? "Auto " + value : value;
      return status.disabled = disabled || false;
    },
    cooldown: {
      init: function() {
        var board;

        if (!Conf['Cooldown']) {
          return;
        }
        board = g.BOARD.ID;
        QR.cooldown.types = {
          thread: (function() {
            switch (board) {
              case 'q':
                return 86400;
              case 'b':
              case 'soc':
              case 'r9k':
                return 600;
              default:
                return 300;
            }
          })(),
          sage: board === 'q' ? 600 : 60,
          file: board === 'q' ? 300 : 30,
          post: board === 'q' ? 60 : 30
        };
        QR.cooldown.upSpd = 0;
        QR.cooldown.upSpdAccuracy = .5;
        $.get("cooldown." + board, {}, function(item) {
          QR.cooldown.cooldowns = item["cooldown." + board];
          return QR.cooldown.start();
        });
        return $.sync("cooldown." + board, QR.cooldown.sync);
      },
      start: function() {
        if (!Conf['Cooldown']) {
          return;
        }
        if (QR.cooldown.isCounting) {
          return;
        }
        QR.cooldown.isCounting = true;
        return QR.cooldown.count();
      },
      sync: function(cooldowns) {
        var id;

        for (id in cooldowns) {
          QR.cooldown.cooldowns[id] = cooldowns[id];
        }
        return QR.cooldown.start();
      },
      set: function(data) {
        var cooldown, delay, hasFile, isReply, isSage, post, req, start, type, upSpd;

        if (!Conf['Cooldown']) {
          return;
        }
        req = data.req, post = data.post, isReply = data.isReply, delay = data.delay;
        start = req ? req.uploadEndTime : Date.now();
        if (delay) {
          cooldown = {
            delay: delay
          };
        } else {
          if (post.file) {
            upSpd = post.file.size / ((req.uploadEndTime - req.uploadStartTime) / $.SECOND);
            QR.cooldown.upSpdAccuracy = ((upSpd > QR.cooldown.upSpd * .9) + QR.cooldown.upSpdAccuracy) / 2;
            QR.cooldown.upSpd = upSpd;
          }
          isSage = /sage/i.test(post.email);
          hasFile = !!post.file;
          type = !isReply ? 'thread' : isSage ? 'sage' : hasFile ? 'file' : 'post';
          cooldown = {
            isReply: isReply,
            isSage: isSage,
            hasFile: hasFile,
            timeout: start + QR.cooldown.types[type] * $.SECOND
          };
        }
        QR.cooldown.cooldowns[start] = cooldown;
        $.set("cooldown." + g.BOARD, QR.cooldown.cooldowns);
        return QR.cooldown.start();
      },
      unset: function(id) {
        delete QR.cooldown.cooldowns[id];
        if (Object.keys(QR.cooldown.cooldowns).length) {
          return $.set("cooldown." + g.BOARD, QR.cooldown.cooldowns);
        } else {
          return $["delete"]("cooldown." + g.BOARD);
        }
      },
      count: function() {
        var cooldown, cooldowns, elapsed, hasFile, isReply, isSage, now, post, seconds, start, type, types, upSpd, upSpdAccuracy, update, _ref;

        if (!Object.keys(QR.cooldown.cooldowns).length) {
          $["delete"]("" + g.BOARD + ".cooldown");
          delete QR.cooldown.isCounting;
          delete QR.cooldown.seconds;
          QR.status();
          return;
        }
        setTimeout(QR.cooldown.count, $.SECOND);
        now = Date.now();
        post = QR.posts[0];
        isReply = QR.nodes.thread.value !== 'new';
        isSage = /sage/i.test(post.email);
        hasFile = !!post.file;
        seconds = null;
        _ref = QR.cooldown, types = _ref.types, cooldowns = _ref.cooldowns, upSpd = _ref.upSpd, upSpdAccuracy = _ref.upSpdAccuracy;
        for (start in cooldowns) {
          cooldown = cooldowns[start];
          if ('delay' in cooldown) {
            if (cooldown.delay) {
              seconds = Math.max(seconds, cooldown.delay--);
            } else {
              seconds = Math.max(seconds, 0);
              QR.cooldown.unset(start);
            }
            continue;
          }
          if (isReply === cooldown.isReply) {
            type = !isReply ? 'thread' : isSage && cooldown.isSage ? 'sage' : hasFile && cooldown.hasFile ? 'file' : 'post';
            elapsed = Math.floor((now - start) / $.SECOND);
            if (elapsed >= 0) {
              seconds = Math.max(seconds, types[type] - elapsed);
              if (hasFile && upSpd) {
                seconds -= Math.floor(post.file.size / upSpd * upSpdAccuracy);
                seconds = Math.max(seconds, 0);
              }
            }
          }
          if (!((start <= now && now <= cooldown.timeout))) {
            QR.cooldown.unset(start);
          }
        }
        update = seconds !== null || !!QR.cooldown.seconds;
        QR.cooldown.seconds = seconds;
        if (update) {
          QR.status();
        }
        if (seconds === 0 && QR.cooldown.auto && !QR.req) {
          return QR.submit();
        }
      }
    },
    quote: function(e) {
      var OP, caretPos, post, range, s, sel, selectionRoot, ta, text;

      if (e != null) {
        e.preventDefault();
      }
      if (!QR.postingIsEnabled) {
        return;
      }
      sel = d.getSelection();
      selectionRoot = $.x('ancestor::div[contains(@class,"postContainer")][1]', sel.anchorNode);
      post = Get.postFromNode(this);
      OP = Get.contextFromLink(this).thread.OP;
      text = ">>" + post + "\n";
      if ((s = sel.toString().trim()) && post.nodes.root === selectionRoot) {
        s = s.replace(/\n/g, '\n>');
        text += ">" + s + "\n";
      }
      QR.open();
      ta = QR.nodes.com;
      if (!ta.value) {
        QR.nodes.thread.value = OP.ID;
      }
      caretPos = ta.selectionStart;
      ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd);
      range = caretPos + text.length;
      ta.setSelectionRange(range, range);
      ta.focus();
      return $.event('input', null, ta);
    },
    characterCount: function() {
      var count, counter;

      counter = QR.nodes.charCount;
      count = QR.nodes.com.textLength;
      counter.textContent = count;
      counter.hidden = count < 1000;
      return (count > 1500 ? $.addClass : $.rmClass)(counter, 'warning');
    },
    drag: function(e) {
      var toggle;

      toggle = e.type === 'dragstart' ? $.off : $.on;
      toggle(d, 'dragover', QR.dragOver);
      return toggle(d, 'drop', QR.dropFile);
    },
    dragOver: function(e) {
      e.preventDefault();
      return e.dataTransfer.dropEffect = 'copy';
    },
    dropFile: function(e) {
      if (!e.dataTransfer.files.length) {
        return;
      }
      e.preventDefault();
      QR.open();
      QR.fileInput(e.dataTransfer.files);
      return $.addClass(QR.nodes.el, 'dump');
    },
    paste: function(e) {
      var blob, files, item, _i, _len, _ref;

      files = [];
      _ref = e.clipboardData.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.kind === 'file') {
          blob = item.getAsFile();
          blob.name = 'file';
          if (blob.type) {
            blob.name += '.' + blob.type.split('/')[1];
          }
          files.push(blob);
        }
      }
      if (!files.length) {
        return;
      }
      QR.open();
      return QR.fileInput(files);
    },
    openFileInput: function() {
      return QR.nodes.fileInput.click();
    },
    fileInput: function(files) {
      var file, length, max, post, _i, _len, _ref, _ref1;

      if (this instanceof Element) {
        files = __slice.call(this.files);
        QR.nodes.fileInput.value = null;
      }
      length = files.length;
      if (!length) {
        return;
      }
      max = QR.nodes.fileInput.max;
      QR.cleanNotifications();
      if (length === 1) {
        file = files[0];
        if (/^text/.test(file.type)) {
          QR.selected.pasteText(file);
        } else if (file.size > max) {
          QR.error("File too large (file: " + ($.bytesToString(file.size)) + ", max: " + ($.bytesToString(max)) + ").");
        } else if (_ref = file.type, __indexOf.call(QR.mimeTypes, _ref) < 0) {
          QR.error('Unsupported file type.');
        } else {
          QR.selected.setFile(file);
        }
        return;
      }
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (/^text/.test(file.type)) {
          if ((post = QR.posts[QR.posts.length - 1]).com) {
            post = new QR.post();
          }
          post.pasteText(file);
        } else if (file.size > max) {
          QR.error("" + file.name + ": File too large (file: " + ($.bytesToString(file.size)) + ", max: " + ($.bytesToString(max)) + ").");
        } else if (_ref1 = file.type, __indexOf.call(QR.mimeTypes, _ref1) < 0) {
          QR.error("" + file.name + ": Unsupported file type.");
        } else {
          if ((post = QR.posts[QR.posts.length - 1]).file) {
            post = new QR.post();
          }
          post.setFile(file);
        }
      }
      return $.addClass(QR.nodes.el, 'dump');
    },
    resetThreadSelector: function() {
      if (g.VIEW === 'thread') {
        return QR.nodes.thread.value = g.THREADID;
      } else {
        return QR.nodes.thread.value = 'new';
      }
    },
    posts: [],
    post: (function() {
      function _Class(select) {
        var el, event, prev, _i, _len, _ref,
          _this = this;

        el = $.el('a', {
          className: 'qr-preview',
          draggable: true,
          href: 'javascript:;',
          innerHTML: '<a class=remove>×</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
        });
        this.nodes = {
          el: el,
          rm: el.firstChild,
          label: $('label', el),
          spoiler: $('input', el),
          span: el.lastChild
        };
        this.nodes.spoiler.checked = this.spoiler;
        $.on(el, 'click', this.select.bind(this));
        $.on(this.nodes.rm, 'click', function(e) {
          e.stopPropagation();
          return _this.rm();
        });
        $.on(this.nodes.label, 'click', function(e) {
          return e.stopPropagation();
        });
        $.on(this.nodes.spoiler, 'change', function(e) {
          _this.spoiler = e.target.checked;
          if (_this === QR.selected) {
            return QR.nodes.spoiler.checked = _this.spoiler;
          }
        });
        $.add(QR.nodes.dumpList, el);
        _ref = ['dragStart', 'dragEnter', 'dragLeave', 'dragOver', 'dragEnd', 'drop'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          $.on(el, event.toLowerCase(), this[event]);
        }
        prev = QR.posts[QR.posts.length - 1];
        QR.posts.push(this);
        this.spoiler = prev && Conf['Remember Spoiler'] ? prev.spoiler : false;
        $.get('QR.persona', {}, function(item) {
          var persona;

          persona = item['QR.persona'];
          _this.name = prev ? prev.name : persona.name;
          _this.email = prev && !/^sage$/.test(prev.email) ? prev.email : persona.email;
          if (Conf['Remember Subject']) {
            _this.sub = prev ? prev.sub : persona.sub;
          }
          if (QR.selected === _this) {
            return _this.load();
          }
        });
        if (select) {
          this.select();
        }
        this.unlock();
      }

      _Class.prototype.rm = function() {
        var index;

        $.rm(this.nodes.el);
        index = QR.posts.indexOf(this);
        if (QR.posts.length === 1) {
          new QR.post(true);
        } else if (this === QR.selected) {
          (QR.posts[index - 1] || QR.posts[index + 1]).select();
        }
        QR.posts.splice(index, 1);
        if (!window.URL) {
          return;
        }
        return URL.revokeObjectURL(this.URL);
      };

      _Class.prototype.lock = function(lock) {
        var name, _i, _len, _ref;

        if (lock == null) {
          lock = true;
        }
        this.isLocked = lock;
        if (this !== QR.selected) {
          return;
        }
        _ref = ['name', 'email', 'sub', 'com', 'fileButton', 'spoiler'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          QR.nodes[name].disabled = lock;
        }
        this.nodes.rm.style.visibility = QR.nodes.fileRM.style.visibility = lock ? 'hidden' : '';
        (lock ? $.off : $.on)(QR.nodes.filename.parentNode, 'click', QR.openFileInput);
        this.nodes.spoiler.disabled = lock;
        return this.nodes.el.draggable = !lock;
      };

      _Class.prototype.unlock = function() {
        return this.lock(false);
      };

      _Class.prototype.select = function() {
        var rectEl, rectList;

        if (QR.selected) {
          QR.selected.nodes.el.id = null;
          QR.selected.forceSave();
        }
        QR.selected = this;
        this.lock(this.isLocked);
        this.nodes.el.id = 'selected';
        rectEl = this.nodes.el.getBoundingClientRect();
        rectList = this.nodes.el.parentNode.getBoundingClientRect();
        this.nodes.el.parentNode.scrollLeft += rectEl.left + rectEl.width / 2 - rectList.left - rectList.width / 2;
        return this.load();
      };

      _Class.prototype.load = function() {
        var name, _i, _len, _ref;

        _ref = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          QR.nodes[name].value = this[name] || null;
        }
        this.showFileData();
        return QR.characterCount();
      };

      _Class.prototype.save = function(input) {
        var value, _ref;

        value = input.value;
        this[input.dataset.name] = value;
        if (input.nodeName !== 'TEXTAREA') {
          return;
        }
        this.nodes.span.textContent = value;
        QR.characterCount();
        if (QR.cooldown.auto && this === QR.posts[0] && (0 < (_ref = QR.cooldown.seconds) && _ref <= 5)) {
          return QR.cooldown.auto = false;
        }
      };

      _Class.prototype.forceSave = function() {
        var name, _i, _len, _ref;

        if (this !== QR.selected) {
          return;
        }
        _ref = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          this.save(QR.nodes[name]);
        }
      };

      _Class.prototype.setFile = function(file) {
        this.file = file;
        this.filename = "" + file.name + " (" + ($.bytesToString(file.size)) + ")";
        this.nodes.el.title = this.filename;
        if (QR.spoiler) {
          this.nodes.label.hidden = false;
        }
        if (window.URL) {
          URL.revokeObjectURL(this.URL);
        }
        this.showFileData();
        if (!/^image/.test(file.type)) {
          this.nodes.el.style.backgroundImage = null;
          return;
        }
        return this.setThumbnail();
      };

      _Class.prototype.setThumbnail = function(fileURL) {
        var img, reader,
          _this = this;

        if (!window.URL) {
          if (!fileURL) {
            reader = new FileReader();
            reader.onload = function(e) {
              return _this.setThumbnail(e.target.result);
            };
            reader.readAsDataURL(this.file);
            return;
          }
        } else {
          fileURL = URL.createObjectURL(this.file);
        }
        img = $.el('img');
        img.onload = function() {
          var applyBlob, cv, data, height, i, l, s, ui8a, width, _i;

          s = 90 * 2;
          if (_this.file.type === 'image/gif') {
            s *= 3;
          }
          height = img.height, width = img.width;
          if (height < s || width < s) {
            if (window.URL) {
              _this.URL = fileURL;
            }
            _this.nodes.el.style.backgroundImage = "url(" + _this.URL + ")";
            return;
          }
          if (height <= width) {
            width = s / height * width;
            height = s;
          } else {
            height = s / width * height;
            width = s;
          }
          cv = $.el('canvas');
          cv.height = img.height = height;
          cv.width = img.width = width;
          cv.getContext('2d').drawImage(img, 0, 0, width, height);
          if (!window.URL) {
            _this.nodes.el.style.backgroundImage = "url(" + (cv.toDataURL()) + ")";
            delete _this.URL;
            return;
          }
          URL.revokeObjectURL(fileURL);
          applyBlob = function(blob) {
            _this.URL = URL.createObjectURL(blob);
            return _this.nodes.el.style.backgroundImage = "url(" + _this.URL + ")";
          };
          if (cv.toBlob) {
            cv.toBlob(applyBlob);
            return;
          }
          data = atob(cv.toDataURL().split(',')[1]);
          l = data.length;
          ui8a = new Uint8Array(l);
          for (i = _i = 0; 0 <= l ? _i < l : _i > l; i = 0 <= l ? ++_i : --_i) {
            ui8a[i] = data.charCodeAt(i);
          }
          return applyBlob(new Blob([ui8a], {
            type: 'image/png'
          }));
        };
        return img.src = fileURL;
      };

      _Class.prototype.rmFile = function() {
        delete this.file;
        delete this.filename;
        this.nodes.el.title = null;
        this.nodes.el.style.backgroundImage = null;
        if (QR.spoiler) {
          this.nodes.label.hidden = true;
        }
        this.showFileData();
        if (!window.URL) {
          return;
        }
        return URL.revokeObjectURL(this.URL);
      };

      _Class.prototype.showFileData = function(hide) {
        if (this.file) {
          QR.nodes.filename.textContent = this.filename;
          QR.nodes.filename.title = this.filename;
          if (QR.spoiler) {
            QR.nodes.spoiler.checked = this.spoiler;
          }
          return $.addClass(QR.nodes.fileSubmit, 'has-file');
        } else {
          return $.rmClass(QR.nodes.fileSubmit, 'has-file');
        }
      };

      _Class.prototype.pasteText = function(file) {
        var reader,
          _this = this;

        reader = new FileReader();
        reader.onload = function(e) {
          var text;

          text = e.target.result;
          if (_this.com) {
            _this.com += "\n" + text;
          } else {
            _this.com = text;
          }
          if (QR.selected === _this) {
            QR.nodes.com.value = _this.com;
          }
          return _this.nodes.span.textContent = _this.com;
        };
        return reader.readAsText(file);
      };

      _Class.prototype.dragStart = function() {
        return $.addClass(this, 'drag');
      };

      _Class.prototype.dragEnd = function() {
        return $.rmClass(this, 'drag');
      };

      _Class.prototype.dragEnter = function() {
        return $.addClass(this, 'over');
      };

      _Class.prototype.dragLeave = function() {
        return $.rmClass(this, 'over');
      };

      _Class.prototype.dragOver = function(e) {
        e.preventDefault();
        return e.dataTransfer.dropEffect = 'move';
      };

      _Class.prototype.drop = function() {
        var el, index, newIndex, oldIndex, post;

        el = $('.drag', this.parentNode);
        $.rmClass(el, 'drag');
        $.rmClass(this, 'over');
        if (!this.draggable) {
          return;
        }
        index = function(el) {
          return __slice.call(el.parentNode.children).indexOf(el);
        };
        oldIndex = index(el);
        newIndex = index(this);
        (oldIndex < newIndex ? $.after : $.before)(this, el);
        post = QR.posts.splice(oldIndex, 1)[0];
        return QR.posts.splice(newIndex, 0, post);
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        if (d.cookie.indexOf('pass_enabled=1') >= 0) {
          return;
        }
        if (!(this.isEnabled = !!$.id('captchaFormPart'))) {
          return;
        }
        return $.asap((function() {
          return $.id('recaptcha_challenge_field_holder');
        }), this.ready.bind(this));
      },
      ready: function() {
        var MutationObserver, imgContainer, input, observer, setLifetime,
          _this = this;

        setLifetime = function(e) {
          return _this.lifetime = e.detail;
        };
        $.on(window, 'captcha:timeout', setLifetime);
        $.globalEval('window.dispatchEvent(new CustomEvent("captcha:timeout", {detail: RecaptchaState.timeout}))');
        $.off(window, 'captcha:timeout', setLifetime);
        imgContainer = $.el('div', {
          className: 'captcha-img',
          title: 'Reload',
          innerHTML: '<img>'
        });
        input = $.el('input', {
          className: 'captcha-input field',
          title: 'Verification',
          autocomplete: 'off',
          spellcheck: false
        });
        this.nodes = {
          challenge: $.id('recaptcha_challenge_field_holder'),
          img: imgContainer.firstChild,
          input: input
        };
        if (MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.OMutationObserver) {
          observer = new MutationObserver(this.load.bind(this));
          observer.observe(this.nodes.challenge, {
            childList: true
          });
        } else {
          $.on(this.nodes.challenge, 'DOMNodeInserted', this.load.bind(this));
        }
        $.on(imgContainer, 'click', this.reload.bind(this));
        $.on(input, 'keydown', this.keydown.bind(this));
        $.get('captchas', [], function(item) {
          return _this.sync(item['captchas']);
        });
        $.sync('captchas', this.sync);
        this.reload();
        $.addClass(QR.nodes.el, 'has-captcha');
        return $.after(QR.nodes.com.parentNode, [imgContainer, input]);
      },
      sync: function(captchas) {
        this.captchas = captchas;
        return QR.captcha.count();
      },
      getOne: function() {
        var captcha, challenge, response;

        this.clear();
        if (captcha = this.captchas.shift()) {
          challenge = captcha.challenge, response = captcha.response;
          this.count();
          $.set('captchas', this.captchas);
        } else {
          challenge = this.nodes.img.alt;
          if (response = this.nodes.input.value) {
            this.reload();
          }
        }
        if (response) {
          response = response.trim();
          if (!/\s/.test(response)) {
            response = "" + response + " " + response;
          }
        }
        return {
          challenge: challenge,
          response: response
        };
      },
      save: function() {
        var response;

        if (!(response = this.nodes.input.value.trim())) {
          return;
        }
        this.captchas.push({
          challenge: this.nodes.img.alt,
          response: response,
          timeout: this.timeout
        });
        this.count();
        this.reload();
        return $.set('captchas', this.captchas);
      },
      clear: function() {
        var captcha, i, now, _i, _len, _ref;

        now = Date.now();
        _ref = this.captchas;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          captcha = _ref[i];
          if (captcha.timeout > now) {
            break;
          }
        }
        if (!i) {
          return;
        }
        this.captchas = this.captchas.slice(i);
        this.count();
        return $.set('captchas', this.captchas);
      },
      load: function() {
        var challenge;

        if (!this.nodes.challenge.firstChild) {
          return;
        }
        this.timeout = Date.now() + this.lifetime * $.SECOND - $.MINUTE;
        challenge = this.nodes.challenge.firstChild.value;
        this.nodes.img.alt = challenge;
        this.nodes.img.src = "//www.google.com/recaptcha/api/image?c=" + challenge;
        this.nodes.input.value = null;
        return this.clear();
      },
      count: function() {
        var count;

        count = this.captchas.length;
        this.nodes.input.placeholder = (function() {
          switch (count) {
            case 0:
              return 'Verification (Shift + Enter to cache)';
            case 1:
              return 'Verification (1 cached captcha)';
            default:
              return "Verification (" + count + " cached captchas)";
          }
        })();
        return this.nodes.input.alt = count;
      },
      reload: function(focus) {
        $.globalEval('Recaptcha.reload("t")');
        if (focus) {
          return this.nodes.input.focus();
        }
      },
      keydown: function(e) {
        if (e.keyCode === 8 && !this.nodes.input.value) {
          this.reload();
        } else if (e.keyCode === 13 && e.shiftKey) {
          this.save();
        } else {
          return;
        }
        return e.preventDefault();
      }
    },
    dialog: function() {
      var dialog, mimeTypes, name, node, nodes, thread, _i, _j, _len, _len1, _ref, _ref1;

      dialog = UI.dialog('qr', 'top:0;right:0;', "<div>\n  <input type=checkbox id=autohide title=Auto-hide>\n  <select title='Create a new thread / Reply'>\n    <option value=new>New thread</option>\n  </select>\n  <span class=move></span>\n  <a href=javascript:; class=close title=Close>×</a>\n</div>\n<form>\n  <div class=persona>\n    <input id=dump-button type=button title='Dump list' value=+>\n    <input name=name  data-name=name  title=Name    placeholder=Name    class=field size=1>\n    <input name=email data-name=email title=E-mail  placeholder=E-mail  class=field size=1>\n    <input name=sub   data-name=sub   title=Subject placeholder=Subject class=field size=1>\n  </div>\n  <div id=dump-list-container>\n    <div id=dump-list></div>\n    <a id=add-post href=javascript:; title=\"Add a post\">+</a>\n  </div>\n  <div class=textarea>\n    <textarea data-name=com title=Comment placeholder=Comment class=field></textarea>\n    <span id=char-count></span>\n  </div>\n  <div id=file-n-submit>\n    <input type=submit>\n    <input id=qr-file-button type=button value='Choose files'>\n    <span id=qr-filename-container>\n      <span id=qr-no-file>No selected file</span>\n      <span id=qr-filename></span>\n    </span>\n    <a id=qr-filerm href=javascript:; title='Remove file'>×</a>\n    <input type=checkbox id=qr-file-spoiler title='Spoiler image'>\n  </div>\n  <input type=file multiple>\n</form>".replace(/>\s+</g, '><'));
      QR.nodes = nodes = {
        el: dialog,
        move: $('.move', dialog),
        autohide: $('#autohide', dialog),
        thread: $('select', dialog),
        close: $('.close', dialog),
        form: $('form', dialog),
        dumpButton: $('#dump-button', dialog),
        name: $('[data-name=name]', dialog),
        email: $('[data-name=email]', dialog),
        sub: $('[data-name=sub]', dialog),
        com: $('[data-name=com]', dialog),
        dumpList: $('#dump-list', dialog),
        addPost: $('#add-post', dialog),
        charCount: $('#char-count', dialog),
        fileSubmit: $('#file-n-submit', dialog),
        fileButton: $('#qr-file-button', dialog),
        filename: $('#qr-filename', dialog),
        fileRM: $('#qr-filerm', dialog),
        spoiler: $('#qr-file-spoiler', dialog),
        status: $('[type=submit]', dialog),
        fileInput: $('[type=file]', dialog)
      };
      mimeTypes = $('ul.rules > li').textContent.trim().match(/: (.+)/)[1].toLowerCase().replace(/\w+/g, function(type) {
        switch (type) {
          case 'jpg':
            return 'image/jpeg';
          case 'pdf':
            return 'application/pdf';
          case 'swf':
            return 'application/x-shockwave-flash';
          default:
            return "image/" + type;
        }
      });
      QR.mimeTypes = mimeTypes.split(', ');
      QR.mimeTypes.push('');
      nodes.fileInput.max = $('input[name=MAX_FILE_SIZE]').value;
      if ($.engine !== 'presto') {
        nodes.fileInput.accept = "text/*, " + mimeTypes;
      }
      QR.spoiler = !!$('input[name=spoiler]');
      nodes.spoiler.hidden = !QR.spoiler;
      if (g.BOARD.ID === 'f') {
        nodes.flashTag = $.el('select', {
          name: 'filetag',
          innerHTML: "<option value=0>Hentai</option>\n<option value=6>Porn</option>\n<option value=1>Japanese</option>\n<option value=2>Anime</option>\n<option value=3>Game</option>\n<option value=5>Loop</option>\n<option value=4 selected>Other</option>"
        });
        $.add(nodes.form, nodes.flashTag);
      }
      for (thread in g.BOARD.threads) {
        $.add(nodes.thread, $.el('option', {
          value: thread,
          textContent: "Thread No." + thread
        }));
      }
      $.after(nodes.autohide, nodes.thread);
      QR.resetThreadSelector();
      _ref = [nodes.fileButton, nodes.filename.parentNode];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        $.on(node, 'click', QR.openFileInput);
      }
      $.on(nodes.autohide, 'change', QR.toggleHide);
      $.on(nodes.close, 'click', QR.close);
      $.on(nodes.dumpButton, 'click', function() {
        return nodes.el.classList.toggle('dump');
      });
      $.on(nodes.addPost, 'click', function() {
        return new QR.post(true);
      });
      $.on(nodes.form, 'submit', QR.submit);
      $.on(nodes.fileRM, 'click', function() {
        return QR.selected.rmFile();
      });
      $.on(nodes.spoiler, 'change', function() {
        return QR.selected.nodes.spoiler.click();
      });
      $.on(nodes.fileInput, 'change', QR.fileInput);
      new QR.post(true);
      _ref1 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        $.on(nodes[name], 'input', function() {
          return QR.selected.save(this);
        });
      }
      QR.status();
      QR.cooldown.init();
      QR.captcha.init();
      $.add(d.body, dialog);
      return $.event('QRDialogCreation', null, dialog);
    },
    submit: function(e) {
      var callbacks, challenge, err, filetag, m, opts, post, postData, response, textOnly, thread, threadID, _ref, _ref1;

      if (e != null) {
        e.preventDefault();
      }
      if (QR.req) {
        QR.abort();
        return;
      }
      if (QR.cooldown.seconds) {
        QR.cooldown.auto = !QR.cooldown.auto;
        QR.status();
        return;
      }
      post = QR.posts[0];
      post.forceSave();
      if (g.BOARD.ID === 'f') {
        filetag = QR.nodes.flashTag.value;
      }
      threadID = QR.nodes.thread.value;
      thread = g.BOARD.threads[threadID];
      if (threadID === 'new') {
        threadID = null;
        if (((_ref = g.BOARD.ID) === 'vg' || _ref === 'q') && !post.sub) {
          err = 'New threads require a subject.';
        } else if (!(post.file || (textOnly = !!$('input[name=textonly]', $.id('postForm'))))) {
          err = 'No file selected.';
        }
      } else if (g.BOARD.threads[threadID].isClosed) {
        err = 'You can\'t reply to this thread anymore.';
      } else if (!(post.com || post.file)) {
        err = 'No file selected.';
      } else if (post.file && thread.fileLimit && !thread.isSticky) {
        err = 'Max limit of image replies has been reached.';
      }
      if (QR.captcha.isEnabled && !err) {
        _ref1 = QR.captcha.getOne(), challenge = _ref1.challenge, response = _ref1.response;
        if (!response) {
          err = 'No valid captcha.';
        }
      }
      if (err) {
        QR.cooldown.auto = false;
        QR.status();
        QR.error(err);
        return;
      }
      QR.cleanNotifications();
      QR.cooldown.auto = QR.posts.length > 1;
      if (Conf['Auto-Hide QR'] && !QR.cooldown.auto) {
        QR.hide();
      }
      if (!QR.cooldown.auto && $.x('ancestor::div[@id="qr"]', d.activeElement)) {
        d.activeElement.blur();
      }
      post.lock();
      postData = {
        resto: threadID,
        name: post.name,
        email: post.email,
        sub: post.sub,
        com: post.com,
        upfile: post.file,
        filetag: filetag,
        spoiler: post.spoiler,
        textonly: textOnly,
        mode: 'regist',
        pwd: (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $.id('postPassword').value,
        recaptcha_challenge_field: challenge,
        recaptcha_response_field: response
      };
      callbacks = {
        onload: QR.response,
        onerror: function() {
          delete QR.req;
          post.unlock();
          QR.cooldown.auto = false;
          QR.status();
          return QR.error($.el('span', {
            innerHTML: 'Connection error. You may have been <a href=//www.4chan.org/banned target=_blank>banned</a>.'
          }));
        }
      };
      opts = {
        cred: true,
        form: $.formData(postData),
        upCallbacks: {
          onload: function() {
            QR.req.isUploadFinished = true;
            QR.req.uploadEndTime = Date.now();
            QR.req.progress = '...';
            return QR.status();
          },
          onprogress: function(e) {
            QR.req.progress = "" + (Math.round(e.loaded / e.total * 100)) + "%";
            return QR.status();
          }
        }
      };
      QR.req = $.ajax($.id('postForm').parentNode.action, callbacks, opts);
      QR.req.uploadStartTime = Date.now();
      QR.req.progress = '...';
      return QR.status();
    },
    response: function() {
      var URL, ban, board, err, h1, isReply, post, postID, req, threadID, tmpDoc, _, _ref, _ref1;

      req = QR.req;
      delete QR.req;
      post = QR.posts[0];
      post.unlock();
      tmpDoc = d.implementation.createHTMLDocument('');
      tmpDoc.documentElement.innerHTML = req.response;
      if (ban = $('.banType', tmpDoc)) {
        board = $('.board', tmpDoc).innerHTML;
        err = $.el('span', {
          innerHTML: ban.textContent.toLowerCase() === 'banned' ? ("You are banned on " + board + "! ;_;<br>") + "Click <a href=//www.4chan.org/banned target=_blank>here</a> to see the reason." : ("You were issued a warning on " + board + " as " + ($('.nameBlock', tmpDoc).innerHTML) + ".<br>") + ("Reason: " + ($('.reason', tmpDoc).innerHTML))
        });
      } else if (err = tmpDoc.getElementById('errmsg')) {
        if ((_ref = $('a', err)) != null) {
          _ref.target = '_blank';
        }
      } else if (tmpDoc.title !== 'Post successful!') {
        err = 'Connection error with sys.4chan.org.';
      } else if (req.status !== 200) {
        err = "Error " + req.statusText + " (" + req.status + ")";
      }
      if (err) {
        if (/captcha|verification/i.test(err.textContent) || err === 'Connection error with sys.4chan.org.') {
          if (/mistyped/i.test(err.textContent)) {
            err = 'You seem to have mistyped the CAPTCHA.';
          }
          QR.cooldown.auto = QR.captcha.isEnabled ? !!QR.captcha.captchas.length : err === 'Connection error with sys.4chan.org.' ? true : false;
          QR.cooldown.set({
            delay: 2
          });
        } else {
          QR.cooldown.auto = false;
        }
        QR.status();
        QR.error(err);
        return;
      }
      h1 = $('h1', tmpDoc);
      QR.cleanNotifications();
      QR.notifications.push(new Notification('success', h1.textContent, 5));
      $.get('QR.persona', {}, function(item) {
        var persona;

        persona = item['QR.persona'];
        persona = {
          name: post.name,
          email: /^sage$/.test(post.email) ? persona.email : post.email,
          sub: Conf['Remember Subject'] ? post.sub : null
        };
        return $.set('QR.persona', persona);
      });
      _ref1 = h1.nextSibling.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref1[0], threadID = _ref1[1], postID = _ref1[2];
      postID = +postID;
      threadID = +threadID || postID;
      isReply = threadID !== postID;
      QR.db.set({
        boardID: g.BOARD.ID,
        threadID: threadID,
        postID: postID,
        val: true
      });
      $.event('QRPostSuccessful', {
        board: g.BOARD,
        threadID: threadID,
        postID: postID
      }, QR.nodes.el);
      QR.cooldown.auto = QR.posts.length > 1 && isReply;
      if (!(Conf['Persistent QR'] || QR.cooldown.auto)) {
        QR.close();
      } else {
        post.rm();
      }
      QR.cooldown.set({
        req: req,
        post: post,
        isReply: isReply
      });
      if (threadID === postID) {
        URL = "/" + g.BOARD + "/res/" + threadID;
      } else if (g.VIEW === 'index' && !QR.cooldown.auto && Conf['Open Post in New Tab']) {
        URL = "/" + g.BOARD + "/res/" + threadID + "#p" + postID;
      }
      if (URL) {
        if (Conf['Open Post in New Tab']) {
          $.open("/" + g.BOARD + "/res/" + threadID);
        } else {
          window.location = "/" + g.BOARD + "/res/" + threadID;
        }
      }
      return QR.status();
    },
    abort: function() {
      if (QR.req && !QR.req.isUploadFinished) {
        QR.req.abort();
        delete QR.req;
        QR.posts[0].unlock();
        QR.notifications.push(new Notification('info', 'QR upload aborted.', 5));
      }
      return QR.status();
    }
  };

  Report = {
    init: function() {
      if (!/report/.test(location.search)) {
        return;
      }
      return $.ready(this.ready);
    },
    ready: function() {
      var field, form;

      form = $('form');
      field = $.id('recaptcha_response_field');
      $.on(field, 'keydown', function(e) {
        if (e.keyCode === 8 && !field.value) {
          return $.globalEval('Recaptcha.reload("t")');
        }
      });
      return $.on(form, 'submit', function(e) {
        var response;

        e.preventDefault();
        response = field.value.trim();
        if (!/\s/.test(response)) {
          field.value = "" + response + " " + response;
        }
        return form.submit();
      });
    }
  };

  DataBoards = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts'];

  DataBoard = (function() {
    function DataBoard(key, sync) {
      var _this = this;

      this.key = key;
      this.data = Conf[key];
      $.sync(key, this.onSync.bind(this));
      this.clean();
      if (!sync) {
        return;
      }
      $.on(d, '4chanXInitFinished', function() {
        return _this.sync = sync;
      });
    }

    DataBoard.prototype["delete"] = function(_arg) {
      var boardID, postID, threadID;

      boardID = _arg.boardID, threadID = _arg.threadID, postID = _arg.postID;
      if (postID) {
        delete this.data.boards[boardID][threadID][postID];
        this.deleteIfEmpty({
          boardID: boardID,
          threadID: threadID
        });
      } else if (threadID) {
        delete this.data.boards[boardID][threadID];
        this.deleteIfEmpty({
          boardID: boardID
        });
      } else {
        delete this.data.boards[boardID];
      }
      return $.set(this.key, this.data);
    };

    DataBoard.prototype.deleteIfEmpty = function(_arg) {
      var boardID, threadID;

      boardID = _arg.boardID, threadID = _arg.threadID;
      if (threadID) {
        if (!Object.keys(this.data.boards[boardID][threadID]).length) {
          delete this.data.boards[boardID][threadID];
          return this.deleteIfEmpty({
            boardID: boardID
          });
        }
      } else if (!Object.keys(this.data.boards[boardID]).length) {
        return delete this.data.boards[boardID];
      }
    };

    DataBoard.prototype.set = function(_arg) {
      var boardID, postID, threadID, val, _base, _base1, _base2;

      boardID = _arg.boardID, threadID = _arg.threadID, postID = _arg.postID, val = _arg.val;
      if (postID) {
        ((_base = ((_base1 = this.data.boards)[boardID] || (_base1[boardID] = {})))[threadID] || (_base[threadID] = {}))[postID] = val;
      } else if (threadID) {
        ((_base2 = this.data.boards)[boardID] || (_base2[boardID] = {}))[threadID] = val;
      } else {
        this.data.boards[boardID] = val;
      }
      return $.set(this.key, this.data);
    };

    DataBoard.prototype.get = function(_arg) {
      var ID, board, boardID, defaultValue, postID, thread, threadID, val, _i, _len;

      boardID = _arg.boardID, threadID = _arg.threadID, postID = _arg.postID, defaultValue = _arg.defaultValue;
      if (board = this.data.boards[boardID]) {
        if (!threadID) {
          if (postID) {
            for (thread = _i = 0, _len = board.length; _i < _len; thread = ++_i) {
              ID = board[thread];
              if (postID in thread) {
                val = thread[postID];
                break;
              }
            }
          } else {
            val = board;
          }
        } else if (thread = board[threadID]) {
          val = postID ? thread[postID] : thread;
        }
      }
      return val || defaultValue;
    };

    DataBoard.prototype.clean = function() {
      var boardID, now;

      for (boardID in this.data.boards) {
        this.deleteIfEmpty({
          boardID: boardID
        });
      }
      now = Date.now();
      if ((this.data.lastChecked || 0) < now - 12 * $.HOUR) {
        this.data.lastChecked = now;
        for (boardID in this.data.boards) {
          this.ajaxClean(boardID);
        }
      }
      return $.set(this.key, this.data);
    };

    DataBoard.prototype.ajaxClean = function(boardID) {
      var _this = this;

      return $.cache("//api.4chan.org/" + boardID + "/threads.json", function(e) {
        var board, page, thread, threads, _i, _j, _len, _len1, _ref, _ref1;

        if (e.target.status === 404) {
          _this["delete"](boardID);
        } else if (e.target.status === 200) {
          board = _this.data.boards[boardID];
          threads = {};
          _ref = JSON.parse(e.target.response);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            page = _ref[_i];
            _ref1 = page.threads;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              thread = _ref1[_j];
              if (thread.no in board) {
                threads[thread.no] = board[thread.no];
              }
            }
          }
          _this.data.boards[boardID] = threads;
          _this.deleteIfEmpty({
            boardID: boardID
          });
        }
        return $.set(_this.key, _this.data);
      });
    };

    DataBoard.prototype.onSync = function(data) {
      this.data = data || {
        boards: {}
      };
      return typeof this.sync === "function" ? this.sync() : void 0;
    };

    return DataBoard;

  })();

  Board = (function() {
    Board.prototype.toString = function() {
      return this.ID;
    };

    function Board(ID) {
      this.ID = ID;
      this.threads = {};
      this.posts = {};
      g.boards[this] = this;
    }

    return Board;

  })();

  Thread = (function() {
    Thread.prototype.callbacks = [];

    Thread.prototype.toString = function() {
      return this.ID;
    };

    function Thread(ID, board) {
      this.board = board;
      this.ID = +ID;
      this.fullID = "" + this.board + "." + this.ID;
      this.posts = {};
      g.threads[this.fullID] = board.threads[this] = this;
    }

    Thread.prototype.kill = function() {
      this.isDead = true;
      return this.timeOfDeath = Date.now();
    };

    return Thread;

  })();

  Post = (function() {
    Post.prototype.callbacks = [];

    Post.prototype.toString = function() {
      return this.ID;
    };

    function Post(root, thread, board, that) {
      var alt, anchor, capcode, date, email, file, fileInfo, flag, info, name, post, size, subject, thumb, tripcode, uniqueID, unit;

      this.thread = thread;
      this.board = board;
      if (that == null) {
        that = {};
      }
      this.ID = +root.id.slice(2);
      this.fullID = "" + this.board + "." + this.ID;
      post = $('.post', root);
      info = $('.postInfo', post);
      this.nodes = {
        root: root,
        post: post,
        info: info,
        comment: $('.postMessage', post),
        quotelinks: [],
        backlinks: info.getElementsByClassName('backlink')
      };
      this.info = {};
      if (subject = $('.subject', info)) {
        this.nodes.subject = subject;
        this.info.subject = subject.textContent;
      }
      if (name = $('.name', info)) {
        this.nodes.name = name;
        this.info.name = name.textContent;
      }
      if (email = $('.useremail', info)) {
        this.nodes.email = email;
        this.info.email = decodeURIComponent(email.href.slice(7));
      }
      if (tripcode = $('.postertrip', info)) {
        this.nodes.tripcode = tripcode;
        this.info.tripcode = tripcode.textContent;
      }
      if (uniqueID = $('.posteruid', info)) {
        this.nodes.uniqueID = uniqueID;
        this.info.uniqueID = uniqueID.firstElementChild.textContent;
      }
      if (capcode = $('.capcode.hand', info)) {
        this.nodes.capcode = capcode;
        this.info.capcode = capcode.textContent.replace('## ', '');
      }
      if (flag = $('.countryFlag', info)) {
        this.nodes.flag = flag;
        this.info.flag = flag.title;
      }
      if (date = $('.dateTime', info)) {
        this.nodes.date = date;
        this.info.date = new Date(date.dataset.utc * 1000);
      }
      this.parseComment();
      this.parseQuotes();
      if ((file = $('.file', post)) && (thumb = $('img[data-md5]', file))) {
        alt = thumb.alt;
        anchor = thumb.parentNode;
        fileInfo = file.firstElementChild;
        this.file = {
          info: fileInfo,
          text: fileInfo.firstElementChild,
          thumb: thumb,
          URL: anchor.href,
          size: alt.match(/[\d.]+\s\w+/)[0],
          MD5: thumb.dataset.md5,
          isSpoiler: $.hasClass(anchor, 'imgspoiler')
        };
        size = +this.file.size.match(/[\d.]+/)[0];
        unit = ['B', 'KB', 'MB', 'GB'].indexOf(this.file.size.match(/\w+$/)[0]);
        while (unit-- > 0) {
          size *= 1024;
        }
        this.file.sizeInBytes = size;
        this.file.thumbURL = that.isArchived ? thumb.src : "" + location.protocol + "//thumbs.4chan.org/" + board + "/thumb/" + (this.file.URL.match(/(\d+)\./)[1]) + "s.jpg";
        this.file.name = $('span[title]', fileInfo).title.replace(/%22/g, '"');
        if (this.file.isImage = /(jpg|png|gif)$/i.test(this.file.name)) {
          this.file.dimensions = this.file.text.textContent.match(/\d+x\d+/)[0];
        }
      }
      if (!(this.isReply = $.hasClass(post, 'reply'))) {
        this.thread.OP = this;
        this.thread.isSticky = !!$('.stickyIcon', this.nodes.info);
        this.thread.isClosed = !!$('.closedIcon', this.nodes.info);
      }
      this.clones = [];
      g.posts[this.fullID] = thread.posts[this] = board.posts[this] = this;
      if (that.isArchived) {
        this.kill();
      }
    }

    Post.prototype.parseComment = function() {
      var bq, data, i, node, nodes, text, _i, _j, _len, _ref, _ref1;

      bq = this.nodes.comment.cloneNode(true);
      _ref = $$('.abbr, .capcodeReplies, .exif, b', bq);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        $.rm(node);
      }
      text = [];
      nodes = d.evaluate('.//br|.//text()', bq, null, 7, null);
      for (i = _j = 0, _ref1 = nodes.snapshotLength; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        text.push((data = nodes.snapshotItem(i).data) ? data : '\n');
      }
      return this.info.comment = text.join('').trim().replace(/\s+$/gm, '');
    };

    Post.prototype.parseQuotes = function() {
      var hash, pathname, quotelink, quotes, _i, _len, _ref;

      quotes = {};
      _ref = $$('.quotelink', this.nodes.comment);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        hash = quotelink.hash;
        if (!hash) {
          continue;
        }
        pathname = quotelink.pathname;
        if (/catalog$/.test(pathname)) {
          continue;
        }
        if (quotelink.hostname !== 'boards.4chan.org') {
          continue;
        }
        this.nodes.quotelinks.push(quotelink);
        if (quotelink.parentNode.parentNode.className === 'capcodeReplies') {
          continue;
        }
        quotes["" + (pathname.split('/')[1]) + "." + hash.slice(2)] = true;
      }
      if (this.isClone) {
        return;
      }
      return this.quotes = Object.keys(quotes);
    };

    Post.prototype.kill = function(file, now) {
      var clone, quotelink, strong, _i, _j, _len, _len1, _ref, _ref1;

      now || (now = new Date());
      if (file) {
        if (this.file.isDead) {
          return;
        }
        this.file.isDead = true;
        this.file.timeOfDeath = now;
        $.addClass(this.nodes.root, 'deleted-file');
      } else {
        if (this.isDead) {
          return;
        }
        this.isDead = true;
        this.timeOfDeath = now;
        $.addClass(this.nodes.root, 'deleted-post');
      }
      if (!(strong = $('strong.warning', this.nodes.info))) {
        strong = $.el('strong', {
          className: 'warning',
          textContent: '[Deleted]'
        });
        $.after($('input', this.nodes.info), strong);
      }
      strong.textContent = file ? '[File deleted]' : '[Deleted]';
      if (this.isClone) {
        return;
      }
      _ref = this.clones;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clone = _ref[_i];
        clone.kill(file, now);
      }
      if (file) {
        return;
      }
      _ref1 = Get.allQuotelinksLinkingTo(this);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quotelink = _ref1[_j];
        if ($.hasClass(quotelink, 'deadlink')) {
          continue;
        }
        $.add(quotelink, $.tn('\u00A0(Dead)'));
        $.addClass(quotelink, 'deadlink');
      }
    };

    Post.prototype.resurrect = function() {
      var clone, quotelink, strong, _i, _j, _len, _len1, _ref, _ref1;

      delete this.isDead;
      delete this.timeOfDeath;
      $.rmClass(this.nodes.root, 'deleted-post');
      strong = $('strong.warning', this.nodes.info);
      if (this.file && this.file.isDead) {
        strong.textContent = '[File deleted]';
      } else {
        $.rm(strong);
      }
      if (this.isClone) {
        return;
      }
      _ref = this.clones;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clone = _ref[_i];
        clone.resurrect();
      }
      _ref1 = Get.allQuotelinksLinkingTo(this);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quotelink = _ref1[_j];
        if ($.hasClass(quotelink, 'deadlink')) {
          quotelink.textContent = quotelink.textContent.replace('\u00A0(Dead)', '');
          $.rmClass(quotelink, 'deadlink');
        }
      }
    };

    Post.prototype.addClone = function(context) {
      return new Clone(this, context);
    };

    Post.prototype.rmClone = function(index) {
      var clone, _i, _len, _ref;

      this.clones.splice(index, 1);
      _ref = this.clones.slice(index);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clone = _ref[_i];
        clone.nodes.root.setAttribute('data-clone', index++);
      }
    };

    return Post;

  })();

  Clone = (function(_super) {
    __extends(Clone, _super);

    function Clone(origin, context) {
      var file, index, info, inline, inlined, key, nodes, post, root, val, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;

      this.origin = origin;
      this.context = context;
      _ref = ['ID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        this[key] = origin[key];
      }
      nodes = origin.nodes;
      root = nodes.root.cloneNode(true);
      post = $('.post', root);
      info = $('.postInfo', post);
      this.nodes = {
        root: root,
        post: post,
        info: info,
        comment: $('.postMessage', post),
        quotelinks: [],
        backlinks: info.getElementsByClassName('backlink')
      };
      _ref1 = $$('.inline', post);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        inline = _ref1[_j];
        $.rm(inline);
      }
      _ref2 = $$('.inlined', post);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        inlined = _ref2[_k];
        $.rmClass(inlined, 'inlined');
      }
      root.hidden = false;
      $.rmClass(root, 'forwarded');
      $.rmClass(post, 'highlight');
      if (nodes.subject) {
        this.nodes.subject = $('.subject', info);
      }
      if (nodes.name) {
        this.nodes.name = $('.name', info);
      }
      if (nodes.email) {
        this.nodes.email = $('.useremail', info);
      }
      if (nodes.tripcode) {
        this.nodes.tripcode = $('.postertrip', info);
      }
      if (nodes.uniqueID) {
        this.nodes.uniqueID = $('.posteruid', info);
      }
      if (nodes.capcode) {
        this.nodes.capcode = $('.capcode', info);
      }
      if (nodes.flag) {
        this.nodes.flag = $('.countryFlag', info);
      }
      if (nodes.date) {
        this.nodes.date = $('.dateTime', info);
      }
      this.parseQuotes();
      if (origin.file) {
        this.file = {};
        _ref3 = origin.file;
        for (key in _ref3) {
          val = _ref3[key];
          this.file[key] = val;
        }
        file = $('.file', post);
        this.file.info = file.firstElementChild;
        this.file.text = this.file.info.firstElementChild;
        this.file.thumb = $('img[data-md5]', file);
        this.file.fullImage = $('.full-image', file);
      }
      if (origin.isDead) {
        this.isDead = true;
      }
      this.isClone = true;
      index = origin.clones.push(this) - 1;
      root.setAttribute('data-clone', index);
    }

    return Clone;

  })(Post);

  Main = {
    init: function(items) {
      var db, flatten, _i, _len;

      flatten = function(parent, obj) {
        var key, val;

        if (obj instanceof Array) {
          Conf[parent] = obj[0];
        } else if (typeof obj === 'object') {
          for (key in obj) {
            val = obj[key];
            flatten(key, val);
          }
        } else {
          Conf[parent] = obj;
        }
      };
      flatten(null, Config);
      for (_i = 0, _len = DataBoards.length; _i < _len; _i++) {
        db = DataBoards[_i];
        Conf[db] = {
          boards: {}
        };
      }
      $.get(Conf, Main.initFeatures);
      return $.on(d, '4chanMainInit', Main.initStyle);
    },
    initFeatures: function(items) {
      var initFeature, pathname;

      Conf = items;
      pathname = location.pathname.split('/');
      g.BOARD = new Board(pathname[1]);
      g.VIEW = (function() {
        switch (pathname[2]) {
          case 'res':
            return 'thread';
          case 'catalog':
            return 'catalog';
          default:
            return 'index';
        }
      })();
      if (g.VIEW === 'thread') {
        g.THREADID = +pathname[3];
      }
      switch (location.hostname) {
        case 'sys.4chan.org':
          Report.init();
          return;
        case 'images.4chan.org':
          $.ready(function() {
            var url;

            if (Conf['404 Redirect'] && d.title === '4chan - 404 Not Found') {
              url = Redirect.image(pathname[1], pathname[3]);
              if (url) {
                return location.href = url;
              }
            }
          });
          return;
      }
      initFeature = function(name, module) {
        var err;

        try {
          return module.init();
        } catch (_error) {
          err = _error;
          return Main.handleErrors({
            message: "\"" + name + "\" initialization crashed.",
            error: err
          });
        }
      };
      initFeature('Polyfill', Polyfill);
      initFeature('Header', Header);
      initFeature('Settings', Settings);
      initFeature('Fourchan thingies', Fourchan);
      initFeature('Custom CSS', CustomCSS);
      initFeature('Resurrect Quotes', Quotify);
      initFeature('Filter', Filter);
      initFeature('Thread Hiding', ThreadHiding);
      initFeature('Reply Hiding', PostHiding);
      initFeature('Recursive', Recursive);
      initFeature('Strike-through Quotes', QuoteStrikeThrough);
      initFeature('Quick Reply', QR);
      initFeature('Menu', Menu);
      initFeature('Report Link', ReportLink);
      initFeature('Thread Hiding (Menu)', ThreadHiding.menu);
      initFeature('Reply Hiding (Menu)', PostHiding.menu);
      initFeature('Delete Link', DeleteLink);
      initFeature('Filter (Menu)', Filter.menu);
      initFeature('Download Link', DownloadLink);
      initFeature('Archive Link', ArchiveLink);
      initFeature('Quote Inlining', QuoteInline);
      initFeature('Quote Previewing', QuotePreview);
      initFeature('Quote Backlinks', QuoteBacklink);
      initFeature('Mark Quotes of You', QuoteYou);
      initFeature('Mark OP Quotes', QuoteOP);
      initFeature('Mark Cross-thread Quotes', QuoteCT);
      initFeature('Anonymize', Anonymize);
      initFeature('Time Formatting', Time);
      initFeature('Relative Post Dates', RelativeDates);
      initFeature('File Info Formatting', FileInfo);
      initFeature('Sauce', Sauce);
      initFeature('Image Expansion', ImageExpand);
      initFeature('Image Expansion (Menu)', ImageExpand.menu);
      initFeature('Reveal Spoilers', RevealSpoilers);
      initFeature('Auto-GIF', AutoGIF);
      initFeature('Image Hover', ImageHover);
      initFeature('Comment Expansion', ExpandComment);
      initFeature('Thread Expansion', ExpandThread);
      initFeature('Thread Excerpt', ThreadExcerpt);
      initFeature('Favicon', Favicon);
      initFeature('Unread', Unread);
      initFeature('Thread Stats', ThreadStats);
      initFeature('Thread Updater', ThreadUpdater);
      initFeature('Thread Watcher', ThreadWatcher);
      initFeature('Index Navigation', Nav);
      initFeature('Keybinds', Keybinds);
      $.on(d, 'AddCallback', Main.addCallback);
      return $.ready(Main.initReady);
    },
    initStyle: function() {
      var MutationObserver, mainStyleSheet, observer, setStyle, style, styleSheets, _ref;

      $.off(d, '4chanMainInit', Main.initStyle);
      if (!Main.isThisPageLegit()) {
        return;
      }
      if ((_ref = $('link[href*=mobile]', d.head)) != null) {
        _ref.disabled = true;
      }
      $.addClass(doc, $.engine);
      $.addClass(doc, 'fourchan-x');
      $.addStyle(Main.css);
      if (g.VIEW === 'catalog') {
        $.addClass(doc, $.id('base-css').href.match(/catalog_(\w+)/)[1].replace('_new', '').replace(/_+/g, '-'));
        return;
      }
      style = 'yotsuba-b';
      mainStyleSheet = $('link[title=switch]', d.head);
      styleSheets = $$('link[rel="alternate stylesheet"]', d.head);
      setStyle = function() {
        var styleSheet, _i, _len;

        $.rmClass(doc, style);
        for (_i = 0, _len = styleSheets.length; _i < _len; _i++) {
          styleSheet = styleSheets[_i];
          if (styleSheet.href === mainStyleSheet.href) {
            style = styleSheet.title.toLowerCase().replace('new', '').trim().replace(/\s+/g, '-');
            break;
          }
        }
        return $.addClass(doc, style);
      };
      setStyle();
      if (!mainStyleSheet) {
        return;
      }
      if (MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.OMutationObserver) {
        observer = new MutationObserver(setStyle);
        return observer.observe(mainStyleSheet, {
          attributes: true,
          attributeFilter: ['href']
        });
      } else {
        return $.on(mainStyleSheet, 'DOMAttrModified', setStyle);
      }
    },
    initReady: function() {
      var board, boardChild, err, errors, href, posts, thread, threadChild, threads, _i, _j, _len, _len1, _ref, _ref1;

      if (d.title === '4chan - 404 Not Found') {
        if (Conf['404 Redirect'] && g.VIEW === 'thread') {
          href = Redirect.to({
            boardID: g.BOARD.ID,
            threadID: g.THREADID,
            postID: +location.hash.match(/\d+/)
          });
          location.href = href || ("/" + g.BOARD + "/");
        }
        return;
      }
      if (!$.hasClass(doc, 'fourchan-x')) {
        Main.initStyle();
      }
      if (board = $('.board')) {
        threads = [];
        posts = [];
        _ref = board.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          boardChild = _ref[_i];
          if (!$.hasClass(boardChild, 'thread')) {
            continue;
          }
          thread = new Thread(boardChild.id.slice(1), g.BOARD);
          threads.push(thread);
          _ref1 = boardChild.children;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            threadChild = _ref1[_j];
            if (!$.hasClass(threadChild, 'postContainer')) {
              continue;
            }
            try {
              posts.push(new Post(threadChild, thread, g.BOARD));
            } catch (_error) {
              err = _error;
              if (!errors) {
                errors = [];
              }
              errors.push({
                message: "Parsing of Post No." + (threadChild.id.match(/\d+/)) + " failed. Post will be skipped.",
                error: err
              });
            }
          }
        }
        if (errors) {
          Main.handleErrors(errors);
        }
        Main.callbackNodes(Thread, threads);
        Main.callbackNodes(Post, posts);
      }
      if ($.hasClass(d.body, 'fourchan_x')) {
        alert('4chan X v2 detected: Disable it or v3 will break.');
      }
      if (/Firefox\/1/.test(navigator.userAgent)) {
        alert('Your version of Firefox is incompatible with 4chan X v3. Firefox 20+ is required.');
      }
      $.event('4chanXInitFinished');
      return Main.checkUpdate();
    },
    callbackNodes: function(klass, nodes) {
      var callback, err, errors, i, len, node, _i, _j, _len, _ref;

      len = nodes.length;
      _ref = klass.prototype.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        for (i = _j = 0; 0 <= len ? _j < len : _j > len; i = 0 <= len ? ++_j : --_j) {
          node = nodes[i];
          try {
            callback.cb.call(node);
          } catch (_error) {
            err = _error;
            if (!errors) {
              errors = [];
            }
            errors.push({
              message: "\"" + callback.name + "\" crashed on " + klass.name + " No." + node + " (/" + node.board + "/).",
              error: err
            });
          }
        }
      }
      if (errors) {
        return Main.handleErrors(errors);
      }
    },
    addCallback: function(e) {
      var Klass, obj;

      obj = e.detail;
      if (typeof obj.callback.name !== 'string') {
        throw new Error("Invalid callback name: " + obj.callback.name);
      }
      switch (obj.type) {
        case 'Post':
          Klass = Post;
          break;
        case 'Thread':
          Klass = Thread;
          break;
        default:
          return;
      }
      obj.callback.isAddon = true;
      return Klass.prototype.callbacks.push(obj.callback);
    },
    checkUpdate: function() {
      var freq, items, now;

      if (!(Conf['Check for Updates'] && Main.isThisPageLegit())) {
        return;
      }
      now = Date.now();
      freq = 7 * $.DAY;
      items = {
        lastupdate: 0,
        lastchecked: 0
      };
      return $.get(items, function(items) {
        if (items.lastupdate > now - freq || items.lastchecked > now - $.DAY) {
          return;
        }
        return $.ajax('https://4chan-x.just-believe.in/builds/version', {
          onload: function() {
            var el, version;

            if (this.status !== 200) {
              return;
            }
            version = this.response;
            if (!/^\d\.\d+\.\d+$/.test(version)) {
              return;
            }
            if (g.VERSION === version) {
              $.set('lastupdate', now);
              return;
            }
            $.set('lastchecked', now);
            el = $.el('span', {
              innerHTML: "Update: 4chan X v" + version + " is out, get it <a href=https://4chan-x.just-believe.in/ target=_blank>here</a>."
            });
            return new Notification('info', el, 120);
          }
        });
      });
    },
    handleErrors: function(errors) {
      var div, error, logs, _i, _len;

      if (!(errors instanceof Array)) {
        error = errors;
      } else if (errors.length === 1) {
        error = errors[0];
      }
      if (error) {
        new Notification('error', Main.parseError(error), 15);
        return;
      }
      div = $.el('div', {
        innerHTML: "" + errors.length + " errors occurred. [<a href=javascript:;>show</a>]"
      });
      $.on(div.lastElementChild, 'click', function() {
        var _ref;

        return _ref = this.textContent === 'show' ? ['hide', false] : ['show', true], this.textContent = _ref[0], logs.hidden = _ref[1], _ref;
      });
      logs = $.el('div', {
        hidden: true
      });
      for (_i = 0, _len = errors.length; _i < _len; _i++) {
        error = errors[_i];
        $.add(logs, Main.parseError(error));
      }
      return new Notification('error', [div, logs], 30);
    },
    parseError: function(data) {
      var error, message;

      Main.logError(data);
      message = $.el('div', {
        textContent: data.message
      });
      error = $.el('div', {
        textContent: data.error
      });
      return [message, error];
    },
    errors: [],
    logError: function(data) {
      if (!Main.errors.length) {
        $.on(window, 'unload', Main.postErrors);
      }
      c.error(data.message, data.error.stack);
      return Main.errors.push(data);
    },
    postErrors: function() {
      var errors;

      errors = Main.errors.map(function(d) {
        return d.message + ' ' + d.error.stack;
      });
      return $.ajax('https://4chan-x.just-believe.in/errors', {}, {
        sync: true,
        form: $.formData({
          n: "4chan X v" + g.VERSION,
          t: 'crx',
          ua: window.navigator.userAgent,
          url: window.location.href,
          e: errors.join('\n')
        })
      });
    },
    isThisPageLegit: function() {
      var _ref;

      if (!('thisPageIsLegit' in Main)) {
        Main.thisPageIsLegit = location.hostname === 'boards.4chan.org' && !$('link[href*="favicon-status.ico"]', d.head) && ((_ref = d.title) !== '4chan - Temporarily Offline' && _ref !== '4chan - Error');
      }
      return Main.thisPageIsLegit;
    },
    css: "/* General */\n.dialog {\nbox-shadow: 0 1px 2px rgba(0, 0, 0, .15);\nborder: 1px solid;\ndisplay: block;\npadding: 0;\n}\n.field {\nbackground-color: #FFF;\nborder: 1px solid #CCC;\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\ncolor: #333;\nfont: 13px sans-serif;\nmargin: 0;\npadding: 2px 4px 3px;\noutline: none;\ntransition: color .25s, border-color .25s, -webkit-flex .25s;\ntransition: color .25s, border-color .25s, flex .25s;\n}\n.field::-moz-placeholder,\n.field:hover::-moz-placeholder {\ncolor: #AAA !important;\n}\n.field:hover {\nborder-color: #999;\n}\n.field:hover, .field:focus {\ncolor: #000;\n}\n.field[disabled] {\nbackground-color: #F2F2F2;\ncolor: #888;\n}\n.move {\ncursor: move;\n}\nlabel, .favicon {\ncursor: pointer;\n}\na[href=\"javascript:;\"] {\ntext-decoration: none;\n}\n.warning {\ncolor: red;\n}\n\n/* 4chan style fixes */\n.opContainer, .op {\ndisplay: block !important;\n}\n.post {\noverflow: visible !important;\n}\n[hidden] {\ndisplay: none !important;\n}\n\n/* fixed, z-index */\n#overlay,\n#qp, #ihover,\n#updater, #thread-stats,\n#navlinks, #header,\n#qr {\nposition: fixed;\n}\n#overlay {\nz-index: 999;\n}\n#notifications {\nz-index: 70;\n}\n#qp, #ihover {\nz-index: 60;\n}\n#menu {\nz-index: 50;\n}\n#navlinks, #updater, #thread-stats {\nz-index: 40;\n}\n#qr {\nz-index: 30;\n}\n#watcher:hover {\nz-index: 20;\n}\n#header {\nz-index: 10;\n}\n#watcher {\nz-index: 5;\n}\n\n/* Header */\n.fourchan-x body {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nmargin-top: 2em;\n}\n.fourchan-x #boardNavDesktop,\n.fourchan-x #navtopright,\n#header {\nright: 0;\nleft: 0;\n}\n#header.top {\ntop: 0;\n}\n#header.bottom {\nbottom: 0;\n}\n#header-bar {\nborder-width: 0;\ndisplay: -webkit-flex;\ndisplay: flex;\npadding: 3px 4px 4px;\nposition: relative;\ntransition: all .1s .05s ease-in-out;\n}\n#header.top #header-bar {\nborder-bottom-width: 1px;\n}\n#header.bottom #header-bar {\nbox-shadow: 0 -1px 2px rgba(0, 0, 0, .15);\nborder-top-width: 1px;\n}\n#header.bottom .menu-button i {\nborder-top: none;\nborder-bottom: 6px solid;\n}\n#board-list {\n-webkit-flex: 1;\nflex: 1;\ntext-align: center;\n}\n#header-bar.autohide:not(:hover) {\nbox-shadow: none;\ntransition: all .8s .6s cubic-bezier(.55, .055, .675, .19);\n}\n#header.top #header-bar.autohide:not(:hover) {\nmargin-bottom: -1em;\n-webkit-transform: translateY(-100%);\ntransform: translateY(-100%);\n}\n#header.bottom #header-bar.autohide:not(:hover) {\n-webkit-transform: translateY(100%);\ntransform: translateY(100%);\n}\n#toggle-header-bar {\nleft: 0;\nright: 0;\nheight: 10px;\nposition: absolute;\n}\n#header.top #toggle-header-bar {\ncursor: n-resize;\nbottom: -8px;\n}\n#header.bottom #toggle-header-bar {\ncursor: s-resize;\ntop: -8px;\n}\n#header-bar.autohide:not(:hover) #toggle-header-bar,\n#toggle-header-bar:hover {\nheight: 18px;\n}\n#header.top #header-bar.autohide:not(:hover) #toggle-header-bar,\n#header.top #toggle-header-bar:hover {\nbottom: -16px;\n}\n#header.bottom #header-bar.autohide:not(:hover) #toggle-header-bar,\n#header.bottom #toggle-header-bar:hover {\ntop: -16px;\n}\n#header.top #header-bar.autohide #toggle-header-bar {\ncursor: s-resize;\n}\n#header.bottom #header-bar.autohide #toggle-header-bar {\ncursor: n-resize;\n}\n#header-bar a:not(.entry) {\ntext-decoration: none;\npadding: 1px;\n}\n#shortcuts:empty {\ndisplay: none;\n}\n.shortcut:not(:last-child)::after {\ncontent: \" / \";\n}\n.brackets-wrap::before {\ncontent: \"\\00a0[\";\n}\n.brackets-wrap::after {\ncontent: \"]\\00a0\";\n}\n.expand-all-shortcut {\nopacity: .35;\n}\n\n/* Notifications */\n#notifications {\nheight: 0;\ntext-align: center;\n}\n#header.bottom #notifications {\nposition: fixed;\ntop: 0;\nleft: 0;\nwidth: 100%;\n}\n.notification {\ncolor: #FFF;\nfont-weight: 700;\ntext-shadow: 0 1px 2px rgba(0, 0, 0, .5);\nbox-shadow: 0 1px 2px rgba(0, 0, 0, .15);\nborder-radius: 2px;\nmargin: 1px auto;\nwidth: 500px;\nmax-width: 100%;\nposition: relative;\ntransition: all .25s ease-in-out;\n}\n.notification.error {\nbackground-color: hsla(0, 100%, 38%, .9);\n}\n.notification.warning {\nbackground-color: hsla(36, 100%, 38%, .9);\n}\n.notification.info {\nbackground-color: hsla(200, 100%, 38%, .9);\n}\n.notification.success {\nbackground-color: hsla(104, 100%, 38%, .9);\n}\n.notification a {\ncolor: white;\n}\n.notification > .close {\npadding: 6px;\ntop: 0;\nright: 0;\nposition: absolute;\n}\n.message {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\npadding: 6px 20px;\nmax-height: 200px;\nwidth: 100%;\noverflow: auto;\n}\n\n/* Settings */\n#overlay {\nbackground-color: rgba(0, 0, 0, .5);\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-align-items: center;\nalign-items: center;\n-webkit-justify-content: center;\njustify-content: center;\nposition: fixed;\ntop: 0;\nleft: 0;\nheight: 100%;\nwidth: 100%;\n}\n#fourchanx-settings {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nbox-shadow: 0 0 15px rgba(0, 0, 0, .15);\nheight: 600px;\nmin-height: 0;\nmax-height: 100%;\nwidth: 900px;\nmin-width: 0;\nmax-width: 100%;\npadding: 3px;\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: column;\nflex-direction: column;\n}\n#fourchanx-settings > nav {\ndisplay: -webkit-flex;\ndisplay: flex;\npadding: 2px 2px 0;\n}\n#fourchanx-settings > nav a {\ntext-decoration: underline;\n}\n#fourchanx-settings > nav a.close {\ntext-decoration: none;\npadding: 2px;\n}\n.sections-list {\n-webkit-flex: 1;\nflex: 1;\n}\n.tab-selected {\nfont-weight: 700;\n}\n.section-container {\n-webkit-flex: 1;\nflex: 1;\nposition: relative;\n}\n.section-container > section {\nposition: absolute;\ntop: 0;\nright: 0;\nbottom: 0;\nleft: 0;\noverflow: auto;\n}\n.section-sauce ul,\n.section-rice ul {\nlist-style: none;\nmargin: 0;\npadding: 8px;\n}\n.section-sauce li,\n.section-rice li {\npadding-left: 4px;\n}\n.section-main label {\ntext-decoration: underline;\n}\n.section-filter ul {\npadding: 0;\n}\n.section-filter li {\nmargin: 10px 40px;\n}\n.section-filter textarea {\nheight: 500px;\n}\n.section-sauce textarea {\nheight: 350px;\n}\n.section-rice .field[name=\"boardnav\"] {\nwidth: 100%;\n}\n.section-rice textarea {\nheight: 150px;\n}\n#fourchanx-settings fieldset {\nborder: 1px solid;\nborder-radius: 3px;\n}\n#fourchanx-settings legend {\nfont-weight: 700;\n}\n#fourchanx-settings textarea {\nfont-family: monospace;\nmin-width: 100%;\nmax-width: 100%;\n}\n#fourchanx-settings code {\ncolor: #000;\nbackground-color: #FFF;\npadding: 0 2px;\n}\n.unscroll {\noverflow: hidden;\n}\n\n/* Unread */\n#unread-line {\nmargin: 0;\n}\n\n/* Thread Updater */\n#updater:not(:hover) {\nbackground: none;\nborder: none;\nbox-shadow: none;\n}\n#updater > .move {\npadding: 0 3px;\n}\n#updater > div:last-child {\ntext-align: center;\n}\n#updater input[type=number] {\nwidth: 4em;\n}\n#updater:not(:hover) > div:not(.move) {\ndisplay: none;\n}\n#updater input[type=\"button\"] {\nwidth: 100%;\n}\n.new {\ncolor: limegreen;\n}\n\n/* Thread Watcher */\n#watcher {\npadding-bottom: 3px;\nposition: absolute;\noverflow: hidden;\nwhite-space: nowrap;\n}\n#watcher:not(:hover) {\nmax-height: 220px;\n}\n#watcher > .move {\npadding-top: 3px;\n}\n#watcher > div {\nmax-width: 200px;\noverflow: hidden;\npadding-left: 3px;\npadding-right: 3px;\ntext-overflow: ellipsis;\n}\n#watcher a {\ntext-decoration: none;\n}\n\n/* Thread Stats */\n#thread-stats {\nbackground: none;\nborder: none;\nbox-shadow: none;\n}\n\n/* Quote */\n.deadlink {\ntext-decoration: none !important;\n}\n.backlink.deadlink:not(.forwardlink), .quotelink.deadlink:not(.forwardlink) {\ntext-decoration: underline !important;\n}\n.inlined {\nopacity: .5;\n}\n#qp input, .forwarded {\ndisplay: none;\n}\n.quotelink.forwardlink,\n.backlink.forwardlink {\ntext-decoration: none;\nborder-bottom: 1px dashed;\n}\n.filtered {\ntext-decoration: underline line-through;\n}\n.inline {\nborder: 1px solid;\ndisplay: table;\nmargin: 2px 0;\n}\n.inline .post {\nborder: 0 !important;\nbackground-color: transparent !important;\ndisplay: table !important;\nmargin: 0 !important;\npadding: 1px 2px !important;\n}\n#qp > .opContainer::after {\ncontent: '';\nclear: both;\ndisplay: table;\n}\n#qp .post {\nborder: none;\nmargin: 0;\npadding: 2px 2px 5px;\n}\n#qp img {\nmax-height: 300px;\nmax-width: 500px;\n}\n.qphl {\noutline: 2px solid rgba(216, 94, 49, .7);\n}\n\n/* File */\n.fileText:hover .fntrunc,\n.fileText:not(:hover) .fnfull,\n.expanded-image > .post > .file > .fileThumb > img[data-md5],\n:not(.expanded-image) > .post > .file > .fileThumb > .full-image {\ndisplay: none;\n}\n.expanding {\nopacity: .5;\n}\n.expanded-image {\nclear: both;\n}\n.expanded-image > .op > .file::after {\ncontent: '';\nclear: both;\ndisplay: table;\n}\n:root.fit-width .full-image {\nmax-width: 100%;\n}\n:root.gecko.fit-width .full-image,\n:root.presto.fit-width .full-image {\nwidth: 100%;\n}\n#ihover {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nmax-height: 100%;\nmax-width: 75%;\npadding-bottom: 16px;\n}\n\n/* Index/Reply Navigation */\n#navlinks {\nfont-size: 16px;\ntop: 25px;\nright: 10px;\n}\n\n/* Filter */\n.opContainer.filter-highlight {\nbox-shadow: inset 5px 0 rgba(255, 0, 0, .5);\n}\n.filter-highlight > .reply {\nbox-shadow: -5px 0 rgba(255, 0, 0, .5);\n}\n\n/* Thread & Reply Hiding */\n.hide-thread-button,\n.hide-reply-button {\nfloat: left;\nmargin-right: 2px;\n}\n.stub ~ .sideArrows,\n.stub ~ .hide-reply-button,\n.stub ~ .post {\ndisplay: none !important;\n}\n.stub input {\ndisplay: inline-block;\n}\n\n/* QR */\n:root.hide-original-post-form #postForm,\n:root.hide-original-post-form .postingMode,\n:root.hide-original-post-form #togglePostForm,\n#qr.autohide:not(:hover) > form {\ndisplay: none;\n}\n#qr select, #dump-button, .remove, .captcha-img {\ncursor: pointer;\n}\n#qr > div {\nmin-width: 300px;\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-align-items: center;\nalign-items: center;\n}\n#qr .move {\n-webkit-align-self: stretch;\nalign-self: stretch;\n-webkit-flex: 1;\nflex: 1;\n}\n#qr select {\nmargin: 0;\n-webkit-appearance: none;\n-moz-appearance: none;\nappearance: none;\nborder: none;\nbackground: none;\n}\n.presto #qr select {\nheight: 1em;\n}\n#qr .close {\npadding: 0 3px;\n}\n#qr > form {\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: column;\nflex-direction: column;\n}\n.persona {\ndisplay: -webkit-flex;\ndisplay: flex;\n}\n.persona .field {\n-webkit-flex: 1;\nflex: 1;\n}\n.persona .field:hover,\n.persona .field:focus {\n-webkit-flex: 3;\nflex: 3;\n}\n#dump-button {\nbackground: linear-gradient(#EEE, #CCC);\nborder: 1px solid #CCC;\nmargin: 0;\npadding: 2px 4px 3px;\noutline: none;\nwidth: 30px;\n}\n#dump-button:hover, #dump-button:focus {\nbackground: linear-gradient(#FFF, #DDD);\n}\n#dump-button:active, .dump #dump-button:not(:hover):not(:focus) {\nbackground: linear-gradient(#CCC, #DDD);\n}\n.gecko #dump-button {\npadding: 0;\n}\n#qr:not(.dump) #dump-list-container {\ndisplay: none;\n}\n#dump-list-container {\nheight: 100px;\nposition: relative;\n-webkit-user-select: none;\n-moz-user-select: none;\n-o-user-select: none;\nuser-select: none;\n}\n#dump-list {\ncounter-reset: qrpreviews;\ntop: 0; right: 0; bottom: 0; left: 0;\noverflow: hidden;\nposition: absolute;\nwhite-space: nowrap;\n}\n#dump-list:hover {\nbottom: -12px;\noverflow-x: auto;\nz-index: 1;\n}\n#dump-list::-webkit-scrollbar {\nheight: 12px;\n}\n#dump-list::-webkit-scrollbar-thumb {\nborder: 1px solid;\n}\n.qr-preview {\nbackground-position: 50% 20%;\nbackground-size: cover;\nborder: 1px solid #808080;\ncolor: #FFF !important;\nfont-size: 12px;\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\ncursor: move;\ndisplay: inline-block;\nheight: 92px; width: 92px;\nmargin: 4px; padding: 2px;\nopacity: .6;\noutline: none;\noverflow: hidden;\nposition: relative;\ntext-shadow: 0 1px 1px #000;\ntransition: opacity .25s ease-in-out;\nvertical-align: top;\nwhite-space: pre;\n}\n.qr-preview:hover, .qr-preview:focus {\nopacity: .9;\ncolor: #FFF !important;\n}\n.qr-preview#selected {\nopacity: 1;\n}\n.qr-preview::before {\ncounter-increment: qrpreviews;\ncontent: counter(qrpreviews);\nfont-weight: 700;\ntext-shadow: 0 0 3px #000, 0 0 5px #000;\nposition: absolute;\ntop: 3px; right: 3px;\n}\n.qr-preview.drag {\nborder-color: red;\nborder-style: dashed;\n}\n.qr-preview.over {\nborder-color: #FFF;\nborder-style: dashed;\n}\n.remove {\ncolor: #E00 !important;\nfont-weight: 700;\npadding: 3px;\n}\n.remove:hover::after {\ncontent: ' Remove';\n}\n.qr-preview > label {\nbackground: rgba(0, 0, 0, .5);\nright: 0; bottom: 0; left: 0;\nposition: absolute;\ntext-align: center;\n}\n.qr-preview > label > input {\nmargin: 1px 0;\nvertical-align: bottom;\n}\n#add-post {\ndisplay: inline-block;\nfont-size: 30px;\nheight: 30px;\nwidth: 30px;\nline-height: 1;\ntext-align: center;\nposition: absolute;\nright: 0; bottom: 0;\nz-index: 1;\n}\n#qr textarea {\nmin-height: 160px;\nmin-width: 100%;\ndisplay: block;\n}\n#qr.has-captcha textarea {\nmin-height: 120px;\n}\n.textarea {\nposition: relative;\n}\n#char-count {\ncolor: #000;\nbackground: hsla(0, 0%, 100%, .5);\nfont-size: 8pt;\nposition: absolute;\nbottom: 1px;\nright: 1px;\npointer-events: none;\n}\n#char-count.warning {\ncolor: red;\n}\n.captcha-img {\nbackground: #FFF;\noutline: 1px solid #CCC;\noutline-offset: -1px;\n}\n.captcha-img > img {\ndisplay: block;\nheight: 57px;\nwidth: 300px;\n}\n#file-n-submit > input {\nmargin: 0;\n}\n#file-n-submit.has-file #qr-no-file {\nvisibility: hidden;\n}\n#file-n-submit:not(.has-file) #qr-filename,\n#file-n-submit:not(.has-file) #qr-file-spoiler,\n#file-n-submit:not(.has-file) #qr-filerm {\ndisplay: none;\n}\n#file-n-submit {\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: row;\nflex-direction: row;\n-webkit-align-items: center;\nalign-items: center;\n}\n#qr-no-file, #qr-filename-container {\n-webkit-flex: 1;\nflex: 1;\n}\n#qr-filename-container {\ncursor: default;\nposition: relative;\nmargin-left: 2px;\n}\n#qr-filename {\nposition: absolute;\ntop: 0; right: 0; bottom: 0; left: 0;\ntext-overflow: ellipsis;\noverflow: hidden;\nwhite-space: nowrap;\n}\n#qr-filerm {\npadding: 0 2px;\n}\n#file-n-submit > #qr-file-spoiler {\nmargin: 0 2px;\n}\n#file-n-submit input[type='submit'] {\nmin-width: 40px;\n-webkit-order: 1;\norder: 1;\n}\n#qr input[type='file'] {\nposition: absolute;\nvisibility: hidden;\n}\n\n/* Menu */\n.menu-button {\ndisplay: inline-block;\nposition: relative;\n}\n.menu-button i {\nborder-top:   6px solid;\nborder-right: 4px solid transparent;\nborder-left:  4px solid transparent;\ndisplay: inline-block;\nmargin: 2px;\nvertical-align: middle;\n}\n#menu {\nborder-bottom: 0;\ndisplay: -webkit-flex;\ndisplay: flex;\nmargin: 2px 0;\n-webkit-flex-direction: column;\nflex-direction: column;\nposition: absolute;\noutline: none;\n}\n.entry {\ncursor: pointer;\noutline: none;\npadding: 3px 7px;\nposition: relative;\ntext-decoration: none;\nwhite-space: nowrap;\n}\n.entry.has-submenu {\npadding-right: 20px;\n}\n.has-submenu::after {\ncontent: '';\nborder-left:   6px solid;\nborder-top:    4px solid transparent;\nborder-bottom: 4px solid transparent;\ndisplay: inline-block;\nmargin: 4px;\nposition: absolute;\nright: 3px;\n}\n.has-submenu:not(.focused) > .submenu {\ndisplay: none;\n}\n.submenu {\nborder-bottom: 0;\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: column;\nflex-direction: column;\nposition: absolute;\nmargin: -1px 0;\n}\n.entry input {\nmargin: 0;\n}\n\n/* General */\n:root.yotsuba .dialog {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.yotsuba .field:focus {\nborder-color: #EA8;\n}\n\n/* Header */\n:root.yotsuba #header-bar {\nfont-size: 9pt;\ncolor: #B86;\n}\n:root.yotsuba #header-bar a {\ncolor: #800000;\n}\n\n/* Settings */\n:root.yotsuba #fourchanx-settings fieldset {\nborder-color: #D9BFB7;\n}\n\n/* Quote */\n:root.yotsuba .backlink.deadlink {\ncolor: #00E !important;\n}\n:root.yotsuba .inline {\nborder-color: #D9BFB7;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.yotsuba #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.yotsuba .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.yotsuba #menu {\ncolor: #800000;\n}\n:root.yotsuba .entry {\nborder-bottom: 1px solid #D9BFB7;\nfont-size: 10pt;\n}\n:root.yotsuba .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.yotsuba-b .dialog {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.yotsuba-b .field:focus {\nborder-color: #98E;\n}\n\n/* Header */\n:root.yotsuba-b #header-bar {\nfont-size: 9pt;\ncolor: #89A;\n}\n:root.yotsuba-b #header-bar a {\ncolor: #34345C;\n}\n\n/* Settings */\n:root.yotsuba-b #fourchanx-settings fieldset {\nborder-color: #B7C5D9;\n}\n\n/* Quote */\n:root.yotsuba-b .backlink.deadlink {\ncolor: #34345C !important;\n}\n:root.yotsuba-b .inline {\nborder-color: #B7C5D9;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.yotsuba-b #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.yotsuba-b .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.yotsuba-b #menu {\ncolor: #000;\n}\n:root.yotsuba-b .entry {\nborder-bottom: 1px solid #B7C5D9;\nfont-size: 10pt;\n}\n:root.yotsuba-b .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.futaba .dialog {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.futaba .field:focus {\nborder-color: #EA8;\n}\n\n/* Header */\n:root.futaba #header-bar {\nfont-size: 11pt;\ncolor: #B86;\n}\n:root.futaba #header-bar a {\ncolor: #800000;\n}\n\n/* Settings */\n:root.futaba #fourchanx-settings fieldset {\nborder-color: #D9BFB7;\n}\n\n/* Quote */\n:root.futaba .backlink.deadlink {\ncolor: #00E !important;\n}\n:root.futaba .inline {\nborder-color: #D9BFB7;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.futaba #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.futaba .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.futaba #menu {\ncolor: #800000;\n}\n:root.futaba .entry {\nborder-bottom: 1px solid #D9BFB7;\nfont-size: 12pt;\n}\n:root.futaba .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.burichan .dialog {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.burichan .field:focus {\nborder-color: #98E;\n}\n\n/* Header */\n:root.burichan #header-bar {\nfont-size: 11pt;\ncolor: #89A;\n}\n:root.burichan #header-bar a {\ncolor: #34345C;\n}\n\n/* Settings */\n:root.burichan #fourchanx-settings fieldset {\nborder-color: #B7C5D9;\n}\n\n/* Quote */\n:root.burichan .backlink.deadlink {\ncolor: #34345C !important;\n}\n:root.burichan .inline {\nborder-color: #B7C5D9;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.burichan #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.burichan .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.burichan #menu {\ncolor: #000000;\n}\n:root.burichan .entry {\nborder-bottom: 1px solid #B7C5D9;\nfont-size: 12pt;\n}\n:root.burichan .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.tomorrow .dialog {\nbackground-color: #282A2E;\nborder-color: #111;\n}\n:root.tomorrow .field:focus {\nborder-color: #000;\n}\n\n/* Header */\n:root.tomorrow #header-bar {\nfont-size: 9pt;\ncolor: #C5C8C6;\n}\n:root.tomorrow #header-bar a {\ncolor: #81A2BE;\n}\n\n/* Settings */\n:root.tomorrow #fourchanx-settings fieldset {\nborder-color: #111;\n}\n\n/* Quote */\n:root.tomorrow .backlink.deadlink {\ncolor: #81A2BE !important;\n}\n:root.tomorrow .inline {\nborder-color: #111;\nbackground-color: rgba(0, 0, 0, .14);\n}\n\n/* QR */\n.tomorrow #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #282A2E;\nborder-color: #111;\n}\n:root.tomorrow #qr select {\ncolor: #C5C8C6;\n}\n:root.tomorrow #qr option {\ncolor: #000;\n}\n:root.tomorrow .qr-preview {\nbackground-color: rgba(255, 255, 255, .15);\n}\n\n/* Menu */\n:root.tomorrow #menu {\ncolor: #C5C8C6;\n}\n:root.tomorrow .entry {\nborder-bottom: 1px solid #111;\nfont-size: 10pt;\n}\n:root.tomorrow .focused.entry {\nbackground: rgba(0, 0, 0, .33);\n}\n\n/* General */\n:root.photon .dialog {\nbackground-color: #DDD;\nborder-color: #CCC;\n}\n:root.photon .field:focus {\nborder-color: #EA8;\n}\n\n/* Header */\n:root.photon #header-bar {\nfont-size: 9pt;\ncolor: #333;\n}\n:root.photon #header-bar a {\ncolor: #FF6600;\n}\n\n/* Settings */\n:root.photon #fourchanx-settings fieldset {\nborder-color: #CCC;\n}\n\n/* Quote */\n:root.photon .backlink.deadlink {\ncolor: #F60 !important;\n}\n:root.photon .inline {\nborder-color: #CCC;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.photon #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #DDD;\nborder-color: #CCC;\n}\n:root.photon .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.photon #menu {\ncolor: #333;\n}\n:root.photon .entry {\nborder-bottom: 1px solid #CCC;\nfont-size: 10pt;\n}\n:root.photon .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n"
  };

  Main.init();

}).call(this);