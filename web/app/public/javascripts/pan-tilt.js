
var canvas = document.getElementById("canvas");

var touchMove = function(event) {
    var touchobj = event.targetTouches[0];
    var position = getPosition(touchobj, canvas);
    // push this to a stream
    updatePosition(position.x, position.y);
};

$canvas = $("#canvas");
$canvas.unbind();

var resizeCanvas = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        canvas.style.display = "block";
        canvas.style.position = "absolute";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
};
resizeCanvas();
window.onorientationchange = resizeCanvas;

canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();
}, false);

var mouseEventToPosition = function(event) {
    return {x: event.offsetX, y: event.offsetY};
};

var touchEventToPosition = function(canvas) {
    return function(event) {
        //console.log("got touch move: " + JSON.stringify(event));
        var touchobj = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
        var x, y;
        if (touchobj.pageX !== undefined && touchobj.pageY !== undefined) {
            x = touchobj.pageX;
            y = touchobj.pageY;
        } else {
            x = touchobj.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = touchobj.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
        }
        return { x: x - canvas.offsetLeft, y: y - canvas.offsetTop };
    };
};

var mousemoves = $('#canvas').asEventStream("mousemove").throttle(50);
var touchmoves = $('#canvas').asEventStream("touchmove").throttle(50);
var touchEventToPositionForCanvas = touchEventToPosition(canvas);

var positions = mousemoves.map(mouseEventToPosition).merge(touchmoves.map(touchEventToPositionForCanvas));

var updatePosition = function(x, y) {
    console.log("(" + x + "," + y + ")");
    event = event || window.event;
    canvas = $("#canvas")[0];
    pan = x / canvas.width * 100;
    tilt = 100 - (y / canvas.height * 100);

    $.ajax({
        type: "POST",
        url: '/position',
        dataType: 'json',
        async: true,
        data: {pan: pan, tilt: tilt}
    });
};

positions.onValue(function(position) {
    updatePosition(position.x, position.y);
});



