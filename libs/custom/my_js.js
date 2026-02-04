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
    $('a[href^="#"]').on('click', smoothScroll)
    buildSnippets();
    initMemberReveal();
    initPublicationsTabs();
    initScrollReveal();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
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

  init();

});
