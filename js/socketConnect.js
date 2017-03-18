//Videoplaylist element
var playlistTable = $('#upcoming-videos');
//Videoplayer element
var player = videojs('videoPlayer');
//Title element
var videoHeaderTitle = $('.header-video-title');
//Title element
var videoHeaderPoster = $('.header-video-poster');
//Playlistjson
var randomplayListData = [
    {
        "title": "Christian Singles",
        "videoid": "jtQAovcXiS0",
        "length": 8,
        "poster": "isak16"
    },
    {
        "title": "The Plot Twist Killer",
        "videoid": "DJfUZ1cOfdI",
        "length": 8,
        "poster": "RabnixD"
    },
    {
        "title": "Another Success",
        "videoid": "Nuu8SMafQfI",
        "length": 8,
        "poster": "LmaoKid"
    }
];


videojs('videoPlayer').ready(function() {
//VideoPLayer is READY, dont use videojs api before ready is called, "socket connect" should be called here
   // player.play();
});


displayVideoPlaylist(randomplayListData);

player.on('ended', function() {
    setNextVideoInPlaylistTableActive();
});




/**
 *
 * @param array, the array of videos in the rooms playlist
 */
function displayVideoPlaylist(array){
    $(array).each(function(index, dataRow) {
        var tr = $(document.createElement('tr'));
        tr.append(
            //Empty "td" for css increment
            $(document.createElement('td')),
            //Create empty td and fill it with hreflink to video
            $(document.createElement('td')).append($(document.createElement('a')).text(dataRow.title).attr("href", "http://www.youtube.com/watch?v="+dataRow.videoid).attr('target','_blank')),
            //Create td element with "poster name"
            $(document.createElement('td')).text(dataRow.poster)
        );
        playlistTable.find("tbody").append(tr);
    });
}


/**
 * Sets the next video to current video and removes the element from the table
 * The next video is retrived from the playlist table
 */
function setNextVideoInPlaylistTableActive(){
    var amountOfVideosInPlaylist = playlistTable.find("tbody").find("tr").length;
    if (amountOfVideosInPlaylist == 0) return;

    var nextVideoElement = playlistTable.find("tbody").find("tr").first();

    //Scopes out the info we want
    var nextVideoHref = nextVideoElement.find("[href]")[0].href;
    var nextVideoTitle = nextVideoElement.find("a")[0].innerText;
    var nextVideoPoster = nextVideoElement.find("td")[2].innerText;

    //Removes the element from the playlist table
    nextVideoElement.fadeOut(300, function(){ nextVideoElement.remove(); });

    //start next video
    startThisVideo(nextVideoHref, 0);
    changeVideoHeaderText(nextVideoTitle, nextVideoPoster);
    fadeInAndOutVideoHeader();
}


/**
 * @param url Url to video
 * @param startTime, on which second the video should start on. Normally at "0"
 */
function startThisVideo(url, startTime){
    player.src({ type: 'video/youtube', src: url});
    player.currentTime(startTime);
    player.play();
}

/**
 *
 * @param title
 * @param poster
 * @param comment
 */
function changeVideoHeaderText(title, poster, comment){
    videoHeaderTitle.text(title);
    videoHeaderPoster.text(poster);
}

/**
 * This is so that the videos title and poster will be shown for a brief moment when a new video has started
 */
//This timeoutvar is cleared in "buttonLogics.js
var timeOutFromNextVideo;
function fadeInAndOutVideoHeader(){
    $('.header-video-title').fadeIn(50);
    $('.header-video-poster').fadeIn(50);
    timeOutFromNextVideo = setTimeout(function(){
        $('.header-video-title').fadeOut(800);
        $('.header-video-poster').fadeOut(800);
    }, 3000);
}

