/**
 * Created by isak16 on 2016-09-22.
 */
$( "#videoPlayer" ).draggable({
    handle: "#videoPlayerHeader",
    start: function(event, ui) {
        $('iframe').css('pointer-events','none');

    },
    stop: function(evt, el) {
        $('iframe').css('pointer-events','auto');

        // Save size and position in cookie
        /*
         $.cookie($(evt.target).attr("id"), JSON.stringify({
         "el": $(evt.target).attr("id"),
         "left": el.position.left,
         "top": el.position.top,
         "width": $(evt.target).width(),
         "height": $(evt.target).height()
         }));
         */
    }
}).resizable({
    handles: "e, w, s, se, n",
 //   aspectRatio: 15.8 / 14,
    minHeight: 120,
   minWidth: 152,
    start: function(event, ui) {
        $('iframe').css('pointer-events','none');

    },
    stop: function(evt, el) {
        $('iframe').css('pointer-events','auto');
        $('#upcoming-videos').css('pointer-events','auto');

        // Save size and position in cookie
        /*
         $.cookie($(evt.target).attr("id"), JSON.stringify({
         "el": $(evt.target).attr("id"),
         "left": el.position.left,
         "top": el.position.top,
         "width": el.size.width,
         "height": el.size.height
         }));
         */
    }
});

