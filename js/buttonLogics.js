/**
 * Created by isak16 on 2016-10-29.
 */

$( "#submitVideo" ).click(function() {
    var inputUrl = $('#video-input-url').val();
    var inputComment = $('#video-input-comment').val();
    alert("url: "+inputUrl +"\n\n Comment: "+ inputComment);
});





//Expand/minimize button
var containerDiv = $('.full-video-div');
function expand(){
    $('#under-player').show();
    containerDiv.animate({
        "height": "-=186px"
    }, 350, function() {
        containerDiv.css("height","calc(100% - 216px)");
    });
}

function minimize(){
    containerDiv.animate({
        "height": "+=186px"
    }, 350, function() {
        $('#under-player').hide();
        containerDiv.css("height","calc(100% - 30px)");
    });
}

$('.minimize-button').click(function(){
    $(this).toggleClass('expand-button');
    return $(this).hasClass('expand-button') ? minimize(this) : expand(this);
});



//Fadeout votingBar when user is active/inactive
var timeOut;
player.on("userinactive", function() {
    timeOut = setTimeout(function(){
        $('.votes').fadeOut(800);
        $('.header-video-title').fadeOut(800);
        $('.header-video-poster').fadeOut(800);
    }, 3000);

});

player.on("useractive", function() {
    clearTimeout(timeOut);
    //this variable is from the mainjs
    clearTimeout(timeOutFromNextVideo);

    $('.votes').fadeIn(50);
    $('.header-video-title').fadeIn(50);
    $('.header-video-poster').fadeIn(50);
});