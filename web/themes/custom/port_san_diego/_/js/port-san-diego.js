/* globals document, Drupal, history, jQuery, location, window */

/**
 * enableClickWithKeyboard(targetNode)
 *
 * Fires a click() event on target node when it's hit with a keyboard Enter key. Accessibility FTW!!!
 *
 * @param targetNode  (node)  The target DOM node to attach the events to.
 */
function enableClickWithKeyboard(targetNode) {
  'use strict';
  targetNode.addEventListener('keydown', function (event) {
    var key = event.keyCode;
    if (key === 13) { // 13 is enter
      targetNode.click();
    }
  });
}

/**
 * convertDegreeToRadian(degree)
 *
 * Converts a degree value to a radian (for use in trigonometry functions)
 *
 * @param degree (number) The value of a degree to turn to a radian
 * @return radian (number) The equivalent radian.
 */
function convertDegreeToRadian(degree) {
  'use strict';

  return degree * Math.PI / 180;
}

/**
 * calculateClipPathOffset(element)
 *
 * Calculates the top left and bottom right offset for elements that need the PoSD brand angle clip path. Based on element's height.
 *
 * @param element (DOMnode) The element for which to calculate the angle.
 * @return radian (clipPathOffset) The clip path offset left and right.
 */
function calculateClipPathOffset(element) {
  'use strict';

  return element.offsetHeight / Math.tan(convertDegreeToRadian(72)); // Brand angle = 72 degrees or 1.25664 radians
}

/**
 * applyBrandAngle()
 *
 * Applies the brand angle to elements with the 'data-brand-angle' attribute.
 */
function applyBrandAngle() {
  'use strict';

  var angledElements = [].slice.call(document.querySelectorAll('[data-brand-angle]'));

  if (angledElements) {
    angledElements.forEach(function (element) {
      var clipPathOffset = calculateClipPathOffset(element);
      var options = element.dataset.brandAngle;


      // If the options are not set, apply default clip & exit early.
      if (!options) {
        element.style.clipPath = 'polygon(' + clipPathOffset + 'px -1px, 100% -1px, 100% 100%, 0 100%)';
        element.style.webkitClipPath = 'polygon(' + clipPathOffset + 'px -1px, 100% -1px, 100% 100%, 0 100%)';

        return;
      }

      /** EXAMPLE CUSTOM DATA-BRAND-ANGLE ATTRIBUTE
       {
         "breakpoints":
         [
           { "minWidth": 0, "clipLeft": false, "clipRight": false },
           { "minWidth": 640, "clipLeft": true, "clipRight": false },
           { "minWidth": 1024, "clipLeft": true, "clipRight": true }
         ]
       }

       or as a data attribute...

       <div data-brand-angle="{&quot;breakpoints&quot;:[{ &quot;minWidth&quot;: 0, &quot;clipLeft&quot;: false, &quot;clipRight&quot;: false },{ &quot;minWidth&quot;: 640, &quot;clipLeft&quot;: true, &quot;clipRight&quot;: false },{ &quot;minWidth&quot;: 1024, &quot;clipLeft&quot;: true, &quot;clipRight&quot;: true }]}"></div>
       **/

      // Get options as JSON object, min width, and default offsets
      options = JSON.parse(options);

      // Get the breakpoints that are smaller than the screen size, and order them from greatest to least
      var validBreakpoints = options.breakpoints
        .filter(function (breakpoint) {
          return window.innerWidth >= parseInt(breakpoint.minWidth);
        })
        .sort(function (a, b) {
          return b.minWidth - a.minWidth;
        });

      // Get the current breakpoint options and set default values
      var currentBreakpoint = validBreakpoints[0];
      var topLeftOffset = '0';
      var bottomRightOffset = '100%';

      // Update clip path values
      if (currentBreakpoint.clipLeft) {
        topLeftOffset = clipPathOffset + 'px';
      }
      if (currentBreakpoint.clipRight) {
        bottomRightOffset = 'calc(100% - ' + clipPathOffset + 'px)';
      }

      // Apply the clip path
      element.style.clipPath = 'polygon(' + topLeftOffset + ' -1px, 100% -1px, ' + bottomRightOffset + ' 100%, 0 100%)';
      element.style.webkitClipPath = 'polygon(' + topLeftOffset + ' -1px, 100% -1px, ' + bottomRightOffset + ' 100%, 0 100%)';
    });
  }
}

var port = {};

(function ($) {
  'use strict';

  var $window = $(window);

  port = {
    init: function () {
      $(document).foundation();

      applyBrandAngle();
      $window.on('resize', Drupal.debounce(function () {
        applyBrandAngle();
      }));
      $(document).on('change.zf.tabs', function () {
        applyBrandAngle();
      });

      port.animatedAnchorLinks();
      port.headerNavToggle();
      //port.headroom();
      port.sidebar();
    },

    /**
     * Animated anchor links on click.
     */
    animatedAnchorLinks: function () {
      var anchorLinks = [].slice.call(document.querySelectorAll('a[href*="#"]:not([href="#"])')).filter(link => !link.classList.contains('collections__title'));

      if (anchorLinks) {
        var headerOffset = (!document.body.classList.contains('user-logged-in')) ? document.querySelector('header .header__primary').offsetHeight : 0;

        anchorLinks.forEach(function (link) {
          // Quit early if the anchor link goes to a different page
          if (location.hostname !== link.hostname || location.pathname.replace(/^\//, '') !== link.pathname.replace(/^\//, '')) {
            return;
          }

          link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default scroll

            var targetName = link.hash.slice(1); // Remove the hash mark
            var $target = $('[id="' + targetName + '"]');

            if ($target.length === 0) {
              $target = $('[name="' + targetName + '"]');
            }

            if ($target.length) {
              $('html, body').animate({
                // Animate the page scroll
                scrollTop: ($target.offset().top - headerOffset)
              }, 500, function () {
                // Update browser history
                history.pushState(null, null, '#' + targetName);
                // Add focus to element
                $target.trigger('focus');
              });
            }
          });
        });
      }
    },

    headerNavToggle: function () {
      var $body = $('body');
      var $header = $('.header');
      var mobileMenuToggle = document.querySelector('.header__nav-toggle');
      var $primaryMenuLinks = $('.header__primary .menu-level-0 > .menu-item > label[for^="parent-level-menu_link_content"]');
      var $primaryMenuLinksClose = $('.header__primary .menu-level-0 > .menu-item > label[for^="parent-level-off-menu_link_content"]');
      enableClickWithKeyboard(mobileMenuToggle);

      $primaryMenuLinks.each(function () {
        var $this = $(this);
        var $a = $(this).find('a');
        var $parent = $this.parents('.menu-item');
        // If the dropdown is empty, skip and keep it a link.
        if ($.trim($('.menu-dropdown', $parent).text()) !== '') {
          $a.replaceWith('<span>' + $a.text() + '</span>');

          $this.on('mouseenter', function () {
            if (window.innerWidth >= 1024) {
              $('.header__primary .menu-level-0 > .menu-item').removeClass('active');
              $parent.addClass('active');
              var $this = $(this);
              $this.click();
            }
          });
        }
        else {
          $this.on('mouseenter', function () {
            if (window.innerWidth >= 1024) {
              $('input[name="parent-level-menu-item"]').prop('checked', false);
              $('.header__primary .menu-level-0 > .menu-item').removeClass('active');
            }
          });
        }
      });

      $primaryMenuLinksClose.on('click', function () {
        $('.header__primary .menu-level-0 > .menu-item').removeClass('active');
      });

      $header.on('mouseleave', function () {
        $('input[name="parent-level-menu-item"]').prop('checked', false);
        $('.header__primary .menu-level-0 > .menu-item').removeClass('active');
      });

      mobileMenuToggle.addEventListener('click', function () {
        $body.toggleClass('menu-open');
      });
    },

    headroom: function () {
      var _intentLocked = false;
      var _locked = false;
      var _mouseLocked = false;
      var _scrollTop = 0;
      var _scrollTopLast = 0;
      var _trigger = 40;
      var $header = $('.header');

      function checkHeadroom () {
        _scrollTop = $window.scrollTop();

        // When scrolling.
        if (!_mouseLocked && !_intentLocked && !_locked && _scrollTop > _trigger) {
          _locked = true;
          $header.addClass('header-locked');
        }
        else if (!_mouseLocked && !_intentLocked && _locked && _scrollTop <= _trigger) {
          _locked = false;
          $header.removeClass('header-locked');
        }

        if (_scrollTop === 0 && !$header.hasClass('header-top')) {
          $header.addClass('header-top');
        }
        else if ($header.hasClass('header-top')) {
          $header.removeClass('header-top');
        }

        // Discover intent.
        // if (!_mouseLocked && !_intentLocked && _scrollTop < _scrollTopLast && _scrollTop > _trigger) {
        //   _intentLocked = true;
        //   $header.removeClass('header-locked');
        // }
        // else if (!_mouseLocked && _intentLocked && _scrollTop >= _scrollTopLast && _scrollTop > _trigger) {
        //   _intentLocked = false;
        //   $header.addClass('header-locked');
        // }

        _scrollTopLast = _scrollTop;
      }

      checkHeadroom();

      $window.on('scroll', function () {
        checkHeadroom();
      });

      $header.on('mouseenter', function () {
        _mouseLocked = true;
        //_intentLocked = true;
        _locked = false;
        $header.removeClass('header-locked');
      });

      $header.on('mouseleave', function () {
        _mouseLocked = false;
        checkHeadroom();
      });

      $('body').addClass('headroom-processed');
    },

    sidebar: function () {
      var $body = $('body');
      if (!$body.hasClass('user-logged-in')) {
        $('#sidebar').stickySidebar({
          topSpacing: $body.hasClass('headroom-processed') ? 100 : 0,
          minWidth: 1023
        });
      }
    }
  };

  $(function () {
    port.init();
  });
})(jQuery);
