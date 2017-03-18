/**
 * Created by isak16 on 2016-09-24.
 */
$( document ).ready(function() {
    $("#nav-add-video").click(function() {
        $("#upcoming-videos").css('display', 'none');
        $("#favorite-videos").css('display', 'none');
        $("#add-video").css('display', 'block');
    });
    $("#nav-upcoming-videos").click(function() {
        $("#add-video").css('display', 'none');
        $("#favorite-videos").css('display', 'none');
        $("#upcoming-videos").css('display', 'block');
    });
    $("#nav-favorite-videos").click(function() {
        $("#add-video").css('display', 'none');
        $("#upcoming-videos").css('display', 'none');
        $("#favorite-videos").css('display', 'block');
    });
});



