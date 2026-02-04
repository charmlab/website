$(document).ready(function() {

  // Variables
  var $codeSnippets = $('.code-example-body'),
      $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      }

  function init() {
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $('a[href*="#"]').on('click', smoothScroll)
    buildSnippets();
    initMemberReveal();
    initPublicationsTabs();
    initScrollReveal();
    initSparkleEasterEgg();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash;
    if (!target || target.length === 0) {
      return;
    }
    if (this.pathname && this.pathname !== window.location.pathname) {
      return;
    }
    $target = $(target);
    if ($target.length === 0) {
      return;
    }
    var navHeight = $nav.length ? $nav.outerHeight() : 0;
    var extraOffset = 12;
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top - navHeight - extraOffset
    }, 420, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
});

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }

  function initPublicationsTabs() {
    var $tabNavs = $('.tab-nav');
    if ($tabNavs.length === 0) {
      return;
    }

    $tabNavs.each(function() {
      var $nav = $(this);
      var $buttons = $nav.find('.button');
      if ($buttons.length === 0) {
        return;
      }

      var isRevealed = false;

      function animatePane($btn) {
        var ref = $btn.data('ref');
        if (!ref) {
          return;
        }
        var $pane = $(ref);
        if ($pane.length === 0) {
          return;
        }
        var $container = $pane.closest('.tab-content');
        $container.find('.tab-pane').removeClass('is-visible');
        setTimeout(function() {
          $pane.addClass('is-visible');
        }, 10);
      }

      function syncActive() {
        var $active = $nav.find('.button.active').first();
        if ($active.length === 0) {
          $active = $buttons.first();
        }
        animatePane($active);
      }

      $buttons.on('click', function() {
        var $btn = $(this);
        setTimeout(function() {
          animatePane($btn);
        }, 0);
      });

      $window.on('resize', function() {
        return;
      });

      var $section = $nav.closest('.publications-section');
      if ($section.length === 0) {
        setTimeout(syncActive, 0);
        return;
      }

      if (!('IntersectionObserver' in window)) {
        setTimeout(syncActive, 0);
        return;
      }

      var sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !isRevealed) {
            isRevealed = true;
            syncActive();
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.15
      });

      sectionObserver.observe($section.get(0));
    });
  }

  function initMemberReveal() {
    var $memberGroups = $('.members-animate');
    if ($memberGroups.length === 0) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      $memberGroups.addClass('is-visible');
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.15
    });

    $memberGroups.each(function() {
      observer.observe(this);
    });
  }

  function initScrollReveal() {
    var $sections = $('.scroll-reveal');
    if ($sections.length === 0) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      $sections.addClass('is-visible');
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.15
    });

    $sections.each(function() {
      observer.observe(this);
    });
  }

  var burstGlyphs = ['✨', '✦', '✧', '⚡', '🤖', '🧠', '📈', '🧮', '∑', 'π', '∫', '∆', 'Ω', 'λ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  function initSparkleEasterEgg() {
    var $triggers = $('#group h4.sparkle-trigger');
    if ($triggers.length === 0) {
      return;
    }

    $triggers.on('click', function(e) {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      spawnSparkleBurst(e.clientX, e.clientY, 14, 0.8, 0.6);
    });

    $triggers.on('mouseenter', function(e) {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      spawnSparkleBurst(e.clientX, e.clientY, 2, 0.2, 0.15);
    });
  }

  function spawnSparkleBurst(x, y, count, spreadX, spreadY) {
    var $burst = $('<span class="sparkle-burst"></span>');
    for (var i = 0; i < count; i++) {
      var glyph = burstGlyphs[Math.floor(Math.random() * burstGlyphs.length)];
      var $spark = $('<span></span>').text(glyph);
      var dx = (Math.random() - 0.5) * window.innerWidth * spreadX;
      var dy = (Math.random() - 0.5) * window.innerHeight * spreadY;
      var x2 = (Math.random() - 0.5) * 60;
      var y2 = (Math.random() - 0.5) * 60;
      var size = 10 + Math.random() * 16;
      $spark[0].style.setProperty('--sparkle-x', dx + 'px');
      $spark[0].style.setProperty('--sparkle-y', dy + 'px');
      $spark[0].style.setProperty('--sparkle-x2', x2 + 'px');
      $spark[0].style.setProperty('--sparkle-y2', y2 + 'px');
      $spark.css({ fontSize: size + 'px' });
      $burst.append($spark);
    }
    $('body').append($burst);
    $burst.css({ left: x + 'px', top: y + 'px' });
    setTimeout(function() {
      $burst.remove();
    }, 1900);
  }

  init();

});
