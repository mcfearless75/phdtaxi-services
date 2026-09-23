// PHD Taxi Services - interactions
(function(){
  "use strict";

  // Nav solid-on-scroll
  var nav = document.querySelector('.nav');
  var onScroll = function(){
    if(!nav) return;
    if(window.scrollY > 40){ nav.classList.add('solid'); } else { nav.classList.remove('solid'); }
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    var setMenu = function(open, returnFocus){
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      if(open){
        var first = links.querySelector('a');
        if(first) first.focus();
      } else if(returnFocus){
        toggle.focus();
      }
    };

    toggle.addEventListener('click', function(){
      setMenu(!links.classList.contains('open'), true);
    });

    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setMenu(false, false); });
    });

    // Escape closes the panel and hands focus back to the button.
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')) setMenu(false, true);
    });

    // Keep Tab inside the open panel - otherwise focus walks into the page
    // behind it, which is invisible to a keyboard user.
    links.addEventListener('keydown', function(e){
      if(e.key !== 'Tab' || !links.classList.contains('open')) return;
      var items = [toggle].concat(Array.prototype.slice.call(links.querySelectorAll('a')));
      var first = items[0], last = items[items.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // Animated stat counters
  // The CSS media query kills transitions, but this counter is scripted motion
  // and has to opt out on its own.
  var noMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length && noMotion){
    counters.forEach(function(el){
      el.textContent = (el.getAttribute('data-prefix') || '') + el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  } else if(counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var dur = 1400, start = null;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target < 10 && target % 1 !== 0 ? (target * eased).toFixed(1) : Math.floor(target * eased);
          el.textContent = prefix + val + suffix;
          if(p < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, {threshold:.5});
    counters.forEach(function(el){ cio.observe(el); });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        var qq = i.querySelector('.faq-q');
        if(qq) qq.setAttribute('aria-expanded', 'false');
      });
      if(!wasOpen){
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Booking forms - compose a pre-filled WhatsApp message via a wa.me deep link.
  // #bookingForm is the full form on /contact/; .wa-form is the quick-quote form
  // on the homepage and every route and tour page (route pre-filled).
  var WA_NUMBER = '447494073111';
  var FIELDS = [
    ['name', 'Name'], ['pickup', 'Pickup'], ['dropoff', 'Drop-off'], ['tour', 'Tour'],
    ['when', 'Date/time'], ['passengers', 'Passengers'], ['luggage', 'Luggage'], ['notes', 'Notes']
  ];
  var wireForm = function(form){
    // The forms carry `novalidate`, which switches off the browser's own
    // enforcement of `required`. Without this check an empty submit still
    // fired and PHD received a WhatsApp with every field blank.
    var setError = function(field, show){
      var err = document.getElementById('err-' + field.id);
      if(err) err.hidden = !show;
      field.setAttribute('aria-invalid', show ? 'true' : 'false');
    };

    form.querySelectorAll('[required]').forEach(function(field){
      field.addEventListener('input', function(){
        if(field.value.trim()) setError(field, false);
      });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();

      var invalid = [];
      form.querySelectorAll('[required]').forEach(function(field){
        var empty = !field.value.trim();
        setError(field, empty);
        if(empty) invalid.push(field);
      });
      if(invalid.length){
        invalid[0].focus();   // land the user on the first thing to fix
        return;
      }

      var data = new FormData(form);
      var context = form.getAttribute('data-context');
      var lines = ['Hi Roger, booking enquiry from the PHD Taxi Services website' + (context ? ' (' + context + ')' : '') + ':'];
      FIELDS.forEach(function(f){
        var v = data.get(f[0]);
        if(v !== null && String(v).trim()) lines.push(f[1] + ': ' + String(v).trim());
      });
      window.location.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    });
  };
  var booking = document.getElementById('bookingForm');
  if(booking) wireForm(booking);
  document.querySelectorAll('form.wa-form').forEach(wireForm);

  // Current year in footer
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

})();
