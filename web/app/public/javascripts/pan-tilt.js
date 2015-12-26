

var getPosition = function(event, canvas) {
  var x, y;
    if (event.pageX != undefined && event.pageY != undefined) {
        x = event.pageX;
        y = event.pageY;
    } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    }
    return { x: x - canvas.offsetLeft, y: y - canvas.offsetTop };
};

var updatePosition = function(x, y) {
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
var canvas = document.getElementById("canvas");

var touchMove = function(event) {
    var touchobj = event.targetTouches[0];
    var position = getPosition(touchobj, canvas);
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

canvas.addEventListener("touchstart", touchMove, false);
canvas.addEventListener("touchmove", touchMove, false);
canvas.addEventListener("touchend", touchMove, false);

canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();
}, false);


var mousedown = false;

$canvas.mousedown(function(event) {
    mousedown = true;
    $(this).addClass("mouseDown");
    updatePosition(event.offsetX, event.offsetY);
});

$canvas.mouseup( function(event) {
    mousedown = false;
    $(this).removeClass("mouseDown");
});


$canvas.mousemove(function(event) {
    if (mousedown) {
        updatePosition(event.offsetX, event.offsetY);
    }
});


