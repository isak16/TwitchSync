//Mongodb Setup
var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var mongoUrl = 'mongodb://127.0.0.1:27017/rooms';
//Youtube Api key
var ytKey = 'AIzaSyBDakqGHaqA-_Yv7y9CuW2hwttmWfhYwAU';
var db = MongoClient.connect(mongoUrl, function(err, db) {
    if(err){
        console.log("mongoerror", err);
        throw err;
    }
    console.log("database connected");

});



var http = require('http'),
    fs = require('fs');

// Send index.html to all requests
var app = http.createServer(function(req, res) {

});

var io = require('socket.io').listen(app);

//Functions and callbacks
var getCurrentVideo = function(room, callback) {
    var db = MongoClient.connect(mongoUrl, function(err, db) {
        if(err){
            console.log("mongoerror", err);
            throw err;
        }
        var collection = db.collection(room);

        collection.find({"active": true, "played": false}).sort({$natural:-1}).limit(1).toArray(function(err, results){
            if(err) console.log(err);
            if (results === undefined || results.length == 0) {
                console.log("response empty");
                callback(setNextVideoActive(room));

            }else{
                var videoTime = (results[0].timeStarted + results[0].pt) - Math.floor(Date.now() / 1000); //Minus start?
                console.log(videoTime);
                if(videoTime > 0){
                    //we have an active video for this room
                    callback(results, videoTime);
                }else{
                    //we don't have a an active video for this room
                    callback(setNextVideoActive(room, videoTime));
                }
            }

        });


    });
};

var getVideosRoom = function(room, callback) {

    var db = MongoClient.connect(mongoUrl, function(err, db) {
        if(err){
            console.log("mongoerror", err);
            throw err;
        }
        var collection = db.collection(room);

        collection.find({"active": false}).toArray(function(err, results){
            if(err) console.log(err);
            callback(results);
        });


    });
};

function addVideoToRoom(room, video) {
    var cleanUrl = ytVidId(video.url);
    if(!cleanUrl){
        return;
    }

    request('https://www.googleapis.com/youtube/v3/videos?id='+cleanUrl+'&key='+ytKey+'&part=snippet,contentDetails,status', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonObject = JSON.parse(body);

            //Om det inte går att embedda, skippa
            if(!jsonObject.items[0].status.embeddable){
                return;
            }


            var db = MongoClient.connect(mongoUrl, function(err, db) {
                if(err){
                    console.log("mongoerror", err);
                }

                //Förebereder för post i databasen
                var videoJson = {
                    "title" : jsonObject.items[0].snippet.title,
                    "url": cleanUrl,
                    "poster" : video.poster,
                    "pt": convert_time(jsonObject.items[0].contentDetails.duration),
                    "played": false,
                    "rating": 0,
                    "start": ytStart(video.url),
                    "active": false,
                    "timestamp": Math.floor(Date.now() / 1000),
                    "timeStarted": 0
                };

                var collection = db.collection(room);

                collection.insertOne(videoJson, function(err, result){
                    if(err){ console.log(err)
                    }else{
                        console.log("added video to " + room);
                    }
                });

            });


        }
    });
}




var setNextVideoActive = function(room) {
    var db = MongoClient.connect(mongoUrl, function(err, db) {
        if(err){
            console.log("mongoerror", err);
            throw err;
        }
        var collection = db.collection(room);


        collection.findAndModify(
            {active: false}, // query
            [['timestamp','asc']],
            {$set: {active: true, timeStarted: Math.floor(Date.now() / 1000)}},
            {}, // options
            function(err, object) {
                if (err){
                    console.log(err.message);  // returns error if no matching object found
                    return false;
                }else{
                    if(object.lastErrorObject.updatedExisting){
                        changeVideo(room, object.value);
                        setTimeout(function(){
                            setNextVideoActive(room);
                        }, object.value.pt*1000);
                        console.log("byter");
                        return(object.value);
                    }else{
                        console.log("No video to skip to");
                        return false;
                    }
                }
            });

    });
};


// Emit welcome message on connection
io.on('connection', function(socket) {
    socket.on('room', function(room) {
        socket.join(room);
        // get current video + time for this room
        getCurrentVideo (room, function(currentVideo) {
            emitToUser(currentVideo, socket, room);
        });


    });

    socket.on('getVideosRoom', function(room) {
        getVideosRoom (room, function(response) {
            emitRoomsVideosToUser(response, socket, room);
        });
    });



    var emitRoomsVideosToUser = function(response, socket) {
        socket.emit('roomVideos', response);
    };

    var emitToUser = function(currentVideo, socket) {
        socket.emit('currentVideo', currentVideo);
    };


    socket.on('addVideo', function(room, video) {
        addVideoToRoom(room, video);
    });




});
//setTimeout(setNextVideoActive("sodaPop"), 3000);

//Change video in room
function changeVideo(room, video){
    io.sockets.in(room).emit('changeVideo', video);
}

app.listen(3000);

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration
}

function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}
// Skalar av tidpunkten på youtbe urlen
function ytStart(url) {
/*    var youtubeString = url;
    var myRegexp      = /youtube.com\S+#t=((\d+m)?(\d+[s]?)?)/g;
    var match = myRegexp.exec(youtubeString);
    var toSeconds = convert_time(match[1]);
*/
    return(0);
}