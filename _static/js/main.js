/*! Copyright (c) 2018 Siemens AG. Licensed under the MIT License. */

// Support deep linking of URLs with fragment identifier (#) to Bootstrap 4 tab component
$(function () {
    $('.nav.nav-tabs.nav-deep-linked a').click(function () {
        window.location.hash = this.hash;
    });
    $(window).on('hashchange', function () {
        var anchor = window.location.hash;
        var target;
        if (anchor) {
            target = $('.nav.nav-tabs.nav-deep-linked a[href="' + anchor + '"]');
        } else {
            target = $('.nav.nav-tabs.nav-deep-linked a.default');
        }
        if (target.length) {
            target.tab('show');
        }
    }).trigger('hashchange');
});

// Set the Active Navbar item with Bootstrap 4 and jQuery
$(function () {
    var activenav,
        matches = document.body.className.match(/(^|\s)page-(\w+)(\s|$)/); //
    if (matches) {
        activenav = matches[2];
        $('.navbar-nav .nav-item').each(function () {
            if ($(this).hasClass(activenav)) {
                $(this).addClass('active').append(" <span class='sr-only'>(current)></span>");
            }
        });
        $('.navbar-nav .dropdown-item').each(function () {
            if ($(this).hasClass(activenav)) {
                $(this).addClass('active')
                    .append(" <span class='sr-only'>(current)></span>");
            }
        });
    }
});

// Hide navbar collapse menu on click
$('.navbar-nav .nav-link').click(function () {
    $('.navbar-collapse').collapse('hide');
});

// Switch between two Coaty logos in homepage navbar depending on scroll position
$(function () {
    var currentScrollY = -1;
    if (!$(document.body).hasClass('page-home')) {
        $('.navbar-brand .logo-short').removeClass('d-inline-block').addClass('d-none');
        $('.navbar-brand .logo-long').removeClass('d-none').addClass('d-inline-block');
        return;
    }
    $(window).scroll(function (event) {
        var scrollY = $(window).scrollTop();
        if (currentScrollY <= 0 && scrollY > 0) {
            currentScrollY = scrollY;
            $('.navbar-brand .logo-short').removeClass('d-inline-block').addClass('d-none');
            $('.navbar-brand .logo-long').removeClass('d-none').addClass('d-inline-block');
        } else if (currentScrollY > 0 && scrollY === 0) {
            currentScrollY = scrollY;
            $('.navbar-brand .logo-short').removeClass('d-none').addClass('d-inline-block');
            $('.navbar-brand .logo-long').removeClass('d-inline-block').addClass('d-none');
        }
    });
});

// Swipe functions for Bootstrap Carousel - https://github.com/maaaaark/bcSwipe
!function (t) { t.fn.bcSwipe = function (e) { var n = { threshold: 50 }; return e && t.extend(n, e), this.each(function () { function e(t) { 1 == t.touches.length && (u = t.touches[0].pageX, c = !0, this.addEventListener("touchmove", o, !1)) } function o(e) { if (c) { var o = e.touches[0].pageX, i = u - o; Math.abs(i) >= n.threshold && (h(), t(this).carousel(i > 0 ? "next" : "prev")) } } function h() { this.removeEventListener("touchmove", o), u = null, c = !1 } var u, c = !1; "ontouchstart" in document.documentElement && this.addEventListener("touchstart", e, !1) }), this } }(jQuery);
$('.carousel').bcSwipe({ threshold: 50 });

// Show Xmas related items at Christmas time
$(document).ready(function () {
    var now = new Date();
    var month = now.getMonth();

    // Xmas time is between Dec 01 and Jan 10
    if (month === 11 || (month === 0 && now.getDate() <= 10)) {
        $('.coaty-xmas-item').removeClass('d-none');
    } else {
        $('.coaty-xmas-item').addClass('d-none');
    }
});
