/*jslint browser: true*/
/*global $, jQuery*/

(function (window, $) {
    'use strict';

    $(function () {
        var smoothScroll = $('.smooth-scroll');

        function smoothScrolling() {
            smoothScroll.click(function () {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, 1000);
                        return false;
                    }
                }
            });
        }

        // on all screens, do these
        smoothScrolling();
    });

})(window, jQuery);


