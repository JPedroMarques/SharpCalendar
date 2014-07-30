/*jslint browser: true*/
/*global $, jQuery, alert, console*/
$(function () {
    $('#main, #projects .wrapper').height($(window).height());
    $(window).on('resize', function() {
        $('#main, #projects .wrapper').height($(window).height());
    });
});