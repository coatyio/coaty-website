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
